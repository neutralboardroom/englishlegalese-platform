'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('product-v2060-differentiated-speaking.js','utf8');
const rows=JSON.parse(js.match(/const records=(\[[\s\S]*?\]);\n const map=/)[1]);
const paths=['learn/continuing-practice/index.html','learn/continuing-practice/advanced/index.html'];
const pages=paths.map(p=>fs.readFileSync(p,'utf8'));
const titles=pages.flatMap(x=>[...x.matchAll(/<h3>(.*?)<\/h3>/g)].map(m=>m[1].replace(/&amp;/g,'&')));
assert.equal(rows.length,24);
assert.deepEqual(new Set(rows.map(r=>r[0])),new Set(titles),'one unique differentiated task per lesson');
for(const row of rows){assert.equal(row.length,4);for(const p of row.slice(1))assert.ok(p.length>35);}
for(const p of pages){assert.equal((p.match(/<article class="v1971-lesson"/g)||[]).length,12);
 assert.ok(p.includes('product-v2060-differentiated-speaking.js?v=hf44'));
 assert.ok(p.includes('hf44-differentiated-speaking.css?v=hf44'));
 for(const prior of ['product-v2010-writing-review','product-v2020-paired-dialogues','product-v2030-listen-repeat','product-v2040-teacher-session','product-v2050-lesson-finder'])assert.ok(p.includes(prior));}
for(const bad of ['fetch(','localStorage','sessionStorage','sendBeacon','getUserMedia','innerHTML','role\',\'status'])assert.ok(!js.includes(bad));
assert.ok(!fs.readFileSync('index.html','utf8').includes('hf44-differentiated'));
console.log('PASS HF44: 24 original two-level speaking activities, existing 24 lessons untouched, no persistence or grading.');
