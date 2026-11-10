'use strict';
/* HF58: real Express auth/ownership tests with a simulated database only.
 * No contact with real students, Google, email, banking, or storage.
 */
const assert=require('node:assert/strict');
const express=require('express');
const {install}=require('../src/v2150-private-energy-classroom');
const COURSE='energy-contracts-60-v1';
const BASE='EL-ENERGY-';
const SESSION=BASE+'11111111-1111-4111-8111-111111111111';
const OTHER=BASE+'22222222-2222-4222-8222-222222222222';
const start1=new Date(Date.now()+5*86400000).toISOString();
const start2=new Date(Date.now()+12*86400000).toISOString();
const records=[
 {id:SESSION,student_user_id:'student-one',teacher_user_id:'teacher-one',
  status:'scheduled',scheduled_at:start1,video_join_url:'https://meet.google.com/abc-defg-hij',
  metadata:{course_key:COURSE,lesson_number:2},learner_name:'PRIVATE_LEARNER'},
 {id:OTHER,student_user_id:'student-two',teacher_user_id:'teacher-one',
  status:'scheduled',scheduled_at:start2,video_join_url:'https://meet.google.com/def-ghij-klm',
  metadata:{course_key:COURSE,lesson_number:3},learner_name:'OTHER_PRIVATE_LEARNER'}
];
const users={'student-1':{id:'student-one',role:'student'},'student-2':{id:'student-two',role:'student'},
 'teacher':{id:'teacher-one',role:'teacher'}};
let writes=0;
const services={mode:()=> 'postgres',sendEmail(){throw Error('No actual email allowed')},
 async query(sql,params=[]){
  if(sql.includes('to_regclass('))return {rows:[{sessions:'class_sessions',auth_sessions:'user_sessions',verification:'ai_trial_email_verifications'}]};
  if(sql.includes('AS verified'))return {rows:[{verified:true}]};
  if(sql.includes('AND id=$2 AND (student_user_id=$3 OR teacher_user_id=$3)')){
   return {rows:records.filter(r=>r.id===params[1]&&(r.student_user_id===params[2]||r.teacher_user_id===params[2]))};
  }
  if(sql.startsWith('UPDATE class_sessions SET metadata=jsonb_set(')){
   writes++;
   const r=records.find(r=>r.id===params[0]&&r.student_user_id===params[1]);
   if(!r||r.metadata?.student_change_request?.status==='pending')return {rows:[]};
   r.metadata.student_change_request=JSON.parse(params[2]);return {rows:[r]};
  }
  if(sql.startsWith('SELECT 1 FROM class_sessions WHERE teacher_user_id=$1')){
   const proposed=new Date(params[1]).getTime(),exclude=params[2];
   return {rows:records.filter(r=>r.teacher_user_id===params[0]&&r.id!==exclude&&
     new Date(r.scheduled_at).getTime()<proposed+3600000&&
     new Date(r.scheduled_at).getTime()+3600000>proposed).map(()=>({present:1})).slice(0,1)};
  }
  throw Error('Unexpected SQL in fake DB: '+sql.slice(0,100));
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
 const request=async(path,token,method='GET',body)=>{
  const r=await fetch(base+path,{method,headers:{...(token?{Authorization:'Bearer '+token}:{}),
   ...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  return {status:r.status,data:await r.json()};
 };
 try{
  const unauth=await request('sessions/'+SESSION+'/change-request',null,'POST',{kind:'cancel'});
  assert.equal(unauth.status,401);
  const studentOther=await request('sessions/'+SESSION+'/change-request','student-2','POST',{kind:'cancel'});
  assert.equal(studentOther.status,404);
  const teacher=await request('sessions/'+SESSION+'/change-request','teacher','POST',{kind:'cancel'});
  assert.equal(teacher.status,403);
  const bad=await request('sessions/'+SESSION+'/change-request','student-1','POST',{kind:'reschedule',proposed_at:'tomorrow'});
  assert.equal(bad.status,400);
  const saved=await request('sessions/'+SESSION+'/change-request','student-1','POST',{kind:'cancel'});
  assert.equal(saved.status,202);
  assert.equal(saved.data.charge_applied,false);
  assert.equal(saved.data.credit_decided,false);
  assert.equal(saved.data.calendar_event_changed,false);
  assert.equal(saved.data.request.kind,'cancel');
  assert.equal(saved.data.request.status,'pending');
  assert.equal(records[0].status,'scheduled','request must not cancel an appointment');
  assert.equal(records[0].video_join_url,'https://meet.google.com/abc-defg-hij','request must not revoke Meet event');
  assert.equal(writes,1);
  const repeat=await request('sessions/'+SESSION+'/change-request','student-1','POST',{kind:'cancel'});
  assert.equal(repeat.status,409,'duplicate pending request blocked');
  const newTime=new Date(Date.now()+16*86400000).toISOString();
  const move=await request('sessions/'+OTHER+'/change-request','student-2','POST',{kind:'reschedule',proposed_at:newTime});
  assert.equal(move.status,202);
  assert.equal(move.data.request.proposed_at,newTime);
  assert.equal(records[1].scheduled_at,start2,'reschedule is a request, not silent calendar change');
  const auth=await request('teacher-conflicts?starts_at='+encodeURIComponent(start1),'student-1');
  assert.equal(auth.status,403);
  const conflict=await request('teacher-conflicts?starts_at='+encodeURIComponent(start1),'teacher');
  assert.equal(conflict.status,200);
  assert.equal(conflict.data.internal_conflict,true);
  assert.equal(conflict.data.google_calendars_checked,false);
  const open=await request('teacher-conflicts?starts_at='+encodeURIComponent(newTime),'teacher');
  assert.equal(open.status,200);assert.equal(open.data.internal_conflict,false);
  assert.equal(open.data.full_conflict_clearance,false);
  for(const output of [saved,move,conflict,open]){
   assert.ok(!JSON.stringify(output).includes('PRIVATE_LEARNER'));
   assert.ok(!JSON.stringify(output).includes('abc-defg-hij'));
   assert.ok(!JSON.stringify(output).includes('def-ghij-klm'));
  }
  assert.equal(writes,2);
  console.log('PASS HF58: student request ownership, no-charge policy, duplicate rejection, and teacher-only internal conflict checks.');
 }finally{await new Promise(ok=>server.close(ok));}
})().catch(e=>{console.error(e);process.exitCode=1;});
