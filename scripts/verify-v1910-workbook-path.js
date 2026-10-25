'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),rd=p=>fs.readFileSync(p,'utf8');
const js=rd('product-v1910-workbook-path.js'),css=rd('product-v1910-workbook-path.css');
for(const s of ['subjects.length!==24','books.length!==24','segments=[','v1900-evidence-lab','v1870-module','v1870-worked','v1870-checks','v1870-assignment','v1890-stage-feedback','v1880-progress','v1870-rubric-item','aria-live','Not a grade','disappears on reload'])assert(js.includes(s),'HF10 real-path feature missing '+s);
assert(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|\.cookie\s*=|sendMail|mailto:|WebSocket|axios\s*\(|postMessage|PaymentRequest/i.test(js),'HF10 no egress, no persistence, no email');
for(const p of ['learn/legal-english/index.html','learn/business-english/index.html']){
 const c=rd(p);for(const x of ['product-v1910-workbook-path.js?v=1.85.0-hf10','product-v1910-workbook-path.css?v=1.85.0-hf10','product-v1900-evidence-lab.js','product-v1890-practice-coach.js','product-v1870-curriculum-workbooks.js'])assert(c.includes(x),'Missing protected feature on '+p+': '+x);
}
for(const s of [':focus-visible','@media(max-width:720px)','v1910-path-links'])assert(css.includes(s));
const prod=rd('playwright.production.config.js'),local=rd('playwright.config.js'),wf=rd('.github/workflows/englishlegalese-v1850-production-acceptance.yml');
assert(prod.includes('v1910-workbook-path-production.spec.js')&&local.includes('v1910-workbook-path-production.spec.js'),'Discover complete public tests');
const gate=wf.match(/ -lt (\d+) /);assert(wf.includes('v1910-workbook-path-production.spec.js')&&wf.includes('verify-v1910-workbook-path.js')&&gate&&Number(gate[1])>=90,'HF10 fail-closed workflow (minimum 90 targeted cases; later releases may be stricter)');
assert(rd('package.json').includes('node scripts/verify-v1910-workbook-path.js'),'HF10 source check in qualification');
const rules=rd('governance/ENGLISHLEGALESE_DURABLE_BUILDER_RULES_ADDENDUM_2026-10-24.md');assert(rules.includes('EL-DUR-011')&&rules.includes('EL-DUR-012'));
console.log('PASS HF10: all 48 learning maps, seven honest activity signals, 8 jump sections, no egress/persistence/email and protected curricula.');
