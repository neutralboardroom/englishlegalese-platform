-- EnglishLegalese v1.23.0 — Integrated operating console and continuity records
-- Additive-only migration. Do not drop, truncate, reseed, or overwrite production data.

create table if not exists action_center_items (
  id text primary key,
  role text not null default 'staff',
  title text not null default 'Next action',
  status text not null default 'open',
  priority text not null default 'normal',
  next_action text not null default '',
  related_entity_type text,
  related_entity_id text,
  due_at timestamptz,
  owner_name text not null default 'EnglishLegalese staff',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists video_room_events (
  id text primary key,
  class_session_id text,
  provider text not null default 'Google Meet',
  event_type text not null default 'room_status_update',
  status text not null default 'pending',
  join_url text,
  calendar_event_id text,
  recording_consent_status text not null default 'not_recorded_by_default',
  notes text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ai_tutor_interactions (
  id text primary key,
  requester_role text not null default 'student',
  mode text not null default 'student_tutor',
  prompt_summary text not null default '',
  response_summary text not null default '',
  class_session_id text,
  privacy_status text not null default 'language_training_only',
  legal_advice_boundary_status text not null default 'boundary_applied',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists marketing_lead_attribution (
  id text primary key,
  teacher_name text not null default 'Approved teacher',
  source_channel text not null default 'teacher_referral_link',
  tracking_code text,
  lead_type text not null default 'student',
  conversion_status text not null default 'lead_captured',
  package_name text,
  potential_value numeric(12,2),
  bonus_review_status text not null default 'not_ready_until_paid_conversion',
  staff_notes text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_action_center_items_role_status on action_center_items(role, status, priority);
create index if not exists idx_video_room_events_session_status on video_room_events(class_session_id, status);
create index if not exists idx_ai_tutor_interactions_role_mode on ai_tutor_interactions(requester_role, mode);
create index if not exists idx_marketing_lead_attribution_teacher_status on marketing_lead_attribution(teacher_name, conversion_status);
