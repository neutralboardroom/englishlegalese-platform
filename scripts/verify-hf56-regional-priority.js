'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const html=fs.readFileSync('learn/asia-professional-english/index.html','utf8');
const contracts=fs.readFileSync('product-v1950-contracts-agreements.js','utf8');
const homepage=fs.readFileSync('index.html','utf8');
assert.ok(html.startsWith('<!doctype html>'));
assert.ok(html.includes('href="/learn/enroll/"'));
assert.ok(html.includes('href="/learn/employers/"'));
assert.ok(html.includes('href="/learn/legal-english/"'));
assert.ok(html.includes('href="/learn/business-english/"'));
assert.ok(html.includes('href="/learn/private-energy-contracts/"'));
assert.ok(html.includes('<header class="v1840-header">'));
assert.ok(html.includes('<nav class="v1840-topnav"'));
assert.ok(html.includes('<footer class="v1840-footer">'));
assert.ok(html.includes('Thailand · ประเทศไทย'));
assert.ok(html.includes('Vietnam · Việt Nam'));
assert.ok(html.includes('China · 中国'));
assert.ok(html.indexOf('Thailand · ประเทศไทย')<html.indexOf('Vietnam · Việt Nam'));
assert.ok(html.indexOf('Vietnam · Việt Nam')<html.indexOf('China · 中国'));
for(const code of ['lang="th"','lang="vi"','lang="zh-Hans"'])assert.ok(html.includes(code),'localized context '+code);
for(const audience of ['Practicing lawyers and law firms','In-house legal and compliance teams','Business and project professionals'])assert.ok(html.includes(audience),'missing adult audience');
for(const c of [
 'teacher-led','Fictional','No live lesson or local service is booked',
 'Google Meet is not assumed','private classroom','law firms'
])assert.ok(html.toLowerCase().includes(c.toLowerCase()),'truthful marketing disclaimer: '+c);
for(const unsupported of [
 'Guaranteed students','10,000 new customers','accredited certificate',
 'instant checkout','automatic reservation','client documents accepted'
])assert.ok(!html.toLowerCase().includes(unsupported.toLowerCase()),'inaccurate market promise: '+unsupported);
for(const privateInfo of [
 'tuyen','trinh','condensate jma','real invoice number','private contract attachment'
])assert.ok(!html.toLowerCase().includes(privateInfo),'student or client identity should never be on public regional page');
assert.ok(contracts.includes("region.href='/learn/asia-professional-english/'"),'existing Legal/Business contract tracks should link region overview');
assert.ok(!homepage.includes('HF56 Asia professional'), 'protected homepage not modified by this feature');
const legal=fs.readFileSync('learn/legal-english/index.html','utf8');
const extractNav=s=>s.slice(s.indexOf('<nav class="v1840-topnav"'),s.lastIndexOf('</nav>',s.indexOf('</header>'))+6);
assert.equal(extractNav(html),extractNav(legal),'reuse original header navigation without changes');
const extractFooter=s=>s.slice(s.indexOf('<footer class="v1840-footer">'),s.indexOf('</footer>',s.indexOf('<footer class="v1840-footer">'))+9);
assert.equal(extractFooter(html),extractFooter(legal),'reuse original footer without changes');
console.log('PASS HF56 markets: Vietnam and Thailand recruitment co-priority, Chinese option conditioned on access, adult course routes and identical site chrome.');
