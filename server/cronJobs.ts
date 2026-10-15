import { getDb } from "./db";
import { insightTips } from "../drizzle/schema";
import { sql } from "drizzle-orm";
import { routeInternal } from "./mailRouting";

type Db = NonNullable<Awaited<ReturnType<typeof getDb>>>;

async function ensureInsightTable(db: Db): Promise<void> {
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
}

export async function runDailyInsightReview(): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.error("Database not available for cron job");
    return;
  }

  try {
    await ensureInsightTable(db);

    // Fetch all unprocessed tips
    const unprocessed = await db
      .select()
      .from(insightTips)
      .where(sql`${insightTips.status} = 'unprocessed'`)
      .orderBy(sql`${insightTips.createdAt}`);

    if (unprocessed.length === 0) {
      console.log("No unprocessed insight tips to review");
      return;
    }

    // Generate digest email
    const digestHtml = `
<h2>NDIG Diaspora Insight Daily Review</h2>
<p>You have <strong>${unprocessed.length}</strong> unprocessed ${unprocessed.length === 1 ? "tip" : "tips"} awaiting review.</p>
<table style="width:100%; border-collapse: collapse; margin-top: 1em;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 0.5em; text-align: left; border: 1px solid #ddd;">ID</th>
      <th style="padding: 0.5em; text-align: left; border: 1px solid #ddd;">What</th>
      <th style="padding: 0.5em; text-align: left; border: 1px solid #ddd;">Submitted</th>
    </tr>
  </thead>
  <tbody>
    ${unprocessed
      .map(
        (tip) => `
    <tr style="border: 1px solid #ddd;">
      <td style="padding: 0.5em;">${tip.id}</td>
      <td style="padding: 0.5em;">${tip.what.substring(0, 100)}${tip.what.length > 100 ? "..." : ""}</td>
      <td style="padding: 0.5em;">${new Date(tip.createdAt).toISOString().split("T")[0]}</td>
    </tr>
    `
      )
      .join("")}
  </tbody>
</table>
<p style="margin-top: 1em; font-size: 0.9em; color: #666;">
  Review and process these tips in the admin panel. Mark as verified, flagged, rejected, or needs_human.
</p>
    `;

    // Send to smi@ and info@
    await routeInternal(
      "insight-review",
      `Daily Insight Review: ${unprocessed.length} ${unprocessed.length === 1 ? "tip" : "tips"} awaiting review`,
      digestHtml
    ).catch((err) => {
      console.error("Failed to send digest email:", err);
    });

    console.log(`Daily insight review completed. ${unprocessed.length} tip(s) processed.`);
  } catch (err) {
    console.error("Error in daily insight review:", err);
    throw err;
  }
}
