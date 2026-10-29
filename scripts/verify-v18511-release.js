'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');
const api=read('src/v18511-owner-triage.js'),ui=read('role-workspaces-v18510.js'),srv=read('server.js');
assert.equal(require('../package.json').version,'1.85.11');
assert(srv.includes("require('./src/v18511-owner-triage').install(app"));
for(const x of ["/api/v18511/owner/triage","requireRoles('owner','admin')","teacher_profiles","class_sessions","progress_reports","to_regclass('public.employer_enrollment_requests')","employer_enrollment_requests","schema_installed:false","counts:null","Cache-Control","private, no-store","certification_issuance_active:false","employer_checkout_active:false"])assert(api.includes(x),'Missing triage protection: '+x);
assert(!api.includes('app.post(')&&!api.includes('UPDATE ')&&!api.includes('DELETE '));
assert(ui.includes('loadOwnerTriage(token,epoch,triage)')&&ui.includes("token!==ownerToken||epoch!==requestEpoch")&&!ui.includes('.innerHTML'));
for(const [track,key]of [['legal','contract'],['business','investor']]){
 const p=read('learn/'+track+'-english-certification/index.html');
 assert(p.includes('hf25-cert-assessments.css?v=1.85.11'));assert(p.includes('exam blueprints, not live exams or earned credentials'));
 for(const lev of ['A1','A2','B1','B2','C1','C2'])assert(p.includes('<strong>'+lev+'</strong>'));
 assert(p.includes(key));
 assert((p.match(/class="v18511-assessment-level"/g)||[]).length===6);
}
assert(read('hf25-cert-assessments.css').includes(':focus-visible'));
console.log('PASS HF25: owner triage guarded and failed closed; original supervised six-level Legal and Business assessment blueprints, unchanged protection rules.');
