# EnglishLegalese 1.86 Owner Intake Follow-Up: secure operating runbook
Status: private internal operating instructions, not a staffed inbox or proof that notifications were sent.

## Proven infrastructure and limitations
- Two durable PostgreSQL tables: englishlegalese_enrollment_requests and englishlegalese_teacher_applications.
- Public /learn/enroll/ and /learn/teach-with-us/ accept submission only if API is ready.
- Public /api/v1850/intake-status gives a readiness boolean, NOT personally identifiable records.
- No authenticated owner dashboard, no Resend intake alert, no auto-confirmation of bookings, no payment, and no automatic teacher assignment is asserted.
- Keep applicant names, email addresses, qualifications, and notes private; never introduce a public listing endpoint or embed secrets in frontend code.

## Daily owner checklist
1. Read row counts, latest created-at and request IDs using the private Neon connection; do not expose user records publicly.
2. Review new enrollment requests by program, format, schedule, and creation date. Confirm instructor availability and actual class capacity before promising a seat.
3. Review teaching applications by track, claimed qualifications, timezone and availability; request references and an actual demonstration outside public resources. Never publish an unverified instructor.
4. Contact applicants only through owner-approved email tools/verified sender; do not automatically disclose one person's application to other applicants.
5. Track action taken and response status in a secured owner-only workflow, never by editing raw production records without an approved migration and rollback.
6. For undeliverable applications or unsupported dates, send a clear correction only after the owner reviews.
7. Until explicit approval and end-to-end tests, continue to leave Stripe checkout and AI paid subscriptions off.

## Private read-only SQL
```sql
SELECT 'enrollment' AS category, COUNT(*) AS total, MAX(created_at) AS most_recent FROM englishlegalese_enrollment_requests
UNION ALL
SELECT 'teacher' AS category, COUNT(*) AS total, MAX(created_at) AS most_recent FROM englishlegalese_teacher_applications;
```
```sql
SELECT id, created_at, program, format, schedule_id
FROM englishlegalese_enrollment_requests ORDER BY created_at DESC LIMIT 25;
```
```sql
SELECT id, created_at, teaching_track, timezone
FROM englishlegalese_teacher_applications ORDER BY created_at DESC LIMIT 25;
```

## Next operational release
Build an authenticated owner-only review queue and reliable transactional alerts with explicit verified recipient, proven provider configuration, retry/dead-letter handling, suppression checks and repeatability. Test with fictional synthetic entries in controlled environment, then remove synthetic data by approved process. Never claim these features active before tests confirm production delivery.
