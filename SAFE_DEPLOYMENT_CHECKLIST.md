# v1.54.0 Safe Deployment Checklist

Before public launch, verify this version preserves all persistent data and only updates code.

- [ ] `npm run check` passes.
- [ ] `npm run predeploy:check` passes.
- [ ] `npm run prod:readiness` reviewed.
- [ ] `npm run ops:verify` passes.
- [ ] No live secrets are inside the ZIP.
- [ ] PostgreSQL migrations are additive only and run in order.
- [ ] Production backups and at least one restore test are verified.
- [ ] Stripe Checkout and webhooks are tested before paid launch.
- [ ] OpenAI key is server-side only and SmartTeacher safety rules are verified.
- [ ] SMTP email, object storage, class-link workflow, legal/trust pages, and device QA are verified.
- [ ] Student work, calendars, payments, credits, reports, certificates, test scores, teacher notes, employer records, uploads, audit logs, and payouts remain preserved.

# v1.39.0 Safe Deployment Checklist

Before deployment, verify the v1.39 Seamless Learning Operations changes did not weaken production safety.

- [ ] `npm run check` passes.
- [ ] `npm run predeploy:check` passes.
- [ ] `npm run ops:verify` passes.
- [ ] `/health` returns v1.39.0.
- [ ] `/api/v139/seamless-learning-operations` returns `ok: true`.
- [ ] `/api/v138/ai-era-action-layer` still works.
- [ ] `/api/v137/guided-help-readiness` still works.
- [ ] `/api/v136/native-language-support` still works.
- [ ] `/api/v134/calendar/session.ics` still returns a text/calendar response.
- [ ] `/api/v132/chatgpt-only-smartteacher` still works.
- [ ] Homepage, navigation, student dashboard, teacher dashboard, employer dashboard, admin dashboard, SmartTeacher AI, Translation Bridge, calendar/classroom pages, uploads, reports, and certificates still load.
- [ ] Any-language help is labeled as learning support, not certified translation, court interpretation, legal advice, or final legal meaning.
- [ ] Teacher live cockpit tools support the teacher and do not replace teacher judgment.
- [ ] Employer reporting remains privacy-safe by default.
- [ ] No destructive migrations were added.
- [ ] No live secrets were added to the ZIP.
- [ ] Google Calendar/Meet remains optional, not a launch blocker.
- [ ] Manual/regional classroom links and ICS/manual reminders remain fallback paths.
- [ ] Existing user work, progress, reports, certificates, test scores, calendars, payment records, teacher notes, employer records, and payout records are preserved.

# v1.38.0 Safe Deployment Checklist

Before deployment, verify the v1.38 AI-Era Action Layer changes did not weaken production safety.

- [ ] `npm run check` passes.
- [ ] `npm run predeploy:check` passes.
- [ ] `npm run ops:verify` passes.
- [ ] `/health` returns v1.38.0.
- [ ] `/api/v138/ai-era-action-layer` returns `ok: true`.
- [ ] `/api/v137/guided-help-readiness` still works.
- [ ] `/api/v136/native-language-support` still works.
- [ ] `/api/v134/calendar/session.ics` still returns a text/calendar response.
- [ ] `/api/v132/chatgpt-only-smartteacher` still works.
- [ ] Homepage, navigation, student dashboard, teacher dashboard, employer dashboard, admin dashboard, SmartTeacher AI, Translation Bridge, calendar/classroom pages, uploads, reports, and certificates still load.
- [ ] No destructive migrations were added.
- [ ] No live secrets were added to the ZIP.
- [ ] Employer reporting remains privacy-safe by default.
- [ ] Native-language support is labeled as learning support, not certified translation.
- [ ] AI tools are labeled as practice/training, not legal advice.
- [ ] Google Calendar/Meet remains optional, not a launch blocker.
- [ ] Manual/regional classroom links and ICS/manual reminders remain fallback paths.

# v1.35.0 Safe Deployment Checklist

Before deployment, verify the v1.35 Global First-Class Success changes did not weaken production safety.

