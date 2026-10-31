-- HF34: additive, consent-only membership information requests; never grants entitlements or takes payment.
-- Stage and verify before production use. No account, subscription, invoice or active-seat state is created by an inquiry.
CREATE TABLE IF NOT EXISTS membership_interest_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 client_request_id uuid NOT NULL UNIQUE,
 request_kind text NOT NULL CHECK(request_kind IN ('individual','organization')),
 plan_code text NOT NULL CHECK(plan_code IN ('starter','plus','pro','guided','team','enterprise')),
 contact_name text NOT NULL CHECK(char_length(contact_name) BETWEEN 2 AND 120),
 contact_email text NOT NULL CHECK(char_length(contact_email) BETWEEN 6 AND 254),
 organization_name text CHECK(organization_name IS NULL OR char_length(organization_name) BETWEEN 2 AND 120),
 seat_count integer CHECK(seat_count IS NULL OR seat_count BETWEEN 1 AND 10000),
 preferred_term text NOT NULL CHECK(preferred_term IN ('monthly','annual')),
 consent_at timestamptz NOT NULL DEFAULT now(),
 status text NOT NULL DEFAULT 'new' CHECK(status IN ('new','reviewing','contacted','closed')),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK((request_kind='individual' AND plan_code IN ('starter','plus','pro','guided') AND seat_count IS NULL AND organization_name IS NULL)
    OR (request_kind='organization' AND plan_code IN ('team','enterprise') AND seat_count IS NOT NULL AND organization_name IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS membership_interest_requests_status_created_idx
 ON membership_interest_requests(status,created_at DESC);
COMMENT ON TABLE membership_interest_requests IS 'Prelaunch information inquiries only. No payment, enrollment, subscriptions or entitlements created. Owner review required; personal data private.';
