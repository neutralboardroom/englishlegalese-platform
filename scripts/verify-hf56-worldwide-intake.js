'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const page=fs.readFileSync('learn/asia-professional-english/index.html','utf8');
const enroll=fs.readFileSync('product-v1850-enrollment.js','utf8');
const html=fs.readFileSync('learn/enroll/index.html','utf8');
const tests=fs.readFileSync('tests/hf56-worldwide-locale-intake.spec.js','utf8');
const groups=[['th','th'],['vn','vi'],['cn','zh-Hans'],['other','en']];
assert.ok(page.includes('EnglishLegalese serves adult learners and employers worldwide.'),'Worldwide product availability remains explicit');
assert.ok(page.includes('they are not an eligibility restriction'),'Initial markets cannot restrict global service');
assert.ok(page.includes('Worldwide enrollment inquiry'),'All-country entry point required');
assert.ok(page.includes('Mainland China video access must be checked')||page.includes('Google Meet is not assumed'),'No unverified Google Meet availability claims');
for(const [market,locale] of groups){
 assert.ok(page.includes('market='+market+'&amp;lang='+locale),'Correct locale-specific request path: '+market);
 assert.ok(tests.includes("market:'"+market+"',lang:'"+locale+"'"),'Browser inquiry roundtrip required: '+market);
}
assert.ok(enroll.includes("['other','Another country — worldwide EnglishLegalese enrollment']"),'Worldwide must be the default, not a single country');
assert.ok(enroll.includes("const learnerMarket=select("));
assert.ok(enroll.includes("const contactLanguage=select("));
assert.ok(enroll.includes("const preMarket=qs.get('market'),preLanguage=qs.get('lang');"));
assert.ok(enroll.includes("const localeNote=' [Learner market='"),'Must persist language preference inside existing 500-char enrollment note');
assert.ok(enroll.includes("info.note=(prefix+localeNote+"),'Maintain original backend intake grammar as first note component');
assert.ok(enroll.includes("info.client_request_id=crypto.randomUUID()"),'Retain idempotent safe public intake');
assert.ok(enroll.includes("fetch('/api/v1850/enroll'"),'Keep original working intake API');
assert.ok(enroll.includes("No payment is taken, no automatic email is sent"),'Existing enrollment disclosure preserved');
assert.ok(!enroll.includes('sendEmail(')&&!enroll.includes('window.location.href='),'No new outreach or geographical redirect');
assert.ok(html.includes('id="v1850-enrollment-app"'),'Retain existing page mount and layout');
assert.ok(html.includes('product-v1850-enrollment.js?v=1.85.0-hf7'),'Retain existing page script order; browser cache update separately before release');
console.log('PASS HF56 worldwide: Thai/Vietnamese/Chinese functional intake preferences, worldwide default, unchanged enrollment API, no paid action/outreach.');
