import { BRIEF_ARTICLE_TEXT } from "./briefArticle";

export const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || "https://www.ndigateway.org";

const DISCLOSURE =
  "NDIG does not provide investment advice, and does not collect or hold investor funds. All investments are made directly with the licensed institutions named.";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function unsubscribeUrl(token: string): string {
  return `${PUBLIC_BASE_URL}/api/unsubscribe?token=${encodeURIComponent(token)}`;
}

const F = "Georgia,'Times New Roman',serif";

function shell(innerHtml: string, unsubUrl: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f5ef;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5ef;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:6px;overflow:hidden;">
<tr><td style="background:#03381d;padding:22px 32px;border-bottom:3px solid #c9a227;">
<img src="${PUBLIC_BASE_URL}/ndig-logo.png" alt="NDIG" width="44" height="44" style="vertical-align:middle;border-radius:50%;background:#fff;">
<span style="font-family:${F};color:#ffffff;font-size:17px;letter-spacing:.06em;vertical-align:middle;margin-left:12px;">Nigeria Diaspora Investment Gateway</span>
</td></tr>
<tr><td style="padding:32px;font-family:${F};color:#12231a;font-size:16px;line-height:1.7;">${innerHtml}</td></tr>
<tr><td style="background:#f7f5ef;padding:22px 32px;font-family:${F};font-size:12px;line-height:1.6;color:#5b6b60;border-top:1px solid #e3dfd0;">
<p style="margin:0 0 10px;">${escapeHtml(DISCLOSURE)}</p>
<p style="margin:0;">You are receiving this because you subscribed at ndigateway.org. Replies go to our team. <a href="${unsubUrl}" style="color:#0b6b3a;">Unsubscribe</a>.</p>
</td></tr>
</table></td></tr></table></body></html>`;
}

function renderArticle(text: string): string {
  const blocks = text.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  const out: string[] = [];
  blocks.forEach((block, i) => {
    if (i === 0) {
      out.push(`<h1 style="font-family:${F};font-size:26px;line-height:1.25;margin:0 0 14px;color:#054d28;font-weight:normal;">${escapeHtml(block.replace(/\s*\n\s*/g, " "))}</h1>`);
      return;
    }
    if (i === 1 && /^By /.test(block)) {
      out.push(`<p style="margin:0 0 18px;color:#5b6b60;font-size:14px;">${block.split("\n").map(l => escapeHtml(l.trim())).join("<br>")}</p>`);
      return;
    }
    if (block === "---") {
      out.push(`<hr style="border:none;border-top:1px solid #e3dfd0;margin:22px 0;">`);
      return;
    }
    if (/^[A-Z0-9 ,.'’—:\-]+$/.test(block) && block.length > 6) {
      out.push(`<h2 style="font-family:'Courier New',monospace;font-size:13px;letter-spacing:.14em;color:#0b6b3a;margin:28px 0 10px;">${escapeHtml(block)}</h2>`);
      return;
    }
    if (block.startsWith("·")) {
      const items = block.split(/\n(?=·)/).map(it => it.replace(/^·\s*/, "").replace(/\s*\n\s*/g, " "));
      out.push(`<ul style="margin:0 0 16px;padding-left:20px;">${items.map(it => `<li style="margin-bottom:8px;">${escapeHtml(it)}</li>`).join("")}</ul>`);
      return;
    }
    out.push(`<p style="margin:0 0 16px;">${escapeHtml(block.replace(/\s*\n\s*/g, " "))}</p>`);
  });
  return out.join("\n");
}

export const BRIEF_SUBJECT = "The NDIG–NAKACHI Intelligence Brief: Two Layers of Failed Trust";

export function renderBriefEmail(name: string, unsubUrl: string): string {
  const intro = `<p style="margin:0 0 6px;">Hi ${escapeHtml(name)},</p>
<p style="margin:0 0 22px;">Your subscription is confirmed. Below is the <strong>NDIG–NAKACHI Intelligence Brief (Special Edition)</strong> — the first document every confirmed subscriber receives. The NDIG Weekly follows every two weeks thereafter.</p>
<hr style="border:none;border-top:1px solid #e3dfd0;margin:0 0 24px;">`;
  return shell(intro + renderArticle(BRIEF_ARTICLE_TEXT), unsubUrl);
}

/** Personalisation-free copy of an issue for the permanent repo archive (no name, no subscriber token). */
export function renderWeeklyArchive(subject: string, bodyHtml: string, sentAt: Date): string {
  const banner = `<p style="margin:0 0 18px;font-size:13px;color:#5b6b60;">Archived copy — NDIG Weekly, sent ${sentAt.toISOString().slice(0, 10)}. <a href="${PUBLIC_BASE_URL}/join" style="color:#0b6b3a;">Subscribe</a></p>`;
  return shell(banner + bodyHtml, `${PUBLIC_BASE_URL}/join`).replace("<head>", `<head><title>${escapeHtml(subject)}</title>`);
}

export function renderWeeklyEmail(name: string, bodyHtml: string, unsubUrl: string): string {
  return shell(`<p style="margin:0 0 18px;">Hi ${escapeHtml(name)},</p>${bodyHtml}`, unsubUrl);
}
