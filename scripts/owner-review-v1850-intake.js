'use strict';
// Run from a private operator shell only: npm run owner:intake:review -- [--export=/absolute/private/path.csv --acknowledge-personal-data]
// Never send personally identifying learner/teacher records to a public API, an application log or a GitHub artifact.
const {Pool}=require('pg'),fs=require('node:fs'),path=require('node:path');
const args=process.argv.slice(2);const exportArg=args.find(x=>x.startsWith('--export='));
const acknowledged=args.includes('--acknowledge-personal-data');
if(exportArg&&!acknowledged){console.error('Personal-data export requires --acknowledge-personal-data; choose a private secured path.');process.exit(2);}
if(!process.env.ENGLISHLEGALESE_INTAKE_DATABASE_URL){console.error('EnglishLegalese intake database not configured in this private shell. Nothing was read.');process.exit(2);}
const pool=new Pool({connectionString:process.env.ENGLISHLEGALESE_INTAKE_DATABASE_URL,ssl:{rejectUnauthorized:true},connectionTimeoutMillis:6500,max:1});
const esc=v=>{let s=String(v??'').replace(/\r|\n/g,' ');if(/^[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
(async()=>{
 const [students,teachers]=await Promise.all([
 pool.query('select id, full_name, email, program, format, schedule_id, note, created_at from englishlegalese_enrollment_requests order by created_at desc limit 500'),
 pool.query('select id, full_name, email, teaching_track, qualifications, timezone, weekly_availability, created_at from englishlegalese_teacher_applications order by created_at desc limit 500')
 ]);
 console.log('EnglishLegalese intake review — stored enrollment requests: '+students.rowCount+'; teacher applications: '+teachers.rowCount+' (up to 500 each).');
 console.log('Review daily; validate eligibility and individual consent before contacting; avoid duplicate follow-ups. Automatic owner email alerts are NOT configured.');
 if(exportArg){
   const dest=path.resolve(exportArg.slice('--export='.length));if(!dest.endsWith('.csv'))throw Error('Export must use an explicit .csv filename');
   const cols=['kind','id','full_name','email','program_or_track','format','schedule_or_timezone','notes_or_qualifications','availability','created_at_utc','review_status','followup_owner','next_action','last_contact_utc','next_followup_utc'];
   const rows=[...students.rows.map(v=>['enrollment',v.id,v.full_name,v.email,v.program,v.format,v.schedule_id,v.note,'',v.created_at,'new','','','','']),...teachers.rows.map(v=>['teacher',v.id,v.full_name,v.email,v.teaching_track,'',v.timezone,v.qualifications,v.weekly_availability,v.created_at,'new','','','',''])];
   const data=[cols.map(esc).join(','),...rows.map(row=>row.map(esc).join(','))].join('\r\n')+'\r\n';
   const fd=fs.openSync(dest,'wx',0o600);try{fs.writeFileSync(fd,data,{encoding:'utf8'});}finally{fs.closeSync(fd);}
   console.log('Private export created at '+dest+' (owner-controlled file, restrictive permissions). Delete/archive according to retention policy.');
 }
})().catch(e=>{console.error('Intake review could not complete: '+(e.code||'database/file error'));process.exitCode=1;}).finally(()=>pool.end());
