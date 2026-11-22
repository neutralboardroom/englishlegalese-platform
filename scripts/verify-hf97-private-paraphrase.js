#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const html=read('learn/app/index.html'),js=read('assets/hf97-private-paraphrase.js'),workflow=read('.github/workflows/englishlegalese-release-gate.yml'),pkg=JSON.parse(read('package.json'));
let count=0;const ok=(condition,name)=>{assert.ok(condition,name);count++;};
for(const id of ['hf97-write','hf97-write-title','hf97-draft','hf97-draft-status','hf97-review','hf97-clear','hf97-review-guide'])ok(html.includes('id="'+id+'"'),'New accessible writing control '+id);
for(const id of ['hf93-conversation-lab','hf93-start','hf93-stop','hf93-restart','hf93-next','hf93-to-transfer','hf93-reveal','hf95-turn-first','hf95-turn-back','hf95-turn-next','hf95-turn-listen','hf96-meaning-reveal','hf96-meaning-example','hf94-audio-dialogue','hf94-audio-stop'])ok(html.includes('id="'+id+'"'),'Original teaching & stop behavior '+id);
for(const s of ['never sent, saved, or automatically graded','autocomplete="off" spellcheck="false" disabled','maxlength="600"','aria-describedby="hf97-draft-status"','Self-review my sentence','Show sample meaning','not an automatic grade','Did I write a complete English sentence','Did I preserve who does what'])ok(html.includes(s),'UI honesty/full-sentence review '+s);
for(const s of ['MutationObserver','pagehide','draft.value=','guide.hidden=true','review.disabled=true','clearButton.disabled=true','visibleTurn','resetIds','new Set([\'hf93-stop\'','no draft was saved','Nothing was saved','queueMicrotask(refresh)','draft.addEventListener(\'input\'','review.addEventListener(\'click\'','clearButton.addEventListener(\'click\''])ok(js.includes(s),'Private lifecycle '+s);
for(const banned of [/(^|[^\w])fetch\s*\(/, /\bXMLHttpRequest\b/,/\blocalStorage\b/,/\bsessionStorage\b/,/\bindexedDB\b/,/\bWebSocket\b/,/\.innerHTML\s*=/,/\bgetUserMedia\b/,/\bSpeechRecognition\b/,/\bMediaRecorder\b/,/\bnavigator\.clipboard\b/,/\bnew Audio\b/])ok(!banned.test(js),'No collection/persistence/network '+banned);
const immutable={
'assets/hf93-mobile-conversations.js':'40ed3c7033cee4fdadc49e0bd03ce5f600d2614c2cccefb3ef4b243710124c08',
'owner-rules/RDR-001.md':'d4ed3fcee5df79dda7da8e3473e6ecc7a5d994c14a44d3343711c7f05012e4c1',
'owner-rules/RDR-002.md':'da69f46615bb4cdb91cdda202fa4075a96d54fe27551fe40d80244704a58564c',
'governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md':'3f88cc66ebd1cbd77a38f924b484236dcb29898cb4a8e0b3028095a8918e9a40'};
for(const [file,digest] of Object.entries(immutable))ok(hash(file)===digest,'Byte-exact owner-rule or source '+file);
for(const p of ['assets/hf94-listen-shadow.js','assets/hf96-meaning-guide.js','docs/HF96_LOCALE_READINESS_INVENTORY.json','qa/hf96-rtl-fixture.html','sw.js'])ok(fs.statSync(path.join(root,p)).size>0,'Preserved original file '+p);
ok(html.indexOf('hf93-mobile-conversations.js')<html.indexOf('hf94-listen-shadow.js')&&html.indexOf('hf94-listen-shadow.js')<html.indexOf('hf96-meaning-guide.js')&&html.indexOf('hf96-meaning-guide.js')<html.indexOf('hf97-private-paraphrase.js'),'Script loading hierarchy preserved');
ok(pkg.scripts.check.includes('node scripts/verify-hf96-meaning.js')&&pkg.scripts.check.includes('node scripts/verify-hf97-private-paraphrase.js'),'Original full source check AND new one retained');
for(const name of ['Run complete Chromium desktop, tablet and mobile browser qualification','Run complete tablet Safari WebKit browser qualification independently'])ok(workflow.split(name).length===3,'Both independent CI jobs perform isolated stage: '+name);
ok(workflow.split('--project=tablet-webkit --workers=1').length===3,'WebKit all original tests with 1 worker in BOTH jobs');
for(const p of ['--project=desktop-chromium','--project=tablet-chromium','--project=mobile-chromium'])ok(workflow.split(p).length===3,'Every original Chromium project in both jobs '+p);
ok(!/--grep(-invert)?\b|--last-failed|--retries\b|--max-failures\b/.test(workflow.slice(workflow.indexOf('HF97:'))),'No bypass, last-failed-only or retry gate');
const ids=JSON.parse(read('docs/HF96_LOCALE_READINESS_INVENTORY.json')).frozen_target_locales;
ok(JSON.stringify(ids)===JSON.stringify(['en-US','th-TH','vi-VN','zh-Hans-CN','zh-Hant-HK','zh-Hant-TW','ja-JP','ko-KR','id-ID','ms-MY','es','pt-BR','ar']),'Exactly 13 frozen target locale IDs');
ok(!read('sw.js').includes('hf97-private-paraphrase'),'Original PWA private caching untouched');
console.log('HF97 private written English self-review and WebKit no-dilution gates: '+count+' PASS');
