'use strict';
// HF25 read-only owner/admin operational triage. Existing schema only.
// No names, student responses, employer membership changes, emails, payments or migrations.
function install(app,{services,authMiddleware,requireRoles}){
 const bearer=(req,res,next)=>/^Bearer [^\s]+$/.test(req.get('authorization')||'')?next():res.status(401).set('Cache-Control','no-store').json({ok:false,error:'Bearer account session required.'});
 const respond=(res,status,data)=>res.status(status).set('Cache-Control','private, no-store').set('X-Content-Type-Options','nosniff').json(data);
 const group=rows=>{
  if(!Array.isArray(rows))throw Error('Unexpected aggregate');
  const obj=Object.create(null);
  for(const row of rows){
   const label=row.status,number=row.count;
   if(typeof label!=='string'||!label||label.length>90||!Number.isSafeInteger(number)||number<0)throw Error('Unverified aggregate');
   obj[label]=number;
  }
  return obj;
 };
 app.get('/api/v18511/owner/triage',bearer,authMiddleware(services),requireRoles('owner','admin'),async(req,res)=>{
  if(services.mode()!=='postgres')return respond(res,503,{ok:false,error:'Operational triage requires a verified production database.'});
  try{
   const queries=[
    "SELECT coalesce(approval_status,'unreported') AS status,count(*)::int AS count FROM teacher_profiles GROUP BY approval_status ORDER BY approval_status",
    "SELECT coalesce(readiness_status,'unreported') AS status,count(*)::int AS count FROM class_sessions GROUP BY readiness_status ORDER BY readiness_status",
    "SELECT coalesce(status,'unreported') AS status,count(*)::int AS count FROM class_sessions GROUP BY status ORDER BY status",
    "SELECT coalesce(status,'unreported') AS status,count(*)::int AS count FROM progress_reports GROUP BY status ORDER BY status",
    "SELECT to_regclass('public.employer_enrollment_requests')::text AS relation"
   ];
   const results=await Promise.all(queries.map(sql=>services.query(sql)));
   const exists=results[4].rows.length===1&&results[4].rows[0].relation==='employer_enrollment_requests';
   let enrollment={schema_installed:false,counts:null,description:'Employer enrollment request storage is not installed; counts are unavailable, not zero.'};
   if(exists){
    const actual=await services.query("SELECT staff_status AS status,count(*)::int AS count FROM employer_enrollment_requests GROUP BY staff_status ORDER BY staff_status");
    enrollment={schema_installed:true,counts:group(actual.rows),description:'Counts of persisted employer seat requests, not confirmed classes or payments.'};
   }else if(results[4].rows.length!==1||results[4].rows[0].relation!=null){
    throw Error('Unverified employer schema status');
   }
   return respond(res,200,{ok:true,verified_at:new Date().toISOString(),teacher_applications:group(results[0].rows),
    class_readiness:group(results[1].rows),class_statuses:group(results[2].rows),progress_report_states:group(results[3].rows),
    employer_enrollment:enrollment,certification_issuance_active:false,employer_checkout_active:false,
    notice:'Read-only counts from existing records. No teacher approval, class assignment, payment, certificate or employer membership is changed.'});
  }catch{
   return respond(res,503,{ok:false,error:'Operational triage could not be independently verified. No counts were invented.'});
  }
 });
}
module.exports={install};