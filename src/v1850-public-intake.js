'use strict';
const { randomUUID } = require('node:crypto');
const { Pool } = require('pg');
const trustedHosts=new Set(['englishlegalese.com','www.englishlegalese.com','englishlegalese-platform.onrender.com']);
const schedules=Object.freeze([
 {id:'legal-group-mon',program:'legal',format:'group',title:'Legal English Extended Classroom',teacher:'Roger Gillman',start:'2026-11-02T19:00:00+07:00',duration_minutes:50,timezone:'Asia/Ho_Chi_Minh',repeat:'weekly',sessions:16,day:'Monday',capacity:6,price_usd:269,calendar_reference:'u4lgv6pad4kk506cm03g313gfo'},
 {id:'business-group-wed',program:'business',format:'group',title:'Business English Extended Classroom',teacher:'Roger Gillman',start:'2026-11-04T19:00:00+07:00',duration_minutes:50,timezone:'Asia/Ho_Chi_Minh',repeat:'weekly',sessions:16,day:'Wednesday',capacity:6,price_usd:269,calendar_reference:'cc3a8e2b7lg4tqrimb2scel73s'}
]);
const allowedPrograms=new Set(['legal','business','investor']);
const allowedFormats=new Set(['group','private']);
const allowedTracks=new Set(['legal','business','investor','multiple']);
const pool=process.env.ENGLISHLEGALESE_INTAKE_DATABASE_URL?new Pool({connectionString:process.env.ENGLISHLEGALESE_INTAKE_DATABASE_URL,ssl:{rejectUnauthorized:true},max:3,connectionTimeoutMillis:6500,idleTimeoutMillis:12000}):null;
const hits=new Map();
function sourceValid(req){const origin=req.get('origin');if(origin){try{return trustedHosts.has(new URL(origin).hostname)}catch{return false}}const referer=req.get('referer');if(referer){try{return trustedHosts.has(new URL(referer).hostname)}catch{return false}}return false}
function rate(req){
 const ip=String(req.ip||req.socket.remoteAddress||'unknown').slice(0,120);
 const now=Date.now(),x=hits.get(ip)||{count:0,until:now+3600000};
 if(now>x.until){x.count=0;x.until=now+3600000}x.count++;hits.set(ip,x);
 if(hits.size>10000){for(const [k,v] of hits){if(v.until<now)hits.delete(k)}}return x.count<=6;
}
function safe(value,min,max){return typeof value==='string'&&value.trim().length>=min&&value.trim().length<=max?value.trim():null}
function emailValid(e){return Boolean(e&&e.length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))}
function send(res,status,payload){return res.status(status).set('Cache-Control','no-store').json(payload)}
function install(app){
 app.get('/api/v1850/schedules',(_req,res)=>send(res,200,{ok:true,schedules:schedules.map(({calendar_reference,...s})=>s),stripe_enabled:false}));
 app.get('/api/v1850/intake-status',async(_req,res)=>{if(!pool)return send(res,503,{ok:false,ready:false});try{await pool.query('select id from englishlegalese_enrollment_requests limit 0');await pool.query('select id from englishlegalese_teacher_applications limit 0');return send(res,200,{ok:true,ready:true,stripe_enabled:false})}catch{return send(res,503,{ok:false,ready:false})}});
 app.post('/api/v1850/enroll',async(req,res)=>{
  if(!pool)return send(res,503,{ok:false,error:'Enrollment temporarily unavailable. Please try again.'});
  if(!sourceValid(req))return send(res,403,{ok:false,error:'Please use the EnglishLegalese enrollment page.'});
  if(!rate(req))return send(res,429,{ok:false,error:'Too many submissions. Please try again later.'});
  const body=req.body||{};if(body.website)return send(res,200,{ok:true,received:true,reference:'request-received'});
  const name=safe(body.full_name,2,120),email=safe(body.email,6,254)?.toLowerCase(),program=body.program,format=body.format;
  const scheduleId=safe(body.schedule_id,4,100),note=String(body.note||'').slice(0,500),requestId=safe(body.client_request_id,36,36);
  if(!name||!emailValid(email)||!allowedPrograms.has(program)||!allowedFormats.has(format)||!scheduleId||!requestId||!/^[a-f\d-]{36}$/i.test(requestId))return send(res,400,{ok:false,error:'Please check the required enrollment details.'});
  const slot=schedules.find(s=>s.id===scheduleId);
  if(format==='group'&&(!slot||(program!==slot.program&&!(program==='investor'&&slot.program==='business'))))return send(res,400,{ok:false,error:'Select a valid group schedule.'});
  if(format==='private'&&scheduleId!=='private-time-request')return send(res,400,{ok:false,error:'Please request a private lesson time.'});
  try{
   const q=await pool.query(`INSERT INTO englishlegalese_enrollment_requests(full_name,email,program,format,schedule_id,note,client_request_id) VALUES($1,$2,$3,$4,$5,$6,$7::uuid) ON CONFLICT (client_request_id) DO UPDATE SET client_request_id=EXCLUDED.client_request_id RETURNING id`,[name,email,program,format,scheduleId,note,requestId]);
   return send(res,201,{ok:true,received:true,reference:q.rows[0].id,message:'Enrollment request received. Class joining details are provided after instructor and place confirmation. No payment was taken.'});
  }catch{return send(res,503,{ok:false,error:'Unable to save enrollment at this time. Please retry.'})}
 });
 app.post('/api/v1850/teacher-applications',async(req,res)=>{
  if(!pool)return send(res,503,{ok:false,error:'Applications temporarily unavailable. Please try again.'});
  if(!sourceValid(req))return send(res,403,{ok:false,error:'Please apply through the EnglishLegalese teaching page.'});
  if(!rate(req))return send(res,429,{ok:false,error:'Too many submissions. Please try again later.'});
  const b=req.body||{};if(b.website)return send(res,200,{ok:true,received:true,reference:'request-received'});
  const name=safe(b.full_name,2,120),email=safe(b.email,6,254)?.toLowerCase(),track=b.teaching_track,qualifications=safe(b.qualifications,20,2500),tz=safe(b.timezone,3,100),availability=safe(b.weekly_availability,4,500),id=safe(b.client_request_id,36,36);
  if(!name||!emailValid(email)||!allowedTracks.has(track)||!qualifications||!tz||!availability||!id||!/^[a-f\d-]{36}$/i.test(id))return send(res,400,{ok:false,error:'Please complete the teaching application.'});
  try{let q=await pool.query(`INSERT INTO englishlegalese_teacher_applications(full_name,email,teaching_track,qualifications,timezone,weekly_availability,client_request_id) VALUES($1,$2,$3,$4,$5,$6,$7::uuid) ON CONFLICT (client_request_id) DO UPDATE SET client_request_id=EXCLUDED.client_request_id RETURNING id`,[name,email,track,qualifications,tz,availability,id]);
   return send(res,201,{ok:true,received:true,reference:q.rows[0].id,message:'Teacher application received for screening.'});
  }catch{return send(res,503,{ok:false,error:'Unable to save application at this time. Please retry.'})}
 });
}
module.exports={install,schedules};
