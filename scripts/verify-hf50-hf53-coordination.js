'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const data=fs.readFileSync('product-v2120-practice-bridge-data.js','utf8');
const cases=JSON.parse(data.match(/const cases=(\[[\s\S]*?\]);\n if\(cases.length/)[1]);
const hf49=fs.readFileSync('product-v2110-clarity-coach.js','utf8');
const prior=JSON.parse(hf49.match(/const records=(\[[\s\S]*?\]);\n const byTitle=/)[1]);
assert.equal(cases.length,24);assert.equal(new Set(cases.map(c=>c.title)).size,24);
assert.deepEqual(cases.map(c=>c.title),prior.map(r=>r[0]));
for(const c of cases){for(const k of ['title','model','evidence','overclaim','question','qualified'])assert.ok(typeof c[k]==='string'&&c[k].length>22,k);
 assert.ok(c.question.endsWith('?'),'complete question: '+c.title);assert.notEqual(c.evidence,c.overclaim);assert.notEqual(c.evidence,c.qualified);
}
const manifest=JSON.parse(fs.readFileSync('coordination/englishlegalese-project-manifest.v1.json','utf8'));
assert.equal(manifest.schema,'englishlegalese-controlcenter-handoff/v1');
assert.equal(manifest.project.id,'EnglishLegalese');
assert.equal(manifest.project.independent_brand,true);
assert.equal(manifest.shared_engine.id,'TR-Clone');
assert.equal(manifest.shared_engine.verified_offline_source_version,'V1.0');
assert.deepEqual(manifest.shared_engine.supported_response_modes,['quiet','developing','confident']);
assert.equal(manifest.shared_engine.live_ai_runtime_connected,false);
assert.equal(manifest.coordinator.id,'TR-ControlCenter');
assert.equal(manifest.coordinator.verified_two_way_handshake,false);
assert.equal(manifest.coordinator.authoritative_repository_or_api_verified,false);
assert.equal(manifest.constraints.no_cross_project_merging,true);
for(const p of ['learn/continuing-practice/index.html','learn/continuing-practice/advanced/index.html']){
 const h=fs.readFileSync(p,'utf8');
 assert.equal((h.match(/<article class="v1971-lesson"/g)||[]).length,12);
 for(const src of ['product-v2120-practice-bridge-data.js?v=hf50','product-v2120-response-ladder.js?v=hf50','product-v2130-evidence-check.js?v=hf51','product-v2140-mini-clinic.js?v=hf52','hf50-hf52-practice-bridge.css?v=hf52'])assert.ok(h.includes(src),src);
 for(const prev of ['product-v2040-teacher-session','product-v2090-print-packs','product-v2100-four-week-path','product-v2110-clarity-coach'])assert.ok(h.includes(prev),prev);
}
for(const fn of ['product-v2120-practice-bridge-data.js','product-v2120-response-ladder.js','product-v2130-evidence-check.js','product-v2140-mini-clinic.js']){
 const s=fs.readFileSync(fn,'utf8');for(const denied of ['fetch(','XMLHttpRequest','sendBeacon','getUserMedia','MediaRecorder','SpeechRecognition','localStorage','sessionStorage','textarea.value','innerHTML'])assert.ok(!s.includes(denied),fn+' privacy '+denied);
}
assert.ok(fs.readFileSync('product-v2120-response-ladder.js','utf8').includes("card.querySelector('details.v2100-more-tools')"),'new tools nested under closed parent');
assert.ok(!fs.readFileSync('index.html','utf8').includes('hf50-hf52-practice-bridge'),'protected home unchanged');
for(const f of ['coordination/EnglishLegalese_TR_ControlCenter_Handoff.md','docs/HF50_HF53_COORDINATED_RELEASE_2026-11-08.md'])assert.ok(fs.readFileSync(f,'utf8').includes('TR-ControlCenter'));
console.log('PASS HF50–HF53: 24 authored clinics, teacher ladder, evidence reasoning, privacy separation and fail-closed TR-ControlCenter handshake.');
