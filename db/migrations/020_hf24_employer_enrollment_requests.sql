-- HF24: additive, fail-closed employer enrollment requests, awaiting staff confirmation.
-- No user accounts created, no employee emails dispatched, no charges, no enrollment confirmed.
CREATE TABLE IF NOT EXISTS employer_enrollment_requests (
 id uuid primary key default gen_random_uuid(),
 organization_id text not null references organizations(id) on delete restrict,
 requester_user_id text not null references users(id) on delete restrict,
 client_request_id uuid not null,
 program text not null check (program in ('legal','business','investor','complete')),
 package_sessions integer not null check (package_sessions in (8,16,24,48)),
 employee_user_ids text[] not null,
 employee_count integer not null check (employee_count between 1 and 100),
 estimated_total_cents integer not null check (estimated_total_cents>=0),
 discount_percent integer not null default 0 check (discount_percent in (0,5,10,15)),
 preferred_time_window text,
 staff_status text not null default 'needs_review' check (staff_status in ('needs_review','schedule_confirmed','cancelled')),
 payment_status text not null default 'not_requested' check (payment_status in ('not_requested','checkout_pending','paid','refunded')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(requester_user_id,client_request_id)
);
CREATE INDEX IF NOT EXISTS idx_employer_enrollment_org_created ON employer_enrollment_requests(organization_id,created_at DESC);
-- A separate, explicitly audited payment activation process must follow provider/webhook verification.
