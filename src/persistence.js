
const fs = require('fs');
const path = require('path');

function loadPg() {
  try {
    return require('pg');
  } catch (error) {
    return null;
  }
}

const DATA_DIR = process.env.LOCAL_DATA_DIR || path.join(__dirname, '..', 'data');
const LOCAL_DB_PATH = process.env.LOCAL_JSON_DB || path.join(DATA_DIR, 'local-dev-persistent-store.json');

function nowIso() {
  return new Date().toISOString();
}

function safeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function ensureLocalStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    const seed = {
      meta: {
        created_at: nowIso(),
        warning: 'Local JSON store is for development only. Production must use PostgreSQL and object storage.'
      },
      class_sessions: [],
      saved_work_items: [],
      homework_assignments: [],
      assessment_attempts: [],
      progress_reports: [],
      teacher_payouts: [],
      credit_ledger: [],
      teacher_marketing_campaigns: [],
      file_objects: [],
      audit_log: [],
      role_journey_events: [],
      classroom_readiness_reviews: [],
      teacher_marketing_assets: [],
      support_threads: [],
      action_center_items: [],
      video_room_events: [],
      ai_tutor_interactions: [],
      marketing_lead_attribution: [],
      ai_era_curriculum_modules: [],
      ai_translator_safety_exercises: [],
      ai_era_dashboard_signals: [],
      ai_era_marketing_assets: [],
      ai_era_pathway_plans: [],
      teacher_review_handoffs: [],
      employer_roi_snapshots: [],
      confidentiality_checks: [],
    };
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(seed, null, 2));
  }
}

function readLocalStore() {
  ensureLocalStore();
  return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
}

function writeLocalStore(store) {
  ensureLocalStore();
  store.meta = store.meta || {};
  store.meta.updated_at = nowIso();
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(store, null, 2));
}

