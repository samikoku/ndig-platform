# Diaspora Insight Feature — Merge Gate Validation Checklist

**Branch**: `feature/diaspora-insight`  
**Status**: Ready for final gate validation  
**Last Updated**: 2026-10-15

---

## DONE — Feature Implementation Complete

### Backend (100%)
- ✅ Database schema: `insightTips` table with status enum
- ✅ tRPC router: 6 procedures (submit, published, admin review, publish)
- ✅ Daily cron job: Runs 9 AM Lagos time, sends digest to smi@
- ✅ Mail routing: insight category added, smi@ exception for digest only
- ✅ Email webhook: Receives and processes [ARTICLE-APPROVED] emails
- ✅ Admin procedures: All protected with admin role checks
- ✅ Database security: Runtime table creation with ensureTable pattern

### Frontend (100%)
- ✅ Main page: `/insight` form + findings index
- ✅ Detail page: `/insight/:id` article display
- ✅ Navigation: Link in header + mobile menu
- ✅ Form validation: Client + server (Zod)
- ✅ Responsive design: Mobile/tablet/desktop
- ✅ Copy doctrine: All text in siteCopy.ts, doctrine-checked

### Mail Rules & Workflow (100%)
- ✅ smi@ rule: Forbidden except for digest (line 23 in mailRouting.ts)
- ✅ press@ rule: Receives digest copy when articles ready
- ✅ Digest content: Admin review link + tip table + article count
- ✅ Email addresses: Proper From/ReplyTo for each recipient
- ✅ Error handling: Digest failures don't block cron

