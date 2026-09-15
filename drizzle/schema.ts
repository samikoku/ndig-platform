import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
/**
 * Interest registrations from potential diaspora investors
 */
export const interestRegistrations = mysqlTable("interest_registrations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  investmentCapacity: varchar("investment_capacity", { length: 100 }).notNull(),
  message: text("message"),
  status: mysqlEnum("status", ["new", "contacted", "qualified", "converted"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type InterestRegistration = typeof interestRegistrations.$inferSelect;
export type InsertInterestRegistration = typeof interestRegistrations.$inferInsert;
/**
 * Investment opportunities available on the platform
 */
export const investmentOpportunities = mysqlTable("investment_opportunities", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: mysqlEnum("category", ["real_estate", "energy", "financial_instrument", "infrastructure", "agriculture"]).notNull(),
  targetYield: varchar("target_yield", { length: 50 }).notNull(),
  minEntry: int("min_entry").notNull(), // in USD
  term: varchar("term", { length: 50 }).notNull(),
  status: mysqlEnum("status", ["open", "closing_soon", "closed", "draft"]).default("draft").notNull(),
  imageUrl: text("image_url"),
  featured: int("featured").default(0).notNull(), // 0 = not featured, 1 = featured
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type InvestmentOpportunity = typeof investmentOpportunities.$inferSelect;
export type InsertInvestmentOpportunity = typeof investmentOpportunities.$inferInsert;
/**
 * Demo mode usage analytics
 */
export const demoAnalytics = mysqlTable("demo_analytics", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  enteredAt: timestamp("entered_at").defaultNow().notNull(),
  exitedAt: timestamp("exited_at"),
  durationSeconds: int("duration_seconds"),
  pagesViewed: int("pages_viewed").default(0).notNull(),
  convertedToRegistration: int("converted_to_registration").default(0).notNull(), // 0 = no, 1 = yes
});
export type DemoAnalytic = typeof demoAnalytics.$inferSelect;
export type InsertDemoAnalytic = typeof demoAnalytics.$inferInsert;
/**
 * Referral tracking for external links (NIBSS, banks, etc.)
 */
export const referralTracking = mysqlTable("referral_tracking", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id"), // null for anonymous clicks
  referralCode: varchar("referral_code", { length: 50 }).notNull().unique(),
  targetType: mysqlEnum("target_type", ["nrbvn", "nrnia", "bank_account", "diaspora_bond", "other"]).notNull(),
  targetUrl: text("target_url").notNull(),
  clickedAt: timestamp("clicked_at").defaultNow().notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  verified: int("verified").default(0).notNull(), // 0 = not verified, 1 = verified
  verifiedAt: timestamp("verified_at"),
});
export type ReferralTracking = typeof referralTracking.$inferSelect;
export type InsertReferralTracking = typeof referralTracking.$inferInsert;
/**
 * Investment flow tracking (remittance → NDIG → investment vehicle)
 */
export const investmentFlows = mysqlTable("investment_flows", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  referralCode: varchar("referral_code", { length: 50 }),
  investmentType: mysqlEnum("investment_type", ["diaspora_bond", "real_estate", "energy", "stocks", "other"]).notNull(),
  amountUSD: int("amount_usd").notNull(),
  amountNGN: int("amount_ngn"),
  feeUSD: int("fee_usd").notNull(),
  feePercentage: varchar("fee_percentage", { length: 10 }).notNull(),
  status: mysqlEnum("status", ["initiated", "pending_verification", "verified", "completed", "failed"]).default("initiated").notNull(),
  nrniaAccountNumber: varchar("nrnia_account_number", { length: 50 }),
  bankName: varchar("bank_name", { length: 255 }),
  transactionReference: varchar("transaction_reference", { length: 255 }),
  verificationProof: text("verification_proof"), // URL to uploaded screenshot/document
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});
export type InvestmentFlow = typeof investmentFlows.$inferSelect;
export type InsertInvestmentFlow = typeof investmentFlows.$inferInsert;
/**
 * User account linking (NRNIA, BVN, etc.)
 */
export const accountLinks = mysqlTable("account_links", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  accountType: mysqlEnum("account_type", ["nrnia", "nrnoa", "nrbvn", "other"]).notNull(),
  accountNumber: varchar("account_number", { length: 50 }).notNull(),
  bankName: varchar("bank_name", { length: 255 }),
  verified: int("verified").default(0).notNull(), // 0 = not verified, 1 = verified
  verificationProof: text("verification_proof"), // URL to uploaded document
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  verifiedAt: timestamp("verified_at"),
});
export type AccountLink = typeof accountLinks.$inferSelect;
export type InsertAccountLink = typeof accountLinks.$inferInsert;