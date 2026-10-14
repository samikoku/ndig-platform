import { NIGERIA_PATH, SHIELD_INNER, SHIELD_OUTER, arrowPaths } from "./shieldGeometry";

const ARROWS = arrowPaths(undefined, undefined, 16);

/**
 * NDIG shield mark (from the NDIG shield brand asset), drawn for dark surfaces:
 * ivory shield rim, field in the surface tone, ivory Nigeria and arrows.
 * Used in the dossier card header.
 */
export default function NdigShieldMark({ className, field = "currentColor" }: { className?: string; field?: string }) {
  return (
    <svg viewBox="104 88 192 222" className={className} aria-hidden="true" focusable="false">
      <path d={SHIELD_OUTER} fill="#F7F5EF" />
      <path d={SHIELD_INNER} fill={field} />
      <path d={NIGERIA_PATH} fill="#F7F5EF" fillOpacity="0.9" />
      <g stroke="#F7F5EF" strokeLinecap="round" strokeLinejoin="round" fill="#F7F5EF">
        {ARROWS.map((a) => (
          <g key={a.key}>
            <path d={a.line} strokeWidth="6" fill="none" stroke={field} />
            <path d={a.line} strokeWidth="3.6" fill="none" />
            <path d={a.head} strokeWidth="1" />
          </g>
        ))}
      </g>
      <circle cx="200" cy="195" r="12" fill="#F7F5EF" stroke={field} strokeWidth="3" />
    </svg>
  );
}
