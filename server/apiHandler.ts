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
