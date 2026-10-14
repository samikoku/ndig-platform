/**
 * Shared NDIG shield geometry (seal, card header mark, watermark, favicon).
 * Drawn from the NDIG shield brand asset: shield, Nigeria outline, radiating arrows.
 * Coordinates are in the seal's 400x400 viewBox.
 */

// Gold scale derived from brand gold #C9A227 (metallic shading only).
export const GOLD = {
  hi: "#F6E39A",
  light: "#E3C35E",
  face: "#D4B04A",
  base: "#C9A227",
  mid: "#A2801A",
  dark: "#7A5C0E",
  deep: "#3F2F05",
};

export const SHIELD_OUTER =
  "M200 96 L288 117 L288 186 C288 240 254 276 200 302 C146 276 112 240 112 186 L112 117 Z";
export const SHIELD_INNER =
  "M200 107 L278 125 L278 186 C278 234 248 266 200 290 C152 266 122 234 122 186 L122 125 Z";

/** Simplified Nigeria outline, local coords ~96x82. Apply NIGERIA_TRANSFORM. */
export const NIGERIA_LOCAL =
  "M4 31 L7 19 L13 13 L21 11 L29 6 L38 9 L46 4 L56 7 L66 4 L76 7 L86 2 L93 7 L95 15 L91 23 L93 31 L87 41 L83 51 L77 57 L71 66 L65 70 L61 80 L55 78 L49 82 L43 76 L37 80 L31 74 L24 72 L16 73 L8 72 L6 62 L4 50 L6 40 Z";

/** Nigeria outline already placed in seal coordinates (scale 1.15, centred on the hub). */
export const NIGERIA_PATH = NIGERIA_LOCAL.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_m, x, y) =>
  `${(146 + Number(x) * 1.15).toFixed(1)} ${(149 + Number(y) * 1.15).toFixed(1)}`
);

export const HUB = { x: 200, y: 195 };

/** Angle (deg, 0 = east) and length of each radiating arrow, matched to the seal render. */
export const ARROW_SPEC: Array<[number, number]> = [
  [-90, 88], [-118, 84], [-58, 86], [-158, 78], [180, 80], [0, 80], [24, 76], [55, 86], [96, 84], [122, 84],
];

export function arrowPaths(spec = ARROW_SPEC, hub = HUB, head = 12) {
  return spec.map(([deg, len]) => {
    const a = (deg * Math.PI) / 180;
    const ex = hub.x + len * Math.cos(a);
    const ey = hub.y + len * Math.sin(a);
    const sx = hub.x + 11 * Math.cos(a);
    const sy = hub.y + 11 * Math.sin(a);
    const spread = 0.42;
    const h1x = ex - head * Math.cos(a - spread), h1y = ey - head * Math.sin(a - spread);
    const h2x = ex - head * Math.cos(a + spread), h2y = ey - head * Math.sin(a + spread);
    return {
      key: `${deg}`,
      line: `M${sx.toFixed(1)} ${sy.toFixed(1)} L${(ex - 6 * Math.cos(a)).toFixed(1)} ${(ey - 6 * Math.sin(a)).toFixed(1)}`,
      head: `M${ex.toFixed(1)} ${ey.toFixed(1)} L${h1x.toFixed(1)} ${h1y.toFixed(1)} L${h2x.toFixed(1)} ${h2y.toFixed(1)} Z`,
    };
  });
}
