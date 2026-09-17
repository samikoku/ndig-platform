import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  console.log("=== serveStatic initialization ===");
  console.log(`CWD: ${process.cwd()}`);
  console.log(`import.meta.dirname: ${import.meta.dirname}`);

  const possiblePaths = [
    path.resolve(import.meta.dirname, "../..", "dist", "public"),
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve("/var/task", "dist", "public"),
  ];

  console.log("Checking possible paths:");
  let distPath = null;
  for (const p of possiblePaths) {
    const exists = fs.existsSync(p);
    console.log(`  ${exists ? "✓" : "✗"} ${p}`);
    if (exists) {
      distPath = p;
    }
  }

  if (!distPath) {
    console.error("Could not find any dist folder!");
    distPath = possiblePaths[0];
  } else {
    console.log(`Using distPath: ${distPath}`);
  }

  app.use(express.static(distPath, { index: false }));

  // fall through to index.html for SPA routing
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    console.log(`Serving index.html from: ${indexPath}`);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.sendFile(indexPath);
  });
}
