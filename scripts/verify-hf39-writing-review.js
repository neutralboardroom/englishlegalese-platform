'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('product-v2010-writing-review.js','utf8');
const css=fs.readFileSync('hf39-writing-review.css','utf8');
const pages=['learn/continuing-practice/index.html','learn/continuing-practice/advanced/index.html'].map(p=>fs.readFileSync(p,'utf8'));
const titles=pages.flatMap(s=>[...s.matchAll(/<h3>([^<]*)<\/h3>/g)].map(m=>m[1].replace(/&amp;/g,'&')));
assert.equal(new Set(titles).size,24,'24 unique lesson titles');
const block=js.match(/const guidance=(\[[\s\S]*?\]);\n const map=/);
assert.ok(block,'structured review guidance present');
const records=JSON.parse(block[1]);
assert.equal(records.length,24,'exactly 24 distinct review guides');
assert.deepEqual(new Set(records.map(r=>r[0])),new Set(titles),'every real lesson has individual guidance');
for(const record of records){
 assert.equal(record.length,5,'exact lesson title, three review prompts, and challenge');
 for(const value of record)assert.ok(typeof value==='string'&&value.length>30,'guidance is substantive');
}
for(const page of pages){
 assert.equal((page.match(/<article class="v1971-lesson"/g)||[]).length,12,'12 original lessons remain per page');
 assert.equal((page.match(/<textarea\b/g)||[]).length,12,'writing areas preserved');
 assert.equal((page.match(/data-v1980-check /g)||[]).length,12,'original knowledge checks preserved');
 assert.ok(page.includes('/product-v1990-speaking-rehearsal.js?v=hf37'),'original speaking rehearsal preserved');
 assert.ok(page.includes('/product-v2000-private-drafts.js?v=hf38'),'original file export/restore preserved');
 assert.ok(page.includes('/product-v2010-writing-review.js?v=hf39'),'new revision guide loaded');
 assert.ok(page.includes('/hf39-writing-review.css?v=hf39'),'only scoped styles added');
}
for(const prohibited of ['fetch(','XMLHttpRequest','sendBeacon','localStorage','sessionStorage','innerHTML','MediaRecorder','getUserMedia','navigator.clipboard'])
 assert.ok(!js.includes(prohibited),'no network, storage, microphone or markup injection: '+prohibited);
for(const needed of ['aria-live','details','summary','fieldset','input','draft.addEventListener(\'input\'','draftTools.after','checked=false'])
 assert.ok(js.includes(needed),'review interaction: '+needed);
assert.ok(css.includes('.v2010-review'),'styles scoped');
assert.ok(!fs.readFileSync('index.html','utf8').includes('hf39-writing'),'approved hero/homepage untouched');
console.log('PASS HF39: 24 custom self-review guides, live word and character count, ephemeral checkboxes, zero draft upload/storage, full original lesson preservation.');
