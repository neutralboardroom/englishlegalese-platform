'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('assets/EnglishLegalese_Offline_Pocket_Lab_HF102.html');
const app=read('learn/app/index.html');
const spec=read('tests/hf103-offline-transfer.spec.js');
const qa=read('docs/HF103_ADAPTATION_PRIVACY_QA.md');
const pkg=JSON.parse(read('package.json'));
let tests=0;function ok(q,t){assert.ok(q,t);tests++;}
const d=/const data=(\[.*?\]);\nconst \$=/.exec(html);ok(d,'All authored case data still present');
const cases=JSON.parse(d[1]);ok(cases.length===6,'Exactly six inherited cases');
for(let i=0;i<cases.length;i++){
 const c=cases[i],z=c.change;
 ok(!!c.title&&!!c.a&&!!c.b&&!!c.subject&&!!c.model,'Original case content still present: '+i);
 ok(z&&typeof z.fact==='string'&&z.fact.length>65,'New evidence is a real changed fact: '+i);
 ok(z.prompt&&z.prompt.length>35,'New fact-based question: '+i);
 ok(z.options?.length===3&&new Set(z.options).size===3,'Three distinct changed-fact choices: '+i);
 ok(Number.isInteger(z.right)&&z.right>=0&&z.right<3,'One valid correct choice: '+i);
 ok(z.why?.length>60,'Source-based explanation: '+i);
 ok(z.model?.length>90,'Full changed-fact written model: '+i);
 ok(c.track===(i<3?'legal':'business'),'Inherit correct six subject cases: '+i);
}
for(const id of ['stage-4','change','change-title','change-fact','change-question','change-options','change-feedback','change-compose','change-draft','change-review','change-reveal','change-clear','change-checklist','change-example'])ok(html.includes('id="'+id+'"'),'Fourth-stage component '+id);
for(const token of ["phase=4;mark(4)","els.change.hidden=false", "els.changeCompose.hidden=false", "els.endActions.hidden=false", "if(phase!==4||!active||els.changeCompose.hidden)return", "els.changeDraft.value=''",'aria-live="polite"','maxlength="850"','pagehide','beforeunload','clearSensitive()'])ok(html.includes(token),'Progress or privacy gate '+token);
for(const token of ['src="http','src="/','href="http','href="/','<link','<img','@import','url(','fetch(','XMLHttpRequest','sendBeacon','WebSocket(','EventSource(','getUserMedia','MediaRecorder','speechSynthesis','localStorage','sessionStorage','indexedDB','serviceWorker.register','document.cookie','new Function(','eval('])ok(!html.includes(token),'Standalone page requires zero integration '+token);
for(const token of ["connect-src 'none'","form-action 'none'",'default-src \'none\'','EnglishLegalese · Offline Pocket Lab · HF103'])ok(html.includes(token),'Strict offline CSP and version truth '+token);
for(const token of ['Mobile learning | HF103 development preview','Offline Pocket Lab','download="EnglishLegalese_Offline_Pocket_Lab_HF102.html"','hf101-practice-route.js','hf100-confirmation-note.js'])ok(app.includes(token),'Public mobile link or predecessor preserved '+token);
ok(pkg.scripts.check.includes('verify-hf103-offline-transfer.js')&&pkg.scripts.check.includes('verify-hf102-offline.js'),'Check suite always retains predecessor');
ok(pkg.scripts['hf103:verify']==='node scripts/verify-hf103-offline-transfer.js','Rerunnable independent source gate');
ok(spec.includes('pathToFileURL')&&spec.includes('change-options')&&spec.includes('change-draft'),'Real saved-file browser test added');
ok(qa.includes('governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md')&&qa.includes('EL-RGR-020'),'Unmodified release governance referenced');
for(const f of ['owner-rules/RDR-001.md','owner-rules/RDR-002.md','governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md'])ok(read(f).length>150,'Inherited governance source present '+f);
console.log('PASS HF103_STATIC_ASSERTIONS='+tests);
