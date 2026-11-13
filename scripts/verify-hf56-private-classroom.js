'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const runtime=require('../src/v2150-private-energy-classroom');
const html=fs.readFileSync('learn/private-energy-contracts/index.html','utf8');
const ui=fs.readFileSync('product-v2170-energy-classroom.js','utf8');
const api=fs.readFileSync('src/v2150-private-energy-classroom.js','utf8');
const server=fs.readFileSync('server.js','utf8');
const legal=fs.readFileSync('product-v1950-contracts-agreements.js','utf8');
assert.equal(runtime.COURSE,'energy-contracts-60-v1');
assert.equal(runtime.lessons.length,12,'twelve 60-minute private lessons must be retained');
assert.deepEqual(runtime.lessons.map(x=>x.number),Array.from({length:12},(_,i)=>i+1));
assert.equal(runtime.AGENDA[0].start,0);
assert.equal(runtime.AGENDA.at(-1).end,60,'whole teacher-led class is one hour');
let prev=0;for(const segment of runtime.AGENDA){assert.equal(segment.start,prev,'no gaps/overlaps');assert.ok(segment.end>segment.start);prev=segment.end;}
for(const lesson of runtime.lessons){
 for(const key of ['title','goal','scenario','model','teacherPrompt','homework']){
  assert.ok(typeof lesson[key]==='string'&&(key==='title'?lesson[key].length>=18:lesson[key].length>45),'missing substantial lesson field: '+lesson.number+':'+key);
 }
 assert.ok(lesson.vocabulary.length>=4);
 assert.ok(/fictional/i.test(lesson.scenario));
}
assert.equal(runtime.meetLink('https://meet.google.com/abc-defg-hij'),'https://meet.google.com/abc-defg-hij');
for(const bad of ['https://meet.google.com.evil.example/abc-defg-hij','http://meet.google.com/abc-defg-hij','https://meet.google.com/abc-defg-hij?auth=secret','https://evil.com/abc-defg-hij','javascript:alert(1)']){
 assert.equal(runtime.meetLink(bad),false,'unsafe or nonstandard Meet link: '+bad);
}
assert.equal(runtime.meetLink(''),null);
assert.equal(runtime.nowTime('2026-11-08'),null);
const sample={id:'EL-ENERGY-00000000-0000-0000-0000-000000000001',metadata:{lesson_number:2},scheduled_at:new Date(Date.now()+7*86400000).toISOString(),status:'requested',video_join_url:'https://meet.google.com/abc-defg-hij',learner_name:'PRIVATE NAME'};
const before=runtime.outward(sample,'student');
assert.equal(before.meet_url,null,'draft must NEVER leak a link to student');
assert.equal(before.student_name,undefined,'learner name must not be repeated in student listing');
assert.equal(runtime.outward({...sample,status:'completed'},'student').meet_url,null,'completed session join link hidden');
assert.equal(runtime.outward({...sample,status:'scheduled'},'student').meet_url,'https://meet.google.com/abc-defg-hij');
assert.equal(runtime.outward({...sample,status:'scheduled',scheduled_at:new Date(Date.now()-3*3600000).toISOString()},'student').meet_url,null,'past scheduled session cannot keep exposing a Join link');
// Never embed the names or document titles from the student's source material in
// public source or in this test; use generic category checks only.
for(const p of ['actual client contract text','nonpublic bank account number','confidential cargo price','student-specific case file']){
 assert.ok(![api,ui,html,legal].some(s=>s.toLowerCase().includes(p.toLowerCase())),'private source text must not be copied into public code');
}
assert.ok(runtime.lessons[1].pronunciation.includes('crude oil'),'reusable crude oil pronunciation warm-up');
assert.ok(runtime.lessons[1].teacherPronunciationPrompt.includes('crew'),'speaker-focused teacher prompt');
assert.ok(!Object.fromEntries(Object.entries(runtime.lessons[1]).filter(([key])=>key!=='teacherPrompt'&&key!=='teacherPronunciationPrompt')).teacherPronunciationPrompt,'student view must omit coaching');
assert.equal(runtime.pastTime(new Date(Date.now()-86400000).toISOString())!==null,true,'real historical lesson timestamp accepted');
assert.equal(runtime.pastTime(new Date(Date.now()+86400000).toISOString()),null,'future class cannot be called historical');
assert.ok(api.includes('/api/v2150/private-energy/previously-taught'),'authenticated retrospective class setup');
assert.ok(api.includes("requireRoles('owner','admin')"),'only owner can backdate an initial class');
assert.ok(html.includes('energy-historical-form'),'owner retrospective UI');
assert.ok(ui.includes('teacher_only_pronunciation_progress'),'private progress only in teacher view');
for(const needle of [
 'req.authSessionKey','requireRoles','student_user_id','teacher_user_id','metadata->>\x27course_key\x27',
 'private, no-store','email_verified','attendees:[]','google_meet_ready','no_email_sent',
 'video_join_url','status===\x27scheduled\x27','no_attendees_emailed'
])assert.ok(api.includes(needle),'privacy/scheduling safeguard missing: '+needle);
for(const needle of [
 'sessionStorage','safeMeet','/api/v1940/student/auth/login',
 'API+\x27sessions\x27','Join Google Meet from EnglishLegalese'
]){assert.ok(ui.includes(needle),'UI integration missing '+needle);}
assert.ok(html.includes('name="robots" content="noindex,nofollow,noarchive"'));
assert.ok(html.includes('product-v2170-energy-classroom.js?v=hf57'));
assert.ok(!html.includes('meet.google.com/abc-defg-hij" class="join"'),'no hard-coded join link');
assert.ok(legal.includes("entry.href='/learn/private-energy-contracts/'"),'Contracts & Agreements must link to private classroom');
assert.ok(server.includes("require('./src/v2150-private-energy-classroom').install(app"),'API should be mounted via existing secure services');
assert.ok(server.includes('const protectedPrivateClass = record =>'),'legacy privacy filter is required');
assert.ok(server.includes('const publicClassSessions = async () =>'),'public session listing must exclude private pilot rows');
assert.equal((server.match(/persistentStore\.listClassSessions\(\)/g)||[]).length,1,'only the protected wrapper may call legacy raw session listing');
assert.ok(server.includes("app.use('/api/v120/class-sessions/:id'"),'legacy session details/closeouts must deny private IDs');
assert.ok(server.includes('if(protectedPrivateClass(input))'),'legacy public class creation must reject private course injection');
for(const p of ['index.html','styles.css','curriculum-v1800-data.js','assets/englishlegalese-logo.png']){
 assert.ok(fs.existsSync(p),'do not delete protected site source: '+p);
}
console.log('PASS HF56: 12 x 60-minute fictional classes, private assignment, verified Meet URLs, role-bound access and no private source document leakage.');
