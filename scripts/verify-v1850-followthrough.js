'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8');
function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(d+'/'+x.name):x.name==='index.html'?[d+'/'+x.name]:[])}
const files=['index.html','pricing/index.html',...walk('learn')];
for(const file of files){
 const s=read(file),start=file==='index.html'?s.indexOf('<nav id="mainNav"'):s.indexOf('<nav class="v1840-topnav"'),end=s.indexOf('</nav>',start);
 assert(start>=0&&end>start,file+' top navigation missing');
 const nav=s.slice(start,end);
 const a=nav.indexOf('href="/learn/legal-english/"'),b=nav.indexOf('href="/learn/business-english/"');
 assert(a>=0&&b>a,file+' must show Legal before Business');
 assert(/>Legal English<\/a>\s*<a href="\/learn\/business-english\/"/.test(nav),file+' nav not adjacent');
 assert(s.slice(s.indexOf('<footer')).includes('href="/learn/legal-english/"'),file+' missing footer link');
}
for(const [file,id] of [['learn/legal-english/index.html','v1850-legal-16-week'],['learn/business-english/index.html','v1850-business-16-week']]){
 const s=read(file),start=s.indexOf('id="'+id+'"');assert(start>0,file+' syllabus');
 const section=s.slice(start,s.indexOf('</section>',start));
 assert.equal((section.match(/data-week="\d+"/g)||[]).length,16,file+' 16 lessons');
 for(const word of ['Learning objective:','Vocabulary and definitions','Interactive practice','Homework','Teacher materials and assessment'])assert(section.includes(word),file+' '+word);
}
console.log('PASS: '+files.length+' pages with adjacent Legal/Business navigation and 16 lessons per program.');
