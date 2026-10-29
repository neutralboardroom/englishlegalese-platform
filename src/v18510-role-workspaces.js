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
   // Enrollment nominations are distinct from consented progress reporting:
   // active, linked employees can be selected for a request but must accept
   // before any classroom placement or employer-visible report.
   const candidates=await services.query(`SELECT DISTINCT u.id,u.full_name FROM organization_members m JOIN users u ON u.id=m.user_id
    WHERE m.organization_id=$1 AND m.status='active' AND m.member_role=ANY($2::text[])
    AND u.role='student' AND u.status='active'
    ORDER BY u.full_name,u.id LIMIT 100`,[org.id,['employee','learner','student']]);
   const enrollment_candidates=candidates.rows.map(x=>({id:x.id,name:safeLabel(x.full_name)}));
   // A named employee appears only when BOTH current organization membership
   // and an explicit, current progress-sharing consent are recorded.
   const people=await services.query(`SELECT u.id,u.full_name FROM organization_members m JOIN users u ON u.id=m.user_id
    WHERE m.organization_id=$1 AND m.status='active'
    AND m.member_role=ANY($2::text[]) AND m.metadata->>'employer_reporting_consent'='true'
    AND u.role='student' AND u.status='active' ORDER BY u.full_name,u.id LIMIT 100`,[org.id,['employee','learner','student']]);
   const ids=people.rows.map(r=>r.id);
   if(!ids.length)return send(res,200,{ok:true,organizations,organization:org,employees:[],enrollment_candidates,
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
   return send(res,200,{ok:true,organizations,organization:org,employees,enrollment_candidates,returned_employee_count:employees.length,
    truncated:people.rows.length===100,notice:'Only currently consented employees and explicitly published privacy-safe reports are shown. Missing results are not zero; no student answers, private teacher notes or unapproved grades are shared.'});
  }catch{return send(res,503,{ok:false,error:'Verified employer reports are unavailable; no unverified progress was displayed.'})}
 });
 // HF24 employer-managed class REQUEST, not a completed enrollment or payment.
 // Only named, active, already-linked employees can be nominated by a verified
 // organization administrator. Students must separately accept participation.
 app.post('/api/v18510/employer/enroll',requireBearer,auth,requireRoles('employer'),async(req,res)=>{
  if(!available())return send(res,503,{ok:false,error:'Secure employer enrollment requests require the production database.'});
  const b=req.body||{},org=String(b.organization_id||'');
  const ids=b.employee_ids,program=b.program,format=b.format,packageSize=Number(b.lessons);
  if(org.length<5||org.length>100||!Array.isArray(ids)||!ids.length||ids.length>100||
     ids.some(v=>typeof v!=='string'||v.length<5||v.length>100)||new Set(ids).size!==ids.length||
     !['legal','business','complete'].includes(program)||!['group','private'].includes(format)||
     ![8,16,24,48].includes(packageSize)||((program==='complete')!==(packageSize===48))||
     (format==='group'&&ids.length<3)||b.employee_acceptance_required!==true)
   return send(res,400,{ok:false,error:'Choose a valid program, package and linked employee roster; acknowledge that employees must accept before enrollment.'});
  const notes=typeof b.notes==='string'?b.notes.trim():'';
  if(notes.length>400)return send(res,400,{ok:false,error:'Notes are too long.'});
  try{
   const permitted=await services.query(`SELECT 1 FROM organization_members m JOIN organizations o ON o.id=m.organization_id
    WHERE m.user_id=$1 AND m.organization_id=$2 AND m.status='active' AND m.member_role=ANY($3::text[])
    AND o.status='active' LIMIT 1`,[req.user.id,org,orgAdmin]);
   if(!permitted.rows.length)return send(res,403,{ok:false,error:'Your employer account is not authorized for this company.'});
   const members=await services.query(`SELECT DISTINCT u.id FROM organization_members m JOIN users u ON u.id=m.user_id
    WHERE m.organization_id=$1 AND m.status='active' AND m.member_role=ANY($2::text[])
    AND u.role='student' AND u.status='active' AND u.id=ANY($3::text[])`,[org,['employee','learner','student'],ids]);
   if(members.rows.length!==ids.length)return send(res,403,{ok:false,error:'At least one selected employee is not an active learner in your organization.'});
   // This is an indicative list-price estimate; actual cohorts, tuition and tax
   // are confirmed manually. Never invoke the disabled placeholder checkout.
   const rates= format==='group'?{8:149,16:249,24:349,48:649}:{8:319,16:599,24:849,48:1599};
   const discount=format==='group'?(ids.length>=11?15:ids.length>=6?10:5):0;
   const cents=Math.round(rates[packageSize]*ids.length*100*(100-discount)/100);
   const metadata={hf24:true,employee_ids:ids,requires_employee_acceptance:true,estimated_total_cents:cents,
    discount_percent:discount,program,lessons:packageSize,format,payment_status:'not_charged',schedule_status:'pending_staff_confirmation'};
   const q=await services.query(`INSERT INTO booking_requests(requester_user_id,organization_id,buyer_type,requested_track,package_name,
    credit_hold_status,staff_status,notes,metadata) VALUES($1,$2,'employer',$3,$4,'not_held','needs_review',$5,$6::jsonb)
    RETURNING id,created_at`,[req.user.id,org,program,packageSize+'-lesson '+format,notes,JSON.stringify(metadata)]);
   return send(res,201,{ok:true,reference:q.rows[0].id,status:'needs_review',selected_employees:ids.length,
    estimated_total_usd:cents/100,discount_percent:discount,payment_taken:false,class_reserved:false,
    message:'Employer class request saved. Staff must confirm employee acceptance, teacher, timetable, price and a legitimate payment option before enrollment. No email was sent.'});
  }catch{return send(res,503,{ok:false,error:'The employer request could not be securely saved; no booking or payment was made.'})}
 });
 app.get('/api/v18510/employer/enrollments',requireBearer,auth,requireRoles('employer'),async(req,res)=>{
  if(!available())return send(res,503,{ok:false,error:'Employer enrollment status requires the production database.'});
  const org=String(req.query.organization_id||'');
  if(!org||org.length>100)return send(res,400,{ok:false,error:'Choose a verified organization.'});
  try{
   const allowed=await services.query(`SELECT 1 FROM organization_members m JOIN organizations o ON o.id=m.organization_id
    WHERE m.user_id=$1 AND m.organization_id=$2 AND m.status='active' AND m.member_role=ANY($3::text[])
    AND o.status='active' LIMIT 1`,[req.user.id,org,orgAdmin]);
   if(!allowed.rows.length)return send(res,403,{ok:false,error:'Not authorized for this organization.'});
   const r=await services.query(`SELECT id,created_at,staff_status,package_name,requested_track,metadata FROM booking_requests
    WHERE requester_user_id=$1 AND organization_id=$2 AND buyer_type='employer'
    ORDER BY created_at DESC,id DESC LIMIT 30`,[req.user.id,org]);
   return send(res,200,{ok:true,requests:r.rows.map(x=>({
     reference:x.id,created_at:x.created_at,status:safeLabel(x.staff_status),package:safeLabel(x.package_name),
     program:safeLabel(x.requested_track),employees:Array.isArray(x.metadata?.employee_ids)?x.metadata.employee_ids.length:0,
     payment_status:'not_charged'
   })),limited_to:30});
  }catch{return send(res,503,{ok:false,error:'Verified employer enrollment status could not be loaded.'})}
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
