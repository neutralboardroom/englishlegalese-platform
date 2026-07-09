# v1.54.0 Production Backend Note

v1.54 adds launch-readiness endpoints for controlled public beta and production activation planning. It does not add live credentials and does not require destructive migrations.

New endpoints: `/api/v154/public-launch-readiness`, `/api/v154/first-course-content`, `/api/v154/launch-gate-check`, `/api/v154/first-course-lesson-template`, `/api/v154/teacher-onboarding-plan`, `/api/v154/diagnostic-to-course-plan`, `/api/v154/public-beta-readiness`, and `/api/v154/end-to-end-launch-test-plan`.

The backend remains environment-variable driven. PostgreSQL is required for real users; local JSON fallback is development-only. Stripe, OpenAI, SMTP, object storage, and video/calendar vendor credentials must be added only in the hosting environment.

# v1.35.0 Production Backend Note

v1.35.0 adds a strategy/data endpoint at `/api/v135/global-first-class-success`. It does not require a new live provider to launch. The backend principle remains:

- EnglishLegalese owns the official class-session record.
- Calendar/video providers are adapters.
- SmartTeacher AI is ChatGPT/OpenAI-only through a server-side `OPENAI_API_KEY`.
- Google Calendar/Meet, Zoom, Teams, Tencent/VooV, DingTalk, Outlook/Microsoft 365, Apple Calendar, CalDAV, ICS, and manual links/reminders are provider paths, not replacements for the EnglishLegalese record.

# v1.30.0 Production Backend Note

v1.30.0 adds `/api/v130/smartteacher-flow`, a production-safe strategy endpoint for SmartTeacher AI brand positioning, role next actions, unified workflow, pricing guardrails, and trust boundaries. It does not require new secrets and does not add destructive migrations.

# EnglishLegalese v1.19.0 Production Backend Foundation

This version begins the real production backend. It preserves the existing front-end marketplace/classroom experience while adding production-shaped backend routes for authentication, role permissions, PostgreSQL persistence, payments, webhooks, uploads, calendar/video classrooms, email notifications, PDF reports, and server-side SmartTeacher AI.

## Core rule

Deployments update code only. Live production data must remain in PostgreSQL and object storage and must never be reset, reseeded, overwritten, or deleted by a ZIP deployment.

## Added production systems

### Authentication and permissions

- `POST /api/v119/auth/register`
- `POST /api/v119/auth/login`
- `GET /api/v119/auth/me`
- `GET /api/v119/security/roles`

Passwords are hashed with Node `crypto.pbkdf2Sync`. Sessions use HMAC-signed bearer tokens. Production must set `SESSION_SECRET`.

### PostgreSQL schema

Run:

```bash
npm run migrate
```

Migrations are additive and sorted:

- `001_initial_persistent_schema.sql`
- `002_auth_payments_integrations.sql`

### Stripe payments and webhooks

- `POST /api/v119/payments/create-checkout`
- `POST /api/v119/stripe/webhook`

The webhook route is intentionally mounted before JSON body parsing so Stripe signature verification receives the raw request body.

### Secure uploads and report files

- `POST /api/v119/uploads/presign`

Production uses S3-compatible presigned uploads when the S3 environment variables and AWS SDK packages are installed. Local development returns a metadata-only placeholder.

### Calendar and video classrooms

- `POST /api/v119/calendar-video/create-session`

Provider behavior:

- Google Meet: default when Google Calendar token is configured.
- Zoom: approved alternate using Zoom Server-to-Server OAuth.
- Teams: still reserved for later employer/corporate integration.

### Email notifications

- `POST /api/v119/notifications/email`

Production uses SMTP/nodemailer when configured. Development records the message request without sending.

### PDF progress reports

- `POST /api/v119/reports/pdf`

This version includes a simple server-side PDF generator so report files can exist before a full PDF template engine is added.

### Server-side SmartTeacher AI

- `POST /api/v119/smartteacher`

If `OPENAI_API_KEY` is configured, the route calls the OpenAI Responses API. If not, it returns a safe local Legal-English-only fallback response.

## Production readiness endpoint

- `GET /api/v119/production-readiness`

This reports which integrations are configured and what is still missing before live launch.

## Not yet complete

This version adds the production foundation, but before real users you still need to configure real credentials, run migrations against a managed PostgreSQL database, connect production object storage, set Stripe webhook endpoints, complete OAuth/token handling for Google, and choose final hosting/runtime settings.


