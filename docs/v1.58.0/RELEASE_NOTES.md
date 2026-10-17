# EnglishLegalese.com v1.58.0 — Production Homepage Drift Recovery

## Why this release exists

Roger's live `englishlegalese.com/#teachers` screenshots proved that repository/deployment existence did not guarantee the newest public corrections remained in the live DOM. Source review found a real lifecycle defect: ordinary hash navigation could rebuild `#app` from older canonical markup after the v1.56/v1.57 one-shot correction layers had stopped observing, while the persistent v1.55 feature layer re-injected its content. The result could visibly resemble the older v1.55 experience after normal navigation.

## What changed

- Critical public homepage correctness is now canonical in `app.js`.
- Ordinary in-page hash navigation no longer destroys/rebuilds an already mounted homepage.
- New persistent `product-v1580.js` re-applies idempotent public corrections after legitimate DOM replacement.
- Public CSS/JS assets use `?v=1.58.0` release cache tokens.
- Public `New in v1.55`, `Launch course set`, staff-card and builder-language leakage are removed from canonical public presentation.
- Homepage density is reduced through progressive disclosure while preserving all 21 existing scenarios, custom roleplay, four-week planning and learner progress functionality.
- The original eight-question starting diagnostic is canonical, explicitly non-accredited, and answer data is not persisted.
- Empty learner progress now shows a useful truthful starting state before detailed zero-value panels.
- Teacher/employer public copy is narrowed to appropriate public benefits; operational dashboards remain account-gated/fail-closed.
- Employer progress sharing remains learner-controlled and private learner content remains excluded by default.
- The approved EnglishLegalese logo asset is unchanged and permanently locked; display sizing is improved responsively without crop, recolor, redraw or asset replacement.
- Header offsets, reduced-motion behavior, accessible labels and responsive browser coverage are preserved/strengthened.

## Root-cause / acceptance evidence

See:
- `docs/v1.58.0/PRODUCTION_DRIFT_ROOT_CAUSE_AND_SCREENSHOT_DISPOSITION.md`
- `docs/v1.58.0/PRE_BUILD_RULE_LOCK_RECEIPT.md`
- `docs/v1.58.0/PRE_SEAL_RULE_LOCK_RECEIPT.md`
- `docs/v1.58.0/RELEASE_TEST_RECEIPT.md`
- `docs/v1.58.0/NO_DRIFT_NO_REGRESSION_RECEIPT.md`
- `governance/CURRENT_RULE_STATE__v1.58.0.json`
- `governance/RULE_TO_TEST_TRACEABILITY__v1.58.0.md`
- `governance/RESEARCH_AND_COMPETITOR_ADOPTION_LEDGER__v1.58.0.md`
- `NEXT_VERSION_IMPROVEMENT_LIST.md`

## State truth

Source/browser qualification does not equal production correctness. Under EL-RGR-015 and EL-RGR-018, v1.58.0 must pass the complete final-head gate twice, merge, deploy the exact merged commit, and pass actual production-domain verification before it is labeled `LIVE_CORRECT`.
