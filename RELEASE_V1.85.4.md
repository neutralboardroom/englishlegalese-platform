# EnglishLegalese v1.85.4 — HF18 safe complete cloud lesson listing

Current actual-website release successor to v1.85.3, under immutable Universal Builder V16 / HF15.8.

- The signed-in My Saved Lessons dashboard retrieves additional pages of up to 100 *private lesson metadata records* at a time, instead of silently hiding lessons after 100.
- Server paginates a per-user query with validated, parameterized offset, stable timestamp/key order, and no answer fields. Existing verified-identity, bearer-session, role, PostgreSQL and no-store gates remain unchanged.
- Client deduplicates records, checks session token and request sequence on every response, caps loading at 1,000, and clearly flags partial results if an intermediate page fails, the cap is reached or the server is incompatible.
- The study-overview download distinguishes a partial listing from a full server listing, and never contains saved answers, teacher feedback or credentials. A complete account backup remains the proper full-data export.
- Mocked browser tests cover 125 lessons across two pages, privacy, searches and interrupted second-page fetch. No database migrations, external email, live API calls or payment changes.
- No new universal builder was generated; earlier protected workbooks, pricing, teacher features and homepage artwork remain untouched.

Release gates: npm run check; two independent desktop/tablet/mobile browser jobs on exact HEAD; Render commit verification; post-deploy public apex/www acceptance.