## v1.20.0 Operational additions

Version 1.20.0 adds production-safe operational scaffolding for the workflows that will become active once real users are onboarded.

New data concepts:

- `booking_requests`: lead/package/schedule requests before a class session is confirmed.
- `teacher_availability_blocks`: teacher scheduling availability and video provider preferences.
- `class_session_closeouts`: attendance, notes, homework status, AI practice, report refresh, credit deduction, payout review.
- `staff_tasks`: owner/staff queue for revenue, scheduling, reports, payouts, trust, and AI boundary review.
- `notification_preferences`: per-user communication settings.

New operating rule:

> A class is not complete until attendance, notes, homework/AI practice, report status, credit deduction, and payout review are recorded.

## v1.21.0 Production Activation Layer

v1.21.0 adds the layer that lets the owner/staff verify production infrastructure before real classroom users start using the platform.

### Activation APIs

- `GET /api/v121/infrastructure-plan` explains what needs to be configured and what cannot be activated without owner credentials.
- `GET /api/v121/launch-readiness` checks whether required production gates are configured.
- `GET/POST /api/v121/integration-checks` records integration test results.
- `GET/POST /api/v121/deployment-records` records safe deploy events.
- `GET/POST /api/v121/backup-checkpoints` records backup verification.
- `GET/POST /api/v121/launch-events` records owner/staff launch gates or exceptions.

### Activation scripts

- `npm run live:verify` checks environment variables and optional external API connectivity.
- `npm run live:verify:strict` exits nonzero when required gates are missing.
- `npm run owner:create` creates the first owner account using `OWNER_EMAIL`, `OWNER_PASSWORD`, and `OWNER_NAME`.

### Secrets rule

Live secrets must be stored in the hosting provider environment settings, not in app code, static files, ZIP files, Git commits, or frontend JavaScript.


## v1.22.0 seamless operations APIs

v1.22.0 adds lightweight production records for role journeys, class readiness, teacher marketing assets, and support threads. These records should be treated as operational metadata that helps staff launch and operate the platform without losing trust or creating hidden blockers.

The records are persistent through the same PostgreSQL/local-development fallback layer used by the earlier production foundation.


## v1.23.0 integrated operating records

v1.23.0 adds four production-safe record types:

- `action_center_items` — unified next actions for staff, students, teachers, and employers.
- `video_room_events` — status history for Google Meet/Zoom room creation, joining, consent, and calendar linkage.
- `ai_tutor_interactions` — saved SmartTeacher AI continuity records tied to a role and optional class session.
- `marketing_lead_attribution` — teacher-sourced lead tracking, conversion status, and bonus-review status.

These records are additive and should be migrated without dropping or reseeding production data.


## v1.24.0 AI-era production routes

The v1.24.0 routes support persistent AI-era Legal English strategy records:

- `/api/v124/ai-era-strategy`
- `/api/v124/curriculum-modules`
- `/api/v124/ai-translator-safety-exercises`
- `/api/v124/dashboard-signals`
- `/api/v124/ai-era-marketing-assets`

These routes should remain language-training and professional-communication tools only. They must not become legal advice, certified translation, court interpretation, legal filing, or contract-review-for-legal-accuracy workflows.


## v1.25.0 AI-Era Operating Flow Addition

This version adds additive, non-destructive records for AI-era pathway plans, teacher review handoffs, employer ROI snapshots, and confidentiality checks. These records reinforce that EnglishLegalese is Legal English training for the AI era: AI-supported practice plus human teacher review, employer-safe reporting, and confidentiality-aware workflows. Existing production data and routes must be preserved during deployment.

## v1.26.0 AI-Era Integrated Product Flow Addition

v1.26.0 adds a production-safe integrated product-flow endpoint:

- `GET /api/v126/integrated-product-flow`

The endpoint aggregates the existing v1.25 AI-era operating records and returns:

- student/teacher/employer/staff next actions;
- AI translator safety boundaries;
- confidentiality and upload warnings;
- employer-safe reporting rules;
- production guardrails for code-only deploys, environment-variable secrets, additive migrations, and smoke testing.

No live credentials are required for this endpoint. It should continue returning placeholder/blocker-aware information until external services are configured and verified.


## v1.27.0 simplicity-flow endpoint

