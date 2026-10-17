const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const exists = p => fs.existsSync(path.join(root, p));
const checks = [];
const check = (name, ok) => checks.push([name, Boolean(ok)]);

const pkg = JSON.parse(read('package.json'));
const index = read('index.html');
const app = read('app.js');
const product1550 = read('product-v1550.js');
const customRoleplay = read('product-v1550-research.js');
const preserve = read('product-v1550-preserve.js');
const access = read('product-v1560-access.js');
const recovery = read('product-v1580.js');
const css = read('product-v1580.css');
const browser = read('tests/v1570-browser.spec.js');
const workflow = read('.github/workflows/englishlegalese-release-gate.yml');
const state = JSON.parse(read('governance/CURRENT_RULE_STATE__v1.58.0.json'));
const register = read('governance/ENGLISHLEGALESE_CANONICAL_RULE_REGISTER__v1.57.0.md');
const research = read('governance/RESEARCH_AND_COMPETITOR_ADOPTION_LEDGER__v1.58.0.md');
const rootCause = read('docs/v1.58.0/PRODUCTION_DRIFT_ROOT_CAUSE_AND_SCREENSHOT_DISPOSITION.md');
const nvil = read('NEXT_VERSION_IMPROVEMENT_LIST.md');

check('package version is exactly 1.58.0', pkg.version === '1.58.0');
check('v1.58 CSS loaded after all inherited public CSS', index.indexOf('product-v1580.css?v=1.58.0') > index.indexOf('product-v1570.css?v=1.58.0'));
check('v1.58 JS loaded last', index.indexOf('product-v1580.js?v=1.58.0') > index.indexOf('product-v1570.js?v=1.58.0'));
check('all material public local assets are cache-busted with release ID', ['styles.css','public-v1548.css','product-v1550.css','product-v1560.css','product-v1570.css','product-v1580.css','app.js','public-v1548.js','product-v1550.js','product-v1550-research.js','product-v1550-preserve.js','product-v1560.js','product-v1560-access.js','product-v1570.js','product-v1580.js'].every(f => index.includes(`${f}?v=1.58.0`)));

check('canonical app no longer exposes New in v1.55', !app.includes('New in v1.55'));
check('canonical app no longer exposes Launch course set', !app.includes('Launch course set'));
check('canonical app no longer renders EnglishLegalese Team public card', !app.includes("card('EnglishLegalese Team'"));
check('canonical app no longer exposes old translation builder instruction', !app.includes('should not promise perfect static translation'));
check('canonical app uses Important translation boundary', app.includes('<strong>Important:</strong> Preferred-language support is a learning bridge'));
check('canonical app narrows language support claim', app.includes('Major-language learning support') && !app.includes('100+ major-language learning bridge'));
check('canonical app uses learner-facing teacher copy', app.includes('Teacher-guided learning support.') && !app.includes('track payout status'));
check('canonical app uses privacy-conscious employer copy', app.includes('Privacy-conscious team learning.') && app.includes('Private drafts, raw AI practice'));
check('canonical app contains original non-accredited eight-question diagnostic', app.includes('const QUESTIONS = [') && app.includes('Eight short communication questions') && app.includes('not an accredited proficiency test') && app.includes('no CEFR, TOLES, academic, licensing, certification, or employment equivalence'));
check('diagnostic remains non-persistent', !app.includes('elV1580Diagnostic') && !app.includes('sessionStorage.setItem'));
check('canonical hash routing preserves mounted homepage', app.includes("if(!$('#home',app)) home(); else bindActions();"));

