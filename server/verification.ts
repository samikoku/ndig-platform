import { randomBytes } from "crypto";
import { desc, eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDb } from "./db";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { verificationRequests } from "../drizzle/schema";
import { routeInternal, sendAutoReply } from "./mailRouting";

type Db = NonNullable<Awaited<ReturnType<typeof getDb>>>;

let tableReady = false;

async function ensureTable(db: Db): Promise<void> {
  if (tableReady) return;
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE verification_status AS ENUM ('pending', 'confirmed', 'flagged', 'rejected');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS verification_requests (
      id SERIAL PRIMARY KEY,
      reference VARCHAR(32) NOT NULL UNIQUE,
      subject VARCHAR(300) NOT NULL,
      "regulatorClaimed" VARCHAR(100),
      "sourceLink" VARCHAR(500),
      details TEXT,
      "checkedAgainst" VARCHAR(500) NOT NULL,
      status verification_status NOT NULL DEFAULT 'pending',
      "requesterName" VARCHAR(200) NOT NULL,
      "requesterEmail" VARCHAR(320) NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
    );
  `);
  tableReady = true;
}

async function requireDb(): Promise<Db> {
  const db = await getDb();
  if (!db) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
  }
  await ensureTable(db);
  return db;
}

/**
 * Dossier reference: NDIG-<year>-<6 hex>, e.g. NDIG-2026-948A1C.
 * Format follows the approved card render (NDIG-2026-948A); six characters rather than
 * four so references cannot be guessed by counting (16.7M per year vs 65k).
 */
export function generateDossierReference(now = new Date()): string {
  return `NDIG-${now.getUTCFullYear()}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export const REFERENCE_PATTERN = /^NDIG-\d{4}-[0-9A-F]{4,8}$/;

/** Records each claimed regulator maps to; CAC is always checked. */
const REGULATOR_RECORDS: Record<string, string> = {
  SEC: "SEC Nigeria register",
  CBN: "CBN register of licensed institutions",
  NAICOM: "NAICOM register of insurers",
  PenCom: "PenCom register of licensed operators",
  NUPRC: "NUPRC licence records",
  NIPC: "NIPC records",
};

export function checkedAgainstFor(regulator?: string | null): string {
  const records = regulator && REGULATOR_RECORDS[regulator] ? [REGULATOR_RECORDS[regulator]] : ["Relevant regulator's public register"];
  return [...records, "CAC public search"].join("; ");
}

function esc(v: string) {
  return v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

const publicDossier = {
  reference: verificationRequests.reference,
  subject: verificationRequests.subject,
  checkedAgainst: verificationRequests.checkedAgainst,
  status: verificationRequests.status,
  createdAt: verificationRequests.createdAt,
  updatedAt: verificationRequests.updatedAt,
};

export const verificationRouter = router({
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().trim().min(2).max(200),
        email: z.string().trim().email().max(320),
        subject: z.string().trim().min(3, "Tell us what to verify").max(300),
        regulatorClaimed: z.string().trim().max(100).optional(),
        sourceLink: z.string().trim().max(500).optional(),
        details: z.string().trim().max(2000).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await requireDb();
      const reference = generateDossierReference();
      const checkedAgainst = checkedAgainstFor(input.regulatorClaimed);

      const [row] = await db
        .insert(verificationRequests)
        .values({
          reference,
          subject: input.subject,
          regulatorClaimed: input.regulatorClaimed || null,
          sourceLink: input.sourceLink || null,
          details: input.details || null,
          checkedAgainst,
          requesterName: input.name,
          requesterEmail: input.email,
        })
        .returning(publicDossier);

      // Internal alert to info@ with [VERIFY] prefix, plus an acknowledgement to the requester.
      // Mail failures must not block the requester's dossier.
      await routeInternal(
        "verification",
        `${reference}: ${input.subject}`,
        `<p><strong>${esc(reference)}</strong></p>
<p>Subject: ${esc(input.subject)}<br/>Regulator claimed: ${esc(input.regulatorClaimed || "Not stated")}<br/>Link/contact: ${esc(input.sourceLink || "None")}</p>
<p>${esc(input.details || "")}</p>
<p>Requester: ${esc(input.name)} &lt;${esc(input.email)}&gt;</p>`
      ).catch(() => null);
      await sendAutoReply("verification", input.email, { name: input.name, reference }).catch(() => null);

      return row;
    }),

  lookup: publicProcedure
    .input(z.object({ reference: z.string().trim().toUpperCase().regex(REFERENCE_PATTERN, "Enter a reference like NDIG-2026-948A1C") }))
    .query(async ({ input }) => {
      const db = await requireDb();
      const [row] = await db.select(publicDossier).from(verificationRequests).where(eq(verificationRequests.reference, input.reference)).limit(1);
      return row ?? null;
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    const db = await requireDb();
    return db.select().from(verificationRequests).orderBy(desc(verificationRequests.createdAt));
  }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        reference: z.string().regex(REFERENCE_PATTERN),
        status: z.enum(["pending", "confirmed", "flagged", "rejected"]),
        checkedAgainst: z.string().trim().min(3).max(500).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      const db = await requireDb();
      await db
        .update(verificationRequests)
        .set({
          status: input.status,
          ...(input.checkedAgainst ? { checkedAgainst: input.checkedAgainst } : {}),
          updatedAt: new Date(),
        })
        .where(eq(verificationRequests.reference, input.reference));
      return { success: true };
    }),
});
