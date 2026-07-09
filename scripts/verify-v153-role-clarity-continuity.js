const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
function read(file){ return fs.readFileSync(path.join(root, file), 'utf8'); }
function must(file, needle){
  const text = read(file);
  if (!text.includes(needle)) throw new Error(`${file} missing required text: ${needle}`);
}
[
  ['package.json', '1.54.0'],
  ['server.js', '/api/v153/role-clarity-continuity-pass'],
  ['server.js', '/api/v153/plain-role-next-step'],
  ['server.js', '/api/v153/staff-data-continuity-review'],
  ['server.js', '/api/v153/employer-safe-role-summary'],
  ['server.js', '/api/v153/deployment-continuity-gate'],
  ['server.js', 'v153RoleClarityContinuitySeed'],
  ['app.js', 'v1.53.0 Role Clarity + Data Continuity Pass'],
  ['app.js', 'One clear next step for every user'],
  ['app.js', 'What do I do next?'],
  ['app.js', 'What stays private?'],
  ['app.js', 'What must not be lost?'],
  ['app.js', 'AI can translate words'],
  ['app.js', 'Keep the current EnglishLegalese logo'],
  ['index.html', '#v153-role-clarity-continuity'],
  ['styles.css', 'v153-dashboard-panel'],
  ['README.md', 'v1.53.0 Role Clarity + Data Continuity Pass'],
  ['RELEASE_NOTES.md', 'v1.53.0 — Role Clarity + Data Continuity Pass'],
  ['SAFE_DEPLOYMENT_CHECKLIST.md', 'v1.53.0 safe deployment checklist'],
  ['DATA_MODEL.md', 'v1.53.0 role clarity + continuity records'],
  ['PRODUCTION_BACKEND.md', '/api/v153/role-clarity-continuity-pass'],
  ['DEPLOYMENT.md', 'v1.53.0 deployment note']
].forEach(([file, needle]) => must(file, needle));
['student work','calendars','payments','reports','certificates','test scores','teacher notes','employer records','uploads','audit logs','payouts'].forEach(term => must('server.js', term));
console.log('v1.53 role clarity + data continuity verification passed.');
