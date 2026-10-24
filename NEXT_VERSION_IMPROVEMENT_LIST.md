## EnglishLegalese v1.85.0 HF3 — Subject-page detail + researched human-class prices (October 24, 2026)
Release state: SOURCE CANDIDATE. Do not claim deployed/accepted until two independent exact-head CI jobs, Render SHA, and public apex/www desktop-tablet-mobile tests pass.

**Owner requested / implemented in this candidate:**
- Put the essential value proposition, subject, key links, enrollment availability disclaimers, class prices and package description at TOP of the dedicated Legal English and Business English pages.
- Show all 24 Legal English topic-specific course previews and 24 Business/Investor English courses directly under those introductions; show four-lesson outlines without extra clicks and make vocabulary, practice feedback, homework and instructor materials accessible within each course card.
- Republish the existing separate Legal and Business 16-session classroom teaching plans ON each subject page, retaining the original separate session page.
- Research 2026 competitor prices; apply owner-approved approximately 15% increase to all human-taught packages and single/4-lesson options: group $28/$89/$289 and private $68/$249/$799; retain monthly AI prices $12/$19/$29, free tools, staffing verification and no active payment checkout.
- Test 48 complete course previews, 32 session summaries, local-only practice, price parity, accessibility/responsiveness, original homepage assets, protected existing 28-topic catalog, and permanent no-email builder rules EL-RGR-023 + EL-DUR-011. No outbound email must occur.
- Preserve predecessor known-good release commit e6a14d2c42eb5bdfeb44729274264c0575a960b4 and documented rollback.

**Next improvements (deferred until separately qualified):**
- Improve individual 4-lesson course-topic progression and learner self-assessment without forcing sign-in; preserve original quiz data, privacy and accessibility.
- Only after appropriate instructor and scheduling verification, provide more exact staffed availability; do not publish fictitious availability.
- AI avatar tutors remain ON HOLD; no email operations in this builder ever.
- Staged database triage migration remains unapplied pending separate explicit authorization; public frontend may not misrepresent it as active.

---

## October 24, 2026 — navigation and classroom follow-through (v1.85.0 source-compatible enhancement)
Status: implementation candidate; NOT PUBLIC until exact release gate and production acceptance. AI avatars on hold and outside scope.
- Add plain-text Legal English top-menu link immediately before Business English; preserve original Courses link, original laptop homepage hero/logo, 28-course catalog, and all older routes.
- Make the 41 previously existing dedicated pages share a consistent navigation set, keeping all 14 free Legal English tools and adding directory access plus all 8 Business English tools and teacher/classroom links. Provide footer paths back to both curricula.
- Publish original 16-session Legal English and separate 16-session Business English human teacher plans. Each has specific objective, sample language, vocabulary, fictional scenario, 50-minute agenda, homework and teacher assessment note; these are not auto-bookings and student work is not transmitted by the plans.
- Introduce a private read-only owner intake review CLI and a safe explicit CSV export with permissions 0600. Do NOT publish applicant PII, add public access, send emails, change payments, or promise automatic owner alerts.
- Preserve original class enrollment request and teacher screening flows, privacy-safe use, and owner 19 Roger Rules, 10 durable rules, and 3 later directives.
- Required deployment evidence: two independent exact-head source+browser qualification jobs, live Render SHA, real public apex+www browser acceptance; no unverified launch claims.

# EnglishLegalese v1.85.0 — Business English, Wall Street, staffing and enrolled classroom program
Date: October 23, 2026. Owner approved. THIS IS A CANDIDATE UNTIL TWO INDEPENDENT EXACT-HEAD FULL QUALIFICATIONS, SOURCE/NO-DRIFT CHECKS, RENDER LIVE DEPLOY AND REAL PUBLIC APEX + WWW ACCEPTANCE PASS. Do not claim launch before evidence.

