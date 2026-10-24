'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const rd=p=>fs.readFileSync(p,'utf8');
const prices={groupOne:'$26',groupFour:'$85',groupSixteen:'$269',privateOne:'$49',privateFour:'$179',privateSixteen:'$699'};
const pricing=rd('pricing/index.html'),home=rd('index.html'),biz=rd('learn/business-english/index.html'),legal=rd('learn/legal-english/index.html'),enroll=rd('learn/enroll/index.html'),program=rd('learn/classroom-programs/index.html'),course=rd('learn/courses/index.html'),client=rd('product-v1850-enrollment.js');
for(const [name,s] of Object.entries({pricing,home}))for(const key of ['groupOne','groupFour','privateOne','privateFour'])assert(s.includes(prices[key]),name+' missing '+key);
for(const [name,s] of Object.entries({pricing,biz,legal,enroll,program,course,client}))for(const key of ['groupSixteen','privateSixteen'])assert(s.includes(prices[key]),name+' missing '+key);
assert(pricing.includes('saves $147')&&pricing.includes('saves $85'));
assert(pricing.includes('$416')&&pricing.includes('$784'));
for(const [path,s] of Object.entries({'pricing/index.html':pricing,'index.html':home,'learn/legal-english/index.html':legal,'learn/business-english/index.html':biz,'learn/enroll/index.html':enroll,'learn/classroom-programs/index.html':program,'learn/courses/index.html':course,'product-v1850-enrollment.js':client})){
 for(const old of ['$24','$79','$249','$289','$799']){
  const obsolete=s.split(old).slice(1).some(part=>!(part.length>0&&part.charCodeAt(0)>=48&&part.charCodeAt(0)<=57));
  assert(!obsolete,path+' has obsolete class price '+old);
 }
}
for(const tier of ['$12/month','$19/month','$29/month'])assert(pricing.includes(tier),'AI tier unchanged '+tier);
const rules=rd('governance/ENGLISHLEGALESE_DURABLE_BUILDER_RULES_ADDENDUM_2026-10-24.md');
const owner=rd('governance/ENGLISHLEGALESE_OWNER_DIRECTIVES_ADDENDUM_2026-10-22.md');
assert(rules.includes('EL-DUR-011')&&owner.includes('EL-RGR-023'));
const research=rd('docs/ENGLISHLEGALESE_HUMAN_TAUGHT_PRICING_RESEARCH_2026-10-24.md');
assert(research.includes('British Legal Centre')&&research.includes('Preply'));
console.log('PASS final owner-approved accessible introductory human-led prices; site parity, bundle math, preserved AI tiers and permanent never-send-email rules.');
