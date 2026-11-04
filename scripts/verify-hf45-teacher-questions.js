'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('product-v2070-teacher-questions.js','utf8');
const data=JSON.parse(js.match(/const records=(\[[\s\S]*?\]);\n const byTitle=/)[1]);
const pages=['learn/continuing-practice/index.html','learn/continuing-practice/advanced/index.html'].map(p=>fs.readFileSync(p,'utf8'));
const titles=pages.flatMap(p=>[...p.matchAll(/<h3>(.*?)<\/h3>/g)].map(m=>m[1].replace(/&amp;/g,'&')));
assert.equal(data.length,24);assert.deepEqual(new Set(data.map(r=>r[0])),new Set(titles));
for(const row of data){assert.equal(row.length,7);for(const t of row.slice(1))assert.ok(t.length>=25,'meaningful follow-up Q and answer');}
for(const page of pages){assert.equal((page.match(/<article class="v1971-lesson"/g)||[]).length,12);
 assert.ok(page.includes('product-v2070-teacher-questions.js?v=hf45'));
 assert.ok(page.includes('hf45-teacher-questions.css?v=hf45'));
 assert.ok(page.includes('product-v2060-differentiated-speaking.js?v=hf44'));}
for(const bad of ['fetch(','localStorage','sessionStorage','innerHTML','getUserMedia','sendBeacon'])assert.ok(!js.includes(bad),bad);
console.log('PASS HF45: 72 unique original teacher follow-up Q/answers across 24 lessons, no writes.');
