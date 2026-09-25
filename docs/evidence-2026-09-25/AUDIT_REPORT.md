# NDIG production pass: audit report, 25 September 2026

Live site: https://www.ndigateway.org. Repo: samikoku/ndig-platform, branch `main`.
Code commits: `1f37eb2` (newsletter routing), `736eedf` (site changes), `4967e79` (dead buttons, guarantee wording), plus the final commit that carries this report (see git log).
Deployments checked READY via the Vercel API: `dpl_EGPt4FPXRsrED7F7DRyK4UEpXEY6` (736eedf), `dpl_KcZwo8yEFwAyZonnbfNwiPPaZKJJ` (4967e79).

## 1. Task log

| Task | Result | Evidence |
|---|---|---|
| 1 White strip | DONE. Cause: `<main>` offset was `pt-[6.5rem] md:pt-[7.5rem]` (104/120px) under a 65/81px header, a leftover of the removed ticker spacer. `MarketTicker` had already been deleted from the tree in `2af62b9`, so there was no ticker markup left to remove. Offset now `pt-[65px] md:pt-[81px]`. | Live DOM: gap between header and first content = 0.2px at 1440px on `/`, `/professional-network`, `/trust-centre`; 0px at 375px on `/`; no horizontal scroll at 375px. |
| 2 Trust Layer restore | NOT DONE. CONFIRM. There is no "Trust Layer" page. `git log --all -S"Technical Advisory"` and `-S"Advisory Board"` return no commit and no file: no Technical Advisory Board content ever existed in this repo's history. Nothing to restore faithfully; nothing was invented. Founder bio still present on `/trust-centre` (Dr. Sam Ikoku). | git history search; `/trust-centre` live. |
| 3 Assurance Report | DONE. No Assurance page exists, so the section is on the SPA homepage (`#assurance`), copy verbatim, boundary line present. Footer line added on the SPA footer and the `/join` footer, followed by the boundary line. Copy states it is a commitment, first edition Q4 2027. | Live DOM text of `#assurance` and footer. |
| 4 Eko Atlantic | PARTLY DONE. The homepage "Featured Opportunity" card carried "Eko Atlantic Diaspora Tower", "Guaranteed rental yields", 12-15% yield, $25k minimum, 5-year term, "Open Now". All cut: none could be sourced and they breach rules 1 and 3. Card is now "Listing Under Review / Not yet verified". One sourced sentence (ekoatlantic.com: new coastal city on land reclaimed from the Atlantic, Victoria Island, Lagos; checked 25 Sep 2026). Phase 4 scope, availability and returns marked [UNVERIFIED]. Image slot shows `CONFIRM: image rights pending`. | Live DOM. |
| 5 Demo buttons | DONE, CUT. No hosted 90-second walkthrough exists (only a local mp4 that is not a Prompt C walkthrough). "Try Demo" removed from Home and Dashboard. The demo mode showed a fabricated portfolio. | Live scan of 25 routes: no "try demo" text. |
| 6 Professional Network | DONE. Top-level nav entry on desktop and mobile (`/professional-network`; old `/productivity-network` route still resolves). Card added to the `/join` card row (the row holding Weekly, Verification Reports, Intelligence Brief), copy verbatim, with a link. Page rewritten to comply: four invented named directory entries and three invented marketplace listings removed; page states no entries are published yet. | Live DOM; nav link resolves; page loads. |
| 7 Newsletter routing | DONE in code. `server/newsletterRouting.ts`: classes INTEL_BRIEF / ARTICLE / WEEKLY, `checkBeforeSend()`, wired into `/api/cron/weekly` (blocks with HTTP 503 `BLOCKED`). 6 unit tests pass. Docs updated. **Open defect, CONFIRM:** the deployed signup flow already conflates the two documents. `server/briefArticle.ts` holds the "Two Layers of Failed Trust" article and it is emailed on confirmation, while `/join` and the emails call it "the NDIG-NAKACHI Intelligence Brief". Not changed in this pass because it alters the signup promise six days before launch. | `npx vitest run server/newsletterRouting.test.ts` |
| 8 Deploy and verify | DONE with gaps. Pushed, deployed, verified in a rendered browser. Screenshots could not be saved to disk (headless capture was stopped by the Vercel Security Checkpoint, and the in-app browser cannot write files). Structured DOM evidence is recorded in this report instead. | This file. |

