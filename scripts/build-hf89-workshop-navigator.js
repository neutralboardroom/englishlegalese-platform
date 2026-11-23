/* HF89 deterministic, additive EnglishLegalese-only writing activity navigator. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const {getNavigator,ACTIVITIES,LOCALES}=require('../src/trcfAdultWorkshopNavigator');
const root=path.resolve(__dirname,'..');
let html=fs.readFileSync(path.join(root,'labs/hf88-professional-meeting-minutes-offline.html'),'utf8');
function once(a,b){if(html.split(a).length!==2)throw Error('HF88 unchanged unique anchor missing '+a.slice(0,90));html=html.replace(a,b);}
const labels={};for(const l of LOCALES)labels[l]=getNavigator(l);
const data=JSON.stringify(labels).replace(/</g,'\u003c').replace(/>/g,'\u003e').replace(/&/g,'\u0026');
once('<title>EnglishLegalese HF88 · Meeting Minutes and Action Items Workshop</title>','<title>EnglishLegalese HF89 · Professional Writing Activity Navigator</title>');
once('Internal development preview HF88','Internal development preview HF89');
once('</style>',String.raw`
.workshop-navigator{margin:17px 0;padding:16px;border-radius:12px;border:2px solid #9bbcd8;background:#edf6fd}
.workshop-navigator[hidden]{display:none!important}
.workshop-navigator h3{margin:0 0 8px;font-size:1.08rem;color:#183d68}
.workshop-navigator select{max-width:100%;width:100%;padding:12px;margin-bottom:8px;background:white}
.workshop-navigator .navigator-purpose{margin:8px 0;padding:10px;background:white;border-left:4px solid #28699a;overflow-wrap:anywhere}
.workshop-navigator [lang]:not(button){overflow-wrap:anywhere}
.workshop-navigator button:focus-visible,.workshop-navigator select:focus-visible{outline:3px solid #e0aa41;outline-offset:2px}
</style>`);
const section=String.raw`<section id="workshop-navigator" class="workshop-navigator" aria-label="Select professional writing practice" hidden>
<h3 lang="en">Choose your professional English writing activity</h3>
<p id="navigator-intro" class="native-copy"></p>
<label for="navigator-activity">Choose one of seven activities</label>
<select id="navigator-activity" aria-describedby="navigator-purpose"></select>
<p id="navigator-purpose" class="navigator-purpose" lang="en"></p>
<p id="navigator-privacy" class="writing-privacy"></p>
<button id="navigator-open" type="button">Open selected activity</button>
<p id="navigator-status" class="small" role="status" aria-live="polite"></p>
</section>`;
once('<details id="writing-workshop" class="writing-workshop"',section+'\n<details id="writing-workshop" class="writing-workshop"');
const script=`const NAVIGATOR_DATA=${data};
const NAVIGATOR_TARGETS=${JSON.stringify(ACTIVITIES.map(a=>a.id))};
function navigatorLocale(){return NAVIGATOR_DATA[byId('locale').value];}
function renderNavigator(){
 const panel=byId('workshop-navigator');panel.hidden=stopped||step!==3;
 if(panel.hidden)return;
 const d=navigatorLocale();byId('navigator-intro').lang=d.locale;byId('navigator-intro').textContent=d.guidance.intro;
 byId('navigator-privacy').lang=d.locale;byId('navigator-privacy').textContent=d.guidance.privacy;
 byId('navigator-open').textContent=d.guidance.button;
 const sel=byId('navigator-activity');if(sel.options.length!==d.activities.length){sel.replaceChildren();d.activities.forEach(a=>{const o=document.createElement('option');o.value=a.id;o.textContent=a.name;sel.append(o);});}
 if(!NAVIGATOR_TARGETS.includes(sel.value))sel.value='original';
 renderNavigatorPurpose();
}
function renderNavigatorPurpose(){const d=navigatorLocale(),a=d.activities.find(x=>x.id===byId('navigator-activity').value);
 byId('navigator-purpose').textContent=a.purpose;
 byId('navigator-status').textContent=d.guidance.ready;
}
function clearNavigator(){byId('navigator-activity').value='original';byId('navigator-status').textContent='';}
function openNavigatorActivity(){
 if(stopped||step!==3)return;
 const d=navigatorLocale(),a=d.activities.find(x=>x.id===byId('navigator-activity').value);if(!a)return;
 const studio=byId('writing-workshop');if(studio.hidden)return;
 studio.open=true;
 d.activities.filter(x=>x.id!=='original').forEach(x=>{byId(x.target).open=x.id===a.id;});
 const target=a.id==='original'?byId('writing-draft'):byId(a.target).querySelector('summary');
 target.focus();byId('navigator-status').textContent=d.guidance.opened+a.name+'. Existing drafts remain intact.';
}
`;
once('const phases={intro:',script+'\nconst phases={intro:');
once('function clearWriting(){clearMinutes();','function clearWriting(){clearNavigator();clearMinutes();');
once(" const panel=byId('writing-workshop');panel.hidden=stopped||step!==3;", " const panel=byId('writing-workshop');panel.hidden=stopped||step!==3;renderNavigator();");
once("byId('minutes-clear').addEventListener('click',resetMinutes);", "byId('minutes-clear').addEventListener('click',resetMinutes);\nbyId('navigator-activity').addEventListener('change',renderNavigatorPurpose);\nbyId('navigator-open').addEventListener('click',openNavigatorActivity);");
const dest=path.join(root,'labs/hf89-professional-writing-navigator-offline.html');
fs.writeFileSync(dest,html,'utf8');console.log('HF89 HTML '+Buffer.byteLength(html,'utf8')+' bytes');
