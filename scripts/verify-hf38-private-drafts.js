'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');
const pages=['learn/continuing-practice/index.html','learn/continuing-practice/advanced/index.html'].map(read);
const js=read('product-v2000-private-drafts.js'),css=read('hf38-private-drafts.css');
assert.equal(pages.length,2);
for(const page of pages){
 assert.equal((page.match(/<article class="v1971-lesson"/g)||[]).length,12,'12 original lessons per page');
 assert.equal((page.match(/<textarea\b/g)||[]).length,12,'original drafts remain');
 assert.equal((page.match(/data-v1980-check /g)||[]).length,12,'original comprehension controls remain');
 assert.ok(page.includes('href="/hf38-private-drafts.css?v=hf38"'),'page includes scoped stylesheet');
 assert.ok(page.includes('src="/product-v2000-private-drafts.js?v=hf38"'),'page includes browser-only draft tools');
 assert.ok(page.includes('/product-v1990-speaking-rehearsal.js?v=hf37'),'speaking practice preserved');
}
assert.ok(!read('index.html').includes('hf38-private-drafts'),'approved homepage unchanged');
for(const prohibited of ['localStorage','sessionStorage','fetch(','XMLHttpRequest','sendBeacon','MediaRecorder','getUserMedia','innerHTML'])
 assert.ok(!js.includes(prohibited),'no tracking, data submission or unsafe HTML: '+prohibited);
for(const required of ['URL.createObjectURL','URL.revokeObjectURL','file.text()','startsWith(header)','textarea.maxLength','window.confirm','aria-live','textContent'])
 assert.ok(js.includes(required),'safe local restore and accessibility: '+required);
assert.ok(css.includes('.v2000-draft-tools'),'styles scoped to draft tools');
console.log('PASS HF38: 24 existing lessons preserved, optional private local text export/restore, no upload or auto-storage.');
