const express = require('express');
const path = require('path');
const pkg = require('./package.json');

const app = express();
const PORT = process.env.PORT || 3000;
const VERSION = `${pkg.version}-public-launch-readiness-sprint`;
const { PersistentStore, REQUIRED_TABLES } = require('./src/persistence');
const { ProductionServices, authMiddleware, requireRoles, configured, ROLE_PERMISSIONS } = require('./src/productionServices');
const persistentStore = new PersistentStore();
const productionServices = new ProductionServices(persistentStore);

app.use(express.static(__dirname));

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    app: 'EnglishLegalese.com',
    version: VERSION,
    features: [
      'v1.54 adds a Public Launch Readiness Sprint: production configuration gates, public beta mode, first-course lesson templates, teacher onboarding, diagnostic-to-course flow, end-to-end launch test planning, and no-data-loss launch safeguards so real API keys, Stripe, video/calendar vendors, SMTP, object storage, OpenAI, and production PostgreSQL can be connected safely after the code is deployed.',
      'v1.53 adds a Role Clarity + Data Continuity Pass: every role sees one plain next step, what is saved, what stays private, who can help, and what must be protected before deployment while keeping EnglishLegalese positioned as Legal English training for the AI era and preserving the current logo, user work, calendars, payments, reports, certificates, test scores, notes, uploads, audit logs, and payouts',
      'v1.52 adds a Three-Layer Language Access Strategy: core UI help for major navigation and instructions, on-demand page explanations in 100+ major languages, and a human-reviewed top-market page plan for Spanish, Chinese, Arabic, French, Portuguese, Russian, Turkish, Hindi, Urdu, Korean, Japanese, Vietnamese, Indonesian, German, Italian, Polish, Ukrainian, Persian/Farsi, Bengali, and Thai — while clearly avoiding a promise that every page is perfectly translated and preserving all work, calendars, payments, reports, certificates, scores, notes, uploads, audits, and payouts',
      'v1.51 adds a Preferred-Language Page Selector + Explanation Bridge: users can choose a preferred/native language, request page explanations in Simple English and their language, return to Legal English practice, and keep employer reports privacy-safe while preserving all user work, calendars, payments, reports, certificates, scores, notes, uploads, audits, and payouts',
      'v1.49 adds an Intuitive UX Continuity Pass: one clear next action first for students, teachers, employers, and owner/staff users, simpler dashboard guidance, staff UX blocker queues, privacy-safe employer summaries, and continuity risk checks that preserve work, calendars, payments, credits, reports, certificates, test scores, notes, uploads, audits, and payouts',
      'v1.48 adds a Usability Continuity Pass: plainer role-first user language, one-screen student/teacher/employer/staff paths, dashboard next-step clarity, privacy-safe employer progress cards, and no-data-loss deployment continuity checks that preserve work, calendars, payments, credits, reports, certificates, test scores, notes, uploads, audits, and payouts',
      'v1.46 adds a Live Skills Practice + Feedback Loop: students choose text or spoken practice, English or major native-language bridge support, speaking/listening/reading/writing workshop mode, save a practice packet, route it to teacher feedback, assign homework, and generate employer-safe skill progress briefs without exposing private content',
      'v1.45 adds an Integrated Skills Studio: practical speaking, listening, reading, and writing workflows that connect spoken English/native-language support, reading labs, writing workshops, teacher classroom actions, lesson-folder saves, teacher-review handoffs, employer-safe integrated skills reports, and no-data-loss deployment preservation',
      'v1.44 adds a Four-Skills Voice + Reading/Writing Academy: spoken English practice, native-language spoken-support scaffolding, listening/read-aloud drills, reading comprehension classes, writing workshops, teacher speech/reading/writing review handoffs, employer-safe skills reports, and preserved no-data-loss deployment rules',
      'v1.43 adds Course Placement + Ordered Curriculum: AI/human diagnostic placement, beginner-to-expert course levels, ordered lesson sequences, teacher lesson-plan handoffs, employer-safe curriculum reports, SmartTeacher course guidance, and preserved no-data-loss deployment rules',
      'v1.42 adds a Continuity Command Center: learning proof queue, teacher classroom command actions, teacher marketing approval guardrails, employer-safe report continuity, and explicit no-data-loss deployment preservation for work calendars payments reports certificates and test scores',
      'v1.41 adds a Major-Language Bridge and Classroom Command layer: roughly top-100 major language support options, honest low-confidence/staff routing, language-aware teacher classroom tools, privacy-safe employer language summaries, and preserved no-data-loss deployment rules',
      'v1.39 adds a Seamless Learning Operations layer: universal any-language Translation Bridge support, simpler role action rails, teacher live classroom cockpit, employer privacy-safe proof, owner/staff command rail, and explicit no-data-loss deployment guardrails',
      'v1.39 preserves all v1.38 AI-Era Action Layer features while building Legal English training for the AI era into dashboards, AI tutor prompts, teacher tools, employer reporting, curriculum, trust language, and mobile workflows',
      'v1.37 adds a Guided Help + Readiness Navigator: one-tap help, simple English first, native-language explanation when needed, side-by-side Legal English, Ask my teacher, staff support routing, and Back to Legal English practice',
      'v1.37 simplifies dashboards with short action rails for students, teachers, employers, and owner/staff so every user sees the next best action and knows what to do when confused',
      'v1.37 preserves the Translation Bridge, global-access classroom stack, universal calendar interop, ChatGPT-only SmartTeacher AI, built-in teacher classroom tools, privacy-safe employer reporting, and AI-era Legal English positioning',
      'v1.35 adds a Global First-Class Success system: every new class should have one simple student path, one teacher live-teaching console, one provider-agnostic calendar/video decision, one owner/staff blocker lane, and one employer-safe reporting path',
      'v1.35 introduces region-aware access readiness without making Google mandatory: EnglishLegalese remains the source of truth, calendar/video providers are adapters, manual/regional links and ICS reminders stay required fallbacks, and China-friendly workflows are preserved',
      'v1.35 improves built-in teacher teaching tools during online classes: live correction pad, roleplay launcher, vocabulary/contract clause bank, AI translation-risk lens, homework generator, closeout assistant, and privacy visibility controls remain teacher-controlled',
      'v1.35 preserves SmartTeacher AI as ChatGPT/OpenAI-only and strengthens the Legal English training for the AI era message across student, teacher, employer, and staff workflows',
      'v1.34 adds universal calendar interoperability: EnglishLegalese internal calendar remains the source of truth, while every class can offer .ics download/email, add-to-calendar links, Outlook/Microsoft 365, Apple Calendar/iCloud, CalDAV-compatible clients, Google Calendar where available, and regional/manual calendar instructions for China and other markets',
      'v1.34 treats Google Calendar as one optional adapter, not the calendar dependency; students in China can still see class times inside EnglishLegalese and use Microsoft 365/Outlook, Apple Calendar/iCloud, Tencent/WeCom/DingTalk reminders, or .ics/manual reminders where appropriate',
      'v1.34 adds a server-generated ICS calendar endpoint and a calendar provider decision board so staff can schedule global students without forcing Google access',
      'v1.33 makes EnglishLegalese global-access first: the internal EnglishLegalese calendar and class-session record are the source of truth, while Google Calendar/Meet, Zoom, Microsoft Teams, Tencent/VooV Meeting, DingTalk, and manual classroom links are selectable provider options',
      'v1.33 removes Google dependency for global users: Google Calendar/Meet is useful where available but not required for China or other restricted-access markets; staff can schedule and attach a regional classroom link without breaking the class workflow',
      'v1.33 keeps SmartTeacher AI ChatGPT/OpenAI-only while making classroom scheduling provider-agnostic, privacy-labeled, region-aware, mobile-friendly, and easier for students, teachers, employers, and staff to understand',
      'v1.32 locks SmartTeacher AI and AI teaching assistants to ChatGPT/OpenAI only: one AI vendor, one server-side OPENAI_API_KEY, no multi-vendor routing, and no user-facing vendor confusion',
      'v1.32 adds ChatGPT-only governance for SmartTeacher AI classroom support, teacher prompts, employer reports, staff tools, privacy warnings, and AI-translator safety workflows',
      'v1.31 built-in teacher classroom tools with agenda builder, live correction pad, roleplay launcher, AI translation risk lens, vocabulary/contract clause bank, homework generator, closeout checklist, privacy labels, and tablet-friendly teaching controls',
      'v1.31 keeps SmartTeacher AI as a teacher-controlled co-teacher for prompts and drafts while preserving live human teacher judgment and Legal English training boundaries',
      'v1.30 SmartTeacher AI brand lock with official practice-teacher positioning, role-specific next-step dashboards, classroom calendar video readiness, teacher marketing guardrails, employer proposal language, and owner/staff operating console',
      'v1.30 strengthens the AI-translator objection in the actual workflow: diagnose goal, practice safely with SmartTeacher AI, save to lesson folder, teacher reviews, class runs in Google Meet/Zoom, report proves progress, and staff clears blockers',
      'v1.29 university benchmark integration with concrete offer ladder, practical course catalog, employer ROI math, teacher marketing scripts, buyer FAQ, and SmartTeacher university-comparison answers',
      'v1.29 keeps EnglishLegalese below major university pricing while borrowing useful law-school rigor: U.S. legal system readiness, case reading, class discussion, legal writing, contracts, meetings, TOLES-style practice, and AI translator safety',
      'v1.28 university benchmark pricing and curriculum flow with major-law-school comparison, affordable premium package guidance, LL.M.-prep modules, cohort options, employer value framing, and preserved AI-era Legal English positioning',
      'v1.27 AI-era simplicity and conversion flow with clearer four-role start, dashboard next actions, classroom/calendar/video readiness, teacher marketing copy, employer-safe reports, staff blocker queue, and mobile shortcuts',
      'v1.27 directly answers the AI-translator objection throughout product flow: AI can translate words, but EnglishLegalese trains Legal English judgment context confidentiality professional tone speaking confidence writing skill document fluency and safe AI output review',
      'v1.27 preserves v1.26 integrated product flow and all production backend guardrails while adding a production-safe simplicity brief endpoint at /api/v127/simplicity-flow',
      'v1.26 AI-era integrated product flow with clearer student-teacher-employer-staff journey, teacher marketing copy center, employer privacy/ROI language, mobile next actions, and production readiness guardrails preserved',
      'v1.26 reinforces the promise: AI can translate words, but EnglishLegalese trains judgment context confidentiality professional tone speaking confidence writing skill document fluency and safe AI output review',
      'v1.25 AI-era operating flow with pathway plans, teacher review handoffs, employer ROI snapshots, confidentiality checks, SmartTeacher prompt library, and simpler role dashboards',
      'v1.24 AI-era Legal English strategy with AI translator safety, performance-training positioning, curriculum modules, teacher marketing copy, employer ROI language, privacy-safe reports, and SmartTeacher AI safety workflows',
      'EnglishLegalese is positioned as Legal English performance training for the AI era, not generic English learning and not simple translation',
      'AI can translate words, but students and professionals still need judgment context confidentiality professional tone speaking confidence writing skill document fluency and safe AI output review',
      'v1.23 integrated operating console with unified action center, video room events, AI tutor interaction records, and teacher marketing lead attribution',
      'v1.22 seamless launch operations with role journeys, go-live cockpit, classroom readiness reviews, teacher marketing assets, support threads, and simpler staff controls',
      'v1.21 production infrastructure activation layer with live credential gates, launch readiness, integration checks, owner bootstrap, deployment records, and backup checkpoints',
      'real external services still require account-owned secrets entered as environment variables; no live secrets are embedded in the ZIP',
      'launch readiness endpoint now blocks live classroom onboarding until PostgreSQL auth Stripe object storage email Google Meet OpenAI backups and smoke tests are configured',
      'v1.20 seamless production operations pass with unified role onboarding session cockpit staff command center and persisted closeouts',
      'booking requests homework assignments class closeouts and staff tasks now have production-safe API scaffolding',
      'role dashboards and production console focus on one next action for students teachers employers and staff',
      'calendar video classrooms payments credits reports payouts teacher marketing and AI are tied to one operating spine',
      'teacher marketing remains approved link and platform checkout based so pricing control and attribution are protected',
      'v1.18 production persistence foundation with PostgreSQL schema migrations and persistent API scaffolding',
      'database-backed class session saved work and audit log endpoints added with local development fallback',
      'safe deployment checklist environment example and production launch gates added',
      'v1.17 persistent records and safe deployment guardrails',
      'production data must live outside the deployable app in PostgreSQL and secure object storage',
      'future code deployments must not wipe users classrooms homework exams reports payments credits payouts employer records or audit logs',
      'backup migration staging and audit log rules added for no-data-loss production operations',
      'SmartTeacher AI data-safety assistant explains backups migrations persistent storage and post-deploy verification',

      'v1.15 controlled platform revenue and teacher payout model',
      'EnglishLegalese collects customer payments first and pays teachers internally after completed closeout',
      'public package and employer credit pricing separated from internal teacher payout tiers',
      'credit ledger and gross margin view for owner staff operations',
      'teacher payouts and marketing bonuses held until attribution quality refund and closeout checks',
      'SmartTeacher AI revenue assistant explains payments credits payouts margin and renewal flow',

      'v1.14 seamless production-ready UX polish',
      'today command view with one next action for students employers teachers and staff',
      'single operating lifecycle from lead to renewal and payout',
      'class readiness board for credits teacher match calendar video saved work homework reports and payout status',
      'teacher campaign calendar with approved channels attribution and staff claim review',
      'staff operating lanes for sell schedule teach report pay trust and AI boundary checks',
      'mobile simplicity path focused on start schedule join class and AI practice',
      'SmartTeacher AI expanded for class records scheduling closeout reports marketing and saved homework exams',

      'v1.13 seamless operating experience polish',
      'role journeys for students employers teachers and owner staff',
      'unified class session command panel connecting package teacher calendar video saved work homework exams reports credits and payouts',
      'classroom UX reframed around before during after and closeout dependencies',
      'Teacher Marketing Studio refined with approved channels guardrails and copy-ready outreach',
      'SmartTeacher AI role modes for student teacher employer scheduling marketing exams and staff operations',
      'dashboards simplified around one next best action',
      'staff triage board ordered by revenue trust readiness reports payouts teacher growth and AI boundary risks',
      'mobile layout improvements for role journeys session health classroom marketing and AI sections',



      'v1.12 unified classroom scheduling UX pass',
      'one operating spine from intake to package match schedule classroom homework assessment report payout and renewal',
      'simplified homepage role paths and unified class-session map',
      'calendar video classroom saved work homework exams reports credits and payout tied to one session record',
      'teacher marketing studio expanded with approved channel library pipeline and copyable templates',
      'role dashboards simplified around one next best action',
      'SmartTeacher AI console organized by student teacher employer marketing and staff modes',
      'staff risk queue for trust revenue teacher learning payout and AI boundary blockers',
      'mobile quick start updated for find calendar class and AI',
      'v1.11 seamless calendar classroom operations pass',
      'one class session record connects calendar video credits saved work homework reports and teacher payout',
      'seamless user flow from diagnostic to package to match to schedule to teach to closeout',
      'session readiness checklist for staff and dashboards',
      'blocker-first calendar operations queue',
      'teacher marketing studio with copyable approved templates',
      'classroom control panel for prepare teach and close out',
      'SmartTeacher AI scheduling and privacy-safe report support',
      'privacy and recording rules surfaced in scheduling and classroom flows',
      'owner staff operating lanes for money class readiness teacher growth learning proof payout and AI boundaries',
      'v1.10 scheduling and virtual classroom integration',
      'internal EnglishLegalese lesson calendar as source of truth',
      'EnglishLegalese internal calendar as the source of truth; Google Meet available where accessible',
      'Zoom, Teams, Tencent/VooV Meeting, DingTalk, and manual links available as regional classroom options',
      'Microsoft Teams reserved for employer corporate clients; Tencent/VooV and DingTalk reserved for China-accessible classes when appropriate',
      'teacher availability and calendar connection workflow',
      'upcoming class session operating table',
      'student teacher employer and staff scheduling dashboard updates',
      'staff calendar blocker queue',
      'classroom join and closeout workflow tied to calendar video credits reports and payouts',
      'recording consent and employer privacy boundaries',
      'simple daily action strip for students employers teachers and staff',
      'learning tracks mapped to packages homework AI practice and reports',
      'teacher asset library for social email webinar QR and employer outreach',
      'teacher marketing approval stages',
      'classroom closeout checklist expanded for saved work assessments reports credits and payouts',
      'owner staff queues for money teacher growth closeouts saved work employer proof and AI boundaries',
      'clearer SmartTeacher AI role modes and legal education boundary',
      'approved logo and brand system',
      'teacher marketplace',
      'platform-set public packages',
      'internal teacher payout tiers',
      'teacher marketing toolkit',
      'approved social templates',
      'mobile sticky quick-start actions',
      'classroom closeout checklist',
      'saved homework and classwork in progress',
      'one next best action dashboards',
      'teacher marketing growth toolkit with campaign templates',
      'staff triage board with blockers first',
      'resumable exam and assessment workflow',
      'work in progress visibility for students teachers employers and staff',
      'staff task board',
      'report queue for students teachers employers and staff',
      'trackable teacher referral links',
      'teacher-sourced lead attribution',
      'teacher campaign approval workflow',
      'individual classrooms',
      'group classrooms',
      'homework assignments',
      'progress and completion reports',
      'student dashboard',
      'teacher dashboard',
      'employer dashboard',
      'owner/admin command center',
      'staff operations workflow',
      'SmartTeacher AI tutor suite',
      'pricing and revenue model',
      'teacher tier approval workflow',
      'teacher marketing bonus tracking',
      'mobile UX refinements',
      'simple role-based start paths',
      'trust center with AI and privacy boundaries',
      'teacher marketing studio with multi-channel playbook',
      'daily operating lanes for owner and staff',
      'simplified dashboard next-action views'
    ],
    timestamp: new Date().toISOString()
  });
});


app.post('/api/v119/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const result = await productionServices.handleStripeWebhook(req.body, req.get('stripe-signature'), req);
    res.json({ ok: true, version: VERSION, result });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '1mb' }));

app.get('/api/video-providers', (req, res) => {
  res.json({
    default_provider: 'Google Meet',
    approved_alternate: 'Zoom',
    employer_future_provider: 'Microsoft Teams',
    embedded_future_option: 'Daily / embedded video',
    note: 'Prototype endpoint. Production requires OAuth/API credentials and database-backed class session records.'
  });
});

app.post('/api/class-sessions/mock-create', (req, res) => {
  const provider = req.body?.provider || 'Google Meet';
  const sessionId = `EL-CLS-${Math.floor(1000 + Math.random() * 9000)}`;
  res.json({
    ok: true,
    session_id: sessionId,
    provider,
    calendar_status: 'mock-calendar-event-ready',
    video_status: provider === 'Zoom' ? 'mock-zoom-link-ready' : 'mock-google-meet-ready',
    classroom_url: `/classroom/${sessionId}`,
    note: 'Mock endpoint only. Production should create a database class_session, sync Google/Outlook calendar, attach video room, hold lesson credit, and notify participants.'
  });
});


app.get('/api/class-sessions/mock-health', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    source_of_truth: 'EnglishLegalese internal class_session record',
    readiness_checklist: [
      'package_or_credit_verified',
      'teacher_assigned_by_fit',
      'calendar_invite_sent',
      'video_room_attached',
      'saved_work_and_homework_linked',
      'attendance_and_teacher_notes_required_after_class',
      'report_refreshed_after_closeout',
      'credit_deducted_and_payout_queued_after_quality_check'
    ],
    blockers: [
      { session: 'EL-CLS-1055', issue: 'missing_video_link', next_action: 'Attach Zoom link or switch to Google Meet' },
      { session: 'EL-CLS-1052', issue: 'employer_roster_incomplete', next_action: 'Confirm final learner roster before invites' }
    ],
    note: 'Prototype endpoint. Production should read/write persistent class_session records, calendar IDs, video provider IDs, credit holds, and closeout status.'
  });
});

app.get('/api/teacher-marketing/mock-assets', (req, res) => {
  res.json({
    ok: true,
    policy: 'Teachers may promote approved expertise using trackable EnglishLegalese links. Platform pricing, checkout, claims, reporting, and client relationship stay controlled by EnglishLegalese.',
    assets: ['profile_link', 'class_spotlight_page', 'linkedin_post', 'employer_intro_email', 'webinar_invite', 'whatsapp_dm', 'qr_flyer'],
    attribution_methods: ['referral_code', 'tracking_link', 'qr_code', 'staff_entered_source'],
    bonus_rule: 'Bonus review occurs only after attribution, payment, no off-platform diversion, and approved claims.'
  });
});


app.get('/api/unified-session-map/mock', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    source_of_truth: 'EnglishLegalese internal class_session record',
    fields: ['buyer_or_package', 'teacher', 'learner_or_cohort', 'calendar_event', 'video_room', 'saved_work', 'homework', 'assessment', 'report', 'credit_hold', 'teacher_payout_status', 'renewal_prompt'],
    sample_sessions: [
      { record: 'EL-CLS-1051', schedule: 'confirmed_google_meet', classroom: 'saved_work_and_homework_linked', money: 'credit_held_payout_pending_closeout', next_action: 'student_join_class' },
      { record: 'EL-CLS-1052', schedule: 'roster_blocker', classroom: 'group_agenda_ready', money: 'four_credits_held', next_action: 'confirm_final_roster' },
      { record: 'EL-CLS-1055', schedule: 'zoom_link_missing', classroom: 'roleplay_plan_ready', money: 'credit_reserved', next_action: 'attach_video_link' }
    ],
    note: 'Prototype endpoint. Production should persist these records and sync with calendar, video, Stripe credits, reports, and payout workflow.'
  });
});

app.get('/api/staff/unified-ops-brief/mock', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    priorities: [
      'clear schedule/video/roster blockers before class confirmation',
      'refresh reports after closeout so employers see progress proof',
      'approve teacher marketing claims before trackable links go live',
      'release teacher payouts only after attendance notes homework and report status are closed',
      'review SmartTeacher AI boundary flags for legal-advice risk'
    ]
  });
});


app.get('/api/v113/seamless-ops/mock', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    operating_spine: ['start', 'package_or_credits', 'teacher_match', 'schedule', 'video_classroom', 'saved_work_homework_exams', 'reports', 'credit_payout_renewal'],
    class_session_record: {
      source_of_truth: 'EnglishLegalese class_session',
      video_default: 'Google Meet',
      video_alternate: 'Zoom',
      corporate_future: 'Microsoft Teams',
      connected_fields: ['package_credit', 'teacher', 'learner_or_cohort', 'calendar_invite', 'video_room', 'saved_work', 'homework', 'assessment', 'report', 'credit_hold', 'teacher_payout', 'renewal_prompt']
    },
    staff_priorities: [
      'sell_or_renew_with_progress_proof',
      'clear_calendar_video_roster_blockers',
      'collect_teacher_closeouts',
      'generate_privacy_safe_reports',
      'approve_teacher_marketing_claims_and_tracking',
      'review_AI_boundary_flags'
    ],
    note: 'Prototype endpoint. Production requires database, auth, Stripe, calendar/video APIs, secure storage, notifications, reports, and server-side AI.'
  });
});


app.get('/api/v114/production-ux/mock', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    operating_lifecycle: ['lead_captured', 'package_or_credits_selected', 'teacher_matched', 'class_scheduled', 'class_taught', 'closeout_completed', 'proof_delivered', 'renew_or_top_up'],
    readiness_fields: ['credits_payment', 'teacher_match', 'calendar_invite', 'video_room', 'saved_work', 'homework', 'employer_proof', 'teacher_payout'],
    default_video_provider: 'Google Meet',
    approved_alternate_video_provider: 'Zoom',
    staff_lanes: ['sell_renew', 'schedule_video', 'teach_closeout', 'report_proof', 'pay_control', 'trust_ai'],
    teacher_growth_controls: ['approved_profile_links', 'campaign_calendar', 'claim_review', 'referral_attribution', 'bonus_after_paid_conversion', 'no_public_teacher_set_pricing'],
    mobile_priority_actions: ['start', 'schedule', 'join_class', 'practice_with_ai'],
    note: 'Prototype endpoint for v1.14 UX architecture. Production requires auth, database records, Stripe, calendar/video credentials, secure storage, notifications, PDF reports, and server-side AI.'
  });
});


app.get('/api/v115/revenue-model/mock', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    model: 'EnglishLegalese collects customer payments first, controls public packages and employer credits, then pays teachers internally after completed class closeout.',
    revenue_lanes: [
      { lane: 'individual_packages', public_prices: ['$95 assessment', '$495 starter', '$895 professional_10'], collected_by: 'EnglishLegalese', teacher_paid_after: 'lesson_closeout' },
      { lane: 'employer_credits', public_prices: ['$2250 firm_25', '$4250 firm_50', 'custom_quote'], collected_by: 'EnglishLegalese', teacher_paid_after: 'class_or_group_closeout' },
      { lane: 'smartteacher_ai', public_prices: ['$29/month', 'bundled'], collected_by: 'EnglishLegalese', teacher_paid_after: 'not_applicable_unless_human_review' },
      { lane: 'teacher_growth', public_prices: ['$49/month featured listing', 'approved campaign boosts'], collected_by: 'EnglishLegalese', teacher_paid_after: 'not_applicable' }
    ],
    payout_rules: ['teacher payout is internal', 'no public teacher hourly shopping', 'credit held before class', 'closeout before payout', 'bonus after paid conversion and attribution review'],
    ledger_fields: ['customer_payment_status', 'package_or_credit_balance', 'credit_hold', 'teacher_payout_tier', 'expected_teacher_cost', 'estimated_gross_margin', 'refund_or_no_show_flag', 'bonus_review', 'renewal_prompt'],
    production_note: 'Production should connect this to Stripe, invoices, class_session records, teacher payout tiers, refunds, no-show policy, and accounting exports.'
  });
});


app.get('/api/v116/unified-operations/mock', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    operating_rule: 'One EnglishLegalese class-session record connects payment, credits, teacher match, calendar, video, saved work, homework, assessments, reports, teacher payout, attribution, renewal, and trust controls.',
    default_video_provider: 'Google Meet',
    approved_alternate_video_provider: 'Zoom',
    future_corporate_video_provider: 'Microsoft Teams',
    booking_readiness: ['payment_or_credit_recorded', 'teacher_matched_by_fit', 'calendar_invite_ready', 'video_room_attached', 'saved_work_or_goal_linked', 'homework_exam_context_ready', 'report_closeout_required', 'payout_hold_until_closeout'],
    teacher_growth_controls: ['approved_profile_links', 'class_spotlight_pages', 'social_templates', 'employer_intro_templates', 'webinar_or_qr_campaigns', 'tracking_code_required', 'no_public_teacher_set_pricing', 'bonus_after_paid_conversion_and_staff_review'],
    staff_lanes: ['sell_collect', 'schedule_video', 'teach_prove', 'pay_renew', 'trust_quality'],
    mobile_priority_actions: ['start', 'schedule', 'join_class', 'practice_with_ai'],
    production_note: 'Production requires authentication, database-backed class_session records, Stripe payments/credits, Google/Zoom API credentials, secure saved-work storage, notifications, PDF reports, teacher referral tracking, and server-side AI routes.'
  });
});


app.get('/api/v117/data-protection/mock', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    rule: 'Deployments replace code, not live data. Production data must persist in managed database and object storage outside the deployable ZIP.',
    persistent_stores: {
      database: 'PostgreSQL for users roles organizations class_sessions homework metadata exams reports credits payouts campaigns and audit logs',
      files: 'S3/R2/GCS-style object storage for uploads homework files exported PDFs and optional recordings only if consented',
      payments: 'Stripe customer payment invoice subscription and webhook records linked to internal credit ledger',
      calendar_video: 'Provider event IDs and video room IDs stored on the EnglishLegalese class_session record'
    },
    safe_deploy_checklist: [
      'backup_production_database_before_risky_migration',
      'test_migration_on_staging_copy',
      'never_run_drop_reset_seed_against_production',
      'preserve_object_storage_and_upload_keys',
      'run_post_deploy_smoke_tests_for_users_sessions_saved_work_reports_credits_and_payouts',
      'write_critical_changes_to_append_only_audit_log'
    ],
    production_note: 'The current ZIP is still an MVP prototype. This endpoint documents the required production data-safety architecture before real users use the platform.'
  });
});


app.get('/api/v118/persistence/health', async (req, res) => {
  try {
    const health = await persistentStore.health();
    res.json({
      ok: true,
      version: VERSION,
      persistence: health,
      production_required: {
        database: 'PostgreSQL via DATABASE_URL',
        file_storage: 'S3/R2/GCS-style object storage for uploads and reports',
        payments: 'Stripe webhooks linked to internal credit ledger',
        calendar_video: 'Google/Zoom provider IDs saved to class_sessions',
        deployment_rule: 'deploy code only; never reset live data'
      }
    });
  } catch (error) {
    res.status(500).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.get('/api/v118/data-model', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    required_tables: REQUIRED_TABLES,
    migration_file: 'db/migrations/001_initial_persistent_schema.sql',
    docs: ['DATA_MODEL.md', 'SAFE_DEPLOYMENT_CHECKLIST.md', '.env.example'],
    no_data_loss_rule: 'Migrations must preserve production records; no drop/reset/seed in production.'
  });
});

