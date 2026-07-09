const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const baseUrl = process.env.E2E_BASE_URL || process.env.APP_BASE_URL || '';
const requiredWorkflow = [
  'Student signs up',
  'Student selects preferred language',
  'Student takes diagnostic',
  'System recommends course',
  'Student pays or enters beta credit',
  'Class scheduled inside EnglishLegalese',
  'Manual or vendor class link attached',
  'Teacher closes out class',
  'Homework assigned',
  'Teacher reviews saved work',
  'Employer receives privacy-safe report',
  'Staff reviews payout'
];
function localStaticCheck(){
  const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
  const missing = requiredWorkflow.filter(step => !server.includes(step));
  if (missing.length) throw new Error(`End-to-end workflow text missing from server.js: ${missing.join(', ')}`);
  console.log('Public launch E2E static plan check passed. Set E2E_BASE_URL=http://localhost:3000 and run with the server running for live endpoint checks.');
}
async function liveCheck(){
  const urls = ['/health','/api/v154/public-launch-readiness','/api/v154/first-course-content','/api/v154/end-to-end-launch-test-plan'];
  for (const u of urls) {
    const res = await fetch(baseUrl.replace(/\/$/, '') + u);
    if (!res.ok) throw new Error(`${u} returned ${res.status}`);
  }
  console.log(`Public launch E2E live smoke check passed against ${baseUrl}.`);
}
if (!baseUrl || baseUrl.includes('englishlegalese.com')) localStaticCheck();
else liveCheck().catch(error => { console.error(error); process.exit(1); });
