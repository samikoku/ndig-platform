# NDIG Copy Doctrine

Every public word on ndigateway.org, in the Concierge chat, in NDIG emails and in the newsletter follows these rules. They are not style preferences: each one protects the institution's standing as an independent verifier.

## The rules

1. **NDIG never sells.** It does not offer, distribute or take subscriptions for any product. *A verifier that sells has a stake in the verdict.*
2. **NDIG never holds funds.** Investments settle through licensed banks and custodians; NIPC and NDIG point the way, money never passes through either. *Anyone who touches the money needs a licence NDIG does not have and should not want.*
3. **NDIG never advises.** No recommendations, no suitability calls, no "you should". It reports what public records show. *Advice is a regulated activity, and a recommendation turns a verdict into a sales pitch.*
4. **Regulator-vetted, not government-backed.** NDIG is independent and private-sector. Never say or imply government backing, endorsement, approval or guarantee. *A false claim of state backing is the exact misrepresentation NDIG exists to catch.*
5. **Every number is sourced.** A figure appears only with its source next to it. Instrument dates and figures come only from the verified ledger (`INSTRUMENT_LEDGER` in `client/src/config/siteCopy.ts`); anything not on the ledger comes out. *An unsourced number is a claim NDIG cannot defend.*
6. **No named-person quotes without a primary source.** A regulator's or official's words never appear unless a primary source is linked. *Putting words in a regulator's mouth borrows authority NDIG has not earned.*
7. **No unsourced counts.** No "thousands of users", "350,000+ diaspora" or similar unless the count has a source. *Inflated reach is marketing, not verification.*
8. **No promised outcomes.** No guaranteed, risk-free, high-yield or projected returns. *Every investment carries risk; NDIG's job is to show it, not hide it.*
9. **The identifier is a Verification Reference**, not a referral code. *NDIG verifies; it does not refer for a fee.*

## Where copy lives

- **All public strings live in `client/src/config/siteCopy.ts`.** Components import from it; no marketing copy is written inline in a component. Change copy in one place.
- The Concierge's facts live in `knowledge_base.md`; its behaviour rules live in the system prompt in `server/routers.ts`. Both follow this doctrine.
- Legacy pages that still carry inline copy move into `siteCopy.ts` the next time they are edited.

## The check

`npm run doctrine:check` scans the built site (`public/`), `knowledge_base.md`, the email templates and the newsletter archive for banned phrases, and fails if any appear.

- It runs automatically in `npm run build` and in the Vercel build command (`vercel.json`), between `vite build` and the API bundle. A breach fails the deploy.
- There is no separate CI in this repo; the Vercel build is the gate. Run it locally after `npx vite build` before every push.
- **Every copy change must pass the check.**
- **When a new banned phrase is discovered, add it to `BANNED` in `scripts/doctrine-check.mjs` in the same commit as the fix**, with a one-line reason.
- To audit an older build: `node scripts/doctrine-check.mjs --public <path-to-built-site>`.
