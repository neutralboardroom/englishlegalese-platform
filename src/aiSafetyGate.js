'use strict';
// Per-instance safeguards. No hard dollar budget across restarts or multiple instances.
const MAX_OUTPUT_TOKENS=600,MAX_PROMPT_CHARS=3200,MAX_CONTEXT_BYTES=3000;
const GLOBAL_DAY=250,USER_DAY=20,IP_HOUR=35,PARALLEL=4;
const MODES={
  student_tutor:['student','teacher','employer','staff','admin','owner'],
  teacher_assistant:['teacher','staff','admin','owner'],
  staff_assistant:['staff','admin','owner'],
  employer_report_helper:['employer','staff','admin','owner'],
  marketing_assistant:['teacher','staff','admin','owner']
};
function createAiSafetyGate(opts={}){
  const now=opts.now||(()=>Date.now()),env=opts.env||process.env;
  let day='',count=0,inFlight=0;const users=new Map(),ips=new Map();
  function refresh(t){
    const current=new Date(t).toISOString().slice(0,10);
    if(current!==day){day=current;count=0;users.clear();ips.clear();}
    for(const [key,value] of ips){const live=value.filter(x=>t-x<3600000);if(live.length)ips.set(key,live);else ips.delete(key);}
  }
  function status(){return {enabled:env.SMARTTEACHER_AI_ENABLED==='true',max_output_tokens:MAX_OUTPUT_TOKENS,max_prompt_chars:MAX_PROMPT_CHARS,max_context_bytes:MAX_CONTEXT_BYTES,global_daily_limit:GLOBAL_DAY,per_user_daily_limit:USER_DAY,per_ip_hourly_limit:IP_HOUR,parallel_request_limit:PARALLEL,scope:'per instance, resets on restart; not a provider-side spending cap'};}
  function reserve(req){
    const reject=(status,code,message)=>({status,code,message});
    if(env.SMARTTEACHER_AI_ENABLED!=='true')return reject(503,'AI_BETA_DISABLED','AI practice is not enabled for public use.');
    if(!env.OPENAI_API_KEY)return reject(503,'AI_PROVIDER_UNAVAILABLE','AI provider is unavailable.');
    if(!req.user?.id||req.user.status!=='active')return reject(403,'AI_ACCOUNT_INVALID','An active account is required.');
    const body=req.body||{},mode=body.mode||'student_tutor';
    if(typeof mode!=='string'||!MODES[mode]||!MODES[mode].includes(req.user.role))return reject(403,'AI_MODE_NOT_PERMITTED','This practice mode is unavailable for your account.');
    if(typeof body.prompt!=='string'||!body.prompt.trim()||body.prompt.length>MAX_PROMPT_CHARS)return reject(400,'AI_PROMPT_INVALID','Enter 1 to 3200 characters of fictional practice text.');
    if(body.context!==undefined&&(body.context===null||typeof body.context!=='object'||Array.isArray(body.context)))return reject(400,'AI_CONTEXT_INVALID','Context must be a fictional object.');
    let serialized;try{serialized=JSON.stringify(body.context||{});}catch{return reject(400,'AI_CONTEXT_INVALID','Invalid practice context.');}
    if(Buffer.byteLength(serialized,'utf8')>MAX_CONTEXT_BYTES)return reject(400,'AI_CONTEXT_TOO_LARGE','Practice context exceeds 3000 bytes.');
    const t=now();refresh(t);
    const id=String(req.user.id),ip=String(req.ip||req.socket?.remoteAddress||'unknown').slice(0,120);
    const history=ips.get(ip)||[];
    if(inFlight>=PARALLEL)return reject(429,'AI_CONCURRENT_LIMIT','AI practice is busy; try later.');
    if(count>=GLOBAL_DAY)return reject(429,'AI_SITE_DAILY_LIMIT','The site daily AI allowance has been reached.');
    if((users.get(id)||0)>=USER_DAY)return reject(429,'AI_USER_DAILY_LIMIT','Your daily AI practice allowance has been reached.');
    if(history.length>=IP_HOUR)return reject(429,'AI_NETWORK_HOURLY_LIMIT','Too many requests from your network.');
    count++;users.set(id,(users.get(id)||0)+1);history.push(t);ips.set(ip,history);inFlight++;
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
module.exports={createAiSafetyGate,createAuthAbuseGuard,MAX_OUTPUT_TOKENS,MAX_PROMPT_CHARS,MAX_CONTEXT_BYTES};
