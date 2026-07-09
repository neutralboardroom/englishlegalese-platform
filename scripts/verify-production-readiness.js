const requiredBeforeLiveUsers = [
  'DATABASE_URL',
  'SESSION_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'S3_BUCKET',
  'S3_REGION',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS',
  'OPENAI_API_KEY'
];

const optionalButRecommended = [
  'MAIL_FROM',
  'STRIPE_SUCCESS_URL',
  'STRIPE_CANCEL_URL',
  'S3_ENDPOINT',
  'ZOOM_USER_ID',
  'SMARTTEACHER_MODEL',
  'GOOGLE_CALENDAR_ID',
  'GOOGLE_CALENDAR_ACCESS_TOKEN',
  'ZOOM_ACCOUNT_ID',
  'ZOOM_CLIENT_ID',
  'ZOOM_CLIENT_SECRET',
  'TEAMS_ENABLED',
  'TENCENT_VOOV_ENABLED',
  'DINGTALK_ENABLED'
];

const missing = requiredBeforeLiveUsers.filter((name) => !process.env[name]);
const optionalMissing = optionalButRecommended.filter((name) => !process.env[name]);

console.log('EnglishLegalese production readiness check');
console.log('Required before real users:', requiredBeforeLiveUsers.length - missing.length, '/', requiredBeforeLiveUsers.length, 'configured');
if (missing.length) console.log('Missing required:', missing.join(', '));
if (optionalMissing.length) console.log('Optional missing:', optionalMissing.join(', '));
console.log('Safe deployment rule: deploy code only; never reset, truncate, seed over, or delete production data or object storage.');
console.log('Global access rule: EnglishLegalese internal calendar and manual/regional classroom links are required; Google Calendar/Meet and Zoom are optional provider integrations, not launch blockers.');

if (process.env.NODE_ENV === 'production' && missing.length) {
  console.error('Production launch blocked because required environment variables are missing.');
  process.exit(1);
}
