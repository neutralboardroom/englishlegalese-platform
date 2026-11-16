# EnglishLegalese HF60 — Responsive human classroom and accurate class lifecycle
Date: November 13, 2026

**State: UNMERGED DRAFT CANDIDATE. Not deployed, production-qualified, or verified with a live student.**

## Provenance: three separate release tracks
- **Governing coordinated Universal Next-Version Builder:** V1.8 HF59 candidate (71-page PDF, November 12, 2026), retaining the complete V1.7 HF58, V1.6, V1.4 ZIP archive, native V21 lineage, original attachments, durable rules, and recovery evidence. Builder versions do not imply application deployment.
- **Production/main GitHub source:** HF53 at `05da0352355dbc3fd6eb8b472c49289d594a8e6e`. The actual Render workspace/deploy SHA is not independently confirmed during this build; no deployment occurred.
- **Cumulative app predecessor:** HF59 draft PR #103, exact SHA `ac45774209d19f4ec71d699efddc4fffd05538eb`, which inherits HF54–HF58. Both HF59 release jobs failed only the mobile-Chromium popup browser test; 1,199 cases passed per job. HF60 branches from the exact HF59 source rather than an older PDF/ZIP.

## User and student operational truth
Some former students may have ended private instruction. **No former private student is to be treated as active merely because a historical class exists.** This software change does NOT automatically cancel or modify a student's real Google Calendar events, revoke access, delete legal learning history, charge accounts, backfill attendance, or communicate with the student. Any actual external calendar follow-up requires checking the owner's real calendars and appropriate authorization. Do not encode personal student names or facts in public code or fixtures.

## Coordinated HF60 improvements
1. **Mobile-safe teacher presentation.** Desktop retains the separate Google Meet shareable fictional-only window. Narrow viewports and blocked popups get a responsive fullscreen presentation (real accessible dialog, keyboard arrows, Escape/Close, focus restoration). Only an explicit seven-slide content allowlist is rendered; teacher-only prompts, learner names, documents, tokens, logs and real contract text are excluded. Do not claim all mobile operating systems support tab sharing.
2. **Reliable browser qualification.** The inherited full HF58 presenter privacy test now verifies both real narrow-screen inline rendering and desktop/tablet popup rendering. It retains slide progression, human teacher disclosure, teacher-only prompt exclusion, and absence of write requests. The HF59 revised popup-event listener alone did not solve the mobile browser timeout.
3. **Truthful current versus historical classes.** Actual signed-in classroom UI separates current/upcoming, unscheduled and past/closed class records; history stays reviewable under a collapsed section. Counts describe class records rather than active individual students, paid bookings or attendance. Completed/cancelled/past entries are never offered as current meeting links.
4. **Expired Meet link minimization.** The server no longer sends join links for completed/cancelled or past-dated scheduled classes beyond a conservative 30-minute post-lesson grace window. Protected readiness returns `past_class` rather than `ready` for these historical sessions.
5. **Truthful teacher class completion.** A teacher must explicitly confirm that the real lesson occurred; both server and database conditional write refuse to mark scheduled classes completed before the scheduled 60 minutes have elapsed. The UI makes this requirement clear while retaining historical records and a late-completion path.
6. **Regression protection.** Adds `scripts/verify-hf60-lifecycle.js` (Express fake database, teacher/student/outsider roles, history link controls, future-completion refusal, no external side effects) and `tests/hf60-class-history.spec.js` (browser historical classification and link privacy), updates inherited date-sensitive HF56 tests without removing coverage, and adds HF60 checks to `npm run check`.

## Locked product constitution
EnglishLegalese is a *real* professional Legal English and Business English school, not `demo.html`. Preserve approved homepage and image/branding, independent Legal and Business course tracks, full offered human-teacher choices, pricing, student/teacher/employer/owner dashboards, assigned courses, 14+ free learning tools, supervised certification offers with real human assessment, document save/resume, account/email verification, and existing production student records. Keep education worldwide, prioritize equal Thai/Vietnam onboarding then China subject to video provider availability, never claim Google Meet works in every market. Human versus authorized AI classes remain clearly identified. Transactional-only email, and only with provider/consent/identity gates. Independent EnglishLegalese Outreach owns ALL marketing and lead recruitment. Other Teacher Roger and TR apps stay read-only.

## Not completed / must not imply ready
- No real authenticated two-account pilot on HF60 or provider-linked session was performed; no real Google Calendar event cancellation, rescheduling or all-calendar free/busy.
- No billing, refund, approved notice policy or subscription change; no automatic email or marketing messages.
- No production Render rollout, live database migration, external availability claim or deployment SHA verification.
- No change to the approved public homepage/teacher photograph/brand/pricing. Code must pass full no-drift audit against production/main and authorizations before release.

## Mandatory release gates
1. On **exact HF60 HEAD** run both independent GitHub Release Gate jobs and full ~1,200-case desktop Chromium, tablet Chromium, tablet WebKit and mobile Chromium matrix; pass all mandatory tests (no skipped tests or muted failures).
2. Verify the approved visual, navigation and pricing assets retain same SHA relative to recorded HF53 main; audit cumulative existing HF54–HF59 changes, and prevent overriding concurrent PR work.
3. Review specific session lifecycle and email/PII changes; test real PostgreSQL schema, revocable sessions, role ownership, optimistic review races and no accidental double booking.
4. Verify provider credentials/calendar inventory and billing policy only with explicit separate approval. Test real calendar errors/rollback before allowing booking mutations. Do not use fake-provider green tests as real-world evidence.
5. Complete two-account teacher/student rehearsal, audio, correct Google Meet link and presentation privacy, real calendar check, consent and recovery plan.
6. Confirm owner-approved Render workspace and deployed SHA before merging/deploying; preserve previous source releases, recovery archives and known-good rollbacks.

## Continuation
Continue from `feature/hf60-mobile-class-lifecycle-20261113` **only if it remains the latest independently verified cumulative application source**. Govern with the latest independently verified completed Universal Builder, not the highest filename alone. Do not merge/deploy while CI or real-world gates fail. The next coherent build should prioritize actual provider-authorized calendar reconciliation, safe teacher/student class operations across programs, staff/owner dashboard performance, and real enrollment/consent workflows, without inventing provider readiness.
