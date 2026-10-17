const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const checks = [];
const check = (name, ok) => checks.push([name, Boolean(ok)]);

const pkg = JSON.parse(read('package.json'));
const index = read('index.html');
const app = read('app.js');
const p1550 = read('product-v1550.js');
const roleplay = read('product-v1550-research.js');
const preserve = read('product-v1550-preserve.js');
const access = read('product-v1560-access.js');
const recovery = read('product-v1580.js');
const css = read('product-v1580.css');
const tests = read('tests/v1570-browser.spec.js');
const pw = read('playwright.config.js');
const workflow = read('.github/workflows/englishlegalese-release-gate.yml');
const state = JSON.parse(read('governance/CURRENT_RULE_STATE__v1.58.0.json'));
const register = read('governance/ENGLISHLEGALESE_CANONICAL_RULE_REGISTER__v1.57.0.md');
const research = read('governance/RESEARCH_AND_COMPETITOR_ADOPTION_LEDGER__v1.58.0.md');
const rootCause = read('docs/v1.58.0/PRODUCTION_DRIFT_ROOT_CAUSE_AND_SCREENSHOT_DISPOSITION.md');
const nvil = read('NEXT_VERSION_IMPROVEMENT_LIST.md');

check('package is v1.58.0', pkg.version === '1.58.0');
check('v1.58 recovery CSS is last public stylesheet', index.indexOf('product-v1580.css?v=1.58.0') > index.indexOf('product-v1570.css?v=1.58.0'));
check('v1.58 recovery JS is last public script', index.indexOf('product-v1580.js?v=1.58.0') > index.indexOf('product-v1570.js?v=1.58.0'));
check('core public assets are release cache-busted', ['styles.css','app.js','public-v1548.js','product-v1550.js','product-v1560.js','product-v1570.js','product-v1580.js'].every(f => index.includes(`${f}?v=1.58.0`)));

check('canonical app removes public v1.55 release label', !app.includes('New in v1.55'));
check('canonical app removes Launch course set label', !app.includes('Launch course set'));
check('canonical app does not render public staff card', !app.includes("card('EnglishLegalese Team'"));
check('canonical app removes translation builder language', !app.includes('should not promise perfect static translation'));
check('canonical app uses user-facing language bridge boundary', app.includes('Preferred-language support is a learning bridge'));
check('canonical app narrows 100+ language claim', app.includes('Major-language learning support') && !app.includes('100+ major-language learning bridge'));
check('canonical teacher/employer copy is public-safe', app.includes('Teacher-guided learning support.') && app.includes('Privacy-conscious team learning.'));
check('canonical diagnostic is explicitly non-accredited', app.includes('Eight short communication questions') && app.includes('not an accredited proficiency test') && app.includes('no CEFR, TOLES, academic, licensing, certification, or employment equivalence'));
check('canonical diagnostic does not persist answer payload', !app.includes('localStorage.setItem') && !app.includes('sessionStorage.setItem'));
check('ordinary hash routing preserves mounted homepage', app.includes("if(!$('#home',app)) home(); else bindActions();"));

check('recovery observer is persistent', recovery.includes('new MutationObserver(schedule).observe(app') && !recovery.includes('disconnect()'));
check('recovery can remove inherited public staff card', recovery.includes("textContent.trim()==='EnglishLegalese Team'") && recovery.includes('card.remove()'));
check('recovery removes inherited v1.55 intro', recovery.includes("qs('#adaptive-learning')?.remove()"));
check('recovery re-normalizes inherited release/internal copy', recovery.includes('Guided practice') && recovery.includes('Legal English courses') && recovery.includes('Preferred-language explanations can support understanding'));
check('recovery progressively discloses deep experiences', ['compactScenarios','compactPlanner','compactProgress'].every(x => recovery.includes(`function ${x}`)));
check('new learner progress is truthful and actionable', recovery.includes('Your progress starts with your first practice') && recovery.includes('No sample achievements are added for you'));
check('employer snapshot remains learner controlled', recovery.includes('Nothing is shared automatically'));

const scenarioIds = ['client-intake','client-update','difficult-client','clause-explain','contract-email','contract-negotiation','case-brief','rule-map','due-diligence','email-rewrite','memo-structure','executive-summary','meeting-clarify','position-presentation','cross-border','llm-seminar','legal-interview','networking','ai-email','ai-summary','ai-redteam'];
check('all 21 original scenarios remain', scenarioIds.every(id => p1550.includes(`id:'${id}'`)));
check('Scenario Studio, Learning Path and progress features remain', ['Legal Scenario Studio','Personalized Learning Path','skills-passport'].every(x => p1550.includes(x)));
check('custom roleplay remains privacy bounded and non-persistent', roleplay.includes('Create your own practice') && roleplay.includes('Do not include client names') && !roleplay.includes('localStorage'));
check('desktop navigation preservation remains complete', ['#start','#courses','#smartteacher','#teachers','#employers','#language-bridge','#trust','#dashboards'].every(x => preserve.includes(x)));
check('dashboard access remains fail-closed', access.includes('protectedHashes') && access.includes('Account dashboards are not publicly enabled yet.') && access.includes("state?.persistence_mode === 'postgres'"));

