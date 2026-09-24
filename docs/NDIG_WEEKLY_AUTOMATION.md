# NDIG Weekly — Automation Instructions

These instructions supersede all earlier NDIG Weekly instructions.

## Cadence

- **FORTNIGHTLY** sends at **09:00 UTC** (10:00 WAT). First issue: **8 October 2026**, then every 14 days
  (22 Oct, 5 Nov, ...). The schedule is `server/weeklySchedule.ts`.
- Sends fall on **Thursdays** (8 October 2026 is a Thursday). The canonical calendar confirms: fortnightly, every 2nd
  Thursday, 09:00 UTC; first issue Thu 8 Oct 2026; last issue in its window Thu 31 Dec 2026 (seven issues).

## Autonomous run (no intervention)

A scheduled task, `ndig-weekly-tuesday-run`, runs **every Tuesday at 08:00 WAT** (it runs while the Claude desktop
app is open; if the app was closed it runs on next launch):

1. **Reconcile** the previous send date: confirm from production logs that it was sent and mark it `SENT` with a
   timestamp in the queue; if not, mark `MISSING` and flag.
2. **Find** the next send date's issue: a `.docx` in `Desktop\NDIG Weekly Newsletter` whose dateline date matches.
3. **If found** (author-provided, so approved): extract the text verbatim → generate HTML in the template style →
   save to `content/weekly/issues/YYYY-MM-DD_<slug>.html` → queue `QUEUED` → load into `server/weeklyContent.ts`
   (only once the previous issue's send date has passed) → commit → deploy → confirm the deployment is live.
4. **If not found:** nothing is loaded or sent, and **Claude writes nothing** (calendar rule: Dr. Ikoku writes every
   issue; Claude only loads and sends). The queue row is set to `MISSING` and the user is flagged.

**Send-day check:** a second scheduled task, `ndig-weekly-thursday-check`, runs Thursdays at 11:00 WAT (an hour after the 10:00 WAT send). On a send date it confirms the issue went out and marks the queue `SENT`; if not, it marks `MISSING` and flags the user.

**Issue #1 corrections (approved):** the closing line reads "NDIG — The Nigeria Diaspora Investment Gateway" (never "Intelligence"); the subject is "NDIG Weekly #1: The $21 Billion Question Nobody Could Answer". Both are applied in `content/weekly/issues/2026-10-08_launch-issue.html`, which is loaded in `server/weeklyContent.ts`. The source docx still has the old closing line, so never regenerate Issue #1 from it.

Locked calendar rules: no selling, no NAKACHI products, no NDIG membership pushes, no CTAs; verification-first with
unverifiable claims flagged `[UNVERIFIED]`; NDIG = Nigeria Diaspora **Investment** Gateway, never "Intelligence".

Rules: **never send unapproved content; never substitute; never edit approved text; never skip a send date
silently** (any hold, `MISSING` or failure is flagged to the user).

## Files

| Purpose | Location |
|---|---|
| Issues | `content/weekly/issues/YYYY-MM-DD_<slug>.html` |
| Queue | `content/weekly/NDIG_Weekly_Queue.html` (`QUEUED`, `SENT` + timestamp, `MISSING`,  |
| Source docx | `C:\Users\samik\OneDrive\Desktop\NDIG Weekly Newsletter` |
| **Authoritative calendar** | `content/weekly/NDIG_Weekly_Content_Calendar_2026_CANONICAL_v1.0.md` — where any calendar differs, this file wins |
| Formatted calendar (reference) | `content/weekly/NDIG_Weekly_Content_Calendar_2026.html` — fuller earlier copy of the same v1.0; the old `/mnt/agents/output/...` path is retired and must not be searched for |

## How the deployed send works

- `vercel.json` fires `/api/cron/weekly` **daily at 09:00 UTC**; it proceeds only on a scheduled send date. On a send
  date it reports **MISSING** (HTTP 503 + error log) if no issue is configured in `server/weeklyContent.ts`, or if
  the configured content was already sent earlier and not replaced.
- It sends the issue in `server/weeklyContent.ts` to every confirmed, subscribed reader who has not yet received it
  (tracked per subscriber), with one-click unsubscribe.
- After the first successful send it records the issue in the `weekly_issues` table and saves a copy to
  `archive/weekly/YYYY-MM-DD-issue-NNN.html` (needs `GITHUB_TOKEN` in Vercel).
- The NDIG-NAKACHI Intelligence Brief is sent at confirmation, before the first Weekly.
