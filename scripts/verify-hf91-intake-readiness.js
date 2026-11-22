'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const read=x=>fs.readFileSync(x,'utf8');
let checks=0;
const ok=(value,message)=>{assert(value,message);checks++};
const shared=read('product-v1850-intake-readiness.js');
const server=read('src/v1850-public-intake.js');
for(const [page,form] of [
 ['learn/enroll/index.html','product-v1850-enrollment.js'],
 ['learn/teach-with-us/index.html','product-v1850-teacher-application.js']
]){
 const html=read(page),js=read(form);
 ok(html.includes('product-v1850-intake-readiness.js?v=hf91'),'Readiness JS included in '+page);
 ok(html.indexOf('product-v1850-intake-readiness.js?v=hf91')<html.indexOf('/'+form),'Load readiness helper before form');
 ok(js.includes('ELPublicIntakeReadiness?.install'),'Actual public form must install guard');
 ok(js.includes('await intakeReadiness.check()'),'Actual public submit must first verify intake readiness');
 ok(js.includes('Request NOT sent.')||js.includes('Application NOT sent.'),'No false success on failed availability');
}
for(const fragment of [
 "'/api/v1850/intake-status?channel='+supported[kind]", "credentials:'omit'","cache:'no-store'","redirect:'error'",
 "method:'GET'", "data.stripe_enabled===false", "No form details were sent or saved", "checkButton.type='button'",
 "wrap.setAttribute('aria-label'", "report.setAttribute('aria-live','polite')", "form.prepend(wrap)",
 "setTimeout(()=>ctrl.abort(),6000)", "Object.defineProperty(window,'ELPublicIntakeReadiness'"
])ok(shared.includes(fragment),'Shared readiness safety invariant: '+fragment);
for(const fragment of ["channel==='all'||channel==='enroll'", "channel==='all'||channel==='teacher'", "['all','enroll','teacher']", "stripe_enabled:false", "Cache-Control','no-store'", "if(!pool)return send(res,503"])
 ok(server.includes(fragment),'Backend readiness invariant '+fragment);
for(const name of ['hf56-worldwide-locale-intake.spec.js','v1850-browser.spec.js','v1850-packages.spec.js','v1870-learning-quality.spec.js'])
 ok(read('tests/'+name).includes("/api/v1850/intake-status?channel=enroll"),'Original browser test '+name+' now mocks the honest readiness response');

// Execute the ACTUAL endpoint with mocked Postgres. These checks never access a real DB or account.
async function exercise(){
 const mk=(connection,throwError=false)=>{
  let routes={},queries=[];
  const ctx={module:{exports:{}},exports:{},process:{env:connection?{ENGLISHLEGALESE_INTAKE_DATABASE_URL:'postgres://fictional-test-only'}:{}},require:id=>{
   if(id==='node:crypto')return{randomUUID:()=> 'fictional-uuid'};
   if(id==='pg')return{Pool:class {async query(sql){queries.push(sql);if(throwError)throw Error('simulated outage');return {rows:[{id:'LOCAL-FIXTURE'}]}}}};
   throw Error('Unexpected imported module '+id);
  }};
  vm.runInNewContext(server,ctx,{filename:'v1850-public-intake.js'});
  ctx.module.exports.install({get:(path,fn)=>{routes[path]=fn},post:()=>{}});
  return{routes,queries};
 };
 async function call(env,channel){const {routes,queries}=env;let result={};const res={status(x){result.status=x;return this},set(k,v){result.header=[k,v];return this},json(x){result.body=x;return this}};await routes['/api/v1850/intake-status']({query:channel?{channel}:{}},res);return{...result,queries}};
 let r=await call(mk(false),'enroll');ok(r.status===503,'No DB must fail closed');ok(r.body.ready===false,'No DB cannot claim ready');
 r=await call(mk(true),'bad-channel');ok(r.status===400,'Invalid channel must be rejected');
 r=await call(mk(true),'enroll');ok(r.status===200&&r.body.channel==='enroll'&&r.body.stripe_enabled===false,'Enrollment status is specific and nonpaying');ok(r.queries.length===1&&r.queries[0].includes('enrollment_requests'),'Enrollment checks only enrollment table');
 r=await call(mk(true),'teacher');ok(r.status===200&&r.body.channel==='teacher','Teacher status available');ok(r.queries.length===1&&r.queries[0].includes('teacher_applications'),'Teacher checks only teacher table');
 r=await call(mk(true));ok(r.status===200&&r.queries.length===2,'Original default all checks both tables');
 r=await call(mk(true,true),'enroll');ok(r.status===503&&r.body.ready===false,'DB error never claims availability');
 console.log('PASS HF91 '+checks+' safeguards: public-only availability, real channel-specific Postgres health, no fake payment, original browser regressions');
}
exercise().catch(e=>{console.error(e);process.exitCode=1});
