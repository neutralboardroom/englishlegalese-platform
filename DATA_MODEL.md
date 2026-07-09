# EnglishLegalese Platform v1.54.1 — Render Bootstrap Fix

v1.54.1 production-facing frontend stabilization keeps the original additive v1.54.0 front-end preserved as app-legacy-v1.54.0.js, while app.js now renders a stable public beta homepage, role dashboards, language bridge, course set, SmartTeacher demo, launch gates, and trust boundaries on Render.

# v1.54.0 Data Model Note — Public Launch Readiness Sprint

v1.54 uses existing persistence patterns instead of creating destructive schema changes. Launch gate checks, teacher onboarding plans, beta readiness items, and preservation reviews are stored through existing staff task, saved work, homework/template, employer snapshot, deployment, launch event, and audit-log patterns.

Protected records include student profiles, teacher profiles, employer accounts, placement results, enrollments, lesson folders, homework, speaking/listening/reading/writing practice, SmartTeacher AI practice, Translation Bridge records, preferred-language settings, calendars, class sessions, class links, payments, credits, reports, certificates, test scores, teacher notes, employer records, uploads, support history, audit logs, and payouts.

# v1.35.0 Data Model Note — Global First-Class Success

The persistent source of truth remains the EnglishLegalese class-session record. Future additive persistence should support these fields without replacing prior tables or wiping data:

- class_session_id
- learner_or_cohort_id
- teacher_id
- employer_account_id
- package_or_credit_status
- start_time_utc
- end_time_utc
- display_time_zone
- learner_region
- teacher_region
- provider_name
- join_url
- fallback_join_instructions
- calendar_add_link
- ics_download_url
- region_access_note
- tested_from_region
- recording_consent_status
- agenda_status
- smartteacher_practice_status
- teacher_review_status
- homework_status
- report_status
- certificate_status
- credit_deduction_status
- payout_review_status
- renewal_or_topup_recommendation
- privacy_visibility_label

All future database work should be additive only. Do not drop, reset, or overwrite production tables.

# v1.30.0 Data Model Addendum

The v1.30 operating model reinforces a single connected learning/session record: diagnostic, package/credits, SmartTeacher AI practice, lesson folder, teacher review, calendar/video room, class closeout, homework/exam status, report/certificate, credit deduction, teacher payout, employer-safe summary, and renewal/top-up cue. No new destructive table changes are required in this pass.

# EnglishLegalese Production Persistence Model (v1.18.0)

This version begins the production-safe persistence foundation. The core rule is:

> Deployments replace code only. They must never overwrite users, classrooms, saved work, homework, exams, reports, payments, credits, teacher payouts, teacher marketing attribution, employer records, files, or audit logs.

## Source of truth

- PostgreSQL: users, organizations, roles, class sessions, saved work metadata, homework, exams, reports, credits, payouts, teacher campaigns, audit log.
- Object storage: uploaded files, generated PDF reports, optional recordings only with consent.
- Stripe: external payment source of truth, linked back to the internal credit ledger.
- Calendar/video providers: provider IDs saved on the internal `class_sessions` record.

## Important tables

See `db/migrations/001_initial_persistent_schema.sql`.

## Development fallback

`src/persistence.js` includes a local JSON fallback for prototype testing only. Do not use that fallback for real users or production deployments. Production must set `DATABASE_URL` and use PostgreSQL.

## Production launch gate

Before launch with real students, teachers, employers, payments, classrooms, homework, or reports, confirm:

1. PostgreSQL database exists and migrations have run.
2. Object storage bucket exists and is not part of the deploy folder.
3. Stripe webhooks save payment/credit events.
4. Calendar/video provider IDs are stored on class sessions.
5. Automatic backups are enabled.
6. Manual backup process is tested.
7. Staging and production databases are separate.
8. No production reset/seed/drop command is available in deployment scripts.
9. Post-deploy smoke test verifies users, sessions, saved work, reports, credits, payouts, and audit logs survived.


## v1.19.0 Production backend foundation

This release adds real production-backend scaffolding for authentication/login, role permissions, PostgreSQL migration 002, Stripe Checkout and verified webhook routing, S3-compatible presigned uploads, SMTP email notification routing, Google Meet and Zoom class-session creation routes, server-generated PDF reports, and server-side SmartTeacher AI routing.

The platform remains data-preserving: deploys must update code only and must never reset live PostgreSQL tables or object storage. See `PRODUCTION_BACKEND.md` for the new backend architecture and required environment variables.


