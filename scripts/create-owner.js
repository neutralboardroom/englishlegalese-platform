#!/usr/bin/env node
const { PersistentStore } = require('../src/persistence');
const { ProductionServices } = require('../src/productionServices');
async function main() {
  const email = process.env.OWNER_EMAIL;
  const password = process.env.OWNER_PASSWORD;
  const full_name = process.env.OWNER_NAME || 'EnglishLegalese Owner';
  if (!email || !password) {
    console.error('OWNER_EMAIL and OWNER_PASSWORD are required. Use a strong temporary password, then rotate/clear it after creating the account.');
    process.exit(1);
  }
  const store = new PersistentStore();
  const services = new ProductionServices(store);
  const result = await services.registerUser({ email, password, full_name, role: 'owner' });
  await store.addAuditLog({ actor: email, action: 'owner.bootstrap_created', entity_type: 'user', entity_id: result.user.id, after_state: { email, role: 'owner' } });
  console.log(JSON.stringify({ ok: true, mode: store.mode(), user: result.user, warning: 'Owner account created. Rotate the password and remove OWNER_PASSWORD from the hosting environment after first login.' }, null, 2));
}
main().catch(err => { console.error(JSON.stringify({ ok:false, error: err.message }, null, 2)); process.exit(1); });
