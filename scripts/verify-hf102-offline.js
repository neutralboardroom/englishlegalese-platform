'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const offline=read('learn/offline-practice/index.html'),app=read('learn/app/index.html');
const pkg=JSON.parse(read('package.json')),spec=read('tests/hf102-offline.spec.js');
const qa=read('docs/HF102_OFFLINE_POCKET_LAB_QA.md');let checks=0;
function ok(pred,label){assert.ok(pred,label);checks++}
for(const id of ['subject','case','start','clear','status','lab','lesson-title','context','turn-a','turn-b','question','answers','meaning-feedback','clarify','problem','questions','clarify-feedback','write','writing-prompt','draft','self-check','reveal','clear-writing','model','model-subject','model-body','next'])ok(offline.includes('id="'+id+'"'),'Unique required interface element '+id);
for(const term of ['Contract comment deadline','Confidentiality in a draft agreement','Confirming the client','First draft versus final report','Task ownership after a delay','Orders and uncertain revenue'])ok(offline.includes(term),'Authored independent offline curriculum '+term);
for(const term of ['Content-Security-Policy','connect-src &#39;none&#39;','script-src','form-action','aria-live="polite"','role="status"','type="button"','maxlength="850"']){
  // CSP is quoted inside the HTML meta; literal apostrophes are fine.
  if(term.includes('&#39;'))ok(offline.includes("connect-src 'none'"),'CSP forbids network');else ok(offline.includes(term),'Offline safeguard '+term)
}
for(const term of ['src="http','src="/','href="http','href="/','<link','<img','@import','url(','fetch(','XMLHttpRequest','sendBeacon','WebSocket(','EventSource(','getUserMedia','MediaRecorder','SpeechRecognition','speechSynthesis','localStorage','sessionStorage','indexedDB','serviceWorker.register','document.cookie','eval(','new Function('])ok(!offline.includes(term),'No external or private integration '+term);
for(const term of ['clearSensitive()','pagehide','beforeunload','replaceChildren()','textContent','aria-pressed','No activity is saved','not legal or investment advice','Human Teacher Roger','AI Teacher Roger','Owner/Admin'])ok(offline.includes(term),'Safe lifecycle/identity '+term);
for(const term of ['Offline Pocket Lab','href="/learn/offline-practice/index.html"','download="EnglishLegalese_Offline_Pocket_Lab_HF102.html"','does not save private lesson progress','Mobile learning | HF102 development preview'])ok(app.includes(term),'Main page links and labels '+term);
ok(app.includes('hf101-practice-route.js')&&app.includes('hf100-confirmation-note.js'),'Inherited learning intact');
ok(pkg.scripts.check.includes('verify-hf101-practice-route.js')&&pkg.scripts.check.includes('verify-hf102-offline.js'),'Previous and new CI static gates enabled');
ok(pkg.scripts['hf102:verify']==='node scripts/verify-hf102-offline.js','Dedicated re-runnable test');
ok(spec.includes('pathToFileURL')&&spec.includes('legal')&&spec.includes('business')&&spec.includes('pagehide'),'Offline file protocol browser proof included');
ok(qa.includes('ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md')&&qa.includes('EL-RGR-020'),'Permanent release rules in latest QA');
for(const p of ['owner-rules/RDR-001.md','owner-rules/RDR-002.md','governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md'])ok(read(p).length>150,'Immutable owner source preserved: '+p);
console.log('PASS HF102_STATIC_ASSERTIONS='+checks);
