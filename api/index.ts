import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../server/_core/oauth";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import path from "path";
import fs from "fs";
import type { VercelRequest, VercelResponse } from "@vercel/node";

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

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Serve static files - try all possible dist locations
function setupStaticFiles() {
  const cwd = process.cwd();
  console.log(`[STATIC] CWD: ${cwd}`);
  console.log(`[STATIC] __dirname: ${__dirname}`);

  const distPaths = [
    path.join(__dirname, "..", "public"),
    path.join(cwd, "public"),
    path.join("/var/task", "public"),
  ];

  let distPath = null;
  for (const p of distPaths) {
    console.log(`[STATIC] Checking: ${p} - exists: ${fs.existsSync(p)}`);
    if (fs.existsSync(p)) {
      distPath = p;
      console.log(`[STATIC] ✓ Found dist at: ${distPath}`);
      break;
    }
  }

  if (distPath && fs.existsSync(distPath)) {
    console.log(`[STATIC] Setting up express.static(${distPath})`);
    app.use(express.static(distPath, { index: false }));

    app.get("*", (_req, res) => {
      const indexPath = path.join(distPath, "index.html");
      console.log(`[STATIC] Serving ${indexPath}`);
      res.sendFile(indexPath);
    });
  } else {
    console.error(`[STATIC] Could not find dist folder in any location`);
    // Fallback: serve a basic HTML error page
    app.get("*", (_req, res) => {
      res.type("text/html").send("<h1>Dist folder not found</h1>");
    });
  }
}

setupStaticFiles();

// Export for Vercel
export default app;
