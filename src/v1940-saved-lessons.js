'use strict';
/* HF13 — account-owned durable lessons, safe optimistic updates, teacher-linked submissions.
   Never send emails or notifications, activate payment or use development JSON in production. HF14 supports student-only registration without email verification. */
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
  return auth(req,res,next);
 };
 const privateCache=(_req,res,next)=>{res.set('Cache-Control','no-store');res.set('X-Content-Type-Options','nosniff');next()};
 const connected=async()=>{
  if(store.mode()!=='postgres'||!store.pool||!configured().auth_secret)return false;
  try{const q=await store.pool.query("select to_regclass('public.self_paced_lesson_work') is not null as work, to_regclass('public.self_paced_lesson_submissions') is not null as submits, to_regclass('public.users') is not null as users, to_regclass('public.password_credentials') is not null as creds, to_regclass('public.user_sessions') is not null as sessions");return!!(q.rows[0]?.work&&q.rows[0]?.submits&&q.rows[0]?.users&&q.rows[0]?.creds&&q.rows[0]?.sessions);}
  catch{return false;}
 };
 async function ready(req,res,next){if(!await connected())return res.status(503).json({ok:false,error:'Secure cloud saving requires a verified PostgreSQL connection, active account security and an applied migration.'});next()}
 app.use('/api/v1940/',privateCache);
 app.post('/api/v1940/student/auth/register',authAbuse.registration,ready,async(req,res)=>{
  /* Registration does not require, test, configure, or deliver emails.
     Email is an unverified sign-in identifier only; it confers no teacher or employer identity. */
  const email=String(req.body?.email||'').trim().toLowerCase();
  const name=String(req.body?.full_name||'').trim();
  const password=String(req.body?.password||'');
  if(req.body?.role&&req.body.role!=='student')return res.status(403).json({ok:false,error:'Only student accounts can register here.'});
  if(!/^[^\\s@]{1,64}@[^\\s@]{1,190}\\.[a-z]{2,40}$/i.test(email)||email.length>254||name.length<2||name.length>160||password.length<12||password.length>128)
    return res.status(400).json({ok:false,error:'Use a valid email, a full name (2–160 characters), and a password of 12–128 characters.'});
  try{
   const account=await services.registerUser({email,password,full_name:name,role:'student'},req);
   return res.status(201).json({ok:true,token:account.token,user:account.user,email_verified:false,no_email_sent:true,password_reset_by_email_available:false});
  }catch(e){
   const exists=/already registered/i.test(String(e.message||''));return res.status(exists?409:400).json({ok:false,error:exists?'That sign-in email is already in use.':'Could not create this account. Please check your details.'});
  }
 });
 app.post('/api/v1940/student/auth/login',authAbuse.login,ready,async(req,res)=>{
  try{
   const account=await services.loginUser({email:req.body?.email,password:req.body?.password},req);
   if(account.user?.role!=='student')return res.status(403).json({ok:false,error:'Use a student account to access saved lessons.'});
   return res.json({ok:true,token:account.token,user:account.user,no_email_sent:true});
  }catch{return res.status(401).json({ok:false,error:'Invalid sign-in details.'});}
 });
 app.post('/api/v1940/teacher/auth/login',authAbuse.login,ready,async(req,res)=>{
  try{
   const account=await services.loginUser({email:req.body?.email,password:req.body?.password},req);
   if(account.user?.role!=='teacher')return res.status(403).json({ok:false,error:'An approved teacher account is required.'});
   return res.json({ok:true,token:account.token,user:account.user,no_email_sent:true});
  }catch{return res.status(401).json({ok:false,error:'Invalid sign-in details.'});}
 });
 app.get('/api/v1940/lessons/capabilities',async(req,res)=>{
  const available=await connected();
  const registration=available;
  res.json({ok:true,account_saving_available:available,account_registration_available:registration,requires_login:true,no_outbound_email:true,teacher_delivery_requires_linked_teacher:true,device_drafts_optional:true});
 });
 app.get('/api/v1940/lessons',ready,strict,async(req,res)=>{
  try{const q=await store.pool.query('select lesson_key,lesson_title,origin_path,status,revision,updated_at,submitted_at from self_paced_lesson_work where user_id=$1 order by updated_at desc limit 100',[req.user.id]);res.json({ok:true,lessons:q.rows});}
  catch{return res.status(503).json({ok:false,error:'Could not load saved lessons.'});}
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
