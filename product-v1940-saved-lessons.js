/* HF13 — transparent save, pause, resume and real teacher-linked submission for self-paced lessons.
 * Cloud save is account-based and requires available PostgreSQL; fallback is opt-in on THIS device.
 * Never store passwords or file inputs, send mail, trigger payment or invent teacher review.
 */
(()=>{'use strict';
const SESSION='el1940.student.session',CONSENT='el1940.device.optin',PREFIX='el1940.lesson.';
const api='/api/v1940/lessons';
const page=location.pathname;
if(!/^\/learn\/[a-z0-9-/]+\/?$/.test(page))return;
const E=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el};
const safeLocal=(op,key,value)=>{try{return op==='get'?localStorage.getItem(key):op==='set'?localStorage.setItem(key,value):localStorage.removeItem(key)}catch{return null}};
const safeSession=(op,value)=>{try{return op==='get'?sessionStorage.getItem(SESSION):op==='set'?sessionStorage.setItem(SESSION,value):sessionStorage.removeItem(SESSION)}catch{return null}};
let token=safeSession('get'),device=safeLocal('get',CONSENT)==='yes',cloud=false,me=null;
const lessons=new Map();
const isHub=!!document.querySelector('[data-el1940-hub]');
const signInBar=E('section',undefined,'v1940-account');signInBar.setAttribute('aria-label','Save and resume self-paced lessons');
const heading=E('strong','Your self-paced learning work');
const blurb=E('p','Pause and resume lessons. Cloud work follows your student account when secure saving is available. Device-only drafts stay in this browser, are not private on a shared device, and may disappear if browser storage is cleared. Never enter confidential client information.');
const status=E('p','Checking save options…','v1940-global-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
const buttons=E('div',undefined,'v1940-buttons');
const signin=E('button','Sign in for cloud saving');signin.type='button';
const logout=E('button','Sign out');logout.type='button';
const consent=E('button','Enable saving on this device');consent.type='button';
const disable=E('button','Clear saved device copies');disable.type='button';
const hubLink=E('a','My saved lessons','v1940-link');hubLink.href='/learn/my-work/';
buttons.append(signin,logout,consent,disable,hubLink);
const login=E('form',undefined,'v1940-login');login.hidden=true;
const emailLabel=E('label','Account email'),email=E('input');email.type='email';email.autocomplete='email';email.required=true;emailLabel.append(email);
const passLabel=E('label','Password'),pass=E('input');pass.type='password';pass.autocomplete='current-password';pass.required=true;passLabel.append(pass);
const go=E('button','Sign in securely');go.type='submit';login.append(emailLabel,passLabel,go);
signInBar.append(heading,blurb,buttons,login,status);
const authHeaders=()=>({'Authorization':'Bearer '+token,'Content-Type':'application/json'});
async function parse(resp){try{return await resp.json()}catch{return{ok:false,error:'Unable to read the server response.'}}}
function labelMessage(message){status.textContent=message}
function updateBar(){
 signin.hidden=!!token||!cloud;logout.hidden=!token;
 consent.hidden=device;disable.hidden=!device;
 if(token&&cloud)labelMessage('Cloud sign-in active. Lessons save to your account; submissions require an assigned teacher for delivery.');
 else if(device)labelMessage('This-device saving is ON. Your work is not shared across devices and cannot be submitted to a teacher until you sign in.');
 else if(cloud)labelMessage('Sign in for cloud saving, or explicitly choose this-device saving. Work is NOT yet being saved.');
 else labelMessage('Cloud account saving is unavailable. Enable this-device saving to keep drafts here, or export a backup.');
}
async function checkCloud(){
 try{const r=await fetch(api+'/capabilities',{cache:'no-store'}),j=await parse(r);cloud=Boolean(r.ok&&j.account_saving_available)}
 catch{cloud=false}
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
signin.addEventListener('click',()=>{login.hidden=!login.hidden;if(!login.hidden)email.focus()});
logout.addEventListener('click',()=>{token=null;me=null;safeSession('clear');updateBar();for(const l of lessons.values())l.message('Signed out. Unsaved edits cannot reach your cloud account.')});
consent.addEventListener('click',()=>{device=true;safeLocal('set',CONSENT,'yes');updateBar();for(const l of lessons.values())l.schedule()});
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
  token=j.token;me=j.user;safeSession('set',token);pass.value='';login.hidden=true;updateBar();
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
 const save=E('button','Save now'),pause=E('button','Pause & save'),resume=E('button','Resume saved work'),submit=E('button','Submit for teacher review'),exportBtn=E('button','Export backup');
 for(const b of [save,pause,resume,submit,exportBtn]){b.type='button';btn.append(b)}
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
   }else if(device){try{saved=JSON.parse(safeLocal('get',storageKey())||'null')}catch{}}
   if(!saved){l.message('No previous saved answer found for this lesson.');return}
   restoring=true;restore(root,saved.answers);restoring=false;
   if(root.closest('.v1870-workbook')){const toggle=root.closest('.v1870-workbook').querySelector('.v1870-toggle input');if(toggle)toggle.checked=true}
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
    state.textContent=(pauseRequested?'Paused safely. ':'')+'Cloud saved '+new Date().toLocaleTimeString()+'. Your account can resume this lesson on another device.';
   }else if(device){
    success=localSave();
    if(!success)throw Error('Local storage is full or unavailable');
    state.textContent=(pauseRequested?'Paused. ':'')+'Saved on this device '+new Date().toLocaleTimeString()+'. Cloud sync and teacher submission are not enabled.';
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
 if(device){
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