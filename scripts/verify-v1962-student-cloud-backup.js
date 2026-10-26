'use strict';
// Offline HF15.5 regression: student-owned complete backup, no mail, no live DB.
const assert=require('node:assert/strict');
const {install}=require('../src/v1940-saved-lessons');
const student={id:'EL-USER-private-student',role:'student',status:'active'};
const teacher={id:'EL-USER-private-teacher',role:'teacher',status:'active'};
let current=student,makeOversize=false,recorded=[],mailAttempts=0;
const saved=[{lesson_key:'workbook:fixture',lesson_title:'Fictional Contract',origin_path:'/learn/legal-english/',answers:{fictional:'draft example'},status:'draft',revision:2,updated_at:'2026-10-26T00:00:00Z',submitted_at:null}];
const reviewed=[{id:17,lesson_key:'workbook:fixture',lesson_title:'Fictional Contract',revision:1,answers:{fictional:'submitted example'},review_status:'reviewed',created_at:'2026-10-25T00:00:00Z',teacher_feedback:'This is an approved fictional sample feedback.',reviewed_at:'2026-10-26T00:00:00Z'}];
const pool={
 async query(sql,parameters=[]){
  recorded.push({sql,parameters});
  if(sql.includes('to_regclass'))return {rows:[{work:true,submits:true,users:true,creds:true,sessions:true}]};
  if(sql.includes('AS verified'))return{rows:[{verified:true}]};
  if(sql.includes('FROM self_paced_lesson_work WHERE user_id=')){
   assert.equal(parameters[0],current.id);
   return {rows:makeOversize?Array.from({length:201},()=>saved[0]):saved};
  }
  if(sql.includes('FROM self_paced_lesson_submissions WHERE user_id=')){
   assert.equal(parameters[0],current.id);
   return {rows:reviewed};
  }
  throw Error('Unexpected SQL in backup test: '+sql);
 },
 connect:async()=>{throw Error('No account writes permitted in backup test');}
};
const app={routes:new Map(),use(){},get(path,...middlewares){this.routes.set('GET '+path,middlewares)},post(path,...middlewares){this.routes.set('POST '+path,middlewares)},put(path,...middlewares){this.routes.set('PUT '+path,middlewares)}};
const authMiddleware=()=>((req,_res,next)=>{req.user=current;req.authSessionKey='dummy-session-digest';next()});
const requireRoles=role=>(req,res,next)=>req.user.role===role?next():res.status(403).json({ok:false,error:'Role forbidden'});
const authAbuse={registration:(_q,_s,n)=>n(),login:(_q,_s,n)=>n()};
install(app,{store:{mode:()=>'postgres',pool},services:{sendEmail:()=>{mailAttempts++;throw Error('Never call mail')}},authMiddleware,requireRoles,configured:()=>({auth_secret:true}),authAbuse});
async function request(user){
 current=user;
 const chain=app.routes.get('GET /api/v1940/account/export');assert(chain);
 return new Promise((resolve,reject)=>{
  const req={get:()=> 'Bearer fake.token',query:{}};
  const res={code:200,headers:{},status(code){this.code=code;return this;},set(key,value){this.headers[key]=value;return this;},json(body){resolve({code:this.code,headers:this.headers,body});return this;}};
  let i=0;
  function next(){const fn=chain[i++];if(!fn)return reject(Error('No response'));Promise.resolve().then(()=>fn(req,res,next)).catch(reject);}
  next();
 });
}
async function run(){
 const ok=await request(student);
 assert.equal(ok.code,200);assert.equal(ok.body.ok,true);assert.equal(ok.body.complete,true);
 assert.equal(ok.body.saved_lessons.length,1);
 assert.equal(ok.body.submissions[0].teacher_feedback,reviewed[0].teacher_feedback);
 assert(!JSON.stringify(ok.body).includes('password_hash'));
 assert.equal(ok.headers['Cache-Control'],'no-store, private');
 assert(recorded.filter(x=>x.sql.includes('FROM self_paced_')).every(x=>x.parameters[0]===student.id),'All records must be scoped by current account');
 const no=await request(teacher);assert.equal(no.code,403,'Teachers cannot access student account-export endpoint');
 makeOversize=true;
 const large=await request(student);assert.equal(large.code,413);assert.equal(large.body.ok,false);
 assert.equal(large.body.code,'ACCOUNT_BACKUP_LIMIT');
 assert(!large.body.saved_lessons,'Never return a misleading truncated "complete" backup');
 assert.equal(mailAttempts,0);
 console.log('PASS HF15.5: full private student lesson+feedback export, user-specific SQL, no credential leak, no teacher access, no partial oversized exports and ZERO actual email.');
}
run().catch(e=>{console.error(e);process.exitCode=1;});