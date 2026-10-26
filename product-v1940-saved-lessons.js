/* HF13 — transparent save, pause, resume and real teacher-linked submission for self-paced lessons.
 * Cloud save is account-based and requires available PostgreSQL; fallback is opt-in on THIS device.
 * Never store passwords or file inputs, send mail, trigger payment or invent teacher review.
 */
(()=>{'use strict';
const SESSION='el1940.student.session',CONSENT='el1940.device.optin',PREFIX='el1940.lesson.';
const api='/api/v1940/lessons';
const page=location.pathname;
if(!/^\/learn\/[a-z0-9/-]+\/?$/.test(page))return;
const E=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el};
const safeLocal=(op,key,value)=>{try{return op==='get'?localStorage.getItem(key):op==='set'?localStorage.setItem(key,value):localStorage.removeItem(key)}catch{return null}};
const safeSession=(op,value)=>{try{return op==='get'?sessionStorage.getItem(SESSION):op==='set'?sessionStorage.setItem(SESSION,value):sessionStorage.removeItem(SESSION)}catch{return null}};
let token=safeSession('get'),device=safeLocal('get',CONSENT)==='yes',cloud=false,registrationReady=false,me=null;
const lessons=new Map();
const isHub=!!document.querySelector('[data-el1940-hub]');
const signInBar=E('section',undefined,'v1940-account');signInBar.setAttribute('aria-label','Save and resume self-paced lessons');
const heading=E('strong','Save your progress: create a free student account and sign in');
const blurb=E('p','To reliably save your lesson answers and resume on another device, create a free student account and stay signed in. Your work is saved to your account only after the server confirms it. Without a signed-in account, optional save on this device is less reliable: it will not sync and may be lost if browser data is cleared. Use fictional information only; do not enter confidential client details.');
const status=E('p','Checking save options…','v1940-global-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
const buttons=E('div',undefined,'v1940-buttons');
const createAccount=E('button','Create a free student account');createAccount.type='button';
const signin=E('button','Sign in to my account');signin.type='button';
const logout=E('button','Sign out');logout.type='button';
const consent=E('button','Enable saving on this device');consent.type='button';
const disable=E('button','Clear saved device copies');disable.type='button';
const hubLink=E('a','My saved lessons','v1940-link');hubLink.href='/learn/my-work/';
buttons.append(createAccount,signin,logout,consent,disable,hubLink);
const login=E('form',undefined,'v1940-login');login.hidden=true;
const emailLabel=E('label','Account email'),email=E('input');email.type='email';email.autocomplete='email';email.required=true;emailLabel.append(email);
const passLabel=E('label','Password'),pass=E('input');pass.type='password';pass.autocomplete='current-password';pass.required=true;passLabel.append(pass);
const go=E('button','Sign in securely');go.type='submit';login.append(emailLabel,passLabel,go);
const signup=E('form',undefined,'v1940-login');signup.hidden=true;
const nameLabel=E('label','Full name'),fullName=E('input');fullName.type='text';fullName.autocomplete='name';fullName.maxLength=160;fullName.required=true;nameLabel.append(fullName);
const newEmailLabel=E('label','Email'),newEmail=E('input');newEmail.type='email';newEmail.autocomplete='email';newEmail.required=true;newEmailLabel.append(newEmail);
const newPassLabel=E('label','Create a password (12 characters or more)'),newPass=E('input');newPass.type='password';newPass.autocomplete='new-password';newPass.minLength=12;newPass.maxLength=128;newPass.required=true;newPassLabel.append(newPass);
const create=E('button','Create account and sign in');create.type='submit';
const signupDisclosure=E('p','Account creation and cloud saving require secure server readiness. If unavailable, this page will NOT claim your answers are backed up.');
signup.append(nameLabel,newEmailLabel,newPassLabel,create,signupDisclosure);
signInBar.append(heading,blurb,buttons,signup,login,status);
const authHeaders=()=>({'Authorization':'Bearer '+token,'Content-Type':'application/json'});
async function parse(resp){try{return await resp.json()}catch{return{ok:false,error:'Unable to read the server response.'}}}
function labelMessage(message){status.textContent=message}
function updateBar(){
 createAccount.hidden=!!token||!cloud||!registrationReady;signin.hidden=!!token||!cloud;logout.hidden=!token;
 consent.hidden=device;disable.hidden=!device;
 if(token&&cloud)labelMessage('Signed in to your student account. Cloud saving is enabled; a saved confirmation will appear after each successful server save. Teacher review requires an assigned teacher.');
 else if(device)labelMessage('DEVICE-ONLY DRAFTS — not backed up to your account or other devices. Create an account and sign in for reliable cloud saving when available.');
 else if(cloud)labelMessage(registrationReady?'NOT SAVED TO AN ACCOUNT. Create a free student account or sign in before starting. You may explicitly enable temporary device-only drafts.':'NOT SAVED TO AN ACCOUNT. New student registrations are currently unavailable; existing students may sign in. Use temporary device-only drafts if needed.');
 else labelMessage('ACCOUNT SAVING CURRENTLY UNAVAILABLE. Your lesson is NOT backed up online. You can opt into device-only drafts or export your answers.');
}
async function checkCloud(){
 try{const r=await fetch(api+'/capabilities',{cache:'no-store'}),j=await parse(r);cloud=Boolean(r.ok&&j.account_saving_available);registrationReady=cloud&&Boolean(j.account_registration_available)}
 catch{cloud=false;registrationReady=false}
 updateBar();
}
async function verifyToken(){
 if(!token)return;
 try{const r=await fetch('/api/v119/auth/me',{headers:{Authorization:'Bearer '+token},cache:'no-store'}),j=await parse(r);
  if(!r.ok||!j.user||j.user.role!=='student')throw Error('Your student session expired.');
  me=j.user;
 }catch{token=null;me=null;safeSession('clear');labelMessage('Please sign in again for cloud saving.')}
 updateBar();
}
signin.addEventListener('click',()=>{signup.hidden=true;login.hidden=!login.hidden;if(!login.hidden)email.focus()});
createAccount.addEventListener('click',()=>{login.hidden=true;signup.hidden=!signup.hidden;if(!signup.hidden)fullName.focus()});
signup.addEventListener('submit',async event=>{
 event.preventDefault();if(!cloud||!registrationReady){labelMessage('Account creation is currently unavailable. Your work is NOT backed up online.');return;}
 if(newPass.value.length<12){labelMessage('Choose a password of at least 12 characters.');return;}
 create.disabled=true;labelMessage('Creating your secure student account…');
 try{
  const r=await fetch('/api/v119/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:newEmail.value.trim(),password:newPass.value,full_name:fullName.value.trim(),role:'student'})});
  const j=await parse(r);
  if(!r.ok||!j.token||j.user?.role!=='student')throw Error(j.error||'Account registration is not currently available.');
  token=j.token;me=j.user;safeSession('set',token);
  signup.reset();signup.hidden=true;updateBar();
  labelMessage('Account created and signed in. Your answers will be backed up only when you see a successful Saved to your account confirmation.');
  for(const l of lessons.values())await l.load();
  if(isHub)await populateHub();
 }catch(e){labelMessage('ACCOUNT NOT CREATED: '+e.message+'. Do not assume your work is backed up.');}
 finally{create.disabled=false;newPass.value='';}
});
logout.addEventListener('click',()=>{token=null;me=null;safeSession('clear');updateBar();for(const l of lessons.values())l.message('Signed out. Unsaved edits cannot reach your cloud account.')});
consent.addEventListener('click',()=>{device=true;safeLocal('set',CONSENT,'yes');updateBar()});
disable.addEventListener('click',()=>{
 if(!confirm('Remove all HF13 draft copies saved on this browser? Cloud account copies are not deleted.'))return;
 for(let i=localStorage.length-1;i>=0;i--){const key=localStorage.key(i);if(key&&key.startsWith(PREFIX))safeLocal('remove',key)}
 device=false;safeLocal('remove',CONSENT);updateBar();
});
login.addEventListener('submit',async ev=>{
 ev.preventDefault();go.disabled=true;labelMessage('Checking secure account sign-in…');
 try{
  const r=await fetch('/api/v119/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.value,password:pass.value})});
  const j=await parse(r);
  if(!r.ok||!j.token||j.user?.role!=='student')throw Error(j.error||'Student login unavailable.');
  token=j.token;me=j.user;safeSession('set',token);pass.value='';login.hidden=true;signup.hidden=true;updateBar();
  for(const l of lessons.values())await l.load();
  if(isHub)await populateHub();
 }catch(e){labelMessage('Cloud login was not completed: '+e.message+' Existing work remains on this page.')}
 finally{go.disabled=false;pass.value='';}
});
function fields(root){return [...root.querySelectorAll('input,textarea,select')].filter(n=>!n.closest('.v1940-account,.v1940-controls')&&!['password','email','file','hidden','submit','button','reset'].includes(n.type)&&!n.disabled)}
function snapshot(root){
 const arr=fields(root);
 return {fields:arr.map((node,i)=>({i,t:node.tagName,kind:node.type||'',name:node.name||'',value:node.type==='checkbox'||node.type==='radio'?Boolean(node.checked):node.value})),
    roundTwo:[...root.querySelectorAll('.v1930-round-two')].map(node=>!node.hidden),
    modelOpen:[...root.querySelectorAll('.v1930-exemplar')].map(node=>!node.hidden),
    openDetails:[...root.querySelectorAll('details')].map(node=>node.open),
    reviewedStages:[...root.querySelectorAll('.v1890-stage-feedback')].map(n=>n.textContent.startsWith('Structure cues found:')),
    evidenceReviewed:[...root.querySelectorAll('.v1900-feedback')].map(n=>n.textContent.includes('Review')||n.textContent.includes('Evidence')),
    lastIndex:Math.max(0,arr.indexOf(document.activeElement)),captured_at:new Date().toISOString()
 };
}
function restore(root,snap){
 if(!snap||!Array.isArray(snap.fields))return;
 const arr=fields(root);
 // Never put previously saved text into a different element after a release changes a lesson.
 for(const x of snap.fields){
  const n=arr[x.i];if(!n||n.tagName!==x.t||n.type!==x.kind||(n.name||'')!==x.name)continue;
  if(n.type==='checkbox'||n.type==='radio'){n.checked=Boolean(x.value);if(n.checked)n.dispatchEvent(new Event('change',{bubbles:true}))}
  else{n.value=String(x.value??'');n.dispatchEvent(new Event('input',{bubbles:true}));n.dispatchEvent(new Event('change',{bubbles:true}))}
 }
 if(Array.isArray(snap.roundTwo))root.querySelectorAll('.v1930-round-two').forEach((node,i)=>{
  if(snap.roundTwo[i]&&node.hidden){const button=root.querySelectorAll('.v1930-reveal')[i];if(button)button.click();}
 });
 if(Array.isArray(snap.modelOpen))root.querySelectorAll('.v1930-exemplar').forEach((node,i)=>{
  if(snap.modelOpen[i]&&node.hidden){const button=root.querySelectorAll('.v1930-model')[i];if(button)button.click()}
 });
 if(Array.isArray(snap.reviewedStages))root.querySelectorAll('.v1890-check').forEach((node,i)=>{if(snap.reviewedStages[i])node.click()});
 if(Array.isArray(snap.openDetails))root.querySelectorAll('details').forEach((node,i)=>{node.open=Boolean(snap.openDetails[i])});
}
function exportBackup(l){
 const body=JSON.stringify({format:'EnglishLegalese HF13 self-paced lesson backup',lesson:l.key,title:l.title,path:page,answers:snapshot(l.root),exported_at:new Date().toISOString()},null,2);
 const url=URL.createObjectURL(new Blob([body],{type:'application/json'})),a=E('a');
 a.href=url;a.download='englishlegalese-'+l.key.replace(':','-')+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function buildLesson(key,title,root,showInHub=false){
 if(lessons.has(key))return;
 const controls=E('section',undefined,'v1940-controls');controls.setAttribute('aria-label','Save and resume '+title);
 const label=E('strong','Save, pause & resume');
 const state=E('p','Not saved yet.','v1940-state');state.setAttribute('role','status');state.setAttribute('aria-live','polite');
 const btn=E('div',undefined,'v1940-buttons');
 const save=E('button','Save now'),pause=E('button','Pause & save'),resume=E('button','Resume saved work'),submit=E('button','Submit for teacher review'),feedbackBtn=E('button','Check teacher feedback'),exportBtn=E('button','Export backup');
 for(const b of [save,pause,resume,submit,feedbackBtn,exportBtn]){b.type='button';btn.append(b)}
 controls.append(label,state,btn);root.prepend(controls);
 let revision=0,busy=false,timer=null,restoring=false,latest=null,submitted=false;
 const l={key,title,root,controls,message:m=>state.textContent=m};
 lessons.set(key,l);
 function storageKey(){return PREFIX+key}
 function localSave(){
  if(!device)return false;
  const payload={key,title,path:page,answers:snapshot(root),updated_at:new Date().toISOString()};
  const data=JSON.stringify(payload);
  if(data.length>65536){l.message('Too much for this-device saving; export a backup.');return false}
  return safeLocal('set',storageKey(),data)===undefined;
 }
 async function load(){
  if(busy)return;
  busy=true;
  try{
   let saved=null;
   if(token&&cloud){
    const r=await fetch(api+'/'+encodeURIComponent(key),{headers:{Authorization:'Bearer '+token},cache:'no-store'});
    const j=await parse(r);
    if(r.ok&&j.lesson){saved=j.lesson;revision=Number(saved.revision)||0;submitted=saved.status==='submitted'}
    else if(r.status!==404){l.message('Cloud resume unavailable: '+(j.error||'Please retry.'));return}
    // Never auto-import potentially different users' shared-device drafts into a signed-in account.
   }else if(device){try{saved=JSON.parse(safeLocal('get',storageKey())||'null')}catch{}}
   if(!saved){l.message('No previous saved answer found for this lesson.');return}
   restoring=true;restore(root,saved.answers);restoring=false;
   if(root.closest('.v1870-workbook')){const toggle=root.closest('.v1870-workbook').querySelector('.v1870-toggle input');if(toggle)toggle.checked=true}
   if(new URLSearchParams(location.search).get('resume')===key){root.scrollIntoView({block:'start',behavior:'instant'});}
   l.message('Resumed '+(saved.updated_at?new Date(saved.updated_at).toLocaleString():'saved work')+'. '+(submitted?'A prior version was submitted; edits create a new draft.':'Continue where you left off.'));
  }finally{restoring=false;busy=false}
 }
 async function write({pauseRequested=false}={}){
  if(busy)return false;
  busy=true;clearTimeout(timer);
  state.textContent='Saving…';
  const answers=snapshot(root);
  let success=false;
  try{
   if(token&&cloud){
    const r=await fetch(api+'/'+encodeURIComponent(key),{method:'PUT',headers:authHeaders(),body:JSON.stringify({title,path:page,answers,expected_revision:revision})});
    const j=await parse(r);
    if(!r.ok)throw Error(j.error||'Cloud save failed');
    revision=Number(j.revision);submitted=false;success=true;
    state.textContent=(pauseRequested?'Paused safely. ':'')+'Saved to your account at '+new Date().toLocaleTimeString()+'. You can resume on another device.';
   }else if(device){
    success=localSave();
    if(!success)throw Error('Local storage is full or unavailable');
    state.textContent=(pauseRequested?'Paused. ':'')+'Saved on this device ONLY at '+new Date().toLocaleTimeString()+'. NOT saved to your account; no cross-device sync or teacher submission.';
   }else throw Error('Sign in for cloud saving or explicitly enable this-device saving. Your current answers are still on this page.');
  }catch(e){state.textContent='NOT SAVED: '+e.message+'. Keep the lesson open or export a backup.'}
  finally{busy=false}
  return success;
 }
 function schedule(){
  if(restoring||busy)return;
  if(!token&&!device)return;
  clearTimeout(timer);state.textContent='Unsaved changes — autosaving shortly…';
  timer=setTimeout(()=>{write()},1250);
 }
 root.addEventListener('input',ev=>{if(!ev.target.closest('.v1940-controls'))schedule()});
 root.addEventListener('change',ev=>{if(!ev.target.closest('.v1940-controls'))schedule()});
 save.addEventListener('click',()=>write());
 pause.addEventListener('click',async()=>{if(await write({pauseRequested:true})){state.textContent+=' You may close this tab and use My saved lessons to resume.';}});
 resume.addEventListener('click',load);
 exportBtn.addEventListener('click',()=>exportBackup(l));
 feedbackBtn.addEventListener('click',async()=>{
  if(!token||!cloud){l.message('Teacher feedback requires a signed-in student account.');return}
  try{
   const r=await fetch(api+'/'+encodeURIComponent(key)+'/submissions',{headers:{Authorization:'Bearer '+token},cache:'no-store'}),j=await parse(r);
   if(!r.ok)throw Error(j.error||'Could not load feedback.');
   const recent=(j.submissions||[])[0];
   if(!recent){l.message('You have not submitted this lesson for teacher review.');return}
   l.message(recent.review_status==='reviewed'?'Teacher feedback: '+(recent.teacher_feedback||'No written comments provided.'):(recent.review_status==='awaiting_review'?'Your assigned teacher has not reviewed this submission yet.':'Submission safely recorded but not yet assigned to a teacher. No email was sent.'));
  }catch(e){l.message('Teacher feedback unavailable: '+e.message)}
 });
 submit.addEventListener('click',async()=>{
  if(!token||!cloud){l.message('Submission requires a secure signed-in account and live cloud saving. Use Save/Export for now.');return}
  if(!await write()){return}
  if(!confirm('Submit the current fictional practice responses for teacher review? No automatic email will be sent. Delivery requires a teacher linked to your account.'))return;
  try{
   const r=await fetch(api+'/'+encodeURIComponent(key)+'/submit',{method:'POST',headers:authHeaders(),body:JSON.stringify({expected_revision:revision})});
   const j=await parse(r);if(!r.ok)throw Error(j.error||'Submission failed');
   submitted=true;revision=Number(revision);
   l.message(j.teacher_delivery_confirmed?'Submitted to the queue for your assigned teacher. No email was sent.':'Submission recorded securely. Awaiting teacher assignment; it has NOT yet been delivered to a teacher. No email was sent.');
  }catch(e){l.message('NOT SUBMITTED: '+e.message+' Your saved draft can still be resumed.')}
 });
 l.schedule=schedule;l.load=load;
}
function discover(){
 const workbooks=[...document.querySelectorAll('.v1870-workbook')];
 if(workbooks.length){
  for(const root of workbooks){
   const id=root.querySelector('.v1930-simulation')?.dataset.courseId;
   if(!id)continue;
   const title=root.getAttribute('aria-label')?.replace(/^Detailed independent practice for /,'')||id;
   buildLesson('workbook:'+id,title,root);
  }
 }else if(document.querySelector('#v1840-content,#v1850-resource-app')){
  const root=document.querySelector('#v1840-content,#v1850-resource-app');
  const slug=page.replace(/\/+$/,'').slice('/learn/'.length).replace(/\//g,'-');
  const title=document.querySelector('main h1')?.textContent?.trim()||slug;
  buildLesson('page:'+slug,title,root);
 }
}
async function populateHub(){
 const host=document.querySelector('[data-el1940-hub]');if(!host)return;
 host.replaceChildren(E('p','Checking your saved lessons…'));
 const rows=[];
 if(device&&!token){
  for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(!key?.startsWith(PREFIX))continue;
   try{const w=JSON.parse(safeLocal('get',key));if(w?.path&&w?.key)rows.push({...w,source:'This device'})}catch{}
  }
 }
 if(token&&cloud){
  try{const r=await fetch(api,{headers:{Authorization:'Bearer '+token},cache:'no-store'}),j=await parse(r);
   if(r.ok)for(const w of j.lessons||[])rows.push({key:w.lesson_key,title:w.lesson_title,path:w.origin_path,updated_at:w.updated_at,status:w.status,source:'Cloud account'});
   else host.append(E('p','Cloud list unavailable: '+(j.error||'Please retry.')));
  }catch{host.append(E('p','Cloud list currently unavailable.'))}
 }
 host.replaceChildren();
 if(!rows.length)host.append(E('p','No saved lessons are available yet. Open a self-paced exercise, enable a saving method, and select Pause & save.'));
 for(const w of rows){
  const card=E('article',undefined,'v1940-saved-card'),h=E('strong',w.title||w.key),meta=E('p',w.source+' · '+(w.status||'draft')+' · '+new Date(w.updated_at).toLocaleString());
  const link=E('a','Resume this lesson');
  link.href=w.path+(w.path.includes('?')?'&':'?')+'resume='+encodeURIComponent(w.key);
  card.append(h,meta,link);host.append(card);
 }
}
function mount(){
 const main=document.querySelector('main');if(!main)return;
 main.prepend(signInBar);
 discover();
 checkCloud().then(async()=>{await verifyToken();
  for(const l of lessons.values())if((token&&cloud)||device)await l.load();
  if(isHub)await populateHub();
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
else mount();
})();