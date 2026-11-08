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
 if(typeof value!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d)?(?:Z|[+-]\d\d:\d\d)$/.test(value))return null;
 const t=new Date(value).getTime();
 if(!Number.isFinite(t)||t<Date.now()-15*60000||t>Date.now()+180*86400000)return null;
 return new Date(t).toISOString();
}
function meetLink(input){
 if(input==null||input==='')return null;
 if(typeof input!=='string')return false;
 const value=input.trim().replace(/\/$/,'');
 return MEET.test(value)?value:false;
}
function outward(row,role){
 return{
  id:row.id,lesson_number:Number(row.metadata?.lesson_number),
  lesson_title:lessons[Number(row.metadata?.lesson_number)-1]?.title||'Private class',
  starts_at:row.scheduled_at,status:row.status,
  duration_minutes:60,timezone:TIMEZONE,
  meet_ready:row.status==='scheduled'&&MEET.test(String(row.video_join_url||'')),
  meet_url:row.status==='scheduled'&&MEET.test(String(row.video_join_url||''))?row.video_join_url:null,
  student_name:role==='teacher'?row.learner_name:undefined,
  provider:'Google Meet',recording:'Off by default; any recording requires separate consent.',
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
 const managers=requireRoles('teacher','owner','admin');
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
 app.post('/api/v2150/private-energy/sessions/:id/complete',guard,managers,ready,async(req,res)=>{
  try{
   const prior=await accessible(req,req.params.id);
   if(!prior||prior.teacher_user_id!==req.user.id)return reply(res,404,{ok:false,error:'Assigned teacher classroom not found.'});
   if(prior.status!=='scheduled')return reply(res,409,{ok:false,error:'Only scheduled classes can be marked complete by their teacher.'});
   const completed=await services.query("UPDATE class_sessions SET status='completed',closeout_status='teacher_confirmed',updated_at=now() WHERE id=$1 AND teacher_user_id=$2 AND metadata->>'course_key'=$3 AND status='scheduled' RETURNING id,learner_name,student_user_id,teacher_user_id,scheduled_at,status,video_join_url,metadata",[prior.id,req.user.id,COURSE]);
   return completed.rows.length?reply(res,200,{ok:true,session:outward(completed.rows[0],'teacher'),assessment_recorded:false}):reply(res,409,{ok:false,error:'Class status changed; refresh.'});
  }catch{return reply(res,503,{ok:false,error:'Class completion was not recorded.'});}
 });
}
module.exports={install,COURSE,lessons,AGENDA,meetLink,nowTime,outward};
