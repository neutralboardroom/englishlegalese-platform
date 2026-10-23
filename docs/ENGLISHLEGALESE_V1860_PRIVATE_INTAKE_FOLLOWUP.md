# EnglishLegalese Owner Intake Review — v1.86.0
Private staff operations; does not authorize public exposure of applicant names or emails.

1. Use `npm run intake:review` only from an authorized workstation with the dedicated `ENGLISHLEGALESE_INTAKE_DATABASE_URL` set. The script emits counts and anonymous references without personal contact fields. It is read-only.
2. Review each new enrollment or teacher application once each business day. Resolve individual contact details only in the authorized Neon workspace, not public GitHub issues or production logs.
3. Check form type, selected track, timezone/availability and existing correspondence. A submitted enrollment is not a confirmed seat. A teacher application is not a teaching offer.
4. Reply individually after review; track date, owner, last message, next follow-up and disposition in a protected owner-only workspace. Use no unsolicited promotional mailing or bulk messaging from form submissions.
5. If something needs follow-up, set a private reminder or calendar event using the applicant's legitimate interest and documented contact details. Confirm actual class capacity and instructor before promising a place.
6. Automatic email notifications are NOT on. Activate them only after production sender-domain, receiver, suppression, deliverability, privacy and failure-handling tests.
7. Records must stay in the correct EnglishLegalese Neon project; never connect other projects' databases or send private applicant data to third-party analytics.

Follow-up stages recommended for a future guarded database migration: new, needs-review, contacted, awaiting-response, scheduled, accepted, declined, closed, with last_contacted_at and next_followup_at.
