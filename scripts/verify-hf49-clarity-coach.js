'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('product-v2110-clarity-coach.js','utf8');
const records=JSON.parse(js.match(/const records=(\[[\s\S]*?\]);\n const byTitle=/)[1]);
const paths=['learn/continuing-practice/index.html','learn/continuing-practice/advanced/index.html'];
const pages=paths.map(path=>fs.readFileSync(path,'utf8'));
const titles=pages.flatMap(html=>[...html.matchAll(/<h3>(.*?)<\/h3>/g)].map(x=>x[1].replace(/&amp;/g,'&')));
assert.equal(records.length,24);assert.deepEqual(new Set(records.map(x=>x[0])),new Set(titles));
for(const row of records){assert.equal(row.length,6);
 assert.ok(row[1].length>35&&row[2].length>35&&row[4].length>25&&row[5].length>35);
 assert.ok(row[1].toLowerCase().includes(row[3].toLowerCase()));
 assert.ok(row[2].toLowerCase().includes(row[3].toLowerCase()));
 assert.equal(row[2].split(' / ').length,3,'three distinct thought groups per scenario');
}
for(const html of pages){assert.equal((html.match(/<article class="v1971-lesson"/g)||[]).length,12);
 assert.ok(html.includes('product-v2110-clarity-coach.js?v=hf49'));
 assert.ok(html.includes('hf49-clarity-coach.css?v=hf49'));
 for(const earlier of ['product-v2010-writing-review','product-v2020-paired-dialogues','product-v2030-listen-repeat','product-v2040-teacher-session','product-v2050-lesson-finder','product-v2060-differentiated-speaking','product-v2070-teacher-questions','product-v2080-clarification-lab','product-v2090-print-packs','product-v2100-four-week-path'])assert.ok(html.includes(earlier),earlier);
}
assert.ok(js.includes("card.querySelector('details.v2100-more-tools')"),'HF48 closed nesting preserves long-page tablet screenshot');
for(const bad of ['fetch(','localStorage','sessionStorage','sendBeacon','innerHTML','getUserMedia','MediaRecorder','SpeechRecognition','textarea.value',"setAttribute('role','status')"])assert.ok(!js.includes(bad),'data safety: '+bad);
for(const expected of ['SpeechSynthesisUtterance','voice.lang','aria-live','Next thought group','Start groups again','Partner question: ','Reset my private checklist','toggle','pagehide','visibilitychange'])assert.ok(js.includes(expected),expected);
assert.ok(!fs.readFileSync('index.html','utf8').includes('hf49-clarity-coach'));
console.log('PASS HF49: 24 original three-chunk clarity drills, partner meaning checks, optional speech with transcript, no data handling or long-page visible drift.');
