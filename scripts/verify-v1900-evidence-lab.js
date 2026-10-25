'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const rd=p=>fs.readFileSync(p,'utf8');
const js=rd('product-v1900-evidence-lab.js'),css=rd('product-v1900-evidence-lab.css');
const m=js.match(/const notes=(\[[\s\S]*?\]);\s*const lookup=/);assert(m,'Course data list missing');
const notes=vm.runInNewContext(m[1],{}, {timeout:3000});
assert.equal(notes.length,48);assert.equal(new Set(notes.map(x=>x[0])).size,48);
for(const r of notes){assert.equal(r.length,4);for(let i=1;i<4;i++)assert(r[i].length>=27,'Weak case note: '+r[0]);}
const ctx={window:{}};vm.runInNewContext(rd('curriculum-v1800-data.js'),ctx,{timeout:3000});
const core=ctx.window.ELCURRICULUM_V1800.records;
const business=rd('product-v1850-business.js');
const more=JSON.parse(business.slice(business.indexOf('const widerBusiness=')+20,business.indexOf(';\nconst businessCatalog=')));
const finance=JSON.parse(business.slice(business.indexOf('const finance=')+14,business.indexOf(';\nconst widerBusiness=')));
assert.deepEqual(new Set(notes.map(x=>x[0])),new Set([...core,...more,...finance].map(x=>x.id)),'Exact 48-course coverage');
for(const path of ['learn/legal-english/index.html','learn/business-english/index.html']){
 const page=rd(path);
 for(const name of ['product-v1900-evidence-lab.js?v=1.85.0-hf9','product-v1900-evidence-lab.css?v=1.85.0-hf9','product-v1890-practice-coach.js','product-v1870-curriculum-workbooks.js'])assert(page.includes(name),'Missing protected page asset: '+name);
}
for(const text of ['aria-live','v1900-evidence-lab','v1900-feedback','v1900-draft','c.good','c.id','c.title','v1870-module-list'])assert(js.includes(text),'Missing component: '+text);
assert(css.includes(':focus-visible')&&css.includes('@media(max-width:600px)'),'Missing focus and mobile styles');
assert(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|\.cookie\s*=|sendMail|mailto:|WebSocket|axios\s*\(|postMessage|PaymentRequest/i.test(js),'Transmit/persist prohibited');
const workflow=rd('.github/workflows/englishlegalese-v1850-production-acceptance.yml');
assert(workflow.includes('verify-v1900-evidence-lab.js')&&workflow.includes('v1900-evidence-lab-production.spec.js'));
assert(rd('playwright.config.js').includes('v1900-evidence-lab-production.spec.js'));
assert(rd('playwright.production.config.js').includes('v1900-evidence-lab-production.spec.js'));
assert(rd('package.json').includes('node scripts/verify-v1900-evidence-lab.js'));
const rules=rd('governance/ENGLISHLEGALESE_DURABLE_BUILDER_RULES_ADDENDUM_2026-10-24.md');
assert(rules.includes('EL-DUR-011')&&rules.includes('EL-DUR-012'));
console.log('PASS HF9: 48 source-specific case labs, no external send or storage, original HF8/HF4 retained, public test collection.');
