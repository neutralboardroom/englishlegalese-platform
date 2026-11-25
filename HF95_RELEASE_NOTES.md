# EnglishLegalese HF95 R1 — one-turn, full-sentence professional-English rehearsal

**Release type:** Development-only candidate. **Implementation owner:** TR-EnglishLegaleseWebsite. **Git baseline:** HF94 R2 exact `130f300ef2ea3c358f3cb3828f039c9b384f8576` / cumulative Builder V5.4 R2 (230 pages / 154 native embedded recoveries). No live deployment, external payments, native app packaging or provider activation.

## Why improve this

HF93 provided meaning-first original adult Legal/Business conversations, complete-sentence models and new-context transfer. HF94 added optional full-dialogue and model spoken playback. For slower-paced learners, playing an entire two-speaker exchange in one voice gave too little opportunity to repeat a whole speaker turn before continuing. HF95 adds **self-paced, one-turn-at-a-time rehearsal** without hiding or changing the original exchange, or pretending that speech was actually heard/graded.

## Real additions

- Original mobile page adds clearly grouped controls: Focus on first turn, Previous turn, Listen to this turn, Next speaker turn, plus a live text status and exact visible speaker sentence(s).
- Full human-readable turns remain visible. The new focus text uses `textContent` from the same original HF93 dialogue data; no artificial text and no private-data form.
- When device speech works, optional user-initiated Listen speaks **only the actual dialogue utterance, without saying “Lawyer:” or “Client:”**. Normal/slower rate remains a device preference; all audio uses the already-existing HF94 native synthesis controller, no second audio engine.
- When device speech is missing, text-only focusing, back/forward navigation, original comprehension, speaking model and transfer still work. No microphone access, recognition, recording, AI scoring, API requests, client documents or web analytics.
- All previous HF94 dialogue, model and transfer playback preserved. HF93 comprehension gating, STOP, Restart, subject and case changes cancel speech and clear stale turn focus. Pagehide cancels audio and resets the focus.
- Corrected HF94 whole-dialogue speech concatenation to use a natural single space between already punctuated speaker turns (avoids introducing duplicate full stops).

## Durable rules and scope

Both unchanged full **RDR-001** and **RDR-002** reside in `owner-rules/`. All original EL-RGR-020 qualified automatic-deploy, student privacy, no-drift, individual builder boundaries and source/Builder lineage requirements retained. No change to school Classroom, CloneFusion, TeacherRogerWebsite, growth/revenue system, Neon DB, Render main, server/API/account/billing, PWA cache, native app or 22 free-resource navigation. Older HF94 source / Builder, HF53 live, HF93/92 retain rollback precedence.

## Test evidence and release hold

New targeted source validations `node scripts/verify-hf95-turn-practice.js`; inherited `verify-hf94-listening`, `verify-hf93-mobile` and `verify-hf92-mobile`. Mock Chromium interaction for 320, 390, 768, 1280px verifies text and individual audio, backwards navigation, STOP/pagehide/track/case reset and original meaning/model/transfer. The browser simulator cannot prove real physical iPhone Safari or Android Chrome speech quality. `npm run check` from a standalone recovered ZIP cannot satisfy historical inherited Git-ancestry assertions because `.git` is intentionally absent; **GitHub exact-head independent jobs must run with real history, without weakening tests**.

**Release gate:** DRAFT / NOT DEPLOYED until all existing original physical-device, actual native professional-language review, Render/Neon privacy + tested restore, offsite full source+Universal Builder in both Drive and ChatGPT Library, two independent GitHub exact-head jobs, coordinator/provider ACK and rollback gates pass. ChatGPT Library quota was last blocked; do not discard earlier useful backups to force upload. Existing EL-RGR-020 owner automatic qualified deploy authority survives: no repeated per-version owner approval if all independent requirements really pass.

Canonical source contract: `governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md`.
