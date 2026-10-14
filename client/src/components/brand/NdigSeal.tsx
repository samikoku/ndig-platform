import { useId } from "react";

/**
 * NDIG "VERIFIED BY NDIG" seal.
 *
 * Single source of truth for the seal on the site (hero, dossier cards, verify page,
 * favicon/og render). Vector so it stays sharp from 16px to hero scale.
 *
 * Usage rule (design handover): the seal appears on real, numbered verification
 * dossiers and earned materials. Hero placement approved by the Chairman, Oct 2026.
 *
 * Variants
 *  - "master": full metallic seal with ring lettering (hero, verify page)
 *  - "small":  64px-and-under version, no lettering (dossier card corner, favicon)
 *  - "mono":   single-colour version in currentColor (print, dark-on-light marks)
 */
type Variant = "master" | "small" | "mono";

interface NdigSealProps {
  variant?: Variant;
  className?: string;
  /** Accessible label. Pass "" to mark the seal decorative. */
  title?: string;
}

// Gold scale derived from brand gold #C9A227 (metallic shading only).
const GOLD = { hi: "#F0D981", light: "#DFC055", base: "#C9A227", mid: "#A9861A", dark: "#7C620F", deep: "#4F3E08" };

const C = 200; // viewBox centre
const TEETH = 54;

