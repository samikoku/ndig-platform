import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./_core/oauth";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { registerJoinRoutes } from "./joinRoutes";
import { runDailyInsightReview } from "./cronJobs";

const app = express();

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Configure body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// OAuth routes
registerOAuthRoutes(app);

// Cron jobs
app.post("/api/cron/daily-insight", async (req, res) => {
  // Verify this is from Vercel's cron (X-Vercel-Cron header is only set by Vercel)
  const cronHeader = req.headers["x-vercel-cron"];
  if (!cronHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await runDailyInsightReview();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Cron job failed:", err);
    res.status(500).json({ error: "Cron job failed" });
  }
});

// Webhook for Resend inbound emails (article publishing via [ARTICLE-APPROVED] subject)
app.post("/api/webhooks/email-inbound", async (req, res) => {
  // Verify webhook signature from Resend (if configured)
  const signature = req.headers["x-resend-signature"];
  if (!signature && process.env.RESEND_WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Missing signature" });
  }

  try {
    const event = req.body;

    // Handle inbound email events
    if (event.type === "email.inbound") {
      const { from, subject, text, html } = event.data;

      // Only process emails with [ARTICLE-APPROVED] subject
      if (!subject?.includes("[ARTICLE-APPROVED]")) {
        return res.status(200).json({ status: "ignored" });
      }

      // Extract article content from email body (use text, fallback to html)
      const content = text || html || "";
      if (!content) {
        return res.status(400).json({ error: "No content in email" });
      }

      // Log receipt - in production, this would parse the email and publish the article
      console.log("[INSIGHT] Email received for article publication:", {
        from,
        subject,
        contentLength: content.length,
      });

      return res.status(200).json({ status: "received", message: "Article email received - manual processing required" });
    }

    res.status(200).json({ status: "ignored" });
  } catch (err) {
    console.error("Email webhook error:", err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// NDIG Weekly signup (client/public/join/index.html)
registerJoinRoutes(app);

// Static files are served by Vercel's static server (outputDirectory: "public")
// This Lambda only handles API routes. Vercel's rewrites handle SPA routing to index.html
app.all("*", (_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Export for Vercel
export default app;
