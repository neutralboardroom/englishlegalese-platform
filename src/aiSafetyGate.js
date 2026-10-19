'use strict';
// Per-instance safeguards. No hard dollar budget across restarts or multiple instances.
const MAX_OUTPUT_TOKENS=600,MAX_PROMPT_CHARS=5000,MAX_CONTEXT_BYTES=3000;
const GLOBAL_DAY=250,GLOBAL_MONTH=4000,USER_DAY=20,USER_TEN_MINUTES=5,IP_HOUR=35,PARALLEL=4;
const MODES={
  student_tutor:['student','teacher','employer','staff','admin','owner'],
  teacher_assistant:['teacher','staff','admin','owner'],
  staff_assistant:['staff','admin','owner'],
  employer_report_helper:['employer','staff','admin','owner'],
  marketing_assistant:['teacher','staff','admin','owner']
};
function createAiSafetyGate(opts={}){
  const now=opts.now||(()=>Date.now()),env=opts.env||process.env;
  let day='',month='',count=0,monthlyCount=0,inFlight=0;const users=new Map(),ips=new Map(),bursts=new Map();
  function refresh(t){
    const current=new Date(t).toISOString().slice(0,10);
    if(current!==day){day=current;count=0;users.clear();ips.clear();}
    const mon=current.slice(0,7);if(mon!==month){month=mon;monthlyCount=0;}
    for(const [key,value] of bursts){const live=value.filter(x=>t-x<600000);if(live.length)bursts.set(key,live);else bursts.delete(key);}
    for(const [key,value] of ips){const live=value.filter(x=>t-x<3600000);if(live.length)ips.set(key,live);else ips.delete(key);}
  }
  function status(){return {enabled:env.SMARTTEACHER_AI_ENABLED==='true',max_output_tokens:MAX_OUTPUT_TOKENS,max_prompt_chars:MAX_PROMPT_CHARS,max_context_bytes:MAX_CONTEXT_BYTES,global_daily_limit:GLOBAL_DAY,global_monthly_limit:GLOBAL_MONTH,per_user_daily_limit:USER_DAY,per_user_ten_minute_limit:USER_TEN_MINUTES,per_ip_hourly_limit:IP_HOUR,parallel_request_limit:PARALLEL,scope:'per instance, resets on restart; not a provider-side spending cap'};}
  function reserve(req){
    const reject=(status,code,message)=>({status,code,message});
    if(env.SMARTTEACHER_AI_ENABLED!=='true')return reject(503,'AI_BETA_DISABLED','AI practice is not enabled for public use.');
    if(!env.OPENAI_API_KEY)return reject(503,'AI_PROVIDER_UNAVAILABLE','AI provider is unavailable.');
    if(!req.user?.id||req.user.status!=='active')return reject(403,'AI_ACCOUNT_INVALID','An active account is required.');
    const body=req.body||{},mode=body.mode||'student_tutor';
    if(typeof mode!=='string'||!MODES[mode]||!MODES[mode].includes(req.user.role))return reject(403,'AI_MODE_NOT_PERMITTED','This practice mode is unavailable for your account.');
    if(typeof body.prompt!=='string'||!body.prompt.trim()||body.prompt.length>MAX_PROMPT_CHARS)return reject(400,'AI_PROMPT_INVALID','Enter 1 to 5000 characters of fictional practice text.');
    if(body.context!==undefined&&(body.context===null||typeof body.context!=='object'||Array.isArray(body.context)))return reject(400,'AI_CONTEXT_INVALID','Context must be a fictional object.');
    let serialized;try{serialized=JSON.stringify(body.context||{});}catch{return reject(400,'AI_CONTEXT_INVALID','Invalid practice context.');}
    if(Buffer.byteLength(serialized,'utf8')>MAX_CONTEXT_BYTES)return reject(400,'AI_CONTEXT_TOO_LARGE','Practice context exceeds 3000 bytes.');
    const t=now();refresh(t);
    const id=String(req.user.id),ip=String(req.ip||req.socket?.remoteAddress||'unknown').slice(0,120);
    const history=ips.get(ip)||[],burst=bursts.get(id)||[];
    if(inFlight>=PARALLEL)return reject(429,'AI_CONCURRENT_LIMIT','AI practice is busy; try later.');
    if(monthlyCount>=GLOBAL_MONTH)return reject(429,'AI_SITE_MONTHLY_LIMIT','The site monthly AI allowance has been reached.');
    if(count>=GLOBAL_DAY)return reject(429,'AI_SITE_DAILY_LIMIT','The site daily AI allowance has been reached.');
    if((users.get(id)||0)>=USER_DAY)return reject(429,'AI_USER_DAILY_LIMIT','Your daily AI practice allowance has been reached.');
    if(burst.length>=USER_TEN_MINUTES)return reject(429,'AI_USER_BURST_LIMIT','You have reached the short-session AI practice allowance.');
    if(history.length>=IP_HOUR)return reject(429,'AI_NETWORK_HOURLY_LIMIT','Too many requests from your network.');
    count++;monthlyCount++;users.set(id,(users.get(id)||0)+1);history.push(t);ips.set(ip,history);burst.push(t);bursts.set(id,burst);inFlight++;
    let released=false;
    return {ok:true,release(){if(!released){released=true;inFlight=Math.max(0,inFlight-1);}}};
  }
  function middleware(req,res,next){
    const result=reserve(req);
    if(!result.ok)return res.status(result.status).json({ok:false,error_code:result.code,error:result.message});
    req.aiSafetyReservation=result;next();
  }
  return {reserve,middleware,status};
}
function createAuthAbuseGuard(opts={}){
  const now=opts.now||(()=>Date.now()),history=new Map(),global=[];
  function limiter(label,perIp,windowMs){
    return (req,res,next)=>{
      const t=now(),key=label+':'+String(req.ip||req.socket?.remoteAddress||'unknown').slice(0,120);
      const recent=(history.get(key)||[]).filter(x=>t-x<windowMs);
      for(let i=global.length-1;i>=0;i--)if(t-global[i]>=3600000)global.splice(i,1);
      if(recent.length>=perIp||global.length>=150)return res.status(429).json({ok:false,error_code:'AUTH_RATE_LIMIT',error:'Too many attempts. Try again later.'});
      recent.push(t);history.set(key,recent);global.push(t);
      if(history.size>1500){for(const [k,v] of history){if(!v.some(x=>t-x<3600000))history.delete(k);}}
      next();
    };
  }
  return {registration:limiter('registration',8,3600000),login:limiter('login',16,900000)};
}

