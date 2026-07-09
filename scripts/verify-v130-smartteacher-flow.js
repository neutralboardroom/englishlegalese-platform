const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const requiredFiles = ['package.json', 'server.js', 'app.js', 'index.html', 'styles.css', 'README.md', 'RELEASE_NOTES.md'];
for (const file of requiredFiles) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) throw new Error(`Missing required file: ${file}`);
}
const pkg = require(path.join(root, 'package.json'));
if (!/^1\.(30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54)\.0$/.test(pkg.version)) throw new Error(`Expected package version 1.30.0 or later compatible build, got ${pkg.version}`);
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const release = fs.readFileSync(path.join(root, 'RELEASE_NOTES.md'), 'utf8');
const checks = [
  [app, 'v130SmartTeacherBrandSection', 'v1.30 SmartTeacher brand section'],
  [app, 'Practice with SmartTeacher AI. Improve with live teachers. Prove progress safely.', 'SmartTeacher official product line'],
  [app, 'v130RolePathsSection', 'v1.30 role paths'],
  [app, 'v130UnifiedRecordSection', 'v1.30 unified operating record'],
  [app, 'v130ClassroomReadinessSection', 'v1.30 classroom readiness'],
  [app, 'v130TeacherMarketingCalendarSection', 'v1.30 teacher marketing calendar'],
  [app, 'v130EmployerProposalSection', 'v1.30 employer proposal'],
  [app, 'v130OwnerStaffConsoleSection', 'v1.30 owner/staff console'],
  [server, '/api/v130/smartteacher-flow', 'v1.30 API endpoint'],
  [server, 'v130SmartTeacherFlowSeed', 'v1.30 server seed'],
  [index, '#v130-smartteacher-brand', 'v1.30 nav/footer anchor'],
  [release, 'EnglishLegalese Platform v1.30.0', 'v1.30 release notes']
];
for (const [text, needle, label] of checks) {
  if (!text.includes(needle)) throw new Error(`Missing ${label}: ${needle}`);
}
console.log('v1.30 SmartTeacher AI brand lock and seamless role flow verification passed.');
