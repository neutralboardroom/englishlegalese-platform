-- EnglishLegalese v1.85.0: dedicated, additive intake schema only.
-- Apply ONLY to a separately provisioned EnglishLegalese database.
-- Never run against other projects' DATABASE_URL or shared platform databases.
BEGIN;
CREATE TABLE IF NOT EXISTS englishlegalese_enrollment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_request_id uuid NOT NULL UNIQUE,
  full_name varchar(120) NOT NULL CHECK (char_length(btrim(full_name)) BETWEEN 2 AND 120),
  email varchar(254) NOT NULL CHECK (char_length(email) BETWEEN 6 AND 254),
  program varchar(16) NOT NULL CHECK (program IN ('legal','business','investor')),
  format varchar(16) NOT NULL CHECK (format IN ('group','private')),
  schedule_id varchar(100) NOT NULL,
  note varchar(500) NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS englishlegalese_enrollment_created_at_idx ON englishlegalese_enrollment_requests(created_at);
CREATE TABLE IF NOT EXISTS englishlegalese_teacher_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_request_id uuid NOT NULL UNIQUE,
  full_name varchar(120) NOT NULL CHECK (char_length(btrim(full_name)) BETWEEN 2 AND 120),
  email varchar(254) NOT NULL CHECK (char_length(email) BETWEEN 6 AND 254),
  teaching_track varchar(16) NOT NULL CHECK (teaching_track IN ('legal','business','investor','multiple')),
  qualifications varchar(2500) NOT NULL CHECK (char_length(qualifications) BETWEEN 20 AND 2500),
  timezone varchar(100) NOT NULL,
  weekly_availability varchar(500) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS englishlegalese_teacher_created_at_idx ON englishlegalese_teacher_applications(created_at);
COMMIT;