## v1.20.0 Operational tables

The v1.20.0 migration adds operational tables that make the platform easier to run without losing data:

- `booking_requests`: intake/scheduling/package requests before a class session is confirmed.
- `teacher_availability_blocks`: teacher availability windows, time zones, and video preferences.
- `class_session_closeouts`: attendance, notes, homework status, AI practice, report refresh, credit deduction, payout review, and staff review.
- `staff_tasks`: revenue, scheduling, classroom, report, payout, teacher marketing, and trust/AI-boundary tasks.
- `notification_preferences`: user-level notification settings by event and channel.

These tables are additive. They must be migrated forward and preserved across future deploys.

## v1.21.0 production activation records

v1.21.0 adds operational tables that do not replace classroom records. They help staff safely move the platform to production.

| Table | Purpose |
|---|---|
| `integration_health_checks` | Records whether Stripe, PostgreSQL, object storage, SMTP, Google Meet, Zoom, OpenAI, and other services were checked and what the result was. |
| `deployment_records` | Records version, environment, deploy status, migration status, post-deploy smoke status, and rollback/data-safety notes. |
| `backup_checkpoints` | Records backup provider, verification status, restore-test status, and notes before/after important releases. |
| `production_launch_events` | Records owner/staff launch gate approvals, evidence, and exceptions. |

These tables are additive and safe. They must never be used to overwrite users, classes, payments, reports, homework, exams, or employer records.


## v1.22.0 additions

The following records were added to reduce launch confusion and support real operations:

- `role_journey_events`: records next actions by role so students, teachers, employers, and staff can be guided through the same simple operating flow.
- `classroom_readiness_reviews`: staff-visible readiness checks tying together payment/credits, calendar, video, saved work, homework, reports, and payout status.
- `teacher_marketing_assets`: approved promotional assets and tracking codes for teacher-led growth without off-platform pricing.
- `support_threads`: role-based support issues for scheduling, video, homework, reports, credits, payouts, privacy, recordings, marketing claims, and AI boundaries.


## v1.23.0 integrated operating tables

- `action_center_items`: one next-action list for staff and role dashboards.
- `video_room_events`: video room and calendar event continuity tied to class sessions.
- `ai_tutor_interactions`: SmartTeacher AI interaction summaries for continuity and boundary review.
- `marketing_lead_attribution`: teacher-sourced lead attribution, conversion, and bonus-review tracking.

These tables are designed to reduce scattered operations and keep launch, classroom, marketing, AI, and payout workflows connected.


## v1.24.0 AI-era Legal English tables

Additive migration 007 adds:

- `ai_era_curriculum_modules` — curriculum modules tied to AI-era Legal English tracks.
- `ai_translator_safety_exercises` — exercises such as translation-risk spotting, confidentiality checks, professional tone rewrites, and teacher-review workflows.
- `ai_era_dashboard_signals` — role-specific progress and next-action signals for students, teachers, employers, staff, and owner/operator dashboards.
- `ai_era_marketing_assets` — approved teacher/employer marketing copy that explains why AI translation alone is not enough while preserving platform pricing and trust controls.

These tables are non-destructive and must be migrated without resetting production data.


## v1.25.0 AI-Era Operating Flow Addition

This version adds additive, non-destructive records for AI-era pathway plans, teacher review handoffs, employer ROI snapshots, and confidentiality checks. These records reinforce that EnglishLegalese is Legal English training for the AI era: AI-supported practice plus human teacher review, employer-safe reporting, and confidentiality-aware workflows. Existing production data and routes must be preserved during deployment.

## v1.26.0 AI-Era Integrated Product Flow Addition

v1.26.0 does not replace the v1.25.0 AI-era operating tables. It reuses and surfaces the existing records more clearly:

- `ai_era_pathway_plans`
- `teacher_review_handoffs`
- `employer_roi_snapshots`
- `confidentiality_checks`
- `ai_era_curriculum_modules`
- `ai_translator_safety_exercises`
- `ai_era_dashboard_signals`
- `ai_era_marketing_assets`

The new `/api/v126/integrated-product-flow` endpoint aggregates the existing v1.25 records and returns a production-safe operating brief for the AI-era product journey. It is intentionally additive and does not weaken data-preservation rules.


## v1.27.0 data model note

v1.27.0 does not require a new destructive migration. It reuses the existing persistent AI-era records added in v1.25.0 and surfaced in v1.26.0:

- AI-era pathway plans.
- Teacher review handoffs.
- Employer ROI snapshots.
- Confidentiality checks.

