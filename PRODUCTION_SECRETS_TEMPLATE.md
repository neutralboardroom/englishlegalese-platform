# v1.54.0 Production Secrets Addendum

Add these in hosting environment settings only, never in the ZIP: `DATABASE_URL`, `SESSION_SECRET`, Stripe secret/webhook/price IDs, SMTP host/user/pass, object storage bucket/keys, `OPENAI_API_KEY`, optional Google/Zoom/Microsoft/Tencent/DingTalk credentials, and launch readiness flags such as `PUBLIC_BETA_MODE` and `MANUAL_CLASSROOM_LINK_FALLBACK`.

# Production Secrets Template

Use this file as a checklist only. Do not paste real secrets here. Store them in your hosting provider environment settings.

| Area | Required variables | Notes |
|---|---|---|
| App/Auth | `NODE_ENV`, `APP_BASE_URL`, `SESSION_SECRET`, `JWT_SECRET` | Use long random values for secrets. |
| Database | `DATABASE_URL`, `PGSSLMODE` | Production must use managed PostgreSQL. |
| Stripe | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, price IDs | Webhook secret must match the endpoint configured in Stripe. |
| Storage | `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, optional `S3_ENDPOINT` | R2/S3-compatible storage is fine. |
| Email | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `FROM_EMAIL` | Needed for class and report notifications. |
| Google | `GOOGLE_CALENDAR_ID`, `GOOGLE_CALENDAR_ACCESS_TOKEN`, OAuth client values | Meet is default class video provider. |
| Zoom | `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET` | Approved alternate provider. |
| SmartTeacher AI / ChatGPT-only | `OPENAI_API_KEY`, optional `SMARTTEACHER_MODEL` | Server-side only. OpenAI/ChatGPT is the only AI vendor for SmartTeacher in v1.32. Never expose keys in frontend or ZIP. |
| Owner bootstrap | `OWNER_EMAIL`, `OWNER_PASSWORD`, `OWNER_NAME` | Use once, then rotate/clear temporary password. |


## v1.23 note
Run the v1.23 operations smoke tests after migrations so action center, video room events, SmartTeacher AI interaction records, and teacher marketing attribution are available before live classroom users.


## v1.32 ChatGPT-Only SmartTeacher AI Rule

SmartTeacher AI, AI tutors, AI teaching assistants, AI classroom tools, employer-report helpers, staff assistants, and teacher marketing assistants should use **ChatGPT/OpenAI only**. Production should require one AI vendor key: `OPENAI_API_KEY`. Do not add separate Gemini, Claude, Grok, Anthropic, xAI, Google AI, or other AI-vendor keys to this platform unless Roger later explicitly changes the strategy.

Use `SMARTTEACHER_MODEL` only as an optional model-name setting. It is not a second vendor or second API key.

# v1.34 Calendar interop: no required extra secret for ICS/manual calendar fallback.
# Optional future calendar connectors may use MICROSOFT_GRAPH_* or CALDAV_* credentials. Google Calendar remains optional only.


## v1.36 translation-support note
Do not add a separate `TRANSLATION_VENDOR_API_KEY` for v1.36. Native-language explanations should use the existing server-side `OPENAI_API_KEY` SmartTeacher AI layer unless a later approved business case changes this.


## v1.37 SmartTeacher / Help Navigator note

No additional AI vendor key is required for guided help, native-language explanations, or Translation Bridge support. Use the existing server-side `OPENAI_API_KEY` for ChatGPT/OpenAI-only SmartTeacher AI. Do not put API keys in browser code or ZIP files.
