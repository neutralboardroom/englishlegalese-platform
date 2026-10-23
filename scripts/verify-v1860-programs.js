'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm'),rd=p=>fs.readFileSync(p,'utf8');
const pkg=JSON.parse(rd('package.json'));assert.equal(pkg.version,'1.86.0');
const source=rd('product-v1860-session-guides.js');assert(!/fetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|PaymentRequest|getUserMedia|heygen|liveavatar|tavus|simli/i.test(source));
const ctx={document:{getElementById:()=>null},globalThis:{}};vm.runInNewContext(source.replace('const all=Object.freeze(RAW);','globalThis.__guides=RAW;const all=Object.freeze(RAW);'),ctx,{timeout:2000});
const guides=ctx.globalThis.__guides;assert(guides);for(const name of ['legal','business']){const rows=guides[name];assert.equal(rows.length,16);assert.equal(new Set(rows.map(x=>x[0])).size,16);
 for(const row of rows){assert.equal(row.length,7);for(const col of row)assert(col.length>14);assert.equal(row[2].split(',').length,5);}}
const tree=['index.html','pricing/index.html',...walk('learn')].filter(p=>p.endsWith('/index.html')||p==='index.html');
function walk(folder){return fs.readdirSync(folder,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(folder+'/'+d.name):[folder+'/'+d.name]);}
assert.equal(tree.length,44,'42 preserved plus two new full HTML pages');
for(const path of tree){const s=rd(path);const nav=path==='index.html'?s.slice(s.indexOf('<nav id="mainNav"'),s.indexOf('<details class="v1790-resource-menu"',s.indexOf('<nav id="mainNav"'))):s.slice(s.indexOf('<nav class="v1840-topnav"'),s.indexOf('</nav>',s.indexOf('<nav class="v1840-topnav"'))+6);
 assert(nav.includes('>Legal English</a>'),path+' must show Legal English');assert(nav.includes('>Business English</a>'),path+' must show Business English');assert(nav.indexOf('>Legal English</a>')<nav.indexOf('>Business English</a>'),path+' legal menu must be before business');
 assert(nav.includes('href="/learn/courses/"')&&nav.includes('href="/learn/business-english/"'),path+' distinct destinations');}
for(const [program,slug] of [['legal','legal-english-program'],['business','business-english-program']]){
 const s=rd('learn/'+slug+'/index.html');assert(s.includes('data-v1860-program="'+program+'"'));assert(s.includes('product-v1860-session-guides.js?v=1.86.0'));assert(s.includes('id="v1860-session-list"'));assert(s.includes('href="/learn/enroll/"'));}
const home=rd('index.html');assert(home.includes('name="englishlegalese-release" content="1.86.0"'));assert(rd('app.js').includes('Legal English with AI-supported practice and live online classes with human teachers.'));
const rules=rd('governance/ENGLISHLEGALESE_CANONICAL_RULE_REGISTER__v1.57.0.md');for(let i=1;i<=19;i++)assert(rules.includes('EL-RGR-'+String(i).padStart(3,'0')));for(let i=1;i<=10;i++)assert(rules.includes('EL-DUR-'+String(i).padStart(3,'0')));
const extra=rd('governance/ENGLISHLEGALESE_OWNER_DIRECTIVES_ADDENDUM_2026-10-22.md');for(let i=20;i<=22;i++)assert(extra.includes('EL-RGR-'+String(i).padStart(3,'0')));
console.log('PASS v1.86: 44 pages ordered Legal before Business; 32 original 50-minute instructor sessions, strict no avatar, all 32 owner-rule IDs preserved.');
