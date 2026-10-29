# EnglishLegalese website — durable HF24 to HF25+ dashboard, enrollment, certifications handoff
Recorded 2026-10-29. Required future WEBSITE work; not a universal-builder generation request.

## Release truth
- Current verified production source at original handoff: main 6896ac7, v1.85.9 HF23. HF24 branch is CANDIDATE until tests, merge, Render and live apex/www checks prove otherwise.
- Retain original latest universal builder as the command for building the next ACTUAL website version. Never substitute generating a new universal builder.
- The statuses BUILT, TESTED, MERGED, DEPLOYED and LIVE are different. Mark future scope only as done after verified function with real authenticated data, not mock UI alone.
- Keep approved homepage layout, logo and hero, curriculum and all free learning tools; no destructive database operations, secret disclosure, unauthorized email, payment, grades or certificates.

## Student dashboard — ship and keep improving
- Verified student login, account email verification, password reset, transactional notices for real events only, sign out and all-device signout.
- Pause/save/resume independent lessons; preserve across devices with secure backups, non-destructive restore, privacy controls, genuine progress and statuses.
- Search/filter own lessons, resume the exact current exercise, compare submission history, explicit teacher-review statuses, private feedback and accountable downloads.
- Ensure truthful zero/error states; do not invent teacher assignments, assessments, completed grades or completed coursework. No employer access to private practice work.
- Add helpful next-action panel, overdue assignment indicators if genuine, accessible mobile controls, backup/recovery visibility and confirmed-save timestamps.

## Teacher dashboard — ship and keep improving
- Separate authorized teacher login; assigned-only submission review queue with accurate pending/reviewed summary, search, filter and refresh.
- Real teacher feedback on genuinely assigned student work with proper permission checks, durable save, preserved review history, clear status and safe sign out/revocation.
- Next: actual linked classroom calendar, teacher availability, lesson roster, attendance, assignments/homework, moderated assessment rubrics, class closeout and student-facing actions. No automatic AI grading presented as teacher evaluation.
- Keep teacher-only private data inaccessible to other teachers and employers. Add good actionable review priorities and case status.

## Employer dashboard and enterprise commerce — ship and keep improving
- Verified employer login plus active authorized company administrator membership; strict organization scoping. Employers cannot read private student answers or instructor notes.
- Consent-gated employee progress: show only active linked employees with explicit consent and published privacy-safe completion, attendance, scores, achievements, level and appropriate certificates. Missing results = NOT REPORTED, never zero.
- Search/filter organization employees; downloadable authorized reports with safe CSV, result dates, comparative growth only when grounded, and cross-company isolation.
- Ability to invite/link employees securely with their acceptance and data-sharing choices; seat/roster management and team class assignments.
- Employer selects employees, Legal English or Business English program (and investor/complete packages), package length, preferred schedule, seat count and volume discount. Server-calculated quote, idempotent requests, truthful status history, staff-confirmed class allocations. No user auto-creation by typing names.
- Implement real purchases once safely qualified: seller-authoritative prices, Stripe hosted checkout, webhook signature+idempotency, payment transaction ledger, invoices/receipts, credits, refunds, cancellations and robust mapping from paid order to exact seats/class confirmations. Never mark paid or enrolled based on redirect alone. Disable real charging until the payment integration is verified. No manual charge or third-party API key change without approval.
- Provide clear enrollment-request status, teacher/time confirmation, available vs pending seats, billing history and export as each feature becomes real.

## Owner and administrator dashboard — ship and keep improving
- Secure owner/admin sign-in, true operational counts, registrations by role, employer relationships, class requests, teacher queue, progress reports and truthful system readiness.
- Implement actual, role-restricted controls for new enrollment inquiries and teacher applications, student/teacher/employer organization management, approving memberships, instructor assignments, lesson scheduling, calendar confirmation, curriculum/price governance, certificates, examination/moderation, payments, refunds and invoices.
- Include delivery health, active operational blockers, audit trail, secure export, cancellation, recovery/backup status and integration-readiness displays. Separate read-only snapshots from actionable privileged controls; do not expose raw learner submissions, secrets or unrestricted administration.
- Accessibility, empty/error state, filtering, quick links and mobile behavior require end-to-end tests.

## Two original EnglishLegalese certifications — independent and branded
- Two separate branded credentials and dedicated pages: EnglishLegalese Legal English Certification and EnglishLegalese Business English Certification, with shared overview and homepage navigation.
- Each has its OWN six A1/A2/B1/B2/C1/C2 level definitions, distinct test banks, skills rubric, examiner record, score, issue record, ID prefix and verification. Matching visual certificate style is okay, mixing results is not.
- Use CEFR as an international reference and transparent proficiency-level design guide. No claim that Council of Europe accredits, endorses or issues our certificates, and no unvalidated score equivalence to TOLES, Cambridge or other awards.
- Build original, progressively harder live teacher-supervised reading, listening, speaking, writing and professional interaction tests for each track and each level, with unseen prompts and practical tasks. Verify candidate identity, assess without unauthorized AI assistance, obtain appropriate remote-proctoring consent, protect accommodations and privacy, document scoring rubrics/assessor training, moderation, appeals/resits and quality controls.
- After real examination and approved score, EnglishLegalese will issue its own tamper-resistant certificate with exact specialist track, level, candidate identity, issue date, issuer, verifiable unique certificate number, secure credential/PDF delivery, permitted verification and revocation. Record audits and never issue from unsupervised online practice.
- These certification programs should be implemented before the wider site launch once independently qualified. Maintain future-positive homepage copy explaining usefulness to CURRENT AND PROSPECTIVE EMPLOYERS; do not repeatedly saturate marketing copy with unavailable/development warnings, but make actual booking/payment availability truthful.
- Employer verification must respect learner authorization; never expose raw testing evidence without consent.

## Immediate release handoff and acceptance gates
- HF24 code includes candidate private role dashboards, consent-scoped employer progress, read-only owner snapshot, pending employee enrollment request form and two certification content pages. This is not proof all functions are operational in production.
- Additive employer-enrollment SQL migration requires verified production backup and controlled application; do not assume pushed code ran it.
- Resolve all source-verifier, accessibility, security, dependency and desktop/tablet/mobile browser CI failures before merging. No bypass to deploy.
- Check exact GitHub merged commit, Render deployment SHA, production /health, apex + www pages, authenticated API denial and authorized session flows after deployment.
- Continue EVERY incomplete workstream in the next versions with explicit statuses (built, qualified, live, blocked) and references. Preserve all inherited improvement lists and universally approved durable rules.
