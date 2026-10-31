'use strict';
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs');
const {install}=require('../src/v1960-certification-issuance');
const calls={get:new Map(),post:new Map()},service={
 mode:()=> 'postgres',
 query:async(sql,args)=>{
  if(sql.includes('FROM certification_credentials WHERE serial=$1'))
   return {rows:[{track:'legal',awarded_level:'B2',issued_at:'2026-10-31T00:00:00Z',revoked_at:null,public_verify_consent:true,
    verification_code_sha256:crypto.createHash('sha256').update('a'.repeat(48)).digest('hex')}]};
  throw Error('No database writes expected during fail-closed test');
 }
};
const app={get(path,...handlers){calls.get.set(path,handlers)},post(path,...handlers){calls.post.set(path,handlers)}};
const authMiddleware=()=>((req,res,next)=>next());
const requireRoles=()=>((req,res,next)=>next());
const before={exam:process.env.CERTIFICATION_EXAMS_ENABLED,issue:process.env.CERTIFICATION_ISSUANCE_ENABLED,rubric:process.env.CERTIFICATION_RUBRIC_APPROVED_VERSION};
process.env.CERTIFICATION_EXAMS_ENABLED='false';process.env.CERTIFICATION_ISSUANCE_ENABLED='false';delete process.env.CERTIFICATION_RUBRIC_APPROVED_VERSION;
install(app,{services:service,authMiddleware,requireRoles});
function makeRes(){return {statusCode:200,body:null,status(code){this.statusCode=code;return this},set(){return this},json(body){this.body=body;return this}}}
async function invoke(method,path,req){
 const chain=calls[method].get(path);assert(chain,'Missing route '+path);
 const res=makeRes();
 await chain[chain.length-1](req||{body:{},get(){return ''},params:{}},res);
 return res;
}
(async()=>{
 const read=await invoke('get','/api/v1960/certifications/readiness');
 assert.equal(read.body.live_exam_booking_enabled,false);
 assert.equal(read.body.certificate_issuance_enabled,false);
 assert.equal(read.body.verified_cefr_equivalence,false);
 const noIssue=await invoke('post','/api/v1960/certifications/assessments/:id/issue',{params:{id:'00000000-0000-4000-8000-000000000001'},body:{}});
 assert.equal(noIssue.statusCode,503);
 const invalid=await invoke('post','/api/v1960/certifications/verify',{body:{serial:'not-valid',verification_code:'oops'}});
 assert.equal(invalid.body.verified,false);
 const valid=await invoke('post','/api/v1960/certifications/verify',{body:{serial:'EL-LEGAL-'+'A'.repeat(24),verification_code:'a'.repeat(48)}});
 assert.equal(valid.body.verified,true);assert.equal(valid.body.awarded_specialist_level,'B2');
 assert(!('candidate_name' in valid.body));assert(!('exam_answers' in valid.body));
 const incorrect=await invoke('post','/api/v1960/certifications/verify',{body:{serial:'EL-LEGAL-'+'A'.repeat(24),verification_code:'b'.repeat(48)}});
 assert.equal(incorrect.body.verified,false);
 const schema=fs.readFileSync('db/migrations/021_hf32_certification_issuance_records.sql','utf8');
 for(const t of ['certification_assessments','certification_assessor_reviews','certification_credentials','certification_appeals','certification_events','public_verification_consent_at'])assert(schema.includes(t));
 const hub=fs.readFileSync('learn/certifications/index.html','utf8');
 assert(hub.includes('/learn/certificate-verification/'));
 assert(!hub.includes('We will not issue exams or certificates until'));
 assert(hub.includes('Assessment booking and certificate issuance are not yet active'));
 const ui=fs.readFileSync('product-v1960-cert-verification.js','utf8');
 assert(ui.includes('credentials:\'omit\'')&&ui.includes('cache:\'no-store\''));
 console.log('PASS HF32: secure-by-default readiness, no auto-issue, hash-based public verification, consent and UI copy invariants.');
})().catch(err=>{console.error(err);process.exitCode=1}).finally(()=>{
 for(const [key,k] of [['exam','CERTIFICATION_EXAMS_ENABLED'],['issue','CERTIFICATION_ISSUANCE_ENABLED'],['rubric','CERTIFICATION_RUBRIC_APPROVED_VERSION']]){if(before[key]===undefined)delete process.env[k];else process.env[k]=before[key]}
});
