'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8');
const index=read('index.html'),app=read('app.js');
const overview=read('learn/certifications/index.html');
const legal=read('learn/legal-english-certification/index.html');
const business=read('learn/business-english-certification/index.html');
const guide=read('docs/HF24_ENGLISHLEGALESE_INDEPENDENT_CERTIFICATION_BLUEPRINT.md');
assert.equal(require('../package.json').version,'1.85.10');
assert(index.includes('href="/learn/certifications/"'));
assert(index.includes('href="/learn/legal-english-certification/"'));
assert(index.includes('href="/learn/business-english-certification/"'));
assert(app.includes('class="v1940-cert-hero"'));
assert(app.includes('Certificates are not issued yet.'));
for(const [slug,html] of [['certifications',overview],['legal-english-certification',legal],['business-english-certification',business]]){
 assert(html.includes('href="https://englishlegalese.com/learn/'+slug+'/"'));
 assert(html.includes('name="englishlegalese-release" content="1.85.10"'));
 assert(html.includes('not available yet'),'No misleading active certification: '+slug);
 assert(html.includes('EnglishLegalese'),'Issuer brand must be clear');
}
for(const [track,html] of [['Legal English',legal],['Business English',business]]){
 for(const level of ['A1','A2','B1','B2','C1','C2'])assert(html.includes('<th scope="row">'+level+'</th>'),'Missing '+track+' level '+level);
 assert(html.includes('live human-proctored'));
 assert(html.includes('scores in the other specialist')||html.includes('other specialist track'));
 assert(html.includes('solely by EnglishLegalese'));
 assert(html.includes('not by the Council of Europe'));
}
assert(guide.includes('NOT ISSUING')&&guide.includes('EL-LEGAL')&&guide.includes('EL-BUSINESS'));
assert(guide.includes('No combined or inferred certificate level'));
assert(!overview.includes('certificates are internationally accredited'));
const backend=read('src/v18510-role-workspaces.js');
const frontend=read('role-workspaces-v18510.js');
for(const guard of ["app.post('/api/v18510/employer/enroll'","app.get('/api/v18510/employer/enrollments'","requireRoles('employer')","m.user_id=$1","m.organization_id=$2","u.id=ANY($3::text[])","employee_acceptance_required!==true","payment_taken:false","class_reserved:false","status:'needs_review'"])
 assert(backend.includes(guard),'Missing secure employer class request guard: '+guard);
for(const guard of ['enrollment_candidates','loadRequests()','Submit employer class request','employee_acceptance_required:ack.checked','No payment is charged'])
 assert(frontend.includes(guard),'Missing employer workflow UI: '+guard);
console.log('PASS HF24: two original separate CEFR-informed credential blueprints, honest nonissuance, live assessor rules, and authenticated staff-reviewed company enrollment without payment or false reservation.');
