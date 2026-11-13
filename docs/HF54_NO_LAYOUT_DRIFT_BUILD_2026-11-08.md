# EnglishLegalese HF54 — adult mediation speaking rounds (DRAFT / NOT DEPLOYED)

Date: 2026-11-08. Project: **EnglishLegalese only**.
Authoritative starting point: GitHub main HF53 `05da0352355dbc3fd6eb8b472c49289d594a8e6e`.
Instruction source: uploaded audited coordinated PDF Builder V1.6 (61 pages). Embedded V1.4 archive SHA-256 `f6839c4885521c2290c16337b012dbaf8ed207a1d2c01a8376bf3ebc3f03a01f`; ZIP CRC and nested V1.3 SHA `a010bdc78b21d836d72cba28b59c4990dca4618187fa560a597eb9275ea984e3` checked.

## Mission and change
Preserve the independent adult Legal English and Business English platform. Add one optional, offline, fictional 4-turn meaning-repair and peer-mediation dialogue to each of the 24 continuing-practice lessons:
1. Report a verifiable fact in a complete sentence;
2. Ask an open clarification question;
3. Repair an unsupported conclusion;
4. Verify and qualify the summary.

Learners can practice two roles independently or with a partner. The activity uses original existing per-topic evidence, model, question and caution strings. It has no microphone, score, AI inference, database writes, account calls, private drafts, tracking or external API. It does not imply a booked session, a teacher assessment, a legal opinion or a certificate.

## Specific change footprint
- Added `product-v2150-mediation-turns.js`: optional closed accordion created only inside already-collapsed `details.v2100-more-tools`.
- Added `tests/hf54-mediation.spec.js`: exercises all four stages, role navigation, zero outbound writes and responsive horizontal bounds across both existing pages.
- Added `scripts/verify-hf54-mediation.js`: checks 24 original cases, original scripts/lesson counts, no new styles, no sensitive APIs.
- Added one script import to each of `learn/continuing-practice/index.html` and `learn/continuing-practice/advanced/index.html`. Nothing else in those pages was intentionally modified.
- Extended the existing `package.json` check script to run the new static checker; previous checks remain.
- No `index.html`, homepage image, other public page, logo, global CSS, pricing, enrollment, API, DB, payment, email, or sister-project changes.

## Current research disposition
**ADAPT** Council of Europe CEFR Companion Volume interaction/mediation: https://www.coe.int/en/web/common-european-framework-reference-languages/mediation-in-the-classroom (accessed 2026-11-08). Turn-taking and co-construction are adapted into short fictional adult speaking practice; no CEFR level or accreditation claimed.
**ADOPT** W3C WCAG 2.2 focus-visibility and keyboard operation principles: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/ (accessed 2026-11-08). Native summary/button elements and focusable controls retained; cross-browser visual acceptance pending.
**DEFER** any voice/avatar/AI connection, real-time scoring or recording until privacy/consent and runtime authorization are verified. Unit cost: no new vendor or per-learner API cost for this static feature; only existing hosting, testing and maintenance.

## Acceptance and release state
- Built on isolated `feature/hf54-adult-mediation-no-layout-drift-20261108`; production `main` remains unchanged by HF54.
- Required before merge: `npm run check`, full Playwright browser suite in Chromium and WebKit with desktop/tablet/mobile screenshots, two independent exact-head CI receipts, manual layout comparison and unchanged protected homepage/photo checks.
- Required before production claim: authorized Render workspace, exact main/Render live SHA match for both hosts, rollback receipt.
- Existing PR #86 (certification), #83 (older class planner) and #66 (transactional governance) remain unmerged and review-only. No automatic merge.
- Integration: TR-Clone and TR-ControlCenter still unverified live; no child student or private employer data transmitted.
- Release status at creation: **SOURCE_READY candidate only**. Build files are authored; tests and deployments are NOT claimed until independent receipts exist.
