-- EnglishLegalese v1.25.0
-- Additive AI-era operating flow records. Non-destructive: preserves all users, classes,
-- payments, uploads, reports, AI tutor records, teacher tools, employer records, and audit history.

create table if not exists ai_era_pathway_plans (
  id text primary key,
  role text not null,
  goal text not null,
  recommended_track text not null,
  ai_practice_action text default 'Practice with SmartTeacher AI before class.',
  teacher_review_action text default 'Bring this to your teacher for feedback.',
  employer_visibility text default 'private_to_learner_and_teacher_unless_employer_safe_summary',
  status text default 'active',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists teacher_review_handoffs (
  id text primary key,
  student_name text default null,
  teacher_name text default null,
  source_type text default 'smartteacher_ai_practice',
  practice_title text not null,
  review_reason text not null,
  confidentiality_status text default 'no_confidential_information_confirmed',
  review_status text default 'teacher_review_needed',
  class_session_id text default null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists employer_roi_snapshots (
  id text primary key,
  employer_name text not null,
  cohort_name text default null,
  reporting_period text default null,
  learners_active integer default 0,
  attendance_rate numeric default null,
  homework_completion_rate numeric default null,
  ai_translation_safety_progress numeric default null,
  professional_tone_progress numeric default null,
  speaking_confidence_progress numeric default null,
  privacy_status text default 'employer_safe_summary_only',
  recommended_next_training text default null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists confidentiality_checks (
  id text primary key,
  requester_role text default 'student',
  item_type text default 'ai_practice_or_upload',
  item_title text not null,
  contains_sensitive_info text default 'unknown',
  recommended_action text default 'Use anonymized or fictional text; ask teacher/staff before uploading sensitive information.',
  ai_use_status text default 'practice_only_not_legal_advice',
  status text default 'needs_review',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_ai_era_pathway_plans_role on ai_era_pathway_plans(role);
create index if not exists idx_teacher_review_handoffs_status on teacher_review_handoffs(review_status);
create index if not exists idx_employer_roi_snapshots_employer on employer_roi_snapshots(employer_name);
create index if not exists idx_confidentiality_checks_status on confidentiality_checks(status);