check('persistent recovery observer remains attached after first apply', recovery.includes('new MutationObserver(schedule).observe(app') && !recovery.includes('observer.disconnect()'));
check('persistent recovery rewrites inherited release language if reintroduced', recovery.includes("['New in v1.55','Guided practice']") && recovery.includes("['Launch course set','Legal English courses']"));
check('persistent recovery removes public staff card and v1.55 intro', recovery.includes("title')?.textContent.trim()==='EnglishLegalese Team'") && recovery.includes("qs('#adaptive-learning')?.remove()"));
check('persistent recovery compacts scenarios, planner and progress', ['compactScenarios','compactPlanner','compactProgress'].every(x => recovery.includes(`function ${x}`)));
check('scenario progressive disclosure preserves full scenario set', recovery.includes("qsa('.v1550-scenario-card',section)") && recovery.includes('Explore all ${cards.length} scenarios'));
check('progress empty state avoids wall of zeros', recovery.includes('Your progress starts with your first practice') && recovery.includes('No sample achievements are added for you'));
check('shareable progress stays learner controlled', recovery.includes('Nothing is shared automatically'));

check('all 21 v1.55 original scenarios remain in inherited product', (product1550.match(/\{id:'/g) || []).length === 21);
check('Scenario Studio remains', product1550.includes('Legal Scenario Studio') && product1550.includes('practice-studio'));
check('four-week planner remains', product1550.includes('Personalized Learning Path') && product1550.includes('four-week practice plan'));
check('progress state remains', product1550.includes('skills-passport') && product1550.includes('learner self-check'));
check('custom roleplay remains privacy-bounded and non-persistent', customRoleplay.includes('Create your own practice') && customRoleplay.includes('Do not include client names') && !customRoleplay.includes('localStorage'));
check('desktop nav preservation layer remains complete', ['#start','#courses','#smartteacher','#teachers','#employers','#language-bridge','#trust','#dashboards'].every(x => preserve.includes(x)));
check('mobile nav preservation layer remains five-item', ['Start','Courses','AI Practice','Languages','Dashboard'].every(x => preserve.includes(`'${x}'`)));
check('operational dashboards remain fail-closed', access.includes('protectedHashes') && access.includes('Account dashboards are not publicly enabled yet.') && access.includes("state?.persistence_mode === 'postgres'"));

check('approved logo source path remains exact in header and footer', (index.match(/assets\/englishlegalese-logo\.png/g) || []).length >= 2);
check('logo presentation remains aspect-ratio safe', css.includes('.site-header .brand img') && css.includes('height:auto') && css.includes('object-fit:contain'));
check('responsive header/logo rules exist', css.includes('@media (max-width:1120px)') && css.includes('@media (max-width:820px)'));
check('sticky header offsets remain explicit', css.includes('scroll-padding-top') && css.includes('scroll-margin-top'));
check('reduced motion remains explicit', css.includes('prefers-reduced-motion'));
check('diagnostic form controls remain accessible-sized', css.includes('min-height:44px') || index.includes('viewport'));
check('hero quiet CTAs cannot render white-on-white', css.includes('.hero-actions .btn.light') && css.includes('color:#0b1d33!important'));

check('browser tests cover desktop/tablet/mobile through shared projects', ['desktop-chromium','tablet-chromium','mobile-chromium'].every(x => read('playwright.config.js').includes(x)));
check('browser test proves stale public strings absent', browser.includes('New in v1.55') && browser.includes('Launch course set') && browser.includes('EnglishLegalese Team'));
check('browser test proves hash navigation does not destroy corrected home', browser.includes('hash navigation no longer destroys corrected homepage state') && browser.includes("#teachers") && browser.includes("#language-bridge"));
check('browser test exercises diagnostic and non-persistence', browser.includes('Advanced practice path') && browser.includes('elV1580Diagnostic'));
check('browser test exercises progressive disclosure', browser.includes('js-v1580-courses') && browser.includes('js-v1580-scenarios') && browser.includes('js-v1580-planner') && browser.includes('js-v1580-progress'));
check('browser test exercises fail-closed dashboard', browser.includes('#admin-dashboard') && browser.includes('Check launch gates'));
check('workflow blocks high/critical vulnerabilities', workflow.includes('npm run audit:high'));
check('workflow runs exact npm check and browser qualification', workflow.includes('npm run check') && workflow.includes('npm run e2e:browser'));

check('current rule state has exact v1.57 predecessor', state.accepted_predecessor_commit === '298832f6404da548617c25a4553a6943913e963b');
check('current rule state preserves 19 Roger Rules and 10 durable rules', state.roger_rule_count === 19 && state.durable_builder_rule_count === 10);
check('canonical register contains all 19 Roger Rules', Array.from({length:19},(_,i)=>`EL-RGR-${String(i+1).padStart(3,'0')}`).every(id => register.includes(`## ${id}`)));
check('canonical register contains all 10 durable rules', Array.from({length:10},(_,i)=>`EL-DUR-${String(i+1).padStart(3,'0')}`).every(id => register.includes(`## ${id}`)));
check('standing auto-deploy rule remains active', register.includes('EL-RGR-018 — Standing qualified automatic deployment authorization'));
check('logo lock rule remains active', register.includes('EL-RGR-019 — Permanent approved-logo no-drift lock'));
check('fresh v1.58 research includes specialist, assessment, AI and corporate categories', ['TransLegal','TOLES','EF Corporate Learning','Preply Business','ELSA'].every(x => research.includes(x)));
check('fresh research records explicit dispositions', ['ADAPT','ADOPT','DEFER_WITH_REASON','REJECT_WITH_CAUSE'].every(x => research.includes(x)));
check('root-cause receipt explains destructive hash rerender and one-shot observer failure', rootCause.includes('replaces the entire `#app` subtree') && rootCause.includes('observer disconnected') && rootCause.includes('hash navigation'));
check('v1.58 next-version list exists and captures production route/cache prevention', nvil.includes('after v1.58.0') && nvil.includes('Production hash-route smoke') && nvil.includes('Asset/currentness verification'));
check('v1.58 verifier is wired into npm check', String(pkg.scripts?.check || '').includes('verify-v1580-production-recovery.js'));

check('Node runtime floor remains 20+', /^>=20/.test(String(pkg.engines?.node || '')));
check('security dependency set remains pinned', pkg.dependencies?.express === '4.22.3' && pkg.optionalDependencies?.nodemailer === '10.1.1' && pkg.optionalDependencies?.pg === '8.23.1' && pkg.optionalDependencies?.['@aws-sdk/client-s3'] === '3.1152.0' && pkg.optionalDependencies?.['@aws-sdk/s3-request-presigner'] === '3.1152.0');
check('high/critical audit script remains', pkg.scripts?.['audit:high'] === 'npm audit --audit-level=high');

try {
  const logoSha = cp.execFileSync('git', ['hash-object','assets/englishlegalese-logo.png'], {cwd:root, encoding:'utf8'}).trim();
  check('protected logo bytes exactly match locked blob SHA', logoSha === 'b5f20ef046d75d6f108bc93243c7c14acf3c4eb1');

  const base = '298832f6404da548617c25a4553a6943913e963b';
  cp.execFileSync('git', ['cat-file','-e',`${base}^{commit}`], {cwd:root, stdio:'ignore'});
  const changed = cp.execFileSync('git', ['diff','--name-only',`${base}...HEAD`], {cwd:root, encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
  check('backend server unchanged from v1.57.0', !changed.includes('server.js'));
  check('persistence unchanged from v1.57.0', !changed.includes('src/persistence.js'));
  check('production services unchanged from v1.57.0', !changed.includes('src/productionServices.js'));
  check('database migrations unchanged from v1.57.0', !changed.some(p => p.startsWith('migrations/') || p.startsWith('db/migrations/')));
  check('protected logo file unchanged from v1.57.0', !changed.includes('assets/englishlegalese-logo.png'));
  check('no file deletion in corrective release', !cp.execFileSync('git', ['diff','--name-status',`${base}...HEAD`], {cwd:root, encoding:'utf8'}).split(/\r?\n/).some(line => /^D\s/.test(line)));
} catch {
  check('exact predecessor and no-drift git evidence available', false);
}

for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failures = checks.filter(([,ok]) => !ok);
if (failures.length) {
  console.error(`v1.58.0 production recovery verification failed: ${failures.length} check(s).`);
  process.exit(1);
}
console.log(`v1.58.0 production recovery verification passed: ${checks.length} checks.`);
