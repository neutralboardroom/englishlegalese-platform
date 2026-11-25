# EnglishLegalese HF70 - complete bounded public mobile install check

**CANDIDATE ONLY - not merged, not live, not approved for production until EL-RGR-020 passes.**

## Immutable baselines (independently verified)
- App predecessor: HF69 on GitHub PR #113, exact SHA `1cd585b89e25e5c019feff57f991d011d5814edb`, both independent CI jobs success in run `43784420151`; full 801-file reconstructed ZIP from Drive Applications, SHA-256 `4881b34b8ea26d4c733447b789cc9be3482c7c77453ac0d763a2df4d33650eac`.
- Universal Builder predecessor: full additive V2.9, 126 pages / 20 embedded files, Drive Universal Builders, SHA-256 `0c677b38644623eaf1316fbbbf31bcb22983b3991a55c862d682028e5280d139`.
- Protected production rollback: Render HF53 `05da0352355dbc3fd6eb8b472c49289d594a8e6e`, deploy `dep-dbnu47a9lscs73cf2ue0`.

## Material HF70 improvements (fully additive)
1. PNG readiness checks reject valid-CRC but invalid PNGs: missing, duplicated, late or malformed indexed palettes; nonconsecutive image-data chunks; unsupported IHDR interlace; invalid reserved chunk names; empty IDAT; early IEND. Actual shipped 192px/512px icons continue to pass. PNG checks remain structural integrity, not proof of cryptographic provenance or pixel decompression.
2. Both response bodies and headers are time-bounded for the manual public-only app file check, with best-effort cancellation. The previous 7-second fetch timeout was cleared as soon as HTTP headers arrived, so an incomplete body could otherwise hang the user-facing button. Reject invalid Content-Length values and remain no-store, no-cookie, redirect-refusing.
3. An independent offline VM suite covers clean files, synthetically malformed CRC-valid PNG files, missing palette, invalid chunk order, missing image content, and a deliberately stalled body. New script is appended to the inherited `npm run check` chain. No private routes, billing, teacher/student records or emails are touched.
4. The HF70 query token refreshes the public optional-install script in browsers while retaining the HF68 and HF69 tokens required by historical tests.

Canonical contract (unchanged): `governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md`. No repeated owner authorization is required under EL-RGR-020 after full qualification.

## Mandatory release gates, unchanged
Retain all 19 original Roger Rules, 10 durable rules, all subsequent owner directives, protected homepage/logo/teacher picture, 28 courses, approved class and pricing content, private student records, existing workflows and anti-email safeguards. Both independent exact-final-commit GitHub jobs must pass. Independently download and checksum-verify the COMPLETE exact-Git-source ZIP and full additive Universal Builder PDF in BOTH ChatGPT Library and designated Google Drive folders; preserve live student data and rollback; require physical Android Chrome and iPhone Safari acceptance. Only once ALL gates pass, merge exact qualified SHA to main, verify Render actual live merge commit plus apex, www, health, public learning/mobile app routes; save dual release receipts. Do not merge or claim LIVE until then. No outbound email.
