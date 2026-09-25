import type { Express } from "express";
import { z } from "zod";
import {
  upsertJoinSignup,
  confirmJoinSignup,
  claimBriefSend,
  releaseBriefClaim,
  getDueWeeklySubscribers,
  advanceWeekly,
  unsubscribeByToken,
} from "./joinSignups";
import { sendJoinConfirmationEmail, sendResendEmail, sendResendBatch } from "./emailService";
import { BRIEF_SUBJECT, renderBriefEmail, renderWeeklyEmail, unsubscribeUrl } from "./emailTemplates";
import { currentWeekly } from "./weeklyContent";
import { checkBeforeSend } from "./newsletterRouting";
import { isScheduledSendDate, utcDateString } from "./weeklySchedule";
import { addRecipients, archiveIssue, ensureIssueRecord, findIssueByContent, issueNumberFor } from "./weeklyArchive";

const joinSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  country: z.string().trim().min(1).max(120),
  association: z.string().trim().max(200).optional(),
});

function page(title: string, message: string, success: boolean, extra = ""): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NDIG Weekly</title>
<style>body{font-family:Georgia,'Times New Roman',serif;background:#f7f5ef;color:#12231a;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px;text-align:center}
.card{max-width:480px;padding:40px;background:#fff;border-radius:6px;border-top:4px solid ${success ? "#0b6b3a" : "#c9a227"}}
h1{font-size:1.3rem;margin:0 0 12px}a{color:#0b6b3a}button{background:#0b6b3a;color:#fff;border:0;padding:12px 26px;border-radius:3px;font-size:1rem;cursor:pointer}</style></head>
<body><div class="card"><h1>${title}</h1><p>${message}</p>${extra}<p><a href="https://www.ndigateway.org/join">Return to NDIG</a></p></div></body></html>`;
}

/**
 * NDIG Weekly signup (client/public/join/index.html) — plain REST, not tRPC,
 * since the landing page is a standalone static file that POSTs a simple JSON body.
 */
export function registerJoinRoutes(app: Express): void {
  app.post("/api/join", async (req, res) => {
    const parsed = joinSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Please enter your name and a valid email address." });
      return;
    }

    try {
      const row = await upsertJoinSignup({ ...parsed.data, source: "/join" });

      if (row.status === "pending") {
        const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol;
        const confirmUrl = `${proto}://${req.headers.host}/api/confirm?token=${row.confirmationToken}`;
        const sent = await sendJoinConfirmationEmail({ name: row.name, email: row.email, confirmUrl });
        if (!sent) {
          console.warn("[Join] Confirmation email not sent for", row.email);
        }
      }

      res.status(200).json({ success: true, message: "You're on the list." });
    } catch (error) {
      console.error("[Join Signup Error]", error);
      res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
    }
  });

  app.get("/api/confirm", async (req, res) => {
    const token = typeof req.query.token === "string" ? req.query.token : "";
    if (!token) {
      res.status(400).send(page("Confirmation issue", "Missing confirmation token.", false));
      return;
    }

    try {
      const row = await confirmJoinSignup(token);
      if (!row) {
        res.status(404).send(page("Confirmation issue", "This confirmation link is invalid or has expired.", false));
        return;
      }
      if (row.unsubscribedAt) {
        res.status(200).send(page("Subscription cancelled", "This subscription was cancelled. You can sign up again at any time from the NDIG page.", false));
        return;
      }

      const claimed = await claimBriefSend(token);
      if (!claimed) {
        res.status(200).send(page("You're already confirmed", "Your subscription is active and the NDIG-NAKACHI Intelligence Brief has already been sent to your inbox. The NDIG Weekly follows every two weeks thereafter.", true));
        return;
      }

      const messageId = await sendResendEmail({
        to: claimed.email,
        subject: BRIEF_SUBJECT,
        html: renderBriefEmail(claimed.name, unsubscribeUrl(claimed.confirmationToken)),
        unsubscribeUrl: unsubscribeUrl(claimed.confirmationToken),
      });

      if (!messageId) {
        await releaseBriefClaim(token);
        res.status(502).send(page("Almost there", "Your subscription is confirmed, but we couldn't send the Intelligence Brief just now. Please click your confirmation link again in a few minutes.", false));
        return;
      }

      console.log("[Join] Brief sent to", claimed.email, "resend id", messageId);
      res.status(200).send(page("You're confirmed", "The NDIG-NAKACHI Intelligence Brief is on its way to your inbox now, followed by the NDIG Weekly every two weeks thereafter.", true));
    } catch (error) {
      console.error("[Join Confirm Error]", error);
      res.status(500).send(page("Confirmation issue", "Something went wrong confirming your subscription. Please try again.", false));
    }
  });

  // Unsubscribe: GET shows a button (so link scanners can't unsubscribe anyone by prefetching);
  // POST performs it, and doubles as the RFC 8058 one-click endpoint.
  app.get("/api/unsubscribe", (req, res) => {
    const token = typeof req.query.token === "string" ? req.query.token : "";
    if (!token) {
      res.status(400).send(page("Unsubscribe", "Missing unsubscribe token.", false));
      return;
    }
    res.status(200).send(
      page("Unsubscribe", "Click below to stop receiving the NDIG Intelligence Brief and NDIG Weekly.", true,
        `<form method="POST" action="/api/unsubscribe?token=${encodeURIComponent(token)}"><button type="submit">Unsubscribe</button></form>`),
    );
  });

  app.post("/api/unsubscribe", async (req, res) => {
    const token = typeof req.query.token === "string" ? req.query.token : "";
    if (!token) {
      res.status(400).send(page("Unsubscribe", "Missing unsubscribe token.", false));
      return;
    }
    try {
      const ok = await unsubscribeByToken(token);
      if (!ok) {
        res.status(404).send(page("Unsubscribe", "This unsubscribe link is invalid.", false));
        return;
      }
      res.status(200).send(page("You're unsubscribed", "You will not receive further emails from NDIG.", true));
    } catch (error) {
      console.error("[Join Unsubscribe Error]", error);
      res.status(500).send(page("Unsubscribe", "Something went wrong. Please try again.", false));
    }
  });

  // NDIG Weekly send — FORTNIGHTLY at 09:00 UTC (see server/weeklySchedule.ts). Vercel Cron fires
  // this daily (vercel.json); it only proceeds on a scheduled send date. On a send date it never
  // skips silently: no content, or content unchanged since the last issue, is reported as MISSING.
  app.get("/api/cron/weekly", async (req, res) => {
    const secret = process.env.CRON_SECRET;
    if (secret && req.headers.authorization !== `Bearer ${secret}`) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const weekly = currentWeekly;
    const now = new Date();
    const onSendDate = isScheduledSendDate(now);

    try {
      if (!onSendDate) {
        // Off-calendar days only retry a pending archive commit for the current issue.
        let archived: boolean | null = null;
        if (weekly) {
          const recorded = await findIssueByContent(weekly.subject, weekly.bodyHtml);
          if (recorded && recorded.recipientCount > 0 && !recorded.archivedAt) archived = await archiveIssue(recorded);
        }
        res.status(200).json({ sent: 0, skipped: "not a scheduled send date", archived });
        return;
      }

      if (!weekly) {
        console.error("[Cron Weekly] MISSING — scheduled send date", utcDateString(now), "but no issue is configured in server/weeklyContent.ts");
        res.status(503).json({ status: "MISSING", reason: "no issue content configured", date: utcDateString(now) });
        return;
      }

      // Pre-send gate: a draft that pairs a VERIFIED/FAILED verdict with the Intelligence Brief, or a verdict with no log entry, is blocked.
      const gate = checkBeforeSend(weekly);
      if (!gate.ok) {
        console.error("[Cron Weekly] BLOCKED — flagged for desk review:", gate.blocked.join(" | "));
        res.status(503).json({ status: "BLOCKED", reason: "flagged for desk review", details: gate.blocked, date: utcDateString(now) });
        return;
      }

      const existing = await findIssueByContent(weekly.subject, weekly.bodyHtml);
      if (existing && utcDateString(existing.sentAt) < utcDateString(now)) {
        console.error("[Cron Weekly] MISSING — configured content was already sent as issue", existing.issueNumber, "on", utcDateString(existing.sentAt), "and has not been replaced");
        res.status(503).json({ status: "MISSING", reason: `content unchanged since issue ${existing.issueNumber}`, date: utcDateString(now) });
        return;
      }

      const issueNumber = await issueNumberFor(weekly.subject, weekly.bodyHtml);
      let sent = 0;

      // Up to 5 batches of 100 per run so a larger list still completes on the send date.
      for (let batch = 0; batch < 5; batch++) {
        const due = await getDueWeeklySubscribers(issueNumber, 100);
        if (due.length === 0) break;

        // The issue's database record is created before its first send so the number is fixed.
        const issue = await ensureIssueRecord(weekly.subject, weekly.bodyHtml, issueNumber);
        const ok = await sendResendBatch(
          due.map(s => ({
            to: s.email,
            subject: weekly.subject,
            html: renderWeeklyEmail(s.name, weekly.bodyHtml, unsubscribeUrl(s.confirmationToken)),
            unsubscribeUrl: unsubscribeUrl(s.confirmationToken),
          })),
        );
        if (!ok) {
          res.status(502).json({ sent, error: "batch send failed; remaining subscribers unchanged" });
          return;
        }
        await advanceWeekly(due.map(s => s.id), issueNumber);
        await addRecipients(issue.id, due.length);
        sent += due.length;
      }
      console.log("[Cron Weekly] Issue", issueNumber, "sent to", sent, "subscribers");

      // Archive once the issue has actually gone out; retried on every run until the commit succeeds.
      const recorded = await findIssueByContent(weekly.subject, weekly.bodyHtml);
      let archived: boolean | null = null;
      if (recorded && recorded.recipientCount > 0 && !recorded.archivedAt) {
        archived = await archiveIssue(recorded);
      }

      res.status(200).json({ sent, issue: recorded?.issueNumber ?? null, archived });
    } catch (error) {
      console.error("[Cron Weekly Error]", error);
      res.status(500).json({ error: "cron failed" });
    }
  });
}
