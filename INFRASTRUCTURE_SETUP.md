# v1.54.0 Infrastructure Setup Addendum

The production stack should now be activated in this order: PostgreSQL and backups, owner/admin auth, Stripe, OpenAI/SmartTeacher AI, SMTP, object storage, manual class-link fallback and `.ics`, then optional Google/Zoom/Microsoft/Tencent/DingTalk integrations.

Do not put live credentials in source files or ZIPs. Add them through the hosting provider environment variable settings after the code is deployed.

# v1.35.0 Infrastructure Setup Addendum

The recommended production stack remains: Node/Express, PostgreSQL, S3-compatible object storage, Stripe, SMTP/transactional email, OpenAI/ChatGPT for SmartTeacher AI, and provider-agnostic classroom/calendar adapters.

Do not add Gemini or other AI vendor keys for SmartTeacher AI. Do not require Google Calendar/Meet for global users. Keep Google, Zoom, Teams, Tencent/VooV, DingTalk, Outlook/Microsoft 365, Apple Calendar, CalDAV, ICS, and manual reminders as adapters around the EnglishLegalese source-of-truth schedule.

# v1.30.0 Infrastructure Note

No new infrastructure service is required for v1.30.0. Continue using environment variables for PostgreSQL, Stripe, object storage, SMTP, Google Calendar/Meet, Zoom, OpenAI, and production domain settings.

# EnglishLegalese Production Infrastructure Setup

This file turns v1.21.0 into an activation checklist for the real live platform. The app can now verify whether production services are configured, but real accounts and secrets must be created in the owner-controlled service dashboards and stored as environment variables in the hosting provider.

## Required live services

1. **Managed PostgreSQL** for permanent users, class sessions, saved work, homework, reports, payments, teacher payouts, employer records, teacher marketing attribution, audit logs, backup checkpoints, and deployment records.
2. **Object storage** such as S3, Cloudflare R2, or another S3-compatible provider for uploads and generated reports.
3. **Stripe** for checkout, invoices, credits, payment records, and webhooks.
4. **Email/SMTP** for class confirmations, reminders, homework/report notifications, teacher/admin alerts, and employer updates.
5. **Google Calendar/Meet** as default class video and calendar flow.
6. **Zoom** as approved alternate video provider.
7. **OpenAI API** for server-side SmartTeacher AI.
8. **Hosting environment** such as Render, Railway, Fly, or a VPS with all production secrets stored outside the code repository.

## Safe architecture rule

Code lives in the deployable app. Live data does not. Production data must live in managed PostgreSQL and object storage. Deploying a new ZIP or Git commit must never reset live data.

## Activation sequence

1. Create production PostgreSQL.
2. Add `DATABASE_URL` and `SESSION_SECRET` to the hosting provider.
3. Deploy the app without accepting users.
4. Run `npm run migrate`.
5. Run `npm run owner:create` once using temporary owner credentials.
6. Configure Stripe keys and webhook secret.
7. Configure object storage credentials.
8. Configure SMTP.
9. Configure Google Calendar/Meet and Zoom.
10. Configure OpenAI.
11. Run `npm run live:verify:strict`.
12. Smoke test `/health`, login, booking request, class-session create, saved work, upload presign, Stripe checkout, calendar/video placeholder/live creation, PDF report, email, and SmartTeacher AI.
13. Only then begin real student, teacher, and employer onboarding.

## Secrets rule

Never place live secrets in a ZIP, GitHub repo, frontend JavaScript, or screenshot. Use environment variables only.


## v1.23 note
Run the v1.23 operations smoke tests after migrations so action center, video room events, SmartTeacher AI interaction records, and teacher marketing attribution are available before live classroom users.


## AI-era training infrastructure note

If server-side AI is enabled, keep prompts and uploaded content behind privacy/security controls. Encourage sample, anonymized, fictional, or user-cleared text for AI practice. Do not send confidential or privileged client material to AI providers unless the user has authority and the platform terms/security controls clearly allow it.


## v1.27.0 infrastructure note

No new live infrastructure service is required for the v1.27 simplicity layer. It depends on the existing production stack: PostgreSQL, object storage, Stripe, SMTP, Google Calendar/Meet, Zoom where enabled, server-side OpenAI, and environment-variable secrets. Keep all credentials outside the ZIP and repository.


## v1.29.0 infrastructure note

No new infrastructure provider is required. The new benchmark endpoint and course catalog are app-level features. Future persistence for benchmark competitors, course tracks, or offer ladder records should use additive PostgreSQL migrations and existing environment-variable secret rules.



## v1.31.0 Infrastructure Note

The new teacher classroom tools do not require new live credentials by themselves. When the production implementation becomes live, connect the tools to the existing PostgreSQL, object storage, Google Calendar/Meet, Zoom, SMTP, Stripe, and OpenAI environment-variable model. Do not hard-code secrets.


## v1.32.0 Infrastructure Note

No new infrastructure service is required for v1.32.0. Continue using the existing server-side OpenAI configuration for SmartTeacher AI. The AI infrastructure rule is now simpler:

- One AI vendor: OpenAI / ChatGPT.
- One required AI key: `OPENAI_API_KEY`.
- Optional model setting: `SMARTTEACHER_MODEL`.
- No multi-vendor AI routing.

This reduces launch complexity, trust messaging complexity, and staff support burden.

## v1.33.0 global classroom infrastructure

The core infrastructure remains PostgreSQL, object storage, Stripe, SMTP, OpenAI/ChatGPT, and the EnglishLegalese app. Google Calendar/Meet, Zoom, Microsoft Teams, Tencent/VooV, and DingTalk are optional classroom providers. Manual join links are required as the global fallback.



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
