# EnglishLegalese — v1.85.1 private intake triage candidate (October 24, 2026)

**STATUS: candidate only.** Additive private owner operational follow-through on live v1.85.0 HF1, commit 8da2e7e. No changes to the public homepage, pricing, forms, AI avatars, email activation or payments.

## Purpose
Track enrollment requests and teacher applications in the private intake database by reference, with review status, next action, follow-up date and an append-only audit trail. Preserve the existing read-only CLI and private CSV snapshot.

## Production gates
1. Confirm the dedicated EnglishLegalese-only intake database identified by ENGLISHLEGALESE_INTAKE_DATABASE_URL, not the generic DATABASE_URL or another project's database. Verify credentials, least-privilege access, backup and restore.
2. Only after specific authorization and nonproduction testing, apply db/intake/v1851-triage.sql to the dedicated intake database. The SQL adds three tables and indexes; it does not delete, truncate or modify existing applicants. **This PR does not run the production migration.**
3. Test with fictional requests in a nonproduction environment; verify table constraints and per-change audit records.
4. Use the CLI in a private owner terminal, never public Render build logs or CI. Keep connection strings and applicant information out of GitHub.
5. Approval and student class confirmations require real individual checks; recording a status is not equivalent to sending a message.

## Operator commands
- npm run owner:intake:triage -- --summary
- npm run owner:intake:triage -- --due --acknowledge-personal-data
- npm run owner:intake:triage -- --set --kind=enrollment --id=UUID --status=reviewing --actor=owner --next-action="Verify requested group time" --followup-utc=2026-11-02T09:00:00Z --acknowledge-personal-data
- npm run owner:intake:triage -- --set --kind=teacher --id=UUID --status=screening --actor=owner --next-action="Check credentials" --followup-utc= --acknowledge-personal-data

To record confirmed enrollment, add --verified-class-place after personally confirming teacher and seat. To record teacher approval, add --verified-qualifications after individual screening. The flags are operator attestations, not automatic verification. Updates and audit events happen in one transaction; repeated identical updates do not duplicate events. Summary emits counts only. Due lists IDs and UTC dates only.

## No-drift gates and remaining work
Preserve 19 Roger Rules, 10 durable rules, three later directives; original laptop hero/logo; 28-topic catalog; 16+16 classroom session plans; 14 Legal and 8 Business resources; disabled Stripe; AI-avatar hold; 8da2e7e rollback. The branch must pass two independent source+browser qualification jobs and production acceptance before any live release. Owner notifications, private web dashboard, teacher vetting, waitlist enforcement, outbound confirmations and payments are not operational.

## Absolute no-email builder rule (EL-RGR-023)
**Never send emails.** This builder cannot and will not send, queue, schedule or activate owner alerts, student/teacher confirmations, marketing or test messages. Prior issue #48 is closed as not planned. The private CLI performs database-only review; no email is sent. Separate email/outreach workflows require separate explicit instructions and are outside the scope of this builder.
