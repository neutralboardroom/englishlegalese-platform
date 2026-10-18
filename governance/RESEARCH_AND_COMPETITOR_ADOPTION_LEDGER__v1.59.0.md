# EnglishLegalese.com v1.59.0 — Research and Competitor Adoption Ledger

Date: 2026-10-18
Scope: corrective production/live-recovery release. No competitor feature is copied merely to create change.

## Web delivery / currentness research

### MDN HTTP caching
Finding: current MDN guidance distinguishes `no-cache` (store allowed but revalidate before reuse) from `no-store` (do not store), and recommends changing static-asset URLs with a version/hash when content changes. It also notes that an already-stored response is not magically erased by a later `no-store` header.
Disposition: **ADOPT** versioned public asset URLs for every material public release. v1.59 changes all relevant public assets to `?v=1.59.0` and adds explicit HTML cache metadata. Server/backend behavior is not changed in this corrective release without necessity.

### Render web-service caching
Finding: Render documents cache-control behavior and states that successful deploys purge Render edge-cache entries where edge caching is enabled. Render's documentation also supports using response cache headers to control caching.
Disposition: **ADAPT**. Continue exact deploy-currentness verification, but do not treat Render's deploy/cache state as proof that a user's browser is rendering the intended DOM. Browser qualification and postdeploy evidence remain separate acceptance gates.

## Competitor / adjacent-product refresh

### TOLES
Finding: TOLES continues to position Foundation, Higher and Advanced as formal Legal English exam/certificate levels, with current online exams and official preparation materials.
Disposition: **REJECT_WITH_CAUSE** any implication that the EnglishLegalese free diagnostic is equivalent to TOLES, CEFR or an accredited/certified proficiency result. **ADAPT** only the useful clarity of level progression; EnglishLegalese keeps its diagnostic explicitly practice-oriented and non-accredited.

### Preply Business
Finding: Preply Business currently emphasizes tutor-led personalized learning, AI-powered practice between lessons, workplace relevance, flexible delivery, and manager progress visibility through a corporate dashboard.
Disposition: **ADAPT** the clarity of separating learner practice, tutor guidance and organization-level progress visibility. EnglishLegalese must continue excluding private learner drafts/raw AI/teacher-private notes from employer reporting by default. No claim is made that currently unqualified EnglishLegalese employer dashboards match Preply's production capabilities.

### Broader competitor classes required by EL-RGR-014
Legal-English specialists/formal assessment: represented by TOLES in this corrective refresh.
Corporate/tutor platform: represented by Preply Business.
AI/speaking and general-language products: **DEFER_WITH_REASON** because v1.59 is a production-recovery release and adds no new speech-scoring or general-language feature. Existing NVIL requirement to evaluate truthful speech/pronunciation technology remains active.

## Release decisions
- **ADOPT:** new release-specific asset URLs; browser tests for the owner-observed stale/long state; exact deployment-vs-live-state separation.
- **ADAPT:** competitor clarity around levels, human guidance and progress while preserving EnglishLegalese privacy/non-accreditation boundaries.
- **DEFER_WITH_REASON:** new commercial, speech, enterprise-reporting or curriculum features until the public production state is stable and verified.
- **NOT_APPLICABLE:** accreditation/certification implementation in this release.
- **REJECT_WITH_CAUSE:** copying competitor certification/outcome claims, exposing private learner work to employers, or adding features solely for parity.

## Sources consulted
- MDN: Cache-Control and HTTP caching guidance, accessed 2026-10-18.
- Render: Edge Caching for Web Services documentation, accessed 2026-10-18.
- TOLES official site: current exams / teacher / candidate pages, accessed 2026-10-18.
- Preply Business official corporate language training and dashboard materials, accessed 2026-10-18.
