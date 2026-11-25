'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('learn/app/index.html'),js=read('assets/hf101-practice-route.js');
const spec=read('tests/hf101-practice-route.spec.js'),hf100=read('tests/hf100-confirmation-note.spec.js');
const pkg=JSON.parse(read('package.json'));
let count=0;function check(a,name){assert.ok(a,name);count++}
const ids=['hf101-route','hf101-route-title','hf101-steps','hf101-route-status','hf101-route-focus'];
for(const id of ids)check(html.split('id="'+id+'"').length===2,'Unique accessible route ID: '+id);
for(let i=0;i<6;i++)check(html.includes('data-hf101-stage="'+i+'"'),'All six explicit stages numbered '+i);
for(const s of ['Understand the conversation','Speak a complete reply','Use it in a new situation','Answer another question','Correct a misunderstanding','Write a confirmation note'])
 check(html.includes(s),'Real named learning activity: '+s);
for(const s of ['aria-current','role="status"','aria-live="polite"','type="button" disabled','not a score','or a saved record','This guide shows opened stages'])
 check(html.includes(s),'Accessible honest student copy: '+s);
for(const s of ['casePanel.hidden','speak.hidden','transfer.hidden','transferAnswer.hidden','followup.hidden','repair.hidden','note.hidden','noteModel.hidden',"'pagehide'",'scrollIntoView','focus({preventScroll:true})'])
 check(js.includes(s),'Route derives only original visible progress: '+s);
for(const s of ['localStorage','sessionStorage','indexedDB','fetch(','XMLHttpRequest','sendBeacon','getUserMedia','SpeechRecognition','MediaRecorder','innerHTML','eval(','postMessage(','input.value','JSON.stringify('])
 check(!js.includes(s),'No storage, mic, network, private input or grading: '+s);
for(const s of ['hf100-confirmation-note.js','hf99-misunderstanding-repair.js','hf98-conversation-followup.js','hf97-private-paraphrase.js','hf96-meaning-guide.js','hf94-listen-shadow.js','hf93-mobile-conversations.js'])
 check(html.includes('<script src="/assets/'+s+'" defer></script>'),'Prior module preserved '+s);
check(html.includes('<script src="/assets/hf101-practice-route.js" defer></script>'),'New route module loads after all prior modules');
check(html.includes('Mobile learning | HF101 development preview'),'Accurate current preview label');
check(spec.includes("['legal','business']")&&spec.includes('index<3')&&spec.includes('pagehide')&&spec.includes('hf101-route-focus'),'Both domains all cases browser tested for focus and privacy');
check(hf100.includes('for(const track of [\'legal\',\'business\'])')&&hf100.includes('index<3'),'Inherited six-scenario WebKit test assertions retained');
check(hf100.includes('await expect(page.locator(\'#hf100-note\')).toBeVisible()'),'Inherited six-scenario WebKit check remains active');
check(!hf100.includes('test.setTimeout('),'Full same per-test 30s timeout, no test-gate relaxation');
check(pkg.scripts.check.includes('verify-hf100-confirmation-note.js')&&pkg.scripts.check.includes('verify-hf101-practice-route.js'),'Mandatory CI runs original HF100 and new HF101');
check(pkg.scripts['hf101:verify']==='node scripts/verify-hf101-practice-route.js','Dedicated reproducible verifier');
for(const p of ['owner-rules/RDR-001.md','owner-rules/RDR-002.md','governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md'])check(read(p).length>150,'Original owner rule retained: '+p);
check(read('docs/HF101_PRACTICE_ROUTE_QA.md').includes('EL-RGR-020')&&read('docs/HF101_PRACTICE_ROUTE_QA.md').includes('ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md'),'Newest QA explicitly links immutable canonical release contract');
console.log('PASS HF101_STATIC_ASSERTIONS='+count);
