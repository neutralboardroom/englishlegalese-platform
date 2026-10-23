'use strict';
// Explicit, fail-closed migration: NEVER fall back to another project's DATABASE_URL.
const fs=require('node:fs');
const path=require('node:path');
const {Pool}=require('pg');
async function main(){
 const url=process.env.ENGLISHLEGALESE_INTAKE_DATABASE_URL;
 if(!url){console.error('Dedicated ENGLISHLEGALESE_INTAKE_DATABASE_URL is required; no migration attempted.');process.exitCode=1;return}
 const pool=new Pool({connectionString:url,ssl:{rejectUnauthorized:true},max:1,connectionTimeoutMillis:6500});
 try{
  const sql=fs.readFileSync(path.join(__dirname,'..','db','intake','v1850-intake.sql'),'utf8');
  await pool.query(sql);
  await pool.query('SELECT id FROM englishlegalese_enrollment_requests LIMIT 0');
  await pool.query('SELECT id FROM englishlegalese_teacher_applications LIMIT 0');
  console.log('EnglishLegalese dedicated v1.85 intake schema verified (no applicant records read).');
 }finally{await pool.end()}
}
main().catch(()=>{console.error('Dedicated EnglishLegalese intake migration failed; inspect database access and TLS.');process.exitCode=1});
