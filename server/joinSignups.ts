import { randomUUID } from "crypto";
import { eq, sql } from "drizzle-orm";
import { getDb } from "./db";
import { joinSignups, type InsertJoinSignup, type JoinSignup } from "../drizzle/schema";

let tableReady = false;

async function ensureTable(db: NonNullable<Awaited<ReturnType<typeof getDb>>>): Promise<void> {
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

  tableReady = true;
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
