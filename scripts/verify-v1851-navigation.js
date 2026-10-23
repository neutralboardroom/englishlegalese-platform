'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const rd=p=>fs.readFileSync(p,'utf8');
const pkg=JSON.parse(rd('package.json')),home=rd('index.html');
assert.equal(pkg.version,'1.85.1');assert(home.includes('name="englishlegalese-release" content="1.85.1"'));
const hasPair=x=>/<a href="\/learn\/legal-english\/">Legal English<\/a>\s*<a href="\/learn\/business-english\/"/.test(x);
function inspect(p){const s=rd(p);const he=p==='index.html'?s.slice(s.indexOf('<nav id="mainNav"'),s.indexOf('</nav>',s.indexOf('<nav id="mainNav"'))+6):s.slice(s.indexOf('<header'),s.indexOf('</header>')+9);const foot=s.slice(s.indexOf('<footer'),s.lastIndexOf('</footer>')+9);assert(hasPair(he),'header must place Legal English directly before Business English: '+p);assert(hasPair(foot),'footer must retain both language tracks in order: '+p);return s;}
inspect('index.html');let count=1;
const walk=root=>{for(const item of fs.readdirSync(root,{withFileTypes:true})){const p=root+'/'+item.name;if(item.isDirectory())walk(p);else if(item.name==='index.html'){inspect(p);count++}}};walk('learn');inspect('pricing/index.html');count++;
assert(count>=44,'Every former destination plus two additional pages remains present');
const legal=rd('learn/legal-english/index.html'),programs=rd('learn/classroom-programs/index.html');
assert(legal.includes('28 class-topic catalog')&&legal.includes('24 Legal English specialty')&&legal.includes('/learn/enroll/'));
for(const x of ['id="v1851-legal-sessions"','id="v1851-business-sessions"','product-v1851-classroom.js'])assert(programs.includes(x),x);
const js=rd('product-v1851-classroom.js');const from=js.indexOf('const DATA=')+11,to=js.indexOf(';const mk=',from);assert(from>10&&to>from,'Structured session data');const data=JSON.parse(js.slice(from,to));for(const kind of ['legal','business']){const a=data[kind];assert.equal(a.length,16);for(const entry of a){assert.equal(entry.length,7);for(const t of entry)assert(t.length>=26||t===entry[0],kind+' substantive instructional material');assert.equal(entry[2].split(';').length,4);assert(entry[2].split(';').every(x=>x.includes('=')));}}
assert(!/fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|getUserMedia|PaymentRequest/.test(js));
for(const p of ['learn/enroll/index.html','learn/teach-with-us/index.html','learn/teachers/index.html','learn/business-english/index.html','learn/courses/index.html','pricing/index.html'])assert(rd(p).includes('/learn/classroom-programs/'),p+' classroom detail link');
assert(rd('curriculum-v1800-data.js').includes('ELCURRICULUM_V1800'));
const reg=rd('governance/ENGLISHLEGALESE_CANONICAL_RULE_REGISTER__v1.57.0.md');for(let i=1;i<=19;i++)assert(reg.includes('EL-RGR-'+String(i).padStart(3,'0')));for(let i=1;i<=10;i++)assert(reg.includes('EL-DUR-'+String(i).padStart(3,'0')));const add=rd('governance/ENGLISHLEGALESE_OWNER_DIRECTIVES_ADDENDUM_2026-10-22.md');for(const id of ['EL-RGR-020','EL-RGR-021','EL-RGR-022'])assert(add.includes(id));
const intake=rd('src/v1850-public-intake.js');assert(intake.includes('stripe_enabled:false')&&intake.includes('sourceValid(req)')&&intake.includes('rate(req)'));
console.log('PASS v1.85.1: '+count+' pages retain Legal English before Business English, 32 substantive session guides, 128 defined terms, interactive teacher practice and protected owner rules.');
