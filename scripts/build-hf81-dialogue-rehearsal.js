/* HF81 composes the verified HF80 HTML with an isolated local role-play panel.
 * Does not modify the HF80 source or any site route; no external dependencies.
 */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {getDialogueScenarios,SUPPORTED_EXPLANATION_LOCALES,PROFILES}=require('../src/trcfAdultDialogueRehearsal');
const root=path.resolve(__dirname,'..');
const predecessor=path.join(root,'labs/hf80-interactive-adult-practice-offline.html');
const target=path.join(root,'labs/hf81-adult-conversation-coach-offline.html');
let html=fs.readFileSync(predecessor,'utf8');
const scenarios={};for(const locale of SUPPORTED_EXPLANATION_LOCALES){scenarios[locale]={};for(const profile of PROFILES)scenarios[locale][profile]=getDialogueScenarios({profile,explanationLocale:locale});}
const data=JSON.stringify(scenarios).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028|\u2029/g,' ');
function insert(needle,replacement){if(!html.includes(needle))throw Error('HF80 structure changed; refusing unsafe insertion at '+needle.slice(0,60));html=html.replace(needle,replacement);}
insert('<title>EnglishLegalese HF80 · Teacher Roger Avatar · Interactive Offline Rehearsal</title>','<title>EnglishLegalese HF81 · Teacher Roger Avatar · Scripted Conversation Rehearsal</title>');
insert('Internal development preview HF80','Internal development preview HF81');
insert('</style>',`
.dialogue-panel{background:#f8fbff;border:1px solid #abc5df;border-radius:12px;padding:17px;margin:20px 0}
.dialogue-panel[hidden],.dialogue-feedback[hidden]{display:none}
.dialogue-panel select{margin-top:7px}.dialogue-speaker{border-left:4px solid #215b8b;background:#edf4fc;padding:16px;border-radius:8px;font-size:1.08rem;margin:14px 0}
.dialogue-option{display:flex;align-items:flex-start;gap:10px;border:1px solid #aebfd0;border-radius:9px;padding:12px;background:white;margin:9px 0;cursor:pointer;font-weight:500}
.dialogue-option input{margin-top:4px;width:18px;height:18px;flex:none}
.dialogue-feedback{background:white;border-left:4px solid #246284;padding:13px 16px;margin-top:14px}
.dialogue-hint{font-size:.95rem;color:#355674}.dialogue-count{margin:12px 0 4px;font-weight:700;color:#1f4c78}
.dialogue-panel button:focus-visible,.dialogue-option:focus-within{outline:3px solid #dfac35;outline-offset:3px}
</style>`);
const panel=`<section class="dialogue-panel" id="dialogue-panel" hidden aria-label="Scripted professional conversation role-play">
<h3>Conversation Lab — professional English in context</h3>
<p class="small">Read the fictional instructor prompt and practice a complete English response. This is a finite script, not a real AI conversation, spoken assessment, voice capture, legal advice, or teacher evaluation.</p>
<label for="dialogue-scene">Professional scenario</label><select id="dialogue-scene"></select>
<p class="dialogue-count" id="dialogue-count"></p>
<div class="dialogue-speaker"><strong>Fictional teacher / client says:</strong><p id="dialogue-prompt" lang="en"></p></div>
<p class="english-copy" lang="en" id="dialogue-direction-en"></p>
<p class="native-copy dialogue-hint" id="dialogue-direction-native"></p>
<fieldset id="dialogue-options"><legend>Which English reply is clearest and most professional?</legend></fieldset>
<div class="controls"><button type="button" id="dialogue-check">Check response</button><button type="button" class="secondary" id="dialogue-reveal">Reveal model</button><button type="button" class="secondary" id="dialogue-next">Next exchange</button><button type="button" class="secondary" id="dialogue-restart">Restart scenario</button></div>
<div id="dialogue-feedback" class="dialogue-feedback" role="status" aria-live="polite" hidden></div><p class="small" id="dialogue-status" role="status" aria-live="polite"></p>
</section>`;
insert('<div class="english-model"><strong>English model sentence</strong>',panel+'\n<div class="english-model"><strong>English model sentence</strong>');
const js=`const DIALOGUE_DATA=${data};
let dialogueSceneIndex=0,dialogueTurnIndex=0,dialogueComplete=false;
function availableDialogue(){return DIALOGUE_DATA[byId('locale').value][byId('track').value];}
function currentDialogue(){return availableDialogue()[dialogueSceneIndex].turns[dialogueTurnIndex];}
function clearDialogue(){
 dialogueSceneIndex=0;dialogueTurnIndex=0;dialogueComplete=false;
 byId('dialogue-feedback').hidden=true;byId('dialogue-feedback').replaceChildren();
 byId('dialogue-status').textContent='';
}
function setDialogueMessage(title,shown){
 const e=byId('dialogue-feedback');e.replaceChildren();
 const heading=document.createElement('strong');heading.textContent=title;e.append(heading);
 if(shown){const t=currentDialogue(),m=document.createElement('p');m.textContent='English model: '+t.modelEnglish;m.lang='en';
 const en=document.createElement('p');en.textContent=t.rationaleEnglish;en.lang='en';
 const native=document.createElement('p');native.textContent=t.rationaleNative;native.lang=t.nativeLang;
 const caution=document.createElement('small');caution.textContent='Unreviewed teaching translation. No recording, AI scoring, advice or persistence.';
 e.append(m,en,native,caution);}e.hidden=false;
}
function renderDialogue(){
 const panel=byId('dialogue-panel');panel.hidden=stopped||step!==3;
 if(panel.hidden){byId('dialogue-feedback').hidden=true;return;}
 const cases=availableDialogue(),select=byId('dialogue-scene');select.replaceChildren();
 cases.forEach((s,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=s.titleEnglish;select.append(o)});select.value=String(dialogueSceneIndex);
 const current=cases[dialogueSceneIndex],t=currentDialogue();
 byId('dialogue-count').textContent='Exchange '+(dialogueTurnIndex+1)+' of '+current.turns.length+' · '+current.titleEnglish;
 byId('dialogue-prompt').textContent=t.promptEnglish;
 byId('dialogue-direction-en').textContent=current.directionsEnglish;
 byId('dialogue-direction-native').textContent=current.directionsNative;
 byId('dialogue-direction-native').lang=t.nativeLang;
 const field=byId('dialogue-options');field.querySelectorAll('label').forEach(x=>x.remove());
 t.optionsEnglish.forEach((option,i)=>{const label=document.createElement('label');label.className='dialogue-option';
 const radio=document.createElement('input');radio.type='radio';radio.name='dialogue-answer';radio.value=String(i);radio.disabled=dialogueComplete;
 const text=document.createElement('span');text.textContent=option;label.append(radio,text);field.append(label);});
 byId('dialogue-check').disabled=dialogueComplete;
 byId('dialogue-next').disabled=!dialogueComplete||dialogueTurnIndex===current.turns.length-1;
 byId('dialogue-status').textContent=dialogueComplete?'Model compared. You may continue, restart, or choose another scenario.':'Select a full English response. Model rationale remains hidden until you check a matching answer or deliberately reveal it.';
}
function checkDialogue(explicitReveal){
 if(stopped||step!==3||dialogueComplete)return;
 const selected=byId('dialogue-options').querySelector('input:checked');
 if(!explicitReveal&&!selected){byId('dialogue-status').textContent='Choose one answer before checking, or deliberately reveal the model.';return;}
 const t=currentDialogue();
 if(!explicitReveal&&Number(selected.value)!==t.bestOptionIndex){
  setDialogueMessage('This is not the strongest scripted response. Try another choice, or reveal the model.',false);
  byId('dialogue-status').textContent='The model response is still concealed. No score or grade was stored.';return;
 }
 dialogueComplete=true;
 setDialogueMessage(explicitReveal?'Model answer deliberately revealed':'Matches the fixed scripted model',true);
 byId('dialogue-options').querySelectorAll('input').forEach(x=>x.disabled=true);
 byId('dialogue-check').disabled=true;
 byId('dialogue-next').disabled=dialogueTurnIndex===availableDialogue()[dialogueSceneIndex].turns.length-1;
 byId('dialogue-status').textContent=dialogueTurnIndex===availableDialogue()[dialogueSceneIndex].turns.length-1?'Scenario complete. Choose another scenario or Restart scenario.':'Continue to the next exchange when ready.';
}
function changeDialogueScene(ix){if(stopped||step!==3)return;dialogueSceneIndex=ix;dialogueTurnIndex=0;dialogueComplete=false;byId('dialogue-feedback').hidden=true;byId('dialogue-feedback').replaceChildren();renderDialogue();}
`;
insert('const phases=',js+'\nconst phases=');
insert('function clearPractice(){practiceIndex=0;practiceChecked=false;','function clearPractice(){clearDialogue();practiceIndex=0;practiceChecked=false;');
insert(' renderPractice();\n byId(\'status\').textContent=', ' renderPractice();\n renderDialogue();\n byId(\'status\').textContent=');
const handlers=`byId('dialogue-check').addEventListener('click',()=>checkDialogue(false));
byId('dialogue-reveal').addEventListener('click',()=>checkDialogue(true));
byId('dialogue-next').addEventListener('click',()=>{
 if(stopped||step!==3||!dialogueComplete)return;
 if(dialogueTurnIndex<availableDialogue()[dialogueSceneIndex].turns.length-1){dialogueTurnIndex++;dialogueComplete=false;byId('dialogue-feedback').hidden=true;byId('dialogue-feedback').replaceChildren();renderDialogue();}
});
byId('dialogue-restart').addEventListener('click',()=>changeDialogueScene(dialogueSceneIndex));
byId('dialogue-scene').addEventListener('change',()=>changeDialogueScene(Number(byId('dialogue-scene').value)));
render();`;
insert('render();\n</script></body></html>',handlers+'\n</script></body></html>');
// Self-contained and intentionally never imports runtime libraries or loads network content.
fs.writeFileSync(target,html,'utf8');
console.log('HF81 offline HTML '+target+' '+Buffer.byteLength(html,'utf8')+' bytes');
