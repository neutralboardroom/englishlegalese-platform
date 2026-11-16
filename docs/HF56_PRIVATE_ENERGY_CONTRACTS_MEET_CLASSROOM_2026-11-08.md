# EnglishLegalese HF56 — Private Oil & Gas Contracts Live Classroom (Build Candidate)

**Built:** 2026-11-08. **Project:** EnglishLegalese only. **Instruction source:** audited coordinated EnglishLegalese Universal Next Version Builder V1.6 (PDF, 2026-11-08), read-only rule archive preserved. **Cumulative branch history:** production main HF53 → verified HF54 speaking rounds PR #98 → HF55 audience-adaptation branch PR #99 → HF56 private classroom candidate. Do not merge independent projects.

## Mission and owner-approved use
EnglishLegalese teaches professional Legal English and Business English. This optional subtrack serves human-teacher-led **one-to-one 60-minute English instruction** for adult energy-contract professionals, launched from EnglishLegalese into Google Meet. A previously taught first class is preserved as historical work only once the teacher enters the actual date. No private contract, client, investor, or student details are committed to GitHub or a public static page. No AI instruction or certification is represented.

## Private-source provenance (do not publish documents)
The user supplied THREE substantial source materials in the private ChatGPT Library: a condensate joint-marketing contract, a Vietnam DPPA transaction presentation, and a renewable-energy acquisition/due-diligence review. Source themes were abstracted into original **fictional** lessons:
- Joint marketing agent and principals; qualifying bids and decisions; FOB cargo, shipping documentation, payment terms and guarantees, price benchmark, notices and risks;
- DPPA/PPA models, revenue and settlement, credit protections and change-in-law questions, without jurisdiction-specific currency of law assertions;
- Acquisition due diligence, licences, land rights, purchase documents, warranty and negotiation communication.
Actual source files remain in the user's private Library and are not hosted, copied or referenced by filename in public source. No real client detail is used in lessons; no confidential trade terms, payment accounts or counterparty identities.

## Completed functionality on feature branch
- `src/v2150-private-energy-classroom.js`: 12 lessons × 60 minutes, scenario/goal/term bank/model/teacher prompts/homework and a complete six-part 00–60 agenda. Session 1 models the previously completed payment-term speaking work; Session 2 teaches conforming bids and includes general **crude oil /kruːd ɔɪl/** pronunciation warm-up. Each remaining session advances contract communication across the 3 abstracted source domains.
- New private route `/learn/private-energy-contracts/`: human-taught identity, student/teacher role login, lessons after authorized login, teacher setup, class schedule and a **Join Google Meet from EnglishLegalese** link for a confirmed assigned class. Google Meet may open in a new tab; it is not embedded in EnglishLegalese.
- Existing Contracts & Agreements intensive now links to the sign-in classroom; otherwise the old class content remains unchanged.
- Server adds a private API using existing PostgreSQL class_session records and existing revocable Bearer sessions. Student GET requires verified student email plus actual session assignment; teacher access uses assigned_teacher_user_id. Private meeting URL never appears in public HTML or unassigned responses; no unbounded cross-user query.
- Owner/admin-only historical Session 1 form: actual taught date required (past ≤120 days); no fabricated Meet URL, payment, grade or certification. Optional teacher-only controlled pronunciation-progress flag includes 'improved'; no learner-specific fact is hard-coded in the source or automatically saved.
- Owner/teacher may create future lesson records and attach a real Meet URL. When the *existing EnglishLegalese Google Calendar integration* is configured, a teacher may request auto-generation from the classroom and persist the returned Meet URL into the protected class session. No auto event is attempted without supported credentials, no invited attendees and no outbound messages are generated for this pilot. Google Meet runs externally.
- No payments are collected; no marketing or test emails are sent; no live source file uploads; no audio recording. No teacher assessment/certificate claimed.

## Code changes / no drift
Added `learn/private-energy-contracts/index.html`, `src/v2150-private-energy-classroom.js`, `product-v2170-energy-classroom.js`, `tests/hf56-private-energy-classroom.spec.js`, `scripts/verify-hf56-private-classroom.js`. `server.js` gains only a route installer. `product-v1950-contracts-agreements.js` gains only one link under the existing Legal English contracts section. The existing production homepage, global styles, logos, teacher image, course catalog, pricing, enrollment, billing, cert pages, and all other product engines remain protected. All new CSS is scoped within the new private classroom document.

## Privacy/integration gates
1. Account creation and verified-email signup must actually be available in production with PostgreSQL.
2. Assign student to owner/teacher; never assume user account exists based on personal anecdotes.
3. Confirm classroom login on two independent devices; unassigned accounts see no class content or Join link.
4. Confirm explicit actual first lesson date before recording historical progress, then create upcoming Session 2.
5. If Google Calendar credentials are verified, create an authorized new Meet; otherwise teacher attaches an existing URL to the protected EnglishLegalese class. Verify exactly one provider event and no unsolicited invitations.
6. Test student-only class join, teacher role management, failed/stale tokens, revoked sessions, provider outage, duplicate session, response caching, cross-student data isolation.
7. Run inherited `npm run check` and full Playwright suite in dual independent exact-SHA CI. Verify desktop/tablet/mobile Chromium/WebKit and no horizontal scroll; compare protected file blob hashes.
8. **Do not deploy** until CI passes, human visual review passes, Render service and deployment SHA are identified, and live pilot privacy gates are confirmed. A feature branch or PR is not a live class.

## No contradictory claim
The old HF55 PR #99 release gate failed on an advanced-track test assertion that expected the introductory lesson's model, although the advanced track correctly rendered its own legal-research example. HF56 includes corrected test expectations. The HF56 combined acceptance run must pass before release; historical HF55 failure cannot be relabeled as success.

## Future incremental class feedback
Use the verified EnglishLegalese session closeout and existing teacher-linked work once access is validated. A short oral intelligibility rubric can record confidence, accurate qualifying language and one next pronunciation target without storing actual client matters. Individualized pronunciation progress is never published. A teacher may save a limited observation only after authenticating and explicitly confirming a real class session.

**Status:** source-built feature branch, not merged or deployed. No class has been scheduled for any specific student, and no real Meet has been generated merely by the source commit.
