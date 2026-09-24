# NDIG Weekly — Automation Instructions

These instructions supersede all earlier NDIG Weekly instructions.

## Cadence

- **FORTNIGHTLY** sends at **09:00 UTC** (10:00 WAT). First issue: **8 October 2026**, then every 14 days
  (22 Oct, 5 Nov, ...). The schedule is `server/weeklySchedule.ts`.
- 8 October 2026 is a **Thursday**; Issue #1's own dateline says "Thursday 8 October 2026". The earlier
  "every 2nd Wednesday" wording did not match the dates and is not what is deployed.

## Autonomous run (no intervention)

A scheduled task, `ndig-weekly-tuesday-run`, runs **every Tuesday at 08:00 WAT** (it runs while the Claude desktop
app is open; if the app was closed it runs on next launch):

1. **Reconcile** the previous send date: confirm from production logs that it was sent and mark it `SENT` with a
   timestamp in the queue; if not, mark `MISSING` and flag.
2. **Find** the next send date's issue: a `.docx` in `Desktop\NDIG Weekly Newsletter` whose dateline date matches.
3. **If found** (author-provided, so approved): extract the text verbatim → generate HTML in the template style →
   save to `content/weekly/issues/YYYY-MM-DD_<slug>.html` → queue `QUEUED` → load into `server/weeklyContent.ts`
   (only once the previous issue's send date has passed) → commit → deploy → confirm the deployment is live.
4. **If not found:** nothing is loaded or sent. If a canonical calendar is available, a draft is saved to
   `content/weekly/drafts/` (never `issues/`), the queue is set to `DRAFT - AWAITING APPROVAL`, and the user is
   flagged. Content is loaded only after the user approves.

Rules: **never send unapproved content; never substitute; never edit approved text; never skip a send date
silently** (any hold, `MISSING` or failure is flagged to the user).

## Files

| Purpose | Location |
|---|---|
| Issues | `content/weekly/issues/YYYY-MM-DD_<slug>.html` |
| Drafts (unapproved, never sent) | `content/weekly/drafts/` |
| Queue | `content/weekly/NDIG_Weekly_Queue.html` (`QUEUED`, `SENT` + timestamp, `MISSING`, `DRAFT - AWAITING APPROVAL`) |
| Source docx | `C:\Users\samik\OneDrive\Desktop\NDIG Weekly Newsletter` |
| Canonical content calendar | **Not yet provided** — location to be supplied |

## How the deployed send works

- `vercel.json` fires `/api/cron/weekly` **daily at 09:00 UTC**; it proceeds only on a scheduled send date. On a send
  date it reports **MISSING** (HTTP 503 + error log) if no issue is configured in `server/weeklyContent.ts`, or if
  the configured content was already sent earlier and not replaced.
- It sends the issue in `server/weeklyContent.ts` to every confirmed, subscribed reader who has not yet received it
  (tracked per subscriber), with one-click unsubscribe.
- After the first successful send it records the issue in the `weekly_issues` table and saves a copy to
  `archive/weekly/YYYY-MM-DD-issue-NNN.html` (needs `GITHUB_TOKEN` in Vercel).
- The NDIG-NAKACHI Intelligence Brief is sent at confirmation, before the first Weekly.
