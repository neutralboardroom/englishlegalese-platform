# EnglishLegalese v1.56.0 — No-Drift / No-Regression Receipt

## Exact lineage
- Base version: v1.55.1
- Base commit: `a499e99439927e630bd334b4a3b9fbebdff08cd5`
- Release branch: `release/v1.56.0-homepage-architecture`

## Intentional product changes
- Additive public homepage architecture layer (`product-v1560.js`, `product-v1560.css`).
- Add dashboard access fail-closed guard (`product-v1560-access.js`).
- Public copy truth/clarity improvements based on owner screenshots.
- Progressive disclosure for courses, scenarios, learning plan and detailed progress.
- Guided SmartTeacher prompt starters.
- New learner progress empty state.
- Active navigation/anchor/sticky-header fixes.
- Display-only header-logo sizing.
- Permanent owner logo lock EL-RGR-019.
- Fresh competitor/current-practice research and 92-item screenshot disposition evidence.

## Explicitly not changed
- `server.js` implementation.
- `src/persistence.js`.
- `src/productionServices.js`.
- Database migrations.
- v1.55 course/scenario/planner/progress source data.
- Protected logo bytes (`assets/englishlegalese-logo.png`).
- Existing primary navigation route set; only active-state behavior and public account labeling/access gating are intentionally refined.

## Deleted behavior
`NONE` intentionally deleted. Deep content is collapsed by default where appropriate, not removed. All 21 v1.55 scenarios remain in the underlying source.

## Recovery
Rollback source is exact v1.55.1 merge commit `a499e99439927e630bd334b4a3b9fbebdff08cd5`. Render rollback/redeploy remains available if live verification fails.

## Acceptance rule
This receipt is not by itself a PASS. Qualification requires the GitHub release gate to pass twice on the release sequence, final currentness reconciliation, then exact deployment/live verification. Any unexplained changed path, logo-byte drift, rule loss, high/critical dependency vulnerability or live regression blocks acceptance.
