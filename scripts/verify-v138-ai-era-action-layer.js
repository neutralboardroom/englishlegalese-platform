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
    'v1.38.0 AI-Era Action Layer',
    'v138-ai-era-action-layer',
    'v138-student-proof-loop',
    'v138-role-operating-lanes',
    'v138-trust-microcopy',
    'v138-mobile-action-map',
    '/api/v138/ai-era-action-layer',
    'ChatGPT/OpenAI only',
    'Translation Bridge',
    'Employer reporting should remain privacy-safe by default',
    'Google Meet/Calendar may be used where accessible',
    'no destructive migrations',
    'no live secrets'
  ];
  const files = ['app.js', 'index.html', 'server.js', 'README.md', 'RELEASE_NOTES.md', 'SAFE_DEPLOYMENT_CHECKLIST.md', 'DEPLOYMENT.md'];
  const haystack = files.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
  const missing = required.filter((term) => !haystack.includes(term));
  if (missing.length) {
    console.error('Missing v1.38 AI-era action layer markers:', missing.join(', '));
    process.exit(1);
  }
  console.log('v1.38 AI-era action layer static verification passed.');
  if (process.env.VERIFY_HTTP === '1') {
    const res = await get('/api/v138/ai-era-action-layer');
    if (res.status !== 200 || !res.body.includes('AI-Era Action Layer')) {
      console.error('v1.38 HTTP verification failed:', res.status, res.body.slice(0, 180));
      process.exit(1);
    }
    console.log('v1.38 AI-era action layer HTTP verification passed.');
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
