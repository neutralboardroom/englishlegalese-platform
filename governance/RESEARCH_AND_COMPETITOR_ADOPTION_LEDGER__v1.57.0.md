# v1.57.0 Fresh Research + Competitor Adoption Ledger

**Research date:** 2026-10-17  
**Scope:** Legal-English assessment boundaries, learner diagnostics, professional-language progress, spaced review, and browser visual/accessibility qualification.  
**Method:** Fresh ordinary web research only; no Firecrawl credits used.

## Sources reviewed
- TOLES official exam pages and candidate guidance — https://toleslegal.com/our-exams/ and https://toleslegal.com/for-exam-candidates/
- Preply placement test guidance (updated 2026) — https://help.preply.com/en/articles/6655082-preply-placement-tests-assess-your-language-skills-track-your-progress-and-achieve-your-goals
- Preply Business corporate training/progress — https://preply.com/en/business-language-training
- EF Corporate Learning assessments — https://corporatelearning.ef.com/en/solutions/assessments/
- EF Corporate Learning platform/method — https://corporatelearning.ef.com/en/
- Playwright visual comparisons — https://playwright.dev/docs/test-snapshots
- Playwright ARIA snapshots — https://playwright.dev/docs/aria-snapshots

## Findings and dispositions

### 1. Formal standardized assessment must remain distinct from EnglishLegalese practice guidance
**Finding:** TOLES offers formal named exam levels/certification. Preply maps placement-test results to CEFR. EF offers standardized, certifiable, CEFR-aligned assessments.

**Disposition: REJECT_WITH_CAUSE** any implication that an original EnglishLegalese diagnostic creates a CEFR, TOLES, accredited, licensing, academic, or employment-equivalent score. EnglishLegalese has not validated such an equivalence.

### 2. A short needs/starting diagnostic can improve the first learning decision
**Finding:** Current language-training products use starting assessment/needs analysis to recommend training and make progress easier to interpret.

**Disposition: ADAPT.** v1.57.0 adds an original eight-item Legal English communication diagnostic that recommends a practice path. It is explicitly non-accredited, requires no account, stores no answers, and evaluates communication choices rather than substantive legal knowledge.

### 3. Four-skill or multi-skill assessment is useful, but unsupported measurement claims are not
**Finding:** EF emphasizes reading, writing, listening and speaking assessment; EnglishLegalese already teaches across multiple communication skills.

**Disposition: ADAPT PARTIALLY.** The starting diagnostic covers reading, writing, tone, clarity, meetings, AI-output review and confidentiality awareness. Automated speaking/listening scoring remains `DEFER_WITH_REASON` until a qualified measurement system can produce and validate those signals truthfully.

### 4. Personalized next-focus guidance is more useful than a naked score
**Finding:** EF and Preply both emphasize personalized learning paths/progress signals rather than assessment as an isolated event.

**Disposition: ADOPT.** v1.57.0 converts missed communication areas into up to three immediate focus areas and routes the learner to courses, Scenario Studio or SmartTeacher AI.

### 5. Spaced repetition can support retention
**Finding:** Preply Business describes spaced-repetition vocabulary practice.

**Disposition: DEFER_WITH_REASON.** EnglishLegalese should add spaced review only after it has a consented, purpose-limited learning-state model. v1.57.0 does not create new persistence merely to implement streaks/repetition.

### 6. Real-browser qualification materially improves visual/accessibility confidence
**Finding:** Playwright provides deterministic browser automation, screenshot capture/comparison, and accessibility-tree snapshots. Its documentation notes that visual baselines should be generated and compared in a consistent environment.

**Disposition: ADOPT.** v1.57.0 adds Chromium desktop/tablet/mobile browser tests for responsive overflow, protected-logo references, diagnostic flow, keyboard submission, dashboard fail-closed behavior, progressive disclosure and reduced motion. CI retains browser evidence through the Playwright report.

### 7. Pixel-golden baseline comparison needs a stable committed baseline
**Finding:** Playwright recommends generating reference screenshots in the same environment and committing reviewed golden snapshots before using them as a release gate.

**Disposition: DEFER_WITH_REASON.** v1.57.0 captures browser screenshots and establishes the stable browser environment, but does not fabricate or auto-approve a golden PNG baseline. A future release should promote owner-reviewed v1.57 browser screenshots to committed baselines before pixel diffs become release-blocking.

## No-copy rule
No proprietary exam questions, course text, scoring formulas, branding, interface copy, or private competitor data were copied. Only general product/testing patterns were evaluated.
