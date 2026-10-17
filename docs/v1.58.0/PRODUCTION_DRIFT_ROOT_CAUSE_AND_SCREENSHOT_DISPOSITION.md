# EnglishLegalese v1.58.0 — Production Drift Root Cause + Screenshot Disposition

## Root cause confirmed from source and owner screenshots

The production browser screenshots were not merely stale-looking; they exposed a real lifecycle defect.

1. `app.js` owns hash routing and calls `home()` on ordinary in-page hashes such as `#teachers`, `#courses`, `#smartteacher`, and `#language-bridge`.
2. `home()` replaces the entire `#app` subtree with the old core v1.54-era markup.
3. The v1.55 layer has a persistent `MutationObserver`, so its Scenario Studio / Learning Path / Skills Passport features are re-injected after each core replacement.
4. The v1.56 correction layer did **not** remain persistent. Its startup observer disconnected immediately after the first successful `apply()`.
5. The v1.57 diagnostic layer likewise stopped observing after its first successful application.
6. Therefore, after a hash navigation rebuilt `#app`, v1.55 content returned but v1.56/v1.57 public corrections were not guaranteed to return. This is why owner screenshots at `/#teachers` showed the old long page, public `New in v1.55`, `Launch course set`, internal translation wording, EnglishLegalese Team/staff pathways, old teacher/employer operational copy, and the wall-of-zero progress presentation.
7. Public static asset URLs also had no release query token, leaving browser/intermediary cache ambiguity during rapid corrective releases.

**Conclusion:** v1.56/v1.57 code could exist in the repository and still fail to remain authoritative in the live DOM after normal navigation. A deploy receipt alone therefore could not prove `LIVE_CORRECT`.

## v1.58.0 corrective architecture

- Critical public correctness is moved into canonical `app.js`; public cleanup is no longer dependent solely on a one-shot post-render patch.
- Ordinary in-page hashes no longer destroy/rebuild the homepage once the home surface is mounted.
- `product-v1580.js` remains persistently attached to `#app` and re-applies idempotent corrective presentation rules after any legitimate subtree replacement.
- Public CSS/JS URLs use `?v=1.58.0` cache-busting tokens.
- Deep v1.55 functionality is preserved but progressively disclosed.
- Operational account/dashboard routes remain fail-closed.
- The exact approved logo asset remains byte-locked; only aspect-ratio-safe display sizing changes.

## Owner screenshot / inherited 92-item audit disposition

The complete v1.56 92-item screenshot audit remains active evidence. v1.58.0 does not silently discard any item. The following items are specifically re-opened because the owner's live screenshots proved their earlier runtime acceptance was false or unstable:

