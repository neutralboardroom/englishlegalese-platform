const fs = require('fs');
const requiredFiles = ['app.js','server.js','index.html','README.md','RELEASE_NOTES.md','SAFE_DEPLOYMENT_CHECKLIST.md','DATA_MODEL.md','PRODUCTION_BACKEND.md','package.json'];
const requiredStrings = [
  ['package.json', '1.54.0'],
  ['app.js', 'v1.48.0 Usability Continuity Pass'],
  ['app.js', 'v148-usability-continuity'],
  ['app.js', 'Make every user’s next step obvious'],
  ['app.js', 'AI can translate words'],
  ['app.js', 'Student work, calendars, payments, credits, reports, certificates, test scores'],
  ['server.js', '/api/v148/usability-continuity-pass'],
  ['server.js', '/api/v148/plain-language-user-path'],
  ['server.js', '/api/v148/continuity-preservation-audit'],
  ['server.js', '/api/v148/employer-safe-progress-card'],
  ['server.js', 'v148UsabilityContinuitySeed'],
  ['index.html', '#v148-usability-continuity'],
  ['README.md', 'v1.48.0 — Usability Continuity Pass'],
  ['RELEASE_NOTES.md', 'v1.48.0 — Usability Continuity Pass'],
  ['SAFE_DEPLOYMENT_CHECKLIST.md', 'v1.48.0 — Usability Continuity Pass'],
  ['DATA_MODEL.md', 'v1.48.0 — Usability Continuity Pass'],
  ['PRODUCTION_BACKEND.md', 'v1.48.0 — Usability Continuity Pass']
];
const missingFiles = requiredFiles.filter(f => !fs.existsSync(f));
if (missingFiles.length) {
  console.error('Missing required files:', missingFiles.join(', '));
  process.exit(1);
}
const missingStrings = [];
for (const [file, needle] of requiredStrings) {
  const text = fs.readFileSync(file, 'utf8');
  if (!text.includes(needle)) missingStrings.push(`${file}: ${needle}`);
}
if (missingStrings.length) {
  console.error('Missing v1.48 usability continuity markers:\n' + missingStrings.join('\n'));
  process.exit(1);
}
console.log('v1.48 usability continuity verification passed.');
