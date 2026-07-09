#!/usr/bin/env node
const { PersistentStore } = require('../src/persistence');
const { configured } = require('../src/productionServices');

const strict = process.argv.includes('--strict');
const timeoutMs = Number(process.env.LIVE_CHECK_TIMEOUT_MS || 8000);
function timeoutPromise(label) { return new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs)); }
async function withTimeout(label, fn) { return Promise.race([fn(), timeoutPromise(label)]); }
function status(name, configured, ok, message, extra = {}) { return { service: name, configured, ok, message, ...extra }; }
async function checkPostgres() {
  if (!process.env.DATABASE_URL) return status('postgres', false, false, 'DATABASE_URL is not set.');
  try { const store = new PersistentStore(); const health = await withTimeout('postgres', () => store.health()); return status('postgres', health.mode === 'postgres', health.mode === 'postgres', `Persistence mode: ${health.mode}`, { mode: health.mode }); }
  catch (e) { return status('postgres', true, false, e.message); }
}
async function checkStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return status('stripe', false, false, 'STRIPE_SECRET_KEY is not set.');
  if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_')) return status('stripe', true, false, 'STRIPE_SECRET_KEY does not look like a Stripe secret key.');
  if (!process.env.CHECK_EXTERNAL_APIS) return status('stripe', true, true, 'Key shape present. Set CHECK_EXTERNAL_APIS=1 to call Stripe account endpoint.');
  try { const r = await withTimeout('stripe', () => fetch('https://api.stripe.com/v1/account', { headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` } })); return status('stripe', true, r.ok, `Stripe account endpoint returned ${r.status}.`); }
  catch (e) { return status('stripe', true, false, e.message); }
}
async function checkObjectStorage() {
  const has = ['S3_BUCKET','S3_ACCESS_KEY_ID','S3_SECRET_ACCESS_KEY'].every(k => process.env[k]);
  return status('object_storage', has, has, has ? 'S3/R2 environment variables are present. Use upload presign smoke test before launch.' : 'S3_BUCKET, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY are required.');
}
async function checkSmtp() {
  const has = ['SMTP_HOST','SMTP_USER','SMTP_PASS'].every(k => process.env[k]);
  if (!has) return status('smtp', false, false, 'SMTP_HOST, SMTP_USER, and SMTP_PASS are required.');
  try { const nodemailer = require('nodemailer'); const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: String(process.env.SMTP_SECURE || 'false') === 'true', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } }); if (!process.env.CHECK_EXTERNAL_APIS) return status('smtp', true, true, 'SMTP variables present. Set CHECK_EXTERNAL_APIS=1 to call verify().'); await withTimeout('smtp', () => transport.verify()); return status('smtp', true, true, 'SMTP verify passed.'); }
  catch(e) { return status('smtp', true, false, e.message); }
}
async function checkInternalClassroomFallback() {
  return status('internal_calendar_manual_link', true, true, 'EnglishLegalese internal class-session calendar and manual/regional classroom link fallback are available without external provider credentials.');
}
async function checkGoogle() {
  const has = ['GOOGLE_CALENDAR_ID','GOOGLE_CALENDAR_ACCESS_TOKEN'].every(k => process.env[k]);
  if (!has) return status('google_calendar_meet', false, false, 'Google Calendar/Meet variables are optional; use only where Google services are accessible.');
  if (!process.env.CHECK_EXTERNAL_APIS) return status('google_calendar_meet', true, true, 'Google calendar variables present. Set CHECK_EXTERNAL_APIS=1 to call Calendar API.');
  try { const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(process.env.GOOGLE_CALENDAR_ID)}`; const r = await withTimeout('google', () => fetch(url, { headers: { Authorization: `Bearer ${process.env.GOOGLE_CALENDAR_ACCESS_TOKEN}` } })); return status('google_calendar_meet', true, r.ok, `Google Calendar endpoint returned ${r.status}.`); }
  catch(e) { return status('google_calendar_meet', true, false, e.message); }
}
async function checkZoom() {
  const has = ['ZOOM_ACCOUNT_ID','ZOOM_CLIENT_ID','ZOOM_CLIENT_SECRET'].every(k => process.env[k]);
  return status('zoom', has, has, has ? 'Zoom Server-to-Server OAuth variables are present. Run a session creation smoke test before enabling Zoom for users.' : 'Zoom variables are optional because EnglishLegalese can use manual/regional classroom links, Tencent/VooV, DingTalk, Teams, or Google where available.');
}
async function checkOpenAI() {
  const has = Boolean(process.env.OPENAI_API_KEY);
  if (!has) return status('openai', false, false, 'OPENAI_API_KEY is required for live SmartTeacher AI.');
  if (!process.env.CHECK_EXTERNAL_APIS) return status('openai', true, true, 'OpenAI key present. Set CHECK_EXTERNAL_APIS=1 to call models endpoint.');
  try { const r = await withTimeout('openai', () => fetch('https://api.openai.com/v1/models', { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } })); return status('openai', true, r.ok, `OpenAI models endpoint returned ${r.status}.`); }
  catch(e) { return status('openai', true, false, e.message); }
}
async function main() {
  const config = configured();
  const checks = await Promise.all([checkPostgres(), checkStripe(), checkObjectStorage(), checkSmtp(), checkInternalClassroomFallback(), checkGoogle(), checkZoom(), checkOpenAI()]);
  const required = ['postgres','stripe','object_storage','smtp','internal_calendar_manual_link','openai'];
  const blockers = checks.filter(c => required.includes(c.service) && !c.ok).map(c => `${c.service}: ${c.message}`);
  const result = { ok: blockers.length === 0, strict, external_api_calls: Boolean(process.env.CHECK_EXTERNAL_APIS), configured_flags: config, checks, blockers, timestamp: new Date().toISOString() };
  console.log(JSON.stringify(result, null, 2));
  if (strict && blockers.length) process.exit(1);
}
main().catch(err => { console.error(err); process.exit(1); });
