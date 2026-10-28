'use strict';
// Purely mocked PostgreSQL: no external network, email, real account or production migration.
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {ProductionServices,authMiddleware,passwordHash,sessionDigest}=require('../src/productionServices');
const saved=process.env.SESSION_SECRET;
process.env.SESSION_SECRET='HF15-session-validation-only-key-do-not-deploy-0123456789';
const uid='EL-USER-fixture';
const state={
 user:{id:uid,email:'fixture@example.test',full_name:'Example Learner',role:'student',status:'active',metadata:{session_version:null}},
 credential:{user_id:uid,password_hash:passwordHash('Fictional-Account-Passphrase-2026!')},
 verified:true,sessions:[],logs:[]
};
const store={
 mode:()=> 'postgres',
 pool:{
  query:async(sql,params=[])=>{
   const s=sql.toLowerCase().replace(/\s+/g,' ');
   state.logs.push({sql:s.slice(0,140),params:params.map((p,i)=>(/insert into user_sessions/.test(s)&&i===2?'[digest]':p))});
   if(s.includes('select * from users where email='))return {rows:state.user.email===params[0]?[{...state.user}]:[]};
   if(s.includes('select * from password_credentials where user_id='))return {rows:[state.credential]};
   if(s.includes(' as verified from users where id='))return {rows:[{verified:state.verified}]};
   if(s.startsWith('insert into user_sessions')){
    state.sessions.push({id:params[0],user_id:params[1],token_preview:params[2],revoked_at:null,expires_at:new Date(params[6])});
    return {rows:[]};
   }
   if(s.startsWith('select * from users where id='))return {rows:params[0]===uid?[{...state.user}]:[]};
   if(s.includes("select metadata->>'session_version' as nonce"))return {rows:[{nonce:state.user.metadata.session_version}]};
   if(s.includes('from user_sessions where user_id=')){
    return {rows:state.sessions.filter(v=>v.user_id===params[0]&&v.token_preview===params[1]&&!v.revoked_at&&v.expires_at>Date.now()).slice(0,1).map(()=>({'?column?':1}))};
   }
   throw Error('Unexpected fixture query '+sql.slice(0,120));
  }
 },
 addAuditLog:async()=>{}
};
const services=new ProductionServices(store);
const req={ip:'127.0.0.1',get:()=> 'fixture-browser'};
const authenticate=authMiddleware(services);
async function checkBearer(token){
 const request={get:()=> 'Bearer '+token,query:{}};
 const response={statusCode:200,status(code){this.statusCode=code;return this;},json(value){this.value=value;return this;}};
 let next=false;
 await authenticate(request,response,()=>{next=true;});
 return {next,status:response.statusCode,request,response};
}
async function main(){
 assert.equal(sessionDigest('z'.repeat(48)),null);
 const first=await services.loginUser({email:state.user.email,password:'Fictional-Account-Passphrase-2026!',expected_role:'student',require_verified_student:true},req);
 assert.equal(state.sessions.length,1,'Correct student login should persist a session');
 assert.match(state.sessions[0].token_preview,/^[a-f0-9]{64}$/);
 assert.notEqual(state.sessions[0].token_preview,first.token.slice(0,18),'Never persist bearer preview for new sessions');
 const active=await checkBearer(first.token);
 assert(active.next,'Active bearer is accepted');
 assert.equal(active.request.authSessionKey,state.sessions[0].token_preview);
 const second=await services.loginUser({email:state.user.email,password:'Fictional-Account-Passphrase-2026!',expected_role:'student',require_verified_student:true},req);
 assert.equal(state.sessions.length,2);
 assert.notEqual(state.sessions[0].token_preview,state.sessions[1].token_preview,'Each login has a separate session key');
 state.sessions[0].revoked_at=new Date();
 const revoked=await checkBearer(first.token);
 assert.equal(revoked.next,false);
 assert.equal(revoked.status,401,'Revoked session must be rejected');
 assert((await checkBearer(second.token)).next,'Revoking one session must preserve unrelated student session');
 state.user.metadata.session_version=crypto.randomBytes(24).toString('hex');
 assert.equal((await checkBearer(second.token)).status,401,'Password reset nonce revokes other old sessions');
 state.verified=false;
 await assert.rejects(()=>services.loginUser({email:state.user.email,password:'Fictional-Account-Passphrase-2026!',expected_role:'student',require_verified_student:true},req),/Email verification required/);
 assert.equal(state.sessions.length,2,'Unverified login cannot generate a stored session');
 await assert.rejects(()=>services.loginUser({email:state.user.email,password:'Fictional-Account-Passphrase-2026!',expected_role:'teacher'},req),/Invalid login/);
 assert.equal(state.sessions.length,2,'Wrong-role login cannot generate a stored session');
 console.log('PASS HF15.2 mock PostgreSQL behavior: two distinct stored logins, authenticated active bearer, revoked bearer denied, unrelated session retained, global reset invalidation, and zero sessions for unverified/wrong-role logins; no messages sent.');
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{if(saved===undefined)delete process.env.SESSION_SECRET;else process.env.SESSION_SECRET=saved;});