## Complete approved implementation matrix (non-droppable)
| Feature | Site code or evidence | Acceptance |
| --- | --- | --- |
| Original laptop homepage, protected logo/hero and 28-topic catalog | index.html; app.js; curriculum-v1800-data.js; product-v1800-catalog.js | Preserve prior homepage and 28 existing topics; only discreet Business English mentions/navigation |
| Unified general Business English | learn/business-english/index.html; product-v1850-business.js | 16 developed coherent courses, no artificial old/new labels; five educational components each |
| Wall Street & Investor English | learn/business-english/index.html; product-v1850-business.js | 8 distinct fictional finance-language courses, no personal financial advice |
| Free Legal English resources | learn/legal-resources/index.html; 14 previous /learn/ routes | Preserve all 14 individual resource tools and original footer entries |
| Free Business English resources | learn/business-resources/index.html; eight /learn/business-resources/*/ routes; product-v1850-free-resources.js | Eight functioning individual vocabulary, scenario-feedback and private writing labs |
| Separate extended Legal and Business English | pricing/index.html; learn/courses/index.html; learn/business-english/index.html | Independent group $249/student and private $699, sixteen 50-minute lessons, optional investor focus within Business |
| Real instructor-led schedules | Connected Google Calendar series: Legal Monday Nov 2 2026 19:00, Business Wednesday Nov 4 2026 19:00, both Asia/Ho_Chi_Minh | 16 weekly 50-minute sessions per distinct program, teacher assignment and privacy gate; do not publish join links |
| Open classroom enrollment requests | learn/enroll/index.html; product-v1850-enrollment.js; src/v1850-public-intake.js | Backend validation/rate limit/honeypot; durable Neon enrollment table; confirm capacity/identity before individual joining details |
| Open teacher staffing applications | learn/teach-with-us/index.html; product-v1850-teacher-application.js | Durable Neon applications, qualifications, availability, role review, multiple teacher capacity, no fabricated hires |
| Easier top laptop menu and both footer libraries | index.html; product-v1550-preserve.js; dedicated navigation pages | Clear Courses, Business English, Free Resources, Teachers & Classes, Pricing, Enroll, Account; no loss of protected original navigation |
| Stripe off, privacy and current owner rules | server.js; src/v1850-public-intake.js; governance register; v1.85 verifier | No checkout/charges or paid AI bypass, no unsolicited outbound email, original 19 Roger + 10 durable + newer owner directives |
| Release qualification and production | scripts/verify-v1850-business.js; tests/v1850-browser.spec.js; tests/v1850-production.spec.js; Playwright and GitHub Actions | All platforms, independent whole-suite runs x2 same SHA, Render live SHA, apex/www separate acceptance, revert if unsafe |

## Next-release priorities, only AFTER qualified live v1.85.0
- Staffing operations: protected owner review dashboard for teacher applications, credentials, scheduling and interviews; no unauthenticated applicant access.
- Enrollment operations: verified email confirmation and staff assignment, student capacity, waitlist and cancellation/refund terms; maintain real private data separation.
- Calendar synchronization and time-zone conversion: display learners' local equivalent of instructor-specific class times without publishing unconfirmed availability or meeting links.
- Higher-quality homework, pronunciation and AI assistance only when vendor/privacy/billing gates qualify; Stripe remains off absent further authorization.
- Systematically improve responsive use while preserving the protected laptop homepage and all 14+8 free resources.

---

## v1.84.0 owner correction — ONE unified catalog of 28 class topics

The owner observed that the homepage and Courses navigation still displayed an old nine-course list, despite the complete 28-class curriculum in the Live Classes section. **Acceptance requirement:** all 28 class topics must be offered together, without grouping them as original/new or 9+19 and without advertising nine courses as the catalog.

- The homepage's Courses section now prominently displays a catalog of **28 class topics**, with twelve immediately readable cards, a clear "Show all 28 class topics" action, real search and track filters, and a full five-part per-topic curriculum viewer. All 28 are sourced from one canonical 28-record dataset.
- The dedicated `/learn/courses/` page now renders **all 28 class-topic cards by default**, with the same functional previews, topic vocabulary, three source-based exercises, homework and teacher brief. Its heading, descriptions and search all use unified language.
- The previous nine sample lessons remain available as optional collapsible "Try guided sample lessons" practice under Courses, explicitly *not* counted as separate class topics. No old/new distinction appears in public copy.
- Existing Live Classes video/provider previews, individual study plans, writing workshop, original source exercises and owner rules are retained. Study-planner placement is kept under Live Classes rather than moved inadvertently when the main catalog was relocated.
- Dedicated browser tests explicitly verify home 28 total, dedicated page 28 actual cards, sample lessons accessible, privacy, 28-course filter/search, no duplicate curriculum count and real study components. No payment, teacher booking, AI inference or outbound contact activation.

# EnglishLegalese v1.84.0 — full dedicated navigation pages, laptop homepage visually unchanged (OWNER SCOPE, STACKED CANDIDATE)
Date: 2026-10-22. Added per explicit owner instruction. THIS IS A DEPENDENT RELEASE stacked upon qualified v1.83.0: PR #38 v1.82.0 and PR #39 v1.83.0 must individually receive two complete exact-SHA qualifications, live Render rollouts and independent public apex/www acceptance **before** v1.84.0 may merge/deploy. No shortcut or premature live claims.

## Maximum reasonable owner-approved material scope
- Preserve existing **laptop homepage layout and visual identity** exactly. No edits to existing root stylesheet, logo, base app, prior learning tools or original homepage Pricing contents. Root index change is limited to actual header/footer/mobile link destinations and current release meta tag. Existing homepage anchors and exercises continue to work when visited directly via `/#id`.
- Every main-menu destination, footer Core/For Teams destination, and all **14 Free learning resources** now has its own real static URL with distinct SEO title, description and canonical. **28 dedicated pages** total: 14 main/footer pages including Start, Courses, SmartTeacher, Teachers, Live Classes, separate Pricing, Study Planner, Employers, Language Support, Trust, Account, Scenario Practice, Learning Path, Progress; and 14 specialist free tools.
- Dedicated fully developed `/pricing/` page duplicates the EXACT unchanged homepage pricing card + team package and all warnings/FAQ, with homepage links appropriately resolved to `/#...`. All other pages feature unique original instructional question, evidence-bound model response, accuracy caveat, functional show/hide sample, clear real activity link to preexisting homepage interactive tool, interlinked navigation, mobile-friendly presentation, original logo and footer Free learning resources.
- The 14 header dropdown learning tools each link to a distinct real page; the footer links to those same 14 dedicated pages. Responsive mobile menu uses dedicated URLs. All old activities remain accessible on root via direct `/#...`.
- Protected canonical 19 Roger Rules, 10 durable rules, owner addenda EL-RGR-020–022, unchanged original brand/logo, previously qualified v1.80 28 complete curricula, v1.81 public pricing, v1.82 private four-session studio, v1.83 private writing feedback, and all backend/security/payments/DNS/account gates are preserved. No new network requests, payments, teacher booking, AI calls, email, private uploads, external JS or persistent browser storage introduced.

## No-drift/release verification
- `scripts/verify-v1840-pages.js` requires exactly 28 real static pages, unique URLs/canonical and original learning content, parity of 14 free links across existing header and footer, exact homepage-to-dedicated Pricing content, old materials and original rules.
- `tests/v1840-browser.spec.js` checks all 28 routes, navigations, actual free interactive model, responsive device width, both pricing sections and predecessor content. `tests/v1840-production.spec.js` checks apex/www live exact health, real separate Pricing, learning pages, original resources.
- Mandatory security/no-drift + entire desktop/tablet/mobile Chromium/WebKit browser suite twice on **same final v1.84 source commit**, then guarded exact main merge, Render auto-deploy and independent public apex/www acceptance, retaining v1.83 deploy for rollback. Never claim deployed without exact live artifact proof.

---

# EnglishLegalese v1.83.0 — 28-case Legal English drafting and teacher feedback workshop (DEPENDENT CANDIDATE)
Date: 2026-10-22. Exact starting source is v1.82 candidate SHA 3931d181004b19de0af03970f0189f460f523bd8; prerequisite v1.82 **MUST** pass two complete exact-head source/security/browser suites, guarded merge, live Render and independent apex/www acceptance BEFORE v1.83 merge. v1.81 is last independently confirmed live version at start. **Never merge stacked candidate prematurely.**

## Substantial original public-educational improvements
- Separate visible, mobile-friendly **fictional drafting and feedback workshop** for all 28 legally specific/Business English curricula. Reuses all 28 original topic scenarios, 140 defined glossary terms, correct model responses, unsafe counterexamples, class outcomes, teacher instructions and homework.
- Four-track and topic selection, three actual target audiences and three actual communication purposes; up to **84 distinct audience/topic objectives** available by changing audience (and 252 audience/purpose/topic combinations). Each topic retains distinct first and rewritten draft, checkbox self-review and selected persona, all only in ephemeral in-page memory.
- Functional first and second 2,500-character writing editors, visible countdown, low-certainty versus high-certainty phrasing cues, original model and risky counterexamples. **No false AI grading:** mechanistic caution phrase/high-certainty and vocabulary detection only; explicit statement it cannot verify legal facts or writing quality.
- Four-part language quality rubric applied per topic; teacher facilitation material with detailed minute plan, original homework, and locally downloadable private before/after learner + teacher workbook. Clear individual or all work. No persistent storage, network send, file upload, billing, appointment booking or real private records.
- Preserve exact v1.82 guided four-session plans, all 28 complete curriculum units, 14 header+14 footer free resources, original 9 offerings, all rates and pricing limits from v1.81, canonical original 19 Roger + 10 durable and new EL-RGR-020–022, original logo, Neon/Render backend, secure integrations and outgoing communications restrictions.

## Fresh public research decisions (2026-10-22)
- Council of Europe CEFR Companion Volume mediation and online interaction https://www.coe.int/en/web/common-european-framework-reference-languages/mediation : ADAPT clear, faithful source summary and mediated stakeholder communication with fictional situations. Never present as CEFR level certification.
- British Legal Centre https://www.british-legal-centre.com/set/legal-english-course : ADAPT between-lesson written homework and feedback workflows, without copying their courses, quiz content or certified achievement claims.
- W3C forms instructions https://www.w3.org/WAI/tutorials/forms/instructions/ : ADOPT native labels, radio/checkbox fields, instructions and visible progress/status. Do not claim completed accessibility audit without browser evidence.
- DEFER official certificates, stored portfolios, actual teacher scoring, public model inference/AI quotas, Stripe, booking, outbound email or customer uploads until separate owner/provider/security acceptance.

## Release blockers
1. Complete v1.82 full exact-head twice, merge/deploy to Render and independently accept production on both apex and www; preserve v1.81 rollback.
2. Run v1.83 entire source/no-loss/privacy/high-critical dependency and browser test suite twice on SAME final candidate SHA. Verify no protected original logo/rule/backend changes; preserve verified v1.82 rollback for later use.
3. Only after both, merge exact v1.83 candidate, let Render auto-deploy once and independently verify actual v1.83 assets/health/public functionality across both domains. No live claim without those receipts.

---

# EnglishLegalese v1.82.0 — Guided 28-class learning and instructor studio (CANDIDATE)
Date 2026-10-22. **Prerequisite:** v1.81.0 transparent pricing must first pass both same-head qualifications, merge, auto-deploy and live acceptance; NEVER skip release 1.81 or claim 1.82 deployed while 1.81 remains unverified. Branch starts from PR #37 exact candidate head b79f6d13c36f5abf5ff9df28dd72252d51f3c44e, *not* a verified live predecessor yet. Do not merge until real predecessor/currentness and rollback are established.

## Maximum reasonable material work
- Publicly accessible Guided Learning Planner, directly linked in header and footer, with course track filtering and full 28-topic selection, automatically grounded in real v1.80 curriculum data.
- A genuine **four-session learning sequence for EACH of the 28 courses**: original outline, concrete practice workflow, subject-specific vocabulary definitions, fictional scenario, topic homework, source-fidelity four-point feedback rubric and teacher facilitation brief. 112 guided lesson stages and multiple personal pacing options.
- Learner controls: one/two sessions per week; optional local study-start day with regional-local dates; independent session progress per course (112 self-check positions); 120-character private goal and 500-character temporary reflective notes.
- Local full study/teacher packet export as text, and separate four-event RFC5545-inspired ICS calendar download clearly identifying each item as an **UNCONFIRMED PERSONAL STUDY** reminder, never a teacher/class reservation or provider invitation. All inputs and state held only in browser-memory; no fetch, storage, uploads, checkout or contact with calendar providers.
- Responsive clear UI, native labels/controls, visible focus states, explicit status, no claimed CEFR/TOLES endorsement or accredited progress. All prior 28 curricula + 84 original explained questions remain; original 9 learning offers, prices, 14 free header/footer tools, 19 canonical Roger Rules, 10 durable rules, 2026-10-22 EL-RGR-020-022, original approved logo, all backend contracts, privacy gates preserved.

## External research and decision record
- Council of Europe CEFR Companion volume guidance https://www.coe.int/en/web/common-european-framework-reference-languages/home emphasizes meaningful interaction and mediation skills: ADAPT to realistic fictional legal workplace tasks and professionally accurate summarization. Do not claim formally assessed CEFR level from self-checks.
- W3C accessible form instructions https://www.w3.org/WAI/tutorials/forms/instructions/ : ADOPT labels, upfront instructions, native controls and visible error/status feedback. Do not rely on placeholder-only instruction.
- British Legal Centre specialist Legal English curriculum https://www.british-legal-centre.com/set/legal-english-course includes assignment/homework and downloadable materials: ADAPT 4-part study plans and instructor notes, while ensuring every course remains original and no proprietary materials are copied.
- DEFER: live teacher matching, enrollment, billing, certification and durable student tracking until verified third-party providers, privacy/security and financial gates. No sending without distinct per-campaign owner authorization.

## Release prerequisites
1. Confirm 1.81 fully qualified and Render live at exact merged SHA, independent apex/www.
2. Complete new v1.82 source/no-loss/security + multi-browser desktop/tablet/mobile suites twice *at identical final head*; retain 1.81 live deploy for rollback.
3. Guarded merge v1.82 followed by Render autoDeploy and independent apex/www/actual JS/health acceptance; record exact deploy IDs and health. Do not interpret passing GitHub test as live release.

---

# EnglishLegalese v1.81.0 — researched transparent pricing, no charges (CANDIDATE)
Date: 2026-10-22. Exact live predecessor v1.80.0 Render dep-dbcuuefavr4c73d31uc0 commit 1f1f7aeb777a74b13ced20a432030cede3c961e7. Append-only successor: retain original approved logo, original 19 Roger + 10 durable rules, additions EL-RGR-020–022, all nine old offerings, 28 new complete curricula, free 14/14 navigation and footer directory, class/study planner, auth, database, AI safety and prior backend. Never silently overwrite historic improvements below.

Material improvement: true public Pricing link in both primary navigation and footer; clean responsive US-dollar introductory prices visible on homepage; Free $0; existing draft AI Starter $12/month 100 replies max12/day, Plus $19/month 250 max20/day, Pro $29/month 500 max30/day; proposed human-led groups single $24/50 min or 4 for $79 (3–6 learners), private one lesson $59/50 min or four for $219, team four-session up to 8 starting $499. All clearly subject to activation and teacher availability. No checkout, purchase button, payment field, Stripe entitlement, recording, uploads, email or unverified booking. No actual order or subscription created. FAQ addresses currency, taxes, refund and cancellation policies before launch, three free AI samples eligibility and no automatic charges.

Market research (checked 2026-10-22): British Legal Centre specialist group 15x45min US$450, private US$1200 https://www.british-legal-centre.com/set/legal-english-course ; Legal English Academy Standard US$320/year, Premium $960/year, VIP $3,800/year https://www.legalenglish.academy/ ; TOLES original self-study £15 per module https://toleslegal.com/product-category/online-courses/ ; Preply general online English teachers $23-$27/hour https://preply.com/en/online/english-tutors ; Cambly small-group per 30 min starting $5.50 month-to-month https://www.cambly.com/en/subscribe/groups . Rates purposely under specialist coached providers, but materially above general group instruction; bundles reduce learner upfront cost while maintaining instructor compensation room. These public offers are PROPOSED until teacher and Stripe verification; no artificially short discounts or implied availability.

Release discipline: full source/security/no-drift + desktop/tablet/mobile Chromium/WebKit suite TWO independent passes same final head; preserve live v1.80 rollback; separate exact main/Render live/apex/www acceptance; no promotional sends without scoped approval. Verify footer resource parity 14/14, existing 28 class catalog and student free routes remain functional. No premature live claims.

---

# EnglishLegalese v1.80.0 — 28 complete class curricula + owner-approved deployment permanence (ADDITIVE CANDIDATE)
Date: 2026-10-22. This amends the already-drafted v1.80 candidate with the explicit additional owner scope; previous candidate work and the COMPLETE inherited improvement record below are preserved.

## Material teaching delivery added
- 24 Legal English classes covering **8 core professional + 12 practice-area + 4 international/academic** topics; plus a distinct **4-class Professional & Business English** track (28 total).
- Every one of the 28 records is substantive: **4 specific lesson outlines (112)**, **5 defined topic vocabulary terms (140)**, **3 interactive explained questions (84)**, **one topic-specific homework assignment (28)** and **one instructor brief with fictional roleplay, feedback criteria and 50-minute facilitation plan (28)**.
- Searchable responsive class directory embedded inside the existing human-led video classes section. Search and track filters, working student self-check with changed-answer feedback and reset, local download of each class curriculum and teacher brief. Educational previews **NOT currently bookable**; no teacher identities, provider integrations, certification or live credentials invented.
- The v1.80 original private six-course study planner remains intact; all 9 existing offerings, existing lessons 1/2/3, 14 header and 14 footer free resource links, original logo, 19 Roger Rules, 10 durable rules, previous learning labs, existing backend/services and all original integration gates protected.
- Permanent additive owner directives established in `governance/ENGLISHLEGALESE_OWNER_DIRECTIVES_ADDENDUM_2026-10-22.md`: `EL-RGR-020` **automatically deploy every new completed qualified version live**, independently verify apex/www and retain rollback; `EL-RGR-021` enforce all five genuine materials per class; `EL-RGR-022` preserve complete expansion scope. Immutable canonical rule register is unchanged.
- Do not claim production until two independent full same-final-head cross-device qualifications, high/critical security audit green, no-drift/historical features passed; then guarded merge, Render live, exact asset/commit and apex/www production acceptance. On any failure, leave previous known-good v1.79 live. Existing v1.79 LIVE `dep-dbc5u0h5efls73bdkpb0` and v1.78 rollback `dep-dbc2aau8bjmc73d443c0` preserved for emergency recovery.

---

# EnglishLegalese v1.80.0 — Private Study Planner (UNMERGED CANDIDATE)
Date: 2026-10-22. Exact predecessor v1.79.0 main commit ea122fb498ded83c3f6fac39a3ba5f27e692d624. Build is additive; all preceding lists, the 19 original Roger Rules, 10 durable rules and approved branding must remain unchanged.

## User-visible improvement
- Private optional study planner for all six actual courses, each with the three existing sample lessons and self-reported progress. This does NOT issue credits, claim teaching certification, imply durable account progress or alter the quizzes.
- Per-course optional short goal (120 characters) and review notes (500 characters) with live remaining count; independent state per each of six courses during page session.
- Clear one course or all six; downloadable local plain-text study plan and next-step guidance; no calls to servers, localStorage, emails, identity collection, payments, bookings or uploads.
- Collapsed panel next to existing course catalog avoids changing homepage composition, main "Free learning resources" dropdown, all 14 footer links, three-course sample lesson units, international class prep or original approved logo.

## Hard release gates
- Candidate MUST pass exact-head static/security/no-drift gate and full desktop/tablet/mobile Chromium/WebKit qualification twice, with no high/critical vulnerabilities, before merge. The old v1.79.0 successful Render production deploy must be recorded and retained for rollback.
- After separately authorized deployment, actual apex/www health, JavaScript, current version, menu/footer parity, all historic lessons and new private planner must pass independent production acceptance. No live claim from PR existence or successful qualification alone.
- Preserve V3 communications rule: no outbound transactional/send, Resend DNS mutation, trial activation, Stripe, actual teacher bookings/provider access or real document processing without their distinct gates.
- Deferred: authenticated learner completion or teacher-verified credentials, actual class enrollment and stored progress require opt-in consent and durable access-controlled data model, provider authorization and security tests. Do not advertise as live.

---

## v1.79.0 — Owner added main-menu learning-resources dropdown (IMPLEMENTED_CANDIDATE)
Add an accessible **Free learning resources** dropdown to the existing desktop and mobile primary navigation; duplicate exactly all 14 existing footer learning-tool links, preserving the footer content, order, folding, original site logo, and existing primary links. Verify desktop/mobile/keyboard dismissal and parity; no new paid/AI/product activation. User explicitly wants both navigation surfaces maintained, not links moved out of the footer.

# EnglishLegalese v1.79.0 — Maximum-Reasonable Human-Class Readiness and Course Continuation (CANDIDATE)
Date: 2026-10-21. Verified authoritative predecessor v1.78.0 main SHA `94c285b93339e3dd91e551248178f1a7941e0cc9`, Render LIVE `dep-dbc2aau8bjmc73d443c0`. Owner's Universal Builder V3 packet verified intact (19 Roger + 10 durable source rules and original logo unchanged). This section is additive; all earlier improvement entries remain preserved verbatim.

## Material successor improvements
1. IMPLEMENTED_CANDIDATE: Six new original **course lesson 3** exercises, one per genuine structured course, with six realistic fictional cases, **18 new comprehension questions and 18 answer explanations**. Together with lessons 1 and 2, these make **18 sample lesson units / 54 explained questions** without misrepresenting them as fully accredited courses.
2. IMPLEMENTED_CANDIDATE: Functional **Prepare for a human-led online video class** studio, integrated with the existing v1.78.0 Zoom/Google Meet/Teams/regional provider-neutral class planner. Four selectable teacher discussion goals, a private free-text question (600-character visible countdown), clear/reset controls, downloadable personal preparation brief. No recipient, enrollment, payment, API request, browser persistence, message sending or false booking.
3. IMPLEMENTED_CANDIDATE: Global **class-time comparison** with DST-aware city formatting for New York, London, Tbilisi, Bangkok, Hanoi, Tokyo, Seoul and user's device timezone. Updates live when the existing user-selected proposed lesson time changes; not a booking promise.
4. INHERITED LOCK: Comprehensive homepage, approved large original logo, 35 languages incl Georgian, functioning preferred-language learning, nine offerings, original 21 scenarios, eight-question diagnostic, SmartTeacher 2,500-character counter and browser-only file picker, human-led teaching copy, privacy/trust, complete footer learning tools, real class planning + unconfirmed .ics remain intact.
5. SAFETY: The educational frontend does not send email/verification messages or enable any transactional provider. Outbound communications **DRAFT ONLY until fresh explicitly scoped SEND approval**, as required by V3 `OCT20-COMMS-OWNER-APPROVAL`. No new DNS, Stripe, OpenAI trial, teacher/provider connection, actual booking, recording, document processing or real student upload activation.
6. GATES: Candidate until two complete independent exact-final-SHA cross-device browser suites + inherited rule/source checks and zero high/critical npm vulnerabilities; separate actual apex/www release-commit acceptance; retain exact v1.78.0 rollback. Run the V3 locked packet verifier unchanged and verify original canonical Git blob `bd1d33a43180291f3a8ddedcd6884f6ff3d7c666` and approved original logo `b5f20ef046d75d6f108bc93243c7c14acf3c4eb1`.

## External operational gates, not silently completed
Real video-classroom booking, authorized teacher roster, student slot inventory, provider OAuth/verified video room links, persistent reservation and invitation ledger, instructor/student access and verified calendar time, session privacy and recording consent, Stripe subscriptions and payout, Resend sending DNS and 3-reply trial all require their own confirmed owner-approved activation and separate real-provider tests. A personal local preparation/ICS file must never be presented as a confirmed meeting. Human instructor content review and accessibility spot checks remain ongoing.

## Next material improvement candidates
Operational teacher dashboard with verified identities/provider connections after owner approves them; genuine authenticated learner lesson progress and classroom confirmation; a rigorously tested time-zone selection override; higher-quality native-language examples for all offered locales after reviewed translation; deeper six-course curriculum content beyond samples; document/image processing only after separate security and spending gates.

---

# EnglishLegalese v1.78.0 — Next Version Improvement List (PRE-SEAL CANDIDATE)
Date: 2026-10-20. Inherits the complete v1.77.0 54-item owner audit and all previous successor lists below. Current verified live predecessor v1.77.0, main SHA `450096a71b1e61ef421100d88b40ea9e63e6bf5e`, Render `dep-dbbp81qvcj2c73dnrfug`.

## Maximum-reasonable materially useful work in ONE integrated release
1. IMPLEMENTED_CANDIDATE: Homepage hero now explicitly says **live online classes with human teachers**, identifies independent learning, AI-supported learning, and personal human teacher-led interactive online video classrooms; preserves the owner-approved exact checkmark **Human teacher guidance available**. No empirical-superiority promises or false assertion of immediate appointments.
2. IMPLEMENTED_CANDIDATE: A professional **Live Online Video Classes** homepage section with 3 meaningful benefits, a designed simulated video-classroom presentation and five usable provider choices: Zoom, Google Meet, Microsoft Teams, Tencent / VooV and manual approved regional links.
3. IMPLEMENTED_CANDIDATE: **Interactive class planning**: choose course focus, provider, future lesson time in the visitor's device time zone and duration; local preview includes the correct actual local time and provider; changing any choice invalidates stale plan; optional downloadable **UNCONFIRMED** ICS calendar hold without contacting a provider, inventing teacher availability, booking a meeting, sending email or storing private information. This is a genuine useful private planning tool, not a live booking. The existing role-guarded backend Google/Zoom and manual provider adapters remain unmodified.
4. IMPLEMENTED_CANDIDATE: Six additional structured unit 2 course lessons (18 new contextual comprehension questions and 18 explanations), layered onto the six original unit 1 modules and 18 original checks, for **12 lesson units and 36 original explained questions**, with reset/changed-answer invalidation and no transmission.
5. IMPLEMENTED_CANDIDATE: Six homepage goal-based learner cards route directly to real applicable course lessons and existing writing, reading, speaking, AI output or academic labs. The comprehensive homepage remains intact.
6. IMPLEMENTED_CANDIDATE: Teacher page has a clear actionable link to **online human video classrooms** and class preparation; distinguishes teachers from employer access; maintains existing account/role gates.
7. QA_IN_PROGRESS: Verify the original 19 Roger Rules + 10 durable rules, protected original logo, existing 23 footer routes, 35 language selections including Georgian, 2,500-character SmartTeacher and prior courses; full Chromium/WebKit desktop/tablet/mobile browser regressions twice on identical head; then exact merge, Render live, apex and www acceptance. Preserve v1.77.0 rollback.

## Remaining external operational dependencies — DO NOT FALSELY CLAIM COMPLETE
- Teacher match, verified active teaching staff, slot availability and teacher onboarding: confirm actual staff and authorization before accepting real bookings.
- Provider credentials, scopes and account ownership for Zoom/Google Calendar+Meet/Teams or approved regional video tool; Teams and regional links may require manual staff attachment. Existing backend **createCalendarVideoSession** is restricted to teacher/staff/admin/owner roles; public scheduling is not enabled.
- A proper production-qualified persistent reservation ledger, access-controlled attendance, confirmation/notification routing and consent for video recording are needed before claiming booking, join links, room creation or sending reminders.
- No new real OpenAI account trial, Stripe payment, real private document processing, DNS changes, real invite sending or outbound email without their original separate approval gates. Keep the earlier partial/gated 54-item owner audit visible.
- Do not fabricate a meeting URL, teacher identity, availability, confirmation, performance benchmark or actual lesson purchased.
- Next successor: complete provider onboarding, teacher dashboard/session record persistence, time zone conversions outside client device, authorized student enrollment, policy/contact pages after vetted ownership, accessible curriculum progress and expanded genuine native-language exercises. Never rewrite original 29 protected rules or remove the old release histories.

---

# EnglishLegalese.com — v1.77.0 Owner Screenshot Audit Improvement List (CANDIDATE; NOT QUALIFIED/LIVE YET)
Date: 2026-10-20. Owner authorized next maximum-reasonable material build. Baseline v1.76.0 main `e2fa8ca02801cefb95c3b3c945da5a3675c627f2`, Render `dep-dbbnnml9fdbs73edtbfg`.
**Canonical complete audit:** `governance/ENGLISHLEGALESE_V1770_OWNER_SCREENSHOT_AUDIT__MASTER_CHECKLIST__2026-10-20.md` (54 separately traceable owner requirements; preserve original). This abbreviated progress overview does not replace that file.

## Implemented in this candidate (requires release tests and independent live verification)
1. ADDITIVE: Retain comprehensive homepage (not cut short). Rebalance oversized hero headline and first-screen typography, while preserving original brand and human-teacher copy. Intro copy remains explicit about self-guided practice, AI tool limitations, teacher judgment and separate activation.
2. MATERIAL: Give all nine course offering cards real next actions, creating six original educational micro-lessons with objectives, fictional examples, three response checks each (18 self-review questions and 18 explanations). Keep diagnostic, SmartTeacher and Employer offerings in their appropriate real service paths.
3. MATERIAL: Add a consistent 2,500-character counter in the main SmartTeacher prompt workspace. Offer clearly local-only document/image selection with type and size checks; no real upload, photo analysis, extraction, network transfer or AI trial unlocking. Free verified-user AI and paid checkout remain gated.
4. MATERIAL: Alphabetize 35 preferred-language options and add Georgian (ქართული), keeping previous 34. Turn five inert language-action spans into four working exercise modes plus genuine Teachers page navigation; curated short native-language examples in selected languages and safe no-unreviewed-translation fallback; a private English comprehension quiz.
5. MATERIAL: Create dedicated richer teacher and employer views from the existing shared cards with accurate learner/teaching and organization distinctions; no unverified human bookings or teacher directory assertions.
6. MATERIAL: Reorganize unwieldy sitewide footer using the original logo asset smaller, balanced topical links and expandable directory of all 14 free-learning resources; all 23 original footer destinations still represented in source and tested.
7. MATERIAL: Improve Trust with accurate information on private browser-only learning and gated AI/file processing, links to existing guidance without fake Privacy/Terms/contact URLs.
8. QA: Regression tests in `tests/v1770-browser.spec.js`, `tests/v1770-production.spec.js`, static `scripts/verify-v1770-owner-audit.js`, source-protection audit, inherited full QA, actual Render/apex/www acceptance and rollback receipts required.

## Still partial/deferred or awaiting owner/external readiness
- Full syllabi across six or more courses, real lesson completion and durable accounts require qualified curriculum/teacher review; initial sample lessons are real but not an invented completed course catalog.
- Secure document/image upload and full AI review blocked on approved permissions, privacy/security/storage/cost and processing system; browser-only selection must remain honestly labelled, not active upload claim.
- Live ChatGPT/OpenAI three free trial replies, account email verification and status, transactional Resend DNS, payment/Stripe plans and subscriptions blocked until independent approval gates; no send/purchase/activation.
- Teacher booking/application and contact workflow: no verified public booking/contact channel inferred; explanatory account path only until owner authorizes real intake.
- Native-language selection currently has 35 options, but only curated common-language examples for a subset; unmatched languages explicitly show honest unavailability.
- Accessibility/performance human testing and legal/privacy policy publication remain open work, not implied certified by automated QA.
- Long homepage intentionally retained per owner directive. No change for change's sake, and complete prior NVIL preserved below.

---

# EnglishLegalese.com — Next Version Improvement List after v1.76.0 (candidate; subject to final qualification)
## Cohesive maximum-reasonable successor work
1. DONE_THIS_RELEASE: Reframe homepage around combined structured Legal English practice, AI tools, real human teachers and the complementary role of each; explicit honesty about separate live AI/paid readiness. Owner-approved exact text: “Human teacher guidance available.”
2. DONE_THIS_RELEASE: Private self-guided Conversation Rehearsal Lab — three nuanced, fully fictional interactions, optional spoken rehearsal with no microphone access, optional browser-only 700-character practice notes, model responses, explanations, a three-step self-review and reset. Links to listening, message building and teacher paths.
3. DONE_THIS_RELEASE: Private Reading Precision Lab — three invented professional texts, nine comprehension prompts, correct-answer reasoning and reset across conditional commitments, permission/obligation language and reported versus verified facts.
4. DONE_THIS_RELEASE: Focused footer discoverability and cross-exercise links, accessible native controls and mobile-specific styles; preserve original nine courses, 21 scenarios, 8-point diagnostic, all earlier labs, original approved logo, 19+10 original rule corpus and predecessor historical improvement list.
5. BLOCKED: Enable actual three-reply free SmartTeacher AI only after owner approves public launch, Resend sending-only DNS verification and delivery, full-cost cap, abuse/identity/ledger/restart QA and privacy checks. Dedicated Neon DB being connected does NOT authorize trial go-live.
6. DEFER_WITH_REASON: Actual spoken-word evaluation/microphone upload or authentic documents would require explicit privacy/consent and secure processing; no misleading recorded-speech or legal-interpretation claims.
7. BLOCKED: Stripe paid plans, verified teacher booking/assessments, production document/image processing and unsolicited external messaging remain OFF until their separate gates.
8. NEXT BEST: Human-led accessibility and teacher-content review, structured learner progress only after approved consent and durable storage, measured accessibility/performance/retention, independently verified financial and provider readiness.
9. RELEASE_GATE: Candidate only until TWO independent whole-suite passes at identical head and independent live apex/www proof; retain v1.75 Rollback. Append genuine release/test and live receipts only as verified.

---

# EnglishLegalese.com — Next Version Improvement List after v1.75.0 (candidate, subject to full qualification)
## Material release priorities and dispositions
1. DONE_THIS_RELEASE: Free **Listening & Clarification Lab** with three fully invented legal/professional English exchanges, 12 dialogue turns, nine independent comprehension questions with answer-specific rationale, confidence-preserving self-check, transcript toggle, replay/slow-play/stop using optional native browser voice and graceful no-speech fallback.
2. DONE_THIS_RELEASE: No learner uploads, recording, microphones, backend calls, AI usage, transcripts saved or externally transmitted by the site. Native device voice behavior depends on each browser's voice availability/settings. Source and Chromium/WebKit tests cover privacy, keyboard/touch, reset, transcripts, optional speech control, no-provider fallbacks and content semantics. Truthful non-certified practice status.
3. DONE_THIS_RELEASE: Fix exact-version production workflows to avoid old v1.73 and v1.74 check jobs incorrectly running on successor commit descriptions; preserve those historical workflows but require their own release prefix. Add v1.75 apex/www real browser acceptance, HTML+health+actual JS freshness gate, and old-release fallback.
4. DONE_THIS_RELEASE: 19 owner rules, 10 durable builder rules, approved immutable logo, nine courses, 21 scenarios, original diagnostic, all preexisting private learning tools and previous Next Version Improvement Lists preserved. v1.74 is immediate rollback.
5. BLOCKED: Real 3-reply free AI account trial pending sending-only Resend domain DNS verification, verified transactional email, durable provider budget and full abuse/ledger tests and explicit owner launch authorization. Current dedicated Neon database and Render connection remain intact; no database mutation in v1.75.
6. DEFER_WITH_REASON: Stripe paid AI, tutor bookings, live document uploads, teacher verification and assessed credentials require approved economics, privacy/security validation and provider acceptance, not cosmetic UI placeholders.
7. IN_PROGRESS: Live human-assistive-tech, genuine mobile listening quality across devices, professional instructional review and measured adoption/retention. Browser TTS is optional access only; native voice support varies.
8. NEXT BEST: Owner-approved verified Resend DNS through Hover without replacing any existing records; off-provider Neon export/restore exercise; controlled AI spending cap, signed payment lifecycle and regulated file processing only when independently ready.

---

# EnglishLegalese — Next Version Improvement List after v1.74.0 (candidate until qualified)
## Cohesive material release and inherited dispositions
1. DONE_THIS_RELEASE: Free private browser-only professional message builder with 3 genres, fictional templates, structured meaning/timing, character count, validation, private preview, reset, self-checks and optional copy. No AI, stored drafts or implied accreditation.
2. DONE_THIS_RELEASE: Resend HTTPS sender adapter, mocked safe failures and distinct readiness check. BLOCKED: Real verification sender until Resend DNS and API credentials verified.
3. DONE_THIS_RELEASE: 10 additive Neon migrations in dedicated EnglishLegalese production database (50 tables), DATABASE_URL installed in Render; safe baseline v1.73.0 redeployed live.
4. BLOCKED: Public three-reply trial pending verified email DNS/delivery, OpenAI cost controls, session key, restore/export tests, abuse testing and explicit user go-live approval.
5. DEFER_WITH_REASON: Stripe paid prices/webhooks, real uploads, verified teachers and graded assessment need dedicated approved privacy, commerce and security checks.
6. IN_PROGRESS: Independent human mobile and assistive technology review. Browser checks are not a substitute for certification.
7. DONE_THIS_RELEASE: Exact logo, original 19 Roger + 10 durable rule corpus, 9 courses, 21 scenarios, original diagnostic and all prior learning labs preserved.
8. NEXT: Verify sending-only Resend DNS without altering existing MX, SPF or inbox; off-provider Neon export/restore rehearsal, bounded OpenAI spend and full consent gates.

---

# v1.74.0 — Free-Service Automation Preparation (candidate; NOT merged or deployed)

- **Material change:** Implement opt-in Resend HTTPS transactional verification email adapter for Render Free while preserving SMTP fallback for suitable hosts.
- **Safeguard:** Resend credentials are environment-only and never exposed in public bundles; send only on account-verification actions, and fail closed when unconfigured or provider rejects requests.
- **Test:** Add mock-only sender acceptance/refusal, safe error redaction, no real mail or AI calls, and full trial-readiness prerequisite regression tests under `npm run check`.
- **New accounts required:** Owner opens/connects Neon Free, which supports the existing PostgreSQL connection contract; verify dedicated database, migration integrity and off-provider backups before public trial.
- **Domain:** Verify one EnglishLegalese-only sender in Resend without changing the current mailbox or other businesses. Use `RESEND_API_KEY` + `RESEND_FROM_EMAIL` on Render only after approved DNS verification.
- **Launch gates:** Two independent successful full exact-head CI/browser qualifications, live Render GitHub SHA match, independent apex/www acceptance screenshots, durable 3-use quota through restart, verification deliverability, strict spend boundaries, and owner's go-live approval. Unavailable credentials must keep trial disabled.
- **Not yet built/authorized:** Stripe paid entitlements and checkout; upload processing; cold-email campaigns. No premature launch claim, purchases, or unrelated product changes.
- **Next work after account connection:** Restore-test/backup exports, domain verification, migration in Neon, secrets setup, one end-to-end test account, quota and AI-cost audit, and separate public enablement.
- **Preservation:** The approved logo, 19+10 canonical rules, earlier nine courses, 21 scenarios and all educational labs remain protected. See `docs/FREE_SERVICES_AUTOMATED_ACTIVATION_V1740.md`.

---

# EnglishLegalese — Next Version Improvement List after v1.73.0

## Security, actual learning access and monetization readiness
- Three **real AI tutoring replies** for each free, verified learner account, with a persistent lifetime usage ledger and email ownership check. No resets on login, browser refresh, server restart or redeployment. Existing Render site is local JSON only, so free signup/trial remains disabled until a dedicated PostgreSQL instance, session secret and SMTP are connected, migrated, verified, and SMARTTEACHER_TRIAL_ENABLED is explicitly set to true.
- Fix insecure unauthenticated role self-registration; only student accounts, with stronger session secret and static access controls, registration/login rate limiting.
- 2,500-character standard trial questions with visible countdown, 5,000 extended writing exercises reserved for verified paid access. Free trial maximum 500 output tokens for a useful explanation and a fictional example, with additional per-IP/day/site caps. Site trial capacity is 18/day, 120/month and 1 concurrent while validating unit economics.
- The original live OpenAI integration remains, with approved economical models, store:false and timeout; paid SmartTeacher is denied until a verified Stripe purchase and durable quota/entitlement system exist. Existing public checkout request is fail-closed pending tomorrow's Stripe setup.
- Local file selection for PDF/Office/images with honest extension/10MB-size notice; no file bytes uploaded, no paid review until secure processing and verified payment. No unsupported claim of 'all file types'.
- Draft AI prices require owner approval: Starter $12/100 messages, Plus $19/250, Pro $29/500 monthly; human tutoring/class packages to be priced separately after teacher economics and owner approval.
- Complete original homepage, approved logo, all 9 courses/21 scenarios, 8-question diagnostic, all prior learning labs, 19 Roger and 10 durable rules, original Next Version Improvement List and v1.72.0 rollback preserved. Two independent full source+Chromium desktop/tablet/mobile+WebKit iPad browser gates followed by independent real apex/www production acceptance required.
- Explicit constraint: In-memory network limits are an additional layer, not a guaranteed dollar cap; separate OpenAI provider-side budget and daily monitoring still needed. No live public free trial until durable database, SMTP and verified secret are in place.

## Next Version Improvement List
1. **Owner infrastructure setup**: create a dedicated EnglishLegalese PostgreSQL (never reuse unrelated projects' database), configure SMTP, strong session key and run additive migration 009/010, verify status/three-use persistence across restart then explicitly activate the live demo.
2. **Stripe setup tomorrow**: create owner-approved AI and human-led lesson prices, validated signed webhook fulfillment, durable entitlements/usage quotas, refund/expiry and cancellation reconciliation; test before enabling paid AI.
3. Review legacy elevated roles created before registration safety enforcement with qualified owner approval and no destructive updates.
4. Optional file processing after antivirus, format-specific safe parsing, page/file ceilings, quarantine, consent, upload security, deletion policies and paid authorization.
5. Human mobile/screen-reader/language audit and measured UX performance improvements; all original protected brand and course content remain.

## Entire inherited predecessor list (verbatim)
## Entire inherited prior improvement list (verbatim)
# EnglishLegalese — Next Version Improvement List after v1.72.0 (owner universal maximum-material command applied)
## Cohesive material outcomes
- Five substantive fictional before-and-after professional Legal English scenarios: obligation, approval, deadline, allegation, and confidentiality.
- Editable two-text comparison with real bounded word-level differences, semantics-safe DOM nodes instead of injecting learner HTML, learning cautions, a four-point native-checkbox review workflow, correct stale-feedback reset, complete input clear/reset, and user-initiated clipboard notes.
- Focused URL and contextual integration from prior email and vocabulary practice, original homepage and all useful curriculum unchanged.
- No false legal-equivalence, legal advice, credential/teacher grade, live model integration, client document handling or storage claims.
- All 19 Roger and 10 durable rules, approved logo, nine courses/21 scenarios/8 diagnostic explanations, existing labs, owner account guards, navigation and full predecessor improvements retained.
- Two complete exact-head independent full gate passes and real apex/www production acceptance required with immediate predecessor rollback.

## Explicit inherited priorities and dispositions
1. IN_PROGRESS: accessible native input, keyboard status, focus and responsive mobile tests. DEFER_WITH_REASON: human screen reader and real device/language review requires independent human observation.
2. IN_PROGRESS: richer authentic professional-English revision exercise now integrated. DEFER_WITH_REASON: teacher-certified outcomes, copyrighted case source use and live feedback require qualified teacher/source authority.
3. DEFER_WITH_REASON: renderer cleanup only after measured slowdown and visual parity; don't repeat previous v1.56–v1.59 race defect.
4. BLOCKED: actual AI, user accounts, payment and durable learning records until verified secrets/privacy/access control and explicit owner approval.
5. DONE_THIS_RELEASE: verified source, original immutable logo and complete owner rules, full inherited improvement list, currentness, rollback and new preservation/behavior tests.

## Next priority actions
- Human-led keyboard and screen reader pass; fix observed accessibility problems.
- Educator-led content validation, richer connected lesson outcomes and lawful authentic legal English source excerpts.
- Profile real performance/SEO and fix measured user problems with reversible compatibility tests.
- Verify provider AI/account/billing credentials and consent before promising or activating them.
## Entire predecessor Next Version Improvement List, unchanged
# EnglishLegalese.com — Next Version Improvement List after v1.71.0 (candidate)

## Material improvement in v1.71.0
- Add a searchable **Legal English Vocabulary Guide** as a more useful learning reference than another quiz: 18 curated words/expressions grouped into Case reading (5), Contract reading (5), Professional writing (5) and AI and review (3).
- Each entry includes a clear non-authoritative educational explanation, explicitly invented professional example and caution against treating uncertain factual or legal statements as confirmed, approved or binding.
- Responsive focused page with native labelled search box, topic filter, accessible live results count, no-results state and clear-all-filters with restored keyboard focus. Filtering runs only on the browser on fixed original entries; no user search data sent or stored.
- One footer discoverability link and one contextual link from the prior Case Brief Reading Lab; no visible additional homepage section, logo/header design edits, new AI calls, audio features, accounts, uploads or certification claims.
- Preserve existing 9 courses, 21 scenarios, eight-question diagnostic with feedback, writing workout, AI Draft Review, Clause Reading, Meeting Follow-up, Email Clarity, Guided Practice and Case Brief Reading labs, privacy/role safeguards, backend and original 19 Roger/10 durable rules.
- Require two independent complete successful exact-final-PR-head Chromium desktop/tablet/mobile + WebKit iPad browser, source/no-drift, zero-high dependency gates. Recheck exact current main and predecessor Render live, merge, verify exact new GitHub merge SHA/Render LIVE and independent public apex/www desktop/tablet/mobile acceptance plus retained artifacts. Immediate predecessor v1.70.0 rollback.

## Next Version Improvement List (priorities)
1. Actual human screen-reader, mobile, keyboard and language switching review of current lessons and reference tools, fixing evidenced issues only; no unverified WCAG certification.
2. Educator-reviewed authentic pedagogy, lawful public source excerpts, and optional teacher feedback once operational approval and privacy safeguards exist.
3. Improve measured performance only where actual evidence supports change; keep approved header/logo and visual parity before any client refactoring.
4. Real AI responses, accounts, graded outcomes, saved progress, deletion/export and commerce remain gated on credentials, privacy, security and express authority.
5. Continue exact previous rollback, original immutable logo, complete inherited rules and improvements, two independent premerge passes and public production browser acceptance.

## Entire inherited prior improvement list (unchanged)
# EnglishLegalese.com — Next Version Improvement List after v1.70.0 (candidate)

## Material improvements in v1.70.0
- Introduce an advanced **Case Brief Reading Lab** with three explicitly **fictional** practice summaries; gives law-school/professional learners practical exercises in (1) allegations versus findings, (2) limited actual outcomes versus invented remedies, and (3) reasoning, results and what a decision left open.
- Native, accessible comparison questions with three distinct correct positions, explanatory feedback and model brief sentence, checklists and optional capped 700-character learner-only response; stale feedback hides when answer changes. Entirely reversible reset and zero upload, storage, AI, grade, teacher certification or real legal conclusions.
- One discoverability link from previous Clause Reading Lab and a single footer route; no additional content in the approved short homepage or change to locked logo.
- Preserve 9 original courses, 21 scenarios, 8-question diagnostic and explanations, three writing exercises, AI Draft Review, Clause Reading, Meeting Follow-up, Professional Email Clarity and Guided Practice Path, original privacy/access/backend, plus the canonical 19 Roger +10 durable rules.
- Twice independently pass complete exact-PR-head source/security and Chromium desktop/tablet/mobile + WebKit iPad browser qualification; recheck predecessor GitHub and Render, then merge. Deployment requires exact merged Render SHA and independent actual public apex/www browser acceptance. Keep v1.69.0 immediate rollback.

## Next material priorities
1. Human-assisted screen reader, mobile, language and keyboard user testing; fix demonstrated usability barriers without claiming independent conformance.
2. Well-vetted authentic or public-domain education materials and teacher-reviewed case briefing feedback, with legal/copyright diligence before introducing real court content.
3. Carefully simplify accumulated client UI code only when measured performance and owner-approved no-drift visual goldens justify it.
4. Live AI, authenticated learner records, grading, teacher/evaluator workflows, commercial functions, deletion/export require verified privacy/credential/operational gates.
5. Continue immutable logo/rules, exact previous rollback, whole inherited improvement lists, 2 full source/browser gates and real-site acceptance.

## Entire inherited prior improvement list (unchanged)
# EnglishLegalese.com — Next Version Improvement List after v1.69.0 (candidate)

## Material change
- Free goal-based **Guided Practice Path**, rather than another redundant multiple-choice exercise.
- Four learner-selectable goals (writing, contract reading, meetings and responsible AI output review), each giving exactly three genuine existing site exercise links and short actionable explanations.
- Accessible native radio selection, three optional learner-only checkboxes and live status; switching goals clears old checkmarks; reset clears everything; refresh loses progress. Not an accredited score, teacher validation, LMS credit, recording or verified course completion.
- Discoverable from the existing Email Clarity Lab and footer only; no additional homepage content or changes to the immutable approved logo.
- Preserve all nine courses, 21 scenarios, original 8-question diagnostic and explanations, private three-step writing workout, AI Draft Review, Clause Reading, Meeting Follow-up and Professional Email Clarity labs, role/privacy protections, backend and 19+10 owner rules.
- 2 complete independent exact-source Chromium desktop/tablet/mobile + WebKit iPad browser/security/source no-drift gates; GitHub main and Render SHA/currentness check, merge qualified PR only, live matched SHA and distinct apex/www production acceptance, retain immediate v1.68.0 rollback.

## Next priority
1. Human keyboard/screen-reader and real mobile/language usability check; fix observed accessibility barriers, no premature WCAG compliance statement.
2. Qualified teacher-backed learning outcomes and useful curriculum sequencing based on real learning evidence, without artificial scores.
3. Refactor legacy CSS/JS only after verified functional and owner-approved visual equivalence, not to make gratuitous changes.
4. Actual OpenAI API, accounts, retained progress, deletion/export, payment and employer data features require independent operational, security and privacy approval.
5. Preserve exact logo, 19 Roger/10 durable rules, whole inherited improvement list, two release gates, production tests and previous deploy rollback.

## Entire inherited prior improvement list (unchanged)
# EnglishLegalese.com — Next Version Improvement List after v1.68.0 (candidate)

## Material improvement in v1.68.0
- Add a free **Professional Email Clarity Lab** using three entirely fictional workplace emails: (1) replace vague/urgent requests with a specific document and question while not inventing a deadline, (2) distinguish draft completion from approval, and (3) describe an unconfirmed delay without unsupported fault claims.
- Three-choice comprehension and editing decisions with varied correct answer positions, explanatory model and practical checklist, optional bounded 700-character learner-rewrite textarea. No scoring, fake AI editing, instructor review, real email sending or real-world legal conclusions.
- Native keyboard-operable labels/fieldsets and status notices, focus on missing answer, stale answer review invalidation on change, per-case/whole-lab reset that erases drafts; page-session only and no browser storage, backend calls or OpenAI secret.
- Focused footer destination and link from existing Meeting Follow-up Lab. No added content to protected homepage view or modified approved logo.
- Preserve predecessor nine courses, 21 scenarios, eight diagnostic answers and explanations, three writing tasks, three AI draft cases, three clause reading cases, three meeting exercises and original authentication/privacy/role protections.
- Twice-pass exact-final-commit full source/no-drift/security browser qualification incl Chromium desktop/tablet/mobile and WebKit iPad; currentness of GitHub main and Render predecessor; deploy matching merge SHA and independent real apex/www multi-device production acceptance; retain v1.67.0 immediate prior rollback.

## Next priority improvements
1. Actual human-assisted keyboard, screen-reader, language-switch and mobile usability reviews, with fixes based on observed problems; do not assert conformance without a valid independent audit.
2. Measurable authentic Legal English writing outcomes, reviewed educator feedback when qualified, and safe/consented audio instruction when feasible; never misrepresent text-only tasks as listening tests.
3. Carefully reduce accumulated CSS/client render complexity only after visual parity and preserved accessibility/behavior prove no loss; no appearance changes for their own sake.
4. Live AI, accounts/saved learner work, permissions, teacher evaluation, paid services and employer reporting remain gated on credential, safety, privacy, data retention/export/deletion, security and explicit authorization.
5. Preserve exact protected logo, all 19 Roger rules +10 durable builder rules, documented inherited improvement history, two independent release gates, real production test and prior rollback.

## Entire inherited prior improvement list (unchanged)
# EnglishLegalese.com — Next Version Improvement List after v1.67.0 (candidate)

## Material improvements in v1.67.0
- Free, focused **Meeting Follow-up Lab** with three fictional text-only meeting transcripts. Learners distinguish a vague timing request from a set deadline, preserve an approval dependency before external sending, and identify the owner of drafting, reviewing and circulation.
- Each meeting includes a native accessible question with three meaningful choices, optional 700-character follow-up sentence, model example, contextual explanation and practical writing checklist. No artificial scoring, audio/speech capability claims, simulated teacher signoff or legal advice.
- Changes to an answer hide outdated guidance until reviewed again; per-case and clear-all controls erase answers and drafts. No account, live OpenAI API, upload or session storage; refreshing clears the exercise.
- A focused route and one footer and previous lab link keep the approved homepage brief and accessible.
- Retain v1.66.0 Clause Reading Lab (3), v1.65.0 AI Draft Review Lab (3), three writing exercises, eight-question diagnostic and explanations, nine courses, 21 scenarios, privacy/role protections, exact original approved logo and canonical 19+10 governance rules.
- Release requires two successful independent full exact-head source/security/Chromium/WebKit browser qualifications; GitHub main/Render currentness check; merge and exact matching Render live plus independent public apex/www multi-device browser test evidence.

## Next Version Improvement List (remaining priorities)
1. Real human keyboard, screen-reader, language switching, and small-device usability review, fix evidenced barriers only, no unvalidated WCAG conformance claim.
2. Support authentic professional writing depth and transferable listening comprehension when usable, legal/privacy-safe audio can be reviewed and consented; do not pretend written transcript checks are listening assessment.
3. Refactor inherited presentation stack only after behavior and owner-approved visual goldens prove no loss; no cosmetic changes for their own sake.
4. Real AI inference/teacher evaluation, verified academic testing, authenticated progress retention/export/deletion, and commercial/organization operations remain separated by credentials, privacy, signoff and operational proof.
5. Preserve latest previous Render rollback, immutable protected logo, all original rules, inherited list, full two-gate + real site acceptance.

## Entire inherited prior improvement list (unchanged)
# EnglishLegalese.com — Next Version Improvement List after v1.66.0 (candidate)

## Material improvement for v1.66.0
- Introduce a free, focused, offline **Clause Reading Lab** with three authentic-style *fictional* short contract excerpts: triggering events and business-day wording, the contrast between “may” and “must,” and written-approval exceptions.
- Learners choose an interpretation, compare their reading with substantive plain-English guidance, and review self-check questions rather than receiving an unvalidated proficiency grade or legal opinion.
- Full keyboard-native radio/fieldset controls, status guidance, focus on missing response, reconsideration on changed choice and reversible reset with no account, network requests, payment, submissions, saved choices, or external AI.
- Discoverable by one footer link and the existing three-step writing workout, while keeping the established homepage short and protected logo exactly byte-preserved.
- Preserve all 9 courses, 21 scenarios, 8 original diagnostic questions and feedback, 3 private writing exercises, 3 AI Draft Review Lab cases, teacher/employer authorization, legacy routes, and accepted v1.65.0 backend.
- Require two independently completed exact-head Chromium desktop/tablet/mobile and iPad WebKit qualification passes, dependency audit and all inherited/no-drift assertions, followed by independent real apex/www browser acceptance against the exact Render SHA and prior v1.65.0 rollback.

## Next most valuable improvements, not yet built
1. Independent human keyboard/screen-reader/mobile language walkthrough and fix observed barriers without premature WCAG compliance claims.
2. Deepen specialised reading/writing for business contracts and legal workplaces with qualified teacher feedback and evidence-based learning outcomes, preserving educational/legal boundary.
3. Consider careful historical renderer consolidation only after screenshot equivalence and owner-approved goldens; no redesign merely to change appearance.
4. Real connected AI, authenticated progress, retention/deletion/export, professional testing, or paid services require separately verified credentials, privacy/safety and owner approval; no fake readiness.
5. Preserve exact protected logo, 19 Roger + 10 durable rules, two release gates, actual production test, no credential disclosure and working immediate prior rollback.

## Entire inherited predecessor list, unchanged
# EnglishLegalese.com — Next Version Improvement List after v1.65.0 (candidate)

## Material improvements for v1.65.0
- Introduce a free standalone **AI Draft Review Lab** using three completely fictional, educational AI-output risk cases: (1) invented deadline, (2) unsupported legal conclusion, (3) confidential information proposed for an unapproved AI tool.
- Each case lets learners select the most important review action, see substantive plain-English feedback, optionally practise a safer rewrite, and clear that individual practice response. A visible reviewed/total count tracks *this page session only*, not an accredited score.
- Clear-all resets three choices and temporary drafts; no server call, account, payment, live model/API use, durable storage or claiming human teacher verification.
- New focused lab is discoverable from SmartTeacher and footer without adding bulk to the approved homepage; the previous 8-question diagnostic sends AI-output-review needs to a directly useful activity.
- Explicitly distinguish **fictional offline AI-output review practice** from live OpenAI integration, which cannot be claimed configured simply because the source supports OpenAI.
- Add desktop/tablet/mobile Chromium and iPad Safari browser regression plus independent actual public apex/www production smoke. Preserve original 9 courses, 21 scenario IDs, 8-question diagnostic with itemized feedback, 3 private writing exercises, student/teacher/employer access boundaries, logo, and no loss governance.

## Next high-value improvements (not claimed as delivered)
1. Qualified live SmartTeacher AI integration requires server-side OpenAI key presence, working account/billing/model call, privacy safeguards, rate/cost controls, credential security and owner approval. Public prompt builder remains honest and usable offline.
2. Real-human keyboard, screen-reader and multilingual walkthrough; remediate observed issues with source-level tests and role authorization preserved.
3. Deepen authentic professional/academic reading and speaking activities with fictional content; if claiming competency scores, obtain independent validation.
4. Consider gradual clean-up of old presentation layers only with full WebKit/Chromium parity and owner-approved screenshots.
5. Account/user progress: production auth, consent, export/deletion, retention and qualified databases/backups remain gated by evidence, not frontend demo.
6. Preserve twice-qualified exact-head release, independent apex/www browser acceptance and immediately previous Render rollback.

## Inherited full prior improvement list (unaltered and complete)
# EnglishLegalese.com — Next Version Improvement List after v1.64.0 (candidate)

## Improvements built in v1.64.0
- Preserve the original eight diagnostic questions, choices and practice answers unchanged. Provide a meaningful plain-English explanation for every question after completion, with the answer selected, the stronger practice answer and the reason. An accessible native details panel allows progressive disclosure.
- Provide one next learning activity based on the first relevant missed area: professional tone, unclear instructions/meetings, clause-reading/plain-English, AI-output review, confidentiality, or an advanced fictional exercise when eight answers match.
- Connect recommended writing practice directly to the matching step of the existing private three-step workout, without storing answers or introducing new AI model usage, scoring claims, or accredited test claims.
- Improve incomplete-form guidance with focus on first unanswered question, and fully clear result, review and answers on reset.
- Preserve all previous 21 scenarios, 9 course catalog entries, 8-question non-accredited diagnostic, no-account writing, SmartTeacher prompt preparation, private roles, approved logo, all legacy operational receipts, rules and rollback.
- Require two fully green exact-candidate browser/security gates (desktop, mobile, tablet, WebKit/iPad), then independent apex/www production acceptance with at least one real completed eight-question review.

## High-priority next improvements, not silently activated
1. Conduct independent human usability checks with keyboard, screen reader and multilingual diagnostics and improve observed barriers without new fake accessibility claims.
2. Consider skill-specific guided exercises and non-intrusive learning prompts, maintaining the difference between illustrative feedback and validated evaluation.
3. Consolidate historical presentation layers only with byte-preserving owner-approved design and complete functional parity.
4. Production-qualified auth/account data export, deletion, retention and real AI instructor integrations require explicit credentials, lawful privacy setup and owner sign-off. Never imply configured because source code supports it.
5. Commercial/academic qualifications, pricing and recognized certification cannot be inferred from 8 educational items.
6. Preserve source and asset locks, two independent gates, live apex/www verification and the immediately previous Render rollback.

## Entire previous improvement list, preserved without loss
# EnglishLegalese.com — Next Version Improvement List after v1.63.0 (candidate, pending gates)

## This material release
- Deliver an actually interactive 3-exercise Legal English clarity workshop with fictional client update, meeting clarification and fictional clause explanation; accessible text entry, example disclosure, plain-English self-review checklist, Previous/Next, clear-and-restart. No fake speech scoring, AI-grade, accreditation, persistence or backend submissions.
- Add one subtle entry point from the preapproved hero's educational example and a footer navigation link; do not lengthen the home view or change approved logo, header frame or primary nav. Dedicated `#quick-practice` view retains full home/back route compatibility.
- Clearly distinguish model examples from correctness certification or qualified legal review; maintain user control of drafts, which are not saved across refreshes.
- Extend 4-browser local plus independent apex/www real-production smoke and preserve all known privacy/role access guards.

## Next most impactful after v1.63.0
1. Consolidate the still-retained historical public renderer layers only with independent Chromium/WebKit behavior and screenshot parity evidence; current observer self-loop fix must not regress.
2. Establish owner-approved visual goldens when owner confirms desired design (automated tests do not imply aesthetic approval).
3. Evaluate real accessible device keyboard/VoiceOver feedback and improve accessible language change/error state.
4. Professional/academic legal-English exercise depth, spaced review and actual AI integration must remain separate qualification/consent decisions; no unsupported AI grading.
5. Cross-device progress, learner export/deletion and teacher/account workflows still require qualified auth, retention and privacy controls.
6. Maintain 2 exact-head full gates, post-deploy apex/www acceptance and known-good rollback. No source/data/vendor changes without evidence.

## Full predecessor improvement list preserved without omission
# EnglishLegalese.com — Next Version Improvement List after v1.62.0 (source candidate)

## Material improvements targeted in v1.62.0
- Replace internal-sounding role choice copy with simple student, teacher and employer learning pathways.
- Fix a defective course expand handler that treated one Element as a list; ensure 9 original courses remain accessible.
- Turn inert SmartTeacher prompt buttons into an actual in-browser conversation or writing-review **prompt preparation** workflow with explicit AI/non-AI truthfulness, protected input limits, copy action and clear privacy reminder. Do not imply a connected AI inference service or save private practice text.
- Improve responsive menu disclosure, Escape handling, click-away and link-close behavior, accessible aria labels, and current-section highlight.
- Correct release-specific SEO head/title/social descriptions; validate canonical and existing OG image locally.
- Preserve large locked approved logo, 21 scenarios, 8-question non-accredited diagnostic, role-sensitive protection, learner progress, privacy boundaries, and no server/database changes.

## Next high-value work
1. Eliminate old public presentation layers only when screenshot + behavior equivalence is verified across Chromium and WebKit; owner goldens not yet approved.
2. Qualified live authenticated AI/classroom integration only after correct production credentials/privacy gates. Do not claim this exists because prompt preparation is usable.
3. Improve privacy disclosures and complete user export/deletion/retention controls as storage becomes production-ready.
4. Finish form/head validation and real-device accessibility evaluation.
5. Re-evaluate academic/professional Legal English competitive positioning and pricing with verified evidence.
6. Maintain twice-qualified exact-head release, apex/www real-browser checks, and previous deployment rollback.

## Full previous list (preserved, no loss)
# EnglishLegalese.com — Next Version Improvement List after v1.61.1 (candidate)
The live v1.61.0 desktop/mobile logo improvement is retained. v1.61.1 exists specifically because independent production Safari/WebKit iPad acceptance found a real scenario-expand failure. This is a functional fix, not a gratuitous version bump.

## Work in this material release
- Central click delegation protects scenario, diagnostic, learning-plan and progress actions from replacement/races in the source recovery MutationObserver. Synchronous course-card disclosure and instant hash route scrolling remove tablet click-target movement during delayed smooth animations. Critical recovery observer self-loop is fixed with idempotent text/HTML writes; idle DOM quiescence is now release-tested.
- Premerge Playwright browser matrix now includes an independent tablet WebKit project, alongside prior desktop/tablet/mobile Chromium projects.
- Production acceptance still demands all original 21 scenarios to expand, exact aria-expanded semantics, and all original diagnostic and role/privacy boundaries.
- Source logo blob permanently locked, no new artwork or styling change. Current verified v1.60.0 rollback deploy retained.

## Next priorities
1. Two full exact-head gate passes including WebKit plus independent apex/www desktop/tablet/mobile acceptance; owner aesthetic sign-off still separate.
2. Reduce historical recovery observer/patch stack only after equivalent public functionality on WebKit and Chromium.
3. Keep all credential-dependent / privacy-sensitive deferred items from preceding lists.

## Full preceding improvement list preserved
# EnglishLegalese.com — Next Version Improvement List after v1.61.0 (candidate)

This release fixes the owner-observed visually inadequate v1.60.0 homepage. Candidate status; do not mark owner aesthetic approval as complete.

## Material visual improvements in this version
- Header logo: approved Git blob preserved byte-for-byte; avoid shrinking the 1024-square artwork to a tiny 58–78px image box, frame its transparent borders using display-only CSS, provide about 230px visible header wordmark frame desktop and 188px mobile. Visual approval pending.
- Hero: remove duplicate enlarged brand logo, repetitive language claims and four competing pill CTA buttons; preserve all four pathways by using two primary buttons and two legible inline links.
- Add static educational plain-English rewrite example derived from the existing original diagnostic, not fictitious teacher/voice/accreditation service.
- Refine desktop/mobile heading scale and whitespace, readable nav and premium restrained card/button treatments. Preserve intact eight-question diagnostic, 21 scenarios, teacher/employer/privacy boundaries, full course catalog, local progress and account guards.
- New mobile/tablet/desktop visual and production tests assert brand bounds, no overflow and scenario availability; owner aesthetic approval and full release qualification remain separate.

## Upcoming priorities
1. Owner visual sign-off on both desktop and mobile screenshot: mandatory before recording any approved golden design.
2. Further reduce original presentation stack only after equivalent-feature tests and frozen baseline.
3. Improve real SmartTeacher workflow with authenticated/authorized ChatGPT integration rather than suggesting static demo is connected; only if real credentials and privacy gate permit.
4. Validate mobile nav with real handsets and accessibility feedback; maintain 21 scenarios and diagnostic.
5. Preserve all unresolved original v1.60 inherited 20-item statuses below.

## Full preceding improvement list retained verbatim below
# EnglishLegalese.com — Next Version Improvement List after v1.60.0

v1.60.0 priority: owner-observed homepage failure; heading typography, responsive layout, routing, cache/version, safe rollback. Source: v1.59.0 exact accepted predecessor `bdcf7bc38cc6d1d123d8975be4bf3754a0316c80`.

## Full inherited 20-item disposition matrix

1. **Inherited item 1:** BLOCKED_BY_OWNER_APPROVAL — automated page-height/screenshot checks pass, but owner-approved golden image baseline remains pending; no goldens auto-approved.
2. **Inherited item 2:** IN_PROGRESS — removed redundant observers and old promo injection; remaining useful v1.59 controller intentionally preserved pending equivalence.
3. **Inherited item 3:** DONE_THIS_RELEASE — postdeploy apex/www acceptance suite extended to focused navigation, homepage height, cache/version evidence.
4. **Inherited item 4:** DONE_THIS_RELEASE — verifiable release meta and X-EnglishLegalese-Release response header.
5. **Inherited item 5:** DONE_THIS_RELEASE — HTML no-cache revalidation plus version-unique JS/CSS URLs.
6. **Inherited item 6:** IN_PROGRESS — HTML head meta release check added; dedicated validation and previews deferred.
7. **Inherited item 7:** BLOCKED — external credentials/service integrations not available or safe to activate in this homepage patch.
8. **Inherited item 8:** DEFER_WITH_REASON — cross-device state depends on production-auth/privacy readiness.
9. **Inherited item 9:** DEFER_WITH_REASON — full retention/export backend changes require separate verified data model and authorization.
10. **Inherited item 10:** DEFER_WITH_REASON — teacher review workflow depends on authenticated role and privacy readiness.
11. **Inherited item 11:** DEFER_WITH_REASON — spaced review depends on stable learner-controlled progress storage.
12. **Inherited item 12:** DEFER_WITH_REASON — do not claim speech scoring without independent validation.
13. **Inherited item 13:** DEFER_WITH_REASON — qualified employer access and consent required.
14. **Inherited item 14:** DEFER_WITH_REASON — commercial pricing/payment decision and market verification required.
15. **Inherited item 15:** DONE_THIS_RELEASE — focused courses/scenarios/planner/progress/teachers/employers/language/trust routes with accessible return home.
16. **Inherited item 16:** DEFER_WITH_REASON — lockfile/npm-ci change requires clean-cache Render parity.
17. **Inherited item 17:** DEFER_WITH_REASON — no secrets or external auth mutated; operational expansion needs separate privileged review.
18. **Inherited item 18:** DEFER_WITH_REASON — Render service health-path edit needs separate service-config authority; /health retained and verified.
19. **Inherited item 19:** IN_PROGRESS — removed legacy promo/internal text and duplication; copy reductions constrained by privacy/legal boundaries.
20. **Inherited item 20:** IN_PROGRESS — fresh homepage research ledger completed; full competitor expansion remains recurring.

## Active next release priorities
1. Finish consolidation to one canonical public renderer after equivalent-behavior proof.
2. Obtain Roger's approval of the desktop/tablet/mobile screenshots before establishing golden visual baselines.
3. Audit focused views at mobile/tablet after live rollout; repair any observed regression.
4. Further expand current comparative research and build safe, account-ready teacher/learner improvements without changing unqualified integrations.
5. Complete explicitly deferred inherited work only after its corresponding credential, owner choice, safe migration or independent qualification is available.

## Full predecessor list retained verbatim below — no omission
# EnglishLegalese.com — Next Version Improvement List after v1.59.0

This list is active input for the next material release under EL-RGR-016. v1.59.0 is the hard live-homepage recovery successor to the owner-rejected v1.58 production state. It directly enforces critical public correctness, uses fresh v1.59 asset URLs, progressively discloses long learning surfaces with native DOM state, preserves all useful learning features, and adds browser regressions for the exact stale/long state Roger observed.

## Highest-value next work

1. **Owner-approved golden visual baselines:** once Roger approves v1.59 production screenshots, preserve desktop/tablet/mobile goldens and add pixel-diff visual regression. Never auto-approve a changed baseline.
2. **Collapse the public patch stack:** after v1.59 proves stable in production, migrate the still-needed v1.54.8/v1.55/v1.56/v1.57/v1.58/v1.59 presentation behavior into one canonical public application architecture. Retire predecessor layers only after behavioral equivalence/no-loss proof.
3. **Production browser acceptance automation:** run a postdeploy Playwright smoke against `https://englishlegalese.com` and `https://www.englishlegalese.com` that verifies the live release marker, rejected strings absent, progressive disclosure, diagnostic, hash navigation and dashboard denial.
4. **Release/currentness response evidence:** add a lightweight release identifier that can be verified in the production HTML/headers without exposing internal operational data.
5. **HTTP cache policy:** after observing v1.59 production behavior, set explicit server response cache policy for HTML and versioned assets if needed. Prefer standards-based `no-cache`/revalidation for HTML and release-specific URLs for changeable assets; do not overuse `no-store` without reason.
6. **HTML/head validation:** add standards-based HTML/head validation plus canonical/Open Graph/Twitter preview verification.
7. **Complete production integrations E2E:** validate PostgreSQL, auth, OpenAI, SMTP, object storage, classroom/calendar providers, backups/restore and any active payment integration with account-owned credentials. Report unavailable items as `NOT RUN`/`BLOCKED`.
8. **Authenticated cross-device learning state:** only after production-qualified auth/privacy foundations, add consented persistence with deletion/export and strict separation of learner-private, teacher-shared and employer-safe data.
9. **Retention/deletion/export controls:** implement explicit user data lifecycle controls before expanding durable practice storage.
10. **Teacher review workflow:** production-qualify assigned scenarios, learner review packets and teacher-confirmed feedback while preserving separation from self-checks and AI feedback.
11. **Spaced review:** recommend practice from completed scenarios and next-focus notes without fake mastery, manipulative streak pressure or employer exposure of private work.
12. **Speech/pronunciation infrastructure:** evaluate only validated technology before any scoring claim. Text-guided conversation must not masquerade as speech analytics.
13. **Employer reporting:** expand only after role permissions are production-qualified; continue consent-based aggregate reporting and private-work exclusion by default.
14. **Course/pricing/commercial review:** review catalog, pricing, billing/cancellation and offer wording before paid acquisition or broad employer outreach.
15. **Focused destinations/pages:** move full Courses, Scenario Studio, Learning Path, Learning Progress, Teachers, Employers, Language Support and Trust into focused destinations only after compatible routing/no-loss proof.
16. **Reproducible dependency install:** evaluate a reviewed `package-lock.json` + `npm ci` path and prove clean-cache Render parity before switching.
17. **Security operations:** add evidence for secret/token redaction, least privilege, integration revocation, vulnerability remediation, backup encryption/restore and safe logs.
18. **Render health-check configuration:** set `/health` as the Render service health-check path when safely supported and include health evidence in acceptance.
19. **Trust-copy consolidation / AI terminology:** reduce repetitive disclaimers without weakening boundaries and keep SmartTeacher AI, AI-output review and translation-safety labels purpose-specific.
20. **Fresh research every material release:** continue Legal-English specialist/formal assessment, AI tutor, corporate/tutor platform, general language, accessibility, learning science, privacy/security, SEO/performance and responsible-AI research with explicit dispositions.

## Permanent preservation rules
- `BUILT` ≠ `QUALIFIED` ≠ `MERGED` ≠ `DEPLOYED` ≠ `LIVE_CORRECT`.
- No product drift and no rule drift.
- Build only from the true newest authoritative predecessor and perform pre-seal race/currentness checks.
- Preserve useful working functionality unless an intentional replacement is proven equal or better.
- Never expose internal staff/owner operational dashboards to unauthenticated public users.
- Starting diagnostic remains explicitly non-accredited and its answers remain non-persistent by default.
- Desktop/tablet/mobile real-browser qualification remains release-blocking for material public releases.
- Normal hash navigation must never restore stale/internal public copy or expand the entire homepage unintentionally.
- High/critical dependency findings block qualification.
- Sister projects remain read-only sources of transferable lessons unless Roger explicitly authorizes otherwise.
- The approved EnglishLegalese logo remains permanently locked under EL-RGR-019; only aspect-ratio-safe responsive display sizing may change without explicit Roger unlock.

