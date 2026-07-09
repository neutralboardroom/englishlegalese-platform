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
    'v136-native-language-support',
    'Explain in my language',
    'Side-by-side Legal English',
    'Teacher Translation Bridge',
    'not certified translation',
    'ChatGPT/OpenAI-only'
  ];
  const app = fs.readFileSync('app.js', 'utf8');
  const server = fs.readFileSync('server.js', 'utf8');
  const docs = fs.readFileSync('README.md', 'utf8') + fs.readFileSync('RELEASE_NOTES.md', 'utf8') + fs.readFileSync('SAFE_DEPLOYMENT_CHECKLIST.md', 'utf8');
  const missing = required.filter((term) => !app.includes(term) && !server.includes(term) && !docs.includes(term));
  if (missing.length) {
    console.error('Missing v1.36 native-language support markers:', missing.join(', '));
    process.exit(1);
  }
  console.log('v1.36 native-language support static verification passed.');
  if (process.env.VERIFY_HTTP === '1') {
    const res = await get('/api/v136/native-language-support');
    if (res.status !== 200 || !res.body.includes('native-language')) {
      console.error('v1.36 HTTP verification failed:', res.status, res.body.slice(0, 160));
      process.exit(1);
    }
    console.log('v1.36 native-language support HTTP verification passed.');
  }
}
main().catch((err) => { console.error(err); process.exit(1); });
