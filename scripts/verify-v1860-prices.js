'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),rd=p=>fs.readFileSync(p,'utf8');
const expected={one:[24,45],four:[79,169],eight:[149,319],extended:[249,599],full24:[349,849],full48:[649,1599]};
const pages=['index.html','pricing/index.html','learn/legal-english/index.html','learn/business-english/index.html','learn/enroll/index.html','learn/classroom-programs/index.html','learn/courses/index.html','learn/employers/index.html','learn/complete-programs/index.html'];
const content=Object.fromEntries(pages.map(p=>[p,rd(p)]));
const f=rd('product-v1850-enrollment.js'),backend=rd('src/v1850-public-intake.js'),guide=rd('product-v1850-session-guides.js');
for(const [id,[group,priv]] of Object.entries(expected)){assert(f.includes(id+':{group:'+group+',private:'+priv+'}'),'Missing quote values: '+id);}
const check=(path,values)=>{for(const x of values)assert(content[path].includes(x),path+' missing price or offer '+x)};
check('index.html',['$24','$79','$45','$169','$149','$249','$319','$599']);
check('pricing/index.html',['$24','$79','$45','$169','$149','$319','$249','$599','$349','$849','$649','$1,599','5%','10%','15%']);
check('learn/legal-english/index.html',['$149','$319','$249','$599','$349','$849','$649','$1,599']);
check('learn/business-english/index.html',['$149','$319','$249','$599','$349','$849','$649','$1,599']);
check('learn/complete-programs/index.html',['24 Legal','24 Business','48','849','1,599']);
check('learn/enroll/index.html',['$24','$79','$45','$169','$249','$599','employer']);
check('learn/classroom-programs/index.html',['$149','$319','$249','$599','v1850-legal-eight','v1850-business-eight']);
check('learn/employers/index.html',['3–5','6–10','11+','5%','10%','15%']);
assert(backend.includes('price_usd:249')&&!backend.includes('price_usd:269'));
assert(backend.includes("'complete'")&&backend.includes('packageInquiry')&&backend.includes('employer_seats='));
assert(guide.includes("PLANS.legal.slice(0,8)")&&guide.includes("PLANS.business.slice(0,8)"));
assert(content['pricing/index.html'].includes('saves $135')&&content['pricing/index.html'].includes('saves $121')&&!content['pricing/index.html'].includes('saves $85'));
assert(content['pricing/index.html'].includes('$384')&&content['pricing/index.html'].includes('$720'));
const singleOrder=[1,4,8,16,24,48].map(n=>n===1?'one':n===4?'four':n===8?'eight':n===16?'extended':n===24?'full24':'full48');
for(const index of [0,1]){const rate=singleOrder.map((k,i)=>expected[k][index]/[1,4,8,16,24,48][i]);for(let i=1;i<rate.length;i++)assert(rate[i]<rate[i-1],'Longer learning packages must cost less per class');}
const noMail=rd('governance/ENGLISHLEGALESE_DURABLE_BUILDER_RULES_ADDENDUM_2026-10-24.md')+rd('governance/ENGLISHLEGALESE_OWNER_DIRECTIVES_ADDENDUM_2026-10-22.md');
assert(noMail.includes('EL-DUR-011')&&noMail.includes('EL-RGR-023'));
assert(!/(sendMail|nodemailer|sendgrid|resend\.emails|fetch\s*\(|XMLHttpRequest)/i.test(rd('product-v1850-complete-programs.js')),'The complete program renderer may never send user information');
for(const x of ['$12/month','$19/month','$29/month'])assert(content['pricing/index.html'].includes(x),'AI subscription pricing must remain untouched');
console.log('PASS HF6: 6 monotonic per-lesson price tiers, original 48 learning topics, employer groups, independent 8-session plans, verified no-email safeguard');