/* HF80: fail-closed deterministic teaching rehearsal qualification. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const {getPracticeSet,REVIEW_STATUS}=require('../src/trcfAdultDecisionPractice');
const {SUPPORTED_EXPLANATION_LOCALES,PROFILES,getStaticLesson}=require('../src/trcfAdultLessonLocales');
const root=path.resolve(__dirname,'..');
let count=0;
function check(name,action){action();console.log('PASS HF80',name);count++;}
check('fixed five explanation locales',()=>assert.deepEqual(SUPPORTED_EXPLANATION_LOCALES,['en-US','th-TH','vi-VN','zh-CN','ko-KR']));
check('two professional adult tracks',()=>assert.deepEqual(PROFILES,['legal-english','business-english']));
check('draft professional/native signoff still required',()=>assert.match(REVIEW_STATUS,/DRAFT.*REVIEW_REQUIRED/));
for(const locale of SUPPORTED_EXPLANATION_LOCALES)for(const profile of PROFILES){
 check(`${locale}/${profile}: stable bilingual two-question set`,()=>{
  const q=getPracticeSet({profile,explanationLocale:locale});assert.equal(q.length,2);assert.ok(Object.isFrozen(q));
  assert.equal(new Set(q.map(x=>x.id)).size,2);
  for(const item of q){assert.ok(Object.isFrozen(item));assert.ok(Object.isFrozen(item.options));assert.equal(item.options.length,2);
   assert.ok(Number.isInteger(item.correctOptionIndex));assert.ok(item.correctOptionIndex>=0&&item.correctOptionIndex<item.options.length);
   assert.ok(item.englishPrompt.length>50);assert.ok(item.rationaleEnglish.length>50);assert.ok(item.rationaleNative.length>20);
   assert.equal(item.nativeLang,locale);assert.equal(item.taughtLanguage,'en');assert.equal(item.gradingMode,'SCRIPTED_OPTION_MATCH_ONLY');
   assert.equal(item.nativeReviewerApproved,false);assert.equal(item.studentStorage,false);assert.equal(item.teacherReviewRequired,true);
  }
 });
 check(`${locale}/${profile}: explanations keep same English original`,()=>{
  const english=getPracticeSet({profile,explanationLocale:'en-US'});
  const translated=getPracticeSet({profile,explanationLocale:locale});
  translated.forEach((q,i)=>{assert.equal(q.id,english[i].id);assert.equal(q.englishPrompt,english[i].englishPrompt);
    assert.deepEqual(q.options,english[i].options);assert.equal(q.rationaleEnglish,english[i].rationaleEnglish);});
 });
 check(`${locale}/${profile}: prior five-stage bilingual content preserved`,()=>{
  const lesson=getStaticLesson({profile,explanationLocale:locale});assert.equal(lesson.stages.length,5);
  assert.equal(lesson.stages[2].phase,'practice');assert.ok(lesson.stages[2].directionsEnglish.length>20);
  assert.ok(lesson.stages[2].directionsNative.length>15);
 });
}
check('non-English rationales have appropriate scripts',()=>{
 for(const [locale,re] of [['th-TH',/[\u0e00-\u0e7f]/],['vi-VN',/[ăâêôơưđĐ]/i],['zh-CN',/[\u4e00-\u9fff]/],['ko-KR',/[\uac00-\ud7af]/]])for(const track of PROFILES)
  for(const q of getPracticeSet({profile:track,explanationLocale:locale}))assert.match(q.rationaleNative,re);
});
check('invalid locale/profile fail closed',()=>{
 for(const bad of ['ko','ko-KP','__proto__','constructor','th','../private'])assert.throws(()=>getPracticeSet({profile:'legal-english',explanationLocale:bad}),/unsupported_explanation_locale/);
 for(const bad of ['__proto__','school-class','constructor','legal-english/../../'])assert.throws(()=>getPracticeSet({profile:bad,explanationLocale:'th-TH'}),/unsupported_professional_track/);
});
check('script contains no runtime external connections, data persistence, or child scope',()=>{
 const js=fs.readFileSync(path.join(root,'src/trcfAdultDecisionPractice.js'),'utf8');
 for(const term of ['fetch(','XMLHttpRequest','WebSocket(','getUserMedia','process.env','localStorage','sessionStorage','http.request','https.request','writeFileSync','pupilName'])assert.equal(js.includes(term),false,term);
});
check('new preview explicitly discloses unconnected avatar and scripted answer limits',()=>{
 const html=fs.readFileSync(path.join(root,'labs/hf80-interactive-adult-practice-offline.html'),'utf8');
 for(const text of ['Avatar not connected','No microphone','No answer is stored or sent','not an AI assessment','practice-feedback','practice-reveal','rationaleNative','Check my choice','English model:','lang="en"'])assert.ok(html.includes(text),text);
 for(const unsafe of ['<script src=','https://','http://','navigator.mediaDevices','getUserMedia','localStorage','sessionStorage','XMLHttpRequest','fetch('])assert.equal(html.includes(unsafe),false,unsafe);
});
check('no automatic answer exposure before check or reveal',()=>{
 const js=fs.readFileSync(path.join(root,'scripts/build-hf80-adult-practice.js'),'utf8');
 assert.match(js,/practice-feedback'\)\.hidden=true/);assert.match(js,/function showPracticeFeedback\(revealed\)/);
 assert.match(js,/if\(!revealed&&!selected\)/);assert.match(js,/if\(!stopped&&step!==2\)|if\(stopped\|\|step!==2\)/);
});
check('generated new preview is deterministic',()=>{
 const f=path.join(root,'labs/hf80-interactive-adult-practice-offline.html');const before=fs.readFileSync(f);
 execFileSync(process.execPath,[path.join(root,'scripts/build-hf80-adult-practice.js')]);assert.deepEqual(fs.readFileSync(f),before);
});
check('all existing original product assets and HF79 preview still intact',()=>{
 for(const p of ['index.html','learn/legal-english/index.html','learn/business-english/index.html','labs/hf79-avatar-first-offline-rehearsal.html','governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md','src/trcfBilingualTeachingContent.js'])assert.ok(fs.statSync(path.join(root,p)).isFile(),p);
});
console.log(`HF80 independent scripted-practice source checks PASS ${count} cases`);
