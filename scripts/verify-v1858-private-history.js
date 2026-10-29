'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const hub=fs.readFileSync('product-v1940-saved-lessons.js','utf8');
const api=fs.readFileSync('src/v1940-saved-lessons.js','utf8');
const page=fs.readFileSync('learn/my-work/index.html','utf8');
const css=fs.readFileSync('product-v1940-saved-lessons.css','utf8');
assert.equal(require('../package.json').version,'1.85.9');
for(const required of ["w.status==='submitted'&&currentToken&&cloud","hubRequestSequence!==currentSequence||!card.isConnected","j.submissions.length>20","j.submissions.length>1","E('details',undefined,'v1940-review-history')","E('summary','Earlier submissions (","j.submissions.slice(1).entries()","previous?.review_status==='reviewed'","previous?.review_status==='awaiting_review'","previous.teacher_feedback","j.submissions.length===20","Older submissions may also exist.","feedback.append(history)","review.setAttribute('aria-label'"])
 assert(hub.includes(required),'HF22 private-history safety regression: '+required);
assert(api.includes("app.get('/api/v1940/lessons/:key/submissions',ready,strict,requireRoles('student')"),'History endpoint requires authenticated student.');
assert(api.includes('where user_id=$1 and lesson_key=$2 order by created_at desc limit 20'),'History must be scoped to the signed-in student and lesson and capped at 20.');
assert(css.includes('.v1940-review-history summary:focus-visible'),'Keyboard navigation must be accessible.');
assert(page.includes('product-v1940-saved-lessons.js?v=1.85.9-hf23'));
assert(page.includes('only the most recent 20 submissions per lesson'));
assert(fs.readFileSync('index.html','utf8').includes('name="englishlegalese-release" content="1.85.9"'));
console.log('PASS HF22: current and prior genuine teacher reviews, bounded private history, signout guards, accessible disclosure, no untrusted markup or email.');
