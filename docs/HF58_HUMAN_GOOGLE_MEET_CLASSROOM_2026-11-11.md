# EnglishLegalese HF58 — live human classroom continuity and recovery
Date: 2026-11-11
Release status: **draft source candidate, NOT merged, NOT deployed**. Live Render remains HF53 until a separately verified release.

## Governing mission
EnglishLegalese.com is the real, largely completed Legal English and Business English platform. Keep worldwide adult learning, live human teachers and existing courses operational. Thailand and Vietnam are equal first onboarding priorities; China is third, with regional video availability verified individually. The separate EnglishLegalese Outreach chat owns **all** prospecting, lead generation, outbound contact and applicant follow-up. This site builder owns code, site operations and technical workflows, not recruiting outreach.

Never touch the separate Thai high-school offline classroom builder or TR-Clone. Adopt TR-Clone only after tested authorization, versioned contracts, security and mutually approved deployment. Human teachers are never displaced and AI classes must be clearly marked.

## Baselines and source continuity
- Render live source: HF53 main commit `05da0352355dbc3fd6eb8b472c49289d594a8e6e`.
- Cumulative HF56 draft PR #100 and HF57 draft PR #101 remain unmerged. HF58 extends the exact HF57 source snapshot rather than an old ZIP.
- Governing audited EnglishLegalese Universal Builder V1.6 (2026-11-08), with embedded V1.4 and historical native V21. Preserve original files and all rollback history.
- HF57 CI run 42499772509 failed **24 browser cases in 5 underlying failures**. The HF58 branch fixes unbound `path` in a test, a hidden link assertion, enrollment class selector collision, and navigation link count drift, without removing the tests.
- Safeguarded source/assets: `index.html`, `styles.css`, `assets/englishlegalese-logo.png`, `assets/teacher-classroom-photo-locked-hf26.svg`, `learn/legal-english/index.html`, `learn/business-english/index.html`, `pricing/index.html` and production configuration. Validate SHA tree against main.

## HF58 changes
1. Teacher-operated **presentation tab** from the real private classroom. Shares fictional lesson goal, vocabulary, scenario, model and speaking prompts in a separate window. No token, learner identity, confidential real-world contract, teacher-only prompt, audio recording or network call goes into the window. Teacher shares only that tab in Google Meet; Google Classroom is not required.
2. An assigned, email-verified student with a revocable active session can POST `/api/v2150/private-energy/sessions/:id/change-request` for cancellation or an alternate future time. The request is saved atomically in the assigned class metadata, one pending request per class. Original class time and Google Meet remain unchanged; no payment, refund, credit assessment, cancellation fee, calendar mutation or outbound email occurs. The teacher sees the pending request in their signed-in class view.
3. Exact lesson notice period and credit policy **NOT YET APPROVED**. `ENGLISHLEGALESE_PRIVATE_CLASS_NOTICE_HOURS` may display only if explicitly configured to an integer 1–168; even then it does NOT determine any charge or refund. Never invent 24/48 hours, zero-penalty or lesson credit eligibility. Do not auto-cancel a calendar event.
4. `GET /api/v2150/private-energy/teacher-conflicts?starts_at=...` checks only assigned teacher's **EnglishLegalese** stored sessions, without disclosing student identities. Server blocks new and attached sessions with overlapping internal time. External Google calendars are **not yet checked** by this API; teacher must examine them separately. Availability check never says globally conflict-free.
5. Direct domain navigation from current Account, Owner and Student Saved Work pages to existing authenticated teacher/student class functions. No duplicate or bypass authentication.
6. Inherited and newly added tests: authenticated read-only readiness, assignment, selected 12 x 60-minute lessons, browser presentation, scoped student change and data minimization, internal conflicts, teacher role and no billing. See `scripts/verify-hf58-class-changes.js` and `tests/hf58-human-classroom.spec.js`.

## Not falsely claimed
- A student's new request is not a confirmed cancellation or completed reschedule.
- No automated Google Calendar sync, conflict scans across all external calendars, conflict/transactional emails, changes to Google-created events, payments, verified student onboarding or production lesson join test has occurred in HF58. Provider setup and real credentials must be qualified first.
- Google Meet is used as external live video provider; EnglishLegalese remains the course and account source of truth.
- Existing automated checks with mocks are NOT evidence that a real Vietnamese learner can log in or join. Before live use: CI green on exact HEAD; verify main release and production runtime (DB, auth, email verification); owner logs in; learner signs up and verifies; teacher assigns lesson; Google Meet is attached or generated and inspected; do a consented 5-minute two-account rehearsal; verify privacy and backup. Only then call it ready for production teaching.

## Next multi-area build requirements (no one-fix versions)
- Owner-configurable cancellation/credit policy, explicit consent/acceptance, notice calculation and tested billing-safe case lifecycle.
- Transactional notices to actual consenting student and teacher when requested, acknowledged, approved, and changed; delivery retries and no unsolicited outreach. Confirm recipient identity and provider configuration.
- Google Calendar free/busy across all owner-authorized calendars, idempotent event creation/update/delete with reconciliation and rollback, no spoofed conflict-clearance.
- Teacher review and approve/decline change requests without false calendar sync, with audit trail and role-scoped permissions.
- Production pilot: secure direct authenticated student/teacher dashboards; test desktop/tablet/mobile including Google Meet tab share and private prompts.
- TR-Clone versioned read-only capability handshake and clear human/AI labels; do not enable live AI teacher until readiness gate.
- Full tests, visual no-drift, accessibility, security, performance, privacy and rollback at each release.
