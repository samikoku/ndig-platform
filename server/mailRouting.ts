/**
 * NDIG mailbox routing — single source of truth for where automated mail goes.
 * Documented in README.md ("Email routing"). Mailboxes are provisioned outside this repo;
 * this file only decides which existing mailbox each automated flow uses.
 *
 * smi@ndigateway.org is the Chairman/Founder address. Automated mail TO smi@ is forbidden
 * EXCEPT for the Diaspora Insight daily digest, which is expressly routed there.
 * assertRoutable() refuses non-digest routes to smi@ to prevent accidental addition.
 *
 * Protocol (absolute): execution and redress services are always delivered through
 * verified third parties. The auto-reply templates below say so.
 */
import { sendResendEmail } from "./emailService";

export type MailCategory = "verification" | "execution" | "redress" | "press" | "insight";

export interface MailRoute {
  to: string;
  subjectPrefix: string;
  /** Address auto-replies are sent from, so a reply lands in the same mailbox. */
  replyFrom: string;
}

const FORBIDDEN = new Set(["smi@ndigateway.org"]);

export const MAIL_ROUTES: Record<MailCategory, MailRoute> = {
  verification: { to: "info@ndigateway.org", subjectPrefix: "[VERIFY]", replyFrom: "NDIG <info@ndigateway.org>" },
  execution: { to: "execution@ndigateway.org", subjectPrefix: "[EXECUTION]", replyFrom: "NDIG Execution <execution@ndigateway.org>" },
  redress: { to: "redress@ndigateway.org", subjectPrefix: "[REDRESS]", replyFrom: "NDIG Redress <redress@ndigateway.org>" },
  press: { to: "press@ndigateway.org", subjectPrefix: "[PRESS]", replyFrom: "NDIG Press <press@ndigateway.org>" },
  insight: { to: "info@ndigateway.org", subjectPrefix: "[INSIGHT]", replyFrom: "NDIG <info@ndigateway.org>" },
};

export function assertRoutable(address: string): string {
  const bare = address.replace(/^.*<|>.*$/g, "").trim().toLowerCase();
  if (FORBIDDEN.has(bare)) throw new Error(`Automated mail may not route to ${bare}`);
  return address;
}

/** Internal alert for a category; subject gets the category prefix. */
export function routeInternal(category: MailCategory, subject: string, html: string) {
  const route = MAIL_ROUTES[category];
  return sendResendEmail({ to: assertRoutable(route.to), subject: `${route.subjectPrefix} ${subject}`, html });
}

const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const THIRD_PARTY =
  "NDIG does not deliver this service itself. Execution and redress services are always delivered through verified third parties, and NDIG will tell you which third party is handling your matter before any work begins. NDIG never holds funds, sells products or gives investment advice.";

/** Auto-reply templates. Plain, doctrine-checked copy (scanned by npm run doctrine:check). */
export const AUTO_REPLY_TEMPLATES: Record<MailCategory, (p: { name: string; reference?: string }) => { subject: string; html: string }> = {
  verification: ({ name, reference }) => ({
    subject: `${MAIL_ROUTES.verification.subjectPrefix} We have opened your dossier${reference ? ` ${reference}` : ""}`,
    html: `<p>Dear ${esc(name)},</p>
<p>NDIG has opened a verification dossier${reference ? ` with reference <strong>${esc(reference)}</strong>` : ""}. We check the institution or offer against public regulatory records and record the verdict in the dossier. You can check its status at https://ndigateway.org/verify.</p>
<p>A dossier records what public records show on the date of the check. It is not investment advice.</p>
<p>NDIG — Nigeria Diaspora Investment Gateway</p>`,
  }),
  execution: ({ name, reference }) => ({
    subject: `${MAIL_ROUTES.execution.subjectPrefix} We have received your request${reference ? ` ${reference}` : ""}`,
    html: `<p>Dear ${esc(name)},</p>
<p>NDIG has received your execution service request${reference ? ` (reference <strong>${esc(reference)}</strong>)` : ""}.</p>
<p>${THIRD_PARTY}</p>
<p>NDIG — Nigeria Diaspora Investment Gateway</p>`,
  }),
  redress: ({ name, reference }) => ({
    subject: `${MAIL_ROUTES.redress.subjectPrefix} We have received your submission${reference ? ` ${reference}` : ""}`,
    html: `<p>Dear ${esc(name)},</p>
<p>NDIG has received your grievance or redress submission${reference ? ` (reference <strong>${esc(reference)}</strong>)` : ""}. Keep this email as your record.</p>
<p>${THIRD_PARTY}</p>
<p>NDIG — Nigeria Diaspora Investment Gateway</p>`,
  }),
  press: ({ name }) => ({
    subject: `${MAIL_ROUTES.press.subjectPrefix} We have received your enquiry`,
    html: `<p>Dear ${esc(name)},</p>
<p>NDIG has received your press or media enquiry and will respond from press@ndigateway.org.</p>
<p>NDIG — Nigeria Diaspora Investment Gateway</p>`,
  }),
};

/** Sends the category's auto-reply to the submitter from that category's mailbox. */
export function sendAutoReply(category: MailCategory, to: string, p: { name: string; reference?: string }) {
  const t = AUTO_REPLY_TEMPLATES[category](p);
  return sendResendEmail({ to, subject: t.subject, html: t.html, from: assertRoutable(MAIL_ROUTES[category].replyFrom), replyTo: MAIL_ROUTES[category].to });
}

/**
 * Send Diaspora Insight daily digest to smi@ and optionally press@.
 * smi@ is an exception to the FORBIDDEN rule for this category only.
 * press@ receives the digest only when items are marked ready for article.
 */
export function sendInsightDigests(html: string, options: { toSmi: boolean; toPress?: boolean }) {
  const route = MAIL_ROUTES.insight;
  const subject = `${route.subjectPrefix} Daily Insight Review`;
  const promises: Promise<string | null>[] = [];

  // Always send to smi@ for daily digest (exception to FORBIDDEN rule)
  if (options.toSmi) {
    promises.push(
      sendResendEmail({
        to: "smi@ndigateway.org",
        subject,
        html,
        from: assertRoutable(route.replyFrom),
        replyTo: route.to,
      })
    );
  }

  // Send copy to press@ when articles are ready for publication
  if (options.toPress) {
    promises.push(
      sendResendEmail({
        to: "press@ndigateway.org",
        subject: `${MAIL_ROUTES.press.subjectPrefix} Diaspora Insight: Ready for Publication`,
        html: `<p>The following Diaspora Insight findings are ready for article publication:</p>\n${html}`,
        from: assertRoutable(MAIL_ROUTES.press.replyFrom),
        replyTo: MAIL_ROUTES.press.to,
      })
    );
  }

  return Promise.all(promises);
}
