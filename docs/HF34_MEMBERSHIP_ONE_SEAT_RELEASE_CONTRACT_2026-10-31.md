# HF34 — one-employee-start membership implementation and release contract
**Owner authorization:** 2026-10-31, user explicitly approved beginning implementation of subscriptions and rejected a 10-seat minimum. This is the NEXT WEBSITE VERSION, not a new builder.

## Currentness and authoritative base
- Base/source: HF33 qualified main commit `13e773fcd13de780da87bc225ca874e617daf484`; exact matching Render live deploy `dep-dbind795efls73d7vfj0` verified through connected service.
- HF33 PR #87: 2 independent exact-head GitHub release jobs SUCCESS, accessible account/owner screenshots inspected on desktop Chromium, tablet Chromium/WebKit, mobile Chromium; merge was guarded by exact head.
- Attached V20 builder archive inspected and integrity checked; inherit every original owner rule and the cumulative backlog. Preserve owner-approved HF31 image-led homepage, photo, logo, courses, pricing, account and role security.
- Separate unmerged certification draft PR #86: not activated or conflated with membership or CEFR accreditation.

## User benefit and commercial rule
A 10-seat company minimum excludes solo firms and individual HR pilots. **The proposed digital license starts at ONE seat.** Prices in USD:
- Individuals: Starter $12/month (proposed 100 AI replies), Plus $19 (250), Pro $29 (500), Guided $79 (250 + two possible 50-minute small-group lessons ONLY after actual human capacity/booking).
- Companies: graduated **incremental** licensing: seats 1–4 $25 each; seats 5–19 $23 each; seats 20–49 $21 each. This avoids the otherwise nonmonotonic pricing cliff at 20 seats (19 × $23 = $437; 20 × $21 = $420). Under graduated pricing 19 costs $445 and 20 costs $466. 50+ is a custom quote, **never** an invented volume price.
- Seat count valid 1–10,000; whether a company pays monthly or signs annually must be separately agreed. Annualized cost equals 12 × indicative monthly and is NOT an annual invoice, contract, or unapproved discount.
- Teacher-led lessons, actual certificate examinations, bespoke workshops, tax, AI usage beyond hard caps and human support are not silently included.
- No subscription is purchasable, created, charged, renewed, canceled or granted by any new code. Paid AI and corporate seat permissions stay OFF until reconciled Stripe billing and explicit authorization exist.

## Implemented actual code
1. `learn/memberships/index.html`: separate usable public plans and request form; existing site header/footer; user-first wording; proposed not live.
2. `product-v1970-memberships.js` and `hf34-memberships.css`: scoped interactive accessible seat calculator, progressive quote including 1 seat, genuine remote readiness state, explicitly consented information-request form, correct idempotent retries, no auto mail, safe no-JavaScript wording and mobile layouts. Responsive screenshots emitted by real browser tests.
3. `src/v1970-memberships.js`: authoritative safe quote/candidate catalog; optional opt-in inquiry persistence only when real dedicated table exists; strict origin, rate, UUID and input validation; no fake success; authenticated owner/admin owner inquiry review; strict checkout 503. No tokens, payment methods, student answers or private employer progress returned to public users.
4. `db/migrations/022_hf34_membership_interest_requests.sql`: additive only, minimal consented contact and selected plan info, tenant-private, idempotent. Migration was successfully applied **to isolated Neon staging branch** `br-dawn-dust-artlvc42`, not production; further production application requires independent qualification and no data-loss backup. No subscription/seat billing tables or entitlement migrations applied.
5. Existing Pricing, Employers and Account pages gain small context-specific memberships links, all existing prices, old inquiries, catalog, website navigation, user roles and approved homepage unchanged.
6. Owner dashboard reads latest 50 true private opt-in inquiries, only with authenticated owner/admin revocable session; no automatic communication.
7. `scripts/verify-hf34-memberships.js` validates server-side price and privileges, idempotency, consent, one-seat behavior and no checkout. `tests/hf34-memberships.spec.js` tests 4 browser profiles and saves visual screenshots.

## Rule inheritance / no-drift and research ledger
- EL-RGR-001..019, EL-DUR-001..010, active addenda, owner 2026-10-31 meaningful-benefit-only rule: unchanged and binding. No brand/photo/homepage visual mutation.
- ADOPT: tiered graduated seat pricing to avoid 20-seat price regression; ADAPT original volume price bands to incremental seats; DEFER custom 50+ pricing pending actual negotiation; REJECT a minimum of 10 seats by owner's explicit instruction.
- Fresh contextual source: EWA for Corporates describes 1–10 learner trial route, Gallery Teachers describes variable team tiers, Stripe documentation distinguishes licensed per-seat quantity and customer portal subscription update/cancel operations. See https://business.appewa.com/corporates, https://galleryteachers.com/corporate-english-training/, https://docs.stripe.com/api/subscriptions/update. Research is not a claimed endorsement or market-validation study.
- No external Stripe products, Price IDs, customer profiles, mandates, webhooks, emails, attendance, enrollments, credentials or entitlements activated.
- Reasonable mobile accessibility uses native labels, role=status, real focus ring and no script-inserted untrusted HTML. Any browser visual issue is release-blocking.

## Release gates and rollback
**Candidate status until** two independent exact-head Github Actions jobs pass on the final source SHA (including desktop, tablet, mobile Chromium and WebKit), security/audit checks are green, screenshots inspected, current main still matches base, and guarded merge. After merge require Render matching merged SHA and both hostnames verified with new page and working 1-seat estimate. On failure preserve HF33 production `13e773fcd13de780da87bc225ca874e617daf484` and its known-good deployment. Do not assert production inquiry persistence unless Neon production migration and live end-to-end submission are separately verified.

## Deferred next implementation work
- Stripe exact product/price mapping with live/test separation, webhook signature and idempotency, source-of-truth ledger and invoices, tax, cancellation/renewal notice, proration/refund, credentials and terms; payment charging forbidden until fully approved and tested.
- Individual verified student paid entitlement plus AI reply metering; different from 3 free preview requests.
- Organization verification, real invoiced paid-seat ledger, invitation/consent workflow, named-seat transfers and account privacy. Paid seats must not be inferred from an interest request.
- Teacher capacity and lesson-credit liability, confirmed calendar/schedules, real examiners/assessment/certificates under separate human supervision gates.
- Genuine applicant contact workflow, retention/deletion/export, no bulk marketing.
