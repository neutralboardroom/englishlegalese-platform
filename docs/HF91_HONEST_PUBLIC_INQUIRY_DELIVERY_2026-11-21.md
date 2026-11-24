# HF91 — real public inquiry readiness and safe delivery

**TR-EnglishLegalese only.** DRAFT, not deployed. Cumulative successor to HF90 PR #135 exact SHA `1c50cbbd43824f191baa923314235aaf63090e88`, Builder V5.0 (217 pages, 127 attachments). All other TR projects strictly read-only.

## Why this matters to actual visitors

The site's public enrollment and teacher forms POST to `/api/v1850/enroll` and `/api/v1850/teacher-applications`. Their real PostgreSQL-backed handler already fails closed when `ENGLISHLEGALESE_INTAKE_DATABASE_URL` is unavailable or the necessary tables have not been provisioned. Visitors nevertheless had no clear way to check availability before entering contact details. In the absence of a reachable intake database, a submitted form is **not delivered** and does not generate an email, booked class or payment.

## Implemented HF91

- **Actual site enhancement** (not a disconnected rehearsal): an accessible, voluntary **Check request availability** control added to the public enrollment and teacher-application forms. It calls only the existing same-origin no-store `GET /api/v1850/intake-status` endpoint, which now supports independent channels `enroll` and `teacher`. The original default `all` behavior remains.
- Each availability request uses GET only, **no form details**, no cookies, no persistence, redirects denied, no cache and a six-second bounded attempt. Invalid, offline, unavailable, malformed and unexpected responses **fail closed**.
- Real form submission rechecks availability **before** sending personal details. If unavailable, there is **zero POST**, a truthful not-sent explanation, and the user's typed fields stay on screen without being transmitted or stored. Existing real Postgres writes remain authoritative after the guard; the guard cannot claim submission based solely on a successful GET.
- If available, the ordinary original form submission uses the exact same durable endpoint, server-side identity/rate limits, idempotent UUID and user-facing reference. No Stripe checkout, automatic email, AI provider, calendar booking, new database, client logging or browser storage was introduced.
- The GET can check enrollment and teacher tables separately; failure of one table need not falsely block the other. Existing callers without `channel` retain the two-table readiness behavior.
- Four pre-existing Playwright tests that simulated successful intake now also simulate a healthy **readiness GET**, retaining their original submit, privacy, package, country/language and reference checks. A new dedicated browser regression covers unavailable/no-POST and available GET-then-POST for **both** forms, including no PII in GET.

## Safeguards and release limitations

- **Truthful privacy:** no actual user's personal data, pupil data, addresses, payment cards or employer records collected in synthetic tests. The status endpoint exposes only public readiness and `stripe_enabled:false`, never a database URI.
- **No false revenue claims:** published prices remain inquiries, **not** active Stripe checkout. No schedule or class slot is confirmed by checking availability.
- **No invented delivery:** this prevents known bad submission attempts; it does NOT provision a Postgres database, prove actual production delivery, create owner notifications, or authorize paid enrollment. A real synthetic, explicitly consented staging intake round-trip and a verified operator read are still required.
- Local Chromium and source tests are distinct from GitHub's independently qualified full Chromium/WebKit regression, real Android Chrome/iPhone Safari acceptance, native professional review, production data backups, authorized ControlCenter/provider review and Render live rollback acceptance.
- EL-RGR-020 standing qualified automatic release remains binding, but only when every outstanding factual gate is actually satisfied. Keep PR DRAFT, Render main unchanged until then.

## Canonical release no-drift contract

EL-RGR-020 remains unchanged: **every fully qualified release is deployed automatically without repeated owner approval**, after ALL recorded gates genuinely pass. The permanent source is `governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md`. Exact Git HEAD source, cumulative Builder, both independent CI jobs, real devices, native professional reviews and Render rollback must be independently verified. An unqualified development version is not called live.
