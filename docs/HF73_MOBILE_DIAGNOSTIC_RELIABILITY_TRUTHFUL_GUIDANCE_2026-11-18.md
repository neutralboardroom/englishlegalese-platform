# EnglishLegalese HF73 — resilient consent-only mobile readiness diagnostics

**Date:** 2026-11-18  
**Status:** DEVELOPMENT CANDIDATE, draft only; not merged, not deployed.  
**Exact predecessor:** HF72 PR #116 on `feature/hf72-decoded-mobile-icons-progress-20261116`, SHA `c50521d1673a8a17d86176b0db81dace48618c91`.  
**Governing Universal Builder:** V3.2 R2 optimized PDF, SHA256 `c686f6b1e782d4391a87b1192e909c21926657fcda82cb2395982582cb9dc092`, 138 pages and 25 embedded recovery files.  
**Other authoritative files:** HF72 GitHub Git archive exact SHA, distinct reconstructed 807-file source ZIP, permanent EL-RGR-020 no-drift governance contract.
**Canonical standing release contract:** `governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md`. The standing qualified-release auto-deployment instruction remains active without repeated owner authorization after every required independent acceptance and backup gate passes. This candidate is blocked; it is not a cancellation of that policy.

## Material cumulative improvements

1. **Bounded nonstream manifest:** Public manifest reads on browsers with `arrayBuffer`/`TextDecoder` use the same max-1MiB actual byte validation, `Content-Length` consistency and strict fatal UTF-8 as streamed reads, rather than unbounded `response.json()`. Legacy isolated test shims still work; normal browsers without required validation APIs fail closed rather than claiming an authenticated or verified file.
2. **Safe reused network buffers:** Incremental stream chunks are copied before the next read; the browser may otherwise reuse or mutate the underlying typed-array buffer and invalidate subsequent verification of compressed PNG or manifest bytes.
3. **Late image decoder cleanup:** A bitmap decoder completing after a read timeout has its returned `ImageBitmap` closed, preventing a decoded-image-memory leak even when a diagnostic times out.
4. **Truthful confidence level:** Actual browser pixel-decode success is labeled as such. Browsers with no image-decoding API show *valid PNG structure and CRC (pixel decoding unavailable)*, not a claim that pixels were decoded.
5. **Accessible follow-up instructions:** The optional install page now displays focused text-only advice after its seven progressive checks, including guidance when the manifest, icons, HTTPS or browser support fail. No user identifiers, account data, tracking, saved work, calendar, email, enrollment, payment or class data are accessed.
6. **Deterministic offline regressions:** `scripts/verify-hf73-mobile-diagnostic-reliability.js` exercises normal, oversize, invalid UTF-8, reused-stream-buffer, no-pixel-decoder and late-decoder scenarios by executing the actual browser source in an isolated VM. The mandatory `npm run check` chain includes this test. All former HF65–HF72 tests remain present.

## Hard limits and no-drift protection

- **No changes** to homepage/logo/locked teacher photograph, courses, course prices, subscriptions, Legal/Business English lessons, student or employer records, private classes, teacher/owner dashboards, certificate accreditation claims, or outbound email.
- Diagnostic fetches occur **only after an explicit user click**, target exactly three public, same-origin files with `credentials:'omit'` and `cache:'no-store'`, and cannot trigger an automatic reload, installation, or update.
- Browser-support caveat: on a browser lacking streams, the response may be allocated by `arrayBuffer` before the post-read size check; this is *not* an O(1) memory guarantee. The existing strict header validation remains in place.
- The separately authorized release gate remains **fail-closed**. Required before automatic merge/deploy: both independent GitHub CI jobs green at **one immutable final HF73 SHA**, private-data/security/browser acceptance including physical Android Chrome and iPhone Safari checks, complete Git source/archive and builder verified in both canonical Drive/Library locations, production rollback and receipt controls. Current production must not be changed before those conditions are satisfied.
- **Never infer LIVE from a draft PR**. The last verified protected production fallback from the HF72 receipt is HF53 SHA `05da0352355dbc3fd6eb8b472c49289d594a8e6e` (2026-11-16 receipt; independently check Render before any deployment).

## Files modified or added

- Modified: `pwa-install.js`, `learn/install/index.html`, `package.json`.
- New: `scripts/verify-hf73-mobile-diagnostic-reliability.js`, this document.
- Every other predecessor file must preserve original content hash and remain in the complete application archive.

## Restoration

Keep HF72 PR #116, its exact source archive and the complete V3.2 R2 Builder PDF unchanged. HF73 is branched from HF72; restore by discarding the HF73 draft branch or checking out the immutable HF72 SHA. No production rollback is necessary for an unmerged candidate.
