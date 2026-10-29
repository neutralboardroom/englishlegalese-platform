'use strict';
// HF15.6 strict offline validation, no production DB writes, mails or network.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const js=fs.readFileSync('product-v1940-saved-lessons.js','utf8');
const start=js.indexOf('const RESTORE_KEY='),end=js.indexOf("restoreDevice.addEventListener('click'",start);
assert(start>0&&end>start,'Restore parser must be present');
const snippet=js.slice(start,end);
const context={Blob,Date,Error};
vm.createContext(context);
vm.runInContext(snippet+';this.validate=parseRestorableBackup;',context);
const validate=context.validate;
const row={lesson_key:'workbook:fictional-001',lesson_title:'Fictional workbook',origin_path:'/learn/legal-english/',updated_at:'2026-10-26T00:00:00Z',answers:{fields:[{i:0,t:'TEXTAREA',kind:'textarea',name:'exercise',value:'This is fictional.'}],openDetails:[true]}};
function cloud(rows=[row],overrides={}){return {format:'EnglishLegalese student cloud backup',schema_version:1,complete:true,submissions:[],saved_lessons:rows,...overrides};}
function reject(payload,message){
 assert.throws(()=>validate(payload),/backup|lesson|response|unsupported|exceed|duplicate|complete|invalid|unrecognized/i,message);
}
const ok=validate(cloud());
assert.equal(ok.length,1);assert.equal(ok[0].key,'workbook:fictional-001');
const parsed=JSON.parse(ok[0].data);
assert.equal(parsed.answers.fields[0].value,'This is fictional.');
assert(!JSON.stringify(parsed).includes('password'),'No credentials in recovered draft');
assert(!Object.hasOwn(parsed,'teacher_feedback'),'Teacher feedback remains only in original backup');
const single={format:'EnglishLegalese HF13 self-paced lesson backup',lesson:row.lesson_key,title:row.lesson_title,path:row.origin_path,answers:row.answers,exported_at:'2026-10-26T00:00:00Z'};
assert.equal(validate(single).length,1,'Legacy single-lesson backups supported');
reject(cloud([row],{complete:false}),'Must refuse partial cloud backup');
reject(cloud([row],{schema_version:3}),'Must refuse unknown schema versions');
reject(cloud([row],{submissions:'not an array'}),'Must validate data structure');
reject(cloud([row,{...row}]),'Must refuse duplicate lesson identifiers');
reject(cloud([{...row,origin_path:'https://external.test/'}]),'Reject external origin');
reject(cloud([{...row,origin_path:'/learn//unsafe/'}]),'Reject path ambiguity');
reject(cloud([{...row,lesson_key:'../../admin'}]),'Reject forged key');
reject(cloud([{...row,answers:{fields:[{i:0,t:'TEXTAREA',kind:'textarea',name:'x',value:{nested:true}}]}}]),'Reject nested value payload');
reject(cloud([{...row,answers:{fields:[{i:0,t:'TEXTAREA',kind:'textarea',name:'x',value:'x'.repeat(70000)}]}}]),'Reject payload exceeding per-lesson size');
reject({format:'untrusted import',saved_lessons:[row]},'Reject unknown format');
assert(js.includes('if(localStorage.getItem(PREFIX+item.key)!==null)'),'Preserve all earlier device drafts');
assert(js.includes('for(const key of added)'),'Rollback new draft writes on failed import');
assert(js.includes('if(token||!isHub)'),'Must sign out for device-only recovery');
assert(js.includes('file.size>8*1024*1024'),'Cap source file at 8MB');
assert(js.includes('No email or upload occurred.'),'Disclose device-only processing');
assert(!snippet.includes('fetch(')&&!snippet.includes('XMLHttpRequest'),'Validation is offline');
assert(fs.readFileSync('learn/my-work/index.html','utf8').includes('product-v1940-saved-lessons.js?v=1.85.12-hf26'),'Student dashboard must load fresh recovery');
console.log('PASS HF15.6 offline parser: V13 and HF13 backups, identity-free device restore, 10 malformed/oversized/unsafe input rejection cases, no cloud merge or email.');
