const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SERVICE_DATA_DIR = process.env.LOCAL_SERVICE_DATA_DIR || path.join(__dirname, '..', 'data');
const SERVICE_DATA_PATH = process.env.LOCAL_SERVICE_JSON_DB || path.join(SERVICE_DATA_DIR, 'v119-local-service-store.json');

const ROLES = ['student', 'teacher', 'employer', 'staff', 'admin', 'owner'];
const ROLE_PERMISSIONS = {
  student: ['read:self', 'write:saved_work', 'read:classroom', 'use:ai'],
  teacher: ['read:students_assigned', 'write:class_notes', 'write:homework', 'use:ai', 'write:marketing_campaign'],
  employer: ['read:organization_progress', 'read:credits', 'write:roster'],
  staff: ['read:ops', 'write:schedule', 'write:reports', 'write:payout_review', 'write:campaign_review'],
  admin: ['read:ops', 'write:all', 'admin:users', 'admin:payments', 'admin:integrations'],
  owner: ['read:ops', 'write:all', 'admin:users', 'admin:payments', 'admin:integrations', 'owner:financials']
};

function nowIso() { return new Date().toISOString(); }
function id(prefix) { return `${prefix}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`; }
function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }
function readJson(file, fallback) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; } }
function writeJson(file, data) { ensureDir(path.dirname(file)); fs.writeFileSync(file, JSON.stringify(data, null, 2)); }
function safeString(value, max = 2000) { return String(value || '').slice(0, max); }

function getLocalStore() {
  ensureDir(SERVICE_DATA_DIR);
  const seed = {
    meta: { created_at: nowIso(), warning: 'Development-only service store. Production uses PostgreSQL, object storage, Stripe, email, Google/Zoom and OpenAI credentials.' },
    users: [],
    password_credentials: [],
    user_sessions: [],
    payment_transactions: [],
    webhook_events: [],
    file_objects: [],
    email_notifications: [],
    ai_interactions: [],
    integration_events: [],
    progress_reports: []
  };
  if (!fs.existsSync(SERVICE_DATA_PATH)) writeJson(SERVICE_DATA_PATH, seed);
  return readJson(SERVICE_DATA_PATH, seed);
}
function setLocalStore(store) { store.meta = store.meta || {}; store.meta.updated_at = nowIso(); writeJson(SERVICE_DATA_PATH, store); }

function passwordHash(password, salt = crypto.randomBytes(16).toString('hex')) {
  const iterations = Number(process.env.PASSWORD_HASH_ITERATIONS || 210000);
  const hash = crypto.pbkdf2Sync(String(password || ''), salt, iterations, 32, 'sha256').toString('hex');
  return `pbkdf2_sha256$${iterations}$${salt}$${hash}`;
}
function verifyPassword(password, stored) {
  const [algo, iter, salt, expected] = String(stored || '').split('$');
  if (algo !== 'pbkdf2_sha256' || !iter || !salt || !expected) return false;
  const actual = crypto.pbkdf2Sync(String(password || ''), salt, Number(iter), 32, 'sha256').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
}

function signToken(payload) {
  const secret = process.env.SESSION_SECRET || process.env.JWT_SECRET || 'dev-only-change-me';
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000) + (Number(process.env.SESSION_TTL_SECONDS || 60*60*24*7)) })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}
function verifyToken(token) {
  const secret = process.env.SESSION_SECRET || process.env.JWT_SECRET || 'dev-only-change-me';
  const parts = String(token || '').split('.');
  if (parts.length !== 3) return null;
  const expected = crypto.createHmac('sha256', secret).update(`${parts[0]}.${parts[1]}`).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(parts[2]), Buffer.from(expected))) return null;
  const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  if (payload.exp && payload.exp < Math.floor(Date.now()/1000)) return null;
  return payload;
}

