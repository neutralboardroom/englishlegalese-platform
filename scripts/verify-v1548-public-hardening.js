const fs = require('fs');

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const index = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('public-v1548.js', 'utf8');
const css = fs.readFileSync('public-v1548.css', 'utf8');

function requireCondition(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

requireCondition(pkg.version === '1.54.8', 'package version is 1.54.8');
requireCondition(index.includes('rel="canonical" href="https://englishlegalese.com/"'), 'canonical URL is present');
requireCondition(index.includes('property="og:url" content="https://englishlegalese.com/"'), 'Open Graph URL is present');
requireCondition(index.includes('name="twitter:card" content="summary_large_image"'), 'Twitter card metadata is present');
requireCondition(index.includes('content="EnglishLegalese.com provides Legal English training for the AI era through SmartTeacher AI practice, live teachers, professional courses, language support, and privacy-conscious progress learning."'), 'description metadata is properly quoted');
requireCondition(index.includes('<link rel="stylesheet" href="public-v1548.css"'), 'v1.54.8 stylesheet is loaded');
requireCondition(index.includes('<script src="public-v1548.js"></script>'), 'v1.54.8 hardening script is loaded');
requireCondition(!index.includes('>Launch</a><a href="#language-bridge">Languages'), 'old nine-item mobile quick-start markup is removed');
requireCondition(js.includes('rewriteLearningExperience'), 'public learning-experience rewrite is enabled');
requireCondition(js.includes('Privacy-conscious by design'), 'public trust copy replaces internal launch-gate language');
requireCondition(js.includes("event.key === 'Escape'"), 'keyboard Escape closes mobile navigation');
requireCondition(css.includes(':focus-visible'), 'visible keyboard focus styling is present');
requireCondition(css.includes('prefers-reduced-motion'), 'reduced-motion accessibility is present');
requireCondition(css.includes('min-height: 44px'), 'touch targets receive a minimum size');

if (process.exitCode) process.exit(process.exitCode);
console.log('v1.54.8 public hardening verification complete.');
