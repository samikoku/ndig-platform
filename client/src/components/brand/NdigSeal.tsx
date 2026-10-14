import { useId } from "react";
import { GOLD, NIGERIA_PATH, SHIELD_INNER, SHIELD_OUTER, arrowPaths } from "./shieldGeometry";

/**
 * NDIG "VERIFIED BY NDIG" seal — the production asset (vector; no raster seal ships).
 *
 * Drawn to the approved seal render: scalloped edge, milled (reeded) band, serif
 * inscriptions on both arcs, double-outlined shield with Nigeria outline and ten
 * radiating arrows, struck-metal emboss and light wear.
 *
 * Usage rule: the seal appears on numbered NDIG dossiers and NDIG-issued
 * materials. Hero placement approved by the Chairman, Oct 2026.
 *
 * Variants
 *  - "master": full seal with inscriptions (hero, verify page, og-image)
 *  - "small":  no inscriptions, heavier strokes; 64px and below (card corner, favicon)
 *  - "mono":   single colour in currentColor (print, stamps on light paper)
 */
type Variant = "master" | "small" | "mono";

interface NdigSealProps {
  variant?: Variant;
  className?: string;
  /** Accessible label. Pass "" to mark the seal decorative. */
  title?: string;
}

const C = 200;
const SERIF = "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";

/* Scalloped edge: 64 rounded lobes. */
function scallopPath(lobes: number, rPeak: number, rValley: number) {
  const pt = (a: number, r: number) => `${(C + r * Math.cos(a)).toFixed(2)} ${(C + r * Math.sin(a)).toFixed(2)}`;
  const step = (Math.PI * 2) / lobes;
  let d = `M ${pt(-Math.PI / 2, rValley)}`;
  for (let i = 0; i < lobes; i++) {
    const a0 = -Math.PI / 2 + i * step;
    const a1 = a0 + step;
    const am = a0 + step / 2;
    // Cubic gives a rounded lobe like the struck edge in the render.
    const c1 = pt(a0 + step * 0.08, rPeak + 3.5);
    const c2 = pt(a1 - step * 0.08, rPeak + 3.5);
    d += ` C ${c1} ${c2} ${pt(a1, rValley)}`;
    void am;
  }
  return `${d} Z`;
}
const SCALLOPS = scallopPath(64, 194, 186);

