const fs = require('fs');
const requiredFiles = ['app.js','server.js','index.html','README.md','RELEASE_NOTES.md','SAFE_DEPLOYMENT_CHECKLIST.md','DATA_MODEL.md','PRODUCTION_BACKEND.md','package.json','styles.css'];
const requiredStrings = [
  ['package.json', '1.54.0'],
  ['app.js', 'v1.50.0 100+ Language Learning Bridge'],
  ['app.js', 'v150-language-learning-bridge'],
  ['app.js', 'Get unstuck in 100+ major languages'],
  ['app.js', 'Translation Bridge records'],
  ['server.js', '/api/v150/language-learning-bridge'],
  ['server.js', '/api/v150/language-marketing-summary'],
  ['server.js', '/api/v150/language-onboarding-plan'],
  ['server.js', '/api/v150/employer-language-readiness-card'],
  ['server.js', '/api/v150/language-continuity-preservation-check'],
  ['server.js', 'v150LanguageLearningBridgeSeed'],
  ['index.html', '#v150-language-learning-bridge'],
  ['styles.css', 'v1.50 100+ Language Learning Bridge'],
  ['README.md', 'v1.50.0 — 100+ Language Learning Bridge Marketing + Onboarding Pass'],
  ['RELEASE_NOTES.md', 'v1.50.0 — 100+ Language Learning Bridge Marketing + Onboarding Pass'],
  ['SAFE_DEPLOYMENT_CHECKLIST.md', 'v1.50.0 Language Learning Bridge checklist'],
  ['DATA_MODEL.md', 'v1.50.0 Language Learning Bridge records'],
  ['PRODUCTION_BACKEND.md', 'v1.50.0 backend additions']
];
const missingFiles = requiredFiles.filter(f => !fs.existsSync(f));
if (missingFiles.length) {
  console.error('Missing required files:', missingFiles.join(', '));
  process.exit(1);
}
const missingStrings = [];
for (const [file, needle] of requiredStrings) {
  const text = fs.readFileSync(file, 'utf8');
  if (!text.includes(needle)) missingStrings.push(`${file}: ${needle}`);
}
if (missingStrings.length) {
  console.error('Missing v1.50 language learning bridge markers:\n' + missingStrings.join('\n'));
  process.exit(1);
}
console.log('v1.50 100+ language learning bridge verification passed.');
