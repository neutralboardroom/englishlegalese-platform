# EnglishLegalese.com v1.55.1 — Fresh Research + Competitor Refresh

**Research date:** 2026-10-17  
**Scope:** dependency/security currentness plus security/privacy patterns in current language-learning and corporate-learning competitors.  
**Release treatment:** security findings may be adopted in this narrow patch; broader product/enterprise changes are dispositioned for later rather than causing feature drift.

## Dependency/security research
Current package/release and advisory material was reviewed before selecting the v1.55.1 dependency set. The release does not rely on guessed vulnerability remediation: its GitHub Action installs the declared dependency set and runs `npm audit --audit-level=high` as executable evidence.

Disposition: **ADOPTED NOW** — pin current declared production dependencies, require Node 20+, and make high/critical dependency findings release-blocking.

## Competitor / adjacent-platform refresh

### EF Corporate Learning
Current privacy and AI materials emphasize privacy-first architecture, human oversight, explicit data-use/retention treatment and controlled employer visibility into learner progress rather than unrestricted access to learner content.

Disposition: **ALREADY PARTLY SATISFIED / ADAPT LATER** — EnglishLegalese already separates employer-safe progress from private drafts/AI conversations. Future authenticated persistence should add explicit retention/deletion controls and documented data-purpose boundaries before expanding employer analytics.

Sources reviewed: EF Corporate Learning Privacy Policy (updated April 2026); EF Corporate Learning “Our approach to AI” / 2026 AI playbook.

### ELSA
Current ELSA security/privacy material describes encryption in transit/at rest, least-privilege internal access, private networking, retention/deletion controls, revocable integrations, security monitoring, penetration testing and public trust/compliance documentation. Its enterprise materials also expose export/deletion expectations.

Disposition: **ADAPT / DEFER TO QUALIFIED SECURITY RELEASES** — add explicit EnglishLegalese retention/deletion/export controls, secrets/log-redaction requirements, integration revocation, vulnerability-remediation tracking and a public-facing trust/security summary only after the controls actually exist. Do not claim SOC 2/ISO/GDPR certification or equivalent without evidence.

Sources reviewed: ELSA Meeting Companion Privacy Policy (last updated July 28, 2026); ELSA Trust Center; ELSA enterprise FAQ/security materials.

### Preply Business
Current enterprise documentation highlights SSO and provisioning so organization access can follow employer identity/security policies and accounts can be managed centrally.

Disposition: **DEFER_WITH_REASON** — SSO/SCIM is potentially valuable for EnglishLegalese employer plans, but implementing it requires authenticated multi-user persistence, authorization design and tested lifecycle/deprovisioning. It does not belong in a dependency-only patch.

Source reviewed: Preply Business SSO & Provisioning documentation (September 16, 2026).

## Rejected for this release
- **REJECTED_WITH_CAUSE:** adding new enterprise identity, analytics, retention or trust-center claims inside v1.55.1. Those would expand scope and create avoidable product/rule drift.
- **REJECTED_WITH_CAUSE:** claiming that passing `npm audit --audit-level=high` proves total security. It is one control, not a complete security assessment.
- **REJECTED_WITH_CAUSE:** copying competitor policy text, certification claims, security language or proprietary implementation details.

## Required carry-forward
The Next Version Improvement List should retain the qualified security/privacy lessons: explicit data retention/deletion/export, secrets/log redaction, dependency currentness, vulnerability remediation, enterprise SSO/provisioning evaluation, and truthful public trust/security documentation after controls are proven.
