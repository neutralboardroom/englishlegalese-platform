'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('product-v2100-four-week-path.js','utf8');
const titles=JSON.parse(js.match(/const titles=(\[[\s\S]*?\]);\n const weeks=/)[1]);
const weeks=JSON.parse(js.match(/const weeks=(\[[\s\S]*?\]);\n const make=/)[1]);
const pages=['learn/continuing-practice/index.html','learn/continuing-practice/advanced/index.html'].map(x=>fs.readFileSync(x,'utf8'));
const found=pages.flatMap(p=>[...p.matchAll(/<h3>(.*?)<\/h3>/g)].map(m=>m[1].replace(/&amp;/g,'&')));
assert.equal(titles.length,24);assert.deepEqual(new Set(titles),new Set(found));
assert.equal(weeks.length,8,'four weeks for each subject');
for(const group of ['Legal English','Business and Investor English']){
 const track=weeks.filter(w=>w[0]===group);
 assert.deepEqual(track.map(w=>w[1]),[1,2,3,4]);
 assert.equal(track.flatMap(w=>w[3]).length,12);
}
const covered=weeks.flatMap(w=>w[3]);
assert.equal(new Set(covered).size,24,'every lesson appears in one guided week');
assert.deepEqual([...covered].sort((a,b)=>a-b),Array.from({length:24},(_,i)=>i));
for(const row of weeks){assert.equal(row.length,6);assert.equal(row[3].length,3);assert.ok(row[4].length>60);assert.ok(row[5].length>55);}
for(const page of pages){assert.equal((page.match(/<article class="v1971-lesson"/g)||[]).length,12);
 for(const x of ['product-v2060-differentiated-speaking','product-v2070-teacher-questions','product-v2080-clarification-lab','product-v2090-print-packs','product-v2100-four-week-path.js?v=hf48','hf48-four-week-path.css?v=hf48'])assert.ok(page.includes(x),x);}
for(const bad of ['fetch(','localStorage','sessionStorage','sendBeacon','innerHTML','getUserMedia','textarea.value'])assert.ok(!js.includes(bad),'privacy: '+bad);
assert.ok(js.includes('v2100-more-tools'),'compact accessible per-lesson optional tools');
assert.ok(!fs.readFileSync('index.html','utf8').includes('hf48-four-week'));
console.log('PASS HF48: eight subject-specific four-week sequences, exactly 24 lesson links, no invented completion or tracking.');
