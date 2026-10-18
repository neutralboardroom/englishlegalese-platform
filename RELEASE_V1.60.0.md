# EnglishLegalese.com v1.60.0 — shorter focused homepage and readable headings

Candidate successor to production v1.59.0. This material release addresses owner-reported unfinished homepage work, including the long initial page, overbearing headings, duplicate buttons, obsolete release promo, fragile observer layers, older content surviving after deployment, and unclear route focus. It preserves the original learning engine: 21 scenario IDs with expansion/custom roleplay, complete course catalog, eight-question non-accredited diagnostic, four-week planner, private learning progress, SmartTeacher text-guided practice, teacher/employer boundaries, and approved logo.

Design: homepage overview is six useful sections (hero, start, courses, SmartTeacher, teachers/employers and trust). Detailed language support, diagnostic, scenario studio, learning path, progress and skills content remain accessible through links as focused destinations with a visible Return to homepage action. Responsive H1/H2/H3 heading font sizes and spacing improve legibility and avoid overwhelming mobile layouts. Versioned assets, response headers and explicit HTML revalidation reduce stale-release confusion.

Engineering: canonical app.js owns focus visibility, while legacy promo injection and redundant MutationObservers are retired without deleting protected learning functionality. Backend data contracts, persistent store, role permission enforcement, API surface and logo image bytes remain untouched. An immutable exact predecessor and Render rollback identifier are documented.

This note describes source changes only. Do not mark QUALIFIED, MERGED, DEPLOYED or LIVE_CORRECT unless independent exact-head CI and live production evidence confirms those states.
