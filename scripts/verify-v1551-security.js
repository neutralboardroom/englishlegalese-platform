const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const pkg = JSON.parse(read('package.json'));
const workflow = read('.github/workflows/englishlegalese-release-gate.yml');
const securityPatchPredecessor = '1811adc2ba847ac64abe66c16e87627d599e98dd';
const acceptedV1551 = 'a499e99439927e630bd334b4a3b9fbebdff08cd5';
const isSecurityPatch = pkg.version === '1.55.1';
const isQualifiedSuccessor = ['1.56.0','1.57.0'].includes(pkg.version);

const checks = [];
const check = (name, ok) => checks.push([name, Boolean(ok)]);

check('package version is v1.55.1 or a qualified v1.56/v1.57 successor', isSecurityPatch || isQualifiedSuccessor);
check('Node runtime floor is 20+', /^>=20/.test(String(pkg.engines?.node || '')));
check('Express is pinned to current v4 line', pkg.dependencies?.express === '4.22.3');
check('AWS S3 client is pinned', pkg.optionalDependencies?.['@aws-sdk/client-s3'] === '3.1152.0');
check('AWS S3 presigner is pinned to same release', pkg.optionalDependencies?.['@aws-sdk/s3-request-presigner'] === '3.1152.0');
check('Nodemailer is upgraded to current 10.x security line', pkg.optionalDependencies?.nodemailer === '10.1.1');
check('PostgreSQL client is pinned current', pkg.optionalDependencies?.pg === '8.23.1');
check('high/critical npm audit command exists', pkg.scripts?.['audit:high'] === 'npm audit --audit-level=high');
check('release workflow installs dependencies before checks', workflow.includes('npm install --ignore-scripts --no-fund'));
check('release workflow blocks high/critical npm audit findings', workflow.includes('npm run audit:high'));
check('v1.55.1 security verifier remains wired into npm check', String(pkg.scripts?.check || '').includes('verify-v1551-security.js'));

try {
  if (isSecurityPatch) {
    cp.execFileSync('git', ['cat-file', '-e', `${securityPatchPredecessor}^{commit}`], { cwd: root, stdio: 'ignore' });
    const diff = cp.execFileSync('git', ['diff', '--name-only', `${securityPatchPredecessor}...HEAD`], { cwd: root, encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean);
    const allowed = p => [
      'package.json',
      '.github/workflows/englishlegalese-release-gate.yml',
      'scripts/verify-v1550-adaptive-practice.js',
      'scripts/verify-v1550-governance.js',
      'scripts/verify-v1551-security.js',
      'NEXT_VERSION_IMPROVEMENT_LIST.md'
    ].includes(p) || p.startsWith('docs/v1.55.1/');
    check('v1.55.1 security patch changes only explicitly allowed surfaces', diff.every(allowed));
    check('v1.55.1 security patch has no public UI/source changes', !diff.some(p => ['index.html','app.js','public-v1548.js','public-v1548.css','product-v1550.js','product-v1550-research.js','product-v1550-preserve.js','product-v1550.css'].includes(p)));
    check('v1.55.1 backend implementation unchanged', !diff.includes('server.js') && !diff.includes('src/persistence.js') && !diff.includes('src/productionServices.js'));
    check('v1.55.1 migrations unchanged', !diff.some(p => p.startsWith('migrations/') || p.startsWith('db/migrations/')));
    check('v1.55.1 governance authority files unchanged', !diff.some(p => p.startsWith('governance/')));
  } else {
    cp.execFileSync('git', ['cat-file', '-e', `${acceptedV1551}^{commit}`], { cwd: root, stdio: 'ignore' });
    const diff = cp.execFileSync('git', ['diff', '--name-only', `${acceptedV1551}...HEAD`], { cwd: root, encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean);
    check('qualified successor preserves backend implementation from accepted v1.55.1', !diff.includes('server.js') && !diff.includes('src/persistence.js') && !diff.includes('src/productionServices.js'));
    check('qualified successor preserves database migrations from accepted v1.55.1', !diff.some(p => p.startsWith('migrations/') || p.startsWith('db/migrations/')));
    check('qualified successor keeps security workflow in place', !diff.includes('.github/workflows/englishlegalese-release-gate.yml') || workflow.includes('npm run audit:high'));
    check('qualified successor keeps pinned security dependency set', pkg.dependencies?.express === '4.22.3' && pkg.optionalDependencies?.nodemailer === '10.1.1' && pkg.optionalDependencies?.pg === '8.23.1');
    check('qualified successor explicitly runs current no-drift verifier', pkg.version === '1.57.0' ? String(pkg.scripts?.check || '').includes('verify-v1570-diagnostic-browser.js') : String(pkg.scripts?.check || '').includes('verify-v1560-homepage.js'));
  }
} catch (err) {
  check('security predecessor/diff evidence available', false);
}

for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failures = checks.filter(([, ok]) => !ok);
if (failures.length) {
  console.error(`v1.55.1 security-control inheritance verification failed: ${failures.length} check(s).`);
  process.exit(1);
}
console.log(`v1.55.1 security-control inheritance verification passed: ${checks.length} checks.`);
