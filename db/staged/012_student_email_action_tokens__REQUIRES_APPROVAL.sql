-- HF15: additive, approval-gated migration. Never run automatically on production.
-- Account-email actions are distinct from student class or marketing email.
-- Run on a reviewed staging Neon branch before separately authorized production migration.
CREATE TABLE IF NOT EXISTS student_email_action_tokens (
  id bigserial PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  purpose text NOT NULL CHECK (purpose IN ('verify','reset')),
  token_hash char(64) NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  provider_message_id text
);
CREATE INDEX IF NOT EXISTS student_email_action_user_time_idx
  ON student_email_action_tokens(user_id,purpose,created_at DESC);
CREATE INDEX IF NOT EXISTS student_email_action_active_idx
  ON student_email_action_tokens(expires_at) WHERE consumed_at IS NULL;
-- Existing users, credentials, verification records, lessons and sessions remain intact.
