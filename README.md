# EnglishLegalese Platform v1.54.0 — Public Launch Readiness Sprint

This version shifts from broad feature expansion to public-launch readiness. It adds a launch command center, production gate checks, controlled public beta rules, first-course lesson templates, teacher onboarding, diagnostic-to-course routing, end-to-end launch test planning, and no-data-loss launch safeguards.

Before real paid public use, configure real production environment variables for PostgreSQL, Stripe, OpenAI/SmartTeacher AI, SMTP email, object storage, and optional video/calendar vendors. Do not add live secrets to the ZIP.

# EnglishLegalese Platform v1.45.0 — Integrated Skills Studio

This version deepens the four-skills academy into one practical learning loop: placement, speaking/listening/reading/writing practice, native-language support when a learner is stuck, lesson-folder saving, teacher-review handoffs, homework, live classroom work, certificates/progress proof, employer-safe reporting, and no-data-loss deployment preservation.

The platform continues to answer the AI-translator objection directly: AI can translate words, but legal and business professionals still need speaking confidence, listening accuracy, reading judgment, writing clarity, professional tone, confidentiality awareness, and the ability to review AI output safely. EnglishLegalese remains Legal English training for the AI era, not generic English lessons, legal advice, certified translation, court interpretation, or final legal meaning.

New v1.45 routes include `/api/v145/integrated-skills-studio`, `/api/v145/skills-course-sequence`, `/api/v145/placement-skill-routing`, `/api/v145/speaking-listening-session`, `/api/v145/reading-writing-session`, `/api/v145/teacher-classroom-tool-action`, `/api/v145/employer-integrated-skills-report`, and `/api/v145/no-data-loss-skill-check`.

# EnglishLegalese Platform v1.39.0 — Seamless Learning Operations

EnglishLegalese is Legal English performance training for the AI era. This version preserves v1.38.0 AI-Era Action Layer and adds a simpler integrated operations layer for students, teachers, employers, staff/admin, and owner/operator users.

Core message: **AI can translate words. EnglishLegalese helps people understand, explain, write, negotiate, review, speak, and work in Legal English with confidence — with SmartTeacher AI practice, live teachers, any-language help when stuck, and privacy-safe proof of progress.**

## v1.39.0 focus
- Preserve v1.38.0 AI-Era Action Layer, v1.37.0 Guided Help, v1.36.0 Translation Bridge/native-language support, global access, ChatGPT/OpenAI-only SmartTeacher AI, teacher classroom tools, employer reporting, production backend scaffolding, and safe deployment rules.
- Add a new Seamless Learning Operations layer near the top of the homepage.
- Make Translation Bridge more universal: users can request explanation in any preferred/native language when stuck, then return to Legal English practice.
- Add a teacher live cockpit model: before class, during class, and after class tools for online teaching without dashboard clutter.
- Add clearer role action rails for students, teachers, employers, staff/admin, and owner/operator users.
- Add an explicit no-data-loss deployment guardrail protecting work, calendars, payments, reports, certificates, scores, AI practice, Translation Bridge records, teacher notes, employer records, support/audit history, and payout records.
- Add `/api/v139/seamless-learning-operations` as a production-safe strategy endpoint.
- Add `scripts/verify-v139-seamless-learning-operations.js` and wire it into `npm run check` and `npm run ops:verify`.

## Preserved rules
- SmartTeacher AI remains ChatGPT/OpenAI-only using `OPENAI_API_KEY` and optional `SMARTTEACHER_MODEL`.
- Translation Bridge is learning support in any preferred language, not certified translation, court interpretation, final legal meaning, or legal advice.
- EnglishLegalese internal class-session/calendar records remain the source of truth.
- Google Calendar/Meet remain optional; Zoom, Teams/Outlook, Tencent/VooV, DingTalk, ICS, Apple Calendar, regional/manual class links, and manual reminders remain fallback paths.
- Employer reports remain privacy-safe by default.
- Public pricing remains platform-controlled; teacher payout/bonus logic remains internal and review-based.
- No destructive migrations were added.
- No live secrets were added to the ZIP.

## Verification
Run:

```bash
npm run check
```

