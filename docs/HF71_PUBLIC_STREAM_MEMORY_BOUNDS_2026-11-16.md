# HF71 — opt-in public install diagnostics: bounded streaming, actual-length proof, strict safe fallback

**DRAFT, UNMERGED, NOT LIVE.** This release is a cumulative security/quality improvement to EnglishLegalese HF70 and its complete Universal Builder V3.0. It does not replace any existing Roger Rule or alter production.

## Verified predecessors
- EnglishLegalese application HF70: GitHub draft PR #114 at exact SHA `0a652a547a906e069599fabdcc3ddf01a026f75a` and full 803-file candidate source ZIP. Both designated Drive and ChatGPT Library copies were freshly independently downloaded and confirmed SHA-256 `5c0d2439e93eb2412e3a5ea5f5a8e790512002867aceef93d3cdcabfe8e7703a`.
- Universal Builder V3.0 complete 130-page PDF with 21 embedded recovery files, freshly independently downloaded and hash-verified from both locations SHA-256 `bc5a70ff076d732578639bbf4deec08e1e6d75c57730461d33c6f1c250813124`.
- GitHub current HF70 exact head independently checked; Render main LIVE HF53 at `05da0352355dbc3fd6eb8b472c49289d594a8e6e` remains protected rollback.

## Material HF71 changes, strictly additive
1. The optional public PWA diagnostic now reads response bodies incrementally with `ReadableStream.getReader()` where supported. It enforces a 1MiB cap **before** combining chunks, reducing exposure to oversized response allocations that the prior after-`arrayBuffer()` size check could not prevent.
2. Actual downloaded length is compared with any advertised `Content-Length`. Incomplete/short bodies fail closed even when headers falsely looked plausible.
3. Suspiciously fragmented streams (over 4096 chunks), network read exceptions, stalled bodies and oversized streams report the file unavailable and trigger best-effort cancellation. The existing 7-second timeout and cookie-free, no-cache, no-redirect request policy remain in place.
4. Public manifest body now receives the same bounded streaming treatment with UTF-8 fatal decoding and JSON parse. Browser fallbacks without stream readers retain the inherited HF70 `arrayBuffer`/`json` logic and timeout tests; fallback memory allocation is a known limitation (maximum checked immediately after reading).
5. Repaired one inherited HF68 **test fixture only** (not an assertion): its fake `Content-Length: 0` previously contradicted its demand that nonzero genuine PNG bytes be accepted. The test now declares the actual fixture byte length, keeping every HF68 pass/fail assertion. This was exposed by the first exact-commit GitHub CI failure and is documented for transparent continuity.
6. New offline VM regression proves the actual unchanged 192px and 512px icons and manifest remain valid, malformed lengths/oversize/stalls/errors/fragmentation are rejected, no fetch occurs before the user clicks, no authenticated/private request is issued, and diagnostic control recovers. Existing HF1–HF70 checks remain cumulative.

Canonical no-drift contract (unchanged): `governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md`. Qualified automatic rollout requires no repeated owner authorization; do not reinterpret a blocked version as deployed.

## Permanent release continuity: EL-RGR-020
All original 19 Roger Rules, 10 durable rules, all additive owner safeguards, anti-email rules, locked homepage/logo/teacher photo, 28 courses/classes, pricing/memberships, real student/customer data, and protected private/student/teacher/owner data persist unchanged. HF71 modifies `pwa-install.js`, `learn/install/index.html`, `package.json`, and the inconsistent HF68 regression-test **fixture only**; it adds this handoff and the independent streaming test. No inherited test expectation was removed or weakened. No payments, databases, real bookings, mailing, or unrelated Teacher Roger projects are touched.

**Fail closed:** Qualification requires both exact-final-Git-SHA independent GitHub Actions jobs, source/security/browser regressions, completed physical Android Chrome and iPhone Safari acceptance, complete exact-tested-commit Git source ZIP and full cumulative Builder PDF saved in BOTH Library and canonical Google Drive and independently downloaded/checksum-verified, live-data safety, rollback readiness, and owner-rule parity. Only then merge exact qualified SHA and verify Render LIVE deploy/health plus apex+www/public learning/mobile routes. Maintain rollback and save dual release receipts. Never equate a passing test or saved candidate with actual production deployment.
