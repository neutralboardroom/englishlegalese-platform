# EnglishLegalese v1.74.0 — Free-Services Connection Automation (CANDIDATE ONLY)

This material candidate adds an optional HTTPS Resend transactional-email transport for existing account-verification emails, suitable for Render Free's blocked SMTP ports, and retains all v1.73.0 protections. It prepares connection to Neon Free via standard `DATABASE_URL`; it does not create a database or verify credentials.

**Public and deployment status:** NOT MERGED; NOT DEPLOYED; NOT ACTIVATED. Keep v1.73.0 live until two independent release qualifications and separate real production acceptance pass.

**Changes:** `src/transactionalEmail.js`; opt-in Resend branch in `src/productionServices.js`; updated email-readiness predicate in `src/freeTrialLedger.js`; mock-only Resend readiness/transport tests; account-owner operations handoff; package version/script and inherited improvement register.

**Gates:** `RESEND_API_KEY` and `RESEND_FROM_EMAIL` both required for HTTPS sending. Existing PostgreSQL+secure session+OpenAI+explicit trial-enable+table-readiness requirements remain intact. No changes to paid entitlement or Stripe fail-closed status. No current verification emails are sent just by deploying code.

**Do not assume:** Resend domain DNS verified; Neon project created; migrations executed; independent backup completed; trial opened; customer verification email delivered; payment working; uploaded documents processed; user credits spent.

**Preservation:** Original approved logo, all previously accepted public UX, nine courses, 21 scenarios, all diagnostic and educational labs, protected 19+10 governance rules, existing Render and database projects remain untouched. Retain live v1.73.0 rollback. Full release qualification and real-site acceptance required before merge or deployment. See `docs/FREE_SERVICES_AUTOMATED_ACTIVATION_V1740.md`.
