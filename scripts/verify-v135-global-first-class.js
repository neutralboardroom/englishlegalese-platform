const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const mustContain = (file, patterns) => {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  for (const pattern of patterns) {
    if (!text.includes(pattern)) {
      throw new Error(`${file} is missing required text: ${pattern}`);
    }
  }
};

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (!/^1\.(35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54)\.0$/.test(pkg.version)) throw new Error(`Expected v1.35.0 or later compatible package, got ${pkg.version}`);
mustContain('package.json', ['verify-v135-global-first-class.js']);
mustContain('server.js', [
  'global-first-class-success',
  '/api/v135/global-first-class-success',
  'v135GlobalFirstClassSuccessSeed',
  'ChatGPT/OpenAI only',
  'manual/regional links and ICS reminders stay required fallbacks'
]);
mustContain('app.js', [
  'v135GlobalFirstClassHeroSection',
  'v135FirstClassSuccessFlowSection',
  'v135TeacherLiveToolsSection',
  'v135GlobalAccessReadinessSection',
  'v135TrustAndAiObjectionSection',
  'v135TeacherMarketingRhythmSection',
  'Practice with SmartTeacher AI. Improve with live teachers. Prove progress safely.',
  'Never block a learner because Google Calendar or Google Meet is unavailable'
]);
mustContain('README.md', ['v1.35.0', 'Global First-Class Success']);
mustContain('RELEASE_NOTES.md', ['v1.35.0', 'Global First-Class Success']);
mustContain('SAFE_DEPLOYMENT_CHECKLIST.md', ['v1.35.0', 'No destructive migrations']);

const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
const packageText = fs.readFileSync(path.join(root, 'package.json'), 'utf8');
const disallowed = ['GEMINI_API_KEY', 'ANTHROPIC_API_KEY', 'GROK_API_KEY', 'XAI_API_KEY'];
for (const token of disallowed) {
  if (packageText.includes(token)) {
    throw new Error(`Unexpected AI vendor secret in package.json: ${token}`);
  }
}
if (!server.includes('OPENAI_API_KEY')) {
  throw new Error('server.js should preserve OpenAI/ChatGPT-only SmartTeacher guidance.');
}
console.log('v1.35 global first-class success verification passed.');
