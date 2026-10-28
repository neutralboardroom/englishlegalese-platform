'use strict';
// HF15.3 offline route-level concurrency test. Mock Postgres + mock email, NEVER connect/send.
const assert=require('node:assert/strict');
const {install}=require('../src/v1950-student-account-identity');
const keys=['SESSION_SECRET','RESEND_API_KEY','RESEND_FROM_EMAIL'];
const previous=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
process.env.SESSION_SECRET='hf153-fixture-secret-minimum-32-characters-only';
process.env.RESEND_API_KEY='test-not-a-real-provider-key';
process.env.RESEND_FROM_EMAIL='EnglishLegalese <noreply@mail.englishlegalese.com>';
let clock=Date.now(),seq=0,failInsert=false,queued=Promise.resolve(),insertCount=0,rollbacks=0;
const entries=[],sent=[];
const user={id:'EL-USER-fictional-fixture',email:'fixture@example.test',role:'student',status:'active'};
const connect=async()=>{
 let release=()=>{};
 return {
  async query(sql,args=[]){
   const s=sql.trim().toLowerCase();
   if(s==='begin')return {rows:[]};
   if(s.startsWith('select pg_advisory_xact_lock')){
    const prior=queued;queued=new Promise(resolve=>{release=resolve;});await prior;return {rows:[]};
   }
   if(s==='commit'){release();return {rows:[]};}
   if(s==='rollback'){rollbacks++;release();return {rows:[]};}
   if(s.startsWith('select count(*)::int as n')){
    const found=entries.filter(e=>e.user===args[0]&&e.purpose===args[1]&&e.created>clock-3600000);
    return {rows:[{n:found.length,latest:found.length?new Date(Math.max(...found.map(x=>x.created))):null}]};
   }
   if(s.startsWith('insert into student_email_action_tokens')){
    if(failInsert)throw Error('simulated transactional DB failure');
    const id=++seq;
    entries.push({id,user:args[0],purpose:args[1],hash:args[2],created:clock,expires:args[3]});insertCount++;
    return {rows:[{id}]};
   }
   throw Error('Unexpected mock transactional query: '+sql);
  },
  release(){}
 };
};
const pool={
 connect,
 async query(sql,args=[]){
  const s=sql.toLowerCase();
  if(s.includes('to_regclass'))return {rows:[{tokens:'student_email_action_tokens',users:'users',creds:'password_credentials',trials:'ai_trial_email_verifications',sessions:'user_sessions'}]};
  if(s.includes('select id,email,role,status,metadata from users'))return {rows:[user]};
  if(s.includes(' as verified from users'))return {rows:[{verified:false}]};
  if(s.startsWith('update student_email_action_tokens set provider_message_id='))return {rows:[]};
  throw Error('Unexpected mock top-level query: '+sql);
 }
};
const app={
 routes:new Map(),
 use(){},
 get(path,...handlers){this.routes.set('GET '+path,handlers);},
 post(path,...handlers){this.routes.set('POST '+path,handlers);}
};
const authAbuse={registration:(_req,_res,next)=>next(),login:(_req,_res,next)=>next()};
const services={
 async sendEmail(m){
  assert.equal(m.to,user.email);
  assert(/^account_(verify|reset)$/.test(m.template));
  sent.push({template:m.template,subject:m.subject});
  return {status:'sent',provider_message_id:'fake-'+sent.length};
 }
};
install(app,{store:{mode:()=>'postgres',pool},services,authAbuse,now:()=>clock});
async function post(path,body){
 const route=app.routes.get('POST /api/v1940/student/auth/'+path);
 assert(route,'Missing endpoint '+path);
 return new Promise((resolve,reject)=>{
  const req={body,ip:'203.0.113.9',get:()=>null};
  const res={statusCode:200,headers:{},status(code){this.statusCode=code;return this;},set(k,v){this.headers[k]=v;return this;},json(payload){resolve({status:this.statusCode,payload,headers:this.headers});return this;}};
  let index=0;
  const next=()=>{const fn=route[index++];if(!fn)return reject(Error('Mock endpoint had no response'));Promise.resolve().then(()=>fn(req,res,next)).catch(reject);};
  next();
 });
}
async function main(){
 const req={email:user.email};
 const group=await Promise.all(Array.from({length:8},()=>post('resend-verification',req)));
 assert(group.every(v=>v.status===202),'No account enumeration or differential failure status');
 assert.equal(sent.length,1,'Eight simultaneous requests must issue one email, not eight');
 assert.equal(insertCount,1,'Insert is atomic with eligibility check');
 clock+=61000;await post('resend-verification',req);assert.equal(sent.length,2);
 clock+=61000;await post('resend-verification',req);assert.equal(sent.length,3);
 clock+=61000;await post('resend-verification',req);assert.equal(sent.length,3,'Hourly cap of three must hold');
 clock+=3601000;failInsert=true;
 const before=sent.length;
 const error=await post('resend-verification',req);
 assert.equal(error.status,202,'Provider failures or DB failures must not disclose account membership');
 assert.equal(sent.length,before,'No mail may go out when durable token storage fails');
 assert(rollbacks>0,'Failure must roll back its DB transaction');
 failInsert=false;await post('resend-verification',req);
 assert.equal(sent.length,before+1,'Recovery after DB failure must remain possible');
 assert(entries.every(e=>/^[a-f0-9]{64}$/.test(e.hash)),'Store only SHA-256 token hashes');
 console.log('PASS HF15.3: 8 simultaneous mock requests produce 1 durable account email token, account-wide lock, 3/hour cap, no enumeration on DB failure, safe rollback, successful retry; ZERO actual emails.');
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{for(const k of keys){if(previous[k]===undefined)delete process.env[k];else process.env[k]=previous[k];}});
