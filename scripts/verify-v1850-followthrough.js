'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),rd=f=>fs.readFileSync(f,'utf8');
const home=rd('index.html');const header=home.slice(home.indexOf('<nav id="mainNav"'),home.indexOf('</nav>',home.indexOf('<nav id="mainNav"'))+6);
const li=header.indexOf('>Legal English</a>'),bi=header.indexOf('>Business English</a>');assert(li>=0&&bi>li,'Home legal must precede business');
assert(header.includes('href="/learn/courses/"')&&header.includes('href="/learn/legal-english/"')&&header.includes('href="/learn/business-english/"'),'Preserve distinct catalog, Legal and Business destinations');
const pages=fs.readdirSync('learn',{recursive:true}).filter(p=>p.endsWith('/index.html')).map(p=>'learn/'+p).concat(['pricing/index.html']);
assert(pages.length>=41,'Retain all dedicated pages');
const legs=['free-writing-exercise','ai-draft-review','clause-reading','meeting-followup','email-clarity','guided-practice','case-brief','legal-vocabulary','revision-studio','professional-message','listening-clarification','conversation-rehearsal','reading-precision','smartteacher-free-trial'];
const biz=['business-email','business-meetings','business-negotiations','business-presentations','business-interviews','business-global','investor-earnings','investor-markets'];
for(const file of pages){const html=rd(file),n=html.slice(html.indexOf('<nav class="v1840-topnav"'),html.lastIndexOf('</nav>',html.indexOf('</header>'))+6);
 assert(n.startsWith('<nav'),'Dedicated navigation absent: '+file);
 const a=n.indexOf('>Legal English</a>'),b=n.indexOf('>Business English</a>');assert(a>=0&&b>a,file+' Legal before Business');assert(n.includes('href="/learn/legal-english/"'),'Missing dedicated Legal English route '+file);
 for(const slug of legs)assert(n.includes('href="/learn/'+slug+'/"'),file+' missing Legal tool '+slug);
 for(const slug of biz)assert(n.includes('href="/learn/business-resources/'+slug+'/"'),file+' missing Business tool '+slug);
 for(const p of ['/learn/legal-resources/','/learn/business-resources/','/learn/teach-with-us/','/learn/classroom-programs/','/learn/enroll/'])assert(n.includes('href="'+p+'"'),file+' missing '+p);
 assert(html.includes('href="/learn/classroom-programs/"'),file+' missing plan route in header/footer');
}
const guide=rd('product-v1850-session-guides.js');const json=guide.slice(guide.indexOf('const PLANS=')+'const PLANS='.length,guide.indexOf(';\nconst render='));
const plans=JSON.parse(json);
for(const track of ['legal','business']){const rows=plans[track];assert.equal(rows.length,16,track+' 16 unique sessions');assert.equal(new Set(rows.map(x=>x.title)).size,16);
rows.forEach((r,i)=>{assert.equal(r.session,i+1);assert(r.vocabulary.length>=4);for(const key of ['title','outcome','model','scenario','homework','teacher'])assert(r[key].length>22,track+' session '+(i+1)+' '+key);});}
const legalHome=rd('learn/legal-english/index.html');assert(legalHome.includes('Legal English courses, practice and live classes')&&legalHome.includes('/learn/classroom-programs/#legal')&&legalHome.includes('/learn/courses/'),'Dedicated Legal English hub missing');const page=rd('learn/classroom-programs/index.html');for(const key of ['v1850-legal-sessions','v1850-business-sessions','product-v1850-session-guides.js','href="/learn/enroll/"','href="/learn/teach-with-us/"'])assert(page.includes(key),'Missing learning plan element '+key);
for(const [file,anchor] of [['learn/courses/index.html','#legal'],['learn/business-english/index.html','#business']])assert(rd(file).includes('/learn/classroom-programs/'+anchor),file+' missing track syllabus link');
for(const key of ['19 Roger','10 durable','3 later'])assert(rd('NEXT_VERSION_IMPROVEMENT_LIST.md').includes(key),'Owner protections not reflected in update '+key);
assert(!/\b(?:heygen|liveavatar|synthesia|tavus|simli|d-id)\b/i.test(guide),'No AI avatar implementation');
const op=rd('scripts/owner-review-v1850-intake.js');assert(op.includes('wx')&&op.includes('0o600')&&op.includes('acknowledge-personal-data')&&op.includes('SELECT')===false);
console.log('PASS follow-through: consistent Legal-before-Business navigation on '+pages.length+' pages, all 22 resources, 16+16 detailed session plans, private owner review.');
