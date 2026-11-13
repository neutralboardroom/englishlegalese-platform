'use strict';
/*
 * HF56 — EnglishLegalese adult professional energy-contracts classroom.
 * Student-owned authenticated session records; no client documents, no named
 * counterparties, no confidential contract text, no link in public HTML.
 * Existing PostgreSQL class_sessions, existing revoked Bearer sessions only.
 * Provider is Google Meet, entered by teacher or generated only when
 * Google Calendar credentials are independently configured and verified.
 */
const crypto=require('node:crypto');
const COURSE='energy-contracts-60-v1';
const TIMEZONE='Asia/Ho_Chi_Minh';
const EMAIL=/^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,40}$/i;
const MEET=/^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}\/?$/;
const lessons=[
 {number:1,title:'Introduction, contract speaking and payment-term negotiation',
  goal:'Introduce the work clearly and discuss a fictional 30-day versus 45-day payment request.',
  vocabulary:['condensate','conforming bid','bill of lading','negotiation','guarantee'],
  scenario:'A fictional seller-side energy lawyer explains why a buyer request to extend a proposed payment period needs review.',
  model:'The current draft specifies one payment period. Your request changes that term, so we would need to review it before agreeing.',
  teacherPrompt:'Play the American buyer. Ask: Could we pay later? What would need checking? Can you summarize the request in 30 seconds?',
  homework:'Prepare three short spoken explanations of a draft payment term and one polite clarification question.'},
 {number:2,title:'Conforming bids and qualifying conditions',
  goal:'Explain qualification conditions and distinguish a compliant bid from a proposed exception.',
  vocabulary:['conforming bid','approved buyer','unconditional offer','validity period','qualification','crude oil'],
  pronunciation:'Crude oil /kruːd ɔɪl/: say crew, then crude, crude oil, crude oil sales, crude oil sales agreement. Blend /k/ into /r/, hold /uː/ and finish with /d/. Crude oil and condensate are related petroleum terms but not interchangeable.',
  teacherPronunciationPrompt:'Use a short review at the beginning. Model crew → crude → crude oil → crude oil sales agreement. Invite one full sentence about a fictional draft. Correct no more than one sound at a time; praise improved intelligibility and return to professional conversation.',
  scenario:'A fictional buyer makes an offer but asks to change a condition in the sales invitation.',
  model:'We should review whether the revised offer meets the stated conditions before treating it as a conforming bid.',
  teacherPrompt:'Play buyer: If my price is highest, is my bid automatically conforming? Ask for two conditions and an approval-safe response.',
  homework:'Record a 45-second spoken explanation distinguishing the offered price from bid eligibility.'},
 {number:3,title:'FOB delivery, cargo documents and loading dates',
  goal:'Describe a delivery provision precisely without assuming that every responsibility follows automatically.',
  vocabulary:['FOB','terminal','loading date range','bill of lading','cargo'],
  scenario:'A fictional buyer asks where a shipment is delivered and what documents support the delivery record.',
  model:'The draft uses FOB at a named terminal. We should check the named place, the applicable terms and the required shipping documents.',
  teacherPrompt:'Play buyer: Where does delivery occur? Who confirms the date? Which document records shipment? Avoid announcing universal legal effects.',
  homework:'Explain the difference between a loading window, a loading date and a bill of lading in three clear sentences.'},
 {number:4,title:'Payment security, guarantees and alternative terms',
  goal:'Discuss credit protections, bank guarantees and requests for extensions without exceeding authority.',
  vocabulary:['standby letter of credit','payment guarantee','beneficiary','security','approval'],
  scenario:'A fictional buyer offers alternative payment security in exchange for a longer payment period.',
  model:'We can review the proposed security, but its form, timing and approval requirements would need to be checked.',
  teacherPrompt:'Ask whether a different guarantee always solves the risk. Press for short accurate replies with condition and next step.',
  homework:'Prepare two conditional responses to a request to replace or change payment security.'},
 {number:5,title:'Best-bid meetings, approvals and communicating an award',
  goal:'Separate preliminary bid evaluation from final approval and authorized award communication.',
  vocabulary:['best bid','committee','principal','written approval','award'],
  scenario:'A fictional marketing committee has identified a preferred bid but formal approvals remain outstanding.',
  model:'The preferred bid has been identified, but the decision must not be described as final until the required approvals are obtained.',
  teacherPrompt:'Play the impatient bidder and ask: Have we won? Can you confirm today? Have the parties signed? Correct premature certainty.',
  homework:'Give a one-minute update for an international buyer: current status, remaining approval and next communication.'},
 {number:6,title:'Market-linked pricing and benchmark changes',
  goal:'Explain formula-based pricing, premium/discount and the need to verify a replacement benchmark.',
  vocabulary:['benchmark','premium','discount','pricing period','replacement methodology'],
  scenario:'A fictional sales formula refers to a commodity benchmark whose publication method might change.',
  model:'The draft links the price to a benchmark and an agreed adjustment. We would need to confirm the replacement method if the benchmark changes.',
  teacherPrompt:'Ask learner to explain a formula to a non-lawyer, then ask what happens if the published index is unavailable.',
  homework:'Prepare a 60-second client-friendly explanation of a fictional formula without using actual market data.'},
 {number:7,title:'Confidentiality, notices, force majeure and dispute language',
  goal:'Summarize risk clauses carefully and ask precise questions about notice requirements.',
  vocabulary:['confidentiality','notice','force majeure','governing law','arbitration'],
  scenario:'A fictional party proposes a late notice following an unexpected cargo interruption.',
  model:'We should confirm the notice mechanism, the event facts and the contract wording before describing any consequence.',
  teacherPrompt:'Play counsel who assumes every interruption is force majeure. Ask for an evidence-bound correction and a polite follow-up.',
  homework:'Prepare a three-part verbal risk summary: clause, missing fact and next step.'},
 {number:8,title:'Direct power purchase arrangements and revenue contracts',
  goal:'Contrast energy-sale structures and explain their commercial purpose without asserting current legal eligibility.',
  vocabulary:['DPPA','PPA','generator','offtaker','settlement'],
  scenario:'A fictional renewable project considers two different power-sale pathways and must clarify the revenue flow.',
  model:'The parties should first identify the proposed sales model, participants and settlement arrangement before assuming eligibility.',
  teacherPrompt:'Play an overseas investor asking: Who buys power? Where does revenue come from? What still requires local legal verification?',
  homework:'Explain a fictional power contract to an English-speaking commercial director in 90 seconds.'},
 {number:9,title:'Change-in-law provisions, credit support and bankability',
  goal:'Discuss project risk allocation without guaranteeing that a regulatory change triggers compensation.',
  vocabulary:['change in law','credit support','bankability','risk allocation','condition precedent'],
  scenario:'A fictional renewable buyer asks whether a potential rule change will automatically adjust the purchase price.',
  model:'That outcome depends on the agreed clause, the relevant facts and the applicable legal framework; it should be verified.',
  teacherPrompt:'Press for a three-sentence answer: what the contract proposes, what is uncertain, and who must confirm the effect.',
  homework:'Prepare four neutral questions for a cross-border discussion of a fictional change-in-law clause.'},
 {number:10,title:'Renewable-energy acquisitions: due diligence and document requests',
  goal:'Explain the diligence process for project rights, licences, contracts, land and liabilities.',
  vocabulary:['due diligence','share purchase agreement','licence','land-use rights','condition to closing'],
  scenario:'A fictional investor acquires an operating renewable project with unresolved land-access records.',
  model:'The project is operating, but we still need to verify its land, permit and access records before making a closing recommendation.',
  teacherPrompt:'Play the investor who says the project is running so everything must be compliant. Ask for five careful diligence questions.',
  homework:'Deliver a 60-second verbal diligence update: verified items, open items and requested documents.'},
 {number:11,title:'Redlining a transaction agreement and briefing management',
  goal:'Explain a proposed clause change to both counsel and commercial management.',
  vocabulary:['redline','liability cap','representation','condition','counterproposal'],
  scenario:'In a fictional acquisition, the buyer revises the warranty and approval wording.',
  model:'The proposed change may affect risk allocation; we should compare the complete wording and confirm the intended result.',
  teacherPrompt:'Challenge the learner to explain one change in lawyer language, then in plain English to a manager, without claiming approval.',
  homework:'Prepare two parallel 90-word fictional briefings for legal and business audiences.'},
 {number:12,title:'Integrated contract negotiation, recap and next learning plan',
  goal:'Manage a realistic spoken negotiation and accurately summarize its provisional results.',
  vocabulary:['provisional','concession','approval','unresolved','follow-up'],
  scenario:'A fictional international energy transaction combines delivery, payment, approval and risk questions.',
  model:'We made progress on several commercial questions, but the outstanding terms still require review and authorized confirmation.',
  teacherPrompt:'Run a six-minute American buyer / Vietnamese seller-counsel negotiation. Ask for a 60-second recap and three verification questions.',
  homework:'Write a fictional 120-word follow-up email with agreed-in-principle points, open issues and next owners.'}
];
if(lessons.length!==12||lessons.some((l,i)=>l.number!==i+1))throw Error('Invalid private course lesson sequence');
const AGENDA=Object.freeze([
 {start:0,end:5,label:'Brief conversation and previous-lesson recall'},
 {start:5,end:15,label:'Contract vocabulary, pronunciation and stress'},
 {start:15,end:25,label:'Explain a fictional provision in plain English'},
 {start:25,end:45,label:'Live teacher-buyer negotiation and clarification rounds'},
 {start:45,end:55,label:'Repeat naturally with one targeted pronunciation correction'},
 {start:55,end:60,label:'Accurate spoken recap and short homework'}
]);
function reply(res,status,json){return res.status(status).set('Cache-Control','private, no-store').set('Referrer-Policy','no-referrer').set('X-Content-Type-Options','nosniff').json(json);}
function nowTime(value){
 if(typeof value!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d(?:\.\d{1,3})?)?(?:Z|[+-]\d\d:\d\d)$/.test(value))return null;
 const t=new Date(value).getTime();
 if(!Number.isFinite(t)||t<Date.now()-15*60000||t>Date.now()+180*86400000)return null;
 return new Date(t).toISOString();
}
function pastTime(value){
 if(typeof value!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d(?:\.\d{1,3})?)?(?:Z|[+-]\d\d:\d\d)$/.test(value))return null;
 const t=new Date(value).getTime();
 if(!Number.isFinite(t)||t>Date.now()||t<Date.now()-120*86400000)return null;
 return new Date(t).toISOString();
}
function meetLink(input){
 if(input==null||input==='')return null;
 if(typeof input!=='string')return false;
 const value=input.trim().replace(/\/$/,'');
 return MEET.test(value)?value:false;
}
function changeSummary(metadata){
 const item=metadata?.student_change_request;
 if(!item||typeof item!=='object'||!['cancel','reschedule'].includes(item.kind))return null;
 const status=['pending','declined','approved','coordination_required'].includes(item.status)?item.status:'pending';
 return {kind:item.kind,status,
  requested_at:typeof item.requested_at==='string'?item.requested_at:null,
  proposed_at:item.kind==='reschedule'&&typeof item.proposed_at==='string'?item.proposed_at:null,
  reviewed_at:typeof item.reviewed_at==='string'?item.reviewed_at:null,
  review_reason:['schedule_conflict','manual_coordination','insufficient_information','other'].includes(item.review_reason)?item.review_reason:null,
  policy_decision:'manual_review_required',payment_processed:false,
  booking_changed:false,calendar_event_changed:false};
}
function approvedNoticeHours(){
 const raw=process.env.ENGLISHLEGALESE_PRIVATE_CLASS_NOTICE_HOURS;
 const n=Number(raw);return raw&&Number.isInteger(n)&&n>=1&&n<=168?n:null;
}
function withinClassWindow(row){
 const start=new Date(row.scheduled_at||'').getTime();
 // A formerly scheduled class is not an active invitation indefinitely.
 // Allow a 30-minute post-class grace window for 60-minute live teaching.
 return Number.isFinite(start)&&start+90*60000>Date.now();
}
function outward(row,role){
 const activeMeet=row.status==='scheduled'&&withinClassWindow(row)&&MEET.test(String(row.video_join_url||''));
 return{
  id:row.id,lesson_number:Number(row.metadata?.lesson_number),
  lesson_title:lessons[Number(row.metadata?.lesson_number)-1]?.title||'Private class',
  starts_at:row.scheduled_at,status:row.status,
  duration_minutes:60,timezone:TIMEZONE,
  meet_ready:activeMeet,
  meet_url:activeMeet?row.video_join_url:null,
  student_name:role==='teacher'?row.learner_name:undefined,
  teacher_only_pronunciation_progress:role==='teacher'&&row.metadata?.pronunciation_focus==='crude_oil'?row.metadata?.pronunciation_progress||null:undefined,
  provider:'Google Meet',recording:'Off by default; any recording requires separate consent.',
  change_request:changeSummary(row.metadata),
  notice_policy_hours:approvedNoticeHours(),
  notes:'English-language teaching with fictional contract exercises, not live client advice.'
 };
}
function install(app,{services,authMiddleware,requireRoles,configured}){
 const auth=authMiddleware(services);
 const guard=(req,res,next)=>{
  if(!/^Bearer [^\s]+$/.test(req.get('authorization')||''))return reply(res,401,{ok:false,error:'Sign in to EnglishLegalese to access your private class.'});
  return auth(req,res,async()=>{
   if(!req.authSessionKey)return reply(res,401,{ok:false,error:'A current revocable login session is required.'});
   if(req.user.role==='student'){
    try{
     const v=await services.query("SELECT (COALESCE(metadata->>'email_verified','false')='true' OR EXISTS(SELECT 1 FROM ai_trial_email_verifications v WHERE v.user_id=users.id AND v.verified_at IS NOT NULL)) AS verified FROM users WHERE id=$1 AND role='student' AND status='active'",[req.user.id]);
     if(v.rows[0]?.verified!==true)return reply(res,403,{ok:false,error:'Verify your account email before joining your private class.'});
    }catch{return reply(res,503,{ok:false,error:'Student email verification could not be established.'});}
   }
   next();
  });
 };
 const ready=async(_req,res,next)=>{
  if(services.mode()!=='postgres')return reply(res,503,{ok:false,error:'Private classroom requires the production PostgreSQL database.'});
  try{
   const q=await services.query("SELECT to_regclass('public.class_sessions') AS sessions,to_regclass('public.user_sessions') AS auth_sessions,to_regclass('public.ai_trial_email_verifications') AS verification");
   if(!q.rows[0]?.sessions||!q.rows[0]?.auth_sessions||!q.rows[0]?.verification)throw Error('Missing protected schema');
   next();
  }catch{return reply(res,503,{ok:false,error:'Private class database or account verification is not ready.'});}
 };
 app.use('/api/v2150/private-energy/',(_req,res,next)=>{res.set('Cache-Control','private, no-store');res.set('Referrer-Policy','no-referrer');next();});
 app.get('/api/v2150/private-energy/capabilities',(_req,res)=>reply(res,200,{
  ok:true,requires_sign_in:true,private_session_records:true,send_marketing:false,
  google_meet_auto_creation:services.mode()==='postgres'&&Boolean(configured().google_calendar),
  schedule_timezone:TIMEZONE,lesson_length_minutes:60,student_materials_public:false
 }));
 const rowQuery="SELECT id,learner_name,student_user_id,teacher_user_id,scheduled_at,status,video_join_url,metadata FROM class_sessions WHERE metadata->>'course_key'=$1";
 async function accessible(req,id){
  if(!/^EL-ENERGY-[a-f0-9-]{36}$/.test(String(id)))return null;
  const q=await services.query(rowQuery+" AND id=$2 AND (student_user_id=$3 OR teacher_user_id=$3) LIMIT 1",[COURSE,id,req.user.id]);
  return q.rows[0]||null;
 }
 app.get('/api/v2150/private-energy/lessons',guard,ready,async(req,res)=>{
  if(!['student','teacher','owner','admin'].includes(req.user.role))return reply(res,403,{ok:false,error:'Classroom role required.'});
  try{
   if(req.user.role==='student'){
    const q=await services.query("SELECT 1 FROM class_sessions WHERE student_user_id=$1 AND metadata->>'course_key'=$2 LIMIT 1",[req.user.id,COURSE]);
    if(!q.rows.length)return reply(res,403,{ok:false,error:'This private course has not been assigned to your account.'});
   }
   const audience=req.user.role==='student'?'student':'teacher';
   return reply(res,200,{ok:true,role:audience,course:'Oil & Gas Contracts and Agreements — 60-minute private English classes',
    taught_by:'Human teacher',delivery:'Live Google Meet launched from EnglishLegalese; Meet may open in another tab',
    agenda:AGENDA,lessons:lessons.map(x=>audience==='student'?Object.fromEntries(Object.entries(x).filter(([k])=>k!=='teacherPrompt'&&k!=='teacherPronunciationPrompt')):x)});
  }catch{return reply(res,503,{ok:false,error:'Private lessons are temporarily unavailable.'});}
 });
 app.get('/api/v2150/private-energy/sessions',guard,ready,async(req,res)=>{
  if(!['student','teacher','owner','admin'].includes(req.user.role))return reply(res,403,{ok:false,error:'Classroom role required.'});
  try{
   const rows=await services.query(rowQuery+" AND (student_user_id=$2 OR teacher_user_id=$2) ORDER BY scheduled_at ASC NULLS LAST, created_at DESC LIMIT 50",[COURSE,req.user.id]);
   return reply(res,200,{ok:true,role:req.user.role==='student'?'student':'teacher',sessions:rows.rows.map(x=>outward(x,req.user.role==='student'?'student':'teacher')),no_invitation_sent:true});
  }catch{return reply(res,503,{ok:false,error:'Private class schedule is temporarily unavailable.'});}
 });
 // HF57 safe readiness check: uses the exact same revocable login and
 // student/teacher database ownership checks as actual meeting access.
 // Never include a meeting URL, client name, pronunciation notes, or content.
 app.get('/api/v2150/private-energy/sessions/:id/readiness',guard,ready,async(req,res)=>{
  try{
   const row=await accessible(req,req.params.id);
   if(!row)return reply(res,404,{ok:false,error:'Private class not found for this account.'});
   const isTeacher=row.teacher_user_id===req.user.id;
   const scheduled=row.status==='scheduled';
   const hasStart=Boolean(row.scheduled_at)&&Number.isFinite(new Date(row.scheduled_at).getTime());
   const expired=scheduled&&hasStart&&!withinClassWindow(row);
   const providerReady=scheduled&&!expired&&hasStart&&Boolean(meetLink(row.video_join_url));
   const state=providerReady?'ready':row.status==='completed'?'completed':row.status==='cancelled'?'cancelled':expired?'past_class':!hasStart?'needs_time':'needs_meeting';
   const nextAction=providerReady
    ?'Open Google Meet from your EnglishLegalese class card and test mic/speakers before joining.'
    :row.status==='completed'||row.status==='cancelled'
     ?'No active live class exists for this record.'
     :expired
      ?'This scheduled class time has passed. Keep the record for history; ask your teacher to arrange a new class if appropriate.'
      :isTeacher
       ?'Confirm the lesson time and attach or securely create a valid meeting link.'
       :'Your teacher must confirm the lesson time and meeting link before you can join.';
   return reply(res,200,{ok:true,session_id:row.id,role:isTeacher?'teacher':'student',
    state,lesson_number:Number(row.metadata?.lesson_number)||null,duration_minutes:60,
    provider:'Google Meet',class_time_confirmed:hasStart,meeting_link_ready:providerReady,
    join_available:providerReady,teacher_led:true,recording_enabled:false,
    client_documents_shared:false,next_action:nextAction});
  }catch{return reply(res,503,{ok:false,error:'Private class readiness could not be checked.'});}
 });
 const managers=requireRoles('teacher','owner','admin');
 // Backward-looking setup requires an owner/admin, verified account, actual date
 // and explicit confirmation. It never claims a meeting link, payment, grade or certification.
 app.post('/api/v2150/private-energy/previously-taught',guard,requireRoles('owner','admin'),ready,async(req,res)=>{
  const body=req.body||{};
  const email=typeof body.student_email==='string'?body.student_email.trim().toLowerCase():'';
  const taughtOn=pastTime(body.taught_at);
  const progress=body.pronunciation_progress||'not_recorded';
  if(!EMAIL.test(email)||!taughtOn||!['improved','needs_review','not_recorded'].includes(progress)||body.confirmed_taught!==true)
   return reply(res,400,{ok:false,error:'Confirm an actual previously taught lesson date, a student email, and an optional limited pronunciation observation.'});
  let client;
  try{
   client=await services.persistentStore.pool.connect();
   await client.query('BEGIN');
   const q=await client.query("SELECT id,full_name,role,status,metadata FROM users WHERE lower(email)=lower($1) AND role='student' AND status='active' LIMIT 1",[email]);
   const student=q.rows[0];
   if(!student){await client.query('ROLLBACK');return reply(res,404,{ok:false,error:'Verified student account was not found.'});}
   const verified=await client.query("SELECT (coalesce(metadata->>'email_verified','false')='true' OR EXISTS(SELECT 1 FROM ai_trial_email_verifications v WHERE v.user_id=$1 AND v.verified_at IS NOT NULL)) AS ok FROM users WHERE id=$1",[student.id]);
   if(verified.rows[0]?.ok!==true){await client.query('ROLLBACK');return reply(res,403,{ok:false,error:'Student must verify the EnglishLegalese account before class assignment.'});}
   await client.query('SELECT pg_advisory_xact_lock(hashtext($1))',[COURSE+':'+student.id+':1']);
   const existing=await client.query("SELECT id FROM class_sessions WHERE student_user_id=$1 AND metadata->>'course_key'=$2 AND metadata->>'lesson_number'='1' AND status<>'cancelled' LIMIT 1",[student.id,COURSE]);
   if(existing.rows.length){await client.query('ROLLBACK');return reply(res,409,{ok:false,error:'The first class is already recorded. It was not duplicated.'});}
   const id='EL-ENERGY-'+crypto.randomUUID();
   const metadata={course_key:COURSE,lesson_number:1,duration_minutes:60,source_protection:'fictional_examples_only',recording:'disabled',historical_teacher_confirmation:true,pronunciation_focus:'crude_oil',pronunciation_progress:progress};
   const q2=await client.query("INSERT INTO class_sessions (id,learner_name,teacher_name,student_user_id,teacher_user_id,scheduled_at,timezone,video_provider,video_join_url,status,readiness_status,closeout_status,metadata,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,'Google Meet',NULL,'completed','historical_teacher_confirmed','teacher_confirmed',$8::jsonb,now(),now()) RETURNING id,learner_name,student_user_id,teacher_user_id,scheduled_at,status,video_join_url,metadata",[id,student.full_name,req.user.full_name,student.id,req.user.id,taughtOn,TIMEZONE,JSON.stringify(metadata)]);
   await client.query('COMMIT');
   return reply(res,201,{ok:true,session:outward(q2.rows[0],'teacher'),historical_record:true,meet_created:false,payment_taken:false,no_email_sent:true});
  }catch{
   if(client)await client.query('ROLLBACK').catch(()=>{});
   return reply(res,503,{ok:false,error:'Previous lesson confirmation was not recorded.'});
  }finally{if(client)client.release();}
 });
 app.post('/api/v2150/private-energy/sessions',guard,managers,ready,async(req,res)=>{
  const body=req.body||{};
  const studentEmail=typeof body.student_email==='string'?body.student_email.trim().toLowerCase():'';
  const n=Number(body.lesson_number),start=body.starts_at?nowTime(body.starts_at):null,url=meetLink(body.meet_url);
  if(!EMAIL.test(studentEmail)||!Number.isInteger(n)||n<1||n>12||(body.starts_at&&!start)||url===false||(url&&!start))
   return reply(res,400,{ok:false,error:'Enter a verified student email, valid lesson number, start time, and optional Google Meet URL.'});
  if(n===1&&!start)return reply(res,400,{ok:false,error:'To record the earlier class, use a scheduled session date and mark it completed after verifying the record.'});
  let client;
  try{
   client=await services.persistentStore.pool.connect();
   await client.query('BEGIN');
   const q=await client.query("SELECT id,full_name,email,role,status FROM users WHERE lower(email)=$1 AND role='student' AND status='active' LIMIT 1",[studentEmail]);
   const student=q.rows[0];
   if(!student){await client.query('ROLLBACK');return reply(res,404,{ok:false,error:'No active student account was verified. Ask the learner to register and verify an EnglishLegalese student account.'});}
   if(req.user.role==='teacher'){
    const prev=await client.query("SELECT 1 FROM class_sessions WHERE student_user_id=$1 AND teacher_user_id=$2 AND status NOT IN ('cancelled') LIMIT 1",[student.id,req.user.id]);
    if(!prev.rows.length){await client.query('ROLLBACK');return reply(res,403,{ok:false,error:'Initial private course assignment requires owner authorization.'});}
   }
   await client.query('SELECT pg_advisory_xact_lock(hashtext($1))',[COURSE+':'+student.id+':'+String(n)]);
   const duplicates=await client.query("SELECT id FROM class_sessions WHERE student_user_id=$1 AND metadata->>'course_key'=$2 AND metadata->>'lesson_number'=$3 AND status<>'cancelled' LIMIT 1",[student.id,COURSE,String(n)]);
   if(duplicates.rows.length){await client.query('ROLLBACK');return reply(res,409,{ok:false,error:'An active class record already exists for this lesson. Update that session instead of creating a duplicate.'});}
   if(start){
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1))',[COURSE+':teacher-calendar:'+req.user.id]);
    const overlap=await client.query("SELECT 1 FROM class_sessions WHERE teacher_user_id=$1 AND status IN ('requested','scheduled') AND scheduled_at IS NOT NULL AND scheduled_at<$2::timestamptz+interval '60 minutes' AND scheduled_at+interval '60 minutes'>$2::timestamptz LIMIT 1",[req.user.id,start]);
    if(overlap.rows.length){await client.query('ROLLBACK');return reply(res,409,{ok:false,error:'An EnglishLegalese class overlaps. The new class was not created.'});}
   }
   const id='EL-ENERGY-'+crypto.randomUUID();
   const metadata={course_key:COURSE,lesson_number:n,duration_minutes:60,source_protection:'fictional_examples_only',recording:'disabled',provider_confirmation:url?'teacher_entered':'unconfirmed'};
   const status=start&&url?'scheduled':'requested';
   const result=await client.query("INSERT INTO class_sessions (id,learner_name,teacher_name,student_user_id,teacher_user_id,scheduled_at,timezone,video_provider,video_join_url,status,readiness_status,metadata,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,'Google Meet',$8,$9,$10,$11::jsonb,now(),now()) RETURNING id,learner_name,student_user_id,teacher_user_id,scheduled_at,status,video_join_url,metadata",[
     id,student.full_name,req.user.full_name,student.id,req.user.id,start,TIMEZONE,url,status,status==='scheduled'?'ready':'needs_meet',JSON.stringify(metadata)]);
   await client.query('COMMIT');
   return reply(res,201,{ok:true,session:outward(result.rows[0],'teacher'),no_email_sent:true});
  }catch{
   if(client)await client.query('ROLLBACK').catch(()=>{});
   return reply(res,503,{ok:false,error:'Private class record was not created; no email was sent.'});
  }finally{if(client)client.release();}
 });
 app.post('/api/v2150/private-energy/sessions/:id/attach-meet',guard,managers,ready,async(req,res)=>{
  const url=meetLink(req.body?.meet_url),start=nowTime(req.body?.starts_at);
  if(!url||!start)return reply(res,400,{ok:false,error:'A valid Google Meet URL and future scheduled time are required.'});
  try{
   const prior=await accessible(req,req.params.id);
   if(!prior||prior.teacher_user_id!==req.user.id)return reply(res,404,{ok:false,error:'Assigned teacher classroom not found.'});
   if(prior.status==='completed'||prior.status==='cancelled')return reply(res,409,{ok:false,error:'Completed/cancelled classes cannot be reactivated.'});
   if(prior.metadata?.provider_confirmation==='google_calendar_created')return reply(res,409,{ok:false,error:'Calendar-managed meeting time cannot be changed here; reschedule via the calendar integration.'});
   if(await internalConflicts(req.user.id,start,prior.id))return reply(res,409,{ok:false,error:'An EnglishLegalese class overlaps. No meeting link was attached.'});
   const rows=await services.query("UPDATE class_sessions SET scheduled_at=$3,video_join_url=$4,status='scheduled',readiness_status='ready',metadata=jsonb_set(coalesce(metadata,'{}'::jsonb),'{provider_confirmation}',to_jsonb('teacher_entered'::text),true),updated_at=now() WHERE id=$1 AND teacher_user_id=$2 AND metadata->>'course_key'=$5 AND status NOT IN ('completed','cancelled') RETURNING id,learner_name,student_user_id,teacher_user_id,scheduled_at,status,video_join_url,metadata",[prior.id,req.user.id,start,url,COURSE]);
   return rows.rows.length?reply(res,200,{ok:true,session:outward(rows.rows[0],'teacher'),no_email_sent:true}):reply(res,404,{ok:false,error:'Session unavailable.'});
  }catch{return reply(res,503,{ok:false,error:'Meeting link could not be attached.'});}
 });
 app.post('/api/v2150/private-energy/sessions/:id/create-meet',guard,managers,ready,async(req,res)=>{
  if(!configured().google_calendar)return reply(res,503,{ok:false,error:'EnglishLegalese Google Calendar integration is not configured. A teacher may instead attach an existing Google Meet link.'});
  let claimed=false;
  try{
   const prior=await accessible(req,req.params.id);
   if(!prior||prior.teacher_user_id!==req.user.id)return reply(res,404,{ok:false,error:'Assigned teacher classroom not found.'});
   if(!prior.scheduled_at||prior.status==='completed'||prior.status==='cancelled'||prior.video_join_url)
    return reply(res,409,{ok:false,error:'A dated, link-free, active class is required to create a Google Meet.'});
   if(await internalConflicts(req.user.id,prior.scheduled_at,prior.id))return reply(res,409,{ok:false,error:'An EnglishLegalese class overlaps. Google Meet was not created.'});
   const claim=await services.query("UPDATE class_sessions SET readiness_status='generating_meet',updated_at=now() WHERE id=$1 AND teacher_user_id=$2 AND metadata->>'course_key'=$3 AND video_join_url IS NULL AND scheduled_at IS NOT NULL AND status='requested' AND readiness_status='needs_meet' RETURNING id",[prior.id,req.user.id,COURSE]);
   if(claim.rows.length!==1)return reply(res,409,{ok:false,error:'A meeting may already be in preparation. Refresh the class record before retrying.'});
   claimed=true;
   const start=new Date(prior.scheduled_at).toISOString();
   const end=new Date(new Date(start).getTime()+3600000).toISOString();
   const result=await services.createCalendarVideoSession({video_provider:'Google Meet',
    title:'EnglishLegalese Private Contracts English Class',
    description:'Private 60-minute English-language education. No client-specific documents, names or confidential discussions in the calendar entry.',
    start_time:start,end_time:end,timezone:TIMEZONE,attendees:[]});
   const url=meetLink(result?.join_url);
   if(!url||result?.video_status!=='google_meet_ready')throw Error('Provider did not return a verified Google Meet URL');
   const change=await services.query("UPDATE class_sessions SET video_join_url=$3,calendar_provider='Google Calendar',calendar_event_id=$4,video_room_id=$5,status='scheduled',readiness_status='ready',metadata=jsonb_set(coalesce(metadata,'{}'::jsonb),'{provider_confirmation}',to_jsonb('google_calendar_created'::text),true),updated_at=now() WHERE id=$1 AND teacher_user_id=$2 AND readiness_status='generating_meet' AND video_join_url IS NULL RETURNING id,learner_name,student_user_id,teacher_user_id,scheduled_at,status,video_join_url,metadata",[prior.id,req.user.id,url,result.provider_event_id||null,result.provider_room_id||null]);
   if(change.rows.length!==1)throw Error('Provider link could not be committed');
   return reply(res,200,{ok:true,session:outward(change.rows[0],'teacher'),calendar_event_created:true,no_attendees_emailed:true});
  }catch{
   if(claimed)await services.query("UPDATE class_sessions SET readiness_status='needs_meet',updated_at=now() WHERE id=$1 AND teacher_user_id=$2 AND readiness_status='generating_meet'",[req.params.id,req.user.id]).catch(()=>{});
   return reply(res,503,{ok:false,error:'Google Meet creation or durable save was not verified. Inspect Calendar before retrying to avoid duplicate events.'});
  }
 });
 // HF58: no policy guessing, automatic credits, charges, event changes, or email.
 app.post('/api/v2150/private-energy/sessions/:id/change-request',guard,ready,async(req,res)=>{
  if(req.user.role!=='student')return reply(res,403,{ok:false,error:'Only the assigned student can request a change.'});
  const kind=req.body?.kind;
  const proposed=kind==='reschedule'?nowTime(req.body?.proposed_at):null;
  if(!['cancel','reschedule'].includes(kind)||(kind==='reschedule'&&!proposed))
   return reply(res,400,{ok:false,error:'Choose cancellation or a valid future replacement class time.'});
  try{
   const prior=await accessible(req,req.params.id);
   if(!prior||prior.student_user_id!==req.user.id)return reply(res,404,{ok:false,error:'No assigned private class was found.'});
   if(!['requested','scheduled'].includes(prior.status)||!prior.scheduled_at||new Date(prior.scheduled_at).getTime()<=Date.now())
    return reply(res,409,{ok:false,error:'Only upcoming assigned classes can be changed online. Contact the teacher for anything else.'});
   if(['pending','coordination_required'].includes(changeSummary(prior.metadata)?.status))
    return reply(res,409,{ok:false,error:'Your previous request is still under review or manual coordination. The original appointment remains until confirmed.'});
   if(kind==='reschedule'&&Math.abs(new Date(prior.scheduled_at).getTime()-new Date(proposed).getTime())<60000)
    return reply(res,400,{ok:false,error:'Choose a different class time.'});
   const request={kind,status:'pending',requested_at:new Date().toISOString(),proposed_at:proposed,policy_decision:'unassessed'};
   const updated=await services.query(
    "UPDATE class_sessions SET metadata=jsonb_set(coalesce(metadata,'{}'::jsonb),'{student_change_request}',$3::jsonb,true),updated_at=now() WHERE id=$1 AND student_user_id=$2 AND metadata->>'course_key'=$4 AND status IN ('requested','scheduled') AND scheduled_at>now() AND (metadata->'student_change_request' IS NULL OR metadata->'student_change_request'->>'status'<>'pending') RETURNING id,learner_name,student_user_id,teacher_user_id,scheduled_at,status,video_join_url,metadata",
    [prior.id,req.user.id,JSON.stringify(request),COURSE]);
   if(updated.rows.length!==1)return reply(res,409,{ok:false,error:'The class or request changed. Refresh before retrying.'});
   return reply(res,202,{ok:true,request:changeSummary(updated.rows[0].metadata),teacher_review_required:true,
    calendar_event_changed:false,charge_applied:false,credit_decided:false,
    message:'Request saved for teacher review. Your original appointment remains until confirmed. No charge was made.'});
  }catch{return reply(res,503,{ok:false,error:'Class change request was not confirmed. No charge or calendar change was made.'});}
 });

 // HF59 teacher decision queue. An acceptance for coordination is NOT a completed
 // reschedule/cancellation. Never mutate the meeting, fees, credits, provider or
 // booking time from this endpoint. Decisions require an assigned real teacher.
 app.post('/api/v2150/private-energy/sessions/:id/review-change',guard,managers,ready,async(req,res)=>{
  const decision=req.body?.decision;
  const reason=req.body?.reason;
  if(!['decline','coordinate'].includes(decision)||!['schedule_conflict','manual_coordination','insufficient_information','other'].includes(reason))
   return reply(res,400,{ok:false,error:'Choose a teacher decision and a standard, non-confidential reason.'});
  try{
   const prior=await accessible(req,req.params.id);
   if(!prior||prior.teacher_user_id!==req.user.id)return reply(res,404,{ok:false,error:'Assigned teacher classroom not found.'});
   if(!['requested','scheduled'].includes(prior.status))
    return reply(res,409,{ok:false,error:'Only an active class request can be reviewed.'});
   const pending=changeSummary(prior.metadata);
   if(!pending||pending.status!=='pending'||!pending.requested_at)
    return reply(res,409,{ok:false,error:'This request is no longer pending. Refresh before deciding.'});
   const status=decision==='decline'?'declined':'coordination_required';
   const reviewedAt=new Date().toISOString();
   const next={...prior.metadata.student_change_request,status,reviewed_at:reviewedAt,review_reason:reason};
   const log={kind:pending.kind,requested_at:pending.requested_at,decision:status,
    reviewed_at:reviewedAt,reviewer_id:req.user.id,reason,booking_changed:false,
    calendar_event_changed:false,credit_decided:false,charge_applied:false};
   const updated=await services.query(
    "UPDATE class_sessions SET metadata=jsonb_set(jsonb_set(coalesce(metadata,'{}'::jsonb),'{student_change_request}',$4::jsonb,true),'{student_change_review_history}',(CASE WHEN jsonb_typeof(metadata->'student_change_review_history')='array' THEN metadata->'student_change_review_history' ELSE '[]'::jsonb END)||jsonb_build_array($5::jsonb),true),updated_at=now() WHERE id=$1 AND teacher_user_id=$2 AND metadata->>'course_key'=$3 AND status IN ('requested','scheduled') AND metadata->'student_change_request'->>'status'='pending' AND metadata->'student_change_request'->>'requested_at'=$6 RETURNING id,learner_name,student_user_id,teacher_user_id,scheduled_at,status,video_join_url,metadata",
    [prior.id,req.user.id,COURSE,JSON.stringify(next),JSON.stringify(log),pending.requested_at]);
   if(updated.rows.length!==1)return reply(res,409,{ok:false,error:'Another decision changed this request. Refresh the class record.'});
   return reply(res,200,{ok:true,request:changeSummary(updated.rows[0].metadata),
    original_appointment_unchanged:true,calendar_event_changed:false,
    charge_applied:false,credit_decided:false,transactional_email_sent:false,
    teacher_followup_required:decision==='coordinate',
    message:decision==='coordinate'
     ?'Marked for manual coordination only. Original class and Meet remain unchanged until separately confirmed.'
     :'Request declined. Original class and Meet remain unchanged. Inform the student through an approved channel.'});
  }catch{return reply(res,503,{ok:false,error:'The teacher decision could not be saved. No appointment, charge or calendar change was made.'});}
 });
 // Teacher-visible overlap check covers EnglishLegalese records, not all Google calendars.
 async function internalConflicts(teacherId,start,excludeId){
  const matches=await services.query(
   "SELECT 1 FROM class_sessions WHERE teacher_user_id=$1 AND status IN ('requested','scheduled') AND scheduled_at IS NOT NULL AND scheduled_at<$2::timestamptz+interval '60 minutes' AND scheduled_at+interval '60 minutes'>$2::timestamptz AND id<>$3 LIMIT 1",
   [teacherId,start,excludeId||'']);
  return matches.rows.length>0;
 }
 app.get('/api/v2150/private-energy/teacher-conflicts',guard,managers,ready,async(req,res)=>{
  const start=nowTime(req.query.starts_at);
  if(!start)return reply(res,400,{ok:false,error:'A valid future class time is required.'});
  try{
   const overlap=await internalConflicts(req.user.id,start,null);
   return reply(res,200,{ok:true,internal_conflict:overlap,google_calendars_checked:false,full_conflict_clearance:false,
    notice:overlap?'An EnglishLegalese class already overlaps. Choose another time.':'No EnglishLegalese conflict found; check all Google calendars separately.'});
  }catch{return reply(res,503,{ok:false,error:'Internal schedule could not be checked. Do not confirm an appointment.'});}
 });
 app.post('/api/v2150/private-energy/sessions/:id/complete',guard,managers,ready,async(req,res)=>{
  try{
   const prior=await accessible(req,req.params.id);
   if(!prior||prior.teacher_user_id!==req.user.id)return reply(res,404,{ok:false,error:'Assigned teacher classroom not found.'});
   if(prior.status!=='scheduled')return reply(res,409,{ok:false,error:'Only scheduled classes can be marked complete by their teacher.'});
   if(req.body?.confirmed_taught!==true)return reply(res,400,{ok:false,error:'Explicit teacher confirmation of an actually taught class is required.'});
   if(!prior.scheduled_at||new Date(prior.scheduled_at).getTime()+3600000>Date.now())
    return reply(res,409,{ok:false,error:'A class cannot be marked taught before its scheduled 60 minutes have elapsed.'});
   const completed=await services.query("UPDATE class_sessions SET status='completed',closeout_status='teacher_confirmed',updated_at=now() WHERE id=$1 AND teacher_user_id=$2 AND metadata->>'course_key'=$3 AND status='scheduled' AND scheduled_at+interval '60 minutes'<=now() RETURNING id,learner_name,student_user_id,teacher_user_id,scheduled_at,status,video_join_url,metadata",[prior.id,req.user.id,COURSE]);
   return completed.rows.length?reply(res,200,{ok:true,session:outward(completed.rows[0],'teacher'),assessment_recorded:false}):reply(res,409,{ok:false,error:'Class status changed; refresh.'});
  }catch{return reply(res,503,{ok:false,error:'Class completion was not recorded.'});}
 });
}
module.exports={install,COURSE,lessons,AGENDA,meetLink,nowTime,pastTime,outward,withinClassWindow};
