'use strict';
const crypto=require('node:crypto');
const ALLOWANCE=3;
const digest=s=>crypto.createHash('sha256').update(String(s)).digest('hex');
function configured({store,env=process.env}={}){
 const db=store?.mode?.()==='postgres'&&Boolean(store.pool?.connect);
 const secret=env.SESSION_SECRET||env.JWT_SECRET||'';
 const auth=secret.length>=32&&secret!=='dev-only-change-me';
 const smtp=Boolean(env.SMTP_HOST&&env.SMTP_USER&&env.SMTP_PASS);
 return {database:db,secure_session:auth,email_sender:smtp,openai:!!env.OPENAI_API_KEY,enabled:env.SMARTTEACHER_TRIAL_ENABLED==='true',ready:db&&auth&&smtp&&!!env.OPENAI_API_KEY&&env.SMARTTEACHER_TRIAL_ENABLED==='true'};
}
class FreeTrialLedger{
 constructor({store,env=process.env,sendMail,now=()=>Date.now()}={}){this.store=store;this.env=env;this.sendMail=sendMail;this.now=now;}
 async ready(){
  if(!configured({store:this.store,env:this.env}).ready)return false;
  try{const q=await this.store.pool.query("SELECT to_regclass('public.ai_free_trial_uses') AS uses, to_regclass('public.ai_trial_email_verifications') AS emails");return !!q.rows[0]?.uses&&!!q.rows[0]?.emails;}
  catch{return false;}
 }
 async sendVerification(user){
  if(!await this.ready())throw Error('Trial infrastructure not ready');
  const code=crypto.randomBytes(32).toString('hex');
  await this.store.pool.query('INSERT INTO ai_trial_email_verifications(user_id,token_hash,expires_at) VALUES($1,$2,$3) ON CONFLICT(user_id) DO UPDATE SET token_hash=excluded.token_hash,expires_at=excluded.expires_at,verified_at=NULL',[user.id,digest(code),new Date(this.now()+15*60*1000).toISOString()]);
  if(typeof this.sendMail!=='function')throw Error('Mail service missing');
  await this.sendMail({to:user.email,subject:'Confirm your EnglishLegalese free trial',text:'Confirm your account within 15 minutes: https://englishlegalese.com/?trial_verify='+code+'#smartteacher-free-trial\nIgnore if you did not register.'});
  return {sent:true};
 }
 async verify(code){
  if(!await this.ready())throw Error('Trial unavailable');
  if(typeof code!=='string'||!/^[a-f0-9]{64}$/.test(code))return false;
  const result=await this.store.pool.query('UPDATE ai_trial_email_verifications SET verified_at=NOW(),token_hash=NULL WHERE token_hash=$1 AND expires_at>NOW() AND verified_at IS NULL RETURNING user_id',[digest(code)]);
  return result.rows.length===1;
 }
 async status(userId){
  if(!await this.ready())throw Error('Trial unavailable');
  const q=await this.store.pool.query(`SELECT EXISTS(SELECT 1 FROM ai_trial_email_verifications WHERE user_id=$1 AND verified_at IS NOT NULL) AS verified,
    (SELECT count(*)::integer FROM ai_free_trial_uses WHERE user_id=$1) AS used`,[userId]);
  const verified=Boolean(q.rows[0]?.verified),used=Math.max(0,Math.min(ALLOWANCE,Number(q.rows[0]?.used)||0));
  return {verified,used,remaining:verified?ALLOWANCE-used:0,limit:ALLOWANCE};
 }
 async reserve(userId,ip,chars,topic){
  if(!await this.ready())throw Error('Trial unavailable');
  const client=await this.store.pool.connect();
  try{
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1))',[String(userId)]);
    const check=await client.query(`SELECT EXISTS(SELECT 1 FROM ai_trial_email_verifications WHERE user_id=$1 AND verified_at IS NOT NULL) AS verified,
    (SELECT count(*)::integer FROM ai_free_trial_uses WHERE user_id=$1) AS used`,[userId]);
    if(!check.rows[0]?.verified||Number(check.rows[0]?.used)>=ALLOWANCE){await client.query('ROLLBACK');return {allowed:false,verified:!!check.rows[0]?.verified,remaining:0};}
    const insert=await client.query('INSERT INTO ai_free_trial_uses(user_id,network_hash,topic,request_chars) VALUES($1,$2,$3,$4) RETURNING id',[userId,digest(ip),topic,chars]);
    const remaining=ALLOWANCE-Number(check.rows[0].used)-1;
    await client.query('COMMIT');
    return {allowed:true,id:insert.rows[0].id,remaining};
  }catch(e){try{await client.query('ROLLBACK');}catch{}throw e;}finally{client.release();}
 }
 async refundFailedRequest(userId,id){
  // Only specific unsuccessful provider attempt is reversed; no raw prompt is stored.
  if(!id||!await this.ready())return;
  await this.store.pool.query('DELETE FROM ai_free_trial_uses WHERE user_id=$1 AND id=$2',[userId,id]);
 }
}
module.exports={FreeTrialLedger,configured,ALLOWANCE};
