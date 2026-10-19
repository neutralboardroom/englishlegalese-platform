-- v1.73 additive account email verification, never drop existing records.
create table if not exists ai_trial_email_verifications (
 user_id text primary key references users(id) on delete restrict,
 token_hash text,
 expires_at timestamptz,
 verified_at timestamptz
);
create unique index if not exists ai_trial_verify_token_idx on ai_trial_email_verifications(token_hash) where token_hash is not null;
