'use strict';
// HF32: fail-closed, independent specialist English certificate operations.
// No automatic CEFR-equivalence, no examination or credential issuance on deployment.
const crypto = require('node:crypto');
const LEVELS = ['A1','A2','B1','B2','C1','C2'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TRACKS = ['legal','business'];
const scoreKeys = ['listening_score','speaking_score','reading_score','writing_score','interaction_score'];
const hex = n => crypto.randomBytes(n).toString('hex');
const hash = s => crypto.createHash('sha256').update(s).digest('hex');
const approvedRubric = () => (process.env.CERTIFICATION_RUBRIC_APPROVED_VERSION||'').trim();
function install(app,{services,authMiddleware,requireRoles}){
 const auth = authMiddleware(services);
 const guard=(req,res,next)=>/^Bearer [^\s]+$/.test(req.get('authorization')||'')?next():send(res,401,{ok:false,error:'Bearer session required.'});
 const send=(res,status,body)=>res.status(status).set('Cache-Control','no-store').set('X-Content-Type-Options','nosniff').json(body);
 const available=()=>services.mode()==='postgres';
 const exams=()=>available()&&process.env.CERTIFICATION_EXAMS_ENABLED==='true'&&!!approvedRubric();
 const issuance=()=>exams()&&process.env.CERTIFICATION_ISSUANCE_ENABLED==='true';
 const error=(res)=>send(res,503,{ok:false,error:'Certification service is not ready or the approved schema is not installed.'});
 const idOk=x=>typeof x==='string'&&UUID.test(x);
 const plain=(x,max)=>typeof x==='string'&&x.trim().length>0&&x.trim().length<=max&& !/[\u0000-\u001f\u007f]/.test(x);
 const authorizedAssessor=async(userId)=>{
  const q=await services.query("SELECT 1 FROM teacher_profiles p JOIN users u ON u.id=p.user_id WHERE p.user_id=$1 AND p.approval_status='approved' AND p.metadata->>'certification_assessor_approved'='true' AND u.role='teacher' AND u.status='active' LIMIT 1",[userId]);
  return q.rows.length===1;
 };
 const log=async(assessment,credential,actor,type,summary={})=>services.query(
  'INSERT INTO certification_events(assessment_id,credential_id,actor_user_id,event_type,summary) VALUES($1,$2,$3,$4,$5::jsonb)',
  [assessment||null,credential||null,actor,type,JSON.stringify(summary)]);
 app.get('/api/v1960/certifications/readiness',(req,res)=>send(res,200,{
  ok:true,legal_track:true,business_track:true,
  live_exam_booking_enabled:exams(),certificate_issuance_enabled:issuance(),
  externally_accredited:false,verified_cefr_equivalence:false,
  notice:'EnglishLegalese specialist awards require verified live supervision, calibrated assessment and issuer review; they are not issued by the CEFR.'
 }));
 app.post('/api/v1960/certifications/assessment-requests',guard,auth,requireRoles('student'),async(req,res)=>{
  if(!exams())return error(res);
  const {track,target_level,consent}=req.body||{};
  if(!TRACKS.includes(track)||!LEVELS.includes(target_level)||consent!==true)return send(res,400,{ok:false,error:'Select one subject, level and explicit assessment privacy consent.'});
  try{
   const q=await services.query("INSERT INTO certification_assessments(candidate_user_id,track,target_level,candidate_consent_at) VALUES ($1,$2,$3,now()) RETURNING id,status",[req.user.id,track,target_level]);
   await log(q.rows[0].id,null,req.user.id,'assessment_requested',{track,target_level});
   return send(res,201,{ok:true,assessment_id:q.rows[0].id,status:'requested',booking_confirmed:false,payment_taken:false,certificate_issued:false});
  }catch{return error(res)}
 });
 app.get('/api/v1960/certifications/mine',guard,auth,requireRoles('student'),async(req,res)=>{
  if(!available())return error(res);
  try{
   const q=await services.query("SELECT id,track,target_level,status,created_at,supervised_at,approved_at FROM certification_assessments WHERE candidate_user_id=$1 ORDER BY created_at DESC LIMIT 40",[req.user.id]);
   const c=await services.query("SELECT serial,track,awarded_level,issued_at,revoked_at FROM certification_credentials WHERE candidate_user_id=$1 ORDER BY issued_at DESC LIMIT 40",[req.user.id]);
   return send(res,200,{ok:true,assessments:q.rows,credentials:c.rows,verification_secret_not_recoverable:true});
  }catch{return error(res)}
 });
 app.post('/api/v1960/certifications/assessments/:id/public-verification-consent',guard,auth,requireRoles('student'),async(req,res)=>{
  if(!available()||!idOk(req.params.id))return error(res);
  if(typeof req.body?.consent!=='boolean')return send(res,400,{ok:false,error:'Explicit verification-consent choice required.'});
  try{
   const q=await services.query("UPDATE certification_assessments SET public_verification_consent_at=CASE WHEN $3 THEN now() ELSE NULL END,updated_at=now() WHERE id=$1 AND candidate_user_id=$2 AND status IN ('requested','scheduled','supervised','under_review') RETURNING id,public_verification_consent_at",[req.params.id,req.user.id,req.body.consent]);
   if(!q.rows.length)return send(res,404,{ok:false,error:'No eligible assessment belongs to this student account.'});
   return send(res,200,{ok:true,public_verification_consent:Boolean(q.rows[0].public_verification_consent_at)});
  }catch{return error(res)}
 });
 app.post('/api/v1960/certifications/assessments/:id/supervision',guard,auth,requireRoles('teacher'),async(req,res)=>{
  if(!exams()||!idOk(req.params.id))return error(res);
  const b=req.body||{};
  if(b.identity_verified!==true||b.live_exam_completed!==true||b.unseen_prompts_used!==true||
    b.ai_and_outside_help_prohibited!==true||b.accommodations_reviewed!==true||
    !plain(b.prompt_set_id,120)||!plain(b.protected_evidence_reference,500))
    return send(res,400,{ok:false,error:'Actual live supervision, identity, access rules, accommodations and secured evidence must all be attested.'});
  try{
   if(!await authorizedAssessor(req.user.id))return send(res,403,{ok:false,error:'Accredited internal examiner authorization required.'});
   const q=await services.query(
    "UPDATE certification_assessments SET status='supervised', supervised_at=now(), proctor_user_id=$2, identity_verified_at=now(), identity_verified_by=$2, unseen_prompt_set_id=$3, protected_evidence_reference=$4, supervision_attested=true, authorized_tools_attested=true, accommodations_reviewed=true, rubric_version=$5, updated_at=now() WHERE id=$1 AND status IN ('requested','scheduled') RETURNING id",
    [req.params.id,req.user.id,b.prompt_set_id.trim(),b.protected_evidence_reference.trim(),approvedRubric()]);
   if(!q.rows.length)return send(res,409,{ok:false,error:'Assessment not found or already supervised. Changes require a new examination and audit.'});
   await log(req.params.id,null,req.user.id,'supervision_recorded',{rubric_version:approvedRubric()});
   return send(res,200,{ok:true,status:'supervised',certificate_issued:false});
  }catch{return error(res)}
 });
 app.post('/api/v1960/certifications/assessments/:id/reviews',guard,auth,requireRoles('teacher'),async(req,res)=>{
  if(!exams()||!idOk(req.params.id))return error(res);
  const b=req.body||{};
  if(!scoreKeys.every(k=>Number.isInteger(b[k])&&b[k]>=0&&b[k]<=4)||
    typeof b.recommended_pass!=='boolean'||b.conflict_declared!==false||!plain(b.evidence_reference,500))
   return send(res,400,{ok:false,error:'Provide five 0–4 rubric ratings, decision, no conflict and protected evidence reference.'});
  try{
   if(!await authorizedAssessor(req.user.id))return send(res,403,{ok:false,error:'Approved trained examiner authorization required.'});
   const a=await services.query("SELECT proctor_user_id,rubric_version FROM certification_assessments WHERE id=$1 AND status IN ('supervised','under_review') AND supervision_attested AND identity_verified_at IS NOT NULL",[req.params.id]);
   if(!a.rows.length||a.rows[0].rubric_version!==approvedRubric())return send(res,409,{ok:false,error:'Supervised examination or approved rubric not available.'});
   const q=await services.query(
    "INSERT INTO certification_assessor_reviews(assessment_id,assessor_user_id,rubric_version,listening_score,speaking_score,reading_score,writing_score,interaction_score,evidence_reference,recommended_pass,conflict_declared) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,false) ON CONFLICT DO NOTHING RETURNING id",
    [req.params.id,req.user.id,approvedRubric(),...scoreKeys.map(k=>b[k]),b.evidence_reference.trim(),b.recommended_pass]);
   if(!q.rows.length)return send(res,409,{ok:false,error:'An examiner can submit a final review only once.'});
   await services.query("UPDATE certification_assessments SET status='under_review',updated_at=now() WHERE id=$1 AND status='supervised'",[req.params.id]);
   await log(req.params.id,null,req.user.id,'assessor_review_submitted',{rubric_version:approvedRubric()});
   return send(res,201,{ok:true,review_recorded:true,certificate_issued:false});
  }catch{return error(res)}
 });
 // An owner/administrator must deliberately approve actual evidence; neither self-study nor a single score can issue anything.
 app.post('/api/v1960/certifications/assessments/:id/issue',guard,auth,requireRoles('owner','admin'),async(req,res)=>{
  if(!issuance()||!idOk(req.params.id))return error(res);
  if(req.body?.confirm_verified_human_assessment!==true||req.body?.confirm_qc_and_calibration!==true||
     req.body?.confirm_candidate_consent_checked!==true)
   return send(res,400,{ok:false,error:'Verified human assessment, calibrated quality controls and candidate public verification consent required.'});
  try{
   const a=(await services.query("SELECT * FROM certification_assessments WHERE id=$1 AND status='under_review' AND supervision_attested AND authorized_tools_attested AND accommodations_reviewed AND identity_verified_at IS NOT NULL AND protected_evidence_reference IS NOT NULL AND proctor_user_id IS NOT NULL AND public_verification_consent_at IS NOT NULL",[req.params.id])).rows[0];
   if(!a||a.rubric_version!==approvedRubric())return send(res,409,{ok:false,error:'No eligible verified supervised examination.'});
   const reviews=(await services.query('SELECT * FROM certification_assessor_reviews WHERE assessment_id=$1 ORDER BY submitted_at,id',[a.id])).rows;
   if(reviews.length!==2||reviews[0].assessor_user_id===reviews[1].assessor_user_id||
      reviews.some(x=>x.conflict_declared||!x.recommended_pass||x.rubric_version!==a.rubric_version)||
      !scoreKeys.every(k=>reviews.every(x=>x[k]>=3)&&Math.abs(reviews[0][k]-reviews[1][k])<=1))
    return send(res,409,{ok:false,error:'Two trained independent examiner reviews with calibrated passing evidence are required; borderline or disputed results need moderation.'});
   if(!await authorizedAssessor(reviews[0].assessor_user_id)||!await authorizedAssessor(reviews[1].assessor_user_id))
    return send(res,409,{ok:false,error:'Two currently approved, trained examiners required.'});
   if(req.user.id===a.candidate_user_id)return send(res,403,{ok:false,error:'Candidates cannot issue their own credentials.'});
   const serial='EL-'+a.track.toUpperCase()+'-'+hex(12).toUpperCase();
   const verification_code=hex(24);
   const q=await services.query(
    "INSERT INTO certification_credentials(assessment_id,candidate_user_id,track,awarded_level,serial,verification_code_sha256,issuer_user_id,public_verify_consent) SELECT id,candidate_user_id,track,target_level,$2,$3,$4,true FROM certification_assessments WHERE id=$1 AND status='under_review' ON CONFLICT(assessment_id) DO NOTHING RETURNING id,serial,issued_at",
    [a.id,serial,hash(verification_code),req.user.id]);
   if(!q.rows.length)return send(res,409,{ok:false,error:'Credential already issued or examination status changed.'});
   await services.query("UPDATE certification_assessments SET status='approved',approved_by=$2,approved_at=now(),examiner_decision_at=now(),updated_at=now() WHERE id=$1 AND status='under_review'",[a.id,req.user.id]);
   await log(a.id,q.rows[0].id,req.user.id,'credential_issued',{track:a.track,level:a.target_level});
   return send(res,201,{ok:true,serial,verification_code,track:a.track,level:a.target_level,issued_at:q.rows[0].issued_at,
    delivery:'Give the candidate their one-time verification code through a verified private channel; it cannot be retrieved from the database. Do not publish candidate exam data or ID documents.'});
  }catch{return error(res)}
 });
 app.post('/api/v1960/certifications/verify',async(req,res)=>{
  if(!available())return error(res);
  const {serial,verification_code}=req.body||{};
  if(typeof serial!=='string'||!/^EL-(LEGAL|BUSINESS)-[0-9A-F]{24}$/.test(serial)||
     typeof verification_code!=='string'||!/^[a-f0-9]{48}$/i.test(verification_code))
    return send(res,200,{ok:true,verified:false});
  try{
   const q=await services.query("SELECT track,awarded_level,issued_at,revoked_at,verification_code_sha256,public_verify_consent FROM certification_credentials WHERE serial=$1",[serial]);
   const c=q.rows[0];
   const supplied=Buffer.from(hash(verification_code),'hex');
   const stored=Buffer.from(c?.verification_code_sha256||'0'.repeat(64),'hex');
   const match=crypto.timingSafeEqual(supplied,stored);
   if(!match||!c?.public_verify_consent)return send(res,200,{ok:true,verified:false});
   return send(res,200,{ok:true,verified:c.revoked_at===null,revoked:c.revoked_at!==null,issuer:'EnglishLegalese',
    credential_track:c.track,awarded_specialist_level:c.awarded_level,issued_at:c.issued_at,externally_accredited:false,
    note:'EnglishLegalese specialist-English result, not an official CEFR certificate or independently validated CEFR-equivalence.'});
  }catch{return error(res)}
 });
 app.post('/api/v1960/certifications/credentials/:serial/revoke',guard,auth,requireRoles('owner','admin'),async(req,res)=>{
  if(!available()||typeof req.params.serial!=='string')return error(res);
  const reason=req.body?.reason;
  if(!plain(reason,500)||reason.trim().length<20)return send(res,400,{ok:false,error:'Provide a documented revocation reason.'});
  try{
   const q=await services.query(
    "UPDATE certification_credentials SET revoked_at=now(),revoked_by=$2,revocation_reason=$3 WHERE serial=$1 AND revoked_at IS NULL RETURNING id,assessment_id",
    [req.params.serial,req.user.id,reason.trim()]);
   if(!q.rows.length)return send(res,404,{ok:false,error:'An active credential with that serial was not found.'});
   await log(q.rows[0].assessment_id,q.rows[0].id,req.user.id,'credential_revoked',{reason_category:'documented_by_issuer'});
   return send(res,200,{ok:true,revoked:true});
  }catch{return error(res)}
 });
 app.post('/api/v1960/certifications/assessments/:id/appeal',guard,auth,requireRoles('student'),async(req,res)=>{
  if(!available()||!idOk(req.params.id))return error(res);
  const reason=req.body?.reason;
  if(!plain(reason,2000)||reason.trim().length<20)return send(res,400,{ok:false,error:'Enter 20–2000 characters describing the appeal.'});
  try{
   const a=(await services.query("SELECT id,status FROM certification_assessments WHERE id=$1 AND candidate_user_id=$2 AND status IN ('approved','rejected')",[req.params.id,req.user.id])).rows[0];
   if(!a)return send(res,404,{ok:false,error:'No eligible completed assessment belongs to this account.'});
   const prior=await services.query("SELECT 1 FROM certification_appeals WHERE assessment_id=$1 AND status='pending' LIMIT 1",[a.id]);
   if(prior.rows.length)return send(res,409,{ok:false,error:'An appeal is already pending.'});
   const q=await services.query("INSERT INTO certification_appeals(assessment_id,candidate_user_id,reason) VALUES($1,$2,$3) RETURNING id",[a.id,req.user.id,reason.trim()]);
   await log(a.id,null,req.user.id,'appeal_submitted',{});
   return send(res,201,{ok:true,appeal_id:q.rows[0].id,status:'pending',existing_certificate_status_unchanged:true});
  }catch{return error(res)}
 });
}
module.exports={install};
