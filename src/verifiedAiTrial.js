'use strict';
// Three live AI trial exchanges per verified account. Requires dedicated PostgreSQL,
// working SMTP, a strong session secret, and an explicit owner enable switch.
const crypto=require('node:crypto');
const MAX_TRIAL=3,MAX_CHARS=2500,MAX_OUTPUT=600;
function ready(db,env=process.env){return {
  available:db?.mode?.()==='postgres'&&Boolean(db.pool)&&Boolean(env.OPENAI_API_KEY)&&Boolean(env.SMTP_HOST&&env.SMTP_USER&&env.SMTP_PASS)&&String(env.SESSION_SECRET||'').length>=32&&env.SMARTTEACHER_TRIAL_ENABLED==='true',
  free_exchanges:MAX_TRIAL,max_message_characters:MAX_CHARS,max_output_tokens:MAX_OUTPUT,checkout_ready:false,
  database:db?.mode?.()==='postgres',email_delivery_configured:Boolean(env.SMTP_HOST&&env.SMTP_USER&&env.SMTP_PASS),activation_enabled:env.SMARTTEACHER_TRIAL_ENABLED==='true'};
}
function token(user,env=process.env,now=Date.now()){
  if(String(env.SESSION_SECRET||'').length<32)throw Error('verification not configured');
  const body=Buffer.from(JSON.stringify({id:user.id,email:user.email,exp:now+86400000})).toString('base64url');
  return body+'.'+crypto.createHmac('sha256',env.SESSION_SECRET).update('EL-VERIFY:'+body).digest('base64url');
}
function parseToken(value,env=process.env,now=Date.now()){
  if(typeof value!=='string'||value.length>900||String(env.SESSION_SECRET||'').length<32)return null;
  const parts=value.split('.');if(parts.length!==2)return null;
  const expected=crypto.createHmac('sha256',env.SESSION_SECRET).update('EL-VERIFY:'+parts[0]).digest();
  let given;try{given=Buffer.from(parts[1],'base64url');}catch{return null;}
  if(given.length!==expected.length||!crypto.timingSafeEqual(expected,given))return null;
  try{const data=JSON.parse(Buffer.from(parts[0],'base64url').toString('utf8'));return data.id&&data.email&&Number.isSafeInteger(data.exp)&&data.exp>=now&&data.exp<=now+86400000?data:null;}catch{return null;}
}
function validate(body){
  if(!body||typeof body.prompt!=='string'||!body.prompt.trim()||body.prompt.length>MAX_CHARS)return {code:'TRIAL_INPUT',status:400,error:'Enter 1–2500 characters of fictional practice text.'};
  if(!['email','contracts','professional_communication','responsible_ai'].includes(body.topic))return {code:'TRIAL_TOPIC',status:400,error:'Choose a supported learning topic.'};
  if(Object.keys(body).some(k=>!['prompt','topic'].includes(k)))return {code:'TRIAL_TEXT_ONLY',status:400,error:'Files and attachments require paid review and secure upload processing.'};
  return null;
}
async function status(db,user,env=process.env){
  const cfg=ready(db,env);
  if(!cfg.available)return {...cfg,remaining:0,used:0,reason:'Live trial awaits secure account database, email verification and explicit activation.'};
  if(!user||user.status!=='active')return {...cfg,remaining:0,used:0,reason:'Sign into your free account.'};
  try{
    const u=await db.pool.query("select coalesce(metadata->>'email_verified','false')='true' verified from users where id=$1 and lower(email)=lower($2) and status='active'",[user.id,user.email]);
    if(!u.rows[0]?.verified)return {...cfg,remaining:0,used:0,verify_email:true,reason:'Please verify your email address.'};
    const count=await db.pool.query('select count(*)::int used from ai_free_trial_uses where user_id=$1',[user.id]);
    const used=Number(count.rows[0]?.used||0);return {...cfg,used,remaining:Math.max(0,MAX_TRIAL-used)};
  }catch{return {...cfg,available:false,used:0,remaining:0,reason:'Trial ledger is temporarily unavailable.'};}
}
async function reserve(db,user,body,ip,env=process.env,now=Date.now()){
  const invalid=validate(body);if(invalid)return invalid;
  if(!ready(db,env).available)return {status:503,code:'TRIAL_NOT_READY',error:'Secure free trial activation is pending.'};
  if(!user||user.role!=='student'||user.status!=='active')return {status:403,code:'TRIAL_ACCOUNT_REQUIRED',error:'A verified free student account is required.'};
  const ipHash=crypto.createHmac('sha256',env.SESSION_SECRET).update('EL-NET:'+String(ip||'unknown').slice(0,128)).digest('hex');
  let conn,started=false;
  try{
    conn=await db.pool.connect();await conn.query('BEGIN');started=true;
    await conn.query('select pg_advisory_xact_lock(173,3)');
    const check=await conn.query("select coalesce(metadata->>'email_verified','false')='true' verified from users where id=$1 and lower(email)=lower($2) and status='active' for update",[user.id,user.email]);
    if(!check.rows[0]?.verified){await conn.query('ROLLBACK');started=false;return {status:403,code:'VERIFY_EMAIL',error:'Verify your email to start the free trial.'};}
    const d=new Date(now);
    const c=await conn.query("select count(*) filter(where user_id=$1)::int personal,count(*) filter(where created_at >= $2)::int site_day,count(*) filter(where created_at >= $3)::int site_month,count(*) filter(where network_hash=$4 and created_at >= $5)::int network_day,count(*) filter(where network_hash=$4 and created_at >= $6)::int network_month from ai_free_trial_uses",
      [user.id,new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())),new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),1)),ipHash,new Date(now-86400000),new Date(now-30*86400000)]);
    const x=c.rows[0];let denial=null;
    if(Number(x.personal)>=3)denial={status:402,code:'TRIAL_EXHAUSTED',error:'You have used your three free AI exchanges. Purchase options will open after secure checkout is ready.'};
    else if(Number(x.site_day)>=20||Number(x.site_month)>=120)denial={status:429,code:'SITE_BUDGET',error:'Free AI trial site allowance reached. Please try later.'};
    else if(Number(x.network_day)>=3||Number(x.network_month)>=12)denial={status:429,code:'NETWORK_BUDGET',error:'Free trials from this network have reached the current allowance.'};
    if(denial){await conn.query('ROLLBACK');started=false;return denial;}
    await conn.query('insert into ai_free_trial_uses(user_id,network_hash,topic,request_chars) values($1,$2,$3,$4)',[user.id,ipHash,body.topic,body.prompt.length]);
    await conn.query('COMMIT');started=false;
    return {ok:true,prompt:body.prompt.trim(),topic:body.topic,remaining:2-Number(x.personal)};
  }catch{if(started)try{await conn.query('ROLLBACK');}catch{}return {status:503,code:'TRIAL_LEDGER',error:'Unable to protect trial credits. No AI call was made.'};}
  finally{conn?.release();}
}
async function respond(prompt,topic,env=process.env,fetcher=fetch){
  const response=await fetcher('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:'Bearer '+env.OPENAI_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({model:env.SMARTTEACHER_MODEL==='gpt-4.1-nano'?'gpt-4.1-nano':'gpt-4.1-mini',store:false,max_output_tokens:MAX_OUTPUT,input:[{role:'system',content:'You teach Legal English for educational purposes only, not legal advice. Give a clear useful explanation, a fictional example, and a brief exercise. Do not request real client information.'},{role:'user',content:JSON.stringify({prompt,topic})}]}),signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw Error('provider temporarily unavailable');
  const j=await response.json(),output=String(j.output_text||(j.output||[]).flatMap(x=>x.content||[]).map(x=>x.text||'').join('\n')).trim();
  if(!output)throw Error('empty provider output');return output.slice(0,6500);
}
module.exports={MAX_TRIAL,MAX_CHARS,MAX_OUTPUT,ready,token,parseToken,validate,status,reserve,respond};