The v1.27 simplicity layer is an operating and UX layer that makes these records easier to understand and act on. Any future v1.28+ persistence for the v1.27 command center should be additive only.


## v1.29.0 benchmark integration records

No destructive schema change was added in this pass. Future persistent records, if needed, should be additive and may include:

- `benchmark_competitors`: name, benchmark_type, approximate_cost_signal, source_note, staff_visibility, last_reviewed_at.
- `course_catalog_tracks`: track_name, audience, modules, teacher_review_required, ai_practice_enabled, certificate_eligible.
- `offer_ladder_items`: package_name, price_band, audience, credits_or_duration, margin_notes, active_status.
- `employer_roi_comparisons`: employer_id, package_id, university_cost_signal, estimated_team_training_cost, report_ready_at.
- `teacher_marketing_scripts`: channel, approved_copy, claim_status, approved_by, tracking_required.

All future additions must preserve production data and use additive migrations only.



## v1.31.0 Teacher Classroom Tool Records

v1.31.0 adds a planning layer for teacher classroom tools without destructive database changes. Future persistent records should be additive only.

Recommended future records:

- `classroom_teacher_tools` for agenda, correction pad, roleplay, vocabulary bank, AI translation risk lens, homework generator, and closeout state.
- `classroom_visibility_labels` for student-private, teacher-private, employer-safe, and staff-only note status.
- `teacher_prompt_activity` for SmartTeacher AI classroom prompts generated, edited, approved, assigned, or rejected by teachers.
- `class_correction_items` for corrected wording, pronunciation notes, vocabulary, and professional tone alternatives.
- `class_closeout_items` for attendance, homework assigned, report note, credit deduction, payout dependency, employer-safe summary, and next recommendation.

Data protection rule: private drafts, sensitive uploads, teacher-private notes, and student-private practice should not become employer-visible unless permission is explicit and the UX makes it clear.


## v1.32.0 ChatGPT-Only AI Governance Records

v1.32.0 does not require destructive database changes. Existing `ai_interactions`, audit logs, staff tasks, teacher review handoffs, employer reports, and class-session records should continue to support SmartTeacher AI.

Recommended metadata for future additive persistence:

- `configured_provider`: `openai_chatgpt_responses_api_only` or `dev_safe_fallback`.
- `user_facing_ai_name`: `SmartTeacher AI`.
- `ai_vendor_policy_version`: `v1.32-chatgpt-only`.
- `privacy_visibility`: student-private, teacher-private, employer-safe, or staff-only.
- `teacher_review_required`: boolean for important saved AI outputs.

Do not create tables or fields that imply second AI-vendor routing unless Roger later changes the strategy.

## v1.33.0 classroom provider metadata

Future persistent class-session records should support provider-agnostic classroom metadata:

- `calendar_source_of_truth`: EnglishLegalese internal class session.
- `provider_name`: Google Meet, Zoom, Microsoft Teams, Tencent/VooV, DingTalk, manual link, or other approved provider.
- `join_url`.
- `provider_event_id`.
- `provider_room_id`.
- `region_access_note`.
- `fallback_join_instructions`.
- `tested_from_region`.
- `recording_consent_status`.



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

## v1.45 integrated skills records

The Integrated Skills Studio should reuse existing persistent records wherever possible: saved work / lesson-folder items for speaking, listening, reading, and writing practice; teacher-review handoffs for human review; homework assignments for follow-up; employer ROI/progress snapshots for privacy-safe reports; and audit/deployment records for no-data-loss checks. Do not create a parallel disconnected skills database when the existing continuity records can safely support the workflow.

## v1.46.0 Live Skills Practice + Feedback Loop data notes

v1.46 practice packets should map to persistent saved-work records and teacher-review handoffs. Teacher feedback loops should create review handoffs and homework assignments. Employer skills progress briefs should use privacy-safe employer ROI/progress snapshots only.

Protected v1.46 records include practice packets, voice/spoken tasks, intentionally saved transcripts, listening notes, reading scores, writing drafts, lesson-folder items, teacher feedback, homework, class sessions, calendar/video links, payments, credits, reports, certificates, test scores, teacher notes, employer records, uploads, support history, audit logs, and payouts. Future migrations must be additive only.


## v1.47.0 Data Model Note

No destructive schema changes are required for v1.47.0. The new role-first command map reuses existing persistent concepts: staff tasks for next-action plans, employer ROI snapshots for privacy-safe employer summaries, and existing saved work / teacher review / homework / report records for the learning proof loop. Future migrations, if needed, must be additive only.

