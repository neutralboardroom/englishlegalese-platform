const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root,p),'utf8');
const checks = [];
const check = (name, ok) => checks.push([name, Boolean(ok)]);

const pkg = JSON.parse(read('package.json'));
const index = read('index.html');
const app = read('app.js');
const v1550 = read('product-v1550.js');
const roleplay = read('product-v1550-research.js');
const preserve = read('product-v1550-preserve.js');
const access = read('product-v1560-access.js');
const v1590 = read('product-v1590.js');
const css1590 = read('product-v1590.css');
const browser = read('tests/v1590-browser.spec.js');
const inheritedBrowser = read('tests/v1570-browser.spec.js');
const workflow = read('.github/workflows/englishlegalese-release-gate.yml');
const state = JSON.parse(read('governance/CURRENT_RULE_STATE__v1.59.0.json'));
const register = read('governance/ENGLISHLEGALESE_CANONICAL_RULE_REGISTER__v1.57.0.md');
const research = read('governance/RESEARCH_AND_COMPETITOR_ADOPTION_LEDGER__v1.59.0.md');
const rootCause = read('docs/v1.59.0/PRODUCTION_LIVE_RECOVERY_ROOT_CAUSE.md');
const nvil = read('NEXT_VERSION_IMPROVEMENT_LIST.md');

check('package is v1.59.0', pkg.version === '1.59.0');
check('v1.59 CSS is last public stylesheet', index.indexOf('product-v1590.css?v=1.59.0') > index.indexOf('product-v1580.css?v=1.59.0'));
check('v1.59 JS is last active presentation script', index.includes('product-v1590.js?v=1.59.0') && index.lastIndexOf('<script src=') < index.indexOf('</body>') && index.indexOf('product-v1590.js?v=1.59.0') > index.indexOf('product-v1560-access.js?v=1.59.0'));
check('active public assets use fresh v1.59 URLs', ['styles.css','app.js','public-v1548.js','product-v1550.js','product-v1550-research.js','product-v1550-preserve.js','product-v1560-access.js','product-v1590.js'].every(f => index.includes(`${f}?v=1.59.0`)));
check('obsolete v1.56-v1.58 presentation JS is intentionally not loaded', !index.includes('src="product-v1560.js?') && !index.includes('src="product-v1570.js?') && !index.includes('src="product-v1580.js?'));
check('retired presentation source files remain preserved in repository', ['product-v1560.js','product-v1570.js','product-v1580.js'].every(p => fs.existsSync(path.join(root,p))));
check('HTML includes explicit cache-revalidation metadata', index.includes('Cache-Control') && index.includes('no-cache') && index.includes('max-age=0'));

check('canonical diagnostic remains present', app.includes('Free Legal English starting diagnostic') && app.includes('not an accredited proficiency test'));
check('canonical app does not render public staff card', !app.includes("card('EnglishLegalese Team'"));
check('canonical app removes translation-builder wording', !app.includes('should not promise perfect static translation'));
check('canonical app narrows language-support claim', app.includes('Major-language learning support') && !app.includes('100+ major-language learning bridge'));
check('ordinary hash routing preserves mounted homepage', app.includes("if(!$('#home',app)) home(); else bindActions();"));

const scenarioIds = ['client-intake','client-update','difficult-client','clause-explain','contract-email','contract-negotiation','case-brief','rule-map','due-diligence','email-rewrite','memo-structure','executive-summary','meeting-clarify','position-presentation','cross-border','llm-seminar','legal-interview','networking','ai-email','ai-summary','ai-redteam'];
check('v1.55 adaptive practice module is materially present', v1550.length > 10000 && v1550.includes('Legal Scenario Studio') && v1550.includes('Personalized Learning Path'));
check('all 21 original scenarios remain', scenarioIds.every(id => v1550.includes(`id:'${id}'`)));
check('custom roleplay remains privacy-bounded and nonpersistent', roleplay.includes('Create your own practice') && roleplay.includes('Do not include client names') && !roleplay.includes('localStorage'));
check('desktop/mobile navigation preservation remains complete', ['#start','#courses','#smartteacher','#teachers','#employers','#language-bridge','#trust','#dashboards'].every(x => preserve.includes(x)));
check('dashboard access remains fail-closed', access.includes('protectedHashes') && access.includes('Account dashboards are not publicly enabled yet.'));

