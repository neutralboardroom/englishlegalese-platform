# EnglishLegalese Platform v1.54.1 — Render Bootstrap Fix

v1.54.1 production-facing frontend stabilization keeps the original additive v1.54.0 front-end preserved as app-legacy-v1.54.0.js, while app.js now renders a stable public beta homepage, role dashboards, language bridge, course set, SmartTeacher demo, launch gates, and trust boundaries on Render.

## v1.54.0 — Public Launch Readiness Sprint

- Adds the Public Launch Readiness Sprint layer and launch command center.
- Adds production gates for PostgreSQL, owner/admin roles, Stripe, SmartTeacher AI, SMTP, object storage, classroom links, legal/trust pages, device QA, backups, and no-data-loss deployment.
- Adds first-course lesson templates for the initial public catalog.
- Adds teacher onboarding plan generation before public student assignment.
- Adds diagnostic-to-course routing for controlled beta use.
- Adds invite-only public beta rules until integrations are configured and tested.
- Adds end-to-end launch workflow test planning and the `npm run e2e:public` helper script.
- Adds `/api/v154/public-launch-readiness`, `/api/v154/first-course-content`, `/api/v154/launch-gate-check`, `/api/v154/first-course-lesson-template`, `/api/v154/teacher-onboarding-plan`, `/api/v154/diagnostic-to-course-plan`, `/api/v154/public-beta-readiness`, and `/api/v154/end-to-end-launch-test-plan`.
- No destructive migrations and no live secrets were added.


## v1.48.0 — Usability Continuity Pass

- Adds a restrained usability pass focused on plain-language role paths for students, teachers, employers, and owner/staff users.
- Adds the `/api/v148/usability-continuity-pass`, `/api/v148/plain-language-user-path`, `/api/v148/continuity-preservation-audit`, and `/api/v148/employer-safe-progress-card` routes.
- Keeps EnglishLegalese positioned as Legal English training for the AI era, not generic English or simple translation.
- Strengthens the product-level promise that code deploys preserve user work, calendars, payments, credits, reports, certificates, test scores, teacher notes, employer records, uploads, audit history, and payouts.
- Keeps SmartTeacher AI ChatGPT/OpenAI-only, Google optional, employer reporting privacy-safe by default, and Translation Bridge/native-language support framed as learning support rather than certified translation, interpretation, legal advice, or final legal meaning.

# v1.45.0 — Integrated Skills Studio

- Added an Integrated Skills Studio that connects speaking, listening, reading, and writing into one simple Legal English learning loop.
- Added practical workflow language for spoken English practice, listening and note-taking, legal reading labs, legal writing workshops, native-language support when stuck, teacher review, homework, and employer-safe reports.
- Added new v1.45 backend routes for integrated skills studio, skills course sequence, placement skill routing, speaking/listening sessions, reading/writing sessions, teacher classroom tool actions, employer integrated skills reports, and deployment preservation checks.
- Added dashboard panels for students, teachers, employers, and owner/staff users so four-skills work routes into the same lesson-folder, teacher-review, homework, classroom, report, certificate, and data-preservation flow.
- Preserved SmartTeacher AI as ChatGPT/OpenAI-only, Google as optional, Translation Bridge as learning support only, and employer reports as privacy-safe by default.
- Added v1.45 integrated skills preservation checklist language.

# EnglishLegalese Platform v1.39.0 — Seamless Learning Operations

## Added / improved
- Added a new Seamless Learning Operations layer that makes the platform easier to understand for students, teachers, employers, staff/admin, and owner/operator users.
- Added Universal Translation Bridge language: users can request explanation in any preferred/native language when stuck, with a required return-to-Legal-English practice step.
- Added teacher live cockpit language for before-class prep, during-class tools, and after-class closeout.
- Added clearer role action rails for student, teacher, employer, staff/admin, and owner/operator workflows.
- Added explicit no-data-loss deployment guardrails for student work, calendars, payments, reports, certificates, test scores, AI practice, Translation Bridge records, teacher notes, employer records, support/audit history, and payouts.
- Expanded SmartTeacher AI answer logic for any-language support, online classroom teaching tools, data preservation, and the AI-translator objection.
- Added production-safe endpoint `/api/v139/seamless-learning-operations`.
- Added `scripts/verify-v139-seamless-learning-operations.js` and wired it into `npm run check` and `npm run ops:verify`.

## Preserved
- All v1.38.0 AI-Era Action Layer features.
- All v1.37.0 Guided Help + Readiness Navigator features.
- All v1.36.0 Translation Bridge/native-language learning support features.
- All global-access classroom/calendar fallback rules.
- ChatGPT/OpenAI-only SmartTeacher AI policy.
- Built-in teacher classroom tools, teacher marketing toolkit, employer privacy-safe reporting, dashboards, payments, uploads, reports, auth, production scaffolding, and verification scripts.
- Existing migrations were preserved and no destructive migrations were added.
- No live secrets were added to the ZIP.

