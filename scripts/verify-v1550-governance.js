const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const exists = p => fs.existsSync(path.join(root, p));
const base = '5f6c8ddef400d758541686fcd9132c28f11259e7';

const registerPath = 'governance/ENGLISHLEGALESE_CANONICAL_RULE_REGISTER__v1.55.0.md';
const statePath = 'governance/CURRENT_RULE_STATE__v1.55.0.json';
const transferPath = 'governance/CROSS_PROJECT_RULE_TRANSFER_LEDGER__v1.55.0.md';
const researchPath = 'governance/RESEARCH_AND_COMPETITOR_ADOPTION_LEDGER__v1.55.0.md';
const deployAuthPath = 'governance/OWNER_STANDING_DEPLOYMENT_AUTHORIZATION__2026-10-17.md';
const preSealPath = 'docs/v1.55.0/PRE_SEAL_RULE_LOCK_RECEIPT.md';
const testReceiptPath = 'docs/v1.55.0/RELEASE_TEST_RECEIPT.md';
const workflowPath = '.github/workflows/englishlegalese-release-gate.yml';

const register = read(registerPath);
const state = JSON.parse(read(statePath));
const transfer = read(transferPath);
const research = read(researchPath);
const deployAuth = read(deployAuthPath);
const preSeal = read(preSealPath);
const testReceipt = read(testReceiptPath);
const workflow = read(workflowPath);

const expectedRoger = Array.from({length:18}, (_,i)=>`EL-RGR-${String(i+1).padStart(3,'0')}`);
const expectedDurable = Array.from({length:10}, (_,i)=>`EL-DUR-${String(i+1).padStart(3,'0')}`);

const checks = [];
const check = (name, ok) => checks.push([name, Boolean(ok)]);

check('canonical rule register exists', exists(registerPath));
check('current rule state exists', exists(statePath));
check('cross-project transfer ledger exists', exists(transferPath));
check('competitor research ledger exists', exists(researchPath));
check('standing deployment authorization exists', exists(deployAuthPath));
check('pre-seal rule lock receipt exists and passes', exists(preSealPath) && preSeal.includes('PRE_SEAL_RULE_LOCK = PASS'));
check('exact release test receipt exists and passes honestly', exists(testReceiptPath) && testReceipt.includes('RELEASE_TEST_GATE = PASS') && testReceipt.includes('NOT RUN'));
check('durable PR release gate exists', exists(workflowPath) && workflow.includes('npm run check') && workflow.includes('pull_request'));
check('product scope is EnglishLegalese only', state.product_scope === 'EnglishLegalese.com ONLY');
check('predecessor is exact v1.54.8 commit', state.accepted_predecessor_commit === base);
check('18 Roger Rules declared', state.roger_rule_count === 18 && expectedRoger.every(id => state.roger_rule_ids.includes(id) && register.includes(`## ${id}`)));
check('10 durable builder rules declared', state.durable_builder_rule_count === 10 && expectedDurable.every(id => state.durable_builder_rule_ids.includes(id) && register.includes(`## ${id}`)));
check('zero-rule-drift language is explicit', register.includes('Absolute Roger Rule permanence / zero rule drift') && /may not be omitted[^\n]*weakened/i.test(register));
check('universal no-drift gate is explicit', register.includes('Universal product no-drift / no-regression') && register.includes('RELEASE BLOCKER'));
check('competitor research is durable every material version', register.includes('Fresh research + competitor intelligence every material version') && register.includes('competitors of **all sizes and types**'));
check('whole-product improvement is durable', register.includes('Whole-product self-improvement every material version'));
check('adopt/adapt/reject-only-with-cause exists', register.includes('Adopt / adapt / reject only with cause') && transfer.includes('REJECTED_WITH_CAUSE'));
check('standing qualified auto-deploy rule is canonical', register.includes('EL-RGR-018 — Standing qualified automatic deployment authorization') && register.includes('A separate per-version owner approval is no longer required'));
check('standing deployment provenance preserves exact owner instruction', deployAuth.includes('You can deploy it automatically now after each new version you build.') && deployAuth.includes('EL-RGR-018'));
check('standing deployment state is active but evidence-derived', state.standing_deployment_authorization === deployAuthPath && String(state.deployment_state).startsWith('DERIVE_FROM_EXACT_DEPLOYMENT_EVIDENCE') && state.deployment_state.includes('STANDING_QUALIFIED_AUTO_DEPLOY_AUTHORIZATION_ACTIVE_2026-10-17'));
check('transfer ledger documents no sister-project mutation', transfer.includes('No sister project was mutated'));
check('research ledger distinguishes formal assessment from practice', research.includes('Formal certification is **not** claimed') && research.includes('will not invent accredited/proficiency scores'));
check('research ledger includes specialists, AI roleplay and corporate platforms', ['TOLES','TransLegal','Loora role-play','EF Corporate Learning','Preply Business'].every(x => research.includes(x)));
check('research ledger records custom roleplay adaptation', research.includes('Create your own practice') && research.includes('Learner-created custom roleplay'));
check('mutable acceptance/deployment state is evidence-derived, not hand-copied', state.source_acceptance_state === 'DERIVE_FROM_GIT_MAIN_AND_RELEASE_PR_EVIDENCE' && String(state.deployment_state).startsWith('DERIVE_FROM_EXACT_DEPLOYMENT_EVIDENCE'));

let gitChecked = false;
try {
  cp.execFileSync('git', ['cat-file','-e',`${base}^{commit}`], {cwd: root, stdio:'ignore'});
  const diff = cp.execFileSync('git', ['diff','--name-status',`${base}...HEAD`], {cwd: root, encoding:'utf8'}).trim();
  const rows = diff ? diff.split(/\r?\n/).map(line => line.split(/\t+/)) : [];
  const allowed = p => [
    'index.html','package.json','product-v1550.js','product-v1550.css','product-v1550-preserve.js','product-v1550-research.js',
    'product-v1560.js','product-v1560.css','product-v1560-access.js',
    'scripts/verify-v1550-adaptive-practice.js','scripts/verify-v1550-governance.js','scripts/verify-v1551-security.js','scripts/verify-v1560-homepage.js',
    '.github/workflows/englishlegalese-release-gate.yml','NEXT_VERSION_IMPROVEMENT_LIST.md'
  ].includes(p) || p.startsWith('governance/') || p.startsWith('docs/v1.55.0/') || p.startsWith('docs/v1.55.1/') || p.startsWith('docs/v1.56.0/');
  check('no files deleted from v1.54.8', rows.every(parts => !String(parts[0]).startsWith('D')));
  check('all changed paths are explicitly allowed qualified successor surfaces', rows.every(parts => parts.slice(1).every(allowed)));
  const changedPaths = rows.flatMap(parts => parts.slice(1));
  check('backend server unchanged', !changedPaths.includes('server.js'));
  check('persistence unchanged', !changedPaths.includes('src/persistence.js'));
  check('production services unchanged', !changedPaths.includes('src/productionServices.js'));
  check('migrations unchanged', !changedPaths.some(p => p.startsWith('migrations/')));
  gitChecked = true;
} catch (err) {
  check('git predecessor/diff evidence available', false);
}

for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failures = checks.filter(([,ok])=>!ok);
if (failures.length) {
  console.error(`v1.55 governance/no-drift verification failed: ${failures.length} check(s). gitChecked=${gitChecked}`);
  process.exit(1);
}
console.log(`v1.55 governance/no-drift verification passed: ${checks.length} checks.`);
