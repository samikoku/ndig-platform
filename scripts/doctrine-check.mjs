#!/usr/bin/env node
/**
 * NDIG doctrine check — fails if any banned phrase appears in public copy.
 *
 * Scans the BUILT site (public/), the Concierge knowledge base, outbound email
 * templates and the newsletter archive. Run after `vite build`:
 *   npm run doctrine:check
 *
 * Rules live in BANNED below. Each has a one-line reason (see COPY-DOCTRINE.md).
 * When a new banned phrase is discovered, add it here in the same commit as the fix.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const BANNED = [
  { pattern: /government[\s-]*(backed|endorsed|approved|guaranteed)/i, reason: "NDIG is regulator-vetted, not government-backed or endorsed." },
  { pattern: /state[\s-]*backed|sovereign[\s-]*grade|officially endorsed/i, reason: "Implies state backing NDIG does not have." },
  { pattern: /guaranteed\s+(returns?|yields?|income|profits?|rental)|returns?\s+(are\s+)?guaranteed/i, reason: "No return is guaranteed; NDIG never promises outcomes." },
  { pattern: /risk[\s-]*free|zero[\s-]*risk|no[\s-]*risk/i, reason: "Every investment carries risk." },
  { pattern: /high[\s-]*yield|double your money|attractive returns|projected returns?/i, reason: "NDIG never markets or projects returns." },
  { pattern: /advisory services|investment advisory|exclusive advisory|we advise|our advisers|financial advis[eo]r/i, reason: "NDIG never advises." },
  { pattern: /referral (and information|platform|code)|referral fee paid to ndig|pays ndig a referral/i, reason: "NDIG is a verification institution; the identifier is a Verification Reference." },
  { pattern: /pay(ing)? directly to (the )?(dmo,? )?(banks,? )?(or )?nipc|nipc for projects/i, reason: "NIPC is a promotion agency, not a custodian; money never passes through NIPC or NDIG." },
  { pattern: /350,?000\+?|350k\+?/i, reason: "Unsourced count." },
  { pattern: /thousands of diaspora|millions of diaspora/i, reason: "Unsourced count." },
  { pattern: /act now|limited slots|hurry|last chance|game[\s-]*changer/i, reason: "Pressure language is not NDIG's voice." },
  { pattern: /we sell|buy now through ndig|invest through ndig/i, reason: "NDIG never sells or takes investment." },
];

// `--public <dir>` scans a different built site (e.g. an older build) for comparison.
const pubArg = process.argv.indexOf("--public");
const publicDir = pubArg > -1 ? process.argv[pubArg + 1] : "public";

const TARGETS = [
  { dir: publicDir, exts: [".html", ".js"], required: true },
  { file: "knowledge_base.md" },
  { file: "server/emailTemplates.ts" },
  { file: "server/emailService.ts" },
  { dir: "content/weekly/issues", exts: [".html", ".md"] },
];

function walk(dir, exts, out = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, exts, out);
    else if (exts.includes(path.extname(name))) out.push(p);
  }
  return out;
}

function visibleText(file, raw) {
  // Strip HTML tags so attribute/class names don't create false positives.
  return file.endsWith(".html") ? raw.replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ") : raw;
}

const files = [];
for (const t of TARGETS) {
  if (t.dir) {
    const d = path.resolve(root, t.dir);
    if (!existsSync(d)) {
      if (t.required) {
        console.error(`doctrine:check: ${t.dir}/ not found. Run \`npx vite build\` first.`);
        process.exit(2);
      }
      continue;
    }
    files.push(...walk(d, t.exts));
  } else if (existsSync(path.join(root, t.file))) files.push(path.join(root, t.file));
}

let hits = 0;
for (const f of files) {
  const text = visibleText(f, readFileSync(f, "utf8"));
  for (const rule of BANNED) {
    const re = new RegExp(rule.pattern.source, "gi");
    let m;
    while ((m = re.exec(text))) {
      hits++;
      const ctx = text.slice(Math.max(0, m.index - 60), m.index + m[0].length + 60).replace(/\s+/g, " ");
      console.error(`✗ ${path.relative(root, f)}: "${m[0]}" — ${rule.reason}\n    …${ctx}…`);
    }
  }
}

console.log(`doctrine:check scanned ${files.length} files against ${BANNED.length} rules.`);
if (hits) {
  console.error(`doctrine:check FAILED: ${hits} banned phrase(s). See COPY-DOCTRINE.md.`);
  process.exit(1);
}
console.log("doctrine:check PASSED: no banned phrases.");
