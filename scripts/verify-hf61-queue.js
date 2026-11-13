'use strict';
/* HF61: real Express route qualification with a strictly synthetic database.
   No real students, owner calendar, emails, billing, Meet calls or persistence. */
const assert=require('node:assert/strict');
const express=require('express');
const runtime=require('../src/v2150-private-energy-classroom');
const COURSE=runtime.COURSE;
const id=n=>'EL-ENERGY-'+String(n).padStart(8,'0')+'-1111-4111-8111-111111111111';
const old=new Date(Date.now()-6*86400000).toISOString();
const future=new Date(Date.now()+5*86400000).toISOString();
const pending={
 id:id(1),student_user_id:'student-one',teacher_user_id:'teacher-one',learner_name:'SYNTHETIC_PRIVATE_NAME',
 scheduled_at:old,status:'scheduled',video_join_url:'https://meet.google.com/abc-defg-hij',
 metadata:{course_key:COURSE,lesson_number:2,student_change_request:{kind:'cancel',status:'pending',requested_at:old}}};
const coordinating={
 id:id(2),student_user_id:'student-two',teacher_user_id:'teacher-one',learner_name:'SECOND_PRIVATE_NAME',
 scheduled_at:future,status:'requested',video_join_url:null,
 metadata:{course_key:COURSE,lesson_number:3,student_change_request:{kind:'reschedule',status:'coordination_required',requested_at:old}}};
const declined={
 id:id(3),student_user_id:'student-three',teacher_user_id:'teacher-one',learner_name:'THIRD_PRIVATE_NAME',
 scheduled_at:future,status:'scheduled',video_join_url:'https://meet.google.com/ghi-jklm-nop',
 metadata:{course_key:COURSE,lesson_number:4,student_change_request:{kind:'cancel',status:'declined',requested_at:old}}};
const oldRows=Array.from({length:75},(_,k)=>({
 id:id(k+100),student_user_id:'student-one',teacher_user_id:'teacher-one',learner_name:'OLD_PRIVATE_NAME',
 scheduled_at:new Date(Date.now()-(k+7)*86400000).toISOString(),status:'completed',
 video_join_url:'https://meet.google.com/abc-defg-hij',metadata:{course_key:COURSE,lesson_number:1}
}));
const pendingQueue=Array.from({length:51},(_,k)=>({
 id:id(k+200),teacher_user_id:'teacher-one',scheduled_at:future,status:'scheduled',
 metadata:{course_key:COURSE,lesson_number:2,student_change_request:{kind:'cancel',status:'pending',requested_at:old}}
}));
let attemptedProviderCalls=0,changeWrites=0;
const services={mode:()=> 'postgres',
 createCalendarVideoSession(){attemptedProviderCalls++;throw Error('No real provider access')},
 sendEmail(){attemptedProviderCalls++;throw Error('No email access')},
 async query(sql,args=[]){
  if(sql.includes('to_regclass('))return {rows:[{sessions:'class_sessions',auth_sessions:'user_sessions',verification:'ai_trial_email_verifications'}]};
  if(sql.includes('AS verified'))return {rows:[{verified:true}]};
  if(sql.includes('AND id=$2 AND (student_user_id=$3 OR teacher_user_id=$3)')){
   return {rows:[pending,coordinating,declined].filter(r=>r.id===args[1]&&[r.student_user_id,r.teacher_user_id].includes(args[2]))};
  }
  if(sql.includes('ORDER BY CASE WHEN metadata->')){
   assert.ok(sql.includes('LIMIT 51'),'must probe for partial 50 row result');
   return {rows:args[1]==='teacher-two'?[]:[pending,declined,coordinating,...oldRows].slice(0,51)};
  }
  if(sql.includes('ORDER BY scheduled_at DESC NULLS LAST, created_at DESC LIMIT 26 OFFSET $3')){
   assert.ok(sql.includes('student_user_id=$2 OR teacher_user_id=$2'),'user scoped history');
   return {rows:args[1]==='student-one'||args[1]==='teacher-one'?oldRows.slice(args[2],args[2]+26):[]};
  }
  if(sql.startsWith('SELECT id,scheduled_at,status,metadata FROM class_sessions')){
   assert.ok(sql.includes('teacher_user_id=$1'),'queue scoped to teacher');
   return {rows:args[0]==='teacher-one'?pendingQueue:[]};
  }
  if(sql.startsWith('UPDATE class_sessions SET metadata=jsonb_set(coalesce(')){
   changeWrites++;
   assert.ok(sql.includes("NOT IN ('pending','coordination_required')"),'atomic change guard preserves coordination');
   return {rows:[]}; // simulate concurrent request in the database
  }
  throw Error('Unexpected fake SQL: '+sql.slice(0,120));
 }};
