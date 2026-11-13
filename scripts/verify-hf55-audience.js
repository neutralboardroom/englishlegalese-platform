'use strict';
const fs=require('node:fs'), assert=require('node:assert/strict'),vm=require('node:vm');
const oldData=fs.readFileSync('product-v2120-practice-bridge-data.js','utf8');
const prior=JSON.parse(oldData.match(/const cases=(\[[\s\S]*?\]);\n if\(cases.length/)[1]);
const code=fs.readFileSync('product-v2160-audience-briefings.js','utf8');
const match=code.match(/const briefings=(\[[\s\S]*?\]);\n if\(briefings.length/);
assert.ok(match,'audience data must remain available for complete verification');
const authored=JSON.parse(JSON.stringify(vm.runInNewContext('('+match[1]+')',{}, {timeout:1000})));
assert.ok(Array.isArray(authored));
assert.equal(authored.length,24,'24 distinct adult topics');
assert.deepEqual(authored.map(r=>r.title),prior.map(r=>r.title),'no lesson drift');
for(const c of authored){
 for(const key of ['external','internal','action']){
  assert.ok(typeof c[key]==='string'&&c[key].length>42,c.title+':'+key+' must be meaningful');
 }
 assert.notEqual(c.external,c.internal,'audience language should actually differ: '+c.title);
 assert.notEqual(c.action,c.external);
 assert.notEqual(c.action,c.internal);
}
for(const needle of [
 "protocol.project!=='EnglishLegalese'",
 "protocol.runtimeConnected||protocol.aiInference",
 "lesson.querySelector('details.v2100-more-tools')",
 "host.querySelector('.v2160-audience-briefing')",
 "create('summary','Audience-aware briefing",
 "create('fieldset'",
 "checkbox.type='checkbox'",
 "reveal.open=false",
 "button.type='button'",
 "el.textContent=text",
 "instructions.setAttribute('aria-live','polite')",
 "external.setAttribute('aria-pressed'",
 "internal.setAttribute('aria-pressed'"
])assert.ok(code.includes(needle),'must retain '+needle);
for(const banned of [
  'fetch(','XMLHttpRequest','sendBeacon','getUserMedia','MediaRecorder','SpeechRecognition',
  'localStorage','sessionStorage','indexedDB','WebSocket','navigator.mediaDevices','innerHTML'
])assert.ok(!code.includes(banned),'no private capture or network operation: '+banned);
for(const path of ['learn/continuing-practice/index.html','learn/continuing-practice/advanced/index.html']){
 const html=fs.readFileSync(path,'utf8');
 assert.equal((html.match(/<article class="v1971-lesson"/g)||[]).length,12,'existing lesson cards preserved');
 assert.equal((html.match(/product-v2160-audience-briefings\.js\?v=hf55/g)||[]).length,1,'one new import');
 assert.ok(html.includes('product-v2150-mediation-turns.js?v=hf54'),'inherit verified HF54');
 assert.ok(html.includes('product-v2140-mini-clinic.js?v=hf52'),'inherit verified HF52');
 assert.ok(!html.includes('hf55.css'),'no new layout stylesheet');
}
assert.ok(!fs.readFileSync('index.html','utf8').includes('hf55'),'protected homepage isolated');
console.log('PASS HF55: 24 original differentiated briefings, inherited HF54, privacy controls, no homepage/layout CSS changes');
