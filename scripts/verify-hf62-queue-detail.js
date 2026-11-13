'use strict';
// HF62 runs only on synthetic Express/database records. Never contacts a
// student, Google Meet/Calendar, billing or outbound communications.
const assert=require('node:assert/strict');
const express=require('express');
const {install,COURSE}=require('../src/v2150-private-energy-classroom');
const id=n=>'EL-ENERGY-'+String(n).padStart(8,'0')+'-1111-4111-8111-111111111111';
const requestAt=new Date(Date.now()-86400000).toISOString();
const upcoming=new Date(Date.now()+7*86400000).toISOString();
const past=new Date(Date.now()-7*86400000).toISOString();
const records=Array.from({length:51},(_,i)=>({
 id:id(i+1),student_user_id:'student-one',teacher_user_id:'teacher-one',
 learner_name:'SYNTHETIC_PRIVATE_LEARNER',scheduled_at:upcoming,status:'scheduled',
 video_join_url:'https://meet.google.com/abc-defg-hij',
 metadata:{course_key:COURSE,lesson_number:1,student_change_request:{kind:'cancel',status:'pending',requested_at:requestAt}}
}));
records.push({id:id(99),student_user_id:'student-two',teacher_user_id:'teacher-two',
 learner_name:'OTHER_TEACHER_PRIVATE_LEARNER',scheduled_at:past,status:'completed',
 video_join_url:'https://meet.google.com/def-ghij-klm',
 metadata:{course_key:COURSE,lesson_number:1}});
const users={
 teacher:{id:'teacher-one',role:'teacher'},other:{id:'teacher-two',role:'teacher'},
 learner:{id:'student-one',role:'student'},outsider:{id:'student-three',role:'student'}
};
let external=0;
const services={mode:()=> 'postgres',
 sendEmail(){external++;throw Error('outbound email forbidden')},
 createCalendarVideoSession(){external++;throw Error('calendar calls forbidden')},
 async query(sql,args=[]){
  if(sql.includes('to_regclass('))return {rows:[{sessions:'class_sessions',auth_sessions:'user_sessions',verification:'ai_trial_email_verifications'}]};
  if(sql.includes('AS verified'))return {rows:[{verified:true}]};
  if(sql.includes('ORDER BY metadata->')&&sql.includes('OFFSET $3')){
   assert.equal(args[1],COURSE);assert.ok(sql.includes('teacher_user_id=$1'));
   const q=records.filter(r=>r.teacher_user_id===args[0]&&r.metadata?.student_change_request?.status==='pending');
   return {rows:q.slice(args[2],args[2]+51)};
  }
  if(sql.includes('AND id=$2 AND (student_user_id=$3 OR teacher_user_id=$3)')){
   return {rows:records.filter(r=>r.id===args[1]&&(r.student_user_id===args[2]||r.teacher_user_id===args[2]))};
  }
  throw Error('Unexpected synthetic SQL '+sql.slice(0,140));
 }};
const app=express();app.use(express.json());
const authMiddleware=()=> (req,res,next)=>{
 const user=users[(req.get('authorization')||'').replace(/^Bearer /,'')];
 if(!user)return res.status(401).json({ok:false,error:'Sign in'});
 req.user=user;req.authSessionKey='synthetic-revocable';next();
};
const requireRoles=(...roles)=>(req,res,next)=>roles.includes(req.user?.role)?next():res.status(403).json({ok:false,error:'Forbidden'});
install(app,{services,authMiddleware,requireRoles,configured:()=>({google_calendar:false})});
(async()=>{
 const server=await new Promise(resolve=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));});
 const base='http://127.0.0.1:'+server.address().port+'/api/v2150/private-energy/';
 const read=async(path,token)=>{
  const res=await fetch(base+path,{headers:token?{Authorization:'Bearer '+token}:{}});
  return {status:res.status,data:await res.json()};
 };
 try{
  assert.equal((await read('review-queue',null)).status,401);
  assert.equal((await read('review-queue','learner')).status,403);
  assert.equal((await read('review-queue?offset=-1','teacher')).status,400);
  assert.equal((await read('review-queue?offset=10001','teacher')).status,400);
  const first=await read('review-queue','teacher');
  assert.equal(first.status,200);assert.equal(first.data.requests.length,50);
  assert.equal(first.data.partial,true);assert.equal(first.data.has_more,true);
  assert.equal(first.data.next_offset,50);assert.equal(first.data.queue_snapshot_stable,false);
  const second=await read('review-queue?offset=50','teacher');
  assert.equal(second.status,200);assert.equal(second.data.requests.length,1);
  assert.equal(second.data.partial,false);assert.equal(second.data.next_offset,51);
  assert.equal(second.data.requests[0].id,id(51));
  assert.equal((await read('review-queue?offset=51','teacher')).data.requests.length,0);
  assert.equal((await read('review-queue','other')).data.requests.length,0);
  assert.ok(!JSON.stringify(first.data).includes('SYNTHETIC_PRIVATE_LEARNER'));
  assert.ok(!JSON.stringify(first.data).includes('abc-defg-hij'));
  const detail=await read('sessions/'+id(51),'teacher');
  assert.equal(detail.status,200);assert.equal(detail.data.session.id,id(51));
  assert.equal(detail.data.session.student_name,'SYNTHETIC_PRIVATE_LEARNER');
  assert.equal(detail.data.google_calendars_checked,false);
  assert.equal((await read('sessions/'+id(51),'other')).status,404);
  assert.equal((await read('sessions/'+id(51),'outsider')).status,404);
  assert.equal((await read('sessions/'+id(51),null)).status,401);
  const student=await read('sessions/'+id(51),'learner');
  assert.equal(student.status,200);
  assert.equal(student.data.session.student_name,undefined);
  const closed=await read('sessions/'+id(99),'other');
  assert.equal(closed.status,200);assert.equal(closed.data.session.meet_url,null);
  assert.equal(closed.data.session.meet_ready,false);
  assert.equal((await read('sessions/'+id(99),'teacher')).status,404);
  assert.equal((await read('sessions/not-a-real-id','teacher')).status,404);
  assert.equal(external,0);
  console.log('PASS HF62: 50+ pending reviews paged, valid offsets, scoped class-detail access, deleted past Meet links, no provider side effects.');
 }finally{await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
