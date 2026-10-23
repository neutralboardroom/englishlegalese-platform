'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm'),rd=p=>fs.readFileSync(p,'utf8');
const pkg=JSON.parse(rd('package.json')),home=rd('index.html'),business=rd('learn/business-english/index.html'),pricing=rd('pricing/index.html'),teacher=rd('learn/teach-with-us/index.html'),script=rd('product-v1850-business.js');
assert.equal(pkg.version,'1.85.0');assert(home.includes('name="englishlegalese-release" content="1.85.0"'));
const ctx={window:{},document:{getElementById:()=>null}},curriculum=rd('curriculum-v1800-data.js');
vm.runInNewContext(curriculum,ctx,{timeout:2000});
const base=ctx.window.ELCURRICULUM_V1800.records;assert.equal(base.length,28);
assert.equal(base.filter(x=>x.group==='Professional & Business English').length,4);
const finance=JSON.parse(script.slice(script.indexOf('const finance=')+14,script.indexOf(';\nconst widerBusiness=')));
const wider=JSON.parse(script.slice(script.indexOf('const widerBusiness=')+20,script.indexOf(';\nconst businessCatalog=')));
assert.equal(finance.length,8);assert.equal(wider.length,12);
const all=[...base.filter(x=>x.group==='Professional & Business English'),...wider,...finance];
assert.equal(all.length,24);assert.equal(new Set(all.map(x=>x.title)).size,24);
for(const c of all){
 assert.equal(c.units.length,4,c.title+' 4 developed lessons');assert.equal(c.vocab.length,5,c.title+' 5 defined terms');
 for(const [term,definition] of c.vocab)assert(term.length>2&&definition.length>8,c.title+' defined vocabulary');
 for(const k of ['scenario','good','homework','teacher'])assert(typeof c[k]==='string'&&c[k].length>26,c.title+' learning content '+k);
 assert((c.wrong||c.distractors).length>=2,c.title+' scenario alternatives');
}
for(const page of ['pricing/index.html','learn/courses/index.html','learn/teachers/index.html','learn/business-english/index.html','learn/teach-with-us/index.html']){
 assert(fs.existsSync(page),page);
 assert(rd(page).includes('href="/learn/business-english/"'),page+' business navigation');
}
const rootHeader=home.slice(home.indexOf('<nav id="mainNav"'),home.indexOf('</nav>',home.indexOf('<nav id="mainNav"'))+6);
const rootFooter=home.slice(home.indexOf('<footer class="site-footer"'),home.indexOf('</footer>',home.indexOf('<footer class="site-footer"'))+9);
assert(rootHeader.includes('href="/learn/business-english/"'),'homepage header');
assert(rootFooter.includes('href="/learn/business-english/"'),'homepage footer');
assert(home.includes('Practical Legal English and Business English'),'discreet homepage mention');
assert(home.includes('<h1>Legal English with AI-supported practice and live online classes with human teachers.</h1>'),'protected original homepage hero');
assert(home.includes('href="#diagnostic">Start your free diagnostic'),'protected original homepage CTA');
for(const required of ['$249','$699','16','Legal English','Business English','separate'])assert(pricing.toLowerCase().includes(required.toLowerCase()),'proposed distinct extended plans '+required);
assert(business.includes('id="v1850-business-cards"')&&business.includes('id="v1850-investor-cards"'));
assert(!business.includes('Eight additional')&&!business.includes('Four complete Business English topics'),'no visibly new versus old labels');
assert(teacher.includes('No open position')&&!/type="(?:email|file)"|<form/i.test(teacher),'recruitment is not an active applicant intake');
for(const banned of ['fetch(', 'XMLHttpRequest','sendBeacon','localStorage','sessionStorage','indexedDB','PaymentRequest','getUserMedia'])assert(!script.includes(banned),'no data transfer/persistence');
const rules=rd('governance/ENGLISHLEGALESE_CANONICAL_RULE_REGISTER__v1.57.0.md');
for(let i=1;i<=19;i++)assert(rules.includes('EL-RGR-'+String(i).padStart(3,'0')));
for(let i=1;i<=10;i++)assert(rules.includes('EL-DUR-'+String(i).padStart(3,'0')));
const add=rd('governance/ENGLISHLEGALESE_OWNER_DIRECTIVES_ADDENDUM_2026-10-22.md');
for(const x of ['EL-RGR-020','EL-RGR-021','EL-RGR-022'])assert(add.includes(x));
const rootCss=rd('product-v1850-business.css');assert(rootCss.includes('@media(max-width:650px)'));
console.log('PASS v1.85: 24 uniform Business English curricula, independent Legal/Business extended plans, teacher recruitment gates, preserved 28 original topics, original homepage hero, and 19+10+3 owner rules.');
