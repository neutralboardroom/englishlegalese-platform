const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
function read(file){ return fs.readFileSync(path.join(root, file), 'utf8'); }
function assertHas(file, needle){ const text = read(file); if(!text.includes(needle)){ throw new Error(`${file} missing: ${needle}`); } }
const checks = [
  ['package.json', 'englishlegalese-platform'],
  ['server.js', 'live-skills-feedback-loop'],
  ['server.js', '/api/v146/live-skills-feedback-loop'],
  ['server.js', '/api/v146/workshop-series'],
  ['server.js', '/api/v146/practice-packet'],
  ['server.js', '/api/v146/teacher-feedback-loop'],
  ['server.js', '/api/v146/employer-skills-progress-brief'],
  ['server.js', '/api/v146/skill-data-preservation-review'],
  ['server.js', 'raw recordings'],
  ['app.js', 'v1.46.0 Live Skills Practice + Feedback Loop'],
  ['app.js', 'v146SkillPackets'],
  ['app.js', 'native-language bridge'],
  ['app.js', 'Teacher feedback'],
  ['app.js', 'Employer-safe'],
  ['styles.css', 'v146-section'],
  ['index.html', '#v146-live-skills-feedback'],
  ['README.md', 'v1.46.0 — Live Skills Practice + Feedback Loop'],
  ['RELEASE_NOTES.md', 'EnglishLegalese Platform v1.46.0'],
  ['SAFE_DEPLOYMENT_CHECKLIST.md', 'v1.46.0 safe deployment checklist additions']
];
for (const [file, needle] of checks) assertHas(file, needle);
console.log('v1.46 Live Skills Practice + Feedback Loop verification passed.');
