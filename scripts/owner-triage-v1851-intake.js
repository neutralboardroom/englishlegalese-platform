'use strict';
// Private operator shell only. No public route, automatic email, card payment or teacher assignment.
// Example: node scripts/owner-triage-v1851-intake.js --summary
// Example: node scripts/owner-triage-v1851-intake.js --due --acknowledge-personal-data
// Example: node scripts/owner-triage-v1851-intake.js --set --kind=enrollment --id=UUID
//          --status=reviewing --actor=owner --next-action="Check preferred time"
//          --followup-utc=2026-11-01T09:00:00Z --acknowledge-personal-data
const {Pool}=require('pg');
const {records,validate}=require('../src/v1851-intake-triage-policy');
const entries=process.argv.slice(2),flags=new Map();
for(const token of entries){
 const match=/^(--[a-z-]+)(?:=(.*))?$/.exec(token);
 if(!match||flags.has(match[1])){console.error('Invalid or duplicated argument');process.exit(2)}
 flags.set(match[1],match[2]===undefined?true:match[2]);
}
const allowed=new Set(['--summary','--due','--set','--kind','--id','--status','--actor','--next-action','--followup-utc','--acknowledge-personal-data','--verified-class-place','--verified-qualifications']);
for(const k of flags.keys())if(!allowed.has(k)){console.error('Unsupported argument: '+k);process.exit(2)}
const modes=['--summary','--due','--set'].filter(k=>flags.has(k));
if(modes.length>1){console.error('Choose one of --summary, --due or --set');process.exit(2)}
const mode=modes[0]||'--summary';
if(mode==='--summary' && entries.some(x=>x!=='--summary')){console.error('Summary takes no additional arguments');process.exit(2)}
if(mode==='--due' && (entries.some(x=>!['--due','--acknowledge-personal-data'].includes(x)))){console.error('Due takes only --acknowledge-personal-data');process.exit(2)}
if(mode!=='--summary' && flags.get('--acknowledge-personal-data')!==true){console.error('Private review requires --acknowledge-personal-data');process.exit(2)}
const uri=process.env.ENGLISHLEGALESE_INTAKE_DATABASE_URL;
if(!uri){console.error('Dedicated EnglishLegalese intake database is not configured; no connection attempted.');process.exit(2)}
const pool=new Pool({connectionString:uri,ssl:{rejectUnauthorized:true},max:1,connectionTimeoutMillis:6500,idleTimeoutMillis:12000});
const ack=()=>console.log('No applicant names, email addresses, qualifications, or private notes were printed; no email was sent.');
async function summary(){
 const statements=Object.entries(records).map(([kind,c])=>
  "SELECT '"+kind+"' AS kind, COALESCE(t.status,'new') AS status, count(*)::int AS total,"+
  " count(*) FILTER (WHERE t.next_followup_at <= now() AND COALESCE(t.status,'new') NOT IN ('closed','declined','confirmed','approved'))::int AS due"+
  " FROM "+c.source+" r LEFT JOIN "+c.review+" t ON t.request_id=r.id"+
  " GROUP BY COALESCE(t.status,'new')").join(' UNION ALL ');
 const rows=await pool.query(statements+' ORDER BY kind,status');
 for(const r of rows.rows)console.log(r.kind+': '+r.status+' = '+r.total+' (follow-ups due: '+r.due+')');
 if(rows.rows.length===0)console.log('No stored intake records.');
 ack();
}
async function due(){
 for(const [kind,c] of Object.entries(records)){
  const result=await pool.query("SELECT t.request_id,t.status,t.next_followup_at FROM "+c.review+
    " t WHERE t.next_followup_at <= now() AND t.status NOT IN ('closed','declined','confirmed','approved') ORDER BY t.next_followup_at ASC LIMIT 100");
  console.log(kind+': '+result.rowCount+' due records (maximum 100 shown)');
  for(const row of result.rows)console.log('  '+row.request_id+' | '+row.status+' | '+row.next_followup_at.toISOString());
 }
 ack();
}
async function setStatus(){
 const kind=flags.get('--kind'),c=records[kind];
 const input=validate({
  kind,id:flags.get('--id'),status:flags.get('--status'),actor:flags.get('--actor'),
  action:flags.get('--next-action')||'',followup:flags.has('--followup-utc')?flags.get('--followup-utc'):'',
  verified:!!c && flags.get(c.proofFlag)===true
 });
 if(!flags.has('--next-action'))throw Error('Provide --next-action (may be empty to clear)');
 if(!flags.has('--followup-utc'))throw Error('Provide --followup-utc=YYYY-MM-DDTHH:MM:SSZ or --followup-utc= to clear');
 const client=await pool.connect();
 try{
  await client.query('BEGIN');
  const source=await client.query('SELECT id FROM '+input.config.source+' WHERE id=$1 FOR UPDATE',[input.id]);
  if(!source.rowCount)throw Error('No existing applicant matches the supplied kind and reference');
  const old=await client.query('SELECT status,next_action,next_followup_at,assigned_owner FROM '+input.config.review+' WHERE request_id=$1 FOR UPDATE',[input.id]);
  const previous=old.rows[0],newDate=input.followup?new Date(input.followup).getTime():null,oldDate=previous?.next_followup_at?new Date(previous.next_followup_at).getTime():null;
  if(previous&&previous.status===input.status&&previous.next_action===input.action&&oldDate===newDate&&previous.assigned_owner===input.actor){
   await client.query('COMMIT');console.log('No change; duplicate audit event skipped.');return;
  }
  await client.query('INSERT INTO '+input.config.review+
   ' (request_id,status,next_action,next_followup_at,assigned_owner) VALUES($1,$2,$3,$4,$5)'+
   ' ON CONFLICT (request_id) DO UPDATE SET status=EXCLUDED.status,next_action=EXCLUDED.next_action,'+
   'next_followup_at=EXCLUDED.next_followup_at,assigned_owner=EXCLUDED.assigned_owner,updated_at=now()',
   [input.id,input.status,input.action,input.followup,input.actor]);
  await client.query('INSERT INTO englishlegalese_intake_triage_audit (kind,request_id,previous_status,next_status,action_summary,operator_name,next_followup_at)'+
    ' VALUES($1,$2,$3,$4,$5,$6,$7)',
    [kind,input.id,previous?.status||null,input.status,input.action,input.actor,input.followup]);
  await client.query('COMMIT');
  console.log('Private intake review status recorded for '+kind+' reference '+input.id+' as '+input.status+'.');
  console.log('This does NOT contact the applicant, verify the classroom, approve a hiring decision or take a payment.');
 }catch(e){try{await client.query('ROLLBACK')}catch{}throw e}
 finally{client.release()}
 ack();
}
(async()=>{if(mode==='--summary')await summary();else if(mode==='--due')await due();else await setStatus()})()
.catch(e=>{console.error('Intake triage stopped safely: '+(/^(Status |Choose |Provide |Protected |Follow-up |Invalid |Action |No existing)/.test(e.message)?e.message:'database readiness or operation failure'));process.exitCode=1;})
.finally(()=>pool.end());
