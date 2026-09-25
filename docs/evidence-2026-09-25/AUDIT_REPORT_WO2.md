# NDIG Work Order 2: audit report, 25 September 2026

Code commit: `4623448`. Deployment `dpl_GAeYfXJZy1B4b7XuiecAsC1WRUPy`, READY. Live checks made in a rendered browser at www.ndigateway.org after deploy.
Work Order 1 report: `AUDIT_REPORT.md` (same folder). Its rule-2 note about the CBN logo and its CONFIRM items 1, 5, 7 and 8 are superseded here.

## 1. Execution log

| Task | Result | Evidence |
|---|---|---|
| 1 Signup label | DONE. The confirmation email now carries the subject "Two Layers of Failed Trust" and calls it "the launch article". `/join` (hero form, cards, feature section, footer CTA), the confirmation and re-confirmation pages, the unsubscribe page and the automation doc use the article's title. I removed the "Inside the Special Edition" bullet list on `/join` because it described contents (institutions that pass verification, launch roadmap) I could not match to the article. | `/join` live: "Intelligence Brief" absent, article title present. Files: `server/emailService.ts`, `emailTemplates.ts`, `joinRoutes.ts`, `client/public/join/index.html`. |
| 2 Legacy pages | DONE. Four routes and page files deleted; removed from desktop nav, mobile nav, footer, homepage buttons, cards and the "CBN 2025 Infrastructure" homepage section that existed only to sell them. `vercel.json` carries four 301 redirects to `/`. No sitemap file exists in the repo, so there was nothing to edit. | Live fetch: all four paths redirect to `/`. Nav now: Trust Centre, Diaspora Readiness, Country Anchors, About, Professional Network. |
| 3 CBN logo | DONE. Logo box removed from Trust Centre. No `cbn-logo` image remains on the page. | Live DOM. |
| 4 Policy-interface footer link | DONE. Also removed the homepage module card that linked to it. The route itself still resolves (it is not linked from anywhere). | Live link scan: no `/policy-interface` link on any route. |
| 5 Trust Layer | DONE on the existing `/trust-centre` route, already in the primary nav. Order: Dr. Sam Ikoku, Mary Uduk, Aisha Abubakar. Bio text is verbatim from the supplied file. Photos copied to `client/public/images/trust/`, served as `image/jpeg` at 640x640, 720x1080, 720x1080. Square crop, max width 240px, top-aligned. No honoraria, governance or fee text. | Live DOM: all three names and both roles present; no "honorari" or "firewall". Photo files fetched live (200, correct sizes). |
| 6 External links | DONE with notes below. | See section 5. |
| 7 Deploy, verify, report | DONE. | This file. |

Additional fix made because it was live in code: the registration email template in `server/emailService.ts` said "government-backed", "Government Endorsed: Backed by NPA, NiDCOM, NIPC, CBN, and SEC", "high-yield", listed a placeholder WhatsApp and phone number, and a `.gov.ng` address. Rewritten. It is only logged (no message is sent to the registrant), and the owner notification wrongly said "Welcome email sent to registrant"; corrected.

## 2. Immutable rules (live site)

| # | Rule | Verdict | Evidence / note |
|---|---|---|---|
| 1 | No funds, products, advice | PASS on pages scanned; not exhaustive | Investment listings, bonds, account-opening buttons removed. `/investor-protections`, `/compliance-tracker`, `/get-nrbvn`, `/country-anchors`, `/concept-note`, `/business-news`, `/project-detail` were scanned for forbidden phrases only, not read in full. |
| 2 | Regulator-vetted, not government-backed | PASS on pages scanned | No CBN logo, no "government-backed / endorsed / guaranteed" text on 21 routes, no `ndig.gov.ng` text. Footer heading "Strategic Partners" (which implied partnership with government bodies) renamed "Official Sources". |
| 3 | Named public source or cut | PARTIAL | New and edited copy is sourced (section 3). Legacy pages not rewritten in this pass were not checked claim by claim: `/investor-protections`, `/compliance-tracker`, `/about`, `/concept-note`, FAQ, Terms. |
| 4 | Checks, not operators | PASS | No failed items published. |
| 5 | Tone | PASS on scan | Scan of 21 routes for game changer / act now / limited slots / guaranteed / government-backed / government endorsed / hurry / last chance / high-yield: 0 hits. |
| 6 | Production-ready, CONFIRM markers | PASS | Markers in section 9. |
| 7 | Perishable verdicts | PASS | No VERIFIED verdict published. Re-check date for sourced facts: 25 Oct 2026. |
| 8 | Warm-neutral on associations | NOT AUDITED | |
| 9 | No internal strategy in public copy | PASS | Grep of this pass's diff and commit message for SADWF, AfriTrade, War Council, honoraria, firewall, endgame: 0 hits. |

