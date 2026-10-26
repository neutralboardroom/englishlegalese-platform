'use strict';
// HF15: legitimate event-triggered transactional identity emails only.
// Never issue marketing, bulk email, test sends or teacher-notification emails.
// No production database writes occur until this feature is deployed AND the separately approved migration exists.
const crypto=require('node:crypto');
const {resendConfigured}=require('./transactionalEmail');
const {passwordHash}=require('./productionServices');
const ROOT='https://englishlegalese.com/learn/my-work/';
const EMAIL=/^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,40}$/i;
const RAW=/^[a-f0-9]{64}$/;
const GENERIC='If this address is eligible, we will email instructions. Check your inbox and spam folder.';
function normal(email){return String(email||'').trim().toLowerCase();}
function hash(purpose,token){return crypto.createHash('sha256').update('EL-HF15:'+purpose+':'+token).digest('hex');}
function senderSafe(env=process.env){
 const from=String(env.RESEND_FROM_EMAIL||'');
 const addr=(from.match(/<([^<>]+)>\s*$/)||[])[1]||from.trim();
 return resendConfigured(env)&&addr.toLowerCase().endsWith('@mail.englishlegalese.com')&&String(env.SESSION_SECRET||env.JWT_SECRET||'').length>=32;
}
function mailText(purpose,token){
 const label=purpose==='verify'?'verify':'reset';
 const url=ROOT+'#'+label+'='+token;
 return purpose==='verify'
  ?'Confirm your EnglishLegalese student email address within 30 minutes:\n'+url+'\nIf you did not request an account, ignore this message.'
  :'Reset your EnglishLegalese password within 15 minutes:\n'+url+'\nIf you did not request this, ignore this message; your password has not changed.';
}
function install(app,{store,services,authAbuse,now=()=>Date.now()}){
 const cache=(_req,res,next)=>{res.set('Cache-Control','no-store');res.set('Referrer-Policy','no-referrer');next();};
 app.use('/api/v1940/student/auth/',cache);
 async function ready(){
  if(store.mode()!=='postgres'||!store.pool||!senderSafe())return false;
  try{
   const q=await store.pool.query("SELECT to_regclass('public.student_email_action_tokens') AS tokens,to_regclass('public.users') AS users,to_regclass('public.password_credentials') AS creds,to_regclass('public.ai_trial_email_verifications') AS trials,to_regclass('public.user_sessions') AS sessions");
   const v=q.rows[0];return Boolean(v?.tokens&&v?.users&&v?.creds&&v?.trials&&v?.sessions);
  }catch{return false;}
 }
 async function requireReady(req,res,next){if(!await ready())return res.status(503).json({ok:false,error:'Secure account verification is not available yet; no email was sent.'});next();}
 async function find(email){
  const q=await store.pool.query("SELECT id,email,role,status,metadata FROM users WHERE lower(email)=lower($1) AND status='active' LIMIT 1",[email]);
  return q.rows[0]||null;
 }
 async function verified(id){
  const q=await store.pool.query("SELECT (coalesce(u.metadata->>'email_verified','false')='true' OR EXISTS(SELECT 1 FROM ai_trial_email_verifications v WHERE v.user_id=u.id AND v.verified_at IS NOT NULL)) AS verified FROM users u WHERE u.id=$1 AND u.status='active'",[id]);
  return q.rows[0]?.verified===true;
 }
 async function issue(user,purpose,req){
  if(!user||user.role!=='student')return {issued:false};
  // Durable account-specific throttling across instances, plus IP middleware on request routes.
  const recent=await store.pool.query("SELECT count(*)::int AS n, max(created_at) AS latest FROM student_email_action_tokens WHERE user_id=$1 AND purpose=$2 AND created_at>now()-interval '1 hour'",[user.id,purpose]);
  const n=Number(recent.rows[0]?.n||0),last=recent.rows[0]?.latest;
  if(n>=3||(last&&now()-new Date(last).getTime()<60000))return {issued:false,throttled:true};
  const token=crypto.randomBytes(32).toString('hex');
  const ttl=purpose==='verify'?1800000:900000;
  const record=await store.pool.query("INSERT INTO student_email_action_tokens(user_id,purpose,token_hash,expires_at) VALUES($1,$2,$3,$4) RETURNING id",[user.id,purpose,hash(purpose,token),new Date(now()+ttl).toISOString()]);
  // Outbound delivery only on explicit registration, resend, or reset request.
  // ProductionServices records a provider message ID and delivery status without storing the secret link.
  try{
   const result=await services.sendEmail({to:user.email,subject:purpose==='verify'?'Verify your EnglishLegalese student email':'Reset your EnglishLegalese student password',text:mailText(purpose,token),template:'account_'+purpose},req);
   if(result.status!=='sent')throw Error('Delivery not acknowledged');
   await store.pool.query("UPDATE student_email_action_tokens SET provider_message_id=$2 WHERE id=$1",[record.rows[0].id,result.provider_message_id||null]);
   return {issued:true};
  }catch{return {issued:false,deliveryFailed:true};}
 }
 app.get('/api/v1940/student/auth/capabilities',async(_req,res)=>{
  const available=await ready();
  res.json({ok:true,registration_available:available,verification_available:available,password_reset_available:available,transactional_email_only:true,marketing_enabled:false});
 });
 app.post('/api/v1940/student/auth/register',authAbuse.registration,requireReady,async(req,res)=>{
  const email=normal(req.body?.email),full_name=String(req.body?.full_name||'').trim(),password=String(req.body?.password||'');
  if(req.body?.role&&req.body.role!=='student')return res.status(403).json({ok:false,error:'Student registration only.'});
  if(email.length>254||!EMAIL.test(email)||full_name.length<2||full_name.length>160||password.length<12||password.length>128)
   return res.status(400).json({ok:false,error:'Provide a valid email, full name (2–160 characters), and password (12–128 characters).'});
  try{
   let user=await find(email);
   if(!user){
    try{const account=await services.registerUser({email,password,full_name,role:'student'},req);user={id:account.user.id,email,role:'student'};}
    catch(e){if(!/already registered|duplicate key/i.test(String(e.message)))return res.status(503).json({ok:false,error:'Registration is currently unavailable.'});user=await find(email);}
   }
   // Do not re-register, reveal membership, issue session or send password guidance for an existing verified address.
   if(user&&!await verified(user.id)){
    const result=await issue(user,'verify',req);
    if(result.deliveryFailed)return res.status(503).json({ok:false,error:'Account saved, but verification delivery could not be confirmed. Use resend verification after a minute.'});
   }
   return res.status(202).json({ok:true,verification_required:true,message:'If this is a new or unverified account, check your email for a verification link. Sign in after verification.'});
  }catch{return res.status(503).json({ok:false,error:'Account creation is temporarily unavailable.'});}
 });
 app.post('/api/v1940/student/auth/resend-verification',authAbuse.registration,requireReady,async(req,res)=>{
  const email=normal(req.body?.email);if(!EMAIL.test(email)||email.length>254)return res.status(400).json({ok:false,error:'Enter a valid email address.'});
  try{const u=await find(email);if(u&&!await verified(u.id))await issue(u,'verify',req);}catch{}
  return res.status(202).json({ok:true,message:GENERIC});
 });
 app.post('/api/v1940/student/auth/verify',authAbuse.login,requireReady,async(req,res)=>{
  const token=req.body?.token;if(typeof token!=='string'||!RAW.test(token))return res.status(400).json({ok:false,error:'Invalid or expired link.'});
  const client=await store.pool.connect();
  try{
   await client.query('BEGIN');
   const t=await client.query("UPDATE student_email_action_tokens SET consumed_at=now() WHERE token_hash=$1 AND purpose='verify' AND consumed_at IS NULL AND expires_at>now() RETURNING user_id",[hash('verify',token)]);
   if(t.rows.length!==1){await client.query('ROLLBACK');return res.status(400).json({ok:false,error:'Invalid, expired or previously used verification link.'});}
   const id=t.rows[0].user_id;
   await client.query("UPDATE users SET metadata=jsonb_set(coalesce(metadata,'{}'::jsonb),'{email_verified}','true'::jsonb,true),updated_at=now() WHERE id=$1 AND role='student' AND status='active'",[id]);
   await client.query("INSERT INTO ai_trial_email_verifications(user_id,token_hash,verified_at) VALUES($1,NULL,now()) ON CONFLICT(user_id) DO UPDATE SET verified_at=coalesce(ai_trial_email_verifications.verified_at,excluded.verified_at),token_hash=NULL",[id]);
   await client.query("UPDATE student_email_action_tokens SET consumed_at=now() WHERE user_id=$1 AND purpose='verify' AND consumed_at IS NULL",[id]);
   await client.query('COMMIT');
   return res.json({ok:true,verified:true,message:'Email verified. You may now sign in.'});
  }catch{await client.query('ROLLBACK').catch(()=>{});return res.status(503).json({ok:false,error:'Verification temporarily unavailable.'});}
  finally{client.release();}
 });
 app.post('/api/v1940/student/auth/request-password-reset',authAbuse.registration,requireReady,async(req,res)=>{
  const email=normal(req.body?.email);if(!EMAIL.test(email)||email.length>254)return res.status(400).json({ok:false,error:'Enter a valid email address.'});
  try{const u=await find(email);if(u){const cred=await store.pool.query('SELECT 1 FROM password_credentials WHERE user_id=$1',[u.id]);if(cred.rows.length)await issue(u,'reset',req);}}catch{}
  return res.status(202).json({ok:true,message:GENERIC});
 });
 app.post('/api/v1940/student/auth/reset-password',authAbuse.login,requireReady,async(req,res)=>{
  const token=req.body?.token,password=String(req.body?.new_password||'');
  if(typeof token!=='string'||!RAW.test(token)||password.length<12||password.length>128)
    return res.status(400).json({ok:false,error:'Use a valid reset link and a new password of 12–128 characters.'});
  const client=await store.pool.connect();
  try{
   await client.query('BEGIN');
   const t=await client.query("UPDATE student_email_action_tokens SET consumed_at=now() WHERE token_hash=$1 AND purpose='reset' AND consumed_at IS NULL AND expires_at>now() RETURNING user_id",[hash('reset',token)]);
   if(t.rows.length!==1){await client.query('ROLLBACK');return res.status(400).json({ok:false,error:'Invalid, expired or used reset link.'});}
   const id=t.rows[0].user_id;
   const u=await client.query("SELECT role,status FROM users WHERE id=$1 FOR UPDATE",[id]);
   if(u.rows[0]?.role!=='student'||u.rows[0]?.status!=='active')throw Error('Inactive account');
   const changed=await client.query("UPDATE password_credentials SET password_hash=$2,password_reset_required=false,updated_at=now() WHERE user_id=$1 RETURNING id",[id,passwordHash(password)]);
   if(changed.rows.length!==1)throw Error('Password credential unavailable');
   // JWT session_nonce check in authMiddleware immediately revokes all older bearer sessions.
   const sessionVersion=crypto.randomBytes(24).toString('hex');
   await client.query("UPDATE users SET metadata=jsonb_set(coalesce(metadata,'{}'::jsonb),'{session_version}',to_jsonb($2::text),true),updated_at=now() WHERE id=$1",[id,sessionVersion]);
   await client.query("UPDATE user_sessions SET revoked_at=now() WHERE user_id=$1 AND revoked_at IS NULL",[id]);
   await client.query("UPDATE student_email_action_tokens SET consumed_at=now() WHERE user_id=$1 AND purpose='reset' AND consumed_at IS NULL",[id]);
   await client.query('COMMIT');
   return res.json({ok:true,password_reset:true,message:'Password updated. All previous sessions were signed out. Sign in with your new password.'});
  }catch{await client.query('ROLLBACK').catch(()=>{});return res.status(503).json({ok:false,error:'Password change could not be completed.'});}
  finally{client.release();}
 });
 return {ready,verified,hash};
}
module.exports={install,hash,senderSafe,mailText,normal};
