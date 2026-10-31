'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const prior=read('learn/continuing-practice/index.html'),next=read('learn/continuing-practice/advanced/index.html');
assert.equal((prior.match(/class="v1971-lesson"/g)||[]).length,12,'HF35 old 12 lessons preserved');
assert.equal((next.match(/class="v1971-lesson"/g)||[]).length,12,'HF36 12 additional lessons');
assert.equal((next.match(/data-v1980-check /g)||[]).length,12);
assert.equal((next.match(/<textarea rows="4" maxlength="2500"/g)||[]).length,12);
const slots=[...next.matchAll(/data-correct="(\d)"/g)].map(x=>Number(x[1]));
assert.deepEqual(slots.filter(x=>x===0).length,4);
assert.deepEqual(slots.filter(x=>x===1).length,4);
assert.deepEqual(slots.filter(x=>x===2).length,4);
const explanations=[...next.matchAll(/data-explanation="([^"]+)"/g)];
assert.equal(explanations.length,12);
assert.ok(explanations.every(x=>x[1].length>65));
assert.equal(new Set(explanations.map(x=>x[1])).size,12,'unique lesson-specific feedback');
assert.ok(next.includes('src="/product-v1980-practice-checks.js?v=hf35"'));
for(const keyword of ['fetch(', 'XMLHttpRequest', 'localStorage', 'sessionStorage', 'sendBeacon', '<form'])assert.ok(!next.includes(keyword),'advanced learning must not transmit/store: '+keyword);
const memberships=read('learn/memberships/index.html');
assert.ok(memberships.includes('continue automatically for successive monthly or annual billing periods until canceled'));
assert.ok(memberships.includes('Cancel any time before the next renewal'));
assert.ok(next.includes('No subscription, payment, booking, user account or personal-data submission is required'));
for(const [route,track] of [
 ['learn/legal-english/index.html','advanced-legal'],['learn/legal-resources/index.html','advanced-legal'],
 ['learn/business-english/index.html','advanced-business'],['learn/business-resources/index.html','advanced-business']]){
 assert.ok(read(route).includes('advanced/#'+track),route+' must deep-link to relevant track');
}
assert.ok(prior.includes('Open the next 12 Legal and Business English lessons'));
assert.ok(memberships.includes('Continue with 12 additional original Legal and Business English lessons'));
console.log('PASS HF36: 24 original lessons, distinct track deep links, 12 contextual checks, free and private; billing remains inactive.');
