const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
function read(file){ return fs.readFileSync(path.join(root, file), 'utf8'); }
function assertIncludes(file, text){
  const body = read(file);
  if(!body.includes(text)){
    console.error(`Missing "${text}" in ${file}`);
    process.exit(1);
  }
}
function assertNotIncludes(file, text){
  const body = read(file);
  if(body.includes(text)){
    console.error(`Unexpected "${text}" in ${file}`);
    process.exit(1);
  }
}

const pkg = JSON.parse(read('package.json'));
if (!/^1\.(3[2-9]|[4-9][0-9])\./.test(pkg.version)) {
  console.error(`Expected package version v1.32 or later continuation, found ${pkg.version}`);
  process.exit(1);
}

assertIncludes('server.js', '/api/v132/chatgpt-only-smartteacher');
assertIncludes('server.js', 'ChatGPT/OpenAI only');
assertIncludes('server.js', 'OPENAI_API_KEY');
assertIncludes('src/productionServices.js', 'powered by ChatGPT/OpenAI only');
assertIncludes('src/productionServices.js', 'process.env.SMARTTEACHER_MODEL || process.env.OPENAI_MODEL');
assertIncludes('src/productionServices.js', 'openai_chatgpt_responses_api_only');
assertIncludes('app.js', 'v132ChatGptOnlyPolicySection');
assertIncludes('app.js', 'ChatGPT/OpenAI only');
assertIncludes('app.js', 'v132OwnerStaffAiOpsSection');
assertIncludes('index.html', 'ChatGPT-only SmartTeacher AI');
assertIncludes('README.md', 'ChatGPT-Only SmartTeacher AI');
assertIncludes('RELEASE_NOTES.md', 'ChatGPT-Only SmartTeacher AI');
assertIncludes('PRODUCTION_SECRETS_TEMPLATE.md', 'OpenAI/ChatGPT is the only AI vendor');
assertIncludes('.env.production.example', 'OPENAI_API_KEY');
assertIncludes('.env.production.example', 'SMARTTEACHER_MODEL');

const forbiddenEnvNames = ['GEMINI_API_KEY', 'ANTHROPIC_API_KEY', 'CLAUDE_API_KEY', 'GROK_API_KEY', 'XAI_API_KEY', 'GOOGLE_AI_API_KEY'];
for (const file of ['.env.example', '.env.production.example', 'PRODUCTION_SECRETS_TEMPLATE.md']) {
  for (const envName of forbiddenEnvNames) assertNotIncludes(file, envName);
}

console.log('v1.32 ChatGPT-only SmartTeacher AI verification passed.');
