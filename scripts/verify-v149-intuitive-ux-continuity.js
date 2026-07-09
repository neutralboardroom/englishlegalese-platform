const fs = require('fs');
const requiredFiles = ['app.js','server.js','index.html','README.md','RELEASE_NOTES.md','SAFE_DEPLOYMENT_CHECKLIST.md','DATA_MODEL.md','PRODUCTION_BACKEND.md','package.json'];
const requiredStrings = [
  ['package.json', '1.54.0'],
  ['app.js', 'v1.49.0 Intuitive UX Continuity Pass'],
  ['app.js', 'v149-intuitive-ux-continuity'],
  ['app.js', 'Make every role easy to understand'],
  ['app.js', 'AI can translate words'],
  ['app.js', 'Continuity risk check'],
  ['server.js', '/api/v149/intuitive-ux-continuity-pass'],
  ['server.js', '/api/v149/user-flow-simplifier'],
  ['server.js', '/api/v149/continuity-risk-check'],
  ['server.js', '/api/v149/staff-ux-blocker-queue'],
  ['server.js', '/api/v149/employer-safe-summary'],
  ['server.js', 'v149IntuitiveUxSeed'],
  ['index.html', '#v149-intuitive-ux-continuity'],
  ['README.md', 'v1.49.0 — Intuitive UX Continuity Pass'],
  ['RELEASE_NOTES.md', 'v1.49.0 — Intuitive UX Continuity Pass'],
  ['SAFE_DEPLOYMENT_CHECKLIST.md', 'v1.49.0 Intuitive UX Continuity checklist'],
  ['DATA_MODEL.md', 'v1.49.0 Intuitive UX Continuity records'],
  ['PRODUCTION_BACKEND.md', 'v1.49.0 backend additions']
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
  console.error('Missing v1.49 intuitive UX continuity markers:\n' + missingStrings.join('\n'));
  process.exit(1);
}
console.log('v1.49 intuitive UX continuity verification passed.');