Or run the v1.39 verifier directly:

```bash
node scripts/verify-v139-seamless-learning-operations.js
```

# EnglishLegalese Platform v1.38.0 — AI-Era Action Layer

EnglishLegalese is Legal English performance training for the AI era. This version preserves v1.37.0 Guided Help + Readiness Navigator and adds a clearer AI-era action layer across the homepage, dashboards, mobile cards, classroom handoffs, SmartTeacher AI responses, Translation Bridge support, employer reporting, and staff/owner operating queues.

Core message: **AI can translate words. EnglishLegalese helps people understand, explain, write, negotiate, review, and work in Legal English with confidence.**

## v1.38.0 focus
- Preserve the latest v1.37.0 guided help, native-language support, global access, ChatGPT-only SmartTeacher AI, teacher classroom tools, employer reporting, production backend scaffolding, and safe deployment rules.
- Add a new AI-Era Action Layer near the top of the homepage.
- Make the student proof loop clearer: choose goal, practice safely, get unstuck, bring work to class, close out proof.
- Add role operating lanes for students, teachers, employers, and staff/owner users.
- Add privacy/trust microcopy for AI screens, Translation Bridge, uploads, employer reports, and global classrooms.
- Add mobile/tablet action cards so small screens show the next step without clutter or horizontal scrolling.
- Add dashboard next-action rails without removing the existing role dashboards.
- Add `/api/v138/ai-era-action-layer` as a production-safe strategy endpoint.
- Add `scripts/verify-v138-ai-era-action-layer.js` and wire it into `npm run check` and `npm run ops:verify`.

## Preserved rules
- SmartTeacher AI remains ChatGPT/OpenAI-only using `OPENAI_API_KEY` and optional `SMARTTEACHER_MODEL`.
- Translation Bridge is a learning bridge back to Legal English, not certified translation, court interpretation, final legal meaning, or legal advice.
- EnglishLegalese internal class-session/calendar records remain the source of truth.
- Google Calendar/Meet remain optional; Zoom, Teams/Outlook, Tencent/VooV, DingTalk, ICS, Apple Calendar, regional/manual class links, and manual reminders remain fallback paths.
- Employer reports remain privacy-safe by default.
- Public pricing remains platform-controlled; teacher payout/bonus logic remains internal and review-based.
- No destructive migrations were added.
- No live secrets were added to the ZIP.

## Verification
Run:

```bash
npm run check
```

Or run the v1.38 verifier directly:

```bash
node scripts/verify-v138-ai-era-action-layer.js
```

# EnglishLegalese Platform v1.35.0 — Global First-Class Success + Seamless Role Flow

EnglishLegalese is Legal English training for the AI era. This build keeps SmartTeacher AI as ChatGPT/OpenAI-only while making live online classes easier to schedule, join, teach, close out, report, and renew for users around the world.

## v1.35.0 focus
- EnglishLegalese internal calendar and class-session record remain the source of truth.
- External video/calendar systems are adapters, not dependencies.
- Google Calendar/Meet are optional where accessible.
- Zoom, Teams, Tencent/VooV, DingTalk, ICS, Outlook, Apple Calendar, regional reminders, and manual links/reminders remain available as appropriate.
- Teacher tools are built into the online classroom flow, not treated as disconnected notes.
- Every dashboard should show one clear next action.
- SmartTeacher AI continues to answer the AI-translator objection: AI can translate words, but professionals still need judgment, context, confidentiality awareness, professional tone, speaking confidence, writing skill, document fluency, and safe AI-output review.

## New endpoint
- `/api/v135/global-first-class-success`

## Verification
Run:

```bash
npm run check
```

Or run the v1.35 verifier directly:

```bash
node scripts/verify-v135-global-first-class.js
```

# EnglishLegalese Platform v1.30.0

EnglishLegalese is Legal English training for the AI era. v1.30.0 strengthens SmartTeacher AI as the official AI practice teacher while preserving the lower-than-university pricing strategy, course catalog, production backend scaffolding, dashboards, classroom/calendar/video flows, teacher marketing tools, employer reports, and owner/staff operations.

Core line: **Practice with SmartTeacher AI. Improve with live teachers. Prove progress safely.**

