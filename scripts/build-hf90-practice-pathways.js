/* HF90 deterministic additive guided practice pathways from full HF89 source. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const {getPracticePaths,PATHWAYS,LOCALES}=require('../src/trcfAdultPracticePaths');
const root=path.resolve(__dirname,'..');
let html=fs.readFileSync(path.join(root,'labs/hf89-professional-writing-navigator-offline.html'),'utf8');
function once(a,b){if(html.split(a).length!==2)throw Error('HF89 unique intact anchor absent: '+a.slice(0,80));html=html.replace(a,b)}
const DATA={};for(const l of LOCALES)DATA[l]=getPracticePaths(l);
const data=JSON.stringify(DATA).replace(/</g,'\u003c').replace(/>/g,'\u003e').replace(/&/g,'\u0026');
once('<title>EnglishLegalese HF89 · Professional Writing Activity Navigator</title>','<title>EnglishLegalese HF90 · Guided Professional Practice Pathways</title>');
once('Internal development preview HF89','Internal development preview HF90');
once('</style>',String.raw`
.practice-path{margin:17px 0;padding:16px;border-radius:12px;border:2px solid #7ca39b;background:#f1faf7;color:#1b3736}
.practice-path[hidden]{display:none!important}.practice-path h3{font-size:1.08rem;margin:0 0 8px}
.practice-path select{width:100%;max-width:100%;padding:12px;background:white;margin:8px 0}
.practice-path .pathway-card{margin:10px 0;padding:12px;border-left:4px solid #24806e;background:white;border-radius:6px;overflow-wrap:anywhere}
.practice-path .pathway-controls{display:flex;flex-wrap:wrap;gap:9px}
.practice-path .pathway-controls button{white-space:normal;min-height:44px}
.practice-path .pathway-controls button:focus-visible,.practice-path select:focus-visible{outline:3px solid #dfaf42;outline-offset:2px}
.practice-path [lang]{overflow-wrap:anywhere}
</style>`);
const panel=String.raw`<section id="practice-pathways" class="practice-path" aria-label="Optional three-step professional English learning pathways" hidden>
<h3 lang="en">Guided professional English: three purposeful practice steps</h3>
<p id="pathway-native-intro" class="native-copy"></p><p id="pathway-native-privacy" class="writing-privacy"></p>
<label for="pathway-choice">Choose an optional three-step learning pathway</label><select id="pathway-choice"></select>
<div class="pathway-card"><p id="pathway-description" lang="en"></p><p id="pathway-context" lang="en"></p>
<strong id="pathway-progress" lang="en">Step 1 of 3 — not yet marked</strong><p id="pathway-goal" lang="en"></p></div>
<div class="pathway-controls"><button type="button" id="pathway-open">Open the step's activity</button><button type="button" id="pathway-mark">Mark this step practiced</button><button type="button" id="pathway-next" disabled>Next practice step</button><button type="button" id="pathway-restart" class="secondary">Restart pathway</button></div>
<p id="pathway-status" role="status" aria-live="polite">Self-check only. Not a teacher assessment or certificate.</p>
</section>`;
once('<section id="workshop-navigator"',panel+'\n<section id="workshop-navigator"');
const script=`const PATHWAY_DATA=${data};
let pathwayIndex=0,pathwayStep=0,pathwayPracticed=[false,false,false];
function currentPathway(){return PATHWAY_DATA[byId('locale').value].pathways[pathwayIndex]}
function pathwayLanguage(){return PATHWAY_DATA[byId('locale').value].guidance}
function clearPathway(){pathwayIndex=0;pathwayStep=0;pathwayPracticed=[false,false,false];byId('pathway-choice').value='clarity';byId('pathway-status').textContent='';}
function renderPathway(){
 const p=byId('practice-pathways');p.hidden=stopped||step!==3;if(p.hidden)return;
 const d=PATHWAY_DATA[byId('locale').value],g=d.guidance,sel=byId('pathway-choice');
 byId('pathway-native-intro').lang=d.locale;byId('pathway-native-intro').textContent=g.intro;
 byId('pathway-native-privacy').lang=d.locale;byId('pathway-native-privacy').textContent=g.privacy;
 if(sel.options.length!==d.pathways.length){sel.replaceChildren();d.pathways.forEach(x=>{const o=document.createElement('option');o.value=x.id;o.textContent=x.title;sel.append(o)})}
 sel.value=d.pathways[pathwayIndex].id;
 renderPathwayStep();
}
function renderPathwayStep(){
 if(stopped||step!==3)return;
 const p=currentPathway(),s=p.steps[pathwayStep],g=pathwayLanguage();
 byId('pathway-description').textContent=p.description;
 byId('pathway-context').textContent='Current fictional English scenario: '+minutesTurn().promptEnglish;
 byId('pathway-progress').textContent='Step '+(pathwayStep+1)+' of '+p.steps.length+(pathwayPracticed[pathwayStep]?' — self-marked practiced':' — not yet marked');
 byId('pathway-goal').textContent='Activity: '+NAVIGATOR_DATA[byId('locale').value].activities.find(a=>a.id===s.activity).name+'. Your goal: '+s.goal;
 byId('pathway-open').textContent=g.open;byId('pathway-mark').textContent=g.mark;
 byId('pathway-mark').disabled=pathwayPracticed[pathwayStep];
 byId('pathway-next').disabled=!pathwayPracticed[pathwayStep]||pathwayStep===p.steps.length-1;
 byId('pathway-next').textContent=g.next;byId('pathway-restart').textContent=g.restart;
 byId('pathway-status').textContent=pathwayPracticed.every(Boolean)?g.done:pathwayPracticed[pathwayStep]?g.marked:g.waiting;
}
function choosePathway(){
 if(stopped||step!==3)return;
 const ix=PATHWAY_DATA[byId('locale').value].pathways.findIndex(x=>x.id===byId('pathway-choice').value);
 if(ix<0)return;pathwayIndex=ix;pathwayStep=0;pathwayPracticed=[false,false,false];renderPathwayStep();
}
function openPathwayStep(){
 if(stopped||step!==3)return;
 const activity=currentPathway().steps[pathwayStep].activity;
 byId('navigator-activity').value=activity;renderNavigatorPurpose();openNavigatorActivity();
}
function markPathwayStep(){
 if(stopped||step!==3)return;
 pathwayPracticed[pathwayStep]=true;renderPathwayStep();
}
function nextPathwayStep(){
 if(stopped||step!==3||!pathwayPracticed[pathwayStep])return;
 if(pathwayStep>=currentPathway().steps.length-1)return;
 pathwayStep++;renderPathwayStep();openPathwayStep();
}
function restartPathway(){
 if(stopped||step!==3)return;
 pathwayStep=0;pathwayPracticed=[false,false,false];renderPathwayStep();
}
`;
once('const phases={intro:',script+'\nconst phases={intro:');
once('function clearWriting(){clearNavigator();','function clearWriting(){clearPathway();clearNavigator();');
once('const panel=byId(\'workshop-navigator\');panel.hidden=stopped||step!==3;',"const panel=byId('workshop-navigator');panel.hidden=stopped||step!==3;renderPathway();");
once("byId('navigator-open').addEventListener('click',openNavigatorActivity);","byId('navigator-open').addEventListener('click',openNavigatorActivity);\nbyId('pathway-choice').addEventListener('change',choosePathway);\nbyId('pathway-open').addEventListener('click',openPathwayStep);\nbyId('pathway-mark').addEventListener('click',markPathwayStep);\nbyId('pathway-next').addEventListener('click',nextPathwayStep);\nbyId('pathway-restart').addEventListener('click',restartPathway);");
const dest=path.join(root,'labs/hf90-guided-professional-practice-pathways-offline.html');
fs.writeFileSync(dest,html,'utf8');console.log('HF90 HTML '+Buffer.byteLength(html,'utf8')+' bytes');