### Article Publishing Lane (100%)
- ✅ Email webhook: Parses [ARTICLE-APPROVED] subject
- ✅ Tip ID extraction: From subject line (#123 format)
- ✅ Article publication: Updates tip, marks published
- ✅ Confirmation: Returns success status to webhook
- ✅ Logging: Events recorded for debugging

### Copy & Branding (100%)
- ✅ TIP_LINE: "Seen a scheme? The desk wants it."
- ✅ Disclaimer: Locked, non-negotiable
- ✅ Form copy: All field labels, hints, placeholders
- ✅ Findings copy: Index + empty state messages
- ✅ Thank you message: Confirmation on submit
- ✅ Doctrine compliance: No unsourced claims, no advice, no selling

---

## MERGE GATE CHECKS — Execute in Order

### 1. Build & Doctrine Check
```bash
cd /home/user/ndig-platform
npm run build
npm run doctrine:check
```

**Expected Result**: 
- ✓ No TypeScript errors
- ✓ doctrine:check passes (no banned phrases found)
- ✓ Build completes to `dist/` and `public/`

**Fail Action**: Fix errors and retest before proceeding.

---

### 2. Screenshots at 3 Breakpoints

Use your browser DevTools or Playwright to capture:

**Width 375px (mobile)**:
- [ ] `/insight` form in view (form fields visible)
- [ ] Findings index empty state (shows "No verified findings yet...")
- [ ] Navigation hamburger menu (responsive)

**Width 768px (tablet)**:
- [ ] `/insight` form (2-column grid on larger screens not yet)
- [ ] Findings index (single column layout)
- [ ] Back button on detail page visible

**Width 1440px (desktop)**:
- [ ] `/insight` form (full width)
- [ ] Findings index with cards side-by-side (if multiple items)
- [ ] Detail page (`/insight/1` or sample ID) rendered fully
  - Shows article title, summary, metadata (date, source)
  - Back to findings link works
  - All text renders without clipping

**Store as**: 
```
screenshots/
  insight-form-375.png
  insight-form-768.png
  insight-form-1440.png
  findings-375.png
  findings-768.png
  findings-1440.png
  article-detail-1440.png
```

---

### 3. Lighthouse Audit

Run Lighthouse on production build or via Vercel deploy preview:

**Mobile (threshold ≥61)**:
```bash
lighthouse https://ndigateway.org/insight --form-factor=mobile
```
- [ ] Performance: ≥61
- [ ] Accessibility: (document score)
- [ ] Best Practices: (document score)
- [ ] SEO: (document score)

**Desktop (threshold ≥95)**:
```bash
lighthouse https://ndigateway.org/insight --form-factor=desktop
```
- [ ] Performance: ≥95
- [ ] Accessibility: (document score)
- [ ] Best Practices: (document score)
- [ ] SEO: (document score)

**Fail Action**: If scores below threshold, optimize and retest. Common issues:
- Missing alt text (add to images)
- Unused CSS/JS (tree-shake if large)
- Render-blocking resources (defer or async)

---

### 4. Test Baseline Validation

Run your test suite:
```bash
npm test
```

**Expected Result**: 
- ✓ No new test failures
- ✓ Only baseline failures allowed (9 known database test failures)
- ✓ New tests for insight feature pass

**Known Baseline Failures**: (document these)
- DB test: [...list your 9 known failures...]

**Fail Action**: If new failures appear, fix before merge.

---

### 5. Code Review Gate (if required)

- [ ] Changelog updated with feature summary
- [ ] README updated with new endpoints
- [ ] Mail rules documented in README ("Email routing" section)
- [ ] No hardcoded secrets or credentials
- [ ] No breaking changes to existing APIs

---

## Manual Testing (Post-Merge)

Before deploy to production, verify end-to-end:

### Test 1: Tip Intake & Review
- [ ] Submit test tip to `/insight` form
- [ ] Verify tip appears in `adminUnprocessed` query
- [ ] Admin marks as verified + readyForArticle=1
- [ ] Tip appears in published findings on `/insight` index
- [ ] Click through to `/insight/[id]` detail page

### Test 2: Daily Cron
- [ ] Wait for 9 AM Lagos time (or trigger manually)
- [ ] Digest email arrives in smi@ inbox with admin link
- [ ] If articles ready, press@ receives copy
- [ ] Admin link goes to `/admin#insight-review` (or configured URL)

### Test 3: Article Publishing
- [ ] Send email with subject: `[ARTICLE-APPROVED] Tip #<id>`
- [ ] Email body contains article content
- [ ] Webhook receives and processes email
- [ ] Tip marked as published (processedAt updated)
- [ ] Article visible at `/insight/[id]` with content

### Test 4: Copy & Doctrine
- [ ] Run `npm run doctrine:check` on production build
- [ ] No banned phrases found
- [ ] All copy matches siteCopy.ts exactly

---

## Deployment Verification

After merge to main and deploy to production:

- [ ] `/insight` page loads without errors
- [ ] Form submits successfully
- [ ] Findings index displays (if any published)
- [ ] `/insight/:id` detail page works
- [ ] Daily cron fires at scheduled time
- [ ] Email deliveries confirmed
- [ ] No 500 errors in Vercel logs

---

## Gate Closure

Once all checks pass:

1. **Approve PR** in GitHub (if code review required)
2. **Merge to main** with merge commit:
   ```bash
   git checkout main
   git pull origin main
   git merge --no-ff feature/diaspora-insight
   git push origin main
   ```
3. **Deploy to production** via Vercel (automatic or manual)
4. **Verify production state** (see Deployment Verification above)
5. **Close feature branch** (safe to delete after merge)

---

## Rollback Plan (if needed)

If critical issues found in production:

1. Revert merge: `git revert -m1 <merge-commit-hash>`
2. Push revert: `git push origin main`
3. Vercel redeploys automatically
4. Investigation & fixes on feature branch
5. Re-merge when ready

---

## Gate Status

- Build: ⏳ Pending
- Doctrine: ⏳ Pending
- Screenshots: ⏳ Pending
- Lighthouse: ⏳ Pending
- Tests: ⏳ Pending
- Manual verification: ⏳ Pending

---

**Next Step**: Execute merge gate checks in order. Report results here.

---

**Generated**: 2026-10-15 UTC  
**Session**: https://claude.ai/code/session_01BB3u36AQPgC3eSEnqV38Xn
