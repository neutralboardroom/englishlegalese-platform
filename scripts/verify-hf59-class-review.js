'use strict';
/* HF59 auth/ownership/audit regression using only a simulated database.
 * NEVER contacts live accounts, providers, email, billing or calendars. */
const assert=require('node:assert/strict');
const express=require('express');
const {install}=require('../src/v2150-private-energy-classroom');
const COURSE='energy-contracts-60-v1';
const id=n=>'EL-ENERGY-'+n+'11111111-1111-4111-8111-111111111111'.slice(n.length);
const one=id('1'),two=id('2');
const timestamp=new Date().toISOString();
const starting=new Date(Date.now()+7*86400000).toISOString();
const records=[
 {id:one,student_user_id:'student-one',teacher_user_id:'teacher-one',learner_name:'NEVER_EXPOSE_LEARNER',
  scheduled_at:starting,status:'scheduled',video_join_url:'https://meet.google.com/abc-defg-hij',
  metadata:{course_key:COURSE,lesson_number:2,student_change_request:{kind:'cancel',status:'pending',requested_at:timestamp}}},
 {id:two,student_user_id:'student-two',teacher_user_id:'teacher-one',learner_name:'SECOND_PRIVATE_LEARNER',
  scheduled_at:starting,status:'scheduled',video_join_url:'https://meet.google.com/def-ghij-klm',
  metadata:{course_key:COURSE,lesson_number:3,student_change_request:{kind:'reschedule',status:'pending',
   requested_at:timestamp,proposed_at:new Date(Date.now()+9*86400000).toISOString()}}}
];
const users={
 'student-one':{id:'student-one',role:'student'},
 'student-two':{id:'student-two',role:'student'},
 'teacher-one':{id:'teacher-one',role:'teacher'},
 'teacher-two':{id:'teacher-two',role:'teacher'}
};
let teacherWrites=0,providerActions=0;
const services={mode:()=> 'postgres',
 sendEmail:()=>{providerActions++;throw Error('Outbound email forbidden in synthetic test')},
 createCalendarVideoSession:()=>{providerActions++;throw Error('Calendar write forbidden')},
 async query(sql,params=[]){
  if(sql.includes('to_regclass('))return {rows:[{sessions:'class_sessions',auth_sessions:'user_sessions',verification:'ai_trial_email_verifications'}]};
  if(sql.includes('AS verified'))return {rows:[{verified:true}]};
  if(sql.includes('AND id=$2 AND (student_user_id=$3 OR teacher_user_id=$3)'))
   return {rows:records.filter(x=>x.id===params[1]&&(x.student_user_id===params[2]||x.teacher_user_id===params[2]))};
  if(sql.startsWith('UPDATE class_sessions SET metadata=jsonb_set(jsonb_set(')){
   const r=records.find(x=>x.id===params[0]&&x.teacher_user_id===params[1]&&x.metadata.course_key===params[2]);
   if(!r||r.metadata.student_change_request.status!=='pending'||r.metadata.student_change_request.requested_at!==params[5])return {rows:[]};
   const prev={...r};
   r.metadata.student_change_request=JSON.parse(params[3]);
   r.metadata.student_change_review_history=[...(r.metadata.student_change_review_history||[]),JSON.parse(params[4])];
   teacherWrites++;
   assert.equal(r.status,prev.status);
   assert.equal(r.scheduled_at,prev.scheduled_at);
   assert.equal(r.video_join_url,prev.video_join_url);
   return {rows:[r]};
  }
  throw Error('Unexpected SQL in fake DB: '+sql.slice(0,120));
 }};
const app=express();app.use(express.json());
const authMiddleware=()=> (req,res,next)=>{
 const t=(req.get('authorization')||'').replace(/^Bearer /,'');
 if(!users[t])return res.status(401).json({ok:false,error:'Not authenticated'});
 req.user=users[t];req.authSessionKey='revocable-session';next();
};
const requireRoles=(...roles)=>(req,res,next)=>roles.includes(req.user?.role)?next():res.status(403).json({ok:false,error:'Wrong role'});
install(app,{services,authMiddleware,requireRoles,configured:()=>({google_calendar:false})});
(async()=>{
 const server=await new Promise(ok=>{const s=app.listen(0,'127.0.0.1',()=>ok(s));});
 const base='http://127.0.0.1:'+server.address().port+'/api/v2150/private-energy/';
 const post=async(session,token,body)=>{
  const res=await fetch(base+'sessions/'+session+'/review-change',{method:'POST',
   headers:{...(token?{Authorization:'Bearer '+token}:{}),'Content-Type':'application/json'},body:JSON.stringify(body)});
  return {status:res.status,data:await res.json()};
 };
 try{
  assert.equal((await post(one,null,{decision:'decline',reason:'other'})).status,401);
  assert.equal((await post(one,'student-one',{decision:'decline',reason:'other'})).status,403);
  assert.equal((await post(one,'teacher-two',{decision:'decline',reason:'other'})).status,404);
  assert.equal((await post(one,'teacher-one',{decision:'approve',reason:'other'})).status,400);
  assert.equal((await post(one,'teacher-one',{decision:'coordinate',reason:'PRIVATE_CLIENT_DETAILS'})).status,400);
  const coordinated=await post(one,'teacher-one',{decision:'coordinate',reason:'manual_coordination'});
  assert.equal(coordinated.status,200);
  assert.equal(coordinated.data.request.status,'coordination_required');
  assert.equal(coordinated.data.original_appointment_unchanged,true);
  assert.equal(coordinated.data.calendar_event_changed,false);
  assert.equal(coordinated.data.charge_applied,false);
  assert.equal(coordinated.data.credit_decided,false);
  assert.equal(coordinated.data.transactional_email_sent,false);
  assert.equal(coordinated.data.teacher_followup_required,true);
  assert.equal(records[0].metadata.student_change_review_history.length,1);
  assert.equal(records[0].metadata.student_change_review_history[0].reviewer_id,'teacher-one');
  assert.equal((await post(one,'teacher-one',{decision:'decline',reason:'other'})).status,409);
  const declined=await post(two,'teacher-one',{decision:'decline',reason:'schedule_conflict'});
  assert.equal(declined.status,200);
  assert.equal(declined.data.request.status,'declined');
  assert.equal(declined.data.request.kind,'reschedule');
  assert.equal(declined.data.request.review_reason,'schedule_conflict');
  assert.equal(declined.data.teacher_followup_required,false);
  assert.equal(teacherWrites,2);
  assert.equal(providerActions,0);
  for(const output of [coordinated,declined]){
   assert.ok(!JSON.stringify(output).includes('NEVER_EXPOSE_LEARNER'));
   assert.ok(!JSON.stringify(output).includes('PRIVATE_LEARNER'));
   assert.ok(!JSON.stringify(output).includes('abc-defg-hij'));
  }
  console.log('PASS HF59: teacher-only decisions, atomic request audit, unchanged class/Meet, no provider/billing/email writes.');
 }finally{await new Promise(ok=>server.close(ok));}
})().catch(e=>{console.error(e);process.exitCode=1;});
