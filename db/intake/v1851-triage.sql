-- EnglishLegalese v1.85.1 candidate: additive, owner-only intake triage.
-- Apply ONLY on the designated EnglishLegalese intake database, after backup and owner approval.
-- No changes to applicants, bookings, payments, authentication, or other projects.
BEGIN;
CREATE TABLE IF NOT EXISTS englishlegalese_enrollment_triage (
 request_id uuid PRIMARY KEY REFERENCES englishlegalese_enrollment_requests(id) ON DELETE RESTRICT,
 status varchar(32) NOT NULL DEFAULT 'new'
   CHECK (status IN ('new','reviewing','awaiting_student','waitlisted','confirmed','closed')),
 next_action varchar(400) NOT NULL DEFAULT '',
 next_followup_at timestamptz NULL,
 assigned_owner varchar(80) NOT NULL DEFAULT 'owner',
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS englishlegalese_enrollment_triage_followup_idx
 ON englishlegalese_enrollment_triage(next_followup_at);
CREATE TABLE IF NOT EXISTS englishlegalese_teacher_triage (
 request_id uuid PRIMARY KEY REFERENCES englishlegalese_teacher_applications(id) ON DELETE RESTRICT,
 status varchar(32) NOT NULL DEFAULT 'new'
   CHECK (status IN ('new','screening','awaiting_teacher','interview','approved','declined','closed')),
 next_action varchar(400) NOT NULL DEFAULT '',
 next_followup_at timestamptz NULL,
 assigned_owner varchar(80) NOT NULL DEFAULT 'owner',
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS englishlegalese_teacher_triage_followup_idx
 ON englishlegalese_teacher_triage(next_followup_at);
CREATE TABLE IF NOT EXISTS englishlegalese_intake_triage_audit (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 kind varchar(12) NOT NULL CHECK (kind IN ('enrollment','teacher')),
 request_id uuid NOT NULL,
 previous_status varchar(32),
 next_status varchar(32) NOT NULL,
 action_summary varchar(400) NOT NULL DEFAULT '',
 operator_name varchar(80) NOT NULL,
 next_followup_at timestamptz,
 recorded_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS englishlegalese_intake_triage_audit_request_idx
 ON englishlegalese_intake_triage_audit(kind,request_id,recorded_at DESC);
COMMIT;
