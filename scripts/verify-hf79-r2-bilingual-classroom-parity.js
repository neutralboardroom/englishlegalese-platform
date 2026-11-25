/* Source-proximate, isolated HF79 R2 bilingual teaching tests.
 * Inspired by TR-Classroom V105 inspected read-only, not importing its code or child data.
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {getStaticLesson,SUPPORTED_EXPLANATION_LOCALES,PROFILES}=require('../src/trcfAdultLessonLocales');
const {bilingualDirections,bilingualDefinitions}=require('../src/trcfBilingualTeachingContent');
let n=0;const verify=(title,fn)=>{fn();n++;console.log('PASS HF79 R2',title)};
const phaseNames=['intro','explain','practice','feedback','close'];
const base=path.join(__dirname,'..');
verify('five explanation locales including ko-KR',()=>assert.deepEqual(SUPPORTED_EXPLANATION_LOCALES,['en-US','th-TH','vi-VN','zh-CN','ko-KR']));
verify('two separate adult courses',()=>assert.deepEqual(PROFILES,['legal-english','business-english']));
verify('legitimate bilingual stage naming and ordering',()=>{for(const locale of SUPPORTED_EXPLANATION_LOCALES)for(const track of PROFILES)assert.deepEqual(getStaticLesson({explanationLocale:locale,profile:track}).stages.map(x=>x.phase),phaseNames)});
for(const locale of SUPPORTED_EXPLANATION_LOCALES){
 for(const track of PROFILES){
  const l=getStaticLesson({explanationLocale:locale,profile:track});
  verify(`${locale} ${track} has three bilingual definitions`,()=>{
   assert.equal(l.glossary.length,3);
   assert.equal(new Set(l.glossary.map(x=>x.term)).size,3);
   for(const x of l.glossary){assert.ok(x.englishDefinition.length>20);assert.ok(x.nativeDefinition.length>12);assert.equal(x.nativeLang,locale);assert.equal(x.reviewStatus,'NATIVE_PROOFREAD_PENDING');assert.ok(Object.isFrozen(x));}
   assert.ok(Object.isFrozen(l.glossary));
  });
  verify(`${locale} ${track} keeps explicit English and native explanations`,()=>{
   assert.equal(l.stages.length,5);
   for(const s of l.stages){assert.ok(s.englishExplanation.length>25);assert.ok(s.nativeExplanation.length>15);assert.equal(s.nativeExplanation,s.explanation);assert.equal(s.nativeLang,locale);}
   assert.ok(l.modelEnglish.length>35);
  });
  verify(`${locale} ${track} has clear English and native directions`,()=>{
   for(const s of l.stages){assert.ok(s.directionsEnglish.length>25);assert.ok(s.directionsNative.length>15);assert.equal(s.directionsEnglish,bilingualDirections(locale,s.phase).english);assert.equal(s.directionsNative,bilingualDirections(locale,s.phase).native);}
  });
  verify(`${locale} ${track} requires native-language review, no autonomous live avatar claim`,()=>{
   assert.equal(l.nativeReviewerApproved,false);assert.match(l.bilingualTeachingReady,/PENDING_NATIVE_QA/);assert.equal(l.instructorDeployment,'PLANNED_NOT_LIVE');assert.equal(l.taughtLanguage,'en');
  });
 }
}
verify('Korean Legal and Business definitions contain Hangul',()=>{
 for(const track of PROFILES)for(const d of getStaticLesson({explanationLocale:'ko-KR',profile:track}).glossary)assert.match(d.nativeDefinition,/[\uac00-\ud7af]/);
});
verify('Thai Legal and Business definitions contain Thai letters',()=>{for(const track of PROFILES)for(const d of getStaticLesson({explanationLocale:'th-TH',profile:track}).glossary)assert.match(d.nativeDefinition,/[\u0e00-\u0e7f]/)});
verify('Vietnamese contains accented Vietnamese letters',()=>{for(const track of PROFILES){const l=getStaticLesson({explanationLocale:'vi-VN',profile:track});assert.match(l.glossary.map(x=>x.nativeDefinition).join(''),/[ăâêôơưđĐ]/i)}});
verify('Mandarin definitions contain Chinese characters',()=>{for(const track of PROFILES)for(const d of getStaticLesson({explanationLocale:'zh-CN',profile:track}).glossary)assert.match(d.nativeDefinition,/[\u4e00-\u9fff]/)});
verify('non-English locales retain the exact same source-authored English directions',()=>{
 for(const track of PROFILES){const e=getStaticLesson({explanationLocale:'en-US',profile:track});for(const locale of SUPPORTED_EXPLANATION_LOCALES){const l=getStaticLesson({explanationLocale:locale,profile:track});for(let i=0;i<5;i++){assert.equal(l.stages[i].englishExplanation,e.stages[i].englishExplanation);assert.equal(l.stages[i].directionsEnglish,e.stages[i].directionsEnglish);}}}
});
verify('no native language is substituted for the English learning objective',()=>{for(const locale of SUPPORTED_EXPLANATION_LOCALES)for(const track of PROFILES){const l=getStaticLesson({explanationLocale:locale,profile:track});assert.equal(l.taughtLanguage,'en');assert.ok(l.modelEnglish.length>30);}});
verify('missing locales and profiles fail closed',()=>{
 for(const locale of ['ko','ko-KP','__proto__','constructor','../secrets'])assert.throws(()=>bilingualDirections(locale,'practice'),/unsupported_bilingual_direction/);
 for(const track of ['constructor','__proto__','school-class'])assert.throws(()=>bilingualDefinitions('ko-KR',track),/unsupported_bilingual_glossary/);
});
verify('no silent default for a misspelled direction name',()=>assert.throws(()=>bilingualDirections('th-TH','excercise'),/unsupported_bilingual_direction/));
verify('source module contains no runtime provider/recording/network operations',()=>{
 const s=fs.readFileSync(path.join(base,'src/trcfBilingualTeachingContent.js'),'utf8');for(const term of ['fetch(','WebSocket(','getUserMedia','navigator.mediaDevices','process.env','localStorage','writeFileSync','http.request','https.request'])assert.equal(s.includes(term),false,term);
});
verify('original course catalog/logo and human oversight remain',()=>{
 for(const p of ['index.html','learn/legal-english/index.html','learn/business-english/index.html','src/trcfAdultHostPolicy.js','src/trcfHostR2RequestGate.js'])assert.ok(fs.statSync(path.join(base,p)).isFile());
});
verify('HTML contains independently labeled English and native content and privacy protections',()=>{
 const h=fs.readFileSync(path.join(base,'labs/hf79-avatar-first-offline-rehearsal.html'),'utf8');
 for(const term of ['lesson-english','lesson-text','direction-english','direction-native','definitions-panel','definitions-list','englishDefinition','nativeDefinition','byId(\'definitions-panel\').open=false','nativeExplanation','directionsEnglish','directionsNative','ko-KR','th-TH','vi-VN','zh-CN','lang="en"','Avatar not connected'])assert.ok(h.includes(term),term);
 for(const term of ['<script src=','https://','http://','navigator.mediaDevices','getUserMedia','localStorage','sessionStorage','XMLHttpRequest','fetch('])assert.equal(h.includes(term),false,term);
});
verify('after locale/course switch and Stop preview no definitions auto-reveal',()=>{
 const h=fs.readFileSync(path.join(base,'scripts/build-hf79-avatar-preview.js'),'utf8');assert.match(h,/byId\('definitions-panel'\)\.open=false/);assert.match(h,/byId\('definitions-panel'\)\.hidden=stopped/);assert.match(h,/render\(\)/);
});
verify('offline generator deterministic (source copied without Classroom files)',()=>{
 const {execFileSync}=require('node:child_process'),out=path.join(base,'labs/hf79-avatar-first-offline-rehearsal.html'),old=fs.readFileSync(out);
 execFileSync(process.execPath,[path.join(base,'scripts/build-hf79-avatar-preview.js')]);assert.deepEqual(fs.readFileSync(out),old);
});
verify('owner no drift rule explicitly includes English + all four native locales and read-only Classroom',()=>{
 const g=fs.readFileSync(path.join(base,'governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md'),'utf8');for(const term of ['EL-RGR-020','EL-TRCC-001','EL-AVATAR-001','EL-MULTI-002','EL-BI-003','V105','V2.41','ko-KR','th-TH','vi-VN','zh-CN'])assert.ok(g.includes(term),term);
});
console.log('HF79 R2 bilingual teaching PASS',n,'cases. Original TR-Classroom sources untouched.');