## Known limitations
- External services still require real environment variables and account-owned credentials before live activation.
- Translation Bridge is language-learning support and still requires teacher/professional review for high-stakes legal/business language.
- The frontend remains a prototype-style SPA backed by production scaffolding; production deployment still requires staged deployment, smoke testing, credential setup, and persistent data configuration.

# EnglishLegalese Platform v1.38.0 — AI-Era Action Layer

## Added / improved
- Added a new homepage AI-Era Action Layer that makes the core value proposition more explicit: AI can translate words, but professionals still need judgment, context, confidentiality awareness, professional tone, speaking confidence, document fluency, writing skill, and safe AI-output review.
- Added a student proof loop: Choose goal → Practice safely → Get unstuck → Bring to class → Prove progress.
- Added role operating lanes for students, teachers, employers, and staff/owner users.
- Added dashboard next-action rails while preserving existing dashboard content.
- Added trust and privacy microcopy near AI, Translation Bridge, uploads, employer reports, and global classroom access.
- Added mobile/tablet action cards for Student, Teacher, Employer, and Staff views.
- Added classroom handoff language for before, during, and after live classes.
- Expanded SmartTeacher AI answer logic for AI-translation objections, employer privacy, confidentiality/upload warnings, and Google/global access questions.
- Added production-safe endpoint `/api/v138/ai-era-action-layer`.
- Added `scripts/verify-v138-ai-era-action-layer.js` and wired it into `npm run check` and `npm run ops:verify`.

## Preserved
- All v1.37.0 Guided Help + Readiness Navigator features.
- All v1.36.0 Native-Language Learning Support + Translation Bridge features.
- All v1.35.0 Global First-Class Success and global-access classroom/calendar rules.
- ChatGPT/OpenAI-only SmartTeacher AI policy.
- Universal calendar/ICS route and provider-agnostic classroom strategy.
- Built-in teacher classroom tools, teacher marketing toolkit, employer privacy-safe reporting, student dashboards, teacher dashboards, employer dashboards, staff/admin/owner tools, payments, uploads, reports, auth, production scaffolding, and verification scripts.
- Existing migrations were preserved and no destructive migrations were added.
- No live secrets were added to the ZIP.

## Known limitations
- External services still require real environment variables and account-owned credentials before live activation.
- Google Meet, Zoom, Stripe, SMTP, OpenAI, object storage, and other integrations remain readiness/blocker-aware until configured.
- The frontend remains a prototype-style SPA backed by production scaffolding; live production still requires staged deployment, smoke testing, credential setup, and persistent data configuration.

# EnglishLegalese Platform v1.35.0 — Global First-Class Success + Seamless Role Flow

This release continues from v1.34.0 and preserves the global calendar/video architecture, ChatGPT-only SmartTeacher AI, and built-in teacher classroom tools. The pass focuses on the practical first-class journey: a student or employer can start, schedule, join, learn, receive homework, show progress, and renew without needing to understand the underlying provider complexity.

## What changed
- Added a Global First-Class Success flow from goal → credits → teacher/region match → EnglishLegalese schedule → accessible class link → SmartTeacher AI practice → live teacher console → closeout/report/renewal.
- Added clearer role dashboard language for students, teachers, employers, and owner/staff.
- Added teacher live-tool positioning for Agenda Builder, Live Correction Pad, Roleplay Launcher, AI Translation Risk Lens, Vocabulary and Clause Bank, Homework Generator, Closeout Checklist, Privacy Visibility Switch, Employer-safe Summary Draft, and Student Next-Step Recommendation.
- Added global access readiness guidance: Google is optional, EnglishLegalese is the source of truth, manual/regional links and ICS/manual reminders remain required fallbacks.
- Added clearer trust language answering the AI-translator objection without anti-AI messaging.
- Added teacher marketing weekly rhythm while preserving platform-controlled pricing, tracked attribution, claim review, and no off-platform selling.
- Added `/api/v135/global-first-class-success` and `scripts/verify-v135-global-first-class.js`.

## Preserved
- v1.34 universal calendar interop and `.ics` endpoint.
- v1.33 global access classroom stack.
- v1.32 ChatGPT/OpenAI-only SmartTeacher AI vendor policy.
- v1.31 built-in teacher classroom tools.
- Production backend scaffolding, safe deployment checks, no live secrets in ZIP, and non-destructive deployment rules.

