const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
function read(file){ return fs.readFileSync(path.join(root, file), 'utf8'); }
function assertIncludes(file, text){
  const body = read(file);
  if(!body.includes(text)) throw new Error(`${file} is missing required v1.43 marker: ${text}`);
}
[
  ['package.json', 'englishlegalese-platform'],
  ['app.js', 'v1.43.0 Course Placement + Ordered Curriculum'],
  ['app.js', 'v143-course-placement'],
  ['app.js', 'Beginner Legal English Foundations'],
  ['app.js', 'AI Translator Safety Lab'],
  ['app.js', 'LL.M. and Law School Legal English Readiness'],
  ['server.js', '/api/v143/course-placement-system'],
  ['server.js', '/api/v143/course-catalog'],
  ['server.js', '/api/v143/placement-assessment'],
  ['server.js', '/api/v143/learning-path-enrollment'],
  ['server.js', '/api/v143/lesson-plan-handoff'],
  ['server.js', '/api/v143/employer-curriculum-report'],
  ['styles.css', 'v1.43.0 Course Placement + Ordered Curriculum'],
  ['README.md', 'v1.43.0 — Course Placement + Ordered Curriculum'],
  ['RELEASE_NOTES.md', 'v1.43.0 — Course Placement + Ordered Curriculum'],
  ['SAFE_DEPLOYMENT_CHECKLIST.md', 'v1.43.0 Course Placement deployment guardrails'],
  ['DEPLOYMENT.md', 'v1.43.0 deployment note']
].forEach(([file, text]) => assertIncludes(file, text));
console.log('v1.43 Course Placement + Ordered Curriculum verification passed.');
