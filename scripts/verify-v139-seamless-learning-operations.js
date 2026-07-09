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
    'v1.39.0 Seamless Learning Operations',
    'v139-seamless-learning-operations',
    'v139-universal-language-bridge',
    'v139-teacher-live-cockpit',
    'v139-role-flow-board',
    'v139-data-preservation',
    '/api/v139/seamless-learning-operations',
    'any preferred/native language',
    'teacher live cockpit',
    'Employer-safe proof',
    'No-data-loss deployment guardrail',
    'ChatGPT/OpenAI-only',
    'no live secrets',
    'no destructive migrations'
  ];
  const files = ['app.js', 'index.html', 'server.js', 'README.md', 'RELEASE_NOTES.md', 'SAFE_DEPLOYMENT_CHECKLIST.md', 'DEPLOYMENT.md', 'package.json'];
  const haystack = files.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
  const missing = required.filter((term) => !haystack.includes(term));
  if (missing.length) {
    console.error('Missing v1.39 seamless learning operations markers:', missing.join(', '));
    process.exit(1);
  }
  console.log('v1.39 seamless learning operations static verification passed.');
  if (process.env.VERIFY_HTTP === '1') {
    const res = await get('/api/v139/seamless-learning-operations');
    if (res.status !== 200 || !res.body.includes('Seamless Learning Operations')) {
      console.error('v1.39 HTTP verification failed:', res.status, res.body.slice(0, 180));
      process.exit(1);
    }
    console.log('v1.39 seamless learning operations HTTP verification passed.');
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
