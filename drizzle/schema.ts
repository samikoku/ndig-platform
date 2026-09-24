import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const registrationStatusEnum = pgEnum("registration_status", ["new", "contacted", "qualified", "converted"]);
export const familyInNigeriaEnum = pgEnum("family_in_nigeria", ["yes", "no"]);
export const investmentCategoryEnum = pgEnum("investment_category", ["real_estate", "energy", "financial_instrument", "infrastructure", "agriculture"]);
export const investmentOpportunityStatusEnum = pgEnum("investment_opportunity_status", ["open", "closing_soon", "closed", "draft"]);
export const referralTargetTypeEnum = pgEnum("referral_target_type", ["nrbvn", "nrnia", "bank_account", "diaspora_bond", "other"]);
export const investmentTypeEnum = pgEnum("investment_type", ["diaspora_bond", "real_estate", "energy", "stocks", "other"]);
export const investmentFlowStatusEnum = pgEnum("investment_flow_status", ["initiated", "pending_verification", "verified", "completed", "failed"]);
export const accountTypeEnum = pgEnum("account_type", ["nrnia", "nrnoa", "nrbvn", "other"]);
export const countryAnchorStatusEnum = pgEnum("country_anchor_status", ["new", "reviewing", "approved", "declined"]);
export const mentorshipRoleEnum = pgEnum("mentorship_role", ["mentor", "mentee"]);
export const mentorshipStatusEnum = pgEnum("mentorship_status", ["new", "matched", "closed"]);
export const joinSignupStatusEnum = pgEnum("join_signup_status", ["pending", "confirmed"]);

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
/**
 * Interest registrations from potential diaspora investors
 */
export const interestRegistrations = pgTable("interest_registrations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  investmentCapacity: varchar("investment_capacity", { length: 100 }).notNull(),
  message: text("message"),
  phone: varchar("phone", { length: 50 }),
  country: varchar("country", { length: 100 }),
  sectorInterest: varchar("sector_interest", { length: 100 }),
  riskAppetite: varchar("risk_appetite", { length: 50 }),
  familyInNigeria: familyInNigeriaEnum("family_in_nigeria"),
  referralCode: varchar("referral_code", { length: 50 }).unique(),
  status: registrationStatusEnum("status").default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type InterestRegistration = typeof interestRegistrations.$inferSelect;
export type InsertInterestRegistration = typeof interestRegistrations.$inferInsert;
/**
 * Investment opportunities available on the platform
 */
export const investmentOpportunities = pgTable("investment_opportunities", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: investmentCategoryEnum("category").notNull(),
  targetYield: varchar("target_yield", { length: 50 }).notNull(),
  minEntry: integer("min_entry").notNull(), // in USD
  term: varchar("term", { length: 50 }).notNull(),
  status: investmentOpportunityStatusEnum("status").default("draft").notNull(),
  imageUrl: text("image_url"),
  featured: integer("featured").default(0).notNull(), // 0 = not featured, 1 = featured
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});
export type InvestmentOpportunity = typeof investmentOpportunities.$inferSelect;
export type InsertInvestmentOpportunity = typeof investmentOpportunities.$inferInsert;
/**
 * Demo mode usage analytics
 */
export const demoAnalytics = pgTable("demo_analytics", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  enteredAt: timestamp("entered_at").defaultNow().notNull(),
  exitedAt: timestamp("exited_at"),
  durationSeconds: integer("duration_seconds"),
  pagesViewed: integer("pages_viewed").default(0).notNull(),
  convertedToRegistration: integer("converted_to_registration").default(0).notNull(), // 0 = no, 1 = yes
});
export type DemoAnalytic = typeof demoAnalytics.$inferSelect;
export type InsertDemoAnalytic = typeof demoAnalytics.$inferInsert;
/**
 * Referral tracking for external links (NIBSS, banks, etc.)
 */
export const referralTracking = pgTable("referral_tracking", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"), // null for anonymous clicks
  referralCode: varchar("referral_code", { length: 50 }).notNull().unique(),
  targetType: referralTargetTypeEnum("target_type").notNull(),
  targetUrl: text("target_url").notNull(),
  clickedAt: timestamp("clicked_at").defaultNow().notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  verified: integer("verified").default(0).notNull(), // 0 = not verified, 1 = verified
  verifiedAt: timestamp("verified_at"),
});
export type ReferralTracking = typeof referralTracking.$inferSelect;
export type InsertReferralTracking = typeof referralTracking.$inferInsert;
/**
 * Investment flow tracking (remittance → NDIG → investment vehicle)
 */
