'use strict';
// EnglishLegalese permanent no-drift regression for the owner's ORIGINAL
// standing release rule. Runs without network, mail, payments or production
// writes; external backup hashes and LIVE Render status are release receipts
// that must be independently checked after these source tests pass.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(base,p),'utf8');
const owner=read('governance/ENGLISHLEGALESE_OWNER_DIRECTIVES_ADDENDUM_2026-10-22.md');
const contract=read('governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md');
// Automatically inspect the newest HF-numbered release documents, not
// a frozen HF68 filename. Future HF69/HF70 handoffs cannot bypass this test
// by leaving an older compliant document in the repository.
const releases=fs.readdirSync(path.join(base,'docs'))
 .map(name=>({name,match:/^HF(\\d+)_.*\\.md$/i.exec(name)}))
 .filter(item=>item.match)
 .map(item=>({name:item.name,version:Number(item.match[1])}));
assert.ok(releases.length>0,'Must have current version release documents');
const newestHF=Math.max(...releases.map(x=>x.version));
const newestDocs=releases.filter(x=>x.version===newestHF)
 .map(x=>({name:x.name,text:read('docs/'+x.name)}));
const workflow=read('.github/workflows/englishlegalese-release-gate.yml');
const pkg=JSON.parse(read('package.json'));
assert.ok(owner.includes('## EL-RGR-020 — Deploy every completed version live'),'Original owner rule must remain intact');
assert.ok(owner.includes('automatic')||owner.includes('auto-deploy'),'Owner release authority must survive');
assert.ok(contract.includes('EL-RGR-020'),'Current contract must cite the original immutable rule');
for(const fact of [
 'ChatGPT Library','Google Drive','SHA-256','Universal Next-Version Builder',
 'exact-commit','RELEASED_LIVE','Render','rollback','BLOCKED',
 'EL-DUR-011','EL-RGR-023','two','independent','auto-deploy'
]){
 assert.ok(contract.toLowerCase().includes(fact.toLowerCase()),'Release continuity missing '+fact);
}
assert.ok(contract.includes('No repeated owner authorization is required'),
 'Do not silently reintroduce a per-version permission prompt');
for(const doc of newestDocs){
 assert.ok(!/production rollout requires explicit user authorization|no merge or deploy without owner authorization|per-release approval is required/i.test(doc.text),
  'Newest HF'+newestHF+' document contradicts standing auto-deploy: '+doc.name);
}
assert.ok(newestDocs.some(doc=>doc.text.includes('EL-RGR-020')),
 'Newest HF'+newestHF+' release must carry original live-deploy rule EL-RGR-020');
assert.ok(newestDocs.some(doc=>doc.text.includes('ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md')),
 'Newest HF'+newestHF+' release must link to canonical no-drift contract');
assert.ok(pkg.scripts.check.includes('node scripts/verify-el-release-continuity.js'),
 'The no-drift rule must remain in mandatory inherited source/security gates');
assert.ok(workflow.includes('  verify-independent:')&&workflow.includes('  verify:'),
 'Both independent release gate jobs remain required');
assert.ok(workflow.includes('git archive'),'Exact cumulative app source recovery must remain configured');
for(const p of [
 'index.html','styles.css','assets/englishlegalese-logo.png',
 'assets/teacher-classroom-photo-locked-hf26.svg',
 'learn/legal-english/index.html','learn/business-english/index.html',
 'manifest.webmanifest','sw.js','pwa-install.js'
])assert.ok(fs.statSync(path.join(base,p)).isFile(),'Protected existing product missing '+p);
console.log('PASS EnglishLegalese canonical EL-RGR-020: automatic qualified release AFTER verified Library+Drive backups, full mobile+web no-drift, independent gates, rollback and actual LIVE Render receipt; no extra owner approval drift.');
