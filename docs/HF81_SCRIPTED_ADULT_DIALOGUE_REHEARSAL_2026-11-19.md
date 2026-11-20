# EnglishLegalese HF81 — scripted professional dialogue rehearsal (development only)

**Version:** HF81 / Universal Next-Version Builder V4.1 · **Date:** 2026-11-19 · **Status:** DRAFT, NOT LIVE, NOT PROVIDER-CONNECTED.

## Purpose and verified predecessor

Continue from **HF80 exact GitHub candidate** `47b9b79ddf25046cf137d3c0e350dac10da6d0e0`, complete cumulative 846-file source ZIP SHA-256 `7c23c624b2b839a9a3abc5ac45d939fb65b80842626708fdb2a741b3e69a61b9` and complete cumulative Builder V4.0 PDF SHA-256 `a96ec6982bef86d1f999ef2669027b0790795648ebdcf72419481f0f5e7bbc49` (179 pages, 72 embedded recovery objects). HF80 PR #125 has two independent GitHub Action jobs SUCCESS at the same immutable SHA (run `44435271360`). All earlier releases remain preserved.

TR-ControlCenter latest checkpoint read anew: stable master/checkpoint `TRCC-PREBUILD-CHECKPOINT-v1.0`, newer V1.41 registry, current receipt protocol, latest read-only Classroom V110 informational handoff and CloneFusion EXPERIMENTAL V0.7 (not a production AI/voice/host interface). Unique HF81 PREBUILD receipt stored before source modification in the shared ControlCenter folder. A self-reported read is **not** independent coordinator acknowledgment or cross-project approval.

## What HF81 actually adds

1. `src/trcfAdultDialogueRehearsal.js`: Four fictional professional role-play scenarios, two each for Legal English and Business English, **three dialogue turns per scenario**. Each turn has a realistic prompt, two alternative full-sentence responses, explicit best-example selection, English rationale and a native-language draft explanation in **English, Thai, Vietnamese, Simplified Mandarin, and Korean**. English remains the taught language. Full activity directions appear in English and selected explanation language.
2. `scripts/build-hf81-dialogue-rehearsal.js`: Deterministically composes the complete original HF80 self-contained offline page with a new Conversation Lab on lesson step four. The separate HF80 source, generator and preview remain **byte-for-byte unchanged**. Responsive controls permit scenario choice, answer attempt, deliberate example reveal, next exchange and restart. Wrong examples do not disclose the model until a correct selection or explicit reveal.
3. `labs/hf81-adult-conversation-coach-offline.html`: Portable offline learner rehearsal. The instruction encourages saying the answer aloud but **does not capture, transmit or synthesize speech**. No student account, lesson tracking, personal data, local storage, provider call, network request, grades, payments or real avatar. All in-memory choices are cleared on STOP, reset, course or language change, and on returning to the earlier lesson step.
4. Verification: `scripts/verify-hf81-dialogue-rehearsal.js`, `tests/hf81-dialogue-rehearsal.spec.js`, and additive mandatory `package.json` checks. All prior HF80 and older scripts remain required; no tests or governance removed.

## Explicit no-drift and release policy

Preserve the approved original homepage, logo, teacher photography, navigation, free resources, 28 course topics, substantial Legal/Business/Investor topics, pricing/subscriptions, teacher-supervised certification, enrolment/roles, dashboards, historical practice and private student/employer records. All existing GitHub/Render production routes and data stay unchanged. **No TR-Classroom source, images, audio, Hangman/teams or pupil records were copied or modified.** The V110 Classroom handoff was read-only design context only. Teacher Roger Avatar (TR-CloneFusion) remains intended primary instructor **in a future separately approved production integration**; this is a fixed-script teacher placeholder, not an autonomous clone or professional advice.

New role-play text is author-created educational draft. Require fluent native-speaker review, legal/business subject review, jurisdictional checks and accessibility/real-phone validation before live student use. Original owner rules **EL-RGR-020**, **EL-TRCC-001**, **EL-AVATAR-001**, **EL-MULTI-002** and **EL-BI-003** remain binding. Qualified-only **automatic production release** is the standing owner rule, but it cannot occur until exact HF81 dual CI, true device qualification, direct immutable GitHub source archive, both complete Google Drive and ChatGPT Library backup readbacks, independent integration approval, rollback and Render live checks are all genuinely satisfied.

## Test receipt and limitations

HF81: **35 deterministic source/assertion groups PASS**. HF80: **40/40 PASS**; HF79 R2 **57/57**, HF79 **46/46**, HF78 **50/50**, HF77 R2 **26/26**, HF77 **25/25** PASS; EL-RGR-020 continuity PASS. Chromium: **603 actual scripted UI assertions** across 390/820/1365 widths, all five explanation locales and both professional tracks; no network calls, JavaScript errors or horizontal overflow. Direct `file://` navigation, physical Android Chrome, physical iPhone Safari, genuine speech/audio, native proofreading, provider integration and production are **NOT** verified.

When moving to the next version, inspect the **newest complete** source and matching separate cumulative Builder, current ControlCenter release registry and actual GitHub/Render status rather than assuming HF81 remains newest. Preserve entire source/Builder recovery lineage and rollback. Do not weaken the inherited `.git` ancestry test merely because a reconstructed local ZIP lacks Git metadata.