The v1.30.0 pass adds a clearer workflow: choose role and goal, practice safely with SmartTeacher AI, save useful work to the lesson folder, send important language to teacher review, schedule Google Meet or Zoom, close out the class, update reports/certificates/credits/payouts, and trigger renewal or top-up recommendations.

# EnglishLegalese.com Platform v1.27.0

EnglishLegalese is Legal English performance training for the AI era. The platform is not generic English learning and not simple translation.

AI can translate words, but legal and business professionals still need judgment, context, confidentiality awareness, professional tone, speaking confidence, writing skill, document fluency, negotiation ability, and the ability to review AI output safely.

## v1.27.0 focus

This pass preserves v1.26.0 and adds a simplicity/conversion layer so the AI-era product journey is clearer, easier to operate, and easier to understand on mobile:

- Stronger hero positioning: Legal English training for the AI era.
- Clearer answer to “why not just use AI translation?”
- Integrated role journey for students, teachers, employers, staff/admin, and owner/operator.
- Continuity from SmartTeacher AI practice to lesson folder, teacher review, homework, assessment, report, certificate, credit, payout, and renewal.
- Teacher marketing copy center with approved AI-era outreach language.
- Employer privacy/ROI language that explains value beyond AI translation without exposing private drafts by default.
- Mobile/tablet next-action rail so each role sees one obvious next step.
- Trust microcopy near AI, uploads, employer reports, and teacher review.
- v1.27 simplicity brief endpoint at `/api/v127/simplicity-flow` while preserving `/api/v126/integrated-product-flow`.
- Verification script at `scripts/verify-v127-simplicity-flow.js`, with the v1.26 verification preserved.

## Preserved from v1.25.0

The v1.25.0 AI-era operating flow remains intact:

- Practice with SmartTeacher AI.
- Save work to the lesson folder.
- Ask a teacher to review important language.
- Use teacher feedback in live class, homework, assessments, reports, and certificates.
- Give employers privacy-safe ROI reports.
- Keep staff focused on revenue, trust, privacy, teacher review, marketing approvals, and completion.

All existing dashboards, production backend scaffolding, auth/payment/upload/report/calendar-video/AI routes, safe deployment rules, classroom tools, teacher marketing toolkit, platform-controlled pricing, and data persistence architecture were preserved and enhanced.

## Run locally

```bash
npm install
npm start
```

## Verify before deploy

```bash
npm run check
npm run predeploy:check
npm run prod:readiness
npm run live:verify
npm run ops:verify
```

## Important production note

Live production still requires real environment variables for PostgreSQL, Stripe, object storage, Google/Zoom, SMTP/email, OpenAI, production URL, and session security. No secrets are embedded in this ZIP.

Production deployments must be code-only and must never wipe live users, classrooms, homework, exams, reports, certificates, payments, credit ledger, teacher payouts, employer records, uploads, calendar/video data, AI practice history, support threads, or audit logs.


## v1.27.0 additions

- New four-role start layer: Student, Employer, Teacher, and Owner/Staff.
- Stronger direct answer to the AI-translator objection near the top of the homepage.
- Clearer session spine: goal, safe AI practice, lesson folder, teacher review, calendar/video classroom, closeout, reports, certificates, credits, payouts, and renewal/top-up.
- Simpler dashboards focused on one next best action for each role.
- Dedicated classroom/calendar/video readiness section: before class, during class, after class, and recording consent.
- Refined teacher marketing toolkit with approved LinkedIn, WhatsApp/DM, employer email, short video, LL.M. outreach, and lunch-and-learn copy.
- Refined employer reporting model showing ROI without private learner drafts by default.
- Owner/staff command center organized around blockers: revenue, classroom, trust, teacher review, reports, marketing, certificates, payouts, and production readiness.
- Mobile simplicity rail for Start, Practice, Schedule, Class, Review, and Report.
- Expanded SmartTeacher AI responses for AI-translator objection, classroom/video flow, teacher marketing, and employer-safe reporting.

## v1.27.0 endpoint

`GET /api/v127/simplicity-flow` returns a production-safe operating brief for the new simplicity layer and aggregates the existing v1.25/v1.26 AI-era pathway, teacher-review, employer ROI, and confidentiality records.

