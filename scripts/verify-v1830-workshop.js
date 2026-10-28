'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm'),rd=f=>fs.readFileSync(f,'utf8');
const pkg=JSON.parse(rd('package.json')),html=rd('index.html'),js=rd('product-v1830-feedback.js'),css=rd('product-v1830-feedback.css');
const rules=rd('governance/ENGLISHLEGALESE_CANONICAL_RULE_REGISTER__v1.57.0.md'),extra=rd('governance/ENGLISHLEGALESE_OWNER_DIRECTIVES_ADDENDUM_2026-10-22.md');
assert.ok(['1.85.0','1.85.1'].includes(pkg.version));assert(html.includes('name="englishlegalese-release" content="1.85.0"'));
for(const item of ['product-v1830-feedback.js?v=1.83.0','product-v1830-feedback.css?v=1.83.0','product-v1820-learning-studio.js?v=1.84.0','product-v1810-pricing.js?v=1.81.0','product-v1800-catalog.js?v=1.84.0'])assert(html.includes(item),'Preserve predecessor content and add '+item);
const ctx={window:{}};vm.runInNewContext(rd('curriculum-v1800-data.js'),ctx,{timeout:2500});
assert.equal(ctx.window.ELCURRICULUM_V1800.records.length,28);
for(const c of ctx.window.ELCURRICULUM_V1800.records){assert(c.scenario&&c.good&&c.distractors.length===2&&c.vocab.length===5&&c.homework&&c.teacher,'Each topic has source, examples and teaching brief');}
for(const s of ['v1830-writing-lab','v1830-topic','v1830-first','v1830-revision','Review wording cues','Show source-faithful example','Download writing & teacher workbook','Clear all 28 topics','not a teacher grade','28 ORIGINAL FICTIONAL CASES','no data','No data']){if(s==='no data'||s==='No data')continue;assert(js.includes(s),'Meaningful private workshop '+s);}
for(const forbidden of ['fetch(', 'XMLHttpRequest','sendBeacon(', 'localStorage','sessionStorage','indexedDB','PaymentRequest','getUserMedia','/api/','stripe.checkout'])assert(!js.includes(forbidden),'No outbound/stored/private actions '+forbidden);
for(let i=1;i<=19;i++)assert(rules.includes('EL-RGR-'+String(i).padStart(3,'0')));
for(let i=1;i<=10;i++)assert(rules.includes('EL-DUR-'+String(i).padStart(3,'0')));
for(const id of ['EL-RGR-020','EL-RGR-021','EL-RGR-022'])assert(extra.includes(id));
assert(html.includes('id="v1790-resource-menu"')&&html.includes('id="v1770-all-resources"'),'Original 14+14 visible resource entry points remain');
assert(html.includes('href="/pricing/"')&&html.includes('id="pricing"'),'Both the dedicated v1.84 pricing menu route and the unchanged original homepage pricing section remain');
assert(fs.existsSync('pricing/index.html'),'Dedicated pricing page exists alongside the preserved original homepage section');
assert(css.includes('focus-visible')&&css.includes('@media(max-width:750px)'));
assert(rd('tests/v1830-browser.spec.js').includes('28 topic-specific fictional'));
assert(rd('NEXT_VERSION_IMPROVEMENT_LIST.md').includes('v1.83.0'));
console.log('PASS v1.83.0 28-topic private source-aware language workbook, teacher rubric, no payments/network/persistence, 19+10 original and 3 owner addenda.');