function requireEnv(names) { return names.every((name) => Boolean(process.env[name])); }
function configured() {
  return {
    postgres: Boolean(process.env.DATABASE_URL),
    auth_secret: Boolean(process.env.SESSION_SECRET || process.env.JWT_SECRET),
    stripe: requireEnv(['STRIPE_SECRET_KEY']),
    stripe_webhook: requireEnv(['STRIPE_WEBHOOK_SECRET']),
    object_storage: requireEnv(['S3_BUCKET', 'S3_REGION', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY']),
    smtp: requireEnv(['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS']),
    internal_calendar: true,
    manual_classroom_link: true,
    google_calendar: requireEnv(['GOOGLE_CALENDAR_ID', 'GOOGLE_CALENDAR_ACCESS_TOKEN']),
    zoom: requireEnv(['ZOOM_ACCOUNT_ID', 'ZOOM_CLIENT_ID', 'ZOOM_CLIENT_SECRET']),
    teams: Boolean(process.env.TEAMS_ENABLED || process.env.MICROSOFT_TENANT_ID),
    tencent_voov: Boolean(process.env.TENCENT_VOOV_ENABLED || process.env.TENCENT_MEETING_ENABLED),
    dingtalk: Boolean(process.env.DINGTALK_ENABLED),
    openai: requireEnv(['OPENAI_API_KEY'])
  };
}

class ProductionServices {
  constructor(persistentStore) {
    this.persistentStore = persistentStore;
  }
  mode() { return this.persistentStore?.mode?.() === 'postgres' ? 'postgres' : 'local_json_development_only'; }
  async query(sql, params = []) {
    if (this.mode() !== 'postgres') throw new Error('PostgreSQL is not connected. Set DATABASE_URL for production mode.');
    return this.persistentStore.pool.query(sql, params);
  }
  async audit(action, details = {}, req = null) {
    try {
      await this.persistentStore.addAuditLog({
        actor: details.actor || details.actor_email || details.user_id || 'system',
        action,
        entity_type: details.entity_type || 'platform_service',
        entity_id: details.entity_id || null,
        after_state: details,
        ip_address: req?.ip || null,
        user_agent: req?.get?.('user-agent') || null
      });
    } catch (_) {}
  }

  async registerUser({ email, password, full_name, role = 'student', organization_name = null }, req = null) {
    email = String(email || '').trim().toLowerCase();
    role = ROLES.includes(role) ? role : 'student';
    if (!email || !password || !full_name) throw new Error('Email, password, and full name are required.');
    const user = { id: id('EL-USER'), email, full_name: safeString(full_name, 160), role, status: 'active', organization_name, created_at: nowIso(), updated_at: nowIso() };
    const credential = { id: id('EL-CRED'), user_id: user.id, password_hash: passwordHash(password), created_at: nowIso(), updated_at: nowIso() };
    if (this.mode() === 'postgres') {
      const exists = await this.query('select id from users where email=$1', [email]);
      if (exists.rows.length) throw new Error('That email is already registered.');
      await this.query('insert into users (id,email,full_name,role,status,metadata,created_at,updated_at) values ($1,$2,$3,$4,$5,$6::jsonb,$7,$8)', [user.id, email, user.full_name, role, 'active', JSON.stringify({ organization_name }), user.created_at, user.updated_at]);
      await this.query('insert into password_credentials (id,user_id,password_hash,created_at,updated_at) values ($1,$2,$3,$4,$5)', [credential.id, user.id, credential.password_hash, credential.created_at, credential.updated_at]);
    } else {
      const store = getLocalStore();
      if (store.users.some(u => u.email === email)) throw new Error('That email is already registered.');
      store.users.push(user); store.password_credentials.push(credential); setLocalStore(store);
    }
    await this.audit('auth.user_registered', { user_id: user.id, actor_email: email, role, entity_type: 'user', entity_id: user.id }, req);
    return { user: publicUser(user), token: signToken({ sub: user.id, email, role }) };
  }

  async loginUser({ email, password }, req = null) {
    email = String(email || '').trim().toLowerCase();
    let user, cred;
    if (this.mode() === 'postgres') {
      const found = await this.query('select * from users where email=$1 and status <> $2 limit 1', [email, 'deleted']);
      if (!found.rows.length) throw new Error('Invalid login.');
      user = found.rows[0];
      const c = await this.query('select * from password_credentials where user_id=$1 limit 1', [user.id]);
      cred = c.rows[0];
    } else {
      const store = getLocalStore();
      user = store.users.find(u => u.email === email && u.status !== 'deleted');
      cred = user ? store.password_credentials.find(c => c.user_id === user.id) : null;
    }
    if (!user || !cred || !verifyPassword(password, cred.password_hash)) throw new Error('Invalid login.');
    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    await this.storeSession(user, token, req);
    await this.audit('auth.user_logged_in', { user_id: user.id, actor_email: email, role: user.role, entity_type: 'user', entity_id: user.id }, req);
    return { user: publicUser(user), token };
  }

  async storeSession(user, token, req) {
    const session = { id: id('EL-SESS'), user_id: user.id, token_preview: token.slice(0, 18), ip_address: req?.ip || null, user_agent: req?.get?.('user-agent') || null, created_at: nowIso(), expires_at: new Date(Date.now() + Number(process.env.SESSION_TTL_SECONDS || 604800)*1000).toISOString() };
    if (this.mode() === 'postgres') await this.query('insert into user_sessions (id,user_id,token_preview,ip_address,user_agent,created_at,expires_at) values ($1,$2,$3,$4,$5,$6,$7)', [session.id, session.user_id, session.token_preview, session.ip_address, session.user_agent, session.created_at, session.expires_at]);
    else { const store = getLocalStore(); store.user_sessions.push(session); setLocalStore(store); }
  }

  async getUserById(userId) {
    if (!userId) return null;
    if (this.mode() === 'postgres') { const r = await this.query('select * from users where id=$1', [userId]); return r.rows[0] ? publicUser(r.rows[0]) : null; }
    return publicUser(getLocalStore().users.find(u => u.id === userId));
  }

  async createPaymentCheckout({ package_name, amount_cents, credits = 0, buyer_email, success_url, cancel_url, metadata = {} }, req = null) {
    if (!amount_cents || Number(amount_cents) < 50) throw new Error('A valid amount_cents is required.');
    const record = { id: id('EL-PAY'), provider: 'stripe', package_name: safeString(package_name, 200), amount_cents: Number(amount_cents), credits: Number(credits || 0), buyer_email: safeString(buyer_email, 200), status: 'created', checkout_url: null, provider_session_id: null, metadata, created_at: nowIso(), updated_at: nowIso() };
    if (configured().stripe) {
      const body = new URLSearchParams();
      body.set('mode', 'payment');
      body.set('success_url', success_url || process.env.STRIPE_SUCCESS_URL || 'https://englishlegalese.com/success');
      body.set('cancel_url', cancel_url || process.env.STRIPE_CANCEL_URL || 'https://englishlegalese.com/cancel');
      body.set('customer_email', buyer_email || '');
      body.set('line_items[0][quantity]', '1');
      body.set('line_items[0][price_data][currency]', process.env.STRIPE_CURRENCY || 'usd');
      body.set('line_items[0][price_data][unit_amount]', String(amount_cents));
      body.set('line_items[0][price_data][product_data][name]', package_name || 'EnglishLegalese Package');
      body.set('metadata[englishlegalese_payment_id]', record.id);
      body.set('metadata[credits]', String(credits || 0));
      const response = await fetch('https://api.stripe.com/v1/checkout/sessions', { method: 'POST', headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body });
      const json = await response.json();
      if (!response.ok) throw new Error(json?.error?.message || 'Stripe checkout session failed.');
      record.provider_session_id = json.id; record.checkout_url = json.url; record.status = 'stripe_checkout_ready';
    } else {
      record.status = 'dev_checkout_placeholder';
      record.checkout_url = `/mock-checkout/${record.id}`;
    }
    await this.savePaymentRecord(record);
    await this.audit('payment.checkout_created', { entity_type: 'payment_transaction', entity_id: record.id, ...record }, req);
    return record;
  }

  async savePaymentRecord(record) {
    if (this.mode() === 'postgres') {
      await this.query('insert into payment_transactions (id,provider,provider_session_id,buyer_email,package_name,amount_cents,credits,status,checkout_url,metadata,created_at,updated_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,$12) on conflict (id) do update set status=excluded.status, provider_session_id=excluded.provider_session_id, checkout_url=excluded.checkout_url, updated_at=excluded.updated_at', [record.id, record.provider, record.provider_session_id, record.buyer_email, record.package_name, record.amount_cents, record.credits, record.status, record.checkout_url, JSON.stringify(record.metadata || {}), record.created_at, record.updated_at]);
    } else { const store = getLocalStore(); store.payment_transactions.unshift(record); setLocalStore(store); }
  }

  async handleStripeWebhook(rawBody, signature, req = null) {
    if (!configured().stripe_webhook) return { verified: false, status: 'missing_STRIPE_WEBHOOK_SECRET' };
    verifyStripeSignature(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
    const event = JSON.parse(rawBody.toString('utf8'));
    const record = { id: id('EL-WH'), provider: 'stripe', event_id: event.id, event_type: event.type, processed_status: 'received', payload: event, created_at: nowIso() };
    if (this.mode() === 'postgres') await this.query('insert into webhook_events (id,provider,event_id,event_type,processed_status,payload,created_at) values ($1,$2,$3,$4,$5,$6::jsonb,$7) on conflict (event_id) do nothing', [record.id, record.provider, record.event_id, record.event_type, record.processed_status, JSON.stringify(record.payload), record.created_at]);
    else { const store = getLocalStore(); store.webhook_events.unshift(record); setLocalStore(store); }
    await this.audit('stripe.webhook_received', { entity_type: 'webhook_event', entity_id: record.event_id, event_type: event.type }, req);
    return { verified: true, event_type: event.type, event_id: event.id };
  }

  async createPresignedUpload({ file_name, mime_type, owner_user_id, class_session_id }, req = null) {
    const objectKey = `englishlegalese/${new Date().toISOString().slice(0,10)}/${id('EL-UPLOAD')}-${String(file_name || 'upload.bin').replace(/[^a-zA-Z0-9._-]/g,'_')}`;
    const record = { id: id('EL-FILE'), owner_user_id: owner_user_id || null, class_session_id: class_session_id || null, object_key: objectKey, storage_provider: configured().object_storage ? 's3_compatible' : 'local_dev_placeholder', file_name, mime_type, size_bytes: null, consent_status: 'pending_or_not_required', created_at: nowIso() };
    let upload = { configured: false, method: 'POST', upload_url: null, headers: {}, note: 'Object storage credentials are not configured. This is a metadata-only development placeholder.' };
    if (configured().object_storage) {
      const sdk = tryRequire('@aws-sdk/client-s3');
      const presigner = tryRequire('@aws-sdk/s3-request-presigner');
      if (sdk && presigner) {
        const client = new sdk.S3Client({ region: process.env.S3_REGION, endpoint: process.env.S3_ENDPOINT || undefined, forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true', credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY } });
        const command = new sdk.PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: objectKey, ContentType: mime_type || 'application/octet-stream' });
        upload = { configured: true, method: 'PUT', upload_url: await presigner.getSignedUrl(client, command, { expiresIn: Number(process.env.S3_PRESIGN_TTL_SECONDS || 900) }), headers: { 'Content-Type': mime_type || 'application/octet-stream' }, object_key: objectKey };
      } else {
        upload = { configured: false, method: 'PUT', upload_url: null, note: 'S3 env vars exist, but @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner are not installed. Run npm install in production.' };
      }
    }
    await this.saveFileObject(record);
    await this.audit('file.presigned_upload_requested', { entity_type: 'file_object', entity_id: record.id, object_key: objectKey }, req);
    return { record, upload };
  }

  async saveFileObject(record) {
    if (this.mode() === 'postgres') await this.query('insert into file_objects (id,owner_user_id,class_session_id,object_key,storage_provider,file_name,mime_type,size_bytes,consent_status,metadata,created_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11)', [record.id, record.owner_user_id, record.class_session_id, record.object_key, record.storage_provider, record.file_name, record.mime_type, record.size_bytes, record.consent_status, '{}', record.created_at]);
    else { const store = getLocalStore(); store.file_objects.unshift(record); setLocalStore(store); }
  }

  async sendEmail({ to, subject, text, html, template = 'generic' }, req = null) {
    const record = { id: id('EL-EMAIL'), to: safeString(to, 500), subject: safeString(subject, 300), template, status: 'queued', provider_message_id: null, created_at: nowIso(), updated_at: nowIso() };
    if (configured().smtp) {
      const nodemailer = tryRequire('nodemailer');
      if (nodemailer) {
        const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === 'true', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
        const info = await transporter.sendMail({ from: process.env.MAIL_FROM || 'EnglishLegalese <noreply@englishlegalese.com>', to, subject, text, html });
        record.status = 'sent'; record.provider_message_id = info.messageId;
      } else record.status = 'smtp_configured_nodemailer_not_installed';
    } else record.status = 'dev_email_not_sent';
    await this.saveEmail(record);
    await this.audit('email.notification_requested', { entity_type: 'email_notification', entity_id: record.id, ...record }, req);
    return record;
  }
  async saveEmail(record) {
    if (this.mode() === 'postgres') await this.query('insert into email_notifications (id,recipient,subject,template,status,provider_message_id,created_at,updated_at) values ($1,$2,$3,$4,$5,$6,$7,$8)', [record.id, record.to, record.subject, record.template, record.status, record.provider_message_id, record.created_at, record.updated_at]);
    else { const store = getLocalStore(); store.email_notifications.unshift(record); setLocalStore(store); }
  }

  async createCalendarVideoSession(input = {}, req = null) {
    const provider = input.video_provider || input.provider || 'EnglishLegalese Manual Link';
    const normalizedProvider = String(provider).toLowerCase();
    const manualJoinUrl = input.join_url || input.manual_join_url || input.classroom_link || null;
    const record = {
      id: id('EL-VIDEO'),
      provider,
      calendar_source_of_truth: 'EnglishLegalese internal class_session record',
      calendar_status: 'internal_calendar_ready',
      video_status: 'provider_not_attached',
      join_url: null,
      provider_event_id: null,
      provider_room_id: null,
      region_access_note: input.region_access_note || input.region || null,
      fallback_join_instructions: input.fallback_join_instructions || 'If the provider is blocked or unavailable, staff can attach a different approved regional classroom link to the same EnglishLegalese class record.',
      created_at: nowIso()
    };
    if ((normalizedProvider.includes('google') || normalizedProvider.includes('meet')) && configured().google_calendar) {
      const payload = {
        summary: input.title || 'EnglishLegalese Legal English Class',
        description: input.description || 'EnglishLegalese class session. Homework, saved work, reports, and closeout remain inside EnglishLegalese.',
        start: { dateTime: input.start_time, timeZone: input.timezone || 'America/New_York' },
        end: { dateTime: input.end_time, timeZone: input.timezone || 'America/New_York' },
        attendees: (input.attendees || []).filter(Boolean).map(email => ({ email })),
        conferenceData: { createRequest: { requestId: id('meet'), conferenceSolutionKey: { type: 'hangoutsMeet' } } }
      };
      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(process.env.GOOGLE_CALENDAR_ID)}/events?conferenceDataVersion=1&sendUpdates=all`;
      const response = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${process.env.GOOGLE_CALENDAR_ACCESS_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await response.json();
      if (!response.ok) throw new Error(json?.error?.message || 'Google Calendar event creation failed.');
      record.calendar_status = 'created'; record.video_status = 'google_meet_ready'; record.join_url = json.hangoutLink || json.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video')?.uri || null; record.provider_event_id = json.id; record.provider_room_id = json.conferenceData?.conferenceId || null;
    } else if (normalizedProvider.includes('zoom') && configured().zoom) {
      const token = await getZoomAccessToken();
      const response = await fetch(`https://api.zoom.us/v2/users/${encodeURIComponent(process.env.ZOOM_USER_ID || 'me')}/meetings`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: input.title || 'EnglishLegalese Legal English Class', type: 2, start_time: input.start_time, duration: Number(input.duration_minutes || 60), timezone: input.timezone || 'America/New_York', agenda: input.description || 'EnglishLegalese class session', settings: { waiting_room: true, join_before_host: false } }) });
      const json = await response.json();
      if (!response.ok) throw new Error(json?.message || 'Zoom meeting creation failed.');
      record.calendar_status = 'external_calendar_optional'; record.video_status = 'zoom_ready'; record.join_url = json.join_url; record.provider_event_id = json.id; record.provider_room_id = String(json.id);
    } else if (manualJoinUrl) {
      record.calendar_status = 'internal_calendar_manual_provider_link';
      record.video_status = `${String(provider).toLowerCase().replace(/[^a-z0-9]+/g, '_')}_manual_link_ready`;
      record.join_url = manualJoinUrl;
      record.provider_room_id = input.provider_room_id || null;
    } else if (normalizedProvider.includes('teams') || normalizedProvider.includes('tencent') || normalizedProvider.includes('voov') || normalizedProvider.includes('dingtalk')) {
      record.calendar_status = 'internal_calendar_manual_provider_required';
      record.video_status = `${String(provider).toLowerCase().replace(/[^a-z0-9]+/g, '_')}_manual_link_needed`;
      record.join_url = null;
      record.fallback_join_instructions = `Paste the approved ${provider} join link into this EnglishLegalese class record before sending reminders.`;
    } else {
      record.calendar_status = 'internal_calendar_dev_placeholder';
      record.video_status = `${String(provider).toLowerCase().replace(/[^a-z0-9]+/g, '_')}_placeholder`;
      record.join_url = `/classroom/dev-${record.id}`;
    }
    await this.audit('calendar_video.session_requested', { entity_type: 'calendar_video_session', entity_id: record.id, ...record }, req);
    return record;
  }

  async createPdfReport({ report_type = 'student_progress', title = 'EnglishLegalese Progress Report', learner_name = '', employer_name = '', summary = '', metrics = {} }, req = null) {
    const pdf = createSimplePdf(`${title}\n\nLearner: ${learner_name || 'N/A'}\nEmployer: ${employer_name || 'N/A'}\nReport type: ${report_type}\nGenerated: ${nowIso()}\n\nSummary:\n${summary || 'No summary provided.'}\n\nMetrics:\n${Object.entries(metrics || {}).map(([k,v]) => `${k}: ${v}`).join('\n')}`);
    const reportDir = path.join(__dirname, '..', 'storage', 'reports'); ensureDir(reportDir);
    const objectKey = `reports/${id('EL-REPORT')}.pdf`;
    const filePath = path.join(reportDir, path.basename(objectKey)); fs.writeFileSync(filePath, pdf);
    const record = { id: id('EL-REPORT'), report_type, title, learner_name, employer_name, status: 'pdf_generated_local_dev_or_ready_for_object_storage', pdf_object_key: objectKey, local_path: filePath, created_at: nowIso() };
    if (this.mode() === 'postgres') await this.query('insert into progress_reports (id,report_type,status,report_data,pdf_object_key,created_at,updated_at) values ($1,$2,$3,$4::jsonb,$5,$6,$7)', [record.id, record.report_type, record.status, JSON.stringify({ title, learner_name, employer_name, summary, metrics }), record.pdf_object_key, record.created_at, record.created_at]);
    else { const store = getLocalStore(); store.progress_reports.unshift(record); setLocalStore(store); }
    await this.audit('report.pdf_generated', { entity_type: 'progress_report', entity_id: record.id, pdf_object_key: objectKey }, req);
    return record;
  }

  async smartTeacher({ mode = 'student_tutor', prompt = '', context = {} }, user = null, req = null) {
    const system = `You are SmartTeacher AI for EnglishLegalese, powered by ChatGPT/OpenAI only in this build. Provide Legal English language education only. Do not provide legal advice, legal strategy, representation, certified translation, court interpretation, or document review for legal accuracy. Be practical, clear, and role-specific for mode: ${mode}. Reinforce the AI-era message: AI can translate words, but professionals still need judgment, context, confidentiality awareness, professional tone, speaking confidence, writing skill, document fluency, and safe AI-output review.`;
    let output;
    if (configured().openai) {
      const response = await fetch('https://api.openai.com/v1/responses', { method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: process.env.SMARTTEACHER_MODEL || process.env.OPENAI_MODEL || 'gpt-5.5-mini', input: [{ role: 'system', content: system }, { role: 'user', content: JSON.stringify({ prompt, context }) }] }) });
      const json = await response.json();
      if (!response.ok) throw new Error(json?.error?.message || 'SmartTeacher AI request failed.');
      output = json.output_text || (json.output || []).flatMap(o => o.content || []).map(c => c.text || '').join('\n') || 'SmartTeacher AI response received.';
    } else {
      output = smartTeacherFallback(mode, prompt);
    }
    const record = { id: id('EL-AI'), user_id: user?.id || null, mode, prompt: safeString(prompt, 4000), output: safeString(output, 8000), configured_provider: configured().openai ? 'openai_chatgpt_responses_api_only' : 'dev_safe_fallback', created_at: nowIso() };
    if (this.mode() === 'postgres') await this.query('insert into ai_interactions (id,user_id,mode,prompt,output,configured_provider,created_at) values ($1,$2,$3,$4,$5,$6,$7)', [record.id, record.user_id, record.mode, record.prompt, record.output, record.configured_provider, record.created_at]);
    else { const store = getLocalStore(); store.ai_interactions.unshift(record); setLocalStore(store); }
    await this.audit('ai.smartteacher_used', { entity_type: 'ai_interaction', entity_id: record.id, mode }, req);
    return record;
  }
}