## v1.28.0 University Benchmark Pricing + Curriculum Pass

v1.28.0 adds a university-benchmark pricing and curriculum layer. The platform now directly explains that major law schools and LL.M. programs can cost tens of thousands of dollars, while EnglishLegalese is designed as a lower-cost, modular, online/hybrid Legal English performance-training platform for the AI era.

New public/product concepts include:

- Free diagnostic and low-friction assessment path.
- SmartTeacher AI practice subscription.
- Private packages kept below university-style pricing.
- Group Legal English Foundations cohort.
- LL.M. / U.S. Law Readiness Sprint.
- Professional Legal English Intensive.
- Employer team credits and privacy-safe ROI reporting.

The platform remains education and communication training only. It is not a law school, LL.M., legal service, certified translation provider, court interpreter, or legal-advice provider.


## v1.29.0 — University Benchmark Integration + Course Catalog

v1.29.0 adds the concrete implementation layer for the university benchmark strategy. EnglishLegalese now explains more clearly that Columbia, Harvard, NYU, Georgetown, and major U.S. LL.M. programs are benchmarks for credibility and curriculum rigor, not price targets. The platform should stay lower-cost, practical, modular, teacher-reviewed, AI-supported, and focused on Legal English performance for the AI era.

### v1.29 additions
- Benchmark integration section.
- Concrete offer ladder and recommended price bands.
- Practical course catalog inspired by law-school and legal-English needs.
- Employer ROI comparison language.
- Approved teacher marketing scripts.
- Buyer FAQ for university-price and AI-translation objections.
- SmartTeacher AI answers for university comparison and course/pricing questions.
- `/api/v129/university-benchmark-integration`.
- `scripts/verify-v129-university-integration.js`.

### Strategic rule
Do not charge like a university. Borrow useful academic rigor, LL.M. readiness patterns, case-reading/class-discussion needs, legal-writing focus, and TOLES-style practical skill framing, but deliver it through shorter, more affordable, more practical EnglishLegalese modules.



## v1.31.0 — Built-In Teacher Classroom Tools

This pass preserves the v1.30.0 SmartTeacher AI brand lock and adds a practical live-teacher classroom layer. The goal is not more complexity; it is to give teachers one simple online teaching console while they teach.

New v1.31.0 classroom tools:

- Agenda Builder for 45- or 60-minute Legal English lessons.
- Live Correction Pad for better wording, tone, pronunciation, vocabulary, and professional phrasing.
- Roleplay Launcher for client calls, meetings, negotiations, interviews, contract explanations, and LL.M. class discussion.
- AI Translation Risk Lens for comparing rough translation, AI output, and professional Legal English.
- Vocabulary and Clause Bank tied to lesson folders, homework, AI drills, and reports.
- Homework Generator that converts class notes into teacher-approved assignments.
- Closeout Checklist for attendance, reviewed work, homework, report notes, credit deduction, payout dependency, and next recommendation.
- Privacy Visibility Switch for student-private, teacher-private, employer-safe, and staff-only notes.

SmartTeacher AI remains the official EnglishLegalese AI practice teacher and now also acts as a teacher-controlled classroom assistant. Teachers can use it for prompt ideas, vocabulary, roleplays, homework drafts, and employer-safe report drafts, but live teacher judgment controls what students see and what becomes part of the official learning record.

EnglishLegalese remains Legal English training for the AI era: AI can translate words, but professionals still need judgment, context, confidentiality awareness, professional tone, speaking confidence, writing skill, document fluency, and safe AI-output review.

New endpoint: `/api/v131/teacher-classroom-tools`.
New verification script: `scripts/verify-v131-teacher-classroom-tools.js`.


## v1.32.0 — ChatGPT-Only SmartTeacher AI

This pass locks SmartTeacher AI to **ChatGPT/OpenAI only**. The platform should use one AI vendor and one server-side API key for SmartTeacher AI and related AI tutor, AI teaching-assistant, employer-report, staff, classroom, and marketing-assistant flows.

New v1.32.0 additions:

- ChatGPT/OpenAI-only SmartTeacher AI policy.
- One required AI secret: `OPENAI_API_KEY`.
- Optional model-name setting: `SMARTTEACHER_MODEL`.
- No Gemini, Claude, Grok, Anthropic, xAI, Google AI, or other AI vendor keys for SmartTeacher AI.
- Role-specific user-facing language for students, teachers, employers, and owner/staff.
- Classroom AI controls that keep the teacher in control.
- Owner/staff AI operations checklist.
- New endpoint: `/api/v132/chatgpt-only-smartteacher`.
- New verification script: `scripts/verify-v132-chatgpt-only.js`.

Product rule: users see **SmartTeacher AI** as the product name. Trust/support copy can explain that SmartTeacher AI is powered by ChatGPT/OpenAI.

## v1.33.0 — Global Access Classroom Stack

EnglishLegalese now treats the internal EnglishLegalese calendar and class-session record as the source of truth. Google Calendar and Google Meet are useful integrations where they are accessible, but they are no longer required dependencies for global use.

The platform should support students, teachers, employers, and staff around the world by allowing each class to attach an appropriate provider link:

- Google Meet / Google Calendar where accessible.
- Zoom where appropriate.
- Microsoft Teams / Outlook for corporate/employer clients.
- Tencent Meeting / VooV Meeting for China-accessible classes.
- DingTalk for China-accessible enterprise or school classes.
- Manual classroom links as a required fallback so staff can paste any approved regional class link into the EnglishLegalese class record.

SmartTeacher AI remains ChatGPT/OpenAI only. Do not add a Google AI/Gemini key just because Google Meet or Calendar may be used.



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

This pass deepens the actual workflows behind the v1.38/v1.39 action rails without replacing the platform. It adds a visible proof loop: SmartTeacher AI practice can be saved into a lesson folder, routed to a teacher-review handoff, converted into homework after teacher review, and summarized for employers through privacy-safe reporting.

Key preservation rule: production data must remain outside the deployable ZIP in persistent PostgreSQL and secure object storage. v1.40.0 does not add destructive migrations, live secrets, reset/drop/truncate commands, or a new AI vendor. SmartTeacher AI remains ChatGPT/OpenAI-only.

New/strengthened route: `/api/v140/workflow-proof-layer`.
New workflow endpoints: `/api/v140/workflow-records`, `/api/v140/smartteacher/lesson-folder`, and `/api/v140/employer-safe-reports`.


## v1.41.0 — Major-Language Bridge + Classroom Command

- Added a major-language Translation Bridge layer for roughly the top 100+ widely used world languages, with honest staff/teacher routing for rare, low-confidence, sensitive, or high-stakes language requests.
- Strengthened the product flow so language help does not become generic translation: Simple English first, explain in the learner's selected language only enough to get unstuck, show side-by-side Legal English/plain meaning/native-language explanation, save to lesson folder, ask teacher when needed, and return to Legal English performance.
- Added language-aware student, teacher, employer, and owner/staff dashboard panels.
- Added teacher classroom command tools for learner language cards, side-by-side correction pads, AI translation-risk lens, roleplay launcher, homework handoff, closeout proof, and employer-safe summary drafting.
- Added privacy-safe employer language summaries that exclude raw native-language explanations, private drafts, raw SmartTeacher AI text, sensitive uploads, and teacher-private notes by default.
- Added `/api/v141/major-language-bridge`, `/api/v141/language-options`, `/api/v141/language-support-requests`, and `/api/v141/employer-language-summaries`.
- Preserved all v1.40.0 Workflow Proof Layer functionality, SmartTeacher AI ChatGPT/OpenAI-only policy, global calendar/classroom fallbacks, platform-controlled pricing, no-live-secrets rule, and additive/no-data-loss deployment rules.

## v1.42.0 — Continuity Command Center

v1.42.0 deepens the connected product workflow instead of adding disconnected complexity. It adds a Continuity Command Center that links SmartTeacher AI practice, Translation Bridge support, lesson-folder saving, teacher-review handoffs, live classroom closeout, homework, employer-safe reporting, teacher marketing approval, and no-data-loss deployment rules.

### v1.42.0 additions

