-- v1.73 account-verified three-reply free trial, additive and safe to rerun
create table if not exists ai_trial_accounts (user_id text primary key references users(id) on delete restrict,verified_at timestamptz,used_count integer not null default 0 check(used_count>=0 and used_count<=3),code_hash text,code_expires_at timestamptz,code_attempts integer not null default 0,last_code_sent_at timestamptz,updated_at timestamptz not null default now());
create index if not exists idx_ai_trial_verification_expires on ai_trial_accounts(code_expires_at) where verified_at is null;
