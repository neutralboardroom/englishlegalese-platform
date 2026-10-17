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
