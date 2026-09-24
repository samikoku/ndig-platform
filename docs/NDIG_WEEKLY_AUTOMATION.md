# NDIG Weekly — Automation Instructions

## Cadence

- **FORTNIGHTLY** — every 2nd Wednesday, **09:00 UTC** (08:00 WAT).
- **First issue: 8 October 2026.**
- It is fortnightly, not weekly.

> **Open discrepancy:** 8 October 2026 is a **Thursday**, not a Wednesday. The deployed schedule
> (`server/weeklySchedule.ts`) is anchored to the date 8 October 2026 and repeats every 14 days,
> so it sends on Thursdays. If Wednesdays are intended (first issue 7 October), change
> `FIRST_ISSUE_DATE` there.

## Canonical files

| Purpose | Path |
|---|---|
| Canonical calendar | `/mnt/agents/output/NDIG_Weekly/NDIG_Weekly_Content_Calendar_2026.html` |
| Queue file | `/mnt/agents/output/NDIG_Weekly/NDIG_Weekly_Queue.html` |
| Content files | `/mnt/agents/output/NDIG_Weekly/issues/YYYY-MM-DD_topic.html` |

## Claude's role

Read calendar → check queue → pull matching issue file → send → move to `_archive/` → update queue status to `SENT` with timestamp.

- **NEVER write content.**
- **NEVER substitute** another issue or text.
- **NEVER skip silently.** If the issue file is missing on send morning, flag it to the user as **MISSING**.

## How the deployed automation currently works

- `vercel.json` fires `/api/cron/weekly` **daily at 09:00 UTC**. The handler proceeds only when today (UTC)
  is a scheduled send date (`server/weeklySchedule.ts`: 8 Oct 2026, then every 14 days). On other days it does nothing
  except retry a pending archive commit.
- On a send date the handler reports **MISSING** (HTTP 503 + an error log line) if no issue is configured in
  `server/weeklyContent.ts`, or if the configured content was already sent on an earlier date and has not been replaced.
- The handler reads the issue from `server/weeklyContent.ts` in the repo. It **cannot read the `/mnt/agents/output/...`
  paths above**, which are not part of the deployment; the calendar, queue, `_archive/` and queue-status steps
  in "Claude's role" are performed by Claude, not by the cron.
- After the first successful send of an issue, a copy is saved to `archive/weekly/YYYY-MM-DD-issue-NNN.html`
  (needs `GITHUB_TOKEN` in Vercel) and recorded in the `weekly_issues` table.
- Every confirmed subscriber receives each issue once (tracked per subscriber in `lastWeeklyIssue`).
  The NDIG-NAKACHI Intelligence Brief is sent at confirmation, before the first Weekly.