check('v1.59 persistent recovery observer exists', v1590.includes('new MutationObserver(schedule).observe(app') && !v1590.includes('disconnect()'));
check('v1.59 removes legacy release panel', v1590.includes("qs('#adaptive-learning')?.remove()"));
check('v1.59 removes legacy public staff role if reinjected', v1590.includes('EnglishLegalese Team') && v1590.includes('card.remove()'));
check('v1.59 directly limits courses', v1590.includes('card.hidden=i>=3&&!expanded'));
check('v1.59 directly limits scenarios', v1590.includes('card.hidden=i>=6&&!scenariosExpanded'));
check('v1.59 directly hides scenario filters until expanded', v1590.includes('filters.hidden=!scenariosExpanded'));
check('v1.59 directly compacts diagnostic on general homepage', v1590.includes('shell.hidden=!diagnosticExpanded') && v1590.includes('Start the 8-question diagnostic'));
check('v1.59 directly compacts learning-plan builder', v1590.includes('builder.hidden=!plannerExpanded'));
check('v1.59 directly compacts progress details', v1590.includes('el.hidden=!progressExpanded'));
check('v1.59 strips predecessor visibility classes before direct control', v1590.includes("card.classList.remove('v1560-collapsible','v1580-scenario-more')") && v1590.includes("el.classList.remove('v1560-progress-detail','v1580-progress-detail')"));
check('v1.59 restores user-facing copy if stale text appears', ['Legal English courses','Important:','Legal Skills Progress','Major-language learning support'].every(x => v1590.includes(x)));
check('v1.59 emits a live release marker', v1590.includes('v1590-live-marker') && v1590.includes('englishlegaleseLiveRelease'));

check('hidden semantics cannot be overridden by predecessor display rules', css1590.includes('[hidden]{display:none!important}'));
check('v1.59 overrides retained v1.58 planner visibility CSS when expanded', css1590.includes('#learning-plan .v1550-plan-builder:not([hidden]){display:block!important}'));
check('v1.59 overrides retained progress visibility CSS when expanded', css1590.includes('#skills-passport .v1550-passport-grid:not([hidden]){display:grid!important}'));
check('logo display sizing is aspect-ratio safe', css1590.includes('.site-header .brand img') && css1590.includes('height:auto!important') && css1590.includes('object-fit:contain!important'));
check('desktop/mobile logo sizing exists', css1590.includes('width:190px!important') && css1590.includes('width:112px!important'));
check('quiet hero button contrast is explicit', css1590.includes('.hero-actions .btn.light') && css1590.includes('color:#0b1d33!important') && css1590.includes('background:#fff!important'));
check('sticky-header offsets and reduced motion remain', css1590.includes('scroll-padding-top') && css1590.includes('scroll-margin-top') && css1590.includes('prefers-reduced-motion'));

check('browser test rejects exact owner-observed stale strings', ['EnglishLegalese Team','Open staff view','NEW IN V1.55','LAUNCH COURSE SET','Safety line:','track payout status'].every(x => browser.includes(x)));
check('browser test verifies six featured scenarios then all 21', browser.includes("toBe(6)") && browser.includes("toBe(21)"));
check('browser test verifies three featured courses', browser.includes("#courses article:visible") && browser.includes('toBe(3)'));
check('browser test verifies planner/progress collapsed by default', browser.includes("#learning-plan .v1550-plan-builder") && browser.includes("#skills-passport .v1550-passport-grid") && browser.includes('toBeHidden()'));
check('browser test verifies live marker and version', browser.includes('v1590-live-marker') && browser.includes('1.76.0'));
check('inherited browser gate is successor-aware', inheritedBrowser.includes('body.v1590-ready') && inheritedBrowser.includes('js-v1590-scenarios'));

