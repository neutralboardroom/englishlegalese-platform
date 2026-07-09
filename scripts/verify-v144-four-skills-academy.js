const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
function read(file){ return fs.readFileSync(path.join(root, file), 'utf8'); }
function assertHas(file, needle){ const text = read(file); if(!text.includes(needle)){ throw new Error(`${file} missing: ${needle}`); } }
const checks = [
  ['package.json', 'englishlegalese-platform'],
  ['server.js', '/api/v144/four-skills-academy'],
  ['server.js', '/api/v144/skill-course-map'],
  ['server.js', '/api/v144/skill-placement-assessment'],
  ['server.js', '/api/v144/voice-practice-session'],
  ['server.js', '/api/v144/reading-writing-workshop'],
  ['server.js', '/api/v144/employer-four-skills-report'],
  ['app.js', 'v1.44.0 Four-Skills Voice + Reading/Writing Academy'],
  ['app.js', 'Speaking'],
  ['app.js', 'Listening'],
  ['app.js', 'Reading'],
  ['app.js', 'Writing'],
  ['app.js', 'SpeechRecognition'],
  ['app.js', 'teacherReviewHandoffs'],
  ['app.js', 'lessonFolderItems'],
  ['app.js', 'employerSafeReports'],
  ['styles.css', 'v144-section'],
  ['index.html', '#v144-four-skills-academy'],
  ['README.md', 'Four-Skills Voice + Reading/Writing Academy'],
  ['SAFE_DEPLOYMENT_CHECKLIST.md', 'v1.44 four-skills preservation checklist']
];
for (const [file, needle] of checks) assertHas(file, needle);
console.log('v1.44 Four-Skills Academy verification passed.');
