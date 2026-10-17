# EnglishLegalese v1.56.0 — Full Homepage Screenshot Audit Disposition

**Source:** complete owner-provided homepage screenshot set, reviewed twice before implementation.  
**Purpose:** prove that every identified item was dispositioned. Silence is not acceptance.  
**Statuses:** `IMPLEMENTED`, `PARTIAL`, `DEFER_WITH_REASON`, `VERIFY_AFTER_DEPLOY`, `PRESERVED`.

1. **Shorten homepage substantially** — `IMPLEMENTED`: courses and Scenario Studio now show featured subsets by default; Learning Path and progress details use progressive disclosure instead of occupying full page height.
2. **Remove public release/developer language** — `IMPLEMENTED`: public runtime copy rewrites version/launch wording such as “New in v1.55” and “Launch course set.”
3. **Remove internal staff pathways from public audience selector** — `IMPLEMENTED`: EnglishLegalese Team public card removed.
4. **Remove public teacher operational details** — `IMPLEMENTED`: payout/operations-heavy card copy replaced with learner-facing teacher-support language.
5. **Fix sticky-header overlap** — `IMPLEMENTED`: global scroll-padding and per-section scroll-margin tied to responsive header offset.
6. **Increase header-logo visibility** — `IMPLEMENTED`: display-only responsive sizing; underlying logo asset unchanged and now permanently locked under EL-RGR-019.
7. **Preserve overall visual system** — `PRESERVED`: existing serif/navy/teal/gold/bright-card language remains; changes are additive and restrained.
8. **Reduce excessive empty vertical space** — `IMPLEMENTED`: reduced section/hero padding and collapsed deep-content areas by default.
9. **Improve section rhythm and spacing consistency** — `IMPLEMENTED`: shared section-control spacing, tighter section rhythm and responsive rules added.
10. **Improve hero right-hand card balance** — `IMPLEMENTED`: card now centers content and reduces internal dead space without changing artwork.
11. **Simplify hero CTA hierarchy** — `IMPLEMENTED`: primary CTA remains strongest; lower-priority actions receive quieter treatment while preserving access.
12. **Verify free diagnostic is genuinely available/functionally represented** — `PARTIAL`: wording now truthfully frames it as a starting diagnostic, not formal certification; end-to-end production assessment validation remains a future integration task.
13. **Verify every visible capability claim** — `PARTIAL`: unsupported/operationally sensitive wording was reduced; production integrations still require exact live evidence before stronger claims are allowed.
14. **Verify “100+ major-language learning bridge” claim** — `IMPLEMENTED`: public claim narrowed to “Major-language learning bridge” until broader coverage is proven.
15. **Replace internal translation language** — `IMPLEMENTED`: builder-instruction wording replaced with user-facing explanation.
16. **Replace “Safety line:”** — `IMPLEMENTED`: replaced with natural “Important:” wording.
17. **Reduce disclaimer repetition** — `PARTIAL`: major repetition was reduced/reframed while Trust Center and footer protections remain; further consolidation can follow browser review.
18. **Review “prove progress/progress proof”** — `IMPLEMENTED`: changed to “track progress” / “shareable progress” wording.
19. **Keep Trust Center/privacy boundaries** — `PRESERVED`.
20. **Rework Four-Skills Academy presentation** — `PARTIAL`: copy shortened/clarified; full four-card concept preserved because it remains a core differentiator. Dedicated skills destination remains future work.
21. **Style native form controls consistently** — `IMPLEMENTED`: accessible visual treatment and 44px minimum control size added.
22. **Reconsider complete course catalog on homepage** — `IMPLEMENTED`: six featured cards by default with explicit “View all” expansion.
23. **Remove “Launch Course Set” terminology** — `IMPLEMENTED`.
24. **Rewrite course descriptions that sound internal** — `PARTIAL`: diagnostic/internal requirement language is rewritten; remaining course wording is retained where it describes user-facing curriculum value.
25. **Preserve strong course categories** — `PRESERVED`.
26. **Rework Scenario Studio for homepage use** — `IMPLEMENTED`: six featured scenarios by default with explicit all-scenarios expansion.
27. **Keep all scenarios available** — `PRESERVED`: all 21 scenarios remain.
28. **Preserve Foundation/Professional/Advanced progression** — `PRESERVED`.
29. **Preserve practice-area filtering** — `PRESERVED`.
30. **Improve Scenario Studio card scanning** — `PARTIAL`: reduced initial card count and added scenario-specific accessible button names; deeper metadata redesign deferred to avoid churn.
31. **Keep synthetic-content labeling and safety boundaries** — `PRESERVED`.
32. **Improve SmartTeacher entry experience** — `IMPLEMENTED`: four original guided starters added while free-form practice remains.
33. **Clarify “Practice speaking”** — `IMPLEMENTED`: public action is reframed as conversation practice rather than implying unproven speech analytics.
34. **Clarify “Ask teacher”** — `PARTIAL`: teacher-review boundaries remain, but fully authenticated teacher availability/routing is deferred until production account readiness is proven.
35. **Separate AI feedback, learner self-checks, teacher feedback** — `IMPLEMENTED/PRESERVED`: self-check and teacher-confirmed states remain explicitly distinct; no accredited score is invented.
36. **Preserve custom roleplay** — `PRESERVED` and surfaced with a dedicated “Create your own roleplay” action.
37. **Improve Personalized Learning Path interface** — `IMPLEMENTED`: planner is compact by default and expands on intent/hash access.
38. **Authenticated cross-device persistence** — `DEFER_WITH_REASON`: requires production-qualified auth/data-retention/export/delete architecture; local-device behavior preserved now.
39. **Improve Skills Passport empty state** — `IMPLEMENTED`: new first-practice empty state explains what to do next and avoids a wall of zeros by default.
40. **Give new users a clear progress next action** — `IMPLEMENTED`: direct Start a scenario action.
41. **Keep zero values truthful** — `PRESERVED`; no fake progress added.
42. **Replace repeated “Not self-rated” UX** — `PARTIAL`: empty detail wall is collapsed by default; detailed self-rating labels remain truthful when opened.
43. **Keep recent next-focus notes** — `PRESERVED`.
44. **Employer-safe progress sharing with explicit consent** — `IMPLEMENTED`: share action relabeled and explicit “nothing is shared automatically” note added.
45. **Keep private drafts/raw AI/uploads/etc excluded by default** — `PRESERVED` and reinforced in employer copy.
46. **Review employer-safe snapshot placement** — `IMPLEMENTED`: details are behind progress disclosure rather than immediately dominating the public page.
47. **Keep Teacher section but reduce implementation detail** — `IMPLEMENTED`.
48. **Keep Employer section but emphasize outcomes/privacy** — `IMPLEMENTED`.
49. **Require appropriate authenticated role for teacher/employer dashboards** — `IMPLEMENTED FAIL-CLOSED`: dashboard hashes are intercepted by a production-readiness guard; operational dashboards are not publicly exposed when auth/persistence are not production-qualified.
50. **Review Learning Experience section redundancy** — `PARTIAL`: v1.54.8 public rewrite remains; deeper consolidation deferred until browser-equivalence evidence exists.
51. **Keep clean checkmark expectation presentation** — `PRESERVED`.
52. **Keep privacy-conscious claim truthful** — `PRESERVED WITH CAUTION`: only architecture-supported boundaries are stated; live integration claims remain evidence-gated.
53. **Keep Trust Center** — `PRESERVED`.
54. **Reduce duplicate footer boundary language** — `PARTIAL`: footer remains as an important legal/education boundary; duplicate body language was reduced first.
55. **Review footer density/balance** — `PRESERVED/PARTIAL`: no risky footer restructuring in this release; homepage shortening reduces overall fatigue.
56. **Improve homepage information architecture** — `IMPLEMENTED`: overview/featured-first flow and progressive disclosure applied without removing existing anchors.
57. **Create dedicated destinations rather than delete content** — `DEFER_WITH_REASON`: this release uses focused hash destinations + progressive disclosure to preserve exact behavior; separate physical pages require browser-equivalence routing work and are carried forward.
58. **Keep navigation changes deliberate** — `PRESERVED`: primary structure remains; active-state behavior improved without arbitrary link churn.
59. **Test complete homepage mobile/tablet/laptop** — `VERIFY_AFTER_DEPLOY`: CSS breakpoints added; automated/static gates run predeploy, and live viewport verification is required before LIVE_CORRECT.
60. **Add browser-level visual/interaction tests** — `DEFER_WITH_REASON`: repository currently lacks a browser automation dependency; this is retained as a high-priority next improvement rather than inventing a false test result.
61. **Add public-content regression checks** — `IMPLEMENTED`: v1.56 verifier checks user-facing rewrite controls and internal-language suppression logic.
62. **Test every CTA end-to-end** — `PARTIAL/VERIFY_AFTER_DEPLOY`: static targets/access controls checked; production external integrations require live credentials/evidence.
63. **Improve empty/error/loading states** — `PARTIAL`: Skills Progress and dashboard access now have explicit safe empty/block states; whole-product async-state audit continues.
64. **Preserve original working features during simplification** — `PRESERVED`: no underlying course/scenario/planner/progress data deleted; backend/persistence/migrations unchanged.
65. **Add deployment-level custom-domain smoke testing** — `VERIFY_AFTER_DEPLOY`: apex, www, Render URL and /health are required postdeploy checks.
66. **Verify HTTPS/certificate for apex and www** — `VERIFY_AFTER_DEPLOY`.
67. **Add real Render health-check path** — `PARTIAL`: application already has `/health`; Render service configuration still needs healthCheckPath to be set when the available management surface permits it.
68. **Make dependency installs reproducible with lockfile/npm ci** — `DEFER_WITH_REASON`: requires deliberate lockfile generation/validation against Render; high/critical audit remains blocking now.
69. **Keep high/critical vulnerability blocker** — `PRESERVED`.
70. **Preserve automatic deployment but fail closed** — `PRESERVED`: EL-RGR-018 remains active; two-pass qualification required for this release.
71. **Fresh competitor research every material version** — `IMPLEMENTED`: fresh 2026 EF/Preply/current competitor review recorded for v1.56.0.
72. **Benchmark multiple competitor categories** — `IMPLEMENTED`: specialists, AI tutors, corporate learning and adjacent patterns retained in research framework.
73. **Record adopt/adapt/defer/reject decisions** — `IMPLEMENTED` in v1.56.0 research ledger.
74. **Continue whole-product research** — `IMPLEMENTED/PRESERVED`: screenshot audit plus UX/accessibility/privacy/security/release review conducted.
75. **Maintain absolute no-product-drift and no-rule-drift** — `PRESERVED`: governance checks retained and expanded for v1.56.0/logo lock.
76. **Final visual before/after comparison against screenshot set** — `VERIFY_AFTER_DEPLOY`: screenshot checklist is the acceptance baseline; live render must be compared before LIVE_CORRECT.
77. **Fix incorrect active navigation state while scrolling** — `IMPLEMENTED`: active link now follows the section at the header marker rather than leaving Start permanently selected.
78. **Resolve inconsistent level system** — `IMPLEMENTED`: course labels map to Foundation / Professional / Advanced vocabulary where applicable; scenario levels preserved.
79. **Clarify Legal Skills Passport credential status** — `IMPLEMENTED`: public name changed to Legal Skills Progress; explicit non-accredited wording added.
80. **Clarify diagnostic credential status** — `IMPLEMENTED`: starting-point guidance only; no accredited proficiency/certification claim.
81. **Remove “future teacher-confirmed assessment” roadmap language** — `IMPLEMENTED`.
82. **Give repeated “Open practice” buttons accessible context** — `IMPLEMENTED`: scenario title included in aria-label.
83. **Standardize AI terminology** — `PARTIAL`: SmartTeacher, AI draft review and AI-output review are clarified; historic course names remain where pedagogically meaningful.
84. **Reduce oversized mid-page headings** — `IMPLEMENTED`: responsive heading scale reduced while preserving approved typographic character.
85. **Verify teacher/employer capability claims** — `PARTIAL`: public wording narrowed; unverified operational dashboards fail closed.
86. **Remove implementation vocabulary from public copy** — `IMPLEMENTED/PARTIAL`: Translation Bridge flags, closeout/system language removed from key public teacher/employer surfaces; legacy deep dashboard content is access-gated.
87. **Fix unfinished SmartTeacher textarea experience** — `IMPLEMENTED`: guided starters added above free-form textarea.
88. **Fix new-user empty state** — `IMPLEMENTED` in Legal Skills Progress.
89. **Use contextual deep links rather than deleting functionality** — `IMPLEMENTED`: existing anchors retained, progressive disclosure provides focused access; separate physical pages deferred under item 57.
90. **Verify www custom domain** — `VERIFY_AFTER_DEPLOY`: required before LIVE_CORRECT; no assumption based only on apex success.
91. **Compare final live release to complete screenshot set** — `VERIFY_AFTER_DEPLOY`: mandatory second-stage acceptance step.
92. **Permanent logo lock with correct sizing** — `IMPLEMENTED`: EL-RGR-019 protects exact logo blob SHA; only responsive display sizing/aspect-ratio-safe layout changes are allowed without explicit owner unlock.

## Summary
- Every screenshot-derived item has an explicit disposition.
- No item is silently dropped.
- Deferred items are deferred for concrete dependency/evidence reasons, not convenience.
- `DEPLOYED` and `LIVE_CORRECT` remain separate; items marked `VERIFY_AFTER_DEPLOY` must pass before the latter state is claimed.