function rosettePoints(outer: number, inner: number) {
  const pts: string[] = [];
  for (let i = 0; i < TEETH * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / TEETH - Math.PI / 2;
    pts.push(`${(C + r * Math.cos(a)).toFixed(2)},${(C + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

const ROSETTE = rosettePoints(197, 184);

// Simplified Nigeria silhouette (fits a ~96x82 box), positioned inside the shield.
const NIGERIA =
  "M4 31 L7 19 L13 13 L21 11 L29 6 L38 9 L46 4 L56 7 L66 4 L76 7 L86 2 L93 7 L95 15 L91 23 L93 31 L87 41 L83 51 L77 57 L71 66 L65 70 L61 80 L55 78 L49 82 L43 76 L37 80 L31 74 L24 72 L16 73 L8 72 L6 62 L4 50 L6 40 Z";

const HUB = { x: 200, y: 208 };
// Angle (deg, 0 = east) and length for each radiating arrow, matched to the approved mockup.
const ARROWS: Array<[number, number]> = [
  [-90, 84], [-118, 74], [-62, 74], [-155, 66], [180, 62], [0, 62], [22, 64], [58, 70], [114, 70],
];

function arrow(angle: number, len: number) {
  const a = (angle * Math.PI) / 180;
  const ex = HUB.x + len * Math.cos(a);
  const ey = HUB.y + len * Math.sin(a);
  const head = 12;
  const spread = 0.5;
  const h1x = ex - head * Math.cos(a - spread);
  const h1y = ey - head * Math.sin(a - spread);
  const h2x = ex - head * Math.cos(a + spread);
  const h2y = ey - head * Math.sin(a + spread);
  const sx = HUB.x + 10 * Math.cos(a);
  const sy = HUB.y + 10 * Math.sin(a);
  return {
    line: `M${sx.toFixed(1)} ${sy.toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)}`,
    head: `M${ex.toFixed(1)} ${ey.toFixed(1)} L${h1x.toFixed(1)} ${h1y.toFixed(1)} L${h2x.toFixed(1)} ${h2y.toFixed(1)} Z`,
  };
}

const SHIELD_OUTER = "M200 106 C228 118 256 124 282 126 C284 210 258 266 200 304 C142 266 116 210 118 126 C144 124 172 118 200 106 Z";
const SHIELD_INNER = "M200 118 C225 128 250 133 271 135 C272 208 250 257 200 291 C150 257 128 208 129 135 C150 133 175 128 200 118 Z";

export default function NdigSeal({ variant = "master", className, title = "Verified by NDIG seal" }: NdigSealProps) {
  const uid = useId().replace(/:/g, "");
  const id = (s: string) => `${s}-${uid}`;
  const mono = variant === "mono";
  const lettering = variant !== "small";

  const fillMetal = mono ? "currentColor" : `url(#${id("metal")})`;
  const fillRim = mono ? "currentColor" : `url(#${id("rim")})`;
  const fillField = mono ? "none" : `url(#${id("field")})`;
  const ink = mono ? "currentColor" : GOLD.deep;
  const raised = mono ? "currentColor" : `url(#${id("raised")})`;

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {!mono && (
        <defs>
          <radialGradient id={id("metal")} cx="38%" cy="30%" r="80%">
            <stop offset="0" stopColor={GOLD.light} />
            <stop offset="0.4" stopColor={GOLD.base} />
            <stop offset="0.8" stopColor={GOLD.mid} />
            <stop offset="1" stopColor={GOLD.dark} />
          </radialGradient>
          <linearGradient id={id("rim")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={GOLD.hi} />
            <stop offset="0.5" stopColor={GOLD.base} />
            <stop offset="1" stopColor={GOLD.dark} />
          </linearGradient>
          <radialGradient id={id("field")} cx="40%" cy="32%" r="80%">
            <stop offset="0" stopColor={GOLD.base} />
            <stop offset="0.55" stopColor={GOLD.mid} />
            <stop offset="1" stopColor={GOLD.dark} />
          </radialGradient>
          <linearGradient id={id("raised")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={GOLD.hi} />
            <stop offset="1" stopColor={GOLD.light} />
          </linearGradient>
          <linearGradient id={id("shieldR")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={GOLD.deep} stopOpacity="0.05" />
            <stop offset="1" stopColor={GOLD.deep} stopOpacity="0.25" />
          </linearGradient>
          <path id={id("arcTop")} d={`M ${C - 140} ${C} A 140 140 0 0 1 ${C + 140} ${C}`} />
          <path id={id("arcBottom")} d={`M ${C - 160} ${C} A 160 160 0 0 0 ${C + 160} ${C}`} />
        </defs>
      )}
      {mono && (
        <defs>
          <path id={id("arcTop")} d={`M ${C - 140} ${C} A 140 140 0 0 1 ${C + 140} ${C}`} />
          <path id={id("arcBottom")} d={`M ${C - 160} ${C} A 160 160 0 0 0 ${C + 160} ${C}`} />
        </defs>
      )}

      {/* Serrated edge + rims */}
      <polygon points={ROSETTE} fill={fillRim} stroke={ink} strokeOpacity={mono ? 1 : 0.35} strokeWidth={mono ? 0 : 1} />
      <circle cx={C} cy={C} r={180} fill={mono ? "none" : fillMetal} stroke={mono ? "#fff" : GOLD.dark} strokeWidth={mono ? 3 : 2.5} />
      <circle cx={C} cy={C} r={174} fill="none" stroke={mono ? "#fff" : GOLD.hi} strokeOpacity={mono ? 1 : 0.6} strokeWidth={mono ? 1.5 : 1.5} />
      {lettering && (
        <circle cx={C} cy={C} r={127} fill="none" stroke={mono ? "#fff" : GOLD.dark} strokeWidth={mono ? 2.5 : 2.5} />
      )}
      <circle cx={C} cy={C} r={lettering ? 121 : 168} fill={mono ? "none" : fillField} stroke={mono ? "#fff" : GOLD.hi} strokeOpacity={mono ? 1 : 0.55} strokeWidth={1.5} />

      {/* Ring lettering */}
      {lettering && (
        <g fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif" fill={mono ? "#fff" : raised}>
          {!mono && (
            <g fill={GOLD.deep} opacity="0.55" transform="translate(0 1.6)">
              <text fontSize="33" fontWeight="800" letterSpacing="3" textAnchor="middle">
                <textPath href={`#${id("arcTop")}`} startOffset="50%">VERIFIED BY NDIG</textPath>
              </text>
              <text fontSize="17.5" fontWeight="700" letterSpacing="0.6" textAnchor="middle">
                <textPath href={`#${id("arcBottom")}`} startOffset="50%">The Nigeria Diaspora Investment Gateway</textPath>
              </text>
            </g>
          )}
          <text fontSize="33" fontWeight="800" letterSpacing="3" textAnchor="middle">
            <textPath href={`#${id("arcTop")}`} startOffset="50%">VERIFIED BY NDIG</textPath>
          </text>
          <text fontSize="17.5" fontWeight="700" letterSpacing="0.6" textAnchor="middle">
            <textPath href={`#${id("arcBottom")}`} startOffset="50%">The Nigeria Diaspora Investment Gateway</textPath>
          </text>
          <circle cx={C - 152} cy={C} r={4} />
          <circle cx={C + 152} cy={C} r={4} />
        </g>
      )}

      {/* Shield */}
      <g transform={lettering ? undefined : "translate(200 205) scale(1.32) translate(-200 -205)"}>
        <path d={SHIELD_OUTER} fill={mono ? "#fff" : raised} stroke={ink} strokeWidth={mono ? 0 : 2} strokeOpacity={0.6} />
        <path d={SHIELD_INNER} fill={mono ? "currentColor" : fillField} stroke={mono ? "none" : GOLD.dark} strokeWidth={1.5} />
        {!mono && <path d="M200 118 C225 128 250 133 271 135 C272 208 250 257 200 291 Z" fill={`url(#${id("shieldR")})`} />}

        {/* Nigeria */}
        <g transform="translate(152 168)">
          {!mono && <path d={NIGERIA} fill={GOLD.deep} opacity="0.45" transform="translate(0 1.5)" />}
          <path d={NIGERIA} fill={mono ? "#fff" : raised} stroke={mono ? "none" : GOLD.dark} strokeWidth={0.8} />
        </g>

        {/* Radiating arrows */}
        <g strokeLinecap="round">
          {ARROWS.map(([ang, len]) => {
            const p = arrow(ang, len);
            return (
              <g key={ang}>
                {!mono && (
                  <g transform="translate(0 1.4)" stroke={GOLD.deep} fill={GOLD.deep} opacity="0.6">
                    <path d={p.line} strokeWidth={4.4} />
                    <path d={p.head} strokeWidth={1} />
                  </g>
                )}
                {mono && <path d={p.line} stroke="currentColor" strokeWidth={6.5} />}
                {mono && <path d={p.head} fill="currentColor" stroke="currentColor" strokeWidth={4} strokeLinejoin="round" />}
                <path d={p.line} stroke={mono ? "#fff" : GOLD.hi} strokeWidth={3.6} />
                <path d={p.head} fill={mono ? "#fff" : GOLD.hi} stroke={mono ? "#fff" : GOLD.hi} strokeWidth={1} strokeLinejoin="round" />
              </g>
            );
          })}
          <circle cx={HUB.x} cy={HUB.y} r={10} fill={mono ? "#fff" : GOLD.hi} stroke={mono ? "currentColor" : GOLD.dark} strokeWidth={mono ? 2 : 1.2} />
        </g>
      </g>
    </svg>
  );
}