- [ ] `npm run check` passes.
- [ ] `npm run predeploy:check` passes.
- [ ] `npm run ops:verify` passes.
- [ ] `/health` returns v1.35.0.
- [ ] `/api/v135/global-first-class-success` returns `ok: true`.
- [ ] `/api/v134/calendar-interop` still works.
- [ ] `/api/v134/calendar/session.ics` still returns a text/calendar response.
- [ ] `/api/v132/chatgpt-only-smartteacher` still works.
- [ ] No destructive migrations were added.
- [ ] No live secrets were added to the ZIP.
- [ ] Google Calendar/Meet remains optional, not a launch blocker.
- [ ] Manual/regional classroom links and ICS/manual reminders remain required fallbacks.
- [ ] SmartTeacher AI remains ChatGPT/OpenAI-only.
- [ ] Teacher classroom tools remain teacher-controlled.
- [ ] Employer reporting remains privacy-safe by default.

# v1.30.0 Safe Deployment Addendum

Before deployment, confirm the v1.30 SmartTeacher AI flow is present, all older v126-v129 endpoints still respond, no live secrets are committed, and no destructive database commands were introduced. The SmartTeacher AI wording must remain practice/training only and must not be represented as legal advice, certified translation, court interpretation, or a replacement for teachers.

# Safe Deployment Checklist

Use this before any production update once real users exist.

## Before deploy

- [ ] Confirm this deploy changes code only, not persistent data.
- [ ] Confirm no script will run `drop`, `reset`, `truncate`, or destructive `seed` against production.
- [ ] Back up production PostgreSQL before risky migration.
- [ ] Test migration on staging copy.
- [ ] Confirm object storage bucket and file keys will not be replaced.
- [ ] Confirm Stripe, calendar, video, storage, and AI credentials are production-safe.
- [ ] Confirm rollback plan.

## After deploy

- [ ] `/health` returns current version.
- [ ] `/api/v118/persistence/health` returns PostgreSQL mode in production.
- [ ] Existing users still load.
- [ ] Existing class sessions still load.
- [ ] Saved homework/classwork still loads.
- [ ] Reports and certificates still load.
- [ ] Credit ledger and payout queues still load.
- [ ] Teacher marketing attribution still loads.
- [ ] Audit log is still writing entries.

## Absolute rule

Never fix production by wiping live records unless Roger explicitly authorizes a destructive action after a verified backup and written recovery plan.


## v1.19.0 Production backend foundation

This release adds real production-backend scaffolding for authentication/login, role permissions, PostgreSQL migration 002, Stripe Checkout and verified webhook routing, S3-compatible presigned uploads, SMTP email notification routing, Google Meet and Zoom class-session creation routes, server-generated PDF reports, and server-side SmartTeacher AI routing.

The platform remains data-preserving: deploys must update code only and must never reset live PostgreSQL tables or object storage. See `PRODUCTION_BACKEND.md` for the new backend architecture and required environment variables.


## v1.20.0 additional smoke tests

After deployment, test:

- `/api/v120/operating-spine/health`
- create/list booking request
- create/list homework assignment
- create class session, then close it out
- load class-session cockpit
- load staff command center
- load production gates

Do not mark the platform live if any persistence, closeout, credit, payout, or staff command function fails.

## v1.21.0 live activation safety

Before turning on live classroom users:

- [ ] Confirm `GET /api/v121/launch-readiness` has no required blockers.
- [ ] Run `npm run live:verify:strict` with production environment variables.
- [ ] Record a backup checkpoint through `/api/v121/backup-checkpoints`.
- [ ] Record a deployment record through `/api/v121/deployment-records`.
- [ ] Confirm local JSON fallback is not being used for real users.
- [ ] Confirm object storage, not deploy folders, stores uploads and reports.
- [ ] Confirm Stripe webhooks create durable payment/credit records.
- [ ] Confirm Google Meet or Zoom rooms attach to class-session records.
- [ ] Confirm teacher payout release is blocked until closeout and staff review.
- [ ] Confirm SmartTeacher AI route is server-side only.


## v1.22.0 release-specific checks

- Confirm migration 005 is additive-only.
- Confirm `role_journey_events`, `classroom_readiness_reviews`, `teacher_marketing_assets`, and `support_threads` exist in production after migration.
- Create a test classroom readiness review.
- Create a test teacher marketing asset.
- Create a test support thread.
- Confirm these records survive a redeploy.


