# EnglishLegalese v1.78.0 — Provider & Classroom Readiness / No-Drift
All statements state candidate capabilities unless an exact production acceptance record proves otherwise.

## Existing provider foundation (v1.77.0) — not modified
- `src/productionServices.js` `createCalendarVideoSession`: authenticated privileged request; Google Calendar + Meet when credentials configured; Zoom account OAuth when configured; manually approved provider links; Teams/Tencent/VooV/DingTalk manual link readiness; no fabricated meeting link allowed on public website.
- `server.js` role-protects `POST /api/v119/calendar-video/create-session` for teacher/staff/admin/owner and provides the existing `/api/v134/calendar/session.ics` fallback. Existing unauthenticated legacy booking scaffolding is NOT declared a secure public booking pathway.
- Staff/owner must verify provider tenant/account, teacher scheduling authority, timezone, email sending and persistent class records before opening bookings. Never create invitations without explicit user action and valid teacher slot.

## New actual v1.78 UX
- Public homepage & teacher page promote **human-taught classes in online video classrooms**.
- Interactive provider and date/time chooser accurately displays the device's time zone, explicitly NOT a global time-zone conversion engine.
- ICS personal calendar hold exported only by the visitor, with `STATUS:TENTATIVE` and text `UNCONFIRMED`; no network, data persistence, reservations, emails, credentials, automatic meetings or external host calls.
- Six new second units and six learner goal-to-lesson pathways; 12 total lesson units/36 explained checks across first two levels, not falsely labelled complete full courses.
- Refrain from generic 'placeholders' in visible learning design while retaining accurate status at final action. Prohibited: display dummy Join/Book/Paid buttons, invent credentials/times or promise teachers' immediate availability.

## Original owner rules
Canonical source `governance/ENGLISHLEGALESE_CANONICAL_RULE_REGISTER__v1.57.0.md` includes exactly EL-RGR-001 through EL-RGR-019 and EL-DUR-001 through EL-DUR-010. Do not rewrite, remove, or override. Owner draft-only outbound communication rule remains, no sending. Owner instructs maximum reasonable work across multiple product areas in one material release, no change for change sake, no destruction of current working UI.

## Tests / acceptance state
Source check `scripts/verify-v1780-classroom.js`. E2E browser `tests/v1780-browser.spec.js`. Real public site `tests/v1780-production.spec.js`. Release gate and actual acceptance **pending** at document creation.
