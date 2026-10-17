const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const index = read('index.html');
const app = read('app.js');
const publicJs = read('public-v1548.js');
const publicCss = read('public-v1548.css');
const product = read('product-v1550.js');
const research = read('product-v1550-research.js');
const preserve = read('product-v1550-preserve.js');
const css = read('product-v1550.css');
const pkg = JSON.parse(read('package.json'));

const checks = [
  ['package version is v1.55.0, v1.55.1, or a qualified v1.56/v1.57 successor', ['1.55.0','1.55.1','1.56.0','1.57.0'].includes(pkg.version)],

  // Equal-or-stronger successor coverage for historical v1.54.6 / v1.54.8 public UX tests.
  ['no duplicate EnglishLegalese.com.com brand defect', !index.includes('EnglishLegalese.com.com')],
  ['no internal Public Launch Readiness Sprint wording', !index.includes('Public Launch Readiness Sprint')],
  ['v1.54.6 final public UX lineage remains in core app', app.includes('Final Public UX Quality Pass')],
  ['old duplicate Thai/Italian language defect remains absent', !app.includes("'Thai','Italian'")],
  ['canonical URL is present', index.includes('rel="canonical" href="https://englishlegalese.com/"')],
  ['Open Graph URL is present', index.includes('property="og:url" content="https://englishlegalese.com/"')],
  ['Twitter card metadata is present', index.includes('name="twitter:card" content="summary_large_image"')],
  ['current description metadata is properly quoted', /<meta name="description" content="[^"]+" \/>/.test(index)],
  ['v1.54.8 stylesheet remains loaded', index.includes('<link rel="stylesheet" href="public-v1548.css"')],
  ['v1.54.8 hardening script remains loaded', index.includes('<script src="public-v1548.js"></script>')],
  ['old nine-item mobile quick-start markup remains removed', !index.includes('>Launch</a><a href="#language-bridge">Languages')],
  ['public learning-experience rewrite remains enabled', publicJs.includes('rewriteLearningExperience')],
  ['privacy-conscious public trust copy remains available', publicJs.includes('Privacy-conscious by design')],
  ['Escape-key mobile navigation handling remains present', publicJs.includes("event.key === 'Escape'")],
  ['visible keyboard focus styling remains present', publicCss.includes(':focus-visible')],
  ['v1.54.8 reduced-motion protection remains present', publicCss.includes('prefers-reduced-motion')],
  ['v1.54.8 minimum touch-target protection remains present', publicCss.includes('min-height: 44px')],

  // v1.55.0 feature coverage inherited by qualified successors.
  ['product JS is loaded', index.includes('product-v1550.js')],
  ['research adaptation JS is loaded after product JS', index.includes('product-v1550-research.js') && index.indexOf('product-v1550-research.js') > index.indexOf('product-v1550.js')],
  ['navigation preservation JS is loaded after product JS', index.includes('product-v1550-preserve.js') && index.indexOf('product-v1550-preserve.js') > index.indexOf('product-v1550.js')],
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
  ['custom learner-created roleplay exists', research.includes('Create your own practice') && research.includes('CUSTOM LEGAL ENGLISH LANGUAGE PRACTICE')],
  ['custom roleplay requires privacy-safe framing', research.includes('Do not include client names') && research.includes('no confidential client facts')],
  ['custom roleplay preserves legal-advice boundary', research.includes('not legal advice') && research.includes('Do not invent legal facts or decide legal meaning')],
  ['custom roleplay asks for one prioritized takeaway', research.includes('one prioritized takeaway')],
  ['custom roleplay does not persist the learner situation', !research.includes('localStorage') && !research.includes('sessionStorage')],
  ['desktop navigation is exact predecessor set', ["['#start','Start']","['#courses','Courses']","['#smartteacher','SmartTeacher AI']","['#teachers','Teachers']","['#employers','Employers']","['#language-bridge','Language Support']","['#trust','Trust']","['#dashboards','Login / Dashboard','nav-cta']"].every(x => preserve.includes(x)) && !preserve.includes("['#practice-studio','Practice']")],
  ['mobile quick navigation is exact predecessor five-item set', ["['#start','Start']","['#courses','Courses']","['#smartteacher','AI Practice']","['#language-bridge','Languages']","['#dashboards','Dashboard']"].every(x => preserve.includes(x))],
  ['new Practice feature remains discoverable outside locked primary nav', index.includes('href="#practice-studio">Scenario Practice</a>') && product.includes('Practice a legal scenario')],
  ['responsive feature styles exist', css.includes('@media(max-width:680px)') && css.includes('@media(max-width:980px)')],
  ['feature reduced-motion support exists', css.includes('prefers-reduced-motion')],
  ['new check is wired into npm check', String(pkg.scripts?.check || '').includes('verify-v1550-adaptive-practice.js')]
];

const failures = checks.filter(([, ok]) => !ok);
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
if (failures.length) {
  console.error(`v1.55 inherited adaptive verification failed: ${failures.length} check(s).`);
  process.exit(1);
}
console.log(`v1.55 feature inheritance verification passed: ${checks.length} checks.`);