## v1.23.0 deployment check

Before deployment, confirm the new v1.23 tables are additive only:

- action_center_items
- video_room_events
- ai_tutor_interactions
- marketing_lead_attribution

Do not reset local JSON or production PostgreSQL. Run migrations in order and smoke-test `/api/v123/operating-console` after deployment.


## v1.24.0 AI-era regression checks

Before deployment, verify that the AI-era strategy is visible in the homepage, dashboards, curriculum, SmartTeacher AI, teacher marketing toolkit, employer reports, trust/FAQ language, and certificates without removing existing platform functionality. Confirm that no new AI wording suggests legal advice, certified translation, court interpretation, or final legal meaning.


## v1.25.0 AI-Era Operating Flow Addition

This version adds additive, non-destructive records for AI-era pathway plans, teacher review handoffs, employer ROI snapshots, and confidentiality checks. These records reinforce that EnglishLegalese is Legal English training for the AI era: AI-supported practice plus human teacher review, employer-safe reporting, and confidentiality-aware workflows. Existing production data and routes must be preserved during deployment.

## v1.26.0 safe deployment checks

Before deploying v1.26.0, confirm:

- The deployment is code-only and does not include live database dumps or object-storage data.
- Existing migrations 001–008 remain intact and non-destructive.
- No production reset, seed, drop, truncate, or destructive migration command is used.
- No live credentials are committed or included in the ZIP.
- `/api/v126/integrated-product-flow` works after deployment.
- Homepage, dashboards, SmartTeacher AI, teacher marketing toolkit, employer reports, classroom/calendar/video references, uploads, reports/PDF, auth, payment, and production readiness routes still load.
- Employer reports remain privacy-safe by default.
- AI tools remain labeled as practice/training, not legal advice, certified translation, court interpretation, or final legal meaning.
- Mobile/tablet next actions remain readable and tappable.


## v1.27.0 deployment check

- [ ] `/health` reports v1.27.0.
- [ ] `/api/v127/simplicity-flow` returns ok.
- [ ] `/api/v126/integrated-product-flow` still returns ok.
- [ ] Student, teacher, employer, and owner/admin dashboards each show one clear next best action.
- [ ] Classroom/calendar/video readiness language is visible and does not imply custom WebRTC or recording without consent.
- [ ] Teacher marketing copy includes platform-controlled pricing, approved links, and no legal-advice or outcome claims.
- [ ] Employer reports remain privacy-safe by default.
- [ ] No migrations are destructive and no live secrets are committed.

## v1.28.0 Additional Check

- Confirm `/api/v128/benchmark-pricing` returns `ok: true`.
- Confirm public pricing language does not imply EnglishLegalese is a university, LL.M., law school, law firm, certified translation provider, or legal-advice service.
- Confirm all benchmark references are framed as market positioning, not false affiliation with Columbia, Harvard, NYU, Georgetown, or any other university.


## v1.29.0 deployment checks

Before deployment, confirm:

- `/api/v129/university-benchmark-integration` returns `ok: true`.
- The site does not claim EnglishLegalese is a university, law school, LL.M., certified translation service, court interpreter, legal service, or legal advice provider.
- Columbia is treated as an elite benchmark without quoting an unsupported standalone Legal English price.
- Pricing language remains lower than major university programs but still premium.
- Teacher marketing scripts do not include unsupported claims or off-platform payment instructions.
- No secrets were added.
- No destructive migrations were added.



## v1.31.0 Safe Deployment Checks

Before deploying v1.31.0, verify:

- `/api/v131/teacher-classroom-tools` returns `ok: true`.
- Teacher classroom tools are visible but do not create fake legal-service claims.
- SmartTeacher AI is still framed as practice and teacher assistance, not legal advice.
- Privacy visibility labels are preserved in copy and future data-model planning.
- Employer-safe reporting does not expose private drafts by default.
- Recording remains off unless all participants consent.
- Google Meet remains the default video classroom and Zoom remains an alternate.
- No live secrets are present in the ZIP.
- No destructive migrations are present.
- `npm run check` passes.


## v1.32.0 Safe Deployment Checks

Before deploying v1.32.0, verify:

