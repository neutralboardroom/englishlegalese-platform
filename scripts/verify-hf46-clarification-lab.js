'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('product-v2080-clarification-lab.js','utf8');
const records=JSON.parse(js.match(/const records=(\[[\s\S]*?\]);\n const map=/)[1]);
const pages=['learn/continuing-practice/index.html','learn/continuing-practice/advanced/index.html'].map(x=>fs.readFileSync(x,'utf8'));
const titles=pages.flatMap(s=>[...s.matchAll(/<h3>(.*?)<\/h3>/g)].map(m=>m[1].replace(/&amp;/g,'&')));
assert.equal(records.length,24);assert.deepEqual(new Set(records.map(x=>x[0])),new Set(titles));
for(const r of records){assert.equal(r.length,5);assert.ok(r[1].length>=30,'realistic brief ambiguous utterance');for(const phrase of r.slice(2))assert.ok(phrase.length>=35,'substantive explanation and clarification');}
for(const p of pages){assert.equal((p.match(/<article class="v1971-lesson"/g)||[]).length,12);
 for(const n of ['product-v2060-differentiated-speaking','product-v2070-teacher-questions','product-v2080-clarification-lab.js?v=hf46','hf46-clarification-lab.css?v=hf46'])assert.ok(p.includes(n),n);}
for(const b of ['fetch(','localStorage','sessionStorage','getUserMedia','SpeechRecognition','innerHTML','sendBeacon'])assert.ok(!js.includes(b),b);
console.log('PASS HF46: 24 information-gap clarification activities with private model answers; no data use.');
