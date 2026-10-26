-- HF13 additive persistent self-paced drafts and immutable submissions. No drops or backfills.
create table if not exists self_paced_lesson_work (
 user_id text not null references users(id) on delete restrict,
 lesson_key text not null,
 lesson_title text not null,
 origin_path text not null,
 answers jsonb not null default '{}'::jsonb,
 status text not null default 'draft' check(status in ('draft','submitted')),
 revision integer not null default 1 check(revision>0),
 updated_at timestamptz not null default now(),
 submitted_at timestamptz,
 primary key(user_id,lesson_key)
);
create index if not exists idx_self_paced_recent on self_paced_lesson_work(user_id,updated_at desc);
create table if not exists self_paced_lesson_submissions (
 id bigint generated always as identity primary key,
 user_id text not null references users(id) on delete restrict,
 lesson_key text not null,
 lesson_title text not null,
 revision integer not null,
 answers jsonb not null,
 assigned_teacher_user_id text references users(id) on delete restrict,
 review_status text not null default 'pending_assignment' check(review_status in ('pending_assignment','awaiting_review','reviewed')),
 created_at timestamptz not null default now(),
 unique(user_id,lesson_key,revision)
);
create index if not exists idx_self_paced_teacher on self_paced_lesson_submissions(assigned_teacher_user_id,created_at desc);
create index if not exists idx_self_paced_student_sub on self_paced_lesson_submissions(user_id,created_at desc);
