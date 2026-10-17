# EnglishLegalese v1.58.0 — Rule-to-Test Traceability

| Rule | v1.58 evidence / gate |
|---|---|
| EL-RGR-001 Product isolation | `CROSS_PROJECT_RULE_TRANSFER_LEDGER__v1.58.0.md`; verifier rejects backend/sister-project drift. |
| EL-RGR-002 Rule permanence | `CURRENT_RULE_STATE__v1.58.0.json` requires 19/19 Roger Rules and 10/10 durable rules; canonical v1.57 register remains authority. |
| EL-RGR-003 No drift/regression | Exact predecessor diff check; backend/persistence/migrations/logo unchanged; Playwright desktop/tablet/mobile regression. |
| EL-RGR-004 Adopt/adapt/reject with cause | Cross-project and competitor ledgers use explicit dispositions. |
| EL-RGR-005 True newest predecessor | Pre-build receipt and pre-seal currentness check against main commit. |
| EL-RGR-006 Maximum reasonable work | Release combines root-cause correction, canonical source repair, persistent recovery, cache busting, homepage compaction, diagnostic preservation and browser gates. |
| EL-RGR-007 Preserve winners | Verifier asserts Scenario Studio, all 21 scenarios, planner, progress, custom roleplay, SmartTeacher and nav anchors remain. |
| EL-RGR-008 No internal public language | Static verifier + browser assertions reject `New in v1.55`, `Launch course set`, public staff card and old implementation wording. |
| EL-RGR-009 Privacy/data minimization | Diagnostic has no persistence; employer copy preserves private-by-default; custom-roleplay confidentiality warning retained. |
| EL-RGR-010 Truthful state | Diagnostic explicitly non-accredited; release/test/deploy receipts separate BUILT/DEPLOYED/LIVE_CORRECT. |
| EL-RGR-011 AI learning aid only | SmartTeacher and Trust boundary text; verifier asserts legal-advice/certified-translation boundaries. |
| EL-RGR-012 Mobile/accessibility/keyboard | Playwright desktop/tablet/mobile; incomplete diagnostic keyboard test; responsive overflow; reduced-motion; touch controls. |
| EL-RGR-013 Whole-product improvement | Screenshot root-cause audit covers homepage, learning, teacher/employer, account access, privacy, release behavior. |
| EL-RGR-014 Fresh research | `RESEARCH_AND_COMPETITOR_ADOPTION_LEDGER__v1.58.0.md`. |
| EL-RGR-015 Exact state truth | Release receipt + Render deploy receipt + postdeploy verification required. |
| EL-RGR-016 Prior NVIL active | Pre-build receipt records prior list review; current list dispositions carried into v1.58 next list. |
| EL-RGR-017 Two-point currentness | Pre-build currentness plus mandatory immediately-pre-seal main/rule check. |
| EL-RGR-018 Qualified auto-deploy | Deployment only after two successful release-gate passes; exact deploy ID/commit/live result recorded. |
| EL-RGR-019 Logo lock | Git blob SHA must equal `b5f20ef046d75d6f108bc93243c7c14acf3c4eb1`; browser verifies exact source path and usable display size. |
| EL-DUR-001..010 | Current state, receipts, traceability, exact predecessor diff, recovery path, browser behavior checks, no-count-only assertions, and additive recovery architecture collectively enforce durable rule custody/successorship. |

## Double-check requirement
The owner explicitly required the completed release to be checked twice before deployment. v1.58.0 therefore requires two successful release-gate executions against the exact final head (or a second exact-head equivalent qualification) before merge/deploy. Any intervening commit invalidates the previous exact-head pass and restarts the two-pass requirement.
