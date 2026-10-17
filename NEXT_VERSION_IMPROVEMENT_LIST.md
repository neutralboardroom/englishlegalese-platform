# EnglishLegalese.com — Next Version Improvement List after v1.55.1

This list is active input for the next material release under `EL-RGR-016`. Each still-relevant item must be explicitly dispositioned; qualified work must not be repeatedly carried forward without cause.

## Highest-value next work

1. Add browser-level accessibility, responsive and keyboard regression automation for desktop, tablet and mobile, including focus order, menu behavior, reduced motion, touch targets, Scenario Studio, Learning Path and Skills Passport.
2. Build an original, non-accredited Legal English placement/diagnostic flow that recommends a level and learning path without claiming CEFR, TOLES or other formal certification unless separately validated and authorized.
3. Add authenticated, cross-device Skills Passport persistence with granular learner consent, deletion/export controls and strict separation between learner-private work, teacher-shared work and employer-safe aggregate progress.
4. Add a spaced-review system that recommends the learner’s next scenario or micro-drill from prior weak-skill notes and completed practice, without manipulative streak pressure or fake mastery scores.
5. Evaluate qualified speech/pronunciation/fluency infrastructure. Add speaking feedback only when measurements can be produced and described truthfully; do not fabricate pronunciation or fluency scoring.
6. Build a teacher workflow for assigned scenarios, learner-submitted review packets and teacher-confirmed feedback. Keep teacher-confirmed feedback visibly separate from learner self-checks and automated AI feedback.
7. Expand the employer/team experience with privacy-safe aggregate skill coverage, role/goal alignment and engagement reporting while excluding drafts, raw AI conversations, confidential facts and private teacher notes.
8. Expand the original/synthetic Scenario Studio by practice area, role and jurisdiction-neutral professional task, prioritizing high-value client communication, contracts, negotiation, legal writing, cross-border work, LL.M. study and AI-output review.
9. Add standards-based HTML/head validation and production social-preview verification so malformed metadata and broken canonical/Open Graph presentation fail before deployment.
10. Validate production integrations end to end with account-owned credentials: database, Stripe if active, OpenAI, SMTP, object storage, classroom/calendar providers, backups, restore and rollback. Report `NOT RUN` or `BLOCKED` honestly when credentials or production access are unavailable.
11. Review current course catalog, pricing, billing/cancellation and public offer wording for commercial accuracy before paid acquisition or broad outreach. Do not infer price or live-payment state from old files.
12. Add browser smoke tests for the core journeys: learner start/diagnostic → scenario practice → AI practice → self-check → teacher review; teacher review flow; employer-safe progress view; account/login; staff/admin paths where applicable.
13. Fold additive v1.54.8/v1.55.0 public-experience layers into the core application only after browser equivalence tests prove no loss of public wording, navigation, accessibility, mobile behavior, feature behavior or rule protections.
14. Add a formal rule-governance crosswalk/history so every future Roger Rule and durable builder-rule amendment has stable predecessor/successor identity, provenance, release effect and test linkage without relying on chat memory.
15. Continue fresh current competitor research on **every material version** across Legal-English specialists, certification/assessment products, AI speaking tutors, teacher marketplaces, corporate language platforms, general language-learning apps and adjacent professional-training products. Explicitly adopt, adapt, defer or reject qualified ideas with cause; never copy protected expression or proprietary content.
16. Continue whole-product research beyond competitors: accessibility standards, privacy/security practices, learning science, AI safety, support patterns, SEO, performance, conversion, retention and teacher/employer workflows. Implement the strongest safe improvements rather than creating cosmetic version churn.
17. Preserve the exact v1.54.8 primary navigation and simplified five-item mobile quick navigation unless a future intentional navigation change is justified, tested against user benefit and explicitly documented under the no-drift gate.
18. Keep the v1.55.1 dependency-security control permanent: fresh dependency install plus `npm audit --audit-level=high` must remain release-blocking for high/critical findings. Review moderate findings separately for exploitability, reachable code and reasonable remediation rather than silently ignoring them.
19. Evaluate committing a reproducible `package-lock.json` after confirming it does not cause Render/install drift; if adopted, require lockfile/dependency-manifest consistency and controlled dependency-update receipts.
20. Add explicit learner/account data retention, deletion and export controls before expanding authenticated cross-device persistence; document purpose and retention by data class rather than using one blanket retention period.
21. Add security-operational controls and evidence for secrets/token redaction, least-privilege access, integration revocation, vulnerability-remediation tracking, backup encryption/restore, and safe operational logging. Only publish trust/security claims after the corresponding controls are proven.
22. Evaluate enterprise SSO and lifecycle provisioning/SCIM for employer plans after authentication/authorization foundations are production-qualified. Require deprovisioning and least-privilege behavior; do not add enterprise identity complexity before it materially serves active customers.

## Permanent preservation rules

- No product drift and no rule drift.
- Build only from the true newest authoritative predecessor.
- Preserve all working useful functionality unless an intentional replacement is proven equal or better.
- No material release without a rule-currentness check, no-drift evidence, honest tests, recovery facts, fresh research/competitor disposition and this updated Next Version Improvement List.
- High/critical dependency findings block qualification until resolved or explicitly proven non-applicable under an equally strong owner-approved safety decision.
- Sister projects remain read-only sources of transferable lessons unless Roger explicitly grants separate authority.
