import { notifyOwner } from "./_core/notification";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type OutboundEmail = {
  to: string;
  subject: string;
  html: string;
  unsubscribeUrl?: string;
};

function buildResendPayload(mail: OutboundEmail) {
  return {
    from: process.env.JOIN_EMAIL_FROM || "NDIG Weekly <weekly@ndigateway.org>",
    to: mail.to,
    reply_to: process.env.JOIN_EMAIL_REPLY_TO || "ndig@nakachiconsulting.com.ng",
    subject: mail.subject,
    html: mail.html,
    ...(mail.unsubscribeUrl
      ? {
          headers: {
            "List-Unsubscribe": `<${mail.unsubscribeUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        }
      : {}),
  };
}

/** Sends one email through Resend. Returns the Resend message id, or null on failure/unconfigured. */
export async function sendResendEmail(mail: OutboundEmail): Promise<string | null> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY not configured — skipping send for", mail.to);
    return null;
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(buildResendPayload(mail)),
    });
    if (!response.ok) {
      console.error("[Email] Resend API error", response.status, await response.text());
      return null;
    }
    const data = (await response.json()) as { id?: string };
    return data.id ?? "sent";
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return null;
  }
}

/** Sends up to 100 emails in one Resend batch call. Returns true only if the whole batch was accepted. */
export async function sendResendBatch(mails: OutboundEmail[]): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY not configured — skipping batch of", mails.length);
    return false;
  }
  try {
    const response = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(mails.map(buildResendPayload)),
    });
    if (!response.ok) {
      console.error("[Email] Resend batch error", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[Email] Batch failed:", error);
    return false;
  }
}

/**
 * Sends the double opt-in confirmation email for an NDIG Weekly /join signup via
 * Resend's REST API. Requires RESEND_API_KEY — if unset, logs and skips sending
 * rather than failing the signup (the record is still stored either way).
 */
export async function sendJoinConfirmationEmail(params: {
  name: string;
  email: string;
  confirmUrl: string;
}): Promise<boolean> {
  const { name, email, confirmUrl } = params;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.JOIN_EMAIL_FROM || "NDIG Weekly <weekly@ndigateway.org>";
  const replyTo = process.env.JOIN_EMAIL_REPLY_TO || "ndig@nakachiconsulting.com.ng";

  if (!apiKey) {
    console.warn("[Join Confirmation Email] RESEND_API_KEY not configured — skipping send for", email);
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: email,
        reply_to: replyTo,
        subject: "Confirm your NDIG Weekly subscription",
        html: `<p>Hi ${escapeHtml(name)},</p><p>Confirm your subscription to NDIG. Once confirmed, you will receive our launch article, “Two Layers of Failed Trust”, first, followed by the NDIG Weekly every two weeks thereafter.</p><p><a href="${confirmUrl}">Confirm my subscription</a></p><p>If you didn't request this, you can ignore this email.</p>`,
      }),
    });

    if (!response.ok) {
      console.error("[Join Confirmation Email] Resend API error", response.status, await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Join Confirmation Email] Failed to send:", error);
    return false;
  }
}

/**
 * Email service for sending automated emails to registrants and notifications to admins
 */

interface WelcomeEmailParams {
  name: string;
  email: string;
  location: string;
  investmentCapacity: string;
}

/**
 * Send welcome email to new registrant
 * Note: This uses the owner notification system as a proxy for email delivery
 * In production, this would integrate with a dedicated email service (SendGrid, AWS SES, etc.)
 */
export async function sendWelcomeEmail(params: WelcomeEmailParams): Promise<boolean> {
  const { name, email, location, investmentCapacity } = params;

  const emailContent = `
Welcome to NDIG - Nigeria Diaspora Investment Gateway

Dear ${name},

Thank you for registering your interest. NDIG is a private-sector, independent verification institution for the Nigerian diaspora. It is regulator-vetted, not government-backed.

YOUR REGISTRATION DETAILS:
• Name: ${name}
• Email: ${email}
• Location: ${location}
• Investment Capacity: ${investmentCapacity}

NDIG does not hold funds, sell products or give investment advice. Any opportunity is transacted directly with the licensed institution named.

Contact: diaspora@ndigateway.org
More: https://www.ndigateway.org

The NDIG Team
Nigeria Diaspora Investment Gateway
  `.trim();

  // Send notification to owner (admin) about the new registration
  // In production, this would send actual email to the registrant
  try {
    await notifyOwner({
      title: `New Registration: ${name}`,
      content: `New investor registration received:\n\nName: ${name}\nEmail: ${email}\nLocation: ${location}\nInvestment Capacity: ${investmentCapacity}\n\nNo email was sent to the registrant.`,
    });

    // Log the email content for development/testing
    console.log("[Email Service] Welcome email prepared for:", email);
    console.log("[Email Service] Content:", emailContent);

    return true;
  } catch (error) {
    console.error("[Email Service] Failed to send welcome email:", error);
    return false;
  }
}

/**
 * Send admin notification about new registration
 */
export async function notifyAdminNewRegistration(params: WelcomeEmailParams): Promise<boolean> {
  const { name, email, location, investmentCapacity } = params;

  try {
    await notifyOwner({
      title: `🎯 New NDIG Registration: ${name}`,
      content: `A new diaspora investor has registered interest in NDIG:

**Registrant Details:**
• Name: ${name}
• Email: ${email}
• Location: ${location}
• Investment Capacity: ${investmentCapacity}

**Action Required:**
1. Review registration in Admin Dashboard
2. Follow up within 48 hours
3. Schedule introductory call if qualified

View all registrations: /admin`,
    });

    return true;
  } catch (error) {
    console.error("[Email Service] Failed to send admin notification:", error);
    return false;
  }
}
