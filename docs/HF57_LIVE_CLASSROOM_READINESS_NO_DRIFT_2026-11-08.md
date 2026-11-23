# EnglishLegalese HF57 — Live-class rehearsal, access-readiness, and pilot safety

**Date:** November 8, 2026. **Project:** EnglishLegalese (adult professionals), not TR-Online, TR-Classroom, TR-Clone, or TR-ControlCenter.
**Selected coordinated builder:** **V1.6 audited PDF** (61 pages, supplied again in the conversation, full original V1.5, embedded immutable V1.4 and nested native V21 archives retained).
**Native builder:** V21 preserved within V1.6's historical archive; not promoted to a new version without explicit source reconciliation.
**Code base:** 2026-11-08 verified production EnglishLegalese HF53 main `05da0352355dbc3fd6eb8b472c49289d594a8e6e` → cumulative development HF54–HF56 in draft PR #100, head `946680a156d19f8e94dfd75a317e99b628ff0091` → **isolated HF57 candidate**. PR #100 was never merged or deployed; it remains the exact predecessor of HF57.

## Mission unchanged
Worldwide Legal English + Business English education for adult professionals, law firms, employers, legal departments and business learners. Human-taught classes are explicitly human-taught; AI materials must be disclosed and may not falsely claim live TR-Clone integration. Preserve all previous lessons, free tools, topic lists, memberships, course prices, teacher/employer/student/admin experiences, and truthful certification activation labels. Thailand and Vietnam are equal first-priority student onboarding markets; China is the third readiness pilot, but the rest of the world can still enroll.

## Actual HF57 feature work
**A. Private teacher-led 60-minute lesson conductor:**
- New additive browser module `product-v2180-energy-live-conductor.js`, included only in the signed-in `/learn/private-energy-contracts/` page and mounted from the already authorized lesson render path in `product-v2170-energy-classroom.js`.
- All **12 existing energy-contract lesson plans** gain six user-operated speaking stages aligned with their original 0–60-minute agenda: recall, vocabulary and pronunciation, qualified clause explanation, two-way negotiation, corrected second attempt, and accurate recap.
- The speaker works from fictional contract scenarios and authored sample sentences. Teacher-only buyer/counsel directions and pronunciation coaching are not presented in the student-only view.
- Before-class accessibility/privacy checklist: local devices tested in Google Meet preview, no client document sharing, private study space and connection fallback.
- An optional 60-minute timer runs only within the browser tab; it is not a meeting, attendance, assessment, payment, or recorded class. Manual stage navigation, pausing/reset and responsive accessible native controls. A paused or discarded timer cannot trigger a class completion.

**B. Authenticated class-readiness checks:**
- Server `src/v2150-private-energy-classroom.js` exposes `GET /api/v2150/private-energy/sessions/:id/readiness`, using the existing revocable Bearer login, verified-student account gate, production PostgreSQL gate, and exact teacher/student class ownership lookup. Unassigned accounts receive 404, unsigned accounts 401.
- Returns only limited facts: booked time present, scheduled status, recognized Google Meet provider readiness, human teacher, duration=60, no recording and the next action. Does **NOT** return the Meet URL, student name, client matter metadata, or private pronunciation observation.
- Existing `product-v2170-energy-classroom.js` shows a **Check class readiness** button on each authenticated class card; it never auto-generates a meeting, sends notifications, or writes to databases from this GET.
- Inherited HF56 private meeting URL remains available only to the assigned account through the separate authenticated `/sessions` listing, while older unauthenticated inspection endpoints are restricted from exposing HF56/HF57 course sessions.

**C. Tests and code traceability:**
- `scripts/verify-hf57-class-readiness.js` runs a local in-process **real Express API test with a fake read-only PostgreSQL service**, verifying 401 unauthenticated, 404 unassigned student, valid assigned student/teacher read, pending/completed class behavior, no URL/client-name/metadata leakage and no mutating query. No real credentials or production data.
- `scripts/verify-hf57-live-conductor.js` verifies all inherited lessons and agendas, strict no-storage/no-audio/no-network browser code, script load order, private-only module, role-specific content and inherited homepage protection.
- `tests/hf57-private-live-conductor.spec.js` adds browser tests with mocked student/teacher role responses for each component, privacy checklist, six stages, local timer, readiness action, responsive layout and absent guest/student-specific teacher prompts.
- All new checks append to inherited `npm run check`. All existing Playwright tests and protected source remain; no scripts removed or renamed.

## Privacy / consent and production gates
No real client contracts, negotiation positions, redacted uploads, student identity, voice data or personal attendance data are committed. Do not create a new student account or calendar event on assumptions. The 2026-11-01 previously taught Vietnam private class is historic context, not a new authorized booking. Creating or attaching a class meeting requires a **real student account, verified assignment, teacher confirmation and supported video provider**; no unsolicited invitations. Google Meet is an external provider, not an embedded EnglishLegalese teleconference system. Mainland China Google Meet access must be checked before promises; no circumvention workflow has been approved.

**Production status:** HF57 is a draft build until both independent exact-head GitHub release gate runs, responsive desktop/tablet/mobile Chromium + WebKit browser checks, static/privacy checks, manual screenshots, Render workspace review and live source SHA confirmation pass. The main website is on HF53 unless new evidence shows otherwise. No production deployment, purchase, certification issuance, billing or student outreach from this work.

## Fresh official research disposition (accessed 2026-11-08)
- **ADOPT** Google Meet Help — *Connect your video & audio*: https://support.google.com/meet/answer/10409699 . Google recommends testing microphone, speakers and camera in the Meet preview before joining. Implemented as an **optional checklist**, not unauthorized audio capture. Tests verify no getUserMedia/recording.
- **ADAPT** W3C WCAG 2.2 — https://www.w3.org/TR/WCAG22/ . Native details/summary, buttons, fieldset/legend, visible focus inherited from scoped page, status messages, role-aware content. Browser checks are required, not presumed.
- **DEFER** Google Calendar conference creation changes — https://developers.google.com/workspace/calendar/api/v3/reference/events : conferenceData creation can be asynchronous. Existing optional provider creation requires independent provider response and URL verification, and may need additional polling or idempotency before any production scheduling. No live event created.
- **DEFER** China video vendor substitution: requires privacy terms, availability and legal review. No unsupported Meet-access claim.
- **Economics:** only static code and read-only readiness requests; no new paid AI or video service contracted. A live 60-minute human-taught lesson still uses teacher time and hosting already in service; no invented per-learner revenue or AI cost savings.

## Rollback, acceptance and transition
The complete predecessor is the exact HF56 head SHA and main HF53 SHA above. Reject/unmerge the HF57 draft to rollback. Production source and user data have not been touched. Reconcile CI failures against the exact HF57 head; never claim a successful release from a dated older CI run. Maintain full V1.6 original PDF with embedded immutable native builder, all original owner rules and nested source archives. Do not promote a new coordinated Universal Builder until exact production/acceptance status is honestly documented. A separate portable HF57 candidate receipt can attach the full V1.6 as a recovery reference.

## Long-term next work after passing
- Two-device end-to-end live pilot with consent, video and audio preflight, no meeting-link leakage and link closeout.
- Accessibility review of real translated enrollment language in Thai, Vietnamese and Simplified Chinese; global course enrollment remains available.
- Verify protected email and employer training workflows without unsolicited marketing.
- Follow up on safe supervised certification only with qualified teacher assessment, separate legal/business tracks and owner approval.
