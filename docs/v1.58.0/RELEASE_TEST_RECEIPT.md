# EnglishLegalese v1.58.0 — Release Test Receipt

Date: 2026-10-17

## Qualified release behavior

Provisional complete qualification succeeded on code/content head `628e2475351dbb98efd84e913d94b7591ae6e057` in GitHub Release Gate run `39040497603`.

- Node runtime: Node 20.20.2 in CI.
- Fresh dependency install: 113 packages added / 114 audited; **0 vulnerabilities**.
- `npm audit --audit-level=high`: **0 vulnerabilities**.
- v1.58 production-recovery verifier: **58/58 PASS**.
- Playwright public-browser qualification: **18/18 PASS** across desktop Chromium, tablet Chromium and mobile Chromium.
- Browser coverage included corrected homepage/public-copy assertions, approved-logo source/display size, horizontal overflow, hash-route lifecycle stability, non-accredited diagnostic completion and non-persistence, keyboard incomplete-state handling, progressive course/scenario/planner/progress disclosure, fail-closed dashboard access and reduced-motion behavior.
- Full-page browser screenshots/report were preserved as CI artifact `englishlegalese-browser-qualification`, artifact ID `12102964423`, SHA-256 `a4bc05e9519286a9d900f42a5fff4d91fe2bc4d039a5771f15dd1f843320c0b2`.

## Production-state boundary

These tests qualify the release candidate source and browser behavior in CI. They do **not** by themselves prove the production custom domain is `LIVE_CORRECT`. Final exact-head double qualification, merge, exact Render deployment, `/health`, custom-domain/HTTPS and live rendered public-state checks remain required before that label is used.
