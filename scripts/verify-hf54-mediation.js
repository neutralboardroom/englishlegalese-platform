'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const bridge=fs.readFileSync('product-v2120-practice-bridge-data.js','utf8');
const scenarios=JSON.parse(bridge.match(/const cases=(\[[\s\S]*?\]);\n if\(cases.length/)[1]);
const moduleText=fs.readFileSync('product-v2150-mediation-turns.js','utf8');
assert.equal(scenarios.length,24,'keep all existing professional lesson topics');
assert.equal(new Set(scenarios.map(c=>c.title)).size,24);
for(const [key,needle]of Object.entries({
  projectScope:"data.project!=='EnglishLegalese'",
  offlineOnly:'data.runtimeConnected || data.aiInference',
  nestedTools:"card.querySelector('details.v2100-more-tools')",
  lessonScope:"document.querySelectorAll('article.v1971-lesson')",
  noDuplication:"tools.querySelector('.v2150-mediation-turns')",
  keyboardButton:"button.type='button'",
  disabledBounds:"previous.disabled=index===0",
  accessibleStatus:"stage.setAttribute('aria-live','polite')",
  safeOutput:"node.textContent=text",
  fourSteps:'Turn 4 of 4',
  consent:'No microphone, submission, AI grading'
}))assert.ok(moduleText.includes(needle),'missing '+key);
for(const unsafe of ['fetch(', 'XMLHttpRequest', 'sendBeacon', 'MediaRecorder', 'SpeechRecognition', 'getUserMedia', 'innerHTML', 'localStorage', 'sessionStorage', 'navigator.clipboard', 'textarea.value'])
 assert.ok(!moduleText.includes(unsafe),'unwanted side effect: '+unsafe);
for(const path of ['learn/continuing-practice/index.html','learn/continuing-practice/advanced/index.html']){
 const html=fs.readFileSync(path,'utf8');
 assert.equal((html.match(/<article class="v1971-lesson"/g)||[]).length,12,'12 original cards retained: '+path);
 assert.equal((html.match(/product-v2150-mediation-turns\.js\?v=hf54/g)||[]).length,1,'HF54 imported once: '+path);
 for(const predecessor of ['product-v2120-practice-bridge-data.js?v=hf50','product-v2120-response-ladder.js?v=hf50','product-v2130-evidence-check.js?v=hf51','product-v2140-mini-clinic.js?v=hf52'])
  assert.ok(html.includes(predecessor),'inherited module '+predecessor);
 assert.ok(!html.includes('hf54-mediation.css'),'no site-wide or new layout styles');
}
assert.ok(!fs.readFileSync('index.html','utf8').includes('hf54'),'protected homepage unchanged');
console.log('PASS HF54: 24 original adult scenarios, 4 meaning-repair turns, no personal data or calls, original lesson layout preserved.');
