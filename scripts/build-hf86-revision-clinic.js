/* HF86 deterministic EnglishLegalese-only additive HTML generator. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const {getRevisionClinic,PROFILES,SUPPORTED_EXPLANATION_LOCALES}=require('../src/trcfAdultRevisionClinic');
const root=path.resolve(__dirname,'..');
let html=fs.readFileSync(path.join(root,'labs/hf85-branching-professional-roleplay-offline.html'),'utf8');
const data={};for(const locale of SUPPORTED_EXPLANATION_LOCALES){data[locale]={};for(const profile of PROFILES)data[locale][profile]=getRevisionClinic({profile,explanationLocale:locale});}
const embedded=JSON.stringify(data).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
function unique(a,b){if(html.split(a).length!==2)throw Error('HF85 predecessor unique anchor missing: '+a.slice(0,80));html=html.replace(a,b)}
unique('<title>EnglishLegalese HF85 · Branching Professional Roleplay Workshop</title>','<title>EnglishLegalese HF86 · Private Professional Revision Clinic</title>');
unique('Internal development preview HF85','Internal development preview HF86');
unique('</style>',String.raw`
.revision-clinic{margin:17px 0;padding:15px;border:1px solid #b2bdcd;border-radius:12px;background:#faf9ff}
.revision-clinic summary{color:#47427b;font-weight:750;cursor:pointer}
.revision-clinic .revision-goal{margin:9px 0;padding:8px 11px;border-left:3px solid #6a63a6;background:white;overflow-wrap:anywhere}
.revision-clinic .revision-model{background:white;border-left:4px solid #6961a4;padding:13px;margin:12px 0;overflow-wrap:anywhere}
.revision-clinic .revision-model[hidden]{display:none}
.revision-clinic textarea{width:100%;min-height:116px;border:1px solid #6c728b;border-radius:8px;padding:11px;font:inherit;box-sizing:border-box;resize:vertical}
.revision-clinic button:focus-visible,.revision-clinic summary:focus-visible,.revision-clinic textarea:focus-visible{outline:3px solid #d39f35;outline-offset:2px}
</style>`);
const panel=String.raw`<details id="revision-clinic" class="revision-clinic" aria-label="Private professional revision clinic">
<summary>Revision Clinic — improve your own professional English response</summary>
<p lang="en">Write a revised response to the current fictional adult professional situation. Use three context-specific criteria to self-check, then deliberately compare with a model. No AI interprets or grades your writing.</p>
<p id="revision-native-intro" class="native-copy"></p><p id="revision-native-privacy" class="writing-privacy"></p>
<p id="revision-focus" lang="en"></p><p id="revision-prompt" lang="en"></p>
<div id="revision-goals" aria-label="Three specific English revision checks"></div>
<label for="revision-draft">My revised English response (not sent or saved)</label>
<textarea id="revision-draft" maxlength="1200" autocomplete="off" spellcheck="true" placeholder="Write your own improved professional English response here."></textarea>
<p id="revision-count" class="small" aria-live="polite">0 words · 0 / 1200 characters</p>
<div class="controls"><button id="revision-compare" type="button">Deliberately compare with the scripted model</button><button id="revision-copy" type="button" class="secondary">Use my revision in the main writing draft</button><button id="revision-clear" type="button" class="secondary">Clear this revision</button></div>
<div id="revision-model" class="revision-model" aria-live="polite" hidden></div>
<p id="revision-status" class="small" role="status" aria-live="polite">Write your own revision before comparing. Nothing is scored or transmitted.</p>
</details>`;
unique('<label for="writing-draft">',panel+'\n<label for="writing-draft">');
const js=`const REVISION_DATA=${embedded};
let revisionCopyPending=false;
function revisionData(){return REVISION_DATA[byId('locale').value][byId('track').value];}
function clearRevision(){
 revisionCopyPending=false;byId('revision-clinic').open=false;
 byId('revision-draft').value='';byId('revision-model').hidden=true;byId('revision-model').replaceChildren();
 byId('revision-count').textContent='0 words · 0 / 1200 characters';
 byId('revision-goals').replaceChildren();byId('revision-copy').textContent='Use my revision in the main writing draft';
 byId('revision-status').textContent='Write your own revision before comparing. Nothing is scored or transmitted.';
}
function renderRevision(){
 if(stopped||step!==3)return;
 const g=revisionData(),t=g.scenarios[dialogueSceneIndex].turns[dialogueTurnIndex];
 byId('revision-native-intro').lang=g.explanationLocale;byId('revision-native-intro').textContent=g.guidance.intro;
 byId('revision-native-privacy').lang=g.explanationLocale;byId('revision-native-privacy').textContent=g.guidance.privacy;
 byId('revision-focus').textContent='Revision focus: '+t.focusEnglish;
 byId('revision-prompt').textContent='Current fictional prompt: '+t.promptEnglish;
 const items=byId('revision-goals');items.replaceChildren();
 t.goalsEnglish.forEach((goal,i)=>{const p=document.createElement('p');p.className='revision-goal';p.lang='en';p.textContent=(i+1)+'. '+goal;items.append(p);});
}
function revisionInput(){
 const el=byId('revision-draft'),v=el.value.trim(),words=v?v.split(/\\s+/u).length:0;
 byId('revision-count').textContent=words+' words · '+el.value.length+' / 1200 characters';
 byId('revision-model').hidden=true;byId('revision-model').replaceChildren();
 if(revisionCopyPending){revisionCopyPending=false;byId('revision-copy').textContent='Use my revision in the main writing draft';}
 byId('revision-status').textContent='Your revision changed. The previous comparison is hidden. No automated evaluation.';
}
function compareRevision(){
 if(stopped||step!==3)return;
 if(!byId('revision-draft').value.trim()) {byId('revision-status').textContent='Write your own English response first; the model is not revealed yet.';return;}
 const g=revisionData(),t=g.scenarios[dialogueSceneIndex].turns[dialogueTurnIndex],area=byId('revision-model');area.replaceChildren();
 for(const [s,lang] of [['Example English response: '+t.modelEnglish,'en'],['Why this wording is useful: '+t.rationaleEnglish,'en'],[t.rationaleNative,g.explanationLocale],[g.guidance.review,g.explanationLocale]]){
  const p=document.createElement('p');p.textContent=s;p.lang=lang;area.append(p);}
 area.hidden=false;byId('revision-status').textContent='Model revealed by your deliberate choice. This is neither an AI grade nor a claim that your answer is wrong.';
}
function copyRevision(){
 if(stopped||step!==3)return;
 const text=byId('revision-draft').value.trim(),main=byId('writing-draft');
 if(!text){byId('revision-status').textContent='Write your own English revision before copying.';return;}
 if(main.value.trim()&&!revisionCopyPending){revisionCopyPending=true;byId('revision-copy').textContent='Confirm replacement of my existing writing';byId('revision-status').textContent='Your existing writing is unchanged. Confirm explicitly to replace it.';return;}
 main.value=text;main.dispatchEvent(new Event('input',{bubbles:true}));
 revisionCopyPending=false;byId('revision-copy').textContent='Use my revision in the main writing draft';
 byId('revision-status').textContent='Your own edited response was copied to the main writing field. Nothing was scored or uploaded.';
}
`;
unique('const phases={intro:',js+'\nconst phases={intro:');
unique('function clearWriting(){clearBranching();','function clearWriting(){clearRevision();clearBranching();');
unique(' renderBranching();\n const g=writingGuide(),t=g.scenarios[dialogueSceneIndex].turns[dialogueTurnIndex];',' renderBranching();\n renderRevision();\n const g=writingGuide(),t=g.scenarios[dialogueSceneIndex].turns[dialogueTurnIndex];');
unique("byId('branch-copy').addEventListener('click',copyBranching);",`byId('branch-copy').addEventListener('click',copyBranching);
byId('revision-draft').addEventListener('input',revisionInput);
byId('revision-compare').addEventListener('click',compareRevision);
byId('revision-copy').addEventListener('click',copyRevision);
byId('revision-clear').addEventListener('click',()=>{const wasOpen=byId('revision-clinic').open;clearRevision();renderRevision();byId('revision-clinic').open=wasOpen;});
byId('writing-draft').addEventListener('input',()=>{if(revisionCopyPending){revisionCopyPending=false;byId('revision-copy').textContent='Use my revision in the main writing draft';}});`);
const target=path.join(root,'labs/hf86-private-professional-revision-clinic-offline.html');fs.writeFileSync(target,html,'utf8');console.log('HF86 GENERATED '+Buffer.byteLength(html)+' bytes');
