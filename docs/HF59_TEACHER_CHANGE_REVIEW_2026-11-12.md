# EnglishLegalese HF59 — teacher review queue and classroom safety
Date: 2026-11-12
Status: **DRAFT CANDIDATE, not merged, not deployed, not accepted.**

## Independent, verified baselines
- Production/main software baseline recorded in the audited governing materials: HF53 at `05da0352355dbc3fd6eb8b472c49289d594a8e6e`. GitHub `main` was independently rechecked at this exact commit on November 12. A fresh Render deployment comparison requires workspace confirmation; public site content alone does not prove the deployment SHA.
- Latest pre-existing cumulative candidate: HF58 at `23ca8ee6543c6be0fdf9298b8dc67f5c18a9f56f` (draft PR #102). HF59 branches from its exact tree; does not discard HF54–HF58.
- Latest coordinated PDF governing builder: EnglishLegalese V1.7 / HF58, 67 pages, dated November 11; contains full unmodified V1.6 61-page predecessor and embedded archives. Native builder lineage V21 is separate and must remain preserved.
- Other project software and builders remain entirely out of scope. Separate outreach builder owns all lead generation and external marketing.

## HF59 implemented changes
1. **Teacher-only authenticated change-request review**. Adds `POST /api/v2150/private-energy/sessions/:id/review-change`; requires a live revocable session, registered teacher/owner/admin role, the **assigned teacher's own class**, and an actual pending student request. Student, outsider teacher, unauthenticated, stale and invalid decisions are refused.
2. **Two deliberately non-final decisions**: `decline` (request rejected; prior booking preserved) and `coordinate` (teacher records that student/teacher/provider coordination is still required). Neither action approves a reschedule or cancels a booking, and neither action issues a refund or sends a message. No false confirmation.
3. **Safe, restricted reason enum** only: manual coordination, conflict, insufficient information, other. No free-text client names, documents or legal advice in the audit record. Atomic SQL conditional update checks pending request timestamp and review status, retaining the previous class row and append-only JSONB review-history array with reviewer ID and timestamps.
4. **Teacher review UI** surfaces pending requests in the actual authenticated private-classroom page, shows a proposed new time in UTC+7 where applicable, requests explicit confirmation and makes the decision using the same server-side access checks. Student UI exposes only status, never teacher action buttons. More requests are blocked while coordination is unresolved.
5. **Regression qualification**: `scripts/verify-hf59-class-review.js` exercises 401/403/404/409, invalid decisions and reason enum, teacher-only access, repeat rejection, audit immutability, unchanged time/status/Meet and zero calls to calendar, email or payments; `tests/hf59-review-queue.spec.js` covers student/teacher display and UI decisions.
6. **HF58 browser stabilization**: the sole failure in the prior 1,192-case CI matrix was a mobile-Chromium popup timeout. The inherited popup test now listens to the originating page's `popup` event rather than a broad browser-context `page` event; it still verifies all seven fictional-only slides, the teacher-only prompt exclusion, navigation, and no writes. **This is a proposed fix; must still be validated in fresh CI.**

## Explicit unresolved dependencies
- No owner-approved cancellation notice period, late fee, credit/refund logic. Never invent terms. Any policy must be separately documented, legally reviewed for target regions, accepted by student and covered by tests before real billing changes.
- No authorized global Google Calendar free/busy result, duplicate-event reconciliation, cross-calendar cancel/reschedule or transactional email receipts in this candidate. Check all external calendars manually. No automatic event creation or removal from review route.
- A true *final* approval workflow needs an explicit source-of-truth booking transaction, authorized provider event confirmation, idempotent reconciliation, and rollback/repair path. `coordinate` means open, not approved or completed.
- A synthetic DB is not a real PostgreSQL deployment verification. An authenticated two-account rehearsal, live calendar reconciliation, actual delivery provider, permissions/privacy, rollback, and release-gate green must precede production use.
- HF59 is not a proof of certification, AI Teacher Roger integration, student consent, attendance, real payment, or successful student participation.

## Release gates and next steps
1. Exact-head Node `npm run check` and both independent GitHub Release Gate jobs must pass.
2. Run complete desktop/tablet/mobile Chromium + tablet WebKit browser matrix, including inherited and new HF59 tests; no tests removed, muted or skipped to induce a green result.
3. Compare protected homepage, image, public Legal and Business topic, pricing and account assets against `main` and explicitly authorize any difference; this candidate is scoped to private class scripts, tests and documentation.
4. Verify all remaining open PRs and preserve full source history. Never merge HF59 while its parent HF58 PR #102 is unqualified: use cumulative source review and a single approved release sequence.
5. Obtain owner-selected Render workspace and compare Render deploy SHA to GitHub main and the governing source record before any deployment. Do not assume a failed candidate is live.
6. Pilot via two real approved EnglishLegalese accounts, valid existing Google Meet, private student assignment, and explicit teacher review; keep any client-specific data out of GitHub and public pages.

## Continuation
The active HF59 branch is `feature/hf59-private-class-review-20261112` on `neutralboardroom/englishlegalese-platform`. The original pre-existing HF58 PR #102, V1.7 governing PDF, V1.6 predecessor, native V21 builder, and all known-good rollbacks are unchanged. Do not merge, delete, rewrite release history, or deploy without validated exact-head gates.
