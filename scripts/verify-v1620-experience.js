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
const css1610 = read('visual-v1610.css');
const browser = read('tests/v1590-browser.spec.js');
const inheritedBrowser = read('tests/v1570-browser.spec.js');
const workflow = read('.github/workflows/englishlegalese-release-gate.yml');
const state = JSON.parse(read('governance/CURRENT_RULE_STATE__v1.62.0.json'));
const register = read('governance/ENGLISHLEGALESE_CANONICAL_RULE_REGISTER__v1.57.0.md');
const research = read('governance/RESEARCH_AND_COMPETITOR_ADOPTION_LEDGER__v1.62.0.md');
const rootCause = read('docs/v1.59.0/PRODUCTION_LIVE_RECOVERY_ROOT_CAUSE.md');
const nvil = read('NEXT_VERSION_IMPROVEMENT_LIST.md');

check('package is v1.62.0', pkg.version === '1.62.0');
check('v1.59 CSS is last public stylesheet', index.indexOf('product-v1590.css?v=1.62.0') > index.indexOf('product-v1580.css?v=1.62.0'));
check('v1.59 JS is last active presentation script', index.includes('product-v1590.js?v=1.62.0') && index.lastIndexOf('<script src=') < index.indexOf('</body>') && index.indexOf('product-v1590.js?v=1.62.0') > index.indexOf('product-v1560-access.js?v=1.62.0'));
check('active public assets use fresh v1.59 URLs', ['styles.css','app.js','public-v1548.js','product-v1550.js','product-v1550-research.js','product-v1550-preserve.js','product-v1560-access.js','product-v1590.js'].every(f => index.includes(`${f}?v=1.62.0`)));
check('obsolete v1.56-v1.58 presentation JS is intentionally not loaded', !index.includes('src="product-v1560.js?') && !index.includes('src="product-v1570.js?') && !index.includes('src="product-v1580.js?'));
check('retired presentation source files remain preserved in repository', ['product-v1560.js','product-v1570.js','product-v1580.js'].every(p => fs.existsSync(path.join(root,p))));
check('HTML includes explicit cache-revalidation metadata', index.includes('Cache-Control') && index.includes('no-cache') && index.includes('max-age=0'));

check('canonical diagnostic remains present', app.includes('Free Legal English starting diagnostic') && app.includes('not an accredited proficiency test'));
check('canonical app does not render public staff card', !app.includes("card('EnglishLegalese Team'"));
check('canonical app removes translation-builder wording', !app.includes('should not promise perfect static translation'));
check('canonical app narrows language-support claim', app.includes('Preferred explanation language') && !app.includes('100+ major-language learning bridge'));
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
check('browser test verifies six featured scenarios then all 21', (browser.includes('toBe(6)') || browser.includes('toHaveCount(6)')) && (browser.includes('toBe(21)') || browser.includes('toHaveCount(21)')));
check('browser test verifies three featured courses', browser.includes("#courses article:visible") && browser.includes('toBe(3)'));
check('browser test verifies planner/progress collapsed by default', browser.includes("#learning-plan .v1550-plan-builder") && browser.includes("#skills-passport .v1550-passport-grid") && browser.includes('toBeHidden()'));
check('browser test verifies live marker and version', browser.includes('v1590-live-marker') && browser.includes('1.62.0'));
check('inherited browser gate is successor-aware', inheritedBrowser.includes('body.v1590-ready') && inheritedBrowser.includes('js-v1590-scenarios'));

