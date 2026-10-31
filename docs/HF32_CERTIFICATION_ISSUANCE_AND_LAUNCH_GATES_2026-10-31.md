# EnglishLegalese HF32 — controlled certification launch contract
**Prepared 2026-10-31. Candidate source branch only; not a certification launch or production migration.**

## Product
Two independently issued EnglishLegalese specialist-language awards: Legal English (EL-LEGAL) and Business English (EL-BUSINESS), each with distinct A1, A2, B1, B2, C1 and C2 assessment pathways. These are internal specialist awards **informed by** the Council of Europe's CEFR; they are **not** Council of Europe issued/accredited, independently CEFR-equated, TOLES, Cambridge, TOEIC or professional practice credentials. Do not claim independent CEFR equivalence without validation evidence and external review.

## Candidate implementation
- Migration `021_hf32_certification_issuance_records.sql` adds strictly additive restricted assessment, independent assessor review, credential, appeal and event structures. **Not applied to production.**
- `src/v1960-certification-issuance.js` implements authorization-gated student requests, documented live supervision, independent 5-dimension 0–4 human ratings, a two-examiner gate, explicit issuer approval, random 96-bit serials plus distinct 192-bit verification codes stored as hashes, private student history, public check, credential revocation, opt-in consent with withdrawal, candidate appeals and owner appeal decision.
- Public verification page provides a user-driven, privacy-minimizing check of subject, level, issue date, current status, and issuer, with no candidate private work or identity documents.
- **Fail closed by default:** `CERTIFICATION_EXAMS_ENABLED`, `CERTIFICATION_ISSUANCE_ENABLED` and `CERTIFICATION_RUBRIC_APPROVED_VERSION` are absent/not enabled in production. No booking, examination or award turns on merely by deploying the code. Stripe remains unchanged and disabled.
- Existing homepage image, editable text, other learning tools, role protections, and pricing are not changed by this work.

## Rubric domains and required human standard-setting
Each independent Legal/Business assessment must include **unseen original** speaking, listening, reading, writing and interactive clarification tasks with a retained protected evidence reference. Each rated dimension uses a documented 0–4 performance rubric: 0 = no demonstrated evidence; 1 = limited task completion; 2 = partially effective; 3 = consistently sufficient for the target specialist task; 4 = fluent, precise and reliable within the target task demands. **A 3 is an internal target-task score, not a scientifically established CEFR equivalence.** Two currently authorized, trained teachers independently assess the same supervised evidence using the same approved rubric. Each must rate all five dimensions at least 3 and recommend pass; divergent scores greater than one point or disagreement must go to moderation, not issuance. Every certificate needs separate owner/admin review, candidate publication consent, and verified evidence.

Before exam enablement, a responsible language-testing lead and at least two real human assessors must:
1. Complete original confidential exam question and prompt banks for all **12 track/level pathways**; balance parallel forms and controlled prompt access.
2. Define target-level task difficulty, scoring anchors and sample performances for each of five skills, and record assessor training and inter-rater calibration. Approve a versioned rubric.
3. Pilot on actual consented learners, review reliability, item quality, accessibility/accommodations, thresholds, appeals and resits; validate the *specialist internal standard* and correct defects. Obtain a formal CEFR linkage study and external independent review before making any equivalence claim.
4. Approve candidate identity checking, live video/in-person proctoring, AI prohibition and permitted-tool rules, private evidence retention/access controls, examiner conflicts, second-examiner review, quality audit and reasonable appeal windows.
5. Approve retention/privacy documentation, candidate public-verification consent/withdrawal, certificate display and delivery, and restricted, tested administrator issuing access.
6. Test backup/restore, migration and data retention on **staging**, end-to-end student/teacher/owner identities, session expiration and role isolation, duplicate issuance, replay/abuse, revocation, attempted verification guessing and appeals. Only after backup and an explicitly approved production change should migration 021 run in production.
7. After independent release checks pass and production smoke checks match the tested commit, set the env flags deliberately and only after assessments are genuinely supervised and calibrated. Do not automate approval of humans or invent past exams/certificates.

## Honest copy requirement
The long old warning on the overview page can be shortened for clarity, but do **not** eliminate the essential distinction until real supervised exams, issuance and public verification are operating. During the readiness phase state **“Assessment booking and certificate issuance are not yet active.”** The two subject pages must likewise retain the truthful inactive status. Once examinations are truly available and the issuer controls work in production, replace the inactive statement with observed operational details; preserve the distinction between internal EnglishLegalese awards and externally accredited/equivalent credentials.

## Unfinished launch blockers
This branch is **not** a live certificate system: production has no migration 021, exam forms are currently illustrative blueprints rather than secure calibrated exam banks, human assessors are not verified/trained in this record, evidence repository and retention operations are not acceptance-tested, Rubric V1 is not approved by a real testing lead, independent privacy/security/browser review and production identities are pending. Payment processing is explicitly out of scope.

Never merge or deploy in violation of existing exact-head dual qualification and qualified-release policies. A page or schema is not evidence that real candidates have completed an examination.
