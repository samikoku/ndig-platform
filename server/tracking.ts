import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { referralTracking, investmentFlows, accountLinks } from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * Tracking router for referral tracking, investment flows, and account linking
 */
export const trackingRouter = router({
  /**
   * Generate a unique referral code for tracking external links
   */
  generateReferralCode: publicProcedure
    .input(
      z.object({
        targetType: z.enum(["nrbvn", "nrnia", "bank_account", "diaspora_bond", "other"]),
        targetUrl: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const referralCode = nanoid(10);
      
      await db.insert(referralTracking).values({
        userId: ctx.user?.id || null,
        referralCode,
        targetType: input.targetType,
        targetUrl: input.targetUrl,
        ipAddress: ctx.req?.ip || null,
        userAgent: ctx.req?.headers?.["user-agent"] || null,
      });

      return { referralCode, trackingUrl: `/track/${referralCode}` };
    }),

  /**
   * Track a referral click (called when user clicks tracked link)
   */
  trackClick: publicProcedure
    .input(
      z.object({
        referralCode: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      
      // Update click timestamp
      const [tracking] = await db
        .select()
        .from(referralTracking)
        .where(eq(referralTracking.referralCode, input.referralCode))
        .limit(1);

      if (!tracking) {
        throw new Error("Invalid referral code");
      }

      return { targetUrl: tracking.targetUrl };
    }),

  /**
   * Verify a referral (user confirms they completed the action)
   */
  verifyReferral: protectedProcedure
    .input(
      z.object({
        referralCode: z.string(),
        accountNumber: z.string().optional(),
        verificationProof: z.string().optional(), // URL to uploaded screenshot
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      
      await db
        .update(referralTracking)
        .set({
          verified: 1,
          verifiedAt: new Date(),
        })
        .where(eq(referralTracking.referralCode, input.referralCode));

      return { success: true };
    }),

  /**
   * Get referral statistics for admin dashboard
   */
  getReferralStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    
    const allReferrals = await db
      .select()
      .from(referralTracking)
      .orderBy(desc(referralTracking.clickedAt));

    const stats = {
      total: allReferrals.length,
      verified: allReferrals.filter((r) => r.verified === 1).length,
      byType: {
        nrbvn: allReferrals.filter((r) => r.targetType === "nrbvn").length,
        nrnia: allReferrals.filter((r) => r.targetType === "nrnia").length,
        bank_account: allReferrals.filter((r) => r.targetType === "bank_account").length,
        diaspora_bond: allReferrals.filter((r) => r.targetType === "diaspora_bond").length,
        other: allReferrals.filter((r) => r.targetType === "other").length,
      },
      verifiedByType: {
        nrbvn: allReferrals.filter((r) => r.targetType === "nrbvn" && r.verified === 1).length,
        nrnia: allReferrals.filter((r) => r.targetType === "nrnia" && r.verified === 1).length,
        bank_account: allReferrals.filter((r) => r.targetType === "bank_account" && r.verified === 1).length,
        diaspora_bond: allReferrals.filter((r) => r.targetType === "diaspora_bond" && r.verified === 1).length,
        other: allReferrals.filter((r) => r.targetType === "other" && r.verified === 1).length,
      },
      recent: allReferrals.slice(0, 10),
    };

    return stats;
  }),

  /**
   * Create an investment flow record
   */
  createInvestmentFlow: protectedProcedure
    .input(
      z.object({
        investmentType: z.enum(["diaspora_bond", "real_estate", "energy", "stocks", "other"]),
        amountUSD: z.number().positive(),
        amountNGN: z.number().optional(),
        referralCode: z.string().optional(),
        nrniaAccountNumber: z.string().optional(),
        bankName: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      
      // Calculate fee (2.5% for diaspora bonds, 3% for others)
      const feePercentage = input.investmentType === "diaspora_bond" ? 2.5 : 3.0;
      const feeUSD = Math.round(input.amountUSD * (feePercentage / 100));

      const [flow] = await db.insert(investmentFlows).values({
        userId: ctx.user.id,
        referralCode: input.referralCode,
        investmentType: input.investmentType,
        amountUSD: input.amountUSD,
        amountNGN: input.amountNGN,
        feeUSD,
        feePercentage: `${feePercentage}%`,
        status: "initiated",
        nrniaAccountNumber: input.nrniaAccountNumber,
        bankName: input.bankName,
      });

      return { flowId: flow.insertId, feeUSD, feePercentage };
    }),

  /**
   * Update investment flow status
   */
  updateInvestmentFlow: protectedProcedure
    .input(
      z.object({
        flowId: z.number(),
        status: z.enum(["initiated", "pending_verification", "verified", "completed", "failed"]),
        transactionReference: z.string().optional(),
        verificationProof: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      
      const updateData: any = {
        status: input.status,
      };

      if (input.transactionReference) {
        updateData.transactionReference = input.transactionReference;
      }

      if (input.verificationProof) {
        updateData.verificationProof = input.verificationProof;
      }

      if (input.status === "completed") {
        updateData.completedAt = new Date();
      }

      await db
        .update(investmentFlows)
        .set(updateData)
        .where(and(eq(investmentFlows.id, input.flowId), eq(investmentFlows.userId, ctx.user.id)));

      return { success: true };
    }),

  /**
   * Get user's investment flows
   */
  getMyInvestmentFlows: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    
    const flows = await db
      .select()
      .from(investmentFlows)
      .where(eq(investmentFlows.userId, ctx.user.id))
      .orderBy(desc(investmentFlows.createdAt));

    return flows;
  }),

  /**
   * Get all investment flows (admin only)
   */
  getAllInvestmentFlows: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    
    const flows = await db
      .select()
      .from(investmentFlows)
      .orderBy(desc(investmentFlows.createdAt));

    return flows;
  }),

  /**
   * Get investment flow statistics (admin only)
   */
  getInvestmentStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    
    const allFlows = await db.select().from(investmentFlows);

    const stats = {
      totalInvestments: allFlows.length,
      totalAmountUSD: allFlows.reduce((sum, f) => sum + f.amountUSD, 0),
      totalFeesUSD: allFlows.reduce((sum, f) => sum + f.feeUSD, 0),
      byType: {
        diaspora_bond: allFlows.filter((f) => f.investmentType === "diaspora_bond").length,
        real_estate: allFlows.filter((f) => f.investmentType === "real_estate").length,
        energy: allFlows.filter((f) => f.investmentType === "energy").length,
        stocks: allFlows.filter((f) => f.investmentType === "stocks").length,
        other: allFlows.filter((f) => f.investmentType === "other").length,
      },
      byStatus: {
        initiated: allFlows.filter((f) => f.status === "initiated").length,
        pending_verification: allFlows.filter((f) => f.status === "pending_verification").length,
        verified: allFlows.filter((f) => f.status === "verified").length,
        completed: allFlows.filter((f) => f.status === "completed").length,
        failed: allFlows.filter((f) => f.status === "failed").length,
      },
      completedInvestments: allFlows.filter((f) => f.status === "completed").length,
      completedAmountUSD: allFlows
        .filter((f) => f.status === "completed")
        .reduce((sum, f) => sum + f.amountUSD, 0),
      completedFeesUSD: allFlows
        .filter((f) => f.status === "completed")
        .reduce((sum, f) => sum + f.feeUSD, 0),
    };

    return stats;
  }),

  /**
   * Link an account (NRNIA, NRBVN, etc.)
   */
  linkAccount: protectedProcedure
    .input(
      z.object({
        accountType: z.enum(["nrnia", "nrnoa", "nrbvn", "other"]),
        accountNumber: z.string(),
        bankName: z.string().optional(),
        verificationProof: z.string().optional(), // URL to uploaded document
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      
      const [link] = await db.insert(accountLinks).values({
        userId: ctx.user.id,
        accountType: input.accountType,
        accountNumber: input.accountNumber,
        bankName: input.bankName,
        verificationProof: input.verificationProof,
        verified: input.verificationProof ? 1 : 0,
        verifiedAt: input.verificationProof ? new Date() : null,
      });

      return { linkId: link.insertId };
    }),

  /**
   * Get user's linked accounts
   */
  getMyLinkedAccounts: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    
    const links = await db
      .select()
      .from(accountLinks)
      .where(eq(accountLinks.userId, ctx.user.id))
      .orderBy(desc(accountLinks.createdAt));

    return links;
  }),

  /**
   * Get all linked accounts (admin only)
   */
  getAllLinkedAccounts: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    
    const links = await db
      .select()
      .from(accountLinks)
      .orderBy(desc(accountLinks.createdAt));

    return links;
  }),

  /**
   * Verify a linked account (admin only)
   */
  verifyLinkedAccount: protectedProcedure
    .input(
      z.object({
        linkId: z.number(),
        verified: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Admin access required");
      }

      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      
      await db
        .update(accountLinks)
        .set({
          verified: input.verified ? 1 : 0,
          verifiedAt: input.verified ? new Date() : null,
        })
        .where(eq(accountLinks.id, input.linkId));

      return { success: true };
    }),
});
