# v1.66.0 rule and browser gate traceability

- EL-RGR-018: require two independent full qualification gate runs, then Render deploy and apex/www acceptance. Source workflow and postdeploy tests.
- EL-RGR-019: immutable owner logo blob b5f20ef046d75d6f108bc93243c7c14acf3c4eb1; unchanged from v1.65.0.
- EL-DUR-001 through 010: source currentness, full inherited NVIL, no removal, rollback, no drift, permission/privacy preservation, separation of candidate/live states.
- New fictional clause reading: tests/v1590-browser.spec.js desktop/tablet/mobile/iPad WebKit; tests/v1590-production.spec.js actual apex/www production; scripts/verify-v1660-clause-reading.js source/governance checks.
