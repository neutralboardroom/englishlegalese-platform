'use strict';
/* HF13 — account-owned durable lessons, safe optimistic updates, teacher-linked submissions.
   HF15 permits only explicit, verified transactional account email; no marketing or speculative class notifications. Never activate payments or use development JSON in production. */
const KEY=/^(?:workbook:[a-z0-9-]{3,65}|page:[a-z0-9-]{3,100})$/;
const PATH=/^\/learn\/[a-z0-9/-]{2,150}\/?$/;
const LIMIT=65536;
function validate(input){
 const key=String(input.key||''),title=String(input.title||'').trim().slice(0,150),path=String(input.path||'');
 const answers=input.answers;
 if(!KEY.test(key)||!title||!PATH.test(path)||path.includes('//'))return{error:'Invalid lesson title, path or identifier.'};
 if(!answers||typeof answers!=='object'||Array.isArray(answers))return{error:'Invalid response fields.'};
 if(!Number.isSafeInteger(input.expected_revision)||input.expected_revision<0)return{error:'Expected revision must be a nonnegative integer.'};
 let json;try{json=JSON.stringify(answers)}catch{return{error:'Response fields could not be serialized.'}}
 if(Buffer.byteLength(json,'utf8')>LIMIT)return{error:'Saved answers exceed the 64 KB per-lesson limit. Export a backup first.'};
 return{key,title,path,json,revision:input.expected_revision};
}
function install(app,{store,services,authMiddleware,requireRoles,configured,authAbuse}){
 const auth=authMiddleware(services);
 const strict=(req,res,next)=>{
  const bearer=req.get('authorization')||'';
  if(!/^Bearer [^\s]+$/.test(bearer))return res.status(401).json({ok:false,error:'Sign in to save securely.'});
  return auth(req,res,async()=>{
   // All private lesson and teacher-review requests require revocable, stored sessions.
   // Legacy register-issued tokens have no database session and cannot access private work.
   if(!req.authSessionKey)return res.status(401).json({ok:false,error:'Sign in again to enable secure session-backed saving.'});
   // Enforce verified email identity at the actual private lesson data boundary too.
   if(req.user?.role==='student'){
    try{if(!await identity.verified(req.user.id))return res.status(403).json({ok:false,verification_required:true,error:'Verify your student email before accessing cloud lessons.'});}
    catch{return res.status(503).json({ok:false,error:'Account verification could not be confirmed.'});}
   }
   next();
  });
 };
 const privateCache=(_req,res,next)=>{res.set('Cache-Control','no-store');res.set('X-Content-Type-Options','nosniff');next()};
 const connected=async()=>{
  if(store.mode()!=='postgres'||!store.pool||!configured().auth_secret)return false;
  try{const q=await store.pool.query("select to_regclass('public.self_paced_lesson_work') is not null as work, to_regclass('public.self_paced_lesson_submissions') is not null as submits, to_regclass('public.users') is not null as users, to_regclass('public.password_credentials') is not null as creds, to_regclass('public.user_sessions') is not null as sessions");return!!(q.rows[0]?.work&&q.rows[0]?.submits&&q.rows[0]?.users&&q.rows[0]?.creds&&q.rows[0]?.sessions);}
  catch{return false;}
 };
 async function ready(req,res,next){if(!await connected())return res.status(503).json({ok:false,error:'Secure cloud saving requires a verified PostgreSQL connection, active account security and an applied migration.'});next()}
 app.use('/api/v1940/',privateCache);
 const identity=require('./v1950-student-account-identity').install(app,{store,services,authAbuse});
 app.post('/api/v1940/student/auth/login',authAbuse.login,ready,async(req,res)=>{
  try{
   const account=await services.loginUser({email:req.body?.email,password:req.body?.password,expected_role:'student',require_verified_student:true},req);
   if(account.user?.role!=='student')return res.status(403).json({ok:false,error:'Use a student account to access saved lessons.'});
   if(!await identity.verified(account.user.id))return res.status(403).json({ok:false,verification_required:true,error:'Please verify your email address before signing in. Use resend verification if needed.'});
   return res.json({ok:true,token:account.token,user:account.user,email_verified:true});
  }catch(e){return /Email verification required/.test(String(e?.message||''))?res.status(403).json({ok:false,verification_required:true,error:'Please verify your email address before signing in. Use resend verification if needed.'}):res.status(401).json({ok:false,error:'Invalid sign-in details.'});}
 });
 app.post('/api/v1940/teacher/auth/login',authAbuse.login,ready,async(req,res)=>{
  try{
   const account=await services.loginUser({email:req.body?.email,password:req.body?.password,expected_role:'teacher'},req);
   if(account.user?.role!=='teacher')return res.status(403).json({ok:false,error:'An approved teacher account is required.'});
   return res.json({ok:true,token:account.token,user:account.user,no_email_sent:true});
  }catch{return res.status(401).json({ok:false,error:'Invalid sign-in details.'});}
 });
 const logout=async(req,res)=>{
  try{
   const q=await store.pool.query("UPDATE user_sessions SET revoked_at=now() WHERE user_id=$1 AND token_preview=$2 AND revoked_at IS NULL RETURNING id",[req.user.id,req.authSessionKey]);
   return res.json({ok:true,signed_out:true,session_revoked:q.rows.length>0});
  }catch{return res.status(503).json({ok:false,error:'Server logout could not be confirmed. Clear your local session and try again.'});}
 };
 app.post('/api/v1940/student/auth/logout',ready,strict,requireRoles('student'),logout);
 app.post('/api/v1940/teacher/auth/logout',ready,strict,requireRoles('teacher'),logout);
 // Student and teacher account security control. An all-device signout rotates
 // the session version AND revokes all persisted sessions atomically.
 // It does not erase homework, saved lessons or teacher reviews.
 const logoutEverywhere=async(req,res)=>{
  const client=await store.pool.connect();
  try{
   await client.query('BEGIN');
   const account=await client.query("SELECT role,status FROM users WHERE id=$1 FOR UPDATE",[req.user.id]);
   if(account.rows[0]?.status!=='active'||account.rows[0]?.role!==req.user.role)throw Error('Account unavailable');
   const nonce=require('node:crypto').randomBytes(24).toString('hex');
   await client.query("UPDATE users SET metadata=jsonb_set(coalesce(metadata,'{}'::jsonb),'{session_version}',to_jsonb($2::text),true),updated_at=now() WHERE id=$1",[req.user.id,nonce]);
   await client.query("UPDATE user_sessions SET revoked_at=now() WHERE user_id=$1 AND revoked_at IS NULL",[req.user.id]);
   await client.query('COMMIT');
   return res.json({ok:true,signed_out_everywhere:true,lessons_preserved:true});
  }catch{
   await client.query('ROLLBACK').catch(()=>{});
   return res.status(503).json({ok:false,error:'All-device sign out could not be confirmed. Your local session can still be cleared.'});
  }finally{client.release();}
 };
 app.post('/api/v1940/student/auth/logout-everywhere',ready,strict,requireRoles('student'),logoutEverywhere);
 app.post('/api/v1940/teacher/auth/logout-everywhere',ready,strict,requireRoles('teacher'),logoutEverywhere);
 app.get('/api/v1940/lessons/capabilities',async(req,res)=>{
  const available=await connected();
  const registration=available&&await identity.ready();
  res.json({ok:true,account_saving_available:available,account_registration_available:registration,requires_login:true,verified_email_required:true,transactional_email_available:registration,marketing_email_enabled:false,teacher_delivery_requires_linked_teacher:true,device_drafts_optional:true});
 });
 // Student-initiated, authenticated FULL cloud backup. Never email or sync its content.
 // Explicitly refuse oversized accounts instead of silently returning incomplete exports.
 app.get('/api/v1940/account/export',ready,strict,requireRoles('student'),async(req,res)=>{
  try{
   const [work,submissions]=await Promise.all([
    store.pool.query('SELECT lesson_key,lesson_title,origin_path,answers,status,revision,updated_at,submitted_at FROM self_paced_lesson_work WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 201',[req.user.id]),
    store.pool.query('SELECT id,lesson_key,lesson_title,revision,answers,review_status,created_at,teacher_feedback,reviewed_at FROM self_paced_lesson_submissions WHERE user_id=$1 ORDER BY created_at DESC LIMIT 201',[req.user.id])
   ]);
   if(work.rows.length>200||submissions.rows.length>200){
    return res.status(413).json({ok:false,code:'ACCOUNT_BACKUP_LIMIT',error:'This account has more than 200 saved lessons or submissions. A complete one-file backup is unavailable; use lesson-by-lesson exports. No partial backup was produced.'});
   }
   const payload={ok:true,format:'EnglishLegalese student cloud backup',schema_version:1,exported_at:new Date().toISOString(),complete:true,
    saved_lessons:work.rows,submissions:submissions.rows,privacy:'Private export requested by the signed-in student. Store this file securely. It may contain lesson responses and teacher feedback. No email is sent.'};
   if(Buffer.byteLength(JSON.stringify(payload),'utf8')>8*1024*1024){
    return res.status(413).json({ok:false,code:'ACCOUNT_BACKUP_TOO_LARGE',error:'Your complete backup exceeds 8 MB. No partial backup was produced. Export lessons individually.'});
   }
   res.set('Cache-Control','no-store, private');
   res.set('X-Content-Type-Options','nosniff');
   return res.json(payload);
  }catch{return res.status(503).json({ok:false,error:'Your account backup could not be created. Your cloud work remains unchanged. Try again later.'});}
 });
 // HF18: paginate *private metadata only*, keeping the established account and
 // revocable-session protections. Every page remains scoped to the signed-in user.
 app.get('/api/v1940/lessons',ready,strict,async(req,res)=>{
  const raw=req.query?.offset;
  if(raw!==undefined&&(typeof raw!=='string'||!/^(0|[1-9]\d{0,4})$/.test(raw)||Number(raw)>10000))
   return res.status(400).json({ok:false,error:'Invalid saved-lesson page offset.'});
  const offset=raw===undefined?0:Number(raw);
  try{
   const q=await store.pool.query(
    'select lesson_key,lesson_title,origin_path,status,revision,updated_at,submitted_at from self_paced_lesson_work where user_id=$1 order by updated_at desc,lesson_key asc limit 101 offset $2',
    [req.user.id,offset]
   );
   const more=q.rows.length>100;
   return res.json({ok:true,lessons:q.rows.slice(0,100),has_more:more,next_offset:more?offset+100:null});
  }catch{return res.status(503).json({ok:false,error:'Could not load saved lessons.'});}
 });
 app.get('/api/v1940/lessons/:key',ready,strict,async(req,res)=>{
  if(!KEY.test(req.params.key))return res.status(400).json({ok:false,error:'Invalid lesson key.'});
  try{const q=await store.pool.query('select lesson_key,lesson_title,origin_path,answers,status,revision,updated_at,submitted_at from self_paced_lesson_work where user_id=$1 and lesson_key=$2',[req.user.id,req.params.key]);return q.rows.length?res.json({ok:true,lesson:q.rows[0]}):res.status(404).json({ok:false,error:'No existing save.'});}
  catch{return res.status(503).json({ok:false,error:'Could not load lesson.'});}
 });
 app.put('/api/v1940/lessons/:key',ready,strict,requireRoles('student'),async(req,res)=>{
  const value=validate({...req.body,key:req.params.key});if(value.error)return res.status(400).json({ok:false,error:value.error});
  try{
   const sql=[
    'insert into self_paced_lesson_work(user_id,lesson_key,lesson_title,origin_path,answers,revision)',
    'select $1,$2,$3,$4,$5::jsonb,1 where $6=0',
    'on conflict(user_id,lesson_key) do update set lesson_title=excluded.lesson_title,',
    "origin_path=excluded.origin_path,answers=excluded.answers,status='draft',submitted_at=null,",
    'revision=self_paced_lesson_work.revision+1,updated_at=now()',
    'where self_paced_lesson_work.revision=$6 returning revision,status,updated_at'
   ].join(' ');
   const q=await store.pool.query(sql,[req.user.id,value.key,value.title,value.path,value.json,value.revision]);
   return q.rows.length?res.json({ok:true,saved:true,...q.rows[0]}):res.status(409).json({ok:false,conflict:true,error:'Another tab or device changed this lesson. Reload the latest save before editing.'});
  }catch{return res.status(503).json({ok:false,error:'The cloud save failed; keep your work open and export a backup.'});}
 });
 app.post('/api/v1940/lessons/:key/submit',ready,strict,requireRoles('student'),async(req,res)=>{
  if(!KEY.test(req.params.key)||!Number.isSafeInteger(req.body?.expected_revision)||req.body.expected_revision<1)return res.status(400).json({ok:false,error:'Invalid lesson revision.'});
  const db=await store.pool.connect();
  try{
   await db.query('begin');
   const q=await db.query('select * from self_paced_lesson_work where user_id=$1 and lesson_key=$2 for update',[req.user.id,req.params.key]);
   const work=q.rows[0];
   if(!work||work.revision!==req.body.expected_revision||work.status!=='draft'){await db.query('rollback');return res.status(409).json({ok:false,error:'Save the current draft or reload before submitting again.'});}
   const teachers=await db.query([
    'select cs.teacher_user_id from class_sessions cs join users t on t.id=cs.teacher_user_id',
    "where cs.student_user_id=$1 and cs.teacher_user_id is not null and t.role='teacher'",
    "and cs.status in ('scheduled','confirmed','in_progress','completed') order by cs.updated_at desc limit 1"
   ].join(' '),[req.user.id]);
   const teacher=teachers.rows[0]?.teacher_user_id||null;
   const submit=await db.query([
    'insert into self_paced_lesson_submissions(user_id,lesson_key,lesson_title,revision,answers,assigned_teacher_user_id,review_status)',
    'values($1,$2,$3,$4,$5::jsonb,$6,$7) returning id,created_at,review_status'
   ].join(' '),[req.user.id,work.lesson_key,work.lesson_title,work.revision,JSON.stringify(work.answers),teacher,teacher?'awaiting_review':'pending_assignment']);
   await db.query("update self_paced_lesson_work set status='submitted',updated_at=now(),submitted_at=now() where user_id=$1 and lesson_key=$2",[req.user.id,req.params.key]);
   await db.query('commit');
   return res.status(201).json({ok:true,submitted:true,submission:submit.rows[0],teacher_delivery_confirmed:Boolean(teacher),no_email_sent:true});
  }catch{await db.query('rollback').catch(()=>{});return res.status(503).json({ok:false,error:'Submission was not recorded; the draft remains saved.'});}
  finally{db.release();}
 });
 app.get('/api/v1940/lessons/:key/submissions',ready,strict,requireRoles('student'),async(req,res)=>{
  if(!KEY.test(req.params.key))return res.status(400).json({ok:false,error:'Invalid lesson key.'});
  try{
   const q=await store.pool.query('select id,revision,created_at,review_status,teacher_feedback,reviewed_at from self_paced_lesson_submissions where user_id=$1 and lesson_key=$2 order by created_at desc limit 20',[req.user.id,req.params.key]);
   res.json({ok:true,submissions:q.rows});
  }catch{return res.status(503).json({ok:false,error:'Submission history is unavailable.'});}
 });
 app.get('/api/v1940/teacher/submissions',ready,strict,requireRoles('teacher'),async(req,res)=>{
  try{const q=await store.pool.query('select id,lesson_key,lesson_title,created_at,review_status from self_paced_lesson_submissions where assigned_teacher_user_id=$1 order by created_at desc limit 100',[req.user.id]);res.json({ok:true,submissions:q.rows});}
  catch{return res.status(503).json({ok:false,error:'Could not load teacher queue.'});}
 });
 app.get('/api/v1940/teacher/submissions/:id',ready,strict,requireRoles('teacher'),async(req,res)=>{
  if(!/^[1-9]\d{0,18}$/.test(req.params.id))return res.status(400).json({ok:false,error:'Invalid submission.'});
  try{const q=await store.pool.query('select id,lesson_key,lesson_title,answers,created_at,review_status,teacher_feedback,reviewed_at from self_paced_lesson_submissions where id=$1 and assigned_teacher_user_id=$2',[req.params.id,req.user.id]);return q.rows.length?res.json({ok:true,submission:q.rows[0]}):res.status(404).json({ok:false,error:'Submission unavailable.'});}
  catch{return res.status(503).json({ok:false,error:'Could not load submission.'});}
 });
 app.post('/api/v1940/teacher/submissions/:id/review',ready,strict,requireRoles('teacher'),async(req,res)=>{
  if(!/^[1-9]\d{0,18}$/.test(req.params.id))return res.status(400).json({ok:false,error:'Invalid submission.'});
  const feedback=String(req.body?.feedback||'').trim();
  if(feedback.length<20||feedback.length>5000)return res.status(400).json({ok:false,error:'Feedback must be 20–5000 characters.'});
  try{
   const q=await store.pool.query("update self_paced_lesson_submissions set teacher_feedback=$3,review_status='reviewed',reviewed_at=now() where id=$1 and assigned_teacher_user_id=$2 and review_status='awaiting_review' returning id,review_status,reviewed_at",[req.params.id,req.user.id,feedback]);
   return q.rows.length?res.json({ok:true,review:q.rows[0],no_email_sent:true}):res.status(404).json({ok:false,error:'Submission not assigned to this teacher or already reviewed.'});
  }catch{return res.status(503).json({ok:false,error:'Review was not recorded.'});}
 });
}
module.exports={install,validate,KEY,PATH,LIMIT};
