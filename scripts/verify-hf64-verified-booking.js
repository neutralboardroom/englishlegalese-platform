'use strict';
/* HF64: synthetic end-to-end Express and transactional SQL qualification.
 * No connection to student records, Google Calendar, Gmail, Meet or payments. */
const assert=require('node:assert/strict');
const express=require('express');
const runtime=require('../src/v2150-private-energy-classroom');
const id=n=>'EL-ENERGY-'+String(n).padStart(8,'0')+'-1111-4111-8111-111111111111';
const start=new Date(Date.now()+8*86400000).toISOString();
const otherTime=new Date(Date.now()+12*86400000).toISOString();
const scheduled={
 id:id(4),student_user_id:'student-one',teacher_user_id:'teacher-one',
 learner_name:'SYNTHETIC_LEARNER',scheduled_at:start,status:'requested',
 video_join_url:null,readiness_status:'needs_meet',
 metadata:{course_key:runtime.COURSE,lesson_number:4}
};
const pending={...scheduled,id:id(5),metadata:{...scheduled.metadata,lesson_number:5,
 student_change_request:{kind:'cancel',status:'pending',requested_at:start}}};
let verified=true,activePrior=true,overlap=false,providerActions=0,inserts=0,tx=0,ackSeen=false;
const txDb={
 async query(sql,args=[]){
  if(sql==='BEGIN'){tx++;return{rows:[]};}
  if(sql==='ROLLBACK'||sql==='COMMIT')return{rows:[]};
  if(sql.includes('FROM users WHERE lower(users.email)')){
   assert.ok(sql.includes('ai_trial_email_verifications'),'uses existing verification ledger');
   return{rows:[{id:'student-one',full_name:'SYNTHETIC_LEARNER',
    email:'synthetic@example.invalid',role:'student',status:'active',email_verified:verified}]};
  }
  if(sql.includes('SELECT 1 FROM class_sessions WHERE student_user_id=$1 AND teacher_user_id=$2')){
   assert.ok(sql.includes("status IN ('requested','scheduled')"),'historical classes cannot authorize new enrollment');
   assert.ok(sql.includes("metadata->>'course_key'=$3"),'teacher enrollment must remain same course');
   return{rows:activePrior?[{present:1}]:[]};
  }
  if(sql.includes('pg_advisory_xact_lock'))return{rows:[]};
  if(sql.includes("SELECT id FROM class_sessions WHERE student_user_id=$1"))return{rows:[]};
  if(sql.includes('SELECT 1 FROM class_sessions WHERE teacher_user_id=$1')&&sql.includes("interval '60 minutes'")){
   return{rows:overlap?[{present:1}]:[]};
  }
  if(sql.startsWith('INSERT INTO class_sessions')){
   const meta=JSON.parse(args[11]);
   assert.equal(meta.manual_external_calendar_review_attested,true);
   ackSeen=true;inserts++;
   return{rows:[{id:args[0],student_user_id:args[3],teacher_user_id:args[4],
    learner_name:args[1],scheduled_at:args[5],status:args[8],
    video_join_url:args[7],metadata:meta}]};
  }
  throw Error('Unexpected HF64 synthetic transaction SQL '+sql.slice(0,180));
 },
 release(){}
};
const services={
 mode:()=> 'postgres',persistentStore:{pool:{connect:async()=>txDb}},
 createCalendarVideoSession(){providerActions++;throw Error('External Calendar prohibited')},
 sendEmail(){providerActions++;throw Error('Email prohibited')},
 async query(sql,args=[]){
  if(sql.includes('to_regclass('))return {rows:[{sessions:'class_sessions',auth_sessions:'user_sessions',verification:'ai_trial_email_verifications'}]};
  if(sql.includes('AS verified'))return {rows:[{verified:true}]};
  if(sql.includes('AND id=$2 AND (student_user_id=$3 OR teacher_user_id=$3)')){
   return{rows:[scheduled,pending].filter(r=>r.id===args[1]&&(r.student_user_id===args[2]||r.teacher_user_id===args[2]))};
  }
  if(sql.includes('SELECT 1 FROM class_sessions WHERE teacher_user_id=$1')&&sql.includes("interval '60 minutes'")){
   assert.ok(sql.includes('id<>$3'),'exclude own class when checking meet confirmation');
   return{rows:overlap?[{present:1}]:[]};
  }
  throw Error('Unexpected HF64 direct SQL '+sql.slice(0,160));
 }};