- `/api/v132/chatgpt-only-smartteacher` returns `ok: true`.
- `OPENAI_API_KEY` is the only required AI-vendor API key.
- `SMARTTEACHER_MODEL` is optional and is only a model setting.
- No Gemini, Claude, Grok, Anthropic, xAI, Google AI, or other AI-vendor keys were added.
- SmartTeacher AI still displays Legal English training boundaries.
- Teacher classroom tools describe SmartTeacher AI as an assistant, not a replacement for live teachers.
- No live secrets are included in the ZIP.
- Existing migrations remain non-destructive.

## v1.33.0 Global Access / Google-optional classroom checklist

- EnglishLegalese internal calendar/class-session records remain the source of truth.
- Google-optional scheduling is required: Google Calendar and Google Meet are useful only where accessible and should not block users in China or other restricted-access regions.
- Manual/regional classroom links must remain supported for Zoom, Teams, Tencent/VooV, DingTalk, or another approved provider.
- Staff must verify provider accessibility, join URL, time zone, fallback instructions, and recording-consent status before class.
- SmartTeacher AI remains ChatGPT/OpenAI only and must not depend on Google AI/Gemini.
- No live provider secrets should be committed to the ZIP.



## v1.34.0 — Universal Calendar Interop + China-Aware Scheduling

- EnglishLegalese internal calendar/class-session records remain the required source of truth.
- Google Calendar is optional, not a dependency.
- Every class should support an ICS download/email attachment or add-to-calendar path so users can add the class to Outlook, Apple Calendar, Google Calendar where available, or other compatible calendars.
- Add Outlook/Microsoft 365/Exchange as an optional employer and China-relevant calendar path where the user or organization confirms access.
- Add Apple Calendar/iCloud as an optional user-side path for iPhone, iPad, and Mac users who can import or subscribe to calendar events.
- Add CalDAV-compatible calendar support as a future optional connector because it is an open calendar syncing standard.
- Add DingTalk, WeCom/Tencent, and manual local-time reminder instructions as China-aware options without making them required launch blockers.
- Preserve SmartTeacher AI as ChatGPT/OpenAI-only. Do not add Gemini/Google AI for calendar reasons.
- Calendar descriptions should not expose private student drafts, sensitive uploads, teacher-private notes, or legal/business confidential content.
- New endpoint: `/api/v134/calendar-interop`.
- New ICS endpoint: `/api/v134/calendar/session.ics`.
- New verification script: `scripts/verify-v134-calendar-interop.js`.


## v1.36.0 Native-Language Learning Support

EnglishLegalese now includes a native-language learning support layer so global learners do not get stuck when classwork, homework, teacher feedback, SmartTeacher AI practice, scheduling, calendar reminders, payment status, certificates, or platform instructions are unclear.

This is a learning bridge, not a replacement for Legal English training. The preferred UX is:

1. Explain the issue in simple English when appropriate.
2. Offer “Explain in my language” when the learner needs it.
3. Show side-by-side Legal English, plain-English meaning, and native-language explanation.
4. Save important items to the lesson folder or teacher-review queue.
5. Bring the learner back to Legal English speaking, writing, vocabulary, or roleplay practice.

The feature should support students, live teachers, SmartTeacher AI, staff/admin, and employer-safe reporting while preserving privacy boundaries.

SmartTeacher AI remains ChatGPT/OpenAI-only. Native-language explanations should use the same server-side SmartTeacher AI layer and should not require a separate translation vendor unless later approved for a specific business reason.

Boundaries remain visible: EnglishLegalese is education and language training only. Native-language support is not legal advice, certified translation, court interpretation, final legal meaning, or a substitute for qualified professional review.


## v1.37.0 — Guided Help + Readiness Navigator

This pass adds a simple support layer across the product so every user knows the next action and every confused user has a safe path to get unstuck.

Core rule: every major student, teacher, employer, and owner/staff screen should answer two questions:

1. What is my next best action?
2. What do I do if I am confused?

The guided-help actions are:

- Simple English.
- Explain in my language.
- Show side-by-side Legal English, plain-English meaning, and native-language explanation.
- Ask my teacher.
- Contact support.
- Back to Legal English.