- Added homepage and dashboard Continuity Command Center panels.
- Added teacher classroom command flow for before class, during class, and after class.
- Added teacher marketing approval guardrails for social, WhatsApp, email, webinar, employer, and LL.M. outreach.
- Added employer-safe continuity report language that excludes private drafts, raw AI practice, raw native-language explanations, sensitive uploads, and teacher-private notes by default.
- Added `/api/v142/continuity-command-center`, `/api/v142/continuity-records`, `/api/v142/classroom-command-actions`, `/api/v142/teacher-marketing-approval`, `/api/v142/employer-safe-continuity-report`, and `/api/v142/deployment-preservation-check`.
- Added `scripts/verify-v142-continuity-command.js` and updated `npm run check` / `npm run ops:verify`.

### v1.42.0 preservation rule

This version is a code and workflow enhancement. It does not add destructive migrations, does not add live secrets, and does not weaken the production data-preservation rule. Student work, calendars, payment/credit data, teacher notes, employer reports, test scores, certificates, uploads, support records, and audit logs must survive deploys.


## v1.43.0 — Course Placement + Ordered Curriculum

v1.43.0 adds a curriculum/placement layer so EnglishLegalese can place students into Beginner, Novice, Intermediate, Advanced, or Expert paths after an AI-assisted and teacher-confirmed diagnostic. The course catalog now includes ordered courses with descriptions, lesson sequences, outputs, teacher handoffs, AI Translator Safety moments, Translation Bridge boundaries, and employer-safe reporting rules.

The purpose is simplicity: students should not see a random list of lessons. They should see a level, a recommended path, the next course, the next lesson, the teacher review step, and how progress becomes homework, reports, certificates, or employer-safe summaries.

Preserved rule: course placements, diagnostic scores, lesson folders, homework, classwork, reports, certificates, calendars, payments, credits, teacher notes, employer records, and test scores must survive deployments.

## v1.44.0 — Four-Skills Voice + Reading/Writing Academy

This pass adds a skill layer over the existing course placement and workflow proof system. EnglishLegalese now presents Legal English as speaking, listening, reading, and writing training, not only text chat or writing drills. The new layer supports spoken-English practice scaffolding, native-language spoken-support guidance, reading labs, writing workshops, listening/note-taking practice, teacher review handoffs, lesson-folder saving, homework starts, and employer-safe four-skills summaries.

The design rule remains the same: AI and Translation Bridge help learners practice and get unstuck, then return them to Legal English performance. SmartTeacher AI may suggest placement and practice, but human teachers confirm level, skill path, and progress where appropriate.

## v1.46.0 — Live Skills Practice + Feedback Loop

v1.46.0 makes the four-skills system easier to understand and operate. It adds a single loop: placement → choose skill → text or voice/native-language bridge mode → save practice packet → teacher feedback → homework/live-class use → employer-safe progress proof.

This reinforces the platform position: EnglishLegalese is Legal English training for the AI era, not generic English lessons or simple translation. AI can translate words, but students still need judgment, context, confidentiality awareness, tone, speaking confidence, listening comprehension, reading fluency, writing clarity, teacher feedback, and safe review of AI output.

New endpoints: `/api/v146/live-skills-feedback-loop`, `/api/v146/workshop-series`, `/api/v146/practice-packet`, `/api/v146/teacher-feedback-loop`, `/api/v146/employer-skills-progress-brief`, and `/api/v146/skill-data-preservation-review`.


## v1.47.0 — Simplicity Command Pass

This pass makes the platform easier to understand without removing the deeper systems already built. It adds a role-first Simplicity Command map so students, teachers, employers, and owner/staff users each see a clear next-action path instead of a cluttered feature list. The flow reinforces that EnglishLegalese is Legal English training for the AI era: AI can translate words, but professionals still need judgment, context, confidentiality awareness, tone, speaking confidence, reading comprehension, writing clarity, and safe AI-output review.

The pass preserves the v1.46 live skills feedback loop, v1.45 integrated skills studio, v1.44 four-skills academy, v1.43 course placement, v1.42 continuity command center, v1.41 major-language bridge, v1.40 workflow proof layer, and all earlier backend/production scaffolding. New API routes include `/api/v147/simplicity-command-pass`, `/api/v147/role-next-action-plan`, `/api/v147/data-continuity-gate`, and `/api/v147/employer-privacy-snapshot`.