## 3. Claims audit (added or kept by this pass)

| Claim | Source | Verdict |
|---|---|---|
| Three bios (Ikoku, Uduk, Abubakar) | Founder-supplied file `NDIG_Trust_Layer_Bios_25Sep2026.txt`; the file records that the founder supplied the photos and confirmed rights. I did not independently verify career details. | Founder-supplied; re-check by 25 Oct 2026 |
| FMBN launched its NHF Diaspora Mortgage Loan in London on 7 Aug 2026; up to ₦100m at 9% p.a., maximum 10 years, subject to affordability and requirements; NiDCOM and CBN represented | FMBN press release, fmbn.gov.ng (URL in work order), read 25 Sep 2026: figures, date and venue appear in the text | VERIFIED, re-check 25 Oct 2026 |
| iGuide Nigeria is an NIPC-linked portal referenced in US State Department Investment Climate Statements | Work order ruling. The page loads (HTTP 200, "iGuide Nigeria: A guide to doing business in Nigeria"); I did not verify the NIPC link or the State Department reference | Founder ruling (Work Order 2, 25 Sep 2026): verified live. I confirmed only that the page loads. No [UNVERIFIED] tag on the page or in this report's open items. |
| Eko Atlantic, a new coastal city on reclaimed land at Victoria Island | ekoatlantic.com, checked 25 Sep 2026 | VERIFIED (from Work Order 1) |
| homefund.ng as an operating platform | None; work order says it is not operational | Cut |

## 4. Tone audit
21 routes scanned in the live DOM: zero hits (list in rule 5). `/join` scanned for "Intelligence Brief": none remain.

## 5. Dead-end audit and external links

Internal links on 21 routes plus footer and nav: every target is a live route. No internal link points to a removed page.
`/policy-interface` remains an unlinked "Coming Soon" route; CONFIRM: delete the route if it should return 404.

| Link | Target now | Status |
|---|---|---|
| iGuide Nigeria | https://theiguides.org/public-docs/guides/nigeria | 200. Annotated as "external page". |
| homefund.ng | Removed. Replaced by the FMBN announcement URL from the work order | 200. `/homefund` page rewritten as "FMBN Diaspora Mortgage" (route unchanged). |
| NiDCOM | https://nidcom.gov.ng/investment/ (found on the NiDCOM homepage; the domain root returns 406 to curl but loads in a browser) | Deep page not fetched. CONFIRM in a browser. Government-site note shown. |
| SEC | https://sec.gov.ng/for-investors/find-a-registered-operator/ (found on the SEC homepage in a browser) | Homepage 200; deep page not fetched. Government-site note shown in footer. |
| NIMC | https://nimc.gov.ng/diaspora and /enrolment-centres | 200. Government-site note shown on the card. |
| NIPC, CBN (footer) | Domain roots | 200. Note shown in footer group. |

Annotation text used, verbatim: "Government sites are intermittently unavailable. NDIG offers boots-on-the-ground verification where possible." It appears on the NIMC, NIPC and NiDCOM cards on `/diaspora-readiness` and under the footer "Official Sources" group.
Nothing was cut under item 6(d): every link resolved during this pass. Earlier in the day the same NiDCOM, SEC and NIMC hosts timed out from this machine and later answered, which is the intermittency the work order describes.
Broken images still present on `/`: `/images/hero-banner.jpg`, `/images/trust-centre.jpg`, `/images/productivity-network.jpg`. The files never existed in the repo.

