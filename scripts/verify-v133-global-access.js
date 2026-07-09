#!/usr/bin/env node
const fs = require('fs');
const required = [
  ['server.js', '/api/v133/global-access-classrooms'],
  ['server.js', 'EnglishLegalese internal calendar'],
  ['server.js', 'Tencent/VooV'],
  ['server.js', 'DingTalk'],
  ['server.js', 'ChatGPT/OpenAI only'],
  ['src/productionServices.js', 'manual_classroom_link'],
  ['scripts/verify-live-integrations.js', 'internal_calendar_manual_link'],
  ['README.md', 'Global Access Classroom Stack'],
  ['SAFE_DEPLOYMENT_CHECKLIST.md', 'Google-optional'],
  ['index.html', 'Global Access']
];
const missing = required.filter(([file, text]) => !fs.readFileSync(file, 'utf8').includes(text));
if (missing.length) {
  console.error('v1.33 global access verification failed:', missing.map(m => m.join(':')).join(', '));
  process.exit(1);
}
console.log('v1.33 global access classroom verification passed.');