const accounts={
 owner:{id:'owner-one',role:'owner',full_name:'SYNTHETIC_OWNER'},
 teacher:{id:'teacher-one',role:'teacher',full_name:'SYNTHETIC_TEACHER'},
 outsider:{id:'other-teacher',role:'teacher',full_name:'SYNTHETIC_OUTSIDER'},
 student:{id:'student-one',role:'student',full_name:'SYNTHETIC_LEARNER'}
};
const app=express();app.use(express.json());
const authMiddleware=()=> (req,res,next)=>{
 const who=(req.get('authorization')||'').replace(/^Bearer /,'');
 if(!accounts[who])return res.status(401).json({ok:false,error:'Sign in'});
 req.user=accounts[who];req.authSessionKey='synthetic-revocable';next();
};
const requireRoles=(...roles)=>(req,res,next)=>roles.includes(req.user?.role)?next():res.status(403).json({ok:false,error:'Forbidden'});
runtime.install(app,{services,authMiddleware,requireRoles,configured:()=>({google_calendar:false})});
(async()=>{
 const srv=await new Promise(ok=>{const x=app.listen(0,'127.0.0.1',()=>ok(x));});
 const root='http://127.0.0.1:'+srv.address().port+'/api/v2150/private-energy/';
 const get=async(path,who)=>{
  const r=await fetch(root+path,{headers:who?{Authorization:'Bearer '+who}:{}});
  return{status:r.status,data:await r.json()};
 };
 const post=async(path,who,body)=>{
  const r=await fetch(root+path,{method:'POST',headers:{Authorization:'Bearer '+who,'Content-Type':'application/json'},body:JSON.stringify(body)});
  return{status:r.status,data:await r.json()};
 };
 const input={student_email:'synthetic@example.invalid',lesson_number:6,starts_at:otherTime,meet_url:'https://meet.google.com/abc-defg-hij'};
 try{
  assert.equal((await post('sessions','student',{...input,external_calendar_acknowledged:true})).status,403);
  assert.equal((await post('sessions','owner',input)).status,400,'server not browser enforces attestation');
  assert.equal(inserts,0);
  verified=false;
  assert.equal((await post('sessions','owner',{...input,external_calendar_acknowledged:true})).status,404,'unverified cannot enroll');
  assert.equal(inserts,0);
  verified=true;activePrior=false;
  assert.equal((await post('sessions','teacher',{...input,external_calendar_acknowledged:true})).status,403,'old completed history cannot grant teacher authority');
  activePrior=true;overlap=true;
  assert.equal((await post('sessions','teacher',{...input,external_calendar_acknowledged:true})).status,409,'overlapping class cannot book');
  overlap=false;
  const created=await post('sessions','teacher',{...input,external_calendar_acknowledged:true});
  assert.equal(created.status,201);
  assert.equal(created.data.manual_external_calendar_review_attested,true);
  assert.equal(created.data.external_calendars_checked,false);
  assert.equal(created.data.no_email_sent,true);
  assert.equal(created.data.payment_changed,false);
  assert.equal(created.data.session.status,'scheduled');
  assert.equal(inserts,1);assert.equal(ackSeen,true);
  assert.equal((await get('sessions/'+scheduled.id+'/confirmation-preflight?starts_at='+encodeURIComponent(start),null)).status,401);
  assert.equal((await get('sessions/'+scheduled.id+'/confirmation-preflight?starts_at='+encodeURIComponent(start),'student')).status,403);
  assert.equal((await get('sessions/'+scheduled.id+'/confirmation-preflight?starts_at='+encodeURIComponent(start),'outsider')).status,404);
  assert.equal((await get('sessions/'+scheduled.id+'/confirmation-preflight?starts_at=tomorrow','teacher')).status,400);
  const open=await get('sessions/'+scheduled.id+'/confirmation-preflight?starts_at='+encodeURIComponent(start),'teacher');
  assert.equal(open.status,200);
  assert.equal(open.data.eligible_for_manual_confirmation,true);
  assert.equal(open.data.internal_conflict,false);
  assert.equal(open.data.google_calendars_checked,false);
  assert.equal(open.data.full_conflict_clearance,false);
  const blocked=await get('sessions/'+pending.id+'/confirmation-preflight?starts_at='+encodeURIComponent(start),'teacher');
  assert.equal(blocked.status,200);assert.equal(blocked.data.eligible_for_manual_confirmation,false);
  overlap=true;
  const conflict=await get('sessions/'+scheduled.id+'/confirmation-preflight?starts_at='+encodeURIComponent(start),'teacher');
  assert.equal(conflict.data.internal_conflict,true);
  assert.equal((await post('sessions/'+scheduled.id+'/attach-meet','teacher',{meet_url:input.meet_url,starts_at:start})).status,400,'server enforces attach attestation');
  assert.equal(providerActions,0);
  console.log('PASS HF64: verified student, active same-course assignment, server calendar attestation, transaction conflict, scoped class preflight and zero provider side effects.');
 }finally{await new Promise(ok=>srv.close(ok));}
})().catch(e=>{console.error(e);process.exitCode=1;});
