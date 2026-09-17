import { build } from "esbuild";
import { readFileSync, rmSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf-8"));
const external = Object.keys(pkg.dependencies || {});

// Bundle api/index.ts (and every local server/shared import it pulls in)
// into a single self-contained file. Vercel's Node builder does not
// reliably trace/include our local relative imports (server/_core/*
// etc.) when deploying api/index.ts as-is, causing ERR_MODULE_NOT_FOUND
// at runtime in production. Bundling removes the need for that trace -
// only actual node_modules packages stay external.
await build({
  entryPoints: [path.join(root, "api/index.ts")],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: path.join(root, "api/index.js"),
  external,
  logLevel: "info",
});

rmSync(path.join(root, "api/index.ts"));
console.log("[build-api] Bundled api/index.ts -> api/index.js");