Extra changes made because the click-path audit required them: removed dead `/login` and "My Portfolio" links (no login route exists); removed or re-pointed 14 buttons that did nothing (account opening, prospectus, market and fund buttons; NRBVN, Investment Nexus, Banking Options, `/join` and a support mailto now wired); replaced "Government-guaranteed", "guaranteed" and "exclusive" wording on Home, Banking Options and Compliance Tracker.

## 2. Immutable rules (live site)

| # | Rule | Verdict | Evidence / note |
|---|---|---|---|
| 1 | No funds, products, advice | FAIL (partial) | Homepage fixed. `/investment-nexus` still presents "High-Yield" investment listings; not audited page by page. |
| 2 | Regulator-vetted, not government-backed | FAIL (partial) | Hero and bonds card fixed. `/investment-nexus` still has a "Sovereign Guarantee" block. `/trust-centre` references `/cbn-logo.jpg` (currently a broken image). |
| 3 | Named public source or cut | FAIL (partial) | Everything I added is sourced or marked. Listings on `/investment-nexus` and other legacy pages remain unsourced. |
| 4 | Checks, not operators | PASS | No failed items published. Invented named people removed from Professional Network. |
| 5 | Tone | PASS on scan, partial on review | Regex scan of 25 routes for game changer / act now / limited slots / guaranteed / government-backed / hurry / last chance found nothing. Phrases such as "High-Yield" and "exclusive Diaspora Bonds" on `/investment-nexus` were not covered by the scan. |
| 6 | Production-ready, CONFIRM markers | PASS | Markers listed in section 6. |
| 7 | Perishable verdicts | PASS | No VERIFIED verdict published. Eko Atlantic source line carries a check date; re-check by 25 Oct 2026. |
| 8 | Warm-neutral on associations | NOT AUDITED | No association copy was changed or scanned. |
| 9 | No internal strategy in public copy | PASS | Grep of the full diff and all three commit messages for internal terms: 0 hits. |

## 3. Claims added or kept live by this pass

| Claim | Source | Verdict |
|---|---|---|
| Eko Atlantic is a new coastal city on land reclaimed from the Atlantic at Victoria Island, Lagos | https://www.ekoatlantic.com, read 25 Sep 2026 (site text: "A new coastal city on Victoria Island, Lagos"; "10 million m² of land reclaimed from the Atlantic") | VERIFIED, re-check 25 Oct 2026 |
| Developer is South Energyx Nigeria Ltd | Not found on the project site | Cut |
| Phase 4 scope, unit availability, returns | None | [UNVERIFIED], not shown |
| Diaspora bonds issued by the FGN through the DMO | dmo.gov.ng did not confirm from this machine | Cut |
| Yields, minimum entry, term, "guaranteed" (Eko card) | None | Cut |
| Assurance Report timing (30 Sep 2027, first edition Q4 2027) | Supplied brief text; forward commitment, not a factual claim | Kept verbatim |
| Professional Network directory | Brief copy; page says no entries published | Kept, qualified |

## 4. Tone audit
25 SPA routes scanned in the live DOM. Zero hits for the forbidden set. See rule 5 caveat.

## 5. Dead-end audit
Internal links resolved with no 404 across 25 routes plus `/join`: `/`, `/investment-nexus`, `/diaspora-bonds`, `/banking-options`, `/investment-index`, `/trust-centre`, `/diaspora-readiness`, `/country-anchors`, `/about`, `/professional-network`, `/get-nrbvn`, `/policy-interface`, `/productivity-network`, `/join`, `/verification-standard`, `/vod`, `/concept-note`, `/sovereign-brief` (+3 editions), `/faqs`, `/homefund`, `/privacy-policy`, `/terms-of-service`, `/accessibility`, `/compliance-tracker`.
External links: 200 from this machine for ekoatlantic.com, npa2025-2035.org, nipc.gov.ng, cbn.gov.ng, nibss-plc.com.ng/nrbvn. **No response (not confirmed) from this machine:** nidcom.gov.ng, sec.gov.ng, nimc.gov.ng (2 links), theiguides.org, homefund.ng. CONFIRM these in a normal browser.
`mailto:` targets: diaspora@ndigateway.org, ndig@nakachiconsulting.com.ng.
Known non-link defects: broken images on `/` (hero-banner, investment-nexus, policy-interface, productivity-network, trust-centre .jpg) and `/trust-centre` (dr-sam-ikoku.jpg, cbn-logo.jpg). The files never existed in the repo; not fabricated here.
`/policy-interface` is a "Coming Soon" page and is still linked from the footer. The brief forbids a button pointing at a "coming soon" page; this is a link, not a button, but it is the same breach. CONFIRM: cut or replace.

