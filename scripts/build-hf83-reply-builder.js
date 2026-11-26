/* Exact deterministic isolated additive HTML composition from HF82 R2 */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const {getReplyBuilder,SUPPORTED_EXPLANATION_LOCALES,PROFILES}=require('../src/trcfAdultReplyBuilder');
const root=path.resolve(__dirname,'..');
let html=fs.readFileSync(path.join(root,'labs/hf82-private-response-studio-offline.html'),'utf8');
const data={};for(const locale of SUPPORTED_EXPLANATION_LOCALES){data[locale]={};for(const profile of PROFILES)data[locale][profile]=getReplyBuilder({profile,explanationLocale:locale});}
const encoded=JSON.stringify(data).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
function insert(needle,replace){if(html.split(needle).length!==2)throw Error('HF82 safe single anchor missing/ambiguous '+needle.slice(0,80));html=html.replace(needle,replace);}
insert('<title>EnglishLegalese HF82 · Professional English Private Response Studio</title>','<title>EnglishLegalese HF83 · Structured Professional English Reply Builder</title>');
insert('Internal development preview HF82','Internal development preview HF83');
insert('</style>',`
.reply-builder{margin:15px 0 18px;border:1px solid #8eafca;border-radius:10px;padding:15px;background:#f5f9fd}
.reply-builder summary{cursor:pointer;font-weight:750;color:#174c76}.reply-builder .reply-step{margin:12px 0;padding:12px;border:1px solid #d0ddeb;background:white;border-radius:8px}
.reply-builder .reply-step strong{display:block}.reply-builder .reply-phrase{margin:10px 0;padding:9px;border-left:3px solid #27638a;background:#f2f7fb;overflow-wrap:anywhere}
.reply-builder button{margin:7px 7px 5px 0}.reply-builder .reply-step [hidden]{display:none}.reply-builder [hidden]{display:none}
.reply-builder button:focus-visible,.reply-builder summary:focus-visible{outline:3px solid #e3b348;outline-offset:3px}
</style>`);
const panel=`<details id="reply-builder" class="reply-builder" aria-label="Three-part professional English reply builder">
<summary>Build a three-part professional reply — optional guided phrases</summary>
<p lang="en">Construct your own professional English answer in three parts. Reveal each suggested phrase deliberately, then edit the combined draft in your own words. No AI tutor evaluates your writing.</p>
<p id="reply-intro-native"></p><p id="reply-privacy-native" class="writing-privacy"></p>
<div id="reply-steps"></div>
<div class="controls"><button id="reply-insert" type="button" disabled>Use revealed phrases as my editable draft</button><button id="reply-reset" class="secondary" type="button">Hide phrase examples</button></div>
<p id="reply-status" class="small" role="status" aria-live="polite">Reveal all three phrases to assemble a draft. Your existing writing is never overwritten without confirmation.</p>
</details>`;
insert('<label for="writing-draft">',panel+'\n<label for="writing-draft">');
const js=`const REPLY_DATA=${encoded};
let replyShown=[false,false,false],replyReplacePending=false;
function currentReplyBuilder(){return REPLY_DATA[byId('locale').value][byId('track').value];}
function clearReplyBuilder(){
 replyShown=[false,false,false];replyReplacePending=false;
 const e=byId('reply-builder');e.open=false;
 byId('reply-steps').replaceChildren();byId('reply-insert').disabled=true;
 byId('reply-insert').textContent='Use revealed phrases as my editable draft';
 byId('reply-status').textContent='Reveal all three phrases to assemble a draft. Your existing writing is never overwritten without confirmation.';
}
function renderReplyBuilder(){
 const data=currentReplyBuilder(),entry=data.scenarios[dialogueSceneIndex].turns[dialogueTurnIndex];
 const intro=byId('reply-intro-native');intro.lang=data.explanationLocale;intro.textContent=data.guidance.intro;
 const privacy=byId('reply-privacy-native');privacy.lang=data.explanationLocale;privacy.textContent=data.guidance.privacy;
 const list=byId('reply-steps');list.replaceChildren();
 for(let i=0;i<3;i++){
  const section=document.createElement('section');section.className='reply-step';
  const label=document.createElement('strong');label.textContent=(i+1)+'. '+['Open professionally','Explain the essential point','Offer a next step or limitation'][i];section.append(label);
  const native=document.createElement('span');native.lang=data.explanationLocale;native.textContent=data.guidance.parts[i];section.append(native);
  const button=document.createElement('button');button.type='button';button.className='secondary';button.textContent=replyShown[i]?'Hide sample phrase':'Reveal sample phrase';button.dataset.index=String(i);section.append(button);
  const phrase=document.createElement('p');phrase.className='reply-phrase';phrase.lang='en';phrase.textContent=entry.partsEnglish[i];phrase.hidden=!replyShown[i];section.append(phrase);
  list.append(section);
 }
 byId('reply-insert').disabled=!replyShown.every(Boolean);
}
function toggleReplyPart(i){
 if(stopped||step!==3)return;
 replyShown[i]=!replyShown[i];replyReplacePending=false;
 byId('reply-insert').textContent='Use revealed phrases as my editable draft';
 renderReplyBuilder();
 byId('reply-status').textContent=replyShown.every(Boolean)?'All three sample phrases are visible. You may assemble and edit them.':'Choose which phrase to reveal next. Nothing has been automatically assessed.';
}
function insertReplyDraft(){
 if(stopped||step!==3||!replyShown.every(Boolean))return;
 const draft=byId('writing-draft');
 if(draft.value.trim()&&!replyReplacePending){replyReplacePending=true;byId('reply-insert').textContent='Confirm replacement of my existing draft';byId('reply-status').textContent='Your draft is not replaced. Click Confirm replacement only if you want to overwrite it.';return;}
 const data=currentReplyBuilder();draft.value=data.scenarios[dialogueSceneIndex].turns[dialogueTurnIndex].partsEnglish.join(' ');
 draft.dispatchEvent(new Event('input',{bubbles:true}));replyReplacePending=false;
 byId('reply-insert').textContent='Use revealed phrases as my editable draft';
 byId('reply-status').textContent='Three example phrases copied into the editable draft. Change them to your own words; this is not a score.';
 draft.focus();
}
`;
insert('const phases={intro:',js+'\nconst phases={intro:');
insert('function clearWriting(){','function clearWriting(){clearReplyBuilder();');
insert(' if(panel.hidden)return;\n const g=writingGuide(),t=g.scenarios[dialogueSceneIndex].turns[dialogueTurnIndex];',' if(panel.hidden)return;\n renderReplyBuilder();\n const g=writingGuide(),t=g.scenarios[dialogueSceneIndex].turns[dialogueTurnIndex];');
insert("byId('writing-clear').addEventListener('click',clearWriting);",`byId('writing-clear').addEventListener('click',clearWriting);
byId('reply-steps').addEventListener('click',e=>{const b=e.target.closest('button[data-index]');if(b)toggleReplyPart(Number(b.dataset.index));});
byId('reply-insert').addEventListener('click',insertReplyDraft);
byId('reply-reset').addEventListener('click',()=>{clearReplyBuilder();renderReplyBuilder();});
byId('writing-draft').addEventListener('input',()=>{if(replyReplacePending){replyReplacePending=false;byId('reply-insert').textContent='Use revealed phrases as my editable draft';}});`);
const out=path.join(root,'labs/hf83-structured-professional-reply-builder-offline.html');fs.writeFileSync(out,html);console.log('HF83 offline generated '+Buffer.byteLength(html,'utf8')+' bytes');
