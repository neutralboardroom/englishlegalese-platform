# EnglishLegalese v1.60.0 — production acceptance and rollback receipt

Date: 2026-10-18. Product code candidate `1afafea936d7ceb7b9eef0cf067b6401c978888e`, merged into GitHub main as `1a510adeadaac2be2b25b36ea201d31d6624a4fb`. Prior source: v1.59.0 `bdcf7bc38cc6d1d123d8975be4bf3754a0316c80`.

Qualification: GitHub workflow `39104748844`, run attempts **1 and 2** on same exact candidate; both SUCCESS with 30/30 desktop/tablet/mobile browser tests each, inherited static regression and rule/no-drift gates, and 0 dependency vulnerabilities.

Render service `srv-d97p18vavr4c73dbls40`, new deploy `dep-dba6k4hsrm7s73a4v3pg`, live exact merge SHA. Public `/health` reports `1.60.0-navigation-domain-hardening`. Real-domain GitHub production run `39104928119` passed **12/12** desktop/tablet/mobile checks: apex current rendering, hash behavior, www current rendering and all 21 scenarios plus diagnostic in their focused destinations. Independent production browser screenshots/traces retained as artifact `12127704534`.

Sources:
- https://github.com/neutralboardroom/englishlegalese-platform/actions/runs/39104748844
- https://github.com/neutralboardroom/englishlegalese-platform/actions/runs/39104928119
- https://github.com/neutralboardroom/englishlegalese-platform/actions/runs/39104928119/artifacts/12127704534
- https://dashboard.render.com/web/srv-d97p18vavr4c73dbls40

Old recoverable Render deploy: **`dep-dba55p67bikc73ea1v20`**, tied to original v1.59.0. If future regressions arise, use Render Deploys → Rollback to that previous successful deploy, verify apex and www after rollback, reconcile main before re-enabling auto-deploy. See `docs/v1.60.0/ROLLBACK_AND_HOMEPAGE_ACCEPTANCE.md`.

States for v1.60 product release at this evidence cutoff: **BUILT=YES, QUALIFIED=YES, MERGED=YES, DEPLOYED=YES, LIVE_CORRECT=YES by the automated browser/content suite**. Roger's owner-approved golden visual/aesthetic baseline is NOT implied or granted. This readback receipt is documentation-only and its eventual separate merge commit must be requalified independently under the same exact-head gate.
