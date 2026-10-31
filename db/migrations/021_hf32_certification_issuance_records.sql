-- HF32: add-only specialist certificate issuance data. NEVER auto-apply in production.
-- Requires a reviewed backup, staging rehearsal, explicit owner approval, assessor training and runtime enablement.
CREATE TABLE IF NOT EXISTS certification_assessments (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 candidate_user_id text NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
 track text NOT NULL CHECK (track IN ('legal','business')),
 target_level text NOT NULL CHECK (target_level IN ('A1','A2','B1','B2','C1','C2')),
 status text NOT NULL DEFAULT 'requested' CHECK (status IN
 ('requested','scheduled','supervised','under_review','approved','rejected','appealed','void')),
 candidate_consent_at timestamptz NOT NULL,
 supervised_at timestamptz,
 proctor_user_id text REFERENCES users(id) ON DELETE RESTRICT,
 identity_verified_at timestamptz,
 identity_verified_by text REFERENCES users(id) ON DELETE RESTRICT,
 unseen_prompt_set_id text,
 protected_evidence_reference text,
 supervision_attested boolean NOT NULL DEFAULT false,
 authorized_tools_attested boolean NOT NULL DEFAULT false,
 accommodations_reviewed boolean NOT NULL DEFAULT false,
 rubric_version text,
 examiner_decision_at timestamptz,
 approved_by text REFERENCES users(id) ON DELETE RESTRICT,
 approved_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK (approved_at IS NULL OR approved_by IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS certification_assessments_candidate_idx
 ON certification_assessments(candidate_user_id,created_at DESC);
CREATE TABLE IF NOT EXISTS certification_assessor_reviews (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 assessment_id uuid NOT NULL REFERENCES certification_assessments(id) ON DELETE RESTRICT,
 assessor_user_id text NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
 rubric_version text NOT NULL,
 listening_score integer NOT NULL CHECK (listening_score BETWEEN 0 AND 4),
 speaking_score integer NOT NULL CHECK (speaking_score BETWEEN 0 AND 4),
 reading_score integer NOT NULL CHECK (reading_score BETWEEN 0 AND 4),
 writing_score integer NOT NULL CHECK (writing_score BETWEEN 0 AND 4),
 interaction_score integer NOT NULL CHECK (interaction_score BETWEEN 0 AND 4),
 evidence_reference text NOT NULL,
 recommended_pass boolean NOT NULL,
 conflict_declared boolean NOT NULL,
 submitted_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(assessment_id,assessor_user_id)
);
CREATE TABLE IF NOT EXISTS certification_credentials (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 assessment_id uuid NOT NULL UNIQUE REFERENCES certification_assessments(id) ON DELETE RESTRICT,
 candidate_user_id text NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
 track text NOT NULL CHECK (track IN ('legal','business')),
 awarded_level text NOT NULL CHECK (awarded_level IN ('A1','A2','B1','B2','C1','C2')),
 serial text NOT NULL UNIQUE,
 verification_code_sha256 text NOT NULL CHECK (length(verification_code_sha256)=64),
 issued_at timestamptz NOT NULL DEFAULT now(),
 issuer_user_id text NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
 public_verify_consent boolean NOT NULL DEFAULT false,
 revoked_at timestamptz,
 revoked_by text REFERENCES users(id) ON DELETE RESTRICT,
 revocation_reason text,
 CHECK ((revoked_at IS NULL AND revoked_by IS NULL AND revocation_reason IS NULL)
 OR (revoked_at IS NOT NULL AND revoked_by IS NOT NULL AND length(revocation_reason)>0))
);
CREATE INDEX IF NOT EXISTS certification_credentials_candidate_idx
 ON certification_credentials(candidate_user_id,issued_at DESC);
CREATE TABLE IF NOT EXISTS certification_appeals (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 assessment_id uuid NOT NULL REFERENCES certification_assessments(id) ON DELETE RESTRICT,
 candidate_user_id text NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
 reason text NOT NULL CHECK (length(reason) BETWEEN 20 AND 2000),
 status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','upheld','reassessment','denied')),
 decided_by text REFERENCES users(id) ON DELETE RESTRICT,
 decision_reason text,
 created_at timestamptz NOT NULL DEFAULT now(),
 decided_at timestamptz,
 CHECK ((decided_at IS NULL AND decided_by IS NULL)
 OR (decided_at IS NOT NULL AND decided_by IS NOT NULL AND length(decision_reason)>0))
);
CREATE TABLE IF NOT EXISTS certification_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 assessment_id uuid REFERENCES certification_assessments(id) ON DELETE RESTRICT,
 credential_id uuid REFERENCES certification_credentials(id) ON DELETE RESTRICT,
 actor_user_id text NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
 event_type text NOT NULL CHECK (event_type IN
 ('assessment_requested','supervision_recorded','assessor_review_submitted','assessment_approved',
  'credential_issued','credential_revoked','appeal_submitted','appeal_decided')),
 summary jsonb NOT NULL DEFAULT '{}'::jsonb,
 recorded_at timestamptz NOT NULL DEFAULT now(),
 CHECK (assessment_id IS NOT NULL OR credential_id IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS certification_events_assessment_idx
 ON certification_events(assessment_id,recorded_at DESC);
-- Stored evidence references must point to access-controlled, retained human-supervised evidence.
-- No public reveal of identity documents, candidate work, assessor notes, or scoring.
