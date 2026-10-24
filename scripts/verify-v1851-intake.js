'use strict';
// Source and policy checks only. No database, applicant data, provider calls, or messages.
const assert=require('node:assert/strict'),fs=require('node:fs');
const {records,isUUID,parseFollowup,validate}=require('../src/v1851-intake-triage-policy');
const sql=fs.readFileSync('db/intake/v1851-triage.sql','utf8');
const cli=fs.readFileSync('scripts/owner-triage-v1851-intake.js','utf8');
const id='a1234567-1234-4234-8234-123456789abc';
assert(isUUID(id));assert(!isUUID('not-an-id'));assert(!isUUID('abc;DROP TABLE users'));
assert.equal(parseFollowup(''),null);
assert.equal(parseFollowup('2026-11-02T09:00:00Z'),'2026-11-02T09:00:00Z');
for(const invalid of ['2026-02-31T01:00:00Z','2026-11-02T00:00:00+07:00','junk','2026-11-02T09:00:00.000Z'])assert.throws(()=>parseFollowup(invalid));
const record={kind:'enrollment',id,status:'reviewing',actor:'owner',action:'Verify availability',followup:'2026-11-02T09:00:00Z',verified:false};
assert.equal(validate(record).config.source,'englishlegalese_enrollment_requests');
assert.throws(()=>validate({...record,status:'confirmed'}),/verified-class-place/);
assert.equal(validate({...record,status:'confirmed',verified:true}).status,'confirmed');
assert.throws(()=>validate({...record,kind:'teacher',status:'approved'}),/verified-qualifications/);
assert.equal(validate({...record,kind:'teacher',status:'approved',verified:true}).status,'approved');
assert.throws(()=>validate({...record,kind:'other'}));
assert.throws(()=>validate({...record,action:'line 1\nline 2'}));
assert.throws(()=>validate({...record,actor:'x'}));
for(const [kind,c] of Object.entries(records)){
 assert(sql.includes('CREATE TABLE IF NOT EXISTS '+c.review));
 assert(sql.includes('REFERENCES '+c.source+'(id) ON DELETE RESTRICT'));
 assert(cli.includes(c.source)&&cli.includes(c.review));
 assert(c.statuses.includes('new')&&c.statuses.includes('closed'));
}
for(const text of ['englishlegalese_intake_triage_audit','FOR UPDATE','ROLLBACK','--acknowledge-personal-data','ENGLISHLEGALESE_INTAKE_DATABASE_URL','rejectUnauthorized:true','--verified-class-place','--verified-qualifications'])assert(cli.includes(text),'Missing guard '+text);
assert(!/\b(?:DROP\s+TABLE|TRUNCATE|DELETE\s+FROM|ALTER\s+TABLE)\b/i.test(sql));
assert(!/(?:sendResendEmail|sendMail|stripe\.|fetch\(|app\.post\(|express\(|process\.env\.DATABASE_URL\b)/.test(cli));
assert(sql.includes('BEGIN;')&&sql.includes('COMMIT;'));
console.log('PASS private v1.85.1 intake triage: validated statuses and UTC dates, additive isolated DB tables, auditable owner-only workflows; no public routes, emails or payments.');
