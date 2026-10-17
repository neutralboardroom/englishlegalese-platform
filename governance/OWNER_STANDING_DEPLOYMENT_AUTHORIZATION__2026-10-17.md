# EnglishLegalese.com — Owner Standing Deployment Authorization

**Owner:** Roger Gillman  
**Date established:** 2026-10-17  
**Scope:** EnglishLegalese.com ONLY  
**Status:** ACTIVE until Roger explicitly changes or revokes it

## Exact owner instruction
> “You can deploy it automatically now after each new version you build.”

## Canonical interpretation
This instruction authorizes the EnglishLegalese builder to deploy each newly completed EnglishLegalese version automatically after the version has fully completed all required qualification gates. A separate per-version owner approval is no longer required.

This authorization does **not** permit deployment of a failed, unqualified, stale, conflicting, unsafe, or gate-blocked build. Before deployment, the builder must still satisfy the active EnglishLegalese rule corpus, including exact-predecessor/currentness checks, rule-currentness, no product drift, no rule drift, regression/testing, privacy/security, deployment-readiness, and rollback/recovery requirements.

Deployment truth remains evidence-based. Record the exact version, source commit, deployment target, deployment/deploy ID, deployment result, and live-verification result. Do not claim `DEPLOYED` or `LIVE_CORRECT` without exact evidence.

If deployment fails or live verification detects a material regression, fail closed and use the known rollback/recovery path rather than leaving an unqualified release presented as successful.

This owner authorization is represented in the canonical rule register as `EL-RGR-018` and remains binding through future versions, continuations, recoveries, refactors, migrations, deployments, handoffs, model changes, and builder successions until Roger explicitly changes or revokes it.
