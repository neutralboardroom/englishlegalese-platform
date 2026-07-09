-- EnglishLegalese v1.19.0 production services schema
-- Safe migration rule: only additive changes. Do not drop, truncate, reset, or reseed production tables.

create table if not exists password_credentials (
  id text primary key,
  user_id text not null references users(id) on delete restrict,
  password_hash text not null,
  password_reset_required boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists user_sessions (
  id text primary key,
  user_id text not null references users(id) on delete restrict,
  token_preview text,
  ip_address text,
  user_agent text,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create table if not exists payment_transactions (
  id text primary key,
  provider text not null default 'stripe',
  provider_session_id text,
  provider_payment_intent_id text,
  buyer_email text,
  user_id text references users(id) on delete restrict,
  organization_id text references organizations(id) on delete restrict,
  package_name text,
  amount_cents integer not null default 0,
  credits numeric not null default 0,
  status text not null default 'created',
  checkout_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists webhook_events (
  id text primary key,
  provider text not null,
  event_id text not null unique,
  event_type text not null,
  processed_status text not null default 'received',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create table if not exists email_notifications (
  id text primary key,
  recipient text not null,
  subject text not null,
  template text not null default 'generic',
  status text not null default 'queued',
  provider_message_id text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ai_interactions (
  id text primary key,
  user_id text references users(id) on delete restrict,
  class_session_id text references class_sessions(id) on delete restrict,
  mode text not null,
  prompt text not null,
  output text not null,
  configured_provider text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists integration_events (
  id text primary key,
  provider text not null,
  operation text not null,
  status text not null default 'requested',
  class_session_id text references class_sessions(id) on delete restrict,
  provider_event_id text,
  provider_room_id text,
  join_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_users_role on users(role);
create index if not exists idx_users_email on users(email);
create index if not exists idx_class_sessions_scheduled_at on class_sessions(scheduled_at);
create index if not exists idx_credit_ledger_user_org on credit_ledger(user_id, organization_id);
create index if not exists idx_payment_transactions_status on payment_transactions(status);
create index if not exists idx_webhook_events_type on webhook_events(event_type);
create index if not exists idx_ai_interactions_user on ai_interactions(user_id);
create index if not exists idx_file_objects_owner on file_objects(owner_user_id);
create index if not exists idx_audit_log_created_at on audit_log(created_at);
