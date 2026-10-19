-- v1.73.0: durable no-reset free-trial ledger. Additive; no deletion or reseeding.
create table if not exists ai_free_trial_uses (
  id bigint generated always as identity primary key,
  user_id text not null references users(id) on delete restrict,
  network_hash text not null,
  topic text not null,
  request_chars integer not null check(request_chars between 1 and 2500),
  created_at timestamptz not null default now()
);
create index if not exists ai_trial_uses_user_idx on ai_free_trial_uses(user_id);
create index if not exists ai_trial_uses_date_idx on ai_free_trial_uses(created_at);
create index if not exists ai_trial_uses_network_idx on ai_free_trial_uses(network_hash,created_at);
