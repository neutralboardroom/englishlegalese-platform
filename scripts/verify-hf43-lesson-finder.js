'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('product-v2050-lesson-finder.js','utf8');
const rows=JSON.parse(js.match(/const records=(\[[\s\S]*?\]);\n const make=/)[1]);
const pages=['learn/continuing-practice/index.html','learn/continuing-practice/advanced/index.html'].map(x=>fs.readFileSync(x,'utf8'));
const titles=pages.flatMap(s=>[...s.matchAll(/<h3>([^<]+)<\/h3>/g)].map(m=>m[1].replace(/&amp;/g,'&')));
assert.equal(rows.length,24);assert.deepEqual(new Set(rows.map(r=>r[0])),new Set(titles));
for(const [i,row] of rows.entries()){
 assert.equal(row.length,3);
 assert.ok(row[2].startsWith(i<12?'/learn/continuing-practice/#':'/learn/continuing-practice/advanced/#'));
 assert.ok(row[1]==='Legal English'||row[1]==='Business and Investor English');
}
for(const page of pages){assert.equal((page.match(/<article class="v1971-lesson"/g)||[]).length,12);
 assert.ok(page.includes('product-v2050-lesson-finder.js?v=hf43'));
 assert.ok(page.includes('hf43-lesson-finder.css?v=hf43'));
 for(const earlier of ['product-v2000-private-drafts','product-v2010-writing-review','product-v2020-paired-dialogues','product-v2030-listen-repeat','product-v2040-teacher-session'])assert.ok(page.includes(earlier),earlier);}
for(const bad of ['fetch(','localStorage','sessionStorage','sendBeacon','innerHTML','getUserMedia','MediaRecorder'])assert.ok(!js.includes(bad),'privacy: '+bad);
for(const expected of ['search.type=\'search\'','select.addEventListener','Clear search and subject','replaceChildren','lesson cards','scrollIntoView','role'])assert.ok(js.includes(expected),expected);
assert.equal((pages.join('').match(/undefined/g)||[]).length,1,'only the intentional ordinary adjective undefined remains; no corrupted punctuation');
assert.ok(pages[0].includes('“Send it soon”'),'quoted assignment restored');
assert.ok(pages[0].includes('didn’t you?'),'contraction restored');
assert.ok(pages[1].includes('“we will consider it”'),'meeting language restored');
assert.ok(!fs.readFileSync('index.html','utf8').includes('hf43-lesson-finder'));
console.log('PASS HF43: 24 lesson deep links, subject/search navigation, no hidden lesson content and zero student tracking.');
