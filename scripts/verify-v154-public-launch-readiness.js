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
  ['package.json', 'e2e:public'],
  ['server.js', '/api/v154/public-launch-readiness'],
  ['server.js', '/api/v154/first-course-content'],
  ['server.js', '/api/v154/launch-gate-check'],
  ['server.js', '/api/v154/first-course-lesson-template'],
  ['server.js', '/api/v154/teacher-onboarding-plan'],
  ['server.js', '/api/v154/diagnostic-to-course-plan'],
  ['server.js', '/api/v154/public-beta-readiness'],
  ['server.js', '/api/v154/end-to-end-launch-test-plan'],
  ['server.js', 'v154PublicLaunchReadinessSeed'],
  ['app.js', 'v1.54.0 Public Launch Readiness Sprint'],
  ['app.js', 'Stop adding broad layers'],
  ['app.js', 'Controlled beta rules'],
  ['app.js', 'Launch course set and first lesson sequences'],
  ['app.js', 'Teacher confirmation recommended'],
  ['index.html', '#v154-public-launch-readiness'],
  ['styles.css', 'v154-dashboard-panel'],
  ['README.md', 'v1.54.0 — Public Launch Readiness Sprint'],
  ['RELEASE_NOTES.md', 'v1.54.0 — Public Launch Readiness Sprint'],
  ['SAFE_DEPLOYMENT_CHECKLIST.md', 'v1.54.0 Safe Deployment Checklist'],
  ['DATA_MODEL.md', 'v1.54.0 Data Model Note'],
  ['PRODUCTION_BACKEND.md', '/api/v154/public-launch-readiness'],
  ['DEPLOYMENT.md', 'v1.54.0 Deployment Note'],
  ['LIVE_LAUNCH_CHECKLIST.md', 'v1.54.0 Live Launch Checklist'],
  ['INFRASTRUCTURE_SETUP.md', 'v1.54.0 Infrastructure Setup Addendum'],
  ['PRODUCTION_SECRETS_TEMPLATE.md', 'v1.54.0 Production Secrets Addendum'],
  ['.env.example', 'PUBLIC_BETA_MODE'],
  ['.env.production.example', 'PUBLIC_BETA_MODE']
].forEach(([file, needle]) => must(file, needle));
['DATABASE_URL','Stripe','OPENAI_API_KEY','SMTP','Object storage','class links','legal pages','device QA','backup','no-data-loss','student work','calendars','payments','reports','certificates','test scores','teacher notes','employer records','uploads','audit logs','payouts'].forEach(term => must('server.js', term));
console.log('v1.54 public launch readiness verification passed.');
