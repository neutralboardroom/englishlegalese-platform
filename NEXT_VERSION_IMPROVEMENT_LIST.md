# EnglishLegalese.com — Next Version Improvement List after v1.56.0

This list is active input for the next material release under EL-RGR-016. It preserves qualified deferred work from the predecessor and new work discovered during the v1.56.0 screenshot audit.

## Highest-value next work

1. Add browser-level accessibility, responsive, keyboard and visual-regression automation for desktop, tablet and mobile, including sticky-header offsets, active navigation, menu behavior, reduced motion, touch targets, Scenario Studio, Learning Path, Skills Progress and dashboard access blocking.
2. After browser-equivalence tests exist, move deep experiences into focused destinations/pages (full Courses, Scenario Studio, Learning Path, Skills Progress, Teachers, Employers, Language Support, Trust) while preserving every current anchor/feature through compatible redirects or intentional navigation migration.
3. Build an original, non-accredited Legal English starting diagnostic/placement flow that recommends a learning path without claiming CEFR, TOLES or other formal certification unless separately validated and authorized.
4. Add authenticated cross-device learning-state persistence with explicit learner consent, purpose limitation, deletion/export controls and strict separation between learner-private work, teacher-shared work and employer-safe aggregates.
5. Add a spaced-review/recommendation system that uses completed scenarios and learner next-focus notes without manipulative streak pressure or fake mastery scores.
6. Evaluate qualified speech/pronunciation/fluency infrastructure. Add speaking measurements only when they can be produced, validated and described truthfully.
7. Build a production-qualified teacher review workflow for assigned scenarios, learner-submitted review packets and teacher-confirmed feedback, keeping teacher-confirmed feedback distinct from self-checks and AI feedback.
8. Expand employer/team reporting only after account permissions are production-qualified; use consent-based aggregate learning signals and exclude private learner content by default.
9. Add standards-based HTML/head validation and production social-preview verification so malformed metadata/canonical/Open Graph output fails before deployment.
10. Validate production integrations end to end with account-owned credentials: PostgreSQL, authentication secret, Stripe/webhooks if active, OpenAI, SMTP, object storage, classroom/calendar providers, backups, restore and rollback. Report NOT RUN/BLOCKED honestly when unavailable.
11. Review current course catalog, pricing, billing/cancellation and offer wording before paid acquisition or broad outreach. Do not infer current price/payment state from historic prototype routes.
12. Add browser smoke tests for core journeys: learner start → scenario → SmartTeacher → self-check → teacher review; account access; teacher path; employer path; and role-denial behavior.
13. Fold additive v1.54.8/v1.55.0/v1.56.0 public layers into the core application only after browser equivalence proves no wording, accessibility, navigation, mobile, feature or rule loss.
14. Create a successor canonical rule register that transactionally incorporates EL-RGR-019 into one complete active corpus while preserving the v1.55 register and owner amendment as immutable provenance.
15. Continue fresh competitor research every material version across Legal-English specialists, assessment/certification products, AI speaking tutors, teacher marketplaces, corporate language platforms, general language apps and adjacent professional-training products; explicitly adopt/adapt/defer/reject with cause.
16. Continue whole-product research on learning science, accessibility, privacy/security, AI safety, SEO, performance, conversion, retention, teacher/employer workflows and support/error states.
17. Keep the v1.55.1 dependency-security control permanent: fresh dependency install plus `npm audit --audit-level=high` remains release-blocking.
18. Evaluate a reproducible `package-lock.json` + `npm ci` deployment path, prove it matches Render clean-cache behavior, then lock dependency-manifest consistency if adopted.
19. Add explicit learner/account data-retention, deletion and export controls before expanding cross-device persistence.
20. Add security-operational evidence for secrets/token redaction, least privilege, integration revocation, vulnerability-remediation tracking, backup encryption/restore and safe operational logging.
21. Evaluate enterprise SSO/SCIM only after authentication/authorization foundations are production-qualified and actual employer demand justifies it.
22. Configure Render to use the existing `/health` endpoint as its service health-check path when the management surface permits it; then make health-check success part of deployment acceptance.
23. Continue consolidating repeated trust/disclaimer language while preserving necessary educational/legal boundaries and the strong Trust Center.
24. Continue public AI terminology normalization (SmartTeacher AI, AI-output review, AI draft review, AI Translator Safety) so each label has a clear learner-facing purpose without erasing meaningful curriculum distinctions.
25. Add automated screenshot/baseline comparison against the owner-approved v1.56 visual state so future visual drift is machine-detectable.
26. Preserve EL-RGR-019 permanently: exact logo bytes stay locked; only aspect-ratio-safe responsive display sizing may change without explicit owner unlock.
27. Verify both `englishlegalese.com` and `www.englishlegalese.com` on every production deployment and keep DEPLOYED distinct from LIVE_CORRECT until apex, www, Render URL and `/health` are all verified.

## Permanent preservation rules
- No product drift and no rule drift.
- Build only from the true newest authoritative predecessor.
- Preserve useful working functionality unless intentional replacement is proven equal or better.
- Never expose internal staff/owner operational dashboards to unauthenticated public users.
- No material release without rule-currentness, no-drift evidence, honest tests, recovery facts, fresh research/competitor disposition and this updated list.
- High/critical dependency findings block qualification.
- Sister projects remain read-only sources of transferable lessons unless Roger explicitly grants separate authority.
- The approved EnglishLegalese logo is permanently locked under EL-RGR-019 until Roger explicitly changes that instruction.
