'use strict';
// HF26: Account-scoped operational overview of real public intake queues.
// Read-only, aggregate only, dedicated intake database; NO names, emails,
// applicant qualifications, individual IDs, note text, or status mutations.
const {Pool}=require('pg');
const {records}=require('./v1851-intake-triage-policy');
function install(app,{services,authMiddleware,requireRoles,intakePool}){
 const pool=intakePool===undefined?(process.env.ENGLISHLEGALESE_INTAKE_DATABASE_URL?
   new Pool({connectionString:process.env.ENGLISHLEGALESE_INTAKE_DATABASE_URL,ssl:{rejectUnauthorized:true},max:2,connectionTimeoutMillis:6500,idleTimeoutMillis:12000}):null):intakePool;
 const send=(res,status,data)=>res.status(status).set('Cache-Control','private, no-store').set('X-Content-Type-Options','nosniff').json(data);
 const bearer=(req,res,next)=>/^Bearer [^\s]+$/.test(req.get('authorization')||'')?next():send(res,401,{ok:false,error:'Bearer session required.'});
 const validRows=(rows,kind)=>{
  if(!Array.isArray(rows)||rows.length>25)throw Error('Unverified queue shape');
  const allowed=records[kind].statuses,out=[];
  for(const r of rows){
   if(!allowed.includes(r.status)||!Number.isSafeInteger(r.total)||r.total<0||!Number.isSafeInteger(r.due)||r.due<0||r.due>r.total)throw Error('Unverified queue count');
   out.push({status:r.status,total:r.total,due:r.due});
  }return out;
 };
 app.get('/api/v18512/owner/intake-summary',bearer,authMiddleware(services),requireRoles('owner','admin'),async(req,res)=>{
  if(services.mode()!=='postgres'||!pool)return send(res,503,{ok:false,error:'Private application queue database is not configured or account services are unavailable.'});
  try{
   const result={};
   for(const [kind,c]of Object.entries(records)){
    // Whitelisted constants only; never interpolate request input into SQL.
    const sql="SELECT COALESCE(t.status,'new') AS status, count(*)::int AS total, "+
       "count(*) FILTER (WHERE t.next_followup_at <= now() AND COALESCE(t.status,'new') NOT IN ('closed','declined','confirmed','approved'))::int AS due "+
       "FROM "+c.source+" r LEFT JOIN "+c.review+" t ON t.request_id=r.id "+
       "GROUP BY COALESCE(t.status,'new') ORDER BY status";
    const rows=await pool.query(sql);
    result[kind]=validRows(rows.rows,kind);
   }
   return send(res,200,{ok:true,verified_at:new Date().toISOString(),queues:result,
    notes:'Private, read-only aggregate intake queue counts and due follow-ups only. No applicant names, emails, application details, classroom approval or outreach.'});
  }catch{return send(res,503,{ok:false,error:'Private intake status cannot be verified. No invented counts or applicant data were returned.'})}
 });
}
module.exports={install};