## v1.48.0 — Usability Continuity Pass

- Adds a restrained usability pass focused on plain-language role paths for students, teachers, employers, and owner/staff users.
- Adds the `/api/v148/usability-continuity-pass`, `/api/v148/plain-language-user-path`, `/api/v148/continuity-preservation-audit`, and `/api/v148/employer-safe-progress-card` routes.
- Keeps EnglishLegalese positioned as Legal English training for the AI era, not generic English or simple translation.
- Strengthens the product-level promise that code deploys preserve user work, calendars, payments, credits, reports, certificates, test scores, teacher notes, employer records, uploads, audit history, and payouts.
- Keeps SmartTeacher AI ChatGPT/OpenAI-only, Google optional, employer reporting privacy-safe by default, and Translation Bridge/native-language support framed as learning support rather than certified translation, interpretation, legal advice, or final legal meaning.

## v1.49.0 — Intuitive UX Continuity Pass

This pass keeps the platform restrained and user-centered. It does not replace the existing v1.48 usability layer, v1.47 simplicity layer, v1.46 live skills loop, v1.45 integrated skills studio, v1.44 four-skills academy, v1.43 course placement, or earlier backend scaffolding. It adds a clearer first-screen UX layer so every role sees one next action before deeper platform details.

### What changed

- Added the Intuitive UX Continuity Pass section to the product flow.
- Added role-specific next paths for students, teachers, employers, and owner/staff users.
- Added dashboard panels that prioritize the next action first.
- Added staff UX blocker handling so confusing user flows can be turned into review tasks.
- Added a continuity risk check that reinforces code-only deploys, additive migrations only when genuinely needed, and no destructive production-data actions.
- Added privacy-safe employer summaries that keep private learner drafts, raw SmartTeacher AI text, raw native-language explanations, recordings, transcripts, sensitive uploads, test answers, and teacher-private notes excluded by default.

### New v1.49 API routes

- `GET /api/v149/intuitive-ux-continuity-pass`
- `POST /api/v149/user-flow-simplifier`
- `POST /api/v149/continuity-risk-check`
- `POST /api/v149/staff-ux-blocker-queue`
- `POST /api/v149/employer-safe-summary`

### Product boundary preserved

EnglishLegalese remains Legal English training for the AI era, not generic English lessons, simple translation, legal advice, certified translation, court interpretation, or final legal meaning. SmartTeacher AI remains ChatGPT/OpenAI-only. Google Calendar/Meet remain optional adapters, not dependencies. Translation Bridge/native-language support remains learning support that brings learners back to Legal English performance.

### Continuity preserved

Deployments must preserve student work, lesson folders, homework, voice/spoken practice, listening notes, reading scores, writing drafts, SmartTeacher AI practice, Translation Bridge records, calendars, class links, payments, credits, reports, certificates, test scores, teacher notes, employer records, uploads, support history, audit logs, and payouts.

## v1.50.0 — 100+ Language Learning Bridge Marketing + Onboarding Pass

v1.50.0 makes the language-support promise prominent and operational without turning EnglishLegalese into a generic translation product. The homepage and dashboards now tell users clearly: **Get unstuck in 100+ major languages — then return to Legal English.**

The pass explains what the 100+ Language Learning Bridge enables students to do: understand platform steps, SmartTeacher AI practice, homework, teacher feedback, scheduling, class links, billing, certificates, and support instructions in a preferred language when needed; use Simple English first; see Legal English, plain-English meaning, and native-language explanation side by side; save confusing items to lesson folders; ask teachers for review; and return to speaking, listening, reading, and writing Legal English.

The pass also adds employer-safe language readiness cards, teacher classroom language-card guidance, staff continuity checks, and boundaries that state this is learning support only — not legal advice, certified translation, court interpretation, or final legal meaning. Existing v1.49 UX, v1.46 skills practice, v1.43 placement, v1.41 major-language registry, Translation Bridge, SmartTeacher AI, dashboards, calendars, payments, reports, certificates, test scores, teacher notes, employer records, uploads, audit logs, and payouts remain preserved.