## Production note
Live credentials are still expected to be provided through environment variables only. Google Calendar/Meet and Zoom remain optional provider integrations, not launch blockers. No destructive migrations were added.

# EnglishLegalese Platform v1.30.0 — SmartTeacher AI Brand Lock + Seamless Role Flow

This pass preserves v1.29.0 and adds a focused layer around the official SmartTeacher AI brand, simpler role paths, one connected learning/session record, classroom/calendar/video readiness, teacher marketing guardrails, employer proposal language, and owner/staff blocker queues.

Key additions:
- SmartTeacher AI is now explicitly treated as the official AI practice teacher for Legal English performance training in the AI era.
- Added the product line: “Practice with SmartTeacher AI. Improve with live teachers. Prove progress safely.”
- Added role-specific next-action flow for students, teachers, employers, and owner/staff.
- Added a unified operating record from diagnostic to AI practice, lesson folder, teacher review, class, report, certificate, credit, payout, and renewal/top-up.
- Added classroom readiness copy for time zones, Google Meet default, Zoom alternate, recording consent, saved work, homework, exams, reports, credits, and payouts.
- Added weekly teacher marketing rhythm with approval and attribution guardrails.
- Added employer proposal language that explains team ROI and privacy-safe reporting without charging university-level prices.
- Added owner/staff blocker queue language for payment, teacher match, calendar/video, confidentiality, teacher review, reports, certificates, payouts, renewals, and campaign approvals.
- Added `/api/v130/smartteacher-flow` and `scripts/verify-v130-smartteacher-flow.js`.

Preservation notes:
- v1.29 university benchmark pricing and course catalog remain intact.
- v1.28, v1.27, v1.26, v1.25, and prior production/backend endpoints remain available.
- No destructive migrations were added.
- No live credentials or secrets were added.

# EnglishLegalese Platform v1.27.0 — AI-Era Simplicity + Conversion Flow

This version preserves v1.26.0 and adds a focused simplicity pass for messaging, dashboards, role journeys, classroom/calendar/video readiness, teacher marketing, employer-safe reports, staff operations, SmartTeacher prompts, and mobile usability.

## Added / improved in v1.27.0

- Added a clearer four-role start layer for Students, Employers, Teachers, and Owner/Staff.
- Strengthened the direct homepage answer to “Why learn Legal English when AI can translate?”
- Added a unified session spine that connects goal, safe AI practice, lesson folder, teacher review, calendar/video class, closeout, reports, certificates, credits, payout, and renewal/top-up.
- Simplified student, teacher, employer, and owner/admin dashboards around one obvious next best action.
- Added classroom/calendar/video readiness copy for before class, during class, after class, and recording consent.
- Added AI tutor and AI teaching-assistant prompt examples that reinforce confidentiality, teacher review, employer-safe reporting, and no-legal-advice boundaries.
- Refined the teacher marketing toolkit with approved social, WhatsApp/DM, employer email, short video, LL.M., and lunch-and-learn copy.
- Refined employer reporting language around AI translator safety, professional tone, meeting confidence, document fluency, privacy-safe reporting, and renewal signals.
- Added an owner/staff command center organized around revenue, classroom, trust, teacher review, reports, marketing, certificates, payouts, and production readiness blockers.
- Added a mobile simplicity rail for Start, Practice, Schedule, Class, Review, and Report.
- Added `/api/v127/simplicity-flow` and `scripts/verify-v127-simplicity-flow.js`.
- Preserved `/api/v126/integrated-product-flow` and the v1.26 verification script.

## Preserved in v1.27.0

- No destructive rebuild was performed.
- Existing v1.26.0 functionality remains intact.
- Existing migrations 001–008 remain intact and non-destructive.
- Existing production scaffolding remains intact: authentication, role permissions, Stripe checkout/webhook routes, S3-compatible upload route, Google Calendar/Meet class-session route, Zoom route, SMTP email route, server-generated PDF report route, server-side SmartTeacher AI route, production readiness endpoint, launch readiness, live integration verification, owner bootstrap, deployment records, backup checkpoints, and integration health checks.
- Existing student, teacher, employer, staff/admin, owner/operator, classroom, calendar/video, saved work, homework, exams, reports, certificates, payment, upload, AI, teacher marketing, dashboard, and production-readiness workflows were preserved and enhanced.
- Platform-controlled pricing and internal teacher payout logic were preserved.
- No live secrets were added to the ZIP.

## Known limitations

- External services still require live environment variables and account-owned credentials.
- Google Meet, Zoom, Stripe, SMTP, OpenAI, and object storage should remain placeholder/blocker-aware until credentials are configured and verified.
- The front-end remains a prototype-style SPA with production backend scaffolding; live production still requires staged deployment, smoke testing, and real data-store configuration.

