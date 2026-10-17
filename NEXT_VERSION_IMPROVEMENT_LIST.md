# EnglishLegalese.com — Next Version Improvement List after v1.57.0

This list is active input for the next material release under EL-RGR-016. v1.57.0 completed the original non-accredited starting diagnostic, real-browser desktop/tablet/mobile qualification, and canonical rule-register consolidation through EL-RGR-019.

## Highest-value next work

1. Promote an owner-reviewed v1.57 browser screenshot set to committed golden baselines, then make pixel-diff visual regression release-blocking in the same stable CI environment. Do not auto-approve a changed baseline.
2. Expand browser smoke tests into complete role-aware journeys once production authentication is qualified: learner account access, teacher review/assignment, employer aggregate reporting, role denial, and account recovery.
3. Add standards-based HTML/head validation plus production social-preview verification so malformed canonical/Open Graph/Twitter metadata fails before deployment.
4. Validate production integrations end to end with account-owned credentials: PostgreSQL, authentication secret, Stripe/webhooks if active, OpenAI, SMTP, object storage, classroom/calendar providers, backups, restore and rollback. Report NOT RUN/BLOCKED honestly when unavailable.
5. Add authenticated cross-device learning-state persistence only with explicit learner consent, purpose limitation, deletion/export controls, and strict separation between learner-private work, teacher-shared work and employer-safe aggregates.
6. Add explicit learner/account data-retention, deletion and export controls before any expansion of durable cross-device practice data.
7. Build spaced-review recommendations from consented completed scenarios and learner next-focus notes without manipulative streak pressure, fake mastery scores, or employer exposure of private practice.
8. Evaluate qualified speech/pronunciation/fluency infrastructure. Add speaking measurements only when they can be produced, validated and described truthfully.
9. Build a production-qualified teacher review workflow for assigned scenarios, learner-submitted review packets and teacher-confirmed feedback, keeping teacher-confirmed feedback distinct from self-checks and AI feedback.
10. Expand employer/team reporting only after account permissions are production-qualified; use consent-based aggregate learning signals and exclude private learner content by default.
11. Review the current course catalog, pricing, billing/cancellation and offer wording before paid acquisition or broad outreach. Do not infer current price/payment state from historic prototype routes.
12. After browser-equivalence history is stable, move deep experiences into focused destinations/pages (full Courses, Scenario Studio, Learning Path, Skills Progress, Teachers, Employers, Language Support, Trust) while preserving current anchors through compatible redirects or intentional navigation migration.
13. Fold additive v1.54.8/v1.55.0/v1.56.0/v1.57.0 public layers into the core application only after browser and visual equivalence prove no wording, accessibility, navigation, mobile, feature or rule loss.
14. Evaluate and adopt a reproducible `package-lock.json` + `npm ci` path. Generate/review the lock, prove dependency-manifest consistency and Render clean-cache parity, and only then switch deployment/CI installation behavior.
15. Add security-operational evidence for secrets/token redaction, least privilege, integration revocation, vulnerability-remediation tracking, backup encryption/restore and safe operational logging.
16. Evaluate enterprise SSO/SCIM only after authentication/authorization foundations are production-qualified and actual employer demand justifies it.
17. Configure Render to use the existing `/health` endpoint as its service health-check path when the management surface safely permits it; make health-check success part of deployment acceptance.
18. Continue consolidating repeated trust/disclaimer language while preserving necessary educational/legal boundaries and the strong Trust Center.
19. Continue public AI terminology normalization (SmartTeacher AI, AI-output review, AI draft review, AI Translator Safety) so each label has a clear learner-facing purpose without erasing meaningful curriculum distinctions.
20. Continue fresh competitor research every material version across Legal-English specialists, assessment/certification products, AI speaking tutors, teacher marketplaces, corporate language platforms, general language apps and adjacent professional-training products; explicitly adopt/adapt/defer/reject with cause.
21. Continue whole-product research on learning science, accessibility, privacy/security, AI safety, SEO, performance, conversion, retention, teacher/employer workflows and support/error states.
22. Keep the v1.55.1 dependency-security control permanent: fresh dependency install plus `npm audit --audit-level=high` remains release-blocking.
23. Preserve EL-RGR-019 permanently: exact approved logo bytes remain locked; only aspect-ratio-safe responsive display sizing may change without explicit owner unlock.
24. Verify `englishlegalese.com`, `www.englishlegalese.com`, the Render URL, `/health`, the v1.57 diagnostic, and protected dashboard-denial behavior on every production deployment before calling the release LIVE_CORRECT.

## Permanent preservation rules
- No product drift and no rule drift.
- Build only from the true newest authoritative predecessor.
- Preserve useful working functionality unless intentional replacement is proven equal or better.
- Never expose internal staff/owner operational dashboards to unauthenticated public users.
- The EnglishLegalese starting diagnostic must remain explicitly non-accredited unless a future validated/authorized assessment framework establishes otherwise.
- Diagnostic answers remain non-persistent by default unless a later consented data model explicitly changes that behavior.
- Browser desktop/tablet/mobile qualification remains release-blocking for material public releases.
- No material release without rule-currentness, no-drift evidence, honest tests, recovery facts, fresh research/competitor disposition and this updated list.
- High/critical dependency findings block qualification.
- Sister projects remain read-only sources of transferable lessons unless Roger explicitly grants separate authority.
- The approved EnglishLegalese logo is permanently locked under EL-RGR-019 until Roger explicitly changes that instruction.
