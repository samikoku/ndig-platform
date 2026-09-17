import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./_core/oauth";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { runPendingMigration } from "./_core/migrate";

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

// One-time, secret-gated schema migration runner. Remove after use.
app.post("/api/migrate", async (req, res) => {
  if (!process.env.MIGRATION_SECRET || req.headers["x-migration-secret"] !== process.env.MIGRATION_SECRET) {
    return res.status(404).json({ error: "Not Found" });
  }
  try {
    const result = await runPendingMigration();
    res.status(200).json(result);
  } catch (error) {
    console.error("[Migration Error]", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Migration failed" });
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

// Static files are served by Vercel's static server (outputDirectory: "public")
// This Lambda only handles API routes. Vercel's rewrites handle SPA routing to index.html
app.all("*", (_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Export for Vercel
export default app;