check('workflow still blocks high/critical npm findings', workflow.includes('npm run audit:high'));
check('workflow still runs syntax/regression and browser gates', workflow.includes('npm run check') && workflow.includes('npm run e2e:browser'));
check('security dependency pins remain', pkg.dependencies?.express === '4.22.3' && pkg.optionalDependencies?.nodemailer === '10.1.1' && pkg.optionalDependencies?.pg === '8.23.1' && pkg.optionalDependencies?.['@aws-sdk/client-s3'] === '3.1152.0' && pkg.optionalDependencies?.['@aws-sdk/s3-request-presigner'] === '3.1152.0');
check('Node runtime floor remains 20+', /^>=20/.test(String(pkg.engines?.node || '')));
check('canonical focus routing exists',app.includes('homepageSectionIds')&&app.includes('applyRouteView')&&app.includes('englishLegaleseApplyView'));
check('homepage return link and accessible focus toolbar',index.includes('id="elFocusToolbar"')&&index.includes('href="#home"'));
check('HTML has v1.60 release marker',index.includes('name="englishlegalese-release" content="1.62.0"'));
check('HTML response explicitly revalidates without modifying private routes',read('server.js').includes("req.path==='/' || req.path==='/index.html'")&&read('server.js').includes("'no-cache, max-age=0, must-revalidate'"));
check('responsive homepage heading typography improved',css1590.includes('.hero h1{font-size:clamp(2.45rem')&&css1590.includes('.section-head h2{font-size:clamp(1.7rem'));
check('learning engine preserves route ownership',v1550.includes('englishLegaleseApplyView'));
check('duplicate legacy public observers are not active',!read('product-v1550.js').includes('new MutationObserver')&&!read('public-v1548.js').includes('new MutationObserver')&&v1590.includes('new MutationObserver'));
check('obsolete v1.55 promo panel is no longer injected',!read('product-v1550.js').includes("start.insertAdjacentHTML('afterend',intro())"));
check('duplicate scenario hero call to action removed',!read('product-v1550.js').includes("qs('.hero-actions')?.insertAdjacentHTML"));
check('new readable header artwork display layer loads after all predecessors',index.includes('visual-v1610.css?v=1.62.0') && index.indexOf('visual-v1610.css?v=1.62.0')>index.indexOf('product-v1590.css?v=1.62.0'));
check('owner approved logo only changes CSS display size, original bytes locked',css1610.includes('.site-header .brand img') && css1610.includes('width:230px!important') && css1610.includes('top:-45px!important') && css1610.includes('object-fit:contain!important'));
check('mobile header logo is materially legible',css1610.includes('width:188px!important') && css1610.includes('height:98px!important'));
check('simplified real first-screen learning message is canonical source',app.includes('Clear English for legal work.') && app.includes('Professional English, made clearer.') && app.includes('Please respond to the earlier email.'));
check('hero keeps diagnostic, course, SmartTeacher and scenario routes', ['href="#diagnostic"','href="#courses"','href="#smartteacher"','href="#practice-studio"'].every(x=>app.includes(x)));
check('duplicate hero branding removed',!app.includes('class="hero-logo"'));
check('updated tests assert prominent logo and absence of horizontal scrolling',browser.includes('approved logo is prominent') && browser.includes('scrollWidth') && browser.includes('toBeGreaterThanOrEqual'));
check('new css makes buttons and headings readable without unsafe branding changes',css1610.includes('.hero h1')&&css1610.includes('.section-head h2')&&css1610.includes('.hero-actions .btn'));
check('WebKit premerge browser target exists',read('playwright.config.js').includes("name: 'tablet-webkit'"));
check('CI includes WebKit browser install',read('.github/workflows/englishlegalese-release-gate.yml').includes('npx playwright install --with-deps chromium webkit'));
check('scenario controls use stable single delegated event listener',v1590.includes("document.addEventListener('click',event=>")&&v1590.includes('},true)')&&!v1590.includes("more.addEventListener('click'"));
check('scenario controls report expanded state for production acceptance',read('tests/v1590-production.spec.js').includes("toHaveAttribute('aria-expanded','true')"));
check('diagnostic, planner, progress and scenarios all use stable delegated click routing', ['.js-v1590-diagnostic','.js-v1590-planner','.js-v1590-progress','.js-v1590-scenarios'].every(x=>v1590.includes("target?.closest('"+x+"')")) && !v1590.includes("btn.addEventListener('click',()=>{progressExpanded") && !v1590.includes("btn.addEventListener('click',()=>{plannerExpanded") && !v1590.includes("btn.addEventListener('click',()=>{diagnosticExpanded"));
check('hash route does not animate controls underneath the pointer',read('app.js').includes("scrollIntoView({behavior:'instant',block:'start'})") && read('product-v1550.js').includes("scrollIntoView({behavior:'instant',block:'start'})") && css1610.includes('html{scroll-behavior:auto!important}'));
check('course expansion updates visible cards within the same click',read('app.js').includes("card.hidden=i>=3&&!showAll;")&&!v1590.includes('setTimeout(enforceCourses,0)'));
check('recovery text and HTML writes are idempotent under childList observer', v1590.includes('const setText=(el,value)=>{if(el&&el.textContent!==value)el.textContent=value;}') && v1590.includes('const setHTML=(el,markup)=>{if(el&&el.innerHTML!==markup)el.innerHTML=markup;}') && v1590.includes('setText(btn,progressExpanded') && v1590.includes('setText(btn,plannerExpanded') && v1590.includes('setText(more,scenariosExpanded'));
check('user-first start section removes internal operational explanations',app.includes('Start with what you need.')&&!app.includes('Operational staff tools stay behind account access.'));
check('corrected course handler uses a list rather than a single Element',app.includes("$('#courses article').filter(") && !app.includes("$('#courses article').filter("));
check('navigation closes on Escape and hash link and updates accessibility state',app.includes("e.key==='Escape'")&&app.includes("nav.addEventListener('click'")&&app.includes("navToggle.setAttribute('aria-expanded'")&&app.includes("aria-current','location"));
check('guided practice produces genuine reusable conversation and writing prompts without falsely claiming live AI',app.includes("function preparePractice(mode)")&&app.includes("mode==='writing'")&&app.includes("navigator.clipboard.writeText(preparedPrompt)")&&app.includes("does not send text to an AI service")&&!app.includes("Learning note saved locally in demo mode."));
check('guided prompt never inserts untrusted input as HTML',app.includes('practiceOutput.textContent=preparedPrompt')&&!app.includes('practiceOutput.innerHTML=preparedPrompt'));
check('public prompt input has explicit label and length limit',app.includes('for="el-practice-topic"')&&app.includes('maxlength="1500"'));
check('SEO head has accurate canonical, social cards and real local og asset',index.includes('<link rel="canonical" href="https://englishlegalese.com/"')&&index.includes('Practical Legal English for Work')&&index.includes('name="twitter:card"')&&index.includes('property="og:image"')&&fs.existsSync(path.join(root,'assets/brand-board.png')));
check('responsive cards and accessible focus treatments share the approved visual stylesheet',css1610.includes('.v1620-paths')&&css1610.includes('.v1620-practice-result:focus-visible')&&css1610.includes('[aria-current="location"]'));
check('tests cover new content, mobile navigation and honest prompt behavior',browser.includes('next learning version provides a real safe prompt-preparation workflow')&&browser.includes('mobile disclosure menu handles Escape')&&browser.includes('metadata stays aligned'));
check('live production tests exercise mobile nav and prepared writing review',read('tests/v1590-production.spec.js').includes('production mobile menu and learning-prompt preparation'));
check('high/critical audit command remains exact', pkg.scripts?.['audit:high'] === 'npm audit --audit-level=high');
check('v1.59 verifier is wired into npm check', String(pkg.scripts?.check || '').includes('verify-v1620-experience.js'));

