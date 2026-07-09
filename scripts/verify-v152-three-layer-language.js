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
  ['server.js', '/api/v152/three-layer-language-strategy'],
  ['server.js', '/api/v152/core-ui-language-scope'],
  ['server.js', '/api/v152/language-access-plan'],
  ['server.js', '/api/v152/human-reviewed-marketing-page-plan'],
  ['server.js', '/api/v152/language-strategy-continuity-check'],
  ['app.js', 'v1.52.0 Three-Layer Language Access Strategy'],
  ['app.js', 'Use EnglishLegalese in your preferred language when you need help'],
  ['app.js', 'Core platform UI help'],
  ['app.js', 'On-demand page explanation'],
  ['app.js', 'Human-reviewed top-market pages'],
  ['app.js', 'Do not promise every page is perfectly translated'],
  ['app.js', 'Native-language support is a learning bridge'],
  ['app.js', 'Show me the Legal English version'],
  ['app.js', 'Practice this in Legal English'],
  ['styles.css', 'v152-control-row'],
  ['README.md', 'v1.52.0'],
  ['RELEASE_NOTES.md', 'v1.52.0'],
  ['SAFE_DEPLOYMENT_CHECKLIST.md', 'Three-layer language access'],
  ['DATA_MODEL.md', 'three-layer language access'],
  ['PRODUCTION_BACKEND.md', '/api/v152/three-layer-language-strategy'],
  ['DEPLOYMENT.md', 'v1.52.0']
].forEach(([file, needle]) => must(file, needle));
const server = read('server.js');
const languageMatches = server.match(/const V141_MAJOR_LANGUAGE_OPTIONS = \[([\s\S]*?)\];/);
if(!languageMatches) throw new Error('Major-language registry not found');
const count = (languageMatches[1].match(/"/g) || []).length / 2;
if(count < 100) throw new Error(`Expected at least 100 language options, found ${count}`);
['Spanish','Chinese','Arabic','French','Portuguese','Russian','Turkish','Hindi','Urdu','Korean','Japanese','Vietnamese','Indonesian','German','Italian','Polish','Ukrainian','Persian/Farsi','Bengali','Thai'].forEach(lang => must('server.js', lang));
console.log('v1.52 three-layer language access verification passed.');
