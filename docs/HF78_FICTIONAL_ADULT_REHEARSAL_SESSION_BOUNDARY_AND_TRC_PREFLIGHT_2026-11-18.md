# HF78 — auditable adult professional rehearsal session boundary

**Build:** HF78 / Universal Next-Version Builder V3.8  
**Author:** TR-EnglishLegalese  
**Date:** 18 November 2026  
**Status:** DRAFT / DEVELOPMENT ONLY; no production merge or provider/voice/avatar activation.

## Mandatory ControlCenter checkpoint reviewed before source modification

- Canonical currentness entrypoint: https://drive.google.com/drive/folders/1Oxqe2wERedJP6sNNTHf8ycYIUT7fRk-8
- `00_TRCC_MASTER_READ_BEFORE_EVERY_BUILD.md` SHA256 `bb92111c72f3231a82e8a32c3f72f2357fd5e0d61849319a8863c1c0b8fb5101`.
- `01_TRCC_CURRENT_RELEASE_REGISTRY_AND_DEPENDENCIES.json` SHA256 `183ccb67318e92b5c817edc5c80e52d73a4ec698c268347cff98004eb899bc75`.
- Read `02_TRCC_PREBUILD_POSTBUILD_RECEIPT_PROTOCOL.md` and `03_TRCC_EVERY_BUILDER_COPY_THIS_INTO_NEXT_VERSION_INSTRUCTIONS.md` plus the EnglishLegalese-specific `TRCF-20261118-ENGLISHLEGALESE-001` under `CC-TRCF-20261118-001`.
- Latest confirmed complete ControlCenter pair from the checkpoint: V1.36 app source SHA256 `ee589d80dd7a7644a3ed0c38b0a706228149d74b13cef36126ee60d8806cec10`, V4.1 cumulative Builder SHA256 `6f30b0a2497ae010b7223a7d69c59c4eab05b36e915a6fdc4052e2b444e95c89`. These ControlCenter source hashes are document-supplied, not independently re-downloaded by HF78.
- Most recent relevant TR-CloneFusion integration report reviewed V4.6 complete source (549 files) / Builder V5.1, described a **MOCK-only** localhost contract and separate disabled real-text adapter. Real provider, owned voice, lip sync and host authentication are not verified; no claim of acceptance by ControlCenter.
- The signed-in EnglishLegalese host and SmartTeacher current operations remain owned solely by TR-EnglishLegalese. Classroom and Online remain read-only separate workstreams.
- This build's unique PREBUILD was posted to the canonical shared folder *before* source modification; local TRCC validator reported `LOCAL_PREFLIGHT_EVIDENCE_CHECKED_UNAUTHENTICATED` with no blockers. That is **not** an independently authenticated ACK, release permission or production approval.

## Exact independent source predecessor

- Latest open draft GitHub PR #122 HF77 R2, immutable source commit `925b56fb955c02e4e98d95b1ae44e9a47e99b277` (both independent GitHub verification jobs SUCCESS on run 44289096397).
- Recovered complete source: 827 files, SHA256 `2a2117e585a50e2f32f915fbab24bb516cf1213de15dddcfea777bfa380a8efe` (fresh local SHA/CRC checked). Drive: https://drive.google.com/file/d/1n04vV5zPJ1t-BpInWHINGleXNdAb0vhm/view
- Full predecessor Builder V3.7 R2: 164 pages, 52 original embedded recovery files, SHA256 `dc798c7e986a1763fe24bed20f7e1ce8fcb3a6a4115b04649f6abbcf7f31926f`. Drive: https://drive.google.com/file/d/1_lBaxIrSQqKzPYa8EnQ53d9EkiQREEN1/view
- Historical main/Render HF53 `05da0352355dbc3fd6eb8b472c49289d594a8e6e` remains protected, not an HF78 source predecessor. No current production write or merge.

## Substantial additive feature — isolated, testable session handling

New `src/trcfMockAdultSession.js` is an **unwired**, in-memory ONLY controller for the proposed `trcf.host.v0.1.0` corrected R2 request format. It first validates each request with existing strictly server-trusted `src/trcfHostR2RequestGate.js`, then pins one fictional adult tenant/account/role, lesson/source/profile, and HMAC fingerprint of its approved excerpt. A brand-new session begins muted. A deliberate owner-only `resumeText()` enables display of *fixed, clearly authored* legal or business-language example sentences, not real AI responses. It handles:

1. Strict upper bounds: at most eight mock turns, 600-character fake user turns, a configurable fictional reservation ceiling no greater than US$2, and denial of spent budget. These reservations are not real charges and cannot reach a payment or AI provider.
2. Per-session cryptographically salted HMACs to detect request-ID replays with different content without storing any original learner text. Exact duplicate replays don't count or reserve budget twice. Scope and lesson changes are denied, even if downstream role authorization would permit them independently.
3. Generation-token cancellation: stale completions are rejected after interruption, mute, STOP, erasure or restart. STOP clears pending requests, client-visible status and idempotency history; erase also resets mock usage. Only ephemeral in-memory fingerprints and safe source version labels exist.
4. Zero automatic learner scores or certificate publication; teacher review is mandatory. Static authored examples are returned with `generated:false`, `mode:MOCK_ONLY`, `voiceGenerated:false` and `avatarGenerated:false`.
5. Existing `src/trcfAdultHostPolicy.js` and `src/trcfHostR2RequestGate.js` now reject inherited/prototyped object bodies, preventing a malformed caller from smuggling expected authorization fields from a prototype chain. All inherited HF77 policy and wire tests remain unchanged.
6. A runnable offline fictional demonstration `node scripts/hf78-fictional-adult-session-demo.js`. It is **not** a standalone production user page, server route or deployed integration.

New source-proximate test `scripts/verify-hf78-adult-mock-session.js` includes 50+ deterministic scenarios covering authorization, data exposure, budget/idempotency, interruption races, minors, unauthorized voice/avatar, and immutable owner rules. Mandatory `npm run check` extends, rather than weakens, prior source/test requirements. No actual provider network calls are made.

## Release gates remain unchanged

`EL-RGR-020` and `EL-TRCC-001` bind this and every future build. Before any qualified merge: exact final head must pass **both** GitHub Actions CI jobs including browser/security; actual Android Chrome and iPhone Safari physical acceptance; direct exact-tested GitHub source archive plus complete Builder independently downloaded and SHA-verified from **both Google Drive and ChatGPT Library**; genuine ControlCenter reconciled acknowledgment for cross-project integration; complete rollback, data/privacy and live-domain checks. Library quota was full at HF77 R2; no automated deletion or waiver is authorized.

If a gate is unavailable, classify the version **DRAFT / NOT LIVE**. After all authentic gates pass, qualified automatic deployment proceeds under the standing owner rule, followed by Render exact-commit LIVE, private no-store, apex/www, and dual location receipt validation. Real voices, third-party media processing, customer/provider PII, school pupils, grades and billing are outside this build.

**Canonical no-drift contract file:** `governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md` is unchanged and mandatory; every HF78 successor must preserve it together with the original owner directives and the new TR-ControlCenter pre-build rule.