`GET /api/v127/simplicity-flow` is a production-safe brief endpoint for the new simplicity/conversion layer. It does not require destructive schema changes. It summarizes the four-role start, AI-translator objection answer, dashboard next-action rules, classroom/video rules, employer-safe reporting boundaries, and production guardrails while aggregating existing v1.25/v1.26 pathway, teacher-review, employer ROI, and confidentiality records.

This endpoint is additive and must not replace existing v1.24, v1.25, or v1.26 routes.

## v1.28.0 Endpoint

`GET /api/v128/benchmark-pricing`

Returns the university-benchmark pricing strategy, recommended price bands, curriculum module ideas, and differentiation language for EnglishLegalese as affordable premium Legal English performance training for the AI era.

No new secrets are required. No new database migration is required for v1.28.0.


## v1.29.0 API addition

Added `/api/v129/university-benchmark-integration`. It returns the benchmark positioning, recommended offer ladder, course catalog, guardrails, and staff next action for using university research in pricing, curriculum, employer proposals, teacher marketing, and SmartTeacher AI answers.

This endpoint is informational and production-safe. It does not require live secrets, does not mutate records, and does not alter migrations.



## v1.31.0 Backend Notes — Teacher Classroom Tools

New production-safe endpoint:

- `GET /api/v131/teacher-classroom-tools`

The endpoint returns the v1.31.0 seed object for built-in teacher classroom tools, including agenda builder, live correction pad, roleplay launcher, AI translation risk lens, vocabulary/clauses, homework generator, closeout checklist, privacy labels, role integration, and trust guardrails.

Future backend implementation should be additive and should connect these tools to the existing class-session, saved-work, homework, report, credit, payout, employer-reporting, and audit-log architecture. Do not store production classwork inside deploy folders. Use PostgreSQL and secure object storage where appropriate.

No live credentials are included. No destructive migrations were added.


## v1.32.0 Backend Notes — ChatGPT-Only SmartTeacher AI

New endpoint:

- `GET /api/v132/chatgpt-only-smartteacher`

This endpoint returns the v1.32.0 seed object for ChatGPT/OpenAI-only SmartTeacher AI governance, including one AI vendor, one `OPENAI_API_KEY`, optional `SMARTTEACHER_MODEL`, role-specific copy, trust language, operations checklist, and preserved earlier endpoints.

The production SmartTeacher route continues to use the OpenAI Responses API when `OPENAI_API_KEY` is configured and a safe local fallback when the key is missing. Do not add multi-vendor AI routing for this build.

## v1.33.0 Global access classroom backend rule

Production should create and maintain every class in the EnglishLegalese database first. External calendar/video providers are attached to the class session as provider metadata and join links.

Required concept fields include: `provider_name`, `join_url`, `region_access_note`, `fallback_join_instructions`, `tested_from_region`, and `recording_consent_status`.

Google Calendar/Meet and Zoom credentials are optional provider integrations. Manual/regional provider links must remain available so classes can run for students in mainland China or any region where Google is unavailable.



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

## v1.45 backend additions

v1.45 adds production-safe prototype routes for integrated skills workflows: `/api/v145/integrated-skills-studio`, `/api/v145/skills-course-sequence`, `/api/v145/placement-skill-routing`, `/api/v145/speaking-listening-session`, `/api/v145/reading-writing-session`, `/api/v145/teacher-classroom-tool-action`, `/api/v145/employer-integrated-skills-report`, and `/api/v145/no-data-loss-skill-check`. These routes should preserve privacy boundaries, avoid raw audio storage by default, and connect to existing saved-work, teacher-review, homework, and employer-safe report records.

## v1.46.0 backend activation notes

The v1.46 Live Skills Practice + Feedback Loop is intentionally implemented on top of existing saved-work, teacher-review, homework, and employer-safe report scaffolding. Production activation should connect practice packets to authenticated users, class sessions, persistent lesson folders, teacher dashboards, and employer permissions.

Voice/spoken practice must keep recording off by default. Raw audio should not be stored unless a future explicit consent and storage workflow is implemented. Employer reporting must remain summary-level by default.


## v1.47.0 Backend Additions

