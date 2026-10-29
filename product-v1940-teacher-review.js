/* HF24: authenticated teacher dashboard; assigned submissions only. No automatic emails or AI grading. */
(()=>{'use strict';
const api='/api/v1940/teacher/submissions';
const form=document.getElementById('v1940-teacher-login'),queue=document.getElementById('v1940-teacher-queue');
if(!form||!queue)return;
const detail=document.getElementById('v1940-teacher-detail'),answers=document.getElementById('v1940-teacher-answers');
const feedback=document.getElementById('v1940-teacher-feedback'),comments=document.getElementById('v1940-teacher-comments');
const status=document.getElementById('v1940-teacher-status'),out=document.getElementById('v1940-teacher-signout');
const outAll=document.createElement('button');outAll.type='button';outAll.textContent='Sign out on all devices';out.after(outAll);outAll.hidden=true;
const E=(t,s)=>{const n=document.createElement(t);if(s!==undefined)n.textContent=s;return n};
const KEY='el1940.teacher.session';
let token=null,activeId=null,requestSequence=0,queueData=[];
try{token=sessionStorage.getItem(KEY)}catch{}
const auth=current=>({'Authorization':'Bearer '+current});
async function json(response){try{return await response.json()}catch{return{ok:false,error:'Unreadable server response.'}}}
function say(s){status.textContent=s}
function signout(){
 ++requestSequence;token=null;activeId=null;queueData=[];
 try{sessionStorage.removeItem(KEY)}catch{}
 out.hidden=true;outAll.hidden=true;form.hidden=false;detail.hidden=true;
 answers.replaceChildren();comments.value='';
 queue.replaceChildren(E('p','Sign in to load your assigned submissions.'));
}
function renderQueue(){
 queue.replaceChildren();
 const awaiting=queueData.filter(x=>x.review_status==='awaiting_review').length;
 const reviewed=queueData.filter(x=>x.review_status==='reviewed').length;
 const other=queueData.length-awaiting-reviewed;
 const overview=E('p','Assigned records returned: '+queueData.length+' · Awaiting review: '+awaiting+' · Reviewed: '+reviewed+' · Other recorded statuses: '+other+'. Showing up to 100 most recent assignments; older records may exist.');
 overview.className='v1940-teacher-summary';queue.append(overview);
 const toolbar=E('div');toolbar.className='v1940-hub-toolbar';
 const filterLabel=E('label','Queue status');const filter=E('select');filter.setAttribute('aria-label','Filter assigned submissions by status');
 for(const [value,label] of [['awaiting_review','Awaiting my review'],['all','All assigned submissions'],['reviewed','Already reviewed'],['other','Other recorded statuses']]){
  const opt=E('option',label);opt.value=value;filter.append(opt);
 }
 const searchLabel=E('label','Search assigned lesson title');const search=E('input');search.type='search';search.placeholder='Lesson title';search.setAttribute('aria-label','Search assigned lesson titles');
 filterLabel.append(filter);searchLabel.append(search);toolbar.append(filterLabel,searchLabel);
 const actions=E('div');actions.className='v1940-buttons';
 const refresh=E('button','Refresh assigned queue');refresh.type='button';actions.append(refresh);
 const filteredStatus=E('p');filteredStatus.setAttribute('role','status');filteredStatus.setAttribute('aria-live','polite');
 const list=E('div');list.className='v1940-teacher-list';
 queue.append(toolbar,actions,filteredStatus,list);
 const currentToken=token,currentSequence=requestSequence;
 function render(){
  if(token!==currentToken)return;
  const term=search.value.trim().toLocaleLowerCase();
  const shown=queueData.filter(x=>{
   const statusOk=filter.value==='all'||(filter.value==='other'?!['awaiting_review','reviewed'].includes(x.review_status):x.review_status===filter.value);
   return statusOk&&String(x.lesson_title||'').toLocaleLowerCase().includes(term);
  });
  filteredStatus.textContent='Showing '+shown.length+' of '+queueData.length+' assigned submissions matching your filters.';
  list.replaceChildren();
  if(!shown.length)list.append(E('p','No assigned submissions match this filter. Existing reviews were not changed.'));
  for(const item of shown){
   const row=E('article');row.className='v1940-saved-card';
   row.append(E('strong',String(item.lesson_title||'Untitled practice').slice(0,160)));
   const when=Date.parse(item.created_at);
   row.append(E('p','Submitted '+(Number.isFinite(when)?new Date(when).toLocaleString():'date not available')+' · '+String(item.review_status||'unconfirmed')));
   const btn=E('button',item.review_status==='reviewed'?'View existing review':'Open assigned submission');btn.type='button';
   btn.addEventListener('click',()=>openOne(item.id));row.append(btn);list.append(row);
  }
 }
 filter.addEventListener('change',render);search.addEventListener('input',render);
 refresh.addEventListener('click',()=>loadQueue());render();
}
async function loadQueue(){
 if(!token){signout();return}
 const currentToken=token,sequence=++requestSequence;
 detail.hidden=true;activeId=null;answers.replaceChildren();comments.value='';
 queue.replaceChildren(E('p','Loading only submissions assigned to your teacher account…'));
 try{
  const r=await fetch(api,{headers:auth(currentToken),cache:'no-store'}),data=await json(r);
  if(token!==currentToken||sequence!==requestSequence)return;
  if(!r.ok||data.ok!==true||!Array.isArray(data.submissions)||data.submissions.length>100)throw Error(data.error||'Teacher queue unavailable or incomplete.');
  queueData=data.submissions.filter(x=>x&&/^[1-9]\d{0,18}$/.test(String(x.id)));
  renderQueue();
  out.hidden=false;outAll.hidden=false;form.hidden=true;
  say('Your private assigned teacher queue is ready. Records are not shared with employers.');
 }catch(e){
  if(token!==currentToken||sequence!==requestSequence)return;
  queue.replaceChildren(E('p','Could not load assigned submissions. Your student reviews remain unchanged.'));
  say('Teacher queue unavailable: '+e.message+'. Sign out and sign in again if authentication expired.');
 }
}
async function openOne(id){
 if(!token||!/^[1-9]\d{0,18}$/.test(String(id)))return;
 const currentToken=token,sequence=++requestSequence;
 activeId=null;detail.hidden=true;answers.replaceChildren();comments.value='';
 try{
  const r=await fetch(api+'/'+encodeURIComponent(id),{headers:auth(currentToken),cache:'no-store'}),data=await json(r);
  if(token!==currentToken||sequence!==requestSequence)return;
  if(!r.ok||data.ok!==true||!data.submission||String(data.submission.id)!==String(id))throw Error(data.error||'Submission unavailable.');
  const s=data.submission;activeId=s.id;
  const when=Date.parse(s.created_at);
  answers.replaceChildren(E('h3',String(s.lesson_title||'Assigned practice').slice(0,160)),E('p','Submitted '+(Number.isFinite(when)?new Date(when).toLocaleString():'date not available')));
  const pre=E('pre',JSON.stringify(s.answers,null,2));pre.style.whiteSpace='pre-wrap';pre.style.overflowWrap='anywhere';answers.append(pre);
  comments.value=s.review_status==='reviewed'?String(s.teacher_feedback||''):'';
  detail.hidden=false;feedback.hidden=s.review_status!=='awaiting_review';
  if(s.review_status==='reviewed')answers.append(E('p','This submission was already reviewed; existing feedback is read-only.'));
  else if(s.review_status!=='awaiting_review')answers.append(E('p','This submission is not currently awaiting your review. Changes are unavailable.'));
  detail.scrollIntoView({block:'start'});say('Viewing one assigned student submission. No email sent.');
 }catch(e){if(token===currentToken&&sequence===requestSequence)say('Could not open assigned submission: '+e.message)}
}
form.addEventListener('submit',async(ev)=>{
 ev.preventDefault();const data=new FormData(form),pass=form.querySelector('input[type=password]');
 say('Checking teacher account…');
 const sequence=++requestSequence;
 try{
  const r=await fetch('/api/v1940/teacher/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:data.get('email'),password:data.get('password')})});
  const j=await json(r);
  if(sequence!==requestSequence)return;
  if(!r.ok||!j.token||j.user?.role!=='teacher')throw Error('A confirmed teacher account is required.');
  token=j.token;try{sessionStorage.setItem(KEY,token)}catch{};await loadQueue();
 }catch(e){if(sequence===requestSequence)say(e.message)}finally{pass.value=''}
});
out.addEventListener('click',async()=>{
 const previous=token;signout();
 if(!previous){say('Signed out locally.');return}
 try{
  const r=await fetch('/api/v1940/teacher/auth/logout',{method:'POST',headers:auth(previous),cache:'no-store'});
  const j=await json(r);say(r.ok&&j.signed_out&&j.session_revoked?'Teacher session securely revoked.':'Signed out locally. Server revocation could not be confirmed; avoid shared devices until session expiry.');
 }catch{say('Signed out locally. Server revocation could not be confirmed; avoid shared devices until session expiry.')}
});
outAll.addEventListener('click',async()=>{
 if(!token||!confirm('Sign this teacher account out on every device? Existing student submissions and reviews remain saved.'))return;
 const previous=token;outAll.disabled=true;
 try{
  const r=await fetch('/api/v1940/teacher/auth/logout-everywhere',{method:'POST',headers:auth(previous),cache:'no-store'});
  const j=await json(r);
  if(!r.ok||j.signed_out_everywhere!==true)throw Error(j.error||'All-device sign out unconfirmed');
  signout();say('Signed out securely on every device. Student work and teacher feedback are preserved.');
 }catch(e){say('All-device sign out could not be confirmed: '+e.message)}
 finally{outAll.disabled=false}
});
feedback.addEventListener('submit',async ev=>{
 ev.preventDefault();
 if(!activeId||!token)return;
 const value=comments.value.trim();if(value.length<20||value.length>5000){say('Teacher feedback must be 20 to 5,000 characters.');return}
 if(!confirm('Save this teacher review for the student? No automatic email will be sent.'))return;
 const currentToken=token,currentId=activeId,sequence=++requestSequence;
 const button=feedback.querySelector('button[type="submit"]');button.disabled=true;
 try{
  const r=await fetch(api+'/'+encodeURIComponent(currentId)+'/review',{method:'POST',headers:{...auth(currentToken),'Content-Type':'application/json'},body:JSON.stringify({feedback:value})});
  const j=await json(r);
  if(token!==currentToken||sequence!==requestSequence)return;
  if(!r.ok||j.ok!==true)throw Error(j.error||'Review failed');
  say('Teacher feedback saved securely; student may view it when signed in. No email was sent.');
  detail.hidden=true;activeId=null;comments.value='';await loadQueue();
 }catch(e){if(token===currentToken&&sequence===requestSequence)say('Feedback NOT saved: '+e.message)}
 finally{button.disabled=false}
});
if(token)loadQueue();else signout();
})();
