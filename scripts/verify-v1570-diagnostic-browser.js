const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const exists = p => fs.existsSync(path.join(root, p));
const checkList = [];
const check = (name, ok) => checkList.push([name, Boolean(ok)]);

const pkg = JSON.parse(read('package.json'));
const index = read('index.html');
const js = read('product-v1570.js');
const css = read('product-v1570.css');
const pw = read('playwright.config.js');
const test = read('tests/v1570-browser.spec.js');
const workflow = read('.github/workflows/englishlegalese-release-gate.yml');
const state = JSON.parse(read('governance/CURRENT_RULE_STATE__v1.57.0.json'));
const register = read('governance/ENGLISHLEGALESE_CANONICAL_RULE_REGISTER__v1.57.0.md');
const research = read('governance/RESEARCH_AND_COMPETITOR_ADOPTION_LEDGER__v1.57.0.md');

check('package version is exactly 1.57.0', pkg.version === '1.57.0');
check('v1.57 stylesheet is loaded after v1.56', index.indexOf('product-v1570.css') > index.indexOf('product-v1560.css'));
check('v1.57 script is loaded after v1.56 access guard', index.indexOf('product-v1570.js') > index.indexOf('product-v1560-access.js'));
check('diagnostic has exactly eight original questions', (js.match(/id: '/g) || []).length === 8);
check('diagnostic says answers are not saved', js.includes('your answers are not saved'));
check('diagnostic rejects CEFR/TOLES/accreditation equivalence', js.includes('not an accredited proficiency test') && js.includes('no CEFR, TOLES, academic, licensing, or employment equivalence'));
check('diagnostic avoids substantive legal-advice positioning', js.includes('AI-output review') && js.includes('qualified source/person') && !js.includes('give legal advice'));
check('diagnostic has incomplete-answer status', js.includes('Please answer all ${QUESTIONS.length} questions'));
check('diagnostic has three practice recommendations', ['Foundation practice path','Professional practice path','Advanced practice path'].every(x => js.includes(x)));
check('diagnostic routes to existing courses/scenario/SmartTeacher surfaces', js.includes("href: '#courses'") && js.includes("href: '#practice-studio'") && js.includes('href="#smartteacher"'));
check('diagnostic layer has mobile and reduced-motion styling', css.includes('@media (max-width:720px)') && css.includes('prefers-reduced-motion'));
check('browser test dependency is pinned', pkg.devDependencies?.['@playwright/test'] === '1.64.1');
check('browser tests cover desktop tablet mobile', ['desktop-chromium','tablet-chromium','mobile-chromium'].every(x => pw.includes(x)));
check('browser tests cover responsive overflow and protected logo', test.includes('scrollWidth - document.documentElement.clientWidth') && test.includes('englishlegalese-logo.png'));
check('browser tests exercise diagnostic', test.includes('Get my practice recommendation') && test.includes('Advanced practice path'));
check('browser tests exercise keyboard incomplete state', test.includes("page.keyboard.press('Enter')") && test.includes('Please answer all 8 questions'));
check('browser tests exercise dashboard fail-closed behavior', test.includes('#admin-dashboard') && test.includes('Account dashboards are not publicly enabled yet.'));
check('browser tests exercise progressive disclosure', test.includes('js-v1560-courses') && test.includes('js-v1560-scenarios'));
check('browser tests exercise reduced motion', test.includes('reducedMotion') && test.includes('transitionDuration'));
check('workflow installs Chromium', workflow.includes('npx playwright install --with-deps chromium'));
check('workflow makes browser tests release-blocking', workflow.includes('npm run e2e:browser'));
check('workflow preserves browser evidence', workflow.includes('actions/upload-artifact@v4') && workflow.includes('englishlegalese-browser-qualification'));
check('successor rule register is complete through EL-RGR-019', Array.from({length:19},(_,i)=>`EL-RGR-${String(i+1).padStart(3,'0')}`).every(id => register.includes(`## ${id}`)));
check('successor rule register preserves 10 durable rules', Array.from({length:10},(_,i)=>`EL-DUR-${String(i+1).padStart(3,'0')}`).every(id => register.includes(`## ${id}`)));
check('current rule state points to successor register', state.canonical_rule_register === 'governance/ENGLISHLEGALESE_CANONICAL_RULE_REGISTER__v1.57.0.md' && state.roger_rule_count === 19);
check('logo lock remains exact', state.logo_lock?.blob_sha === 'b5f20ef046d75d6f108bc93243c7c14acf3c4eb1');
check('fresh research uses ordinary web research and records no Firecrawl credits', research.includes('Fresh ordinary web research only; no Firecrawl credits used'));
check('fresh research has explicit dispositions', ['ADAPT','ADOPT','DEFER_WITH_REASON','REJECT_WITH_CAUSE'].every(x => research.includes(x)));
check('v1.57 verifier is wired into npm check', String(pkg.scripts?.check || '').includes('verify-v1570-diagnostic-browser.js'));

try {
  const logoSha = cp.execFileSync('git', ['hash-object','assets/englishlegalese-logo.png'], {cwd:root, encoding:'utf8'}).trim();
  check('protected logo bytes remain exact', logoSha === 'b5f20ef046d75d6f108bc93243c7c14acf3c4eb1');
  const changed = cp.execFileSync('git', ['diff','--name-only','0bcf9419be39cbc8bd9a3603d33fcbc01f428ab0...HEAD'], {cwd:root, encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
  check('server implementation unchanged from v1.56.0', !changed.includes('server.js'));
  check('persistence unchanged from v1.56.0', !changed.includes('src/persistence.js'));
  check('production services unchanged from v1.56.0', !changed.includes('src/productionServices.js'));
  check('database migrations unchanged from v1.56.0', !changed.some(p => p.startsWith('db/migrations/') || p.startsWith('migrations/')));
  check('protected logo file itself unchanged from v1.56.0', !changed.includes('assets/englishlegalese-logo.png'));
} catch {
  check('git no-drift evidence available', false);
}

for (const [name, ok] of checkList) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failures = checkList.filter(([, ok]) => !ok);
if (failures.length) {
  console.error(`v1.57.0 diagnostic/browser verification failed: ${failures.length} check(s).`);
  process.exit(1);
}
console.log(`v1.57.0 diagnostic/browser verification passed: ${checkList.length} checks.`);