## 6. Diff summary
- Deleted: `client/src/pages/InvestmentNexus.tsx`, `DiasporaBonds.tsx`, `BankingOptions.tsx`, `InvestmentIndex.tsx`.
- `vercel.json`: four 301 redirects.
- `client/src/App.tsx`, `components/Layout.tsx`: routes, nav and footer clean-up; "Official Sources"; FMBN footer entry; government-site note.
- `client/src/pages/Home.tsx`: removed CBN section, bond and investment buttons, Investment Nexus and Policy modules; Professional Network module carries the supplied copy.
- `client/src/pages/TrustCentre.tsx`: bios and photos; CBN logo and Banking Options button removed.
- `client/src/pages/HomeFund.tsx`: rewritten around the sourced FMBN announcement.
- `client/src/pages/DiasporaReadiness.tsx`: NiDCOM deep link, iGuide description, government-site note.
- `client/public/images/trust/*.jpg`: three photos.
- `client/public/join/index.html`, `server/emailService.ts`, `emailTemplates.ts`, `joinRoutes.ts`, `docs/NDIG_WEEKLY_AUTOMATION.md`: article label; registration email rewritten.

## 7. Self-evaluation

| Task | Score | Note |
|---|---|---|
| 1 | 92 | Fixed and verified. Subscribers who confirmed earlier already received the old label; the fix is forward-only. Remediation if wanted: a one-line correction in the first Weekly. |
| 2 | 96 | Cut and redirected. Redirect status 301 is set in config; the live check confirmed the redirect, but the pane cannot read the numeric code. |
| 3 | 100 | |
| 4 | 96 | Route file remains. |
| 5 | 90 | Built and live. Photo-to-person mapping relies on the supplied file names; I cannot identify people from faces. One photo carries a "Studio 24 Photography" credit; the square top-aligned crop hides it, and the work order records rights as confirmed. Aisha Abubakar's bio says CEO "(2015)" and an award "in 2013"; kept verbatim. Remediation: CONFIRM both. The lazy-loaded photos were checked by file fetch, not rendered on screen, because the browser pane was hidden. |
| 6 | 85 | NiDCOM and SEC deep pages taken from each site's own homepage links, not fetched. iGuide claim not independently sourced. |
| 7 | 88 | Full report, but no screenshots on disk (same limitation as Work Order 1). |
| **Overall** | **91** | Legacy copy on unrewritten pages remains unaudited (rule 3). |

## 8. Declaration
**What I verify:** the live state described above, read from the rendered site and the Vercel API on 25 September 2026.
**What I cannot guarantee:** that no defect exists; that external sources stay accurate (re-check by 25 Oct 2026); that pages I did not read in full comply with rules 1-3 and 8; that any third-party image is rights-cleared beyond the founder's recorded confirmation.
**Downgrade path:** a failed item is downgraded publicly, not fixed silently. Nothing in this deployment prevents that.

## 9. CONFIRM list
1. CONFIRM: Eko Atlantic image rights pending (slot still marked; the Shore.Africa watermark and missing rights evidence stand).
2. CONFIRM: Assurance page: ruling on advertising revenue (Noticeboard model). Not built.
3. CONFIRM: Assurance page: first verified institution name and date.
4. CONFIRM: Assurance page: insurance category at launch or Phase 2.
5. CONFIRM: photo-to-person mapping and the "Studio 24" credit on `trust_mary_uduk.jpg`.
6. Aisha Abubakar bio corrected 25 Sep 2026 from the revised bios file (CEO 2014 to 2015; minister to 2019).
8. CONFIRM: NiDCOM `/investment/` and SEC `find-a-registered-operator` pages in a normal browser.
9. CONFIRM: delete the unlinked `/policy-interface` route?
10. CONFIRM: rules 1-3 review of `/investor-protections`, `/compliance-tracker`, `/about`, `/concept-note`, `/faqs`, Terms.
11. CONFIRM: broken hero and module images.
