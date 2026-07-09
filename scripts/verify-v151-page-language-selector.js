const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
function read(file){ return fs.readFileSync(path.join(root, file), 'utf8'); }
function must(file, needle){
  const text = read(file);
  if(!text.includes(needle)) throw new Error(`${file} missing required text: ${needle}`);
}
[
  ['package.json', '1.54.0'],
  ['server.js', '/api/v151/page-language-selector'],
  ['server.js', '/api/v151/page-language-options'],
  ['server.js', '/api/v151/preferred-language-setting'],
  ['server.js', '/api/v151/page-explanation-request'],
  ['server.js', '/api/v151/employer-language-access-summary'],
  ['server.js', '/api/v151/page-language-continuity-check'],
  ['app.js', 'v1.51.0 Preferred-Language Page Selector + Explanation Bridge'],
  ['app.js', 'Explain this page'],
  ['app.js', 'Back to Legal English'],
  ['app.js', '100+ major languages'],
  ['app.js', 'learning support only'],
  ['app.js', 'not certified translation'],
  ['app.js', 'not legal advice'],
  ['styles.css', 'v151-mode-strip'],
  ['README.md', 'v1.51.0'],
  ['RELEASE_NOTES.md', 'v1.51.0'],
  ['SAFE_DEPLOYMENT_CHECKLIST.md', 'Preferred-language page selector'],
  ['DATA_MODEL.md', 'preferred-language settings'],
  ['PRODUCTION_BACKEND.md', '/api/v151/page-language-selector'],
  ['DEPLOYMENT.md', 'v1.51.0']
].forEach(([file, needle]) => must(file, needle));
const server = read('server.js');
const languageMatches = server.match(/const V141_MAJOR_LANGUAGE_OPTIONS = \[([\s\S]*?)\];/);
if(!languageMatches) throw new Error('Major-language registry not found');
const count = (languageMatches[1].match(/"/g) || []).length / 2;
if(count < 100) throw new Error(`Expected at least 100 language options, found ${count}`);
console.log('v1.51 page language selector verification passed.');