app.get('/api/v118/class-sessions', async (req, res) => {
  try {
    const records = await persistentStore.listClassSessions();
    res.json({ ok: true, version: VERSION, count: records.length, records });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post('/api/v118/class-sessions', async (req, res) => {
  try {
    const record = await persistentStore.createClassSession(req.body || {});
    res.status(201).json({ ok: true, version: VERSION, record });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get('/api/v118/saved-work', async (req, res) => {
  try {
    const records = await persistentStore.listSavedWork();
    res.json({ ok: true, version: VERSION, count: records.length, records });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post('/api/v118/saved-work', async (req, res) => {
  try {
    const record = await persistentStore.createSavedWork(req.body || {});
    res.status(201).json({ ok: true, version: VERSION, record });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get('/api/v118/audit-log', async (req, res) => {
  try {
    const records = await persistentStore.listAuditLog();
    res.json({ ok: true, version: VERSION, count: records.length, records });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post('/api/v118/audit-log', async (req, res) => {
  try {
    const record = await persistentStore.addAuditLog({
      ...(req.body || {}),
      ip_address: req.ip,
      user_agent: req.get('user-agent')
    });
    res.status(201).json({ ok: true, version: VERSION, record });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get('/api/v118/deploy-safety-check', async (req, res) => {
  const persistence = await persistentStore.health();
  res.json({
    ok: true,
    version: VERSION,
    mode: persistence.mode,
    production_ready: persistence.mode === 'postgres',
    blockers_if_launching_real_users: persistence.mode === 'postgres' ? [] : ['DATABASE_URL not connected to PostgreSQL', 'Object storage not configured', 'Stripe/calendar/video credentials not wired yet'],
    checklist: [
      'Run npm run predeploy:check',
      'Back up production database before risky migrations',
      'Run npm run migrate on staging first',
      'Deploy code without touching production database or object storage',
      'Smoke test users class sessions saved work reports credits payouts and audit log after deploy'
    ]
  });
});


app.get('/api/v119/production-readiness', async (req, res) => {
  const persistence = await persistentStore.health();
  const integrations = configured();
  const missing = Object.entries(integrations).filter(([,value]) => !value).map(([key]) => key);
  res.json({
    ok: true,
    version: VERSION,
    persistence_mode: persistence.mode,
    integrations,
    missing_for_full_live_launch: missing,
    role_permissions: ROLE_PERMISSIONS,
    production_rule: 'Code deployments must preserve database, object storage, Stripe records, calendar/video IDs, uploads, saved work, reports, payouts and audit logs.',
    launch_note: 'Routes are production-shaped and environment-driven. Real credentials must be set in production before live users.'
  });
});

app.post('/api/v119/auth/register', async (req, res) => {
  try {
    const result = await productionServices.registerUser(req.body || {}, req);
    res.status(201).json({ ok: true, version: VERSION, ...result });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v119/auth/login', async (req, res) => {
  try {
    const result = await productionServices.loginUser(req.body || {}, req);
    res.json({ ok: true, version: VERSION, ...result });
  } catch (error) {
    res.status(401).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.get('/api/v119/auth/me', authMiddleware(productionServices), async (req, res) => {
  res.json({ ok: true, version: VERSION, user: req.user, permissions: ROLE_PERMISSIONS[req.user.role] || [] });
});

app.post('/api/v119/payments/create-checkout', async (req, res) => {
  try {
    const result = await productionServices.createPaymentCheckout(req.body || {}, req);
    res.status(201).json({ ok: true, version: VERSION, checkout: result });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v119/uploads/presign', authMiddleware(productionServices), async (req, res) => {
  try {
    const result = await productionServices.createPresignedUpload({ ...(req.body || {}), owner_user_id: req.user.id }, req);
    res.status(201).json({ ok: true, version: VERSION, ...result });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v119/notifications/email', authMiddleware(productionServices), requireRoles('staff','admin','owner'), async (req, res) => {
  try {
    const result = await productionServices.sendEmail(req.body || {}, req);
    res.status(201).json({ ok: true, version: VERSION, email: result });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v119/calendar-video/create-session', authMiddleware(productionServices), requireRoles('teacher','staff','admin','owner'), async (req, res) => {
  try {
    const result = await productionServices.createCalendarVideoSession(req.body || {}, req);
    res.status(201).json({ ok: true, version: VERSION, session: result });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v119/reports/pdf', authMiddleware(productionServices), requireRoles('teacher','staff','admin','owner'), async (req, res) => {
  try {
    const result = await productionServices.createPdfReport(req.body || {}, req);
    res.status(201).json({ ok: true, version: VERSION, report: result });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v119/smartteacher', authMiddleware(productionServices), async (req, res) => {
  try {
    const result = await productionServices.smartTeacher(req.body || {}, req.user, req);
    res.json({ ok: true, version: VERSION, interaction: result });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.get('/api/v119/security/roles', (req, res) => {
  res.json({ ok: true, version: VERSION, roles: ROLE_PERMISSIONS, note: 'Role permissions are enforced on production routes and should be mirrored in the UI.' });
});



app.get('/api/v120/operating-spine/health', async (req, res) => {
  const persistence = await persistentStore.health();
  res.json({
    ok: true,
    version: VERSION,
    persistence_mode: persistence.mode,
    operating_spine: ['lead_or_booking_request','package_or_credit_verified','teacher_match','calendar_video_ready','classroom_live','saved_work_homework_exam','closeout_report_credit_payout','renewal_or_top_up'],
    rule: 'Every customer-facing workflow should update the EnglishLegalese session record or a linked persistent child record.'
  });
});

app.get('/api/v120/role-dashboard/:role', (req, res) => {
  const role = String(req.params.role || 'student').toLowerCase();
  const dashboards = {
    student: { next_action: 'Prepare saved work and join the next scheduled class.', primary_records: ['class_sessions','saved_work_items','homework_assignments','assessment_attempts','progress_reports'], hidden_from_user: ['teacher_payouts','internal_margin'] },
    teacher: { next_action: 'Teach the next class, save notes, assign homework, and complete closeout.', primary_records: ['class_sessions','saved_work_items','homework_assignments','class_session_closeouts','teacher_marketing_campaigns'], hidden_from_user: ['platform_margin','other_teacher_payouts'] },
    employer: { next_action: 'Confirm roster, review privacy-safe progress, and top up credits before they run low.', primary_records: ['organizations','class_sessions','credit_ledger','progress_reports'], hidden_from_user: ['private_student_drafts','teacher_private_notes','teacher_payouts'] },
    staff: { next_action: 'Clear revenue, scheduling, classroom, report, payout, and trust blockers.', primary_records: ['booking_requests','class_sessions','class_session_closeouts','staff_tasks','payment_transactions','credit_ledger'], hidden_from_user: [] },
    admin: { next_action: 'Review production readiness, permissions, margins, payouts, and no-data-loss deployment gates.', primary_records: ['all'], hidden_from_user: [] },
    owner: { next_action: 'Protect revenue, trust, teacher supply, classroom quality, and production data.', primary_records: ['all'], hidden_from_user: [] }
  };
  res.json({ ok: true, version: VERSION, role, dashboard: dashboards[role] || dashboards.student });
});

app.get('/api/v120/booking-requests', async (req, res) => {
  try { const records = await persistentStore.listBookingRequests(); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.post('/api/v120/booking-requests', async (req, res) => {
  try { const record = await persistentStore.createBookingRequest(req.body || {}); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});

app.get('/api/v120/homework-assignments', async (req, res) => {
  try { const records = await persistentStore.listHomeworkAssignments(); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.post('/api/v120/homework-assignments', async (req, res) => {
  try { const record = await persistentStore.createHomeworkAssignment(req.body || {}); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});

app.get('/api/v120/session-closeouts', async (req, res) => {
  try { const records = await persistentStore.listSessionCloseouts(); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.post('/api/v120/class-sessions/:id/closeout', async (req, res) => {
  try { const record = await persistentStore.createSessionCloseout({ ...(req.body || {}), class_session_id: req.params.id }); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});

app.get('/api/v120/class-sessions/:id/cockpit', async (req, res) => {
  try {
    const [sessions, savedWork, homework, closeouts] = await Promise.all([persistentStore.listClassSessions(), persistentStore.listSavedWork(), persistentStore.listHomeworkAssignments(), persistentStore.listSessionCloseouts()]);
    const session = sessions.find(s => s.id === req.params.id) || { id: req.params.id, status: 'not_found_in_demo_store', note: 'Create a class session first or connect PostgreSQL production data.' };
    res.json({
      ok: true,
      version: VERSION,
      session,
      linked_records: {
        saved_work: savedWork.filter(w => w.class_session_id === req.params.id),
        homework: homework.filter(h => h.class_session_id === req.params.id),
        closeouts: closeouts.filter(c => c.class_session_id === req.params.id)
      },
      readiness: ['credits/payment','teacher match','calendar invite','video room','saved work','homework','report','credit deduction','payout review'],
      next_staff_action: session.status === 'not_found_in_demo_store' ? 'Create the class session or verify ID.' : 'Verify closeout and report/payout dependencies.'
    });
  } catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.get('/api/v120/staff-command-center', async (req, res) => {
  try {
    const [bookings, sessions, homework, closeouts, tasks] = await Promise.all([persistentStore.listBookingRequests(), persistentStore.listClassSessions(), persistentStore.listHomeworkAssignments(), persistentStore.listSessionCloseouts(), persistentStore.listStaffTasks()]);
    res.json({
      ok: true,
      version: VERSION,
      counts: { booking_requests: bookings.length, class_sessions: sessions.length, homework_assignments: homework.length, closeouts: closeouts.length, staff_tasks: tasks.length },
      lanes: [
        { lane: 'Sell / collect', next_action: 'Follow up on booking requests and unpaid packages.' },
        { lane: 'Schedule / video', next_action: 'Confirm credits, time zone, calendar invite, and Google Meet/Zoom room.' },
        { lane: 'Teach / closeout', next_action: 'Require attendance, teacher notes, homework, AI practice recommendation, and report refresh.' },
        { lane: 'Report / renew', next_action: 'Send progress proof and trigger top-up/renewal when credits are low.' },
        { lane: 'Pay / control', next_action: 'Release teacher payout only after closeout and staff review.' },
        { lane: 'Trust / AI', next_action: 'Review privacy boundaries, recording consent, marketing claims, and AI legal-advice boundary.' }
      ]
    });
  } catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.get('/api/v120/production-gates', async (req, res) => {
  const persistence = await persistentStore.health();
  const integrations = configured();
  const required = ['postgres','auth_secret','stripe','stripe_webhook','object_storage','smtp','google_calendar','openai'];
  const blockers = required.filter(key => !integrations[key] && !(key === 'postgres' && persistence.mode === 'postgres'));
  res.json({
    ok: true,
    version: VERSION,
    production_ready_for_live_users: blockers.length === 0 && persistence.mode === 'postgres',
    persistence_mode: persistence.mode,
    integrations,
    blockers,
    safe_launch_rule: 'Do not accept real classroom users until auth, PostgreSQL, Stripe/webhooks, object storage, email, calendar/video, backups, and server-side AI are configured and tested.'
  });
});


function v121IntegrationStatus() {
  const c = configured();
  return {
    postgres: Boolean(process.env.DATABASE_URL),
    auth_secret: Boolean(process.env.SESSION_SECRET || process.env.JWT_SECRET),
    stripe: c.stripe,
    stripe_webhook: c.stripe_webhook,
    object_storage: c.object_storage,
    smtp: c.smtp,
    internal_calendar: true,
    google_calendar_meet: c.google_calendar,
    zoom: c.zoom,
    teams: c.teams,
    tencent_voov: c.tencent_voov,
    dingtalk: c.dingtalk,
    manual_classroom_link: c.manual_classroom_link,
    provider_agnostic_classroom: true,
    openai: c.openai,
    backup_policy: Boolean(process.env.BACKUP_PROVIDER || process.env.BACKUP_LAST_VERIFIED_AT),
    app_base_url: Boolean(process.env.APP_BASE_URL)
  };
}

function v121RequiredGates(persistenceMode) {
  const status = v121IntegrationStatus();
  const gates = [
    { key: 'postgres', label: 'Managed PostgreSQL connected', required: true, ok: persistenceMode === 'postgres' && status.postgres },
    { key: 'auth_secret', label: 'Strong session/JWT secret configured', required: true, ok: status.auth_secret },
    { key: 'stripe', label: 'Stripe secret key configured', required: true, ok: status.stripe },
    { key: 'stripe_webhook', label: 'Stripe webhook secret configured', required: true, ok: status.stripe_webhook },
    { key: 'object_storage', label: 'Secure object storage configured', required: true, ok: status.object_storage },
    { key: 'smtp', label: 'Email/SMTP configured', required: true, ok: status.smtp },
    { key: 'internal_calendar', label: 'EnglishLegalese internal calendar/source of truth enabled', required: true, ok: status.internal_calendar },
    { key: 'manual_classroom_link', label: 'Manual/regional classroom link fallback enabled', required: true, ok: status.manual_classroom_link },
    { key: 'google_calendar_meet', label: 'Google Calendar/Meet configured where available', required: false, ok: status.google_calendar_meet },
    { key: 'zoom', label: 'Zoom provider configured', required: false, ok: status.zoom },
    { key: 'teams', label: 'Microsoft Teams provider documented/configurable', required: false, ok: status.teams },
    { key: 'tencent_voov', label: 'Tencent/VooV China-accessible provider documented/configurable', required: false, ok: status.tencent_voov },
    { key: 'dingtalk', label: 'DingTalk China-accessible provider documented/configurable', required: false, ok: status.dingtalk },
    { key: 'openai', label: 'Server-side SmartTeacher AI configured', required: true, ok: status.openai },
    { key: 'backup_policy', label: 'Backup provider/checkpoint recorded', required: true, ok: status.backup_policy },
    { key: 'app_base_url', label: 'Production base URL configured', required: true, ok: status.app_base_url },
    { key: 'zoom', label: 'Zoom alternate video provider configured', required: false, ok: status.zoom }
  ];
  return gates;
}

app.get('/api/v121/infrastructure-plan', async (req, res) => {
  const persistence = await persistentStore.health();
  res.json({
    ok: true,
    version: VERSION,
    persistence_mode: persistence.mode,
    cannot_do_without_owner_credentials: [
      'activate live Stripe account keys and webhook secret',
      'activate EnglishLegalese internal calendar/session records as the source of truth',
      'activate Google OAuth/Calendar/Meet credentials only where useful and accessible',
      'activate Zoom account Server-to-Server OAuth credentials where useful',
      'document Microsoft Teams manual/enterprise link workflow',
      'document Tencent/VooV Meeting and DingTalk China-accessible link workflow',
      'activate SMTP credentials',
      'activate object storage credentials',
      'activate OpenAI API key',
      'point EnglishLegalese.com DNS at the hosting service'
    ],
    production_sequence: [
      'create managed PostgreSQL and set DATABASE_URL',
      'set SESSION_SECRET/JWT_SECRET',
      'run npm run migrate',
      'run npm run owner:create once, then rotate and clear OWNER_PASSWORD',
      'configure Stripe Checkout and webhook endpoint',
      'configure S3/R2 object storage',
      'configure SMTP email',
      'configure EnglishLegalese internal calendar as required source of truth',
      'configure provider routing: Google Meet where available, Zoom/Teams where appropriate, Tencent/VooV or DingTalk for China-accessible classes, and manual class links always available',
      'configure OpenAI for server-side SmartTeacher AI',
      'run npm run live:verify:strict',
      'record backup checkpoint and deployment record',
      'smoke test auth, booking, class session, saved work, payment, upload, calendar/video, email, report, and AI'
    ],
    data_safety_rule: 'New code releases must be additive and must never drop, reset, truncate, overwrite, or reseed production user/classroom/payment/homework/report data.'
  });
});

app.get('/api/v121/launch-readiness', async (req, res) => {
  const persistence = await persistentStore.health();
  const gates = v121RequiredGates(persistence.mode);
  const blockers = gates.filter(g => g.required && !g.ok).map(g => ({ key: g.key, label: g.label }));
  const [backups, deployments, launchEvents] = await Promise.all([
    persistentStore.listBackupCheckpoints().catch(()=>[]),
    persistentStore.listDeploymentRecords().catch(()=>[]),
    persistentStore.listProductionLaunchEvents().catch(()=>[])
  ]);
  res.json({
    ok: true,
    version: VERSION,
    production_ready_for_live_classroom_users: blockers.length === 0,
    persistence_mode: persistence.mode,
    gates,
    blockers,
    records: { backup_checkpoints: backups.length, deployment_records: deployments.length, launch_events: launchEvents.length },
    owner_decision: blockers.length === 0 ? 'Credentials and core infrastructure appear configured. Proceed to manual smoke tests before onboarding live paid users.' : 'Do not onboard live paid classroom users yet. Configure missing gates first.',
    safe_launch_rule: 'A limited private beta can be intentionally approved by owner/staff, but it must still avoid storing real data in local JSON or deploy-folder files.'
  });
});

app.get('/api/v121/integration-checks', async (req, res) => {
  try { const records = await persistentStore.listIntegrationHealthChecks(); res.json({ ok: true, version: VERSION, configured: v121IntegrationStatus(), count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.post('/api/v121/integration-checks', async (req, res) => {
  try { const record = await persistentStore.createIntegrationHealthCheck(req.body || {}); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});

app.get('/api/v121/deployment-records', async (req, res) => {
  try { const records = await persistentStore.listDeploymentRecords(); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.post('/api/v121/deployment-records', async (req, res) => {
  try { const record = await persistentStore.createDeploymentRecord({ ...(req.body || {}), version: (req.body && req.body.version) || pkg.version }); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});

app.get('/api/v121/backup-checkpoints', async (req, res) => {
  try { const records = await persistentStore.listBackupCheckpoints(); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.post('/api/v121/backup-checkpoints', async (req, res) => {
  try { const record = await persistentStore.createBackupCheckpoint(req.body || {}); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});

app.get('/api/v121/launch-events', async (req, res) => {
  try { const records = await persistentStore.listProductionLaunchEvents(); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.post('/api/v121/launch-events', async (req, res) => {
  try { const record = await persistentStore.createProductionLaunchEvent(req.body || {}); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});


function v122CredentialGates() {
  return [
    { key: 'database', label: 'PostgreSQL DATABASE_URL', ok: !!process.env.DATABASE_URL, required: true },
    { key: 'session_secret', label: 'SESSION_SECRET', ok: !!process.env.SESSION_SECRET, required: true },
    { key: 'stripe', label: 'Stripe checkout + webhook secret', ok: !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET), required: true },
    { key: 'storage', label: 'Object storage bucket', ok: !!(process.env.OBJECT_STORAGE_BUCKET || process.env.S3_BUCKET), required: true },
    { key: 'email', label: 'SMTP email sender', ok: !!(process.env.SMTP_HOST && process.env.SMTP_USER), required: true },
    { key: 'internal_calendar', label: 'EnglishLegalese internal calendar/source of truth', ok: true, required: true },
    { key: 'manual_classroom_link', label: 'Manual/regional classroom link fallback', ok: true, required: true },
    { key: 'google_meet', label: 'Google Calendar/Meet credentials where accessible', ok: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET), required: false },
    { key: 'zoom', label: 'Zoom alternate provider', ok: !!(process.env.ZOOM_ACCOUNT_ID && process.env.ZOOM_CLIENT_ID && process.env.ZOOM_CLIENT_SECRET), required: false },
    { key: 'openai', label: 'Server-side SmartTeacher AI', ok: !!process.env.OPENAI_API_KEY, required: true },
    { key: 'owner', label: 'Owner/admin account bootstrap values', ok: !!(process.env.OWNER_EMAIL && process.env.OWNER_NAME), required: true }
  ];
}

app.get('/api/v122/seamless-readiness', async (req, res) => {
  const persistence = await persistentStore.health();
  const gates = v122CredentialGates();
  const blockers = gates.filter(g => g.required && !g.ok);
  const [sessions, bookings, closeouts, staffTasks, marketingAssets, supportThreads, readinessReviews] = await Promise.all([
    persistentStore.listClassSessions().catch(()=>[]),
    persistentStore.listBookingRequests().catch(()=>[]),
    persistentStore.listSessionCloseouts().catch(()=>[]),
    persistentStore.listStaffTasks().catch(()=>[]),
    persistentStore.listTeacherMarketingAssets().catch(()=>[]),
    persistentStore.listSupportThreads().catch(()=>[]),
    persistentStore.listClassroomReadinessReviews().catch(()=>[])
  ]);
  res.json({
    ok: true,
    version: VERSION,
    persistence_mode: persistence.mode,
    launch_ready_for_real_users: blockers.length === 0 && persistence.mode === 'postgres',
    gates,
    blockers: blockers.map(b => ({ key: b.key, label: b.label })),
    operating_counts: {
      class_sessions: sessions.length,
      booking_requests: bookings.length,
      session_closeouts: closeouts.length,
      staff_tasks: staffTasks.length,
      teacher_marketing_assets: marketingAssets.length,
      support_threads: supportThreads.length,
      classroom_readiness_reviews: readinessReviews.length
    },
    next_staff_action: blockers.length ? 'Configure missing production gates before onboarding real paid classroom users.' : 'Run manual smoke tests, create a backup checkpoint, then launch a controlled private beta.',
    simple_flow: ['start', 'package_or_credits', 'teacher_match', 'schedule', 'video_classroom', 'saved_work_homework_exams', 'report', 'payout_or_renewal']
  });
});

app.get('/api/v122/role-journey-events', async (req, res) => {
  try { const records = await persistentStore.listRoleJourneyEvents(); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.post('/api/v122/role-journey-events', async (req, res) => {
  try { const record = await persistentStore.createRoleJourneyEvent(req.body || {}); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});

app.get('/api/v122/classroom-readiness-reviews', async (req, res) => {
  try { const records = await persistentStore.listClassroomReadinessReviews(); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.post('/api/v122/classroom-readiness-reviews', async (req, res) => {
  try { const record = await persistentStore.createClassroomReadinessReview(req.body || {}); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});

app.get('/api/v122/teacher-marketing-assets', async (req, res) => {
  try { const records = await persistentStore.listTeacherMarketingAssets(); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.post('/api/v122/teacher-marketing-assets', async (req, res) => {
  try { const record = await persistentStore.createTeacherMarketingAsset(req.body || {}); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});

app.get('/api/v122/support-threads', async (req, res) => {
  try { const records = await persistentStore.listSupportThreads(); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.post('/api/v122/support-threads', async (req, res) => {
  try { const record = await persistentStore.createSupportThread(req.body || {}); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});


async function v123OperatingSummary() {
  const [actions, videoEvents, aiInteractions, attributions, readinessReviews, supportThreads, marketingAssets, classSessions, homework, closeouts] = await Promise.all([
    persistentStore.listActionCenterItems().catch(()=>[]),
    persistentStore.listVideoRoomEvents().catch(()=>[]),
    persistentStore.listAiTutorInteractions().catch(()=>[]),
    persistentStore.listMarketingLeadAttribution().catch(()=>[]),
    persistentStore.listClassroomReadinessReviews().catch(()=>[]),
    persistentStore.listSupportThreads().catch(()=>[]),
    persistentStore.listTeacherMarketingAssets().catch(()=>[]),
    persistentStore.listClassSessions().catch(()=>[]),
    persistentStore.listHomeworkAssignments().catch(()=>[]),
    persistentStore.listSessionCloseouts().catch(()=>[])
  ]);
  const openActions = actions.filter(a => String(a.status || '').toLowerCase() !== 'completed');
  const unresolvedVideo = videoEvents.filter(e => !['ready','completed','joined'].includes(String(e.status || '').toLowerCase()));
  const pendingAttribution = attributions.filter(a => !String(a.conversion_status || '').includes('paid'));
  return {
    source_of_truth: 'one EnglishLegalese class/session/action record chain',
    counts: {
      action_center_items: actions.length,
      open_actions: openActions.length,
      video_room_events: videoEvents.length,
      unresolved_video_events: unresolvedVideo.length,
      ai_tutor_interactions: aiInteractions.length,
      marketing_lead_attribution: attributions.length,
      pending_marketing_attribution: pendingAttribution.length,
      classroom_readiness_reviews: readinessReviews.length,
      support_threads: supportThreads.length,
      teacher_marketing_assets: marketingAssets.length,
      class_sessions: classSessions.length,
      homework_assignments: homework.length,
      session_closeouts: closeouts.length
    },
    next_staff_priority: openActions[0]?.next_action || unresolvedVideo[0]?.notes || 'Clear the highest revenue or trust blocker before adding more leads.',
    simple_operating_loop: ['capture lead','sell package or credits','match teacher','confirm calendar and video','teach class','save homework and AI practice','refresh report','review payout and renewal']
  };
}

app.get('/api/v123/operating-console', async (req, res) => {
  try { res.json({ ok: true, version: VERSION, summary: await v123OperatingSummary() }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.get('/api/v123/action-center', async (req, res) => {
  try { const records = await persistentStore.listActionCenterItems(); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.post('/api/v123/action-center', async (req, res) => {
  try { const record = await persistentStore.createActionCenterItem(req.body || {}); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});

app.get('/api/v123/video-room-events', async (req, res) => {
  try { const records = await persistentStore.listVideoRoomEvents(); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.post('/api/v123/video-room-events', async (req, res) => {
  try { const record = await persistentStore.createVideoRoomEvent(req.body || {}); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});

app.get('/api/v123/ai-tutor-interactions', async (req, res) => {
  try { const records = await persistentStore.listAiTutorInteractions(); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.post('/api/v123/ai-tutor-interactions', async (req, res) => {
  try { const record = await persistentStore.createAiTutorInteraction(req.body || {}); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});

app.get('/api/v123/marketing-attribution', async (req, res) => {
  try { const records = await persistentStore.listMarketingLeadAttribution(); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.post('/api/v123/marketing-attribution', async (req, res) => {
  try { const record = await persistentStore.createMarketingLeadAttribution(req.body || {}); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});


function v124AiEraSeed() {
  return {
    positioning: {
      headline: 'Legal English training for the AI era',
      core_message: 'AI can translate words. EnglishLegalese helps people understand, explain, write, negotiate, review, and work in Legal English with confidence.',
      not_legal_advice: true,
      not_certified_translation: true,
      not_court_interpretation: true
    },
    required_strategy: [
      'Practice with AI. Improve with teachers.',
      'Build the legal-English skills AI translators cannot replace.',
      'Use AI tools intelligently without relying on them blindly.',
      'Protect confidential, privileged, sensitive, and client-identifying information.',
      'Know when teacher, employer, attorney, certified translator, court interpreter, or qualified professional review is needed.'
    ],
    curriculum_tracks: [
      'Legal English Foundations',
      'Contracts and Business Documents',
      'Legal Writing and Email',
      'Meetings, Negotiations, and Client Calls',
      'Legal Workplace English',
      'AI Translator Safety for Legal and Business English',
      'Legal English for LL.M. / Law School / International Students',
      'Professional Area Legal-English Modules'
    ],
    role_outcomes: {
      student: ['speaking confidence', 'legal writing practice', 'AI translator safety', 'professional tone', 'teacher review workflow'],
      teacher: ['assign AI safety exercises', 'review AI practice logs', 'generate teacher-approved lesson plans', 'market approved AI-era Legal English expertise'],
      employer: ['attendance', 'completion', 'skill readiness', 'AI translation risk reduction', 'privacy-safe summaries', 'renewal recommendations'],
      staff: ['AI boundary review', 'teacher marketing approval', 'employer privacy checks', 'certificate/report queue', 'student items needing teacher review']
    }
  };
}

app.get('/api/v124/ai-era-strategy', async (req, res) => {
  try {
    const [modules, exercises, dashboardSignals, marketingAssets] = await Promise.all([
      persistentStore.listAiEraCurriculumModules().catch(()=>[]),
      persistentStore.listAiTranslatorSafetyExercises().catch(()=>[]),
      persistentStore.listAiEraDashboardSignals(req.query.role || null).catch(()=>[]),
      persistentStore.listAiEraMarketingAssets().catch(()=>[])
    ]);
    res.json({
      ok: true,
      version: VERSION,
      seed: v124AiEraSeed(),
      counts: {
        ai_era_curriculum_modules: modules.length,
        ai_translator_safety_exercises: exercises.length,
        ai_era_dashboard_signals: dashboardSignals.length,
        ai_era_marketing_assets: marketingAssets.length
      },
      records: { modules, exercises, dashboard_signals: dashboardSignals, marketing_assets: marketingAssets },
      next_staff_action: 'Verify that homepage, dashboards, teacher tools, employer reports, SmartTeacher AI prompts, curriculum, certificates, and marketing assets all answer the AI-translator objection without overpromising.'
    });
  } catch (error) {
    res.status(500).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.get('/api/v124/curriculum-modules', async (req, res) => {
  try { const records = await persistentStore.listAiEraCurriculumModules(); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.post('/api/v124/curriculum-modules', async (req, res) => {
  try { const record = await persistentStore.createAiEraCurriculumModule(req.body || {}); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});

app.get('/api/v124/ai-translator-safety-exercises', async (req, res) => {
  try { const records = await persistentStore.listAiTranslatorSafetyExercises(); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.post('/api/v124/ai-translator-safety-exercises', async (req, res) => {
  try { const record = await persistentStore.createAiTranslatorSafetyExercise(req.body || {}); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});

app.get('/api/v124/dashboard-signals', async (req, res) => {
  try { const records = await persistentStore.listAiEraDashboardSignals(req.query.role || null); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.post('/api/v124/dashboard-signals', async (req, res) => {
  try { const record = await persistentStore.createAiEraDashboardSignal(req.body || {}); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});

app.get('/api/v124/ai-era-marketing-assets', async (req, res) => {
  try { const records = await persistentStore.listAiEraMarketingAssets(); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});

app.post('/api/v124/ai-era-marketing-assets', async (req, res) => {
  try { const record = await persistentStore.createAiEraMarketingAsset(req.body || {}); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});


function v125OperatingSeed() {
  return {
    headline: 'Practice with AI. Improve with teachers. Prove progress safely.',
    operating_flow: [
      'Choose a real-world legal-English goal',
      'Practice with SmartTeacher AI using safe or anonymized language',
      'Save the practice to the lesson folder',
      'Send important items to a human teacher for review',
      'Use teacher feedback in class, homework, exams, reports, and certificates',
      'Show employers privacy-safe progress, not private drafts by default'
    ],
    ai_translator_objection_answer: 'AI translation is useful, but high-stakes legal and business communication still requires judgment, tone, context, confidentiality awareness, speaking confidence, writing skill, and the ability to review AI output safely.',
    daily_owner_checks: [
      'Are paid learners moving from AI practice into teacher-reviewed progress?',
      'Are employer reports showing AI translator safety and professional communication ROI?',
      'Are teacher marketing claims approved and attribution tracked?',
      'Are privacy/confidentiality warnings visible before AI/upload use?',
      'Are live classes tied to saved work, homework, exams, reports, credits, and payouts?'
    ]
  };
}

app.get('/api/v125/ai-era-operating-brief', async (req, res) => {
  try {
    const [plans, handoffs, roi, checks] = await Promise.all([
      persistentStore.listAiEraPathwayPlans(req.query.role || null).catch(()=>[]),
      persistentStore.listTeacherReviewHandoffs(req.query.review_status || null).catch(()=>[]),
      persistentStore.listEmployerRoiSnapshots().catch(()=>[]),
      persistentStore.listConfidentialityChecks(req.query.status || null).catch(()=>[])
    ]);
    res.json({
      ok: true,
      version: VERSION,
      seed: v125OperatingSeed(),
      counts: {
        ai_era_pathway_plans: plans.length,
        teacher_review_handoffs: handoffs.length,
        employer_roi_snapshots: roi.length,
        confidentiality_checks: checks.length
      },
      records: { pathway_plans: plans, teacher_review_handoffs: handoffs, employer_roi_snapshots: roi, confidentiality_checks: checks },
      next_staff_action: 'Check that every AI practice item has a clear next step: save, continue, ask teacher to review, add to homework, or create employer-safe summary.'
    });
  } catch (error) {
    res.status(500).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.get('/api/v125/pathway-plans', async (req, res) => {
  try { const records = await persistentStore.listAiEraPathwayPlans(req.query.role || null); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});
app.post('/api/v125/pathway-plans', async (req, res) => {
  try { const record = await persistentStore.createAiEraPathwayPlan(req.body || {}); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});

app.get('/api/v125/teacher-review-handoffs', async (req, res) => {
  try { const records = await persistentStore.listTeacherReviewHandoffs(req.query.status || null); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});
app.post('/api/v125/teacher-review-handoffs', async (req, res) => {
  try { const record = await persistentStore.createTeacherReviewHandoff(req.body || {}); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});

app.get('/api/v125/employer-roi-snapshots', async (req, res) => {
  try { const records = await persistentStore.listEmployerRoiSnapshots(); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});
app.post('/api/v125/employer-roi-snapshots', async (req, res) => {
  try { const record = await persistentStore.createEmployerRoiSnapshot(req.body || {}); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});

app.get('/api/v125/confidentiality-checks', async (req, res) => {
  try { const records = await persistentStore.listConfidentialityChecks(req.query.status || null); res.json({ ok: true, version: VERSION, count: records.length, records }); }
  catch (error) { res.status(500).json({ ok: false, version: VERSION, error: error.message }); }
});
app.post('/api/v125/confidentiality-checks', async (req, res) => {
  try { const record = await persistentStore.createConfidentialityCheck(req.body || {}); res.status(201).json({ ok: true, version: VERSION, record }); }
  catch (error) { res.status(400).json({ ok: false, version: VERSION, error: error.message }); }
});


function v126IntegratedProductFlowSeed() {
  return {
    version_focus: 'AI-era integrated product flow',
    headline: 'Legal English training for the AI era.',
    core_message: 'AI can translate words. EnglishLegalese helps people understand, explain, write, negotiate, review, and work in Legal English with confidence.',
    journey: [
      'Student chooses a real-world legal-English goal',
      'Student practices with SmartTeacher AI using safe or anonymized language',
      'Student saves useful practice to the lesson folder',
      'Teacher reviews important AI practice and assigns live/human feedback',
      'Classroom, homework, assessment, report, certificate, credit, and payout records stay connected',
      'Employer receives privacy-safe progress and ROI summaries without private drafts by default',
      'Staff clears trust, privacy, marketing, scheduling, payment, report, certificate, and payout blockers'
    ],
    role_next_actions: {
      student: 'Practice safely, save work, and bring important language to a teacher.',
      teacher: 'Review AI practice, assign translation-risk homework, teach live, close out class, and generate report notes.',
      employer: 'Review privacy-safe progress, AI translator safety, professional tone, meeting confidence, and recommended next training.',
      staff: 'Clear blockers for payment, schedule, video, teacher review, confidentiality, reports, certificates, payouts, and teacher marketing claims.',
      owner: 'Protect margin, trust, data preservation, platform-controlled pricing, and production readiness.'
    },
    safety_boundaries: [
      'Education and Legal English communication training only',
      'Not legal advice, a law firm, certified translation, court interpretation, or final authority on legal meaning',
      'Do not paste confidential, privileged, sensitive, or client-identifying information into AI tools unless authority and platform privacy/security terms clearly allow it',
      'Important legal/business language should receive teacher or qualified professional review when stakes are high',
      'Employer reports are privacy-safe by default and do not expose private student drafts automatically'
    ],
    production_guardrails: [
      'Code-only deploys must not wipe live data',
      'No live secrets in the ZIP',
      'Use environment variables for production credentials',
      'Run additive migrations only',
      'Run predeploy, production readiness, live integration, and v1.26 verification checks'
    ]
  };
}

app.get('/api/v126/integrated-product-flow', async (req, res) => {
  try {
    const [plans, handoffs, roi, checks] = await Promise.all([
      persistentStore.listAiEraPathwayPlans(req.query.role || null).catch(()=>[]),
      persistentStore.listTeacherReviewHandoffs(req.query.review_status || null).catch(()=>[]),
      persistentStore.listEmployerRoiSnapshots().catch(()=>[]),
      persistentStore.listConfidentialityChecks(req.query.status || null).catch(()=>[])
    ]);
    res.json({
      ok: true,
      version: VERSION,
      seed: v126IntegratedProductFlowSeed(),
      counts: {
        ai_era_pathway_plans: plans.length,
        teacher_review_handoffs: handoffs.length,
        employer_roi_snapshots: roi.length,
        confidentiality_checks: checks.length
      },
      records: { pathway_plans: plans, teacher_review_handoffs: handoffs, employer_roi_snapshots: roi, confidentiality_checks: checks },
      next_staff_action: 'Confirm every role has one clear AI-era next step and that privacy, teacher review, employer-safe reporting, platform pricing, and data preservation rules remain intact.'
    });
  } catch (error) {
    res.status(500).json({ ok: false, version: VERSION, error: error.message });
  }
});


function v127SimplicityFlowSeed() {
  return {
    version_focus: 'AI-era simplicity and conversion flow',
    headline: 'Legal English training for the AI era.',
    direct_objection_answer: 'AI can translate words, but legal and business professionals still need judgment, context, confidentiality awareness, professional tone, speaking confidence, writing skill, document fluency, and the ability to review AI output safely.',
    four_role_start: {
      student: 'Choose one real-world goal, practice safely with SmartTeacher AI, save useful work, and bring important language to a teacher.',
      teacher: 'Review AI practice, assign translation-risk homework, teach live classes, close out sessions, and use approved marketing links.',
      employer: 'Train teams beyond translation with privacy-safe reporting, AI translator safety progress, professional tone, meeting confidence, and renewal recommendations.',
      staff_owner: 'Clear revenue, scheduling, video, privacy, teacher review, report, certificate, payout, teacher marketing, and production-readiness blockers.'
    },
    session_spine: [
      'Goal selected',
      'Safe SmartTeacher AI practice',
      'Lesson folder save',
      'Teacher review handoff',
      'Calendar invite and Google Meet or Zoom classroom',
      'Attendance, homework, saved work, assessment, and closeout',
      'Student report, employer-safe report, certificate status, credit deduction, payout review, and renewal/top-up'
    ],
    dashboard_rules: [
      'Each dashboard should show one obvious next best action first',
      'Student dashboards should connect AI practice to teacher review and progress proof',
      'Teacher dashboards should connect AI practice review to assignments, live class, closeout, reports, payouts, and approved marketing',
      'Employer dashboards should show ROI without exposing private drafts or sensitive uploads by default',
      'Owner/staff dashboards should prioritize blockers that affect revenue, trust, class readiness, privacy, reports, certificates, and payouts'
    ],
    classroom_video_rules: [
      'EnglishLegalese internal calendar remains the source of truth',
      'Google Meet remains the default classroom link and Zoom remains an approved alternate',
      'Every class should show time zone, roster, teacher, credit status, video link, saved work, homework, attendance, report status, and payout dependency',
      'Recording stays off by default and requires clear consent from all participants'
    ],
    trust_boundaries: [
      'Education and Legal English communication training only',
      'Not a law firm, not legal advice, not certified translation, not court interpretation, not final authority on legal meaning',
      'Do not paste confidential, privileged, sensitive, or client-identifying information into AI tools unless authorized and allowed by platform privacy/security terms',
      'Important legal/business language should receive teacher or qualified professional review when stakes are high',
      'No live secrets in the ZIP and no destructive production data changes'
    ]
  };
}


function v128BenchmarkPricingSeed() {
  return {
    version_focus: 'University benchmark pricing and curriculum flow',
    benchmark_summary: 'Major U.S. law schools and LL.M. programs often sit in a tens-of-thousands tuition band, while EnglishLegalese should stay affordable, modular, online/hybrid, AI-era, and performance-focused rather than imitating a university degree.',
    public_price_positioning: [
      'Keep the free diagnostic and low-friction assessment entry point',
      'Keep core private packages under $1,000 where possible',
      'Add optional structured cohorts and LL.M.-prep sprints in the $395 to $1,995 range',
      'Keep employer packages credit-based and easier to buy than university custom programs',
      'Do not claim to be a law school, LL.M., legal degree, certified translation, or legal advice provider'
    ],
    benchmark_inspired_modules: [
      'U.S. Legal System and Law School Readiness',
      'Case Reading and Class Discussion',
      'Legal Research and Writing Language Skills',
      'Contracts and Business Documents',
      'Professional Legal Emails and Client Updates',
      'Meetings, Negotiations, and Client Calls',
      'TOLES-style Legal English Assessment Prep',
      'AI Translator Safety and Legal-English Judgment'
    ],
    differentiation: [
      'Lower cost than major university programs',
      'No campus relocation required',
      'Live teachers plus SmartTeacher AI practice',
      'Employer-safe reporting and credit tracking',
      'Direct answer to the AI-translator objection',
      'Legal English performance training, not generic ESL and not simple translation'
    ]
  };
}

app.get('/api/v128/benchmark-pricing', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    seed: v128BenchmarkPricingSeed(),
    recommended_price_bands: {
      diagnostic: '$0',
      ai_practice: '$29–$49/month',
      assessment_lesson: '$95–$150',
      five_private_lessons: '$495–$695',
      ten_private_lessons: '$895–$1,195',
      structured_group_cohort: '$395–$995 per learner',
      llm_prep_sprint: '$995–$1,995',
      employer_credits: '$85–$110 per credit depending on volume and service level'
    },
    next_staff_action: 'Use the benchmark page to explain that EnglishLegalese is deliberately below major university pricing while adding AI-era practice, teacher review, dashboards, and employer-safe reports.'
  });
});

app.get('/api/v127/simplicity-flow', async (req, res) => {
  try {
    const [plans, handoffs, roi, checks] = await Promise.all([
      persistentStore.listAiEraPathwayPlans(req.query.role || null).catch(()=>[]),
      persistentStore.listTeacherReviewHandoffs(req.query.review_status || null).catch(()=>[]),
      persistentStore.listEmployerRoiSnapshots().catch(()=>[]),
      persistentStore.listConfidentialityChecks(req.query.status || null).catch(()=>[])
    ]);
    res.json({
      ok: true,
      version: VERSION,
      seed: v127SimplicityFlowSeed(),
      counts: {
        ai_era_pathway_plans: plans.length,
        teacher_review_handoffs: handoffs.length,
        employer_roi_snapshots: roi.length,
        confidentiality_checks: checks.length
      },
      records: { pathway_plans: plans, teacher_review_handoffs: handoffs, employer_roi_snapshots: roi, confidentiality_checks: checks },
      next_staff_action: 'Open the v1.27 command center and clear the highest-value blocker first: payment, scheduling, video, privacy, teacher review, report, certificate, payout, teacher marketing, or production readiness.'
    });
  } catch (error) {
    res.status(500).json({ ok: false, version: VERSION, error: error.message });
  }
});


function v129UniversityBenchmarkIntegrationSeed() {
  return {
    version_focus: 'University benchmark integration and practical course catalog',
    positioning: 'Use Columbia, Harvard, NYU, Georgetown, and major LL.M. programs as credibility and curriculum benchmarks, not as price targets. EnglishLegalese remains Legal English performance training for the AI era, not a law school or legal service.',
    benchmark_price_signals: [
      { benchmark: 'U.S. private law-school LL.M. tuition average signal', approximate: '$59,570', use: 'Broad tuition band comparison; stay far below this for individual practical training.' },
      { benchmark: 'U.S. in-state public law-school LL.M. tuition average signal', approximate: '$32,040', use: 'Even public tuition is far above EnglishLegalese core packages.' },
      { benchmark: 'Harvard LL.M. tuition signal', approximate: '$80,760', use: 'Premium prestige benchmark only; do not copy price.' },
      { benchmark: 'NYU Law all-in annual budget signal', approximate: '$123,000+', use: 'Employer ROI contrast: train teams for a fraction of one university year.' },
      { benchmark: 'Columbia Law benchmark', approximate: 'elite LL.M./graduate legal studies benchmark; do not quote unverified standalone Legal English price', use: 'Mention as competitor/aspirational benchmark without unsupported price claims.' }
    ],
    recommended_offer_ladder: {
      free_diagnostic: '$0',
      ai_practice: '$29–$49/month',
      assessment_lesson: '$95–$150',
      core_private_packages: '$495–$1,195',
      foundations_cohort: '$395–$795',
      llm_readiness_sprint: '$995–$1,995',
      professional_intensive: '$1,495–$2,995',
      employer_credits: '$2,250–$4,250+ launch packages'
    },
    course_catalog: [
      'Legal English Foundations',
      'U.S. Legal System Readiness',
      'Case Reading and Class Discussion',
      'Legal Writing and Professional Email',
      'Contracts and Business Documents',
      'Meetings, Negotiations, and Client Calls',
      'TOLES-style Practical Legal English',
      'AI Translator Safety Lab'
    ],
    safeguards: [
      'Do not claim EnglishLegalese is Columbia, Harvard, NYU, Georgetown, an LL.M., a law school, a legal service, certified translation, or court interpretation',
      'Do not provide legal advice or final legal meaning',
      'Keep employer reports privacy-safe by default',
      'Keep teacher marketing claims approved and platform-controlled',
      'Do not add live secrets or destructive migrations'
    ],
    next_staff_action: 'Use this benchmark integration to refine pricing, course pages, teacher marketing assets, employer proposals, FAQs, SmartTeacher responses, and owner/staff sales scripts.'
  };
}

app.get('/api/v129/university-benchmark-integration', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    seed: v129UniversityBenchmarkIntegrationSeed(),
    comparison_message: 'EnglishLegalese is deliberately below university pricing while adapting useful law-school and legal-English program ideas into practical, teacher-reviewed, AI-supported modules.',
    product_flow: [
      'Free diagnostic',
      'SmartTeacher AI practice',
      'Assessment lesson',
      'Cohort / private package / LL.M. readiness sprint / professional intensive',
      'Teacher review and classroom work',
      'Progress report, certificate, employer-safe ROI summary, renewal or top-up'
    ]
  });
});


function v130SmartTeacherFlowSeed() {
  return {
    version_focus: 'SmartTeacher AI brand lock and seamless role workflow',
    positioning: 'EnglishLegalese is Legal English training for the AI era. SmartTeacher AI is the official AI practice teacher, not a generic chatbot, legal adviser, certified translator, court interpreter, or replacement for live teachers.',
    core_promise: 'Practice with SmartTeacher AI. Improve with live teachers. Prove progress safely.',
    ai_translator_objection_answer: 'AI can translate words, but professionals still need judgment, context, confidentiality awareness, professional tone, speaking confidence, writing skill, document fluency, and the ability to review AI output safely.',
    official_smartteacher_roles: [
      'student practice teacher',
      'teacher preparation assistant',
      'homework and lesson-folder helper',
      'AI translator safety practice partner',
      'employer-safe report drafting assistant',
      'staff/owner operating assistant'
    ],
    seamless_workflow: [
      'Choose role and goal',
      'Run Legal English diagnostic or employer/team intake',
      'Recommend package or course track without university-price confusion',
      'Practice safely with SmartTeacher AI using non-confidential or anonymized text',
      'Save useful work to the lesson folder',
      'Send important language to teacher review',
      'Schedule Google Meet by default or Zoom as alternate',
      'Run class with before/during/after closeout',
      'Update homework, exams, reports, certificates, credits, payout, and renewal/top-up cues',
      'Generate employer-safe progress summaries without exposing private drafts by default'
    ],
    role_next_actions: {
      student: 'Start diagnostic, practice with SmartTeacher AI, save work, book class, submit homework, view progress.',
      teacher: 'Review AI practice, assign safe homework, prepare class, teach, close out, generate report draft, track payout.',
      employer: 'Choose team goal, buy seats or credits, schedule group class, view privacy-safe ROI report, renew or top up.',
      staff_owner: 'Clear blockers in order: payment, teacher match, calendar/video link, privacy warning, teacher review, report, certificate, payout, renewal, campaign approval.'
    },
    pricing_guardrail: 'Stay below university and LL.M. pricing. Use university programs as credibility/curriculum benchmarks, not as price targets. Keep launch offers practical and easy to buy.',
    trust_guardrails: [
      'Do not call SmartTeacher AI a lawyer, legal adviser, certified translator, or court interpreter',
      'Do not ask users to paste confidential client information into AI practice unless privacy/security terms and authority are clear',
      'Mark AI outputs as practice drafts that may need teacher or qualified professional review',
      'Keep employer reports privacy-safe unless explicit sharing permission exists',
      'Keep teacher marketing claims approved and platform-controlled',
      'Do not add live secrets or destructive migrations'
    ],
    recommended_build_use: 'Use this object to drive homepage messaging, dashboard next-action cards, SmartTeacher prompts, teacher marketing toolkit, employer proposals, owner/staff operating queues, QA checks, and future continuation prompts.'
  };
}

app.get('/api/v130/smartteacher-flow', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    seed: v130SmartTeacherFlowSeed(),
    product_message: 'SmartTeacher AI is now treated as the official AI practice teacher for Legal English performance training in the AI era.',
    preserved_endpoints: ['/api/v129/university-benchmark-integration', '/api/v128/benchmark-pricing', '/api/v127/simplicity-flow', '/api/v126/integrated-product-flow']
  });
});



function v131TeacherClassroomToolsSeed() {
  return {
    version_focus: 'Built-in teacher classroom tools for online Legal English classrooms',
    positioning: 'EnglishLegalese is Legal English training for the AI era. v1.31 strengthens the live-teacher classroom by giving teachers practical tools while they teach online.',
    ai_translator_objection_answer: 'AI can translate words, but EnglishLegalese trains judgment, context, confidentiality awareness, professional tone, speaking confidence, writing skill, document fluency, and safe AI-output review through SmartTeacher AI plus live teacher oversight.',
    teacher_console_tools: [
      'Agenda Builder',
      'Live Correction Pad',
      'Roleplay Launcher',
      'AI Translation Risk Lens',
      'Vocabulary and Clause Bank',
      'Homework Generator',
      'Closeout Checklist',
      'Privacy Visibility Switch'
    ],
    teacher_workflow: [
      'Before class: review learner goal, saved work, homework, AI practice, privacy labels, calendar/video status, and agenda',
      'During class: use corrections, vocabulary, roleplay, translation-risk exercises, pronunciation notes, and SmartTeacher AI suggestions under teacher control',
      'After class: assign homework, save reviewed work, mark privacy status, draft report note, deduct credit, queue payout dependency, and set next recommendation'
    ],
    role_integration: {
      student: 'Student sees class link, agenda, teacher-approved corrections, homework, SmartTeacher AI practice, report, and one next step.',
      teacher: 'Teacher sees prep checklist, live teaching console, AI practice needing review, closeout blockers, report notes, and payout status.',
      employer: 'Employer sees privacy-safe attendance, module progress, AI translator safety progress, certificates, ROI, and renewal recommendations.',
      staff_owner: 'Owner/staff sees unscheduled paid classes, missing video links, teacher review handoffs, report/certificate queue, payout holds, campaign approvals, and renewals.'
    },
    trust_guardrails: [
      'Teacher tools support education and language training only',
      'SmartTeacher AI suggestions remain teacher-controlled before use in live class',
      'Do not provide legal advice, certified translation, court interpretation, contract review, filing decisions, or final legal meaning',
      'Do not expose private drafts or sensitive uploads to employers by default',
      'Keep recording off unless all participants clearly consent',
      'Do not add live secrets or destructive migrations'
    ],
    recommended_build_use: 'Use this seed to drive teacher dashboard cards, classroom UI, SmartTeacher prompt modes, homework generation, report closeout, privacy labels, staff blocker queues, and mobile/tablet teaching QA.'
  };
}

app.get('/api/v131/teacher-classroom-tools', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    seed: v131TeacherClassroomToolsSeed(),
    product_message: 'v1.31 adds built-in teacher classroom tools so live online classes are easier to prepare, teach, close out, report, and connect to SmartTeacher AI safely.',
    preserved_endpoints: ['/api/v130/smartteacher-flow', '/api/v129/university-benchmark-integration', '/api/v128/benchmark-pricing', '/api/v127/simplicity-flow', '/api/v126/integrated-product-flow']
  });
});


function v132ChatgptOnlySmartTeacherSeed() {
  return {
    version: 'v1.32.0',
    name: 'ChatGPT-Only SmartTeacher AI Governance',
    positioning: 'SmartTeacher AI is the EnglishLegalese AI practice teacher powered by ChatGPT/OpenAI only. EnglishLegalese remains Legal English training for the AI era, not generic English lessons, legal advice, certified translation, or court interpretation.',
    ai_vendor_policy: {
      approved_vendor: 'OpenAI / ChatGPT',
      required_secret: 'OPENAI_API_KEY',
      optional_model_variable: 'SMARTTEACHER_MODEL or OPENAI_MODEL',
      disallowed_runtime_pattern: 'No Gemini, Claude, Grok, Anthropic, Google AI, xAI, or other AI vendor keys should power SmartTeacher in this build.',
      user_facing_name: 'SmartTeacher AI',
      internal_note: 'Use ChatGPT/OpenAI as the single AI vendor behind SmartTeacher, AI tutor, AI teaching assistant, employer-report helper, staff assistant, and marketing assistant modes.'
    },
    smartteacher_modes: [
      'student_legal_english_tutor',
      'teacher_classroom_assistant',
      'teacher_homework_generator',
      'ai_translation_risk_lens',
      'roleplay_partner',
      'employer_safe_report_helper',
      'staff_operations_assistant',
      'teacher_marketing_assistant'
    ],
    role_copy: {
      student: 'Practice with SmartTeacher AI before class, save useful work to your lesson folder, and ask your live teacher to review important language.',
      teacher: 'Use SmartTeacher AI as a ChatGPT-powered teaching assistant for prompts, roleplays, vocabulary, corrections, homework drafts, and employer-safe report notes. The teacher stays in control.',
      employer: 'Your team gets ChatGPT-powered practice plus live teacher review, privacy-safe reporting, and training on when AI translation is not enough.',
      staff_owner: 'Operate one AI vendor relationship, one API key, one policy, one audit lane, and one set of AI boundary messages.'
    },
    trust_language: [
      'SmartTeacher AI is powered by ChatGPT/OpenAI only in this build.',
      'AI output is for Legal English practice, not legal advice or final legal meaning.',
      'Do not paste confidential, privileged, sensitive, or client-identifying information unless platform policy allows it and the user has authority.',
      'Live teachers review important language and help students build judgment, tone, confidence, and safe AI-output review skills.',
      'Employer reports remain privacy-safe and should not expose private drafts or sensitive uploads by default.'
    ],
    operations_checklist: [
      'OPENAI_API_KEY is set server-side only.',
      'No other AI vendor API keys are required or advertised.',
      'SmartTeacher routes use the OpenAI Responses API or safe local fallback when credentials are missing.',
      'AI interactions are logged with configured_provider openai_responses_api or dev_safe_fallback.',
      'All AI screens keep Legal English training boundaries visible.',
      'Teacher classroom tools label SmartTeacher as assistant, not replacement.'
    ],
    preserved_endpoints: ['/api/v131/teacher-classroom-tools', '/api/v130/smartteacher-flow', '/api/v129/university-benchmark-integration', '/api/v128/benchmark-pricing', '/api/v127/simplicity-flow', '/api/v126/integrated-product-flow']
  };
}

app.get('/api/v132/chatgpt-only-smartteacher', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    seed: v132ChatgptOnlySmartTeacherSeed(),
    product_message: 'v1.32 locks SmartTeacher AI to ChatGPT/OpenAI only, using one server-side OpenAI API key and one consistent trust/governance message across students, teachers, employers, staff, owner dashboards, classroom tools, and AI-era Legal English training flows.'
  });
});


function v133GlobalAccessClassroomSeed() {
  return {
    version: 'v1.33.0',
    name: 'Global Access Classroom Stack',
    positioning: 'EnglishLegalese must be easy to access globally. The platform should not depend on Google services because mainland China and some other environments may not reliably reach Google Calendar or Google Meet.',
    source_of_truth: {
      owner: 'EnglishLegalese internal calendar and class_session record',
      rule: 'Every class is created and tracked inside EnglishLegalese first. External video/calendar providers are attached to the class record as provider links, not treated as the system of record.',
      why: 'This keeps students, teachers, employers, owner/staff, credits, homework, reports, payouts, privacy labels, and SmartTeacher AI handoffs working even when a regional provider changes or a service is inaccessible.'
    },
    ai_policy: {
      smartteacher_vendor: 'ChatGPT/OpenAI only',
      required_secret: 'OPENAI_API_KEY',
      note: 'Do not add Gemini/Google AI merely because Google Meet may be used. Meet/Calendar integration is a Workspace provider issue, not a SmartTeacher AI vendor requirement.'
    },
    provider_routing: [
      { provider: 'EnglishLegalese internal calendar', status: 'required', use_for: 'source of truth, class session record, credits, homework, reports, closeout, teacher payout, employer-safe summaries', china_access_note: 'works if EnglishLegalese app hosting/CDN is reachable' },
      { provider: 'Google Meet / Google Calendar', status: 'optional', use_for: 'default where Google services are accessible and convenient', china_access_note: 'do not rely on it for mainland China' },
      { provider: 'Zoom', status: 'optional', use_for: 'general global fallback and many international classes', china_access_note: 'more China-usable than Google but still should not be the only fallback' },
      { provider: 'Microsoft Teams / Outlook', status: 'optional', use_for: 'corporate/employer clients that already use Microsoft', china_access_note: 'use when the client confirms access' },
      { provider: 'Tencent Meeting / VooV Meeting', status: 'optional_manual_or_future_api', use_for: 'China-accessible live classes and Chinese/international learners', china_access_note: 'strong China-friendly option; start with staff-pasted links before API integration' },
      { provider: 'DingTalk', status: 'optional_manual_or_future_api', use_for: 'China-accessible enterprise/school classes', china_access_note: 'use for China-based organizations when appropriate' },
      { provider: 'Manual classroom link', status: 'required_fallback', use_for: 'staff or teacher pastes any approved regional classroom link into the EnglishLegalese class record', china_access_note: 'critical global safety valve' }
    ],
    scheduling_flow: [
      'Create class/session in EnglishLegalese internal calendar first',
      'Detect or select learner/teacher region and employer preference',
      'Choose provider: Google where accessible, Zoom/Teams where suitable, Tencent/VooV or DingTalk for China-accessible classes, manual link when needed',
      'Save provider name, join URL, region note, time zone, recording consent status, and fallback instructions on the class session',
      'Show students one simple Join Class button, not provider complexity',
      'Keep teacher console, SmartTeacher AI practice, homework, reports, credits, and payouts inside EnglishLegalese'
    ],
    user_copy: {
      student: 'Your class link will appear inside EnglishLegalese. We choose a video option that works for your location whenever possible.',
      teacher: 'Teach from the EnglishLegalese classroom console. Use the attached provider link for the live video room, and keep agenda, corrections, homework, privacy labels, and closeout inside EnglishLegalese.',
      employer: 'Your team can train globally. EnglishLegalese keeps the class record, attendance, progress, and privacy-safe reporting in one place while using the video provider that works for each region.',
      staff_owner: 'Do not block a class because Google is unavailable. Use the provider routing board, attach a regional classroom link, verify access before class, and keep EnglishLegalese as the system of record.'
    },
    trust_and_access_rules: [
      'Never require Google login, Google Calendar, or Google Meet to use the core EnglishLegalese platform.',
      'Never make Google Calendar the only calendar source of truth.',
      'Always support manual/regional classroom links for global accessibility.',
      'Recording stays off by default and requires clear participant consent regardless of provider.',
      'Do not expose private drafts, sensitive uploads, or teacher-private notes to employers by default.',
      'Keep SmartTeacher AI ChatGPT-only and server-side.'
    ],
    production_env_guidance: {
      required_for_core_platform: ['DATABASE_URL', 'SESSION_SECRET', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'S3_BUCKET/S3 credentials', 'SMTP credentials', 'OPENAI_API_KEY', 'APP_BASE_URL'],
      optional_provider_credentials: ['GOOGLE_CALENDAR_ID/GOOGLE_CALENDAR_ACCESS_TOKEN', 'ZOOM_ACCOUNT_ID/ZOOM_CLIENT_ID/ZOOM_CLIENT_SECRET', 'MICROSOFT/TEAMS credentials if later automated'],
      manual_provider_fields: ['provider_name', 'join_url', 'region_access_note', 'fallback_join_instructions', 'tested_from_region', 'recording_consent_status']
    },
    preserved_endpoints: ['/api/v132/chatgpt-only-smartteacher', '/api/v131/teacher-classroom-tools', '/api/v130/smartteacher-flow', '/api/v129/university-benchmark-integration', '/api/v128/benchmark-pricing']
  };
}

app.get('/api/v133/global-access-classrooms', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    seed: v133GlobalAccessClassroomSeed(),
    product_message: 'v1.33 makes EnglishLegalese global-access first: internal calendar/class sessions are the source of truth, Google is optional, manual/regional classroom links are always supported, China-accessible provider options are documented, and SmartTeacher AI remains ChatGPT/OpenAI-only.'
  });
});


function v134UniversalCalendarInteropSeed() {
  return {
    version: 'v1.34.0',
    name: 'Universal Calendar Interop + China-Aware Scheduling',
    positioning: 'EnglishLegalese must be easy to schedule globally without requiring Google Calendar. The EnglishLegalese internal calendar/class-session record remains the source of truth; external calendars are convenience adapters and reminders.',
    source_of_truth: {
      owner: 'EnglishLegalese internal calendar and class_session record',
      rule: 'Every class time, time zone, provider link, teacher, learner/cohort, credit status, homework, closeout, report, payout, and privacy status is stored in EnglishLegalese first.',
      reason: 'External calendar systems vary by country, employer, phone, and user preference. EnglishLegalese cannot depend on Google for global access.'
    },
    universal_calendar_layers: [
      { layer: 'In-platform schedule', status: 'required', use_for: 'single source of truth visible to student, teacher, employer, and staff dashboards' },
      { layer: '.ics file download/email', status: 'required fallback', use_for: 'works across many calendar apps without a direct API integration' },
      { layer: 'Add-to-calendar link', status: 'recommended', use_for: 'simple user action from the class page and reminder emails' },
      { layer: 'Outlook / Microsoft 365 calendar', status: 'optional integration', use_for: 'employer clients and China-accessible Microsoft/21Vianet environments where available' },
      { layer: 'Apple Calendar / iCloud calendar', status: 'optional user-side support', use_for: 'students on iPhone/Mac/iPad who can import/subscribe to ICS events' },
      { layer: 'CalDAV-compatible calendar', status: 'future optional connector', use_for: 'open-standard calendar syncing for users or partners that support CalDAV' },
      { layer: 'Google Calendar', status: 'optional integration', use_for: 'markets where Google is accessible and convenient; not required for launch or China users' },
      { layer: 'Tencent/WeCom/DingTalk reminder instructions', status: 'manual now / future regional connector', use_for: 'China learners and organizations that prefer local work apps' },
      { layer: 'Manual reminder instructions', status: 'required fallback', use_for: 'staff can send local-time class details when no calendar integration works reliably' }
    ],
    china_calendar_policy: {
      rule: 'Do not require Google Calendar for China-based users. Show the EnglishLegalese schedule in-platform, send email/SMS/WeChat-style reminder copy where operationally available, include an .ics attachment/link, and allow staff to add regional calendar/reminder instructions.',
      recommended_options: ['EnglishLegalese in-platform schedule', '.ics download or email attachment', 'Outlook/Microsoft 365/Exchange where the user or employer confirms access', 'Apple Calendar/iCloud for Apple users who can receive/import ICS', 'DingTalk or WeCom/Tencent reminders for organizations using those tools', 'manual reminders and staff-confirmed local time'],
      avoid: ['Do not make Google Calendar acceptance required', 'Do not assume Zoom/Google/Outlook works for every China user without confirmation', 'Do not expose confidential student work in calendar descriptions']
    },
    event_payload_fields: [
      'class_session_id', 'title', 'student_or_cohort', 'teacher', 'start_time_utc', 'end_time_utc', 'display_time_zone', 'provider_name', 'join_url', 'fallback_join_instructions', 'calendar_add_link', 'ics_download_url', 'region_access_note', 'recording_consent_status', 'privacy_visibility_label'
    ],
    student_copy: 'Your class time always appears inside EnglishLegalese. You can also add it to your own calendar using an .ics file, Outlook, Apple Calendar, Google Calendar where available, or the regional reminder option your teacher/staff provides.',
    teacher_copy: 'Teach from the EnglishLegalese class record. The external calendar is only a reminder; agenda, corrections, homework, SmartTeacher AI practice, closeout, and reports stay inside EnglishLegalese.',
    employer_copy: 'Your team can train globally without requiring one calendar ecosystem. EnglishLegalese keeps the schedule and reporting together, while learners can use the calendar/reminder option that works in their country.',
    staff_owner_copy: 'Schedule in EnglishLegalese first. Then attach the best calendar/reminder option by region: ICS, Outlook/Microsoft 365, Apple Calendar, Google where available, DingTalk/WeCom instructions, or manual local-time reminders.',
    smartteacher_answer: 'For global access, do not depend on Google Calendar. EnglishLegalese owns the class schedule and can provide ICS, Outlook/Microsoft 365, Apple Calendar, CalDAV, Google optional, and China-aware regional reminder paths. SmartTeacher AI remains ChatGPT/OpenAI-only.',
    preserved_endpoints: ['/api/v133/global-access-classrooms', '/api/v132/chatgpt-only-smartteacher', '/api/v131/teacher-classroom-tools', '/api/v130/smartteacher-flow']
  };
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function toIcsDate(input) {
  const date = input ? new Date(input) : new Date(Date.now() + 24 * 60 * 60 * 1000);
  if (Number.isNaN(date.getTime())) return toIcsDate(null);
  return `${date.getUTCFullYear()}${pad2(date.getUTCMonth() + 1)}${pad2(date.getUTCDate())}T${pad2(date.getUTCHours())}${pad2(date.getUTCMinutes())}${pad2(date.getUTCSeconds())}Z`;
}

function escapeIcs(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

app.get('/api/v134/calendar-interop', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    seed: v134UniversalCalendarInteropSeed(),
    product_message: 'v1.34 makes EnglishLegalese calendar-provider agnostic: the internal calendar is the source of truth, Google Calendar is optional, .ics/Outlook/Apple/CalDAV/regional/manual calendar paths are supported, and China users are not blocked by Google availability.'
  });
});

app.get('/api/v134/calendar/session.ics', (req, res) => {
  const title = req.query.title || 'EnglishLegalese Legal English Class';
  const start = req.query.start || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const end = req.query.end || new Date(new Date(start).getTime() + 60 * 60 * 1000).toISOString();
  const joinUrl = req.query.join_url || req.query.joinUrl || 'Open your EnglishLegalese dashboard for the class link';
  const provider = req.query.provider || 'EnglishLegalese classroom';
  const timezone = req.query.timezone || 'Shown in your EnglishLegalese dashboard';
  const uid = `englishlegalese-${Date.now()}@englishlegalese.com`;
  const description = [
    'Open EnglishLegalese for the official class record, teacher console, homework, SmartTeacher AI practice, privacy labels, and any updated classroom link.',
    `Provider: ${provider}`,
    `Join: ${joinUrl}`,
    `Time zone note: ${timezone}`,
    'EnglishLegalese provides Legal English training only. It is not legal advice, certified translation, or court interpretation.'
  ].join('\n');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EnglishLegalese//Global Access Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${escapeIcs(uid)}`,
    `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcs(title)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    `LOCATION:${escapeIcs(joinUrl)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="englishlegalese-class.ics"');
  res.send(ics);
});



function v135GlobalFirstClassSuccessSeed() {
  return {
    version: 'v1.35.0',
    name: 'Global First-Class Success + Seamless Role Flow',
    positioning: 'EnglishLegalese is Legal English training for the AI era. The product should feel simple for users around the world while owner/staff can manage regional access, calendar/video providers, teacher tools, SmartTeacher AI, payments, credits, reports, and privacy boundaries behind the scenes.',
    design_rule: 'Improve only if it makes the platform simpler, clearer, more trustworthy, easier to operate, easier to teach from, easier to buy, or easier to use globally.',
    first_class_success_flow: [
      { step: '1', name: 'Choose goal', owner: 'student/employer', output: 'legal email, contracts, meetings, client calls, LL.M. readiness, workplace English, AI translator safety, or custom employer training' },
      { step: '2', name: 'Confirm package/credits', owner: 'platform/staff', output: 'paid or trial status, credit ledger, employer seat/cohort if applicable' },
      { step: '3', name: 'Match teacher and region', owner: 'staff/owner', output: 'teacher fit, time zone, learner country, preferred language, provider access note, fallback instructions' },
      { step: '4', name: 'Schedule inside EnglishLegalese', owner: 'platform', output: 'internal class-session record is the source of truth; external calendar/video tools are adapters only' },
      { step: '5', name: 'Attach accessible class link', owner: 'staff/teacher', output: 'Google Meet, Zoom, Teams, Tencent/VooV, DingTalk, or manual approved link; never block class because Google is unavailable' },
      { step: '6', name: 'Prepare with SmartTeacher AI', owner: 'student/teacher', output: 'safe practice, lesson folder items, teacher-review flags, roleplays, vocabulary, AI translation-risk exercises' },
      { step: '7', name: 'Teach live from teacher console', owner: 'teacher', output: 'agenda, live correction pad, roleplay launcher, vocabulary/contract clause bank, AI Translation Risk Lens, homework draft, privacy labels' },
      { step: '8', name: 'Close out and prove progress', owner: 'teacher/staff', output: 'attendance, homework, report note, certificate progress, credit deduction, payout queue, employer-safe summary, renewal/top-up recommendation' }
    ],
    global_access_readiness: {
      source_of_truth: 'EnglishLegalese internal calendar/class-session record',
      required_fallbacks: ['ICS calendar download/email', 'manual classroom link field', 'manual local-time reminder instructions', 'region access note', 'fallback join instructions'],
      optional_video_providers: ['Google Meet where accessible', 'Zoom where appropriate', 'Microsoft Teams for employer/corporate clients', 'Tencent Meeting / VooV for China-friendly classes', 'DingTalk for China organizations', 'manual approved regional link'],
      optional_calendar_adapters: ['Google Calendar where accessible', 'Outlook/Microsoft 365/Exchange', 'Apple Calendar/iCloud', 'CalDAV future connector', 'DingTalk/WeCom/Tencent reminders', 'manual reminders'],
      staff_rule: 'Test access before class when a learner or teacher is in a region where Google, Zoom, or other providers may be unreliable.'
    },
    role_dashboards: {
      student: ['Next class with local time and join button', 'SmartTeacher AI practice before class', 'Lesson folder', 'Homework due', 'Ask teacher to review', 'Progress/certificate status', 'Calendar/reminder option that works in the learner country'],
      teacher: ['Prep checklist', 'Live classroom console', 'AI practice needing review', 'Teaching tools', 'Closeout checklist', 'Report note', 'Payout status', 'Marketing assets and approved outreach'],
      employer: ['Team schedule', 'Attendance/completion', 'AI translator safety progress', 'Meeting confidence', 'Writing/document fluency', 'Privacy-safe summaries', 'ROI and renewal/top-up recommendations'],
      staff_owner: ['Revenue blockers', 'Unscheduled paid classes', 'Teacher match blockers', 'Region/provider access blockers', 'Missing class links', 'Confidentiality flags', 'Teacher review handoffs', 'Reports/certificates due', 'Payout holds', 'Teacher campaign approvals']
    },
    teacher_live_tools: [
      'Agenda Builder',
      'Live Correction Pad',
      'Roleplay Launcher',
      'AI Translation Risk Lens',
      'Vocabulary and Clause Bank',
      'Homework Generator',
      'Closeout Checklist',
      'Privacy Visibility Switch',
      'Employer-safe Summary Draft',
      'Student Next-Step Recommendation'
    ],
    smartteacher_policy: {
      vendor: 'ChatGPT/OpenAI only',
      required_secret: 'OPENAI_API_KEY',
      user_facing_name: 'SmartTeacher AI',
      promise: 'Practice with SmartTeacher AI. Improve with live teachers. Prove progress safely.',
      boundaries: ['Legal English training only', 'not legal advice', 'not certified translation', 'not court interpretation', 'not final legal meaning', 'teacher or qualified professional review for high-stakes language']
    },
    trust_language: [
      'AI can translate words, but professionals still need judgment, context, confidentiality awareness, professional tone, speaking confidence, writing skill, document fluency, and safe AI-output review.',
      'EnglishLegalese provides Legal English education and professional communication training, not legal services.',
      'Do not paste confidential, privileged, sensitive, or client-identifying information into AI tools unless policy allows it and the user has authority.',
      'Employer reports are privacy-safe by default and do not expose private practice text, sensitive uploads, or teacher-private notes unless permission is clear.'
    ],
    recommended_build_use: 'Use this seed for homepage sections, role dashboards, teacher classroom console, SmartTeacher AI prompt modes, staff/owner blocker queues, global access QA, mobile quick actions, and future persistence tables without adding complexity.'
  };
}

app.get('/api/v135/global-first-class-success', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    seed: v135GlobalFirstClassSuccessSeed(),
    product_message: 'v1.35 makes EnglishLegalese easier to use globally by focusing the platform around first-class success: internal schedule as source of truth, provider-agnostic classroom/calendar options, teacher live-class tools, ChatGPT-only SmartTeacher AI, privacy-safe employer reporting, and owner/staff blocker queues.',
    preserved_endpoints: ['/api/v134/calendar-interop', '/api/v133/global-access-classrooms', '/api/v132/chatgpt-only-smartteacher', '/api/v131/teacher-classroom-tools']
  });
});


function v136NativeLanguageSupportSeed() {
  return {
    version: 'v1.36.0',
    name: 'Native-Language Learning Support + Translation Bridge',
    positioning: 'EnglishLegalese remains Legal English training for the AI era. Native-language help is built in as a learning bridge, not as a replacement for Legal English practice, teacher judgment, certified translation, court interpretation, or legal advice.',
    core_rule: 'Students should never get stuck because they do not understand platform instructions, homework, classwork, teacher feedback, SmartTeacher AI output, or administrative next steps. The platform should offer safe, simple explanations in the learner\'s preferred language while guiding them back to Legal English performance.',
    preferred_language_record: {
      fields: ['preferred_explanation_language', 'native_language', 'legal_english_level', 'translation_help_default', 'teacher_visibility_permission', 'employer_visibility_boundary'],
      ux_rule: 'Ask for preferred explanation language during onboarding and keep it editable from the dashboard. Do not assume native language from country.',
      privacy_rule: 'Preferred-language help is private to the learner and teacher/staff as needed; employer reports remain high-level and privacy-safe.'
    },
    student_ux: [
      { feature: 'Explain in my language', use: 'One-tap explanation for classwork, homework, platform steps, feedback, vocabulary, and SmartTeacher AI responses.' },
      { feature: 'Side-by-side Legal English', use: 'Show Legal English on one side and native-language explanation on the other so the student still learns the target wording.' },
      { feature: 'Simple English first', use: 'Offer plain English before native-language explanation when appropriate, especially for intermediate learners.' },
      { feature: 'Back to Legal English', use: 'After native-language help, give a short Legal English practice prompt so the user returns to performance training.' },
      { feature: 'Ask my teacher', use: 'Let the student send confusing language, translated explanation, or AI output to the teacher review queue.' },
      { feature: 'Admin help translation', use: 'Explain billing, scheduling, calendar, class link, homework, certificate, and support instructions in the learner\'s preferred language.' }
    ],
    teacher_tools: [
      'Preferred-language learner profile card',
      'Teacher Translation Bridge for quick class explanations',
      'Side-by-side correction pad: student rough language, native-language explanation, polished Legal English',
      'Vocabulary/false-friend notes by learner language',
      'Homework instructions with optional native-language explanation',
      'Roleplay instructions in plain English plus native-language support',
      'Teacher review flags for AI-translated or machine-translated work',
      'Class closeout checkbox: native-language support used and learner returned to Legal English practice'
    ],
    smartteacher_modes: [
      'Explain this in my language',
      'Explain this in simple English first',
      'Show side-by-side: Legal English + native-language explanation',
      'Translate only enough to help me learn',
      'Check whether this translation may create legal-English risk',
      'Create vocabulary notes in my language and then quiz me in Legal English',
      'Help me ask my teacher a clear question',
      'Explain the platform step in my language'
    ],
    boundaries: [
      'Translation support is for education, comprehension, and platform usability.',
      'It is not certified translation.',
      'It is not court interpretation.',
      'It is not legal advice.',
      'It is not final legal meaning.',
      'High-stakes legal, business, immigration, court, contract, deadline, rights, or filing language requires qualified professional review.',
      'Do not paste confidential, privileged, sensitive, or client-identifying information unless policy allows it and the user has authority.'
    ],
    staff_owner_controls: [
      'Preferred-language support queue',
      'Students stuck on homework/classwork',
      'Students stuck on billing/scheduling/admin instructions',
      'Teacher review needed after translation help',
      'Confidentiality or legal-risk warning shown',
      'Employer-safe reporting boundary preserved',
      'Common confusing platform steps by language',
      'Top languages requested and translation-help usage'
    ],
    employer_reporting: 'Employer reports may say that the learner used language-support tools as part of training progress, but should not expose private translated explanations, student drafts, sensitive uploads, or teacher-private notes by default.',
    global_access_connection: 'This supports global access by making the platform usable for learners who need native-language help, while the official class schedule and learning records remain inside EnglishLegalese.',
    chatgpt_only_policy: 'SmartTeacher AI and native-language explanations use the existing ChatGPT/OpenAI-only AI layer. Do not add separate translation vendors unless later approved for a specific business reason.'
  };
}

app.get('/api/v136/native-language-support', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    seed: v136NativeLanguageSupportSeed(),
    product_message: 'v1.36 adds native-language learning support as a seamless bridge: students can get explanations in their preferred language for classwork, homework, SmartTeacher AI, teacher feedback, and platform/admin steps, while EnglishLegalese keeps the learner moving back to Legal English performance.',
    preserved_endpoints: ['/api/v135/global-first-class-success', '/api/v134/calendar-interop', '/api/v133/global-access-classrooms', '/api/v132/chatgpt-only-smartteacher', '/api/v131/teacher-classroom-tools']
  });
});


function v137GuidedHelpReadinessSeed() {
  return {
    version: 'v1.37.0',
    name: 'Guided Help + Readiness Navigator',
    positioning: 'EnglishLegalese is Legal English training for the AI era. The v1.37 pass makes the platform feel easier for every user by giving each screen a clear next action and a clear help path when the user is confused.',
    core_rule: 'Every student, teacher, employer, and staff/admin screen should answer: What is my next best action, and what do I do if I am stuck?',
    guided_help_actions: [
      { action: 'Simple English', purpose: 'Explain instructions, corrections, homework, classwork, or platform steps in plain English before escalating.' },
      { action: 'Explain in my language', purpose: 'Use the learner preferred explanation language when plain English is not enough.' },
      { action: 'Show side-by-side', purpose: 'Display Legal English, plain-English meaning, native-language explanation, and a short return-to-practice prompt.' },
      { action: 'Ask my teacher', purpose: 'Save the confusing item to the lesson folder and route it to teacher review.' },
      { action: 'Contact support', purpose: 'Route billing, scheduling, login, classroom link, calendar/reminder, certificate, or payment-status problems to staff.' },
      { action: 'Back to Legal English', purpose: 'After help is given, move the learner back to Legal English practice so the product remains training, not simple translation.' }
    ],
    role_action_rails: {
      student: ['Next class local time', 'Join class', 'Practice with SmartTeacher AI', 'Homework due', 'Explain', 'Ask teacher', 'Support'],
      teacher: ['Prepare class', 'Teach live', 'Review AI practice', 'Use Translation Bridge', 'Assign homework', 'Close out class', 'Report note', 'Payout status'],
      employer: ['Team schedule', 'Attendance/progress', 'AI translator safety progress', 'Certificates', 'Privacy-safe summary', 'Training ROI', 'Add learners/buy credits'],
      staff_owner: ['Paid unscheduled classes', 'Teacher match blockers', 'Region/provider access issues', 'Language-help flags', 'Teacher review handoffs', 'Reports/certificates due', 'Payout holds', 'Renewals/top-ups']
    },
    routing_rules: [
      'Learning confusion goes to Simple English, preferred-language explanation, lesson folder, and teacher review.',
      'Platform/admin confusion goes to preferred-language support text and staff support routing.',
      'Classroom access confusion goes to region-aware provider link, calendar/reminder fallback, and staff readiness check.',
      'Employer questions go to privacy-safe progress/ROI language, not private student drafts or sensitive uploads.',
      'High-stakes legal/business language gets teacher review and qualified professional review warnings where appropriate.'
    ],
    preserved_systems: [
      'Native-Language Learning Support + Translation Bridge',
      'Global first-class success flow',
      'Universal calendar interop and ICS endpoint',
      'Global-access classroom/video provider stack',
      'ChatGPT/OpenAI-only SmartTeacher AI',
      'Built-in teacher classroom tools',
      'Teacher marketing toolkit',
      'University benchmark pricing/course catalog',
      'Privacy-safe employer reporting',
      'Owner/staff blocker queues'
    ],
    trust_boundaries: [
      'EnglishLegalese is Legal English education and professional communication training.',
      'Native-language help is a learning bridge, not certified translation or court interpretation.',
      'SmartTeacher AI is ChatGPT/OpenAI-only and is for practice, explanation, roleplay, and teacher handoffs.',
      'The platform does not provide legal advice, legal services, contract review, court interpretation, certified translation, or final legal meaning.',
      'Employer reports remain privacy-safe by default.'
    ],
    build_guidance: 'Use this seed to create dashboard action rails, student help buttons, teacher review queues, staff support routing, SmartTeacher AI prompt modes, classroom readiness checks, and support analytics without adding unnecessary complexity.'
  };
}

app.get('/api/v137/guided-help-readiness', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    seed: v137GuidedHelpReadinessSeed(),
    product_message: 'v1.37 adds a Guided Help + Readiness Navigator so every role has a clear next action and every confused user can get simple English, native-language explanation, teacher review, staff support, and a return-to-Legal-English practice path.',
    preserved_endpoints: ['/api/v136/native-language-support', '/api/v135/global-first-class-success', '/api/v134/calendar-interop', '/api/v133/global-access-classrooms', '/api/v132/chatgpt-only-smartteacher', '/api/v131/teacher-classroom-tools']
  });
});


function v138AiEraActionLayerSeed() {
  return {
    version: 'v1.38.0',
    name: 'AI-Era Action Layer',
    positioning: 'EnglishLegalese is Legal English performance training for the AI era. AI can translate words, but professionals still need judgment, context, confidentiality awareness, professional tone, speaking confidence, writing skill, document fluency, and the ability to review AI output safely.',
    core_rule: 'Preserve the v1.37 Guided Help + Readiness Navigator and make every role see a clearer action rail: practice safely, get unstuck, route to the right human or support path, prove progress, and renew/top up without exposing private content.',
    student_proof_loop: [
      { step: 'Choose goal', output: 'legal emails, contracts, meetings, client calls, LL.M. readiness, workplace English, or AI translator safety' },
      { step: 'Practice safely', output: 'ChatGPT-powered SmartTeacher AI practice with confidentiality and teacher-review labels' },
      { step: 'Get unstuck', output: 'Simple English, Explain in my language, side-by-side view, Contact support, and Back to Legal English' },
      { step: 'Bring to class', output: 'lesson folder item, teacher review handoff, AI translation-risk note, or homework prompt' },
      { step: 'Prove progress', output: 'teacher closeout, progress report, certificate status, credit ledger, employer-safe summary, and next recommendation' }
    ],
    role_action_rails: {
      student: ['Next class', 'Practice with SmartTeacher AI', 'Explain in my language', 'Save to lesson folder', 'Ask teacher', 'Show progress'],
      teacher: ['Prepare class', 'Review AI practice', 'Use Translation Bridge', 'Assign AI-safety homework', 'Closeout report', 'Track payout'],
      employer: ['Team schedule', 'Skill readiness', 'AI safety progress', 'Privacy-safe report', 'Certificates', 'Renew/top up'],
      staff_owner: ['Revenue blockers', 'Teacher match', 'Region/provider access', 'Language-help queue', 'Reports/certificates', 'Payouts/renewals']
    },
    privacy_boundaries: [
      'Employers see attendance, completion, module status, certificates, high-level skill readiness, ROI, and recommended next training.',
      'Employers do not automatically see private student drafts, sensitive uploads, raw AI practice, teacher-private notes, or native-language explanations.',
      'Native-language support remains a learning bridge, not certified translation, court interpretation, final legal meaning, or legal advice.',
      'AI screens remain practice/training only and should prompt teacher or qualified professional review for high-stakes language.'
    ],
    global_access_preserved: {
      source_of_truth: 'EnglishLegalese internal calendar/class-session record',
      google_status: 'Google Calendar/Meet optional, not required',
      fallback_options: ['Zoom', 'Microsoft Teams/Outlook', 'Tencent/VooV', 'DingTalk', 'ICS', 'Apple Calendar', 'manual/regional classroom link', 'manual local-time reminders']
    },
    smartteacher_policy: {
      vendor: 'ChatGPT/OpenAI only',
      required_secret: 'OPENAI_API_KEY',
      optional_model: 'SMARTTEACHER_MODEL',
      label: 'Practice with SmartTeacher AI. Improve with live teachers. Prove progress safely.'
    },
    build_guidance: 'Use this layer to improve homepage copy, role dashboards, mobile action cards, teacher classroom handoffs, employer ROI language, staff blocker queues, reports, certificates, SmartTeacher prompts, Translation Bridge, and future continuation prompts without adding complexity or destructive migrations.'
  };
}

app.get('/api/v138/ai-era-action-layer', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    seed: v138AiEraActionLayerSeed(),
    product_message: 'v1.38 makes the AI-era value proposition operational across the product: SmartTeacher AI practice, Translation Bridge help, teacher review, role action rails, employer-safe reporting, mobile next steps, and global classroom/calendar fallbacks.',
    preserved_endpoints: ['/api/v137/guided-help-readiness', '/api/v136/native-language-support', '/api/v135/global-first-class-success', '/api/v134/calendar-interop', '/api/v134/calendar/session.ics', '/api/v133/global-access-classrooms', '/api/v132/chatgpt-only-smartteacher', '/api/v131/teacher-classroom-tools']
  });
});


function v139SeamlessLearningOperationsSeed() {
  return {
    version: 'v1.39.0',
    name: 'Seamless Learning Operations',
    positioning: 'EnglishLegalese is Legal English performance training for the AI era, not generic English lessons and not simple translation. AI can translate words, but professionals still need judgment, context, confidentiality awareness, professional tone, speaking confidence, writing skill, document fluency, and the ability to review AI output safely.',
    core_rule: 'Improve only where it makes the platform simpler, safer, clearer, more globally accessible, more commercially useful, or easier to operate. Preserve existing functionality and production data.',
    universal_language_bridge: {
      promise: 'Users can request explanation in any preferred/native language when stuck.',
      learning_sequence: ['Simple English first', 'Explain in my language when needed', 'Show Legal English + plain-English meaning + native-language explanation', 'Save to lesson folder or support queue', 'Back to Legal English practice'],
      boundaries: ['learning support only', 'not certified translation', 'not court interpretation', 'not legal advice', 'not final legal meaning', 'teacher or qualified professional review for high-stakes language']
    },
    teacher_live_cockpit: {
      before_class: ['learner language card', 'goal and level', 'saved AI practice', 'Translation Bridge flags', 'confidentiality status', 'agenda builder'],
      during_class: ['live correction pad', 'roleplay launcher', 'AI translation-risk lens', 'vocabulary and clause bank', 'side-by-side explanation pad', 'privacy visibility switch'],
      after_class: ['attendance', 'homework generator', 'closeout checklist', 'teacher review handoff', 'employer-safe summary draft', 'payout readiness marker']
    },
    role_action_rails: {
      student: ['Join next class', 'Practice with SmartTeacher AI', 'Explain in my language', 'Save to lesson folder', 'Ask teacher to review', 'View progress/certificate'],
      teacher: ['Prepare class', 'Open live cockpit', 'Review AI practice', 'Use Translation Bridge', 'Assign AI-safety homework', 'Close out and track payout'],
      employer: ['Review team schedule', 'Check skill readiness', 'See AI-safety progress', 'Download privacy-safe report', 'Request workshop', 'Renew/top up credits'],
      staff_owner: ['Clear revenue blockers', 'Resolve teacher match', 'Fix calendar/provider access', 'Review language-help flags', 'Approve reports/certificates', 'Approve payouts/renewals']
    },
    data_preservation: {
      absolute_rule: 'Future updates must preserve user work, calendars, payments, reports, certificates, test scores, AI practice, Translation Bridge history, teacher notes, employer records, support/audit history, and payout records.',
      deployment_rule: 'Deploy code over persistent PostgreSQL and secure object storage; use additive migrations only; never drop, reset, truncate, reseed, or overwrite production records.',
      no_live_secrets: true,
      destructive_migrations_added: false
    },
    preserved_endpoints: ['/api/v138/ai-era-action-layer', '/api/v137/guided-help-readiness', '/api/v136/native-language-support', '/api/v134/calendar/session.ics', '/api/v132/chatgpt-only-smartteacher', '/api/v131/teacher-classroom-tools'],
    build_guidance: 'Use this seed to refine dashboards, classroom tools, teacher marketing, employer reports, SmartTeacher prompts, Translation Bridge, support queues, production console, mobile UX, and future continuation prompts without adding unnecessary complexity.'
  };
}

app.get('/api/v139/seamless-learning-operations', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    seed: v139SeamlessLearningOperationsSeed(),
    product_message: 'v1.39 turns the AI-era strategy into seamless operations: any-language help when stuck, back-to-Legal-English practice, teacher live cockpit, role action rails, employer-safe proof, staff blocker queues, and no-data-loss deployment guardrails.',
    preserved_endpoints: ['/api/v138/ai-era-action-layer', '/api/v137/guided-help-readiness', '/api/v136/native-language-support', '/api/v135/global-first-class-success', '/api/v134/calendar-interop', '/api/v134/calendar/session.ics', '/api/v133/global-access-classrooms', '/api/v132/chatgpt-only-smartteacher', '/api/v131/teacher-classroom-tools']
  });
});


function v140WorkflowProofLayerSeed() {
  return {
    version: 'v1.40.0',
    name: 'Workflow Proof Layer',
    positioning: 'Legal English training for the AI era must be visible in the workflow, not just the copy: SmartTeacher AI practice is saved, teacher review is routed, and employer-safe proof is generated without exposing private learner work.',
    core_improvements: [
      'Save SmartTeacher AI practice into lesson folders tied to learner, teacher, class/session, language bridge context, and privacy visibility.',
      'Create teacher-review handoffs from saved AI practice, Translation Bridge notes, homework drafts, and AI translation-risk exercises.',
      'Generate employer-safe progress summaries that show attendance, completion, skill movement, AI translator safety, professional tone, speaking confidence, and next training without private drafts or raw native-language content.',
      'Keep all user work, calendars, payment/credit records, reports, certificates, test scores, teacher notes, Translation Bridge history, and audit/support records preserved across deployments.'
    ],
    student_workflow: ['Practice with SmartTeacher AI', 'Ask for simple English or any preferred/native-language explanation if stuck', 'Save useful work to lesson folder', 'Request teacher review', 'Bring to live class', 'Turn reviewed work into homework/progress proof'],
    teacher_workflow: ['Review lesson folder before class', 'Use live correction pad and AI Translation Risk Lens during class', 'Mark review status', 'Assign homework from reviewed practice', 'Close out class', 'Draft employer-safe summary only after privacy check'],
    employer_workflow: ['See team schedule and credits', 'Review attendance and completion', 'See AI translator safety and professional tone progress', 'Download privacy-safe report', 'Request next workshop or renew/top up credits'],
    staff_owner_workflow: ['Watch saved-work backlog', 'Clear teacher-review handoffs', 'Check employer-safe report queue', 'Protect data preservation/no destructive migrations', 'Confirm no live secrets in ZIP', 'Verify global calendar/classroom fallbacks'],
    preserved_backend_paths: ['/api/v118/saved-work', '/api/v125/teacher-review-handoffs', '/api/v125/employer-roi-snapshots', '/api/v139/seamless-learning-operations', '/api/v138/ai-era-action-layer', '/api/v137/guided-help-readiness', '/api/v136/native-language-support'],
    privacy_boundaries: ['not legal advice', 'not certified translation', 'not court interpretation', 'not final legal meaning', 'employers do not automatically see private drafts, raw AI practice, raw native-language explanations, sensitive uploads, or teacher-private notes'],
    data_preservation: { additive_migrations_only: true, no_destructive_migrations_added: true, no_live_secrets_added: true, production_data_must_remain_in: ['persistent PostgreSQL', 'secure object storage', 'Stripe/payment provider records', 'calendar/video provider IDs where configured'] }
  };
}

app.get('/api/v140/workflow-proof-layer', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    seed: v140WorkflowProofLayerSeed(),
    product_message: 'v1.40 deepens the actual workflows behind the action rails: save SmartTeacher practice to lesson folders, route teacher-review handoffs, and generate employer-safe reports while preserving user data and AI-era Legal English boundaries.',
    preserved_endpoints: ['/api/v139/seamless-learning-operations', '/api/v138/ai-era-action-layer', '/api/v137/guided-help-readiness', '/api/v136/native-language-support', '/api/v134/calendar/session.ics', '/api/v132/chatgpt-only-smartteacher', '/api/v131/teacher-classroom-tools']
  });
});

app.get('/api/v140/workflow-records', async (req, res) => {
  try {
    const [saved_work, teacher_review_handoffs, employer_safe_reports, homework_assignments] = await Promise.all([
      persistentStore.listSavedWork().catch(() => []),
      persistentStore.listTeacherReviewHandoffs(req.query.review_status || null).catch(() => []),
      persistentStore.listEmployerRoiSnapshots().catch(() => []),
      persistentStore.listHomeworkAssignments().catch(() => [])
    ]);
    res.json({ ok: true, version: VERSION, saved_work, teacher_review_handoffs, employer_safe_reports, homework_assignments, privacy_rule: 'Employer-safe reports exclude private drafts, raw AI practice, raw native-language explanations, sensitive uploads, and teacher-private notes by default.' });
  } catch (error) {
    res.status(500).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v140/smartteacher/lesson-folder', async (req, res) => {
  try {
    const body = req.body || {};
    const savedWork = await persistentStore.createSavedWork({
      owner_name: body.student_name || body.owner_name || 'Unassigned learner',
      work_type: body.work_type || 'smartteacher_ai_practice',
      title: body.title || 'SmartTeacher AI practice saved to lesson folder',
      status: body.status || 'saved_for_teacher_review',
      visibility: body.visibility || 'student_teacher_only',
      content_preview: body.content_preview || 'Practice saved. Private content should remain restricted unless shared with clear permission.',
      class_session_id: body.class_session_id || null,
      metadata: { source: 'v1.40 workflow proof layer', preferred_language: body.preferred_language || 'any preferred/native language when needed', confidentiality_status: body.confidentiality_status || 'no confidential client information confirmed', ai_boundary: 'practice only, not legal advice', ...(body.metadata || {}) }
    });
    let teacherReviewHandoff = null;
    if (body.request_teacher_review !== false) {
      teacherReviewHandoff = await persistentStore.createTeacherReviewHandoff({
        student_name: body.student_name || body.owner_name || 'Unassigned learner',
        teacher_name: body.teacher_name || null,
        source_type: 'lesson_folder_smartteacher_practice',
        practice_title: body.title || 'SmartTeacher AI practice saved to lesson folder',
        review_reason: body.review_reason || 'Teacher review requested for tone, context, confidentiality, Legal English accuracy, and AI translation risk.',
        confidentiality_status: body.confidentiality_status || 'no_confidential_information_confirmed',
        review_status: 'teacher_review_needed',
        class_session_id: body.class_session_id || null,
        metadata: { saved_work_id: savedWork.id, source: 'v1.40 workflow proof layer', ...(body.metadata || {}) }
      });
    }
    res.status(201).json({ ok: true, version: VERSION, saved_work: savedWork, teacher_review_handoff: teacherReviewHandoff, next_actions: ['Bring to live class', 'Assign homework after review', 'Use only employer-safe summary if reporting to employer'] });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v140/employer-safe-reports', async (req, res) => {
  try {
    const body = req.body || {};
    const report = await persistentStore.createEmployerRoiSnapshot({
      employer_name: body.employer_name || body.organization_name || 'Employer account',
      cohort_name: body.cohort_name || body.team_name || null,
      reporting_period: body.reporting_period || 'Current training snapshot',
      learners_active: body.learners_active || 0,
      attendance_rate: body.attendance_rate || null,
      homework_completion_rate: body.homework_completion_rate || null,
      ai_translation_safety_progress: body.ai_translation_safety_progress || 'tracked_high_level_only',
      professional_tone_progress: body.professional_tone_progress || 'tracked_high_level_only',
      speaking_confidence_progress: body.speaking_confidence_progress || 'tracked_high_level_only',
      privacy_status: 'employer_safe_summary_only',
      recommended_next_training: body.recommended_next_training || 'Continue AI Translator Safety Lab plus teacher-led meeting/client-call practice.',
      metadata: { source: 'v1.40 workflow proof layer', excluded_by_default: ['private student drafts', 'raw SmartTeacher AI text', 'raw native-language explanations', 'sensitive uploads', 'teacher-private notes'], ...(body.metadata || {}) }
    });
    res.status(201).json({ ok: true, version: VERSION, report, privacy_rule: 'This report is employer-safe by default and excludes private learner content unless clear permission allows sharing.' });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});


const V141_MAJOR_LANGUAGE_OPTIONS = [
  "English",
  "Spanish",
  "Mandarin Chinese",
  "Hindi",
  "Arabic",
  "Bengali",
  "Portuguese",
  "Russian",
  "Urdu",
  "Indonesian",
  "French",
  "German",
  "Japanese",
  "Turkish",
  "Vietnamese",
  "Korean",
  "Italian",
  "Persian/Farsi",
  "Polish",
  "Ukrainian",
  "Dutch",
  "Thai",
  "Gujarati",
  "Marathi",
  "Telugu",
  "Tamil",
  "Punjabi",
  "Javanese",
  "Malay",
  "Swahili",
  "Tagalog/Filipino",
  "Romanian",
  "Greek",
  "Czech",
  "Hungarian",
  "Swedish",
  "Danish",
  "Norwegian",
  "Finnish",
  "Hebrew",
  "Malayalam",
  "Kannada",
  "Odia",
  "Assamese",
  "Sinhala",
  "Nepali",
  "Burmese",
  "Khmer",
  "Lao",
  "Mongolian",
  "Kazakh",
  "Uzbek",
  "Azerbaijani",
  "Armenian",
  "Georgian",
  "Kurdish",
  "Pashto",
  "Dari",
  "Amharic",
  "Somali",
  "Hausa",
  "Yoruba",
  "Igbo",
  "Zulu",
  "Xhosa",
  "Afrikaans",
  "Albanian",
  "Bosnian",
  "Serbian",
  "Croatian",
  "Bulgarian",
  "Slovak",
  "Slovenian",
  "Lithuanian",
  "Latvian",
  "Estonian",
  "Icelandic",
  "Irish",
  "Welsh",
  "Catalan",
  "Basque",
  "Galician",
  "Luxembourgish",
  "Maltese",
  "Macedonian",
  "Belarusian",
  "Moldovan/Romanian",
  "Tigrinya",
  "Oromo",
  "Kinyarwanda",
  "Kirundi",
  "Lingala",
  "Wolof",
  "Bambara",
  "Fula/Fulani",
  "Shona",
  "Sesotho",
  "Setswana",
  "Tajik",
  "Kyrgyz",
  "Turkmen",
  "Uyghur",
  "Tibetan",
  "Hmong",
  "Cantonese",
  "Hakka",
  "Min Nan/Hokkien",
  "Quechua",
  "Aymara",
  "Haitian Creole"
];

function v141MajorLanguageBridgeSeed() {
  return {
    version: 'v1.41.0',
    name: 'Major-Language Bridge + Classroom Command',
    positioning: 'EnglishLegalese supports major-language explanation help for global learners while staying Legal English training for the AI era, not generic translation.',
    language_count: V141_MAJOR_LANGUAGE_OPTIONS.length,
    language_options: V141_MAJOR_LANGUAGE_OPTIONS,
    honest_scope_rule: 'Support the major widely used languages first. Rare, low-confidence, sensitive, legal, court, certified translation, or high-stakes requests should route to teacher/staff/qualified professional review instead of pretending every language is safely covered.',
    learning_sequence: ['Simple English first', 'Explain in selected language only enough to get unstuck', 'Show side-by-side Legal English + plain-English meaning + native-language explanation', 'Save to lesson folder', 'Ask teacher when important or risky', 'Back to Legal English performance'],
    teacher_command_tools: ['learner language card', 'side-by-side correction pad', 'AI translation-risk lens', 'roleplay launcher', 'homework handoff', 'closeout proof', 'employer-safe summary draft'],
    employer_privacy_rule: 'Employer reports may summarize language-support usage at a high level, but raw native-language explanations, private student drafts, raw SmartTeacher AI text, sensitive uploads, and teacher-private notes are excluded by default.',
    data_preservation: { additive_migrations_only: true, no_destructive_migrations_added: true, no_live_secrets_added: true, preserve: ['student work','homework','AI practice','Translation Bridge records','calendars','payments','credits','reports','certificates','test scores','teacher notes','employer records','payouts','uploads','support threads','audit logs'] }
  };
}

app.get('/api/v141/major-language-bridge', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    seed: v141MajorLanguageBridgeSeed(),
    product_message: 'v1.41 adds a major-language support layer that feeds the existing lesson-folder, teacher-review, and employer-safe report workflows while preserving Legal English performance training boundaries.',
    preserved_endpoints: ['/api/v140/workflow-proof-layer','/api/v140/smartteacher/lesson-folder','/api/v140/employer-safe-reports','/api/v139/seamless-learning-operations','/api/v138/ai-era-action-layer','/api/v137/guided-help-readiness','/api/v136/native-language-support']
  });
});

app.get('/api/v141/language-options', (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  const options = q ? V141_MAJOR_LANGUAGE_OPTIONS.filter(l => l.toLowerCase().includes(q)).slice(0, 40) : V141_MAJOR_LANGUAGE_OPTIONS;
  res.json({ ok: true, version: VERSION, count: options.length, total_supported_major_options: V141_MAJOR_LANGUAGE_OPTIONS.length, options, scope_note: 'Major-language explanation support for learning. Rare/low-confidence/high-stakes requests should route to staff/teacher review.' });
});

app.post('/api/v141/language-support-requests', async (req, res) => {
  try {
    const body = req.body || {};
    const language = body.language || body.preferred_language || 'Spanish';
    const supportedMajorLanguage = V141_MAJOR_LANGUAGE_OPTIONS.some(l => l.toLowerCase() === String(language).toLowerCase());
    const savedWork = await persistentStore.createSavedWork({
      owner_name: body.student_name || body.owner_name || 'Unassigned learner',
      work_type: 'translation_bridge_language_help',
      title: body.title || `Language Bridge request: ${language} explanation`,
      status: supportedMajorLanguage ? 'saved_for_language_help' : 'staff_language_review_needed',
      visibility: 'student_teacher_staff_only',
      content_preview: body.content_preview || 'Language-help request saved. Raw native-language content stays private unless clear permission allows sharing.',
      class_session_id: body.class_session_id || null,
      metadata: { source: 'v1.41 major-language bridge', requested_language: language, supported_major_language: supportedMajorLanguage, simple_english_first: true, back_to_legal_english_required: true, ai_boundary: 'learning support only, not legal advice/certified translation/court interpretation/final legal meaning', ...(body.metadata || {}) }
    });
    let teacherReviewHandoff = null;
    if (body.request_teacher_review !== false || !supportedMajorLanguage || body.high_stakes === true) {
      teacherReviewHandoff = await persistentStore.createTeacherReviewHandoff({
        student_name: body.student_name || body.owner_name || 'Unassigned learner',
        teacher_name: body.teacher_name || null,
        source_type: 'v141_language_bridge',
        practice_title: body.title || `Language Bridge request: ${language}`,
        review_reason: body.review_reason || 'Teacher/staff review recommended to confirm the language explanation is a learning bridge back to Legal English and does not create false confidence or legal/translation risk.',
        confidentiality_status: body.confidentiality_status || 'not_confirmed_sensitive_content_check_needed',
        review_status: !supportedMajorLanguage ? 'staff_language_review_needed' : 'teacher_review_needed',
        class_session_id: body.class_session_id || null,
        metadata: { saved_work_id: savedWork.id, requested_language: language, supported_major_language: supportedMajorLanguage, source: 'v1.41 major-language bridge', ...(body.metadata || {}) }
      });
    }
    res.status(201).json({ ok: true, version: VERSION, supported_major_language: supportedMajorLanguage, saved_work: savedWork, teacher_review_handoff: teacherReviewHandoff, next_actions: ['Simple English first', `Explain in ${language} only enough to get unstuck`, 'Return to Legal English practice', 'Teacher/staff review for high-stakes or low-confidence language'] });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v141/employer-language-summaries', async (req, res) => {
  try {
    const body = req.body || {};
    const report = await persistentStore.createEmployerRoiSnapshot({
      employer_name: body.employer_name || body.organization_name || 'Employer account',
      cohort_name: body.cohort_name || null,
      reporting_period: body.reporting_period || 'Language-support training snapshot',
      learners_active: body.learners_active || 0,
      attendance_rate: body.attendance_rate || null,
      homework_completion_rate: body.homework_completion_rate || null,
      ai_translation_safety_progress: body.ai_translation_safety_progress || 'Translation Bridge used as learning support and routed back to Legal English practice.',
      professional_tone_progress: body.professional_tone_progress || 'Professional tone practice remains teacher-reviewed where important.',
      speaking_confidence_progress: body.speaking_confidence_progress || 'Learners practice speaking/writing in Legal English after native-language explanation.',
      privacy_status: 'employer_safe_language_summary_only',
      recommended_next_training: body.recommended_next_training || 'Continue AI Translator Safety Lab, Legal English writing, and teacher-led meeting/client-call practice.',
      metadata: { source: 'v1.41 major-language bridge', languages_summary: body.languages_summary || 'high-level only', excluded_by_default: ['raw native-language explanations','private learner drafts','raw SmartTeacher AI text','sensitive uploads','teacher-private notes'], ...(body.metadata || {}) }
    });
    res.status(201).json({ ok: true, version: VERSION, report, privacy_rule: 'Employer language summaries are high-level only and exclude raw native-language content by default.' });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});


function v142ContinuityCommandSeed() {
  return {
    version: 'v1.42.0',
    name: 'Continuity Command Center',
    product_positioning: 'Legal English training for the AI era: practice with SmartTeacher AI, get language support when stuck, save work, route teacher review, teach live, prove progress, and preserve every real record across deployments.',
    simple_flow: ['Practice or ask for help', 'Save to lesson folder', 'Route teacher/staff review when needed', 'Teach live with classroom command tools', 'Assign homework or closeout', 'Generate employer-safe report', 'Preserve progress, scores, payments, calendars, and reports across code updates'],
    teacher_classroom_command: {
      before_class: ['learner goal/level', 'preferred explanation language', 'saved SmartTeacher AI practice', 'Translation Bridge flags', 'homework due', 'class link/provider', 'timezone', 'confidentiality warning'],
      during_class: ['agenda', 'live correction pad', 'side-by-side explanation', 'roleplay launcher', 'AI translation-risk lens', 'vocabulary/clause bank', 'speaking confidence prompt'],
      after_class: ['attendance', 'homework', 'review handoff', 'employer-safe note', 'certificate/test score update', 'payout readiness', 'next lesson']
    },
    teacher_marketing_guardrails: ['approved copy only', 'tracked links/QR codes', 'staff claim review', 'no off-platform pricing', 'no legal advice claims', 'no certified translation/court interpretation claims', 'no unsupported university comparison claims'],
    protected_records: ['students', 'teachers', 'employers', 'class sessions', 'calendar/video links', 'payments', 'credits', 'homework', 'saved work', 'AI practice', 'Translation Bridge records', 'test scores', 'reports', 'certificates', 'teacher notes', 'payouts', 'uploads', 'support threads', 'audit logs'],
    preserved_endpoints: ['/api/v141/major-language-bridge','/api/v140/workflow-proof-layer','/api/v139/seamless-learning-operations','/api/v138/ai-era-action-layer','/api/v137/guided-help-readiness','/api/v136/native-language-support']
  };
}

app.get('/api/v142/continuity-command-center', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    seed: v142ContinuityCommandSeed(),
    boundary: 'This layer coordinates training records and workflows. It is not legal advice, certified translation, court interpretation, legal filing, or final legal meaning.',
    data_preservation: 'Code deployments must never wipe or overwrite persistent student, teacher, employer, payment, calendar, report, certificate, score, upload, support, or audit records.'
  });
});

app.get('/api/v142/continuity-records', async (req, res) => {
  try {
    const [classSessions, savedWork, teacherReviews, employerReports, actionItems, marketingAssets, supportThreads, deployments] = await Promise.all([
      persistentStore.listClassSessions(),
      persistentStore.listSavedWork(),
      persistentStore.listTeacherReviewHandoffs(),
      persistentStore.listEmployerRoiSnapshots(),
      persistentStore.listActionCenterItems(),
      persistentStore.listTeacherMarketingAssets(),
      persistentStore.listSupportThreads(),
      persistentStore.listDeploymentRecords()
    ]);
    res.json({
      ok: true,
      version: VERSION,
      mode: persistentStore.mode(),
      counts: {
        class_sessions: classSessions.length,
        saved_work_items: savedWork.length,
        teacher_review_handoffs: teacherReviews.length,
        employer_safe_reports: employerReports.length,
        staff_action_items: actionItems.length,
        teacher_marketing_assets: marketingAssets.length,
        support_threads: supportThreads.length,
        deployment_records: deployments.length
      },
      protected_records: v142ContinuityCommandSeed().protected_records,
      no_data_loss_rule: 'Use additive migrations only. Do not reset, reseed, drop, wipe, or move production data into deploy folders.'
    });
  } catch (error) {
    res.status(500).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v142/classroom-command-actions', async (req, res) => {
  try {
    const body = req.body || {};
    const learner = body.student_name || body.learner_name || 'Unassigned learner';
    const teacher = body.teacher_name || 'Assigned teacher';
    const source = body.source_type || 'v142_classroom_command';
    const savedWork = await persistentStore.createSavedWork({
      owner_name: learner,
      work_type: body.work_type || 'classroom_command_saved_practice',
      title: body.title || 'Classroom command saved practice',
      status: 'saved_to_lesson_folder',
      visibility: 'student_teacher_staff_only',
      content_preview: body.content_preview || 'Classroom action saved. Raw AI/native-language/private content is not employer-visible by default.',
      class_session_id: body.class_session_id || null,
      metadata: { source, teacher_name: teacher, preferred_language: body.preferred_language || null, ai_era_boundary: 'training/practice only, not legal advice or certified translation', preserve_across_deploys: true, ...(body.metadata || {}) }
    });
    const review = await persistentStore.createTeacherReviewHandoff({
      student_name: learner,
      teacher_name: teacher,
      source_type: source,
      practice_title: body.title || 'Classroom command saved practice',
      review_reason: body.review_reason || 'Teacher review recommended before turning saved practice into homework, report proof, or employer-safe summary.',
      confidentiality_status: body.confidentiality_status || 'needs_confidentiality_check_if_real_client_content',
      review_status: body.review_status || 'teacher_review_needed',
      class_session_id: body.class_session_id || null,
      metadata: { saved_work_id: savedWork.id, source: 'v1.42 continuity command center', ...(body.metadata || {}) }
    });
    let homework = null;
    if (body.create_homework !== false) {
      homework = await persistentStore.createHomeworkAssignment({
        class_session_id: body.class_session_id || null,
        title: body.homework_title || 'Teacher-reviewed Legal English practice',
        instructions: body.homework_instructions || 'Revise the saved practice after teacher feedback. Include one AI translator safety note and one professional tone improvement.',
        status: 'assigned_after_teacher_review',
        metadata: { source: 'v1.42 classroom command', saved_work_id: savedWork.id, teacher_review_handoff_id: review.id }
      });
    }
    res.status(201).json({ ok: true, version: VERSION, saved_work: savedWork, teacher_review_handoff: review, homework_assignment: homework, next_actions: ['Teacher reviews saved work', 'Assign or revise homework', 'Close out class', 'Generate employer-safe report only from approved high-level data'] });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v142/teacher-marketing-approval', async (req, res) => {
  try {
    const body = req.body || {};
    const copy = body.approved_copy || 'Legal English training for the AI era: practice with SmartTeacher AI, improve with live teachers, and learn to use AI translation safely.';
    const asset = await persistentStore.createTeacherMarketingAsset({
      teacher_name: body.teacher_name || 'Approved teacher',
      asset_type: body.asset_type || 'social_post',
      channel: body.channel || 'LinkedIn / WhatsApp / email',
      status: body.status || 'draft_pending_staff_claim_review',
      approved_copy: copy,
      tracking_code: body.tracking_code || body.referral_code || null,
      staff_notes: body.staff_notes || 'Check claims before publishing: no legal advice, no certified translation/court interpretation, no off-platform pricing, no unsupported university comparison.',
      metadata: { source: 'v1.42 teacher marketing approval', guardrails: v142ContinuityCommandSeed().teacher_marketing_guardrails, ...(body.metadata || {}) }
    });
    const action = await persistentStore.createActionCenterItem({
      role: 'staff',
      title: 'Review teacher marketing claim',
      status: 'open',
      priority: 'normal',
      next_action: 'Approve copy, tracking link/QR, and claims before teacher publishes.',
      related_entity_type: 'teacher_marketing_asset',
      related_entity_id: asset.id,
      owner_name: 'EnglishLegalese staff',
      metadata: { source: 'v1.42 teacher marketing approval', teacher_name: asset.teacher_name }
    });
    res.status(201).json({ ok: true, version: VERSION, asset, staff_action: action, guardrails: v142ContinuityCommandSeed().teacher_marketing_guardrails });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v142/employer-safe-continuity-report', async (req, res) => {
  try {
    const body = req.body || {};
    const report = await persistentStore.createEmployerRoiSnapshot({
      employer_name: body.employer_name || body.organization_name || 'Employer account',
      cohort_name: body.cohort_name || null,
      reporting_period: body.reporting_period || 'Continuity proof snapshot',
      learners_active: body.learners_active || 0,
      attendance_rate: body.attendance_rate || null,
      homework_completion_rate: body.homework_completion_rate || null,
      ai_translation_safety_progress: body.ai_translation_safety_progress || 'Learners practiced AI translator safety and used SmartTeacher AI/Translation Bridge as learning support, not final legal meaning.',
      professional_tone_progress: body.professional_tone_progress || 'Teacher-reviewed professional tone progress summarized at a high level.',
      speaking_confidence_progress: body.speaking_confidence_progress || 'Speaking/writing confidence summarized without exposing private drafts.',
      privacy_status: 'employer_safe_continuity_summary_only',
      recommended_next_training: body.recommended_next_training || 'Continue AI Translator Safety Lab, Legal Writing and Email, Meetings/Client Calls, and teacher-led review.',
      metadata: { source: 'v1.42 employer-safe continuity report', excluded_by_default: ['private drafts','raw SmartTeacher AI prompts/responses','raw native-language explanations','sensitive uploads','teacher-private notes','confidential client-identifying content'], ...(body.metadata || {}) }
    });
    res.status(201).json({ ok: true, version: VERSION, report, privacy_rule: 'Employer-safe continuity reports are high-level by default and must not expose private learner content without clear permission.' });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v142/deployment-preservation-check', async (req, res) => {
  try {
    const body = req.body || {};
    const record = await persistentStore.createDeploymentRecord({
      version: body.version || '1.42.0',
      environment: body.environment || process.env.APP_ENV || 'production',
      deployed_by: body.deployed_by || 'owner/staff',
      predeploy_check_status: body.predeploy_check_status || 'required',
      migration_status: body.migration_status || 'additive_only_or_not_required',
      postdeploy_smoke_status: body.postdeploy_smoke_status || 'required',
      rollback_plan: body.rollback_plan || 'Keep previous ZIP and hosting rollback available. Do not roll back by wiping data.',
      data_safety_notes: body.data_safety_notes || 'No destructive migrations. No production reseed/reset/drop/wipe. Protect students, teachers, employers, calendars, payments, homework, reports, certificates, scores, uploads, support, and audit records.',
      metadata: { source: 'v1.42 deployment preservation check', protected_records: v142ContinuityCommandSeed().protected_records, ...(body.metadata || {}) }
    });
    res.status(201).json({ ok: true, version: VERSION, deployment_record: record, no_data_loss_rule: 'Production deploy is code-only unless an additive migration is intentionally reviewed and backed up.' });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});


function v143CoursePlacementSeed() {
  const levels = [
    { id: 'level-1', name: 'Beginner Legal English Foundations', short: 'Beginner', cefr: 'A1-A2', placement_range: '0-34', purpose: 'Start with simple professional English, basic legal vocabulary, confidence, and safe use of Translation Bridge.' },
    { id: 'level-2', name: 'Novice Legal English Builder', short: 'Novice', cefr: 'A2-B1', placement_range: '35-49', purpose: 'Build common legal/business phrases, short emails, meeting basics, and AI translator safety habits.' },
    { id: 'level-3', name: 'Working Legal English', short: 'Intermediate', cefr: 'B1-B2', placement_range: '50-69', purpose: 'Write clearer emails, read clauses, explain facts, ask clarifying questions, and speak in everyday legal/business situations.' },
    { id: 'level-4', name: 'Advanced Professional Legal English', short: 'Advanced', cefr: 'B2-C1', placement_range: '70-84', purpose: 'Handle contract language, professional tone, negotiations, client calls, reports, and AI-output review with teacher judgment.' },
    { id: 'level-5', name: 'Expert Legal English Performance', short: 'Expert', cefr: 'C1-C2', placement_range: '85-100', purpose: 'Refine executive-level legal/business communication, presentations, cross-border negotiation, nuanced writing, and specialized practice.' }
  ];
  const courses = [
    { id:'diagnostic-placement', level:'All levels', group:'Diagnostic + Placement', name:'Legal English Diagnostic and Needs Assessment', description:'AI-assisted and teacher-confirmed placement across general English, legal vocabulary, writing, speaking, AI translator safety, goals, preferred explanation language, and employer needs.', recommended_order:0, lessons:['Intake goals and language background','Legal vocabulary sample','Professional email writing sample','Speaking/client-call sample','AI translator safety check','Teacher placement confirmation and path plan'], outputs:['placement level','recommended course path','teacher match notes','employer-safe baseline when applicable'] },
    { id:'beginner-foundations', level:'Beginner', group:'Core Foundations', name:'Beginner Legal English Foundations', description:'Simple Legal English for learners who need basic vocabulary, sentence patterns, confidence, and native-language support as a bridge back to English.', recommended_order:1, lessons:['Professional greetings and introductions','Basic legal/business vocabulary','Simple emails and requests','Explaining facts in simple English','Asking for clarification','Safe AI/translation habits for beginners'], outputs:['basic vocabulary bank','short email draft','teacher-reviewed speaking note'] },
    { id:'novice-legal-vocabulary', level:'Novice', group:'Core Foundations', name:'Legal Vocabulary and Plain-English Explanation', description:'Common legal/business words, false friends, words with special legal meaning, and practice explaining legal ideas in plain English without giving legal advice.', recommended_order:2, lessons:['Common legal/business words','False friends and literal-translation risk','Defined terms and special meanings','Plain-English explanations','Clarifying questions','Review quiz and teacher feedback'], outputs:['vocabulary bank','plain-English explanation sample','translation-risk checklist'] },
    { id:'ai-translator-safety-core', level:'All levels', group:'AI-Era Core', name:'AI Translator Safety Lab', description:'Core differentiator: teaches learners to use AI translation wisely, protect confidentiality, spot risky wording, and bring important language to a teacher or qualified professional.', recommended_order:3, lessons:['Why AI translation is not enough','Confidentiality and upload judgment','Spot the risky word','Compare AI translation vs professional Legal English','Rewrite for tone and clarity','Know when teacher/professional review is needed'], outputs:['AI safety checklist','reviewed rewrite','teacher-review handoff when needed'] },
    { id:'legal-email-writing', level:'Intermediate', group:'Writing + Email', name:'Legal Writing and Professional Email', description:'Practical legal/business email writing, status updates, follow-ups, document requests, disagreement, delays, and concise professional tone.', recommended_order:4, lessons:['Clear subject lines and purpose','Client update emails','Document request emails','Follow-up and deadline language','Disagreeing professionally','Teacher-reviewed final email'], outputs:['email portfolio','tone improvement notes','homework sequence'] },
    { id:'contracts-documents', level:'Intermediate', group:'Contracts + Documents', name:'Contracts and Business Documents', description:'Clause reading and document fluency for obligations, rights, deadlines, payment terms, confidentiality, termination, definitions, and questions to ask.', recommended_order:5, lessons:['Contract structure and defined terms','Obligations, rights, and deadlines','Payment and notice language','Confidentiality and liability wording','Summarizing clauses safely','Ask better questions before relying on translation'], outputs:['clause summary','question list','AI translation-risk review'] },
    { id:'meetings-client-calls', level:'Intermediate', group:'Speaking + Meetings', name:'Meetings, Client Calls, and Negotiation Basics', description:'Speaking confidence for meetings, client calls, clarifying facts, confirming next steps, disagreeing politely, and avoiding dependence on live translation.', recommended_order:6, lessons:['Opening a meeting','Clarifying facts and asking follow-ups','Explaining uncertainty professionally','Confirming next steps','Basic negotiation phrases','Roleplay closeout and teacher feedback'], outputs:['roleplay score','speaking confidence notes','next meeting script'] },
    { id:'legal-workplace-english', level:'Intermediate', group:'Workplace', name:'Legal Workplace English', description:'Law firm, corporate legal department, compliance, HR/legal, billing/time-entry vocabulary, escalation language, teamwork, and cross-border communication.', recommended_order:7, lessons:['Law firm and legal department vocabulary','Team updates and internal escalation','Compliance and HR/legal communication','Billing/time-entry language','Cross-border collaboration','Supervisor-ready progress update'], outputs:['workplace phrase bank','professional update sample','teacher note'] },
    { id:'advanced-contracts', level:'Advanced', group:'Contracts + Documents', name:'Advanced Contract Clauses and Risk Language', description:'Advanced practice with indemnity, representations, warranties, limitation of liability, governing law, termination, ambiguity, and professional risk explanations for language-training purposes only.', recommended_order:8, lessons:['Indemnity and liability language','Representations and warranties','Termination and default language','Governing law and forum vocabulary','Ambiguity and defined-term traps','Professional risk explanation roleplay'], outputs:['advanced clause notes','risk-language explanation','review-needed checklist'] },
    { id:'advanced-legal-writing', level:'Advanced', group:'Writing + Email', name:'Advanced Legal Writing, Memos, and Status Reports', description:'Advanced writing for internal memos, professional summaries, status reports, client-safe wording, and revision of AI-generated or translated text.', recommended_order:9, lessons:['Memo structure and audience','Executive summary language','Status report clarity','Client-safe wording','Revising AI output','Teacher-reviewed writing portfolio'], outputs:['memo draft','status report','teacher-reviewed rewrite'] },
    { id:'advanced-negotiation', level:'Advanced', group:'Speaking + Meetings', name:'Advanced Meetings, Negotiations, and Client Communication', description:'Advanced speaking practice for negotiation, sensitive client discussions, presentations, objections, and professional disagreement.', recommended_order:10, lessons:['Negotiation openings and framing','Sensitive tone and diplomacy','Handling objections','Presenting options','Summarizing agreements and next steps','Recorded-roleplay review if consented'], outputs:['negotiation script','teacher speaking score','confidence action plan'] },
    { id:'llm-law-school-readiness', level:'Advanced', group:'Academic + LL.M.', name:'LL.M. and Law School Legal English Readiness', description:'Case reading, class discussion, office hours, professor emails, IRAC-style explanations, seminar participation, study-group English, and exam-style communication.', recommended_order:11, lessons:['Case reading and issue spotting language','IRAC-style oral explanation','Cold-call and seminar phrases','Professor and office-hour emails','Study-group discussion','Exam-style explanation practice'], outputs:['case brief language sample','class discussion score','LL.M. readiness report'] },
    { id:'us-legal-system-vocabulary', level:'Advanced', group:'Academic + U.S. Legal System', name:'U.S. Legal System Vocabulary and Case Discussion', description:'University-inspired legal-system vocabulary and communication readiness for international lawyers, LL.M. hopefuls, legal staff, and business professionals.', recommended_order:12, lessons:['Court and litigation vocabulary','Statutes, cases, and precedent language','Civil procedure vocabulary basics','Business law vocabulary basics','Explaining U.S. legal concepts in English','Teacher-reviewed presentation'], outputs:['vocabulary map','short presentation','teacher feedback'] },
    { id:'toles-style-practical', level:'Advanced', group:'Practical Legal English', name:'TOLES-Style Practical Legal English', description:'Practical legal vocabulary, document language, contracts, professional tone, and accuracy inspired by TOLES-style skills, with no official TOLES affiliation claim.', recommended_order:13, lessons:['Precision vocabulary','Contract language accuracy','Business/legal collocations','Formal vs plain professional tone','Document-editing practice','Practical Legal English review'], outputs:['accuracy checklist','document rewrite','practice score'] },
    { id:'expert-executive-performance', level:'Expert', group:'Executive + Expert', name:'Expert Legal English Performance and Cross-Border Strategy', description:'Executive-level communication for senior lawyers, managers, founders, compliance leads, and professionals who already operate in English but need precision and authority.', recommended_order:14, lessons:['Executive legal/business briefing','Strategic negotiation language','Cross-border cultural nuance','Board/client presentation language','Crisis/conflict communication','Expert performance review'], outputs:['executive briefing','presentation notes','expert-level next plan'] },
    { id:'professional-area-immigration', level:'Intermediate+', group:'Professional Area Modules', name:'Legal English for Immigration Workflows', description:'Language-training module using immigration-related vocabulary, forms, notices, timelines, client questions, and professional communication. Not immigration advice or filing help.', recommended_order:15, lessons:['Immigration vocabulary','Forms/notices language','Timeline and deadline wording','Client questions and explanations','AI translation risks in immigration language','Teacher-reviewed scenario'], outputs:['topic vocabulary bank','safe explanation sample','review-needed checklist'] },
    { id:'professional-area-compliance-tax-ip', level:'Intermediate+', group:'Professional Area Modules', name:'Legal English for Compliance, Tax, and IP', description:'Topic-based language practice for compliance, tax, trademarks/IP, policies, audits, notices, and professional reporting. Training only, not professional advice.', recommended_order:16, lessons:['Compliance vocabulary','Tax notice and deadline language','Trademark/IP vocabulary','Policy explanation practice','Professional reporting language','Teacher-reviewed topic scenario'], outputs:['topic vocabulary bank','professional update','AI safety note'] },
    { id:'professional-area-litigation-estate-realestate', level:'Intermediate+', group:'Professional Area Modules', name:'Legal English for Litigation, Estate Planning, Real Estate, Finance, Insurance, and Healthcare', description:'Scenario-based language practice across major professional areas, using safe examples, vocabulary, documents, emails, and conversations without becoming legal advice.', recommended_order:17, lessons:['Litigation vocabulary and case updates','Estate/probate vocabulary','Real estate and finance language','Insurance and healthcare legal/business language','Client-safe wording practice','Teacher-reviewed professional scenario'], outputs:['specialty vocabulary map','client-safe wording sample','next specialization plan'] }
  ];
  const placement_rules = {
    scoring_inputs: ['general English comprehension','legal vocabulary','professional writing sample','speaking confidence sample','AI translator safety judgment','goal urgency','preferred/native language support need'],
    scoring_method: 'Average available rubric scores from 0-100, then adjust conservatively upward only after teacher confirmation.',
    thresholds: [
      { max: 34, level: 'Beginner' },
      { min: 35, max: 49, level: 'Novice' },
      { min: 50, max: 69, level: 'Intermediate' },
      { min: 70, max: 84, level: 'Advanced' },
      { min: 85, level: 'Expert' }
    ],
    human_review: 'Human teacher confirmation is recommended before paid cohort placement, employer reporting, advanced/expert placement, or high-stakes professional language.'
  };
  return { version: 'v1.43.0', name: 'Course Placement + Ordered Curriculum', levels, courses, placement_rules,
    no_data_loss_rule: 'Course placements, lesson plans, saved work, scores, reports, calendars, credits, payments, homework, and teacher notes must be preserved through code deployments.' };
}

function v143NormalizeScore(value, fallback = 55) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(100, n));
}

function v143PlacementFromScore(score) {
  if (score < 35) return 'Beginner';
  if (score < 50) return 'Novice';
  if (score < 70) return 'Intermediate';
  if (score < 85) return 'Advanced';
  return 'Expert';
}

function v143RecommendedCourses(level, goal = '') {
  const seed = v143CoursePlacementSeed();
  const lower = String(goal || '').toLowerCase();
  const all = seed.courses;
  const base = ['diagnostic-placement', 'ai-translator-safety-core'];
  let ids = [...base];
  if (level === 'Beginner') ids.push('beginner-foundations', 'novice-legal-vocabulary', 'legal-email-writing');
  else if (level === 'Novice') ids.push('novice-legal-vocabulary', 'legal-email-writing', 'meetings-client-calls');
  else if (level === 'Intermediate') ids.push('legal-email-writing', 'contracts-documents', 'meetings-client-calls', 'legal-workplace-english');
  else if (level === 'Advanced') ids.push('advanced-contracts', 'advanced-legal-writing', 'advanced-negotiation');
  else ids.push('expert-executive-performance', 'advanced-negotiation', 'advanced-legal-writing');
  if (/llm|law school|case|academic/.test(lower)) ids.push('llm-law-school-readiness', 'us-legal-system-vocabulary');
  if (/contract|document|clause|business/.test(lower)) ids.push('contracts-documents', 'advanced-contracts');
  if (/email|writing|memo|status/.test(lower)) ids.push('legal-email-writing', 'advanced-legal-writing');
  if (/meeting|call|negotiat|speak|presentation/.test(lower)) ids.push('meetings-client-calls', 'advanced-negotiation');
  if (/immigration/.test(lower)) ids.push('professional-area-immigration');
  if (/compliance|tax|ip|trademark/.test(lower)) ids.push('professional-area-compliance-tax-ip');
  if (/litigation|estate|probate|real estate|finance|insurance|health/.test(lower)) ids.push('professional-area-litigation-estate-realestate');
  const unique = [...new Set(ids)];
  return unique.map(id => all.find(c => c.id === id)).filter(Boolean).sort((a,b)=>a.recommended_order-b.recommended_order);
}

app.get('/api/v143/course-placement-system', (req, res) => {
  res.json({ ok: true, version: VERSION, seed: v143CoursePlacementSeed(), boundary: 'Course placement and lesson plans are education/training support only, not legal advice, certified translation, court interpretation, or final legal meaning.' });
});

app.get('/api/v143/course-catalog', (req, res) => {
  const seed = v143CoursePlacementSeed();
  res.json({ ok: true, version: VERSION, levels: seed.levels, courses: seed.courses, total_courses: seed.courses.length, sequence_rule: 'Students start with diagnostic placement, then move through level-appropriate foundations before advanced/specialized modules.' });
});

app.post('/api/v143/placement-assessment', async (req, res) => {
  try {
    const body = req.body || {};
    const scores = {
      general_english: v143NormalizeScore(body.general_english_score, 55),
      legal_vocabulary: v143NormalizeScore(body.legal_vocabulary_score, 45),
      writing: v143NormalizeScore(body.writing_score, 50),
      speaking: v143NormalizeScore(body.speaking_score, 50),
      ai_translator_safety: v143NormalizeScore(body.ai_translator_safety_score, 35)
    };
    const average = Math.round(Object.values(scores).reduce((a,b)=>a+b,0) / Object.values(scores).length);
    const level = body.override_level || v143PlacementFromScore(average);
    const courses = v143RecommendedCourses(level, body.goal || body.primary_goal || 'Legal English performance in the AI era');
    const plan = await persistentStore.createAiEraPathwayPlan({
      role: 'student',
      goal: body.goal || body.primary_goal || 'Legal English performance in the AI era',
      recommended_track: `${level} path: ${courses.slice(0,4).map(c=>c.name).join(' → ')}`,
      ai_practice_action: 'SmartTeacher AI diagnostic practice, AI Translator Safety Lab, and course-specific practice saved to the lesson folder.',
      teacher_review_action: 'Teacher confirms level, adjusts course order, and routes high-stakes language to teacher/professional review when needed.',
      employer_visibility: 'Employer sees only privacy-safe level/path summary, attendance, completion, and high-level progress unless clear permission allows more.',
      metadata: { source: 'v1.43 placement assessment', learner_name: body.learner_name || body.student_name || null, preferred_language: body.preferred_language || null, scores, average, level, recommended_course_ids: courses.map(c=>c.id), no_data_loss: true }
    });
    const action = await persistentStore.createActionCenterItem({
      role: 'teacher',
      title: `Confirm ${level} placement path`,
      status: 'open',
      priority: (level === 'Advanced' || level === 'Expert') ? 'high' : 'normal',
      next_action: 'Review diagnostic samples, confirm level, assign first course sequence, and preserve placement record.',
      related_entity_type: 'ai_era_pathway_plan',
      related_entity_id: plan.id,
      owner_name: body.teacher_name || 'Assigned teacher',
      metadata: { source: 'v1.43 course placement', learner_name: body.learner_name || body.student_name || null, level }
    });
    res.status(201).json({ ok: true, version: VERSION, placement: { level, average, scores, recommended_courses: courses }, pathway_plan: plan, teacher_action: action, privacy_rule: 'Employer-visible placement output should remain high-level and privacy-safe by default.' });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v143/learning-path-enrollment', async (req, res) => {
  try {
    const body = req.body || {};
    const level = body.level || 'Intermediate';
    const courses = v143RecommendedCourses(level, body.goal || 'Legal English performance in the AI era').slice(0, Number(body.course_count || 5));
    const firstCourse = courses[0] || v143CoursePlacementSeed().courses[0];
    const homework = await persistentStore.createHomeworkAssignment({
      class_session_id: body.class_session_id || null,
      title: `Start ${firstCourse.name}`,
      instructions: `Begin Lesson 1: ${firstCourse.lessons[0]}. Save one SmartTeacher AI practice item to the lesson folder and bring one question to your teacher. Practice only — not legal advice or certified translation.`,
      status: 'assigned_from_v143_learning_path',
      metadata: { source: 'v1.43 learning path enrollment', level, course_id: firstCourse.id, full_course_path: courses.map(c=>c.id), preserve_across_deploys: true }
    });
    const plan = await persistentStore.createAiEraPathwayPlan({
      role: body.role || 'student',
      goal: body.goal || 'Legal English performance in the AI era',
      recommended_track: courses.map(c=>c.name).join(' → '),
      ai_practice_action: 'Use SmartTeacher AI for each lesson, then save selected practice into the lesson folder.',
      teacher_review_action: 'Teacher reviews saved practice, assigns homework, and confirms readiness before moving to the next course group.',
      employer_visibility: 'High-level course progress only unless learner/program permissions allow more.',
      metadata: { source: 'v1.43 learning path enrollment', level, course_ids: courses.map(c=>c.id), first_homework_id: homework.id }
    });
    res.status(201).json({ ok: true, version: VERSION, pathway_plan: plan, first_homework: homework, ordered_courses: courses, next_step: 'Teacher confirms the starting level and opens the first lesson plan.' });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v143/lesson-plan-handoff', async (req, res) => {
  try {
    const body = req.body || {};
    const courseId = body.course_id || 'legal-email-writing';
    const course = v143CoursePlacementSeed().courses.find(c => c.id === courseId) || v143CoursePlacementSeed().courses.find(c => c.id === 'legal-email-writing');
    const module = await persistentStore.createAiEraCurriculumModule({
      track: course.group,
      module_title: course.name,
      audience: body.audience || 'students_teachers_employers',
      ai_translator_safety_focus: 'Each lesson should include one AI-translator safety, confidentiality, tone, or teacher-review judgment moment.',
      teacher_review_required: true,
      status: 'active',
      metadata: { source: 'v1.43 lesson plan handoff', course_id: course.id, level: course.level, lesson_sequence: course.lessons, outputs: course.outputs, no_data_loss: true }
    });
    const review = await persistentStore.createTeacherReviewHandoff({
      student_name: body.student_name || body.learner_name || null,
      teacher_name: body.teacher_name || 'Assigned teacher',
      source_type: 'v143_lesson_plan_handoff',
      practice_title: course.name,
      review_reason: 'Teacher should adapt the ordered lesson sequence to the learner level, goal, preferred language, and AI-translator safety needs.',
      confidentiality_status: 'no_confidential_information_required_for_template',
      review_status: 'teacher_planning_needed',
      class_session_id: body.class_session_id || null,
      metadata: { curriculum_module_id: module.id, course_id: course.id, source: 'v1.43 course placement' }
    });
    res.status(201).json({ ok: true, version: VERSION, course, curriculum_module: module, teacher_review_handoff: review, lesson_plan_rule: 'Teacher may customize sequence, but should not skip diagnostic, AI safety, Translation Bridge boundary, or teacher-review steps.' });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v143/employer-curriculum-report', async (req, res) => {
  try {
    const body = req.body || {};
    const report = await persistentStore.createEmployerRoiSnapshot({
      employer_name: body.employer_name || body.organization_name || 'Employer account',
      cohort_name: body.cohort_name || 'Legal English cohort',
      reporting_period: body.reporting_period || 'Curriculum placement summary',
      learners_active: body.learners_active || 0,
      attendance_rate: body.attendance_rate || null,
      homework_completion_rate: body.homework_completion_rate || null,
      ai_translation_safety_progress: body.ai_translation_safety_progress || 'Learners are placed into ordered paths that include AI Translator Safety and teacher-reviewed Legal English performance practice.',
      professional_tone_progress: body.professional_tone_progress || 'Course progress is summarized by level, track, completion, and teacher-safe next recommendations.',
      speaking_confidence_progress: body.speaking_confidence_progress || 'Speaking/client-call/meeting progress is reported only at a high level.',
      privacy_status: 'employer_safe_curriculum_summary_only',
      recommended_next_training: body.recommended_next_training || 'Continue assigned level path, then add Contracts, Legal Writing, Meetings, and AI Translator Safety Lab as appropriate.',
      metadata: { source: 'v1.43 employer curriculum report', excluded_by_default: ['private drafts','raw SmartTeacher AI prompts/responses','raw native-language explanations','sensitive uploads','teacher-private notes','test answers unless program permissions allow'], ...(body.metadata || {}) }
    });
    res.status(201).json({ ok: true, version: VERSION, report, privacy_rule: 'Employer curriculum reports show placement and progress only at a high level unless permissions clearly allow more.' });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});


function v144FourSkillsAcademySeed() {
  return {
    label: 'v1.44.0 Four-Skills Voice + Reading/Writing Academy',
    boundary: 'Education, language training, and communication practice only — not legal advice, certified translation, court interpretation, or final legal meaning.',
    placement_rule: 'SmartTeacher AI may suggest speaking, listening, reading, and writing skill bands, but human teachers confirm placement before high-stakes progress reporting or advanced/expert placement.',
    skills: [
      { id: 'speaking', name: 'Speaking', purpose: 'Pronunciation, fluency, client calls, meetings, negotiations, presentations, confidence, and speaking without reading from a translator.' },
      { id: 'listening', name: 'Listening', purpose: 'Understand teachers, clients, supervisors, meetings, accents, instructions, deadlines, and legal/business nuance.' },
      { id: 'reading', name: 'Reading', purpose: 'Read contracts, emails, policies, case excerpts, forms, memos, and legal/business documents with context and judgment.' },
      { id: 'writing', name: 'Writing', purpose: 'Write professional legal/business emails, summaries, memos, status updates, questions, and polished AI-assisted drafts.' }
    ],
    levels: ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Expert'],
    studios: [
      { id: 'voice-practice-studio', name: 'Voice Practice Studio', tools: ['Spoken English prompt', 'Native-language explanation prompt', 'read-aloud practice', 'teacher review handoff', 'recording consent reminder'] },
      { id: 'listening-comprehension-lab', name: 'Listening Comprehension Lab', tools: ['meeting dictation', 'client-call note taking', 'clarifying questions', 'teacher pronunciation feedback'] },
      { id: 'reading-lab', name: 'Legal Reading Lab', tools: ['clause reading', 'case excerpt reading', 'plain-English summary', 'vocabulary extraction', 'AI translation risk check'] },
      { id: 'writing-workshop', name: 'Legal Writing Workshop', tools: ['email rewrite', 'memo/status update', 'tone check', 'AI draft review', 'teacher-reviewed final'] }
    ],
    courses: [
      { id: 'spoken-legal-english-foundations', level: 'Beginner-Novice', skill: 'speaking', name: 'Spoken Legal English Foundations', lessons: ['Professional introductions', 'Pronunciation of common legal words', 'Asking simple clarifying questions', 'Short client-call roleplay', 'Teacher feedback and confidence plan'] },
      { id: 'client-call-meeting-fluency', level: 'Intermediate', skill: 'speaking', name: 'Client Calls and Meeting Fluency', lessons: ['Opening a call', 'Clarifying facts', 'Explaining uncertainty', 'Confirming next steps', 'Speaking without relying on live translation'] },
      { id: 'advanced-negotiation-speech', level: 'Advanced-Expert', skill: 'speaking', name: 'Advanced Negotiation and Presentation Speech', lessons: ['Professional disagreement', 'Sensitive tone', 'Option framing', 'Executive update', 'Recorded roleplay review when consented'] },
      { id: 'legal-listening-note-taking', level: 'All levels', skill: 'listening', name: 'Legal Listening and Note-Taking', lessons: ['Listen for deadlines', 'Identify action items', 'Ask for clarification', 'Summarize what you heard', 'Teacher-reviewed listening notes'] },
      { id: 'legal-reading-foundations', level: 'Beginner-Novice', skill: 'reading', name: 'Legal Reading Foundations', lessons: ['Sentence patterns in legal/business English', 'Common document words', 'Reading short professional emails', 'Plain-English summary', 'Back-to-English vocabulary practice'] },
      { id: 'contract-reading-lab', level: 'Intermediate-Advanced', skill: 'reading', name: 'Contract and Business Document Reading Lab', lessons: ['Definitions and obligations', 'Deadlines and notices', 'Risk and limitation language', 'Summarize clauses safely', 'Ask better questions before relying on translation'] },
      { id: 'case-policy-reading', level: 'Advanced-Expert', skill: 'reading', name: 'Case, Policy, and Legal System Reading', lessons: ['Read a case excerpt', 'Find the issue and holding language', 'Summarize a policy', 'Explain in plain English', 'Teacher-led discussion'] },
      { id: 'legal-writing-foundations', level: 'Beginner-Novice', skill: 'writing', name: 'Legal Writing Foundations', lessons: ['Simple professional sentences', 'Clear requests', 'Short status update', 'Polite follow-up', 'Teacher-reviewed rewrite'] },
      { id: 'professional-email-workshop', level: 'Intermediate', skill: 'writing', name: 'Professional Legal Email Workshop', lessons: ['Subject line and purpose', 'Client update', 'Document request', 'Delay/explanation email', 'Final teacher-reviewed email'] },
      { id: 'advanced-memo-report-writing', level: 'Advanced-Expert', skill: 'writing', name: 'Advanced Memo, Report, and AI-Draft Review Workshop', lessons: ['Executive summary', 'Issue/risk language', 'AI draft revision', 'Professional tone polish', 'Portfolio-ready writing sample'] }
    ],
    voice_safety: [
      'Recording is off by default and requires clear consent where recording is used.',
      'Speech practice should avoid confidential client-identifying facts unless the platform privacy terms and user authority clearly allow it.',
      'Native-language spoken explanations are learning support, not certified interpretation.',
      'Important legal/business wording should be brought to a live teacher or qualified professional when stakes are high.'
    ],
    no_data_loss: ['voice practice records', 'reading scores', 'writing drafts', 'listening notes', 'teacher reviews', 'homework', 'lesson folders', 'calendar/class links', 'payments/credits', 'reports/certificates', 'test scores']
  };
}

function v144NormalizeScore(value, fallback = 55) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function v144PlacementBand(score) {
  if (score < 35) return 'Beginner';
  if (score < 50) return 'Novice';
  if (score < 70) return 'Intermediate';
  if (score < 85) return 'Advanced';
  return 'Expert';
}

app.get('/api/v144/four-skills-academy', (req, res) => {
  res.json({ ok: true, version: VERSION, seed: v144FourSkillsAcademySeed() });
});

app.get('/api/v144/skill-course-map', (req, res) => {
  const seed = v144FourSkillsAcademySeed();
  res.json({ ok: true, version: VERSION, skills: seed.skills, studios: seed.studios, courses: seed.courses, levels: seed.levels, integration: 'Connects to v1.43 course placement, v1.40 lesson-folder saving, teacher-review handoffs, homework, and employer-safe reports.' });
});

app.post('/api/v144/skill-placement-assessment', async (req, res) => {
  try {
    const body = req.body || {};
    const scores = {
      speaking: v144NormalizeScore(body.speaking_score, 50),
      listening: v144NormalizeScore(body.listening_score, 50),
      reading: v144NormalizeScore(body.reading_score, 50),
      writing: v144NormalizeScore(body.writing_score, 50),
      ai_translation_safety: v144NormalizeScore(body.ai_translation_safety_score, 40)
    };
    const average = Math.round((scores.speaking + scores.listening + scores.reading + scores.writing + scores.ai_translation_safety) / 5);
    const level = body.override_level || v144PlacementBand(average);
    const weakest = Object.entries(scores).sort((a,b)=>a[1]-b[1])[0][0];
    const saved = await persistentStore.createSavedWork({
      owner_name: body.student_name || body.learner_name || 'Four-skills learner',
      work_type: 'v144_four_skills_placement',
      title: `Four-skills placement: ${level}`,
      status: 'teacher_confirmation_needed',
      visibility: 'student_teacher_only',
      content_preview: `Speaking ${scores.speaking}; listening ${scores.listening}; reading ${scores.reading}; writing ${scores.writing}; AI safety ${scores.ai_translation_safety}. Weakest skill: ${weakest}.`,
      metadata: { source: 'v1.44 skill placement assessment', scores, average, level, preferred_language: body.preferred_language || null, preserve_across_deploys: true }
    });
    const review = await persistentStore.createTeacherReviewHandoff({
      student_name: body.student_name || body.learner_name || null,
      teacher_name: body.teacher_name || 'Assigned teacher',
      source_type: 'v144_four_skills_placement',
      practice_title: `Confirm ${level} four-skills placement`,
      review_reason: 'Teacher should confirm speaking, listening, reading, writing, native-language support, and AI translator safety placement before assigning the full path.',
      confidentiality_status: 'placement_summary_only_no_sensitive_content',
      review_status: 'teacher_confirmation_needed',
      metadata: { saved_work_id: saved.id, scores, weakest_skill: weakest, preferred_language: body.preferred_language || null }
    });
    res.status(201).json({ ok: true, version: VERSION, level, weakest_skill: weakest, scores, saved_work: saved, teacher_review_handoff: review, next_step: 'Assign the first speaking/listening/reading/writing path after teacher confirmation.' });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v144/voice-practice-session', async (req, res) => {
  try {
    const body = req.body || {};
    const saved = await persistentStore.createSavedWork({
      owner_name: body.student_name || body.learner_name || 'Voice practice learner',
      work_type: 'v144_voice_or_spoken_practice',
      title: body.title || 'Spoken Legal English practice',
      status: body.needs_teacher_review === false ? 'saved_for_practice' : 'teacher_review_recommended',
      visibility: 'student_teacher_only',
      content_preview: body.transcript || body.prompt || 'Voice practice transcript or prompt placeholder. Recording is off by default unless consented.',
      metadata: { source: 'v1.44 voice practice session', skill: body.skill || 'speaking', spoken_language: body.spoken_language || 'English', native_language_support: body.native_language_support || null, recording_consent: Boolean(body.recording_consent), no_raw_audio_stored_by_default: true, preserve_across_deploys: true }
    });
    let review = null;
    if (body.needs_teacher_review !== false) {
      review = await persistentStore.createTeacherReviewHandoff({
        student_name: body.student_name || body.learner_name || null,
        teacher_name: body.teacher_name || 'Assigned teacher',
        source_type: 'v144_voice_practice',
        practice_title: body.title || 'Spoken Legal English practice',
        review_reason: 'Teacher review recommended for pronunciation, fluency, confidence, native-language bridge boundaries, and professional Legal English accuracy.',
        confidentiality_status: body.confidentiality_status || 'no_confidential_client_facts_required',
        review_status: 'teacher_review_needed',
        metadata: { saved_work_id: saved.id, spoken_language: body.spoken_language || 'English', native_language_support: body.native_language_support || null, recording_consent: Boolean(body.recording_consent) }
      });
    }
    res.status(201).json({ ok: true, version: VERSION, saved_work: saved, teacher_review_handoff: review, voice_rule: 'Voice practice is language training only. Recording is off by default and native-language speech support is not certified interpretation.' });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v144/reading-writing-workshop', async (req, res) => {
  try {
    const body = req.body || {};
    const saved = await persistentStore.createSavedWork({
      owner_name: body.student_name || body.learner_name || 'Skills learner',
      work_type: body.skill === 'reading' ? 'v144_reading_lab' : 'v144_writing_workshop',
      title: body.title || (body.skill === 'reading' ? 'Legal Reading Lab practice' : 'Legal Writing Workshop draft'),
      status: 'saved_to_lesson_folder_teacher_review_available',
      visibility: 'student_teacher_only',
      content_preview: body.content_preview || body.summary || 'Reading/writing practice saved for teacher review.',
      metadata: { source: 'v1.44 reading/writing workshop', skill: body.skill || 'writing', level: body.level || 'Intermediate', preferred_language: body.preferred_language || null, preserve_across_deploys: true }
    });
    const homework = await persistentStore.createHomeworkAssignment({
      student_name: body.student_name || body.learner_name || 'Skills learner',
      teacher_name: body.teacher_name || 'Assigned teacher',
      assignment_title: body.homework_title || `Continue ${body.skill === 'reading' ? 'reading comprehension' : 'writing workshop'} practice`,
      instructions: body.instructions || 'Use SmartTeacher AI for practice, use Translation Bridge only to get unstuck, then submit a Legal English version for teacher feedback. Do not include confidential client facts.',
      due_label: body.due_label || 'Before next class',
      status: 'assigned',
      metadata: { source: 'v1.44 reading/writing workshop', saved_work_id: saved.id, skill: body.skill || 'writing' }
    });
    res.status(201).json({ ok: true, version: VERSION, saved_work: saved, homework, next_step: 'Teacher reviews the reading/writing item and decides whether it becomes portfolio progress, homework, or employer-safe summary.' });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v144/employer-four-skills-report', async (req, res) => {
  try {
    const body = req.body || {};
    const report = await persistentStore.createEmployerRoiSnapshot({
      employer_name: body.employer_name || body.organization_name || 'Employer account',
      cohort_name: body.cohort_name || 'Four-skills Legal English cohort',
      reporting_period: body.reporting_period || 'Four-skills progress summary',
      learners_active: body.learners_active || 0,
      attendance_rate: body.attendance_rate || null,
      homework_completion_rate: body.homework_completion_rate || null,
      ai_translation_safety_progress: body.ai_translation_safety_progress || 'Learners practice AI translator safety across speaking, listening, reading, and writing without relying blindly on AI output.',
      professional_tone_progress: body.professional_tone_progress || 'Writing and speaking workshops emphasize professional tone, clarity, and client-safe wording.',
      speaking_confidence_progress: body.speaking_confidence_progress || 'Speaking/listening progress is summarized at a high level; raw transcripts, recordings, native-language explanations, and private drafts are excluded by default.',
      privacy_status: 'employer_safe_four_skills_summary_only',
      recommended_next_training: body.recommended_next_training || 'Continue weakest-skill module, then add AI Translator Safety Lab, Legal Writing Workshop, Reading Lab, and Meetings/Client Calls as appropriate.',
      metadata: { source: 'v1.44 employer four-skills report', excluded_by_default: ['raw transcripts','recordings','private drafts','raw SmartTeacher AI text','raw native-language explanations','sensitive uploads','teacher-private notes','test answers unless permissions allow'], preserve_across_deploys: true, ...(body.metadata || {}) }
    });
    res.status(201).json({ ok: true, version: VERSION, report, privacy_rule: 'Employer four-skills reports show skill progress and next training only; private practice content is excluded by default.' });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});


function v145IntegratedSkillsStudioSeed() {
  return {
    name: 'Integrated Skills Studio',
    version: 'v1.45.0',
    positioning: 'Legal English training for the AI era, not generic English lessons and not simple translation.',
    corePromise: 'Students practice speaking, listening, reading, and writing; get native-language help when stuck; save work to the lesson folder; bring it to the teacher; and prove progress safely.',
    skillLoops: [
      { id: 'speaking', name: 'Spoken Legal English', sequence: ['Prompt', 'Speak or type a spoken-response script', 'Simple English/native-language explanation if stuck', 'Teacher pronunciation and confidence review', 'Roleplay in class'] },
      { id: 'listening', name: 'Listening + Note-Taking', sequence: ['Listen/read prompt', 'Capture deadlines/action items', 'Ask clarifying questions', 'Teacher reviews accuracy', 'Use in meeting/client-call practice'] },
      { id: 'reading', name: 'Legal Reading Lab', sequence: ['Read clause/email/case excerpt', 'Identify terms, obligations, risks, tone', 'Explain in plain English', 'Use Translation Bridge only to get unstuck', 'Teacher confirms understanding'] },
      { id: 'writing', name: 'Legal Writing Workshop', sequence: ['Draft client-safe English', 'Improve tone and clarity', 'Check AI-translated wording for risk', 'Teacher reviews', 'Save progress proof'] }
    ],
    classTypes: [
      'AI + teacher placement diagnostic',
      'Speaking and pronunciation practice',
      'Listening and legal note-taking',
      'Legal reading comprehension lab',
      'Legal writing and email workshop',
      'AI Translator Safety conversation lab',
      'Employer team skills workshop'
    ],
    teacherTools: [
      'before-class learner language card',
      'voice/spoken prompt launcher',
      'listening-note checklist',
      'reading-comprehension question bank',
      'writing workshop rubric',
      'live correction pad',
      'AI translation-risk lens',
      'side-by-side explanation pad',
      'homework handoff',
      'employer-safe summary draft'
    ],
    languagePolicy: {
      majorLanguages: 'Use the v1.41 major-language registry for roughly top-100 world-language support options where practical.',
      lowConfidence: 'Route rare, low-confidence, sensitive, or high-stakes language requests to staff/teacher review instead of pretending every language is safe in every context.',
      boundary: 'Native-language speech or text explanation is learning support, not certified translation, court interpretation, legal advice, or final legal meaning.'
    },
    privacy: {
      voice: 'Recording is off by default; transcripts/prompts are saved only when the user intentionally saves practice.',
      employer: 'Employer reports show skill progress and next training, not raw transcripts, recordings, private drafts, native-language explanations, sensitive uploads, or teacher-private notes by default.',
      preservation: 'Skill records, lesson folders, teacher handoffs, homework, reports, certificates, calendars, payments, credits, test scores, teacher notes, employer records, uploads, support history, and audit logs must survive deploys.'
    }
  };
}

function v145NormalizeScore(value, fallback = 55) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function v145SkillLevelFromScores(scores) {
  const values = Object.values(scores).map(Number).filter(Number.isFinite);
  const average = values.length ? Math.round(values.reduce((a,b)=>a+b,0) / values.length) : 55;
  return { average, level: v144PlacementBand(average), weakest: Object.entries(scores).sort((a,b)=>a[1]-b[1])[0]?.[0] || 'speaking' };
}

app.get('/api/v145/integrated-skills-studio', (req, res) => {
  res.json({ ok: true, version: VERSION, seed: v145IntegratedSkillsStudioSeed() });
});

app.get('/api/v145/skills-course-sequence', (req, res) => {
  const seed = v145IntegratedSkillsStudioSeed();
  res.json({
    ok: true,
    version: VERSION,
    ordered_sequence: ['diagnostic placement', 'foundation skill loop', 'AI translator safety', 'teacher-reviewed workshop', 'homework', 'live class', 'progress proof', 'employer-safe summary where applicable'],
    class_types: seed.classTypes,
    skill_loops: seed.skillLoops,
    recommended_use: 'Start from placement level and weakest skill; do not overwhelm learners with every course at once.'
  });
});

app.post('/api/v145/placement-skill-routing', async (req, res) => {
  try {
    const body = req.body || {};
    const scores = {
      general_english: v145NormalizeScore(body.general_english_score, 55),
      speaking: v145NormalizeScore(body.speaking_score, 50),
      listening: v145NormalizeScore(body.listening_score, 50),
      reading: v145NormalizeScore(body.reading_score, 50),
      writing: v145NormalizeScore(body.writing_score, 50),
      ai_translation_safety: v145NormalizeScore(body.ai_translation_safety_score, 40)
    };
    const routing = v145SkillLevelFromScores(scores);
    const saved = await persistentStore.createSavedWork({
      owner_name: body.student_name || body.learner_name || 'Integrated skills learner',
      work_type: 'v145_integrated_skills_placement',
      title: `Integrated skills placement: ${routing.level}`,
      status: 'teacher_confirmation_needed',
      visibility: 'student_teacher_only',
      content_preview: `Placement summary: ${routing.level}; average ${routing.average}; weakest skill ${routing.weakest}.`,
      metadata: { source: 'v1.45 integrated skills placement', scores, routing, goal: body.goal || null, preferred_language: body.preferred_language || null, preserve_across_deploys: true }
    });
    const review = await persistentStore.createTeacherReviewHandoff({
      student_name: body.student_name || body.learner_name || null,
      teacher_name: body.teacher_name || 'Assigned teacher',
      source_type: 'v145_integrated_skills_placement',
      practice_title: `Confirm ${routing.level} integrated skills path`,
      review_reason: 'Teacher should confirm level, weakest skill, language-support needs, course order, voice/listening/reading/writing assignments, and AI translator safety judgment.',
      confidentiality_status: 'placement_summary_only_no_private_content',
      review_status: 'teacher_confirmation_needed',
      metadata: { saved_work_id: saved.id, scores, routing, preferred_language: body.preferred_language || null }
    });
    res.status(201).json({ ok: true, version: VERSION, routing, scores, saved_work: saved, teacher_review_handoff: review, next_step: 'Assign the first integrated skill loop and save the first practice item to the lesson folder.' });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v145/speaking-listening-session', async (req, res) => {
  try {
    const body = req.body || {};
    const skill = body.skill === 'listening' ? 'listening' : 'speaking';
    const saved = await persistentStore.createSavedWork({
      owner_name: body.student_name || body.learner_name || 'Spoken skills learner',
      work_type: `v145_${skill}_practice`,
      title: body.title || (skill === 'listening' ? 'Listening and note-taking practice' : 'Spoken Legal English practice'),
      status: body.needs_teacher_review === false ? 'saved_for_independent_practice' : 'teacher_review_recommended',
      visibility: 'student_teacher_only',
      content_preview: body.transcript || body.notes || body.prompt || 'Speaking/listening task saved for practice. No raw audio is stored by default.',
      metadata: { source: 'v1.45 speaking/listening session', skill, spoken_language: body.spoken_language || 'English', native_language_support: body.native_language_support || null, recording_consent: Boolean(body.recording_consent), no_raw_audio_stored_by_default: true, preserve_across_deploys: true }
    });
    let review = null;
    if (body.needs_teacher_review !== false) {
      review = await persistentStore.createTeacherReviewHandoff({
        student_name: body.student_name || body.learner_name || null,
        teacher_name: body.teacher_name || 'Assigned teacher',
        source_type: `v145_${skill}_practice`,
        practice_title: saved.title,
        review_reason: skill === 'listening' ? 'Teacher review recommended for listening comprehension, note accuracy, deadlines/action items, and clarification questions.' : 'Teacher review recommended for pronunciation, fluency, confidence, professional tone, and Legal English accuracy.',
        confidentiality_status: body.confidentiality_status || 'no_confidential_client_facts_required',
        review_status: 'teacher_review_needed',
        metadata: { saved_work_id: saved.id, skill, spoken_language: body.spoken_language || 'English', native_language_support: body.native_language_support || null, recording_consent: Boolean(body.recording_consent) }
      });
    }
    res.status(201).json({ ok: true, version: VERSION, saved_work: saved, teacher_review_handoff: review, boundary: 'Speaking/listening practice is language training only. Native-language speech help is not certified interpretation or legal advice.' });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v145/reading-writing-session', async (req, res) => {
  try {
    const body = req.body || {};
    const skill = body.skill === 'reading' ? 'reading' : 'writing';
    const saved = await persistentStore.createSavedWork({
      owner_name: body.student_name || body.learner_name || 'Reading/writing learner',
      work_type: `v145_${skill}_workshop`,
      title: body.title || (skill === 'reading' ? 'Legal Reading Lab exercise' : 'Legal Writing Workshop draft'),
      status: 'saved_to_lesson_folder_teacher_review_available',
      visibility: 'student_teacher_only',
      content_preview: body.content_preview || body.summary || 'Reading/writing practice saved for teacher review and homework planning.',
      metadata: { source: 'v1.45 reading/writing session', skill, level: body.level || 'Intermediate', preferred_language: body.preferred_language || null, ai_translation_safety_check: Boolean(body.ai_translation_safety_check), preserve_across_deploys: true }
    });
    const homework = await persistentStore.createHomeworkAssignment({
      student_name: body.student_name || body.learner_name || 'Reading/writing learner',
      teacher_name: body.teacher_name || 'Assigned teacher',
      assignment_title: body.homework_title || (skill === 'reading' ? 'Reading comprehension follow-up' : 'Writing revision follow-up'),
      instructions: body.instructions || 'Complete the Legal English version first. Use Translation Bridge only to get unstuck, then return to Legal English and ask your teacher to review tone, clarity, and risk language.',
      due_label: body.due_label || 'Before next class',
      status: 'assigned',
      metadata: { source: 'v1.45 reading/writing session', saved_work_id: saved.id, skill }
    });
    res.status(201).json({ ok: true, version: VERSION, saved_work: saved, homework, next_step: 'Teacher reviews the reading/writing work and decides whether it becomes homework, portfolio proof, or an employer-safe progress point.' });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v145/teacher-classroom-tool-action', async (req, res) => {
  try {
    const body = req.body || {};
    const action = body.action || 'integrated skills classroom action';
    const review = await persistentStore.createTeacherReviewHandoff({
      student_name: body.student_name || body.learner_name || 'Class learner',
      teacher_name: body.teacher_name || 'Assigned teacher',
      source_type: 'v145_teacher_classroom_tool_action',
      practice_title: body.title || action,
      review_reason: body.review_reason || 'Teacher used classroom tool to connect speaking, listening, reading, writing, Translation Bridge, AI translator safety, homework, and progress proof.',
      confidentiality_status: body.confidentiality_status || 'teacher_controlled_classroom_note',
      review_status: body.review_status || 'classroom_follow_up_needed',
      metadata: { source: 'v1.45 teacher classroom tool action', action, skill: body.skill || 'integrated', preserve_across_deploys: true }
    });
    const homework = await persistentStore.createHomeworkAssignment({
      student_name: body.student_name || body.learner_name || 'Class learner',
      teacher_name: body.teacher_name || 'Assigned teacher',
      assignment_title: body.homework_title || `Follow up: ${action}`,
      instructions: body.instructions || 'Practice the assigned skill, save the Legal English version, use native-language help only to get unstuck, and bring the item to the next class.',
      due_label: body.due_label || 'Before next class',
      status: 'assigned',
      metadata: { source: 'v1.45 teacher classroom tool action', teacher_review_handoff_id: review.id, action }
    });
    res.status(201).json({ ok: true, version: VERSION, teacher_review_handoff: review, homework, next_step: 'Classroom action saved; homework and teacher follow-up are connected to the same continuity loop.' });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v145/employer-integrated-skills-report', async (req, res) => {
  try {
    const body = req.body || {};
    const report = await persistentStore.createEmployerRoiSnapshot({
      employer_name: body.employer_name || body.organization_name || 'Employer account',
      cohort_name: body.cohort_name || 'Integrated Legal English skills cohort',
      reporting_period: body.reporting_period || 'Integrated skills progress summary',
      learners_active: body.learners_active || 0,
      attendance_rate: body.attendance_rate || null,
      homework_completion_rate: body.homework_completion_rate || null,
      ai_translation_safety_progress: body.ai_translation_safety_progress || 'Learners practice safe AI use and Translation Bridge boundaries across speaking, listening, reading, and writing.',
      professional_tone_progress: body.professional_tone_progress || 'Writing, speaking, and meeting practice focus on professional tone, clarity, and client-safe wording.',
      speaking_confidence_progress: body.speaking_confidence_progress || 'Speaking/listening confidence is summarized at a high level without raw transcripts or recordings by default.',
      privacy_status: 'employer_safe_integrated_skills_summary_only',
      recommended_next_training: body.recommended_next_training || 'Continue the weakest-skill module, then add Legal Writing Workshop, Reading Lab, Speaking/Listening Lab, and AI Translator Safety Lab as appropriate.',
      metadata: { source: 'v1.45 employer integrated skills report', excluded_by_default: ['raw transcripts','recordings','private drafts','raw SmartTeacher AI text','raw native-language explanations','sensitive uploads','teacher-private notes','test answers unless permissions allow'], preserve_across_deploys: true, ...(body.metadata || {}) }
    });
    res.status(201).json({ ok: true, version: VERSION, report, privacy_rule: 'Employer integrated skills reports show progress, attendance, completion, and next training only; private learner content is excluded by default.' });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v145/no-data-loss-skill-check', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    deployment_rule: 'Code updates must not wipe or reset persistent student, teacher, employer, calendar, payment, report, certificate, course placement, skill practice, lesson folder, test score, upload, support, audit, or payout records.',
    protected_records: ['students','teachers','employers','class sessions','calendar/video links','payments','credits','lesson folders','SmartTeacher practice','speaking/listening practice','reading scores','writing drafts','Translation Bridge records','homework','test scores','reports','certificates','teacher notes','employer records','uploads','support history','audit logs','payouts'],
    migration_policy: 'Additive migrations only; no drop, reset, truncate, destructive seed, or hard-coded live secrets.'
  });
});

function v146LiveSkillsFeedbackSeed() {
  return {
    version: 'v1.46.0',
    name: 'Live Skills Practice + Feedback Loop',
    promise: 'One simple student loop for Legal English practice: choose skill, choose text or spoken mode, use major-language support only when stuck, save the practice packet, ask teacher for feedback, assign homework, and show employer-safe progress without exposing private content.',
    practice_modes: [
      { id: 'text-legal-english', label: 'Text Legal English practice', best_for: 'email drafts, clause explanations, vocabulary, meeting scripts, and writing revision' },
      { id: 'spoken-english', label: 'Spoken English practice', best_for: 'pronunciation, fluency, confidence, client calls, interviews, and meetings' },
      { id: 'native-spoken-bridge', label: 'Native-language spoken bridge', best_for: 'getting unstuck before returning to English; not certified interpretation' },
      { id: 'listening-note-taking', label: 'Listening + note-taking', best_for: 'deadlines, action items, meeting summaries, supervisor/client instructions, and clarification questions' },
      { id: 'reading-lab', label: 'Legal Reading Lab', best_for: 'contracts, cases, policies, letters, forms, and legal/business document fluency' },
      { id: 'writing-workshop', label: 'Legal Writing Workshop', best_for: 'professional email, memos, status reports, AI-draft review, and tone improvement' }
    ],
    skill_sequence: ['Placement', 'Practice packet', 'Language bridge if stuck', 'Lesson folder', 'Teacher feedback', 'Homework or live class', 'Progress proof', 'Employer-safe summary'],
    teacher_feedback_rubric: ['legal-English accuracy', 'professional tone', 'spoken confidence', 'listening comprehension', 'reading comprehension', 'writing clarity', 'AI translator safety', 'confidentiality judgment', 'back-to-English performance'],
    privacy_boundaries: [
      'recording is off by default',
      'raw recordings/transcripts are not employer-visible by default',
      'native-language explanations are learning support, not certified translation or interpretation',
      'sensitive uploads and private drafts stay private unless clear permission allows sharing',
      'teacher-private notes are never automatically shared with employers'
    ],
    no_data_loss_rule: 'Practice packets, voice/spoken tasks, transcripts when intentionally saved, listening notes, reading scores, writing drafts, lesson folders, teacher feedback, homework, calendars, payments, credits, reports, certificates, test scores, teacher notes, employer records, uploads, support history, audit logs, and payouts must persist across deployments.'
  };
}

function v146NormalizeSkill(skill) {
  const s = String(skill || '').toLowerCase();
  if (/listen|note/.test(s)) return 'listening';
  if (/read|clause|case|document/.test(s)) return 'reading';
  if (/write|email|memo|draft|report/.test(s)) return 'writing';
  if (/speak|voice|spoken|oral|pronunciation|call|meeting/.test(s)) return 'speaking';
  return 'integrated';
}

function v146NeedsTeacherReview(body = {}) {
  if (body.needs_teacher_review === false) return false;
  const text = `${body.content_preview || ''} ${body.notes || ''} ${body.prompt || ''} ${body.confidentiality_status || ''}`.toLowerCase();
  return Boolean(body.force_teacher_review || /contract|client|court|deadline|filing|immigration|confidential|privileged|sensitive|legal meaning|high.stakes/.test(text));
}

app.get('/api/v146/live-skills-feedback-loop', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    seed: v146LiveSkillsFeedbackSeed(),
    integrates_with: ['/api/v145/integrated-skills-studio','/api/v144/four-skills-academy','/api/v143/course-placement-system','/api/v141/major-language-bridge','/api/v140/workflow-proof-layer'],
    boundary: 'This is Legal English training for the AI era. It is not legal advice, certified translation, court interpretation, or final legal meaning.'
  });
});

app.get('/api/v146/workshop-series', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    workshops: [
      { id: 'speaking-client-call', skill: 'speaking', level: 'Novice-Advanced', title: 'Client Call and Meeting Speaking Lab', lessons: ['warm-up pronunciation', 'opening the call', 'clarifying facts', 'explaining uncertainty', 'confirming next steps', 'teacher feedback + homework'] },
      { id: 'listening-action-items', skill: 'listening', level: 'Beginner-Advanced', title: 'Listening and Legal Note-Taking Lab', lessons: ['listen for dates and deadlines', 'identify action items', 'separate facts from opinions', 'ask clarification questions', 'summarize the meeting', 'teacher feedback + progress proof'] },
      { id: 'reading-contracts', skill: 'reading', level: 'Intermediate-Expert', title: 'Contract and Document Reading Lab', lessons: ['structure and defined terms', 'obligations and deadlines', 'payment and notice clauses', 'confidentiality and liability language', 'AI translation risk check', 'teacher-reviewed summary'] },
      { id: 'writing-email', skill: 'writing', level: 'Beginner-Expert', title: 'Legal Email and Professional Writing Workshop', lessons: ['purpose and subject line', 'professional tone', 'status updates', 'document requests', 'polite disagreement', 'teacher-reviewed final version'] },
      { id: 'ai-translation-safety', skill: 'integrated', level: 'All levels', title: 'AI Translator Safety Across All Skills', lessons: ['what AI can and cannot do', 'confidentiality check', 'find the risky word', 'compare translation vs legal English', 'rewrite with better tone', 'know when human/professional review is needed'] }
    ],
    order_rule: 'Placement recommends the first workshop, then teachers confirm the order based on level, goal, weakest skill, preferred language, and AI translator safety judgment.'
  });
});

app.post('/api/v146/practice-packet', async (req, res) => {
  try {
    const body = req.body || {};
    const skill = v146NormalizeSkill(body.skill || body.practice_type);
    const mode = body.mode || body.practice_mode || (skill === 'speaking' ? 'spoken-english' : 'text-legal-english');
    const title = body.title || `${skill.charAt(0).toUpperCase()}${skill.slice(1)} Legal English practice packet`;
    const saved = await persistentStore.createSavedWork({
      owner_name: body.student_name || body.learner_name || 'Skills learner',
      work_type: 'v146_live_skills_practice_packet',
      title,
      status: 'saved_to_lesson_folder_feedback_available',
      visibility: 'student_teacher_only',
      content_preview: body.content_preview || body.transcript || body.notes || body.prompt || 'Practice packet saved. Raw audio is not stored by default.',
      metadata: {
        source: 'v1.46 live skills feedback loop',
        skill,
        mode,
        level: body.level || 'Placement needed or teacher-confirmed level',
        preferred_language: body.preferred_language || null,
        native_language_support: body.native_language_support || null,
        recording_consent: Boolean(body.recording_consent),
        no_raw_audio_stored_by_default: true,
        ai_translator_safety_check: body.ai_translator_safety_check !== false,
        preserve_across_deploys: true
      }
    });
    let review = null;
    if (v146NeedsTeacherReview(body) || body.needs_teacher_review !== false) {
      review = await persistentStore.createTeacherReviewHandoff({
        student_name: body.student_name || body.learner_name || 'Skills learner',
        teacher_name: body.teacher_name || 'Assigned teacher',
        source_type: 'v146_live_skills_practice_packet',
        practice_title: title,
        review_reason: body.review_reason || 'Teacher should review skill accuracy, professional tone, AI translator safety, native-language bridge use, confidentiality, and next homework/live-class action.',
        confidentiality_status: body.confidentiality_status || 'student_teacher_only_no_confidential_client_facts_required',
        review_status: 'teacher_feedback_needed',
        metadata: { source: 'v1.46 practice packet', saved_work_id: saved.id, skill, mode, preferred_language: body.preferred_language || null }
      });
    }
    res.status(201).json({ ok: true, version: VERSION, saved_work: saved, teacher_review_handoff: review, next_step: 'Use this packet in the lesson folder, teacher feedback queue, homework, live class, or privacy-safe progress proof.', safety: v146LiveSkillsFeedbackSeed().privacy_boundaries });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v146/teacher-feedback-loop', async (req, res) => {
  try {
    const body = req.body || {};
    const skill = v146NormalizeSkill(body.skill);
    const review = await persistentStore.createTeacherReviewHandoff({
      student_name: body.student_name || body.learner_name || 'Skills learner',
      teacher_name: body.teacher_name || 'Assigned teacher',
      source_type: 'v146_teacher_feedback_loop',
      practice_title: body.title || `${skill} teacher feedback loop`,
      review_reason: body.review_reason || 'Teacher gives skill feedback, decides homework/live-class use, and marks what can be included in employer-safe progress reporting.',
      confidentiality_status: body.confidentiality_status || 'teacher_controlled_feedback_note',
      review_status: body.review_status || 'feedback_loop_open',
      metadata: { source: 'v1.46 teacher feedback loop', skill, rubric: v146LiveSkillsFeedbackSeed().teacher_feedback_rubric, preserve_across_deploys: true }
    });
    const homework = await persistentStore.createHomeworkAssignment({
      student_name: body.student_name || body.learner_name || 'Skills learner',
      teacher_name: body.teacher_name || 'Assigned teacher',
      assignment_title: body.homework_title || `Revise and practice ${skill} item`,
      instructions: body.instructions || 'Revise the Legal English version, use native-language explanation only to get unstuck, save the final version, and bring one question to class.',
      due_label: body.due_label || 'Before next class',
      status: 'assigned_from_v146_teacher_feedback',
      metadata: { source: 'v1.46 teacher feedback loop', teacher_review_handoff_id: review.id, skill, preserve_across_deploys: true }
    });
    res.status(201).json({ ok: true, version: VERSION, teacher_review_handoff: review, homework, next_step: 'Teacher feedback is connected to homework, live class, lesson folder, and employer-safe progress proof.' });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v146/employer-skills-progress-brief', async (req, res) => {
  try {
    const body = req.body || {};
    const report = await persistentStore.createEmployerRoiSnapshot({
      employer_name: body.employer_name || body.organization_name || 'Employer account',
      cohort_name: body.cohort_name || 'Live skills cohort',
      reporting_period: body.reporting_period || 'Live skills progress brief',
      learners_active: body.learners_active || 0,
      attendance_rate: body.attendance_rate || null,
      homework_completion_rate: body.homework_completion_rate || null,
      ai_translation_safety_progress: body.ai_translation_safety_progress || 'Learners practiced AI translator safety while moving back to Legal English performance.',
      professional_tone_progress: body.professional_tone_progress || 'Teacher-reviewed tone, clarity, and workplace communication summarized at a high level.',
      speaking_confidence_progress: body.speaking_confidence_progress || 'Speaking/listening progress summarized without raw recordings or transcripts by default.',
      privacy_status: 'employer_safe_v146_skills_brief_only',
      recommended_next_training: body.recommended_next_training || 'Continue the weakest-skill workshop and AI Translator Safety Across All Skills; schedule teacher-led review for high-stakes language.',
      metadata: { source: 'v1.46 employer skills progress brief', excluded_by_default: ['raw recordings','voice transcripts','private drafts','raw SmartTeacher AI text','raw native-language explanations','sensitive uploads','teacher-private notes','test answers unless permissions allow'], preserve_across_deploys: true, ...(body.metadata || {}) }
    });
    res.status(201).json({ ok: true, version: VERSION, report, privacy_rule: 'Employer briefs show high-level progress and ROI; private student content remains excluded by default.' });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v146/skill-data-preservation-review', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    no_data_loss_rule: v146LiveSkillsFeedbackSeed().no_data_loss_rule,
    protected_records: ['students','teachers','employers','course placements','practice packets','voice/spoken tasks','saved transcripts when intentionally saved','listening notes','reading scores','writing drafts','lesson folders','teacher feedback','homework','class sessions','calendar/video links','payments','credits','reports','certificates','test scores','teacher notes','employer records','uploads','support history','audit logs','payouts'],
    deployment_policy: 'Code-only deploys by default. Additive migrations only. No drop, reset, truncate, destructive seed, hard-coded live secrets, or fake integration success.'
  });
});


function v147SimplicityCommandSeed() {
  return {
    label: 'v1.47.0 Simplicity Command Pass',
    promise: 'Make EnglishLegalese easier to understand and operate without adding complexity for its own sake.',
    role_first_flow: [
      'Student: place level, choose course path, practice speaking/listening/reading/writing, use language help when stuck, save work, get teacher feedback, show progress.',
      'Teacher: prepare class, review saved practice, use classroom tools, assign homework, close out, create employer-safe notes, preserve teacher judgment.',
      'Employer: train team, see privacy-safe progress, track attendance/completion/AI-safety, renew or top up without seeing private learner content by default.',
      'Owner/staff: monitor blockers, language-support flags, teacher-review handoffs, classroom readiness, payments/credits, reports/certificates, data-preservation checks.'
    ],
    simplified_navigation: ['Start', 'Skills Studio', 'Courses', 'SmartTeacher AI', 'Teachers', 'Employers', 'Global Access', 'Trust', 'Dashboard'],
    ai_translator_answer: 'AI can translate words. EnglishLegalese trains the professional performance AI translation cannot guarantee: judgment, context, confidentiality awareness, tone, speaking confidence, reading comprehension, writing clarity, and safe AI-output review.',
    no_data_loss_rule: 'Code deployments must preserve student work, lesson folders, homework, voice/spoken tasks, listening notes, reading scores, writing drafts, AI practice, Translation Bridge records, calendars, class links, payments, credits, reports, certificates, test scores, teacher notes, employer records, uploads, support history, audit logs, and payouts.',
    privacy_boundaries: ['No raw recordings by default', 'No raw transcripts to employers by default', 'No private drafts to employers by default', 'No raw native-language explanations to employers by default', 'No sensitive uploads to employers by default', 'No teacher-private notes to employers by default'],
    teacher_classroom_focus: ['Before class: goals, level, language, saved work, access check', 'During class: correction pad, roleplay, reading/writing/listening prompts, Translation Bridge only when stuck', 'After class: teacher feedback, homework, employer-safe note, report/certificate status, payout readiness'],
    trust_labels: ['Practice only — not legal advice', 'Language support — not certified translation or interpretation', 'Employer-safe summary — private learner content excluded by default', 'Data preserved across code-only deploys', 'Google optional; internal calendar is source of truth']
  };
}

app.get('/api/v147/simplicity-command-pass', (req, res) => {
  res.json({ ok: true, version: VERSION, seed: v147SimplicityCommandSeed() });
});

app.post('/api/v147/role-next-action-plan', async (req, res) => {
  try {
    const body = req.body || {};
    const role = String(body.role || 'student').toLowerCase();
    const goal = body.goal || body.learner_goal || 'Legal English training for the AI era';
    const language = body.preferred_language || body.native_language || 'English or major-language support if stuck';
    const roleSteps = {
      student: ['Confirm level and goal', 'Start the right course path', 'Practice one skill', 'Use language help only when stuck', 'Save to lesson folder', 'Ask teacher for review', 'Complete homework before class'],
      teacher: ['Review saved practice and language flags', 'Prepare before/during/after class tools', 'Teach live', 'Assign homework', 'Close out class', 'Mark employer-safe progress'],
      employer: ['Confirm team goal', 'Review privacy-safe readiness', 'Schedule training', 'Track attendance/completion', 'Review high-level progress', 'Top up or renew'],
      admin: ['Check revenue/classroom/data blockers', 'Confirm teacher match and provider access', 'Review language-support queues', 'Release reports/certificates', 'Run data-preservation gate']
    };
    const steps = roleSteps[role] || roleSteps.student;
    const task = await persistentStore.createStaffTask({
      task_type: 'v147_role_next_action_plan',
      priority: body.priority || 'normal',
      owner_role: role === 'admin' ? 'staff' : role,
      title: `v1.47 next-action plan for ${role}`,
      description: `Goal: ${goal}. Language support: ${language}. Steps: ${steps.join(' → ')}`,
      status: 'open',
      metadata: { source: 'v1.47 simplicity command pass', role, goal, preferred_language: language, steps, preserve_across_deploys: true }
    });
    res.status(201).json({ ok: true, version: VERSION, role, next_actions: steps, task, safety: v147SimplicityCommandSeed().trust_labels });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v147/data-continuity-gate', (req, res) => {
  const seed = v147SimplicityCommandSeed();
  res.json({
    ok: true,
    version: VERSION,
    gate: 'passed_static_policy_check',
    no_data_loss_rule: seed.no_data_loss_rule,
    blocked_actions: ['drop production tables', 'reset production database', 'truncate user data', 'destructive seed scripts', 'hard-code live secrets', 'fake successful integrations', 'replace internal calendar source of truth', 'make Google a hard dependency'],
    required_before_live_deploy: ['code-only deploy by default', 'additive migrations only', 'backup before risky changes', 'staging check', 'production credential readiness check', 'ZIP excludes live secrets and node_modules']
  });
});

app.post('/api/v147/employer-privacy-snapshot', async (req, res) => {
  try {
    const body = req.body || {};
    const report = await persistentStore.createEmployerRoiSnapshot({
      employer_name: body.employer_name || body.organization_name || 'Employer account',
      cohort_name: body.cohort_name || 'AI-era Legal English cohort',
      reporting_period: body.reporting_period || 'v1.47 privacy-safe progress snapshot',
      learners_active: body.learners_active || 0,
      attendance_rate: body.attendance_rate || null,
      homework_completion_rate: body.homework_completion_rate || null,
      ai_translation_safety_progress: body.ai_translation_safety_progress || 'Learners practiced safe use of AI translation and returned to Legal English performance.',
      professional_tone_progress: body.professional_tone_progress || 'Teacher-reviewed tone, clarity, writing, reading, listening, and speaking progress summarized at a high level.',
      speaking_confidence_progress: body.speaking_confidence_progress || 'Speaking and listening progress summarized without raw recordings or transcripts by default.',
      privacy_status: 'employer_safe_v147_snapshot_private_content_excluded_by_default',
      recommended_next_training: body.recommended_next_training || 'Continue the weakest-skill path, then schedule teacher-led AI Translator Safety review and employer-safe certificate/report update.',
      metadata: { source: 'v1.47 employer privacy snapshot', excluded_by_default: v147SimplicityCommandSeed().privacy_boundaries, preserve_across_deploys: true, ...(body.metadata || {}) }
    });
    res.status(201).json({ ok: true, version: VERSION, report, privacy_boundaries: v147SimplicityCommandSeed().privacy_boundaries });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});


function v148UsabilityContinuitySeed() {
  return {
    label: 'v1.48.0 Usability Continuity Pass',
    promise: 'Make EnglishLegalese easier for every user to understand, while preserving every record that matters.',
    user_paths: {
      student: ['Know my level', 'See my next class or practice', 'Use SmartTeacher AI or teacher help', 'Save work safely', 'Track progress and certificates'],
      teacher: ['See who needs help', 'Prepare the next class', 'Teach online with simple tools', 'Review saved work', 'Close out and send safe progress notes'],
      employer: ['See team status', 'Check attendance and completion', 'Review privacy-safe progress', 'Buy more credits or request training', 'Never see private learner drafts by default'],
      staff_owner: ['Find blockers', 'Protect data', 'Check payments and credits', 'Release reports/certificates', 'Keep deployments code-only unless an additive migration is needed']
    },
    plain_language_rules: [
      'Show one next best action first.',
      'Use role-specific words instead of internal platform jargon.',
      'Avoid fake buttons, overloaded cards, and unnecessary choices.',
      'Keep AI-era positioning visible but practical.',
      'Say what is private, what is shared, and what is protected.'
    ],
    ai_translator_answer: 'AI can translate words. EnglishLegalese trains the judgment, context, confidentiality awareness, professional tone, reading, writing, speaking, listening, and safe AI-output review that legal and business work still requires.',
    data_preservation_rule: 'New deployments must preserve student work, lesson folders, homework, voice/spoken tasks, listening notes, reading scores, writing drafts, SmartTeacher AI practice, Translation Bridge records, calendars, class links, payments, credits, reports, certificates, test scores, teacher notes, employer records, uploads, support history, audit logs, and payouts.',
    protected_update_model: ['code-only deploy by default', 'additive migrations only when needed', 'no destructive reset/drop/wipe/truncate', 'no hard-coded live secrets', 'no fake integration success', 'internal EnglishLegalese calendar remains source of truth']
  };
}

app.get('/api/v148/usability-continuity-pass', (req, res) => {
  res.json({ ok: true, version: VERSION, seed: v148UsabilityContinuitySeed() });
});

app.post('/api/v148/plain-language-user-path', async (req, res) => {
  try {
    const body = req.body || {};
    const role = String(body.role || body.user_role || 'student').toLowerCase();
    const seed = v148UsabilityContinuitySeed();
    const path = seed.user_paths[role] || seed.user_paths.student;
    const task = await persistentStore.createStaffTask({
      task_type: 'v148_plain_language_user_path',
      priority: body.priority || 'normal',
      owner_role: role === 'staff' || role === 'owner' || role === 'admin' ? 'staff' : role,
      title: `v1.48 plain-language path for ${role}`,
      description: `Goal: ${body.goal || 'Make the next step obvious'}. Path: ${path.join(' → ')}`,
      status: 'open',
      metadata: { source: 'v1.48 usability continuity pass', role, path, preserve_across_deploys: true }
    });
    res.status(201).json({ ok: true, version: VERSION, role, next_path: path, task, plain_language_rules: seed.plain_language_rules });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v148/continuity-preservation-audit', (req, res) => {
  const seed = v148UsabilityContinuitySeed();
  res.json({
    ok: true,
    version: VERSION,
    status: 'passed_static_policy_check',
    data_preservation_rule: seed.data_preservation_rule,
    protected_update_model: seed.protected_update_model,
    blocked_actions: ['drop production tables', 'reset production database', 'truncate user records', 'delete uploaded files during code deploy', 'replace payment/credit ledgers', 'hard-code live secrets', 'make Google a hard dependency', 'publish employer reports with private learner content by default']
  });
});

app.post('/api/v148/employer-safe-progress-card', async (req, res) => {
  try {
    const body = req.body || {};
    const report = await persistentStore.createEmployerRoiSnapshot({
      employer_name: body.employer_name || body.organization_name || 'Employer account',
      cohort_name: body.cohort_name || 'Legal English for the AI era team',
      reporting_period: body.reporting_period || 'v1.48 privacy-safe progress card',
      learners_active: body.learners_active || 0,
      attendance_rate: body.attendance_rate || null,
      homework_completion_rate: body.homework_completion_rate || null,
      ai_translation_safety_progress: body.ai_translation_safety_progress || 'Learners are practicing safe AI translation review while returning to Legal English performance.',
      professional_tone_progress: body.professional_tone_progress || 'Professional tone, writing clarity, reading comprehension, speaking confidence, and listening skills summarized at a high level.',
      speaking_confidence_progress: body.speaking_confidence_progress || 'Speaking/listening progress summarized without raw recordings or transcripts by default.',
      privacy_status: 'employer_safe_v148_progress_card_private_content_excluded_by_default',
      recommended_next_training: body.recommended_next_training || 'Continue the weakest-skill path and schedule teacher-led review before certificates or high-stakes employer use.',
      metadata: { source: 'v1.48 employer-safe progress card', excluded_by_default: ['private learner drafts', 'raw SmartTeacher AI text', 'raw native-language explanations', 'raw recordings', 'raw transcripts', 'sensitive uploads', 'test answers', 'teacher-private notes'], preserve_across_deploys: true, ...(body.metadata || {}) }
    });
    res.status(201).json({ ok: true, version: VERSION, report, privacy_rule: 'Employers see progress and recommended next training; private learner content is excluded by default.' });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});


function v149IntuitiveUxSeed() {
  return {
    label: 'v1.49.0 Intuitive UX Continuity Pass',
    promise: 'Show one clear next action first for every role, while preserving all user records across updates.',
    role_paths: {
      student: ['Confirm level and goal', 'See next class or practice', 'Use SmartTeacher AI or teacher help', 'Save work to lesson folder', 'Ask teacher for review', 'Complete homework/class', 'See progress/certificate status'],
      teacher: ['Review class readiness', 'Check saved work and language flags', 'Open classroom tools', 'Teach live', 'Assign homework', 'Close out class', 'Create safe progress note'],
      employer: ['Review roster and credits', 'See attendance/completion', 'Read privacy-safe skill summary', 'Request report/certificate', 'Schedule next training', 'Renew or top up credits'],
      staff_owner: ['Find blockers', 'Protect data before deploy', 'Check payments/credits', 'Check calendar/video links', 'Release safe reports/certificates', 'Review support/payout queues', 'Confirm no destructive migration']
    },
    plain_language_rules: [
      'Put the next best action at the top of every dashboard.',
      'Use role words that users understand before internal platform terms.',
      'Show deeper tools only when the role needs them.',
      'Keep the AI-translator objection answered in the actual flow, not only marketing copy.',
      'Say what stays private, what an employer can see, and what is preserved across deploys.'
    ],
    ai_translator_answer: 'AI can translate words. EnglishLegalese trains judgment, context, confidentiality awareness, professional tone, reading, writing, speaking, listening, and safe AI-output review.',
    preserved_records: ['student work', 'lesson folders', 'homework', 'voice/spoken practice', 'listening notes', 'reading scores', 'writing drafts', 'SmartTeacher AI practice', 'Translation Bridge records', 'calendars', 'class links', 'payments', 'credits', 'reports', 'certificates', 'test scores', 'teacher notes', 'employer records', 'uploads', 'support history', 'audit logs', 'payouts'],
    blocked_deploy_actions: ['drop production tables', 'reset production database', 'truncate user records', 'delete uploaded files during code deploy', 'overwrite payment/credit ledgers', 'publish private learner content to employers by default', 'hard-code live secrets', 'make Google a hard dependency']
  };
}

app.get('/api/v149/intuitive-ux-continuity-pass', (req, res) => {
  res.json({ ok: true, version: VERSION, seed: v149IntuitiveUxSeed() });
});

app.post('/api/v149/user-flow-simplifier', async (req, res) => {
  try {
    const body = req.body || {};
    const role = String(body.role || body.user_role || 'student').toLowerCase().replace(/[^a-z_]/g, '_');
    const seed = v149IntuitiveUxSeed();
    const normalizedRole = seed.role_paths[role] ? role : (role.includes('staff') || role.includes('owner') || role.includes('admin') ? 'staff_owner' : 'student');
    const path = seed.role_paths[normalizedRole];
    const task = await persistentStore.createStaffTask({
      task_type: 'v149_user_flow_simplifier',
      priority: body.priority || 'normal',
      owner_role: normalizedRole === 'staff_owner' ? 'staff' : normalizedRole,
      title: `v1.49 intuitive user flow for ${normalizedRole}`,
      description: `Goal: ${body.goal || 'Make the next step obvious'}. Path: ${path.join(' → ')}`,
      status: 'open',
      metadata: { source: 'v1.49 intuitive UX continuity pass', role: normalizedRole, path, preserve_across_deploys: true }
    });
    res.status(201).json({ ok: true, version: VERSION, role: normalizedRole, next_path: path, task, plain_language_rules: seed.plain_language_rules });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v149/continuity-risk-check', (req, res) => {
  const seed = v149IntuitiveUxSeed();
  res.json({
    ok: true,
    version: VERSION,
    status: 'passed_static_continuity_risk_check',
    preserved_records: seed.preserved_records,
    blocked_deploy_actions: seed.blocked_deploy_actions,
    deploy_rule: 'Code-only deploy by default. Additive migrations only when genuinely needed. Back up and stage before risky changes. Never wipe, replace, or orphan production user data.'
  });
});

app.post('/api/v149/staff-ux-blocker-queue', async (req, res) => {
  try {
    const body = req.body || {};
    const task = await persistentStore.createStaffTask({
      task_type: 'v149_staff_ux_blocker_queue',
      priority: body.priority || 'normal',
      owner_role: 'staff',
      title: body.title || 'v1.49 UX blocker: user may not know the next step',
      description: body.description || 'Review role dashboard copy and make the next action obvious without adding unnecessary features.',
      status: body.status || 'open',
      metadata: { source: 'v1.49 staff UX blocker queue', preserve_across_deploys: true, protected_records: v149IntuitiveUxSeed().preserved_records }
    });
    res.status(201).json({ ok: true, version: VERSION, task });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v149/employer-safe-summary', async (req, res) => {
  try {
    const body = req.body || {};
    const report = await persistentStore.createEmployerRoiSnapshot({
      employer_name: body.employer_name || body.organization_name || 'Employer account',
      cohort_name: body.cohort_name || 'Legal English for the AI era team',
      reporting_period: body.reporting_period || 'v1.49 privacy-safe employer summary',
      learners_active: body.learners_active || 0,
      attendance_rate: body.attendance_rate || null,
      homework_completion_rate: body.homework_completion_rate || null,
      ai_translation_safety_progress: body.ai_translation_safety_progress || 'Learners are practicing safe AI-output review and returning to Legal English performance.',
      professional_tone_progress: body.professional_tone_progress || 'Professional tone, writing clarity, reading comprehension, speaking confidence, and listening skills summarized at a high level.',
      speaking_confidence_progress: body.speaking_confidence_progress || 'Speaking/listening progress summarized without raw recordings or transcripts by default.',
      privacy_status: 'employer_safe_v149_summary_private_content_excluded_by_default',
      recommended_next_training: body.recommended_next_training || 'Continue the next weakest-skill course path and schedule teacher-led review before high-stakes use.',
      metadata: { source: 'v1.49 employer-safe summary', excluded_by_default: ['private learner drafts', 'raw SmartTeacher AI text', 'raw native-language explanations', 'raw recordings', 'raw transcripts', 'sensitive uploads', 'test answers', 'teacher-private notes'], preserve_across_deploys: true, ...(body.metadata || {}) }
    });
    res.status(201).json({ ok: true, version: VERSION, report, privacy_rule: 'Employers see progress and recommended next training; private learner content is excluded by default.' });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});


function v150LanguageLearningBridgeSeed() {
  const languageOptions = Array.isArray(V141_MAJOR_LANGUAGE_OPTIONS) ? V141_MAJOR_LANGUAGE_OPTIONS : [];
  return {
    label: 'v1.50.0 100+ Language Learning Bridge Marketing + Onboarding Pass',
    marketing_headline: 'Get unstuck in 100+ major languages — then return to Legal English.',
    public_count_label: `${languageOptions.length}+ major language options`,
    language_count: languageOptions.length,
    featured_languages: languageOptions.slice(0, 30),
    full_language_options: languageOptions,
    core_message: 'EnglishLegalese supports native/preferred-language explanation for learning support, so students can understand the platform, homework, SmartTeacher AI practice, teacher feedback, scheduling, billing, certificates, and support steps without losing the goal: real Legal English performance.',
    student_enablement: [
      'understand platform steps and class links',
      'ask for Simple English or native-language explanation when stuck',
      'see Legal English, plain-English meaning, and native-language explanation side by side',
      'practice speaking, listening, reading, and writing with less confusion',
      'save confusing items to lesson folders',
      'ask teachers to review important language',
      'return to Legal English after the explanation bridge helps'
    ],
    marketing_surfaces: ['homepage hero/near-hero', 'How it works', 'SmartTeacher AI', 'Translation Bridge', 'student onboarding', 'teacher classroom tools', 'employer marketing', 'teacher marketing toolkit', 'FAQ', 'pricing/package pages', 'dashboards'],
    teacher_enablement: ['learner language card', 'Simple English first prompt', 'side-by-side bridge pad', 'false-friend notes', 'teacher-review handoff', 'back-to-Legal-English practice prompt'],
    employer_safe_summary: 'Employers can see high-level language-support readiness and progress, but raw native-language explanations, private drafts, raw SmartTeacher AI content, recordings/transcripts, sensitive uploads, test answers, and teacher-private notes are excluded by default.',
    boundaries: ['learning support only', 'not certified translation', 'not court interpretation', 'not legal advice', 'not final legal meaning', 'teacher/staff/professional review for rare, low-confidence, sensitive, or high-stakes requests'],
    data_preservation: {
      rule: 'Language-support improvements must be additive/code-only by default and must not wipe or orphan production data.',
      preserve: ['student work', 'lesson folders', 'homework', 'voice/spoken practice', 'listening notes', 'reading scores', 'writing drafts', 'SmartTeacher AI practice', 'Translation Bridge records', 'calendars', 'class links', 'payments', 'credits', 'reports', 'certificates', 'test scores', 'teacher notes', 'employer records', 'uploads', 'support history', 'audit logs', 'payouts'],
      blocked_actions: ['drop production tables', 'reset production database', 'truncate user records', 'delete uploaded files during code deploy', 'overwrite payment/credit ledgers', 'publish private learner content to employers by default', 'hard-code live secrets']
    }
  };
}

app.get('/api/v150/language-learning-bridge', (req, res) => {
  res.json({ ok: true, version: VERSION, seed: v150LanguageLearningBridgeSeed() });
});

app.get('/api/v150/language-marketing-summary', (req, res) => {
  const seed = v150LanguageLearningBridgeSeed();
  res.json({
    ok: true,
    version: VERSION,
    headline: seed.marketing_headline,
    count: seed.language_count,
    public_count_label: seed.public_count_label,
    core_message: seed.core_message,
    what_students_can_do: seed.student_enablement,
    surfaces: seed.marketing_surfaces,
    boundary: 'Translation help is a bridge back to Legal English, not the destination.'
  });
});

app.post('/api/v150/language-onboarding-plan', async (req, res) => {
  try {
    const body = req.body || {};
    const seed = v150LanguageLearningBridgeSeed();
    const language = body.language || body.preferred_language || 'Spanish';
    const supportedMajorLanguage = seed.full_language_options.some(l => l.toLowerCase() === String(language).toLowerCase());
    const highStakes = body.high_stakes === true || body.requires_professional_review === true || !supportedMajorLanguage;
    const savedWork = await persistentStore.createSavedWork({
      owner_name: body.student_name || body.owner_name || 'Unassigned learner',
      work_type: 'v150_language_learning_bridge_plan',
      title: body.title || `100+ Language Learning Bridge plan: ${language}`,
      status: highStakes ? 'teacher_or_staff_review_needed' : 'saved_for_student_learning_path',
      visibility: 'student_teacher_staff_only',
      content_preview: body.content_preview || `Use Simple English first, explain in ${language} only enough to get unstuck, save the item, ask a teacher when important, and return to Legal English practice.`,
      class_session_id: body.class_session_id || null,
      metadata: {
        source: 'v1.50 language learning bridge',
        requested_language: language,
        supported_major_language: supportedMajorLanguage,
        high_stakes: highStakes,
        language_count: seed.language_count,
        student_enablement: seed.student_enablement,
        boundaries: seed.boundaries,
        preserve_across_deploys: true,
        ...(body.metadata || {})
      }
    });
    let teacherReviewHandoff = null;
    if (body.request_teacher_review !== false || highStakes) {
      teacherReviewHandoff = await persistentStore.createTeacherReviewHandoff({
        student_name: body.student_name || body.owner_name || 'Unassigned learner',
        teacher_name: body.teacher_name || null,
        source_type: 'v150_language_learning_bridge',
        practice_title: body.title || `100+ Language Learning Bridge plan: ${language}`,
        review_reason: highStakes ? 'Teacher/staff review needed because the language request is rare, low-confidence, sensitive, or high-stakes.' : 'Teacher review recommended so language support returns the learner to Legal English performance.',
        confidentiality_status: body.confidentiality_status || 'student_teacher_staff_only_private_by_default',
        review_status: highStakes ? 'staff_or_teacher_review_needed' : 'teacher_review_recommended',
        class_session_id: body.class_session_id || null,
        metadata: { saved_work_id: savedWork.id, requested_language: language, supported_major_language: supportedMajorLanguage, source: 'v1.50 language learning bridge', preserve_across_deploys: true, ...(body.metadata || {}) }
      });
    }
    res.status(201).json({
      ok: true,
      version: VERSION,
      supported_major_language: supportedMajorLanguage,
      language_count: seed.language_count,
      saved_work: savedWork,
      teacher_review_handoff: teacherReviewHandoff,
      next_actions: ['Simple English first', `Explain in ${language} only enough to get unstuck`, 'Save to lesson folder', 'Ask teacher/staff for review when needed', 'Return to Legal English speaking, listening, reading, or writing practice'],
      boundary: 'Learning support only — not certified translation, court interpretation, legal advice, or final legal meaning.'
    });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v150/employer-language-readiness-card', async (req, res) => {
  try {
    const body = req.body || {};
    const seed = v150LanguageLearningBridgeSeed();
    const report = await persistentStore.createEmployerRoiSnapshot({
      employer_name: body.employer_name || body.organization_name || 'Employer account',
      cohort_name: body.cohort_name || 'Global Legal English learners',
      reporting_period: body.reporting_period || 'v1.50 language learning bridge readiness',
      learners_active: body.learners_active || 0,
      attendance_rate: body.attendance_rate || null,
      homework_completion_rate: body.homework_completion_rate || null,
      ai_translation_safety_progress: body.ai_translation_safety_progress || `Learners can get unstuck with support across ${seed.language_count}+ major language options while practicing safe AI-output review and returning to Legal English.`,
      professional_tone_progress: body.professional_tone_progress || 'Native-language help is summarized only as learning support readiness; private drafts and raw explanations stay excluded by default.',
      speaking_confidence_progress: body.speaking_confidence_progress || 'Speaking, listening, reading, and writing progress can be summarized at a high level without raw recordings/transcripts or private learner text.',
      privacy_status: 'employer_safe_v150_language_readiness_private_content_excluded_by_default',
      recommended_next_training: body.recommended_next_training || 'Continue the appropriate course path and schedule teacher-led review for important workplace language.',
      metadata: { source: 'v1.50 employer language readiness card', language_count: seed.language_count, public_count_label: seed.public_count_label, excluded_by_default: ['raw native-language explanations', 'private drafts', 'raw SmartTeacher AI text', 'recordings/transcripts', 'sensitive uploads', 'test answers', 'teacher-private notes'], preserve_across_deploys: true, ...(body.metadata || {}) }
    });
    res.status(201).json({ ok: true, version: VERSION, report, privacy_rule: seed.employer_safe_summary });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v150/language-continuity-preservation-check', (req, res) => {
  const seed = v150LanguageLearningBridgeSeed();
  res.json({
    ok: true,
    version: VERSION,
    status: 'passed_static_v150_language_continuity_preservation_check',
    language_count: seed.language_count,
    preserved_records: seed.data_preservation.preserve,
    blocked_actions: seed.data_preservation.blocked_actions,
    deploy_rule: seed.data_preservation.rule,
    confirmation: 'Adding or changing language-support marketing, onboarding, dashboards, or reports must not delete, overwrite, orphan, or weaken existing student, teacher, employer, payment, calendar, report, certificate, score, upload, audit, or payout data.'
  });
});


function v151PageLanguageSelectorSeed() {
  const languageOptions = Array.isArray(V141_MAJOR_LANGUAGE_OPTIONS) ? V141_MAJOR_LANGUAGE_OPTIONS : [];
  return {
    label: 'v1.51.0 Preferred-Language Page Selector + Explanation Bridge',
    marketing_headline: 'Read key pages with support in 100+ major languages — then return to Legal English.',
    public_count_label: `${languageOptions.length}+ major language options`,
    language_count: languageOptions.length,
    language_options: languageOptions,
    supported_surfaces: ['homepage', 'student onboarding', 'SmartTeacher AI', 'course placement', 'skills studio', 'teacher dashboard', 'employer dashboard', 'admin dashboard', 'scheduling/class links', 'billing/payment status', 'certificates/reports', 'support/trust pages'],
    selector_modes: ['Original Legal English', 'Simple English first', 'Preferred-language explanation', 'Side-by-side learning view', 'Back to Legal English practice'],
    student_enablement: [
      'choose and save a preferred explanation language',
      'understand important pages, dashboard instructions, homework, teacher feedback, SmartTeacher AI prompts, scheduling, billing, certificates, and support steps',
      'see Legal English, Simple English, and preferred-language explanation together',
      'save confusing page language to the lesson folder',
      'ask a teacher or staff member to review sensitive/high-stakes language',
      'return to speaking, listening, reading, and writing practice in Legal English'
    ],
    product_boundary: 'This is page explanation and learning support, not a full certified translation website, court interpretation, legal advice, final legal meaning, or a replacement for teacher/professional review.',
    route_to_review_when: ['rare or unsupported language', 'low confidence explanation', 'legal/court/certified translation need', 'sensitive/confidential document', 'deadline/legal right/high-stakes business decision'],
    employer_privacy_rule: 'Employers may see preferred-language readiness, support availability, completion, and high-level progress. They do not see raw translated explanations, private drafts, SmartTeacher AI text, recordings, transcripts, sensitive uploads, test answers, or teacher-private notes by default.',
    data_preservation: {
      rule: 'Preferred-language UI and explanation features must be additive/code-only by default and must not overwrite existing student, teacher, employer, payment, calendar, report, certificate, score, upload, audit, or payout records.',
      preserve: ['student work', 'lesson folders', 'homework', 'voice/spoken practice', 'listening notes', 'reading scores', 'writing drafts', 'SmartTeacher AI practice', 'Translation Bridge records', 'preferred-language settings', 'calendars', 'class links', 'payments', 'credits', 'reports', 'certificates', 'test scores', 'teacher notes', 'employer records', 'uploads', 'support history', 'audit logs', 'payouts'],
      blocked_actions: ['drop production tables', 'reset production database', 'truncate user records', 'delete uploads during code deploy', 'overwrite payment/credit ledgers', 'publish private learner content to employers by default', 'hard-code live secrets']
    }
  };
}

app.get('/api/v151/page-language-selector', (req, res) => {
  res.json({ ok: true, version: VERSION, seed: v151PageLanguageSelectorSeed() });
});

app.get('/api/v151/page-language-options', (req, res) => {
  const seed = v151PageLanguageSelectorSeed();
  const q = String(req.query.q || '').trim().toLowerCase();
  const options = q ? seed.language_options.filter(l => l.toLowerCase().includes(q)).slice(0, 40) : seed.language_options;
  res.json({
    ok: true,
    version: VERSION,
    count: options.length,
    total_supported_major_options: seed.language_count,
    options,
    scope_note: 'Preferred-language page explanations for learning support. Rare, low-confidence, sensitive, or high-stakes requests should route to teacher/staff/professional review.'
  });
});

app.post('/api/v151/preferred-language-setting', async (req, res) => {
  try {
    const body = req.body || {};
    const seed = v151PageLanguageSelectorSeed();
    const language = body.language || body.preferred_language || 'Spanish';
    const supportedMajorLanguage = seed.language_options.some(l => l.toLowerCase() === String(language).toLowerCase());
    const needsReview = !supportedMajorLanguage || body.high_stakes === true || body.requires_professional_review === true;
    const savedWork = await persistentStore.createSavedWork({
      owner_name: body.student_name || body.owner_name || 'Unassigned learner',
      work_type: 'v151_preferred_language_setting',
      title: body.title || `Preferred page explanation language: ${language}`,
      status: needsReview ? 'staff_or_teacher_review_needed' : 'preferred_language_saved',
      visibility: 'student_teacher_staff_only',
      content_preview: body.content_preview || `Use ${language} as the learner's preferred explanation language for page help, Simple English, and side-by-side learning prompts while returning to Legal English practice.`,
      class_session_id: body.class_session_id || null,
      metadata: {
        source: 'v1.51 preferred-language page selector',
        requested_language: language,
        supported_major_language: supportedMajorLanguage,
        needs_review: needsReview,
        modes: seed.selector_modes,
        boundary: seed.product_boundary,
        preserve_across_deploys: true,
        ...(body.metadata || {})
      }
    });
    res.status(201).json({
      ok: true,
      version: VERSION,
      language,
      supported_major_language: supportedMajorLanguage,
      needs_review: needsReview,
      saved_work: savedWork,
      next_actions: ['Show original Legal English', 'Show Simple English first', `Explain in ${language} when needed`, 'Save confusing page language to the lesson folder', 'Ask teacher/staff for review when important', 'Return to Legal English practice'],
      boundary: seed.product_boundary
    });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v151/page-explanation-request', async (req, res) => {
  try {
    const body = req.body || {};
    const seed = v151PageLanguageSelectorSeed();
    const language = body.language || body.preferred_language || 'Spanish';
    const page = body.page || body.page_title || 'current page';
    const supportedMajorLanguage = seed.language_options.some(l => l.toLowerCase() === String(language).toLowerCase());
    const highStakes = body.high_stakes === true || body.requires_professional_review === true || !supportedMajorLanguage;
    const savedWork = await persistentStore.createSavedWork({
      owner_name: body.student_name || body.owner_name || 'Unassigned learner',
      work_type: 'v151_page_explanation_bridge',
      title: body.title || `Page explanation bridge: ${page} in ${language}`,
      status: highStakes ? 'teacher_or_staff_review_needed' : 'saved_to_page_explanation_folder',
      visibility: 'student_teacher_staff_only',
      content_preview: body.content_preview || `Explain ${page} in Simple English first, then in ${language} only enough to help the learner understand and return to Legal English practice.`,
      class_session_id: body.class_session_id || null,
      metadata: {
        source: 'v1.51 page explanation bridge',
        page,
        requested_language: language,
        supported_major_language: supportedMajorLanguage,
        high_stakes: highStakes,
        modes: seed.selector_modes,
        excluded_from_employer_reports_by_default: true,
        preserve_across_deploys: true,
        ...(body.metadata || {})
      }
    });
    let reviewTask = null;
    if (highStakes || body.create_staff_task === true) {
      reviewTask = await persistentStore.createStaffTask({
        task_type: 'v151_page_language_review',
        priority: highStakes ? 'high' : 'normal',
        owner_role: 'staff',
        title: `Review page-language explanation request: ${page} / ${language}`,
        description: 'Confirm whether this page explanation is safe as learning support and route to teacher/professional review if it involves legal advice, certified translation, court interpretation, deadlines, sensitive content, or low-confidence language support.',
        related_entity_type: 'saved_work_item',
        related_entity_id: savedWork.id,
        status: 'open',
        metadata: { source: 'v1.51 page language review', requested_language: language, page, preserve_across_deploys: true }
      });
    }
    res.status(201).json({
      ok: true,
      version: VERSION,
      saved_work: savedWork,
      review_task: reviewTask,
      side_by_side_model: {
        original: 'Original Legal English remains visible.',
        simple_english: 'Simple English explains the step without changing the learning goal.',
        preferred_language: `A ${language} explanation may help the learner get unstuck.`,
        back_to_legal_english: 'The next action is to practice the same concept in Legal English.'
      },
      boundary: seed.product_boundary
    });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v151/employer-language-access-summary', async (req, res) => {
  try {
    const body = req.body || {};
    const seed = v151PageLanguageSelectorSeed();
    const report = await persistentStore.createEmployerRoiSnapshot({
      employer_name: body.employer_name || body.organization_name || 'Employer account',
      cohort_name: body.cohort_name || 'Global Legal English learners',
      reporting_period: body.reporting_period || 'v1.51 preferred-language access summary',
      learners_active: body.learners_active || 0,
      attendance_rate: body.attendance_rate || null,
      homework_completion_rate: body.homework_completion_rate || null,
      ai_translation_safety_progress: body.ai_translation_safety_progress || `Learners can use page explanations and platform help across ${seed.language_count}+ major language options while returning to Legal English performance.`,
      professional_tone_progress: body.professional_tone_progress || 'Language access supports comprehension and confidence, but private learner explanations and drafts stay excluded by default.',
      speaking_confidence_progress: body.speaking_confidence_progress || 'Preferred-language support can help learners prepare for speaking/listening/reading/writing practice; raw transcripts/recordings remain private by default.',
      privacy_status: 'employer_safe_v151_language_access_private_content_excluded_by_default',
      recommended_next_training: body.recommended_next_training || 'Continue the assigned course path and schedule teacher-led review for important workplace language.',
      metadata: { source: 'v1.51 employer language access summary', language_count: seed.language_count, excluded_by_default: ['raw page explanations', 'private drafts', 'raw SmartTeacher AI text', 'native-language explanations', 'recordings/transcripts', 'sensitive uploads', 'test answers', 'teacher-private notes'], preserve_across_deploys: true, ...(body.metadata || {}) }
    });
    res.status(201).json({ ok: true, version: VERSION, report, privacy_rule: seed.employer_privacy_rule });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v151/page-language-continuity-check', (req, res) => {
  const seed = v151PageLanguageSelectorSeed();
  res.json({
    ok: true,
    version: VERSION,
    status: 'passed_static_v151_page_language_continuity_check',
    preserved_records: seed.data_preservation.preserve,
    blocked_actions: seed.data_preservation.blocked_actions,
    deploy_rule: seed.data_preservation.rule,
    confirmation: 'Adding preferred-language selectors, page explanations, and side-by-side learning views must not delete, overwrite, orphan, expose, or weaken existing user records or employer privacy boundaries.'
  });
});


function v152ThreeLayerLanguageSeed() {
  return {
    label: 'v1.52.0 Three-Layer Language Access Strategy',
    promise: 'Use EnglishLegalese in your preferred language when you need help — while you build real Legal English skills.',
    anti_promise: 'Do not promise that every page is perfectly translated into 100+ languages.',
    language_count: V141_MAJOR_LANGUAGE_OPTIONS.length,
    layers: [
      {
        layer: 'Core platform UI help in major languages',
        purpose: 'Help users understand the most important navigation and platform instructions without changing the product into a translation site.',
        coverage: ['Homepage hero', 'Start / onboarding', 'Login / dashboard labels', 'Course placement instructions', 'SmartTeacher AI instructions', 'Translation Bridge instructions', 'Scheduling / class links', 'Billing / payment status explanations', 'Support instructions', 'Trust / privacy notices', 'Not legal advice / not certified translation warnings']
      },
      {
        layer: 'On-demand page explanation in 100+ major languages',
        purpose: 'Let users select Explain this page in my language, then see Original Legal English, Simple English, preferred-language explanation, and Back to Legal English practice.',
        coverage: ['Homepage explanations', 'Student onboarding', 'SmartTeacher AI', 'Course placement', 'Homework instructions', 'Teacher feedback explanations', 'Dashboard help', 'Scheduling/class links', 'Billing/support', 'Certificates/report explanations']
      },
      {
        layer: 'Human-reviewed translations for core marketing pages in top markets',
        purpose: 'Plan polished reviewed versions of the most important marketing pages for advertising, SEO, employer outreach, and trust without generating hundreds of thin translated pages.',
        coverage: ['Homepage landing page', 'For Employers', 'For Teachers', 'SmartTeacher AI', 'Courses', 'Pricing', 'Trust/privacy', 'Native-language support']
      }
    ],
    top_market_languages: ['Spanish', 'Chinese', 'Arabic', 'French', 'Portuguese', 'Russian', 'Turkish', 'Hindi', 'Urdu', 'Korean', 'Japanese', 'Vietnamese', 'Indonesian', 'German', 'Italian', 'Polish', 'Ukrainian', 'Persian/Farsi', 'Bengali', 'Thai'],
    learner_actions: ['Show me the Legal English version', 'Show Simple English', 'Explain in my language', 'Practice this in Legal English', 'Ask my teacher to review'],
    avoid_reasons: ['Adds complexity', 'Translation quality may vary', 'Legal/trust disclaimers can become risky if mistranslated', 'SEO can get messy with many thin translated pages', 'Can confuse positioning by making the site feel like a translation service', 'Maintenance becomes painful when English source pages change'],
    boundary: 'Native-language support is a learning bridge, not certified translation, court interpretation, legal advice, final legal meaning, or a substitute for teacher/professional review.',
    employer_privacy_rule: 'Employers may see language-access readiness and progress summaries, but raw native-language explanations, private drafts, SmartTeacher text, recordings/transcripts, sensitive uploads, test answers, and teacher-private notes stay excluded by default.',
    data_preservation: {
      preserve: ['student work', 'lesson folders', 'homework', 'voice/spoken practice', 'listening notes', 'reading scores', 'writing drafts', 'SmartTeacher AI practice', 'Translation Bridge records', 'preferred-language settings', 'page explanations', 'core UI language settings', 'human-review translation queue records', 'calendars', 'class links', 'payments', 'credits', 'reports', 'certificates', 'test scores', 'teacher notes', 'employer records', 'uploads', 'support history', 'audit logs', 'payouts'],
      blocked_actions: ['drop', 'reset', 'wipe', 'overwrite production records', 'orphan saved work', 'expose private learner content to employers by default'],
      rule: 'Three-layer language access changes must be additive/code-only by default and must never delete, wipe, expose, or weaken production records.'
    }
  };
}

app.get('/api/v152/three-layer-language-strategy', (req, res) => {
  res.json({ ok: true, version: VERSION, strategy: v152ThreeLayerLanguageSeed() });
});

app.get('/api/v152/core-ui-language-scope', (req, res) => {
  const seed = v152ThreeLayerLanguageSeed();
  res.json({ ok: true, version: VERSION, layer: seed.layers[0], promise: seed.promise, boundary: seed.boundary });
});

app.post('/api/v152/language-access-plan', async (req, res) => {
  try {
    const body = req.body || {};
    const seed = v152ThreeLayerLanguageSeed();
    const language = body.language || body.preferred_language || 'Spanish';
    const requestedLayer = body.layer || 'on-demand page explanation';
    const highStakes = Boolean(body.high_stakes || body.sensitive || body.certified_translation_needed || body.court_interpretation_needed || body.legal_advice_needed);
    const supportedMajorLanguage = V141_MAJOR_LANGUAGE_OPTIONS.includes(language);
    const savedWork = await persistentStore.createSavedWork({
      owner_name: body.student_name || body.owner_name || 'Unassigned learner',
      work_type: 'v152_three_layer_language_access_plan',
      title: body.title || `Language access plan: ${language} / ${requestedLayer}`,
      status: highStakes || !supportedMajorLanguage ? 'teacher_or_staff_review_needed' : 'language_access_plan_saved',
      visibility: 'student_teacher_staff_only',
      content_preview: body.content_preview || `Use ${language} as preferred explanation support for platform UI, page explanations, and back-to-Legal-English practice without promising perfect full-page translation.`,
      class_session_id: body.class_session_id || null,
      metadata: {
        source: 'v1.52 three-layer language access strategy',
        requested_language: language,
        supported_major_language: supportedMajorLanguage,
        requested_layer: requestedLayer,
        high_stakes: highStakes,
        learner_actions: seed.learner_actions,
        boundary: seed.boundary,
        preserve_across_deploys: true,
        ...(body.metadata || {})
      }
    });
    let reviewTask = null;
    if (highStakes || !supportedMajorLanguage || body.create_staff_task === true) {
      reviewTask = await persistentStore.createStaffTask({
        task_type: 'v152_language_access_review',
        priority: highStakes ? 'high' : 'normal',
        owner_role: 'staff',
        title: `Review language access request: ${language} / ${requestedLayer}`,
        description: 'Confirm whether this is ordinary learning support, a low-confidence language request, a core UI page, or a high-stakes/legal/certified translation issue that needs teacher, staff, or qualified professional review.',
        related_entity_type: 'saved_work_item',
        related_entity_id: savedWork.id,
        status: 'open',
        metadata: { source: 'v1.52 language access review', requested_language: language, requested_layer: requestedLayer, preserve_across_deploys: true }
      });
    }
    res.status(201).json({ ok: true, version: VERSION, saved_work: savedWork, review_task: reviewTask, strategy: seed.layers, boundary: seed.boundary });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v152/human-reviewed-marketing-page-plan', async (req, res) => {
  try {
    const body = req.body || {};
    const seed = v152ThreeLayerLanguageSeed();
    const language = body.language || body.target_language || 'Spanish';
    const page = body.page || 'Homepage landing page';
    const topMarket = seed.top_market_languages.includes(language);
    const task = await persistentStore.createStaffTask({
      task_type: 'v152_human_reviewed_marketing_translation_plan',
      priority: topMarket ? 'normal' : 'low',
      owner_role: 'staff',
      title: `Plan human-reviewed ${language} marketing page: ${page}`,
      description: 'Prepare or review only the most important marketing page language for advertising, SEO, employer outreach, and trust. Do not create 100+ thin translated page copies or imply certified translation.',
      related_entity_type: 'marketing_page_language_plan',
      related_entity_id: body.related_entity_id || null,
      status: 'open',
      metadata: { source: 'v1.52 top-market human-reviewed page plan', language, page, top_market: topMarket, top_market_languages: seed.top_market_languages, preserve_across_deploys: true, ...(body.metadata || {}) }
    });
    res.status(201).json({ ok: true, version: VERSION, task, top_market: topMarket, top_market_languages: seed.top_market_languages, boundary: seed.boundary });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v152/language-strategy-continuity-check', (req, res) => {
  const seed = v152ThreeLayerLanguageSeed();
  res.json({
    ok: true,
    version: VERSION,
    status: 'passed_static_v152_three_layer_language_continuity_check',
    preserved_records: seed.data_preservation.preserve,
    blocked_actions: seed.data_preservation.blocked_actions,
    deploy_rule: seed.data_preservation.rule,
    confirmation: 'Core UI language help, on-demand page explanations, and human-reviewed top-market page planning must not delete, overwrite, orphan, expose, or weaken existing user records or employer privacy boundaries.'
  });
});


function v153RoleClarityContinuitySeed() {
  return {
    label: 'v1.53.0 Role Clarity + Data Continuity Pass',
    promise: 'Every user should see one clear next step, understand what is saved, and know what stays private.',
    ai_era_positioning: 'EnglishLegalese is Legal English training for the AI era: AI can translate words, but professionals still need judgment, context, confidentiality awareness, professional tone, reading, writing, speaking, listening, and safe AI-output review.',
    logo_rule: 'Preserve the current EnglishLegalese platform logo, favicon, brand board, colors, and premium legal-education-tech style unless the owner explicitly changes the brand direction.',
    role_paths: {
      student: ['Start with placement or continue your learning path', 'Practice in text or speech with SmartTeacher AI', 'Use preferred-language help only when stuck', 'Save to lesson folder', 'Ask teacher to review', 'Attend class', 'Show progress safely'],
      teacher: ['Review learner goal, level, preferred language, and saved practice', 'Prepare the live class agenda', 'Use correction, roleplay, reading, writing, and listening tools', 'Create homework', 'Close out the class', 'Send employer-safe progress note when appropriate'],
      employer: ['See team schedule and completion', 'Review skill progress and AI translator safety readiness', 'Download privacy-safe report', 'Add learners or buy more credits', 'Request custom training'],
      staff_owner: ['Check paid unscheduled learners', 'Resolve teacher match and class-link blockers', 'Review language/support/privacy flags', 'Verify reports/certificates/payouts', 'Run data-preservation checks before deployment']
    },
    plain_language_cards: [
      'What should I do next?',
      'What work is already saved?',
      'What stays private?',
      'Who should review this?',
      'What must not be lost in the next deployment?'
    ],
    employer_privacy_rule: 'Employers see high-level attendance, completion, skill progress, certificates, readiness, and employer-safe summaries. Private drafts, raw SmartTeacher AI text, raw native-language explanations, recordings/transcripts, sensitive uploads, test answers, and teacher-private notes remain excluded by default.',
    data_preservation: {
      preserve: ['student profiles', 'teacher profiles', 'employer accounts', 'placement levels', 'course enrollments', 'lesson folders', 'saved work', 'homework', 'voice/spoken practice', 'listening notes', 'reading scores', 'writing drafts', 'SmartTeacher AI practice', 'Translation Bridge records', 'preferred-language settings', 'page explanations', 'calendars', 'class sessions', 'class links', 'payments', 'credits', 'reports', 'certificates', 'test scores', 'teacher notes', 'employer records', 'uploads', 'support history', 'audit logs', 'payouts'],
      blocked_actions: ['drop production tables', 'reset production data', 'wipe local or object storage records during deploy', 'overwrite user work', 'orphan saved class/session/payment records', 'expose private learner content to employers by default', 'replace the current logo without explicit owner approval'],
      rule: 'v1.53 changes are additive and usability-focused. Deployments must update code without deleting or weakening persistent PostgreSQL/object-storage data.'
    }
  };
}

app.get('/api/v153/role-clarity-continuity-pass', (req, res) => {
  res.json({ ok: true, version: VERSION, strategy: v153RoleClarityContinuitySeed() });
});

app.post('/api/v153/plain-role-next-step', async (req, res) => {
  try {
    const body = req.body || {};
    const seed = v153RoleClarityContinuitySeed();
    const role = (body.role || 'student').toLowerCase();
    const steps = seed.role_paths[role] || seed.role_paths.student;
    const savedWork = await persistentStore.createSavedWork({
      owner_name: body.owner_name || body.student_name || 'Unassigned user',
      work_type: 'v153_plain_role_next_step',
      title: body.title || `Plain next step plan for ${role}`,
      status: 'next_step_plan_saved',
      visibility: role === 'employer' ? 'employer_safe_summary' : 'student_teacher_staff_only',
      content_preview: body.content_preview || `Show one next step first for ${role}: ${steps[0]}. Keep deeper tools available but not overwhelming.`,
      class_session_id: body.class_session_id || null,
      metadata: { source: 'v1.53 role clarity pass', role, steps, plain_language_cards: seed.plain_language_cards, preserve_across_deploys: true, ...(body.metadata || {}) }
    });
    res.status(201).json({ ok: true, version: VERSION, saved_work: savedWork, role, next_steps: steps, privacy_rule: seed.employer_privacy_rule });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v153/staff-data-continuity-review', async (req, res) => {
  try {
    const body = req.body || {};
    const seed = v153RoleClarityContinuitySeed();
    const risky = Boolean(body.migration || body.schema_change || body.storage_change || body.payment_change || body.calendar_change || body.report_change || body.logo_change);
    const task = await persistentStore.createStaffTask({
      task_type: 'v153_data_continuity_review',
      priority: risky ? 'high' : 'normal',
      owner_role: 'staff',
      title: body.title || 'Review data-continuity before deployment',
      description: body.description || 'Confirm this deployment is additive/code-only and preserves user work, calendars, payments, reports, certificates, test scores, notes, employer records, uploads, audit logs, payouts, and the current approved logo.',
      related_entity_type: 'deployment_preservation_check',
      related_entity_id: body.related_entity_id || null,
      status: risky ? 'review_required_before_deploy' : 'open',
      metadata: { source: 'v1.53 staff data continuity review', risky, protected_records: seed.data_preservation.preserve, blocked_actions: seed.data_preservation.blocked_actions, preserve_across_deploys: true, ...(body.metadata || {}) }
    });
    res.status(201).json({ ok: true, version: VERSION, task, risky, preserved_records: seed.data_preservation.preserve, blocked_actions: seed.data_preservation.blocked_actions });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v153/employer-safe-role-summary', async (req, res) => {
  try {
    const body = req.body || {};
    const seed = v153RoleClarityContinuitySeed();
    const report = await persistentStore.createEmployerRoiSnapshot({
      employer_name: body.organization_name || body.employer_name || 'Employer account',
      cohort_name: body.team_name || body.cohort_name || 'Employer team',
      reporting_period: body.reporting_period || 'current training period',
      learners_active: body.learners_active || body.learner_count || 0,
      attendance_rate: body.attendance_rate || body.attendance || 'high-level only',
      homework_completion_rate: body.homework_completion_rate || body.completion || 'high-level only',
      ai_translation_safety_progress: body.ai_translator_safety || 'included',
      professional_tone_progress: body.professional_tone_progress || 'summarized only',
      speaking_confidence_progress: body.speaking_confidence_progress || 'summarized only',
      privacy_status: 'employer_safe_summary_only',
      recommended_next_training: body.recommended_next_training || 'Continue the learner path with teacher-led review and AI Translator Safety practice.',
      metadata: {
        source: 'v1.53 employer safe role summary',
        summary: body.summary || 'Employer-safe summary: learners have clear next steps, skills progress, language-support access, AI translator safety training, and recommended next training without exposing private learner content.',
        skills_progress: body.skills_progress || 'speaking, listening, reading, writing',
        privacy_exclusions: ['private drafts', 'raw SmartTeacher text', 'raw native-language explanations', 'recordings/transcripts', 'sensitive uploads', 'test answers', 'teacher-private notes'],
        employer_privacy_rule: seed.employer_privacy_rule,
        preserve_across_deploys: true,
        ...(body.metadata || {})
      }
    });
    res.status(201).json({ ok: true, version: VERSION, report, privacy_rule: seed.employer_privacy_rule });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v153/deployment-continuity-gate', (req, res) => {
  const seed = v153RoleClarityContinuitySeed();
  const body = req.body || {};
  const requestedActions = Array.isArray(body.requested_actions) ? body.requested_actions : [];
  const blocked = requestedActions.filter(action => seed.data_preservation.blocked_actions.some(rule => String(action).toLowerCase().includes(rule.split(' ')[0])));
  res.json({
    ok: true,
    version: VERSION,
    status: blocked.length ? 'review_required_before_deploy' : 'passed_static_v153_continuity_gate',
    blocked_requested_actions: blocked,
    preserved_records: seed.data_preservation.preserve,
    blocked_actions: seed.data_preservation.blocked_actions,
    deploy_rule: seed.data_preservation.rule,
    logo_rule: seed.logo_rule,
    confirmation: 'Role clarity and UX improvements must remain additive and must not delete, overwrite, orphan, expose, or weaken existing user records, employer privacy boundaries, or the approved current brand assets.'
  });
});


function v154PublicLaunchReadinessSeed() {
  const protectedRecords = ['student profiles','teacher profiles','employer accounts','owner/staff/admin accounts','auth roles','placement results','course enrollments','lesson folders','saved work','homework','voice/spoken practice','listening notes','reading scores','writing drafts','SmartTeacher AI practice','Translation Bridge records','preferred-language settings','page explanations','calendars','class sessions','class links','payments','credits','Stripe checkout records','reports','certificates','test scores','teacher notes','employer records','uploads','support history','audit logs','teacher payouts','marketing attribution'];
  const productionGates = [
    {gate:'Persistent PostgreSQL', status: configured('DATABASE_URL') ? 'configured' : 'missing', required_before:'public paid launch', evidence:'DATABASE_URL set, migrations run in order, backup/restore tested, app not relying on local JSON for real users'},
    {gate:'Owner/admin/auth roles', status: configured('SESSION_SECRET') ? 'partially_configured' : 'missing_secret', required_before:'private beta', evidence:'Owner account created, role access tested for student/teacher/employer/staff/admin/owner, password reset or manual reset SOP ready'},
    {gate:'Stripe payments', status: configured('STRIPE_SECRET_KEY') && configured('STRIPE_WEBHOOK_SECRET') ? 'configured' : 'missing', required_before:'paid launch', evidence:'Products/prices created, checkout success/cancel/failure tested, webhooks update packages/credits, payouts held for staff review'},
    {gate:'SmartTeacher AI', status: configured('OPENAI_API_KEY') ? 'configured' : 'missing', required_before:'AI beta', evidence:'OPENAI_API_KEY server-side only, model set, safety prompts verified, cost limits/usage monitoring ready'},
    {gate:'Email notifications', status: configured('SMTP_HOST') && (configured('SMTP_USER') || configured('SMTP_PASS')) ? 'configured' : 'missing', required_before:'public beta', evidence:'Welcome, booking, class reminder, homework, feedback, receipt, employer report, support emails tested'},
    {gate:'Object storage', status: configured('S3_BUCKET') && configured('S3_ACCESS_KEY_ID') ? 'configured' : 'missing', required_before:'file uploads/reports', evidence:'Presigned upload route, privacy warnings, report/certificate storage, staff access rules, delete/download behavior tested'},
    {gate:'Calendar/video classroom path', status: configured('GOOGLE_CALENDAR_ACCESS_TOKEN') || configured('ZOOM_CLIENT_ID') || process.env.MANUAL_CLASSROOM_LINK_FALLBACK === 'true' ? 'configured_or_manual_fallback' : 'manual_fallback_required', required_before:'live classes', evidence:'Internal class record is source of truth; manual Zoom/Teams/Tencent/VooV/DingTalk link can be pasted; .ics works; Google optional'},
    {gate:'Public legal/trust pages', status:'content_review_required', required_before:'public launch', evidence:'Terms, privacy, refund, disclaimer, AI/use, upload/confidentiality, employer privacy, teacher terms, recording consent reviewed'},
    {gate:'Browser/device QA', status:'test_required', required_before:'public launch', evidence:'Chrome, Edge, iPhone Safari, Android Chrome, tablet, slow connection, logged-out and role accounts tested'},
    {gate:'No-data-loss deployment', status:'always_required', required_before:'every deploy', evidence:'No destructive migrations, no seed reset, no wipe, persistent PostgreSQL/object storage, backup before risky changes, postdeploy smoke checks'}
  ];
  const firstCourses = [
    {course:'Free Legal English Diagnostic', level:'Placement', lessons:['Goal and needs intake','Four-skills baseline sample','AI translator safety scenario','Teacher confirmation recommendation'], outcome:'Recommend level, track, preferred-language support, teacher/AI mix, and first course'},
    {course:'SmartTeacher AI Practice', level:'All levels', lessons:['Safe prompt habits','Simple English vs Legal English','Save to lesson folder','Ask teacher to review'], outcome:'Student can practice between classes without treating AI as legal advice or final meaning'},
    {course:'Legal English Foundations', level:'Beginner/Novice', lessons:['Legal vocabulary basics','Plain-English explanations','Professional tone foundations','False friends and literal translation risks','Short speaking/writing practice'], outcome:'Student can understand basic legal/business phrases and ask clarifying questions'},
    {course:'Legal Writing and Professional Email', level:'Novice/Intermediate', lessons:['Subject lines and purpose','Client-safe tone','Status updates','Document requests','Rewrite AI-translated email safely'], outcome:'Student can write clearer professional legal/business emails'},
    {course:'Speaking, Meetings, and Client Calls', level:'Intermediate', lessons:['Open a meeting','Ask clarifying questions','Summarize next steps','Disagree professionally','Speak without relying on translator'], outcome:'Student can participate in professional legal/business conversations with confidence'},
    {course:'Contract and Document Reading', level:'Intermediate/Advanced', lessons:['Defined terms','Obligations and rights','Deadlines and notices','Confidentiality/indemnity/liability language','When professional review is needed'], outcome:'Student can read and discuss contract language for language-training purposes'},
    {course:'AI Translator Safety Lab', level:'All levels', lessons:['Find the translation risk','Confidentiality check','What did AI miss?','Write safer follow-up questions','Teacher/professional review triggers'], outcome:'Student learns safe AI translator use in legal/business communication'},
    {course:'LL.M. / Law School Readiness', level:'Intermediate/Advanced', lessons:['Case reading','Class discussion','IRAC-style explanation','Professor email etiquette','Cold-call and exam-style speaking practice'], outcome:'International students prepare for U.S. law-school communication'},
    {course:'Employer Team Training', level:'Team-based', lessons:['Team diagnostic','Role-specific vocabulary','Meeting/email/document scenarios','AI translator safety workshop','Employer-safe progress report'], outcome:'Employers see privacy-safe attendance, completion, skill progress, and recommended next training'}
  ];
  const teacherOnboarding = ['Application and credential review','Identity/profile and specialty setup','AI-era teaching philosophy','Translation Bridge as learning aid, not translation service','Online classroom tools walkthrough','Privacy, upload, employer-report, and recording consent rules','Class closeout and homework workflow','Payout and staff-review rules','Approved marketing templates and no off-platform pricing','Mock class before public assignment'];
  const betaMode = {
    name:'Public Beta Mode',
    default_policy:'Invite-only until production gates pass.',
    allowed:['free diagnostic','teacher preview','employer sales demo','manual class-link fallback','staff-reviewed lesson folders','manual invoice or test Stripe only until live Stripe verified'],
    blocked_until_configured:['open paid public checkout','automated payouts','unreviewed public AI-heavy use','unbounded file uploads','automated employer reports without staff review','recorded classes without clear consent'],
    next_step:'After keys/accounts are added, run launch:readiness, e2e:public, predeploy:check, prod:readiness, live:verify, and postdeploy smoke tests.'
  };
  return { label:'v1.54.0 Public Launch Readiness Sprint', productionGates, firstCourses, teacherOnboarding, betaMode, protectedRecords, no_data_loss_rule:'Launch readiness work must be additive. It must never wipe, overwrite, orphan, expose, or weaken saved user work, calendars, payment/credit history, reports, certificates, test scores, teacher notes, employer records, uploads, audit logs, or payouts.' };
}

app.get('/api/v154/public-launch-readiness', (req, res) => {
  res.json({ ok: true, version: VERSION, readiness: v154PublicLaunchReadinessSeed(), mode: persistentStore.mode() });
});

app.get('/api/v154/first-course-content', (req, res) => {
  const seed = v154PublicLaunchReadinessSeed();
  res.json({ ok: true, version: VERSION, courses: seed.firstCourses, launch_rule: 'Show a smaller launch catalog publicly; keep deeper course catalog available behind placement and staff/teacher guidance.' });
});

app.post('/api/v154/launch-gate-check', async (req, res) => {
  try {
    const body = req.body || {};
    const seed = v154PublicLaunchReadinessSeed();
    const strict = Boolean(body.strict_public_launch || body.strict);
    const blockers = seed.productionGates.filter(g => ['missing','missing_secret','manual_fallback_required','content_review_required','test_required'].includes(g.status));
    const task = await persistentStore.createStaffTask({
      task_type: 'v154_public_launch_gate_check',
      priority: blockers.length ? 'high' : 'normal',
      owner_role: 'owner_staff',
      title: body.title || 'Public launch readiness gate check',
      description: body.description || 'Review production gates before public launch. Add real DATABASE_URL, Stripe, OpenAI, SMTP, object storage, video/calendar vendors, legal pages, QA evidence, and backup/restore proof before open paid launch.',
      related_entity_type: 'public_launch_readiness',
      status: strict && blockers.length ? 'blocked_before_public_launch' : 'private_beta_or_demo_only',
      metadata: { source: 'v1.54 launch gate check', blockers, production_gates: seed.productionGates, protected_records: seed.protectedRecords, no_data_loss_rule: seed.no_data_loss_rule, preserve_across_deploys: true, ...(body.metadata || {}) }
    });
    res.status(201).json({ ok: true, version: VERSION, task, mode: persistentStore.mode(), blockers, status: task.status, no_data_loss_rule: seed.no_data_loss_rule });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v154/first-course-lesson-template', async (req, res) => {
  try {
    const body = req.body || {};
    const seed = v154PublicLaunchReadinessSeed();
    const selected = seed.firstCourses.find(c => c.course.toLowerCase() === String(body.course || '').toLowerCase()) || seed.firstCourses[0];
    const homework = await persistentStore.createHomeworkAssignment({
      title: body.title || `${selected.course} — launch lesson template`,
      instructions: body.instructions || `Teacher launch template: objective, vocabulary, speaking/listening/reading/writing task, AI translator safety moment, Translation Bridge help if stuck, homework, teacher-review checkpoint, and employer-safe progress note. Lessons: ${selected.lessons.join(' → ')}.`,
      status: 'launch_template_ready_for_teacher_review',
      metadata: { source: 'v1.54 first-course lesson template', course: selected, teacher_review_required: true, not_legal_advice: true, preserve_across_deploys: true, ...(body.metadata || {}) }
    });
    res.status(201).json({ ok: true, version: VERSION, template: homework, course: selected });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v154/teacher-onboarding-plan', async (req, res) => {
  try {
    const body = req.body || {};
    const seed = v154PublicLaunchReadinessSeed();
    const task = await persistentStore.createStaffTask({
      task_type: 'v154_teacher_onboarding_plan',
      priority: body.priority || 'normal',
      owner_role: 'staff',
      title: body.title || `Teacher onboarding plan: ${body.teacher_name || 'New teacher'}`,
      description: body.description || `Complete teacher onboarding before assigning public students: ${seed.teacherOnboarding.join(' | ')}.`,
      related_entity_type: 'teacher_onboarding',
      status: 'onboarding_required_before_public_assignment',
      metadata: { source: 'v1.54 teacher onboarding', teacher_name: body.teacher_name || null, onboarding_steps: seed.teacherOnboarding, no_off_platform_pricing: true, staff_review_required: true, preserve_across_deploys: true, ...(body.metadata || {}) }
    });
    res.status(201).json({ ok: true, version: VERSION, task, onboarding_steps: seed.teacherOnboarding });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v154/diagnostic-to-course-plan', async (req, res) => {
  try {
    const body = req.body || {};
    const score = Number(body.score || body.diagnostic_score || 60);
    const level = score < 35 ? 'Beginner' : score < 55 ? 'Novice' : score < 75 ? 'Intermediate' : score < 90 ? 'Advanced' : 'Expert';
    const course = level === 'Beginner' || level === 'Novice' ? 'Legal English Foundations' : level === 'Intermediate' ? 'Legal Writing and Professional Email' : 'Contract and Document Reading';
    const saved = await persistentStore.createSavedWork({
      owner_name: body.student_name || 'Diagnostic learner',
      work_type: 'v154_diagnostic_to_course_plan',
      title: body.title || `${level} diagnostic-to-course plan`,
      status: 'teacher_confirmation_recommended',
      visibility: 'student_teacher_staff_only',
      content_preview: `Diagnostic score ${score} places learner at ${level}. Recommended first paid/teacher-reviewed path: ${course}. Preferred-language support: ${body.preferred_language || 'English or chosen major language'}.`,
      metadata: { source: 'v1.54 diagnostic-to-course plan', score, level, recommended_course: course, teacher_confirmation_required: true, preferred_language: body.preferred_language || null, preserve_across_deploys: true, ...(body.metadata || {}) }
    });
    res.status(201).json({ ok: true, version: VERSION, plan: saved, level, recommended_course: course, teacher_confirmation_required: true });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.post('/api/v154/public-beta-readiness', async (req, res) => {
  try {
    const body = req.body || {};
    const seed = v154PublicLaunchReadinessSeed();
    const task = await persistentStore.createStaffTask({
      task_type: 'v154_public_beta_mode',
      priority: 'high',
      owner_role: 'owner_staff',
      title: body.title || 'Prepare controlled public beta mode',
      description: body.description || 'Use invite-only beta until PostgreSQL, backups, auth, Stripe, OpenAI, SMTP, object storage, class-link fallback, legal pages, and QA gates are verified.',
      related_entity_type: 'public_beta_mode',
      status: 'invite_only_beta_recommended',
      metadata: { source: 'v1.54 public beta readiness', betaMode: seed.betaMode, requested_scope: body.scope || 'private beta', protected_records: seed.protectedRecords, preserve_across_deploys: true, ...(body.metadata || {}) }
    });
    res.status(201).json({ ok: true, version: VERSION, task, beta_mode: seed.betaMode });
  } catch (error) {
    res.status(400).json({ ok: false, version: VERSION, error: error.message });
  }
});

app.get('/api/v154/end-to-end-launch-test-plan', (req, res) => {
  res.json({
    ok: true,
    version: VERSION,
    workflow: ['Student signs up','Student selects preferred language','Student takes diagnostic','System recommends course and teacher/AI mix','Student pays or enters beta credit','Credits/package recorded','Class scheduled inside EnglishLegalese','Manual or vendor class link attached','Student joins class','Teacher closes out class','Homework assigned','Student saves SmartTeacher practice','Teacher reviews saved work','Employer receives privacy-safe report','Certificate/progress report generated','Staff reviews payout','Postdeploy smoke test confirms no data loss'],
    scripts: ['npm run check','npm run predeploy:check','npm run prod:readiness','npm run ops:verify','npm run e2e:public','npm run live:verify'],
    warning: 'Do not open paid public launch until production secrets, payments, email, object storage, backups, legal pages, and end-to-end QA pass.'
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`EnglishLegalese ${VERSION} running on port ${PORT}`);
});
