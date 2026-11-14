'use strict';
/* HF63 Express + simulated transactional DB. No live class data, calendar, email or payment. */
const assert=require('node:assert/strict');
const express=require('express');
const runtime=require('../src/v2150-private-energy-classroom');
const id=n=>'EL-ENERGY-'+String(n).padStart(8,'0')+'-1111-4111-8111-111111111111';
const start=new Date(Date.now()+7*86400000).toISOString();
const earlier=new Date(Date.now()+8*86400000).toISOString();
const base=n=>({id:id(n),student_user_id:'student-one',teacher_user_id:'teacher-one',
 learner_name:'SYNTHETIC_LEARNER',status:'requested',readiness_status:'needs_meet',
 scheduled_at:start,video_join_url:null,metadata:{course_key:runtime.COURSE,lesson_number:n}});
const first=base(1),second=base(2),third=base(3),fourth=base(4);
second.status='scheduled';second.video_join_url='https://meet.google.com/jkl-mnop-qrs';
third.metadata.student_change_request={kind:'reschedule',status:'pending',requested_at:start};
fourth.readiness_status='generating_meet';
const rows=[first,second,third,fourth];
let overlapping=false,txChanged=false,manualWrites=0,providerCalls=0,lockNames=[],begun=0,commits=0,rollbacks=0;
const client={
 async query(sql,args=[]){
  if(sql==='BEGIN'){begun++;return {rows:[]};}
  if(sql==='COMMIT'){commits++;return {rows:[]};}
  if(sql==='ROLLBACK'){rollbacks++;return {rows:[]};}
  if(sql.includes('pg_advisory_xact_lock')){lockNames.push(args[0]);return{rows:[]};}
  if(sql.includes('FOR UPDATE')){
   const row=rows.find(r=>r.id===args[0]&&r.teacher_user_id===args[1]&&r.metadata.course_key===args[2]);
   if(!row)return{rows:[]};
   if(txChanged)return{rows:[{...row,video_join_url:'https://meet.google.com/abc-defg-hij'}]};
   return{rows:[row]};
  }
  if(sql.includes('SELECT 1 FROM class_sessions WHERE teacher_user_id=$1')){
   assert.ok(sql.includes("AND id<>$3"),'exclude current class');
   return {rows:overlapping?[{present:1}]:[]};
  }
  if(sql.startsWith('UPDATE class_sessions SET scheduled_at=')){
   assert.ok(sql.includes("status='requested'"),'write once requested only');
   assert.ok(sql.includes('video_join_url IS NULL'),'no replacing booked link');
   assert.ok(sql.includes("readiness_status IS DISTINCT FROM 'generating_meet'"),'no provider race');
   assert.ok(sql.includes("NOT IN ('pending','coordination_required')"),'request barrier');
   const record=rows.find(r=>r.id===args[0]&&r.teacher_user_id===args[1]);
   if(!record||record.status!=='requested'||record.video_join_url||record.readiness_status==='generating_meet')return {rows:[]};
   record.status='scheduled';record.video_join_url=args[3];record.readiness_status='ready';record.scheduled_at=args[2];
   manualWrites++;return{rows:[record]};
  }
  throw Error('Unexpected transaction SQL '+sql.slice(0,180));
 },
 release(){}
};
const services={
 mode:()=> 'postgres',persistentStore:{pool:{connect:async()=>client}},
 createCalendarVideoSession(){providerCalls++;throw Error('external provider prohibited')},
 sendEmail(){providerCalls++;throw Error('external email prohibited')},
 async query(sql,args=[]){
  if(sql.includes('to_regclass('))return {rows:[{sessions:'class_sessions',auth_sessions:'user_sessions',verification:'ai_trial_email_verifications'}]};
  if(sql.includes('AS verified'))return {rows:[{verified:true}]};
  if(sql.includes('AND id=$2 AND (student_user_id=$3 OR teacher_user_id=$3)')){
   return {rows:rows.filter(x=>x.id===args[1]&&(x.student_user_id===args[2]||x.teacher_user_id===args[2]))};
  }
  throw Error('Unexpected regular database SQL '+sql.slice(0,160));
 }};
const accounts={
 teacher:{id:'teacher-one',role:'teacher'},other:{id:'teacher-two',role:'teacher'},
 learner:{id:'student-one',role:'student'}};
const app=express();app.use(express.json());
const authMiddleware=()=> (req,res,next)=>{
 const user=accounts[(req.get('authorization')||'').replace(/^Bearer /,'')];
 if(!user)return res.status(401).json({ok:false,error:'Sign in'});
 req.user=user;req.authSessionKey='synthetic-revocable';next();
};
const requireRoles=(...roles)=>(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({ok:false,error:'Role denied'});
runtime.install(app,{services,authMiddleware,requireRoles,configured:()=>({google_calendar:false})});
(async()=>{
 const server=await new Promise(resolve=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));});
 const url='http://127.0.0.1:'+server.address().port+'/api/v2150/private-energy/sessions/';
 const attach=async(n,token,at=start)=>{
  const response=await fetch(url+id(n)+'/attach-meet',{method:'POST',
   headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},
   body:JSON.stringify({meet_url:'https://meet.google.com/abc-defg-hij',starts_at:at,external_calendar_acknowledged:true})});
  return {status:response.status,data:await response.json()};
 };
 try{
  assert.equal((await attach(1,'learner')).status,403);
  assert.equal((await attach(1,'other')).status,404);
  assert.equal((await attach(2,'teacher')).status,409,'scheduled Meet cannot be replaced');
  assert.equal((await attach(3,'teacher')).status,409,'pending student request blocks');
  assert.equal((await attach(4,'teacher')).status,409,'provider generation claim blocks');
  assert.equal((await attach(1,'teacher',earlier)).status,409,'assigned tentative time cannot shift silently');
  overlapping=true;
  assert.equal((await attach(1,'teacher')).status,409,'cross-class conflict is transactionally rechecked');
  assert.equal(manualWrites,0);
  overlapping=false;txChanged=true;
  assert.equal((await attach(1,'teacher')).status,409,'concurrent class change is detected under row lock');
  txChanged=false;
  const approved=await attach(1,'teacher');
  assert.equal(approved.status,200);
  assert.equal(approved.data.session.status,'scheduled');
  assert.equal(approved.data.session.meet_url,'https://meet.google.com/abc-defg-hij');
  assert.equal(approved.data.calendar_event_created,false);
  assert.equal(approved.data.external_calendars_checked,false);
  assert.equal(approved.data.no_email_sent,true);
  assert.equal(manualWrites,1);
  assert.equal((await attach(1,'teacher')).status,409,'repeat attempts cannot replace saved URL');
  assert.equal(commits,1);assert.equal(providerCalls,0);
  assert.ok(begun>=3&&rollbacks>=2);
  assert.ok(lockNames.every(k=>k===runtime.COURSE+':teacher-calendar:teacher-one'));
  assert.equal(runtime.nowTime(new Date(Date.now()-60000).toISOString()),null,'past time is rejected');
  assert.equal(runtime.nowTime('2027-02-30T09:00:00+07:00'),null,'invalid month-day rollover must be rejected');
  console.log('PASS HF63: manual meeting write-once, transaction-scoped lock and overlap, row mutation race, student protections, real date validation, zero external side effects.');
 }finally{await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
