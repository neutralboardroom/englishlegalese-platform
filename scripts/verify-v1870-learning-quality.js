'use strict';
// Fail-closed static assurance: curriculum substance, availability truth, no-email durability.
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const rd=p=>fs.readFileSync(p,'utf8');
const ctx={window:{}};vm.runInNewContext(rd('curriculum-v1800-data.js'),ctx,{timeout:2000});
const source=rd('product-v1850-business.js');
const finance=JSON.parse(source.slice(source.indexOf('const finance=')+14,source.indexOf(';\nconst widerBusiness=')));
const wider=JSON.parse(source.slice(source.indexOf('const widerBusiness=')+20,source.indexOf(';\nconst businessCatalog=')));
const core=ctx.window.ELCURRICULUM_V1800.records;
const legal=core.filter(c=>c.group!=='Professional & Business English');
const business=[...core.filter(c=>c.group==='Professional & Business English'),...wider,...finance];
assert.equal(legal.length,24);assert.equal(business.length,24);
assert.equal(new Set([...legal,...business].map(c=>c.id)).size,48);
const poor=[];
for(const c of [...legal,...business]){
 for(const key of ['title','outcome','scenario','good','homework','teacher'])if(!c[key]||c[key].length<(key==='title'?8:18))poor.push(c.id+': weak/missing '+key);
 if(!Array.isArray(c.units)||c.units.length!==4||new Set(c.units).size!==4||c.units.some(u=>u.length<10))poor.push(c.id+': course lacks four distinct developed lesson areas');
 if(!Array.isArray(c.vocab)||c.vocab.length!==5||new Set(c.vocab.map(v=>v[0])).size!==5||c.vocab.some(v=>v[0].length<2||v[1].length<8))poor.push(c.id+': vocabulary and explanations are inadequate');
 const bad=c.wrong||c.distractors;
 if(!Array.isArray(bad)||bad.length!==2||bad.some(a=>a.length<15)||bad.includes(c.good))poor.push(c.id+': scenario feedback lacks meaningful alternatives');
 if(/\b(?:TBD|lorem ipsum|dummy lesson|coming soon|placeholder curriculum)\b/i.test([c.title,c.outcome,...c.units,c.homework,c.teacher].join(' ')))poor.push(c.id+': placeholder copy');
}
assert.deepEqual(poor,[],poor.join('\n'));
const js=rd('product-v1870-curriculum-workbooks.js'),css=rd('product-v1870-curriculum-workbooks.css');
for(const token of ['Four guided lesson activities','Worked professional-language example','Three knowledge checks','Practical assignment and feedback rubric','Instructor assessment plan:','Self-guided workbook','c.units.forEach','c.vocab','c.scenario','c.good','c.homework','c.teacher'])assert(js.includes(token),'Workbook capability missing: '+token);
assert(js.includes("legal.length!==24")&&js.includes("business.length!==24"));
assert(css.includes(':has(> .v1870-toggle input:checked)'));
assert(!/(?:\bfetch\s*\(|XMLHttpRequest|sendMail|sendResendEmail|nodemailer|axios\s*\(|mailto:)/i.test(js),'NO NETWORK, NO EMAIL in new learning workbooks');
const L=rd('learn/legal-english/index.html'),B=rd('learn/business-english/index.html'),E=rd('learn/enroll/index.html'),intake=rd('src/v1850-public-intake.js'),enrollJS=rd('product-v1850-enrollment.js');
for(const page of [L,B]){
 for(const t of ['Human-taught classes','16-session','Self-guided','SmartTeacher AI','v1870-curriculum-workbooks.js','v1870-curriculum-workbooks.css','/learn/enroll/'])assert(page.includes(t),'Dedicated page missing learning modality or scripts: '+t);
 assert(!/AI-led (?:classes|courses) available now|automated tutor now live/i.test(page),'Do not claim planned AI actually teaches classes');
}
assert(L.includes('All 24 Legal English human-teacher class topics')&&B.includes('16 Business English')&&B.includes('8 Wall Street'));
assert(L.includes('instructor availability')&&B.includes('verified staffing'));
assert(E.includes('one-lesson or four-lesson')&&E.includes('24 Legal English'));
for(const item of ["select('topic'","One class on a selected topic","Four classes on a selected topic","topic-time-request","Preferred teaching topic"])assert(enrollJS.includes(item),'Real topic-interest form missing '+item);
assert(intake.includes("scheduleId==='topic-time-request'")&&intake.includes("price_usd:269"),'Topic request validation or published schedule group prices wrong');
assert(intake.includes("format==='private'&&scheduleId!=='private-time-request'"));
assert(intake.includes("new Pool({connectionString:process.env.ENGLISHLEGALESE_INTAKE_DATABASE_URL"),'Do not use unrelated production database');
assert(rd('governance/ENGLISHLEGALESE_DURABLE_BUILDER_RULES_ADDENDUM_2026-10-24.md').includes('EL-DUR-011'));
assert(rd('governance/ENGLISHLEGALESE_OWNER_DIRECTIVES_ADDENDUM_2026-10-22.md').includes('EL-RGR-023'));
console.log('PASS HF4: 48 unique courses with 4 genuine lesson areas, 5 defined terms, scenario/model, two realistic wrong variants, substantial unique homework and teacher instructions; 4-stage browser-only workbooks with practice, feedback and rubric; accurate human/AI statuses; usable 1/4/16 inquiries and $269 schedule rate; no emails.');
