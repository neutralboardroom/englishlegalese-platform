/* Deterministic additive composition: exact HF84 offline HTML is the only input. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const {getBranchingRoleplay,SUPPORTED_EXPLANATION_LOCALES,PROFILES}=require('../src/trcfAdultBranchingRoleplay');
const root=path.resolve(__dirname,'..');
let html=fs.readFileSync(path.join(root,'labs/hf84-professional-precision-challenge-offline.html'),'utf8');
const data={};for(const locale of SUPPORTED_EXPLANATION_LOCALES){data[locale]={};for(const profile of PROFILES)data[locale][profile]=getBranchingRoleplay({profile,explanationLocale:locale});}
const embedded=JSON.stringify(data).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
function replaceUnique(needle,replacement){if(html.split(needle).length!==2)throw Error('HF85 unique predecessor anchor unavailable: '+needle.slice(0,80));html=html.replace(needle,replacement)}
replaceUnique('<title>EnglishLegalese HF84 · Professional Precision Challenge</title>','<title>EnglishLegalese HF85 · Branching Professional Roleplay Workshop</title>');
replaceUnique('Internal development preview HF84','Internal development preview HF85');
replaceUnique('</style>',String.raw`
.branch-lab{margin:16px 0;padding:16px;border:1px solid #698c9d;border-radius:12px;background:#f5f9fc}
.branch-lab summary{cursor:pointer;font-weight:750;color:#245077}
.branch-lab [hidden]{display:none!important}
.branch-lab .branch-choice{display:flex;gap:12px;align-items:flex-start;margin:10px 0;padding:11px;border:1px solid #b9cad9;border-radius:9px;background:white;font-weight:500}
.branch-lab .branch-choice input{flex:none;width:18px;height:18px;margin-top:3px}
.branch-lab .branch-card{border-left:4px solid #366986;margin:12px 0;padding:10px 13px;background:#fff;overflow-wrap:anywhere}
.branch-lab .branch-context{padding:11px;background:#e9f1f8;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}
.branch-lab .branch-meta{color:#40576a;font-size:.92rem}
.branch-lab .branch-transcript{white-space:pre-wrap;overflow-wrap:anywhere;background:white;padding:12px;border-radius:9px}
.branch-lab button:focus-visible,.branch-lab summary:focus-visible{outline:3px solid #d6a53a;outline-offset:3px}
</style>`);
const panel=String.raw`<details id="branch-lab" class="branch-lab" aria-label="Branching professional roleplay">
<summary>Branching roleplay — guide a three-exchange professional conversation</summary>
<p lang="en">Choose your English response to each fictional adult stakeholder. The stakeholder reacts differently depending on your selected response. All reactions are prewritten: there is no live AI teacher, audio recording, scoring, or learner-data storage.</p>
<p id="branch-intro-native" class="native-copy"></p>
<p id="branch-privacy-native" class="branch-meta"></p>
<p id="branch-counter" class="branch-meta" aria-live="polite"></p>
<p id="branch-previous" class="branch-context" lang="en" hidden></p>
<p id="branch-focus" lang="en"></p>
<p id="branch-prompt" lang="en"></p>
<fieldset id="branch-choices"><legend>Select what you would say in English</legend></fieldset>
<div class="controls"><button id="branch-check" type="button">Send my selected reply</button><button id="branch-next" type="button" disabled>Continue to the next exchange</button><button id="branch-reset" type="button" class="secondary">Restart this roleplay</button></div>
<div id="branch-outcome" class="branch-card" role="status" aria-live="polite" hidden></div>
<p id="branch-status" role="status" aria-live="polite" class="branch-meta">Select an English reply to continue. Nothing is graded or saved.</p>
<div id="branch-finished" hidden><p id="branch-reflection-native"></p><p id="branch-transcript" class="branch-transcript" lang="en"></p></div>
<button id="branch-copy" type="button" disabled>Use my selected lines as an editable writing draft</button>
</details>`;
replaceUnique('<label for="writing-draft">',panel+'\n<label for="writing-draft">');
const script=`const BRANCHING_DATA=${embedded};
let branchRound=0,branchChecked=false,branchPath=[],branchLastReaction='',branchCopyPending=false,branchContextKey='';
function branchDataset(){return BRANCHING_DATA[byId('locale').value][byId('track').value];}
function branchScene(){return branchDataset().scenarios[dialogueSceneIndex];}
function clearBranching(){
 branchRound=0;branchChecked=false;branchPath=[];branchLastReaction='';branchCopyPending=false;branchContextKey='';
 byId('branch-lab').open=false;byId('branch-choices').querySelectorAll('label').forEach(x=>x.remove());
 byId('branch-outcome').hidden=true;byId('branch-outcome').replaceChildren();
 byId('branch-finished').hidden=true;byId('branch-transcript').textContent='';byId('branch-previous').hidden=true;
 byId('branch-next').disabled=true;byId('branch-copy').disabled=true;
 byId('branch-copy').textContent='Use my selected lines as an editable writing draft';
 byId('branch-status').textContent='Select an English reply to continue. Nothing is graded or saved.';
}
function renderBranching(){
 if(stopped||step!==3)return;
 const key=byId('locale').value+'|'+byId('track').value+'|'+dialogueSceneIndex+'|'+dialogueTurnIndex;
 if(branchContextKey!==key){if(branchContextKey)clearBranching();branchContextKey=key;}
 const info=branchDataset(),scene=branchScene(),finished=branchRound>=scene.turns.length;
 byId('branch-intro-native').textContent=info.guidance.intro;byId('branch-intro-native').lang=info.explanationLocale;
 byId('branch-privacy-native').textContent=info.guidance.privacy;byId('branch-privacy-native').lang=info.explanationLocale;
 byId('branch-choices').hidden=finished;byId('branch-check').hidden=finished;byId('branch-next').hidden=finished;
 byId('branch-focus').hidden=finished;byId('branch-prompt').hidden=finished;
 byId('branch-previous').hidden=!branchLastReaction||finished;
 if(!byId('branch-previous').hidden)byId('branch-previous').textContent='Earlier stakeholder reaction: '+branchLastReaction;
 byId('branch-copy').disabled=!finished;
 if(finished){
  byId('branch-counter').textContent='Three exchanges completed · '+scene.titleEnglish;
  byId('branch-finished').hidden=false;
  byId('branch-reflection-native').textContent=info.guidance.done+' '+info.guidance.reflect;
  byId('branch-reflection-native').lang=info.explanationLocale;
  byId('branch-transcript').textContent=branchPath.map((entry,i)=>'Round '+(i+1)+' — Your reply: '+entry.reply+'\\nStakeholder: '+entry.reaction).join('\\n\\n');
  byId('branch-status').textContent='Three scripted exchanges completed. Copying into your own draft requires an explicit button click.';
  return;
 }
 byId('branch-finished').hidden=true;
 const t=scene.turns[branchRound];
 byId('branch-counter').textContent='Scripted exchange '+(branchRound+1)+' of '+scene.turns.length+' · '+scene.titleEnglish;
 byId('branch-focus').textContent='Language focus: '+t.focusEnglish;
 byId('branch-prompt').textContent=t.originalPromptEnglish;
 const options=byId('branch-choices');options.querySelectorAll('label').forEach(x=>x.remove());
 t.optionsEnglish.forEach((message,i)=>{
  const label=document.createElement('label');label.className='branch-choice';
  const input=document.createElement('input');input.type='radio';input.name='branch-choice';input.value=String(i);input.disabled=branchChecked;
  if(branchChecked&&branchPath.length===branchRound+1&&branchPath[branchRound].choice===i)input.checked=true;
  const text=document.createElement('span');text.lang='en';text.textContent=message;
  label.append(input,text);options.append(label);
 });
 byId('branch-check').disabled=branchChecked;byId('branch-next').disabled=!branchChecked;
}
function checkBranching(){
 if(stopped||step!==3||branchChecked)return;
 const picked=byId('branch-choices').querySelector('input:checked');
 if(!picked){byId('branch-status').textContent=branchDataset().guidance.select;return;}
 const index=Number(picked.value),t=branchScene().turns[branchRound],out=t.outcomesEnglish[index];
 if(![0,1].includes(index)||!out)return;
 branchChecked=true;branchLastReaction=out.stakeholderReaction;
 branchPath.push({choice:index,reply:t.optionsEnglish[index],reaction:out.stakeholderReaction});
 const box=byId('branch-outcome');box.replaceChildren();
 for(const [txt,lang] of [['Stakeholder reaction: '+out.stakeholderReaction,'en'],['Language coaching: '+out.languageExplanation,'en'],['Suggested alternative for comparison: '+t.optionsEnglish[t.referenceOptionIndex],'en'],[t.nativeReviewExplanation,t.nativeLanguage],[branchDataset().guidance.next,branchDataset().explanationLocale],[branchDataset().guidance.note,branchDataset().explanationLocale]]){
  const p=document.createElement('p');p.textContent=txt;p.lang=lang;box.append(p);
 }
 box.hidden=false;byId('branch-status').textContent='An authored stakeholder reaction is shown; no AI graded or saved your choice.';
 renderBranching();
}
function nextBranching(){
 if(stopped||step!==3||!branchChecked)return;
 branchRound++;branchChecked=false;
 byId('branch-outcome').hidden=true;byId('branch-outcome').replaceChildren();
 renderBranching();
}
function restartBranching(){const opened=byId('branch-lab').open;clearBranching();renderBranching();byId('branch-lab').open=opened;}
function copyBranching(){
 if(stopped||step!==3||branchRound<branchScene().turns.length||branchPath.length!==3)return;
 const textarea=byId('writing-draft');
 if(textarea.value.trim()&&!branchCopyPending){branchCopyPending=true;byId('branch-copy').textContent='Confirm replacing my existing writing';byId('branch-status').textContent='Your earlier writing is protected. Press Confirm only to replace it.';return;}
 textarea.value=branchPath.map(p=>p.reply).join('\\n');
 textarea.dispatchEvent(new Event('input',{bubbles:true}));
 branchCopyPending=false;byId('branch-copy').textContent='Use my selected lines as an editable writing draft';
 byId('branch-status').textContent='Your selected example lines are now in the editable draft. No result is graded or uploaded.';
 textarea.focus();
}
`;
replaceUnique('const phases={intro:',script+'\nconst phases={intro:');
replaceUnique('function clearWriting(){clearPrecision();clearReplyBuilder();','function clearWriting(){clearBranching();clearPrecision();clearReplyBuilder();');
replaceUnique(' renderPrecision();\n const g=writingGuide(),t=g.scenarios[dialogueSceneIndex].turns[dialogueTurnIndex];',' renderPrecision();\n renderBranching();\n const g=writingGuide(),t=g.scenarios[dialogueSceneIndex].turns[dialogueTurnIndex];');
replaceUnique("byId('precision-retry').addEventListener('click',resetPrecision);",`byId('precision-retry').addEventListener('click',resetPrecision);
byId('branch-check').addEventListener('click',checkBranching);
byId('branch-next').addEventListener('click',nextBranching);
byId('branch-reset').addEventListener('click',restartBranching);
byId('branch-copy').addEventListener('click',copyBranching);
byId('writing-draft').addEventListener('input',()=>{if(branchCopyPending){branchCopyPending=false;byId('branch-copy').textContent='Use my selected lines as an editable writing draft';}});`);
const out=path.join(root,'labs/hf85-branching-professional-roleplay-offline.html');
fs.writeFileSync(out,html,'utf8');console.log('HF85 deterministic branching professional roleplay generated '+Buffer.byteLength(html)+' bytes');
