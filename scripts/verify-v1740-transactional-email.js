'use strict';
// Mock-only tests. No external email, database, or OpenAI calls.
const assert=require('node:assert/strict');
const {resendConfigured,sendResendEmail}=require('../src/transactionalEmail');
const {configured:trialConfigured}=require('../src/freeTrialLedger');

(async()=>{
 const valid={RESEND_API_KEY:'fake-key-for-tests-only',RESEND_FROM_EMAIL:'EnglishLegalese <verify@englishlegalese.com>'};
 assert.equal(resendConfigured({}),false);
 assert.equal(resendConfigured({RESEND_API_KEY:'test'}),false);
 assert.equal(resendConfigured({RESEND_API_KEY:'test',RESEND_FROM_EMAIL:'invalid'}),false);
 assert.equal(resendConfigured(valid),true);
 let count=0,payload;
 const mockFetch=async(url,options)=>{
  count++;
  assert.equal(url,'https://api.resend.com/emails');
  assert.equal(options.method,'POST');
  assert.equal(options.headers.Authorization,'Bearer '+valid.RESEND_API_KEY);
  payload=JSON.parse(options.body);
  return {ok:true,json:async()=>({id:'email-test-123'})};
 };
 const message={to:'learner@example.invalid',subject:'Confirm your EnglishLegalese free trial',text:'Sample fictional verification email'};
 const sent=await sendResendEmail(message,{env:valid,fetchImpl:mockFetch});
 assert.equal(sent.id,'email-test-123');
 assert.equal(count,1);
 assert.equal(payload.from,valid.RESEND_FROM_EMAIL);
 assert.deepEqual(payload.to,[message.to]);
 assert.equal(payload.subject,message.subject);
 assert(!Object.prototype.hasOwnProperty.call(payload,'api_key'));
 await assert.rejects(sendResendEmail(message,{env:{},fetchImpl:mockFetch}),/not configured/);
 await assert.rejects(sendResendEmail({...message,to:'not-valid'},{env:valid,fetchImpl:mockFetch}),/Recipient/);
 assert.equal(count,1);
 await assert.rejects(sendResendEmail(message,{env:valid,fetchImpl:async()=>({ok:false,status:429,json:async()=>({message:'should not leak'})})}),/rejected/);
 await assert.rejects(sendResendEmail(message,{env:valid,fetchImpl:async()=>{throw new Error('Bearer secret must not leak')}}),/unreachable/);
 await assert.rejects(sendResendEmail(message,{env:valid,fetchImpl:async()=>({ok:true,json:async()=>({})})}),/not acknowledged/);
 const store={mode:()=> 'postgres',pool:{connect:async()=>({})}};
 const base={...valid,SESSION_SECRET:'012345678901234567890123456789012345',OPENAI_API_KEY:'mock-only',SMARTTEACHER_TRIAL_ENABLED:'true'};
 assert.equal(trialConfigured({store,env:base}).ready,true);
 assert.equal(trialConfigured({store,env:{...base,SMARTTEACHER_TRIAL_ENABLED:'false'}}).ready,false);
 assert.equal(trialConfigured({store,env:{...base,RESEND_API_KEY:''}}).ready,false);
 assert.equal(trialConfigured({store:{mode:()=> 'local_json_development_only'},env:base}).ready,false);
 assert.equal(trialConfigured({store,env:{...base,OPENAI_API_KEY:''}}).ready,false);
 assert.equal(trialConfigured({store,env:{...base,SESSION_SECRET:''}}).ready,false);
 console.log('PASS v1.74 mock-only HTTPS mail sender and fail-closed trial prerequisites; 0 external messages or AI requests');
})().catch(e=>{console.error(e);process.exitCode=1;});