/* Milled band: 200 short radial reeds. */
const REEDS = (() => {
  let d = "";
  for (let i = 0; i < 200; i++) {
    const a = (i / 200) * Math.PI * 2;
    const x1 = C + 172 * Math.cos(a), y1 = C + 172 * Math.sin(a);
    const x2 = C + 182 * Math.cos(a), y2 = C + 182 * Math.sin(a);
    d += `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  return d;
})();

/* Light wear: deterministic speckle (no filters, so it costs nothing to paint). */
const WEAR = (() => {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const dots: Array<[number, number, number, number]> = [];
  for (let i = 0; i < 140; i++) {
    const r = Math.sqrt(rnd()) * 168;
    const a = rnd() * Math.PI * 2;
    dots.push([C + r * Math.cos(a), C + r * Math.sin(a), 0.4 + rnd() * 1.1, 0.12 + rnd() * 0.18]);
  }
  return dots;
})();

const ARROWS = arrowPaths(undefined, undefined, 15);
// Merged into two paths so the seal stays a handful of DOM nodes (keeps main-thread work low).
const ARROW_LINES = ARROWS.map((a) => a.line).join(" ");
const ARROW_HEADS = ARROWS.map((a) => a.head).join(" ");
const circlePath = (x: number, y: number, r: number) =>
  `M${(x - r).toFixed(1)} ${y.toFixed(1)}a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(2 * r).toFixed(2)} 0a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-2 * r).toFixed(2)} 0`;
const WEAR_LIGHT = WEAR.filter((d) => d[3] < 0.21).map(([x, y, r]) => circlePath(x, y, r)).join("");
const WEAR_DARK = WEAR.filter((d) => d[3] >= 0.21).map(([x, y, r]) => circlePath(x, y, r)).join("");

export default function NdigSeal({ variant = "master", className, title = "Verified by NDIG seal" }: NdigSealProps) {
  const uid = useId().replace(/:/g, "");
  const id = (s: string) => `${s}-${uid}`;
  const mono = variant === "mono";
  const small = variant === "small";
  const lettering = !small;

  const metal = mono ? "currentColor" : `url(#${id("metal")})`;
  const field = mono ? "none" : `url(#${id("field")})`;
  const hi = mono ? "#fff" : GOLD.hi;
  const lo = mono ? "currentColor" : GOLD.deep;
  const line = mono ? "#fff" : GOLD.dark;

  /** Struck emboss: shadow below-right, highlight above-left, then the face. */
  const Emboss = ({ children, depth = 1.4 }: { children: React.ReactNode; depth?: number }) =>
    mono ? (
      <>{children}</>
    ) : (
      <>
        <g transform={`translate(${depth * 0.7} ${depth})`} opacity="0.8" style={{ color: GOLD.deep }}>{children}</g>
        <g transform={`translate(${-depth * 0.45} ${-depth * 0.6})`} opacity="0.9" style={{ color: GOLD.hi }}>{children}</g>
        <g style={{ color: GOLD.face }}>{children}</g>
      </>
    );

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        {!mono && (
          <>
            <radialGradient id={id("metal")} cx="34%" cy="26%" r="90%">
              <stop offset="0" stopColor={GOLD.hi} />
              <stop offset="0.3" stopColor={GOLD.light} />
              <stop offset="0.6" stopColor={GOLD.base} />
              <stop offset="0.85" stopColor={GOLD.mid} />
              <stop offset="1" stopColor={GOLD.dark} />
            </radialGradient>
            <radialGradient id={id("field")} cx="36%" cy="28%" r="90%">
              <stop offset="0" stopColor={GOLD.hi} />
              <stop offset="0.4" stopColor={GOLD.light} />
              <stop offset="0.8" stopColor={GOLD.base} />
              <stop offset="1" stopColor={GOLD.mid} />
            </radialGradient>
            <linearGradient id={id("shieldShade")} x1="0" y1="0" x2="1" y2="0.3">
              <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor={GOLD.deep} stopOpacity="0.1" />
              <stop offset="1" stopColor={GOLD.deep} stopOpacity="0.32" />
            </linearGradient>
            <linearGradient id={id("sheen")} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
              <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
              <stop offset="1" stopColor={GOLD.deep} stopOpacity="0.18" />
            </linearGradient>
          </>
        )}
        <path id={id("arcTop")} d={`M ${C - 141} ${C} A 141 141 0 0 1 ${C + 141} ${C}`} />
        <path id={id("arcBottom")} d={`M ${C - 153} ${C} A 153 153 0 0 0 ${C + 153} ${C}`} />
      </defs>

      {/* Edge, milled band and rims */}
      <path d={SCALLOPS} fill={metal} stroke={lo} strokeOpacity={mono ? 0 : 0.45} strokeWidth="1" />
      {!mono && <path d={SCALLOPS} fill={`url(#${id("sheen")})`} />}
      <circle cx={C} cy={C} r={183} fill="none" stroke={line} strokeWidth={small ? 2.5 : 1.6} />
      {!small && <path d={REEDS} stroke={mono ? "#fff" : GOLD.dark} strokeOpacity={mono ? 0.9 : 0.75} strokeWidth="1.2" />}
      <circle cx={C} cy={C} r={171} fill={field} stroke={line} strokeWidth={small ? 2.5 : 1.8} />
      {!mono && <circle cx={C} cy={C} r={169} fill="none" stroke={GOLD.hi} strokeOpacity="0.7" strokeWidth="1.2" />}

      {/* Inscriptions */}
      {lettering && (
        <g fontFamily={SERIF} fontWeight={700}>
          <Emboss depth={2.1}>
            <text fontSize="37" textLength="372" lengthAdjust="spacing" textAnchor="middle" fill="currentColor">
              <textPath href={`#${id("arcTop")}`} startOffset="50%">VERIFIED BY NDIG</textPath>
            </text>
            <text fontSize="23.5" textLength="452" lengthAdjust="spacing" textAnchor="middle" fill="currentColor">
              <textPath href={`#${id("arcBottom")}`} startOffset="50%">The Nigeria Diaspora Investment Gateway</textPath>
            </text>
          </Emboss>
          {mono && (
            <g fill="#fff">
              <text fontSize="37" textLength="372" lengthAdjust="spacing" textAnchor="middle">
                <textPath href={`#${id("arcTop")}`} startOffset="50%">VERIFIED BY NDIG</textPath>
              </text>
              <text fontSize="23.5" textLength="452" lengthAdjust="spacing" textAnchor="middle">
                <textPath href={`#${id("arcBottom")}`} startOffset="50%">The Nigeria Diaspora Investment Gateway</textPath>
              </text>
            </g>
          )}
        </g>
      )}
      {lettering && (
        <>
          <circle cx={C} cy={C} r={124} fill="none" stroke={line} strokeWidth="1.8" />
          {!mono && <circle cx={C} cy={C} r={121.5} fill="none" stroke={GOLD.hi} strokeOpacity="0.6" strokeWidth="1.1" />}
        </>
      )}

      {/* Shield, Nigeria, arrows */}
      <g transform={small ? "translate(200 202) scale(1.28) translate(-200 -202)" : undefined}>
        {!mono && <path d={SHIELD_INNER} fill={`url(#${id("shieldShade")})`} transform={small ? undefined : undefined} />}
        <Emboss depth={small ? 1.3 : 2.2}>
          <path d={SHIELD_OUTER} fill="none" stroke="currentColor" strokeWidth={small ? 5 : 4.4} strokeLinejoin="round" />
          <path d={SHIELD_INNER} fill="none" stroke="currentColor" strokeWidth={small ? 2.6 : 1.8} strokeLinejoin="round" />
          <path d={NIGERIA_PATH} fill="none" stroke="currentColor" strokeWidth={small ? 2.6 : 1.7} strokeLinejoin="round" />
          <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="currentColor">
            <path d={ARROW_LINES} strokeWidth={small ? 4.6 : 3.4} fill="none" />
            <path d={ARROW_HEADS} strokeWidth="1" />
          </g>
          <circle cx="200" cy="195" r={small ? 13 : 12} fill="currentColor" />
        </Emboss>
        {mono && (
          <g stroke="#fff" fill="none" strokeLinejoin="round" strokeLinecap="round">
            <path d={SHIELD_OUTER} strokeWidth="3.2" />
            <path d={SHIELD_INNER} strokeWidth="1.8" />
            <path d={NIGERIA_PATH} strokeWidth="1.7" />
            <path d={ARROW_LINES} strokeWidth="2.6" />
            <path d={ARROW_HEADS} fill="#fff" strokeWidth="1" />
            <circle cx="200" cy="195" r="9.5" fill="#fff" />
          </g>
        )}
      </g>

      {/* Wear */}
      {!mono && !small && (
        <g fill={GOLD.deep}>
          <path d={WEAR_LIGHT} opacity="0.15" />
          <path d={WEAR_DARK} opacity="0.26" />
        </g>
      )}
    </svg>
  );
}
