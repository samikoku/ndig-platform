import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { z } from "zod";
import { readFileSync } from "fs";
import { join } from "path";
import { getDb } from "./db";
import { interestRegistrations } from "../drizzle/schema";
import { notifyOwner } from "./_core/notification";
import { sendWelcomeEmail, notifyAdminNewRegistration } from "./emailService";
import { TRPCError } from "@trpc/server";
import { eq, desc } from "drizzle-orm";
import { trackingRouter } from "./tracking";

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

          // Insert registration into database
          await db.insert(interestRegistrations).values({
            name: input.name,
            email: input.email,
            location: input.location,
            investmentCapacity: input.investmentCapacity,
            message: input.message || null,
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
              content: `You are the DPIG Concierge, an AI assistant for the Diaspora Productivity & Investment Gateway (DPIG) platform. Your role is to help Nigerian diaspora members understand investment opportunities, government programs, and how to use the platform.

IMPORTANT INSTRUCTIONS:
- Be professional, warm, and encouraging
- Provide accurate information based on the knowledge base below
- If you don't know something, direct users to contact support or visit the relevant strategic partner website
- Always emphasize that DPIG is government-endorsed by NPA, NiDCOM, NIPC, CBN, and SEC
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
});

export type AppRouter = typeof appRouter;
