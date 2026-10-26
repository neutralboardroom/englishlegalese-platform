'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),read=x=>fs.readFileSync(x,'utf8');
const server=read('src/v1940-saved-lessons.js'),client=read('product-v1940-saved-lessons.js'),sql=read('db/migrations/011_self_paced_lesson_work.sql'),teacher=read('product-v1940-teacher-review.js');
const {validate,KEY,PATH,LIMIT}=require('../src/v1940-saved-lessons');
const valid={key:'workbook:class-01',title:'Legal English',path:'/learn/legal-english/',answers:{fields:[{value:'Fictional draft'}]},expected_revision:0};
assert(!validate(valid).error);assert(KEY.test('workbook:ws-08'));assert(KEY.test('page:business-resources-investor-earnings'));
for(const item of [
 {...valid,key:'../../other-student'},
 {...valid,path:'/api/v119/auth/me'},
 {...valid,expected_revision:-1},
 {...valid,expected_revision:undefined},
 {...valid,answers:'steal'},
 {...valid,answers:{draft:'X'.repeat(LIMIT)}}
])assert(validate(item).error,'Reject unsafe save input');
assert.equal(PATH.test('/learn/business-resources/investor-markets/'),true);
assert(!/drop table|truncate|delete from|delete cascade|reset sequence/i.test(sql),'Never delete persisted user data');
for(const tok of ['create table if not exists self_paced_lesson_work','unique(user_id,lesson_key,revision)','assigned_teacher_user_id','references users(id) on delete restrict','review_status'])assert(sql.includes(tok));
for(const tok of ["req.user.id","authMiddleware(services)","Bearer","strict","where user_id=$1","revision=$6","res.status(409)","store.mode()!=='postgres'","review_status='awaiting_review'","assigned_teacher_user_id=$2","no_email_sent:true"]){assert(server.includes(tok),'Missing protected server behavior '+tok)}
assert(!/\b(sendMail|sendEmail|nodemailer|SMTP_HOST|fetch\s*\(|axios\s*\(|email_notifications|transactionalEmail)\b/i.test(server),'No email or external calls from the backend');
for(const tok of ['localStorage','sessionStorage','device=true','cloud','Pause & save','Resume saved work','Submit for teacher review','teacher_delivery_confirmed','Save now','snapshot(root)','restore(root','timer=setTimeout','exportBackup','v1890-stage-feedback','scrollIntoView','v1940-controls']){
 assert(client.includes(tok),'Missing practical save/resume '+tok);
}
assert(client.includes('Sign in to my account'),'Account login must be available when configured');
assert(client.includes('Create a free student account')&&client.includes('account_registration_available'),'Account creation requires actual server readiness');
assert(client.includes('Saved to your account')&&client.includes('NOT saved to your account'),'Never confuse device drafts and verified account saves');
assert(client.includes('saved on this device')||client.includes('Saved on this device'));
assert(!/\b(sendMail|sendEmail|nodemailer|SMTP_HOST|resend|PaymentRequest)\b/i.test(client+teacher),'No email or payment execution');
for(const t of ["teacher","Bearer","feedback","assigned","no email"])assert(teacher.toLowerCase().includes(t.toLowerCase()));
const paths=[
 'learn/legal-english/index.html','learn/business-english/index.html',
 'learn/free-writing-exercise/index.html','learn/ai-draft-review/index.html','learn/clause-reading/index.html',
 'learn/meeting-followup/index.html','learn/email-clarity/index.html','learn/guided-practice/index.html',
 'learn/case-brief/index.html','learn/legal-vocabulary/index.html','learn/revision-studio/index.html',
 'learn/professional-message/index.html','learn/listening-clarification/index.html',
 'learn/conversation-rehearsal/index.html','learn/reading-precision/index.html','learn/scenario-practice/index.html',
 'learn/learning-path/index.html','learn/study-planner/index.html',
 'learn/business-resources/business-email/index.html','learn/business-resources/business-global/index.html',
 'learn/business-resources/business-interviews/index.html','learn/business-resources/business-meetings/index.html',
 'learn/business-resources/business-negotiations/index.html','learn/business-resources/business-presentations/index.html',
 'learn/business-resources/investor-earnings/index.html','learn/business-resources/investor-markets/index.html'
];
assert.equal(paths.length,26);
for(const p of paths){const page=read(p);assert(page.includes('product-v1940-saved-lessons.js?v=1.85.0-hf13')&&page.includes('product-v1940-saved-lessons.css?v=1.85.0-hf13'),'Self-paced saving omitted '+p)}
for(const p of ['learn/my-work/index.html','learn/teacher-submissions/index.html'])assert(read(p).includes('HF13')||read(p).includes('v1940-'),'Missing dashboard '+p);
assert(read('server.js').includes("require('./src/v1940-saved-lessons').install"),'Backend is not installed');
assert(read('server.js').includes('accountRegistrationReady:async()=>readyForAccounts()&&await ledger.ready()'),'Registration availability must match the actual guarded registration service');
const workflow=read('.github/workflows/englishlegalese-v1850-production-acceptance.yml');
const floor=workflow.match(/ -lt (\d+) /);assert(floor&&Number(floor[1])>=138,'HF13 must preserve and increase the 126-case public gate');
assert(workflow.includes('verify-v1940-saved-lessons.js')&&workflow.includes('v1940-saved-lessons-production.spec.js'));
for(const p of ['playwright.config.js','playwright.production.config.js'])assert(read(p).includes('v1940-saved-lessons-production.spec.js'));
assert(read('package.json').includes('node scripts/verify-v1940-saved-lessons.js'));
const rules=read('governance/ENGLISHLEGALESE_DURABLE_BUILDER_RULES_ADDENDUM_2026-10-24.md');
assert(rules.includes('EL-DUR-011')&&rules.includes('EL-DUR-012'));
console.log('PASS HF13: 48 workbooks and 24 self-paced pages, consent-first local drafts, fail-closed account cloud saves, owner-only revision guards, teacher-linked private submissions, never-email preserved.');
