# EnglishLegalese v1.62.0 source and rollback custody

2026-10-18. Verified predecessor: v1.61.1 main commit `fa4da257026e185e2a8e6d1965f2c84e75fa8186`, Render live deployment `dep-dbaa3e142hec73dctfi0`, 15/15 actual apex/www desktop/tablet/mobile production tests from run `39120072270`. Known earlier fallback: v1.60.0 deployment `dep-dba6nnhsrm7s73a51p90`.

Protected approved logo: `assets/englishlegalese-logo.png`, Git blob `b5f20ef046d75d6f108bc93243c7c14acf3c4eb1`; **NO CHANGE** to image bytes or display frame. Protected canonical 19 Roger rules and 10 durable rules remain in `governance/ENGLISHLEGALESE_CANONICAL_RULE_REGISTER__v1.57.0.md` Git blob `bd1d33a43180291f3a8ddedcd6884f6ff3d7c666`. This release does not change protected logo, server, auth, API keys, DB, persistence, migration or user data.

Before merge: full release gate `npm run audit:high`, `npm run check` and Playwright 4 browser projects (Chromium desktop/tablet/mobile + iPad WebKit) must pass twice on the exact final head. Independently confirm main currentness, original rules/logo and previous Render rollback target before merging. After merging, verify exact Render deploy SHA, public health version, apex/www metadata and real production Playwright suite.

Rollback: Render service `srv-d97p18vavr4c73dbls40` → Deploys → choose prior successful `dep-dbaa3e142hec73dctfi0` (v1.61.1) → Rollback. Confirm deployment has become live and apex/www actually serve the prior version; expect Render to disable auto-deploy until source is reconciled and corrected release qualified. Do not modify learner records or claim rollback solely from a button click.

State at source creation: **CANDIDATE ONLY / NOT DEPLOYED**. Automated tests are not an owner-approved golden visual baseline.