class PersistentStore {
  constructor() {
    this.databaseUrl = process.env.DATABASE_URL || '';
    this.pgModule = this.databaseUrl ? loadPg() : null;
    this.pool = null;
    if (this.databaseUrl && this.pgModule) {
      this.pool = new this.pgModule.Pool({
        connectionString: this.databaseUrl,
        ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false }
      });
    }
  }

  mode() {
    if (this.pool) return 'postgres';
    if (this.databaseUrl && !this.pgModule) return 'postgres_configured_but_pg_not_installed';
    return 'local_json_development_only';
  }

  async health() {
    const mode = this.mode();
    if (mode === 'postgres') {
      const result = await this.pool.query('select now() as database_time');
      return {
        ok: true,
        mode,
        database_time: result.rows[0].database_time,
        no_data_loss_rule: 'Code deployments must never reset or reseed production data.',
        required_tables: REQUIRED_TABLES
      };
    }
    ensureLocalStore();
    return {
      ok: true,
      mode,
      local_path: LOCAL_DB_PATH,
      warning: 'Development-only fallback. Use PostgreSQL before real students, teachers, employers, payments, homework, reports, or classrooms.',
      no_data_loss_rule: 'Production data must live outside deployable app files.'
    };
  }

  async listClassSessions() {
    if (this.mode() === 'postgres') {
      const result = await this.pool.query('select * from class_sessions order by created_at desc limit 100');
      return result.rows;
    }
    const store = readLocalStore();
    return [...(store.class_sessions || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
  }

  async createClassSession(input = {}) {
    const record = normalizeClassSession(input);
    if (this.mode() === 'postgres') {
      const result = await this.pool.query(
        `insert into class_sessions
         (id, learner_name, teacher_name, organization_name, scheduled_at, timezone, video_provider, status, payment_credit_status, readiness_status, closeout_status, payout_status, metadata, created_at, updated_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14,$15)
         returning *`,
        [record.id, record.learner_name, record.teacher_name, record.organization_name, record.scheduled_at, record.timezone, record.video_provider, record.status, record.payment_credit_status, record.readiness_status, record.closeout_status, record.payout_status, JSON.stringify(record.metadata), record.created_at, record.updated_at]
      );
      await this.addAuditLog({ actor: 'system', action: 'class_session.created', entity_type: 'class_session', entity_id: record.id, after_state: result.rows[0] });
      return result.rows[0];
    }
    const store = readLocalStore();
    store.class_sessions = store.class_sessions || [];
    store.class_sessions.unshift(record);
    writeLocalStore(store);
    await this.addAuditLog({ actor: 'system', action: 'class_session.created', entity_type: 'class_session', entity_id: record.id, after_state: record });
    return record;
  }

  async listSavedWork() {
    if (this.mode() === 'postgres') {
      const result = await this.pool.query('select * from saved_work_items order by updated_at desc limit 100');
      return result.rows;
    }
    const store = readLocalStore();
    return [...(store.saved_work_items || [])].sort((a,b)=>String(b.updated_at).localeCompare(String(a.updated_at))).slice(0,100);
  }

  async createSavedWork(input = {}) {
    const record = {
      id: safeId('EL-WORK'),
      class_session_id: input.class_session_id || null,
      owner_name: input.owner_name || 'Unassigned learner',
      work_type: input.work_type || 'homework_draft',
      title: input.title || 'Untitled saved work',
      status: input.status || 'draft_saved',
      visibility: input.visibility || 'student_teacher_only',
      content_preview: input.content_preview || '',
      metadata: input.metadata || {},
      created_at: nowIso(),
      updated_at: nowIso()
    };
    if (this.mode() === 'postgres') {
      const result = await this.pool.query(
        `insert into saved_work_items
         (id, class_session_id, owner_name, work_type, title, status, visibility, content_preview, metadata, created_at, updated_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11) returning *`,
        [record.id, record.class_session_id, record.owner_name, record.work_type, record.title, record.status, record.visibility, record.content_preview, JSON.stringify(record.metadata), record.created_at, record.updated_at]
      );
      await this.addAuditLog({ actor: 'system', action: 'saved_work.created', entity_type: 'saved_work_item', entity_id: record.id, after_state: result.rows[0] });
      return result.rows[0];
    }
    const store = readLocalStore();
    store.saved_work_items = store.saved_work_items || [];
    store.saved_work_items.unshift(record);
    writeLocalStore(store);
    await this.addAuditLog({ actor: 'system', action: 'saved_work.created', entity_type: 'saved_work_item', entity_id: record.id, after_state: record });
    return record;
  }

  async listAuditLog() {
    if (this.mode() === 'postgres') {
      const result = await this.pool.query('select * from audit_log order by created_at desc limit 100');
      return result.rows;
    }
    const store = readLocalStore();
    return [...(store.audit_log || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
  }

  async addAuditLog(input = {}) {
    const record = {
      id: safeId('EL-AUDIT'),
      actor: input.actor || 'system',
      action: input.action || 'unknown.action',
      entity_type: input.entity_type || 'system',
      entity_id: input.entity_id || null,
      before_state: input.before_state || null,
      after_state: input.after_state || null,
      ip_address: input.ip_address || null,
      user_agent: input.user_agent || null,
      created_at: nowIso()
    };
    if (this.mode() === 'postgres') {
      const result = await this.pool.query(
        `insert into audit_log (id, actor, action, entity_type, entity_id, before_state, after_state, ip_address, user_agent, created_at)
         values ($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb,$8,$9,$10) returning *`,
        [record.id, record.actor, record.action, record.entity_type, record.entity_id, JSON.stringify(record.before_state), JSON.stringify(record.after_state), record.ip_address, record.user_agent, record.created_at]
      );
      return result.rows[0];
    }
    const store = readLocalStore();
    store.audit_log = store.audit_log || [];
    store.audit_log.unshift(record);
    writeLocalStore(store);
    return record;
  }

  async listBookingRequests() {
    if (this.mode() === 'postgres') {
      const result = await this.pool.query('select * from booking_requests order by created_at desc limit 100');
      return result.rows;
    }
    const store = readLocalStore();
    return [...(store.booking_requests || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
  }

  async createBookingRequest(input = {}) {
    const record = {
      id: safeId('EL-BOOK'),
      buyer_type: input.buyer_type || 'student',
      requested_track: input.requested_track || input.track || 'Legal English',
      preferred_video_provider: input.preferred_video_provider || input.video_provider || 'Google Meet',
      package_name: input.package_name || 'Free Diagnostic / Staff Review',
      credit_hold_status: input.credit_hold_status || 'not_held',
      staff_status: input.staff_status || 'needs_review',
      source_tracking_code: input.source_tracking_code || input.ref || null,
      notes: input.notes || '',
      metadata: input.metadata || {},
      created_at: nowIso(),
      updated_at: nowIso()
    };
    if (this.mode() === 'postgres') {
      const result = await this.pool.query(
        `insert into booking_requests (id,buyer_type,requested_track,preferred_video_provider,package_name,credit_hold_status,staff_status,source_tracking_code,notes,metadata,created_at,updated_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,$12) returning *`,
        [record.id, record.buyer_type, record.requested_track, record.preferred_video_provider, record.package_name, record.credit_hold_status, record.staff_status, record.source_tracking_code, record.notes, JSON.stringify(record.metadata), record.created_at, record.updated_at]
      );
      await this.addAuditLog({ actor: 'system', action: 'booking_request.created', entity_type: 'booking_request', entity_id: record.id, after_state: result.rows[0] });
      return result.rows[0];
    }
    const store = readLocalStore();
    store.booking_requests = store.booking_requests || [];
    store.booking_requests.unshift(record);
    writeLocalStore(store);
    await this.addAuditLog({ actor: 'system', action: 'booking_request.created', entity_type: 'booking_request', entity_id: record.id, after_state: record });
    return record;
  }

  async listHomeworkAssignments() {
    if (this.mode() === 'postgres') {
      const result = await this.pool.query('select * from homework_assignments order by created_at desc limit 100');
      return result.rows;
    }
    const store = readLocalStore();
    return [...(store.homework_assignments || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
  }

  async createHomeworkAssignment(input = {}) {
    const record = {
      id: safeId('EL-HW'),
      class_session_id: input.class_session_id || null,
      title: input.title || 'Legal English homework assignment',
      instructions: input.instructions || '',
      due_at: input.due_at || null,
      status: input.status || 'assigned',
      score: input.score || null,
      metadata: input.metadata || {},
      created_at: nowIso(),
      updated_at: nowIso()
    };
    if (this.mode() === 'postgres') {
      const result = await this.pool.query(
        `insert into homework_assignments (id,class_session_id,title,instructions,due_at,status,score,metadata,created_at,updated_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10) returning *`,
        [record.id, record.class_session_id, record.title, record.instructions, record.due_at, record.status, record.score, JSON.stringify(record.metadata), record.created_at, record.updated_at]
      );
      await this.addAuditLog({ actor: 'system', action: 'homework.created', entity_type: 'homework_assignment', entity_id: record.id, after_state: result.rows[0] });
      return result.rows[0];
    }
    const store = readLocalStore();
    store.homework_assignments = store.homework_assignments || [];
    store.homework_assignments.unshift(record);
    writeLocalStore(store);
    await this.addAuditLog({ actor: 'system', action: 'homework.created', entity_type: 'homework_assignment', entity_id: record.id, after_state: record });
    return record;
  }

  async listSessionCloseouts() {
    if (this.mode() === 'postgres') {
      const result = await this.pool.query('select * from class_session_closeouts order by created_at desc limit 100');
      return result.rows;
    }
    const store = readLocalStore();
    return [...(store.class_session_closeouts || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
  }

  async createSessionCloseout(input = {}) {
    const record = {
      id: safeId('EL-CLOSEOUT'),
      class_session_id: input.class_session_id || input.session_id || null,
      attendance_status: input.attendance_status || 'present',
      teacher_notes: input.teacher_notes || '',
      homework_status: input.homework_status || 'assigned_or_confirmed',
      ai_practice_status: input.ai_practice_status || 'recommended',
      report_refresh_status: input.report_refresh_status || 'draft_ready',
      credit_deduction_status: input.credit_deduction_status || 'ready_for_staff_review',
      payout_release_status: input.payout_release_status || 'held_until_staff_review',
      staff_review_status: input.staff_review_status || 'needs_review',
      closeout_data: input.closeout_data || input.metadata || {},
      created_at: nowIso(),
      updated_at: nowIso()
    };
    if (this.mode() === 'postgres') {
      const result = await this.pool.query(
        `insert into class_session_closeouts (id,class_session_id,attendance_status,teacher_notes,homework_status,ai_practice_status,report_refresh_status,credit_deduction_status,payout_release_status,staff_review_status,closeout_data,created_at,updated_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12,$13) returning *`,
        [record.id, record.class_session_id, record.attendance_status, record.teacher_notes, record.homework_status, record.ai_practice_status, record.report_refresh_status, record.credit_deduction_status, record.payout_release_status, record.staff_review_status, JSON.stringify(record.closeout_data), record.created_at, record.updated_at]
      );
      await this.addAuditLog({ actor: 'system', action: 'class_session.closeout_created', entity_type: 'class_session_closeout', entity_id: record.id, after_state: result.rows[0] });
      return result.rows[0];
    }
    const store = readLocalStore();
    store.class_session_closeouts = store.class_session_closeouts || [];
    store.class_session_closeouts.unshift(record);
    writeLocalStore(store);
    await this.addAuditLog({ actor: 'system', action: 'class_session.closeout_created', entity_type: 'class_session_closeout', entity_id: record.id, after_state: record });
    return record;
  }

  async listStaffTasks() {
    if (this.mode() === 'postgres') {
      const result = await this.pool.query('select * from staff_tasks order by created_at desc limit 100');
      return result.rows;
    }
    const store = readLocalStore();
    return [...(store.staff_tasks || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
  }

  async createStaffTask(input = {}) {
    const record = {
      id: safeId('EL-TASK'),
      task_type: input.task_type || 'operations',
      priority: input.priority || 'normal',
      owner_role: input.owner_role || 'staff',
      title: input.title || 'Staff task',
      description: input.description || '',
      related_entity_type: input.related_entity_type || null,
      related_entity_id: input.related_entity_id || null,
      status: input.status || 'open',
      due_at: input.due_at || null,
      metadata: input.metadata || {},
      created_at: nowIso(),
      updated_at: nowIso()
    };
    if (this.mode() === 'postgres') {
      const result = await this.pool.query(
        `insert into staff_tasks (id,task_type,priority,owner_role,title,description,related_entity_type,related_entity_id,status,due_at,metadata,created_at,updated_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12,$13) returning *`,
        [record.id, record.task_type, record.priority, record.owner_role, record.title, record.description, record.related_entity_type, record.related_entity_id, record.status, record.due_at, JSON.stringify(record.metadata), record.created_at, record.updated_at]
      );
      await this.addAuditLog({ actor: 'system', action: 'staff_task.created', entity_type: 'staff_task', entity_id: record.id, after_state: result.rows[0] });
      return result.rows[0];
    }
    const store = readLocalStore();
    store.staff_tasks = store.staff_tasks || [];
    store.staff_tasks.unshift(record);
    writeLocalStore(store);
    await this.addAuditLog({ actor: 'system', action: 'staff_task.created', entity_type: 'staff_task', entity_id: record.id, after_state: record });
    return record;
  }


  async listIntegrationHealthChecks() {
    if (this.mode() === 'postgres') {
      const result = await this.pool.query('select * from integration_health_checks order by created_at desc limit 100');
      return result.rows;
    }
    const store = readLocalStore();
    return [...(store.integration_health_checks || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
  }

  async createIntegrationHealthCheck(input = {}) {
    const record = {
      id: safeId('EL-INT'),
      service_name: input.service_name || input.service || 'unknown_service',
      status: input.status || 'unknown',
      mode: input.mode || 'not_configured',
      message: input.message || '',
      checked_by: input.checked_by || 'system',
      metadata: input.metadata || {},
      created_at: nowIso()
    };
    if (this.mode() === 'postgres') {
      const result = await this.pool.query(
        `insert into integration_health_checks (id,service_name,status,mode,message,checked_by,metadata,created_at)
         values ($1,$2,$3,$4,$5,$6,$7::jsonb,$8) returning *`,
        [record.id, record.service_name, record.status, record.mode, record.message, record.checked_by, JSON.stringify(record.metadata), record.created_at]
      );
      await this.addAuditLog({ actor: record.checked_by, action: 'integration.health_check_recorded', entity_type: 'integration_health_check', entity_id: record.id, after_state: result.rows[0] });
      return result.rows[0];
    }
    const store = readLocalStore();
    store.integration_health_checks = store.integration_health_checks || [];
    store.integration_health_checks.unshift(record);
    writeLocalStore(store);
    await this.addAuditLog({ actor: record.checked_by, action: 'integration.health_check_recorded', entity_type: 'integration_health_check', entity_id: record.id, after_state: record });
    return record;
  }

  async listDeploymentRecords() {
    if (this.mode() === 'postgres') {
      const result = await this.pool.query('select * from deployment_records order by created_at desc limit 100');
      return result.rows;
    }
    const store = readLocalStore();
    return [...(store.deployment_records || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
  }

  async createDeploymentRecord(input = {}) {
    const record = {
      id: safeId('EL-DEPLOY'),
      version: input.version || 'unknown',
      environment: input.environment || process.env.APP_ENV || 'production',
      commit_sha: input.commit_sha || null,
      deployed_by: input.deployed_by || 'staff',
      predeploy_check_status: input.predeploy_check_status || 'pending',
      migration_status: input.migration_status || 'pending',
      postdeploy_smoke_status: input.postdeploy_smoke_status || 'pending',
      rollback_plan: input.rollback_plan || '',
      data_safety_notes: input.data_safety_notes || 'Code deploy only; no data reset.',
      metadata: input.metadata || {},
      created_at: nowIso(),
      updated_at: nowIso()
    };
    if (this.mode() === 'postgres') {
      const result = await this.pool.query(
        `insert into deployment_records (id,version,environment,commit_sha,deployed_by,predeploy_check_status,migration_status,postdeploy_smoke_status,rollback_plan,data_safety_notes,metadata,created_at,updated_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12,$13) returning *`,
        [record.id, record.version, record.environment, record.commit_sha, record.deployed_by, record.predeploy_check_status, record.migration_status, record.postdeploy_smoke_status, record.rollback_plan, record.data_safety_notes, JSON.stringify(record.metadata), record.created_at, record.updated_at]
      );
      await this.addAuditLog({ actor: record.deployed_by, action: 'deployment.record_created', entity_type: 'deployment_record', entity_id: record.id, after_state: result.rows[0] });
      return result.rows[0];
    }
    const store = readLocalStore();
    store.deployment_records = store.deployment_records || [];
    store.deployment_records.unshift(record);
    writeLocalStore(store);
    await this.addAuditLog({ actor: record.deployed_by, action: 'deployment.record_created', entity_type: 'deployment_record', entity_id: record.id, after_state: record });
    return record;
  }

  async listBackupCheckpoints() {
    if (this.mode() === 'postgres') {
      const result = await this.pool.query('select * from backup_checkpoints order by created_at desc limit 100');
      return result.rows;
    }
    const store = readLocalStore();
    return [...(store.backup_checkpoints || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
  }

  async createBackupCheckpoint(input = {}) {
    const record = {
      id: safeId('EL-BACKUP'),
      provider: input.provider || process.env.BACKUP_PROVIDER || 'manual_or_managed_provider',
      backup_type: input.backup_type || 'managed_database_backup',
      status: input.status || 'pending_verification',
      verified_by: input.verified_by || 'staff',
      verified_at: input.verified_at || null,
      restore_test_status: input.restore_test_status || 'not_tested',
      notes: input.notes || '',
      metadata: input.metadata || {},
      created_at: nowIso(),
      updated_at: nowIso()
    };
    if (this.mode() === 'postgres') {
      const result = await this.pool.query(
        `insert into backup_checkpoints (id,provider,backup_type,status,verified_by,verified_at,restore_test_status,notes,metadata,created_at,updated_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11) returning *`,
        [record.id, record.provider, record.backup_type, record.status, record.verified_by, record.verified_at, record.restore_test_status, record.notes, JSON.stringify(record.metadata), record.created_at, record.updated_at]
      );
      await this.addAuditLog({ actor: record.verified_by, action: 'backup.checkpoint_created', entity_type: 'backup_checkpoint', entity_id: record.id, after_state: result.rows[0] });
      return result.rows[0];
    }
    const store = readLocalStore();
    store.backup_checkpoints = store.backup_checkpoints || [];
    store.backup_checkpoints.unshift(record);
    writeLocalStore(store);
    await this.addAuditLog({ actor: record.verified_by, action: 'backup.checkpoint_created', entity_type: 'backup_checkpoint', entity_id: record.id, after_state: record });
    return record;
  }

  async listProductionLaunchEvents() {
    if (this.mode() === 'postgres') {
      const result = await this.pool.query('select * from production_launch_events order by created_at desc limit 100');
      return result.rows;
    }
    const store = readLocalStore();
    return [...(store.production_launch_events || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
  }

  async createProductionLaunchEvent(input = {}) {
    const record = {
      id: safeId('EL-LAUNCH'),
      launch_gate: input.launch_gate || input.gate || 'manual_review',
      status: input.status || 'pending',
      owner_role: input.owner_role || 'owner',
      evidence: input.evidence || '',
      metadata: input.metadata || {},
      created_at: nowIso(),
      updated_at: nowIso()
    };
    if (this.mode() === 'postgres') {
      const result = await this.pool.query(
        `insert into production_launch_events (id,launch_gate,status,owner_role,evidence,metadata,created_at,updated_at)
         values ($1,$2,$3,$4,$5,$6::jsonb,$7,$8) returning *`,
        [record.id, record.launch_gate, record.status, record.owner_role, record.evidence, JSON.stringify(record.metadata), record.created_at, record.updated_at]
      );
      await this.addAuditLog({ actor: record.owner_role, action: 'production.launch_gate_recorded', entity_type: 'production_launch_event', entity_id: record.id, after_state: result.rows[0] });
      return result.rows[0];
    }
    const store = readLocalStore();
    store.production_launch_events = store.production_launch_events || [];
    store.production_launch_events.unshift(record);
    writeLocalStore(store);
    await this.addAuditLog({ actor: record.owner_role, action: 'production.launch_gate_recorded', entity_type: 'production_launch_event', entity_id: record.id, after_state: record });
    return record;
  }


async listRoleJourneyEvents() {
  if (this.mode() === 'postgres') {
    const result = await this.pool.query('select * from role_journey_events order by created_at desc limit 100');
    return result.rows;
  }
  const store = readLocalStore();
  return [...(store.role_journey_events || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
}

async createRoleJourneyEvent(input = {}) {
  const record = {
    id: safeId('EL-JOURNEY'),
    role: input.role || 'student',
    event_type: input.event_type || 'journey_step',
    status: input.status || 'open',
    next_action: input.next_action || '',
    owner_role: input.owner_role || 'staff',
    related_entity_type: input.related_entity_type || null,
    related_entity_id: input.related_entity_id || null,
    metadata: input.metadata || {},
    created_at: nowIso(),
    updated_at: nowIso()
  };
  if (this.mode() === 'postgres') {
    const result = await this.pool.query(
      `insert into role_journey_events (id,role,event_type,status,next_action,owner_role,related_entity_type,related_entity_id,metadata,created_at,updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11) returning *`,
      [record.id, record.role, record.event_type, record.status, record.next_action, record.owner_role, record.related_entity_type, record.related_entity_id, JSON.stringify(record.metadata), record.created_at, record.updated_at]
    );
    await this.addAuditLog({ actor: record.owner_role, action: 'role_journey.event_created', entity_type: 'role_journey_event', entity_id: record.id, after_state: result.rows[0] });
    return result.rows[0];
  }
  const store = readLocalStore();
  store.role_journey_events = store.role_journey_events || [];
  store.role_journey_events.unshift(record);
  writeLocalStore(store);
  await this.addAuditLog({ actor: record.owner_role, action: 'role_journey.event_created', entity_type: 'role_journey_event', entity_id: record.id, after_state: record });
  return record;
}

async listClassroomReadinessReviews() {
  if (this.mode() === 'postgres') {
    const result = await this.pool.query('select * from classroom_readiness_reviews order by created_at desc limit 100');
    return result.rows;
  }
  const store = readLocalStore();
  return [...(store.classroom_readiness_reviews || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
}

async createClassroomReadinessReview(input = {}) {
  const record = {
    id: safeId('EL-READY'),
    class_session_id: input.class_session_id || input.session_id || null,
    readiness_status: input.readiness_status || 'needs_review',
    payment_credit_status: input.payment_credit_status || 'unchecked',
    calendar_status: input.calendar_status || 'unchecked',
    video_status: input.video_status || 'unchecked',
    saved_work_status: input.saved_work_status || 'unchecked',
    homework_status: input.homework_status || 'unchecked',
    report_status: input.report_status || 'unchecked',
    payout_status: input.payout_status || 'not_ready',
    blocker_summary: input.blocker_summary || '',
    reviewed_by: input.reviewed_by || 'staff',
    metadata: input.metadata || {},
    created_at: nowIso(),
    updated_at: nowIso()
  };
  if (this.mode() === 'postgres') {
    const result = await this.pool.query(
      `insert into classroom_readiness_reviews (id,class_session_id,readiness_status,payment_credit_status,calendar_status,video_status,saved_work_status,homework_status,report_status,payout_status,blocker_summary,reviewed_by,metadata,created_at,updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14,$15) returning *`,
      [record.id, record.class_session_id, record.readiness_status, record.payment_credit_status, record.calendar_status, record.video_status, record.saved_work_status, record.homework_status, record.report_status, record.payout_status, record.blocker_summary, record.reviewed_by, JSON.stringify(record.metadata), record.created_at, record.updated_at]
    );
    await this.addAuditLog({ actor: record.reviewed_by, action: 'classroom.readiness_review_created', entity_type: 'classroom_readiness_review', entity_id: record.id, after_state: result.rows[0] });
    return result.rows[0];
  }
  const store = readLocalStore();
  store.classroom_readiness_reviews = store.classroom_readiness_reviews || [];
  store.classroom_readiness_reviews.unshift(record);
  writeLocalStore(store);
  await this.addAuditLog({ actor: record.reviewed_by, action: 'classroom.readiness_review_created', entity_type: 'classroom_readiness_review', entity_id: record.id, after_state: record });
  return record;
}

async listTeacherMarketingAssets() {
  if (this.mode() === 'postgres') {
    const result = await this.pool.query('select * from teacher_marketing_assets order by created_at desc limit 100');
    return result.rows;
  }
  const store = readLocalStore();
  return [...(store.teacher_marketing_assets || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
}

async createTeacherMarketingAsset(input = {}) {
  const record = {
    id: safeId('EL-ASSET'),
    teacher_name: input.teacher_name || 'Approved teacher',
    asset_type: input.asset_type || 'linkedin_post',
    channel: input.channel || 'LinkedIn',
    status: input.status || 'draft_pending_staff_review',
    approved_copy: input.approved_copy || '',
    tracking_code: input.tracking_code || input.ref || null,
    staff_notes: input.staff_notes || '',
    metadata: input.metadata || {},
    created_at: nowIso(),
    updated_at: nowIso()
  };
  if (this.mode() === 'postgres') {
    const result = await this.pool.query(
      `insert into teacher_marketing_assets (id,teacher_name,asset_type,channel,status,approved_copy,tracking_code,staff_notes,metadata,created_at,updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11) returning *`,
      [record.id, record.teacher_name, record.asset_type, record.channel, record.status, record.approved_copy, record.tracking_code, record.staff_notes, JSON.stringify(record.metadata), record.created_at, record.updated_at]
    );
    await this.addAuditLog({ actor: 'staff', action: 'teacher_marketing.asset_created', entity_type: 'teacher_marketing_asset', entity_id: record.id, after_state: result.rows[0] });
    return result.rows[0];
  }
  const store = readLocalStore();
  store.teacher_marketing_assets = store.teacher_marketing_assets || [];
  store.teacher_marketing_assets.unshift(record);
  writeLocalStore(store);
  await this.addAuditLog({ actor: 'staff', action: 'teacher_marketing.asset_created', entity_type: 'teacher_marketing_asset', entity_id: record.id, after_state: record });
  return record;
}

async listSupportThreads() {
  if (this.mode() === 'postgres') {
    const result = await this.pool.query('select * from support_threads order by created_at desc limit 100');
    return result.rows;
  }
  const store = readLocalStore();
  return [...(store.support_threads || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
}

async createSupportThread(input = {}) {
  const record = {
    id: safeId('EL-SUPPORT'),
    requester_role: input.requester_role || 'student',
    requester_name: input.requester_name || 'Requester',
    topic: input.topic || 'general_support',
    priority: input.priority || 'normal',
    status: input.status || 'open',
    summary: input.summary || '',
    assigned_to: input.assigned_to || 'staff',
    metadata: input.metadata || {},
    created_at: nowIso(),
    updated_at: nowIso()
  };
  if (this.mode() === 'postgres') {
    const result = await this.pool.query(
      `insert into support_threads (id,requester_role,requester_name,topic,priority,status,summary,assigned_to,metadata,created_at,updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11) returning *`,
      [record.id, record.requester_role, record.requester_name, record.topic, record.priority, record.status, record.summary, record.assigned_to, JSON.stringify(record.metadata), record.created_at, record.updated_at]
    );
    await this.addAuditLog({ actor: record.assigned_to, action: 'support.thread_created', entity_type: 'support_thread', entity_id: record.id, after_state: result.rows[0] });
    return result.rows[0];
  }
  const store = readLocalStore();
  store.support_threads = store.support_threads || [];
  store.support_threads.unshift(record);
  writeLocalStore(store);
  await this.addAuditLog({ actor: record.assigned_to, action: 'support.thread_created', entity_type: 'support_thread', entity_id: record.id, after_state: record });
  return record;
}


async listActionCenterItems() {
  if (this.mode() === 'postgres') {
    const result = await this.pool.query('select * from action_center_items order by created_at desc limit 100');
    return result.rows;
  }
  const store = readLocalStore();
  return [...(store.action_center_items || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
}

async createActionCenterItem(input = {}) {
  const record = {
    id: safeId('EL-ACTION'),
    role: input.role || 'staff',
    title: input.title || 'Next action',
    status: input.status || 'open',
    priority: input.priority || 'normal',
    next_action: input.next_action || '',
    related_entity_type: input.related_entity_type || null,
    related_entity_id: input.related_entity_id || null,
    due_at: input.due_at || null,
    owner_name: input.owner_name || 'EnglishLegalese staff',
    metadata: input.metadata || {},
    created_at: nowIso(),
    updated_at: nowIso()
  };
  if (this.mode() === 'postgres') {
    const result = await this.pool.query(
      `insert into action_center_items (id,role,title,status,priority,next_action,related_entity_type,related_entity_id,due_at,owner_name,metadata,created_at,updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12,$13) returning *`,
      [record.id, record.role, record.title, record.status, record.priority, record.next_action, record.related_entity_type, record.related_entity_id, record.due_at, record.owner_name, JSON.stringify(record.metadata), record.created_at, record.updated_at]
    );
    await this.addAuditLog({ actor: record.owner_name, action: 'action_center.item_created', entity_type: 'action_center_item', entity_id: record.id, after_state: result.rows[0] });
    return result.rows[0];
  }
  const store = readLocalStore();
  store.action_center_items = store.action_center_items || [];
  store.action_center_items.unshift(record);
  writeLocalStore(store);
  await this.addAuditLog({ actor: record.owner_name, action: 'action_center.item_created', entity_type: 'action_center_item', entity_id: record.id, after_state: record });
  return record;
}

async listVideoRoomEvents() {
  if (this.mode() === 'postgres') {
    const result = await this.pool.query('select * from video_room_events order by created_at desc limit 100');
    return result.rows;
  }
  const store = readLocalStore();
  return [...(store.video_room_events || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
}

async createVideoRoomEvent(input = {}) {
  const record = {
    id: safeId('EL-VIDEO'),
    class_session_id: input.class_session_id || input.session_id || null,
    provider: input.provider || input.video_provider || 'Google Meet',
    event_type: input.event_type || 'room_status_update',
    status: input.status || 'pending',
    join_url: input.join_url || null,
    calendar_event_id: input.calendar_event_id || null,
    recording_consent_status: input.recording_consent_status || 'not_recorded_by_default',
    notes: input.notes || '',
    metadata: input.metadata || {},
    created_at: nowIso(),
    updated_at: nowIso()
  };
  if (this.mode() === 'postgres') {
    const result = await this.pool.query(
      `insert into video_room_events (id,class_session_id,provider,event_type,status,join_url,calendar_event_id,recording_consent_status,notes,metadata,created_at,updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,$12) returning *`,
      [record.id, record.class_session_id, record.provider, record.event_type, record.status, record.join_url, record.calendar_event_id, record.recording_consent_status, record.notes, JSON.stringify(record.metadata), record.created_at, record.updated_at]
    );
    await this.addAuditLog({ actor: 'system', action: 'video_room.event_created', entity_type: 'video_room_event', entity_id: record.id, after_state: result.rows[0] });
    return result.rows[0];
  }
  const store = readLocalStore();
  store.video_room_events = store.video_room_events || [];
  store.video_room_events.unshift(record);
  writeLocalStore(store);
  await this.addAuditLog({ actor: 'system', action: 'video_room.event_created', entity_type: 'video_room_event', entity_id: record.id, after_state: record });
  return record;
}

async listAiTutorInteractions() {
  if (this.mode() === 'postgres') {
    const result = await this.pool.query('select * from ai_tutor_interactions order by created_at desc limit 100');
    return result.rows;
  }
  const store = readLocalStore();
  return [...(store.ai_tutor_interactions || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
}

async createAiTutorInteraction(input = {}) {
  const record = {
    id: safeId('EL-AI'),
    requester_role: input.requester_role || input.role || 'student',
    mode: input.mode || 'student_tutor',
    prompt_summary: input.prompt_summary || input.prompt || '',
    response_summary: input.response_summary || input.response || 'SmartTeacher AI interaction recorded for language-training continuity.',
    class_session_id: input.class_session_id || input.session_id || null,
    privacy_status: input.privacy_status || 'language_training_only',
    legal_advice_boundary_status: input.legal_advice_boundary_status || 'boundary_applied',
    metadata: input.metadata || {},
    created_at: nowIso(),
    updated_at: nowIso()
  };
  if (this.mode() === 'postgres') {
    const result = await this.pool.query(
      `insert into ai_tutor_interactions (id,requester_role,mode,prompt_summary,response_summary,class_session_id,privacy_status,legal_advice_boundary_status,metadata,created_at,updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11) returning *`,
      [record.id, record.requester_role, record.mode, record.prompt_summary, record.response_summary, record.class_session_id, record.privacy_status, record.legal_advice_boundary_status, JSON.stringify(record.metadata), record.created_at, record.updated_at]
    );
    await this.addAuditLog({ actor: record.requester_role, action: 'smartteacher.interaction_recorded', entity_type: 'ai_tutor_interaction', entity_id: record.id, after_state: result.rows[0] });
    return result.rows[0];
  }
  const store = readLocalStore();
  store.ai_tutor_interactions = store.ai_tutor_interactions || [];
  store.ai_tutor_interactions.unshift(record);
  writeLocalStore(store);
  await this.addAuditLog({ actor: record.requester_role, action: 'smartteacher.interaction_recorded', entity_type: 'ai_tutor_interaction', entity_id: record.id, after_state: record });
  return record;
}

async listMarketingLeadAttribution() {
  if (this.mode() === 'postgres') {
    const result = await this.pool.query('select * from marketing_lead_attribution order by created_at desc limit 100');
    return result.rows;
  }
  const store = readLocalStore();
  return [...(store.marketing_lead_attribution || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
}

async createMarketingLeadAttribution(input = {}) {
  const record = {
    id: safeId('EL-ATTR'),
    teacher_name: input.teacher_name || 'Approved teacher',
    source_channel: input.source_channel || input.channel || 'teacher_referral_link',
    tracking_code: input.tracking_code || input.ref || null,
    lead_type: input.lead_type || 'student',
    conversion_status: input.conversion_status || 'lead_captured',
    package_name: input.package_name || null,
    potential_value: input.potential_value || null,
    bonus_review_status: input.bonus_review_status || 'not_ready_until_paid_conversion',
    staff_notes: input.staff_notes || '',
    metadata: input.metadata || {},
    created_at: nowIso(),
    updated_at: nowIso()
  };
  if (this.mode() === 'postgres') {
    const result = await this.pool.query(
      `insert into marketing_lead_attribution (id,teacher_name,source_channel,tracking_code,lead_type,conversion_status,package_name,potential_value,bonus_review_status,staff_notes,metadata,created_at,updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12,$13) returning *`,
      [record.id, record.teacher_name, record.source_channel, record.tracking_code, record.lead_type, record.conversion_status, record.package_name, record.potential_value, record.bonus_review_status, record.staff_notes, JSON.stringify(record.metadata), record.created_at, record.updated_at]
    );
    await this.addAuditLog({ actor: 'staff', action: 'marketing.attribution_created', entity_type: 'marketing_lead_attribution', entity_id: record.id, after_state: result.rows[0] });
    return result.rows[0];
  }
  const store = readLocalStore();
  store.marketing_lead_attribution = store.marketing_lead_attribution || [];
  store.marketing_lead_attribution.unshift(record);
  writeLocalStore(store);
  await this.addAuditLog({ actor: 'staff', action: 'marketing.attribution_created', entity_type: 'marketing_lead_attribution', entity_id: record.id, after_state: record });
  return record;
}


async listAiEraCurriculumModules() {
  if (this.mode() === 'postgres') {
    const result = await this.pool.query('select * from ai_era_curriculum_modules order by created_at desc limit 100');
    return result.rows;
  }
  const store = readLocalStore();
  return [...(store.ai_era_curriculum_modules || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
}

async createAiEraCurriculumModule(input = {}) {
  const record = {
    id: safeId('EL-AIERA-MOD'),
    track: input.track || 'AI Translator Safety for Legal and Business English',
    module_title: input.module_title || input.title || 'Build legal-English skills AI translators cannot replace',
    audience: input.audience || 'students_teachers_employers',
    ai_translator_safety_focus: input.ai_translator_safety_focus || 'Use AI as practice support, not final legal meaning.',
    teacher_review_required: input.teacher_review_required !== false,
    status: input.status || 'active',
    metadata: input.metadata || {},
    created_at: nowIso(),
    updated_at: nowIso()
  };
  if (this.mode() === 'postgres') {
    const result = await this.pool.query(
      `insert into ai_era_curriculum_modules (id,track,module_title,audience,ai_translator_safety_focus,teacher_review_required,status,metadata,created_at,updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10) returning *`,
      [record.id, record.track, record.module_title, record.audience, record.ai_translator_safety_focus, record.teacher_review_required, record.status, JSON.stringify(record.metadata), record.created_at, record.updated_at]
    );
    await this.addAuditLog({ actor: 'staff', action: 'ai_era.curriculum_module_created', entity_type: 'ai_era_curriculum_module', entity_id: record.id, after_state: result.rows[0] });
    return result.rows[0];
  }
  const store = readLocalStore();
  store.ai_era_curriculum_modules = store.ai_era_curriculum_modules || [];
  store.ai_era_curriculum_modules.unshift(record);
  writeLocalStore(store);
  await this.addAuditLog({ actor: 'staff', action: 'ai_era.curriculum_module_created', entity_type: 'ai_era_curriculum_module', entity_id: record.id, after_state: record });
  return record;
}

async listAiTranslatorSafetyExercises() {
  if (this.mode() === 'postgres') {
    const result = await this.pool.query('select * from ai_translator_safety_exercises order by created_at desc limit 100');
    return result.rows;
  }
  const store = readLocalStore();
  return [...(store.ai_translator_safety_exercises || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
}

async createAiTranslatorSafetyExercise(input = {}) {
  const record = {
    id: safeId('EL-AIERA-EX'),
    exercise_type: input.exercise_type || input.type || 'spot_translation_risk',
    title: input.title || 'Spot the risky AI translation',
    role_target: input.role_target || input.role || 'student',
    prompt_text: input.prompt_text || input.prompt || 'Compare an AI-translated legal/business sentence with a professional legal-English version and identify the possible risk.',
    safety_note: input.safety_note || 'Practice only. Not legal advice, certified translation, or final legal meaning.',
    teacher_review_status: input.teacher_review_status || 'teacher_review_recommended',
    metadata: input.metadata || {},
    created_at: nowIso(),
    updated_at: nowIso()
  };
  if (this.mode() === 'postgres') {
    const result = await this.pool.query(
      `insert into ai_translator_safety_exercises (id,exercise_type,title,role_target,prompt_text,safety_note,teacher_review_status,metadata,created_at,updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10) returning *`,
      [record.id, record.exercise_type, record.title, record.role_target, record.prompt_text, record.safety_note, record.teacher_review_status, JSON.stringify(record.metadata), record.created_at, record.updated_at]
    );
    await this.addAuditLog({ actor: record.role_target, action: 'ai_era.safety_exercise_created', entity_type: 'ai_translator_safety_exercise', entity_id: record.id, after_state: result.rows[0] });
    return result.rows[0];
  }
  const store = readLocalStore();
  store.ai_translator_safety_exercises = store.ai_translator_safety_exercises || [];
  store.ai_translator_safety_exercises.unshift(record);
  writeLocalStore(store);
  await this.addAuditLog({ actor: record.role_target, action: 'ai_era.safety_exercise_created', entity_type: 'ai_translator_safety_exercise', entity_id: record.id, after_state: record });
  return record;
}

async listAiEraDashboardSignals(role = null) {
  if (this.mode() === 'postgres') {
    const params = [];
    const where = role ? ' where role = $1 ' : ' ';
    if (role) params.push(role);
    const result = await this.pool.query(`select * from ai_era_dashboard_signals${where}order by created_at desc limit 100`, params);
    return result.rows;
  }
  const store = readLocalStore();
  let records = [...(store.ai_era_dashboard_signals || [])];
  if (role) records = records.filter(r => r.role === role);
  return records.sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
}

async createAiEraDashboardSignal(input = {}) {
  const record = {
    id: safeId('EL-AIERA-SIG'),
    role: input.role || 'student',
    signal_name: input.signal_name || input.name || 'AI translation safety progress',
    signal_value: input.signal_value || input.value || 'needs_teacher_review',
    next_action: input.next_action || 'Practice with SmartTeacher AI and bring the result to a teacher.',
    privacy_level: input.privacy_level || 'role_safe_summary',
    metadata: input.metadata || {},
    created_at: nowIso(),
    updated_at: nowIso()
  };
  if (this.mode() === 'postgres') {
    const result = await this.pool.query(
      `insert into ai_era_dashboard_signals (id,role,signal_name,signal_value,next_action,privacy_level,metadata,created_at,updated_at)
       values ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9) returning *`,
      [record.id, record.role, record.signal_name, record.signal_value, record.next_action, record.privacy_level, JSON.stringify(record.metadata), record.created_at, record.updated_at]
    );
    await this.addAuditLog({ actor: record.role, action: 'ai_era.dashboard_signal_created', entity_type: 'ai_era_dashboard_signal', entity_id: record.id, after_state: result.rows[0] });
    return result.rows[0];
  }
  const store = readLocalStore();
  store.ai_era_dashboard_signals = store.ai_era_dashboard_signals || [];
  store.ai_era_dashboard_signals.unshift(record);
  writeLocalStore(store);
  await this.addAuditLog({ actor: record.role, action: 'ai_era.dashboard_signal_created', entity_type: 'ai_era_dashboard_signal', entity_id: record.id, after_state: record });
  return record;
}

async listAiEraMarketingAssets() {
  if (this.mode() === 'postgres') {
    const result = await this.pool.query('select * from ai_era_marketing_assets order by created_at desc limit 100');
    return result.rows;
  }
  const store = readLocalStore();
  return [...(store.ai_era_marketing_assets || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
}

async createAiEraMarketingAsset(input = {}) {
  const record = {
    id: safeId('EL-AIERA-ASSET'),
    asset_type: input.asset_type || input.type || 'teacher_social_post',
    audience: input.audience || 'students_employers_teachers',
    title: input.title || 'Legal English training for the AI era',
    approved_copy: input.approved_copy || input.copy || 'AI can translate words. EnglishLegalese helps professionals understand, explain, write, negotiate, review, and work in Legal English with confidence.',
    approval_status: input.approval_status || 'staff_review_required',
    tracking_required: input.tracking_required !== false,
    metadata: input.metadata || {},
    created_at: nowIso(),
    updated_at: nowIso()
  };
  if (this.mode() === 'postgres') {
    const result = await this.pool.query(
      `insert into ai_era_marketing_assets (id,asset_type,audience,title,approved_copy,approval_status,tracking_required,metadata,created_at,updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10) returning *`,
      [record.id, record.asset_type, record.audience, record.title, record.approved_copy, record.approval_status, record.tracking_required, JSON.stringify(record.metadata), record.created_at, record.updated_at]
    );
    await this.addAuditLog({ actor: 'staff', action: 'ai_era.marketing_asset_created', entity_type: 'ai_era_marketing_asset', entity_id: record.id, after_state: result.rows[0] });
    return result.rows[0];
  }
  const store = readLocalStore();
  store.ai_era_marketing_assets = store.ai_era_marketing_assets || [];
  store.ai_era_marketing_assets.unshift(record);
  writeLocalStore(store);
  await this.addAuditLog({ actor: 'staff', action: 'ai_era.marketing_asset_created', entity_type: 'ai_era_marketing_asset', entity_id: record.id, after_state: record });
  return record;
}


async listAiEraPathwayPlans(role = null) {
  if (this.mode() === 'postgres') {
    const params = [];
    const where = role ? ' where role = $1 ' : ' ';
    if (role) params.push(role);
    const result = await this.pool.query(`select * from ai_era_pathway_plans${where}order by created_at desc limit 100`, params);
    return result.rows;
  }
  const store = readLocalStore();
  let records = [...(store.ai_era_pathway_plans || [])];
  if (role) records = records.filter(r => r.role === role);
  return records.sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
}

async createAiEraPathwayPlan(input = {}) {
  const record = {
    id: safeId('EL-AIERA-PATH'),
    role: input.role || 'student',
    goal: input.goal || 'Legal English performance in the AI era',
    recommended_track: input.recommended_track || input.track || 'AI Translator Safety for Legal and Business English',
    ai_practice_action: input.ai_practice_action || 'Practice with SmartTeacher AI before class.',
    teacher_review_action: input.teacher_review_action || 'Bring this to your teacher for feedback.',
    employer_visibility: input.employer_visibility || 'private_to_learner_and_teacher_unless_employer_safe_summary',
    status: input.status || 'active',
    metadata: input.metadata || {},
    created_at: nowIso(),
    updated_at: nowIso()
  };
  if (this.mode() === 'postgres') {
    const result = await this.pool.query(
      `insert into ai_era_pathway_plans (id,role,goal,recommended_track,ai_practice_action,teacher_review_action,employer_visibility,status,metadata,created_at,updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11) returning *`,
      [record.id, record.role, record.goal, record.recommended_track, record.ai_practice_action, record.teacher_review_action, record.employer_visibility, record.status, JSON.stringify(record.metadata), record.created_at, record.updated_at]
    );
    await this.addAuditLog({ actor: record.role, action: 'ai_era.pathway_plan_created', entity_type: 'ai_era_pathway_plan', entity_id: record.id, after_state: result.rows[0] });
    return result.rows[0];
  }
  const store = readLocalStore();
  store.ai_era_pathway_plans = store.ai_era_pathway_plans || [];
  store.ai_era_pathway_plans.unshift(record);
  writeLocalStore(store);
  await this.addAuditLog({ actor: record.role, action: 'ai_era.pathway_plan_created', entity_type: 'ai_era_pathway_plan', entity_id: record.id, after_state: record });
  return record;
}

async listTeacherReviewHandoffs(status = null) {
  if (this.mode() === 'postgres') {
    const params = [];
    const where = status ? ' where review_status = $1 ' : ' ';
    if (status) params.push(status);
    const result = await this.pool.query(`select * from teacher_review_handoffs${where}order by created_at desc limit 100`, params);
    return result.rows;
  }
  const store = readLocalStore();
  let records = [...(store.teacher_review_handoffs || [])];
  if (status) records = records.filter(r => r.review_status === status);
  return records.sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
}

async createTeacherReviewHandoff(input = {}) {
  const record = {
    id: safeId('EL-REVIEW'),
    student_name: input.student_name || null,
    teacher_name: input.teacher_name || null,
    source_type: input.source_type || 'smartteacher_ai_practice',
    practice_title: input.practice_title || input.title || 'AI translation safety practice',
    review_reason: input.review_reason || 'Teacher review recommended because AI output may miss tone, context, confidentiality, or legal-English nuance.',
    confidentiality_status: input.confidentiality_status || 'no_confidential_information_confirmed',
    review_status: input.review_status || 'teacher_review_needed',
    class_session_id: input.class_session_id || null,
    metadata: input.metadata || {},
    created_at: nowIso(),
    updated_at: nowIso()
  };
  if (this.mode() === 'postgres') {
    const result = await this.pool.query(
      `insert into teacher_review_handoffs (id,student_name,teacher_name,source_type,practice_title,review_reason,confidentiality_status,review_status,class_session_id,metadata,created_at,updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,$12) returning *`,
      [record.id, record.student_name, record.teacher_name, record.source_type, record.practice_title, record.review_reason, record.confidentiality_status, record.review_status, record.class_session_id, JSON.stringify(record.metadata), record.created_at, record.updated_at]
    );
    await this.addAuditLog({ actor: 'teacher', action: 'teacher_review.handoff_created', entity_type: 'teacher_review_handoff', entity_id: record.id, after_state: result.rows[0] });
    return result.rows[0];
  }
  const store = readLocalStore();
  store.teacher_review_handoffs = store.teacher_review_handoffs || [];
  store.teacher_review_handoffs.unshift(record);
  writeLocalStore(store);
  await this.addAuditLog({ actor: 'teacher', action: 'teacher_review.handoff_created', entity_type: 'teacher_review_handoff', entity_id: record.id, after_state: record });
  return record;
}

async listEmployerRoiSnapshots() {
  if (this.mode() === 'postgres') {
    const result = await this.pool.query('select * from employer_roi_snapshots order by created_at desc limit 100');
    return result.rows;
  }
  const store = readLocalStore();
  return [...(store.employer_roi_snapshots || [])].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
}

async createEmployerRoiSnapshot(input = {}) {
  const record = {
    id: safeId('EL-ROI'),
    employer_name: input.employer_name || input.organization_name || 'Employer account',
    cohort_name: input.cohort_name || null,
    reporting_period: input.reporting_period || null,
    learners_active: Number(input.learners_active || 0),
    attendance_rate: input.attendance_rate ?? null,
    homework_completion_rate: input.homework_completion_rate ?? null,
    ai_translation_safety_progress: input.ai_translation_safety_progress ?? null,
    professional_tone_progress: input.professional_tone_progress ?? null,
    speaking_confidence_progress: input.speaking_confidence_progress ?? null,
    privacy_status: input.privacy_status || 'employer_safe_summary_only',
    recommended_next_training: input.recommended_next_training || 'Continue AI Translator Safety plus teacher-led meeting practice.',
    metadata: input.metadata || {},
    created_at: nowIso(),
    updated_at: nowIso()
  };
  if (this.mode() === 'postgres') {
    const result = await this.pool.query(
      `insert into employer_roi_snapshots (id,employer_name,cohort_name,reporting_period,learners_active,attendance_rate,homework_completion_rate,ai_translation_safety_progress,professional_tone_progress,speaking_confidence_progress,privacy_status,recommended_next_training,metadata,created_at,updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14,$15) returning *`,
      [record.id, record.employer_name, record.cohort_name, record.reporting_period, record.learners_active, record.attendance_rate, record.homework_completion_rate, record.ai_translation_safety_progress, record.professional_tone_progress, record.speaking_confidence_progress, record.privacy_status, record.recommended_next_training, JSON.stringify(record.metadata), record.created_at, record.updated_at]
    );
    await this.addAuditLog({ actor: 'employer', action: 'employer.roi_snapshot_created', entity_type: 'employer_roi_snapshot', entity_id: record.id, after_state: result.rows[0] });
    return result.rows[0];
  }
  const store = readLocalStore();
  store.employer_roi_snapshots = store.employer_roi_snapshots || [];
  store.employer_roi_snapshots.unshift(record);
  writeLocalStore(store);
  await this.addAuditLog({ actor: 'employer', action: 'employer.roi_snapshot_created', entity_type: 'employer_roi_snapshot', entity_id: record.id, after_state: record });
  return record;
}

async listConfidentialityChecks(status = null) {
  if (this.mode() === 'postgres') {
    const params = [];
    const where = status ? ' where status = $1 ' : ' ';
    if (status) params.push(status);
    const result = await this.pool.query(`select * from confidentiality_checks${where}order by created_at desc limit 100`, params);
    return result.rows;
  }
  const store = readLocalStore();
  let records = [...(store.confidentiality_checks || [])];
  if (status) records = records.filter(r => r.status === status);
  return records.sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,100);
}

async createConfidentialityCheck(input = {}) {
  const record = {
    id: safeId('EL-CONF'),
    requester_role: input.requester_role || input.role || 'student',
    item_type: input.item_type || 'ai_practice_or_upload',
    item_title: input.item_title || input.title || 'Confidentiality check before AI practice',
    contains_sensitive_info: input.contains_sensitive_info || 'unknown',
    recommended_action: input.recommended_action || 'Use anonymized or fictional text; ask teacher/staff before uploading sensitive information.',
    ai_use_status: input.ai_use_status || 'practice_only_not_legal_advice',
    status: input.status || 'needs_review',
    metadata: input.metadata || {},
    created_at: nowIso(),
    updated_at: nowIso()
  };
  if (this.mode() === 'postgres') {
    const result = await this.pool.query(
      `insert into confidentiality_checks (id,requester_role,item_type,item_title,contains_sensitive_info,recommended_action,ai_use_status,status,metadata,created_at,updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11) returning *`,
      [record.id, record.requester_role, record.item_type, record.item_title, record.contains_sensitive_info, record.recommended_action, record.ai_use_status, record.status, JSON.stringify(record.metadata), record.created_at, record.updated_at]
    );
    await this.addAuditLog({ actor: record.requester_role, action: 'confidentiality.check_created', entity_type: 'confidentiality_check', entity_id: record.id, after_state: result.rows[0] });
    return result.rows[0];
  }
  const store = readLocalStore();
  store.confidentiality_checks = store.confidentiality_checks || [];
  store.confidentiality_checks.unshift(record);
  writeLocalStore(store);
  await this.addAuditLog({ actor: record.requester_role, action: 'confidentiality.check_created', entity_type: 'confidentiality_check', entity_id: record.id, after_state: record });
  return record;
}

}

function normalizeClassSession(input) {
  const timestamp = nowIso();
  return {
    id: input.id || safeId('EL-CLS'),
    learner_name: input.learner_name || input.student_name || 'Unassigned learner',
    teacher_name: input.teacher_name || 'Teacher not assigned',
    organization_name: input.organization_name || input.employer_name || null,
    scheduled_at: input.scheduled_at || null,
    timezone: input.timezone || 'America/New_York',
    video_provider: input.video_provider || 'Google Meet',
    status: input.status || 'requested',
    payment_credit_status: input.payment_credit_status || 'pending_credit_or_payment',
    readiness_status: input.readiness_status || 'needs_staff_review',
    closeout_status: input.closeout_status || 'not_started',
    payout_status: input.payout_status || 'not_ready_until_closeout',
    metadata: input.metadata || {},
    created_at: timestamp,
    updated_at: timestamp
  };
}

const REQUIRED_TABLES = [
  'users',
  'organizations',
  'organization_members',
  'teacher_profiles',
  'student_profiles',
  'employer_profiles',
  'class_sessions',
  'saved_work_items',
  'homework_assignments',
  'assessment_attempts',
  'progress_reports',
  'credit_ledger',
  'teacher_payouts',
  'teacher_marketing_campaigns',
  'file_objects',
  'audit_log',
  'booking_requests',
  'teacher_availability_blocks',
  'class_session_closeouts',
  'staff_tasks',
  'notification_preferences',
  'integration_health_checks',
  'deployment_records',
  'backup_checkpoints',
  'production_launch_events',
  'support_threads',
  'teacher_marketing_assets',
  'classroom_readiness_reviews',
  'role_journey_events',
  'action_center_items',
  'video_room_events',
  'ai_tutor_interactions',
  'marketing_lead_attribution',
  'ai_era_curriculum_modules',
  'ai_translator_safety_exercises',
  'ai_era_dashboard_signals',
  'ai_era_marketing_assets',
  'ai_era_pathway_plans',
  'teacher_review_handoffs',
  'employer_roi_snapshots',
  'confidentiality_checks'
];

module.exports = {
  PersistentStore,
  REQUIRED_TABLES,
  normalizeClassSession,
  LOCAL_DB_PATH
};
