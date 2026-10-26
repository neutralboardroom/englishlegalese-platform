# EnglishLegalese — Permanent Transactional Email Policy (Owner Successor)
**Rule IDs:** EL-RGR-025 and EL-DUR-013
**Adopted:** 2026-10-26
**Authority:** Explicit owner authorization on 2026-10-26, superseding the categorical email prohibition in EL-RGR-023 / EL-DUR-011 for necessary transactional student service email only.
**Status:** ACTIVE — PERMANENT — NO DRIFT — ALL FUTURE BUILDERS, RELEASES, RECOVERY PACKAGES, AND HANDOFFS.

## Approved transactional email (narrow exception)
EnglishLegalese may send event-triggered **account verification**, **welcome**, **password-reset**, **security-alert**, **genuine class booking confirmation**, and **necessary student/teacher class-operation notification** emails. The event MUST have actually occurred and be correctly associated with the intended account, class or recipient. A verified sender identity and transactional email delivery integration must be configured and proven ready before claiming the feature works. User-triggered verification and password resets may use their own verified workflows; these are not marketing and do not require separate individual outreach approvals.

## Email that remains prohibited
Do NOT originate, test-send, schedule, queue, or deliver unsolicited marketing, cold law-firm outreach, lead generation, bulk sales mail, mass newsletters or promotional campaigns from the universal website builder without **separate explicit owner authorization for that distinct operation**. Do not repurpose registration records, class enrollments or student data for promotions. Issue #48's automatic owner marketing/notification concepts do not become authorized through this policy.

## Technical gates
1. Use an authenticated, verified outbound sender (e.g. `mail.englishlegalese.com` via configured HTTPS API), with proper DNS, domain alignment and credentials kept in environment secrets, never GitHub. Render Free may block SMTP; use HTTPS where verified.
2. Issue email verification and reset links via cryptographically strong, one-time, short-lived, server-validated tokens; store only hashed token verifiers; protect against replay, enumeration, open redirects, injection, and account takeover. Expire verification links within 24 hours and reset links within 30 minutes, or shorter; reset must invalidate old active sessions where feasible.
3. Do not assert an email is verified before the link is redeemed. Prevent unverified accounts from accessing verified-user AI trial eligibility or any verification-gated capability. Existing allowance remains **three** free requests per verified student, with budget/rate controls intact.
4. Rate-limit signup, verification resend and password-reset requests; use generic outward responses where needed; monitor rejected, bounced and failed delivery. Do not log tokens, passwords, API keys, private lesson answers or email body content.
5. Provide accurate user-visible status: explain when account creation occurred, when verification is outstanding, and when a cloud lesson save was **actually confirmed by the server**. Optional device drafts must always say they remain on that browser and may be lost. Account-backed pause/resume requires sign-in and verified storage.
6. Class notifications may state 'confirmed' only when a genuine confirmed/scheduled class relationship and delivery integration exist. Teacher access remains restricted to genuine linked relationships. No fabricated human/AI classes, receipts, calendars or emails.
7. Reuse/test transactional provider integration with mocked transports and isolated data for CI. Automated tests and release qualification MUST NEVER deliver real emails merely to test a build. Production sends must be generated only by genuine approved user events.
8. Preserve confidentiality and all predecessor product scope, all real course materials, source gates, accessibility, security, GitHub review and rollback. Preserve the no-bulk-email safeguard as fail-closed.

## Supersession and history
EL-RGR-023 and EL-DUR-011 remain historical evidence of the earlier *blanket* ban. Their absolute wording is superseded **only** where it prohibits the six types of legitimate transactional email enumerated here. All of their restrictions on unauthorized outreach, marketing, mass sends and builder-initiated test messages remain binding. Any references in EL-DUR-012 and EL-RGR-024 to the old categorical ban are interpreted consistently with this later owner-approved successor. The original ten canonical durable rules and other Roger Rules remain unchanged.

## Release policy
HF14's original unverified-email/no-reset workaround is **not accepted as the target experience**. Do not merge an unchanged HF14 branch as a finished account release. Require secure verified-email signup and recovery, evidence of configured sending, tests for failure paths and rate limits, independent browser regression qualification, production verification, and rollback readiness before presenting these features as live. Production schema changes require separate approved migration and confirmation; none are authorized by this documentation update.

## Enforcement
All universal builders, scripts, repo branches, packaging, rollback tools and future chat handoffs must load this successor after the two old rule files and assert that (1) transactional emails are permitted only on real qualifying events, (2) marketing/outreach remains authorization-gated, and (3) regression and CI tests are mock/no-send. Never silently revert to a blanket no-email prohibition or silently enable promotional email.
