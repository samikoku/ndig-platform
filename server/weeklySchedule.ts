/**
 * NDIG Weekly send calendar: FORTNIGHTLY at 09:00 UTC, first issue on FIRST_ISSUE_DATE.
 * The Vercel cron fires daily; /api/cron/weekly proceeds only on the dates this returns true for.
 * NOTE: 8 October 2026 is a Thursday, while the brief says "every 2nd Wednesday". The date is
 * used as the anchor — change FIRST_ISSUE_DATE here if Wednesday (7 October) was intended.
 */
export const FIRST_ISSUE_DATE = "2026-10-08";
export const ISSUE_INTERVAL_DAYS = 14;

const DAY_MS = 24 * 60 * 60 * 1000;

export function utcDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function isScheduledSendDate(date: Date = new Date()): boolean {
  const days = Math.round((Date.parse(`${utcDateString(date)}T00:00:00Z`) - Date.parse(`${FIRST_ISSUE_DATE}T00:00:00Z`)) / DAY_MS);
  return days >= 0 && days % ISSUE_INTERVAL_DAYS === 0;
}
