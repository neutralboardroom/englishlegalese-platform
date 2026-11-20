# EnglishLegalese HF79 R2 — English + native language teaching support

**Date:** 2026-11-18. **Workstream:** TR-EnglishLegalese. **Status:** Local development draft only. **Parent:** HF79 GitHub PR #124 at `bf31c3529d1dd5c9c358c189b06a48becacdca3e`, full complete 837-file source and V3.9 172-page/62-attachment Builder. All predecessor files/Builder objects protected.

## Actual TR-Classroom references — READ ONLY

The owner expressly requested independent review **without editing** the latest offline TR-Classroom app and independent Universal Builder. Fresh Google Drive searches found the complete V105 HTML `TR_Classroom_V105_FULL_OFFLINE.html` and V2.41 PDF `TR_Classroom_Universal_Next_Version_Builder_V2.41_Software_V105_Accurate_Vocabulary_Illustrations.pdf`, with no V106 or V107 result in the searches. Both were independently raw-downloaded into a distinct `tr_classroom_readonly` local inspection directory, hashed and inspected. Neither source was changed, uploaded back, rebuilt or executed as a write operation.

- V105 complete offline HTML: https://drive.google.com/file/d/1OEoj4Myvy53SzEWpSGXBwmd8KM7Ydu2a/view — SHA256 `9a1dd11ca6b4b06b2af368b5263644ea8fc733c389c42f28e2c73c06206a81d6`, 14,450,334 bytes.
- V2.41 actual independent Builder: https://drive.google.com/file/d/1AbuBKBCFyumJXCuvm9bo3p45OdSnIO7t/view — SHA256 `33c3bf51938d141e5a387ec69420eb712b4af4a651edfbcb04b285b9ac5573b3`, 2 A4 pages, 6 embedded recovery files.
- Owner cumulative design contract V1.9: SHA256 `1e37a4ceb3ffb8413db23b9bd406d47ecc2ed8a2a2153854e894112562348326`, 39,576 UTF-8 bytes.

Actual source/contract findings: English is prominent; large Thai beneath as needed; bilingual vocabulary meanings, instructions and stage prompts; complete sentence models, pair speaking, teacher-approved Thai micro-explanations; vocabulary/answer/picture withheld in Hangman 1 and Hangman 2 until solve or explicit reveal. The Classroom system is a **separate offline school app**; nothing from its pupil data, UI image library, game scoring code, exact lesson bank or audio is copied into EnglishLegalese.

## HF79 R2 — independent, professional-adult application improvements

New `src/trcfBilingualTeachingContent.js` contains authored parallel English and native-language directions for the five already-established stages (intro, explain, practice, feedback and close), plus six essential Legal/Business English terms (three per course) each with an English definition and full native definition. Native explanation locales: `en-US`, `th-TH`, `vi-VN`, `zh-CN`, `ko-KR` (South Korea). Definitions are neutral fictional professional education, NOT legal advice. English remains the taught language and the proposed immutable `trcf.host.v0.1.0` request contract is not silently rewritten.

Existing `src/trcfAdultLessonLocales.js` continues returning the original `explanation` key for back-compat, with additive `englishExplanation`, `nativeExplanation`, `directionsEnglish`, `directionsNative` for each of the ten course/locale combinations and a separate three-term `glossary`. Stage and glossary data are frozen, no network/capture/provider/storage. All localized strings are authored **drafts** awaiting fluent native-language and domain-specific review.

The existing self-contained `labs/hf79-avatar-first-offline-rehearsal.html` now shows one English-first explanation and native explanation underneath, then clearly distinct English+native directions. The vocabulary panel shows paired English and selected native definitions **only after an explicit user open**, and closes automatically on step, language or course switch; Stop hides it and clears displayed lesson text. It retains the honest planned-avatar placeholder; there is no live interactive Teacher Roger avatar/voice, no AI generation and no learner capture. Human teacher oversight remains available, not displaced.

**EL-BI-003** has been appended (not rewritten) in the canonical owner no-drift governance, mandating bilingual explanations/directions/definitions as a durable rule for future builds and protecting TR-Classroom read-only boundaries. All previous EL-RGR-020, EL-TRCC-001, EL-AVATAR-001, EL-MULTI-002 safeguards remain intact.

## Verification

- 57/57 new deterministic source tests PASS; inherited HF79 46/46, HF78 50/50, HF77 corrected R2 26/26 and HF77 25/25 all PASS; original owner no-drift EL-RGR-020 PASS.
- Browser exercised by locally installed actual Chromium via Playwright `set_content`: 258 direct interaction/assertion checks at 390, 820, 1365 px; five locales × two courses; English/native lesson and directions, intentional vocabulary reveal, Stop, Restart, locale/track switching; **zero external requests** and JavaScript exceptions, no horizontal overflow.
- File URL / actual Windows projector, physical iPhone Safari/Android Chrome, Korean/Thai/Vietnamese/Mandarin native proofreading, real provider/voice/avatar, CI exact final SHA and production rollback remain **NOT VERIFIED**.
- Build from the last verified complete original HF79 ZIP, preserve all 837 inherited members except audited changed paths; no other builder app or project has been changed.

## Next release gates — EL-RGR-020 unchanged

Both independent GitHub Actions verification jobs must finish green for the **final exact R2 commit**; retrieve a **direct exact GitHub archive** and test it; preserve complete V3.9 original Builder pages and embedded attachments within the new cumulative PDF; verify all new files and both complete artifacts in Google Drive **AND** ChatGPT Library; physical iPhone and Android tests and actual Render rollback/privacy checks must pass before any merge. If the Library remains at quota, remain **DRAFT / NOT LIVE**. No destructive cleanup or bypass is authorized.
