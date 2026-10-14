# NDIG — Nigeria Diaspora Investment Gateway (ndigateway.org)

Vite + React client (`client/`), tRPC/Express API bundled to `api/index.js` for Vercel (`server/`), Postgres via Drizzle (`drizzle/`).

- Build: `npm run build` (Vercel runs `npx vite build && node scripts/doctrine-check.mjs && node scripts/build-api.mjs`)
- Copy rules: [`COPY-DOCTRINE.md`](COPY-DOCTRINE.md). All public strings live in `client/src/config/siteCopy.ts`. `npm run doctrine:check` must pass; a breach fails the deploy.
- Brand assets: `npm run brand:assets` regenerates the seal SVGs, favicons and og-image from the vector components in `client/src/components/brand/`.

## Email routing

Configured in `server/mailRouting.ts` (single source of truth). Mailboxes themselves are provisioned outside this repo; this code only chooses which existing mailbox each automated flow uses.

| Flow | Internal alert to | Subject prefix | Auto-reply sent from |
|---|---|---|---|
| Verification submissions (`/verify-opportunity`) | info@ndigateway.org | `[VERIFY]` | info@ndigateway.org |
| Execution service requests | execution@ndigateway.org | `[EXECUTION]` | execution@ndigateway.org |
| Grievance and redress submissions | redress@ndigateway.org | `[REDRESS]` | redress@ndigateway.org |
| Press and media | press@ndigateway.org | `[PRESS]` | press@ndigateway.org |

- **smi@ndigateway.org is the Chairman/Founder address. Nothing automated routes there.** `assertRoutable()` throws if any route or sender is set to it, and a unit test enforces it.
- **Protocol (absolute): execution and redress services are always delivered through verified third parties.** The execution and redress auto-reply templates say so, and a unit test enforces the wording.
- Wired today: verification (internal alert + acknowledgement to the requester). Execution, redress and press have routes and templates ready; the site has no submission forms for them yet. A new form calls `routeInternal(category, …)` and `sendAutoReply(category, …)`.
- Transactional mail is sent through Resend (`RESEND_API_KEY`). Without the key, sends are skipped and logged; submissions still succeed.
- Auto-reply templates are scanned by `npm run doctrine:check`.