This builds on the v1.36 Translation Bridge but broadens it into a Help Navigator. Learning confusion routes to SmartTeacher AI, native-language explanation, lesson folders, and teacher review. Platform/admin confusion routes to staff support for billing, scheduling, class links, calendar/reminders, certificates, payment status, and account access.

SmartTeacher AI remains ChatGPT/OpenAI-only. Native-language help remains a learning bridge, not certified translation, court interpretation, legal advice, legal services, or final legal meaning.

The role action rails should stay simple:

- Student: Next class, Join, Practice, Homework, Explain, Ask teacher, Support.
- Teacher: Prep, Teach, Review AI practice, Translation Bridge, Homework, Closeout, Report note, Payout status.
- Employer: Team schedule, progress, AI translator safety, certificates, privacy-safe summary, ROI, add learners/buy credits.
- Owner/staff: paid unscheduled classes, teacher match blockers, region/provider access issues, language-help flags, teacher review handoffs, reports/certificates due, payout holds, renewals/top-ups.

New endpoint:

- `/api/v137/guided-help-readiness`

New verification script:

- `scripts/verify-v137-guided-help.js`


## v1.40.0 Workflow Proof Layer deployment checks

Before deploying v1.40.0, confirm the update is code-only and does not wipe or overwrite students, teachers, employers, class sessions, calendars, video links, payments, credits, reports, certificates, test scores, saved SmartTeacher practice, Translation Bridge records, teacher-review handoffs, homework, uploads, support threads, audit logs, or payout records.

Confirm the new workflow-proof routes are additive and use existing persistence scaffolding. Do not add live credentials to the ZIP. Do not add destructive migrations. Do not make Google Calendar/Meet a hard dependency. Do not expose employer reports to private drafts, raw AI practice, raw native-language explanations, sensitive uploads, or teacher-private notes unless the permission model clearly allows it.


## v1.41.0 — Major-Language Bridge + Classroom Command

- Added a major-language Translation Bridge layer for roughly the top 100+ widely used world languages, with honest staff/teacher routing for rare, low-confidence, sensitive, or high-stakes language requests.
- Strengthened the product flow so language help does not become generic translation: Simple English first, explain in the learner's selected language only enough to get unstuck, show side-by-side Legal English/plain meaning/native-language explanation, save to lesson folder, ask teacher when needed, and return to Legal English performance.
- Added language-aware student, teacher, employer, and owner/staff dashboard panels.
- Added teacher classroom command tools for learner language cards, side-by-side correction pads, AI translation-risk lens, roleplay launcher, homework handoff, closeout proof, and employer-safe summary drafting.
- Added privacy-safe employer language summaries that exclude raw native-language explanations, private drafts, raw SmartTeacher AI text, sensitive uploads, and teacher-private notes by default.
- Added `/api/v141/major-language-bridge`, `/api/v141/language-options`, `/api/v141/language-support-requests`, and `/api/v141/employer-language-summaries`.
- Preserved all v1.40.0 Workflow Proof Layer functionality, SmartTeacher AI ChatGPT/OpenAI-only policy, global calendar/classroom fallbacks, platform-controlled pricing, no-live-secrets rule, and additive/no-data-loss deployment rules.

## v1.42.0 Continuity Command Center deployment guardrails

Before deploying v1.42.0, confirm again that the deploy is code-only unless a reviewed additive migration is intentionally required. Do not reset, reseed, drop, wipe, or overwrite production data.

Protect all student, teacher, employer, class-session, calendar/video, payment, credit, homework, saved-work, AI-practice, Translation Bridge, major-language support, teacher-review, report, certificate, test-score, teacher-note, payout, upload, support-thread, and audit-log records.

Run:

- `npm run check`
- `npm run predeploy:check`
- `npm run prod:readiness`
- `npm run ops:verify`
- smoke checks for `/health`, `/api/v142/continuity-command-center`, `/api/v142/continuity-records`, `/api/v142/classroom-command-actions`, `/api/v142/teacher-marketing-approval`, `/api/v142/employer-safe-continuity-report`, and `/api/v142/deployment-preservation-check`.


## v1.43.0 Course Placement deployment guardrails

