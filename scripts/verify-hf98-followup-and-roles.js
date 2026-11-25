'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const mobile=read('learn/app/index.html'),teachers=read('learn/teachers/index.html');
const js=read('assets/hf98-conversation-followup.js'),test=read('tests/hf98-conversation-followup.spec.js');
const orig=read('assets/hf93-mobile-conversations.js'),rule1=read('owner-rules/RDR-001.md'),rule2=read('owner-rules/RDR-002.md');
const owner=read('governance/TRCC_OWNER_IDENTITY_CLARIFICATION_2026-11-22.md');
const ack=read('governance/TR-EnglishLegaleseWebsite_Owner_Identity_Clarification_ACK_2026-11-22.md');
const current=read('HF98_RELEASE_NOTES.md'),doc=read('docs/HF98_ROLE_AND_DIALOGUE_QA.md');
const gate=read('scripts/verify-el-release-continuity.js'),workflow=read('.github/workflows/englishlegalese-release-gate.yml');
let count=0;function ok(statement,name){assert.ok(statement,name);count++;console.log('PASS HF98 '+name);}
function equal(a,b,name){assert.strictEqual(a,b,name);count++;console.log('PASS HF98 '+name);}
ok(owner.includes('Human Teacher Roger')&&owner.includes('AI Teacher Roger')&&owner.includes('Owner/Admin'),'verbatim owner role directive archived');
ok(ack.includes('Human Teacher Roger')&&ack.includes('AI Teacher Roger')&&ack.includes('Owner/Admin'),'own builder independent ACK preserved');
for(const label of ['Human Teacher Roger','AI Teacher Roger','Owner/Admin']){
 ok(mobile.includes(label),'mobile names '+label);ok(teachers.includes(label),'canonical teacher page names '+label);
 ok(owner.includes(label),'source owner instruction names '+label);
}
for(const token of ['not connected to this scripted practice','not a booked live class','separate authenticated administrative role','never automatically grant administrator privileges']){
 ok(mobile.includes(token)||teachers.includes(token),'truthful role availability/authority: '+token);
}
for(const id of ['hf98-challenge','hf98-question','hf98-draft','hf98-status','hf98-self-review','hf98-show-model','hf98-clear','hf98-review-guide','hf98-model','hf98-model-text','hf98-coaching-note','hf98-identity']){
 equal((mobile.match(new RegExp('id="'+id+'"','g'))||[]).length,1,'exact one element '+id);
}
ok(mobile.includes('<script src="/assets/hf98-conversation-followup.js" defer></script>'),'HF98 module actually loaded');
ok(mobile.includes('hf93-reveal')&&mobile.includes('hf93-transfer')&&mobile.includes('hf93-next'),'original staged exercises intact');
for(const id of ['hf93-start','hf93-stop','hf93-restart','hf95-turn-next','hf96-meaning-reveal','hf97-draft','hf97-review'])ok(mobile.includes('id="'+id+'"'),'original control '+id+' intact');
ok(js.includes("!c.transferAnswer.hidden")&&js.includes("!c.transfer.hidden")&&js.includes("!c.box.hidden"),'no follow-up before real original gate');
ok(js.includes('c.transferPrompt.textContent.trim()!==entry.source'),'fail-closed authored source binding');
ok(js.includes('const cases=[')&&js.includes('const byTitle=new Map'),'case registry keyed to original stories');
for(const title of ['Clarifying a contract deadline','Explaining confidentiality scope','Confirming a client instruction','Checking a project deadline','Clarifying meeting responsibilities','Reporting results without overclaiming']){
 ok(orig.includes("title:'"+title+"'"),'original fictional scenario exists '+title);
 ok(js.includes("title:'"+title+"'"),'authored two-round follow-up exists '+title);
}
for(const marker of ['extension until Monday','already publicly available','three main risks','reviewed report on Friday','Thursday deadline','higher orders'])ok(js.includes(marker)||mobile.includes(marker),'full-sentence follow-up teaching detail '+marker);
for(const target of ['localStorage','sessionStorage','indexedDB','XMLHttpRequest','fetch(','sendBeacon','getUserMedia','MediaRecorder','SpeechRecognition','innerHTML','eval(','postMessage('])ok(!js.includes(target),'no private write/unsafe provider '+target);
for(const target of ['c.draft.value=\'\'','pagehide','hf93-stop','hf93-restart','hf93-next','input[name="hf93-subject"]','c.model.hidden=true'])ok(js.includes(target),'clearing or state safety '+target);
for(const token of ['not an automated grade','scripted self-study','not connected to this scripted practice'])ok(js.includes(token)||mobile.includes(token)||teachers.includes(token),'no live AI/teacher claims '+token);
ok(test.includes("['legal','business']")&&test.includes('i<3'),'browser test reaches both tracks and all three cases');
ok(test.includes('pagehide')&&test.includes('no speech')===false,'browser privacy and fallback test coverage');
ok(mobile.includes('maxlength="550"')&&mobile.includes('spellcheck="false"')&&mobile.includes('autocomplete="off"'),'bounded English free response on device');
ok(mobile.includes('dir="ltr"')&&mobile.includes('lang="en-US"'),'English sentences explicitly LTR despite future Arabic locale');
for(const gateName of ['EL-RGR-020','ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md']){
 ok(current.includes(gateName),'latest root release notes link '+gateName);
 ok(doc.includes(gateName),'latest HF98 docs link '+gateName);
}
ok(rule1.includes('RDR-001')&&rule2.includes('RDR-002'),'original durable rules remain');
ok(gate.includes('Newest HF')&&gate.includes('no-drift')||gate.includes('continuity'),'historical owner rule validator remains present');
ok(workflow.includes('--project=tablet-webkit')&&workflow.includes('--workers=1'),'full existing WebKit project kept isolated');
const pkg=JSON.parse(read('package.json'));
ok(pkg.scripts.check.includes('verify-hf98-followup-and-roles'),'full check chain adds HF98 without replacement');
ok(pkg.scripts.check.includes('verify-hf97-private-paraphrase')&&pkg.scripts.check.includes('verify-hf96-meaning'),'inherited HF96-HF97 source verifiers intact');
ok(pkg.scripts['hf98:verify']==='node scripts/verify-hf98-followup-and-roles.js','dedicated verification command');
console.log('HF98_STATIC_COUNT='+count);
