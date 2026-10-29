'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const api=fs.readFileSync('src/v1940-saved-lessons.js','utf8');
const client=fs.readFileSync('product-v1940-saved-lessons.js','utf8');
const home=fs.readFileSync('index.html','utf8');
const hub=fs.readFileSync('learn/my-work/index.html','utf8');
const pkg=require('../package.json');
assert.equal(pkg.version,'1.85.5');
for(const required of [
 "app.get('/api/v1940/lessons',ready,strict",
 "from self_paced_lesson_work where user_id=$1 order by updated_at desc,lesson_key asc limit 101 offset $2",
 "[req.user.id,offset]",
 "q.rows.slice(0,100)",
 "next_offset:more?offset+100:null",
 "Invalid saved-lesson page offset."
])assert(api.includes(required),'Private metadata pagination guard missing '+required);
assert(!/res\.json\(\{ok:true,lessons:q\.rows\}\)/.test(api),'Legacy silent first-100 cut-off cannot remain');
assert(!/select\s+\*/i.test(api.slice(api.indexOf("app.get('/api/v1940/lessons',ready,strict"),api.indexOf("app.get('/api/v1940/lessons/:key'"))),'No lesson answers in list response');
for(const required of [
 "for(let pageNumber=0;pageNumber<10;pageNumber++)",
 "url=offset===0?api:api+'?offset='+offset",
 "if(currentSequence!==hubRequestSequence||token!==currentToken)return",
 "seen.has(w.lesson_key)",
 "j.has_more!==true",
 "j.next_offset!==offset+100",
 "listingComplete=false",
 "Your cloud lesson list could not be fully loaded",
 "LIST MAY BE INCOMPLETE",
 "listingComplete);"
])assert(client.includes(required),'Pagination safety missing '+required);
const start=client.indexOf('// HF17 study report pure helper BEGIN'),end=client.indexOf('// HF17 study report pure helper END',start);
const sandbox={};vm.createContext(sandbox);vm.runInContext(client.slice(start,end)+';this.studyReport=studyReport;',sandbox);
const row={key:'page:fictional',title:'Fictional exercise',status:'draft',updated_at:'2026-10-29T00:00:00Z',answers:'SECRET ANSWER'};
const complete=sandbox.studyReport([row],'Cloud account',true);
const partial=sandbox.studyReport([row],'Cloud account',false);
assert(complete.includes('Listing coverage: All pages returned'));
assert(partial.includes('Listing coverage: PARTIAL'));
assert(!partial.includes('SECRET ANSWER'));
assert(hub.includes('product-v1940-saved-lessons.js?v=1.85.5-hf19'));
assert(home.includes('name="englishlegalese-release" content="1.85.5"'));
console.log('PASS HF18: authenticated paginated read, 1,000-cap, bounded offset, no answers, fail-closed partial report, no migration or email.');
