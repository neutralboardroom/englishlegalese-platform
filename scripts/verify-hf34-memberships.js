'use strict';
const assert=require('node:assert/strict');
const {organizationQuote,individuals,install}=require('../src/v1970-memberships');
const {randomUUID}=require('node:crypto');
assert.deepEqual(individuals.map(x=>x.monthly_usd),[12,19,29,79]);
assert.equal(organizationQuote(1).monthly_usd,25);
assert.equal(organizationQuote(4).monthly_usd,100);
assert.equal(organizationQuote(5).monthly_usd,123);
assert.equal(organizationQuote(19).monthly_usd,445);
assert.equal(organizationQuote(20).monthly_usd,466);
assert.equal(organizationQuote(49).monthly_usd,1075);
assert.equal(organizationQuote(50).custom,true);
assert.equal(organizationQuote(50).monthly_usd,null);
assert.equal(organizationQuote(10000).custom,true);
for(const value of [0,-1,1.1,10001,NaN])assert.throws(()=>organizationQuote(value));
for(let n=2;n<50;n++)assert(organizationQuote(n).monthly_usd>organizationQuote(n-1).monthly_usd,'New seats must never lower total estimated cost');
function appHarness(){
 const get=new Map(),post=new Map(),writes=[],records=new Map();
 const app={get(path,...handlers){get.set(path,handlers)},post(path,...handlers){post.set(path,handlers)}};
 const services={mode:()=> 'postgres',query:async(sql,params=[])=>{
  if(sql.includes('to_regclass'))return {rows:[{relation:'membership_interest_requests'}]};
  if(sql.includes('INSERT INTO membership_interest_requests')){
   const id=params[0];
   if(records.has(id))return{rows:[]};
   const record={id:'11111111-1111-4111-8111-111111111111',client_request_id:id,request_kind:params[1],
    plan_code:params[2],contact_name:params[3],contact_email:params[4],
    organization_name:params[5],seat_count:params[6],preferred_term:params[7],created_at:'2026-10-31T00:00:00Z'};
   records.set(id,record);writes.push(record);return{rows:[record]};
  }
  if(sql.startsWith('SELECT id,request_kind')&&sql.includes('WHERE client_request_id'))return{rows:[records.get(params[0])].filter(Boolean)};
  if(sql.includes('ORDER BY created_at DESC'))return{rows:[...records.values()]};
  if(sql.includes('count(*)::int'))return{rows:[{status:'new',n:records.size}]};
  throw Error('Unexpected SQL: '+sql);
 }};
 const authMiddleware=()=>((req,res,next)=>next());
 const requireRoles=(...roles)=>(req,res,next)=>roles.includes(req.user?.role)?next():res.status(403).json({ok:false,error:'Forbidden'});
 install(app,{services,authMiddleware,requireRoles});
 return {get,post,writes,records};
}
function response(){return{code:200,body:null,headers:{},status(c){this.code=c;return this},set(k,v){this.headers[k]=v;return this},json(b){this.body=b;return this}}}
async function run(m,path,req){
 const handlers=m.get(path);assert(handlers,'Missing route '+path);
 const res=response();let i=0;
 const next=()=>{const fn=handlers[i++];return fn?fn(req,res,next):undefined};
 await next();return res;
}
(async()=>{
 const x=appHarness(),base={ip:'192.0.2.1',get:k=>k==='origin'?'https://englishlegalese.com':null,body:{}};
 let r=await run(x.get,'/api/v1970/memberships/quote',{query:{seats:'1'}});assert.equal(r.body.monthly_usd,25);assert.equal(r.body.proposal_only,true);
 r=await run(x.get,'/api/v1970/memberships/quote',{query:{seats:'50'}});assert.equal(r.body.custom,true);
 r=await run(x.get,'/api/v1970/memberships/quote',{query:{seats:'0'}});assert.equal(r.code,400);
 r=await run(x.get,'/api/v1970/memberships/readiness',{});assert.equal(r.body.interest_form_available,true);assert.equal(r.body.subscription_checkout_available,false);
 const catalog=await run(x.get,'/api/v1970/memberships/catalog',{});
 assert.deepEqual(catalog.body.covered_programs,['legal_english','business_english','investor_english']);
 assert.deepEqual(catalog.body.independent_certifications,['legal_english','business_english']);
 assert.equal(catalog.body.proposed_renewal_terms.continues_until_canceled,true);
 assert.equal(catalog.body.proposed_renewal_terms.cancel_before_next_renewal,true);
 assert.equal(catalog.body.proposed_renewal_terms.access_through_current_paid_period,true);
 assert.equal(catalog.body.proposed_renewal_terms.cancellation_active,false);
 const body={client_request_id:randomUUID(),request_kind:'organization',plan_code:'team',contact_name:'Jane Example',
   contact_email:'jane@example.test',organization_name:'Example & Co.',seat_count:1,
   preferred_term:'monthly',contact_consent:true};
 r=await run(x.post,'/api/v1970/memberships/interest',{...base,body});assert.equal(r.code,201);
 assert.equal(x.writes.length,1);assert.equal(x.writes[0].seat_count,1);assert.equal(r.body.charged,false);
 const again=await run(x.post,'/api/v1970/memberships/interest',{...base,body});
 assert.equal(again.code,201);assert.equal(x.writes.length,1);
 const mismatched=await run(x.post,'/api/v1970/memberships/interest',{...base,body:{...body,seat_count:2}});
 assert.equal(mismatched.code,409);assert.equal(x.writes.length,1);
 const wrong=await run(x.post,'/api/v1970/memberships/interest',{...base,body:{...body,client_request_id:randomUUID(),seat_count:0}});
 assert.equal(wrong.code,400);
 const noConsent=await run(x.post,'/api/v1970/memberships/interest',{...base,body:{...body,client_request_id:randomUUID(),contact_consent:false}});
 assert.equal(noConsent.code,400);
 const evil=await run(x.post,'/api/v1970/memberships/interest',{...base,ip:'192.0.2.2',get:()=> 'https://evil.example',body:{...body,client_request_id:randomUUID()}});
 assert.equal(evil.code,403);
 const owner=await run(x.get,'/api/v1970/owner/membership-interests',{user:{role:'owner'},authSessionKey:'signed-in',get:k=>k==='authorization'?'Bearer token':''});
 assert.equal(owner.body.inquiries.length,1);assert.equal(owner.body.inquiries[0].contact_email,'jane@example.test');assert.equal(owner.headers['Cache-Control'],'no-store');
 const denied=await run(x.get,'/api/v1970/owner/membership-interests',{user:{role:'student'},authSessionKey:'signed-in',get:k=>k==='authorization'?'Bearer token':''});
 assert.equal(denied.code,403);
 const checkout=await run(x.post,'/api/v1970/memberships/checkout',{});assert.equal(checkout.code,503);assert.equal(checkout.body.charged,false);
 console.log('PASS HF34: one-seat quote, progressive monotonic totals, custom 50+, opt-in request, idempotency, owner boundary and billing off.');
})().catch(e=>{console.error(e);process.exitCode=1});