1. **Shorten homepage substantially** — `REIMPLEMENTED DURABLY`: course/scenario deep content and learning-plan/progress detail are collapsed by default; underlying functionality is retained.
2. **Remove public release/developer language** — `REIMPLEMENTED DURABLY`: canonical app copy contains no public `New in v1.55` or `Launch course set`; persistent recovery removes those strings if an inherited layer reintroduces them.
3. **Remove internal staff pathways** — `REIMPLEMENTED DURABLY`: public EnglishLegalese Team card is absent from canonical homepage; staff dashboards remain account-gated.
4. **Remove public teacher operational details** — `REIMPLEMENTED DURABLY`: canonical public copy focuses on teaching/feedback rather than payout/internal operations.
5. **Sticky-header overlap** — `PRESERVED/STRENGTHENED`: responsive `scroll-padding-top` and `scroll-margin-top` remain.
6. **Header logo visibility** — `STRENGTHENED`: exact locked asset is displayed larger with `height:auto` and `object-fit:contain`; bytes unchanged.
8. **Excessive vertical space** — `REIMPLEMENTED`: tighter section rhythm plus progressive disclosure.
10. **Hero right-card balance** — `PRESERVED/STRENGTHENED` through flex centering and responsive sizing.
11. **Hero CTA hierarchy** — `STRENGTHENED`: diagnostic/SmartTeacher primary actions; courses/scenario actions use quieter styling.
12/80. **Diagnostic truth and availability** — `STRENGTHENED`: original eight-question, non-accredited, non-persistent diagnostic is canonical on the homepage.
14. **100+ language claim** — `REIMPLEMENTED DURABLY`: narrowed to major-language learning support.
15/16. **Internal translation / Safety line wording** — `REIMPLEMENTED DURABLY`: user-facing preferred-language explanation and `Important:` language.
17. **Disclaimer repetition** — `IMPROVED`: keep essential boundary statements while removing avoidable implementation wording.
18/79/81. **Progress proof / Skills Passport credential ambiguity / roadmap language** — `REIMPLEMENTED`: public framing is `Legal Skills Progress`, learner-controlled, non-accredited, with no future-assessment roadmap claim.
21. **Form controls** — `PRESERVED/STRENGTHENED`: consistent accessible styling and touch size.
22/23/24. **Course catalog / launch terminology / internal descriptions** — `REIMPLEMENTED`: featured-first presentation, all courses still available.
26/27/29/30/36. **Scenario Studio homepage use / all scenarios / filtering / scanning / custom roleplay** — `PRESERVED + REIMPLEMENTED`: six featured scenarios first, full set and custom roleplay remain discoverable.
32/33/34/35/87. **SmartTeacher entry / speaking wording / teacher boundary / feedback state distinction / textarea experience** — `PRESERVED/STRENGTHENED`: guided starters, text-guided conversation wording, explicit teacher/account boundary, and no false speech-scoring claim.
37. **Learning Path interface** — `REIMPLEMENTED`: builder collapsed until requested.
39/40/41/42/43/44/45/46/88. **Progress empty state / truth / sharing / privacy** — `REIMPLEMENTED`: useful empty state before details; zeros remain truthful; private content excluded; snapshot learner-controlled.
47/48/49/85/86. **Teacher/employer public claims and dashboard access** — `REIMPLEMENTED`: public benefit copy narrowed; operational dashboards fail closed.
50/54/55/56/57. **Homepage architecture/footer/deep destinations** — `PARTIAL/STRENGTHENED`: density reduced without deleting useful anchors; separate physical pages remain future work after stable visual-equivalence history.
59/60/62/76/91. **Desktop/tablet/mobile browser and final screenshot qualification** — `ACTIVE RELEASE BLOCKER`: Playwright runs across desktop/tablet/mobile and captures full-page evidence; owner live screenshots remain final postdeploy comparison evidence.
61. **Public-content regression checks** — `STRENGTHENED`: v1.58 verifier tests canonical source, cache-busting, persistent recovery and prohibited public strings.
63. **Empty/error/loading states** — `PARTIAL/STRENGTHENED`: diagnostic, progress and account-access states covered; whole-product async audit remains future work.
64. **Preserve working features** — `PRESERVED`: v1.55 Scenario Studio, Learning Path and progress state remain; no backend/persistence/migration deletion.
65/66/90. **Custom-domain/HTTPS/apex/www** — `POSTDEPLOY RELEASE ACCEPTANCE`: verify actual production domain after exact deploy before `LIVE_CORRECT`.
67. **Render `/health` service check** — `CARRY FORWARD`: app endpoint exists; service-level configured health path depends on management capability.
68. **Reproducible lockfile/npm ci** — `CARRY FORWARD`: do not invent lockfile proof; current high/critical audit remains blocking.
69. **High/critical vulnerability blocker** — `PRESERVED` in release workflow.
70. **Qualified automatic deploy** — `PRESERVED`: deploy only after two successful qualification passes/currentness check.
71/72/73/74. **Fresh research / competitor breadth / dispositions / whole-product research** — `COMPLETED` for v1.58.0 in current research ledger.
75. **No product/rule drift** — `ACTIVE RELEASE BLOCKER`.
77. **Active navigation state** — `STRENGTHENED`: persistent active-section calculation survives ordinary in-page navigation.
78. **Level system** — `PRESERVED`: Foundation / Professional / Advanced vocabulary remains.
82. **Scenario button context** — `PRESERVED`: scenario-specific accessible names.
83. **AI terminology** — `PARTIAL`: learner-facing labels clarified without erasing useful course distinctions.
84. **Oversized mid-page headings** — `PRESERVED/STRENGTHENED`: responsive scale constrained.
89. **Contextual deep links** — `PRESERVED`: all existing anchors remain usable.
92. **Permanent logo lock** — `PRESERVED AS RELEASE BLOCKER`: exact blob SHA must remain `b5f20ef046d75d6f108bc93243c7c14acf3c4eb1`.

## Items not repeated above
All inherited audit items not individually re-opened above retain their v1.56 disposition **only to the extent v1.58 browser/live verification proves the behavior still exists**. No inherited `VERIFY_AFTER_DEPLOY` item is upgraded to PASS merely because code exists.

## Acceptance rule
v1.58.0 may be called `BUILT` only after exact-head qualification. It may be called `DEPLOYED` only with an exact Render deploy result. It may be called `LIVE_CORRECT` only after the production `englishlegalese.com` experience is externally verified and compared against the owner's screenshot concerns.
