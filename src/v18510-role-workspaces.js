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
