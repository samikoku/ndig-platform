import type { Express } from "express";
import { z } from "zod";
import { upsertJoinSignup, confirmJoinSignup } from "./joinSignups";
import { sendJoinConfirmationEmail } from "./emailService";

const joinSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  country: z.string().trim().min(1).max(120),
  association: z.string().trim().max(200).optional(),
});

function confirmPage(message: string, success: boolean): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>NDIG Weekly</title>
<style>body{font-family:Georgia,'Times New Roman',serif;background:#f7f5ef;color:#12231a;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px;text-align:center}
.card{max-width:480px;padding:40px;background:#fff;border-radius:6px;border-top:4px solid ${success ? "#0b6b3a" : "#c9a227"}}
h1{font-size:1.3rem;margin:0 0 12px}a{color:#0b6b3a}</style></head>
<body><div class="card"><h1>${success ? "You're confirmed" : "Confirmation issue"}</h1><p>${message}</p><p><a href="https://www.ndigateway.org/join">Return to NDIG</a></p></div></body></html>`;
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
      res.status(400).send(confirmPage("Missing confirmation token.", false));
      return;
    }

    try {
      const row = await confirmJoinSignup(token);
      if (!row) {
        res.status(404).send(confirmPage("This confirmation link is invalid or has expired.", false));
        return;
      }
      res.status(200).send(confirmPage("Welcome to the NDIG Weekly — one email every two weeks, starting with the 1 October launch.", true));
    } catch (error) {
      console.error("[Join Confirm Error]", error);
      res.status(500).send(confirmPage("Something went wrong confirming your subscription. Please try again.", false));
    }
  });
}
