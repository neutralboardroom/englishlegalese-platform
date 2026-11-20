/* Compose exact HF81 stable offline source into HF82 with a self-directed writing studio.
 * No external libraries at runtime. All text is fictional adult training only.
 */
'use strict';
const fs=require('node:fs');const path=require('node:path');
const {getResponseStudio,SUPPORTED_EXPLANATION_LOCALES,PROFILES}=require('../src/trcfAdultResponseStudio');
const root=path.resolve(__dirname,'..');
const predecessor=path.join(root,'labs/hf81-adult-conversation-coach-offline.html');
const output=path.join(root,'labs/hf82-private-response-studio-offline.html');
let html=fs.readFileSync(predecessor,'utf8');
const DATA={};for(const lang of SUPPORTED_EXPLANATION_LOCALES){DATA[lang]={};for(const track of PROFILES)DATA[lang][track]=getResponseStudio({profile:track,explanationLocale:lang});}
const json=JSON.stringify(DATA).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
function insert(a,b){if(html.split(a).length!==2)throw Error('HF81 predecessor does not have exactly one safe anchor '+a.slice(0,60));html=html.replace(a,b)}
insert('<title>EnglishLegalese HF81 · Teacher Roger Avatar · Scripted Conversation Rehearsal</title>', '<title>EnglishLegalese HF82 · Professional English Private Response Studio</title>');
insert('Internal development preview HF81','Internal development preview HF82');
insert('</style>',`
.writing-workshop{margin-top:18px;padding:16px;border:1px solid #9db7d5;border-radius:12px;background:#fff}
.writing-workshop[hidden]{display:none}.writing-workshop summary{font-weight:700;cursor:pointer;color:#173d60}
.writing-workshop textarea{width:100%;min-height:122px;border:1px solid #637f9b;border-radius:8px;padding:12px;font:inherit;resize:vertical;box-sizing:border-box}
.writing-workshop .writing-privacy{font-size:.91rem;border-left:3px solid #a36a00;padding:9px 12px;background:#fff6e6}
.writing-workshop fieldset{border:1px solid #a9bccb;border-radius:8px;margin:12px 0;padding:12px}
.writing-workshop .writing-check{display:flex;align-items:start;gap:12px;font-weight:400;margin:12px 0}
.writing-workshop .writing-check input{margin-top:4px;flex:0 0 18px;width:18px;height:18px}
.writing-workshop .writing-copy{margin:9px 0;padding:9px 12px;border-radius:8px;background:#f0f5fa;overflow-wrap:anywhere}
.writing-workshop .writing-model[hidden]{display:none}.writing-workshop textarea:focus-visible,.writing-workshop summary:focus-visible{outline:3px solid #deaa31;outline-offset:2px}
</style>`);
const panel=`<details id="writing-workshop" class="writing-workshop" aria-label="Private English response studio">
<summary>Write your own reply — private, not AI-graded</summary>
<p>Go beyond multiple choice. Write your own professional English response to the fictional prompt above; then check your meaning and tone. No real client information.</p>
<p class="english-copy" lang="en">English-first practice: explain the answer clearly, respectfully, and accurately. Different good responses are possible.</p>
<p id="writing-direction-native" class="native-copy"></p>
<p id="writing-privacy-native" class="writing-privacy"></p>
<label for="writing-draft">My original English response (local to this tab only)</label>
<textarea id="writing-draft" maxlength="1200" rows="5" autocomplete="off" spellcheck="true" placeholder="Write a fictional professional reply in English. Never enter actual private information."></textarea>
<p class="small" id="writing-word-count" aria-live="polite">0 words · maximum 1200 characters</p>
<fieldset><legend>Self-review — tick what you believe you have done</legend><p class="small">You decide; these are not automatic results.</p><div id="writing-checklist"></div></fieldset>
<div class="controls"><button id="writing-compare" type="button">Deliberately compare with model</button><button id="writing-clear" type="button" class="secondary">Clear my draft</button></div>
<p class="small" role="status" aria-live="polite" id="writing-notice">A comparison is available by your explicit choice. No automated language assessment is performed.</p>
<div id="writing-model" class="writing-model" hidden aria-live="polite"></div>
</details>`;
insert('<div class="controls"><button type="button" id="dialogue-check">',panel+'\n<div class="controls"><button type="button" id="dialogue-check">');
const js=`const WRITING_DATA=${json};
function writingGuide(){return WRITING_DATA[byId('locale').value][byId('track').value];}
function clearWriting(){
 byId('writing-draft').value='';byId('writing-word-count').textContent='0 words · maximum 1200 characters';
 byId('writing-model').hidden=true;byId('writing-model').replaceChildren();
 byId('writing-notice').textContent='A comparison is available by your explicit choice. No automated language assessment is performed.';
 byId('writing-workshop').open=false;
 byId('writing-checklist').querySelectorAll('input').forEach(x=>x.checked=false);
}
function renderWriting(){
 const panel=byId('writing-workshop');panel.hidden=stopped||step!==3;
 if(panel.hidden)return;
 const g=writingGuide(),t=g.scenarios[dialogueSceneIndex].turns[dialogueTurnIndex];
 byId('writing-direction-native').lang=g.explanationLocale;
 byId('writing-direction-native').textContent=g.guidance.introduction;
 byId('writing-privacy-native').lang=g.explanationLocale;
 byId('writing-privacy-native').textContent=g.guidance.privacy;
 const list=byId('writing-checklist');list.replaceChildren();
 g.guidance.checklist.forEach((native,i)=>{const lab=document.createElement('label');lab.className='writing-check';
  const box=document.createElement('input');box.type='checkbox';box.name='writing-checklist';box.value=String(i);
  const el=document.createElement('span');const e=document.createElement('strong');
  e.textContent=['Meaning and accuracy','Respectful professional tone','Clear next action or limitation'][i]+': ';
  const translated=document.createElement('span');translated.textContent=native;translated.lang=g.explanationLocale;
  el.append(e,translated);lab.append(box,el);list.append(lab);});
 byId('writing-draft').dataset.prompt=t.promptEnglish;
}
function writingCount(){const s=byId('writing-draft').value.trim();
 const count=s?s.split(/\\s+/u).length:0;
 byId('writing-word-count').textContent=count+' words · '+byId('writing-draft').value.length+' / 1200 characters';
 if(!byId('writing-model').hidden){byId('writing-model').hidden=true;byId('writing-model').replaceChildren();byId('writing-notice').textContent='Your writing changed: explicitly compare again to see the model.';}
}
function compareWriting(){
 if(stopped||step!==3)return;
 const g=writingGuide(),t=g.scenarios[dialogueSceneIndex].turns[dialogueTurnIndex];
 const box=byId('writing-model');box.replaceChildren();
 for(const [s,lang] of [['English model: '+t.modelEnglish,'en'],[t.rationaleEnglish,'en'],[t.rationaleNative,g.explanationLocale],[g.guidance.comparison,g.explanationLocale],[g.guidance.noGrade,g.explanationLocale]]){
  const p=document.createElement('p');p.className='writing-copy';p.lang=lang;p.textContent=s;box.append(p);}
 box.hidden=false;
 const ticks=byId('writing-checklist').querySelectorAll('input:checked').length;
 const words=byId('writing-draft').value.trim().split(/\\s+/u).filter(Boolean).length;
 byId('writing-notice').textContent='Model displayed by your choice. '+words+' words written; '+ticks+' of 3 self-check items selected. This is not an AI score, a teacher assessment, or proof of correctness.';
}
`;
insert('const phases={intro:',js+'\nconst phases={intro:');
insert('function clearPractice(){clearDialogue();practiceIndex=0;','function clearPractice(){clearWriting();clearDialogue();practiceIndex=0;');
insert('function changeDialogueScene(ix){if(stopped||step!==3)return;','function changeDialogueScene(ix){if(stopped||step!==3)return;clearWriting();');
insert(' renderDialogue();\n byId(\'status\').textContent=', ' renderDialogue();\n renderWriting();\n byId(\'status\').textContent=');
insert('renderDialogue();}\n});\nbyId(\'dialogue-restart\')','clearWriting();renderDialogue();renderWriting();}\n});\nbyId(\'dialogue-restart\')');
insert('byId(\'dialogue-scene\').addEventListener(\'change\',()=>changeDialogueScene(Number(byId(\'dialogue-scene\').value)));',"byId('dialogue-scene').addEventListener('change',()=>{changeDialogueScene(Number(byId('dialogue-scene').value));renderWriting();});\nbyId('dialogue-restart').addEventListener('click',renderWriting);\nbyId('writing-draft').addEventListener('input',writingCount);\nbyId('writing-compare').addEventListener('click',compareWriting);\nbyId('writing-clear').addEventListener('click',clearWriting);");
fs.writeFileSync(output,html,'utf8');console.log('HF82 standalone generated '+Buffer.byteLength(html,'utf8')+' bytes');
