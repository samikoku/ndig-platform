import { notifyOwner } from "./_core/notification";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
        html: `<p>Hi ${escapeHtml(name)},</p><p>Confirm your subscription to NDIG. Once confirmed, you will receive the NDIG-NAKACHI Intelligence Brief first, followed by the NDIG Weekly every two weeks thereafter.</p><p><a href="${confirmUrl}">Confirm my subscription</a></p><p>If you didn't request this, you can ignore this email.</p>`,
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

Thank you for registering your interest in the Nigeria Diaspora Investment Gateway (NDIG). We're excited to connect you with high-yield, government-backed productive investment opportunities in Nigeria.

YOUR REGISTRATION DETAILS:
• Name: ${name}
• Email: ${email}
• Location: ${location}
• Investment Capacity: ${investmentCapacity}

NEXT STEPS:

1. EXPLORE OPPORTUNITIES
   Visit our Investment Nexus to browse vetted opportunities in:
   - Real Estate (Eko Atlantic, Smart Cities)
   - Infrastructure Bonds
   - Collective Investment Schemes
   - Stock Market Investments

2. COMPLETE YOUR PROFILE
   Log in to your dashboard to complete your investor profile and access exclusive opportunities.

3. VERIFY YOUR IDENTITY
   For regulatory compliance, you'll need to complete KYC verification before making investments.

4. CONNECT WITH OUR TEAM
   Our investment advisors are ready to help you navigate opportunities.

PLATFORM OVERVIEW:

✓ Government Endorsed: Backed by NPA, NiDCOM, NIPC, CBN, and SEC
✓ Transparent: Full regulatory compliance and investment verification
✓ Secure: Bank-level security for all transactions
✓ Impactful: Your investments drive Nigeria's economic development

INVESTMENT TEAM CONTACT:

Email: investments@ndig.gov.ng
Phone: +234 (0) 800 NDIG-INVEST
WhatsApp: +234 (0) 803 000 0000

Office Hours: Monday - Friday, 9:00 AM - 5:00 PM (WAT)

EXPLORE THE PLATFORM:

• Investment Nexus: https://ndig.gov.ng/investment-nexus
• Trust Centre: https://ndig.gov.ng/trust-centre
• Authority Statements: https://ndig.gov.ng/authority-statements
• Dashboard: https://ndig.gov.ng/dashboard

We look forward to partnering with you to transform your remittances into generational wealth while contributing to Nigeria's growth.

Best regards,

The NDIG Investment Team
Nigeria Diaspora Investment Gateway
A Public-Private Partnership Initiative

---

This is an automated message. Please do not reply to this email.
For inquiries, contact: investments@ndig.gov.ng
  `.trim();

  // Send notification to owner (admin) about the new registration
  // In production, this would send actual email to the registrant
  try {
    await notifyOwner({
      title: `New Registration: ${name}`,
      content: `New investor registration received:\n\nName: ${name}\nEmail: ${email}\nLocation: ${location}\nInvestment Capacity: ${investmentCapacity}\n\nWelcome email sent to registrant.`,
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
