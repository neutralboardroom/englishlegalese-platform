'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8');
const first=read('learn/continuing-practice/index.html');
const advanced=read('learn/continuing-practice/advanced/index.html');
const js=read('product-v1990-speaking-rehearsal.js');
const css=read('hf37-speaking-rehearsal.css');
const lessons=[first,advanced].flatMap(page=>[...page.matchAll(/<article class="v1971-lesson"[^>]*>[\s\S]*?<h3>([^<]+)<\/h3>/g)].map(x=>x[1]));
assert.equal(lessons.length,24,'all 24 existing lessons preserved');
assert.equal(new Set(lessons).size,24,'existing lessons remain unique');
const authored=[...js.matchAll(/^\['([^']+)','/gm)].map(x=>x[1]);
assert.equal(authored.length,24,'24 independent real speaking exercises');
assert.equal(new Set(authored).size,24,'no repeated exercise headings');
assert.deepEqual(new Set(authored),new Set(lessons),'every existing lesson receives a tailored speaking scenario');
for(const page of [first,advanced]){
 assert.ok(page.includes('href="/hf37-speaking-rehearsal.css?v=hf37"'));
 assert.ok(page.includes('src="/product-v1990-speaking-rehearsal.js?v=hf37"'));
 assert.equal((page.match(/<article class="v1971-lesson"/g)||[]).length,12);
 assert.equal((page.match(/data-v1980-check /g)||[]).length,12,'pre-existing comprehension checks preserved');
}
assert.ok(css.includes('.v1990-speaking'),'styles are scoped');
for(const keyword of ['localStorage','sessionStorage','getUserMedia','MediaRecorder','XMLHttpRequest','navigator.sendBeacon','fetch('])
 assert.ok(!js.includes(keyword),'feature cannot collect/transmit private speech: '+keyword);
for(const required of ['No microphone access','Pause timer','Start a 45-second speaking turn','textContent','visibilitychange','aria-live'])
 assert.ok(js.includes(required),'privacy, timing and accessibility remain explicit: '+required);
assert.ok(!read('index.html').includes('hf37-speaking-rehearsal'),'protected homepage untouched');
console.log('PASS HF37: tailored oral rehearsal for 24 existing lessons; private, accessible and additive.');