Before deploying v1.43.0, confirm that course placement records, diagnostic scores, course paths, lesson-plan handoffs, homework, saved SmartTeacher practice, Translation Bridge records, calendars, payment/credit data, reports, certificates, test scores, teacher notes, employer records, uploads, support history, and audit logs are not stored only in the deploy folder and will not be wiped by the update.

Confirm that the new course catalog remains education/language training only and does not create legal advice, certified translation, court interpretation, filing help, or final legal meaning.

## v1.44 four-skills preservation checklist

- Confirm speaking/listening/reading/writing practice records are not stored only in deploy folders.
- Confirm voice practice does not imply recording is on by default.
- Confirm native-language spoken support is labeled as learning support, not certified interpretation.
- Confirm teacher-review handoffs, lesson folders, homework, employer-safe reports, placement scores, calendars, payments, reports, certificates, and test scores survive deploys.
- Confirm employer reports do not expose raw recordings, transcripts, private drafts, raw SmartTeacher text, raw native-language explanations, or teacher-private notes by default.

## v1.45 integrated skills preservation checklist

Before deploying v1.45 or any later build, confirm that code changes do not wipe, reset, overwrite, or orphan student work, speaking/listening practice, reading scores, writing drafts, SmartTeacher AI practice, Translation Bridge records, native-language support records, lesson-folder items, teacher-review handoffs, homework, course placement records, class sessions, calendars, video links, payments, credits, employer reports, certificates, test scores, teacher notes, uploads, support history, audit logs, or payout records. Migrations must be additive only. Do not add live secrets to the ZIP. Do not pretend native-language speech help is certified interpretation or translation. Do not expose raw transcripts, recordings, private drafts, native-language explanations, sensitive uploads, test answers, or teacher-private notes in employer reports by default.

## v1.46.0 safe deployment checklist additions

- Confirm `/api/v146/live-skills-feedback-loop` loads.
- Confirm `/api/v146/workshop-series` loads.
- Confirm `POST /api/v146/practice-packet` saves a lesson-folder practice packet and teacher-review handoff.
- Confirm `POST /api/v146/teacher-feedback-loop` creates teacher feedback and homework without deleting existing records.
- Confirm `POST /api/v146/employer-skills-progress-brief` excludes private learner content by default.
- Confirm `POST /api/v146/skill-data-preservation-review` returns the no-data-loss rule.
- Confirm no destructive migrations, hard-coded live secrets, or production reset logic were added.


## v1.47.0 Simplicity + Continuity Gate

Before deploying v1.47.0, confirm this remains a code-only update unless a reviewed additive migration is intentionally added. Do not drop, reset, truncate, or wipe production data. Preserve student work, lesson folders, homework, voice/spoken tasks, listening notes, reading scores, writing drafts, SmartTeacher AI practice, Translation Bridge records, calendars, class links, payments, credits, reports, certificates, test scores, teacher notes, employer records, uploads, support history, audit logs, and payouts. Google Calendar/Meet remain optional; the EnglishLegalese internal calendar/class-session record remains the source of truth. No live secrets belong in the ZIP.

## v1.48.0 — Usability Continuity Pass

- Adds a restrained usability pass focused on plain-language role paths for students, teachers, employers, and owner/staff users.
- Adds the `/api/v148/usability-continuity-pass`, `/api/v148/plain-language-user-path`, `/api/v148/continuity-preservation-audit`, and `/api/v148/employer-safe-progress-card` routes.
- Keeps EnglishLegalese positioned as Legal English training for the AI era, not generic English or simple translation.
- Strengthens the product-level promise that code deploys preserve user work, calendars, payments, credits, reports, certificates, test scores, teacher notes, employer records, uploads, audit history, and payouts.
- Keeps SmartTeacher AI ChatGPT/OpenAI-only, Google optional, employer reporting privacy-safe by default, and Translation Bridge/native-language support framed as learning support rather than certified translation, interpretation, legal advice, or final legal meaning.

## v1.49.0 Intuitive UX Continuity checklist

