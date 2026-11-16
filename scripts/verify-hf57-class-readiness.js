'use strict';
/*
 * HF57 same-process integration regression. This does not contact a real
 * database or Google; it verifies that private readiness routes enforce
 * authenticated student/teacher assignments and never disclose a meeting URL.
 */
const assert=require('node:assert/strict');
const express=require('express');
const {install}=require('../src/v2150-private-energy-classroom');
const READY='EL-ENERGY-11111111-1111-4111-8111-111111111111';
const PENDING='EL-ENERGY-22222222-2222-4222-8222-222222222222';
const DONE='EL-ENERGY-33333333-3333-4333-8333-333333333333';
const records=[
 {id:READY,learner_name:'Private Learner Test',
  student_user_id:'student-one',teacher_user_id:'teacher-one',
  scheduled_at:'2026-12-01T10:00:00Z',status:'scheduled',
  video_join_url:'https://meet.google.com/abc-defg-hij',
  metadata:{course_key:'energy-contracts-60-v1',lesson_number:2,private_doc:'NEVER_ECHO_THIS_MARKER'}},
 {id:PENDING,learner_name:'Private Learner Test',
  student_user_id:'student-one',teacher_user_id:'teacher-one',
  scheduled_at:'2026-12-03T10:00:00Z',status:'requested',video_join_url:null,
  metadata:{course_key:'energy-contracts-60-v1',lesson_number:3}},
 {id:DONE,learner_name:'Private Learner Test',
  student_user_id:'student-one',teacher_user_id:'teacher-one',
  scheduled_at:'2026-11-01T02:00:00Z',status:'completed',video_join_url:null,
  metadata:{course_key:'energy-contracts-60-v1',lesson_number:1}}
];
const users={
 'student-token':{id:'student-one',role:'student'},
 'other-student-token':{id:'student-two',role:'student'},
 'teacher-token':{id:'teacher-one',role:'teacher'}
};
let writes=0,queries=0;
const services={
 mode:()=> 'postgres',
 async query(sql,params=[]){
  queries++;
  if(/^\s*(UPDATE|INSERT|DELETE|ALTER|DROP)/i.test(sql)){writes++;throw Error('unexpected database mutation in readiness check');}
  if(sql.includes('to_regclass('))return {rows:[{sessions:'class_sessions',auth_sessions:'user_sessions',verification:'ai_trial_email_verifications'}]};
  if(sql.includes('AS verified'))return {rows:[{verified:true}]};
  if(sql.includes('AND id=$2 AND (student_user_id=$3 OR teacher_user_id=$3)')){
   const id=params[1],userId=params[2];
   return {rows:records.filter(x=>x.id===id&&(x.student_user_id===userId||x.teacher_user_id===userId))};
  }
  throw Error('Unexpected SQL in read-only simulated service: '+sql.slice(0,70));
 }
};
const app=express();
app.use(express.json());
const authMiddleware=()=> (req,res,next)=>{
 const token=(req.get('authorization')||'').slice(7);
 if(!users[token])return res.status(401).json({ok:false,error:'Authorization required'});
 req.user=users[token];req.authSessionKey='revocable-test-session';next();
};
const requireRoles=(...roles)=>(req,res,next)=>roles.includes(req.user?.role)?next():res.status(403).json({ok:false,error:'Unauthorized role'});
install(app,{services,authMiddleware,requireRoles,configured:()=>({google_calendar:false})});
(async()=>{
 const server=await new Promise(resolve=>{
  const s=app.listen(0,'127.0.0.1',()=>resolve(s));
 });
 const base='http://127.0.0.1:'+server.address().port+'/api/v2150/private-energy/';
 async function get(path,token){
  const r=await fetch(base+path,{headers:token?{Authorization:'Bearer '+token}:{}});
  const raw=await r.text();let parsed;
  try{parsed=JSON.parse(raw);}catch{parsed={error:'non-json error page'};}
  return {status:r.status,body:parsed};
 }
 try{
  const unauth=await get('sessions/'+READY+'/readiness');
  assert.equal(unauth.status,401);
  const other=await get('sessions/'+READY+'/readiness','other-student-token');
  assert.equal(other.status,404,'student cannot read another student class');
  assert.ok(!JSON.stringify(other.body).includes('abc-defg-hij'));
  const invalid=await get('sessions/../admin/readiness','student-token');
  assert.notEqual(invalid.status,200,'invalid session ID is never a private class');
  for(const token of ['student-token','teacher-token']){
   const {status,body}=await get('sessions/'+READY+'/readiness',token);
   assert.equal(status,200);
   assert.equal(body.join_available,true);
   assert.equal(body.state,'ready');
   assert.equal(body.role,token==='student-token'?'student':'teacher');
   assert.equal(body.duration_minutes,60);
   assert.equal(body.recording_enabled,false);
   assert.equal(body.client_documents_shared,false);
   assert.ok(body.next_action.includes('Google Meet'));
   assert.ok(!Object.hasOwn(body,'meet_url'),'readiness API never returns meeting URL');
   assert.ok(!Object.hasOwn(body,'student_name'),'readiness API never returns student PII');
   assert.ok(!JSON.stringify(body).includes('NEVER_ECHO_THIS_MARKER'));
   assert.ok(!JSON.stringify(body).includes('abc-defg-hij'));
  }
  const pending=await get('sessions/'+PENDING+'/readiness','student-token');
  assert.equal(pending.status,200);assert.equal(pending.body.join_available,false);
  assert.equal(pending.body.state,'needs_meeting');
  assert.ok(pending.body.next_action.includes('Your teacher'));
  const done=await get('sessions/'+DONE+'/readiness','teacher-token');
  assert.equal(done.status,200);assert.equal(done.body.state,'completed');
  assert.equal(done.body.join_available,false);
  assert.equal(writes,0);assert.ok(queries>=8);
  console.log('PASS HF57 server integration: 401 guest, 404 other learner, own session ready/pending/completed, no URL/PII disclosure, read-only.');
 }finally{await new Promise((resolve,reject)=>server.close(err=>err?reject(err):resolve()));}
})().catch(error=>{console.error(error);process.exitCode=1;});
