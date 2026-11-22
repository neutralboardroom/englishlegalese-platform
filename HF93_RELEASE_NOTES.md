# EnglishLegalese HF93 R1 — Meaningful mobile professional conversation practice

**Owner:** TR-EnglishLegaleseWebsite, EnglishLegalese.com desktop and mobile host. **Status:** own-lane development candidate, not merged to main, not a deployed native app, no student accounts or payment activation. **Date:** 21 November 2026.

## What is materially better
The HF92 mobile home offered navigation to the Legal English and Business English tools but no immediate, self-contained original speaking activity on that page. HF93 adds a privacy-safe in-browser conversation lab with **six original fictional-adult workplace/legal scenarios** (three Legal, three Business). Each exercise contains natural complete speaker turns, a specific meaning check with three answer choices, supported corrective feedback, a meaningful full-sentence speaking model, and a changed-context transfer question with an optional complete model response. The correct meaning answer gates progression; Stop discards all in-memory selections; Restart reinitializes without persistence. Screen-reader live announcements, keyboard controls and responsive layout added.

**This is reading comprehension plus self-directed oral rehearsal, NOT measured speech performance.** No microphone, AI assistant/clone, natural voice provider, recorded learner speech, browser storage, API calls, PII entry, accounts, payments or protected backend changes. No claim of fluent learning improvement without genuine learner evaluation. Native Capacitor remains prototype-only.

## Exact inherited obligations
- **Roger's Durable Rule RDR-001** full unchanged text: `owner-rules/RDR-001.md`; independent complete source + Universal Builder discovery; meaningful improvement; no version inflation.
- **Roger's Durable Rule RDR-002** full unchanged text: `owner-rules/RDR-002.md`; no dilution, no loss of owner intentions or previous rules, no unauthorized new deployment.
- Existing legal/business navigation and all 22 public resources, 16+16 lesson plans, protected forms, server security and privacy boundaries, PWA fail-closed private-data caching, HF53 production rollback, teacher-led online mission and existing price policy retained unchanged.
- Older source and cumulative Universal Builders remain preserved. HF92 R2 source 920 members remains complete; HF93 intentionally modifies only `learn/app/index.html` and `package.json` of those inherited files. It adds this note, two exact Roger's Rule texts, a JavaScript exercise engine, one static regression verifier and browser tests.

## Verification and deployment distinction
- New static script `node scripts/verify-hf93-mobile.js` checks content, feature wiring, core guards, no private storage or remote-API use, and exact owner rule text presence. Included in the inherited `npm run check` command.
- New `tests/hf93-mobile.spec.js` asserts Legal/Business comprehension correctness, wrong-answer correction, full-sentence rehearsal, model reveal, successful three-case completion, Stop/Restart, responsive layout, no private API/network writes, and keyboard focus, on all inherited Playwright browser projects.
- Existing HF92 mobile 44 static assertions and inherited v1850 follow-through 58-page resource navigation tests are required to remain passing. Full independent GitHub exact-head CI and real-device qualifications must be distinguished from local Chromium injection. Any failed regression or gate means HOLD.
- No automatic merge to `main` unless ALL original EL-RGR-020, RDR-001 and RDR-002 requirements are verified; public production remains HF53 until then.

## Safe fallback and rollback
The complete original HF92 R2 archive and Builder V5.2 R2 remain immutable and independently SHA-verified. For this feature only, restoring `learn/app/index.html` and removing the added `assets/hf93-mobile-conversations.js` reference restores the HF92 mobile home; restoring the exact prior package.json removes the new test hook. For production, retain the original main HF53 git/Render rollback and independent Neon production recovery branch, and do not infer external database backup adequacy from this code-only change.