const users={
 student:{id:'student-one',role:'student'},student2:{id:'student-two',role:'student'},
 student3:{id:'student-three',role:'student'},
 teacher:{id:'teacher-one',role:'teacher'},other:{id:'teacher-two',role:'teacher'}};
const app=express();app.use(express.json());
const authMiddleware=()=> (req,res,next)=>{
 const user=users[(req.get('authorization')||'').replace(/^Bearer /,'')];
 if(!user)return res.status(401).json({ok:false,error:'Not authenticated'});
 req.user=user;req.authSessionKey='synthetic-revocable-login';next();
};
const requireRoles=(...roles)=>(req,res,next)=>roles.includes(req.user?.role)?next():res.status(403).json({ok:false,error:'Wrong role'});
runtime.install(app,{services,authMiddleware,requireRoles,configured:()=>({google_calendar:true})});
(async()=>{
 const server=await new Promise(resolve=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));});
 const base='http://127.0.0.1:'+server.address().port+'/api/v2150/private-energy/';
 const send=async(path,token,method='GET',body)=>{
  const res=await fetch(base+path,{method,headers:{...(token?{Authorization:'Bearer '+token}:{}),
   ...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  return {status:res.status,data:await res.json()};
 };
 try{
  assert.equal((await send('review-queue',null)).status,401);
  assert.equal((await send('review-queue','student')).status,403);
  const queue=await send('review-queue','teacher');
  assert.equal(queue.status,200);assert.equal(queue.data.requests.length,50);assert.equal(queue.data.partial,true);
  assert.equal(queue.data.google_calendars_checked,false);
  assert.ok(!JSON.stringify(queue.data).includes('PRIVATE_NAME'));
  assert.ok(!JSON.stringify(queue.data).includes('abc-defg-hij'));
  const other=await send('review-queue','other');
  assert.equal(other.status,200);assert.equal(other.data.requests.length,0);
  const list=await send('sessions','teacher');
  assert.equal(list.status,200);assert.equal(list.data.sessions.length,50);
  assert.equal(list.data.partial,true);assert.equal(list.data.sessions[0].id,pending.id);
  assert.equal(list.data.sessions[0].meet_url,null,'historical meeting URLs hidden');
  const history=await send('sessions/history?offset=25','student');
  assert.equal(history.status,200);assert.equal(history.data.sessions.length,25);
  assert.equal(history.data.next_offset,50);assert.equal(history.data.has_more,true);
  assert.equal(history.data.includes_active_bookings,false);
  assert.ok(!JSON.stringify(history.data).includes('OLD_PRIVATE_NAME'));
  assert.ok(!JSON.stringify(history.data).includes('abc-defg-hij'));
  assert.equal((await send('sessions/history?offset=-1','student')).status,400);
  assert.equal((await send('sessions/history?offset=99999','student')).status,400);
  assert.equal((await send('sessions/history?offset=0','student2')).data.sessions.length,0);
  assert.equal((await send('sessions/'+coordinating.id+'/change-request','student2','POST',{kind:'cancel'})).status,409);
  assert.equal((await send('sessions/'+coordinating.id+'/attach-meet','teacher','POST',{meet_url:'https://meet.google.com/abc-defg-hij',starts_at:future,external_calendar_acknowledged:true})).status,409);
  assert.equal((await send('sessions/'+coordinating.id+'/create-meet','teacher','POST',{})).status,409);
  assert.equal((await send('sessions/'+pending.id+'/complete','teacher','POST',{confirmed_taught:true})).status,409);
  assert.equal((await send('sessions/'+declined.id+'/change-request','student3','POST',{kind:'cancel'})).status,409,'fake DB detects atomic transition lost race');
  assert.equal(changeWrites,1);
  assert.equal(attemptedProviderCalls,0);
  console.log('PASS HF61: partial 50-cap honesty, paged private history, teacher queue, role scopes, atomic coordination barriers and no provider side effects.');
 }finally{await new Promise(ok=>server.close(ok));}
})().catch(e=>{console.error(e);process.exitCode=1;});
