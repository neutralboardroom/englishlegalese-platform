'use strict';
const assert=require('node:assert/strict');
const {install}=require('../src/v18510-role-workspaces');
function mock({fail=false,role='owner'}={}){
 const routes=new Map(),sql=[],calls=[];
 const client={
  async query(statement,params=[]){
   sql.push(statement);
   if(fail&&statement.startsWith('UPDATE user_sessions'))throw Error('synthetic rollback test');
   if(statement.startsWith('SELECT role,status FROM users'))return{rows:[{role,status:'active'}]};
   return{rows:[{id:'active'}]};
  },release(){calls.push('released')}
 };
 const services={mode:()=> 'postgres',persistentStore:{pool:{connect:async()=>client}},query:async()=>{throw Error('Not expected in all-device logout')}};
 const app={
  get(){},post(path,...handlers){routes.set(path,handlers)}
 };
 install(app,{services,authMiddleware:()=>((req,res,next)=>next()),requireRoles:()=>((req,res,next)=>next())});
 return{routes,sql,calls,client};
}
function response(){return {code:200,data:null,headers:{},status(code){this.code=code;return this},set(k,v){this.headers[k]=v;return this},json(data){this.data=data;return this}}}
(async()=>{
 for(const role of ['owner','admin','employer']){
  const v=mock({role}),req={authSessionKey:'revocable-session',user:{id:'EL-USER-test',role},get:x=>x==='authorization'?'Bearer test-token':''};
  const endpoint=v.routes.get('/api/v18510/workspace/logout-everywhere');
  assert(endpoint,'All-device logout route registered');
  const res=response();await endpoint.at(-1)(req,res);
  assert.equal(res.code,200);assert.equal(res.data.signed_out_everywhere,true);
  assert(v.sql.some(x=>x.startsWith('SELECT role,status FROM users')));
  assert(v.sql.some(x=>x.startsWith('UPDATE users SET metadata=jsonb_set')));
  assert(v.sql.some(x=>x.startsWith('UPDATE user_sessions SET revoked_at=now()')));
  assert(v.sql.includes('COMMIT'));assert(!v.sql.includes('ROLLBACK'));
  assert(v.calls.includes('released'));assert.equal(res.headers['Cache-Control'],'private, no-store');
 }
 const failed=mock({fail:true});
 const req={authSessionKey:'revocable-session',user:{id:'EL-USER-test',role:'owner'},get:()=> 'Bearer test-token'};
 const res=response();await failed.routes.get('/api/v18510/workspace/logout-everywhere').at(-1)(req,res);
 assert.equal(res.code,503);assert.equal(res.data.ok,false);
 assert(failed.sql.includes('ROLLBACK'));assert(!failed.sql.includes('COMMIT'));
 const noSession=mock();
 const denied=response();await noSession.routes.get('/api/v18510/workspace/logout-everywhere').at(-1)({authSessionKey:null,user:{id:'EL-USER-test',role:'owner'}},denied);
 assert.equal(denied.code,503);assert(!noSession.sql.length);
 console.log('PASS HF33: privileged all-device logout performs atomic nonce rotation and revocation; rollback and missing session fail closed.');
})().catch(e=>{console.error(e);process.exitCode=1});
