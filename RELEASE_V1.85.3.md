# EnglishLegalese v1.85.3 — HF17 Student Study Overview

Additive improvement on live v1.85.2 and the latest V16 / HF15.8 builder. This is actual website source, NOT a new builder archive.

- My Saved Lessons now shows the latest draft as a direct next step; counts are activity only, not grades or certificates.
- Explicit, browser-only .txt export of displayed lesson titles, statuses and save dates (not answers, email, credentials or feedback). Exports never send email or write to the server and warn that cloud lists can be capped at 100.
- Align protected homepage release meta with package version, correcting the six v1.85.2 public acceptance failures caused by the stale 1.85.0 marker.
- Cache-bust My Saved Lessons while preserving all other learning page assets, original 48 workbooks, pricing, logos, protected hero, teacher workflows, verified account rules, optimistic concurrency, device backups and transaction-only email.
- No production SQL migration, real student emails or payments are performed by this version.
- Gate: npm run check, independent Playwright desktop/tablet/mobile source checks, and public acceptance after Render deploy.
