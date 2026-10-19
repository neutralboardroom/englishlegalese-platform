'use strict';
// All AI and email providers in this test are local mocks. Zero billable requests.
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'el-safety-'));
process.env.LOCAL_SERVICE_DATA_DIR=dir;
process.env.LOCAL_SERVICE_JSON_DB=path.join(dir,'service.json');
process.env.SESSION_SECRET='unit-test-only-strong-secret-000000000000000000';
process.env.OPENAI_API_KEY='fake-test-key';
const {ProductionServices,verifyToken}=require('../src/productionServices');
const {createAiSafetyGate,createTrialRateGate,createAuthAbuseGuard}=require('../src/aiSafetyGate');
const {FreeTrialLedger,configured}=require('../src/freeTrialLedger');
const {AI_PLAN_DRAFTS,paidEntitlementVerified}=require('../src/aiCommercePolicy');
(async()=>{
  const storage={mode:()=> 'local_json_development_only',addAuditLog:async()=>{}};
  const svc=new ProductionServices(storage);
  for(const role of ['owner','admin','staff','teacher','employer']){
    await assert.rejects(svc.registerUser({email:role+'@example.invalid',password:'secure-test-password',full_name:'Test',role}),/limited to student/);
  }
  const enrolled=await svc.registerUser({email:'student@example.invalid',password:'secure-test-password',full_name:'Fake Student'});
  assert.equal(enrolled.user.role,'student');
  assert.equal(verifyToken(enrolled.token).role,'student');
  assert.equal(verifyToken('invalid-token'),null);
  assert.equal(verifyToken(enrolled.token.slice(0,-1)+'#'),null);
  assert(AI_PLAN_DRAFTS.every(p=>p.checkout_enabled===false));
  assert.equal(await paidEntitlementVerified({user:enrolled.user,store:{mode:()=> 'postgres'},env:{SMARTTEACHER_PAID_ENABLED:'true',STRIPE_SECRET_KEY:'fake',STRIPE_WEBHOOK_SECRET:'fake'}}),false);
  assert.equal(configured({store:storage,env:{}}).ready,false);
  let t=Date.UTC(2026,9,20,15);
  const env={SMARTTEACHER_TRIAL_ENABLED:'true',SMARTTEACHER_AI_ENABLED:'true',OPENAI_API_KEY:'fake'};
  const gate=createTrialRateGate({now:()=>t,env});
  const req=(ip='198.51.100.1',prompt='Please improve this fictional sentence.')=>({ip,user:{id:'student',role:'student',status:'active'},body:{prompt}});
  assert.equal(gate.reserve(req('198.51.100.1','x'.repeat(2501))).code,'TRIAL_INPUT_TOO_LONG');
  assert.equal(gate.reserve({...req(),body:{prompt:'Hello',attachments:['doc.pdf']}}).code,'TRIAL_TEXT_ONLY');
  let allowed=gate.reserve(req());assert(allowed.ok);
  assert.equal(gate.reserve(req('198.51.100.2')).code,'TRIAL_BUSY');
  allowed.release();allowed.release();
  for(let i=0;i<2;i++){const a=gate.reserve(req());assert(a.ok);a.release();}
  assert.equal(gate.reserve(req()).code,'TRIAL_NETWORK_LIMIT');
  assert.equal(gate.status().free_messages,3);
  const off=createTrialRateGate({env:{OPENAI_API_KEY:'fake',SMARTTEACHER_TRIAL_ENABLED:'false'}});
  assert.equal(off.reserve(req()).code,'TRIAL_DISABLED');
  const paid=createAiSafetyGate({env:{SMARTTEACHER_AI_ENABLED:'true',OPENAI_API_KEY:'fake'},now:()=>t});
  assert.equal(paid.reserve({user:{id:'s1',role:'student',status:'active'},ip:'192.0.2.4',body:{mode:'staff_assistant',prompt:'test',context:{}}}).code,'AI_MODE_NOT_PERMITTED');
  const auth=createAuthAbuseGuard({now:()=>t});let passed=0;
  for(let i=0;i<9;i++)auth.registration({ip:'192.0.2.9'},{status(code){assert.equal(code,429);return {json(){}};}},()=>{passed++;});
  assert.equal(passed,8);
  const events={verified:false,tokens:new Map(),uses:[],sequence:0};
  const dbEnv={SESSION_SECRET:process.env.SESSION_SECRET,SMTP_HOST:'smtp.example.test',SMTP_USER:'test',SMTP_PASS:'test',OPENAI_API_KEY:'fake',SMARTTEACHER_TRIAL_ENABLED:'true'};
  const query=async(sql,args=[])=>{
    if(sql.includes('to_regclass'))return {rows:[{uses:'ai_free_trial_uses',emails:'ai_trial_email_verifications'}]};
    if(sql.startsWith('INSERT INTO ai_trial_email_verifications')){events.token=args[1];return {rows:[]};}
    if(sql.startsWith('UPDATE ai_trial_email_verifications')){if(events.token===args[0]){events.verified=true;events.token=null;return {rows:[{user_id:'student-1'}]};}return {rows:[]};}
    if(sql.includes('AS verified')&&sql.includes('count(*)'))return {rows:[{verified:events.verified,used:events.uses.length}]};
    if(sql.startsWith('INSERT INTO ai_free_trial_uses')){const id=++events.sequence;events.uses.push(id);return {rows:[{id}]};}
    if(sql.startsWith('DELETE FROM ai_free_trial_uses')){events.uses=events.uses.filter(x=>x!==args[1]);return {rows:[]};}
    return {rows:[]};
  };
  const pool={query,connect:async()=>({query,release(){}})};
  const store={mode:()=> 'postgres',pool};let email='';
  const ledger=new FreeTrialLedger({store,env:dbEnv,sendMail:async x=>{email=x.text;}});
  assert(await ledger.ready());
  await ledger.sendVerification({id:'student-1',email:'fake-student@example.invalid'});
  const token=email.match(/trial_verify=([a-f0-9]{64})/)[1];
  assert.equal(await ledger.verify(token),true);
  assert.equal(await ledger.verify(token),false);
  assert.equal((await ledger.status('student-1')).remaining,3);
  const r1=await ledger.reserve('student-1','ip',25,'email');assert(r1.allowed);assert.equal(r1.remaining,2);
  await ledger.refundFailedRequest('student-1',r1.id);
  assert.equal((await ledger.status('student-1')).remaining,3);
  for(let i=0;i<3;i++)assert((await ledger.reserve('student-1','ip',25,'email')).allowed);
  assert.equal((await ledger.reserve('student-1','ip',25,'email')).allowed,false);
  assert.equal((await ledger.status('student-1')).remaining,0);
  // Real OpenAI behavior is checked only by an isolated mock to protect billing.
  let requests=0,original=global.fetch;
  global.fetch=async(url,options)=>{requests++;const p=JSON.parse(options.body);assert.equal(p.store,false);assert.equal(p.max_output_tokens,600);assert.equal(p.model,'gpt-4.1-mini');return {ok:true,json:async()=>({output_text:'Useful fictional feedback.'})};};
  try{const r=await svc.smartTeacher({mode:'student_tutor',prompt:'One fictional English sentence.',context:{}},enrolled.user);assert.equal(r.output,'Useful fictional feedback.');}
  finally{global.fetch=original;}
  assert.equal(requests,1);
  console.log('PASS v1.73 mock-only account/role/3-use trial/verified email/atomic quota/refund/mock OpenAI/abuse/paid fail closed; 0 billable API calls.');
})().catch(e=>{console.error('FAIL v1.73 local security regression: '+e.message);process.exitCode=1;}).finally(()=>fs.rmSync(dir,{recursive:true,force:true}));
