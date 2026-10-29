'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const js=fs.readFileSync('product-v1940-saved-lessons.js','utf8');
const a=js.indexOf('// HF17 study report pure helper BEGIN');
const b=js.indexOf('// HF17 study report pure helper END',a);
assert(a>0&&b>a,'HF17 pure study-report logic exists');
const context={};vm.createContext(context);
vm.runInContext(js.slice(a,b)+';this.studyReport=studyReport;',context);
const summary=context.studyReport([
 {key:'workbook:class-01',title:'Contract\nReview',status:'draft',updated_at:'2026-10-28T10:00:00Z',answers:{fields:['DO NOT EXPORT ANSWERS']}},
 {key:'workbook:class-02',title:'Business meetings',status:'submitted',updated_at:'2026-10-29T12:00:00Z',teacher_feedback:'DO NOT EXPORT FEEDBACK'}
],'This device');
assert.match(summary,/Saved lessons shown: 2/);
assert.match(summary,/Drafts: 1; submitted for teacher review: 1/);
assert.match(summary,/DRAFT \| Contract Review/);
assert.match(summary,/SUBMITTED \| Business meetings/);
assert(!summary.includes('DO NOT EXPORT ANSWERS')&&!summary.includes('DO NOT EXPORT FEEDBACK'));
assert(!summary.includes('Contract\nReview'),'Untrusted line breaks must not corrupt exported rows');
assert.match(summary,/NOT a full lesson backup/);
assert(js.includes('Continue my most recent draft'));
assert(js.includes('Download study overview (.txt)'));
assert(js.includes("if(!confirm('Download a private text summary"),'Export requires explicit opt-in');
assert(js.includes('host.append(studyActions,toolbar,summary,list)'));
assert(fs.readFileSync('learn/my-work/index.html','utf8').includes('product-v1940-saved-lessons.js?v=1.85.5-hf19'),'Fresh student dashboard must be loaded');
assert(fs.readFileSync('index.html','utf8').includes('<meta name="englishlegalese-release" content="1.85.5" />'),'Homepage release marker matches actual version');
assert.equal(require('../package.json').version,'1.85.5');
console.log('PASS HF17: private draft next-step, explicit metadata-only progress download, no answers or teacher feedback, sanitized report, release marker.');