function createFreePreviewGate(opts={}){
  // Public demo is a REAL short OpenAI request, independent of paid account/role flows.
  // Bounded per-instance budgets reset on restart: not a hard distributed dollar ceiling.
  const now=opts.now||(()=>Date.now()),env=opts.env||process.env;
  let day='',month='',daily=0,monthly=0,inFlight=0;
  const networks=new Map();
  const DAILY_SITE=30,MONTHLY_SITE=180,DAILY_NETWORK=2,PARALLEL_PREVIEW=2,MAX_CHARS=2500,MAX_TOKENS=250;
  const allowed=['email','contracts','professional_communication','responsible_ai'];
  function refresh(t){
    const d=new Date(t).toISOString().slice(0,10),m=d.slice(0,7);
    if(d!==day){day=d;daily=0;networks.clear();}
    if(m!==month){month=m;monthly=0;}
  }
  function status(){return {live:!!env.OPENAI_API_KEY&&env.SMARTTEACHER_FREE_PREVIEW_ENABLED!=='false',
    preview_daily_site_limit:DAILY_SITE,preview_monthly_site_limit:MONTHLY_SITE,
    preview_daily_network_limit:DAILY_NETWORK,preview_max_chars:MAX_CHARS,
    preview_max_output_tokens:MAX_TOKENS,preview_concurrency:PARALLEL_PREVIEW,
    scope:'single instance, reset after redeploy; not a hard cost ceiling'};}
  function reserve(req){
    const reject=(status,code,message)=>({ok:false,status,code,message});
    if(!env.OPENAI_API_KEY||env.SMARTTEACHER_FREE_PREVIEW_ENABLED==='false')return reject(503,'PREVIEW_UNAVAILABLE','The free live AI preview is temporarily unavailable.');
    const body=req.body||{},prompt=body.prompt,topic=body.topic||'professional_communication';
    if(typeof prompt!=='string'||!prompt.trim()||prompt.length>MAX_CHARS)return reject(400,'PREVIEW_INPUT_INVALID','Enter 1 to 2500 characters of invented practice text.');
    if(typeof topic!=='string'||!allowed.includes(topic))return reject(400,'PREVIEW_TOPIC_INVALID','Choose a supported learning topic.');
    if(body.files||body.attachments||body.images||body.documents)return reject(400,'PREVIEW_FILES_DISABLED','File review requires verified paid access and secure document processing.');
    const t=now();refresh(t);
    const network=String(req.ip||req.socket?.remoteAddress||'unknown').slice(0,120);
    if(inFlight>=PARALLEL_PREVIEW)return reject(429,'PREVIEW_BUSY','The free preview is busy. Please try again later.');
    if(monthly>=MONTHLY_SITE)return reject(429,'PREVIEW_MONTHLY_LIMIT','This month’s free live demonstrations have been used.');
    if(daily>=DAILY_SITE)return reject(429,'PREVIEW_DAILY_SITE_LIMIT','Today’s free live demonstrations have been used.');
    if((networks.get(network)||0)>=DAILY_NETWORK)return reject(429,'PREVIEW_NETWORK_LIMIT','You have used today’s free live demonstrations on this connection.');
    daily++;monthly++;networks.set(network,(networks.get(network)||0)+1);inFlight++;
    let released=false;
    return {ok:true,prompt:prompt.trim(),topic,release(){if(!released){released=true;inFlight=Math.max(0,inFlight-1);}}};
  }
  function middleware(req,res,next){
    const reservation=reserve(req);
    if(!reservation.ok)return res.status(reservation.status).json({ok:false,error_code:reservation.code,error:reservation.message});
    req.freePreviewReservation=reservation;next();
  }
  return {reserve,middleware,status};
}

module.exports={createAiSafetyGate,createAuthAbuseGuard,createFreePreviewGate,MAX_OUTPUT_TOKENS,MAX_PROMPT_CHARS,MAX_CONTEXT_BYTES};
