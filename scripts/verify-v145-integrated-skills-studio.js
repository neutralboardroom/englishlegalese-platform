const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
function read(file){ return fs.readFileSync(path.join(root, file), 'utf8'); }
function assertHas(file, needle){ const text = read(file); if(!text.includes(needle)){ throw new Error(`${file} missing: ${needle}`); } }
const checks = [
  ['package.json', 'englishlegalese-platform'],
  ['server.js', 'integrated-skills-studio'],
  ['server.js', '/api/v145/integrated-skills-studio'],
  ['server.js', '/api/v145/skills-course-sequence'],
  ['server.js', '/api/v145/placement-skill-routing'],
  ['server.js', '/api/v145/speaking-listening-session'],
  ['server.js', '/api/v145/reading-writing-session'],
  ['server.js', '/api/v145/teacher-classroom-tool-action'],
  ['server.js', '/api/v145/employer-integrated-skills-report'],
  ['server.js', '/api/v145/no-data-loss-skill-check'],
  ['app.js', 'v1.45.0 Integrated Skills Studio'],
  ['app.js', 'speaking, listening, reading, and writing'],
  ['app.js', 'Native-language support'],
  ['app.js', 'teacherReviewHandoffs'],
  ['app.js', 'savedWorkItems'],
  ['app.js', 'employerSafeReports'],
  ['styles.css', 'v145-section'],
  ['index.html', '#v145-integrated-skills-studio'],
  ['README.md', 'Integrated Skills Studio'],
  ['RELEASE_NOTES.md', 'v1.45.0'],
  ['SAFE_DEPLOYMENT_CHECKLIST.md', 'v1.45 integrated skills preservation checklist']
];
for (const [file, needle] of checks) assertHas(file, needle);
console.log('v1.45 Integrated Skills Studio verification passed.');
