import { NIGERIA_PATH, SHIELD_INNER, SHIELD_OUTER, arrowPaths } from "./shieldGeometry";

const ARROWS = arrowPaths(undefined, undefined, 15);

/**
 * Tone-on-tone NDIG shield watermark (from the NDIG shield brand asset).
 * Drawn in a single tone slightly lighter than the deep-green field; no gold.
 * Decorative only.
 */
export function NdigWatermark({ className, tone = "#0a4a27" }: { className?: string; tone?: string }) {
  return (
    <svg viewBox="104 88 192 222" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke={tone} strokeLinejoin="round" strokeLinecap="round">
        <path d={SHIELD_OUTER} strokeWidth="5" />
        <path d={SHIELD_INNER} strokeWidth="2.4" />
        <path d={NIGERIA_PATH} fill={tone} fillOpacity="0.55" strokeWidth="2" />
        {ARROWS.map((a) => (
          <g key={a.key}>
            <path d={a.line} strokeWidth="3.4" />
            <path d={a.head} fill={tone} strokeWidth="1" />
          </g>
        ))}
      </g>
      <circle cx="200" cy="195" r="11" fill={tone} />
    </svg>
  );
}

/** Gold ring: a separate element, used around the hero seal. */
export function GoldRing({ className, opacity = 0.35 }: { className?: string; opacity?: number }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="49.6" fill="none" stroke="#C9A227" strokeOpacity={opacity} strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
