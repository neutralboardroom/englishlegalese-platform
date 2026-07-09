
-- EnglishLegalese v1.18.0 initial persistent production schema
-- Safety rule: migrations must evolve production data. Do not drop/reset/reseed production.
-- Before running on production: back up database, test on staging copy, verify rollback plan.

create extension if not exists pgcrypto;

create table if not exists users (
  id text primary key default ('EL-USER-' || gen_random_uuid()::text),
  email text unique,
  full_name text not null,
  role text not null check (role in ('student','teacher','employer','staff','admin','owner')),
  status text not null default 'active',
  timezone text default 'America/New_York',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists organizations (
  id text primary key default ('EL-ORG-' || gen_random_uuid()::text),
  name text not null,
  organization_type text not null default 'employer',
  status text not null default 'active',
  billing_email text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists organization_members (
  id text primary key default ('EL-ORGMEM-' || gen_random_uuid()::text),
  organization_id text references organizations(id) on delete restrict,
  user_id text references users(id) on delete restrict,
  member_role text not null default 'learner',
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists teacher_profiles (
  id text primary key default ('EL-TEACHER-' || gen_random_uuid()::text),
  user_id text references users(id) on delete restrict,
  public_category text,
  payout_tier text,
  approved_specialties text[] not null default '{}',
  approval_status text not null default 'applied',
  marketing_status text not null default 'not_enabled',
  payout_notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists student_profiles (
  id text primary key default ('EL-STUDENT-' || gen_random_uuid()::text),
  user_id text references users(id) on delete restrict,
  goal text,
  level_label text,
  preferred_track text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists employer_profiles (
  id text primary key default ('EL-EMPLOYER-' || gen_random_uuid()::text),
  organization_id text references organizations(id) on delete restrict,
  plan_name text,
  reporting_privacy_level text not null default 'privacy_safe_progress_only',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists class_sessions (
  id text primary key,
  learner_name text not null,
  teacher_name text not null,
  organization_name text,
  student_user_id text references users(id) on delete restrict,
  teacher_user_id text references users(id) on delete restrict,
  organization_id text references organizations(id) on delete restrict,
  scheduled_at timestamptz,
  timezone text not null default 'America/New_York',
  calendar_provider text,
  calendar_event_id text,
  video_provider text not null default 'Google Meet',
  video_room_id text,
  video_join_url text,
  recording_consent_status text not null default 'no_recording_default',
  status text not null default 'requested',
  payment_credit_status text not null default 'pending_credit_or_payment',
  readiness_status text not null default 'needs_staff_review',
  closeout_status text not null default 'not_started',
  report_status text not null default 'not_ready',
  payout_status text not null default 'not_ready_until_closeout',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists saved_work_items (
  id text primary key,
  class_session_id text references class_sessions(id) on delete restrict,
  owner_user_id text references users(id) on delete restrict,
  owner_name text not null,
  work_type text not null,
  title text not null,
  status text not null default 'draft_saved',
  visibility text not null default 'student_teacher_only',
  content_preview text,
  object_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists homework_assignments (
  id text primary key default ('EL-HW-' || gen_random_uuid()::text),
  class_session_id text references class_sessions(id) on delete restrict,
  assigned_by_user_id text references users(id) on delete restrict,
  assigned_to_user_id text references users(id) on delete restrict,
  title text not null,
  instructions text,
  due_at timestamptz,
  status text not null default 'assigned',
  score numeric,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists assessment_attempts (
  id text primary key default ('EL-EXAM-' || gen_random_uuid()::text),
  class_session_id text references class_sessions(id) on delete restrict,
  user_id text references users(id) on delete restrict,
  assessment_type text not null,
  status text not null default 'in_progress',
  score numeric,
  answers jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists progress_reports (
  id text primary key default ('EL-REPORT-' || gen_random_uuid()::text),
  class_session_id text references class_sessions(id) on delete restrict,
  organization_id text references organizations(id) on delete restrict,
  user_id text references users(id) on delete restrict,
  report_type text not null,
  privacy_level text not null default 'privacy_safe_progress_only',
  status text not null default 'draft',
  report_data jsonb not null default '{}'::jsonb,
  pdf_object_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists credit_ledger (
  id text primary key default ('EL-CREDIT-' || gen_random_uuid()::text),
  organization_id text references organizations(id) on delete restrict,
  user_id text references users(id) on delete restrict,
  class_session_id text references class_sessions(id) on delete restrict,
  stripe_customer_id text,
  stripe_payment_intent_id text,
  entry_type text not null,
  credits_delta numeric not null default 0,
  amount_cents integer not null default 0,
  status text not null default 'pending',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists teacher_payouts (
  id text primary key default ('EL-PAYOUT-' || gen_random_uuid()::text),
  teacher_user_id text references users(id) on delete restrict,
  class_session_id text references class_sessions(id) on delete restrict,
  payout_tier text,
  amount_cents integer not null default 0,
  status text not null default 'held_until_closeout',
  approved_by_user_id text references users(id) on delete restrict,
  approved_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists teacher_marketing_campaigns (
  id text primary key default ('EL-CAMPAIGN-' || gen_random_uuid()::text),
  teacher_user_id text references users(id) on delete restrict,
  campaign_name text not null,
  channel text not null,
  tracking_code text not null unique,
  approval_status text not null default 'pending_staff_review',
  attributed_revenue_cents integer not null default 0,
  bonus_status text not null default 'not_eligible_until_paid_conversion',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists file_objects (
  id text primary key default ('EL-FILE-' || gen_random_uuid()::text),
  owner_user_id text references users(id) on delete restrict,
  class_session_id text references class_sessions(id) on delete restrict,
  object_key text not null,
  storage_provider text not null,
  file_name text,
  mime_type text,
  size_bytes bigint,
  consent_status text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists audit_log (
  id text primary key,
  actor text not null,
  action text not null,
  entity_type text not null,
  entity_id text,
  before_state jsonb,
  after_state jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists idx_class_sessions_scheduled_at on class_sessions(scheduled_at);
create index if not exists idx_class_sessions_status on class_sessions(status);
create index if not exists idx_saved_work_session on saved_work_items(class_session_id);
create index if not exists idx_homework_session on homework_assignments(class_session_id);
create index if not exists idx_reports_session on progress_reports(class_session_id);
create index if not exists idx_credit_ledger_session on credit_ledger(class_session_id);
create index if not exists idx_payouts_session on teacher_payouts(class_session_id);
create index if not exists idx_audit_entity on audit_log(entity_type, entity_id);
