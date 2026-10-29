'use strict';
// HF24: REAL read-only owner/admin operations and organization-scoped
// employer progress. No cross-company access, no private learner answers,
// feedback text, wages, tokens, payments or inferred results. No migrations.
function install(app,{services,authMiddleware,requireRoles}){
 const auth=authMiddleware(services), requireBearer=(req,res,next)=>{
  if(!/^Bearer [^\s]+$/.test(req.get('authorization')||''))return res.status(401).set('Cache-Control','no-store').json({ok:false,error:'Bearer session required.'});
  next();
 };
 const send=(res,status,data)=>res.status(status).set('Cache-Control','private, no-store').set('X-Content-Type-Options','nosniff').json(data);
 const available=()=>services.mode()==='postgres';
 const orgAdmin=['employer_admin','administrator','manager','hr_manager'];
 const safeMetric=value=>typeof value==='number'&&Number.isFinite(value)&&value>=0&&value<=100?value:null;
 const safeCount=value=>Number.isSafeInteger(value)&&value>=0&&value<=100000?value:null;
 const safeLabel=value=>typeof value==='string'?value.replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,65):'';
 app.get('/api/v18510/employer/progress',requireBearer,auth,requireRoles('employer'),async(req,res)=>{
  if(!available())return send(res,503,{ok:false,error:'Verified employer reporting requires the production database.'});
  try{
   const membership=await services.query(`SELECT o.id,o.name FROM organization_members m JOIN organizations o ON o.id=m.organization_id
    WHERE m.user_id=$1 AND m.status='active' AND m.member_role=ANY($2::text[])
    AND o.status='active' ORDER BY o.name,o.id LIMIT 30`,[req.user.id,orgAdmin]);
   const organizations=membership.rows.map(x=>({id:x.id,name:safeLabel(x.name)}));
   if(!organizations.length)return send(res,200,{ok:true,organizations:[],employees:[],notice:'No active, verified employer-administrator organization membership was found. Ask the platform owner to verify your company account; no employee records were exposed.'});
   let org=organizations[0];
   if(req.query.organization_id!=null){
    if(typeof req.query.organization_id!=='string'||req.query.organization_id.length>100)return send(res,400,{ok:false,error:'Invalid organization.'});
    org=organizations.find(o=>o.id===req.query.organization_id);
    if(!org)return send(res,403,{ok:false,error:'This organization is not assigned to your employer account.'});
   }
   // A named employee appears only when BOTH current organization membership
   // and an explicit, current progress-sharing consent are recorded.
   const people=await services.query(`SELECT u.id,u.full_name FROM organization_members m JOIN users u ON u.id=m.user_id
    WHERE m.organization_id=$1 AND m.status='active'
    AND m.member_role=ANY($2::text[]) AND m.metadata->>'employer_reporting_consent'='true'
    AND u.role='student' AND u.status='active' ORDER BY u.full_name,u.id LIMIT 100`,[org.id,['employee','learner','student']]);
   const ids=people.rows.map(r=>r.id);
   if(!ids.length)return send(res,200,{ok:true,organizations,organization:org,employees:[],
    notice:'No employees have both verified organization membership and explicit progress-sharing consent. Private learner work remains inaccessible.'});
   const reports=await services.query(`SELECT DISTINCT ON (r.user_id)
      r.user_id,r.created_at,r.report_data
    FROM progress_reports r
    WHERE r.organization_id=$1 AND r.user_id=ANY($2::text[])
      AND r.privacy_level='privacy_safe_progress_only'
      AND r.status='published'
    ORDER BY r.user_id,r.created_at DESC,r.id DESC`,[org.id,ids]);
   const byUser=new Map(reports.rows.map(r=>[r.user_id,r]));
   const employees=people.rows.map(person=>{
    const last=byUser.get(person.id);const d=last?.report_data;
    // Explicit whitelisted, numeric, published, privacy-safe fields ONLY.
    // All missing metrics remain null; never invent grades from drafts.
    return {name:safeLabel(person.full_name),has_published_report:Boolean(last),
     reported_at:last?.created_at||null,
     completion_percent:safeMetric(d?.completion_percent),
     attendance_percent:safeMetric(d?.attendance_percent),
     score_percent:safeMetric(d?.score_percent),
     milestones_completed:safeCount(d?.milestones_completed),
     level:safeLabel(d?.level_label)};
   });
   return send(res,200,{ok:true,organizations,organization:org,employees,returned_employee_count:employees.length,
    truncated:people.rows.length===100,notice:'Only currently consented employees and explicitly published privacy-safe reports are shown. Missing results are not zero; no student answers, private teacher notes or unapproved grades are shared.'});
  }catch{return send(res,503,{ok:false,error:'Verified employer reports are unavailable; no unverified progress was displayed.'})}
 });

 // HF24 employer enrollment: only active, verified organization administrators.
 // Roster selections are limited to current student members of that organization.
 // An enrollment REQUEST is not an actual seat assignment or a completed payment.
 const verifyEmployerOrg=async(userId,orgId)=>{
  if(typeof orgId!=='string'||!/^EL-ORG-[a-z0-9-]{1,90}$/i.test(orgId))return false;
  const membership=await services.query(`SELECT 1 FROM organization_members m JOIN organizations o ON o.id=m.organization_id
   WHERE m.organization_id=$1 AND m.user_id=$2
     AND m.status='active' AND m.member_role=ANY($3::text[])
     AND o.status='active' LIMIT 1`,[orgId,userId,orgAdmin]);
  return membership.rows.length===1;
 };
 app.get('/api/v18510/employer/roster',requireBearer,auth,requireRoles('employer'),async(req,res)=>{
  if(!available())return send(res,503,{ok:false,error:'Employer roster requires the verified production database.'});
  try{
   const id=req.query.organization_id;
   if(!await verifyEmployerOrg(req.user.id,id))return send(res,403,{ok:false,error:'Employer organization access denied.'});
   const rows=await services.query(`SELECT DISTINCT u.id,u.full_name FROM organization_members m JOIN users u ON u.id=m.user_id
      WHERE m.organization_id=$1 AND m.status='active' AND m.member_role=ANY($2::text[])
      AND u.role='student' AND u.status='active'
      ORDER BY u.full_name,u.id LIMIT 101`,[id,['employee','learner','student']]);
   return send(res,200,{ok:true,organization_id:id,employees:rows.rows.slice(0,100).map(p=>({id:p.id,name:safeLabel(p.full_name)})),
    truncated:rows.rows.length>100,notice:'Select only verified organization student members. Other students and private learning content are not accessible. No email is sent.'});
  }catch{return send(res,503,{ok:false,error:'Verified employer roster is not available.'})}
 });
 app.get('/api/v18510/employer/enrollment-requests',requireBearer,auth,requireRoles('employer'),async(req,res)=>{
  if(!available())return send(res,503,{ok:false,error:'Employer enrollment records require the production database.'});
  try{
   const id=req.query.organization_id;
   if(!await verifyEmployerOrg(req.user.id,id))return send(res,403,{ok:false,error:'Employer organization access denied.'});
   const q=await services.query(`SELECT id,program,package_sessions,employee_count,estimated_total_cents,discount_percent,staff_status,payment_status,created_at
    FROM employer_enrollment_requests WHERE organization_id=$1 AND requester_user_id=$2
    ORDER BY created_at DESC,id DESC LIMIT 50`,[id,req.user.id]);
   return send(res,200,{ok:true,requests:q.rows,checkout_available:false,notice:'Requests are not confirmed enrollments. No payment is taken until verified class confirmation and compliant payment activation.'});
  }catch{return send(res,503,{ok:false,error:'Employer enrollment request history is not available; no information was invented.'})}
 });
 app.post('/api/v18510/employer/enrollment-requests',requireBearer,auth,requireRoles('employer'),async(req,res)=>{
  if(!available())return send(res,503,{ok:false,error:'Employee enrollment requests require the production database.'});
  const body=req.body||{};
  const id=body.organization_id,program=body.program,sessions=body.package_sessions,employees=body.employee_user_ids;
  if(!['legal','business','investor','complete'].includes(program)||![8,16,24,48].includes(sessions)
   ||(program==='complete'&&sessions!==48)||(program!=='complete'&&sessions===48)
   ||(program==='investor'&&sessions===24)
   ||!Array.isArray(employees)||employees.length<1||employees.length>100
   ||employees.some(x=>typeof x!=='string'||x.length>150)
   ||new Set(employees).size!==employees.length
   ||typeof body.client_request_id!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.client_request_id)
   ||(body.preferred_time_window!=null&&(typeof body.preferred_time_window!=='string'||body.preferred_time_window.length>150)))
    return send(res,400,{ok:false,error:'Choose a valid program, package, current employees, time preference and unique request ID.'});
  try{
   if(!await verifyEmployerOrg(req.user.id,id))return send(res,403,{ok:false,error:'Employer organization access denied.'});
   const check=await services.query(`SELECT DISTINCT u.id FROM organization_members m JOIN users u ON u.id=m.user_id
    WHERE m.organization_id=$1 AND m.status='active' AND m.member_role=ANY($2::text[])
    AND u.role='student' AND u.status='active' AND u.id=ANY($3::text[])`,[id,['employee','learner','student'],employees]);
   if(check.rows.length!==employees.length)return send(res,403,{ok:false,error:'All selected employees must be active learners in this verified company. No request was created.'});
   const prices={8:14900,16:24900,24:34900,48:64900};
   const discount=employees.length>=11?15:employees.length>=6?10:employees.length>=3?5:0;
   const cents=Math.round(prices[sessions]*employees.length*(100-discount)/100);
   const insert=await services.query(`INSERT INTO employer_enrollment_requests
    (organization_id,requester_user_id,client_request_id,program,package_sessions,
     employee_user_ids,employee_count,estimated_total_cents,discount_percent,preferred_time_window)
    VALUES($1,$2,$3::uuid,$4,$5,$6::text[],$7,$8,$9,$10)
    ON CONFLICT (requester_user_id,client_request_id) DO NOTHING
    RETURNING id,staff_status,estimated_total_cents`,[
    id,req.user.id,body.client_request_id,program,sessions,employees,
    employees.length,cents,discount,(body.preferred_time_window||'').trim()]);
   const row=insert.rows[0]||(await services.query(`SELECT id,staff_status,estimated_total_cents FROM employer_enrollment_requests
    WHERE requester_user_id=$1 AND client_request_id=$2::uuid LIMIT 1`,[req.user.id,body.client_request_id])).rows[0];
   if(!row)return send(res,503,{ok:false,error:'Request persistence was not confirmed.'});
   return send(res,201,{ok:true,reference:row.id,status:row.staff_status,estimated_total_cents:row.estimated_total_cents,
    payment_taken:false,employee_accounts_created:false,class_confirmed:false,
    notice:'Your team class request was saved for manual teacher, schedule and seat confirmation. No student accounts were created, no emails were sent and no payment was taken.'});
  }catch{return send(res,503,{ok:false,error:'Enrollment request could not be recorded. No payment was taken. Please confirm that the approved additive employer schema is installed.'})}
 });
 // Explicitly disable card payment until a verified, production-ready payment
 // gateway, webhook reconciliation, refunds and seat confirmations exist.
 app.post('/api/v18510/employer/checkout',requireBearer,auth,requireRoles('employer'),(req,res)=>
  send(res,503,{ok:false,checkout_available:false,payment_taken:false,error:'Secure employer checkout is not yet activated. A verified quote and payment invitation must be arranged after class confirmation.'}));

 app.get('/api/v18510/owner/overview',requireBearer,auth,requireRoles('owner','admin'),async(req,res)=>{
  if(!available())return send(res,503,{ok:false,error:'Owner operations require the production database.'});
  try{
   const counts=await Promise.all([
    services.query("SELECT role,count(*)::int AS count FROM users WHERE status='active' GROUP BY role"),
    services.query("SELECT count(*)::int AS count FROM organizations WHERE status='active'"),
    services.query("SELECT status,count(*)::int AS count FROM class_sessions GROUP BY status"),
    services.query("SELECT review_status,count(*)::int AS count FROM self_paced_lesson_submissions GROUP BY review_status"),
    services.query("SELECT status,count(*)::int AS count FROM progress_reports GROUP BY status")
   ]);
   const grouped=rows=>Object.fromEntries(rows.map(r=>[safeLabel(r.role||r.status),r.count]));
   return send(res,200,{ok:true,role:req.user.role,counts:{
    active_user_roles:grouped(counts[0].rows),
    active_organizations:counts[1].rows[0]?.count||0,
    class_sessions:grouped(counts[2].rows),
    teacher_submission_review_states:grouped(counts[3].rows),
    progress_report_states:grouped(counts[4].rows)
   },notice:'Read-only counts from the core database, not a financial audit or separate enrollment-inquiry database. No user impersonation, payments, private learner work or automatic emails are available here.'});
  }catch{return send(res,503,{ok:false,error:'Owner operational counts could not be verified. No zeros were invented.'})}
 });
 app.post('/api/v18510/workspace/logout',requireBearer,auth,requireRoles('owner','admin','employer'),async(req,res)=>{
  if(!available()||!req.authSessionKey)return send(res,503,{ok:false,error:'Server session revocation cannot be confirmed.'});
  try{const x=await services.query('UPDATE user_sessions SET revoked_at=now() WHERE user_id=$1 AND token_preview=$2 AND revoked_at IS NULL RETURNING id',[req.user.id,req.authSessionKey]);
   return x.rows.length?send(res,200,{ok:true,session_revoked:true}):send(res,409,{ok:false,error:'Session was not active.'});
  }catch{return send(res,503,{ok:false,error:'Server session revocation cannot be confirmed.'})}
 });
}
module.exports={install};
