'use strict';
/* HF56 adult teacher-led energy-contracts class. Never renders private data
   without an authenticated server assignment; no Meet URL in static HTML. */
(()=>{
 const API='/api/v2150/private-energy/';
 const STUDENT_SESSION='el1940.student.session',TEACHER_SESSION='el2150.teacher.session';
 const element=id=>document.getElementById(id);
 const status=element('energy-status'),loginForm=element('energy-login-form'),
  signout=element('energy-signout'),authorized=element('energy-authorized'),
  teacherPanel=element('energy-teacher-panel'),teacherStatus=element('energy-teacher-status'),
  createForm=element('energy-create-form'),historicalPanel=element('energy-historical-panel'),historicalForm=element('energy-historical-form'),
  scheduleStatus=element('energy-schedule-status'),
  schedule=element('energy-schedule'),lessonsView=element('energy-lessons'),
  courseSelect=element('energy-create-lesson');
 let token=null,role=null,canAutoMeet=false,loadedLessons=[],loadedSessions=[];
 const node=(tag,value,cls)=>{
  const x=document.createElement(tag);
  if(value!==undefined)x.textContent=value;
  if(cls)x.className=cls;
  return x;
 };
 const clear=n=>n.replaceChildren();
 const getSession=key=>{try{return sessionStorage.getItem(key)}catch{return null}};
 const setSession=(key,value)=>{try{if(value)sessionStorage.setItem(key,value);else sessionStorage.removeItem(key)}catch{}};
 const escapeHttp=async r=>{try{return await r.json()}catch{return{ok:false,error:'A valid server response was not received.'}}};
 const call=async(url,method='GET',body=null)=>{
  if(!token)throw Error('Sign in to your account to continue.');
  const headers={'Authorization':'Bearer '+token};
  if(body!==null)headers['Content-Type']='application/json';
  const r=await fetch(url,{method,headers,body:body===null?undefined:JSON.stringify(body),cache:'no-store',credentials:'same-origin'});
  const data=await escapeHttp(r);
  if(!r.ok)throw Error(data.error||'Request not completed.');
  return data;
 };
 const safeMeet=url=>{
  if(typeof url!=='string')return null;
  try{
   const parsed=new URL(url);
   if(parsed.protocol!=='https:'||parsed.hostname!=='meet.google.com'||!/^\/[a-z]{3}-[a-z]{4}-[a-z]{3}\/?$/.test(parsed.pathname)||parsed.search||parsed.hash)return null;
   return parsed.href;
  }catch{return null;}
 };
 const localStart=value=>{
  if(typeof value!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(value))throw Error('Enter the local class date and time.');
  const iso=new Date(value+':00+07:00');
  if(Number.isNaN(iso.getTime()))throw Error('Enter a valid Vietnam / Thailand class time.');
  return iso.toISOString();
 };
 function appendList(parent,items){
  const ol=node('ol',undefined,'lesson-steps');
  for(const t of items)ol.append(node('li',t));
  parent.append(ol);
 }
 function showError(e){status.textContent=e?.message||String(e);}
 function loggedOut(message='Sign in with your verified EnglishLegalese account.'){
  token=null;role=null;loadedLessons=[];loadedSessions=[];
  authorized.hidden=true;teacherPanel.hidden=true;historicalPanel.hidden=true;
  signout.hidden=true;loginForm.hidden=false;status.textContent=message;
  clear(schedule);clear(lessonsView);clear(courseSelect);
 }
 function showCourse(items,agenda){
  clear(lessonsView);clear(courseSelect);
  for(const lesson of items){
   const opt=node('option','Session '+lesson.number+' — '+lesson.title);
   opt.value=String(lesson.number);courseSelect.append(opt);
   const card=node('details',undefined,'energy-lesson');
   const summary=node('summary','Session '+lesson.number+' · '+lesson.title+' (60 minutes)');
   card.append(summary);
   const p=(title,text)=>{const block=node('p');block.append(node('strong',title+': '),document.createTextNode(text));card.append(block);};
   p('Goal',lesson.goal);p('Fictional exercise',lesson.scenario);p('Practice language',lesson.model);
   p('Vocabulary',lesson.vocabulary.join(' · '));
   if(lesson.pronunciation)p('Pronunciation and short speaking warm-up',lesson.pronunciation);
   if(role!=='student'&&lesson.teacherPronunciationPrompt)p('Teacher-only pronunciation coaching',lesson.teacherPronunciationPrompt);
   const heading=node('h3','One-hour lesson agenda');card.append(heading);
   appendList(card,agenda.map(a=>String(a.start).padStart(2,'0')+'–'+String(a.end).padStart(2,'0')+' minutes · '+a.label));
   if(role!=='student'&&lesson.teacherPrompt)p('Teacher-only role-play prompts',lesson.teacherPrompt);
   p('Practice for next class',lesson.homework);
   window.EnglishLegaleseEnergyLiveConductorV1?.mount(card,{lesson,role,agenda});
   lessonsView.append(card);
  }
 }
 async function refresh(){
  const sessionResult=await call(API+'sessions');
  loadedSessions=sessionResult.sessions||[];
  authorized.hidden=false;teacherPanel.hidden=role==='student';historicalPanel.hidden=!['owner','admin'].includes(role);
  loginForm.hidden=true;signout.hidden=false;
  if(role==='student'&&loadedSessions.length===0){
   status.textContent='Signed in. Your teacher has not yet assigned a private class to this account.';
   clear(lessonsView);showSessions(loadedSessions);return;
  }
  const courses=await call(API+'lessons');
  loadedLessons=courses.lessons||[];
  status.textContent=role==='student'?'Signed in — your assigned private lessons are available.':'Signed in — manage only classes attached to your EnglishLegalese account.';
  showCourse(loadedLessons,courses.agenda||[]);
  showSessions(loadedSessions);
 }
 function rowLabel(row){
  const date=row.starts_at?new Date(row.starts_at):null;
  return 'Session '+row.lesson_number+' · '+row.lesson_title+
    (date?' · '+new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Bangkok',day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(date)+' (UTC+7)':' · Time not confirmed');
 }
 function showSessions(items){
  clear(schedule);
  scheduleStatus.textContent=items.length?(items.length+' class record(s) accessible. Only scheduled classes with a verified Meet link can be joined.'):'No private class has been assigned/scheduled yet. Teacher setup is required.';
  for(const row of items){
   const section=node('section',undefined,'session');
   const title=node('h3',rowLabel(row));section.append(title);
   section.append(node('p','Status: '+row.status+' · 60 minutes · '+row.provider,'muted'));
   if(role!=='student'&&row.teacher_only_pronunciation_progress) section.append(node('p','Private teaching observation — crude oil pronunciation: '+row.teacher_only_pronunciation_progress.replaceAll('_',' '),'muted'));
   const actions=node('div',undefined,'actions');
   const meeting=safeMeet(row.meet_url);
   if(row.meet_ready&&meeting){
    const anchor=node('a','Join Google Meet from EnglishLegalese','join');
    anchor.href=meeting;anchor.target='_blank';anchor.rel='noopener noreferrer';
    actions.append(anchor);
   }else section.append(node('p','Meeting access will appear here after the teacher confirms both the time and Google Meet link.','muted'));
   const lessonToggle=node('button','Open lesson '+row.lesson_number);
   lessonToggle.type='button';
   lessonToggle.addEventListener('click',()=>{
    const sel=Array.from(lessonsView.querySelectorAll('details.energy-lesson')).at(row.lesson_number-1);
    if(sel){sel.open=true;sel.scrollIntoView({behavior:'smooth',block:'start'});}
   });
   actions.append(lessonToggle);
   const checkReady=node('button','Check class readiness');
   checkReady.type='button';
   const readinessStatus=node('p',undefined,'energy-readiness-status');
   readinessStatus.setAttribute('role','status');
   readinessStatus.setAttribute('aria-live','polite');
   checkReady.addEventListener('click',async()=>{
    checkReady.disabled=true;
    readinessStatus.textContent='Checking the authenticated class record…';
    try{
     const result=await call(API+'sessions/'+encodeURIComponent(row.id)+'/readiness');
     const label=result.join_available?'Ready for Google Meet':'Not ready to join';
     readinessStatus.textContent=label+' · '+result.next_action+' The audio/video preview is tested in the video provider.';
    }catch(e){readinessStatus.textContent=e.message;}
    finally{checkReady.disabled=false;}
   });
   actions.append(checkReady);
   if(role!=='student'){
    if(row.status==='requested'){
     if(canAutoMeet&&row.starts_at){
      const gen=node('button','Create Google Meet in EnglishLegalese');gen.type='button';
      gen.addEventListener('click',()=>perform(gen,API+'sessions/'+encodeURIComponent(row.id)+'/create-meet',null,teacherStatus));
      actions.append(gen);
     }
     const form=node('form',undefined,'teacher-form');
     const label=node('label','Attach Meet link and confirm class');
     const input=node('input');input.type='url';input.required=true;input.placeholder='https://meet.google.com/abc-defg-hij';input.autocomplete='off';
     label.append(input);
     const timeLabel=node('label','Class starts (UTC+7)');
     const timeInput=node('input');timeInput.type='datetime-local';timeInput.required=true;
     if(row.starts_at){
      const d=new Date(row.starts_at);
      const offset=new Date(d.getTime()+7*3600000);
      timeInput.value=offset.toISOString().slice(0,16);
     }
     timeLabel.append(timeInput);
     const submit=node('button','Save and enable class join');submit.type='submit';
     form.append(label,timeLabel,submit);
     form.addEventListener('submit',async event=>{
      event.preventDefault();
      const url=safeMeet(input.value);
      if(!url){teacherStatus.textContent='Enter a genuine https://meet.google.com/abc-defg-hij meeting URL.';return;}
      try{await perform(submit,API+'sessions/'+encodeURIComponent(row.id)+'/attach-meet',{meet_url:url,starts_at:localStart(timeInput.value)},teacherStatus);}catch(e){teacherStatus.textContent=e.message;}
     });
     section.append(form);
    }
    if(row.status==='scheduled'){
     const complete=node('button','Mark taught after the live class');
     complete.type='button';
     complete.addEventListener('click',()=>{
      if(!confirm('Confirm that this 60-minute session has actually taken place? This does not issue a grade or certificate.'))return;
      perform(complete,API+'sessions/'+encodeURIComponent(row.id)+'/complete',null,teacherStatus);
     });
     actions.append(complete);
    }
   }
   section.append(actions,readinessStatus);schedule.append(section);
  }
 }
 async function perform(button,url,data,target){
  button.disabled=true;target.textContent='Checking the protected class record…';
  try{
   await call(url,'POST',data===null?{}:data);
   target.textContent='Class record updated. No payment or marketing email was sent.';
   await refresh();
  }catch(e){target.textContent=e.message;}
  finally{button.disabled=false;}
 }
 async function checkSaved(){
  const options=[['student',getSession(STUDENT_SESSION)],['teacher',getSession(TEACHER_SESSION)]];
  for(const [type,credential]of options){
   if(!credential)continue;
   token=credential;
   try{
    const me=await call('/api/v119/auth/me');
    if(!me.user||!['student','teacher','owner','admin'].includes(me.user.role))throw Error('Invalid account.');
    role=me.user.role;
    await refresh();
    return;
   }catch(e){
    setSession(type==='student'?STUDENT_SESSION:TEACHER_SESSION,null);
    token=null;role=null;
   }
  }
  loggedOut();
 }
 loginForm.addEventListener('submit',async(event)=>{
  event.preventDefault();
  const type=element('energy-role').value;
  const email=element('energy-email').value.trim();
  const password=element('energy-password').value;
  const endpoint=type==='student'?'/api/v1940/student/auth/login':'/api/v119/auth/login';
  const button=loginForm.querySelector('button[type=submit]');button.disabled=true;status.textContent='Verifying account and private classroom access…';
  try{
   const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password}),cache:'no-store'});
   const data=await escapeHttp(response);
   if(!response.ok||!data.token)throw Error(data.error||'Login not completed.');
   if(type==='student'&&data.user?.role!=='student')throw Error('A verified student account is required.');
   if(type!=='student'&&!['teacher','owner','admin'].includes(data.user?.role))throw Error('An approved teacher or owner account is required.');
   token=data.token;role=data.user.role;
   const key=type==='student'?STUDENT_SESSION:TEACHER_SESSION;
   setSession(key,token);
   element('energy-password').value='';
   await refresh();
  }catch(e){showError(e);}
  finally{button.disabled=false;}
 });
 signout.addEventListener('click',()=>{
  setSession(role==='student'?STUDENT_SESSION:TEACHER_SESSION,null);
  loggedOut('Signed out of this classroom on this device. Existing account security controls remain available in Account.');
 });
 createForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(role==='student'||!token)return;
  const button=createForm.querySelector('button[type=submit]');
  const url=element('energy-link').value.trim();
  if(url&&!safeMeet(url)){teacherStatus.textContent='Enter only a verified Google Meet link, or leave the field empty.';return;}
  let start;try{start=localStart(element('energy-start').value)}catch(e){teacherStatus.textContent=e.message;return;}
  const data={student_email:element('energy-student-email').value.trim(),lesson_number:Number(courseSelect.value),starts_at:start,meet_url:url||null};
  await perform(button,API+'sessions',data,teacherStatus);
 });
 historicalForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!['owner','admin'].includes(role)||!token)return;
  if(!element('energy-history-confirm').checked){teacherStatus.textContent='Confirm that the class was actually taught.';return;}
  let date;
  try{date=localStart(element('energy-history-date').value);}
  catch(e){teacherStatus.textContent=e.message;return;}
  const button=historicalForm.querySelector('button[type=submit]');
  await perform(button,API+'previously-taught',{
    student_email:element('energy-history-email').value.trim(),
    taught_at:date,pronunciation_progress:element('energy-pronunciation-progress').value,confirmed_taught:true
  },teacherStatus);
 });
 (async()=>{
  try{
   const r=await fetch(API+'capabilities',{cache:'no-store'});const data=await escapeHttp(r);
   canAutoMeet=Boolean(r.ok&&data.google_meet_auto_creation);
  }catch{canAutoMeet=false;}
  await checkSaved();
 })();
})();
