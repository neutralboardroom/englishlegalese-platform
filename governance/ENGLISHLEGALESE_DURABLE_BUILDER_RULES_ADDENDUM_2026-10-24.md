# EnglishLegalese — Durable Builder Rule Addendum

> **CURRENT POLICY NOTICE — 2026-10-26 (owner-authorized successor):** The absolute ban on all application emails below is **historical as to genuine runtime transactional emails**. Read it alongside **EL-DUR-013 / EL-RGR-025**, now the controlling durable policy at `governance/ENGLISHLEGALESE_DURABLE_TRANSACTIONAL_EMAIL_POLICY_2026-10-26.md`. Essential account verification, password recovery, security and genuine class/feedback notifications are permitted after proper operational safeguards. **Builder/CI email sends and unsolicited marketing/outreach remain prohibited**. This notice preserves the original directive as evidence instead of deleting it.

**Identifier:** EL-DUR-011
**Adopted:** 2026-10-24
**Authority:** Direct owner instruction. Also protected by owner Roger Rule EL-RGR-023.
**Status:** ACTIVE · PERMANENT · NO-DRIFT · CROSS-VERSION · FAIL-CLOSED
**Predecessor:** Original EL-DUR-001 through EL-DUR-010 remain exactly as written in `ENGLISHLEGALESE_CANONICAL_RULE_REGISTER__v1.57.0.md`.
**Successor:** Additive EL-DUR-011; does not renumber, rewrite or supersede previous durable rules.

## EL-DUR-011 — EnglishLegalese universal builder must NEVER send emails
Every EnglishLegalese universal next-version builder and all its versions, release scripts, test suites, CI/CD jobs, sub-builders, recovery processes, forks, repackagings and future chat handoffs are **strictly NON-SENDING**. They must never send, test-send, automatically send, queue, schedule, trigger or enable outbound emails, whether to students, teachers, owner, law firms, companies, job prospects, or anyone else. The term “email feature” in backlog documentation does NOT authorize transmission. Builder completion or auto-deployment does NOT authorize email. Do not configure notification sends on behalf of the builder or create workarounds via another provider.

The builder may preserve existing dormant application code and data contracts without activating outbound email, and may review/mock email behavior in fully isolated tests with **zero external messages**. Distinct email outreach/delivery operations are outside this builder and require their own separate explicit authorization. They must not be performed under a generic “continue”, “finish”, “build next version”, or “deploy live” instruction.

No version is releasable without a passing fail-closed source and process assertion for **EL-DUR-011** and **EL-RGR-023**. Confirm that no outbound email was sent, enqueued, scheduled or switched on during the builder's actions or verification. Mark any unsupported verification as UNKNOWN/BLOCKED, never fake a pass. No future builder may delete, weaken, silently override or reinterpret this rule.

**Related decision:** Issue #48 (owner auto-email notifications) closed as NOT PLANNED. The builder is not to reopen, implement, or send them.

## Adoption / successor protocol
This addendum is the current durable rule authority alongside the immutable ten-rule canonical predecessor. All future builder packages and universal handoff prompts must embed or cite this rule by stable ID, carry its full meaning, load it during pre-build, validate again before seal, and preserve it across every version, cleanup, archive, rollback, migration and chat continuation. Only another *explicit owner instruction* may authorize a successor; silence or release approval never does.

## Traceability
- Rule text: this file (EL-DUR-011), plus the EL-RGR-023 addendum.
- Mandatory test: `scripts/verify-v1851-intake.js` or any equivalent successor that reads both rule texts and checks no-mail enforcement.
- Operational acceptance: no outbound email operations invoked by the EnglishLegalese universal builder.
- Protected lineage: EL-DUR-001…010; EL-RGR-001…023.


## EL-DUR-012 — All courses must be substantive, correctly classified, verified and non-placeholder
Owner-directed durable rule adopted 2026-10-24. Preserve the original ten durable rules and EL-DUR-011 forever. Every future EnglishLegalese website builder must reject course lists that consist solely of names, thin outlines, nonfunctional buttons, copied/generic filler, unsupported claims of AI tutoring or guaranteed human-teacher staffing, or lesson plans missing exercises, homework and instructor assessment. Do not describe unfinished previews as fully delivered live teacher classes or planned AI as an activated teaching service. Treat Legal English, Business English and Wall Street/Investor English as separate genuine subject curricula, each with four meaningful stages, unique fictional application, accurate glossary, interactive source-grounded checks with helpful feedback, independent learner assignments, and usable human-teacher briefs. Preserve the 24 + 16 + 8 subject inventory and two distinct 16-session extended plans; keep the original 28-topic unified catalog as a separate cross-subject view. Validate all current topics by source inspection and a live user-path test on both dedicated pages before allowing production merge. Public enrollment must correctly label real topic inquiry versus confirmed human-led booking, with the respective price and schedule. If any topic is still only a preview, label it as such and do not invent qualified teacher staffing, real AI capability or course completion. This is additive to EL-RGR-024 and must be loaded and tested in all successors. EL-DUR-011 and EL-RGR-023 still categorically forbid the builder from sending emails.
