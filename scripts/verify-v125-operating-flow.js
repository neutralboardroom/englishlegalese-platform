const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const requiredFiles = [
  'db/migrations/008_ai_era_operating_flow.sql',
  'src/persistence.js',
  'server.js',
  'app.js',
  'index.html'
];
const requiredText = [
  ['app.js', 'v125PathfinderSection'],
  ['app.js', 'v125TeacherReviewLoopSection'],
  ['app.js', 'v125ConfidentialityMatrixSection'],
  ['app.js', 'v125SmartTeacherPromptLibrarySection'],
  ['server.js', '/api/v125/ai-era-operating-brief'],
  ['src/persistence.js', 'createTeacherReviewHandoff'],
  ['src/persistence.js', 'createEmployerRoiSnapshot'],
  ['src/persistence.js', 'createConfidentialityCheck'],
  ['package.json', 'englishlegalese-platform']
];
let failed = false;
for (const f of requiredFiles) {
  if (!fs.existsSync(path.join(root, f))) { console.error('Missing file:', f); failed = true; }
}
for (const [file, needle] of requiredText) {
  const body = fs.readFileSync(path.join(root, file), 'utf8');
  if (!body.includes(needle)) { console.error(`Missing ${needle} in ${file}`); failed = true; }
}
if (failed) process.exit(1);
console.log('v1.25.0 AI-era operating flow verification passed.');