check('rule state uses exact v1.58 predecessor', state.accepted_predecessor_commit === 'fa4da257026e185e2a8e6d1965f2c84e75fa8186');
check('19 Roger Rules and 10 durable rules remain active', state.roger_rule_count === 19 && state.durable_builder_rule_count === 10);
check('canonical register contains all Roger Rules', Array.from({length:19},(_,i)=>`EL-RGR-${String(i+1).padStart(3,'0')}`).every(id => register.includes(`## ${id}`)));
check('canonical register contains all durable rules', Array.from({length:10},(_,i)=>`EL-DUR-${String(i+1).padStart(3,'0')}`).every(id => register.includes(`## ${id}`)));
check('standing auto-deploy and logo-lock rules remain active', register.includes('EL-RGR-018 — Standing qualified automatic deployment authorization') && register.includes('EL-RGR-019 — Permanent approved-logo no-drift lock'));
check('fresh research covers WebKit bug evidence, delivery and accepted risks', ['W3C','WCAG','Google','Baymard','Render','ADOPT','ADAPT','DEFER_WITH_REASON','REJECT_WITH_CAUSE'].every(x=>research.includes(x)));
check('root-cause receipt corrects misleading empty-file diagnosis', rootCause.includes('misleading') && rootCause.includes('MUST NOT preserve the false claim'));
check('next-version list updated after v1.59', nvil.includes('after v1.62.0') && nvil.includes('Production browser acceptance automation'));

try {
  const logoSha = cp.execFileSync('git', ['hash-object','assets/englishlegalese-logo.png'], {cwd:root, encoding:'utf8'}).trim();
  check('locked logo Git blob SHA remains exact', logoSha === 'b5f20ef046d75d6f108bc93243c7c14acf3c4eb1');
  const base = 'fa4da257026e185e2a8e6d1965f2c84e75fa8186';
  cp.execFileSync('git', ['cat-file','-e',`${base}^{commit}`], {cwd:root, stdio:'ignore'});
  const changed = cp.execFileSync('git', ['diff','--name-only',`${base}...HEAD`], {cwd:root, encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
  check('backend implementation remains unchanged', !changed.includes('src/persistence.js') && !changed.includes('src/productionServices.js'));
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
  console.error(`v1.62.0 live recovery verification failed: ${failures.length} check(s).`);
  failures.forEach(([name]) => console.error(`FAILED: ${name}`));
  process.exit(1);
}
console.log(`v1.62.0 live recovery verification passed: ${checks.length} checks.`);
