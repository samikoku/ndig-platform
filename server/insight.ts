import { desc, eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDb } from "./db";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { insightTips } from "../drizzle/schema";
import { routeInternal } from "./mailRouting";

type Db = NonNullable<Awaited<ReturnType<typeof getDb>>>;

let tableReady = false;

async function ensureTable(db: Db): Promise<void> {
  if (tableReady) return;
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE insight_tip_status AS ENUM ('unprocessed', 'verified', 'flagged', 'rejected', 'needs_human');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS insight_tips (
      id SERIAL PRIMARY KEY,
      what TEXT NOT NULL,
      "sourceOrLink" VARCHAR(500),
      "whyItMatters" TEXT,
      "howHeardAboutUs" VARCHAR(255),
      "submitterName" VARCHAR(200),
      status insight_tip_status NOT NULL DEFAULT 'unprocessed',
      evidence VARCHAR(500),
      "readyForArticle" INTEGER NOT NULL DEFAULT 0,
      summary TEXT,
      "processedAt" TIMESTAMP,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now()
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

/** Public view: only published findings (verified + ready for article) */
const publicFinding = {
  id: insightTips.id,
  what: insightTips.what,
  summary: insightTips.summary,
  evidence: insightTips.evidence,
  createdAt: insightTips.createdAt,
};

export const insightRouter = router({
  /** Submit a tip. Immediately confirms to submitter; queues for review. */
  submitTip: publicProcedure
    .input(
      z.object({
        what: z.string().trim().min(10, "Describe the scheme in at least 10 characters").max(2000),
        sourceOrLink: z.string().trim().max(500).optional(),
        whyItMatters: z.string().trim().max(2000).optional(),
        howHeardAboutUs: z.string().trim().max(255).optional(),
        submitterName: z.string().trim().max(200).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await requireDb();

      const [row] = await db
        .insert(insightTips)
        .values({
          what: input.what,
          sourceOrLink: input.sourceOrLink || null,
          whyItMatters: input.whyItMatters || null,
          howHeardAboutUs: input.howHeardAboutUs || null,
          submitterName: input.submitterName || null,
          status: "unprocessed",
        })
        .returning({ id: insightTips.id, createdAt: insightTips.createdAt });

      // Alert internal team [INSIGHT] prefix
      await routeInternal(
        "insight",
        `New tip: ${input.what.substring(0, 50)}...`,
        `<p><strong>Tip ID ${row.id}</strong></p>
<p><strong>What:</strong> ${input.what}</p>
<p><strong>Source/Link:</strong> ${input.sourceOrLink || "Not provided"}</p>
<p><strong>Why it matters:</strong> ${input.whyItMatters || "Not provided"}</p>
<p><strong>How heard about us:</strong> ${input.howHeardAboutUs || "Not provided"}</p>
<p><strong>Submitter:</strong> ${input.submitterName || "Anonymous"}</p>`
      ).catch(() => null);

      return { confirmed: true };
    }),

  /** Public list of published findings (verified + ready for article). Newest first. */
  published: publicProcedure.query(async ({}) => {
    const db = await requireDb();
    const findings = await db
      .select(publicFinding)
      .from(insightTips)
      .where(sql`${insightTips.status} = 'verified' AND ${insightTips.readyForArticle} = 1`)
      .orderBy(desc(insightTips.createdAt));
    return findings;
  }),

  /** Admin: list all unprocessed tips. */
  adminUnprocessed: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    const db = await requireDb();
    return db
      .select()
      .from(insightTips)
      .where(sql`${insightTips.status} = 'unprocessed'`)
      .orderBy(sql`${insightTips.createdAt}`);
  }),

  /** Admin: update tip status and optionally add evidence/summary. */
  adminUpdate: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["verified", "flagged", "rejected", "needs_human"]),
        evidence: z.string().trim().max(500).optional(),
        summary: z.string().trim().max(1000).optional(),
        readyForArticle: z.number().optional(), // 0 or 1
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      const db = await requireDb();

      await db
        .update(insightTips)
        .set({
          status: input.status,
          evidence: input.evidence || null,
          summary: input.summary || null,
          readyForArticle: input.readyForArticle ?? 0,
          processedAt: new Date(),
        })
        .where(eq(insightTips.id, input.id));

      return { success: true };
    }),

  /** Admin: get one tip by ID. */
  adminGetTip: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      const db = await requireDb();
      const [tip] = await db.select().from(insightTips).where(eq(insightTips.id, input.id)).limit(1);
      return tip ?? null;
    }),

  /** Admin: list all tips marked ready for article. */
  adminReadyForArticle: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    const db = await requireDb();
    return db
      .select()
      .from(insightTips)
      .where(sql`${insightTips.status} = 'verified' AND ${insightTips.readyForArticle} = 1`)
      .orderBy(desc(insightTips.processedAt));
  }),

  /** Admin: publish an article from a verified tip. */
  adminPublishArticle: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      const db = await requireDb();

      // Verify tip exists and is ready for article
      const [tip] = await db.select().from(insightTips).where(eq(insightTips.id, input.id)).limit(1);
      if (!tip) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tip not found" });
      }
      if (tip.status !== "verified" || tip.readyForArticle !== 1) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Tip must be verified and marked ready for article" });
      }

      // Article is now published - in production, this would trigger file creation
      // For now, the article is considered "published" when readyForArticle=1 and status=verified
      return { success: true, id: tip.id };
    }),
});
