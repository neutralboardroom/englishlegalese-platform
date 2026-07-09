const http = require('http');

function get(path) {
  const port = process.env.PORT || 3000;
  return new Promise((resolve, reject) => {
    const req = http.get({ hostname: '127.0.0.1', port, path, timeout: 5000 }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('timeout')));
  });
}

async function main() {
  const fs = require('fs');
  const required = [
    'v1.40.0 Workflow Proof Layer',
    'v140-workflow-proof-layer',
    '/api/v140/workflow-proof-layer',
    '/api/v140/workflow-records',
    '/api/v140/smartteacher/lesson-folder',
    '/api/v140/employer-safe-reports',
    'Save SmartTeacher practice',
    'teacher-review handoff',
    'employer-safe report',
    'lesson folder',
    'any preferred/native language',
    'private drafts, raw SmartTeacher AI text, raw native-language explanations',
    'No destructive migrations',
    'no live secrets',
    'ChatGPT/OpenAI-only'
  ];
  const files = ['app.js', 'index.html', 'server.js', 'README.md', 'RELEASE_NOTES.md', 'SAFE_DEPLOYMENT_CHECKLIST.md', 'DEPLOYMENT.md', 'package.json'];
  const haystack = files.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
  const missing = required.filter((term) => !haystack.includes(term));
  if (missing.length) {
    console.error('Missing v1.40 workflow proof markers:', missing.join(', '));
    process.exit(1);
  }
  const forbidden = [/drop\s+table\s+[^.;]/i, /truncate\s+table\s+[^.;]/i, /hard-coded live credentials/i];
  const forbiddenHit = forbidden.find((pattern) => pattern.test(haystack));
  if (forbiddenHit) {
    console.error('Potential destructive or unsafe marker found:', forbiddenHit);
    process.exit(1);
  }
  console.log('v1.40 workflow proof static verification passed.');
  if (process.env.VERIFY_HTTP === '1') {
    const res = await get('/api/v140/workflow-proof-layer');
    if (res.status !== 200 || !res.body.includes('Workflow Proof Layer')) {
      console.error('v1.40 HTTP verification failed:', res.status, res.body.slice(0, 180));
      process.exit(1);
    }
    console.log('v1.40 workflow proof HTTP verification passed.');
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
