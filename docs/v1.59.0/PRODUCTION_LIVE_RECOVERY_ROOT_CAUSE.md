# EnglishLegalese.com v1.59.0 — Production Live-Recovery Root Cause

Date: 2026-10-18
Accepted predecessor: v1.58.0 main commit `2e39c83559d21b9b3b65f34b23b7605e23417b9f`

## Owner-observed failure
After v1.56, v1.57 and v1.58 deployments, Roger's actual desktop and mobile production screenshots continued to show material portions of the rejected long/old public presentation: release/internal labels, a public staff role, old translation copy, old course labels, the full Scenario Studio, expanded planner/progress surfaces, undersized header logo presentation, and other items that the release candidate was intended to correct.

Under EL-RGR-015, a successful build, CI run, merge, Render deployment, health response or static asset fetch does not establish `LIVE_CORRECT`. Roger's screenshots therefore overrode the earlier optimistic acceptance language.

## Evidence correction
An initial connector `fetch_file` result displayed `product-v1550.js` with empty `content`. That was misleading. The reported Git blob SHA `1d7a579cebecba2f569b65622e4702301695d8c0`, an exact predecessor read, and a fresh live URL extraction all contain the full v1.55 Scenario Studio / Learning Path / Skills Passport implementation. v1.59 MUST NOT preserve the false claim that this file was actually empty.

## Confirmed architectural weakness
The public page had accumulated multiple client-side layers:
- canonical `app.js` rendered the base homepage;
- `product-v1550.js` persistently injected Scenario Studio, Learning Path, Skills Passport and legacy public presentation;
- v1.56 and v1.58 presentation scripts attempted to remove, rewrite or compact parts of that injected DOM;
- v1.58 itself kept a persistent MutationObserver that re-applied its own presentation state after DOM mutations;
- correctness therefore depended on script ordering, observer timing, route lifecycle, competing state variables and the browser receiving/executing the intended release assets.

This conflict was reproduced by the v1.59 release gate. Initial v1.59 tests correctly failed because predecessor display rules could override native `hidden` state. After that was hardened, a second test pass still failed because the predecessor v1.58 runtime observer immediately re-compacted scenarios/planner/progress after v1.59 controls attempted to expand them. This was direct evidence that multiple active presentation controllers were unsafe.

Even though v1.58 source and live asset URLs contained newer correction logic, the owner-observed production browser state did not reliably match the qualified candidate. That makes the layering itself an acceptance defect.

## v1.59 corrective strategy
1. Keep the useful v1.55 learning engine; do not delete the 21 scenarios, custom roleplay, learning planner or progress record.
2. Keep `product-v1550.js`, `product-v1550-research.js`, navigation preservation, and fail-closed dashboard access active.
3. Retire v1.56, v1.57 and v1.58 **presentation JavaScript from runtime loading** in `index.html`. Their source files remain preserved in the repository for history/no-loss evidence; v1.57's diagnostic is already canonical in `app.js`.
4. Make `product-v1590.js` the single active successor presentation controller for the corrective homepage state.
5. Enforce critical public correctness directly in DOM state rather than relying only on predecessor CSS classes.
6. Hide non-featured courses/scenarios, the diagnostic question body, planner details and progress details with native `hidden` state until intentionally expanded.
7. Add `[hidden]{display:none!important}` plus explicit successor overrides for retained predecessor CSS selectors that would otherwise keep planner/progress content hidden after expansion.
8. Directly remove the legacy public release panel and public staff role if any predecessor injection recreates them.
9. Directly normalize public/internal copy and narrow unsupported language claims.
10. Force all active public assets to new `?v=1.59.0` URLs so a v1.58 asset cannot satisfy a v1.59 request.
11. Preserve approved logo bytes and alter only responsive display sizing.
12. Run release-blocking desktop/tablet/mobile browser tests for the exact rejected-state failures.
13. After merge, automatically wait for Render to publish the exact v1.59 runtime and then run a **separate production Playwright acceptance suite** directly against `englishlegalese.com` and `www.englishlegalese.com`, saving production screenshots/traces.
14. Keep backend, persistence, migrations and production-service contracts unchanged.
15. Require two complete exact-head qualification passes before merge. Production acceptance remains separate and mandatory afterward.

## Qualification evidence during repair
- Early v1.59 gates failed rather than being bypassed. They exposed predecessor visibility conflicts and mobile-length issues.
- A later gate exposed active v1.58 runtime interference with v1.59 expansion controls.
- After retiring the conflicting predecessor presentation scripts, predeploy release gate `39060167781` succeeded on candidate head `932eb8b5f5d88928a03b5be44a97545dc07bbad7`, with 0 dependency vulnerabilities and all 27 predeploy desktop/tablet/mobile browser tests passing.
- This successful candidate run is functional evidence only; final seal documentation changes the branch head, so two new exact-final-head qualification passes are still required before merge.

## State discipline
Before deployment: `BUILT` and `QUALIFIED` may become YES; `DEPLOYED` and `LIVE_CORRECT` remain NO.
After deployment: Render live status can establish `DEPLOYED`; only the postdeploy production-browser/content evidence showing the rejected state is absent can establish `LIVE_CORRECT`.
