# EnglishLegalese.com v1.57.0

## Release theme
**A truthful starting diagnostic plus real-browser release qualification.**

v1.57.0 turns the homepage's existing “free diagnostic” promise into an actual learner-facing starting diagnostic while adding desktop/tablet/mobile browser tests to protect the public experience from regressions.

## What is new
- Original eight-item Legal English communication starting diagnostic.
- No account required and no diagnostic-answer persistence.
- Explicit boundary: not accredited, not CEFR, not TOLES, not licensing/employment/academic certification.
- Foundation / Professional / Advanced **practice-path recommendations**, not formal proficiency levels.
- Up to three immediate focus areas based on missed communication items.
- Existing hero and Student entry points now route to the diagnostic.
- Playwright Chromium qualification on desktop, tablet and mobile.
- Browser checks for horizontal overflow, protected logo reference, diagnostic completion/incomplete state, keyboard submission, dashboard fail-closed behavior, progressive disclosure and reduced motion.
- Browser screenshots/reports retained as CI artifacts for review.
- Successor canonical rule register `EL-RULES-1.1.0`, consolidating all 19 Roger Rules including EL-RGR-019 while preserving predecessor provenance.

## Preserved
- Approved logo bytes and aspect-ratio-safe display rule.
- v1.56 homepage architecture and dashboard access protection.
- v1.55 Scenario Studio, personalized path, progress, SmartTeacher and review features.
- Existing primary/mobile navigation sets.
- Backend, persistence, production services and database migrations.
- v1.55.1 security dependency pins and high/critical audit gate.
- Standing qualified automatic deployment authorization.

## Fresh research
Fresh ordinary web research reviewed TOLES, Preply, EF Corporate Learning and official Playwright guidance. Firecrawl credits were not used.

## Explicit non-claims
- The diagnostic is not a validated language-proficiency examination.
- No CEFR, TOLES or accredited-equivalence claim is made.
- Browser screenshots are captured, but pixel-golden comparison is not release-blocking until an owner-reviewed baseline is deliberately promoted.
- Authenticated account/integration journeys are not claimed tested without production-qualified credentials.
- `BUILT`, `ACCEPTED`, `DEPLOYED` and `LIVE_CORRECT` remain separate states.

See `docs/v1.57.0/` and `governance/` for exact receipts, research, rule traceability and predecessor disposition.