---

# EnglishLegalese Platform v1.26.0 — AI-Era Integrated Product Flow

This version preserves the v1.25.0 AI-era operating flow and makes the platform easier to understand, market, teach, report, and operate.

## Added / improved

- New AI-era integrated product journey near the top of the homepage.
- Stronger hero message: “Legal English training for the AI era.”
- Clearer submessage: AI can translate words, but EnglishLegalese trains the skills around the words.
- New continuity section showing how SmartTeacher AI practice moves into lesson folders, teacher review, homework, assessments, reports, certificates, employer-safe summaries, credits, payouts, and renewals.
- New teacher marketing copy center with approved LinkedIn, WhatsApp/DM, employer email, LL.M. outreach, and lunch-and-learn language.
- Improved mobile/tablet next-action rail for student, teacher, employer, and staff workflows.
- New trust microcopy section that uses clean notices instead of fake button-like badges.
- Improved student dashboard language around safe AI practice, teacher review, and lesson folder use.
- Improved teacher dashboard language around reviewing AI practice, assigning translation-risk homework, and teaching judgment beyond translation.
- Improved employer dashboard language around privacy-safe ROI, AI translator safety, tone, meeting confidence, and recommended next training.
- Improved owner/admin dashboard language around trust, revenue, data safety, production readiness, and AI-era blockers.
- Expanded SmartTeacher AI fallback answers for translation safety, confidentiality/upload warnings, teacher-review handoffs, and employer-safe reporting.
- Added `/api/v126/integrated-product-flow` as a production-safe brief endpoint that aggregates existing v1.25 pathway, teacher-review, employer ROI, and confidentiality records.
- Added `scripts/verify-v126-integrated-flow.js` and wired it into `npm run check` and `npm run ops:verify`.
- Updated README, release notes, deployment notes, production backend notes, and safe deployment checklist for v1.26.0.

## Preserved

- No destructive rebuild was performed.
- Existing v1.25.0 functionality remains intact.
- Existing migrations 001–008 remain intact and non-destructive.
- Existing production scaffolding remains intact: authentication, role permissions, Stripe checkout/webhook routes, S3-compatible upload route, Google Calendar/Meet class-session route, Zoom route, SMTP email route, server-generated PDF report route, server-side SmartTeacher AI route, production readiness endpoint, launch readiness, live integration verification, owner bootstrap, deployment records, backup checkpoints, and integration health checks.
- Existing student, teacher, employer, staff/admin, owner/operator, classroom, calendar/video, saved work, homework, exams, reports, certificates, payment, upload, AI, teacher marketing, and dashboard workflows were preserved and enhanced.
- Platform-controlled pricing and internal teacher payout logic were preserved.
- No live secrets were added to the ZIP.

## Known limitations

- External services still require live environment variables and account-owned credentials.
- Google Meet, Zoom, Stripe, SMTP, OpenAI, and object storage should remain placeholder/blocker-aware until credentials are configured and verified.
- The front-end remains a prototype-style SPA with production backend scaffolding; live production still requires a careful staged deploy, smoke testing, and real data-store configuration.

## v1.28.0 — University Benchmark Pricing + Curriculum Pass

This pass uses current U.S. law-school and LL.M. pricing as a benchmark while preserving EnglishLegalese as affordable premium Legal English performance training for the AI era.

### Added
- University benchmark pricing section comparing EnglishLegalese against major U.S. law-school/LL.M. cost bands.
- Recommended pricing ladder for diagnostic, SmartTeacher AI, assessment lessons, private packages, cohorts, LL.M.-readiness sprints, and employer credits.
- New curriculum benchmark section adapting useful law-school concepts into shorter practical modules: U.S. legal system readiness, case reading, legal writing language, contracts, meetings, TOLES-style prep, and AI Translator Safety Lab.
- New employer value section explaining why employers should buy measurable team training instead of academic prestige.
- New copy blocks for individual learners, employers, and teachers.
- New API endpoint: `/api/v128/benchmark-pricing`.
- New verification script: `scripts/verify-v128-benchmark-pricing.js`.

### Preserved
- All v1.27 simplicity/conversion flow features.
- All v1.26 integrated-product-flow features.
- Existing production backend scaffolding, migrations, safe deployment checks, and no-secret rules.
- Platform-controlled pricing and internal teacher payout logic.

### Pricing strategy note
EnglishLegalese should remain dramatically below university pricing while still feeling premium. Core individual offers should remain in the free-to-under-$1,000 range where possible, with optional structured cohorts or LL.M.-readiness sprints in the hundreds to low-thousands range.


