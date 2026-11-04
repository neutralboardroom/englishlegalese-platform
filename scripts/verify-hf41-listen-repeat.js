'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('product-v2030-listen-repeat.js','utf8');
const css=fs.readFileSync('hf41-listen-repeat.css','utf8');
const pages=['learn/continuing-practice/index.html','learn/continuing-practice/advanced/index.html'].map(x=>fs.readFileSync(x,'utf8'));
for(const page of pages){
 assert.equal((page.match(/<article class="v1971-lesson"/g)||[]).length,12);
 for(const required of ['product-v1990-speaking-rehearsal','product-v2000-private-drafts','product-v2010-writing-review','product-v2020-paired-dialogues','product-v2030-listen-repeat.js?v=hf41','hf41-listen-repeat.css?v=hf41'])assert.ok(page.includes(required),required);
}
for(const forbidden of ['fetch(','localStorage','sessionStorage','getUserMedia','MediaRecorder','SpeechRecognition','sendBeacon','innerHTML','textarea.value'])assert.ok(!js.includes(forbidden),'privacy: '+forbidden);
for(const required of ['SpeechSynthesisUtterance','speechSynthesis','synth.cancel()','synth.speak(utterance)','utterance.lang=','utterance.onerror','visibilitychange','pagehide','aria-label','role'])assert.ok(js.includes(required),required);
assert.ok(css.includes('.v2030-audio'));
assert.ok(!fs.readFileSync('index.html','utf8').includes('hf41-listen-repeat'));
console.log('PASS HF41: 24 sample playback controls, transcript/pace/stop/accessibility, no student text or microphone use.');
