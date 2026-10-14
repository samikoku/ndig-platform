#!/usr/bin/env node
/**
 * Generates every brand file from the vector components — the components are the
 * production assets; nothing here is hand-drawn or raster-sourced.
 *
 *   npm run brand:assets
 *
 * Writes:
 *   client/public/brand/seal-master.svg, seal-small.svg, seal-mono.svg,
 *   shield-mark.svg, watermark-shield.svg, gold-ring.svg
 *   client/public/favicon.svg (from the small seal)
 *   client/public/favicon.ico, favicon-32.png, favicon-64.png, favicon-192.png,
 *   apple-touch-icon.png, og-image.jpg (1200x630, approved hero composition)
 *
 * SVGs need only Node. The raster files need Playwright + Chromium; if they are not
 * installed the script writes the SVGs and says which raster files it skipped.
 */
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { mkdirSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

globalThis.React = React; // components are compiled with the classic JSX runtime here
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = path.join(root, "client/public");
const brand = path.join(pub, "brand");
mkdirSync(brand, { recursive: true });

const { default: NdigSeal } = await import("../client/src/components/brand/NdigSeal.tsx");
const { default: NdigShieldMark } = await import("../client/src/components/brand/NdigShieldMark.tsx");
const { NdigWatermark, GoldRing } = await import("../client/src/components/brand/NdigWatermark.tsx");
const { HOME } = await import("../client/src/config/siteCopy.ts");

const xml = (el, extra = "") =>
  renderToStaticMarkup(el).replace("<svg ", `<svg xmlns="http://www.w3.org/2000/svg" ${extra}`);

const files = {
  "brand/seal-master.svg": xml(React.createElement(NdigSeal, { variant: "master", title: "Verified by NDIG seal" })),
  "brand/seal-small.svg": xml(React.createElement(NdigSeal, { variant: "small", title: "Verified by NDIG seal" })),
  "brand/seal-mono.svg": xml(React.createElement(NdigSeal, { variant: "mono", title: "Verified by NDIG seal" }), 'color="#03381d" '),
  "brand/shield-mark.svg": xml(React.createElement(NdigShieldMark, { field: "#0b6b3a" })),
  "brand/watermark-shield.svg": xml(React.createElement(NdigWatermark, {})),
  "brand/gold-ring.svg": xml(React.createElement(GoldRing, { opacity: 1 })),
  "favicon.svg": xml(React.createElement(NdigSeal, { variant: "small", title: "" })),
};
for (const [rel, svg] of Object.entries(files)) {
  writeFileSync(path.join(pub, rel), svg + "\n");
  console.log("wrote", rel);
}

// ---- Raster outputs -------------------------------------------------------
let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  // Fall back to a globally installed Playwright (NODE_PATH).
  const { createRequire } = await import("module");
  const req = createRequire(import.meta.url);
  for (const dir of (process.env.NODE_PATH || "").split(path.delimiter).filter(Boolean)) {
    try { ({ chromium } = req(req.resolve("playwright", { paths: [dir] }))); break; } catch {}
  }
}
if (!chromium) {
  console.warn("Playwright not installed: skipped favicon PNG/ICO, apple-touch-icon and og-image.jpg.");
  process.exit(0);
}
const exe = process.env.CHROME_PATH || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const page = await browser.newPage({ deviceScaleFactor: 1 });

async function shot(html, w, h, out, opts = {}) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<!doctype html><html><head><style>html,body{margin:0;background:transparent}</style></head><body>${html}</body></html>`);
  await page.waitForTimeout(150);
  return page.screenshot({ path: out, omitBackground: true, ...opts });
}

const smallSeal = files["favicon.svg"].replace("<svg ", '<svg width="100%" height="100%" ');
for (const n of [32, 64, 192]) {
  await shot(`<div style="width:${n}px;height:${n}px">${smallSeal}</div>`, n, n, path.join(pub, `favicon-${n}.png`));
}
await shot(`<div style="width:180px;height:180px;background:#03381d;display:flex;align-items:center;justify-content:center"><div style="width:150px;height:150px">${smallSeal}</div></div>`, 180, 180, path.join(pub, "apple-touch-icon.png"));

// favicon.ico: PNG-in-ICO container with 16/32/48/64 entries.
const icoSizes = [16, 32, 48, 64];
const pngs = [];
for (const n of icoSizes) pngs.push(await shot(`<div style="width:${n}px;height:${n}px">${smallSeal}</div>`, n, n, undefined));
const header = Buffer.alloc(6 + 16 * pngs.length);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
let offset = header.length;
pngs.forEach((png, i) => {
  const e = 6 + i * 16, n = icoSizes[i];
  header.writeUInt8(n, e); header.writeUInt8(n, e + 1); header.writeUInt8(0, e + 2); header.writeUInt8(0, e + 3);
  header.writeUInt16LE(1, e + 4); header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(png.length, e + 8); header.writeUInt32LE(offset, e + 12);
  offset += png.length;
});
writeFileSync(path.join(pub, "favicon.ico"), Buffer.concat([header, ...pngs]));
console.log("wrote favicon PNGs, favicon.ico, apple-touch-icon.png");

// og-image: approved hero composition (badge, headline, seal + ring + glow). Seal never taller than the text block.
const master = files["brand/seal-master.svg"].replace("<svg ", '<svg style="position:relative;width:88%;height:88%;filter:drop-shadow(0 10px 18px rgba(0,0,0,.35))" ');
const ring = files["brand/gold-ring.svg"].replace("<svg ", '<svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.35" ');
const og = `<div style="width:1200px;height:630px;background:#03381d;position:relative;overflow:hidden;color:#F7F5EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif">
  <div id="t" style="position:absolute;left:80px;top:50%;transform:translateY(-50%);width:560px">
    <div style="color:#C9A227;font-size:17px;letter-spacing:.12em;text-transform:uppercase;font-weight:500;margin-bottom:24px">${HOME.hero.badge}</div>
    <div style="font-family:ui-serif,Georgia,Cambria,'Times New Roman',Times,serif;font-size:58px;line-height:1.12">${HOME.hero.headline}</div>
    <div style="margin-top:30px;font-size:20px;color:rgba(247,245,239,.8);letter-spacing:.04em">ndigateway.org</div>
  </div>
  <div id="s" style="position:absolute;right:100px;top:50%;transform:translateY(-50%);display:flex;align-items:center;justify-content:center;border-radius:50%;background:radial-gradient(circle,rgba(201,162,39,.18) 0%,rgba(201,162,39,.06) 45%,transparent 70%)">${ring}${master}</div>
</div>`;
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(`<!doctype html><html><head><style>html,body{margin:0}</style></head><body>${og}</body></html>`);
// Size the seal to the text block height.
await page.evaluate(() => {
  const h = document.getElementById("t").getBoundingClientRect().height;
  const s = document.getElementById("s");
  s.style.width = s.style.height = `${Math.floor(h)}px`;
});
await page.waitForTimeout(150);
await page.screenshot({ path: path.join(pub, "og-image.jpg"), type: "jpeg", quality: 88 });
console.log("wrote og-image.jpg (1200x630)");
await browser.close();
