'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('product-v2020-paired-dialogues.js','utf8');
const rows=JSON.parse(js.match(/const dialogues=(\[[\s\S]*?\]);\n const byTitle=/)[1]);
const pages=['learn/continuing-practice/index.html','learn/continuing-practice/advanced/index.html'].map(x=>fs.readFileSync(x,'utf8'));
const titles=pages.flatMap(p=>[...p.matchAll(/<h3>([^<]+)<\/h3>/g)].map(m=>m[1].replace(/&amp;/g,'&')));
assert.equal(rows.length,24);assert.equal(new Set(rows.map(x=>x[0])).size,24);
assert.deepEqual(new Set(rows.map(x=>x[0])),new Set(titles));
for(const row of rows){assert.equal(row.length,5);for(const sentence of row.slice(1))assert.ok(sentence.length>=25,'substantive original dialog');}
for(const html of pages){assert.equal((html.match(/<article class="v1971-lesson"/g)||[]).length,12);
assert.ok(html.includes('product-v2020-paired-dialogues.js?v=hf40'));
assert.ok(html.includes('hf40-paired-dialogues.css?v=hf40'));
for(const previous of ['product-v1990-speaking-rehearsal','product-v2000-private-drafts','product-v2010-writing-review'])assert.ok(html.includes(previous));}
for(const bad of ['fetch(','localStorage','sessionStorage','innerHTML','getUserMedia','SpeechRecognition','submit('])assert.ok(!js.includes(bad),'privacy: '+bad);
assert.ok(!fs.readFileSync('index.html','utf8').includes('hf40-paired'));
console.log('PASS HF40: 24 unique paired dialogues and no changes to original curriculum, homepage, privacy or stored work.');
