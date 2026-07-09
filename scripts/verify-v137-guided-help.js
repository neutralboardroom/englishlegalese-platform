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
    'v137-guided-help-navigator',
    'One Help button',
    'v137-one-tap-help',
    'Ask my teacher',
    'Back to Legal English',
    '/api/v137/guided-help-readiness',
    'ChatGPT/OpenAI-only',
    'Native-Language Learning Support + Translation Bridge'
  ];
  const app = fs.readFileSync('app.js', 'utf8');
  const index = fs.readFileSync('index.html', 'utf8');
  const server = fs.readFileSync('server.js', 'utf8');
  const docs = fs.readFileSync('README.md', 'utf8') + fs.readFileSync('RELEASE_NOTES.md', 'utf8') + fs.readFileSync('SAFE_DEPLOYMENT_CHECKLIST.md', 'utf8');
  const haystack = app + index + server + docs;
  const missing = required.filter((term) => !haystack.includes(term));
  if (missing.length) {
    console.error('Missing v1.37 guided help markers:', missing.join(', '));
    process.exit(1);
  }
  console.log('v1.37 guided help static verification passed.');
  if (process.env.VERIFY_HTTP === '1') {
    const res = await get('/api/v137/guided-help-readiness');
    if (res.status !== 200 || !res.body.includes('Guided Help')) {
      console.error('v1.37 HTTP verification failed:', res.status, res.body.slice(0, 180));
      process.exit(1);
    }
    console.log('v1.37 guided help HTTP verification passed.');
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
