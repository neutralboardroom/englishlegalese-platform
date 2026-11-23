'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const js=read('assets/hf100-confirmation-note.js'),html=read('learn/app/index.html');
const t=read('tests/hf100-confirmation-note.spec.js'),prev=read('assets/hf99-misunderstanding-repair.js');
let n=0;function check(a,msg){assert.ok(a,msg);n++}const count=(text,str)=>text.split(str).length-1;
const ids=['hf100-note','hf100-title','hf100-flawed','hf100-question','hf100-choices','hf100-feedback','hf100-compose','hf100-task','hf100-subject','hf100-body','hf100-status','hf100-review','hf100-checklist','hf100-model-button','hf100-model','hf100-model-subject','hf100-model-body','hf100-coaching','hf100-clear'];
for(const id of ids)check(count(html,'id="'+id+'"')===1,'Unique accessible UI: '+id);
for(const title of ['Clarifying a contract deadline','Explaining confidentiality scope','Confirming a client instruction','Checking a project deadline','Clarifying meeting responsibilities','Reporting results without overclaiming']){
 check(js.includes("title:'"+title+"'")&&prev.includes("title:'"+title+"'"),'Preserve original six professional contexts: '+title);
}
for(const expr of ['c.case.hidden','c.transfer.hidden','c.transferAnswer.hidden','c.hf98.hidden','c.hf98Model.hidden','c.repair.hidden','c.next.hidden','c.hf99Sample.hidden','c.hf99Draft.disabled','c.misread.textContent.trim()!==item.misread','c.hf99SampleText.textContent.trim()!==item.prior',"chosen.length!==1",'!chosen[0].disabled'])
 check(js.includes(expr),'Source-bound cumulative fail-closed gate: '+expr);
for(const expr of ['hf93-stop','hf93-restart','hf93-next','hf93-start','hf98-clear','hf99-clear','input[name="hf93-subject"]','pagehide','c.subject.value=\'\'','c.body.value=\'\'','reset(','c.panel.hidden=true'])
 check(js.includes(expr),'Private state cleared by explicit lifecycle: '+expr);
for(const expr of ['localStorage','sessionStorage','indexedDB','fetch(','XMLHttpRequest','sendBeacon','MediaRecorder','getUserMedia','SpeechRecognition','innerHTML','eval(','postMessage('])
 check(!js.includes(expr),'No prohibited network/write/microphone feature: '+expr);
for(const attr of ['maxlength="120"','maxlength="850"','autocomplete="off"','spellcheck="false"','lang="en-US" dir="ltr"'])
 check(html.includes(attr),'Bounded, optional English-only input: '+attr);
for(const expr of ['no message','not an automatic grade','Nothing is emailed','No microphone','AI'])
 check(js.includes(expr)||html.includes(expr),'Truthful no-grade, no-send disclosure: '+expr);
check(html.includes('<script src="/assets/hf100-confirmation-note.js" defer></script>'),'Separate progressive enhancement module loaded');
check(html.includes('HF100 development preview')&&html.includes('Put it in writing: the professional confirmation note'),'Actual UX version and feature');
check(t.includes("['legal','business']")&&t.includes('index<3')&&t.includes('pagehide')&&t.includes('toHaveValue'),'Both track 3 cases and actual browser privacy tests');
check(js.includes('const cases=new Map(lessons.map(item=>[item.title,item]))')&&js.includes('risks:')&&js.includes('right:')&&js.includes('body:')&&js.includes('subject:'),'Six authored, scored reading choices and model subject/body');
const pkg=JSON.parse(read('package.json'));
check(pkg.scripts.check.includes('verify-hf99-misunderstanding-repair.js')&&pkg.scripts.check.includes('verify-hf100-confirmation-note.js'),'Inherits HF99 and adds HF100 to mandatory CI chain');
check(pkg.scripts['hf100:verify']==='node scripts/verify-hf100-confirmation-note.js','Dedicated check command');
for(const p of ['owner-rules/RDR-001.md','owner-rules/RDR-002.md','governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md'])check(read(p).length>150,'Original owner rule accessible '+p);
check(read('docs/HF100_PROFESSIONAL_CONFIRMATION_NOTE_QA.md').includes('EL-RGR-020')&&read('docs/HF100_PROFESSIONAL_CONFIRMATION_NOTE_QA.md').includes('ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md'),'Canonical release continuity named in newest docs');
console.log('PASS HF100_STATIC_ASSERTIONS='+n);
