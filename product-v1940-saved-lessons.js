/* HF13 — transparent save, pause, resume and real teacher-linked submission for self-paced lessons.
 * Cloud save is account-based and requires available PostgreSQL; fallback is opt-in on THIS device.
 * Genuine transactional account messages are server-triggered only; never send marketing, trigger payments or invent teacher reviews.
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
const heading=E('strong','Save your progress: verify your email and sign in');
const blurb=E('p','To reliably save your lesson answers and resume on another device, create a free student account and stay signed in. Your work is saved to your account only after the server confirms it. Device-only drafts are a less reliable, optional fallback without a signed-in account: they stay in this browser, are NOT backed up to your account, will not sync to other devices, and may be lost if browser data is cleared. Use fictional information only; do not enter confidential client details.');
const status=E('p','Checking save options…','v1940-global-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
const buttons=E('div',undefined,'v1940-buttons');
const createAccount=E('button','Create a free student account');createAccount.type='button';
const signin=E('button','Sign in to my account');signin.type='button';
const resend=E('button','Resend verification email');resend.type='button';
const forgot=E('button','Forgot password?');forgot.type='button';
const logout=E('button','Sign out');logout.type='button';
const logoutAll=E('button','Sign out on all devices');logoutAll.type='button';
const cloudBackup=E('button','Download my cloud backup');cloudBackup.type='button';
const backupPart=E('button','Download backup part 1');backupPart.type='button';
let backupPartOffset=0,backupPartSession=null;
const restoreDevice=E('button','Restore backup to this device');restoreDevice.type='button';
const restoreFile=E('input');restoreFile.type='file';restoreFile.accept='.json,application/json';restoreFile.hidden=true;restoreFile.setAttribute('aria-label','Restore backup file');
const consent=E('button','Enable saving on this device');consent.type='button';
const disable=E('button','Clear saved device copies');disable.type='button';
const hubLink=E('a','My saved lessons','v1940-link');hubLink.href='/learn/my-work/';
buttons.append(createAccount,signin,resend,forgot,logout,logoutAll,cloudBackup,backupPart,restoreDevice,consent,disable,hubLink);
const login=E('form',undefined,'v1940-login');login.hidden=true;
const emailLabel=E('label','Account email'),email=E('input');email.type='email';email.autocomplete='email';email.required=true;emailLabel.append(email);
const passLabel=E('label','Password'),pass=E('input');pass.type='password';pass.autocomplete='current-password';pass.required=true;passLabel.append(pass);
const go=E('button','Sign in securely');go.type='submit';login.append(emailLabel,passLabel,go);
const signup=E('form',undefined,'v1940-login');signup.hidden=true;
const nameLabel=E('label','Full name'),fullName=E('input');fullName.type='text';fullName.autocomplete='name';fullName.maxLength=160;fullName.required=true;nameLabel.append(fullName);
const newEmailLabel=E('label','Email'),newEmail=E('input');newEmail.type='email';newEmail.autocomplete='email';newEmail.required=true;newEmailLabel.append(newEmail);
const newPassLabel=E('label','Create a password (12 characters or more)'),newPass=E('input');newPass.type='password';newPass.autocomplete='new-password';newPass.minLength=12;newPass.maxLength=128;newPass.required=true;newPassLabel.append(newPass);
const create=E('button','Create account and send verification link');create.type='submit';
const signupDisclosure=E('p','Check your email for the one-use verification link, then sign in. Only required account emails are sent. No marketing. Your lessons are saved to your account only after the server confirms a save.');
signup.append(nameLabel,newEmailLabel,newPassLabel,create,signupDisclosure);
const securityForm=E('form',undefined,'v1940-login');securityForm.hidden=true;
const securityEmailLabel=E('label','Student email'),securityEmail=E('input');securityEmail.type='email';securityEmail.required=true;securityEmail.autocomplete='email';securityEmailLabel.append(securityEmail);
const securitySend=E('button','Send password reset link');securitySend.type='submit';
securityForm.append(securityEmailLabel,securitySend);
const resetForm=E('form',undefined,'v1940-login');resetForm.hidden=true;
const resetLabel=E('label','New password (12–128 characters)'),resetPassword=E('input');resetPassword.type='password';resetPassword.minLength=12;resetPassword.maxLength=128;resetPassword.required=true;resetPassword.autocomplete='new-password';resetLabel.append(resetPassword);
const resetSave=E('button','Reset password');resetSave.type='submit';resetForm.append(resetLabel,resetSave);
let resetToken=null;
signInBar.append(heading,blurb,buttons,signup,login,securityForm,resetForm,status,restoreFile);
const authHeaders=()=>({'Authorization':'Bearer '+token,'Content-Type':'application/json'});
async function parse(resp){try{return await resp.json()}catch{return{ok:false,error:'Unable to read the server response.'}}}
function labelMessage(message){status.textContent=message}
function updateBar(){
 createAccount.hidden=!!token||!cloud||!registrationReady;signin.hidden=!!token||!cloud;resend.hidden=!!token||!registrationReady;forgot.hidden=!!token||!registrationReady;logout.hidden=!token;logoutAll.hidden=!token;cloudBackup.hidden=!token||!cloud;backupPart.hidden=!token||!cloud;restoreDevice.hidden=!isHub||!!token;
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
signin.addEventListener('click',()=>{signup.hidden=true;securityForm.hidden=true;login.hidden=!login.hidden;if(!login.hidden)email.focus()});
createAccount.addEventListener('click',()=>{login.hidden=true;securityForm.hidden=true;signup.hidden=!signup.hidden;if(!signup.hidden)fullName.focus()});
signup.addEventListener('submit',async event=>{
 event.preventDefault();if(!cloud||!registrationReady){labelMessage('Account creation is currently unavailable. Your work is NOT backed up online.');return;}
 if(newPass.value.length<12){labelMessage('Choose a password of at least 12 characters.');return;}
 create.disabled=true;labelMessage('Creating your secure student account…');
 try{
  const r=await fetch('/api/v1940/student/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:newEmail.value.trim(),password:newPass.value,full_name:fullName.value.trim(),role:'student'})});
  const j=await parse(r);
  if(!r.ok||!j.verification_required)throw Error(j.error||'Account registration unavailable.');
  signup.reset();signup.hidden=true;updateBar();
  labelMessage('Check your email for a verification link, then sign in. No lesson is backed up until a cloud save is confirmed.');
 }catch(e){labelMessage('ACCOUNT NOT CREATED: '+e.message+'. Do not assume your work is backed up.');}
 finally{create.disabled=false;newPass.value='';}
});
logout.addEventListener('click',async()=>{
 if(!token)return;
 const previous=token;
 logout.disabled=true;
 // Clear local credentials immediately; then revoke the specific server session.
 token=null;me=null;safeSession('clear');updateBar();
 if(isHub)populateHub();
 for(const l of lessons.values())l.message('Signed out locally. Unsaved edits cannot reach your account.');
 try{
  const r=await fetch('/api/v1940/student/auth/logout',{method:'POST',headers:{Authorization:'Bearer '+previous},cache:'no-store'});
  const j=await parse(r);
  labelMessage(r.ok&&j.signed_out&&j.session_revoked?'Signed out securely. This session was revoked on the server.':'Signed out of this browser, but server logout was not confirmed. Avoid using this device until your session expires.');
 }catch{labelMessage('Signed out of this browser. Server logout could not be confirmed; avoid using a shared device until the session expires.');}
 finally{logout.disabled=false;}
});
// Private, user-initiated download of ALL account saves and teacher feedback.
// Never auto-download, email, store export contents in web storage, or call a server export "complete" unless confirmed.
cloudBackup.addEventListener('click',async()=>{
 if(!token||!cloud){labelMessage('Sign in to your student account to download a cloud backup.');return;}
 if(!confirm('Download a private JSON backup of your saved lessons, submitted work and teacher feedback to this device? Keep the file secure. No email will be sent.'))return;
 cloudBackup.disabled=true;
 try{
  const r=await fetch('/api/v1940/account/export',{headers:authHeaders(),cache:'no-store'});
  const j=await parse(r);
  if(!r.ok||j.ok!==true||j.complete!==true||!Array.isArray(j.saved_lessons)||!Array.isArray(j.submissions))
   throw Error(j.error||'Server did not confirm a complete account backup.');
  const blob=new Blob([JSON.stringify(j,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=E('a');
  a.href=url;a.download='englishlegalese-cloud-backup-'+new Date().toISOString().slice(0,10)+'.json';
  document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
  labelMessage('Complete account backup downloaded to this device: '+j.saved_lessons.length+' lessons and '+j.submissions.length+' submissions. Keep the private file secure. No email was sent.');
 }catch(e){labelMessage('ACCOUNT BACKUP NOT DOWNLOADED: '+e.message+' Your cloud work remains unchanged.');}
 finally{cloudBackup.disabled=false;}
});

 // HF19: one user-confirmed file per click; never trigger unattended bulk downloads.
 backupPart.addEventListener('click',async()=>{
  if(!token||!cloud){labelMessage('Sign in to download private account backup parts.');return;}
  if(!confirm('Download one numbered PRIVATE backup part with lesson answers and teacher feedback? Continue until the last part, and keep every file secure. Changes on other devices may shift pages. No email is sent.'))return;
  const currentToken=token;
  if(backupPartSession!==currentToken){backupPartOffset=0;backupPartSession=currentToken;}
  const offset=backupPartOffset;
  backupPart.disabled=true;
  try{
   const r=await fetch('/api/v1940/account/export-part?offset='+offset,{headers:authHeaders(),cache:'no-store'}),j=await parse(r);
   if(token!==currentToken)throw Error('Account changed during the download. Start again with part 1.');
   if(!r.ok||j.ok!==true||j.complete!==false||j.part_only!==true||j.format!=='EnglishLegalese student cloud backup part'
    ||j.schema_version!==1||j.offset!==offset||j.page_size!==25||!Array.isArray(j.saved_lessons)||!Array.isArray(j.submissions)
    ||j.saved_lessons.length>25||j.submissions.length>25||typeof j.has_more!=='boolean'
    ||(j.has_more&&(j.next_offset!==offset+25||j.saved_lessons.length<25&&j.submissions.length<25)))
    throw Error(j.error||'Server did not confirm a valid backup part.');
   if(!j.saved_lessons.length&&!j.submissions.length){
    backupPartOffset=0;backupPart.textContent='Download backup part 1';
    labelMessage('No account data was returned for this backup part. Existing saved work remains unchanged.');return;
   }
   const url=URL.createObjectURL(new Blob([JSON.stringify(j,null,2)],{type:'application/json'})),a=E('a');
   a.href=url;a.download='englishlegalese-cloud-backup-part-'+(offset/25+1)+'-'+new Date().toISOString().slice(0,10)+'.json';
   document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
   backupPartOffset=j.has_more?offset+25:0;
   backupPart.textContent=j.has_more?'Download backup part '+(backupPartOffset/25+1):'Download backup part 1';
   labelMessage(j.has_more
    ?'PRIVATE backup part '+(offset/25+1)+' downloaded ('+j.saved_lessons.length+' lessons and '+j.submissions.length+' submissions). Download the next numbered part; do not discard earlier files.'
    :'Last backup part '+(offset/25+1)+' downloaded ('+j.saved_lessons.length+' lessons and '+j.submissions.length+' submissions). All requested pages returned, but changing records can affect coverage. Keep all numbered files.');
  }catch(e){labelMessage('BACKUP PART NOT DOWNLOADED: '+e.message+' Retry this same part; your cloud lessons remain unchanged.');}
  finally{backupPart.disabled=false;}
 });

// HF15.6: explicit device-only backup recovery. No upload, email, account merge, or overwrite.
// Keep all existing local drafts, refuse malformed/oversized files before touching storage.
const RESTORE_KEY=/^(?:workbook:[a-z0-9-]{3,65}|page:[a-z0-9-]{3,100})$/;
const RESTORE_PATH=/^\/learn\/[a-z0-9/-]{2,150}\/?$/;
function parseRestorableBackup(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('Invalid EnglishLegalese backup file.');
 let items;
 if(raw.format==='EnglishLegalese student cloud backup'){
  if(raw.schema_version!==1||raw.complete!==true||!Array.isArray(raw.saved_lessons)||!Array.isArray(raw.submissions)||raw.saved_lessons.length>200)
   throw Error('A confirmed complete V13 cloud backup is required.');
  items=raw.saved_lessons.map(x=>({key:x?.lesson_key,title:x?.lesson_title,path:x?.origin_path,answers:x?.answers,updated_at:x?.updated_at}));
 }else if(raw.format==='EnglishLegalese student cloud backup part'){
  if(raw.schema_version!==1||raw.complete!==false||raw.part_only!==true||raw.page_size!==25
   ||!Number.isSafeInteger(raw.offset)||raw.offset<0||raw.offset>10000||raw.offset%25!==0
   ||!Array.isArray(raw.saved_lessons)||raw.saved_lessons.length>25||!Array.isArray(raw.submissions)||raw.submissions.length>25
   ||typeof raw.has_more!=='boolean'||(raw.has_more&&raw.next_offset!==raw.offset+25))
   throw Error('Invalid private account backup part.');
  items=raw.saved_lessons.map(x=>({key:x?.lesson_key,title:x?.lesson_title,path:x?.origin_path,answers:x?.answers,updated_at:x?.updated_at}));
 }else if(raw.format==='EnglishLegalese HF13 self-paced lesson backup'){
  items=[{key:raw.lesson,title:raw.title,path:raw.path,answers:raw.answers,updated_at:raw.exported_at}];
 }else throw Error('Unrecognized EnglishLegalese lesson-backup format.');
 const seen=new Set();
 return items.map(x=>{
  if(typeof x.key!=='string'||!RESTORE_KEY.test(x.key)||seen.has(x.key))throw Error('Backup contains invalid or duplicate lesson identifiers.');
  seen.add(x.key);
  if(typeof x.path!=='string'||!RESTORE_PATH.test(x.path)||x.path.includes('//')||typeof x.title!=='string'||!x.title.trim()||x.title.length>150)
   throw Error('Backup contains invalid lesson titles or paths.');
  const a=x.answers;
  if(!a||typeof a!=='object'||Array.isArray(a)||!Array.isArray(a.fields)||a.fields.length>500)
   throw Error('Backup has invalid lesson answers.');
  const fields=a.fields.map(v=>{
   if(!v||!Number.isSafeInteger(v.i)||v.i<0||v.i>500||!['INPUT','TEXTAREA','SELECT'].includes(v.t)||typeof v.kind!=='string'||v.kind.length>32||typeof v.name!=='string'||v.name.length>160||!(typeof v.value==='string'||typeof v.value==='boolean')||String(v.value).length>10000)
    throw Error('Backup has unsupported response fields.');
   return {i:v.i,t:v.t,kind:v.kind,name:v.name,value:v.value};
  });
  const flags={};for(const flag of ['roundTwo','modelOpen','openDetails','reviewedStages','evidenceReviewed']){
   if(a[flag]!==undefined){if(!Array.isArray(a[flag])||a[flag].length>500||a[flag].some(v=>typeof v!=='boolean'))throw Error('Backup contains invalid lesson-state flags.');flags[flag]=a[flag];}
  }
  const answers={fields,...flags};
  const stamp=typeof x.updated_at==='string'&&!Number.isNaN(Date.parse(x.updated_at))?x.updated_at:new Date().toISOString();
  const row={key:x.key,title:x.title.trim(),path:x.path,answers,updated_at:stamp};
  const encoded=JSON.stringify(row);
  if(encoded.length>65536||new Blob([encoded]).size>65536)throw Error('A lesson exceeds the device-only 64 KB limit.');
  return {key:row.key,data:encoded};
 });
}
restoreDevice.addEventListener('click',()=>{
 if(!isHub||token){labelMessage('Sign out before restoring a private backup to this device. No cloud data is changed.');return;}
 restoreFile.value='';restoreFile.click();
});
restoreFile.addEventListener('change',async()=>{
 const file=restoreFile.files?.[0];if(!file)return;
 restoreDevice.disabled=true;
 try{
  if(token||!isHub)throw Error('Sign out before using a device-only backup.');
  if(file.size>8*1024*1024)throw Error('Backup files must not exceed 8 MB.');
  const entries=parseRestorableBackup(JSON.parse(await file.text()));
  if(!entries.length){labelMessage('This complete backup has no saved lesson drafts to restore. No device data was changed.');return;}
  if(!confirm('Restore '+entries.length+' lesson draft(s) to this browser ONLY? Existing device drafts will be skipped, never overwritten. Cloud accounts and submitted teacher reviews will not be changed. The backup file is not uploaded.'))return;
  if(token)throw Error('Account state changed; sign out before importing.');
  const staged=[],added=[];let skipped=0;
  try{
   for(const item of entries){
    if(localStorage.getItem(PREFIX+item.key)!==null){skipped++;continue;}
    staged.push(item);
   }
   for(const item of staged){localStorage.setItem(PREFIX+item.key,item.data);added.push(item.key);}
   if(staged.length){localStorage.setItem(CONSENT,'yes');device=true;}
  }catch(e){for(const key of added){try{localStorage.removeItem(PREFIX+key)}catch{}}
   throw Error('Device storage is unavailable or full; new imports were rolled back. Existing drafts remain unchanged.');}
  updateBar();await populateHub();
  labelMessage('Restored '+added.length+' DEVICE-ONLY drafts; skipped '+skipped+' existing drafts. NOT saved to any account. Submitted work and teacher feedback remain in your original backup file, not imported. No email or upload occurred.');
 }catch(e){labelMessage('BACKUP NOT RESTORED: '+e.message+' Existing device and cloud work were not intentionally replaced.');}
 finally{restoreDevice.disabled=false;restoreFile.value='';}
});
logoutAll.addEventListener('click',async()=>{
 if(!token)return;
 if(!confirm('Sign out your account on every device? Your saved lessons and teacher submissions will remain stored.'))return;
 const previous=token;logoutAll.disabled=true;
 try{
  const r=await fetch('/api/v1940/student/auth/logout-everywhere',{method:'POST',headers:{Authorization:'Bearer '+previous},cache:'no-store'});
  const j=await parse(r);
  if(!r.ok||j.signed_out_everywhere!==true)throw Error(j.error||'All-device sign out was not confirmed.');
  token=null;me=null;safeSession('clear');updateBar();
  if(isHub)populateHub();
  for(const lesson of lessons.values())lesson.message('Signed out on all devices. Account-saved lessons remain available after a new sign-in.');
  labelMessage('Signed out on all devices. Your existing cloud-saved lessons are preserved. Sign in again when ready.');
 }catch(e){labelMessage('All-device sign out not confirmed: '+e.message+' Use local Sign out to clear this browser.');}
 finally{logoutAll.disabled=false;}
});
consent.addEventListener('click',()=>{device=true;safeLocal('set',CONSENT,'yes');updateBar()});
disable.addEventListener('click',()=>{
 if(!confirm('Remove all HF13 draft copies saved on this browser? Cloud account copies are not deleted.'))return;
 for(let i=localStorage.length-1;i>=0;i--){const key=localStorage.key(i);if(key&&key.startsWith(PREFIX))safeLocal('remove',key)}
 device=false;safeLocal('remove',CONSENT);updateBar();
});
login.addEventListener('submit',async ev=>{
 ev.preventDefault();go.disabled=true;labelMessage('Checking secure account sign-in…');
 try{
  const r=await fetch('/api/v1940/student/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.value,password:pass.value})});
  const j=await parse(r);
  if(!r.ok||!j.token||j.user?.role!=='student'||j.email_verified!==true)throw Error(j.error||'Email not verified or student login unavailable.');
  token=j.token;me=j.user;safeSession('set',token);pass.value='';login.hidden=true;signup.hidden=true;updateBar();
  for(const l of lessons.values())await l.load();
  if(isHub)await populateHub();
 }catch(e){labelMessage('Cloud login was not completed: '+e.message+' Existing work remains on this page.')}
 finally{go.disabled=false;pass.value='';}
});
const securityPost=(path,body)=>fetch('/api/v1940/student/auth/'+path,{method:'POST',headers:{'Content-Type':'application/json'},cache:'no-store',body:JSON.stringify(body)});
resend.addEventListener('click',async()=>{
 const address=prompt('Student email address for verification:');if(address===null)return;
 resend.disabled=true;try{const r=await securityPost('resend-verification',{email:address}),j=await parse(r);labelMessage(j.message||j.error||'Please retry.');}catch{labelMessage('Verification request unavailable.');}finally{resend.disabled=false;}
});
forgot.addEventListener('click',()=>{login.hidden=true;signup.hidden=true;securityForm.hidden=!securityForm.hidden;if(!securityForm.hidden)securityEmail.focus()});
securityForm.addEventListener('submit',async e=>{
 e.preventDefault();securitySend.disabled=true;
 try{const r=await securityPost('request-password-reset',{email:securityEmail.value}),j=await parse(r);labelMessage(j.message||j.error||'Reset request unavailable.');if(r.ok){securityForm.reset();securityForm.hidden=true;}}
 catch{labelMessage('Reset request unavailable.');}finally{securitySend.disabled=false;}
});
resetForm.addEventListener('submit',async e=>{
 e.preventDefault();if(!resetToken)return;
 resetSave.disabled=true;
 try{const r=await securityPost('reset-password',{token:resetToken,new_password:resetPassword.value}),j=await parse(r);
  if(!r.ok)throw Error(j.error||'Expired reset link.');
  resetToken=null;resetForm.hidden=true;resetForm.reset();token=null;me=null;safeSession('clear');updateBar();
  labelMessage('Password changed and old sessions signed out. Please sign in again.');
 }catch(err){labelMessage('Password reset failed: '+err.message);}finally{resetSave.disabled=false;resetPassword.value='';}
});
async function redeemAccountLink(){
 const m=/^#(verify|reset)=([a-f0-9]{64})$/.exec(location.hash);if(!m)return;
 history.replaceState(null,'',location.pathname+location.search);
 if(m[1]==='reset'){resetToken=m[2];resetForm.hidden=false;signup.hidden=true;login.hidden=true;labelMessage('Choose a new password. This one-use link expires after 15 minutes.');return;}
 try{const r=await securityPost('verify',{token:m[2]}),j=await parse(r);
  labelMessage(r.ok?'Email verified. Please sign in.':j.error||'Verification failed. Request a new link.');}
 catch{labelMessage('Verification unavailable. Request a fresh link.');}
}
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
 let loadConflict=false; // An interrupted cloud restore must not write with an unknown revision.
 // Every user edit increments this even while a remote save is running.
 let editVersion=0;
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
  const loadVersion=editVersion;
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
   // A cloud read is not allowed to overwrite fields edited while the GET was in flight.
   if(editVersion!==loadVersion){loadConflict=true;clearTimeout(timer);l.message('Cloud resume cancelled because you edited while it loaded. Your typed responses remain on this page, but they are NOT SAVED. Export a backup before reloading the latest cloud version.');return;}
   loadConflict=false;
   restoring=true;restore(root,saved.answers);restoring=false;
   if(root.closest('.v1870-workbook')){const toggle=root.closest('.v1870-workbook').querySelector('.v1870-toggle input');if(toggle)toggle.checked=true}
   if(new URLSearchParams(location.search).get('resume')===key){root.scrollIntoView({block:'start',behavior:'instant'});}
   l.message('Resumed '+(saved.updated_at?new Date(saved.updated_at).toLocaleString():'saved work')+'. '+(submitted?'A prior version was submitted; edits create a new draft.':'Continue where you left off.'));
  }finally{restoring=false;busy=false}
 }
 async function write({pauseRequested=false}={}){
  if(loadConflict){state.textContent='NOT SAVED: Cloud resume was interrupted by typing. Export a backup before refreshing or resuming to avoid overwriting another device. No automatic cloud write was attempted.';return false;}
  if(busy){state.textContent='A save is still in progress. Keep this lesson open until the latest changes are confirmed.';return false;}
  busy=true;clearTimeout(timer);
  state.textContent='Saving…';
  const capturedVersion=editVersion;
  const saveSession=token;
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
  finally{
   busy=false;
   // A completed request only confirms the snapshot captured before that request.
   // Never declare in-flight edits saved or submit that older snapshot for review.
   if(success&&editVersion!==capturedVersion){
    state.textContent='Newer edits are NOT SAVED yet — saving them next. Keep this lesson open.';
    clearTimeout(timer);
    if(token===saveSession&&((token&&cloud)||device))timer=setTimeout(()=>{write()},1250);
   }
  }
  return success&&editVersion===capturedVersion;
 }
 function schedule(){
  if(restoring)return;
  editVersion++;
  if(!token&&!device){state.textContent='Not saved yet. Changes are NOT SAVED. Sign in or enable saving on this device.';return;}
  if(loadConflict){state.textContent='NOT SAVED: cloud resume was interrupted. Export a backup; automatic cloud saves are blocked until you reload the latest version.';return;}
  if(busy){state.textContent='New edits made during a save are NOT SAVED yet. Another save will follow.';return;}
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
// HF17 study report pure helper BEGIN
// A metadata-only snapshot of the authenticated account list or opt-in device list.
// Deliberately excludes answers, email, passwords, tokens, teacher feedback and grades.
function studyReport(rows,source,listingComplete=true){
 const clean=value=>String(value==null?'':value).replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,180);
 const drafts=rows.filter(w=>w.status!=='submitted').length;
 const lines=[
  'EnglishLegalese — private study overview',
  'Source: '+clean(source),
  'Saved lessons shown: '+rows.length,
  'Drafts: '+drafts+'; submitted for teacher review: '+(rows.length-drafts),
  'This is an on-demand dashboard snapshot, NOT a full lesson backup.',
  'Only lesson titles, draft/submission status and dates are included; no lesson answers or feedback.',
  'Listing coverage: '+(listingComplete?'All pages returned by the server at the time of this request.':'PARTIAL — some records could not be listed; use account backup for a complete export.'),
  'The server list may change if lessons are saved on another device during retrieval. The dashboard stops after 1,000 entries.',
  'Keep this file private. No email or upload was sent by this download.',
  ''
 ];
 for(const w of rows){
  const date=Date.parse(w.updated_at);
  const when=Number.isFinite(date)?new Date(date).toISOString():'Date unavailable';
  lines.push((w.status==='submitted'?'SUBMITTED':'DRAFT')+' | '+clean(w.title||w.key)+' | '+when);
 }
 return lines.join('\n')+'\n';
}
// HF17 study report pure helper END

let hubRequestSequence=0;
async function populateHub(){
 const host=document.querySelector('[data-el1940-hub]');if(!host)return;
 const currentSequence=++hubRequestSequence,currentToken=token;
 host.replaceChildren(E('p','Checking your saved lessons…'));
 const rows=[];let loadingError='',listingComplete=true;
 // Device-only work is intentionally shown only while signed out, never merged
 // into a different student's cloud account on a shared browser.
 if(device&&!token){
  try{
   for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(!key?.startsWith(PREFIX))continue;
    try{const w=JSON.parse(safeLocal('get',key));if(w?.path&&w?.key)rows.push({...w,status:'draft',source:'This device'})}catch{}
   }
  }catch{listingComplete=false;loadingError='Device storage cannot be accessed. Existing drafts may still be in this browser.';}
 }
 if(token&&cloud){
  // Fetch one explicitly authorized 100-record page at a time. Never merge
  // browser-only drafts into a signed-in account, or request another user's data.
  const seen=new Set();let offset=0,finished=false;
  try{
   for(let pageNumber=0;pageNumber<10;pageNumber++){
    const url=offset===0?api:api+'?offset='+offset;
    const r=await fetch(url,{headers:{Authorization:'Bearer '+token},cache:'no-store'}),j=await parse(r);
    if(currentSequence!==hubRequestSequence||token!==currentToken)return;
    if(!r.ok||!Array.isArray(j.lessons)||j.lessons.length>100)throw Error(j.error||'The server did not return a valid saved-lesson page.');
    for(const w of j.lessons){
     if(typeof w.lesson_key!=='string')continue;
     if(seen.has(w.lesson_key)){listingComplete=false;loadingError='The saved list changed while loading. Review your cloud backup for a complete account copy.';continue;}
     seen.add(w.lesson_key);
     rows.push({key:w.lesson_key,title:w.lesson_title,path:w.origin_path,updated_at:w.updated_at,status:w.status,source:'Cloud account'});
    }
    if(j.has_more===false){finished=true;break;}
    // Older mock/legacy responses have no pagination contract.
    if(j.has_more!==true){
     finished=j.lessons.length<100;
     if(!finished)loadingError='The cloud server did not confirm whether older lessons exist. This listing may be incomplete; saved work is unchanged.';
     break;
    }
    if(j.lessons.length!==100||j.next_offset!==offset+100)throw Error('The server returned inconsistent pagination; the list may be incomplete.');
    if(pageNumber===9){loadingError='Showing up to 1,000 cloud lessons. Further saves may exist; use your complete account backup.';break;}
    offset=j.next_offset;
   }
   if(!finished)listingComplete=false;
  }catch(e){if(currentSequence!==hubRequestSequence||token!==currentToken)return;
   listingComplete=false;loadingError='Your cloud lesson list could not be fully loaded: '+e.message+' Previously saved work has NOT been deleted. Do not assume that you have no saved lessons.';
  }
 }else if(token&&!cloud){listingComplete=false;loadingError='Account saving is temporarily unavailable. No cloud records have been deleted.';}
 // Only allow routes to real learning pages, even for untrusted/corrupt browser storage.
 const valid=rows.filter(w=>typeof w.key==='string'&&/^(?:workbook|page):[a-z0-9-]+$/.test(w.key)&&typeof w.path==='string'&&/^\/learn\/[a-z0-9/-]+\/?$/.test(w.path)&&!w.path.includes('//'));
 valid.sort((x,y)=>(Date.parse(y.updated_at)||0)-(Date.parse(x.updated_at)||0));
 if(currentSequence!==hubRequestSequence||token!==currentToken)return;
 host.replaceChildren();
 if(loadingError){const note=E('p',loadingError,'v1940-list-warning');note.setAttribute('role','status');host.append(note);}
 if(!valid.length){
  if(!loadingError)host.append(E('p','No saved lessons are available yet. Open a self-paced exercise, enable a saving method, and select Pause & save.'));
  return;
 }
 const toolbar=E('div',undefined,'v1940-hub-toolbar');
 const searchLabel=E('label','Search saved lessons');
 const search=E('input');search.type='search';search.placeholder='Search lesson title';search.setAttribute('aria-label','Search saved lessons');searchLabel.append(search);
 const statusLabel=E('label','Show lesson status');
 const choice=E('select');choice.setAttribute('aria-label','Filter saved lessons by status');
 for(const [value,label] of [['all','All lessons'],['draft','Drafts'],['submitted','Submitted for review']]){
  const option=E('option',label);option.value=value;choice.append(option);
 }
 statusLabel.append(choice);
 const sortLabel=E('label','Sort saved lessons');
 const sort=E('select');sort.setAttribute('aria-label','Sort saved lessons');
 for(const [value,label] of [['recent','Most recently saved'],['oldest','Oldest saved first'],['title','Lesson title A–Z']]){
  const option=E('option',label);option.value=value;sort.append(option);
 }
 sortLabel.append(sort);toolbar.append(searchLabel,statusLabel,sortLabel);
 const summary=E('p',undefined,'v1940-hub-summary');summary.setAttribute('role','status');summary.setAttribute('aria-live','polite');
 const list=E('div',undefined,'v1940-hub-list');
 const studyActions=E('section',undefined,'v1940-study-actions');
 studyActions.setAttribute('aria-label','Your private study overview');
 const studyHeading=E('strong','Your study overview');
 const draftCount=valid.filter(w=>w.status!=='submitted').length;
 const submittedCount=valid.length-draftCount;
 const overview=E('p',draftCount+' '+(draftCount===1?'draft':'drafts')+' to continue · '+submittedCount+' submitted for teacher review. This is activity, not a grade or course-completion certificate.');
 studyActions.append(studyHeading,overview);
 const nextDraft=valid.find(w=>w.status!=='submitted');
 if(nextDraft){
  const nextLink=E('a','Continue my most recent draft');
  nextLink.href=nextDraft.path+(nextDraft.path.includes('?')?'&':'?')+'resume='+encodeURIComponent(nextDraft.key);
  studyActions.append(nextLink);
 }else studyActions.append(E('p','No drafts are shown. Submitted work may still be awaiting teacher feedback.'));
 const exportProgress=E('button','Download study overview (.txt)');
 exportProgress.type='button';
 exportProgress.addEventListener('click',()=>{
  if(!confirm('Download a private text summary of the lessons shown on this device? This is not a full backup. It contains lesson titles, statuses and dates but no answers, and should be kept private.'))return;
  const report=studyReport(valid,token&&cloud?'Cloud account':'This device',listingComplete);
  const url=URL.createObjectURL(new Blob([report],{type:'text/plain;charset=utf-8'}));
  const anchor=E('a');anchor.href=url;anchor.download='englishlegalese-study-overview-'+new Date().toISOString().slice(0,10)+'.txt';
  document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
 });
 studyActions.append(exportProgress,E('p','For a complete copy of actual saved answers and teacher feedback, use Download my cloud backup while signed in. This overview never sends an email.'));
 // HF20: pagination is a private presentation concern. Every filter, sort and
 // metadata-only overview continues to operate on ALL authorized fetched rows.
 const PAGE_SIZE=25;let viewPage=0;
 const pageControls=E('nav',undefined,'v1940-page-controls');pageControls.setAttribute('aria-label','Saved lesson pages');
 const previous=E('button','Previous page');previous.type='button';
 const next=E('button','Next page');next.type='button';
 const pageCounter=E('span','Page 1','v1940-page-counter');
 pageControls.append(previous,pageCounter,next);
 host.append(studyActions,toolbar,summary,list,pageControls);
 function render(){
  const term=search.value.trim().toLocaleLowerCase(),filter=choice.value;
  const filtered=valid.filter(w=>(filter==='all'||(filter==='submitted'?w.status==='submitted':w.status!=='submitted'))&&(String(w.title||w.key).toLocaleLowerCase().includes(term)));
  const ordered=filtered.slice().sort((a,b)=>{
   if(sort.value==='title')return String(a.title||a.key).localeCompare(String(b.title||b.key))||a.key.localeCompare(b.key);
   const dateA=Date.parse(a.updated_at)||0,dateB=Date.parse(b.updated_at)||0;
   return (sort.value==='oldest'?dateA-dateB:dateB-dateA)||a.key.localeCompare(b.key);
  });
  list.replaceChildren();
  const drafts=valid.filter(w=>w.status!=='submitted').length,submitted=valid.length-drafts;
  const pageCount=Math.ceil(ordered.length/PAGE_SIZE);
  viewPage=Math.min(viewPage,Math.max(0,pageCount-1));
  const start=viewPage*PAGE_SIZE;
  const visible=ordered.slice(start,start+PAGE_SIZE);
  previous.disabled=viewPage===0;
  next.disabled=viewPage>=pageCount-1;
  pageCounter.textContent=pageCount?'Page '+(viewPage+1)+' of '+pageCount+' · lessons '+(start+1)+'–'+(start+visible.length)+' of '+ordered.length+' matching':'No matching pages';
  summary.textContent='Showing '+filtered.length+' of '+valid.length+' saved lessons ('+drafts+' drafts, '+submitted+' submitted). '+(token&&cloud?'Cloud account records only.':'This browser only — not backed up to an account.')+(listingComplete?'':' LIST MAY BE INCOMPLETE.');
  if(!filtered.length){list.append(E('p','No lessons match these filters. Your saved work has not been deleted.'));return;}
  for(const w of visible){
   const card=E('article',undefined,'v1940-saved-card'),h=E('strong',String(w.title||w.key).slice(0,160));
   const time=Date.parse(w.updated_at),when=Number.isFinite(time)?new Date(time).toLocaleString():'Save date unavailable';
   const meta=E('p',w.source+' · '+(w.status==='submitted'?'submitted':'draft')+' · '+when);
   const link=E('a','Resume this lesson');
   link.href=w.path+(w.path.includes('?')?'&':'?')+'resume='+encodeURIComponent(w.key);
   card.append(h,meta,link);list.append(card);
   // HF21: student-initiated, authenticated lookup of actual teacher records.
   // Do not cache feedback on a shared device or invent a review/teacher assignment.
   if(w.status==='submitted'&&currentToken&&cloud){
    const review=E('button','Check submission & teacher feedback','v1940-review-button');
    review.type='button';
    review.setAttribute('aria-label','Check submission and teacher feedback for '+String(w.title||w.key).slice(0,100));
    const feedback=E('div',undefined,'v1940-review-result');
    feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
    card.append(review,feedback);
    review.addEventListener('click',async()=>{
     if(!token||token!==currentToken||hubRequestSequence!==currentSequence){
      feedback.textContent='Student session has changed. Please sign in again.';return;
     }
     review.disabled=true;
     feedback.replaceChildren(E('p','Checking your latest recorded submission…'));
     try{
      const r=await fetch(api+'/'+encodeURIComponent(w.key)+'/submissions',{
       headers:{Authorization:'Bearer '+currentToken},cache:'no-store'
      });
      const j=await parse(r);
      if(!token||token!==currentToken||hubRequestSequence!==currentSequence||!card.isConnected)return;
      if(!r.ok||j.ok!==true||!Array.isArray(j.submissions))
       throw Error(j.error||'Teacher submission history could not be confirmed.');
      if(j.submissions.length>20)throw Error('The server returned too many submissions; history could not be validated.');
      feedback.replaceChildren();
      const latest=j.submissions[0];
      if(!latest){
       feedback.append(E('p','No submission history was returned. The lesson listing may be out of date; reopen the lesson to check its status.'));
      }else if(latest.review_status==='reviewed'){
       feedback.append(E('strong','Reviewed by your assigned teacher'));
       const dated=Date.parse(latest.reviewed_at);
       if(Number.isFinite(dated))feedback.append(E('p','Review recorded: '+new Date(dated).toLocaleString()));
       feedback.append(E('p',typeof latest.teacher_feedback==='string'&&latest.teacher_feedback.trim()
        ?latest.teacher_feedback:'Your teacher marked this submission reviewed, but no written feedback was included.'));
      }else if(latest.review_status==='awaiting_review'){
       feedback.append(E('p','Submitted to your assigned teacher; feedback has not been recorded yet. No automatic email was sent.'));
      }else{
       feedback.append(E('p','Submission recorded. Teacher assignment or review has not been confirmed. No automatic email was sent.'));
      }
      // HF22: history is retrieved only for the signed-in student's chosen
      // lesson. Use plain-text DOM nodes, not HTML or shared-device storage.
      if(j.submissions.length>1){
       const history=E('details',undefined,'v1940-review-history');
       history.append(E('summary','Earlier submissions ('+(j.submissions.length-1)+' shown, newest first)'));
       for(const [index,previous] of j.submissions.slice(1).entries()){
        const entry=E('section',undefined,'v1940-review-entry');
        entry.append(E('strong','Earlier submission '+(index+1)));
        const saved=Date.parse(previous?.created_at);
        if(Number.isFinite(saved))entry.append(E('p','Submitted: '+new Date(saved).toLocaleString()));
        if(previous?.review_status==='reviewed'){
         entry.append(E('p','Reviewed by your assigned teacher'));
         const recorded=Date.parse(previous.reviewed_at);
         if(Number.isFinite(recorded))entry.append(E('p','Review recorded: '+new Date(recorded).toLocaleString()));
         entry.append(E('p',typeof previous.teacher_feedback==='string'&&previous.teacher_feedback.trim()
          ?previous.teacher_feedback:'This submission was marked reviewed without written comments.'));
        }else if(previous?.review_status==='awaiting_review'){
         entry.append(E('p','This earlier submission is awaiting feedback from its assigned teacher.'));
        }else{
         entry.append(E('p','This earlier submission was recorded; teacher assignment or review was not confirmed.'));
        }
        history.append(entry);
       }
       if(j.submissions.length===20)history.append(E('p','Showing the 20 most recent submissions returned by the server. Older submissions may also exist.'));
       feedback.append(history);
      }
     }catch(e){
      if(!token||token!==currentToken||hubRequestSequence!==currentSequence||!card.isConnected)return;
      feedback.replaceChildren(E('p','Feedback could not be loaded: '+e.message+' Your submission has not been deleted.'));
     }finally{review.disabled=false;}
    });
   }

  }
 }
 previous.addEventListener('click',()=>{if(viewPage>0){viewPage--;render();}});
 next.addEventListener('click',()=>{viewPage++;render();});
 search.addEventListener('input',()=>{viewPage=0;render();});
 choice.addEventListener('change',()=>{viewPage=0;render();});
 sort.addEventListener('change',()=>{viewPage=0;render();});
 render();
}
function mount(){
 const main=document.querySelector('main');if(!main)return;
 main.prepend(signInBar);
 discover();
 checkCloud().then(async()=>{await redeemAccountLink();await verifyToken();
  for(const l of lessons.values())if((token&&cloud)||device)await l.load();
  if(isHub)await populateHub();
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
else mount();
})();