## v1.29.0 — University Benchmark Integration + Course Catalog

This pass turns the competitor/university benchmark research into more concrete platform assets. It preserves the v1.28 pricing benchmark layer and adds a practical implementation layer for package design, curriculum, employer ROI, teacher marketing, SmartTeacher AI answers, and staff/owner benchmark guidance.

### Added
- New university benchmark integration section that uses Columbia, Harvard, NYU, Georgetown, and major LL.M. programs as credibility/curriculum benchmarks, not as price targets.
- New concrete offer ladder: free diagnostic, SmartTeacher AI, assessment lesson, foundations cohort, LL.M. readiness sprint, professional intensive, and employer credit packages.
- New course catalog: U.S. Legal System Readiness, Case Reading + Class Discussion, Legal Writing + Professional Email, Contracts + Business Documents, Meetings/Negotiations/Client Calls, TOLES-style Practical Legal English, and AI Translator Safety Lab.
- New employer ROI comparison showing how team training can be positioned as far below university-level cost while still delivering practical reports and measurable progress.
- New teacher marketing scripts for LinkedIn, employer outreach, LL.M. student outreach, and WhatsApp/DM.
- New buyer FAQ language answering university-comparison and AI-translator objections in plain English.
- New SmartTeacher AI answers for Columbia/Harvard/NYU/Georgetown, university pricing, LL.M. prep, course catalog, TOLES-style training, and practical Legal English positioning.
- New API endpoint: `/api/v129/university-benchmark-integration`.
- New verification script: `scripts/verify-v129-university-integration.js`.

### Preserved
- All prior v1.28 benchmark pricing and curriculum flow.
- All v1.27 simplicity, classroom, dashboard, teacher-marketing, employer-report, and mobile UX improvements.
- All v1.26 integrated product flow and production backend safeguards.
- Platform-controlled pricing and internal teacher payout rules.
- Safe deployment and no-secrets/no-destructive-migrations rules.

### Pricing position
EnglishLegalese should remain an affordable premium platform. It should be dramatically below university LL.M. or law-school pricing, while still avoiding a cheap generic ESL feel. Core individual offers should remain in the free-to-under-$1,000 path where possible, with structured cohorts and LL.M.-readiness/professional intensives in the hundreds to low-thousands range.



# EnglishLegalese Platform v1.31.0 — Built-In Teacher Classroom Tools

## Purpose

v1.31.0 continues from v1.30.0 and focuses on the most useful missing operational layer: built-in teaching tools for live online classrooms. This is a preservation-focused improvement pass, not a rebuild.

## Added

- Built-in teacher classroom tools section.
- Online class teaching console: prepare, teach, close out.
- SmartTeacher AI co-teacher prompt library for teachers.
- Agenda Builder.
- Live Correction Pad.
- Roleplay Launcher.
- AI Translation Risk Lens.
- Vocabulary and Clause Bank.
- Homework Generator.
- Closeout Checklist.
- Privacy Visibility Switch.
- Dashboard integration language for students, teachers, employers, and owner/staff.
- Mobile/tablet teaching tool guidance.
- `/api/v131/teacher-classroom-tools`.
- `scripts/verify-v131-teacher-classroom-tools.js`.

## Preserved

- SmartTeacher AI official brand positioning.
- AI-era Legal English positioning.
- University benchmark pricing strategy.
- Course catalog and offer ladder.
- Student, teacher, employer, staff/admin, and owner/operator flows.
- Calendar, Google Meet, Zoom, classroom, homework, reports, certificate, payment, credit, payout, and production-readiness scaffolding.
- Safe deployment rules and no-data-loss rules.

## Boundary language

Teacher classroom tools support education, Legal English practice, teacher preparation, and reporting only. They do not provide legal advice, certified translation, court interpretation, contract review, filing decisions, or final legal meaning.

## Validation target

Run:

`npm run check`

This includes the v1.31.0 verification script.


# EnglishLegalese Platform v1.32.0 — ChatGPT-Only SmartTeacher AI

v1.32.0 continues from v1.31.0 and focuses on a useful simplification: SmartTeacher AI and all related AI tutor, AI teaching-assistant, classroom, employer-report, staff, and marketing-assistant modes are governed as **ChatGPT/OpenAI-only** features. This reduces launch complexity, vendor confusion, support burden, privacy review complexity, and messaging risk.

## Added

