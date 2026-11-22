'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const tool=fs.readFileSync('product-v2180-energy-live-conductor.js','utf8');
const html=fs.readFileSync('learn/private-energy-contracts/index.html','utf8');
const ui=fs.readFileSync('product-v2170-energy-classroom.js','utf8');
const api=fs.readFileSync('src/v2150-private-energy-classroom.js','utf8');
const script=fs.readFileSync('scripts/verify-hf57-class-readiness.js','utf8');
const test=fs.readFileSync('tests/hf57-private-live-conductor.spec.js','utf8');
const course=require('../src/v2150-private-energy-classroom');
assert.equal(course.lessons.length,12);
assert.equal(course.AGENDA[0].start,0);
assert.equal(course.AGENDA.at(-1).end,60);
assert.ok(course.AGENDA.length===6);
const scope=['product-v2180-energy-live-conductor.js?v=hf57','product-v2170-energy-classroom.js?v=hf57'];
for(const path of scope)assert.ok(html.includes(path),'private classroom must load both local scripts');
assert.ok(html.indexOf(scope[0])<html.indexOf(scope[1]),'conductor code must be ready before lesson rendering');
assert.ok(html.includes('energy-live-clock'),'timer styles only on private page');
assert.ok(!fs.readFileSync('index.html','utf8').includes('hf57'),'homepage must remain protected');
assert.ok(!fs.readFileSync('styles.css','utf8').includes('energy-live-conductor'),'no global CSS changes');
assert.ok(ui.includes('EnglishLegaleseEnergyLiveConductorV1?.mount(card,{lesson,role,agenda})'),'lesson conductor is mounted only after protected lesson data loaded');
assert.ok(ui.includes("API+'sessions/'+encodeURIComponent(row.id)+'/readiness'"),'readiness must use authenticated per-session endpoint');
for(const s of [
 'function mount(card,{lesson,role,agenda}',"role!=='student'&&lesson.teacherPrompt",
 "role!=='student'&&lesson.teacherPronunciationPrompt",
 "document.createElement","setInterval(tick,1000)","deadline=Date.now()+remaining*1000",
 "stopTick()", "clock.setAttribute('role','timer')","current.setAttribute('aria-live','polite')",
 'No recording, automatic scoring, session booking','The optional timer stays in this browser tab.',
 'start.addEventListener','pause.addEventListener','resetTime.addEventListener'
])assert.ok(tool.includes(s),'teacher-led local conductor feature missing: '+s);
for(const forbidden of [
 'localStorage','sessionStorage','indexedDB','MediaRecorder','SpeechRecognition','getUserMedia',
 'XMLHttpRequest','sendBeacon','WebSocket','fetch(','postMessage(','navigator.mediaDevices',
 'innerHTML','navigator.clipboard'
])assert.ok(!tool.includes(forbidden),'conductor may not collect, persist, network or inject private data: '+forbidden);
for(const needle of [
 "app.get('/api/v2150/private-energy/sessions/:id/readiness',guard,ready",
 'const row=await accessible(req,req.params.id)',
 "row.teacher_user_id===req.user.id",
 "class_time_confirmed:hasStart",
 "meeting_link_ready:providerReady",
 "recording_enabled:false",
 "client_documents_shared:false",
 "return reply(res,404"
])assert.ok(api.includes(needle),'readiness owner/auth check missing: '+needle);
assert.ok(!api.slice(api.indexOf("app.get('/api/v2150/private-energy/sessions/:id/readiness'"),api.indexOf(" const managers=requireRoles")).includes('meet_url:'),'safe readiness must not return a Meet URL');
for(const s of ['other-student-token','status,404','NEVER_ECHO_THIS_MARKER','assert.equal(writes,0)','assert.equal(done.body.state'])assert.ok(script.includes(s),'integration access regression missing '+s);
for(const s of ['energy-live-conductor','Check class readiness','Start or resume timer','Teacher-only buyer/counsel prompts'])assert.ok(test.includes(s),'browser role/interaction checks missing '+s);
console.log('PASS HF57: 12 complete 60-minute role-scoped speaking labs, no recording/persistence, authenticated readiness and independent browser/integration checks.');
