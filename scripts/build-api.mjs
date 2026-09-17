import { build } from "esbuild";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf-8"));
const external = Object.keys(pkg.dependencies || {});

// Bundle server/apiHandler.ts (and every local server/shared import it
// pulls in) into a single self-contained api/index.js. Vercel's Node
// builder does not reliably trace/include our local relative imports
// (server/_core/* etc.) when deploying a raw .ts entry, causing
// ERR_MODULE_NOT_FOUND at runtime in production. The source lives
// outside api/ so the generated api/index.js is the only file Vercel
// ever sees there - no api/index.ts + api/index.js name collision.
await build({
  entryPoints: [path.join(root, "server/apiHandler.ts")],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: path.join(root, "api/index.js"),
  external,
  logLevel: "info",
});

console.log("[build-api] Bundled server/apiHandler.ts -> api/index.js");
