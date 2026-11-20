# HF69 — PWA icon corruption defense and independent structural-integrity proof

**State:** DEVELOPMENT CANDIDATE — not LIVE, not merged, not a substitute for real Android Chrome / iOS Safari acceptance.

## Governing predecessor and no-drift baseline

* Source: HF68 R3 on [GitHub PR #112](https://github.com/neutralboardroom/englishlegalese-platform/pull/112), exact source SHA `96e7e9ad82db1224fce820aeeecf48042bc2d510`; both independent GitHub Release Gate jobs passed for this SHA in run `43711575820`.
* Builder: fully additive 122-page V2.8 HF68 R3 PDF, 19 embedded files, SHA-256 `cca909358f02a8d70bb45b621d5bad355e26b8405c1bc6be20d84db8bb75bb38` in designated Google Drive Universal Builders; exact full source ZIP SHA-256 `ada6783a98187a436096c12eab95ad4fef9b63b4df88fceda35da6ac547247fb` from designated Google Drive Applications.
* Owner release directive **EL-RGR-020**: deploy every fully qualified version LIVE automatically **after** exact-SHA independent testing, verified complete ZIP/PDF in BOTH ChatGPT Library and designated Google Drive folders, real-device/security/privacy gates and rollback readiness. No repeated owner authorization is required; fail closed.
* Permanent contract: `governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md`.

## New HF69 functionality

1. The manual, click-only Install/App readiness screen verifies PNG chunk framing, IHDR dimensions and format, an IDAT block, terminal IEND and independently calculated IEEE CRC-32 for every PNG chunk. This detects a plausible-looking image file whose content was altered after download; signature and dimensions alone could miss this. This structural validator does not purport to decode every pixel, cryptographically authenticate assets, or prove full Android/iOS installation.
2. A new cache-busting query parameter loads the improved script while preserving the original HF68 query token and existing regression assumptions. No install prompt, worker activation, reload, user data save or network request is made automatically.
3. Dedicated offline VM regression covers both real source icons, broken chunk CRC, modified image data, truncated IEND, junk trailing bytes, mismatched dimensions, wrong signature, unsupported format and unknown critical chunks. It proves all checks remain public, same-origin, credential-free and user initiated.
4. Mandatory `npm run check` now includes the new test; inherited HF1–HF68 source, historical checks, both independent Release Gate jobs, Playwright desktop/tablet/mobile/WebKit matrix, protected original homepage/logo/teacher image and routes, 19 Roger Rules, 10 durable rules, anti-email rule, pricing/classroom/student privacy/data remain untouched.

## Exact release block conditions

This build stays unmerged while any of the following is unverified: both independent green jobs on the exact NEW HF69 head; complete exact-commit Git source ZIP and full additive V2.9 Universal Builder PDF, copied AND independently downloaded/hash-checked from BOTH ChatGPT Library and designated Google Drive folders; real physical Android Chrome and iPhone Safari acceptances; authenticated privacy/no-store, production data safety, original protected asset invariants and rollback proof.

When all gates genuinely pass, follow EL-RGR-020: preserve backups first, then merge only the proven head into `main`, verify Render LIVE at the merge SHA and both apex+www/public/private route response behavior, and save dual verifiable receipts. Never claim LIVE from GitHub-only tests or a local preview. No outbound builder/marketing emails.
