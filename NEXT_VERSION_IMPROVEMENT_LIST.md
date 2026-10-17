# EnglishLegalese.com — Next Version Improvement List after v1.58.0

This list is active input for the next material release under EL-RGR-016. v1.58.0 is the production-homepage recovery release: it fixes the hash-navigation lifecycle defect that allowed old v1.54/v1.55 public presentation to reappear after normal navigation, makes critical public correctness canonical, adds persistent recovery, cache-busted assets, a canonical non-accredited diagnostic, progressive disclosure, and stronger browser regression coverage.

## Highest-value next work

1. **Golden visual baselines:** after Roger approves the final v1.58 production screenshots, commit owner-approved desktop/tablet/mobile golden screenshots and add pixel-diff visual regression as release-blocking evidence. Never auto-approve a changed baseline.
2. **Eliminate patch-stack fragility:** once v1.58 has stable browser/live equivalence history, fold the still-needed v1.54.8/v1.55/v1.56/v1.57 additive public layers into a single canonical application architecture and retire redundant presentation patches only after exact behavior/equivalence proof.
3. **Production hash-route smoke:** add a postdeploy browser smoke that visits `#home`, `#teachers`, `#courses`, `#smartteacher`, `#language-bridge`, `#practice-studio`, `#learning-plan`, `#skills-passport`, then returns to `#home`, verifying that corrected public copy and progressive disclosure remain intact after every route transition.
4. **Asset/currentness verification:** add release-ID/header verification so production can prove which CSS/JS build the browser actually received, not merely which commit Render deployed. Continue cache-busting for material public releases.
5. **HTML/head validation:** add standards-based HTML/head validation plus production canonical/Open Graph/Twitter preview verification.
6. **Complete production integrations E2E:** validate PostgreSQL, auth secret, Stripe/webhooks if active, OpenAI, SMTP, object storage, classroom/calendar providers, backups, restore and rollback with account-owned credentials. Report `NOT RUN`/`BLOCKED` honestly when unavailable.
7. **Authenticated cross-device learning state:** only after production-qualified auth/privacy foundations, add consented persistence with purpose limitation, deletion/export and strict separation among learner-private work, teacher-shared work and employer-safe aggregates.
8. **Retention/deletion/export controls:** implement explicit learner/account data lifecycle controls before expanding durable practice storage.
9. **Teacher review workflow:** production-qualify assigned scenarios, learner review packets and teacher-confirmed feedback while keeping teacher feedback distinct from self-checks and AI feedback.
10. **Spaced review:** recommend practice from completed scenarios and next-focus notes without manipulative streak pressure, fake mastery or employer exposure of private work.
11. **Speech/pronunciation infrastructure:** evaluate only validated, truthful speech/pronunciation/fluency technology before making any scoring claim. Text-guided conversation must not masquerade as speech analytics.
12. **Employer reporting:** expand only after role permissions are production-qualified; use consent-based aggregates and continue excluding private learner work by default.
13. **Course/pricing/commercial review:** review current catalog, pricing, billing/cancellation and offer wording before paid acquisition or broad employer outreach. Do not infer current commercial state from historic prototypes.
14. **Focused destinations/pages:** after stable route equivalence, move full Courses, Scenario Studio, Learning Path, Skills Progress, Teachers, Employers, Language Support and Trust into focused destinations while preserving current anchors through compatible routing.
15. **Reproducible dependency install:** evaluate a reviewed `package-lock.json` + `npm ci` path; prove manifest/lock consistency and clean-cache Render parity before switching CI/deploy behavior.
16. **Security operations:** add evidence for secret/token redaction, least privilege, integration revocation, vulnerability-remediation tracking, backup encryption/restore and safe logs.
17. **Render health-check configuration:** set the existing `/health` endpoint as the Render service health-check path when the management surface safely permits it; make health success part of acceptance.
18. **Custom-domain release smoke:** verify `englishlegalese.com`, `www.englishlegalese.com`, Render URL, HTTPS/certificate, `/health`, diagnostic, hash navigation and dashboard denial on every production deployment before `LIVE_CORRECT`.
19. **Trust-copy consolidation:** continue reducing repeated disclaimers while preserving necessary education/legal/translation/privacy boundaries.
20. **AI terminology normalization:** keep SmartTeacher AI, AI-output review, AI draft review and translation-safety labels clear and purpose-specific without erasing useful curriculum distinctions.
21. **Fresh competitor research:** every material version must review current Legal-English specialists, formal assessment/certification, AI speaking tutors, teacher marketplaces, corporate platforms, general language apps and adjacent professional-training products; record `ADOPT`, `ADAPT`, `DEFER_WITH_REASON`, `NOT_APPLICABLE`, or `REJECT_WITH_CAUSE`.
22. **Whole-product research:** continue accessibility, learning science, privacy/security, AI safety, SEO, performance, conversion, retention, teacher/employer flow and support/error-state review.
23. **Permanent dependency security gate:** fresh install plus `npm audit --audit-level=high` remains release-blocking.
24. **Permanent logo lock:** preserve EL-RGR-019 exact approved logo bytes; only aspect-ratio-safe responsive display sizing may change without explicit Roger unlock.
25. **Production acceptance discipline:** maintain `BUILT` ≠ `ACCEPTED` ≠ `DEPLOYED` ≠ `LIVE_CORRECT`; no future public release is `LIVE_CORRECT` until the actual production browser state is verified, including after ordinary hash navigation.

## Permanent preservation rules
- No product drift and no rule drift.
- Build only from the true newest authoritative predecessor.
- Preserve useful working functionality unless intentional replacement is proven equal or better.
- Never expose internal staff/owner operational dashboards to unauthenticated public users.
- Keep the EnglishLegalese starting diagnostic explicitly non-accredited unless a future validated/authorized assessment framework establishes otherwise.
- Diagnostic answers remain non-persistent by default unless a later consented data model explicitly changes that behavior.
- Browser desktop/tablet/mobile qualification remains release-blocking for material public releases.
- Normal in-page navigation must never revert the public DOM to stale/internal copy.
- No material release without rule-currentness, no-drift evidence, honest tests, recovery facts, fresh research/competitor disposition and this updated list.
- High/critical dependency findings block qualification.
- Sister projects remain read-only sources of transferable lessons unless Roger explicitly grants separate authority.
- The approved EnglishLegalese logo remains permanently locked under EL-RGR-019 until Roger explicitly changes that instruction.
