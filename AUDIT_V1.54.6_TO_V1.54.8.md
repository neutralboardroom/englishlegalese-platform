# EnglishLegalese.com — v1.54.6 Audit and v1.54.8 Release Rationale

## Base authority

- Recoverable source authority: Git commit `a4c427ae5c1b3f1f27819b89a7f2c253b7722d24`.
- Base package version: `1.54.6`.
- Base commit date: 2026-07-09.
- The existing backend, persistence layer, production service layer, migrations, integration scaffolding, and public application remain preserved.
- Historical v1.54.7 evidence exists outside the recoverable repository, so this release intentionally uses v1.54.8 to avoid version collision.

## Audit findings

### 1. Broken homepage metadata — fixed

The v1.54.6 `index.html` description and Open Graph description meta tags were missing their closing quotation marks. That can produce invalid head markup and unreliable search/social previews.

v1.54.8 repairs those tags and adds canonical, Open Graph URL/site/image, Twitter card, robots, and application-name metadata.

### 2. Internal launch/infrastructure language visible to public users — fixed at rendered public layer

The public `#launch` section was generated from an internal `launchGates` array containing implementation details such as database migrations, owner/admin access, Stripe webhooks, server-side OpenAI keys, SMTP, object storage, device QA, and backup/restore checks.

Those are legitimate internal readiness controls but are not appropriate public homepage copy. v1.54.8 preserves the underlying v1.54.6 code and backend while replacing that rendered section with learner-facing continuity, privacy, and trust language.

### 3. Mobile quick-start overload — fixed

The v1.54.6 mobile sticky navigation exposed nine destinations, including internal-sounding `Launch` and `Class` labels. v1.54.8 reduces this to five high-value destinations: Start, Courses, AI Practice, Languages, and Dashboard.

### 4. Accessibility hardening — improved

v1.54.8 adds:

- visible `:focus-visible` keyboard focus treatment;
- reduced-motion support;
- minimum 44px action/touch target treatment for key controls;
- scroll offsets for the sticky header;
- `aria-current` on the active navigation destination;
- Escape-key closing behavior for the mobile navigation;
- stronger language-selector labeling;
- `noopener noreferrer` hardening for new-tab links.

### 5. SEO/social discoverability — improved

v1.54.8 adds or repairs:

- valid description metadata;
- canonical URL for `https://englishlegalese.com/`;
- Open Graph URL/site/image metadata;
- Twitter large-card metadata;
- basic WebSite structured data;
- crawl/index directive.

### 6. Regression coverage — improved

A new `scripts/verify-v1548-public-hardening.js` regression check verifies the version number, metadata repairs, public hardening assets, mobile navigation cleanup, accessibility hooks, and removal of internal launch-gate wording from the rendered public experience.

`npm run check` retains the v1.54.6 verifier and adds the v1.54.8 verifier.

## Explicitly preserved

- No database migration was added or changed.
- No persistent data structure was removed or reset.
- No backend route was removed or renamed.
- No payment, authentication, upload, email, AI, calendar/video, report, certificate, credit, payout, or integration behavior was deliberately changed.
- Existing EnglishLegalese logo/brand assets remain preserved.
- SmartTeacher AI remains educational practice/support and is not presented as legal advice.
- Native-language support remains learning support rather than certified translation or court interpretation.

## Release classification

v1.54.8 is a material public-experience hardening release built conservatively on the exact recoverable v1.54.6 authority. It focuses on correctness, trust, accessibility, mobile usability, search/social metadata, and public/internal-language separation rather than introducing risky new backend behavior.
