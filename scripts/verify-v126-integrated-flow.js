const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const requiredFiles = [
  'app.js',
  'styles.css',
  'server.js',
  'README.md',
  'RELEASE_NOTES.md',
  'SAFE_DEPLOYMENT_CHECKLIST.md',
  'PRODUCTION_BACKEND.md',
  'package.json'
];
const requiredText = [
  ['app.js', 'v126IntegratedJourneySection'],
  ['app.js', 'v126ContinuitySection'],
  ['app.js', 'v126TeacherMarketingCopySection'],
  ['app.js', 'v126ProductionReadinessSection'],
  ['styles.css', 'v1.26.0 AI-era Integrated Product Flow polish'],
  ['server.js', '/api/v126/integrated-product-flow'],
  ['server.js', 'v126IntegratedProductFlowSeed'],
  ['README.md', '/api/v126/integrated-product-flow'],
  ['RELEASE_NOTES.md', 'v1.26.0'],
  ['SAFE_DEPLOYMENT_CHECKLIST.md', 'v1.26.0'],
  ['PRODUCTION_BACKEND.md', 'v1.26.0']
];
let failed = false;
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    console.error('Missing file:', file);
    failed = true;
  }
}
for (const [file, needle] of requiredText) {
  const body = fs.readFileSync(path.join(root, file), 'utf8');
  if (!body.includes(needle)) {
    console.error(`Missing ${needle} in ${file}`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log('v1.26.0 AI-era integrated product flow verification passed.');
