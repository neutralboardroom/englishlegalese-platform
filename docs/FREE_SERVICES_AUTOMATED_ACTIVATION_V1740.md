# v1.74.0 — Free-Services Automation Handoff (PREPARATION ONLY)
Date: 2026-10-20

## Intent
Connect EnglishLegalese's existing Render Free web service to a dedicated Neon Free PostgreSQL database and use an EnglishLegalese-specific Resend sender over HTTPS. After **one-time owner account authorization**, onboarding and mail verification operate automatically. This file does **not** assert that a free trial is live.

## Existing source of truth
- v1.73.0 live predecessor: GitHub `main` commit `e18334e13bb32dec891f0a90b6d6f62c1ed84cfd`, PR #25; duplicate PR #26 closed unmerged.
- Render service: `englishlegalese-platform`, `srv-d97p18vavr4c73dbls40`, Free, Oregon. Auto-deploy from GitHub `main`.
- The existing Render Free PostgreSQL slot is already used by a different project. Do not share databases.
- Resend is already connected, but an EnglishLegalese-specific sending domain is not yet verified. The Resend quota is account-wide and shared.
- Trial remains fail-closed until stable database, secure secret, verified sender, OpenAI key, migrations, testing, and explicit `SMARTTEACHER_TRIAL_ENABLED=true`.
- Paid AI, Stripe checkout and real file processing remain off. Existing browser-only examples remain accessible.

## Owner one-time work
1. Create/sign in to Neon Free and connect its ChatGPT app, so the project can be provisioned and migrated with authorized tools.
2. Approve/complete only the EnglishLegalese DNS records Resend requests for a **sending-only subdomain**, if DNS access cannot be automated. DO NOT alter the existing MX, email inbox, registrar, or unrelated projects.
3. Authorize actual use of OpenAI credits for the three-reply trial after cost/safety tests. No subscription upgrades or paid services without separate explicit approval.

## Automation operator steps after the accounts are connected
1. Confirm latest GitHub `main`, Render LIVE deployed SHA, existing email domain/mail routing and available Resend sender slot; preserve rollback.
2. In Neon, create dedicated EnglishLegalese Free project with an appropriate region; obtain a database role and protected `DATABASE_URL` without placing credentials in chat, repo, screenshots or a ZIP. Verify persistence, TLS and free-tier limits; plan verified off-provider exports because free-tier restore is limited.
3. Install additive migrations `db/migrations/001_...` through `010_...` **on that EnglishLegalese database only**, validate presence of users and two trial tables. No destructive reseeding, drop, replacement, or cross-project data.
4. Verify EnglishLegalese sender domain in Resend; generate an appropriately restricted sending API key and store it in Render service secrets only. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL`. Keep the historical SMTP path for environments that support SMTP; for Render Free prioritize the HTTPS API.
5. Set Render `DATABASE_URL`, a strong `SESSION_SECRET`, and the pre-existing verified `OPENAI_API_KEY` (preserve it if already present). Never replace unrelated environment variables. Keep `SMARTTEACHER_TRIAL_ENABLED=false` during setup.
6. Deploy only after **two complete, independent successful exact-final-head source/security/browser release gates**; verify Render LIVE matches GitHub merged commit and save independent apex/www acceptance screenshot evidence.
7. Test one verification email, one-time token, duplicate signups, isolated student role, account login, and rejected unverified access. Audit actual delivered status; Resend acceptance alone is not guaranteed inbox delivery.
8. Confirm durable *lifetime* three-reply balances across restart/redeploy, fourth call blocked, per-IP/day/month limits, cancellation and provider-error refund, 2,500-char countdown, unchanged 5,000 paid-only mode; test with a small controlled API spend.
9. Enable public three-reply trial only when ready, budgets externally constrained, and owner authorizes launch. Immediately recheck live site and keep rollback/fix-forward plan.
10. Monitor provider quota, delivery errors, database metrics, and AI usage; notify owner of limits or problems, rather than silently upgrading anything.

## Current code changes in v1.74.0 preparation PR
- Adds `src/transactionalEmail.js` for fail-closed Resend HTTPS sending with mockable fetch, bounded timeout, no secret/message logging.
- `src/productionServices.js` prioritizes Resend over historical SMTP only when its required environment variables exist.
- `src/freeTrialLedger.js` treats configured HTTPS sender or configured SMTP as email infrastructure, while **all other readiness gates remain unchanged**.
- Adds `scripts/verify-v1740-transactional-email.js`, a zero-network, mock-only regression run included in `npm run check`.
- This release does not automatically create a Neon or Resend account and **does not enable trial**, collect real payment, upload documents, or send outreach emails.

## Rollback / operational caveats
- Avoid repeatedly auto-restarting to evade Render Free or Neon Free inactivity/usage limits.
- Render Free's ephemeral filesystem is not a database; do not store user ledgers there.
- Do not run SMTP on blocked ports 25, 465, or 587 from Render Free.
- Resend transaction emails only for account verification and permission-based user messages, not unsolicited cold outreach.
- A missing sender/Neon account must leave trial disabled. A new PR never implies deployed code.
- Every code change must preserve approved logo and 19+10 canonical rules, nine courses, 21 scenarios, and prior educational labs.
