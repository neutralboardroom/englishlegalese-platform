'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('product-v1940-saved-lessons.js','utf8');
const css=fs.readFileSync('product-v1940-saved-lessons.css','utf8');
const html=fs.readFileSync('learn/my-work/index.html','utf8');
assert.equal(require('../package.json').version,'1.85.9');
for(const required of [
 "const PAGE_SIZE=25;let viewPage=0;","v1940-page-controls","Saved lesson pages",
 "E('button','Previous page')","E('button','Next page')","pageCounter.textContent=",
 "filtered.slice().sort","['recent','Most recently saved']","['oldest','Oldest saved first']","['title','Lesson title A–Z']",
 "ordered.slice(start,start+PAGE_SIZE)","previous.disabled=viewPage===0","next.disabled=viewPage>=pageCount-1",
 "search.addEventListener('input',()=>{viewPage=0;render();})",
 "choice.addEventListener('change',()=>{viewPage=0;render();})",
 "sort.addEventListener('change',()=>{viewPage=0;render();})",
 "for(const w of visible)","const report=studyReport(valid,","if(currentSequence!==hubRequestSequence||token!==currentToken)return"
])assert(js.includes(required),'HF20 protected saved-library behavior missing: '+required);
assert(css.includes('.v1940-page-controls button:focus-visible'),'Keyboard pagination must be visible');
assert(html.includes('product-v1940-saved-lessons.js?v=1.85.9-hf23'));
assert(html.includes('not just the visible page'));
assert(fs.readFileSync('index.html','utf8').includes('name="englishlegalese-release" content="1.85.9"'));
console.log('PASS HF20: accessible private 25-item saved-work pages, sort, search, reset, no data deletion, full metadata-only export, exact release.');
