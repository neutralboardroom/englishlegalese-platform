const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
function read(file){ return fs.readFileSync(path.join(root, file), 'utf8'); }
function assertIncludes(file, text){
  const body = read(file);
  if(!body.includes(text)) throw new Error(`${file} is missing required v1.42 marker: ${text}`);
}
[
  ['package.json', 'englishlegalese-platform'],
  ['app.js', 'v1.42.0 Continuity Command Center'],
  ['app.js', 'v142-continuity-command'],
  ['app.js', 'v142-classroom-command'],
  ['app.js', 'v142-teacher-marketing-approval'],
  ['app.js', 'Save practice to folder'],
  ['app.js', 'No-data-loss promise'],
  ['server.js', '/api/v142/continuity-command-center'],
  ['server.js', '/api/v142/continuity-records'],
  ['server.js', '/api/v142/classroom-command-actions'],
  ['server.js', '/api/v142/teacher-marketing-approval'],
  ['server.js', '/api/v142/employer-safe-continuity-report'],
  ['server.js', '/api/v142/deployment-preservation-check'],
  ['server.js', 'Code deployments must never wipe or overwrite persistent student'],
  ['styles.css', 'v1.42.0 Continuity Command Center'],
  ['README.md', 'v1.42.0 — Continuity Command Center'],
  ['RELEASE_NOTES.md', 'v1.42.0 — Continuity Command Center'],
  ['SAFE_DEPLOYMENT_CHECKLIST.md', 'v1.42.0 Continuity Command Center'],
  ['DEPLOYMENT.md', 'v1.42.0 deployment note']
].forEach(([file, text]) => assertIncludes(file, text));
console.log('v1.42 Continuity Command Center verification passed.');
