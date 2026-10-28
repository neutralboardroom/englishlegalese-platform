'use strict';
// HF15.4: end-to-end route-handler simulation without database, network, or email sends.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {install}=require('../src/v1940-saved-lessons');
const student={id:'EL-USER-student-fixture',role:'student',status:'active'};
const teacher={id:'EL-USER-teacher-fixture',role:'teacher',status:'active'};
const state={sessions:[{user_id:student.id,revoked:false},{user_id:student.id,revoked:false},{user_id:teacher.id,revoked:false}],nonces:{},inTxn:false,rollbacks:0,commitCount:0,fail:false};
let current=null;
const pool={
 async query(sql) {
  if(sql.includes('to_regclass'))return {rows:[{work:true,submits:true,users:true,creds:true,sessions:true}]};
  if(sql.includes('AS verified'))return {rows:[{verified:true}]};
  throw Error('Unexpected pool query: '+sql);
 },
 async connect(){
  return {
   async query(sql,parameters=[]){
    const s=sql.toLowerCase().trim();
    if(s==='begin'){state.inTxn=true;return{rows:[]};}
    if(s.includes('select role,status from users')&&s.includes('for update'))return {rows:[{role:current.role,status:current.status}]};
    if(s.includes('update users set metadata=')){
     if(state.fail)throw Error('mock DB failure');
     assert(state.inTxn,'Must update user under transaction');state.nonces[parameters[0]]=parameters[1];
     return{rows:[{}]};
    }
    if(s.includes('update user_sessions set revoked_at=now()')){
     assert(state.inTxn,'Session revocation must be in transaction');
     state.sessions.filter(v=>v.user_id===parameters[0]).forEach(v=>{v.revoked=true;});
     return{rows:[{},{}]};
    }
    if(s==='commit'){state.inTxn=false;state.commitCount++;return{rows:[]};}
    if(s==='rollback'){state.inTxn=false;state.rollbacks++;return{rows:[]};}
    throw Error('Unexpected mock SQL: '+sql);
   },
   release(){}
  };
 }
};
const app={routes:new Map(),use(){},get(path,...handlers){this.routes.set('GET '+path,handlers);},post(path,...handlers){this.routes.set('POST '+path,handlers);},put(path,...handlers){this.routes.set('PUT '+path,handlers);}};
const services={};
const authMiddleware=()=>((req,res,next)=>{req.user=current;req.authSessionKey='fake-test-session-digest';next();});
const requireRoles=role=>(req,res,next)=>req.user?.role===role?next():res.status(403).json({ok:false,error:'Role mismatch'});
const store={mode:()=>'postgres',pool};
const authAbuse={registration:(_req,_res,next)=>next(),login:(_req,_res,next)=>next()};
install(app,{store,services,authMiddleware,requireRoles,configured:()=>({auth_secret:true}),authAbuse});
async function submit(role,user){
 current=user;
 const handlers=app.routes.get('POST /api/v1940/'+role+'/auth/logout-everywhere');
 assert(handlers,'Missing all-device endpoint for '+role);
 return await new Promise((resolve,reject)=>{
  const req={ip:'203.0.113.3',body:{},get:()=> 'Bearer fictional.mock.token'};
  const res={code:200,status(code){this.code=code;return this;},set(){return this;},json(body){resolve({code:this.code,body});return this;}};
  let n=0;function next(){const fn=handlers[n++];if(!fn)return reject(Error('Request did not respond'));Promise.resolve().then(()=>fn(req,res,next)).catch(reject);}next();
 });
}
async function run(){
 const denied=await submit('student',teacher);
 assert.equal(denied.code,403,'Teacher must not access student endpoint');
 assert.equal(state.commitCount,0);
 const good=await submit('student',student);
 assert.equal(good.code,200);assert.equal(good.body.signed_out_everywhere,true);
 assert.equal(good.body.lessons_preserved,true,'Endpoint must disclose work is preserved');
 assert.match(state.nonces[student.id],/^[a-f0-9]{48}$/);
 assert(state.sessions[0].revoked&&state.sessions[1].revoked);
 assert(!state.sessions[2].revoked,'Student must not revoke teacher sessions');
 assert.equal(state.commitCount,1);
 state.fail=true;
 const failed=await submit('teacher',teacher);
 assert.equal(failed.code,503);assert.equal(failed.body.ok,false);
 assert(state.rollbacks>=1,'Failure must rollback');
 assert(!state.sessions[2].revoked,'Failed transaction must not claim revocation');
 state.fail=false;
 const signed=await submit('teacher',teacher);
 assert.equal(signed.code,200);assert(state.sessions[2].revoked);
 assert.notEqual(state.nonces[student.id],state.nonces[teacher.id]);
 assert(fs.readFileSync('product-v1940-saved-lessons.js','utf8').includes('Signed out on all devices.'));
 assert(fs.readFileSync('product-v1940-teacher-review.js','utf8').includes('outAll'));
 console.log('PASS HF15.4: student and teacher all-device logout revoke scoped sessions, rotate distinct account nonces, preserve coursework, deny wrong roles, rollback failures; ZERO production writes or emails.');
}
run().catch(e=>{console.error(e);process.exitCode=1;});