The Simplicity Command Pass adds lightweight API routes that use existing persistent structures instead of creating a separate system: role next-action plans use staff tasks, employer privacy snapshots use employer ROI snapshots, and the data-continuity gate returns static deployment-safety policy for predeploy/operator checks. This keeps the platform simpler while preserving all existing saved work, teacher review, homework, reports, calendar, payment, upload, and audit records.

## v1.48.0 — Usability Continuity Pass

- Adds a restrained usability pass focused on plain-language role paths for students, teachers, employers, and owner/staff users.
- Adds the `/api/v148/usability-continuity-pass`, `/api/v148/plain-language-user-path`, `/api/v148/continuity-preservation-audit`, and `/api/v148/employer-safe-progress-card` routes.
- Keeps EnglishLegalese positioned as Legal English training for the AI era, not generic English or simple translation.
- Strengthens the product-level promise that code deploys preserve user work, calendars, payments, credits, reports, certificates, test scores, teacher notes, employer records, uploads, audit history, and payouts.
- Keeps SmartTeacher AI ChatGPT/OpenAI-only, Google optional, employer reporting privacy-safe by default, and Translation Bridge/native-language support framed as learning support rather than certified translation, interpretation, legal advice, or final legal meaning.

## v1.49.0 backend additions

The v1.49.0 backend adds production-safe routes for UX simplification and continuity review:

- `GET /api/v149/intuitive-ux-continuity-pass`
- `POST /api/v149/user-flow-simplifier`
- `POST /api/v149/continuity-risk-check`
- `POST /api/v149/staff-ux-blocker-queue`
- `POST /api/v149/employer-safe-summary`

These routes are additive. They do not replace existing v1.48 and earlier routes, do not require destructive migrations, and do not weaken production data preservation rules.

## v1.50.0 backend additions

v1.50.0 adds these production-safe routes:

- `GET /api/v150/language-learning-bridge`
- `GET /api/v150/language-marketing-summary`
- `POST /api/v150/language-onboarding-plan`
- `POST /api/v150/employer-language-readiness-card`
- `POST /api/v150/language-continuity-preservation-check`

These routes reuse the existing v1.41 major-language registry, saved work, teacher-review handoff, employer ROI snapshot, and continuity-preservation concepts. They do not require destructive migrations and do not add live credentials. They are designed to make the 100+ language learning-support promise prominent while preserving Legal English performance training boundaries.


## v1.51.0 API layer

New production-safe routes:

- `GET /api/v151/page-language-selector`
- `GET /api/v151/page-language-options`
- `POST /api/v151/preferred-language-setting`
- `POST /api/v151/page-explanation-request`
- `POST /api/v151/employer-language-access-summary`
- `POST /api/v151/page-language-continuity-check`

These routes are additive and preserve the existing v1.50 language bridge, v1.49 intuitive UX, v1.46 skills feedback, v1.43 placement, v1.41 major-language registry, v1.36 native-language support, calendar, dashboard, payment, report, and production-readiness architecture.

## v1.52.0 backend — Three-layer language access

New v1.52 endpoints:

- `GET /api/v152/three-layer-language-strategy` returns the full language-access strategy: promise, anti-promise, language count, three layers, top-market languages, learner actions, avoid list, safety boundary, employer privacy rule, and data-preservation rules.
- `GET /api/v152/core-ui-language-scope` returns the core platform UI areas eligible for major-language help.
- `POST /api/v152/language-access-plan` creates a saved work record for a user’s selected language access plan and optionally creates staff review tasks for high-stakes, unsupported, low-confidence, legal, certified-translation, or court-interpretation requests.
- `POST /api/v152/human-reviewed-marketing-page-plan` creates a staff task for reviewed top-market marketing page translation planning.
- `POST /api/v152/language-strategy-continuity-check` confirms that the language-access layer is additive and may not delete, wipe, expose, or weaken protected production records.

These routes must remain compatible with existing v1.51 page-language selector routes and v1.41 major-language registry routes.

## v1.53.0 backend additions — Role clarity + continuity

New v1.53 endpoints:

- `GET /api/v153/role-clarity-continuity-pass`
- `POST /api/v153/plain-role-next-step`
- `POST /api/v153/staff-data-continuity-review`
- `POST /api/v153/employer-safe-role-summary`
- `POST /api/v153/deployment-continuity-gate`

These endpoints reuse the existing persistent-store scaffolding and remain additive. They do not drop tables, reset production data, expose private learner content to employers by default, or change the approved EnglishLegalese logo/brand assets.