- ChatGPT/OpenAI-only SmartTeacher AI policy.
- One AI vendor / one server-side `OPENAI_API_KEY` operating model.
- Optional `SMARTTEACHER_MODEL` model-name setting without adding a second vendor.
- New homepage and classroom sections explaining the ChatGPT-only policy.
- Role-specific AI governance language for students, teachers, employers, and owner/staff.
- Teacher classroom AI controls tied to the existing v1.31 teaching tools.
- Owner/staff AI operations checklist for launch readiness and support.
- New endpoint: `/api/v132/chatgpt-only-smartteacher`.
- New verification script: `scripts/verify-v132-chatgpt-only.js`.

## Preserved

- v1.31 built-in teacher classroom tools.
- SmartTeacher AI brand lock.
- University benchmark pricing and course catalog.
- AI-translator objection handling.
- Student, teacher, employer, owner/staff dashboard direction.
- Calendar, Google Meet default, Zoom alternate, classroom closeout, reports, certificates, credits, payouts, teacher marketing, and production readiness scaffolding.

## Safety and trust

SmartTeacher AI remains Legal English training only. It does not provide legal advice, certified translation, court interpretation, legal strategy, representation, or final legal meaning. Users should not paste confidential, privileged, sensitive, or client-identifying information unless platform policy allows it and they have authority.

## v1.33.0 — Global Access Classroom Stack

- Made EnglishLegalese internal calendar/class-session records the required source of truth.
- Reframed Google Calendar/Meet as optional provider integrations, not global launch dependencies.
- Added China-accessible classroom planning for Tencent Meeting / VooV Meeting and DingTalk.
- Kept Zoom and Microsoft Teams as selectable provider options.
- Required manual classroom-link fallback so staff can paste an approved regional link into any class record.
- Preserved ChatGPT/OpenAI-only SmartTeacher AI governance.
- Added `/api/v133/global-access-classrooms` and `scripts/verify-v133-global-access.js`.



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


## v1.40.0 — Workflow Proof Layer

- Added interactive lesson-folder, teacher-review handoff, homework-from-review, and employer-safe report generation flows.
- Strengthened student dashboards around practice → save → review → class → progress proof.
- Strengthened teacher dashboards around reviewing saved AI practice, assigning homework from review, and preserving teacher judgment.
- Strengthened employer dashboards around privacy-safe progress reports that exclude private drafts, raw AI practice, raw native-language explanations, sensitive uploads, and teacher-private notes by default.
- Added `/api/v140/workflow-proof-layer`, `/api/v140/workflow-records`, `/api/v140/smartteacher/lesson-folder`, and `/api/v140/employer-safe-reports`.
- Preserved all v1.39.0 functionality, SmartTeacher AI ChatGPT/OpenAI-only policy, Translation Bridge learning boundaries, global calendar/classroom fallbacks, no-live-secrets rule, and additive/no-data-loss deployment rules.


## v1.41.0 — Major-Language Bridge + Classroom Command

- Added a major-language Translation Bridge layer for roughly the top 100+ widely used world languages, with honest staff/teacher routing for rare, low-confidence, sensitive, or high-stakes language requests.
- Strengthened the product flow so language help does not become generic translation: Simple English first, explain in the learner's selected language only enough to get unstuck, show side-by-side Legal English/plain meaning/native-language explanation, save to lesson folder, ask teacher when needed, and return to Legal English performance.
- Added language-aware student, teacher, employer, and owner/staff dashboard panels.
- Added teacher classroom command tools for learner language cards, side-by-side correction pads, AI translation-risk lens, roleplay launcher, homework handoff, closeout proof, and employer-safe summary drafting.
- Added privacy-safe employer language summaries that exclude raw native-language explanations, private drafts, raw SmartTeacher AI text, sensitive uploads, and teacher-private notes by default.
- Added `/api/v141/major-language-bridge`, `/api/v141/language-options`, `/api/v141/language-support-requests`, and `/api/v141/employer-language-summaries`.
- Preserved all v1.40.0 Workflow Proof Layer functionality, SmartTeacher AI ChatGPT/OpenAI-only policy, global calendar/classroom fallbacks, platform-controlled pricing, no-live-secrets rule, and additive/no-data-loss deployment rules.

## v1.42.0 — Continuity Command Center

- Added the Continuity Command Center to make the platform feel more seamless for students, teachers, employers, staff/admin, and owner/operator users.
- Connected SmartTeacher AI practice, major-language Translation Bridge support, lesson-folder saving, teacher-review handoffs, classroom closeout, homework, employer-safe reporting, and deployment preservation into one proof flow.
- Improved teacher online-classroom support with a before/during/after command model.
- Improved teacher marketing toolkit governance with approved-copy, tracked-link, QR, and staff claim-review guardrails.
- Added employer-safe continuity report workflow and privacy language.
- Added explicit no-data-loss preservation language for work, progress, calendars, payment information, reports, certificates, and test scores.
- Added v1.42 backend endpoints and verification script.
- Preserved SmartTeacher AI as ChatGPT/OpenAI-only, Translation Bridge as learning support, Google as optional, and all prior v1.41/v1.40/v1.39/v1.38/v1.37 systems.


