'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'..');const read=p=>fs.readFileSync(path.join(base,p),'utf8');
const js=read('assets/hf99-misunderstanding-repair.js');const mobile=read('learn/app/index.html');
const t=read('tests/hf99-misunderstanding-repair.spec.js');const prev=read('assets/hf98-conversation-followup.js');
const ancestor=read('assets/hf93-mobile-conversations.js');const rules=['owner-rules/RDR-001.md','owner-rules/RDR-002.md','governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md'];
let n=0;const check=(yes,message)=>{assert.ok(yes,message);console.log('PASS HF99 '+message);n++;};
const exactly=(s,needle)=>s.split(needle).length-1;
for(const name of ['hf99-repair','hf99-misunderstanding','hf99-decision-question','hf99-choices','hf99-feedback','hf99-next-prompt','hf99-draft','hf99-status','hf99-self-check','hf99-check-guide','hf99-show-sample','hf99-sample','hf99-sample-text','hf99-coaching','hf99-clear']){
 check(exactly(mobile,'id="'+name+'"')===1,'unique accessible element '+name);
}
check(mobile.includes('<script src="/assets/hf99-misunderstanding-repair.js" defer></script>'),'actual module loaded on mobile page');
check(mobile.includes('HF99 development preview')&&mobile.includes('Professional repair: correct a misunderstanding'),'real user interface updated');
for(const title of ['Clarifying a contract deadline','Explaining confidentiality scope','Confirming a client instruction','Checking a project deadline','Clarifying meeting responsibilities','Reporting results without overclaiming']){
 check(ancestor.includes("title:'"+title+"'"),'authoritative original conversation '+title);
 check(prev.includes("title:'"+title+"'"),'authoritative HF98 follow-up '+title);
 check(js.includes("title:'"+title+"'"),'HF99 specialist-authored correction '+title);
}
for(const token of ['c.case.hidden','c.transfer.hidden','c.transferAnswer.hidden','c.earlier.hidden','c.earlierModel.hidden','c.transferPrompt.textContent.trim()!==item.source','c.earlierQuestion.textContent.trim()!==item.earlierQuestion','c.earlierModelText.textContent.trim()!==item.earlierModel'])
 check(js.includes(token),'fail closed on exact original teaching stage '+token);
for(const token of ['pagehide','hf93-stop','hf93-restart','hf93-next','hf98-clear','input[name="hf93-subject"]','erase(','c.draft.value=\'\'','c.sampleBox.hidden=true','c.checkGuide.hidden=true'])
 check(js.includes(token),'private state reset '+token);
for(const forbidden of ['localStorage','sessionStorage','indexedDB','fetch(','XMLHttpRequest','sendBeacon','getUserMedia','MediaRecorder','SpeechRecognition','innerHTML','eval(','postMessage('])
 check(!js.includes(forbidden),'no new private write, network, or microphone '+forbidden);
for(const token of ['not an AI grade','not legal or investment advice','not saved or sent','not connected to this scripted practice'])
 check(js.includes(token)||mobile.includes(token),'plain, truthful instructional disclosure '+token);
check(mobile.includes('maxlength="500"')&&mobile.includes('autocomplete="off"')&&mobile.includes('spellcheck="false"'),'bounded local draft');
check(mobile.includes('lang="en-US" dir="ltr"'),'explicit English writing direction, other locales not claimed');
check(t.includes("['legal','business']")&&t.includes('index<3'),'six-case browser matrix present');
check(t.includes('UNVERIFIED REPLACEMENT')&&t.includes('pagehide')&&t.includes('toHaveValue'), 'browser tests cover tampering and privacy reset');
for(const rule of rules)check(read(rule).length>150,'original durable rule still accessible: '+rule);
const pkg=JSON.parse(read('package.json'));
check(pkg.scripts.check.includes('verify-hf98-followup-and-roles.js')&&pkg.scripts.check.includes('verify-hf99-misunderstanding-repair.js'),'inherited original check chain plus HF99');
check(pkg.scripts['hf99:verify']==='node scripts/verify-hf99-misunderstanding-repair.js','dedicated HF99 command');
console.log('HF99_STATIC_COUNT='+n);
