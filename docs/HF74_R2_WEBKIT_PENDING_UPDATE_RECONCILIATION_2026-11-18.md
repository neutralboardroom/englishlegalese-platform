# EnglishLegalese HF74 R2 — tablet WebKit update-state reconciliation

**18 November 2026 · Additive follow-up to HF74 · DRAFT / NOT LIVE.**

Exact first HF74 draft PR #118 source commit `db8fdbddf10d5282b7c9577d755b53ba6231fe79`. Its full 811-file reconstructed archive and Universal Builder V3.4 146-page/32-attachment PDF are preserved as recoverable predecessors; the HF73 baseline remains immutable. Owner standing release rule **EL-RGR-020** is unchanged, with canonical contract `governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md` and all original 19 Roger Rules, ten durable rules, and later successors.

## Actual independent browser finding

Historical HF73 GitHub Actions run `44243198426` completed with one independent job passing and one failing. The failure was in `tests/hf66-mobile-lifecycle.spec.js` under `tablet-webkit`: after 15 seconds the visible Apply Update button did not agree with the browser's *actual* waiting worker plus controlling service worker. That job otherwise reported 1,255 passing tests. This is an observed browser acceptance failure and must not be dismissed or ignored.

## Compatible application fix

- When WebKit delivers `controllerchange` after `register()` resolved, re-evaluate the real `registration.waiting` and `navigator.serviceWorker.controller` state, showing or hiding the pending-update button accordingly.
- On returning to the installer tab (`focus` or visible-page `visibilitychange`), re-evaluate the current actual state, preventing stale UI after backgrounding the page.
- Do **not** automatically post `ENGLISHLEGALESE_APPLY_UPDATE`, call `skipWaiting`, reload, or initiate a network, account, class, enrollment, email or payment side effect. The original explicit Apply Update click alone can send the worker message; the *next* controllerchange reloads this installer page only following that click.
- New eight-step isolated WebKit-state test covers delayed controller, waiting state present/absent, focus and visibility return, zero spontaneous worker messages, and exactly one reload after a user-approved update. It is added to the mandatory inherited source-check chain without removing any predecessor tests.

Only two existing files change in R2: `pwa-install.js`, `package.json`; two additions: `scripts/verify-hf74-r2-webkit-waiting-update.js` and this document. All other HF74 sources including its Thai/Vietnamese/Chinese instructions, privacy-conscious copy and PWA manifest safety remain byte-identical.

## Qualification remains fail-closed

Full independent GitHub CI must be rerun at the exact R2 commit, including the previous tablet-WebKit case and required Chromium/real browser matrices. Physical Android Chrome and iPhone Safari acceptance, four independent Library/Drive recovery copies, direct Git source archive, Render rollback/readiness/health must be verified before the standing conditional automatic deploy rule qualifies. No merging or production deployment based on this draft alone.
