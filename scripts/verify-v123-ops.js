const { PersistentStore, REQUIRED_TABLES } = require('../src/persistence');

(async () => {
  const store = new PersistentStore();
  const health = await store.health();
  const required = ['action_center_items','video_room_events','ai_tutor_interactions','marketing_lead_attribution'];
  const missing = required.filter(t => !REQUIRED_TABLES.includes(t));
  console.log(JSON.stringify({
    ok: missing.length === 0,
    persistence_mode: health.mode,
    checked_tables: required,
    missing,
    note: 'This verifies v1.23 integrated operating console tables are known to the persistence layer. Production still requires migrations and credentials.'
  }, null, 2));
  if (missing.length) process.exit(1);
})().catch(error => { console.error(error); process.exit(1); });
