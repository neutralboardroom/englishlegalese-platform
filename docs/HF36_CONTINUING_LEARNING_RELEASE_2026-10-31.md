# HF36 — Expand and expose real Legal + Business continuing practice, V20 no drift (2026-10-31)

## Source of truth and benefit gate
- Base: deployed EnglishLegalese main/Render **HF35** commit `11180d561ea77664095f3c4d315a6cad6b7efbbc`. The attached V20 archive and immutable V19→V18→V17→V16 nested predecessors passed SHA/ZIP integrity checks. Current repo permanent governance, 115 KB cumulative improvement list and dashboard/certification continuation were consulted. Never replace this with a new builder.
- **Identified user problem:** HF34/HF35 introduced twelve original, free lessons but they were discoverable primarily through the proposed membership pricing page. That creates a false practical impression that free professional practice requires shopping for membership. The user's standing request to keep developing material for long-term Legal + Business learning provides a direct substantive value case.
- **Measurable improvement:** Add twelve *new* original lessons, six for Legal English and six for Business/Investor English, each with a workplace scenario, appropriate language, substantive original model, writing task, three credible comprehension options, unique source-aware explanation and optional teacher extension. Preserve all twelve existing HF35 lessons. Provide visible links at the natural Legal, Business, Legal Resources, Business Resources, existing practice hub and Memberships entrypoints. Direct anchors lead to the requested subject rather than forcing users to navigate an unrelated page first. No homepage changes.
- All 24 lesson activities are free self-guided previews. **No customer payment, AI entitlement, teacher booking, staff assessment, storage of private work, grade, certificate or marketing message** is created. Memberships continue to be a proposed future digital service spanning both programs, cancelable before renewal; all public terms and prices are unaltered.

## Source scope
- New `learn/continuing-practice/advanced/index.html` is a genuine learning page. It imports the same V1840 common stylesheet, identical shared navigation/footer and the already-tested HF35 local no-network `product-v1980-practice-checks.js`.
- Minimal links in `learn/continuing-practice/index.html`, `learn/legal-english/index.html`, `learn/business-english/index.html`, `learn/legal-resources/index.html`, `learn/business-resources/index.html`, `learn/memberships/index.html`; no removal of existing cards or price elements. Existing 14 Legal and eight Business resource-tool claims are unchanged; new learning modules are not misrepresented as additional interactive tools.
- No changes to `index.html`, homepage/photo/logo, `server.js`, authentication, dashboards, Stripe, Neon databases, existing courses, published prices, memberships API, consent, or certificates.

## Release and rollback gate
- `scripts/verify-hf36-continuing-learning.js` enforces new 12 + existing 12 lesson count, individual specific explanations, 36 new options, balanced answer placements, no form/network/storage and deep links.
- `tests/hf36-continuing-learning.spec.js` runs full browser matrix. It verifies navigation into both tracks, 24 lesson availability, real feedback and no privacy writes, individual draft reset, preserved membership/cancel terms, responsive width and screenshot receipt.
- Existing inherited source and browser matrix must pass *both independent release jobs* at the exact same head SHA with visual inspection before guarded merge.
- If either job fails, do not deploy; adjust candidate and rerun. Render status alone is not public HTML validation. Check actual live Render commit and both public hosts; report external verification limitation honestly if blocked.
- The full old backlog is retained below new HF36 trace; owner rules EL-RGR-001..019 and EL-DUR-001..010 remain exactly as before.

## Remaining deferred external dependencies
- Production membership inquiry records not activated without reviewed production migration and explicit Neon migration approval. Paid Stripe memberships/auto-renewals/cancellation and actual company seats remain unprovisioned. Separately supervised Legal vs Business certifications still cannot be represented as issued.
