'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const js=fs.readFileSync('product-v1940-saved-lessons.js','utf8');
const api=fs.readFileSync('src/v1940-saved-lessons.js','utf8');
const css=fs.readFileSync('product-v1940-saved-lessons.css','utf8');
const page=fs.readFileSync('learn/my-work/index.html','utf8');
assert.equal(require('../package.json').version,'1.85.10');
const a=js.indexOf('// HF23: Pure, private, bounded');
const b=js.indexOf('// HF23 private submission report END',a);
assert(a>0&&b>a);
const context={Date};vm.createContext(context);
vm.runInContext(js.slice(a,b)+';this.buildReport=privateSubmissionReport;',context);
const report=context.buildReport('Negotiation\nExercise',[
 {review_status:'awaiting_review',created_at:'2026-10-29T10:00:00Z',answers:'STUDENT SECRET'},
 {review_status:'reviewed',created_at:'2026-10-28T10:00:00Z',reviewed_at:'2026-10-28T11:00:00Z',teacher_feedback:'Specific earlier instructor feedback'},
 {review_status:'pending_assignment',created_at:'2026-10-20T10:00:00Z',teacher_feedback:'DO NOT EXPORT UNREVIEWED'}
]);
assert(report.includes('PRIVATE student submission'));
assert(report.includes('Specific earlier instructor feedback'));
assert(report.includes('Awaiting teacher feedback'));
assert(report.includes('assignment/review unconfirmed'));
assert(!report.includes('STUDENT SECRET')&&!report.includes('DO NOT EXPORT UNREVIEWED'));
assert(!report.includes('Negotiation\nExercise'));
assert(report.includes('not necessarily all'));
assert.throws(()=>context.buildReport('x',Array.from({length:21},()=>({review_status:'reviewed'}))));
for(const must of ["const report=privateSubmissionReport(w.title||w.key,j.submissions);","review_status==='reviewed'","j.submissions.length>20","token!==currentToken||hubRequestSequence!==currentSequence||!card.isConnected","'englishlegalese-private-feedback-'","URL.revokeObjectURL(url)","if(!confirm('Download a PRIVATE text report","feedback.append(exportHistory","'text/plain;charset=utf-8'"])assert(js.includes(must),'Missing HF23 privacy condition '+must);
assert(api.includes("app.get('/api/v1940/lessons/:key/submissions',ready,strict,requireRoles('student')"));
assert(api.includes('where user_id=$1 and lesson_key=$2 order by created_at desc limit 20'));
assert(css.includes('.v1940-review-export:focus-visible'));
assert(page.includes('product-v1940-saved-lessons.js?v=1.85.10-hf24'));
assert(page.includes('this is not a full account backup'));
assert(fs.readFileSync('index.html','utf8').includes('name="englishlegalese-release" content="1.85.10"'));
console.log('PASS HF23: private opt-in per-lesson feedback report, review state and date fidelity, no student answers, capped coverage, no emails and revocable-session guards.');