## v1.48.0 — Usability Continuity Pass

- Adds a restrained usability pass focused on plain-language role paths for students, teachers, employers, and owner/staff users.
- Adds the `/api/v148/usability-continuity-pass`, `/api/v148/plain-language-user-path`, `/api/v148/continuity-preservation-audit`, and `/api/v148/employer-safe-progress-card` routes.
- Keeps EnglishLegalese positioned as Legal English training for the AI era, not generic English or simple translation.
- Strengthens the product-level promise that code deploys preserve user work, calendars, payments, credits, reports, certificates, test scores, teacher notes, employer records, uploads, audit history, and payouts.
- Keeps SmartTeacher AI ChatGPT/OpenAI-only, Google optional, employer reporting privacy-safe by default, and Translation Bridge/native-language support framed as learning support rather than certified translation, interpretation, legal advice, or final legal meaning.

## v1.49.0 Intuitive UX Continuity records

v1.49.0 adds no destructive database changes. The new UX flow cards, staff UX blocker items, employer-safe summaries, and continuity risk checks are designed to use existing staff task, employer ROI/progress snapshot, audit/check, and local prototype state patterns.

The protected record set remains: student work, lesson folders, homework, voice/spoken practice, listening notes, reading scores, writing drafts, SmartTeacher AI practice, Translation Bridge records, calendars, class links, payments, credits, reports, certificates, test scores, teacher notes, employer records, uploads, support history, audit logs, and payouts.

## v1.50.0 Language Learning Bridge records

v1.50.0 adds operational records for the 100+ Language Learning Bridge while reusing existing persistence concepts instead of introducing a disconnected data model.

Records created or summarized by the v1.50 routes include:

- `v150_language_learning_bridge_plan` saved work records for student/teacher/staff-only language-support onboarding.
- Teacher-review handoffs when the language request is high-stakes, low-confidence, rare, sensitive, or important enough to require teacher confirmation.
- Employer ROI/progress snapshots used as employer-safe language readiness cards.
- Static continuity preservation checks confirming that language-support improvements do not wipe or weaken existing production records.

Private native-language explanations, raw SmartTeacher AI content, private drafts, recordings/transcripts, sensitive uploads, test answers, and teacher-private notes are excluded from employer summaries by default.


## v1.51.0 preferred-language page explanation records

The platform should treat preferred-language settings and page explanation requests as protected learning-support records. They connect to saved work, teacher/staff review handoffs, course placement, SmartTeacher AI practice, Translation Bridge usage, and employer-safe summaries. They must not be wiped or exposed by code deployments.

Protected concepts include preferred-language settings, page explanation requests, side-by-side Simple English/native-language explanations, Back-to-Legal-English prompts, and employer-safe language access summaries.

## v1.52.0 three-layer language access records

v1.52.0 adds an explicit three-layer language access model while preserving the v1.51 preferred-language selector and existing Translation Bridge records.

New record concepts:

- `v152_three_layer_language_access_plan`: saved work item representing the selected preferred language, layer, and back-to-Legal-English learning path.
- `v152_language_access_review`: staff task for low-confidence, rare, unsupported, sensitive, legal, certified-translation, or court-interpretation language requests.
- `v152_human_reviewed_marketing_translation_plan`: staff task for planning reviewed marketing pages in top-market languages.
- `v152_language_strategy_continuity_check`: deployment/preservation check ensuring language changes do not wipe, expose, or orphan production records.

The model must preserve student work, lesson folders, homework, voice/spoken practice, listening notes, reading scores, writing drafts, SmartTeacher AI practice, Translation Bridge records, preferred-language settings, page explanations, core UI language settings, human-review translation queue records, calendars, class links, payments, credits, reports, certificates, test scores, teacher notes, employer records, uploads, support history, audit logs, and payouts.

## v1.53.0 role clarity + continuity records

v1.53.0 adds role clarity and deployment-continuity records without creating destructive database changes.

Logical records include:

- `v153_plain_role_next_step` saved work records for simple role guidance.
- `v153_data_continuity_review` staff tasks for deployment and data-preservation review.
- `v153_employer_safe_role_summary` employer ROI snapshots for high-level employer reporting.
- `v153_deployment_continuity_gate` responses for pre-deployment safety checks.

These records are additive and must preserve existing data for users, classes, calendars, payments, credits, reports, certificates, scores, notes, uploads, audits, and payouts.

