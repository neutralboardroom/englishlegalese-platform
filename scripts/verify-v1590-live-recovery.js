const fs = require('fs');
const crypto = require('crypto');

function read(p){ return fs.readFileSync(p,'utf8'); }
function assert(ok,msg){ if(!ok){ console.error(`FAIL: ${msg}`); process.exitCode=1; } else console.log(`PASS: ${msg}`); }

const pkg = JSON.parse(read('package.json'));
const index = read('index.html');
const app = read('app.js');
const v1550 = read('product-v1550.js');
const v1590 = read('product-v1590.js');
const css1590 = read('product-v1590.css');
const logo = fs.readFileSync('assets/englishlegalese-logo.png');
const logoSha = crypto.createHash('sha1').update(logo).digest('hex');

assert(pkg.version === '1.59.0','package version is 1.59.0');
assert(index.includes('product-v1590.css?v=1.59.0'),'v1.59 CSS is cache-busted and loaded');
assert(index.includes('product-v1590.js?v=1.59.0'),'v1.59 JS is cache-busted and loaded');
assert(index.includes('app.js?v=1.59.0'),'canonical app asset is cache-busted');
assert(index.includes('Cache-Control') && index.includes('no-store'),'homepage shell includes explicit no-cache metadata');
assert(v1550.length > 10000 && v1550.includes('Legal Scenario Studio'),'v1.55 adaptive practice implementation is present, not empty');
assert(app.includes('Free Legal English starting diagnostic'),'canonical diagnostic remains present');
assert(!app.includes('EnglishLegalese Team'),'canonical app does not expose public staff role card');
assert(v1590.includes("qs('#adaptive-learning')?.remove()"),'v1.59 removes old release/internal feature panel');
assert(v1590.includes('card.hidden = i >= 6 && !scenariosExpanded'),'v1.59 directly compacts scenario cards');
assert(v1590.includes('builder.hidden = !plannerExpanded'),'v1.59 directly compacts learning-plan builder');
assert(v1590.includes("el.hidden = !progressExpanded"),'v1.59 directly compacts progress details');
assert(v1590.includes('EnglishLegalese Team'),'v1.59 directly removes legacy public staff card if reinjected');
assert(v1590.includes('Launch course set') && v1590.includes('Legal English courses'),'v1.59 repairs legacy course-label copy');
assert(v1590.includes('Safety line:') && v1590.includes('Important:'),'v1.59 repairs legacy safety-label copy');
assert(css1590.includes('.site-header .brand img') && css1590.includes('width:190px!important'),'logo display sizing is enforced without changing logo artwork');
assert(css1590.includes('.hero-actions .btn.light') && css1590.includes('color:#0b1d33!important'),'light hero CTA contrast is enforced');
assert(logoSha === 'b5f20ef046d75d6f108bc93243c7c14acf3c4eb1','approved logo artwork SHA-1 remains byte-locked');

if(process.exitCode){ process.exit(process.exitCode); }
console.log('v1.59.0 live recovery verification passed.');
