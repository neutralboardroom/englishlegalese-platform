-- EnglishLegalese v1.22.0 — Seamless launch operations
-- Additive-only migration. Do not drop, truncate, reseed, or overwrite production data.

create table if not exists role_journey_events (
  id text primary key,
  role text not null default 'student',
  event_type text not null default 'journey_step',
  status text not null default 'open',
  next_action text not null default '',
  owner_role text not null default 'staff',
  related_entity_type text,
  related_entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists classroom_readiness_reviews (
  id text primary key,
  class_session_id text,
  readiness_status text not null default 'needs_review',
  payment_credit_status text not null default 'unchecked',
  calendar_status text not null default 'unchecked',
  video_status text not null default 'unchecked',
  saved_work_status text not null default 'unchecked',
  homework_status text not null default 'unchecked',
  report_status text not null default 'unchecked',
  payout_status text not null default 'not_ready',
  blocker_summary text not null default '',
  reviewed_by text not null default 'staff',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists teacher_marketing_assets (
  id text primary key,
  teacher_name text not null default 'Approved teacher',
  asset_type text not null default 'linkedin_post',
  channel text not null default 'LinkedIn',
  status text not null default 'draft_pending_staff_review',
  approved_copy text not null default '',
  tracking_code text,
  staff_notes text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists support_threads (
  id text primary key,
  requester_role text not null default 'student',
  requester_name text not null default 'Requester',
  topic text not null default 'general_support',
  priority text not null default 'normal',
  status text not null default 'open',
  summary text not null default '',
  assigned_to text not null default 'staff',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_role_journey_events_role_status on role_journey_events(role, status);
create index if not exists idx_classroom_readiness_reviews_session on classroom_readiness_reviews(class_session_id);
create index if not exists idx_teacher_marketing_assets_teacher_status on teacher_marketing_assets(teacher_name, status);
create index if not exists idx_support_threads_status_priority on support_threads(status, priority);
