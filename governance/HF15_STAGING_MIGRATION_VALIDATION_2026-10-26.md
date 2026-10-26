# EnglishLegalese HF15 — Staging-only migration validation
**Date:** 2026-10-26
**Status:** STAGING SCHEMA VERIFIED. PRODUCTION CHANGE NOT APPROVED. HF15 NOT LIVE.

## Exact configuration
- Neon project: `floral-darkness-05019336` (`englishlegalese-production`).
- Production/default Neon branch: `br-mute-forest-arfkpy2w` (unchanged).
- Isolated staging Neon branch: `br-silent-shape-armnxzxf` (`hf15-identity-staging-2026-10-26`).
- Source SQL is `db/staged/012_student_email_action_tokens__REQUIRES_APPROVAL.sql`; **not** part of automatic `db/migrations/`.
- SQL executed only against the staging branch as a single transaction: additive tokens table + 2 indexes.

## Evidence actually checked
- Staging `student_email_action_tokens` exists with columns `id,user_id,purpose,token_hash,created_at,expires_at,consumed_at,provider_message_id`.
- Staging constraints: unique 64-character token hash, `purpose IN ('verify','reset')`, restrict-delete foreign key to `users(id)`, not-null checks; indexes for user/time and unconsumed token expiration.
- Staging counts at validation time: users=0, password_credentials=0, lesson_work=0, lesson_submissions=0, action_tokens=0.
- Production counts at validation time: users=0, password_credentials=0, lesson_work=0, lesson_submissions=0; `to_regclass('public.student_email_action_tokens')` was NULL, meaning **no HF15 production migration**.
- The staged schema is valid. Token replay, expiry, browser security, provider delivery and session logout still require full qualification; staging schema validation alone is not production acceptance.

## Restrictions and next gates
1. Leave production Neon branch unchanged until **separate approval** of HF15 SQL application after staging security/browser qualification.
2. Verify the Render HTTPS sender configuration without exposing secret values; no actual emails from CI/testing. No unsolicited marketing.
3. Obtain green exact-head independent CI and mocked verification/reset/role-isolation/browser regressions; resolve failures, don't counterfeit proof.
4. Only then evaluate merge/deploy, followed by actual apex/www and Render live commit verification.
5. Preserve current live rollback `ec9b032359ceb2fd9d1e176ee932bf82af789504` unless fresh evidence shows a newer qualified live version.

**Important:** The staging branch is a database branch, not a public application deployment. No student data was migrated, modified or copied outside Neon branch snapshot semantics. No emails sent by staging validation.
