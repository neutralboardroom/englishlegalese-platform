'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('product-v2090-print-packs.js','utf8');
const css=fs.readFileSync('hf47-print-packs.css','utf8');
const pages=['learn/continuing-practice/index.html','learn/continuing-practice/advanced/index.html'].map(x=>fs.readFileSync(x,'utf8'));
for(const p of pages){assert.equal((p.match(/<article class="v1971-lesson"/g)||[]).length,12);
 for(const name of ['product-v2060-differentiated-speaking','product-v2070-teacher-questions','product-v2080-clarification-lab','product-v2090-print-packs.js?v=hf47','hf47-print-packs.css?v=hf47'])assert.ok(p.includes(name),name);}
for(const must of ['Preview student worksheet','Preview teacher notes','dialog.showModal','document.body.append(dialog)','window.print()','dialog.remove()','fixedTexts','Instructor-only answer key'])assert.ok(js.includes(must),must);
for(const bad of ["querySelector('textarea')",'input.value','localStorage','sessionStorage','fetch(','getUserMedia','innerHTML','sendBeacon'])assert.ok(!js.includes(bad),'printed content cannot use private input: '+bad);
assert.ok(css.includes('body>*:not(dialog.v2090-preview)'));
assert.ok(css.includes('@media print'));
assert.ok(!fs.readFileSync('index.html','utf8').includes('hf47-print-packs'));
console.log('PASS HF47: student and teacher printable packets omit private text, isolate print-only rendering, no submission or accounts.');