check('approved logo path remains header/footer source', (index.match(/assets\/englishlegalese-logo\.png/g) || []).length >= 2);
check('logo display sizing is aspect-ratio safe', css.includes('.site-header .brand img') && css.includes('height:auto') && css.includes('object-fit:contain'));
check('responsive logo rules exist', css.includes('@media (max-width:1120px)') && css.includes('@media (max-width:820px)'));
check('sticky header offsets exist', css.includes('scroll-padding-top') && css.includes('scroll-margin-top'));
check('reduced-motion protection exists', css.includes('prefers-reduced-motion'));
check('quiet hero buttons have visible dark text', css.includes('.hero-actions .btn.light') && css.includes('color:#0b1d33!important'));

check('browser qualification has desktop tablet mobile projects', ['desktop-chromium','tablet-chromium','mobile-chromium'].every(x => pw.includes(x)));
check('browser test rejects stale public strings', ['New in v1.55','Launch course set','EnglishLegalese Team'].every(x => tests.includes(x)));
check('browser test proves hash-navigation stability', tests.includes('hash navigation no longer destroys corrected homepage state') && tests.includes("#teachers") && tests.includes("#language-bridge"));
check('browser test exercises diagnostic and no persistence', tests.includes('Advanced practice path') && tests.includes('elV1580Diagnostic'));
check('browser test exercises v1.58 progressive disclosure', ['js-v1580-courses','js-v1580-scenarios','js-v1580-planner','js-v1580-progress'].every(x => tests.includes(x)));
check('browser test exercises fail-closed admin access', tests.includes('#admin-dashboard') && tests.includes('Check launch gates'));

check('workflow blocks high/critical npm findings', workflow.includes('npm run audit:high'));
check('workflow runs syntax/regression and browser gates', workflow.includes('npm run check') && workflow.includes('npm run e2e:browser'));
check('security dependency pins remain', pkg.dependencies?.express === '4.22.3' && pkg.optionalDependencies?.nodemailer === '10.1.1' && pkg.optionalDependencies?.pg === '8.23.1' && pkg.optionalDependencies?.['@aws-sdk/client-s3'] === '3.1152.0' && pkg.optionalDependencies?.['@aws-sdk/s3-request-presigner'] === '3.1152.0');
check('Node runtime floor remains 20+', /^>=20/.test(String(pkg.engines?.node || '')));
check('high/critical audit command remains exact', pkg.scripts?.['audit:high'] === 'npm audit --audit-level=high');

check('v1.58 rule state uses exact v1.57 predecessor', state.accepted_predecessor_commit === '298832f6404da548617c25a4553a6943913e963b');
check('19 Roger Rules and 10 durable rules remain active', state.roger_rule_count === 19 && state.durable_builder_rule_count === 10);
check('canonical register contains complete Roger-rule set', Array.from({length:19},(_,i)=>`EL-RGR-${String(i+1).padStart(3,'0')}`).every(id => register.includes(`## ${id}`)));
check('canonical register contains complete durable-rule set', Array.from({length:10},(_,i)=>`EL-DUR-${String(i+1).padStart(3,'0')}`).every(id => register.includes(`## ${id}`)));
check('standing auto-deploy and logo-lock rules remain active', register.includes('EL-RGR-018 — Standing qualified automatic deployment authorization') && register.includes('EL-RGR-019 — Permanent approved-logo no-drift lock'));
check('fresh research spans required competitor categories', ['TransLegal','TOLES','EF Corporate Learning','Preply Business','ELSA'].every(x => research.includes(x)));
check('fresh research has explicit dispositions', ['ADAPT','ADOPT','DEFER_WITH_REASON','REJECT_WITH_CAUSE'].every(x => research.includes(x)));
check('root-cause receipt identifies hash rerender and disconnected correction observers', rootCause.includes('replaces the entire `#app` subtree') && rootCause.includes('disconnected immediately') && rootCause.includes('hash navigation'));
check('next-version list updated after v1.58', nvil.includes('after v1.58.0') && nvil.includes('Production hash-route smoke') && nvil.includes('Asset/currentness verification'));
check('v1.58 verifier is wired into npm check', String(pkg.scripts?.check || '').includes('verify-v1580-production-recovery.js'));

try {
  const logoSha = cp.execFileSync('git', ['hash-object','assets/englishlegalese-logo.png'], {cwd:root, encoding:'utf8'}).trim();
  check('locked logo blob SHA remains exact', logoSha === 'b5f20ef046d75d6f108bc93243c7c14acf3c4eb1');
  const base = '298832f6404da548617c25a4553a6943913e963b';
  cp.execFileSync('git', ['cat-file','-e',`${base}^{commit}`], {cwd:root, stdio:'ignore'});
  const changed = cp.execFileSync('git', ['diff','--name-only',`${base}...HEAD`], {cwd:root, encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
  check('backend implementation unchanged', !changed.includes('server.js') && !changed.includes('src/persistence.js') && !changed.includes('src/productionServices.js'));
  check('migrations unchanged', !changed.some(p => p.startsWith('migrations/') || p.startsWith('db/migrations/')));
  check('locked logo file unchanged', !changed.includes('assets/englishlegalese-logo.png'));
  const status = cp.execFileSync('git', ['diff','--name-status',`${base}...HEAD`], {cwd:root, encoding:'utf8'});
  check('corrective release deletes no predecessor file', !status.split(/\r?\n/).some(line => /^D\s/.test(line)));
} catch {
  check('exact predecessor/no-drift git evidence available', false);
}

for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failures = checks.filter(([,ok]) => !ok);
if (failures.length) {
  console.error(`v1.58.0 production recovery verification failed: ${failures.length} check(s).`);
  failures.forEach(([name]) => console.error(`FAILED: ${name}`));
  process.exit(1);
}
console.log(`v1.58.0 production recovery verification passed: ${checks.length} checks.`);
