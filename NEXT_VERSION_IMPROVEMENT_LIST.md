# EnglishLegalese.com — Next Version Improvement List after v1.54.8

This list records qualified follow-on work that was deliberately not forced into v1.54.8 because it would either require broader backend modification, production credentials, browser-level validation, or content/product decisions beyond the safe scope of this hardening release.

## Highest-value next work

1. Fold the v1.54.8 public `Learning experience` copy directly into `app.js` so the public/internal separation is native rather than handled by an additive post-render hardening layer.
2. Add automated browser-level accessibility and responsive checks for desktop, tablet, and mobile, including keyboard-only navigation, focus order, menu behavior, reduced motion, and major breakpoints.
3. Add HTML/head validation to CI so malformed metadata like the v1.54.6 quote defect cannot recur.
4. Add explicit social-preview validation for the production canonical URL and Open Graph image after DNS/domain routing is confirmed.
5. Review every public section for remaining prototype/internal wording and move operational implementation details to staff/admin-only surfaces.
6. Add clear real-user conversion paths for diagnostic signup, teacher inquiry, employer/team inquiry, and login only when the corresponding backend destinations and consent/privacy handling are production-ready.
7. Validate production integrations end to end with account-owned credentials: database, Stripe, OpenAI, SMTP, object storage, classroom/calendar providers, backups, restore, and rollback.
8. Add browser smoke tests for core role journeys: student diagnostic → practice → teacher review; teacher classroom workflow; employer privacy-safe progress view; staff/admin operational view.
9. Review course catalog and public pricing/offer language for launch accuracy before paid acquisition or broad outreach.
10. Perform a final mobile density pass on dashboard-heavy views after browser/device testing, preserving the simplified five-item mobile quick navigation.

## Preservation rule

Do not remove working v1.54.8 functionality or alter persistent data merely to simplify the code. Future work should remain additive or carefully migrated, with regression proof and rollback capability.
