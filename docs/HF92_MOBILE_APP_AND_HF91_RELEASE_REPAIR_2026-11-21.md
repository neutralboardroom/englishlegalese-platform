# HF92 / TR-EnglishLegaleseWebsite — simultaneous desktop + mobile development

Status: **DRAFT / NOT DEPLOYED**. Baseline HF91 exact commit `49a4fdc0ea8b358f391799e7b037df16e83777d2` and complete Universal Builder V5.1 SHA256 `3f035c2883be27722ee53fd514380801093eef04a9aa51d7f7ca9f5a07e35799`.

## Desktop release regression repair (no business logic change)
The HF91 readiness section used `section.v1850-boundary`, and the older employer quote assertion selected `.v1850-boundary.first()`, now accidentally selecting intake readiness instead of the discount paragraph. HF92 changes only that Playwright locator to `p.v1850-boundary` filtered on `Indicative multi-seat discount`, **keeping the required 15% text, 12 employee seats, fictional organization, no employee personal details in posted top-level fields, all API/PII assertions**. No approved discount rate, billing, or availability policy is changed. CI must re-run both independent jobs on the exact new head.

## Mobile development started in the same owned repo
- Add real `/learn/app/` public mobile-first learning home with responsive cards, accessible tab-like bottom section navigation, real Legal/Business and free-practice links, classes/enrollment inquiries, pricing, account, trust and install instructions. No new login, PII, network calls, cookies, tracking, private storage or payment operations.
- Preserve original homepage and user-approved navigation; add discoverability in footer and existing PWA install page without overriding homepage design.
- Existing same-site PWA manifest and original 3 shortcuts remain byte-identical; mobile hub gets generic public-only offline fallback, never private lessons or account storage.
- Begin `mobile/native/` Capacitor M0.1 source scaffold: static on-device introduction and explicitly external canonical HTTPS learning links; no `server.url` remote-WebView credentials, no duplicate backend, no second EnglishLegalese owner. This is **not a compiled native app or Store release**.
- Add deterministic source verification and real full-site Playwright test across CI desktop/tablet/mobile browser matrix.

## Production hold and next work
Do not merge or deploy until dual CI passes plus independently checked real Android Chrome/iPhone Safari/PWA installation, professional native-language review (Thai/Vietnamese/Chinese/Korean), data privacy + verified real PostgreSQL backup, rollback and relevant ControlCenter/provider approvals. Built-in opt-in manual service worker update remains unchanged. Any real native distributions require approved app ID, OS SDK/Xcode/Android Studio builds, external-browser/auth device testing, privacy policy, and platform review.

## Permanent qualified-release authority (unchanged)

**EL-RGR-020** remains fully binding together with `governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md`. After both exact-head independent CI suites pass, full-source and full **Universal Next-Version Builder** backups are independently verified in **ChatGPT Library and Google Drive** and all remaining privacy, device, provider, ControlCenter and rollback gates qualify, the existing standing instruction authorizes an **automatic qualified live release without another owner permission request**. The qualified commit merges into `main`, Render auto-deploys that exact SHA, and a separately observed live verification and rollback receipt is required. This present HF92 development build is **BLOCKED** from release while any gate is unqualified.
