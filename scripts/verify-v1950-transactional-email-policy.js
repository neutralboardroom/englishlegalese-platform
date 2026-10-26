'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const path='governance/ENGLISHLEGALESE_DURABLE_TRANSACTIONAL_EMAIL_POLICY_2026-10-26.md';
const text=fs.readFileSync(path,'utf8');
for(const label of [
  'EL-DUR-013','EL-RGR-025','2026-10-26','student account/email verification',
  'password resets and recovery','security notices','class or appointment confirmations',
  'teacher feedback/lesson notifications','Unsolicited outreach and marketing',
  'distinct explicit owner authorization','SPF/DKIM','single-use','stored hashed',
  'NEVER send real emails','Saved to your account','Saved on this device only',
  'EL-DUR-011','EL-RGR-023','all future versions'
])assert(text.includes(label),'Current durable transactional email policy missing '+label);
for(const p of [
 'governance/ENGLISHLEGALESE_DURABLE_BUILDER_RULES_ADDENDUM_2026-10-24.md',
 'governance/ENGLISHLEGALESE_OWNER_DIRECTIVES_ADDENDUM_2026-10-22.md'
]){
 const old=fs.readFileSync(p,'utf8');
 assert(old.includes('CURRENT POLICY NOTICE')&&old.includes('EL-DUR-013 / EL-RGR-025')&&old.includes(path),'Historical prohibition must visibly defer to later owner approval: '+p);
 assert(old.includes('EL-DUR-011')&&old.includes('EL-RGR-023'),'Do not erase historical rules '+p);
}
const intake=fs.readFileSync('scripts/verify-v1851-intake.js','utf8');
assert(intake.includes('ENGLISHLEGALESE_DURABLE_TRANSACTIONAL_EMAIL_POLICY_2026-10-26.md'),'CI intake guard must load current policy');
const packageFile=JSON.parse(fs.readFileSync('package.json','utf8'));
assert(packageFile.scripts.check.includes('verify-v1950-transactional-email-policy.js'),'Release source qualification must check current successor policy');
const tx=fs.readFileSync('src/transactionalEmail.js','utf8');
assert(tx.includes('resendConfigured')&&tx.includes('sendResendEmail')&&tx.includes('Transactional email not acknowledged'),'Retain gated legitimate transactional mail integration');
const legacyBuilder=fs.readFileSync('scripts/owner-triage-v1851-intake.js','utf8');
assert(!/\b(?:sendResendEmail|sendMail|nodemailer|axios\(|fetch\()/.test(legacyBuilder),'Never send from the original builder workflow');
console.log('PASS EL-DUR-013 / EL-RGR-025: approved real-event transactional email, no unsolicited outreach or delivery from builders/tests, historical no-email directives preserved with explicit owner-authorized successor.');
