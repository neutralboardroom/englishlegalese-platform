# v1.57.0 Release Test Receipt

**Release:** EnglishLegalese.com v1.57.0  
**Exact predecessor:** `0bcf9419be39cbc8bd9a3603d33fcbc01f428ab0`  
**Qualified functional candidate:** `a6a7c3dd9a4431c7ffa85886bb76c8488a4dd0f9`  
**GitHub Actions Release Gate:** run `39031217556` / SUCCESS

## PASS evidence
- Fresh npm install: PASS — 113 packages installed, 114 audited.
- Dependency audit: PASS — 0 vulnerabilities reported; `npm audit --audit-level=high` passed.
- Inherited v1.55 feature gate: 44/44 PASS.
- Inherited governance/no-drift gate: 31/31 PASS.
- Inherited v1.55.1 security-control gate: 16/16 PASS.
- Inherited v1.56 homepage/screenshot/logo gate: 54/54 PASS.
- v1.57 diagnostic/browser static gate: 35/35 PASS.
- Playwright Chromium browser gate: **18/18 PASS** across desktop, tablet and mobile projects.

## Browser behaviors exercised
- page renders without horizontal overflow at desktop/tablet/mobile test sizes;
- protected EnglishLegalese logo reference remains exact;
- new starting diagnostic is visible and the public start CTA routes to it;
- all eight diagnostic questions can be completed and produce practice guidance;
- diagnostic result remains explicitly non-accredited/no-CEFR/no-TOLES equivalence;
- diagnostic answers are not written to the diagnostic local/session-storage keys;
- incomplete submission is blocked and keyboard Enter behavior works;
- unauthenticated operational-dashboard access fails closed;
- course/scenario progressive disclosure retains deeper content;
- reduced-motion preference remains honored.

## Retained browser evidence
- GitHub artifact: `englishlegalese-browser-qualification`
- Artifact ID: `12100303211`
- Artifact ZIP SHA-256: `4f60781f64962a471af08d64934d42156246584e1a666147650042050f5cd086`
- Artifact contains Playwright report/test evidence including browser screenshots.

## Honest limits / not preclaimed
- Pixel-golden screenshot comparison against an owner-approved committed baseline: **NOT RUN**. Screenshots were captured, but no visual baseline was silently auto-approved.
- Authenticated real-account learner/teacher/employer journeys: **NOT RUN** because production-qualified credentials/accounts are not supplied to this CI gate.
- Account-owned live PostgreSQL/Stripe/OpenAI/SMTP/object-storage/calendar/backup integrations: **NOT RUN** by this receipt.
- Production custom-domain post-deploy correctness: **NOT RUN** by this receipt; must be verified after exact deployment.
- Formal accessibility certification: **NOT CLAIMED**. The browser suite covers specific responsive, keyboard and reduced-motion behaviors, not a complete WCAG audit.

## Final-head requirement
This receipt and the pre-seal receipt create documentation-only commits after the functional candidate. A second full Release Gate run on the exact final branch head is mandatory before merge/deployment.

`RELEASE_TEST_GATE = PASS` for the functional candidate, subject to final exact-head requalification.