export const investmentFlows = pgTable("investment_flows", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  referralCode: varchar("referral_code", { length: 50 }),
  investmentType: investmentTypeEnum("investment_type").notNull(),
  amountUSD: integer("amount_usd").notNull(),
  amountNGN: integer("amount_ngn"),
  feeUSD: integer("fee_usd").notNull(),
  feePercentage: varchar("fee_percentage", { length: 10 }).notNull(),
  status: investmentFlowStatusEnum("status").default("initiated").notNull(),
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
export const accountLinks = pgTable("account_links", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  accountType: accountTypeEnum("account_type").notNull(),
  accountNumber: varchar("account_number", { length: 50 }).notNull(),
  bankName: varchar("bank_name", { length: 255 }),
  verified: integer("verified").default(0).notNull(), // 0 = not verified, 1 = verified
  verificationProof: text("verification_proof"), // URL to uploaded document
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  verifiedAt: timestamp("verified_at"),
});
export type AccountLink = typeof accountLinks.$inferSelect;
export type InsertAccountLink = typeof accountLinks.$inferInsert;
/**
 * Country Anchor applications
 */
export const countryAnchorApplications = pgTable("country_anchor_applications", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  countryOfResidence: varchar("country_of_residence", { length: 100 }).notNull(),
  yearsInDiaspora: varchar("years_in_diaspora", { length: 50 }).notNull(),
  professionalBackground: text("professional_background").notNull(),
  communityInvolvement: text("community_involvement"),
  whyNdig: text("why_ndig").notNull(),
  status: countryAnchorStatusEnum("status").default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CountryAnchorApplication = typeof countryAnchorApplications.$inferSelect;
export type InsertCountryAnchorApplication = typeof countryAnchorApplications.$inferInsert;
/**
 * Newsletter signups
 */
export const newsletterSignups = pgTable("newsletter_signups", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type NewsletterSignup = typeof newsletterSignups.$inferSelect;
export type InsertNewsletterSignup = typeof newsletterSignups.$inferInsert;
/**
 * NDIG Weekly signups from the /join landing page, with double opt-in confirmation.
 * Table is bootstrapped at request time via raw SQL (see server/joinSignups.ts) rather
 * than a drizzle-kit migration, since DATABASE_URL isn't available in every environment
 * that edits this schema. Reconcile with a proper migration when convenient.
 */
export const joinSignups = pgTable("join_signups", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  country: varchar("country", { length: 120 }).notNull(),
  association: varchar("association", { length: 200 }),
  source: varchar("source", { length: 120 }).default("/join").notNull(),
  status: joinSignupStatusEnum("status").default("pending").notNull(),
  confirmationToken: varchar("confirmationToken", { length: 64 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  confirmedAt: timestamp("confirmedAt"),
  briefSentAt: timestamp("briefSentAt"),
  nextWeeklyAt: timestamp("nextWeeklyAt"),
  lastWeeklySentAt: timestamp("lastWeeklySentAt"),
  unsubscribedAt: timestamp("unsubscribedAt"),
  lastWeeklyIssue: integer("lastWeeklyIssue"),
});
/**
 * One row per NDIG Weekly issue actually sent. Bootstrapped at request time like join_signups.
 * The permanent browsable copy also lives in the repo at archive/weekly/ (see server/weeklyArchive.ts).
 */
export const weeklyIssues = pgTable("weekly_issues", {
  id: serial("id").primaryKey(),
  issueNumber: integer("issueNumber").notNull().unique(),
  contentHash: varchar("contentHash", { length: 64 }).notNull().unique(),
  subject: text("subject").notNull(),
  bodyHtml: text("bodyHtml").notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  recipientCount: integer("recipientCount").default(0).notNull(),
  archivedAt: timestamp("archivedAt"),
  archivePath: varchar("archivePath", { length: 200 }),
});
export type WeeklyIssue = typeof weeklyIssues.$inferSelect;
export type JoinSignup = typeof joinSignups.$inferSelect;
export type InsertJoinSignup = typeof joinSignups.$inferInsert;
/**
 * Productivity Network mentorship requests
 */
export const mentorshipRequests = pgTable("mentorship_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  role: mentorshipRoleEnum("role").notNull(),
  areaOfExpertise: varchar("area_of_expertise", { length: 255 }).notNull(),
  message: text("message"),
  status: mentorshipStatusEnum("status").default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type MentorshipRequest = typeof mentorshipRequests.$inferSelect;
export type InsertMentorshipRequest = typeof mentorshipRequests.$inferInsert;
