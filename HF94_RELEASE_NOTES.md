# EnglishLegalese HF94 R1 — optional real-sentence listening and shadowing

**Builder:** TR-EnglishLegaleseWebsite. **Baseline:** HF93 R1 Git exact head `7c460d9073dfb12180b059f5d5037565c4b134e4`, complete 926-file archive; separate cumulative Universal Builder V5.3, 228 pages and 146 native attachments. **Release status:** draft local development, not merged to main or Render production. **Date:** 2026-11-21.

## What materially improves

HF93 already provides six full fictional adult professional dialogues with a comprehension gate, complete model response, separate new-context transfer, safe STOP and Restart. HF94 adds optional *listening and shadowing* of the actual lesson text using the device's Web Speech synthesis when supported. Learners can hear the written exchange, hear the model full sentence after they correctly answer the meaning question, and hear the sample transfer reply only after revealing it. Slower and normal rates are selectable. Audio stops on Stop, Restart, new case, page hide or relevant stage changes. If TTS is missing or fails, every existing written step remains usable, including original HF93 speech practice without recording.

This improves hearing natural English sentence rhythm and practicing complete answers without claiming the website can *assess* spoken English. A system voice may be synthesized by the platform and may use online processing. The site sends no practice content to its server, requests no microphone, stores no lesson response, records no student voice, and does not make a speech-accuracy or learning-outcome claim. The audio test uses a **mock synthesis interface**, not proof of actual sound quality or live mobile system playback.

## Deliberate nonchanges under Roger's rules

RDR-001 and RDR-002 verbatim; existing original HF93 script untouched. No change to accounts, student/teacher privacy, intake, Neon, payments, teacher assignments, 22-tool navigation, PWA offline allowlist, original course pages, native app prototype, adult locale/translation, EnglishLegalese.com live production, other builder apps or deployment. HF92/HF93 predecessors and production HF53 remain intact. New files are additive; no arbitrary aesthetic redesign or provider purchase.

## Tests and release gate

- `node scripts/verify-hf94-listening.js` security, compatibility and teaching-contract assertions.
- `node scripts/verify-hf93-mobile.js` inherited 45 assertions; `node scripts/verify-hf92-mobile.js` inherited 44.
- `node scripts/verify-v1850-followthrough.js` inherited 58-page full-site navigation and 22 resources.
- `tests/hf94-listening.spec.js` browser test with fake native TTS (not real audio), focus, Stop/Restart, fallback, privacy.
- Local Chromium injected HTML/actual modules test at 320/390/768px: passes audio events, meaning/transfer, Stop, Restart, pagehide, no network writes, no JS errors and no overflow. It is *not* a full deployed-host test.

**Still unqualified for production:** both independent exact-head GitHub workflow jobs; physical Android Chrome + real iPhone Safari/device voice with permission/voice quality; human professional/native translation review of existing localized public lessons; actual Render/Neon private endpoint verification; privacy/backup restore, full dual Drive and ChatGPT Library source+Builder storage; any independent host/ControlCenter/provider acknowledgment required by applicable integration. Existing owner EL-RGR-020 gate is not weakened by this development candidate. Do not merge or deploy automatically unless every established gate has independently passed.

## Backout

Restore the unchanged HF93 `learn/app/index.html` and `package.json` from the exact prior HF93 archive and the new asset remains inert. Reinstall from the previous V5.3 cumulative Builder if needed. This work does not require a database rollback or production software change.
