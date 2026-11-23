/* Compose cumulative HF84 from the exact HF83 offline EnglishLegalese app.
 * Strict unique anchor check prevents silently overwriting a changed baseline.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const {getPrecisionLab,SUPPORTED_EXPLANATION_LOCALES,PROFILES}=require('../src/trcfAdultPrecisionLab');
const root=path.resolve(__dirname,'..');
let html=fs.readFileSync(path.join(root,'labs/hf83-structured-professional-reply-builder-offline.html'),'utf8');
const data={};for(const lang of SUPPORTED_EXPLANATION_LOCALES){data[lang]={};for(const profile of PROFILES)data[lang][profile]=getPrecisionLab({profile,explanationLocale:lang});}
const embedded=JSON.stringify(data).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
function insert(needle,addition){if(html.split(needle).length!==2)throw Error('HF83 unique anchor not found: '+needle.slice(0,80));html=html.replace(needle,addition)}
insert('<title>EnglishLegalese HF83 · Structured Professional English Reply Builder</title>','<title>EnglishLegalese HF84 · Professional Precision Challenge</title>');
insert('Internal development preview HF83','Internal development preview HF84');
insert('</style>',`
.precision-lab{margin:16px 0;border:1px solid #8faebc;border-radius:10px;background:#f6fbfa;padding:15px}
.precision-lab summary{font-weight:750;color:#195e5b;cursor:pointer}
.precision-lab .precision-option{display:flex;gap:11px;align-items:start;padding:12px;margin:10px 0;border:1px solid #adc6c5;border-radius:9px;background:white;font-weight:500}
.precision-lab .precision-option input{flex:none;margin-top:4px;width:18px;height:18px}
.precision-lab #precision-feedback{border-left:4px solid #266c66;padding:14px;margin:12px 0;background:#fff}
.precision-lab #precision-feedback[hidden]{display:none}.precision-lab .precision-meta{font-size:.95rem;color:#315d58}
.precision-lab button:focus-visible,.precision-lab summary:focus-visible{outline:3px solid #d7a53b;outline-offset:3px}
</style>`);
const panel=`<details id="precision-lab" class="precision-lab" aria-label="Professional precision practice">
<summary>Precision Challenge — choose clearer professional wording</summary>
<p lang="en">Two responses may sound possible. Choose the wording that best matches this fictional professional situation. An incorrect choice keeps the model hidden; you can retry or deliberately reveal it. This is not an AI grade.</p>
<p id="precision-intro-native" class="native-copy"></p><p id="precision-privacy-native" class="precision-meta"></p>
<p id="precision-focus" lang="en"></p><p id="precision-question" lang="en"></p>
<fieldset id="precision-options"><legend>Which English response is more precise here?</legend></fieldset>
<div class="controls"><button id="precision-check" type="button">Check my choice</button><button id="precision-reveal" type="button" class="secondary">Deliberately reveal the model</button><button id="precision-retry" type="button" class="secondary">Try again / hide answer</button></div>
<p id="precision-status" class="precision-meta" role="status" aria-live="polite">Select a choice before checking. No learner choice is saved.</p>
<div id="precision-feedback" role="status" aria-live="polite" hidden></div>
</details>`;
insert('<label for="writing-draft">',panel+'\n<label for="writing-draft">');
const js=`const PRECISION_DATA=${embedded};
let precisionComplete=false;
function currentPrecision(){return PRECISION_DATA[byId('locale').value][byId('track').value];}
function clearPrecision(){
 precisionComplete=false;byId('precision-lab').open=false;
 byId('precision-options').querySelectorAll('label').forEach(x=>x.remove());
 byId('precision-feedback').replaceChildren();byId('precision-feedback').hidden=true;
 byId('precision-check').disabled=false;
 byId('precision-status').textContent='Select a choice before checking. No learner choice is saved.';
}
function renderPrecision(){
 const data=currentPrecision(),t=data.scenarios[dialogueSceneIndex].turns[dialogueTurnIndex];
 byId('precision-intro-native').textContent=data.guidance.intro;byId('precision-intro-native').lang=data.explanationLocale;
 byId('precision-privacy-native').textContent=data.guidance.privacy;byId('precision-privacy-native').lang=data.explanationLocale;
 byId('precision-focus').textContent='Focus: '+t.focusEnglish;
 byId('precision-question').textContent=t.questionEnglish;
 const field=byId('precision-options');field.querySelectorAll('label').forEach(x=>x.remove());
 t.choicesEnglish.forEach((choice,i)=>{const label=document.createElement('label');label.className='precision-option';
  const input=document.createElement('input');input.type='radio';input.name='precision-choice';input.value=String(i);input.disabled=precisionComplete;
  const span=document.createElement('span');span.lang='en';span.textContent=choice;label.append(input,span);field.append(label);});
 byId('precision-check').disabled=precisionComplete;
}
function precisionFeedback(title,includeModel){
 const data=currentPrecision(),t=data.scenarios[dialogueSceneIndex].turns[dialogueTurnIndex];
 const box=byId('precision-feedback');box.replaceChildren();
 const heading=document.createElement('strong');heading.textContent=title;box.append(heading);
 if(includeModel){for(const [s,lang] of [['English example: '+t.choicesEnglish[t.bestOptionIndex],'en'],[t.englishRationale,'en'],[t.nativeRationale,t.nativeLang],[data.guidance.review,data.explanationLocale]]){
  const el=document.createElement('p');el.textContent=s;el.lang=lang;box.append(el);}}
 box.hidden=false;
}
function checkPrecision(reveal){
 if(stopped||step!==3||precisionComplete)return;
 const data=currentPrecision(),t=data.scenarios[dialogueSceneIndex].turns[dialogueTurnIndex];
 const input=byId('precision-options').querySelector('input:checked');
 if(!reveal&&!input){byId('precision-status').textContent='Choose a response before checking, or deliberately reveal the model.';return;}
 if(!reveal&&Number(input.value)!==t.bestOptionIndex){
  precisionFeedback(data.guidance.wrong,false);byId('precision-status').textContent='Model still hidden. Try another choice; nothing was graded or stored.';return;}
 precisionComplete=true;precisionFeedback(data.guidance.correct,true);
 byId('precision-check').disabled=true;
 byId('precision-options').querySelectorAll('input').forEach(x=>x.disabled=true);
 byId('precision-status').textContent=reveal?'Model intentionally revealed. No score or learner data saved.':'Matches the scripted example. No AI scoring or learner data saved.';
}
function resetPrecision(){const wasOpen=byId('precision-lab').open;clearPrecision();renderPrecision();byId('precision-lab').open=wasOpen;}
`;
insert('const phases={intro:',js+'\nconst phases={intro:');
insert('function clearWriting(){clearReplyBuilder();','function clearWriting(){clearPrecision();clearReplyBuilder();');
insert(' renderReplyBuilder();\n const g=writingGuide(),t=g.scenarios[dialogueSceneIndex].turns[dialogueTurnIndex];',' renderReplyBuilder();\n renderPrecision();\n const g=writingGuide(),t=g.scenarios[dialogueSceneIndex].turns[dialogueTurnIndex];');
insert("byId('reply-reset').addEventListener('click',()=>{clearReplyBuilder();renderReplyBuilder();});",`byId('reply-reset').addEventListener('click',()=>{clearReplyBuilder();renderReplyBuilder();});
byId('precision-check').addEventListener('click',()=>checkPrecision(false));
byId('precision-reveal').addEventListener('click',()=>checkPrecision(true));
byId('precision-retry').addEventListener('click',resetPrecision);`);
const out=path.join(root,'labs/hf84-professional-precision-challenge-offline.html');fs.writeFileSync(out,html);console.log('HF84 generated '+Buffer.byteLength(html)+' bytes');
