import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { z } from "zod";
import { readFileSync } from "fs";
import { join } from "path";
import { getDb } from "./db";
import {
  interestRegistrations,
  countryAnchorApplications,
  newsletterSignups,
  mentorshipRequests,
  referralTracking,
} from "../drizzle/schema";
import { notifyOwner } from "./_core/notification";
import { sendWelcomeEmail, notifyAdminNewRegistration } from "./emailService";
import { TRPCError } from "@trpc/server";
import { eq, desc, count } from "drizzle-orm";
import { trackingRouter } from "./tracking";
import { randomBytes } from "crypto";

function generateReferralCode() {
  return `NDIG-${randomBytes(4).toString("hex").toUpperCase()}`;
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  interestRegistration: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(2, "Name must be at least 2 characters").max(255),
          email: z.string().email("Invalid email address").max(320),
          location: z.string().min(2, "Location must be at least 2 characters").max(255),
          investmentCapacity: z.string().min(1, "Please select an investment capacity"),
          message: z.string().max(1000).optional(),
          phone: z.string().max(50).optional(),
          country: z.string().max(100).optional(),
          sectorInterest: z.string().max(100).optional(),
          riskAppetite: z.string().max(50).optional(),
          familyInNigeria: z.enum(["yes", "no"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const db = await getDb();
          if (!db) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Database not available",
            });
          }

          const referralCode = generateReferralCode();

          // Insert registration into database
          await db.insert(interestRegistrations).values({
            name: input.name,
            email: input.email,
            location: input.location,
            investmentCapacity: input.investmentCapacity,
            message: input.message || null,
            phone: input.phone || null,
            country: input.country || null,
            sectorInterest: input.sectorInterest || null,
            riskAppetite: input.riskAppetite || null,
            familyInNigeria: input.familyInNigeria || null,
            referralCode,
            status: "new",
          });

          // Send welcome email to registrant
          await sendWelcomeEmail({
            name: input.name,
            email: input.email,
            location: input.location,
            investmentCapacity: input.investmentCapacity,
          });

          // Send notification to admin
          await notifyAdminNewRegistration({
            name: input.name,
            email: input.email,
            location: input.location,
            investmentCapacity: input.investmentCapacity,
          });

          return {
            success: true,
            message: "Thank you for your interest! We'll be in touch soon.",
            referralCode,
          };
        } catch (error) {
          console.error("[Interest Registration Error]", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to submit registration. Please try again.",
          });
        }
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      // Only admins can view registrations
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const registrations = await db
        .select()
        .from(interestRegistrations)
        .orderBy(desc(interestRegistrations.createdAt));

      return registrations;
    }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["new", "contacted", "qualified", "converted"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Only admins can update status
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Admin access required",
          });
        }

        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database not available",
          });
        }

        await db
          .update(interestRegistrations)
          .set({ status: input.status })
          .where(eq(interestRegistrations.id, input.id));

        return { success: true };
      }),

    registerDiasporaBondInterest: publicProcedure
      .input(
        z.object({
          name: z.string().min(2, "Name must be at least 2 characters").max(255),
          email: z.string().email("Invalid email address").max(320),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const db = await getDb();
          if (!db) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Database not available",
            });
          }

          // Insert diaspora bond interest into database
          await db.insert(interestRegistrations).values({
            name: input.name,
            email: input.email,
            location: "Diaspora Bond Interest",
            investmentCapacity: "Diaspora Bond",
            message: "Interested in diaspora bond offerings",
            status: "new",
          });

          // Notify owner
          await notifyOwner({
            title: "New Diaspora Bond Interest Registration",
            content: `${input.name} (${input.email}) has registered interest in diaspora bonds.`,
          });

          return {
            success: true,
            message: "Thank you! We'll notify you when the next diaspora bond offering is announced.",
          };
        } catch (error) {
          console.error("[Diaspora Bond Interest Error]", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to register interest. Please try again.",
          });
        }
      }),
  }),

  chat: router({
    sendMessage: publicProcedure
      .input(
        z.object({
          message: z.string().min(1).max(1000),
          conversationHistory: z.array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          ).optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Load knowledge base
          const knowledgeBasePath = join(process.cwd(), "knowledge_base.md");
          const knowledgeBase = readFileSync(knowledgeBasePath, "utf-8");

          // Build conversation history
          const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
            {
              role: "system",
              content: `You are the NDIG Concierge, an AI assistant for the Nigeria Diaspora Investment Gateway (NDIG) platform. Your role is to help Nigerian diaspora members understand investment opportunities, government programs, and how to use the platform.

IMPORTANT INSTRUCTIONS:
- Be professional, warm, and encouraging
- Provide accurate information based on the knowledge base below
- If you don't know something, direct users to contact support or visit the relevant strategic partner website
- NDIG is an independent referral and information platform, not a government agency - it operates in alignment with NPA, NiDCOM, NIPC, CBN, and SEC regulatory frameworks and never holds investor funds. Never describe NDIG as government-endorsed, government-approved, or government-backed.
- Encourage users to register their interest and explore investment opportunities
- Use clear, accessible language (avoid excessive jargon)

KNOWLEDGE BASE:
${knowledgeBase}

Answer the user's question based on this knowledge base.`,
            },
          ];

          // Add conversation history if provided
          if (input.conversationHistory && input.conversationHistory.length > 0) {
            messages.push(...input.conversationHistory.map(msg => ({
              role: msg.role as "user" | "assistant",
              content: msg.content,
            })));
          }

          // Add current user message
          messages.push({
            role: "user",
            content: input.message,
          });

          // Call LLM
          const response = await invokeLLM({
            messages,
          });

          const assistantMessage = response.choices[0]?.message?.content || "I apologize, but I'm having trouble responding right now. Please try again or contact our support team.";

          return {
            success: true,
            message: assistantMessage,
          };
        } catch (error) {
          console.error("[Chat Error]", error);
          return {
            success: false,
            message: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment or contact our support team for immediate assistance.",
          };
        }
      }),
  }),

  tracking: trackingRouter,

  countryAnchor: router({
    apply: publicProcedure
      .input(
        z.object({
          name: z.string().min(2).max(255),
          email: z.string().email().max(320),
          phone: z.string().min(3).max(50),
          countryOfResidence: z.string().min(2).max(100),
          yearsInDiaspora: z.string().min(1).max(50),
          professionalBackground: z.string().min(10).max(2000),
          communityInvolvement: z.string().max(2000).optional(),
          whyNdig: z.string().min(10).max(2000),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const db = await getDb();
          if (!db) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
          }

          await db.insert(countryAnchorApplications).values({
            name: input.name,
            email: input.email,
            phone: input.phone,
            countryOfResidence: input.countryOfResidence,
            yearsInDiaspora: input.yearsInDiaspora,
            professionalBackground: input.professionalBackground,
            communityInvolvement: input.communityInvolvement || null,
            whyNdig: input.whyNdig,
            status: "new",
          });

          await notifyOwner({
            title: "New Country Anchor Application",
            content: `${input.name} (${input.email}) from ${input.countryOfResidence} applied to become a Country Anchor.`,
          });

          return { success: true, message: "Thank you for applying. Our team will be in touch." };
        } catch (error) {
          console.error("[Country Anchor Application Error]", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to submit application. Please try again." });
        }
      }),
  }),

  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({ email: z.string().email().max(320) }))
      .mutation(async ({ input }) => {
        try {
          const db = await getDb();
          if (!db) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
          }

          await db.insert(newsletterSignups).values({ email: input.email }).onConflictDoNothing();

          return { success: true, message: "You're subscribed." };
        } catch (error) {
          console.error("[Newsletter Signup Error]", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to subscribe. Please try again." });
        }
      }),
  }),

  mentorship: router({
    request: publicProcedure
      .input(
        z.object({
          name: z.string().min(2).max(255),
          email: z.string().email().max(320),
          role: z.enum(["mentor", "mentee"]),
          areaOfExpertise: z.string().min(2).max(255),
          message: z.string().max(1000).optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const db = await getDb();
          if (!db) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
          }

          await db.insert(mentorshipRequests).values({
            name: input.name,
            email: input.email,
            role: input.role,
            areaOfExpertise: input.areaOfExpertise,
            message: input.message || null,
            status: "new",
          });

          return { success: true, message: "Thanks - we'll match you and follow up by email." };
        } catch (error) {
          console.error("[Mentorship Request Error]", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to submit request. Please try again." });
        }
      }),
  }),

  investmentIndex: router({
    counters: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) {
        return { registrations: 0, nrbvn: 0, nrnia: 0 };
      }

      const [[registrationRow], [nrbvnRow], [nrniaRow]] = await Promise.all([
        db.select({ value: count() }).from(interestRegistrations),
        db.select({ value: count() }).from(referralTracking).where(eq(referralTracking.targetType, "nrbvn")),
        db.select({ value: count() }).from(referralTracking).where(eq(referralTracking.targetType, "nrnia")),
      ]);

      return {
        registrations: registrationRow?.value ?? 0,
        nrbvn: nrbvnRow?.value ?? 0,
        nrnia: nrniaRow?.value ?? 0,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
