import { getDb } from "../db";
import { sql } from "drizzle-orm";

/**
 * One-time additive migration runner for launch-readiness features.
 * Idempotent: safe to call more than once. Delete this file and its
 * caller in api/index.ts once the migration has been confirmed applied.
 */
export async function runPendingMigration() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const applied: string[] = [];

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS country_anchor_applications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(320) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      country_of_residence VARCHAR(100) NOT NULL,
      years_in_diaspora VARCHAR(50) NOT NULL,
      professional_background TEXT NOT NULL,
      community_involvement TEXT,
      why_ndig TEXT NOT NULL,
      status ENUM('new','reviewing','approved','declined') NOT NULL DEFAULT 'new',
      createdAt TIMESTAMP NOT NULL DEFAULT (now())
    )
  `);
  applied.push("country_anchor_applications");

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS mentorship_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(320) NOT NULL,
      role ENUM('mentor','mentee') NOT NULL,
      area_of_expertise VARCHAR(255) NOT NULL,
      message TEXT,
      status ENUM('new','matched','closed') NOT NULL DEFAULT 'new',
      createdAt TIMESTAMP NOT NULL DEFAULT (now())
    )
  `);
  applied.push("mentorship_requests");

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS newsletter_signups (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(320) NOT NULL UNIQUE,
      createdAt TIMESTAMP NOT NULL DEFAULT (now())
    )
  `);
  applied.push("newsletter_signups");

  const newColumns: Array<{ name: string; ddl: string }> = [
    { name: "phone", ddl: "ADD COLUMN phone VARCHAR(50)" },
    { name: "country", ddl: "ADD COLUMN country VARCHAR(100)" },
    { name: "sector_interest", ddl: "ADD COLUMN sector_interest VARCHAR(100)" },
    { name: "risk_appetite", ddl: "ADD COLUMN risk_appetite VARCHAR(50)" },
    { name: "family_in_nigeria", ddl: "ADD COLUMN family_in_nigeria ENUM('yes','no')" },
    { name: "referral_code", ddl: "ADD COLUMN referral_code VARCHAR(50) UNIQUE" },
  ];

  const existing = await db.execute(sql`
    SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'interest_registrations'
  `);
  const existingNames = new Set(
    (existing[0] as unknown as Array<{ COLUMN_NAME: string }>).map((r) => r.COLUMN_NAME)
  );

  for (const col of newColumns) {
    if (!existingNames.has(col.name)) {
      await db.execute(sql.raw(`ALTER TABLE interest_registrations ${col.ddl}`));
      applied.push(`interest_registrations.${col.name}`);
    }
  }

  return { success: true, applied };
}
