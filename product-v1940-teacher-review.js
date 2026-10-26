/* HF13 assigned teacher submission review: no emails, public exposure, or automatic assessment. */
(()=>{'use strict';
const api='/api/v1940/teacher/submissions';
const form=document.getElementById('v1940-teacher-login'),queue=document.getElementById('v1940-teacher-queue');
if(!form||!queue)return;
const detail=document.getElementById('v1940-teacher-detail'),answers=document.getElementById('v1940-teacher-answers');
const feedback=document.getElementById('v1940-teacher-feedback'),comments=document.getElementById('v1940-teacher-comments');
const status=document.getElementById('v1940-teacher-status'),out=document.getElementById('v1940-teacher-signout');
const E=(t,s)=>{const n=document.createElement(t);if(s!==undefined)n.textContent=s;return n};
const KEY='el1940.teacher.session';
let token=null,activeId=null;
try{token=sessionStorage.getItem(KEY)}catch{}
const auth=()=>({'Authorization':'Bearer '+token});
async function json(response){try{return await response.json()}catch{return{ok:false,error:'Unreadable server response.'}}}
function say(s){status.textContent=s}
function signout(){token=null;activeId=null;try{sessionStorage.removeItem(KEY)}catch{};out.hidden=true;form.hidden=false;detail.hidden=true;queue.replaceChildren(E('p','Sign in to load your assigned submissions.'))}
async function loadQueue(){
 if(!token){signout();return}
 try{
  const r=await fetch(api,{headers:auth(),cache:'no-store'}),data=await json(r);
  if(!r.ok)throw Error(data.error||'Teacher queue unavailable.');
  queue.replaceChildren();
  if(!data.submissions?.length)queue.append(E('p','You have no submissions assigned for review.'));
  for(const item of data.submissions||[]){
   const row=E('article'),title=E('strong',item.lesson_title),p=E('p','Submitted '+new Date(item.created_at).toLocaleString()+' · '+item.review_status);
   const btn=E('button','Open submission');btn.type='button';btn.addEventListener('click',()=>openOne(item.id));
   row.className='v1940-saved-card';row.append(title,p,btn);queue.append(row);
  }
  out.hidden=false;form.hidden=true;say('Your assigned teacher queue is loaded. Student answers are kept private.');
 }catch(e){say(e.message);if(/sign in|authentication|session/i.test(e.message))signout()}
}
async function openOne(id){
 try{
  const r=await fetch(api+'/'+encodeURIComponent(id),{headers:auth(),cache:'no-store'}),data=await json(r);
  if(!r.ok)throw Error(data.error||'Submission unavailable.');
  const s=data.submission;activeId=s.id;
  answers.replaceChildren(E('h3',s.lesson_title),E('p','Submitted '+new Date(s.created_at).toLocaleString()));
  const pre=E('pre',JSON.stringify(s.answers,null,2));pre.style.whiteSpace='pre-wrap';pre.style.overflowWrap='anywhere';answers.append(pre);
  comments.value=s.teacher_feedback||'';detail.hidden=false;
  const already=s.review_status==='reviewed';feedback.hidden=already;
  if(already)answers.append(E('p','This submission already has recorded teacher feedback.'));
  detail.scrollIntoView({block:'start'});say('Viewing one authorized student submission; no email sent.');
 }catch(e){say(e.message)}
}
form.addEventListener('submit',async(ev)=>{
 ev.preventDefault();const data=new FormData(form),pass=form.querySelector('input[type=password]');
 say('Checking teacher account…');
 try{
  const r=await fetch('/api/v1940/teacher/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:data.get('email'),password:data.get('password')})});
  const j=await json(r);if(!r.ok||!j.token||j.user?.role!=='teacher')throw Error('A confirmed teacher account is required.');
  token=j.token;try{sessionStorage.setItem(KEY,token)}catch{};pass.value='';await loadQueue();
 }catch(e){say(e.message)}finally{pass.value=''}
});
out.addEventListener('click',async()=>{
 const previous=token;
 signout();
 if(!previous){say('Signed out locally.');return;}
 try{
  const r=await fetch('/api/v1940/teacher/auth/logout',{method:'POST',headers:{Authorization:'Bearer '+previous},cache:'no-store'});
  const j=await json(r);
  say(r.ok&&j.signed_out&&j.session_revoked?'Teacher session securely revoked.':'Signed out locally. Server logout was not confirmed; avoid shared devices until your session expires.');
 }catch{say('Signed out locally. Server logout was not confirmed; avoid shared devices until your session expires.');}
});
feedback.addEventListener('submit',async ev=>{
 ev.preventDefault();if(!activeId||!token)return;
 const value=comments.value.trim();if(value.length<20){say('Please write at least 20 characters of feedback.');return}
 if(!confirm('Save this teacher review for the student? No automatic email will be sent.'))return;
 try{
  const r=await fetch(api+'/'+encodeURIComponent(activeId)+'/review',{method:'POST',headers:{...auth(),'Content-Type':'application/json'},body:JSON.stringify({feedback:value})});
  const j=await json(r);if(!r.ok)throw Error(j.error||'Review failed');
  say('Teacher feedback saved securely. The student can view it when signed in; no email was sent.');
  detail.hidden=true;activeId=null;await loadQueue();
 }catch(e){say('Feedback NOT saved: '+e.message)}
});
if(token)loadQueue();else signout();
})();