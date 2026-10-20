'use strict';
// HTTPS transactional email; suitable for Render Free, which blocks SMTP ports.
// Never log credentials or message bodies. Calls are disabled without explicit config.
function resendConfigured(env=process.env){
  const from=String(env.RESEND_FROM_EMAIL||'').trim();
  const address=from.match(/<([^<>]+)>$/)?.[1]||from;
  return Boolean(env.RESEND_API_KEY && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(address));
}
async function sendResendEmail(mail,{env=process.env,fetchImpl=globalThis.fetch}={}){
  if(!resendConfigured(env))throw new Error('Resend sender not configured');
  const to=String(mail?.to||'').trim(),subject=String(mail?.subject||'').trim();
  if(!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(to))throw new Error('Recipient address invalid');
  if(!subject||subject.length>300)throw new Error('Email subject invalid');
  if(!mail?.text && !mail?.html)throw new Error('Email body missing');
  if(typeof fetchImpl!=='function')throw new Error('HTTPS email transport unavailable');
  const payload={from:env.RESEND_FROM_EMAIL,to:[to],subject};
  if(mail.text)payload.text=String(mail.text);
  if(mail.html)payload.html=String(mail.html);
  let response;
  try{
    response=await fetchImpl('https://api.resend.com/emails',{
      method:'POST',
      headers:{Authorization:'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json'},
      body:JSON.stringify(payload),
      signal:AbortSignal.timeout(12000)
    });
  }catch{throw new Error('Transactional email provider unreachable');}
  if(!response?.ok)throw new Error('Transactional email provider rejected message');
  let data;
  try{data=await response.json();}catch{throw new Error('Transactional email provider response invalid');}
  if(typeof data?.id!=='string'||!data.id.trim())throw new Error('Transactional email not acknowledged');
  return {id:data.id};
}
module.exports={resendConfigured,sendResendEmail};