- Confirm student work, lesson folders, homework, voice/spoken practice, listening notes, reading scores, writing drafts, SmartTeacher AI practice, Translation Bridge records, calendars, class links, payments, credits, reports, certificates, test scores, teacher notes, employer records, uploads, support history, audit logs, and payouts are outside any code folder that can be overwritten.
- Confirm no destructive migrations were added.
- Confirm no live secrets were added to the ZIP.
- Confirm employer summaries remain privacy-safe by default.
- Confirm every dashboard starts with one next best action for the user role.
- Confirm SmartTeacher AI still answers the AI-translator objection: AI can translate words, but professionals still need judgment, context, confidentiality awareness, professional tone, reading, writing, speaking, listening, and safe AI-output review.

## v1.50.0 Language Learning Bridge checklist

Before deploying v1.50.0, confirm that the 100+ Language Learning Bridge is a code/UI/API improvement only and does not wipe or orphan production data.

Required checks:

- The 100+ major-language promise is presented as learning support, not certified translation, court interpretation, legal advice, or final legal meaning.
- Rare, low-confidence, sensitive, or high-stakes language requests route to teacher/staff/professional review.
- Employer language summaries exclude private learner drafts, raw native-language explanations, raw SmartTeacher AI content, recordings/transcripts, sensitive uploads, test answers, and teacher-private notes by default.
- Student work, lesson folders, homework, voice/spoken practice, listening notes, reading scores, writing drafts, SmartTeacher AI practice, Translation Bridge records, calendars, class links, payments, credits, reports, certificates, test scores, teacher notes, employer records, uploads, support history, audit logs, and payouts remain preserved.
- No destructive migrations, drop/reset/truncate commands, hard-coded live secrets, or Google hard dependencies are introduced.


## v1.51.0 Preferred-language page selector preservation checks

- Confirm preferred-language page selector changes are additive.
- Confirm page explanations do not publish private learner content to employers by default.
- Confirm raw native-language explanations, private drafts, SmartTeacher AI text, recordings/transcripts, sensitive uploads, test answers, and teacher-private notes remain excluded from employer reports by default.
- Confirm all student work, calendars, payment/credit data, progress reports, certificates, test scores, teacher notes, employer records, uploads, support history, audit logs, and payouts are preserved.
- Confirm no destructive migration, reset, truncate, or hard-coded live secret was introduced.

## v1.52.0 safe deployment checklist — Three-layer language access

- [ ] Confirm v1.52.0 is deployed as an additive code update, not a clean data reset.
- [ ] Confirm preferred-language settings remain intact.
- [ ] Confirm page explanations and side-by-side learning records remain intact.
- [ ] Confirm human-reviewed marketing page plan records remain intact.
- [ ] Confirm student work, lesson folders, homework, voice/spoken practice, listening notes, reading scores, writing drafts, SmartTeacher AI practice, Translation Bridge records, calendars, class links, payments, credits, reports, certificates, test scores, teacher notes, employer records, uploads, support history, audit logs, and payouts remain preserved.
- [ ] Confirm employer-safe summaries exclude raw native-language explanations, private drafts, raw SmartTeacher AI text, recordings/transcripts, sensitive uploads, test answers, and teacher-private notes by default.
- [ ] Confirm user-facing copy says language support is a learning bridge and does not promise perfect full-site translation in 100+ languages.
- [ ] Confirm “not legal advice / not certified translation / not court interpretation / not final legal meaning” warnings remain visible near language features.
- [ ] Confirm the v1.52 verification script passes.

## v1.53.0 safe deployment checklist — Role clarity + data continuity

- [ ] Confirm v1.53.0 is deployed as an additive code update, not a clean data reset.
- [ ] Confirm no destructive migration, drop, reset, wipe, or reseed command is introduced.
- [ ] Confirm persistent PostgreSQL and object storage records are not overwritten by deploy files.
- [ ] Confirm student work, homework, lesson folders, calendars, payments, reports, certificates, test scores, teacher notes, employer records, uploads, audit logs, and payouts remain preserved.
- [ ] Confirm employer summaries remain privacy-safe and exclude private learner content by default.
- [ ] Confirm the current EnglishLegalese logo and brand assets remain preserved.
- [ ] Confirm SmartTeacher AI remains ChatGPT/OpenAI-only.
- [ ] Confirm `npm run check`, `npm run predeploy:check`, and `npm run ops:verify` pass.

