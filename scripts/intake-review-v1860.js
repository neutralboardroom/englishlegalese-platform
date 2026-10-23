'use strict';
// Private owner-side review only: no public endpoint, no applicant notifications and no mutation.
const {Pool}=require('pg');
(async()=>{
 const url=process.env.ENGLISHLEGALESE_INTAKE_DATABASE_URL;
 if(!url){console.error('Set the dedicated EnglishLegalese intake DB URL in a private terminal to review the queue.');process.exitCode=2;return;}
 const pool=new Pool({connectionString:url,ssl:{rejectUnauthorized:true},max:1,connectionTimeoutMillis:7000});
 try{
  for(const [name,table] of [['Class enrollment requests','englishlegalese_enrollment_requests'],['Teacher applications','englishlegalese_teacher_applications']]){
   const r=await pool.query('SELECT count(*)::int AS total, count(*) FILTER(WHERE created_at >= now()-interval \'24 hours\')::int AS last_24h FROM '+table);
   const q=await pool.query('SELECT id, created_at'+(name.startsWith('Class')?',program,format,schedule_id':',teaching_track')+' FROM '+table+' ORDER BY created_at DESC LIMIT 15');
   console.log('\n'+name+': '+r.rows[0].total+' total; '+r.rows[0].last_24h+' created in last 24h');
   console.table(q.rows.map(row=>({...row,created_at:new Date(row.created_at).toISOString()})));
  }
  console.log('\nThis read-only report does not track replies or send notifications. Match IDs to authorized private follow-up records before contacting anyone.');
 }catch(e){console.error('Unable to review intake tables; confirm access and database setup.');process.exitCode=1;}finally{await pool.end();}
})();
