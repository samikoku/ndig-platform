/**
 * Newsletter source routing and pre-send check.
 *
 * Every source that can feed a newsletter draft is classed, and the class decides what it may be used for:
 *   INTEL_BRIEF — the NDIG-NAKACHI Intelligence Brief (quarterly analysis). Reference only. Never summarised
 *                 into newsletter copy, and never a source for a VERIFIED or FAILED verdict, without a completed
 *                 verification log entry for that specific claim.
 *   ARTICLE     — a published article (e.g. "Two Layers of Failed Trust"). Publishable copy.
 *   WEEKLY      — log-gated. Only items with a verification log entry may appear in VERIFIED / FAILED sections.
 *
 * checkBeforeSend() is the pre-send gate: a blocked draft must not be sent and is flagged for desk review.
 */
export type SourceClass = "INTEL_BRIEF" | "ARTICLE" | "WEEKLY";
export type Verdict = "VERIFIED" | "FAILED" | "UNVERIFIED";

export interface DraftClaim {
  verdict: Verdict;
  /** Class of the document the claim was taken from. */
  source: SourceClass | "PUBLIC_RECORD";
  /** Verification log entry that supports this claim. Required for any VERIFIED or FAILED verdict. */
  logEntryId?: string;
}

export interface NewsletterDraft {
  subject: string;
  bodyHtml: string;
  /** Optional structured claims. When present they are checked in addition to the text scan. */
  claims?: DraftClaim[];
}

export interface SendCheckResult {
  ok: boolean;
  /** Reasons the draft is blocked; empty when ok. */
  blocked: string[];
}

export const SOURCE_ROUTING: Record<SourceClass, { use: string; publishable: boolean }> = {
  INTEL_BRIEF: { use: "reference only; needs a completed verification log entry per claim before any use in copy", publishable: false },
  ARTICLE: { use: "publishable copy", publishable: true },
  WEEKLY: { use: "log-gated; only log-verified items in VERIFIED/FAILED sections", publishable: true },
};

const VERDICT_WORD = /\b(VERIFIED|FAILED)\b/;
const BRIEF_MENTION = /intelligence\s+brief|NDIG[-–\s]+NAKACHI/i;

function plainParagraphs(html: string): string[] {
  return html
    .split(/<\/(?:p|li|h[1-6]|div|blockquote)>|<br\s*\/?>/i)
    .map(chunk => chunk.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

export function checkBeforeSend(draft: NewsletterDraft): SendCheckResult {
  const blocked: string[] = [];

  for (const claim of draft.claims ?? []) {
    const gated = claim.verdict === "VERIFIED" || claim.verdict === "FAILED";
    if (gated && claim.source === "INTEL_BRIEF") {
      blocked.push(`A ${claim.verdict} verdict cites the Intelligence Brief as its source.`);
    }
    if (gated && !claim.logEntryId) {
      blocked.push(`A ${claim.verdict} verdict has no verification log entry.`);
    }
  }

  // Text scan: a paragraph carrying a VERIFIED/FAILED verdict must not also cite the Intelligence Brief.
  for (const paragraph of plainParagraphs(draft.bodyHtml)) {
    if (VERDICT_WORD.test(paragraph) && BRIEF_MENTION.test(paragraph)) {
      blocked.push(`Paragraph pairs a VERIFIED/FAILED verdict with the Intelligence Brief: "${paragraph.slice(0, 120)}"`);
    }
  }

  return { ok: blocked.length === 0, blocked };
}
