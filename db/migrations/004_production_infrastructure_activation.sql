-- EnglishLegalese v1.21.0 production infrastructure activation layer
-- Additive only: do not drop, truncate, reset, or reseed production data.

create table if not exists integration_health_checks (
  id text primary key,
  service_name text not null,
  status text not null default 'unknown',
  mode text not null default 'not_configured',
  message text,
  checked_by text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists deployment_records (
  id text primary key,
  version text not null,
  environment text not null default 'production',
  commit_sha text,
  deployed_by text,
  predeploy_check_status text not null default 'pending',
  migration_status text not null default 'pending',
  postdeploy_smoke_status text not null default 'pending',
  rollback_plan text,
  data_safety_notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists backup_checkpoints (
  id text primary key,
  provider text not null,
  backup_type text not null default 'managed_database_backup',
  status text not null default 'pending_verification',
  verified_by text,
  verified_at timestamptz,
  restore_test_status text not null default 'not_tested',
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists production_launch_events (
  id text primary key,
  launch_gate text not null,
  status text not null default 'pending',
  owner_role text not null default 'owner',
  evidence text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_integration_health_checks_service_created on integration_health_checks(service_name, created_at desc);
create index if not exists idx_deployment_records_created on deployment_records(created_at desc);
create index if not exists idx_backup_checkpoints_created on backup_checkpoints(created_at desc);
create index if not exists idx_production_launch_events_gate on production_launch_events(launch_gate, status);
