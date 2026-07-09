const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const requiredFiles = [
  'app.js',
  'styles.css',
  'server.js',
  'README.md',
  'RELEASE_NOTES.md',
  'SAFE_DEPLOYMENT_CHECKLIST.md',
  'PRODUCTION_BACKEND.md',
  'DATA_MODEL.md',
  'package.json'
];
const requiredText = [
  ['app.js', 'v127RoleStartSection'],
  ['app.js', 'v127ObjectionSection'],
  ['app.js', 'v127UnifiedSessionSection'],
  ['app.js', 'v127ClassroomCalendarSection'],
  ['app.js', 'v127TeacherMarketingSection'],
  ['app.js', 'v127EmployerReportSection'],
  ['app.js', 'v127StaffCommandCenterSection'],
  ['app.js', 'v127AiTutorPromptSection'],
  ['app.js', 'v1.27.0 AI-Era Simplicity + Conversion Flow'],
  ['styles.css', 'v1.27.0 Simplicity + AI-era conversion flow'],
  ['server.js', '/api/v127/simplicity-flow'],
  ['server.js', 'v127SimplicityFlowSeed'],
  ['README.md', 'v1.27.0 focus'],
  ['RELEASE_NOTES.md', 'v1.27.0'],
  ['SAFE_DEPLOYMENT_CHECKLIST.md', 'v1.27.0 deployment check'],
  ['PRODUCTION_BACKEND.md', 'v1.27.0 simplicity-flow endpoint'],
  ['DATA_MODEL.md', 'v1.27.0 data model note']
];
let failed = false;
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    console.error('Missing file:', file);
    failed = true;
  }
}
for (const [file, needle] of requiredText) {
  const body = fs.readFileSync(path.join(root, file), 'utf8');
  if (!body.includes(needle)) {
    console.error(`Missing ${needle} in ${file}`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log('v1.27.0 simplicity and AI-era conversion flow verification passed.');
