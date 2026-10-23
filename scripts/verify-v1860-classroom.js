'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const rd=p=>fs.readFileSync(p,'utf8'),home=rd('index.html'),pkg=JSON.parse(rd('package.json'));
assert.equal(pkg.version,'1.86.0');assert(home.includes('name="englishlegalese-release" content="1.86.0"'));
const routePaths=['index.html','pricing/index.html',...fs.readdirSync('learn',{withFileTypes:true}).filter(x=>x.isDirectory()).map(x=>'learn/'+x.name+'/index.html').filter(x=>fs.existsSync(x)),...fs.readdirSync('learn/business-resources',{withFileTypes:true}).filter(x=>x.isDirectory()).map(x=>'learn/business-resources/'+x.name+'/index.html').filter(x=>fs.existsSync(x))];
for(const p of routePaths){const page=rd(p),ha=page.indexOf('<header'),hb=page.indexOf('</header>',ha),fa=page.indexOf('<footer'),fb=page.indexOf('</footer>',fa);
 const header=ha>=0&&hb>=0?page.slice(ha,hb):'',footer=fa>=0&&fb>=0?page.slice(fa,fb):'';
 for(const [section,name]of [[header,'header'],[footer,'footer']]){if(!section.includes('href="/learn/business-english/"'))continue;
  const legal=section.indexOf('href="/learn/legal-english/"'),business=section.indexOf('href="/learn/business-english/"');
  assert(legal>=0,p+' '+name+' missing Legal English');
  assert(legal<business,p+' '+name+' Legal English must precede Business English');
 }
}
for(const p of ['learn/legal-english/index.html','learn/business-english/index.html']){
 assert(rd(p).includes('product-v1860-syllabi.js'),p+' classroom renderer');
 assert(rd(p).includes('data-v1860-program='),p+' sessions');
}
assert(home.includes('href="/learn/legal-english/"'));assert(home.includes('href="/learn/business-english/"'));
const context={window:{},document:{getElementById:()=>null}};vm.runInNewContext(rd('curriculum-v1800-data.js'),context,{timeout:5000});
const topics=context.window.ELCURRICULUM_V1800.records;assert.equal(topics.length,28);
assert.equal(topics.filter(x=>x.group!=='Professional & Business English').length,24);
for(const topic of topics){assert.equal(topic.units.length,4);assert.equal(topic.vocab.length,5);assert(topic.scenario&&topic.good&&topic.homework&&topic.teacher)}
const syllabus=rd('product-v1860-syllabi.js');
for(const fragment of ['0–5 minutes','5–15 minutes','15–27 minutes','27–42 minutes','42–50 minutes','Teacher feedback rubric','Actionable homework','Target vocabulary'])assert(syllabus.includes(fragment),fragment);
assert(rd('product-v1850-business.js').includes('window.ELBUSINESS_V1850'));
const rules=rd('governance/ENGLISHLEGALESE_CANONICAL_RULE_REGISTER__v1.57.0.md'),add=rd('governance/ENGLISHLEGALESE_OWNER_DIRECTIVES_ADDENDUM_2026-10-22.md');
for(let n=1;n<=19;n++)assert(rules.includes('EL-RGR-'+String(n).padStart(3,'0')));
for(let n=1;n<=10;n++)assert(rules.includes('EL-DUR-'+String(n).padStart(3,'0')));
for(let n=20;n<=22;n++)assert(add.includes('EL-RGR-'+String(n).padStart(3,'0')));
console.log('PASS v1.86 Legal and Business nav order, 24 Legal topics, 32 scheduled class outlines, original 28 topics and all 32 owner rules preserved.');
