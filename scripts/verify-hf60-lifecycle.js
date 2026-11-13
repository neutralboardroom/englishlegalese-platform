'use strict';
/* HF60: no live accounts, calendar writes, invites or billing.
 * Check real Express authorization using a simulated database.
 */
const assert=require('node:assert/strict');
const express=require('express');
const runtime=require('../src/v2150-private-energy-classroom');
const COURSE=runtime.COURSE,ROOT='EL-ENERGY-';
const FUTURE=ROOT+'11111111-1111-4111-8111-111111111111';
const PAST=ROOT+'22222222-2222-4222-8222-222222222222';
const dateAfter=()=>new Date(Date.now()+5*86400000).toISOString();
const dateBefore=()=>new Date(Date.now()-3*3600000).toISOString();
const rows=[
 {id:FUTURE,student_user_id:'learner',teacher_user_id:'teacher',learner_name:'PRIVATE_PSEUDONYM',
  scheduled_at:dateAfter(),status:'scheduled',video_join_url:'https://meet.google.com/abc-defg-hij',
  metadata:{course_key:COURSE,lesson_number:2}},
 {id:PAST,student_user_id:'learner',teacher_user_id:'teacher',learner_name:'PRIVATE_PSEUDONYM',
  scheduled_at:dateBefore(),status:'scheduled',video_join_url:'https://meet.google.com/def-ghij-klm',
  metadata:{course_key:COURSE,lesson_number:3}}
];
assert.equal(runtime.outward(rows[0],'student').meet_ready,true);
assert.equal(runtime.outward(rows[1],'student').meet_url,null,'past classes must not offer stale Meet URL');
assert.equal(runtime.outward({...rows[0],status:'completed'},'student').meet_ready,false);
assert.equal(runtime.outward({...rows[0],status:'cancelled'},'student').meet_url,null);
assert.equal(runtime.outward(rows[0],'student').student_name,undefined);
assert.equal(runtime.withinClassWindow(rows[1]),false);
let writes=0,externalCalls=0;
const services={mode:()=> 'postgres',sendEmail:()=>{externalCalls++;throw Error('No email')},
 createCalendarVideoSession:()=>{externalCalls++;throw Error('No provider writes')},
 async query(sql,args=[]){
  if(sql.includes('to_regclass('))return {rows:[{sessions:'class_sessions',auth_sessions:'user_sessions',verification:'ai_trial_email_verifications'}]};
  if(sql.includes('AS verified'))return {rows:[{verified:true}]};
  if(sql.includes('AND id=$2 AND (student_user_id=$3 OR teacher_user_id=$3)'))
   return {rows:rows.filter(x=>x.id===args[1]&&(x.student_user_id===args[2]||x.teacher_user_id===args[2]))};
  if(sql.startsWith('UPDATE class_sessions SET status=\'completed\'')){
   writes++;
   const r=rows.find(x=>x.id===args[0]&&x.teacher_user_id===args[1]&&x.metadata.course_key===args[2]);
   if(!r||r.status!=='scheduled'||new Date(r.scheduled_at).getTime()+3600000>Date.now())return {rows:[]};
   r.status='completed';return {rows:[r]};
  }
  throw Error('Unexpected fake-DB SQL '+sql.slice(0,125));
 }};
const app=express();app.use(express.json());
const users={
 learner:{id:'learner',role:'student'},teacher:{id:'teacher',role:'teacher'},
 outsider:{id:'outsider',role:'teacher'}
};
const authMiddleware=()=> (req,res,next)=>{
 const token=(req.get('authorization')||'').replace(/^Bearer /,'');
 if(!users[token])return res.status(401).json({ok:false,error:'Not authenticated'});
 req.user=users[token];req.authSessionKey='revocable-fake-session';next();
};
const requireRoles=(...roles)=>(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({ok:false,error:'No access'});
runtime.install(app,{services,authMiddleware,requireRoles,configured:()=>({google_calendar:false})});
(async()=>{
 const server=await new Promise(resolve=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));});
 const base='http://127.0.0.1:'+server.address().port+'/api/v2150/private-energy/sessions/';
 const send=async(id,path,token,method='GET',body)=>{
  const r=await fetch(base+id+path,{method,headers:{...(token?{Authorization:'Bearer '+token}:{}),
   ...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  return {status:r.status,data:await r.json()};
 };
 try{
  const future=await send(FUTURE,'/readiness','learner');
  assert.equal(future.status,200);assert.equal(future.data.join_available,true);
  const expired=await send(PAST,'/readiness','learner');
  assert.equal(expired.status,200);assert.equal(expired.data.state,'past_class');
  assert.equal(expired.data.join_available,false);
  assert.ok(!JSON.stringify(expired.data).includes('def-ghij-klm'));
  assert.equal((await send(PAST,'/complete','learner','POST',{confirmed_taught:true})).status,403);
  assert.equal((await send(PAST,'/complete','outsider','POST',{confirmed_taught:true})).status,404);
  assert.equal((await send(PAST,'/complete','teacher','POST',{})).status,400);
  assert.equal((await send(FUTURE,'/complete','teacher','POST',{confirmed_taught:true})).status,409);
  const complete=await send(PAST,'/complete','teacher','POST',{confirmed_taught:true});
  assert.equal(complete.status,200);assert.equal(complete.data.session.status,'completed');
  assert.equal(complete.data.session.meet_url,null);
  assert.equal(writes,1);assert.equal(externalCalls,0);
  assert.ok(!JSON.stringify(complete.data).includes('PRIVATE_PSEUDONYM'));
  console.log('PASS HF60: expired meeting URLs, truthful readiness, verified teacher closeout and zero external side effects.');
 }finally{await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
