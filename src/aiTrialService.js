'use strict';
// Three lifetime free AI replies per verified student account. PostgreSQL is required.
const crypto=require('node:crypto');
const LIMIT=3,MAX_CHARS=2500,OUTPUT_TOKENS=600;
const TOPICS=new Set(['email','contracts','professional_communication','responsible_ai']);
function createTrialService({store,services,env=process.env,providerFetch=fetch}){
  const query=(sql,p=[])=>store.pool.query(sql,p);
  function readiness(){
    const postgres=store.mode()==='postgres',email=Boolean(env.SMTP_HOST&&env.SMTP_USER&&env.SMTP_PASS);
    const secret=Boolean(env.SESSION_SECRET||env.JWT_SECRET),openai=Boolean(env.OPENAI_API_KEY),enabled=env.SMARTTEACHER_TRIAL_ENABLED==='true';
    return {available:postgres&&email&&secret&&openai&&enabled,postgres,email_verification:email,secure_sessions:secret,openai,enabled,free_replies:LIMIT,prompt_limit:MAX_CHARS,output_token_limit:OUTPUT_TOKENS};
  }
  function requireReady(){if(!readiness().available)throw Object.assign(new Error('The free AI trial is awaiting secure persistent account records, email verification and activation.'),{status:503});}
  async function status(user){
    const r=readiness();if(!user||!r.available)return {...r,verified:false,remaining:null};
    const x=await query('select verified_at,used_count from ai_trial_accounts where user_id=$1',[user.id]);
    const row=x.rows[0];return {...r,verified:Boolean(row?.verified_at),remaining:row?.verified_at?Math.max(0,LIMIT-Number(row.used_count)):LIMIT};
  }
  async function sendCode(user){
    requireReady();if(!user?.id||user.role!=='student'||user.status!=='active')throw Object.assign(new Error('An active student account is required.'),{status:403});
    const code=String(crypto.randomInt(0,1000000)).padStart(6,'0');
    const hash=crypto.createHash('sha256').update(user.id+':'+code+':'+(env.SESSION_SECRET||env.JWT_SECRET)).digest('hex');
    const sql="insert into ai_trial_accounts(user_id,code_hash,code_expires_at,last_code_sent_at) values($1,$2,now()+interval '10 minutes',now()) on conflict(user_id) do update set code_hash=excluded.code_hash,code_expires_at=excluded.code_expires_at,last_code_sent_at=now(),code_attempts=0 where ai_trial_accounts.verified_at is null and (ai_trial_accounts.last_code_sent_at is null or ai_trial_accounts.last_code_sent_at<now()-interval '60 seconds') returning user_id";
    const x=await query(sql,[user.id,hash]);
    if(!x.rowCount)throw Object.assign(new Error('Already verified or a new code was requested recently. Please wait one minute.'),{status:429});
    const sent=await services.sendEmail({to:user.email,subject:'EnglishLegalese verification code',text:'Your EnglishLegalese verification code is '+code+'. It expires in 10 minutes. Never share it. If you did not request this, ignore the email.',template:'trial_email_verification'});
    if(sent.status!=='sent')throw Object.assign(new Error('Verification email delivery is not available yet.'),{status:503});
    return {sent:true,expires_minutes:10};
  }
  async function verify(user,code){
    requireReady();if(!user?.id||typeof code!=='string'||!/^\d{6}$/.test(code))throw Object.assign(new Error('Enter the six-digit verification code.'),{status:400});
    const sql="update ai_trial_accounts set code_attempts=code_attempts+1 where user_id=$1 and verified_at is null and code_attempts<5 and code_expires_at>now() returning code_hash";
    const x=await query(sql,[user.id]);
    if(!x.rowCount)throw Object.assign(new Error('Code expired or attempt limit reached. Request a new code.'),{status:429});
    const hash=crypto.createHash('sha256').update(user.id+':'+code+':'+(env.SESSION_SECRET||env.JWT_SECRET)).digest('hex');
    if(!crypto.timingSafeEqual(Buffer.from(hash,'hex'),Buffer.from(x.rows[0].code_hash,'hex')))throw Object.assign(new Error('Incorrect code.'),{status:400});
    const y=await query('update ai_trial_accounts set verified_at=now(),code_hash=null,code_expires_at=null where user_id=$1 and code_hash=$2 and verified_at is null returning user_id',[user.id,hash]);
    if(!y.rowCount)throw Object.assign(new Error('Verification already processed.'),{status:409});
    return {verified:true};
  }
  async function ask(user,body){
    requireReady();if(!user?.id||user.role!=='student'||user.status!=='active')throw Object.assign(new Error('A signed-in student account is required.'),{status:403});
    const prompt=body?.prompt,topic=body?.topic||'professional_communication';
    if(typeof prompt!=='string'||!prompt.trim()||prompt.length>MAX_CHARS)throw Object.assign(new Error('Enter 1–2,500 characters of fictional Legal English text.'),{status:400});
    if(!TOPICS.has(topic)||Object.keys(body||{}).some(k=>!['prompt','topic'].includes(k)))throw Object.assign(new Error('Only text questions in the supported topics are accepted.'),{status:400});
    const sql="update ai_trial_accounts set used_count=used_count+1,updated_at=now() where user_id=$1 and verified_at is not null and used_count<3 returning used_count";
    const reservation=await query(sql,[user.id]);
    if(!reservation.rowCount){
      const x=await query('select verified_at from ai_trial_accounts where user_id=$1',[user.id]);
      const verified=Boolean(x.rows[0]?.verified_at);
      throw Object.assign(new Error(verified?'Your three free replies are complete. Paid lessons will be available after secure checkout launches.':'Verify your email before using the free AI trial.'),{status:verified?402:403,code:verified?'TRIAL_EXHAUSTED':'EMAIL_UNVERIFIED'});
    }
    try{
      const model=env.SMARTTEACHER_MODEL==='gpt-4.1-nano'?'gpt-4.1-nano':'gpt-4.1-mini';
      const response=await providerFetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:'Bearer '+env.OPENAI_API_KEY,'Content-Type':'application/json'},signal:AbortSignal.timeout(20000),body:JSON.stringify({model,store:false,max_output_tokens:OUTPUT_TOKENS,input:[{role:'system',content:'You are a concise Legal English tutor. Teach language with fictional examples and a practice prompt. Do not provide legal advice, claim professional certification or infer real facts.'},{role:'user',content:'Topic: '+topic+'\nFictional practice: '+prompt}]})});
      if(!response.ok)throw new Error('Provider request failed.');
      const json=await response.json();
      const answer=String(json.output_text||(json.output||[]).flatMap(x=>x.content||[]).map(x=>x.text||'').join('\n')).trim();
      if(!answer)throw new Error('Empty provider result.');
      return {answer,remaining:Math.max(0,LIMIT-Number(reservation.rows[0].used_count)),provider:'openai_live',paid_required:Number(reservation.rows[0].used_count)>=LIMIT};
    }catch{
      await query('update ai_trial_accounts set used_count=greatest(0,used_count-1),updated_at=now() where user_id=$1',[user.id]).catch(()=>{});
      throw Object.assign(new Error('The AI service was unavailable. Please try later.'),{status:503});
    }
  }
  return {readiness,status,sendCode,verify,ask};
}
module.exports={createTrialService,LIMIT,MAX_CHARS,OUTPUT_TOKENS};
