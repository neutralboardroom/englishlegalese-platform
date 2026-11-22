#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const html=read('learn/app/index.html'),original=read('assets/hf93-mobile-conversations.js'),hf94=read('assets/hf94-listen-shadow.js'),meaning=read('assets/hf96-meaning-guide.js');
const inventory=JSON.parse(read('docs/HF96_LOCALE_READINESS_INVENTORY.json'));
let n=0;const check=(ok,message)=>{assert.ok(ok,message);n++;};
const scenarioVm=original.replace('const get=id=>document.getElementById(id);','globalThis.__HF96_SOURCE_SCENARIOS=scenarios;\nconst get=id=>document.getElementById(id);');
const scope={document:{getElementById:()=>null}};vm.runInNewContext(scenarioVm,scope,{timeout:1000});
const scenarios=scope.__HF96_SOURCE_SCENARIOS;check(!!scenarios,'source scenarios loaded without changing original');
const mm=meaning.match(/const EXEMPLARS=(new Map\(\[[\s\S]*?\]\));/);check(!!mm,'explicit authored meaning map');
const map=vm.runInNewContext(mm[1],{}, {timeout:1000});check(map.size===12,'exact 12 speaker-turn exemplars');
for(const subject of ['legal','business']){
 check(scenarios[subject].length===3,'original three cases '+subject);
 for(const scenario of scenarios[subject]){
  check(scenario.turns.length===2,'two-turn original case '+scenario.title);
  for(const [speaker,words] of scenario.turns){
   const key=speaker+': '+words;
   check(map.has(key),'specific source-bound meaning '+key);
   const guide=map.get(key);
   check(guide.length>35&&/[.!?]$/.test(guide)&&/\b[a-zA-Z]+\b/.test(guide),'full explanatory English sentence');
   check(!/\b(guaranteed|must sign today)\b/i.test(guide)||!guide.includes('must sign today'),'no unsupported universal guarantee');
  }
 }
}
for(const id of ['hf96-meaning','hf96-meaning-title','hf96-meaning-reveal','hf96-meaning-example','hf96-meaning-status'])check(html.includes('id="'+id+'"'),'HF96 accessible control '+id);
check(html.includes('aria-controls="hf96-meaning-example"'),'explicit reveal target');
check(html.includes('lang="en-US" dir="ltr" hidden'),'English exemplar direction isolated for future RTL');
check(html.includes('nothing is recorded or graded'),'privacy/limits displayed');
check(html.indexOf('hf93-mobile-conversations.js')<html.indexOf('hf94-listen-shadow.js')&&html.indexOf('hf94-listen-shadow.js')<html.indexOf('hf96-meaning-guide.js'),'existing ordered teaching engine retained');
for(const needed of ['sample.textContent','sample.hidden=true','reveal.disabled=true','MutationObserver','pagehide','turnText.textContent.trim()','caseBox.hidden','EXEMPLARS.has'])check(meaning.includes(needed),'fail-closed text-only implementation '+needed);
for(const banned of [/\bfetch\s*\(/, /\bXMLHttpRequest\b/, /\blocalStorage\b/, /\bsessionStorage\b/, /\bindexedDB\b/, /\bWebSocket\b/, /\bgetUserMedia\b/, /\bSpeechRecognition\b/, /\bMediaRecorder\b/, /\.innerHTML\s*=/,/navigator\.mediaDevices/])check(!banned.test(meaning),'no personal capture or network '+banned);
for(const [file,expected] of Object.entries({
 'assets/hf93-mobile-conversations.js':'40ed3c7033cee4fdadc49e0bd03ce5f600d2614c2cccefb3ef4b243710124c08',
 'owner-rules/RDR-001.md':'d4ed3fcee5df79dda7da8e3473e6ecc7a5d994c14a44d3343711c7f05012e4c1',
 'owner-rules/RDR-002.md':'da69f46615bb4cdb91cdda202fa4075a96d54fe27551fe40d80244704a58564c',
 'governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md':'3f88cc66ebd1cbd77a38f924b484236dcb29898cb4a8e0b3028095a8918e9a40'
}))check(hash(file)===expected,'unchanged byte-exact safety/teaching lineage '+file);
for(const preserved of ['hf95-turn-first','hf95-turn-back','hf95-turn-next','hf95-turn-listen','hf94-audio-dialogue','hf94-audio-model','hf94-audio-transfer','hf94-audio-stop','hf93-answers','hf93-reveal','hf93-transfer-answer'])check(html.includes('id="'+preserved+'"'),'preserved original interface '+preserved);
check(hf94.includes('function chooseTurn')&&hf94.includes('function play(kind)'),'HF94/HF95 learning + optional audio behavior retained');
const localeIds=['en-US','th-TH','vi-VN','zh-Hans-CN','zh-Hant-HK','zh-Hant-TW','ja-JP','ko-KR','id-ID','ms-MY','es','pt-BR','ar'];
check(JSON.stringify(inventory.frozen_target_locales)===JSON.stringify(localeIds),'exact owner-frozen 13 locales');
check(inventory.status==='PARTIAL_INVENTORY_REVIEW_REQUIRED','honest incomplete localization inventory');
check(inventory.public_translation_launch_ready===false,'no unreviewed locale public claim');
check(inventory.legal_market_release_approved===false,'no fictitious country/legal/market approval');
check(inventory.static_text_inventory.length>=30,'substantial English source string inventory');
check(inventory.scenario_content.length===6,'original complete six scenario inventory');
const fixture=read('qa/hf96-rtl-fixture.html');
for(const s of ['lang="ar" dir="rtl"','lang="en-US" dir="ltr"','NOT A PUBLIC TRANSLATION OR LIVE PRODUCT','<bdi','No data is saved or submitted'])check(fixture.includes(s),'mixed-direction QA, no public false claim '+s);
check(!read('sw.js').includes('hf96-meaning'),'no new PWA cache / offline privacy modification');
check(!read('mobile/native/www/index.html').includes('HF96'),'not claiming shipped native binary');
check(read('docs/HF96_QA_AND_RELEASE.md').includes('EL-RGR-020'),'original standing qualified release gate reaffirmed');
check(read('docs/HF96_QA_AND_RELEASE.md').includes('ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md'),'exact immutable contract retained');
console.log('HF96 authored turn-meaning learning + 13-locale freeze: '+n+' static integrity assertions PASS.');
