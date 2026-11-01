# HF37 — private guided speaking rehearsal for 24 existing lessons
Date: 2026-11-01

## Benefit case and decision: ADOPT
Before: the 24 free original Legal/Business lessons provided written responses and a comprehension self-check but no structured, scenario-specific oral practice. Professional learners who need to rehearse client conversations lacked a predictable speaking sequence.
After: each of the same 24 lessons offers a three-turn oral rehearsal (client question, unrehearsed full-sentence response, tailored follow-up), professional example hidden until requested, sentence chunking, approximate pronunciation cues and an optional 45-second speaking timer. These provide practical speaking work without a teacher booking or account. All examples remain fictional and original.

## Privacy and scope
The exercise is entirely within the browser: no audio recording, microphone access, speech detection, pronunciation scoring, storage, submission, network POST or employer reporting. The timer only displays remaining time, stops when tab is hidden or when a second lesson starts, and resets on reload. No automatic certification, grade, AI assessment, payment, booking or teacher feedback is claimed. Learners may practice without a timer.

## Preservation and no-drift
- Read V20 builder with all nested valid predecessor archives; reconcile live GitHub main and Render deployment rather than trusting old HF31 status in the ZIP.
- Baseline: production main and Render live `4c60aca6a80d2d877586919cf96ac4a993ce6a13` (HF36). Fresh branch only.
- Homepage, locked photo and logo, existing 24 lesson bodies, 24 three-option self-checks, original links, existing price comparison and all existing backend/role/permission/financial flows unchanged.
- No new route, credential, production schema or marketing email. Uses standalone strictly scoped CSS + JS linked only in the two continuing-practice pages.
- 24 unique author-written scenarios; no student or private lawyer source files used or published.

## Verification
New `scripts/verify-hf37-speaking-rehearsal.js` is mandatory via `npm check`: all 24 existing lesson headings match a unique scenario; existing lesson and comprehension counts preserved; privacy guards and protected homepage unchanged. New four-project Playwright test `tests/hf37-speaking-rehearsal.spec.js`: discoverability, model answer, timer start/pause, exercise independence, 24 lessons, no writing/network transmission, reload privacy, and responsive layout. Keep all inherited tests and both independent exact-head CI jobs.

## Release stages
Source branch: created. PR/CI/Render deployment: pending until exact-head qualification and production verification. Do not mark customer-facing live until Render confirms exact deployed SHA. External payment, supervised certification, actual class confirmation, production migration, and authenticated role-workflow expansion remain separately gated.
