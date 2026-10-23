# EnglishLegalese — owner enrollment and instructor follow-up

Status: implementation operating procedure for v1.85.0. This is an internal operational document, not a public student page.

## What is operational
The Enrollment and Teach With Us forms store submitted requests in the separately configured EnglishLegalese Neon database. The public intake health check verifies that the tables can be queried, **not** that an owner notification was delivered, a seat reserved, or a teacher selected. The two 16-session Legal and Business class series are on the owner's private calendar. The calendar meeting links are never disclosed publicly. Stripe checkout and paid AI entitlements remain off.

## Owner follow-up procedure
1. Review new enrollment and teacher submissions within the authorized Neon project each business day, using the two EnglishLegalese intake tables. Treat names, addresses, availability and qualifications as private application data.
2. For enrollment requests, check whether the selected group schedule or proposed private time actually has an available instructor and place. Contact the applicant directly after reviewing the request. Do not claim a reservation before individual confirmation.
3. For teacher applications, independently confirm qualifications, English fluency, a teaching demonstration and legal eligibility before any hiring promise or public teacher profile.
4. Maintain an owner-private tracking sheet with request reference, received date, program/track, status (new, contacted, awaiting reply, confirmed or closed), follow-up owner and next action. Avoid duplicates and do not send unsolicited marketing messages.
5. Target a human first reply within one business day when feasible, but do not promise automatic confirmations. If notifications are later implemented, use a verified approved sender, an auditable retry queue and explicit authorization for recipient messaging.
6. Check Render and database readiness during errors, retain existing records through releases and rollbacks, and never copy applicant information into public logs.

## Follow-up improvement gate
Automatic owner notification, verified applicant acknowledgment, a protected owner-facing queue and status transitions remain **unimplemented**; they require authentication, verified sending, privacy controls and real end-to-end acceptance tests. The two existing public submission forms must continue working independently of any optional notification service.
