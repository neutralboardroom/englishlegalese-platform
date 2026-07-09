#!/usr/bin/env node
const fs = require('fs');
const required = [
  ['server.js', '/api/v134/calendar-interop'],
  ['server.js', '/api/v134/calendar/session.ics'],
  ['server.js', '.ics file download/email'],
  ['server.js', 'Outlook/Microsoft 365'],
  ['server.js', 'Apple Calendar/iCloud'],
  ['server.js', 'CalDAV-compatible'],
  ['server.js', 'DingTalk or WeCom/Tencent'],
  ['app.js', 'v134-calendar-interop'],
  ['app.js', 'Calendar provider board'],
  ['index.html', 'Calendar Access'],
  ['README.md', 'Universal Calendar Interop'],
  ['SAFE_DEPLOYMENT_CHECKLIST.md', 'Google Calendar is optional']
];
const missing = required.filter(([file, text]) => !fs.readFileSync(file, 'utf8').includes(text));
if (missing.length) {
  console.error('v1.34 calendar interop verification failed:', missing.map(m => m.join(':')).join(', '));
  process.exit(1);
}
console.log('v1.34 universal calendar interop verification passed.');