## 6. Diff summary
- `client/src/components/Layout.tsx`: header offset fix; Professional Network nav; removed dead login and portfolio links; footer Assurance line.
- `client/src/App.tsx`: `/professional-network` route.
- `client/src/pages/Home.tsx`: Try Demo removed; hero and card copy de-hyped; Eko listing replaced; Assurance section; two dead buttons wired.
- `client/src/pages/ProductivityNetwork.tsx`: invented entries removed; renamed.
- `client/src/pages/Dashboard.tsx`, `BankingOptions.tsx`, `InvestmentNexus.tsx`, `TrustCentre.tsx`, `ComplianceTracker.tsx`: dead buttons and guarantee wording.
- `client/public/join/index.html`: Professional Network card; footer Assurance line; card-count wording.
- `server/newsletterRouting.ts`, `server/newsletterRouting.test.ts`, `server/joinRoutes.ts`, `server/weeklyContent.ts`, `docs/NDIG_WEEKLY_AUTOMATION.md`: routing and pre-send gate.
- `public/`: rebuilt output.

## 7. Self-evaluation (out of 100)

| Task | Score | Note |
|---|---|---|
| 1 | 96 | Verified live at both widths. |
| 2 | 10 | **Failed.** No prior version exists to restore. Remediation: supply the deployed version or backup that held the founder and TAB content, or the approved names and titles, and confirm each person consents to publication. |
| 3 | 94 | Done on the homepage because no Assurance page exists; footer line is static, not a rotation. Remediation: create the Assurance page and move the section there. |
| 4 | 70 | Claims cut and marked; no image. Remediation: written reproduction rights for `Eko Atlantic Phase 4.jpg` (found at OneDrive\Desktop\GenPix) or an asset from the developer's media kit; the second image was never supplied. |
| 5 | 96 | Cut, correctly. |
| 6 | 88 | Card is on `/join`, not the SPA homepage, because that is where the row exists. Remediation: confirm the intended homepage. |
| 7 | 75 | Gate built and tested. Existing Brief/Article conflation in the signup flow left open. Remediation: decide whether the confirmation email is the Article; then rename it in `/join`, `emailService.ts` and `emailTemplates.ts`. |
| 8 | 78 | Deployed and verified. No screenshots on disk; legacy pages fail rules 1-3. |
| **Overall** | **72** | Legacy pages (`/investment-nexus`, `/diaspora-bonds`, `/banking-options`, `/investment-index`) were not brought into compliance. |

## 8. Declaration

**What I verify:** the live state described in sections 1-5, read from the rendered site on 25 September 2026 (DOM text, link targets, layout measurements) and from the Vercel API for the deployed commits.

**What I cannot guarantee:** that no defect exists anywhere; that external sources stay accurate after today (the one VERIFIED claim, the Eko Atlantic description, should be re-checked by 25 October 2026); that any third-party image is rights-cleared (none is published); that pages I did not read line by line are compliant (see rules 1-3, 8).

**Downgrade path:** if any item here later fails, the correct action is a public downgrade, not a silent fix. Nothing in this deployment blocks that: the listing carries a visible "Not yet verified" status, and the newsletter gate blocks rather than rewrites.

## 9. CONFIRM list
1. CONFIRM: Trust Layer founder and Technical Advisory Board content: no earlier version exists in git; supply source and consent.
2. CONFIRM: image rights pending (Eko Atlantic Phase 4 images, both).
3. CONFIRM: second Eko Atlantic image was never supplied.
4. CONFIRM: Brief/Article naming in the signup flow.
5. CONFIRM: `/policy-interface` "Coming Soon" page linked from the footer.
6. CONFIRM: external links that did not respond (section 5).
7. CONFIRM: legacy pages `/investment-nexus`, `/diaspora-bonds`, `/banking-options`, `/investment-index`: rules 1-3.
8. CONFIRM: broken image files (hero, module thumbnails, founder photo, CBN logo; the CBN logo should not be used at all under rule 2).
9. CONFIRM: `NDIG_Two_Layers_of_Failed_Trust_Launch_Article_01Oct2026.docx` and `Eko_Atlantic_Phase4.jpg` (that exact name) were not found on this machine; the article text is in `server/briefArticle.ts`.
