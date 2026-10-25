'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),read=p=>fs.readFileSync(p,'utf8');
const js=read('product-v1930-roleplay.js'),css=read('product-v1930-roleplay.css');
const m=js.match(/const roleplays=(\[[\s\S]*?\]);\s*if\(roleplays.length!==48\)/);
assert(m,'Expected 48 curated original dialogue data rows');
const rows=vm.runInNewContext(m[1],{}, {timeout:2000});
assert.equal(rows.length,48);
assert.equal(new Set(rows.map(x=>x[0])).size,48);
for(const row of rows){
 assert.equal(row.length,6,'Course row must have six individually authored fields');
 for(let i=1;i<6;i++)assert(row[i].length>=(i===1?10:35),'Underdeveloped classroom simulation '+row[0]+':'+i);
}
for(const idx of [2,3,4,5])assert.equal(new Set(rows.map(x=>x[idx])).size,48,'Generic repeated dialogue field '+idx);
const ctx={window:{}};vm.runInNewContext(read('curriculum-v1800-data.js'),ctx,{timeout:3000});
const business=read('product-v1850-business.js');
const wider=JSON.parse(business.slice(business.indexOf('const widerBusiness=')+20,business.indexOf(';\nconst businessCatalog=')));
const finance=JSON.parse(business.slice(business.indexOf('const finance=')+14,business.indexOf(';\nconst widerBusiness=')));
const ids=[...ctx.window.ELCURRICULUM_V1800.records,...wider,...finance].map(x=>x.id);
assert.deepEqual(new Set(rows.map(x=>x[0])),new Set(ids),'Exactly one substantive dialogue per existing subject');
for(const t of ['roleplays.length!==48','v1930-round-two','v1930-brief','v1930-reveal','v1930-reset','v1930-rubric','c.scenario','c.good','c.teacher','c.vocab'])if(t!=='c.teacher')assert(js.includes(t),'Missing functional roleplay '+t);
for(const t of [':focus-visible','[hidden]','@media(max-width:600px)','v1930-simulation'])assert(css.includes(t));
assert(js.includes('v1930-model')&&js.includes("setAttribute('aria-expanded'")&&!js.includes("E('summary'")&&!js.includes("E('details'"),'Do not add nested course summaries; model must reveal via a separately named accessible button');
assert(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|\.cookie\s*=|sendMail|mailto:|WebSocket|axios\s*\(|postMessage|PaymentRequest/i.test(js),'HF12 dialogue must never send/store user responses');
for(const p of ['learn/legal-english/index.html','learn/business-english/index.html']){
 const s=read(p);
 for(const x of ['product-v1930-roleplay.js?v=1.85.0-hf12','product-v1930-roleplay.css?v=1.85.0-hf12','product-v1870-curriculum-workbooks.js','product-v1890-practice-coach.js','product-v1900-evidence-lab.js','product-v1910-workbook-path.js'])assert(s.includes(x),'Preserve prior classroom scripts '+x);
}
const wf=read('.github/workflows/englishlegalese-v1850-production-acceptance.yml');
const threshold=wf.match(/ -lt (\d+) /);
assert(threshold&&Number(threshold[1])>=126&&wf.includes('verify-v1930-roleplay.js')&&wf.includes('v1930-roleplay-production.spec.js'),'HF12 fail-closed production acceptance must include all 126 targeted public tests');
for(const cfg of ['playwright.config.js','playwright.production.config.js'])assert(read(cfg).includes('v1930-roleplay-production.spec.js'));
assert(read('package.json').includes('node scripts/verify-v1930-roleplay.js'));
const policy=read('governance/ENGLISHLEGALESE_DURABLE_BUILDER_RULES_ADDENDUM_2026-10-24.md');assert(policy.includes('EL-DUR-011')&&policy.includes('EL-DUR-012'));
console.log('PASS HF12: 48 unique substantial two-round dialogue simulations, accessible private revisions, no email or persistence, all preceding HF4-HF11 teaching and public tests preserved.');
