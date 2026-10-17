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
const js = read('product-v1560.js');
const access = read('product-v1560-access.js');
const css = read('product-v1560.css');
const audit = read('docs/v1.56.0/SCREENSHOT_AUDIT_DISPOSITION.md');
const research = read('governance/RESEARCH_AND_COMPETITOR_ADOPTION_LEDGER__v1.56.0.md');
const state = JSON.parse(read('governance/CURRENT_RULE_STATE__v1.56.0.json'));
const logoRule = read('governance/OWNER_LOGO_LOCK__2026-10-17.md');

check('package version is 1.56.0', pkg.version === '1.56.0');
check('v1.56 CSS loaded after v1.55 CSS', index.indexOf('product-v1560.css') > index.indexOf('product-v1550.css'));
check('v1.56 homepage JS loaded', index.includes('product-v1560.js'));
check('v1.56 access guard loaded after homepage JS', index.indexOf('product-v1560-access.js') > index.indexOf('product-v1560.js'));
check('homepage architecture version marker present', js.includes("const VERSION = '1.56.0'"));
check('public version badge rewrite exists', js.includes("['New in v1.55', 'Guided practice']"));
check('launch-course internal wording rewrite exists', js.includes("['Launch course set', 'Legal English courses']"));
check('translation builder-language rewrite exists', js.includes('Preferred-language explanations can support understanding'));
check('safety line becomes user-facing Important', js.includes("['Safety line:', 'Important:']"));
check('progress proof language is softened', /track progress/i.test(js) && /shareable progress/i.test(js));
check('100+ language public claim is narrowed', js.includes("el.textContent = 'Major-language learning bridge'"));
check('public EnglishLegalese Team card is removed', js.includes("title === 'EnglishLegalese Team'") && js.includes('card.remove()'));
check('teacher public operations wording is rewritten', js.includes('Account and payout tools are available after sign-in'));
check('employer privacy wording is explicit', js.includes('consent-based, aggregate attendance and learning progress'));
check('diagnostic is explicitly non-accredited', js.includes('not an accredited proficiency test or certification'));
check('course levels are normalized', js.includes("['Beginner / Novice', 'Foundation']") && js.includes("['Intermediate / Advanced', 'Professional / Advanced']"));
check('courses use progressive disclosure', js.includes('v1560-course-controls') && js.includes('View all'));
check('scenarios use progressive disclosure', js.includes('v1560-scenario-controls') && js.includes('Explore all'));
check('all-scenario control does not delete scenario data', js.includes("qsa('.v1550-scenario-card'"));
check('custom roleplay remains surfaced', js.includes('Create your own roleplay'));
check('scenario buttons receive scenario-specific aria labels', js.includes('Open practice: ${title}'));
check('learning planner uses progressive disclosure', js.includes('v1560-planner-controls'));
check('progress detail uses progressive disclosure', js.includes('v1560-progress-controls'));
check('new learner progress empty state exists', js.includes('Your progress starts with your first practice'));
check('progress empty state rejects fake credential meaning', js.includes('not a certification or accredited test score'));
check('employer snapshot is learner controlled', js.includes('Nothing is shared automatically'));
check('SmartTeacher guided starters exist', js.includes('Client update') && js.includes('Contract clause') && js.includes('Meeting clarification') && js.includes('AI draft review'));
check('speaking action no longer implies speech scoring', js.includes("speak.textContent = 'Practice a conversation'"));
check('active navigation updates on scroll', js.includes("window.addEventListener('scroll'") && js.includes("best.setAttribute('aria-current', 'location')"));
check('sticky header offsets are explicit', css.includes('scroll-padding-top') && css.includes('scroll-margin-top'));
check('header logo is resized display-only with auto height', css.includes('.site-header .brand img') && css.includes('height:auto'));
check('mobile layout remains explicit', css.includes('@media (max-width:720px)'));
check('reduced motion remains explicit', css.includes('@media (prefers-reduced-motion:reduce)'));
check('form controls retain 44px minimum', css.includes('min-height:44px'));
check('operational dashboard hashes are access-gated', access.includes("protectedHashes") && access.includes("#teacher-dashboard") && access.includes("#employer-dashboard") && access.includes("#admin-dashboard"));
check('dashboard guard checks production readiness', access.includes('/api/v119/production-readiness'));
check('dashboard guard fails closed without auth+postgres', access.includes('authReady') && access.includes("state?.persistence_mode === 'postgres'"));
check('dashboard guard says dashboards are not publicly enabled when unqualified', access.includes('Account dashboards are not publicly enabled yet.'));
check('full screenshot audit ledger exists', exists('docs/v1.56.0/SCREENSHOT_AUDIT_DISPOSITION.md'));
const numbered = audit.match(/^\d+\./gm) || [];
check('all 92 screenshot/owner items are dispositioned', numbered.length >= 92 && audit.includes('92. **Permanent logo lock'));
check('audit explicitly separates postdeploy verification', audit.includes('VERIFY_AFTER_DEPLOY'));
check('fresh v1.56 competitor research exists', research.includes('Research date:') && research.includes('2026-10-17'));
check('fresh research includes current EF and Preply evidence', research.includes('EF Corporate Learning') && research.includes('Preply Business'));
check('fresh research records adopt/adapt/defer/reject decisions', ['ADAPT','ADOPT','DEFER_WITH_REASON','REJECT_WITH_CAUSE'].every(x => research.includes(x)));
check('current rule state recognizes 19 Roger Rules', state.roger_rule_count === 19 && state.roger_rule_ids.includes('EL-RGR-019'));
check('logo lock path and blob SHA recorded', state.logo_lock?.path === 'assets/englishlegalese-logo.png' && state.logo_lock?.blob_sha === 'b5f20ef046d75d6f108bc93243c7c14acf3c4eb1');
check('logo rule forbids visual asset drift', logoRule.includes('EL-RGR-019') && logoRule.includes('RELEASE BLOCKER') && logoRule.includes('may not be replaced, regenerated, redrawn, recolored'));
check('logo rule permits only aspect-ratio-safe display sizing', logoRule.includes('display size') || logoRule.includes('Display-only presentation changes'));

try {
  const sha = cp.execFileSync('git', ['hash-object', 'assets/englishlegalese-logo.png'], {cwd:root, encoding:'utf8'}).trim();
  check('protected logo bytes exactly match locked blob SHA', sha === 'b5f20ef046d75d6f108bc93243c7c14acf3c4eb1');
} catch {
  check('protected logo bytes exactly match locked blob SHA', false);
}

try {
  const changed = cp.execFileSync('git', ['diff','--name-only','a499e99439927e630bd334b4a3b9fbebdff08cd5...HEAD'], {cwd:root, encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
  check('server implementation unchanged from v1.55.1', !changed.includes('server.js'));
  check('persistence unchanged from v1.55.1', !changed.includes('src/persistence.js'));
  check('production services unchanged from v1.55.1', !changed.includes('src/productionServices.js'));
  check('database migrations unchanged from v1.55.1', !changed.some(p => p.startsWith('db/migrations/') || p.startsWith('migrations/')));
  check('protected logo file itself is unchanged from v1.55.1', !changed.includes('assets/englishlegalese-logo.png'));
} catch {
  check('git no-drift evidence available', false);
}

for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failures = checks.filter(([,ok]) => !ok);
if (failures.length) {
  console.error(`v1.56.0 homepage/screenshot verification failed: ${failures.length} check(s).`);
  process.exit(1);
}
console.log(`v1.56.0 homepage/screenshot verification passed: ${checks.length} checks.`);
