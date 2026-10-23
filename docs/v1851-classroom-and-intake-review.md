# EnglishLegalese — classroom enrollment and instructor application review (v1.85.1)

This is a process reference, not an active notification, payment, teacher scheduling or applicant acceptance system. The existing intake API stores requests in separate EnglishLegalese Neon tables with validation and origin guards. **Never publish applicant or student contact details, API tokens, secure class links or original records.**

## Enrollment processing (authorized operator only)
1. Check the secure EnglishLegalese production Neon project for new records ordered by created_at (read-only). Track receipt ID, submit time, requested Legal/Business/Investor track, group/private format, and request status separately from the public data store.
2. Check actual class capacity, true teacher availability and calendar conflict before confirming any class place. The publicly advertised two 16-week schedules are owner calendar events, not proof of a confirmed student seat.
3. Check whether the applicant's requested group track matches the schedule; Investor English is a specialization of Business English. Confirm any prerequisites, class delivery method and teacher assignment individually.
4. Do not collect card numbers in the intake form. Stripe remains disabled. Do not mark payment, class joining or customer identity confirmed by submitting a request.
5. Draft any reply for explicit owner approval under outgoing-email rules. No independent auto-send or marketing mail.

## Instructor application screening (authorized operator only)
1. Read only new application rows through a protected connected Neon interface, never a public web endpoint or repository export.
2. Evaluate the teaching track, verifiable relevant qualifications, subject-specific competence and ability to teach English rather than give legal or investment advice.
3. Request a 50-minute demonstration using fictional material, using a scorecard (0–2 per skill) for objectives, accuracy, interactive teaching, feedback, privacy and professionalism.
4. Do not advertise applicants as hired, publish identities, schedule classes on their behalf or share student data until screening, legal work eligibility and explicit owner approval are complete.

## Secure read-only operational queries
Use only within an authenticated Neon connection, never through a public user-facing route:

```sql
SELECT id, created_at, program, format, schedule_id FROM englishlegalese_enrollment_requests ORDER BY created_at DESC LIMIT 25;
SELECT id, created_at, teaching_track FROM englishlegalese_teacher_applications ORDER BY created_at DESC LIMIT 25;
```

Review follow-ups stay **pending** until processed. Emails and other outward actions require explicit separate approval. Do not automatically delete applicants or student records while testing.
