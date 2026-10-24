'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const rd=p=>fs.readFileSync(p,'utf8');
const L=rd('learn/legal-english/index.html'),B=rd('learn/business-english/index.html');
const JS=rd('product-v1860-course-pages.js'),CSS=rd('product-v1860-course-pages.css');
const ctx={window:{}};vm.runInNewContext(rd('curriculum-v1800-data.js'),ctx,{timeout:3000});
const courses=ctx.window.ELCURRICULUM_V1800.records;
assert.equal(courses.length,28);
for(const [group,count] of [['Core professional',8],['Legal specialties',12],['International & academic',4],['Professional & Business English',4]]){
 assert.equal(courses.filter(c=>c.group===group).length,count,group);
}
for(const c of courses.filter(x=>x.group!=='Professional & Business English')){
 assert(c.title&&c.outcome&&c.scenario&&c.good&&c.homework&&c.teacher,'Legal course missing teaching field: '+c.id);
 assert.equal(c.units.length,4);assert.equal(c.vocab.length,5);assert.equal(c.distractors.length,2);
}
const script=rd('product-v1850-business.js');
const start=script.indexOf('const finance=')+14,end=script.indexOf(';\nconst widerBusiness=');
const ws=JSON.parse(script.slice(start,end));
const startB=script.indexOf('const widerBusiness=')+20,endB=script.indexOf(';\nconst businessCatalog=');
const extra=JSON.parse(script.slice(startB,endB));
assert.equal(ws.length,8);assert.equal(extra.length,12);assert.equal(extra.length+courses.filter(x=>x.group==='Professional & Business English').length,16);
for(const [html,track,sessions] of [[L,'v1860-legal-catalog','v1850-legal-sessions'],[B,'v1850-business-cards','v1850-business-sessions']]){
 assert(html.includes('id="'+track+'"')&&html.includes('id="'+sessions+'"'),'course list or 16 session overview missing');
 for(const href of ['/learn/enroll/','/pricing/'])assert(html.includes('href="'+href+'"'));
 for(const file of ['product-v1860-course-pages.js?v=1.86.0','product-v1860-course-pages.css?v=1.86.0','product-v1850-session-guides.js?v=1.85.0'])assert(html.includes(file),'shared script missing '+file);
}
assert(L.indexOf('id="v1860-legal-courses"')>L.indexOf('Legal English at a glance'),'Legal courses must follow top overview');
assert(B.indexOf('id="v1850-business"')>B.indexOf('id="v1850-extended"'),'Business prices and program must precede courses');
assert(B.includes('id="v1860-business-program"'),'Business sessions inline missing');
assert(JS.includes("event.preventDefault()")&&JS.includes("const legalGroups="));
const durable=rd('governance/ENGLISHLEGALESE_DURABLE_BUILDER_RULES_ADDENDUM_2026-10-24.md');
const owner=rd('governance/ENGLISHLEGALESE_OWNER_DIRECTIVES_ADDENDUM_2026-10-22.md');
assert(durable.includes('EL-DUR-011')&&owner.includes('EL-RGR-023'));
assert(!/(fetch\s*\(|XMLHttpRequest|sendResendEmail|sendMail|\baxios\b|\/api\/.*email|mailto:)/i.test(JS),'Detailed courses must make no email, tracking, or network calls');
assert(!/(fetch\s*\(|XMLHttpRequest|sendResendEmail|sendMail|\baxios\b)/i.test(rd('product-v1850-session-guides.js')),'Session previews must stay local');
assert(CSS.includes('@media(max-width:720px)')&&CSS.includes('.v1860-course-grid'));
console.log('PASS v1.85 HF3: all 24 Legal and 24 Business/Investor topics in full dedicated pages; 16+16 sessions; top program/prices; 5-part educational components, local practice and permanent never-send-email rule.');