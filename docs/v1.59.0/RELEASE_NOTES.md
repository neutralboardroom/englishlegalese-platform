# EnglishLegalese.com v1.59.0 — Hard Live Homepage Recovery

## Why this release exists
Roger's real production screenshots showed that v1.58.0 was deployed but the live browser could still present material portions of the rejected long/old homepage. Therefore v1.58 was not accepted as `LIVE_CORRECT`.

## What v1.59 changes
- adds a hard v1.59 DOM recovery layer that directly enforces critical public correctness;
- uses native `hidden` state for non-featured courses/scenarios, planner details and progress details until requested;
- directly removes the legacy public `NEW IN V1.55` feature panel and public staff role if injected by predecessor logic;
- directly normalizes internal/release copy, diagnostic/trust/language wording and employer/teacher public wording;
- forces every public JS/CSS/logo/icon reference to a new `?v=1.59.0` URL;
- keeps the exact approved logo artwork but makes its responsive header display materially larger;
- fixes quiet hero CTA contrast;
- adds release-blocking tests for the exact stale/long state seen by Roger on desktop/mobile;
- preserves the 21 scenarios, custom roleplay, planner, progress record, starting diagnostic, privacy boundaries and fail-closed dashboards.

## What v1.59 does not change
- no intentional server/backend implementation change;
- no database/persistence/migration change;
- no production credential change;
- no Stripe/payment activation;
- no change to approved logo bytes;
- no accreditation/certification claim;
- no new speech/pronunciation scoring claim.

## Qualification and deployment
The release is not merge/deploy eligible until the exact final head passes the complete release gate twice. After deployment, `DEPLOYED` remains distinct from `LIVE_CORRECT`; actual production evidence must show the rejected state is absent.
