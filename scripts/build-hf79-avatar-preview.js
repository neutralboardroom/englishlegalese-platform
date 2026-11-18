/* HF79 standalone offline rehearsal of a future avatar-first multilingual instructor.
 * Not linked to production. No model, TTS, media, student data, storage or network.
 */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {getStaticLesson,LOCALE_LABELS,PROFILES}=require('../src/trcfAdultLessonLocales');
const lessons={};
for(const locale of Object.keys(LOCALE_LABELS)){
  lessons[locale]={};
  for(const profile of PROFILES)lessons[locale][profile]=getStaticLesson({explanationLocale:locale,profile});
}
const safeJSON=JSON.stringify({lessons,labels:LOCALE_LABELS}).replace(/</g,'\u003c').replace(/>/g,'\u003e').replace(/&/g,'\u0026');
const html=`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><meta name="referrer" content="no-referrer">
<title>EnglishLegalese HF79 · Teacher Roger Avatar · Offline Rehearsal</title>
<style>
:root{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color-scheme:light;--ink:#102237;--bg:#f5f7fb;--blue:#114775;--line:#cad5df;--gold:#956500}
*{box-sizing:border-box}body{margin:0;color:var(--ink);background:var(--bg);line-height:1.55}
header{background:#102b4b;color:#fff;padding:24px max(20px,calc((100% - 1060px)/2))}header h1{font-size:clamp(1.35rem,3vw,2rem);margin:2px 0 8px}
header p{margin:0;color:#dbe8f4}.eyebrow{font-size:.85rem;text-transform:uppercase;letter-spacing:.09em}
main{max-width:1060px;padding:25px 18px 50px;margin:auto;display:grid;grid-template-columns:280px 1fr;gap:20px}
section,.status{background:white;border:1px solid var(--line);border-radius:15px;padding:20px;box-shadow:0 1px 5px #1232}
label{font-weight:650;display:block;margin:10px 0 5px}select{width:100%;border:1px solid #7d8b9c;border-radius:8px;background:white;color:#102237;padding:12px;font-size:1rem}
button{padding:11px 18px;border:1px solid var(--blue);border-radius:8px;background:var(--blue);color:white;font-size:1rem;cursor:pointer}button.secondary{background:#fff;color:var(--blue)}button:disabled{opacity:.45;cursor:default}button:focus-visible,select:focus-visible{outline:3px solid #efb63c;outline-offset:2px}
.controls{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}.teacher{display:flex;align-items:center;gap:15px;margin-bottom:20px}.portrait{display:flex;align-items:center;justify-content:center;flex-shrink:0;width:76px;height:76px;background:#deebf6;color:#235075;border:2px dashed #5780a2;border-radius:50%;font-weight:bold;font-size:1.7rem}
h2{font-size:1.25rem;margin:0 0 4px}.phase{font-size:.83rem;color:#536679;text-transform:uppercase;font-weight:750;letter-spacing:.07em}
.prompts{padding:16px 18px;border-left:4px solid #1d628d;background:#edf4fc;border-radius:6px;white-space:pre-line;font-size:1.12rem;min-height:100px}.bilingual-block{border:1px solid var(--line);border-radius:10px;padding:14px;margin:12px 0;background:#fff}.bilingual-block h3{font-size:1.03rem;margin:0 0 4px}.bilingual-block p{margin:5px 0 11px}.english-copy{font-size:1.16rem;font-weight:580;color:#102237}.native-copy{font-size:1.03rem;color:#38506c;line-height:1.7}.glossary-item{border-top:1px solid #dbe4ec;padding:11px 0}.glossary-item:first-child{border-top:0}summary{cursor:pointer;font-weight:750;color:#144c7b}.english-model{background:#f8fbfe;border:1px solid var(--line);padding:14px;border-radius:8px}
.small{font-size:.88rem;color:#4b6076}p.warn{color:#744e00;background:#fff5d9;border:1px solid #dcc57e;padding:12px;border-radius:10px} .off{display:inline-block;background:#fae6e6;color:#7e2828;border-radius:99px;padding:4px 10px;font-size:.8rem;font-weight:700}
@media(max-width:740px){main{grid-template-columns:1fr;padding:16px 12px}.teacher{align-items:flex-start}section{padding:17px}}
</style></head><body>
<header><div class="eyebrow">EnglishLegalese · Internal development preview HF79</div><h1>AI Teacher Roger — multilingual lesson rehearsal</h1><p>Designed as the primary instructor for adult Legal English and Business English. This is a static prototype, not a connected AI avatar.</p></header>
<main><section aria-label="Lesson settings"><h2>Rehearsal settings</h2><label for="locale">Explanation language</label><select id="locale"></select>
<label for="track">English course</label><select id="track"><option value="legal-english">Legal English</option><option value="business-english">Business English</option></select>
<p class="small">Students learn English; explanations can be in Korean (South Korea), Thai, Vietnamese, Mandarin Chinese or English. Recorded voice, live avatar and AI dialog are not included here.</p>
<p class="warn">No microphone, no network, no personal records, no AI provider, no payments. Scripted fictional adult examples only. Translations require native-speaker review before live use.</p>
<button id="reset" class="secondary" type="button">Restart lesson</button></section>
<section aria-label="Avatar-first lesson preview"><div class="teacher"><div class="portrait" aria-hidden="true">TR</div><div><div class="off">Avatar not connected</div><h2>Teacher Roger Avatar <span class="small">(planned instructor)</span></h2><p class="small">Human Teacher Roger and additional teachers can supervise, assist and review.</p></div></div>
<div class="phase" id="stage-label">Ready</div><h2 id="stage-title">Lesson introduction</h2>
<div class="bilingual-block" aria-label="English and native lesson explanations"><h3>Explanation / Lesson content — English</h3><p id="lesson-english" class="english-copy" lang="en" aria-live="polite"></p><h3 id="native-explanation-label">Explanation — native language</h3><p id="lesson-text" class="native-copy" aria-live="polite"></p></div>
<div class="bilingual-block" aria-label="Activity directions in both languages"><h3>What to do — English directions</h3><p class="english-copy" id="direction-english" lang="en"></p><h3 id="native-direction-label">What to do — native-language directions</h3><p class="native-copy" id="direction-native"></p></div>
<details id="definitions-panel"><summary>Vocabulary: show definitions in English + native language</summary><div id="definitions-list"></div><p class="small">Preview definitions are authored drafts; check translations and jurisdiction-specific legal meaning with a qualified teacher.</p></details>
<div class="english-model"><strong>English model sentence</strong><p id="model"></p></div>
<div class="controls"><button type="button" class="secondary" id="back">Previous</button><button type="button" id="next">Next lesson step</button><button type="button" class="secondary" id="stop">Stop preview</button></div>
<p role="status" aria-live="polite" class="small" id="status"></p>
</section></main>
<script>
'use strict';
const DATA=${safeJSON};
const phases={intro:'Introduce',explain:'Explain',practice:'Practice',feedback:'Review',close:'Wrap up'};
const byId=id=>document.getElementById(id);
let step=0,stopped=false;
for(const [value,title] of Object.entries(DATA.labels)){const option=document.createElement('option');option.value=value;option.textContent=title;byId('locale').append(option)}
byId('locale').value='ko-KR';
function render(){
 const l=DATA.lessons[byId('locale').value][byId('track').value],p=l.stages[step];
 byId('stage-label').textContent='Step '+p.index+' of '+l.stages.length+' · '+phases[p.phase];
 byId('stage-title').textContent=phases[p.phase]+' · '+l.localeLabel;
 const language=byId('locale').value;
 byId('lesson-english').textContent=stopped?'Preview stopped. Restart to continue.':p.englishExplanation;
 byId('lesson-text').textContent=stopped?'':p.nativeExplanation;
 byId('lesson-text').lang=language;
 byId('native-explanation-label').textContent='Explanation — '+l.localeLabel;
 byId('direction-english').textContent=stopped?'':p.directionsEnglish;
 byId('direction-native').textContent=stopped?'':p.directionsNative;
 byId('direction-native').lang=language;
 byId('native-direction-label').textContent='Directions — '+l.localeLabel;
 const list=byId('definitions-list');list.replaceChildren();
 for(const term of l.glossary){
   const item=document.createElement('div');item.className='glossary-item';
   const title=document.createElement('strong');title.textContent=term.term;
   const english=document.createElement('p');english.textContent='English: '+term.englishDefinition;english.lang='en';
   const native=document.createElement('p');native.textContent=l.localeLabel+': '+term.nativeDefinition;native.lang=language;
   item.append(title,english,native);list.append(item);
 }
 byId('definitions-panel').open=false;
 byId('definitions-panel').hidden=stopped;
 byId('model').textContent=l.modelEnglish;
 byId('back').disabled=stopped||step===0;byId('next').disabled=stopped||step===l.stages.length-1;
 byId('status').textContent=stopped?'No response or learner information was saved.':'Scripted '+l.profile+' demo. Not a real AI or speaking avatar.';
}
byId('next').addEventListener('click',()=>{if(!stopped&&step<4){step++;render()}});
byId('back').addEventListener('click',()=>{if(!stopped&&step>0){step--;render()}});
byId('reset').addEventListener('click',()=>{stopped=false;step=0;render()});
byId('stop').addEventListener('click',()=>{stopped=true;render()});
byId('locale').addEventListener('change',()=>{step=0;stopped=false;render()});
byId('track').addEventListener('change',()=>{step=0;stopped=false;render()});
render();
</script></body></html>`;
const target=path.resolve(__dirname,'../labs/hf79-avatar-first-offline-rehearsal.html');
fs.writeFileSync(target,html,'utf8');
console.log('HF79 offline rehearsal HTML',target,Buffer.byteLength(html,'utf8'));
