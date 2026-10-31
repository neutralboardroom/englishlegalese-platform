'use strict';
// HF34: proposed memberships and genuine opt-in information requests.
// These routes NEVER provision seats, activate AI, create subscriptions, send emails or charge cards.
const {randomUUID}=require('node:crypto');
const individuals=Object.freeze([
 Object.freeze({code:'starter',name:'Starter',monthly_usd:12,proposed_ai_replies:100}),
 Object.freeze({code:'plus',name:'Plus',monthly_usd:19,proposed_ai_replies:250}),
 Object.freeze({code:'pro',name:'Pro',monthly_usd:29,proposed_ai_replies:500}),
 Object.freeze({code:'guided',name:'Guided',monthly_usd:79,proposed_ai_replies:250,
  proposed_small_group_classes:2,teacher_capacity_required:true})
]);
const HOSTS=new Set(['englishlegalese.com','www.englishlegalese.com','englishlegalese-platform.onrender.com']);
const hits=new Map();
function organizationQuote(seats){
 if(!Number.isSafeInteger(seats)||seats<1||seats>10000)throw Error('Choose a whole number of employees from 1 to 10,000.');
 // Progressive pricing avoids a pricing cliff when employee 20 joins.
 if(seats>=50)return {seats,custom:true,monthly_usd:null,annual_equivalent_usd:null,
  note:'For 50 or more employees, request an individually negotiated company quotation.'};
 const first=Math.min(seats,4),second=Math.min(Math.max(0,seats-4),15),third=Math.max(0,seats-19);
 const monthly=first*25+second*23+third*21;
 return {seats,custom:false,monthly_usd:monthly,annual_equivalent_usd:monthly*12,
  per_seat_bands:[{seats:first,unit_usd:25},{seats:second,unit_usd:23},{seats:third,unit_usd:21}].filter(x=>x.seats),
  note:'Indicative progressive seat estimate, not a subscription, invoice or binding offer. Digital licenses only; live lessons and certificate exams are separate.'};
}
function originValid(req){
 const origin=req.get('origin')||req.get('referer');
 if(!origin)return false;
 try{const u=new URL(origin);return u.protocol==='https:'&&HOSTS.has(u.hostname)||
   (process.env.NODE_ENV!=='production'&&['localhost','127.0.0.1'].includes(u.hostname));}catch{return false}
}
function rate(req){
 const key=String(req.ip||req.socket?.remoteAddress||'unknown').slice(0,120);
 const now=Date.now();let n=hits.get(key);
 if(!n||n.until<now)n={count:0,until:now+60*60*1000};
 n.count++;hits.set(key,n);
 if(hits.size>10000)for(const [k,v]of hits){if(v.until<now)hits.delete(k)}
 return n.count<=5;
}
const clean=(x,max)=>typeof x==='string'&&x.trim().length<=max&&!/[\u0000-\u001f\u007f]/.test(x)?x.trim():null;
const emailValid=x=>Boolean(x&&x.length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x));
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function install(app,{services,authMiddleware,requireRoles}){
 const respond=(res,status,data)=>res.status(status).set('Cache-Control','no-store').set('X-Content-Type-Options','nosniff').json(data);
 const dbReady=async()=>{
  if(services.mode()!=='postgres')return false;
  try{const r=await services.query("SELECT to_regclass('public.membership_interest_requests')::text AS relation");
   return r.rows[0]?.relation==='membership_interest_requests';}
  catch{return false}
 };
 app.get('/api/v1970/memberships/catalog',(_req,res)=>respond(res,200,{
  ok:true,pricing_status:'proposed',currency:'USD',individual_plans:individuals,
  organization_min_seats:1,volume_pricing:'progressive',volume_bands:[
   {from:1,to:4,incremental_seat_usd:25},{from:5,to:19,incremental_seat_usd:23},
   {from:20,to:49,incremental_seat_usd:21},{from:50,to:null,custom_quote:true}],
  payment_enabled:false,entitlements_enabled:false,organization_roles_require_verification:true,
  note:'Monthly amounts are proposals for digital learning access, not active subscriptions. Teacher-led classes and supervised certificate assessments have separate costs.'
 }));
 app.get('/api/v1970/memberships/quote',(req,res)=>{
  const input=req.query?.seats;
  if(typeof input!=='string'||!/^\d{1,5}$/.test(input))
   return respond(res,400,{ok:false,error:'Enter a whole number of employees from 1 to 10,000.'});
  try{return respond(res,200,{ok:true,...organizationQuote(Number(input)),currency:'USD',proposal_only:true,payment_taken:false})}
  catch(e){return respond(res,400,{ok:false,error:e.message})}
 });
 app.get('/api/v1970/memberships/readiness',async(_req,res)=>respond(res,200,{
  ok:true,interest_form_available:await dbReady(),subscription_checkout_available:false,
  active_subscriptions_available:false,enterprise_seat_provisioning_available:false,
  notice:'Membership inquiries are not active licenses. No subscription checkout, renewal or payment collection has been enabled.'
 }));
 app.post('/api/v1970/memberships/interest',async(req,res)=>{
  if(!originValid(req))return respond(res,403,{ok:false,error:'Please use the EnglishLegalese membership page.'});
  if(!rate(req))return respond(res,429,{ok:false,error:'Too many inquiries. Please try again later.'});
  const b=req.body||{};
  if(b.website)return respond(res,200,{ok:true,received:false,notice:'Request not processed.'});
  if(b.contact_consent!==true)return respond(res,400,{ok:false,error:'Please agree to be contacted about your membership inquiry.'});
  const name=clean(b.contact_name,120),email=clean(b.contact_email,254)?.toLowerCase(),
   org=b.organization_name==null||b.organization_name===''?null:clean(b.organization_name,120);
  const kind=b.request_kind,plan=b.plan_code,term=b.preferred_term,seat=b.seat_count;
  if(!name||name.length<2||!emailValid(email)||!UUID.test(b.client_request_id||'')||
    !['monthly','annual'].includes(term)||!['individual','organization'].includes(kind))
   return respond(res,400,{ok:false,error:'Please check your contact details and selected membership.'});
  const allowedIndividual=individuals.some(p=>p.code===plan);
  if(kind==='individual'&&(!allowedIndividual||org!==null||seat!=null)||
     kind==='organization'&&(!['team','enterprise'].includes(plan)||!org||org.length<2||
      !Number.isSafeInteger(seat)||seat<1||seat>10000||
      (plan==='team'&&seat>=50)||(plan==='enterprise'&&seat<50)))
   return respond(res,400,{ok:false,error:'Choose a valid individual or company plan and employee count.'});
  if(!await dbReady())return respond(res,503,{ok:false,error:'Membership information requests are not currently available. No inquiry has been saved.'});
  try{
   const q=await services.query(`INSERT INTO membership_interest_requests
    (client_request_id,request_kind,plan_code,contact_name,contact_email,organization_name,seat_count,preferred_term)
    VALUES($1::uuid,$2,$3,$4,$5,$6,$7,$8)
    ON CONFLICT(client_request_id) DO NOTHING RETURNING id,created_at`,
    [b.client_request_id,kind,plan,name,email,org,seat??null,term]);
   let row=q.rows[0];
   if(!row){
    const conflict=await services.query('SELECT id,request_kind,plan_code,contact_name,contact_email,organization_name,seat_count,preferred_term,created_at FROM membership_interest_requests WHERE client_request_id=$1::uuid',[b.client_request_id]);
    const old=conflict.rows[0];
    if(!old||old.request_kind!==kind||old.plan_code!==plan||old.contact_name!==name||old.contact_email!==email||
       (old.organization_name||null)!==org||(old.seat_count??null)!==(seat??null)||old.preferred_term!==term)
     return respond(res,409,{ok:false,error:'This request ID was already used for a different inquiry. Reload and submit a new request.'});
    row=old;
   }
   return respond(res,201,{ok:true,received:true,reference:row.id,submitted_at:row.created_at,
    charged:false,subscribed:false,seat_assigned:false,notice:'Your membership information request is recorded for staff review. This is not a subscription or payment, and no automated email was sent.'});
  }catch{return respond(res,503,{ok:false,error:'We could not confirm that your inquiry was saved. No membership or payment was created.'})}
 });
 const bearer=(req,res,next)=>/^Bearer [^\s]+$/.test(req.get('authorization')||'')?next():respond(res,401,{ok:false,error:'An authenticated owner account is required.'});
 app.get('/api/v1970/owner/membership-interests',bearer,authMiddleware(services),requireRoles('owner','admin'),async(req,res)=>{
  if(!req.authSessionKey)return respond(res,401,{ok:false,error:'A current revocable account session is required.'});
  if(!await dbReady())return respond(res,503,{ok:false,error:'Membership inquiry records are not configured.'});
  try{
   const q=await services.query(`SELECT id,request_kind,plan_code,contact_name,contact_email,organization_name,
    seat_count,preferred_term,status,created_at FROM membership_interest_requests
    ORDER BY created_at DESC,id DESC LIMIT 50`);
   const counts=await services.query('SELECT status,count(*)::int AS n FROM membership_interest_requests GROUP BY status');
   return respond(res,200,{ok:true,inquiries:q.rows,total_by_status:Object.fromEntries(counts.rows.map(x=>[x.status,x.n])),
    notice:'Private opt-in inquiries only. Do not treat these as active, paid subscriptions or licensed employee seats. No email was sent.'});
  }catch{return respond(res,503,{ok:false,error:'Membership inquiry records cannot be verified.'})}
 });
 // Billing/seat-issuance deliberately disabled until authenticated Stripe webhooks,
 // validated products, taxes, refunds, cancellation and entitlements are qualified.
 app.post('/api/v1970/memberships/checkout',(_req,res)=>respond(res,503,{
  ok:false,charged:false,subscribed:false,error:'Secure subscription checkout is not activated.'
 }));
}
module.exports={install,organizationQuote,individuals};
