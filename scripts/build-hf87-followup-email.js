/* HF87 deterministic, EnglishLegalese-only cumulative offline generator. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const {getFollowUpEmail,PROFILES,SUPPORTED_EXPLANATION_LOCALES}=require('../src/trcfAdultFollowUpEmail');
const root=path.resolve(__dirname,'..');
let html=fs.readFileSync(path.join(root,'labs/hf86-private-professional-revision-clinic-offline.html'),'utf8');
const data={};for(const l of SUPPORTED_EXPLANATION_LOCALES){data[l]={};for(const p of PROFILES)data[l][p]=getFollowUpEmail({profile:p,explanationLocale:l});}
const embedded=JSON.stringify(data).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
function unique(oldText,newText){if(html.split(oldText).length!==2)throw Error('Missing exact unique HF86 insertion anchor: '+oldText.slice(0,70));html=html.replace(oldText,newText);}
unique('<title>EnglishLegalese HF86 · Private Professional Revision Clinic</title>','<title>EnglishLegalese HF87 · Professional Client Follow-Up Email Workshop</title>');
unique('Internal development preview HF86','Internal development preview HF87');
unique('</style>',String.raw`
.followup-lab{margin:17px 0;padding:15px;border:1px solid #aac2b5;border-radius:12px;background:#f5fbf6}
.followup-lab summary{color:#245846;font-weight:750;cursor:pointer}
.followup-lab label{display:block;margin:10px 0 4px;font-weight:650}
.followup-lab input[type=text],.followup-lab textarea{display:block;width:100%;box-sizing:border-box;padding:10px 11px;background:#fff;border:1px solid #8fa79c;border-radius:8px;font:inherit;resize:vertical}
.followup-lab textarea{min-height:70px}
.followup-lab .followup-output{white-space:pre-wrap;overflow-wrap:anywhere;padding:12px;margin:10px 0;border-left:4px solid #2a7959;background:#fff;border-radius:4px}
.followup-lab [hidden]{display:none!important}
.followup-lab input:focus-visible,.followup-lab textarea:focus-visible,.followup-lab button:focus-visible,.followup-lab summary:focus-visible{outline:3px solid #d4a342;outline-offset:2px}
</style>`);
const panel=String.raw`<details id="followup-lab" class="followup-lab" aria-label="Professional follow-up email practice">
<summary>Professional Follow-Up Email — turn a conversation into a clear written next step</summary>
<p lang="en">Draft an unsent email about this fictional adult professional situation. Enter an accurate subject, a courteous context paragraph, and a clear request or next step. This tool does not send mail, store drafts, contact real people or grade your English.</p>
<p id="followup-native-intro" class="native-copy"></p><p id="followup-native-privacy" class="writing-privacy"></p>
<p id="followup-focus" lang="en"></p><p id="followup-prompt" lang="en"></p>
<label for="followup-subject">Subject (English)</label><input type="text" id="followup-subject" maxlength="120" autocomplete="off" placeholder="Specific fictional subject line">
<label for="followup-greeting">Greeting (English)</label><input type="text" id="followup-greeting" maxlength="80" autocomplete="off" placeholder="Dear colleague,">
<label for="followup-context">Purpose and factual context (English)</label><textarea id="followup-context" maxlength="400" autocomplete="off" spellcheck="true" placeholder="Thank you for... Here is what we know..."></textarea>
<label for="followup-request">Courtesy, action and next step (English)</label><textarea id="followup-request" maxlength="400" autocomplete="off" spellcheck="true" placeholder="Could you please confirm... by...?"></textarea>
<label for="followup-signoff">Professional closing (English)</label><input type="text" id="followup-signoff" maxlength="90" autocomplete="off" placeholder="Kind regards, Your colleague">
<p class="small" id="followup-length" aria-live="polite">0 characters. No email will be sent.</p>
<div class="controls"><button id="followup-preview" type="button">Preview my unsent email</button><button id="followup-compare" type="button">Deliberately compare with authored example</button><button id="followup-insert" type="button" class="secondary">Use my email in the main writing draft</button><button id="followup-clear" type="button" class="secondary">Clear this email</button></div>
<p class="small" id="followup-status" role="status" aria-live="polite">Write a subject, context and action before previewing. Nothing is scored or transmitted.</p>
<div id="followup-result" class="followup-output" lang="en" hidden></div><div id="followup-model" class="followup-output" hidden></div>
</details>`;
unique('<label for="writing-draft">',panel+'\n<label for="writing-draft">');
const script=`const FOLLOWUP_DATA=${embedded};
let followupPending=false;
const FOLLOWUP_FIELDS=['followup-subject','followup-greeting','followup-context','followup-request','followup-signoff'];
function followupData(){return FOLLOWUP_DATA[byId('locale').value][byId('track').value];}
function followupTurn(){return followupData().scenarios[dialogueSceneIndex].turns[dialogueTurnIndex];}
function composeFollowup(){const take=id=>byId(id).value.trim();
 const subject=take('followup-subject'),greet=take('followup-greeting'),context=take('followup-context'),request=take('followup-request'),closing=take('followup-signoff');
 if(!subject||!context||!request)return null;
 return 'Subject: '+subject+'\\n\\n'+(greet||'Dear colleague,')+'\\n\\n'+context+'\\n\\n'+request+'\\n\\n'+(closing||'Kind regards,\\nYour colleague');
}
function clearFollowup(){followupPending=false;byId('followup-lab').open=false;FOLLOWUP_FIELDS.forEach(id=>byId(id).value='');
 byId('followup-result').hidden=true;byId('followup-result').textContent='';byId('followup-model').hidden=true;byId('followup-model').replaceChildren();
 byId('followup-length').textContent='0 characters. No email will be sent.';
 byId('followup-insert').textContent='Use my email in the main writing draft';
 byId('followup-status').textContent='Write a subject, context and action before previewing. Nothing is scored or transmitted.';
}
function renderFollowup(){if(stopped||step!==3)return;
 const g=followupData(),t=followupTurn();byId('followup-native-intro').lang=g.explanationLocale;byId('followup-native-intro').textContent=g.guidance.intro;
 byId('followup-native-privacy').lang=g.explanationLocale;byId('followup-native-privacy').textContent=g.guidance.privacy;
 byId('followup-focus').textContent='Professional email focus: '+t.focusEnglish;
 byId('followup-prompt').textContent='Current fictional situation: '+t.promptEnglish;
}
function followupInput(){followupPending=false;byId('followup-insert').textContent='Use my email in the main writing draft';
 byId('followup-model').hidden=true;byId('followup-model').replaceChildren();byId('followup-result').hidden=true;byId('followup-result').textContent='';
 const total=FOLLOWUP_FIELDS.reduce((n,id)=>n+byId(id).value.length,0);
 byId('followup-length').textContent=total+' typed characters across fields. This draft is not saved or sent.';
 byId('followup-status').textContent='Email content changed. Preview and model comparison are hidden until you choose again.';
}
function previewFollowup(){if(stopped||step!==3)return;const c=composeFollowup();if(!c){byId('followup-status').textContent='Please write the subject, context, and requested action before previewing.';return;}
 byId('followup-result').textContent=c;byId('followup-result').hidden=false;
 byId('followup-status').textContent='This is a local unsent preview, not an email delivery confirmation. No content was transmitted.';
}
function compareFollowup(){if(stopped||step!==3)return;const c=composeFollowup();if(!c){byId('followup-status').textContent='Draft all three required parts before you deliberately reveal the model.';return;}
 const g=followupData(),t=followupTurn(),d=byId('followup-model');d.replaceChildren();
 for(const [s,l] of [['Authored English model (not sent):\\nSubject: '+t.subjectEnglish+'\\n\\n'+t.greetingEnglish+'\\n\\n'+t.contextEnglish+'\\n\\n'+t.requestEnglish+'\\n\\n'+t.closingEnglish,'en'],['Language reflection: '+t.rationaleEnglish,'en'],[t.rationaleNative,g.explanationLocale],[g.guidance.review,g.explanationLocale]]){const p=document.createElement('p');p.lang=l;p.textContent=s;p.style.whiteSpace='pre-wrap';d.append(p);}
 d.hidden=false;byId('followup-status').textContent='You deliberately opened a scripted model. Different professional wording can also be appropriate; no teacher or AI has graded the draft.';
}
function insertFollowup(){if(stopped||step!==3)return;const text=composeFollowup(),field=byId('writing-draft');
 if(!text){byId('followup-status').textContent='Complete subject, context and action first.';return;}
 if(text.length>1200){byId('followup-status').textContent='Your message has '+text.length+' characters. Shorten it to 1200 or fewer before copying.';return;}
 if(field.value.trim()&&!followupPending){followupPending=true;byId('followup-insert').textContent='Confirm replacing existing writing';byId('followup-status').textContent='Existing writing has NOT changed. Press Confirm once more only if you wish to replace it.';return;}
 field.value=text;field.dispatchEvent(new Event('input',{bubbles:true}));followupPending=false;
 byId('followup-insert').textContent='Use my email in the main writing draft';
 byId('followup-status').textContent='Your own unsent email was inserted into the editable writing field. No email was sent or saved.';
}
function resetFollowup(){const opened=byId('followup-lab').open;clearFollowup();renderFollowup();byId('followup-lab').open=opened;}
`;
unique('const phases={intro:',script+'\nconst phases={intro:');
unique('function clearWriting(){clearRevision();','function clearWriting(){clearFollowup();clearRevision();');
unique(' renderRevision();\n const g=writingGuide()', ' renderRevision();\n renderFollowup();\n const g=writingGuide()');
unique("byId('revision-clear').addEventListener('click',()=>{const wasOpen=byId('revision-clinic').open;clearRevision();renderRevision();byId('revision-clinic').open=wasOpen;});",`byId('revision-clear').addEventListener('click',()=>{const wasOpen=byId('revision-clinic').open;clearRevision();renderRevision();byId('revision-clinic').open=wasOpen;});
FOLLOWUP_FIELDS.forEach(id=>byId(id).addEventListener('input',followupInput));
byId('followup-preview').addEventListener('click',previewFollowup);
byId('followup-compare').addEventListener('click',compareFollowup);
byId('followup-insert').addEventListener('click',insertFollowup);
byId('followup-clear').addEventListener('click',resetFollowup);
byId('writing-draft').addEventListener('input',()=>{if(followupPending){followupPending=false;byId('followup-insert').textContent='Use my email in the main writing draft';}});`);
const target=path.join(root,'labs/hf87-private-professional-followup-email-offline.html');fs.writeFileSync(target,html,'utf8');console.log('HF87 generated '+Buffer.byteLength(html)+' bytes');
