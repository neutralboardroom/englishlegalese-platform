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
 let listIsPartial=false,historyOffset=0,historyExhausted=false;
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
  if(Number.isNaN(iso.getTime())||new Date(iso.getTime()+7*3600000).toISOString().slice(0,16)!==value)throw Error('Enter a real, valid Vietnam / Thailand class time (UTC+7).');
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
  listIsPartial=false;historyOffset=0;historyExhausted=false;
  document.getElementById('energy-hf61-review-board')?.remove();
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
   window.EnglishLegaleseEnergyPresentationV1?.mount(card,{lesson,role});
   lessonsView.append(card);
  }
 }
 async function refresh(){
  const sessionResult=await call(API+'sessions');
  loadedSessions=sessionResult.sessions||[];
  listIsPartial=Boolean(sessionResult.partial);
  historyOffset=0;historyExhausted=false;
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
  if(role!=='student')await showReviewBoard();
 }
 function rowLabel(row){
  const date=row.starts_at?new Date(row.starts_at):null;
  return 'Session '+row.lesson_number+' · '+row.lesson_title+
    (date?' · '+new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Bangkok',day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(date)+' (UTC+7)':' · Time not confirmed');
 }
 async function showReviewBoard(){
  document.getElementById('energy-hf61-review-board')?.remove();
  if(role==='student')return;
  const board=node('details',undefined,'energy-review-board');board.id='energy-hf61-review-board';
  const summary=node('summary','Loading your protected teacher review queue…');
  const contents=node('div',undefined,'energy-review-board-items');
  const more=node('button','Load more pending change requests (50 per page)');
  more.type='button';more.className='energy-review-board-more';
  const progress=node('p',undefined,'energy-review-board-status');
  progress.setAttribute('role','status');progress.setAttribute('aria-live','polite');
  board.append(summary,contents,more,progress);
  teacherPanel.prepend(board);
  let offset=0,shown=0,hasMore=true,busy=false;
  const seen=new Set();
  async function openItem(item,button){
   button.disabled=true;progress.textContent='Verifying your assignment to this class…';
   try{
    let target=document.getElementById('energy-class-'+item.id);
    if(!target){
     const detail=await call(API+'sessions/'+encodeURIComponent(item.id));
     if(!detail.session||detail.session.id!==item.id)throw Error('Class record could not be verified.');
     if(!loadedSessions.some(row=>row.id===item.id))loadedSessions.push(detail.session);
     showSessions(loadedSessions);
     target=document.getElementById('energy-class-'+item.id);
    }
    if(!target)throw Error('Class record could not be displayed.');
    if(target.closest('.energy-history-items')){
     const history=schedule.querySelector('.energy-history-list');if(history)history.open=true;
    }
    board.open=false;target.scrollIntoView({behavior:'smooth',block:'start'});
    target.setAttribute('tabindex','-1');target.focus();
    progress.textContent='Opened assigned class without modifying the booking.';
   }catch(e){progress.textContent=e.message+' No Calendar, billing, email or class change was made.';}
   finally{button.disabled=false;}
  }
  async function loadPage(){
   if(!hasMore||busy)return;
   busy=true;more.disabled=true;progress.textContent='Loading another authorized queue page…';
   try{
    const data=await call(API+'review-queue'+(offset?'?offset='+offset:''));
    const rows=Array.isArray(data.requests)?data.requests:[];
    const next=Number(data.next_offset);
    offset=Number.isInteger(next)&&next>offset?next:offset+rows.length;
    hasMore=Boolean(data.has_more??data.partial);
    for(const item of rows){
     if(!item?.id||seen.has(item.id))continue;
     seen.add(item.id);shown++;
     const card=node('section',undefined,'energy-review-board-item');
     let time='Time unconfirmed';
     if(item.starts_at){
      const date=new Date(item.starts_at);
      if(Number.isFinite(date.getTime()))time=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Bangkok',dateStyle:'medium',timeStyle:'short'}).format(date)+' (UTC+7)';
     }
     card.append(node('p','Lesson '+item.lesson_number+' · '+(item.change_request?.kind||'change')+' request · '+time));
     const view=node('button','Go to this class for review');view.type='button';
     view.addEventListener('click',()=>openItem(item,view));
     card.append(view);contents.append(card);
    }
    summary.textContent='Pending student change requests ('+shown+(hasMore?'+':'')+') · check external calendars separately';
    if(!shown)contents.append(node('p','No currently pending assigned change requests were returned.','muted'));
    if(hasMore&&!contents.querySelector('.energy-review-page-warning')){
     const warning=node('p','This queue displays only the first 50 pending requests per page. It is incomplete until the remaining pages are checked.','notice');
     warning.classList.add('energy-review-page-warning');contents.prepend(warning);
    }
    progress.textContent='Showing '+shown+' distinct assigned request(s). '+(hasMore?'Further pages may remain.':'No more requests were returned. Refresh after teacher decisions.');
    if(hasMore&&rows.length===0){hasMore=false;progress.textContent='Queue pagination could not advance. Refresh or request owner reconciliation.';}
   }catch(e){summary.textContent='Teacher change-request queue unavailable';progress.textContent=e.message+' Do not assume the queue is empty.';}
   finally{busy=false;more.hidden=!hasMore||offset>10000;more.disabled=false;}
  }
  more.addEventListener('click',loadPage);
  await loadPage();
 }
 function showSessions(items){
  clear(schedule);
  // Preserve historical records without counting former learners or past
  // bookings as currently active students, lessons or attendance.
  const now=Date.now();
  const isHistorical=row=>{
   if(['completed','cancelled'].includes(row.status))return true;
   const start=row.starts_at?new Date(row.starts_at).getTime():NaN;
   return Number.isFinite(start)&&start+90*60000<=now;
  };
  const history=items.filter(isHistorical);
  const upcoming=items.filter(row=>!isHistorical(row)&&row.starts_at);
  const unconfirmed=items.filter(row=>!isHistorical(row)&&!row.starts_at);
  const pending=items.filter(row=>row.change_request?.status==='pending');
  scheduleStatus.textContent=items.length
   ?'Current/upcoming class records: '+upcoming.length+' · Awaiting a time: '+unconfirmed.length+
    ' · Past or closed records: '+history.length+' · Pending change requests: '+pending.length+
    '. A historical record is not an active student or a confirmed future booking.'
   :'No private class has been assigned/scheduled yet. Teacher setup is required.';
  if(listIsPartial)scheduleStatus.textContent+=' Showing only the first 50 prioritized records; this is not a complete class count.';
  const historicalDetails=node('details',undefined,'energy-history-list');
  const historyHeading=node('summary','Past and closed class records ('+history.length+')');
  const historicalContainer=node('div',undefined,'energy-history-items');
  historicalDetails.append(historyHeading,historicalContainer);
  for(const row of [...upcoming,...unconfirmed,...history]){
   const historical=isHistorical(row);
   const section=node('section',undefined,'session');
   section.id='energy-class-'+row.id;
   const title=node('h3',rowLabel(row));section.append(title);
   section.append(node('p','Status: '+row.status+' · 60 minutes · '+row.provider,'muted'));
   if(role!=='student'&&row.teacher_only_pronunciation_progress) section.append(node('p','Private teaching observation — crude oil pronunciation: '+row.teacher_only_pronunciation_progress.replaceAll('_',' '),'muted'));
   if(row.change_request?.status==='pending'){
    section.append(node('p',role==='student'
     ?'Your '+row.change_request.kind+' request is pending teacher review. The original appointment is unchanged. No fee, refund or credit decision has been made.'
     :'Student requested '+row.change_request.kind+'. Review the agreed notice policy and external calendar event manually. No automatic email, fee or calendar action occurred.','notice'));
   }
   if(row.change_request?.status==='coordination_required'){
    section.append(node('p','Student change request: awaiting manual teacher/student coordination. This is NOT a confirmed cancellation or reschedule. Your original class time and Meet remain in effect; no fee or credit decision was made.','notice'));
   }
   if(row.change_request?.status==='declined'){
    section.append(node('p','Student change request was declined after teacher review. The original class remains scheduled unless separately changed. No fee, credit, provider or email action was performed.','muted'));
   }
   const actions=node('div',undefined,'actions');
   const meeting=safeMeet(row.meet_url);
   if(row.meet_ready&&meeting&&!historical){
    const anchor=node('a','Join Google Meet from EnglishLegalese','join');
    anchor.href=meeting;anchor.target='_blank';anchor.rel='noopener noreferrer';
    actions.append(anchor);
   }else section.append(node('p',historical
    ?'Past or closed class record. No live meeting link is offered here; the lesson history remains available.'
    :'Meeting access will appear here after the teacher confirms both the time and Google Meet link.','muted'));
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
     readinessStatus.textContent=label+' · '+result.next_action+' EnglishLegalese has not tested your microphone, speakers, camera or the external provider connection.';
    }catch(e){readinessStatus.textContent=e.message;}
    finally{checkReady.disabled=false;}
   });
   actions.append(checkReady);
   if(role==='student'&&['requested','scheduled'].includes(row.status)&&row.starts_at&&new Date(row.starts_at).getTime()>Date.now()&&!['pending','coordination_required'].includes(row.change_request?.status)){
    const form=node('form',undefined,'energy-change-form');
    const kindLabel=node('label','Change my class');
    const select=node('select');select.name='change-kind';
    for(const [value,label] of [['cancel','Request cancellation'],['reschedule','Request another time']]){
     const option=node('option',label);option.value=value;select.append(option);
    }
    kindLabel.append(select);
    const dateLabel=node('label','Preferred new time (Vietnam / Thailand, UTC+7)');
    const dateInput=node('input');dateInput.type='datetime-local';dateInput.name='proposed-time';
    dateLabel.append(dateInput);dateLabel.hidden=true;
    select.addEventListener('change',()=>{dateLabel.hidden=select.value!=='reschedule';dateInput.required=select.value==='reschedule';});
    const policy=node('p',row.notice_policy_hours
     ?'Requested notice period: '+row.notice_policy_hours+' hours. Your teacher must review credit and fee eligibility.'
     :'Your notice period and credit/fee terms are not yet confirmed here. A request never charges or refunds a card.','muted');
    const submit=node('button','Send change request for teacher review');submit.type='submit';
    const info=node('p',undefined,'energy-change-status');info.setAttribute('role','status');info.setAttribute('aria-live','polite');
    form.append(kindLabel,dateLabel,policy,submit,info);
    form.addEventListener('submit',async event=>{
     event.preventDefault();
     let body={kind:select.value};
     if(select.value==='reschedule'){
      try{body.proposed_at=localStart(dateInput.value);}catch(e){info.textContent=e.message;return;}
     }
     submit.disabled=true;info.textContent='Sending your authenticated request…';
     try{
      const result=await call(API+'sessions/'+encodeURIComponent(row.id)+'/change-request','POST',body);
      info.textContent=result.message||'Request recorded. Teacher review is required.';
      await refresh();
     }catch(e){info.textContent=e.message;}finally{submit.disabled=false;}
    });
    section.append(form);
   }
   if(role!=='student'){
    if(row.change_request?.status==='pending'){
     const review=node('section',undefined,'energy-review-queue');
     review.append(node('h4','Review the student change request'));
     const kind=row.change_request.kind==='cancel'?'cancellation':'rescheduling';
     review.append(node('p','Request: '+kind+'. This review does not alter the confirmed class or Google Calendar.','muted'));
     if(row.change_request.kind==='reschedule'&&row.change_request.proposed_at){
      const proposed=new Date(row.change_request.proposed_at);
      if(Number.isFinite(proposed.getTime()))review.append(node('p','Proposed new time: '+new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Bangkok',dateStyle:'medium',timeStyle:'short'}).format(proposed)+' (UTC+7)'));
     }
     const reasonLabel=node('label','Reason for the teacher decision (no student or client details)');
     const reason=node('select');
     for(const [value,label] of [
      ['manual_coordination','Requires discussion with student'],
      ['schedule_conflict','Teacher calendar conflict'],
      ['insufficient_information','More scheduling information required'],
      ['other','Other non-confidential reason']
     ]){const option=node('option',label);option.value=value;reason.append(option);}
     reasonLabel.append(reason);
     const decisionActions=node('div',undefined,'actions');
     const decisionStatus=node('p',undefined,'energy-review-status');
     decisionStatus.setAttribute('role','status');decisionStatus.setAttribute('aria-live','polite');
     for(const [value,label] of [['coordinate','Mark for manual coordination'],['decline','Decline change request']]){
      const button=node('button',label);button.type='button';
      button.addEventListener('click',async()=>{
       if(!window.confirm(value==='coordinate'
        ?'Record that this change needs manual coordination? The original appointment and Google Meet will remain unchanged.'
        :'Decline this request? The original class and Google Meet will remain unchanged.'))return;
       for(const control of decisionActions.querySelectorAll('button'))control.disabled=true;
       decisionStatus.textContent='Recording teacher decision without changing bookings, charges or calendars…';
       try{
        const result=await call(API+'sessions/'+encodeURIComponent(row.id)+'/review-change','POST',{decision:value,reason:reason.value});
        decisionStatus.textContent=result.message;
        await refresh();
       }catch(e){decisionStatus.textContent=e.message;}
       finally{for(const control of decisionActions.querySelectorAll('button'))control.disabled=false;}
      });
      decisionActions.append(button);
     }
     review.append(reasonLabel,decisionActions,decisionStatus);
     section.append(review);
    }
    if(row.status==='requested'&&!['pending','coordination_required'].includes(row.change_request?.status)){
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
     const checkLabel=node('label','I checked my external Google calendars separately; no conflicting appointment is known. This site has not verified them.');
     const checkInput=node('input');checkInput.type='checkbox';checkInput.className='energy-manual-meet-confirm';
     checkLabel.prepend(checkInput);
     const limitation=node('p','This is a one-time teacher confirmation for an unconfirmed class. A scheduled appointment or existing Google Meet link cannot be silently overwritten. No student invitation or payment is sent.','muted');
     const preflight=node('button','Check this class for EnglishLegalese conflicts');
     preflight.type='button';preflight.className='energy-manual-meet-preflight';
     const preflightStatus=node('p',undefined,'energy-manual-meet-preflight-status');
     preflightStatus.setAttribute('role','status');preflightStatus.setAttribute('aria-live','polite');
     preflight.addEventListener('click',async()=>{
      let start;
      try{start=localStart(timeInput.value);}catch(e){preflightStatus.textContent=e.message;return;}
      preflight.disabled=true;preflightStatus.textContent='Checking assigned class and internal EnglishLegalese schedule…';
      try{
       const result=await call(API+'sessions/'+encodeURIComponent(row.id)+'/confirmation-preflight?starts_at='+encodeURIComponent(start));
       preflightStatus.textContent=result.notice+' All Google calendars still require manual review.';
      }catch(e){preflightStatus.textContent=e.message+' Do not confirm the booking before resolving this.';}
      finally{preflight.disabled=false;}
     });
     const submit=node('button','Confirm unbooked class and attach Meet');submit.type='submit';
     form.append(label,timeLabel,preflight,preflightStatus,checkLabel,limitation,submit);
     form.addEventListener('submit',async event=>{
      event.preventDefault();
      const url=safeMeet(input.value);
      if(!url){teacherStatus.textContent='Enter a genuine https://meet.google.com/abc-defg-hij meeting URL.';return;}
      if(!checkInput.checked){teacherStatus.textContent='Check your external Google calendars before confirming this one-time booking. This site cannot verify them.';return;}
      try{await perform(submit,API+'sessions/'+encodeURIComponent(row.id)+'/attach-meet',{meet_url:url,starts_at:localStart(timeInput.value),external_calendar_acknowledged:true},teacherStatus);}catch(e){teacherStatus.textContent=e.message;}
     });
     section.append(form);
    }
    if(row.status==='scheduled'){
     const start=row.starts_at?new Date(row.starts_at).getTime():NaN;
     const elapsed=Number.isFinite(start)&&start+60*60000<=Date.now();
     if(elapsed){
      const complete=node('button','Mark taught after the live class');
      complete.type='button';
      complete.addEventListener('click',()=>{
       if(!confirm('Confirm this class was actually taught for the scheduled 60-minute period? This does not issue a grade or certificate.'))return;
       perform(complete,API+'sessions/'+encodeURIComponent(row.id)+'/complete',{confirmed_taught:true},teacherStatus);
      });
      actions.append(complete);
     }else actions.append(node('p','Class completion becomes available after the scheduled 60-minute lesson ends.','muted'));
    }
   }
   section.append(actions,readinessStatus);
   (historical?historicalContainer:schedule).append(section);
  }
  if(!historyExhausted){
   const loadMore=node('button','Load older class records (25 per page)');
   loadMore.type='button';loadMore.className='energy-load-history';
   const note=node('p',undefined,'energy-load-history-status');note.setAttribute('role','status');note.setAttribute('aria-live','polite');
   loadMore.addEventListener('click',async()=>{
    loadMore.disabled=true;note.textContent='Loading your authenticated history page…';
    try{
     const data=await call(API+'sessions/history?offset='+historyOffset);
     historyOffset=data.next_offset;
     historyExhausted=!data.has_more;
     const seen=new Set(loadedSessions.map(x=>x.id));
     const newItems=(data.sessions||[]).filter(x=>!seen.has(x.id));
     loadedSessions.push(...newItems);
     showSessions(loadedSessions);
     const historyPanel=schedule.querySelector('.energy-history-list');
     if(historyPanel){historyPanel.open=true;
      const message=historyPanel.querySelector('.energy-load-history-status');
      if(message)message.textContent=newItems.length+' additional class record(s) loaded. '+(historyExhausted?'No further historical records were reported.':'More pages may remain.');}
    }catch(e){note.textContent=e.message;loadMore.disabled=false;}
   });
   historicalDetails.append(loadMore,note);
  }else historicalDetails.append(node('p','No additional pages were reported by the authenticated history service.','muted'));
  if(history.length||listIsPartial||!historyExhausted)schedule.append(historicalDetails);
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
 // Check EnglishLegalese conflicts; the teacher must independently review Google calendars.
 const conflictButton=node('button','Check EnglishLegalese calendar conflicts');conflictButton.type='button';
 const conflictResult=node('p',undefined,'energy-internal-conflict-result');conflictResult.setAttribute('role','status');
 const teacherAck=node('label','I checked my Google calendars separately for overlapping appointments.');
 const teacherAckInput=node('input');teacherAckInput.type='checkbox';teacherAck.append(teacherAckInput);
 createForm.prepend(conflictButton,conflictResult,teacherAck);
 conflictButton.addEventListener('click',async()=>{
  let start;try{start=localStart(element('energy-start').value);}catch(e){conflictResult.textContent=e.message;return;}
  conflictButton.disabled=true;
  try{const result=await call(API+'teacher-conflicts?starts_at='+encodeURIComponent(start));conflictResult.textContent=result.notice+' External Google calendars were not checked by this tool.';}
  catch(e){conflictResult.textContent=e.message;}finally{conflictButton.disabled=false;}
 });
 createForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(role==='student'||!token)return;
  if(!teacherAckInput.checked){teacherStatus.textContent='Check your Google calendars for conflicts before creating the class.';return;}
  const button=createForm.querySelector('button[type=submit]');
  const url=element('energy-link').value.trim();
  if(url&&!safeMeet(url)){teacherStatus.textContent='Enter only a verified Google Meet link, or leave the field empty.';return;}
  let start;try{start=localStart(element('energy-start').value)}catch(e){teacherStatus.textContent=e.message;return;}
  const data={student_email:element('energy-student-email').value.trim(),lesson_number:Number(courseSelect.value),starts_at:start,meet_url:url||null,external_calendar_acknowledged:true};
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