## v1.51.0 Preferred-Language Page Selector + Explanation Bridge

This version makes the 100+ Language Learning Bridge easier to understand as soon as users arrive. Students can choose a preferred explanation language, request Simple English or native-language help for key pages, see side-by-side learning support, save confusing items for teacher review, and return to Legal English speaking, listening, reading, and writing practice.

The feature is intentionally framed as learning support, not a promise that every page is a certified translation or final legal meaning. Rare, low-confidence, sensitive, court/certified, or high-stakes requests should route to teacher, staff, or qualified professional review.

New routes include `/api/v151/page-language-selector`, `/api/v151/page-language-options`, `/api/v151/preferred-language-setting`, `/api/v151/page-explanation-request`, `/api/v151/employer-language-access-summary`, and `/api/v151/page-language-continuity-check`.

## v1.52.0 Three-Layer Language Access Strategy

v1.52.0 makes the language-support promise clearer and safer across marketing, onboarding, dashboards, SmartTeacher AI, teacher tools, employer reporting, and operations.

Core promise: **Use EnglishLegalese in your preferred language when you need help — while you build real Legal English skills.**

The platform should not promise that every page is perfectly translated into 100+ languages. EnglishLegalese is Legal English training for the AI era, not a generic translation website.

### Three language layers

1. **Core platform UI help in major languages.** The most important navigation and platform instructions can be explained or translated: homepage hero, start/onboarding, login/dashboard labels, course placement instructions, SmartTeacher AI instructions, Translation Bridge instructions, scheduling/class links, billing/payment status, support instructions, trust/privacy notices, and “not legal advice / not certified translation” warnings.
2. **On-demand page explanation in 100+ major languages.** Users can ask to explain a page in their preferred language. The learning view keeps the original Legal English, shows Simple English, shows a preferred-language explanation when needed, and includes a Back to Legal English practice prompt.
3. **Human-reviewed translations for top-market marketing pages.** Over time, the most important marketing pages can receive reviewed versions for Spanish, Chinese, Arabic, French, Portuguese, Russian, Turkish, Hindi, Urdu, Korean, Japanese, Vietnamese, Indonesian, German, Italian, Polish, Ukrainian, Persian/Farsi, Bengali, Thai, and other markets when justified.

### Student actions preserved

Students should always have a simple path:

- Show me the Legal English version.
- Show Simple English.
- Explain in my language.
- Practice this in Legal English.
- Ask my teacher to review.

### v1.52 routes

New routes include `/api/v152/three-layer-language-strategy`, `/api/v152/core-ui-language-scope`, `/api/v152/language-access-plan`, `/api/v152/human-reviewed-marketing-page-plan`, and `/api/v152/language-strategy-continuity-check`.

Native-language support remains a learning bridge. It is not certified translation, court interpretation, legal advice, final legal meaning, or a substitute for teacher/professional review.

## v1.53.0 Role Clarity + Data Continuity Pass

v1.53.0 is a restrained usability pass. It does not replace the course, Translation Bridge, SmartTeacher AI, skills studio, calendar, payment, report, or dashboard systems already built. It makes the existing platform easier for every role to understand.

### What v1.53 adds

- A role-first clarity layer so students, teachers, employers, and owner/staff/admin users see one next best action first.
- Plain-language dashboard guidance: what do I do next, what is saved, what stays private, who should review this, and what must not be lost in the next deployment.
- Stronger continuity language for student work, calendars, class links, payments, credits, reports, certificates, test scores, teacher notes, employer records, uploads, audit logs, and payouts.
- Explicit preservation of the current EnglishLegalese logo and premium legal-education-tech brand unless the owner later approves a brand change.
- Employer-safe summaries that preserve privacy by default.

### v1.53 routes

- `GET /api/v153/role-clarity-continuity-pass`
- `POST /api/v153/plain-role-next-step`
- `POST /api/v153/staff-data-continuity-review`
- `POST /api/v153/employer-safe-role-summary`
- `POST /api/v153/deployment-continuity-gate`

