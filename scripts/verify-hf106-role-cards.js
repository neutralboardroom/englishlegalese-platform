'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('assets/EnglishLegalese_Offline_Pocket_Lab_HF102.html'),app=read('learn/app/index.html'),pkg=JSON.parse(read('package.json'));
const spec=read('tests/hf106-role-cards.spec.js'),doc=read('docs/HF106_ROLE_CARD_QA.md'),locale=JSON.parse(read('docs/HF106_LOCALE_STRING_DELTA.json'));
let n=0;function ok(x,t){assert.ok(x,t);n++;}
const m=/const data=(\[.*?\]);\nconst \$=/s.exec(html);ok(m,'Original case source exists');const data=JSON.parse(m[1]);ok(data.length===6,'All six original cases');
for(let i=0;i<6;i++){const c=data[i];ok(c.track===(i<3?'legal':'business'),'Track '+i);for(const t of [c.title,c.context,c.b,c.evidence.roleA,c.change.fact])ok(typeof t==='string'&&t.length>10,'Original professional source '+i);ok(c.change.options.length===3&&c.evidence.options.length===3,'Original decision banks '+i);}
for(const id of ['hf106-paper-format','hf106-cards','hf106-case','hf106-subject','hf106-a-context','hf106-a-question','hf106-b-original','hf106-b-fact'])ok(html.includes('id="'+id+'"'),'Role card HTML '+id);
for(const t of ['value="worksheet"','value="cards"','Partner A — request clear supporting evidence','Partner B — explain changed facts carefully',"paper.cards.hidden=paper.format.value!=='cards'",'paper.sheet.dataset.format=paper.format.value',"paper.format.addEventListener('change'","paperText('hf106-a-question',c.evidence.roleA)","paperText('hf106-b-fact',c.change.fact)",'paper.key.hidden=!paper.toggle.checked','paper.toggle.checked=false','@media print'])ok(html.includes(t),'Original factual card implementation '+t);
for(const t of ['fetch(','XMLHttpRequest','WebSocket(','getUserMedia','MediaRecorder','localStorage','sessionStorage','indexedDB','serviceWorker.register','document.cookie','navigator.clipboard','<img','<link','@import'])ok(!html.includes(t),'Zero-network/data privacy '+t);
for(const t of ["default-src 'none'","connect-src 'none'","form-action 'none'",'pagehide','beforeunload','EnglishLegalese · Offline Pocket Lab · HF105','EnglishLegalese · Offline Pocket Lab · HF106'])ok(html.includes(t),'CSP and release continuity '+t);
for(const t of ['Mobile learning | HF105 development preview','Mobile learning | HF106 development preview','download="EnglishLegalese_Offline_Pocket_Lab_HF102.html"'])ok(app.includes(t),'Mobile continuity '+t);
for(const t of ['HF106','file://','hf106-cards','secret private draft'])ok(spec.includes(t),'Browser test '+t);
for(const t of ['governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md','No new locale','in-person','not a credential'])ok(doc.includes(t),'Explicit review/covenant '+t);
ok(locale.previous_13_locale_release_freeze_unchanged&&locale.new_locales_published.length===0,'Locales frozen');
ok(pkg.scripts.check.includes('node scripts/verify-hf105-print-worksheets.js'),'Original HF105 retained');
ok(pkg.scripts.check.includes('node scripts/verify-hf106-role-cards.js'),'New mandatory verifier');
for(const f of ['owner-rules/RDR-001.md','owner-rules/RDR-002.md','governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md'])ok(fs.existsSync(path.join(root,f)),'Original immutable governance '+f);
console.log('HF106 source checks '+n+'/'+n+' PASS');