## v1.43.0 — Course Placement + Ordered Curriculum

- Added v1.43 course placement and ordered curriculum layer.
- Added Beginner, Novice, Intermediate, Advanced, and Expert placement levels with CEFR-style ranges and plain-language purpose.
- Added full course catalog covering diagnostic placement, foundations, vocabulary, AI Translator Safety Lab, legal email/writing, contracts, meetings/client calls, workplace English, advanced writing/contracts/negotiation, LL.M./law-school readiness, U.S. legal-system vocabulary, TOLES-style practical Legal English, expert executive performance, and professional-area modules.
- Added ordered lesson sequences for every catalog course.
- Added dashboard panels for student path, teacher course planner, employer curriculum view, and owner/staff curriculum operations.
- Added SmartTeacher responses for placement, courses, curriculum, and lesson sequencing.
- Added backend endpoints for course catalog, placement assessment, learning-path enrollment, lesson-plan handoff, and employer-safe curriculum reports.
- Preserved no-data-loss rules and did not add destructive migrations or live secrets.

## v1.44.0 — Four-Skills Voice + Reading/Writing Academy

- Added Four-Skills Academy language and UI for speaking, listening, reading, and writing.
- Added voice/spoken practice studio scaffolding with browser speech-capture support where available and manual fallback where not available.
- Added reading labs, writing workshops, listening/note-taking practice, and teacher-confirmed skill paths.
- Added v1.44 API routes for four-skills academy, skill course map, skill placement, voice practice, reading/writing workshops, and employer four-skills reports.
- Connected skill practice into existing lesson folders, teacher-review handoffs, homework, employer-safe reporting, Translation Bridge, and no-data-loss guardrails.
- Preserved SmartTeacher AI as ChatGPT/OpenAI-only and preserved Google-optional global access.

## EnglishLegalese Platform v1.46.0 — Live Skills Practice + Feedback Loop

This pass deepens the v1.45 Integrated Skills Studio with a simpler real-user loop for spoken, listening, reading, and writing practice. Students can choose a skill, choose a text/spoken/native-language bridge mode, save a practice packet, route it to teacher feedback, receive homework, and turn the work into employer-safe progress proof.

### Added

- New homepage/product layer: Live Skills Practice + Feedback Loop.
- New practice-packet workflow for speaking, listening, reading, writing, text practice, spoken English, native-language bridge support, listening notes, reading lab, and writing workshop.
- New teacher feedback loop that connects practice packets to teacher review, homework, live classroom usage, lesson folders, and progress proof.
- New employer-safe skills progress brief that excludes raw recordings, transcripts, private drafts, raw native-language explanations, sensitive uploads, test answers, and teacher-private notes by default.
- New no-data-loss skills preservation review covering practice packets, voice/spoken tasks, listening notes, reading scores, writing drafts, lesson folders, teacher feedback, homework, calendars, payments, credits, reports, certificates, test scores, teacher notes, employer records, uploads, audits, support history, and payouts.

### New routes

- `GET /api/v146/live-skills-feedback-loop`
- `GET /api/v146/workshop-series`
- `POST /api/v146/practice-packet`
- `POST /api/v146/teacher-feedback-loop`
- `POST /api/v146/employer-skills-progress-brief`
- `POST /api/v146/skill-data-preservation-review`

### Safety

No destructive migrations, no live secrets, no production data reset logic, and no change to the ChatGPT/OpenAI-only SmartTeacher AI rule. Translation Bridge and native-language speech support remain learning aids only, not legal advice, certified translation, court interpretation, or final legal meaning.


## v1.47.0 — Simplicity Command Pass

- Added the v1.47 Simplicity Command Pass to reduce the user experience to one clear role-first path.
- Simplified the header and mobile quick-start navigation while preserving older sections and deep functionality.
- Added dashboard command panels for students, teachers, employers, and owner/staff users.
- Added SmartTeacher AI response logic for simplicity, next actions, AI-translator objection handling, privacy, and data preservation.
- Added backend routes for role next-action plans, employer-safe privacy snapshots, and a data-continuity gate.
- Strengthened trust language around no-data-loss deployment, Google-optional scheduling, language-support boundaries, and employer privacy.
- Preserved all previous v1.46/v1.45/v1.44 skills, voice, reading, writing, listening, Translation Bridge, teacher-review, course-placement, employer reporting, and production safety systems.

## v1.49.0 — Intuitive UX Continuity Pass

