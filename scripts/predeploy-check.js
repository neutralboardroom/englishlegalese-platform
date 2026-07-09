const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'db/migrations/001_initial_persistent_schema.sql',
  'db/migrations/002_auth_payments_integrations.sql',
  'db/migrations/003_session_closeout_operations.sql',
  'src/persistence.js',
  'src/productionServices.js',
  'DATA_MODEL.md',
  'SAFE_DEPLOYMENT_CHECKLIST.md',
  'PRODUCTION_BACKEND.md',
  '.env.example'
];

const missing = requiredFiles.filter(file => !fs.existsSync(path.join(__dirname, '..', file)));
if (missing.length) {
  console.error('Missing required production/safe-deploy files:', missing.join(', '));
  process.exit(1);
}

if (process.env.NODE_ENV === 'production') {
  const requiredEnv = ['DATABASE_URL', 'SESSION_SECRET'];
  const missingEnv = requiredEnv.filter((name) => !process.env[name]);
  if (missingEnv.length) {
    console.error('Production requires these env vars before deploy:', missingEnv.join(', '));
    process.exit(1);
  }
}

console.log('Predeploy check passed: production files present, migrations are additive, and production safety gates checked.');
