/* Deterministic HF88 additive composition from complete HF87 offline HTML. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const {getMeetingMinutes,PROFILES,SUPPORTED_EXPLANATION_LOCALES}=require('../src/trcfAdultMeetingMinutes');
const root=path.resolve(__dirname,'..');let html=fs.readFileSync(path.join(root,'labs/hf87-private-professional-followup-email-offline.html'),'utf8');
const DATA={};for(const l of SUPPORTED_EXPLANATION_LOCALES){DATA[l]={};for(const p of PROFILES)DATA[l][p]=getMeetingMinutes({profile:p,explanationLocale:l});}
const embed=JSON.stringify(DATA).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
function once(a,b){if(html.split(a).length!==2)throw Error('HF87 unique anchor not found once: '+a.slice(0,90));html=html.replace(a,b)}
once('<title>EnglishLegalese HF87 · Professional Client Follow-Up Email Workshop</title>','<title>EnglishLegalese HF88 · Meeting Minutes and Action Items Workshop</title>');
once('Internal development preview HF87','Internal development preview HF88');
once('</style>',String.raw`
.minutes-lab{margin:17px 0;padding:15px;border:1px solid #b4baca;border-radius:12px;background:#f9fbff}
.minutes-lab summary{font-weight:750;cursor:pointer;color:#243b62}
.minutes-lab label{display:block;font-weight:650;margin:10px 0 4px}
.minutes-lab input,.minutes-lab textarea,.minutes-lab select{box-sizing:border-box;display:block;width:100%;border:1px solid #8999ae;border-radius:8px;background:white;color:#16283d;padding:10px;font:inherit}
.minutes-lab textarea{min-height:64px;resize:vertical}
.minutes-lab .minutes-result{white-space:pre-wrap;overflow-wrap:anywhere;background:white;border-left:4px solid #426b9b;padding:12px;margin:10px 0;border-radius:6px}
.minutes-lab [hidden]{display:none!important}
.minutes-lab button:focus-visible,.minutes-lab input:focus-visible,.minutes-lab textarea:focus-visible,.minutes-lab select:focus-visible,.minutes-lab summary:focus-visible{outline:3px solid #d7a342;outline-offset:2px}
</style>`);
const panel=String.raw`<details id="minutes-lab" class="minutes-lab" aria-label="Fictional professional meeting minutes and action items practice">
<summary>Meeting Minutes &amp; Action Items — accurately record what was discussed</summary>
<p lang="en">Write a meeting record for the current fictional adult professional situation. Distinguish known facts from proposed and agreed actions; never invent a real agreement. This practice is private, offline, unsent and ungraded.</p>
<p id="minutes-native-intro" class="native-copy"></p><p id="minutes-native-privacy" class="writing-privacy"></p>
<p id="minutes-focus" lang="en"></p><p id="minutes-prompt" lang="en"></p>
<label for="minutes-topic">Meeting topic (English)</label><input id="minutes-topic" type="text" maxlength="115" autocomplete="off" placeholder="Specific topic in the fictional example">
<label for="minutes-facts">What was actually discussed or established? (English)</label><textarea id="minutes-facts" maxlength="360" autocomplete="off" placeholder="Known facts only, not assumptions"></textarea>
<label for="minutes-action">Proposed next action (English)</label><textarea id="minutes-action" maxlength="360" autocomplete="off" placeholder="One clear, realistic follow-up action"></textarea>
<label for="minutes-agreement">Has this action been agreed in the fictional exercise?</label><select id="minutes-agreement"><option value="proposed">Proposed — not yet confirmed</option><option value="confirmed">Confirmed only within this fictional exercise</option></select>
<label for="minutes-owner">Responsible role (fictional, not a real name)</label><input id="minutes-owner" type="text" maxlength="90" autocomplete="off" placeholder="e.g. review coordinator">
<label for="minutes-timing">Timing or next checkpoint (English)</label><input id="minutes-timing" type="text" maxlength="95" autocomplete="off" placeholder="Proposed deadline or follow-up checkpoint">
<label for="minutes-question">Open question (English)</label><textarea id="minutes-question" maxlength="240" autocomplete="off" placeholder="What still needs confirmation?"></textarea>
<p class="small" id="minutes-length" aria-live="polite">No meeting record has been saved or transmitted.</p>
<div class="controls"><button id="minutes-preview" type="button">Preview my unsent meeting record</button><button id="minutes-compare" type="button">Compare with authored example</button><button id="minutes-insert" type="button" class="secondary">Use my notes in the main writing draft</button><button id="minutes-clear" type="button" class="secondary">Clear these notes</button></div>
<p id="minutes-status" class="small" role="status" aria-live="polite">Write a meeting topic, facts and action before previewing. Nothing is stored, graded or sent.</p>
<div id="minutes-output" class="minutes-result" lang="en" hidden></div><div id="minutes-model" class="minutes-result" hidden></div>
</details>`;
once('<label for="writing-draft">',panel+'\n<label for="writing-draft">');
const script=`const MINUTES_DATA=${embed};
let minutesReplacePending=false;
const MINUTES_FIELDS=['minutes-topic','minutes-facts','minutes-action','minutes-agreement','minutes-owner','minutes-timing','minutes-question'];
function minutesData(){return MINUTES_DATA[byId('locale').value][byId('track').value];}
function minutesTurn(){return minutesData().scenarios[dialogueSceneIndex].turns[dialogueTurnIndex];}
function minutesCompose(){
 const take=id=>byId(id).value.trim(),topic=take('minutes-topic'),facts=take('minutes-facts'),action=take('minutes-action');
 if(!topic||!facts||!action)return null;
 const status=byId('minutes-agreement').value==='confirmed'?'Confirmed only in this FICTIONAL exercise (verify evidence)':'PROPOSED — not yet agreed';
 return 'MEETING RECORD (FICTIONAL ADULT PRACTICE)\\nTopic: '+topic+'\\nFacts discussed: '+facts+'\\nAction status: '+status+'\\nProposed action: '+action+'\\nResponsible role: '+(take('minutes-owner')||'Not yet assigned')+'\\nTiming/checkpoint: '+(take('minutes-timing')||'Not yet agreed')+'\\nOpen question: '+(take('minutes-question')||'To be confirmed');
}
function clearMinutes(){minutesReplacePending=false;byId('minutes-lab').open=false;
 MINUTES_FIELDS.forEach(id=>{if(id==='minutes-agreement')byId(id).value='proposed';else byId(id).value='';});
 byId('minutes-output').hidden=true;byId('minutes-output').textContent='';byId('minutes-model').hidden=true;byId('minutes-model').replaceChildren();
 byId('minutes-length').textContent='No meeting record has been saved or transmitted.';
 byId('minutes-insert').textContent='Use my notes in the main writing draft';
 byId('minutes-status').textContent='Write a meeting topic, facts and action before previewing. Nothing is stored, graded or sent.';
}
function renderMinutes(){if(stopped||step!==3)return;const m=minutesData(),t=minutesTurn();
 byId('minutes-native-intro').lang=m.explanationLocale;byId('minutes-native-intro').textContent=m.guidance.intro;
 byId('minutes-native-privacy').lang=m.explanationLocale;byId('minutes-native-privacy').textContent=m.guidance.privacy;
 byId('minutes-focus').textContent='English minutes focus: '+t.focusEnglish;
 byId('minutes-prompt').textContent='Current fictional meeting context: '+t.promptEnglish;
}
function minutesInput(){minutesReplacePending=false;byId('minutes-insert').textContent='Use my notes in the main writing draft';
 byId('minutes-output').hidden=true;byId('minutes-output').textContent='';byId('minutes-model').hidden=true;byId('minutes-model').replaceChildren();
 const n=MINUTES_FIELDS.filter(x=>x!=='minutes-agreement').reduce((k,id)=>k+byId(id).value.length,0);
 byId('minutes-length').textContent=n+' characters entered; practice stays in this page memory only.';
 byId('minutes-status').textContent='Your notes changed. Any earlier model comparison and overwrite confirmation are now invalid.';
}
function minutesPreview(){if(stopped||step!==3)return;const t=minutesCompose();if(!t){byId('minutes-status').textContent='Complete topic, facts and action before previewing.';return;}
 byId('minutes-output').textContent=t;byId('minutes-output').hidden=false;
 byId('minutes-status').textContent='Unsent local preview, not agreement verification. No data was transmitted.';
}
function minutesCompare(){if(stopped||step!==3)return;const existing=minutesCompose();if(!existing){byId('minutes-status').textContent='Write your own topic, facts and proposed action first; the authored model stays hidden.';return;}
 const m=minutesData(),t=minutesTurn(),box=byId('minutes-model');box.replaceChildren();
 for(const [s,lang] of [['Authored English model (fictional; not agreed):\\nTopic: '+t.topicEnglish+'\\nKnown facts: '+t.factsEnglish+'\\nStatus: PROPOSED — not yet confirmed\\nProposed action: '+t.actionEnglish+'\\nResponsible role: '+t.ownerEnglish+'\\nTiming: '+t.timingEnglish+'\\nOpen question: '+t.questionEnglish,'en'],['English accuracy checklist: '+t.checklistEnglish.join(' '),'en'],[t.rationaleNative,m.explanationLocale],[m.guidance.review,m.explanationLocale]]){
  const p=document.createElement('p');p.textContent=s;p.lang=lang;p.style.whiteSpace='pre-wrap';box.append(p);}
 box.hidden=false;byId('minutes-status').textContent='You deliberately revealed an authored model. It is not a graded assessment or an agreed real action.';
}
function minutesInsert(){if(stopped||step!==3)return;const t=minutesCompose(),target=byId('writing-draft');
 if(!t){byId('minutes-status').textContent='Complete topic, facts and action first.';return;}
 if(t.length>1200){byId('minutes-status').textContent='Your record is '+t.length+' characters. Shorten it to 1200 characters or fewer; no content will be silently truncated.';return;}
 if(target.value.trim()&&!minutesReplacePending){minutesReplacePending=true;byId('minutes-insert').textContent='Confirm replacing my existing writing';byId('minutes-status').textContent='Existing writing is unchanged. Explicitly confirm again if you wish to replace it.';return;}
 target.value=t;target.dispatchEvent(new Event('input',{bubbles:true}));minutesReplacePending=false;
 byId('minutes-insert').textContent='Use my notes in the main writing draft';
 byId('minutes-status').textContent='Your meeting notes were copied into the editable draft. No emails or records were sent or stored.';
}
function resetMinutes(){const opened=byId('minutes-lab').open;clearMinutes();renderMinutes();byId('minutes-lab').open=opened;}
`;
once('const phases={intro:',script+'\nconst phases={intro:');
once('function clearWriting(){clearFollowup();','function clearWriting(){clearMinutes();clearFollowup();');
once(' renderFollowup();\n const g=writingGuide()', ' renderFollowup();\n renderMinutes();\n const g=writingGuide()');
once("byId('followup-clear').addEventListener('click',resetFollowup);",`byId('followup-clear').addEventListener('click',resetFollowup);
 MINUTES_FIELDS.forEach(id=>byId(id).addEventListener(id==='minutes-agreement'?'change':'input',minutesInput));
 byId('minutes-preview').addEventListener('click',minutesPreview);
 byId('minutes-compare').addEventListener('click',minutesCompare);
 byId('minutes-insert').addEventListener('click',minutesInsert);
 byId('minutes-clear').addEventListener('click',resetMinutes);
 byId('writing-draft').addEventListener('input',()=>{if(minutesReplacePending){minutesReplacePending=false;byId('minutes-insert').textContent='Use my notes in the main writing draft';}});`);
const output=path.join(root,'labs/hf88-professional-meeting-minutes-offline.html');fs.writeFileSync(output,html,'utf8');console.log('HF88 generated '+Buffer.byteLength(html)+' bytes');
