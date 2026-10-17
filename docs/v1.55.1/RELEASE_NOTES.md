# EnglishLegalese.com v1.55.1 — Release Notes

**Release:** 1.55.1  
**Release type:** Narrow security/dependency hardening successor  
**Exact authoritative predecessor:** main commit `1811adc2ba847ac64abe66c16e87627d599e98dd`  
**Standing deployment authority:** `EL-RGR-018` applies after qualification  
**Deployment state in this document:** NOT YET DEPLOYED; derive final state from exact Render evidence after merge

## Why this release exists
The v1.55.0 Render deployment completed successfully from commit `3ccb511ef9ce934d0a82148c30cfba4a6c39cb29`, but its build-time `npm install` reported five dependency vulnerabilities, including one high and one critical. Because SMTP and object-storage optional dependencies are reachable when configured, the finding was treated as actionable rather than ignored.

## Material changes
- Version advanced to `1.55.1`.
- Production dependency versions are explicitly pinned:
  - `express` `4.22.3`
  - `@aws-sdk/client-s3` `3.1152.0`
  - `@aws-sdk/s3-request-presigner` `3.1152.0`
  - `nodemailer` `10.1.1`
  - `pg` `8.23.1`
- Minimum Node runtime raised from `>=18` to `>=20` for current dependency compatibility.
- Release workflow now installs the declared dependency set before qualification.
- `npm audit --audit-level=high` is a release blocker.
- Added `scripts/verify-v1551-security.js`.
- Existing v1.55.0 public-feature and governance/no-drift checks remain active as successor checks.

## Explicitly unchanged
No intentional changes were made to:
- public UI, homepage, navigation or mobile navigation;
- Scenario Studio, custom roleplay, Learning Path, Skills Passport, teacher review or employer-safe snapshot behavior;
- `server.js` behavior;
- `src/persistence.js`;
- `src/productionServices.js` implementation;
- migrations or data contracts;
- pricing, billing logic or public commercial claims;
- approved brand/logo assets;
- canonical Roger Rules or durable builder-rule wording.

## Qualification evidence before seal
GitHub Actions release-gate run `39025107027` / run #26 completed successfully for the initial v1.55.1 security candidate. Its dependency install, high/critical npm audit gate, and inherited syntax/regression/rule/no-drift gates all passed.

A fresh release gate on the final documentation-complete PR head remains mandatory before merge. The final acceptance state must be derived from GitHub PR/Actions evidence, not inferred from this document.

## Deployment rule
Under `EL-RGR-018`, once the final exact-head gates pass and currentness is reconfirmed, the release may merge and deploy automatically without a separate owner approval. If deployment or post-deploy verification fails, fail closed and use recovery/rollback rather than claiming success.
