
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
function read(file){ return fs.readFileSync(path.join(root, file), 'utf8'); }
function must(file, needle){
  const text = read(file);
  if(!text.includes(needle)) throw new Error(`${file} missing required text: ${needle}`);
}
function mustNot(file, needle){
  const text = read(file);
  if(text.includes(needle)) throw new Error(`${file} contains forbidden text: ${needle}`);
}
const pkg = JSON.parse(read('package.json'));
if(!/^1\.(41|42|43|44|45|46|47|48|49|50|51|52|53|54)\.0$/.test(pkg.version)) throw new Error(`package.json missing compatible v1.41+ version, found ${pkg.version}`);
must('app.js', 'v1.41.0 Major-Language Bridge + Classroom Command');
must('app.js', 'v141MajorLanguages');
must('app.js', 'Simple English first');
must('app.js', 'Back to Legal English');
must('app.js', 'Employer-safe language-support summary');
must('server.js', '/api/v141/major-language-bridge');
must('server.js', '/api/v141/language-options');
must('server.js', '/api/v141/language-support-requests');
must('server.js', '/api/v141/employer-language-summaries');
must('server.js', 'V141_MAJOR_LANGUAGE_OPTIONS');
must('index.html', '#v141-major-language-bridge');
must('styles.css', 'v1.41.0 Major-Language Bridge');
must('README.md', 'v1.41.0 — Major-Language Bridge + Classroom Command');
must('RELEASE_NOTES.md', 'v1.41.0 — Major-Language Bridge + Classroom Command');
must('SAFE_DEPLOYMENT_CHECKLIST.md', 'v1.41.0 — Major-Language Bridge + Classroom Command');
must('DEPLOYMENT.md', 'v1.41.0 — Major-Language Bridge + Classroom Command');
mustNot('server.js', 'DROP TABLE');
mustNot('server.js', 'TRUNCATE TABLE');
mustNot('server.js', 'DELETE FROM users');
const server = read('server.js');
const match = server.match(/const V141_MAJOR_LANGUAGE_OPTIONS = (\[[\s\S]*?\]);/);
if(!match) throw new Error('Could not locate V141 language options array');
const languages = JSON.parse(match[1]);
if(languages.length < 100) throw new Error(`Expected at least 100 language options, found ${languages.length}`);
['Spanish','Mandarin Chinese','Hindi','Arabic','Bengali','Portuguese','Russian','Urdu','Indonesian','French','German','Japanese','Turkish','Vietnamese','Korean'].forEach(lang => {
  if(!languages.includes(lang)) throw new Error(`Missing major language option: ${lang}`);
});
console.log(`v1.41 Major-Language Bridge verification passed with ${languages.length} language options.`);
