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
- later v1.56/v1.58 scripts attempted to remove, rewrite or compact parts of that injected DOM;
- correctness therefore depended on script ordering, observer timing, route lifecycle and the browser receiving/executing the intended release assets.

Even though v1.58 source and live asset URLs contained the newer correction logic, the owner-observed production browser state did not reliably match the qualified candidate. That makes the layering itself an acceptance defect.

## v1.59 corrective strategy
1. Keep the useful v1.55 learning features; do not delete the 21 scenarios, custom roleplay, learning planner or progress record.
2. Add `product-v1590.js` as a hard recovery layer that directly enforces critical public correctness in DOM state rather than relying only on CSS classes.
3. Hide non-featured courses/scenarios, planner details and progress details with the native `hidden` state until the user intentionally expands them.
4. Directly remove the legacy public release panel and public staff role if a predecessor layer reinjects them.
5. Directly normalize public/internal copy and narrow unsupported language claims.
6. Force all public CSS/JS/logo references to new `?v=1.59.0` URLs so a v1.58 asset cannot satisfy a v1.59 request.
7. Preserve the approved logo file bytes; only responsive display sizing changes.
8. Add release-blocking browser tests that reproduce the exact rejected-state failures across desktop, tablet and mobile.
9. Keep backend, persistence, migrations and production-service contracts unchanged.
10. Require two complete exact-head qualification passes before merge, then verify the actual production release separately.

## State discipline
Before deployment: `BUILT` and `QUALIFIED` may become YES; `DEPLOYED` and `LIVE_CORRECT` remain NO.
After deployment: Render live status can establish `DEPLOYED`; only production-browser/content evidence that the rejected state is absent can establish `LIVE_CORRECT`.
