# EnglishLegalese Platform v1.54.1 — Render Bootstrap Fix

v1.54.1 production-facing frontend stabilization keeps the original additive v1.54.0 front-end preserved as app-legacy-v1.54.0.js, while app.js now renders a stable public beta homepage, role dashboards, language bridge, course set, SmartTeacher demo, launch gates, and trust boundaries on Render.

# v1.54.0 Live Launch Checklist

- [ ] Configure real PostgreSQL and verify migrations.
- [ ] Verify backups and restore test.
- [ ] Create owner/admin account and test all roles.
- [ ] Configure Stripe products, prices, Checkout, and webhook.
- [ ] Configure OpenAI key server-side for SmartTeacher AI.
- [ ] Configure SMTP email.
- [ ] Configure object storage for uploads/reports/certificates.
- [ ] Verify manual class-link fallback plus `.ics`; optional Google/Zoom/Teams/Tencent/DingTalk adapters can be added after.
- [ ] Finalize terms, privacy, refund, disclaimer, AI use, upload warnings, employer privacy, teacher terms, and recording consent.
- [ ] Run device/browser QA and complete end-to-end launch workflow.
- [ ] Keep public beta invite-only until all required gates pass.

# v1.35.0 Live Launch Checklist Addendum

- [ ] Confirm at least one working global classroom path besides Google.
- [ ] Confirm staff can paste an approved manual/regional classroom link.
- [ ] Confirm `.ics` calendar download works.
- [ ] Confirm student dashboard shows local time and one Join Class button.
- [ ] Confirm teacher console shows agenda, live correction, roleplay, AI translation-risk lens, homework, closeout, and privacy controls.
- [ ] Confirm employer reports remain privacy-safe.
- [ ] Confirm SmartTeacher AI uses OpenAI/ChatGPT only.

# v1.30.0 Live Launch Addendum

Live launch checks should now include the SmartTeacher AI brand-lock language, role next-action sections, classroom readiness copy, teacher marketing guardrails, employer proposal language, and owner/staff blocker queues.

# Live Launch Checklist

## Launch blocker gates

- [ ] PostgreSQL connected and migrations completed.
- [ ] Owner/admin account created with strong password.
- [ ] Authentication and role permissions smoke-tested.
- [ ] Stripe Checkout configured.
- [ ] Stripe webhook endpoint configured and verified.
- [ ] Object storage presigned upload route works.
- [ ] SMTP/email route sends to a real test inbox.
- [ ] Google Calendar/Meet session creation tested.
- [ ] Zoom alternate session creation tested or intentionally marked disabled.
- [ ] SmartTeacher AI server route works with production API key.
- [ ] PDF reports generated and saved/exported.
- [ ] Backup checkpoint verified.
- [ ] Safe deployment checklist reviewed.
- [ ] No demo/local JSON store is being used for real users.
- [ ] Employer privacy and no-legal-advice boundaries visible.
- [ ] Recording policy set to off by default unless all parties consent.

## Go-live rule

Do not accept paid classroom users until `/api/v121/launch-readiness` shows no required blockers or staff has intentionally accepted a limited beta exception in writing.


## v1.23 note
Run the v1.23 operations smoke tests after migrations so action center, video room events, SmartTeacher AI interaction records, and teacher marketing attribution are available before live classroom users.


## AI-era launch checks

- Homepage clearly answers why AI translation alone is not enough.
- SmartTeacher AI is labeled as practice/training only.
- Teacher workflows include AI Translator Safety exercises and teacher-review handoffs.
- Employer dashboard/report language shows ROI without exposing private student drafts by default.
- Teacher marketing assets use approved tracking links and no off-platform pricing.


## v1.25.0 AI-Era Operating Flow Addition

This version adds additive, non-destructive records for AI-era pathway plans, teacher review handoffs, employer ROI snapshots, and confidentiality checks. These records reinforce that EnglishLegalese is Legal English training for the AI era: AI-supported practice plus human teacher review, employer-safe reporting, and confidentiality-aware workflows. Existing production data and routes must be preserved during deployment.

## v1.26.0 live launch confirmation

Before accepting real paid classroom users on v1.26.0, confirm:

- `/health` reports v1.26.0.
- `/api/v126/integrated-product-flow` returns ok.
- All production credentials are configured as environment variables, not committed files.
- PostgreSQL, object storage, Stripe, SMTP, Google Meet/Zoom, OpenAI, and production URL checks are either verified or clearly shown as blockers.
- Student, teacher, employer, and owner/admin dashboards each show one clear next action.
- AI translator safety, teacher review, confidentiality, employer-safe reports, and no-legal-advice boundaries are visible.


## v1.27.0 live launch confirmation

Before accepting real paid classroom users on v1.27.0, confirm:

- `/health` reports v1.27.0.
- `/api/v127/simplicity-flow` returns ok.
- `/api/v126/integrated-product-flow` still returns ok.
- All production credentials are configured as environment variables, not committed files.
- PostgreSQL, object storage, Stripe, SMTP, Google Meet/Zoom, OpenAI, and production URL checks are verified or clearly shown as blockers.
- The homepage directly answers the AI-translator objection.
- Student, teacher, employer, and owner/admin dashboards each show one clear next action.
- AI translator safety, teacher review, confidentiality, employer-safe reports, teacher marketing guardrails, classroom/video readiness, and no-legal-advice boundaries are visible.


## v1.29.0 launch review

Review public-facing pricing and course pages to make sure the benchmark comparison helps conversion without overclaiming. The message should be: EnglishLegalese is lower-cost and more practical than major university programs, but it is not a degree, law school, legal service, certified translation service, or substitute for professional review.



## v1.31.0 Launch Review

Review the teacher classroom tools before launch:

- Are teacher tools understandable within 30 seconds?
- Does the student view remain simple?
- Is the AI-translator objection answered inside the class workflow?
- Are teacher notes and employer reports privacy-safe?
- Are class links, time zones, and video-room status easy to find?
- Can staff see class closeout, report, credit, payout, and renewal blockers?


## v1.32.0 Launch Review

Before launch, confirm:

- SmartTeacher AI is described consistently as the EnglishLegalese AI practice teacher.
- Trust/support copy can say it is powered by ChatGPT/OpenAI.
- `OPENAI_API_KEY` is configured server-side only.
- No second AI vendor is required, advertised, or configured.
- Teacher classroom tools keep the teacher in control of AI-generated prompts, corrections, homework, and employer-safe report drafts.
- Employer-facing language explains that ChatGPT-powered practice is paired with live teacher review and privacy-safe reporting.


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
