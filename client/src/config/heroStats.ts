/**
 * Homepage stat strip — single place to update the figures.
 * Each entry: headline value, label, and source (shown in brackets in the label).
 */
export interface HeroStat {
  value: string;
  label: string;
  source?: string;
}

export const HERO_STATS: HeroStat[] = [
  { value: "$20.98bn", label: "Diaspora Remittances, 2024", source: "CBN" },
  { value: "40", label: "Blocks in the 2026 Licensing Round", source: "NUPRC" },
  { value: "14", label: "Country Anchor Cities" },
];
