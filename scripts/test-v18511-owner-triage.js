'use strict';
const assert=require('node:assert/strict');
const {install}=require('../src/v18511-owner-triage');
const routes=new Map(),app={get:(path,...handlers)=>routes.set(path,handlers)};
let installed=false,fail=false,calls=[];
const service={mode:()=> 'postgres',query:async(sql)=>{
 calls.push(sql);if(fail)throw Error('DB unavailable');
 if(sql.includes('teacher_profiles'))return{rows:[{status:'applied',count:3},{status:'approved',count:2}]};
 if(sql.includes('GROUP BY readiness_status'))return{rows:[{status:'needs_staff_review',count:4}]};
 if(sql.includes('FROM class_sessions'))return{rows:[{status:'requested',count:4}]};
 if(sql.includes('FROM progress_reports'))return{rows:[{status:'draft',count:2}]};
 if(sql.includes('to_regclass'))return{rows:[{relation:installed?'employer_enrollment_requests':null}]};
 if(sql.includes('FROM employer_enrollment_requests'))return{rows:[{status:'needs_review',count:6}]};
 throw Error('Unexpected query '+sql);
}};
const authMiddleware=()=>((req,res,next)=>{if(req.valid)next();else res.status(401).json({ok:false,error:'Unauthenticated'})});
const requireRoles=(...roles)=>(req,res,next)=>roles.includes(req.user?.role)?next():res.status(403).json({ok:false,error:'Forbidden'});
install(app,{services:service,authMiddleware,requireRoles});
async function request({role='owner',valid=true,bearer=true}={}){
 const req={user:{role},valid,get:()=>bearer?'Bearer qualified.test':'',query:{}};
 const res={statusCode:200,headers:{},body:null,status(v){this.statusCode=v;return this},set(k,v){this.headers[k]=v;return this},json(v){this.body=v;return this}};
 const chain=routes.get('/api/v18511/owner/triage');assert(chain);
 for(const h of chain){let nextCalled=false;await h(req,res,()=>{nextCalled=true});if(!nextCalled)break}
 return res;
}
(async()=>{
 let r=await request();
 assert.equal(r.statusCode,200);assert.equal(r.body.teacher_applications.applied,3);assert.equal(r.body.class_readiness.needs_staff_review,4);
 assert.equal(r.body.employer_enrollment.schema_installed,false);assert.equal(r.body.employer_enrollment.counts,null);
 assert.equal(r.body.certification_issuance_active,false);assert.equal(r.body.employer_checkout_active,false);
 assert.equal(r.headers['Cache-Control'],'private, no-store');
 assert(!JSON.stringify(r.body).includes('full_name')&&!JSON.stringify(r.body).includes('teacher_feedback'));
 installed=true;r=await request();assert.equal(r.body.employer_enrollment.counts.needs_review,6);
 assert.equal((await request({role:'employer'})).statusCode,403);
 assert.equal((await request({role:'student'})).statusCode,403);
 assert.equal((await request({valid:false})).statusCode,401);
 assert.equal((await request({bearer:false})).statusCode,401);
 fail=true;r=await request();assert.equal(r.statusCode,503);assert.equal(r.body.ok,false);assert(!JSON.stringify(r.body).includes('count'));
 assert(calls.every(sql=>/^SELECT /i.test(sql)),'No privileged write or modification is allowed.');
 console.log('PASS HF25: owner-only verified read-only triage, honest missing schema, fail closed, no PII, checkout, certificate or writes.');
})().catch(e=>{console.error(e);process.exit(1)});
