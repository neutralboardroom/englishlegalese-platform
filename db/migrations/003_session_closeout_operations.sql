
-- EnglishLegalese v1.20.0 session closeout and operations schema
-- Additive only. Do not drop, truncate, reset, or reseed production data.
-- Purpose: make every booking, class closeout, staff task, and notification preference persistent.

create table if not exists booking_requests (
  id text primary key default ('EL-BOOK-' || gen_random_uuid()::text),
  requester_user_id text references users(id) on delete restrict,
  organization_id text references organizations(id) on delete restrict,
  buyer_type text not null default 'student',
  requested_track text,
  preferred_teacher_user_id text references users(id) on delete restrict,
  preferred_video_provider text not null default 'Google Meet',
  preferred_time_windows jsonb not null default '[]'::jsonb,
  package_name text,
  credit_hold_status text not null default 'not_held',
  staff_status text not null default 'needs_review',
  source_tracking_code text,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists teacher_availability_blocks (
  id text primary key default ('EL-AVAIL-' || gen_random_uuid()::text),
  teacher_user_id text not null references users(id) on delete restrict,
  weekday integer check (weekday between 0 and 6),
  starts_at time,
  ends_at time,
  timezone text not null default 'America/New_York',
  availability_type text not null default 'available',
  video_provider_preference text not null default 'Google Meet',
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists class_session_closeouts (
  id text primary key default ('EL-CLOSEOUT-' || gen_random_uuid()::text),
  class_session_id text not null references class_sessions(id) on delete restrict,
  teacher_user_id text references users(id) on delete restrict,
  attendance_status text not null default 'not_marked',
  teacher_notes text,
  homework_status text not null default 'not_assigned',
  ai_practice_status text not null default 'not_assigned',
  report_refresh_status text not null default 'not_ready',
  credit_deduction_status text not null default 'not_deducted',
  payout_release_status text not null default 'held_until_review',
  staff_review_status text not null default 'needs_review',
  closeout_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists staff_tasks (
  id text primary key default ('EL-TASK-' || gen_random_uuid()::text),
  task_type text not null,
  priority text not null default 'normal',
  owner_role text not null default 'staff',
  title text not null,
  description text,
  related_entity_type text,
  related_entity_id text,
  status text not null default 'open',
  due_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists notification_preferences (
  id text primary key default ('EL-NOTIFY-' || gen_random_uuid()::text),
  user_id text not null references users(id) on delete restrict,
  channel text not null default 'email',
  event_key text not null,
  is_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, channel, event_key)
);

create index if not exists idx_booking_requests_status on booking_requests(staff_status, created_at);
create index if not exists idx_booking_requests_org on booking_requests(organization_id);
create index if not exists idx_availability_teacher on teacher_availability_blocks(teacher_user_id, weekday, status);
create index if not exists idx_closeouts_session on class_session_closeouts(class_session_id);
create index if not exists idx_closeouts_staff_review on class_session_closeouts(staff_review_status, created_at);
create index if not exists idx_staff_tasks_status_priority on staff_tasks(status, priority, due_at);
create index if not exists idx_notification_preferences_user on notification_preferences(user_id, event_key);
