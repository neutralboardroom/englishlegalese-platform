# EnglishLegalese HF33 — dashboard security and accurate account navigation
**Prepared 2026-10-31. Candidate only until independent exact-head CI, visual acceptance, merge and Render/live checks.**

## PRE_BUILD_RULE_LOCK_RECEIPT / CURRENT_RULE_STATE
- Authoritative predecessor: HF32 production main `96109484549d7b4444c6b51def96d6613813bf5b`, Render live deploy `dep-dbimp9dg1s2s73f6cfm0`. Unlike V20 historical HF31 baseline, HF32 PR #85 has merged and is live. Never reapply stale HF30/earlier layouts.
- V20 attached instruction ZIP integrity validated against its 99 manifest, V19 byte identity and nested ZIP chain. Original V20 rule register and 100K+ cumulative backlog fetched from connected GitHub; canonical rules **EL-RGR-001..019** and durable **EL-DUR-001..010** retained unchanged.
- User additionally directed that all four user dashboards should be reviewed, so scope prioritizes material role-specific functionality rather than a homepage redesign.
- Pending separate certification issuance PR #86 is **draft**. It must not be merged or activated without actual examiner calibration, approved rubric, database staging/migration, privacy and issuer validation. Do not silently interpret pending proposal as certification live.

## BENEFIT CASE
1. **Owner/admin and employer private dashboards lacked account-wide sign-out** even though students and teachers already had it. All-device revocation closes a material risk when a privileged account is used on a lost/shared device.
2. **Employer enrollment retries reused an old client request ID after form details changed**, potentially replaying an earlier request rather than creating a genuinely different pending training request. Binding the idempotency key to exact request content preserves safe network retries without silently mixing two intents.
3. **Public Account page incorrectly stated that employer logins and reports were not active** although authenticated, consent-gated employer functionality was already implemented. Accurate labeling and direct link to the real authenticated workspace reduce misleading user journeys.
4. Student and teacher save/review and all-device sign-out already exist; no redundant duplicate functionality or visual overhaul is necessary.

## ADOPTED SOURCE CHANGES
- `src/v18510-role-workspaces.js`: owner, admin, employer `/api/v18510/workspace/logout-everywhere`, persistent-session-only, row-locked atomic session-version rotation and stored session revocation, correctly rolled back on failure; zero data deletion. Uses existing production schema and same session invalidation model as student/teacher controls.
- `role-workspaces-v18510.js`: visible confirmation-driven privileged all-device sign-out, reports success only after server confirmation; preserves signed-in state on failure; changes employer request retry ID when the selected workers, package, program or time changed. A retry with identical inputs retains its idempotency key.
- `learn/account/index.html`: truthful employer dashboard description, explicit private portal link and preserved separate general employer-inquiry path; owner/admin read-only readiness and logout behavior clarified.
- Regression tests: `scripts/verify-hf33-workspace-security.js`, `tests/hf33-dashboard-security.spec.js`. Both included in mandatory build qualification; browser tests use fictional accounts and intercept API calls. Tests do NOT create real data, email, payments or certificates.
- No production migrations. No paid checkout. No unsolicited email. No change to authorized employer consent filters, student work, teacher review privacy, approved homepage, logo, teacher picture, 48-topic class paths or certification statements.

## RULE_TO_TEST_TRACEABILITY / NO_DRIFT_NO_REGRESSION_RECEIPT
- EL-RGR-001,002,003,005,006,007,015,017: single product, current live predecessor, additive only, deliberate high-value scope, preserved old content/tests and exact-head candidate verification.
- EL-RGR-008,010: user-facing wording says account access can depend on verified setup and no actual payment or automatic booking.
- EL-RGR-009: all-device logout operates only on current authenticated user; no names, tokens, salaries or private lesson contents returned. Employer progress reporting remains published+consented only.
- EL-RGR-012: use existing native button/confirmation/role status messaging; no homepage change; desktop/tablet/mobile browser checks required.
- EL-RGR-018: merge and auto-deploy ONLY if independent exact-head CI and screenshot/visual acceptance are proven; otherwise hold candidate.
- EL-RGR-019: approved logo and teacher-photo file unmodified. Preserve checkout-disabled and pending-certification notices.
- EL-DUR-001..010: inherited unchanged; regression checks compare behavior, not just existence. Candidate is not a success receipt until checks complete.
- PRE_SEAL_RULE_LOCK_RECEIPT: **PENDING** (must recheck current main source and all CI statuses before merge).
- RELEASE_TEST_RECEIPT: **PENDING** actual independent workflow conclusions and visual review.
- No file deletion, schema change or private cross-tenant access.
- CROSS_PROJECT_RULE_TRANSFER_LEDGER: no sister-project data or rule authority transferred.
- RESEARCH_AND_COMPETITOR_ADOPTION_LEDGER: **ADOPT** OWASP's server-side session invalidation requirement instead of relying on clearing browser state (https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html; https://wstg.owasp.org/latest/4-Web_Application_Security_Testing/06-Session_Management/06-Logout_Functionality/). **ADAPT** W3C WCAG 4.1.3 guidance to announce private operation results in existing accessible status regions without shifting focus (https://www.w3.org/WAI/WCAG21/Understanding/status-messages). No competitor proprietary work or design borrowed; the direct product evidence was a documented security/accuracy gap rather than a need for visual benchmarking. **DEFER_WITH_REASON** unrelated certification market comparisons until assessment validity and real examiner controls are the release scope. No claim of third-party accreditation, standard certification or performance validation.
- Rollback: latest real pre-HF33 live Render `dep-dbimp9dg1s2s73f6cfm0` / main `96109484549d7b4444c6b51def96d6613813bf5b`. A new production rollback receipt can only be set after actual successful deployment.

## DEFERRED — DO NOT MISREPRESENT
- Student: verified registration and email provider readiness, teacher feedback and cloud storage depend on production services; existing working account dashboard retained. Future accessibility and security follow-up should use real learner evidence.
- Teacher: real calendar, attendance, roster, exam proctor training and private review history require verified teacher permissions and real class records. Current assigned-only review remains.
- Employer: new employee invitation/consent issuance, administrative seat approval, payment checkout/settlement and full confirmed booking remain inactive/unprovisioned as previously documented. Do not claim a submitted request equals a class booking.
- Owner/admin: real staff decisions, teacher approvals, consent workflow, payment operations and certificate decisions need deliberately scoped audited tools, not unverified UI buttons.
- Certification: distinct EnglishLegalese-issued Legal/Business assessments continue in a separate fail-closed draft; CEFR-*informed*, not externally certified or equivalence-validated.
- Pending documentation must be carried into `NEXT_VERSION_IMPROVEMENT_LIST.md` after release qualification.

## Final release / rollback
At time of writing: candidate source modified; regression and CI receipts pending, no merge or production deployment claimed. Require both exact-head jobs green, zero high/critical vulnerabilities, actual browser review and exact production SHA and public hostname checks.