function publicUser(user) { if (!user) return null; return { id: user.id, email: user.email, full_name: user.full_name, role: user.role, status: user.status, timezone: user.timezone, organization_name: user.organization_name || user.metadata?.organization_name || null }; }
function tryRequire(name) { try { return require(name); } catch { return null; } }
function verifyStripeSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader) throw new Error('Missing Stripe signature header.');
  const parts = Object.fromEntries(signatureHeader.split(',').map(p => p.split('=')));
  const timestamp = parts.t;
  const signatures = signatureHeader.split(',').filter(p => p.startsWith('v1=')).map(p => p.slice(3));
  if (!timestamp || !signatures.length) throw new Error('Malformed Stripe signature header.');
  const payload = `${timestamp}.${rawBody.toString('utf8')}`;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  if (!signatures.some(sig => crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)))) throw new Error('Stripe signature verification failed.');
  return true;
}
async function getZoomAccessToken() {
  const basic = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');
  const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(process.env.ZOOM_ACCOUNT_ID)}`;
  const response = await fetch(url, { method: 'POST', headers: { Authorization: `Basic ${basic}` } });
  const json = await response.json();
  if (!response.ok) throw new Error(json?.reason || json?.message || 'Zoom Server-to-Server OAuth failed.');
  return json.access_token;
}
function smartTeacherFallback(mode, prompt) {
  const intro = mode === 'teacher_assistant' ? 'Teacher plan' : mode === 'employer_report_helper' ? 'Privacy-safe employer summary' : mode === 'marketing_assistant' ? 'Approved marketing draft' : mode === 'staff_assistant' ? 'Staff operations check' : 'Legal English practice';
  return `${intro} powered by SmartTeacher AI / ChatGPT-only governance: ${safeString(prompt, 500)}\n\nSuggested next steps:\n1. Identify the Legal English skill: vocabulary, tone, clarity, structure, pronunciation, or professional speaking.\n2. Practice with one short example.\n3. Save the work to the class record and assign a teacher review if this affects progress reporting.\n\nBoundary: This is language education only, not legal advice.`;
}
function createSimplePdf(text) {
  const clean = String(text || '').replace(/[()\\]/g, ' ').split('\n').slice(0, 40);
  const lines = clean.map((line, i) => `BT /F1 11 Tf 50 ${750 - i * 16} Td (${line.slice(0, 95)}) Tj ET`).join('\n');
  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj',
    '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
    `5 0 obj << /Length ${Buffer.byteLength(lines)} >> stream\n${lines}\nendstream endobj`
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const obj of objects) { offsets.push(Buffer.byteLength(pdf)); pdf += obj + '\n'; }
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n` + offsets.slice(1).map(o => String(o).padStart(10, '0') + ' 00000 n ').join('\n') + '\n';
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf);
}

function authMiddleware(services) {
  return async (req, res, next) => {
    const header = req.get('authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : req.query.token || null;
    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ ok: false, error: 'Authentication required.' });
    const user = await services.getUserById(payload.sub);
    if (!user) return res.status(401).json({ ok: false, error: 'User not found.' });
    req.user = user;
    next();
  };
}
function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ ok: false, error: 'You do not have permission for this action.', allowed_roles: roles });
    next();
  };
}

module.exports = { ProductionServices, authMiddleware, requireRoles, verifyToken, configured, ROLE_PERMISSIONS, ROLES, SERVICE_DATA_PATH };
