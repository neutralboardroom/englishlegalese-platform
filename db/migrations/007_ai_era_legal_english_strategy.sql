-- EnglishLegalese v1.24.0
-- Additive AI-era Legal English strategy records.
-- This migration is intentionally non-destructive. It preserves existing student, teacher,
-- employer, classroom, payment, upload, report, certificate, AI, and admin data.

create table if not exists ai_era_curriculum_modules (
  id text primary key,
  track text not null,
  module_title text not null,
  audience text default 'students_teachers_employers',
  ai_translator_safety_focus text default 'Use AI as practice support, not final legal meaning.',
  teacher_review_required boolean default true,
  status text default 'active',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists ai_translator_safety_exercises (
  id text primary key,
  exercise_type text not null,
  title text not null,
  role_target text default 'student',
  prompt_text text not null,
  safety_note text default 'Practice only. Not legal advice, certified translation, or final legal meaning.',
  teacher_review_status text default 'teacher_review_recommended',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists ai_era_dashboard_signals (
  id text primary key,
  role text not null,
  signal_name text not null,
  signal_value text default null,
  next_action text default null,
  privacy_level text default 'role_safe_summary',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists ai_era_marketing_assets (
  id text primary key,
  asset_type text not null,
  audience text not null,
  title text not null,
  approved_copy text not null,
  approval_status text default 'staff_review_required',
  tracking_required boolean default true,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_ai_era_curriculum_modules_track on ai_era_curriculum_modules(track);
create index if not exists idx_ai_translator_safety_exercises_type on ai_translator_safety_exercises(exercise_type);
create index if not exists idx_ai_era_dashboard_signals_role on ai_era_dashboard_signals(role);
create index if not exists idx_ai_era_marketing_assets_audience on ai_era_marketing_assets(audience);
