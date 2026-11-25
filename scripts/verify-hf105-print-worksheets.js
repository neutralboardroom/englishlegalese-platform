'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('assets/EnglishLegalese_Offline_Pocket_Lab_HF102.html');
const app=read('learn/app/index.html');
const spec=read('tests/hf105-paper-pairs.spec.js');
const doc=read('docs/HF105_PRINT_PEDAGOGY_AND_PRIVACY_QA.md');
const locale=JSON.parse(read('docs/HF105_LOCALE_STRING_DELTA.json'));
const pkg=JSON.parse(read('package.json'));
let pass=0;function yes(cond,label){assert.ok(cond,label);pass++;}
const match=/const data=(\[.*?\]);\nconst \$=/s.exec(html);yes(match,'Original case objects retained');
const data=JSON.parse(match[1]);yes(data.length===6,'Six original cases');
for(let i=0;i<data.length;i++){
 const c=data[i];yes(c.track===(i<3?'legal':'business'),'Legal/Business original order '+i);
 yes(c.answers.length===3&&c.questions.length===3&&c.change.options.length===3&&c.evidence.options.length===3,'All four original three-choice question banks '+i);
 yes([c.right,c.qright,c.change.right,c.evidence.right].every(x=>Number.isInteger(x)&&x>=0&&x<3),'All original answer-key indexes valid '+i);
 yes([c.a,c.b,c.context,c.prompt,c.why,c.qwhy,c.model,c.change.fact,c.change.model,c.change.why,c.evidence.prompt,c.evidence.roleA,c.evidence.roleB,c.evidence.model,c.evidence.why].every(s=>typeof s==='string'&&s.length>5),'All authored paper material supplied by original data '+i);
}
for(const id of ['hf105-print-controls','hf105-print-title','hf105-key-toggle','hf105-preview','hf105-print','hf105-close','hf105-print-status','hf105-sheet','hf105-sheet-title','hf105-sheet-case','hf105-sheet-subject','hf105-sheet-context','hf105-sheet-a','hf105-sheet-b','hf105-sheet-q1','hf105-sheet-a1','hf105-sheet-a2','hf105-sheet-misread','hf105-sheet-prompt','hf105-sheet-fact','hf105-sheet-q4','hf105-sheet-a4','hf105-sheet-q5','hf105-sheet-a5','hf105-sheet-role-a','hf105-key','hf105-key-a1','hf105-key-r1','hf105-key-a2','hf105-key-r2','hf105-key-m3','hf105-key-a4','hf105-key-r4','hf105-key-a5','hf105-key-r5','hf105-key-role-b','hf105-key-m5'])yes(html.includes(`id="${id}"`),'Actual print HTML '+id);
for(const token of ['paperText(id,value)','textContent=value||\'\'','function paperBuild()','function paperReset()','const c=available()[Number(els.caseSelect.value)]','paper.key.hidden=!paper.toggle.checked','paper.sheet.hidden=false','paper.toggle.checked=false','if(paperBuild())window.print()','@media print','@page{','break-before:page','body>main>#hf105-sheet','body>main>section:not(#hf105-sheet)','#hf105-key[hidden]{display:none!important}','type="checkbox"','Include the separate authored answer key','no learner writing is included'])yes(html.includes(token),'Print and privacy mechanism '+token);
for(const token of ['paperText(\'hf105-key-m3\',c.model)','paperText(\'hf105-key-m5\',c.evidence.model)','paperText(\'hf105-sheet-role-a\',c.evidence.roleA)','paperOptions(\'hf105-sheet-a1\',c.answers)','paperOptions(\'hf105-sheet-a2\',c.questions)','paperOptions(\'hf105-sheet-a4\',c.change.options)','paperOptions(\'hf105-sheet-a5\',c.evidence.options)'])yes(html.includes(token),'Source-bound worksheet '+token);
for(const token of ['src="http','src="/','href="http','href="/','<link','<img','@import','url(','fetch(','XMLHttpRequest','sendBeacon','WebSocket(','EventSource(','getUserMedia','MediaRecorder','speechSynthesis','localStorage','sessionStorage','indexedDB','serviceWorker.register','document.cookie','eval(','navigator.clipboard'])yes(!html.includes(token),'No network, media, storage or clipboard '+token);
for(const t of ["default-src 'none'","connect-src 'none'","form-action 'none'",'pagehide','beforeunload','clearSensitive()','EnglishLegalese · Offline Pocket Lab · HF103','EnglishLegalese · Offline Pocket Lab · HF104','EnglishLegalese · Offline Pocket Lab · HF105'])yes(html.includes(t),'Privacy + version continuity '+t);
for(const t of ['Mobile learning | HF104 development preview','Mobile learning | HF105 development preview','hf101-practice-route.js','hf100-confirmation-note.js','download="EnglishLegalese_Offline_Pocket_Lab_HF102.html"'])yes(app.includes(t),'Mobile source continuity '+t);
for(const t of ['HF105','print','paper','no learner','file://'])yes(spec.includes(t),'Dedicated browser coverage '+t);
for(const t of ['No learner device/account required','off by default','independent','Print output never includes'])yes(doc.includes(t),'Pedagogical/privacy evidence '+t);
yes(pkg.scripts.check.includes('node scripts/verify-hf105-print-worksheets.js'),'In mandatory original npm check');
yes(pkg.scripts.check.includes('node scripts/verify-hf104-evidence-roles.js'),'No weakened HF104 gate');
yes(pkg.scripts['hf105:verify']==='node scripts/verify-hf105-print-worksheets.js','Named HF105 verifier');
yes(locale.previous_13_locale_release_freeze_unchanged&&locale.new_locales_published.length===0,'No untranslated release');
for(const p of ['owner-rules/RDR-001.md','owner-rules/RDR-002.md','governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md'])yes(fs.existsSync(path.join(root,p)),'Original protected governance '+p);
console.log(`HF105 print worksheet static checks ${pass}/${pass} PASS; original validators retained.`);
