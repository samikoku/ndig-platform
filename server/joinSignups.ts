import { randomUUID } from "crypto";
import { and, eq, inArray, isNotNull, isNull, lt, lte, or, sql } from "drizzle-orm";
import { getDb } from "./db";
import { joinSignups, type InsertJoinSignup, type JoinSignup } from "../drizzle/schema";

let tableReady = false;

export async function ensureTable(db: NonNullable<Awaited<ReturnType<typeof getDb>>>): Promise<void> {
  if (tableReady) return;

  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE join_signup_status AS ENUM ('pending', 'confirmed');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS join_signups (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      email VARCHAR(320) NOT NULL UNIQUE,
      country VARCHAR(120) NOT NULL,
      association VARCHAR(200),
      source VARCHAR(120) NOT NULL DEFAULT '/join',
      status join_signup_status NOT NULL DEFAULT 'pending',
      "confirmationToken" VARCHAR(64) NOT NULL UNIQUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "confirmedAt" TIMESTAMP
    );
  `);

  for (const column of ["briefSentAt", "nextWeeklyAt", "lastWeeklySentAt", "unsubscribedAt"]) {
    await db.execute(sql.raw(`ALTER TABLE join_signups ADD COLUMN IF NOT EXISTS "${column}" TIMESTAMP`));
  }
  await db.execute(sql`ALTER TABLE join_signups ADD COLUMN IF NOT EXISTS "lastWeeklyIssue" INTEGER`);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS weekly_issues (
      id SERIAL PRIMARY KEY,
      "issueNumber" INTEGER NOT NULL UNIQUE,
      "contentHash" VARCHAR(64) NOT NULL UNIQUE,
      subject TEXT NOT NULL,
      "bodyHtml" TEXT NOT NULL,
      "sentAt" TIMESTAMP NOT NULL DEFAULT now(),
      "recipientCount" INTEGER NOT NULL DEFAULT 0,
      "archivedAt" TIMESTAMP,
      "archivePath" VARCHAR(200)
    );
  `);

  tableReady = true;
}

const WEEKLY_INTERVAL_MS = 14 * 24 * 60 * 60 * 1000;

/**
 * Atomically claims the one-time Brief send for a confirmed, subscribed row and starts
 * the bi-weekly clock (first Weekly = Brief + 14 days). Returns the row only for the
 * caller that wins the claim, so repeated link clicks can never double-send.
 */
export async function claimBriefSend(token: string): Promise<JoinSignup | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await ensureTable(db);

  const now = new Date();
  const rows = await db
    .update(joinSignups)
    .set({ briefSentAt: now, nextWeeklyAt: new Date(now.getTime() + WEEKLY_INTERVAL_MS) })
    .where(
      and(
        eq(joinSignups.confirmationToken, token),
        eq(joinSignups.status, "confirmed"),
        isNull(joinSignups.briefSentAt),
        isNull(joinSignups.unsubscribedAt),
      ),
    )
    .returning();
  return rows[0] ?? null;
}

export async function releaseBriefClaim(token: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .update(joinSignups)
    .set({ briefSentAt: null, nextWeeklyAt: null })
    .where(eq(joinSignups.confirmationToken, token));
}

/** Subscribers whose 14-day clock is due and who have not already received issue `issueNumber`. */
export async function getDueWeeklySubscribers(issueNumber: number, limit = 100): Promise<JoinSignup[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await ensureTable(db);
  return db
    .select()
    .from(joinSignups)
    .where(
      and(
        eq(joinSignups.status, "confirmed"),
        isNull(joinSignups.unsubscribedAt),
        isNotNull(joinSignups.briefSentAt),
        lte(joinSignups.nextWeeklyAt, new Date()),
        or(isNull(joinSignups.lastWeeklyIssue), lt(joinSignups.lastWeeklyIssue, issueNumber)),
      ),
    )
    .limit(limit);
}

export async function advanceWeekly(ids: number[], issueNumber: number): Promise<void> {
  if (ids.length === 0) return;
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const now = new Date();
  await db
    .update(joinSignups)
    .set({
      lastWeeklySentAt: now,
      lastWeeklyIssue: issueNumber,
      nextWeeklyAt: new Date(now.getTime() + WEEKLY_INTERVAL_MS),
    })
    .where(inArray(joinSignups.id, ids));
}

export async function unsubscribeByToken(token: string): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await ensureTable(db);
  const rows = await db
    .update(joinSignups)
    .set({ unsubscribedAt: new Date(), nextWeeklyAt: null })
    .where(eq(joinSignups.confirmationToken, token))
    .returning({ id: joinSignups.id });
  return rows.length > 0;
}

export type JoinSignupInput = {
  name: string;
  email: string;
  country: string;
  association?: string;
  source?: string;
};

/**
 * Inserts a new signup, or updates the profile fields of an existing pending/confirmed
 * one — without ever regenerating the confirmation token or downgrading a confirmed
 * subscriber back to pending on resubmit.
 */
export async function upsertJoinSignup(input: JoinSignupInput): Promise<JoinSignup> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await ensureTable(db);

  const values: InsertJoinSignup = {
    name: input.name,
    email: input.email,
    country: input.country,
    association: input.association || null,
    source: input.source || "/join",
    confirmationToken: randomUUID(),
  };

  await db
    .insert(joinSignups)
    .values(values)
    .onConflictDoUpdate({
      target: joinSignups.email,
      set: {
        name: values.name,
        country: values.country,
        association: values.association,
        source: values.source,
      },
    });

  const [row] = await db.select().from(joinSignups).where(eq(joinSignups.email, input.email)).limit(1);

  if (row.unsubscribedAt) {
    // Someone who unsubscribed and signs up again starts the full double opt-in over.
    const [reset] = await db
      .update(joinSignups)
      .set({
        status: "pending",
        confirmationToken: randomUUID(),
        unsubscribedAt: null,
        briefSentAt: null,
        nextWeeklyAt: null,
        confirmedAt: null,
      })
      .where(eq(joinSignups.id, row.id))
      .returning();
    return reset;
  }
  return row;
}

export async function confirmJoinSignup(token: string): Promise<JoinSignup | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await ensureTable(db);

  const [row] = await db.select().from(joinSignups).where(eq(joinSignups.confirmationToken, token)).limit(1);
  if (!row) return null;
  if (row.status === "confirmed") return row;

  const confirmedAt = new Date();
  await db
    .update(joinSignups)
    .set({ status: "confirmed", confirmedAt })
    .where(eq(joinSignups.confirmationToken, token));

  return { ...row, status: "confirmed", confirmedAt };
}