- Added a restrained Intuitive UX Continuity Pass focused on clearer next steps for students, teachers, employers, and owner/staff users.
- Added role-first dashboard guidance so users see the most important action before deeper tools.
- Added staff UX blocker queue support for confusing flows that should be reviewed before they hurt conversion, trust, or operations.
- Added privacy-safe employer summary route that excludes private learner content by default.
- Added continuity risk check route that reinforces code-only deploys, additive migrations only when genuinely needed, and no destructive production-data actions.
- Preserved all prior v1.48/v1.47/v1.46/v1.45/v1.44/v1.43 systems, including SmartTeacher AI, Translation Bridge, major-language support, course placement, four-skills practice, teacher review, employer-safe reporting, calendar/video fallback, and no-data-loss rules.

## v1.50.0 — 100+ Language Learning Bridge Marketing + Onboarding Pass

- Added a prominent 100+ Language Learning Bridge section for marketing and onboarding.
- Added clear user-facing copy explaining what native/preferred-language support enables students to do on the platform.
- Added dashboard panels for students, teachers, employers, and owner/staff/admin users.
- Added SmartTeacher AI language-support response logic for questions about native languages, translation help, getting stuck, and the Translation Bridge.
- Added backend routes for the language-learning bridge, marketing summary, language onboarding plans, employer language readiness cards, and continuity preservation checks.
- Preserved all existing v1.49 functionality and all prior endpoints/checks.
- Added no-data-loss language for student work, lesson folders, homework, voice/spoken practice, listening notes, reading scores, writing drafts, SmartTeacher AI practice, Translation Bridge records, calendars, class links, payments, credits, reports, certificates, test scores, teacher notes, employer records, uploads, support history, audit logs, and payouts.


## v1.51.0 — Preferred-Language Page Selector + Explanation Bridge

- Added a preferred/native-language selector for page explanation support across key platform surfaces.
- Added clear user-facing positioning: users can read key pages with help in 100+ major languages, but the platform always guides them back to Legal English.
- Added side-by-side learning model for original Legal English, Simple English, preferred-language explanation, and Back to Legal English practice.
- Added student, teacher, employer, and owner/staff dashboard language panels.
- Added employer-safe language access summary rules that exclude raw page explanations, private drafts, native-language text, raw SmartTeacher AI content, recordings/transcripts, sensitive uploads, test answers, and teacher-private notes by default.
- Added v1.51 API routes and verifier.
- No destructive migrations and no live secrets were added.

## v1.52.0 — Three-Layer Language Access Strategy

This version builds the agreed language-access strategy into the platform without turning EnglishLegalese into a generic translation website.

### Added

- Prominent product promise: “Use EnglishLegalese in your preferred language when you need help — while you build real Legal English skills.”
- Clear anti-promise: do not say every page is perfectly translated into 100+ languages.
- Three language layers: core UI help, on-demand page explanations in 100+ major languages, and human-reviewed top-market marketing page planning.
- Student learning actions: Legal English version, Simple English, preferred-language explanation, Legal English practice, and teacher review.
- Staff/owner planning queue for human-reviewed marketing pages in top-market languages.
- Employer-safe language access logic that reports readiness/progress without exposing raw private native-language content.
- New no-data-loss continuity check for language settings, page explanations, human-review translation queues, calendars, payments, reports, certificates, test scores, teacher notes, employer records, uploads, audits, and payouts.

### Routes

- `/api/v152/three-layer-language-strategy`
- `/api/v152/core-ui-language-scope`
- `/api/v152/language-access-plan`
- `/api/v152/human-reviewed-marketing-page-plan`
- `/api/v152/language-strategy-continuity-check`

### Safety

No destructive migrations were added. No live secrets were added. The language system remains learning support, not certified translation, court interpretation, legal advice, final legal meaning, or a substitute for teacher/professional review.

## v1.53.0 — Role Clarity + Data Continuity Pass

This pass improves simplicity without adding unnecessary complexity. It keeps the current logo and all existing systems while making each user role easier to guide.

### Added

- Role clarity layer for student, teacher, employer, and owner/staff/admin next steps.
- Dashboard panels that put the next best action first.
- Staff data-continuity review route.
- Employer-safe role summary route.
- Deployment continuity gate that flags destructive actions and protects persistent data.
- Verification script: `scripts/verify-v153-role-clarity-continuity.js`.

### Preserved

- No destructive migrations.
- No live secrets.
- Existing logo and brand assets.
- SmartTeacher AI remains ChatGPT/OpenAI-only.
- Google remains optional.
- Translation Bridge remains learning support, not certified translation, court interpretation, legal advice, or final legal meaning.
- Employer reporting remains privacy-safe by default.

