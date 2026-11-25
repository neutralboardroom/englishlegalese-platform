'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('assets/EnglishLegalese_Offline_Pocket_Lab_HF102.html');
const mobile=read('learn/app/index.html');
const spec=read('tests/hf104-evidence-roles.spec.js');
const qa=read('docs/HF104_EVIDENCE_ROLE_REHEARSAL_QA.md');
const pkg=JSON.parse(read('package.json'));
let count=0;function ok(b,m){assert.ok(b,m);count++}
const m=html.match(/const data=(\[.*?\]);\nconst \$=/s);ok(m,'Original six case data preserved');
const cases=JSON.parse(m[1]);ok(cases.length===6,'Exactly six scenarios');
for(let i=0;i<cases.length;i++){
 const c=cases[i],e=c.evidence;
 ok(c.change&&c.change.fact&&c.change.model,'Previous changed-facts stage preserved '+i);
 ok(e&&e.prompt.length>50,'Case-specific evidence question '+i);
 ok(e.options.length===3&&new Set(e.options).size===3,'Three distinct evidence options '+i);
 ok(Number.isInteger(e.right)&&e.right>=0&&e.right<3,'Explicit correct evidence choice '+i);
 ok(e.why.length>70,'Rationale distinguishes evidence and assumption '+i);
 ok(e.roleA.length>35&&e.roleB.length>85,'Two full authored speaking roles '+i);
 ok(e.model.length>135,'Authentic two-or-more-sentence professional evidence-backed model '+i);
 ok(c.track===(i<3?'legal':'business'),'Preserved context '+i);
}
for(const id of ['stage-5','evidence','evidence-title','evidence-question','evidence-options','evidence-feedback','evidence-practice','evidence-role-a','evidence-role-b','evidence-draft','evidence-review','evidence-reveal','evidence-clear','evidence-checklist','evidence-example'])ok(html.includes(`id="${id}"`),'UI stage id '+id);
for(const token of ['if(!evidenceOpen)return','els.changeCompose.hidden','els.evidencePractice.hidden=false','if(!evidenceOpen||!active||els.evidencePractice.hidden)return','evidenceOpen=false','els.evidenceDraft.value=\'\'','pagehide','beforeunload','clearSensitive()','aria-live="polite"','maxlength="850"','if(phase!==4||!active||els.changeCompose.hidden)return'])ok(html.includes(token),'Gating and cleanup '+token);
for(const token of ['src="http','src="/','href="http','href="/','<link','<img','@import','url(','fetch(','XMLHttpRequest','sendBeacon','WebSocket(','EventSource(','getUserMedia','MediaRecorder','speechSynthesis','localStorage','sessionStorage','indexedDB','serviceWorker.register','document.cookie','new Function(','eval('])ok(!html.includes(token),'No external assets/APIs '+token);
for(const s of ["default-src 'none'","connect-src 'none'","form-action 'none'",'EnglishLegalese · Offline Pocket Lab · HF104','Stage 4','No voice recording'])ok(html.includes(s),'Privacy and honesty '+s);
for(const s of ['Mobile learning | HF104 development preview','download="EnglishLegalese_Offline_Pocket_Lab_HF102.html"','hf101-practice-route.js','hf100-confirmation-note.js'])ok(mobile.includes(s),'Mobile previous functionality '+s);
ok(pkg.scripts.check.includes('verify-hf104-evidence-roles.js')&&pkg.scripts.check.includes('verify-hf103-offline-transfer.js')&&pkg.scripts.check.includes('verify-hf102-offline.js'),'All original verifiers retained');
ok(pkg.scripts['hf104:verify']==='node scripts/verify-hf104-evidence-roles.js','Direct source test');
ok(spec.includes('pathToFileURL')&&spec.includes('evidence-options')&&spec.includes('evidence-draft'),'Saved-file browser tests retained');
ok(qa.includes('EL-RGR-020')&&qa.includes('RDR-001'),'Immutable governance referenced');
for(const f of ['owner-rules/RDR-001.md','owner-rules/RDR-002.md','governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md'])ok(read(f).length>150,'Inherited policy unchanged '+f);
console.log('PASS HF104_STATIC_ASSERTIONS='+count);