check('workflow still blocks high/critical npm findings', workflow.includes('npm run audit:high'));
check('workflow still runs syntax/regression and browser gates', workflow.includes('npm run check') && workflow.includes('npm run e2e:browser'));
check('security dependency pins remain', pkg.dependencies?.express === '4.22.3' && pkg.optionalDependencies?.nodemailer === '10.1.1' && pkg.optionalDependencies?.pg === '8.23.1' && pkg.optionalDependencies?.['@aws-sdk/client-s3'] === '3.1152.0' && pkg.optionalDependencies?.['@aws-sdk/s3-request-presigner'] === '3.1152.0');
check('Node runtime floor remains 20+', /^>=20/.test(String(pkg.engines?.node || '')));
check('high/critical audit command remains exact', pkg.scripts?.['audit:high'] === 'npm audit --audit-level=high');
check('v1.59 verifier is wired into npm check', String(pkg.scripts?.check || '').includes('verify-v1590-live-recovery.js'));

check('rule state uses exact v1.58 predecessor', state.accepted_predecessor_commit === '2e39c83559d21b9b3b65f34b23b7605e23417b9f');
check('19 Roger Rules and 10 durable rules remain active', state.roger_rule_count === 19 && state.durable_builder_rule_count === 10);
check('canonical register contains all Roger Rules', Array.from({length:19},(_,i)=>`EL-RGR-${String(i+1).padStart(3,'0')}`).every(id => register.includes(`## ${id}`)));
check('canonical register contains all durable rules', Array.from({length:10},(_,i)=>`EL-DUR-${String(i+1).padStart(3,'0')}`).every(id => register.includes(`## ${id}`)));
check('standing auto-deploy and logo-lock rules remain active', register.includes('EL-RGR-018 — Standing qualified automatic deployment authorization') && register.includes('EL-RGR-019 — Permanent approved-logo no-drift lock'));
check('fresh research covers delivery plus current competitor classes', ['MDN','Render','TOLES','Preply Business','ADOPT','ADAPT','DEFER_WITH_REASON','REJECT_WITH_CAUSE'].every(x => research.includes(x)));
check('root-cause receipt corrects misleading empty-file diagnosis', rootCause.includes('misleading') && rootCause.includes('MUST NOT preserve the false claim'));
check('next-version list updated after v1.59', nvil.includes('after v1.59.0') && nvil.includes('Production browser acceptance automation'));

try {
  const logoSha = cp.execFileSync('git', ['hash-object','assets/englishlegalese-logo.png'], {cwd:root, encoding:'utf8'}).trim();
  check('locked logo Git blob SHA remains exact', logoSha === 'b5f20ef046d75d6f108bc93243c7c14acf3c4eb1');
  const base = '2e39c83559d21b9b3b65f34b23b7605e23417b9f';
  cp.execFileSync('git', ['cat-file','-e',`${base}^{commit}`], {cwd:root, stdio:'ignore'});
  const changed = cp.execFileSync('git', ['diff','--name-only',`${base}...HEAD`], {cwd:root, encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
  check('backend implementation remains unchanged', !changed.includes('server.js') && !changed.includes('src/persistence.js') && !changed.includes('src/productionServices.js'));
  check('migrations remain unchanged', !changed.some(p => p.startsWith('migrations/') || p.startsWith('db/migrations/')));
  check('locked logo file remains unchanged', !changed.includes('assets/englishlegalese-logo.png'));
  const status = cp.execFileSync('git', ['diff','--name-status',`${base}...HEAD`], {cwd:root, encoding:'utf8'});
  check('v1.59 deletes no predecessor file', !status.split(/\r?\n/).some(line => /^D\s/.test(line)));
} catch {
  check('exact predecessor/no-drift Git evidence available', false);
}

for (const [name,ok] of checks) console.log(`${ok?'PASS':'FAIL'} ${name}`);
const failures = checks.filter(([,ok]) => !ok);
if (failures.length) {
  console.error(`v1.59.0 live recovery verification failed: ${failures.length} check(s).`);
  failures.forEach(([name]) => console.error(`FAILED: ${name}`));
  process.exit(1);
}
console.log(`v1.59.0 live recovery verification passed: ${checks.length} checks.`);
