import { createHash } from "crypto";
import { eq, sql } from "drizzle-orm";
import { getDb } from "./db";
import { ensureTable } from "./joinSignups";
import { weeklyIssues, type WeeklyIssue } from "../drizzle/schema";
import { renderWeeklyArchive } from "./emailTemplates";

const REPO = process.env.ARCHIVE_GITHUB_REPO || "samikoku/ndig-platform";
const BRANCH = process.env.ARCHIVE_GITHUB_BRANCH || "main";

export function hashContent(subject: string, bodyHtml: string): string {
  return createHash("sha256").update(`${subject}\n${bodyHtml}`).digest("hex");
}

export function archivePathFor(sentAt: Date, issueNumber: number): string {
  return `archive/weekly/${sentAt.toISOString().slice(0, 10)}-issue-${String(issueNumber).padStart(3, "0")}.html`;
}

/** The issue already recorded for this exact content, if any. */
export async function findIssueByContent(subject: string, bodyHtml: string): Promise<WeeklyIssue | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await ensureTable(db);
  const [row] = await db.select().from(weeklyIssues).where(eq(weeklyIssues.contentHash, hashContent(subject, bodyHtml))).limit(1);
  return row ?? null;
}

/** The number this content will have: its existing number, or the next in sequence. */
export async function issueNumberFor(subject: string, bodyHtml: string): Promise<number> {
  const existing = await findIssueByContent(subject, bodyHtml);
  if (existing) return existing.issueNumber;
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.execute(sql`SELECT COALESCE(MAX("issueNumber"), 0) + 1 AS next FROM weekly_issues`);
  return Number((result.rows[0] as { next: number | string }).next);
}

/** Creates the issue's database record on first send, or returns the existing one. */
export async function ensureIssueRecord(subject: string, bodyHtml: string, issueNumber: number): Promise<WeeklyIssue> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await ensureTable(db);
  await db
    .insert(weeklyIssues)
    .values({ issueNumber, contentHash: hashContent(subject, bodyHtml), subject, bodyHtml })
    .onConflictDoNothing();
  const issue = await findIssueByContent(subject, bodyHtml);
  if (!issue) throw new Error("Failed to record Weekly issue");
  return issue;
}

export async function addRecipients(issueId: number, count: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(weeklyIssues)
    .set({ recipientCount: sql`${weeklyIssues.recipientCount} + ${count}` })
    .where(eq(weeklyIssues.id, issueId));
}

/**
 * Commits a file to the repo through GitHub's Contents API. Serverless functions can't write to the
 * repo or run git, so this is the only way for the send to leave a permanent copy in the folder.
 * The commit message carries [skip ci] so archive commits don't trigger a redeploy.
 */
export async function commitFileToRepo(path: string, content: string, message: string): Promise<"created" | "exists" | "failed"> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("[Weekly Archive] GITHUB_TOKEN not configured — cannot commit", path);
    return "failed";
  }
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, content: Buffer.from(content, "utf8").toString("base64"), branch: BRANCH }),
    });
    if (response.ok) return "created";
    // 422 = a file already exists at this path (an earlier attempt succeeded but wasn't recorded).
    if (response.status === 422) return "exists";
    console.error("[Weekly Archive] GitHub API error", response.status, await response.text());
    return "failed";
  } catch (error) {
    console.error("[Weekly Archive] Commit failed:", error);
    return "failed";
  }
}

/** Saves the issue to archive/weekly/ in the repo and records that in the database. Safe to retry. */
export async function archiveIssue(issue: WeeklyIssue): Promise<boolean> {
  if (issue.archivedAt) return true;
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const path = archivePathFor(issue.sentAt, issue.issueNumber);
  const html = renderWeeklyArchive(issue.subject, issue.bodyHtml, issue.sentAt);
  const result = await commitFileToRepo(path, html, `Archive NDIG Weekly issue ${String(issue.issueNumber).padStart(3, "0")} [skip ci]`);
  if (result === "failed") return false;

  await db.update(weeklyIssues).set({ archivedAt: new Date(), archivePath: path }).where(eq(weeklyIssues.id, issue.id));
  console.log("[Weekly Archive] Archived issue", issue.issueNumber, "to", path);
  return true;
}
