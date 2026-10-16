const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const index = read('index.html');
const product = read('product-v1550.js');
const css = read('product-v1550.css');
const pkg = JSON.parse(read('package.json'));

const checks = [
  ['package version is 1.55.0', pkg.version === '1.55.0'],
  ['product JS is loaded', index.includes('product-v1550.js')],
  ['product CSS is loaded', index.includes('product-v1550.css')],
  ['Scenario Studio exists', product.includes('Legal Scenario Studio') && product.includes('practice-studio')],
  ['personalized four-week plan exists', product.includes('Personalized Learning Path') && product.includes('four-week practice plan')],
  ['Skills Passport exists', product.includes('Legal Skills Passport') && product.includes('skills-passport')],
  ['SmartTeacher scenario handoff exists', product.includes('Load into SmartTeacher AI') && product.includes('LEGAL ENGLISH LANGUAGE PRACTICE')],
  ['teacher review packet exists', product.includes('Teacher Review Packet') && product.includes('Prepare teacher review packet')],
  ['employer-safe snapshot exists', product.includes('Privacy-Safe Learner Progress Snapshot') && product.includes('Employer-safe progress snapshot')],
  ['self-check avoids accredited-score claim', product.includes('not an accredited test score') && product.includes('learner self-check')],
  ['confidentiality boundary is explicit', product.includes('Do not enter confidential client facts')],
  ['legal advice boundary is explicit', product.includes('not legal advice')],
  ['six skill dimensions exist', ['precision','tone','speaking','writing','reading','aiReview'].every(k => product.includes(`'${k}'`))],
  ['practice-area breadth exists', ['Client Communication','Contracts','Legal Reading','Legal Writing','Meetings & Negotiation','Academic & Career','AI & Legal Communication'].every(x => product.includes(x))],
  ['responsive styles exist', css.includes('@media(max-width:680px)') && css.includes('@media(max-width:980px)')],
  ['reduced-motion support exists', css.includes('prefers-reduced-motion')],
  ['new check is wired into npm check', String(pkg.scripts?.check || '').includes('verify-v1550-adaptive-practice.js')]
];

const failures = checks.filter(([, ok]) => !ok);
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
if (failures.length) {
  console.error(`v1.55.0 verification failed: ${failures.length} check(s).`);
  process.exit(1);
}
console.log(`v1.55.0 adaptive practice verification passed: ${checks.length} checks.`);