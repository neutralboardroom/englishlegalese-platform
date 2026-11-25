#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
let n=0;const check=(ok,message)=>{assert.ok(ok,message);n++;};
const pinned={
 "playwright.config.js": "30d6f78732ae419d1be1096f31455d9d0e54467d8dc3c7f82ab502c556b3dfc0",
 ".github/workflows/englishlegalese-release-gate.yml": "1d4f93b51c30f8066f7009c4f25ce95664405fb54c608a7e6236faaf4367fc57",
 "assets/hf96-meaning-guide.js": "e8a9378c68830b28379b266622851d282a2aa79d2d24cfd2382cf9393444dec6",
 "assets/hf99-misunderstanding-repair.js": "8aded2766998f0d204e4fba8ff815ae3e44db9df9e99961c861747d07847167c",
 "assets/EnglishLegalese_Offline_Pocket_Lab_HF102.html": "76d8cdd70c10e64602811f5836c23a78a874a93d6390c88c01c12364b6868bc7",
 "owner-rules/RDR-001.md": "d4ed3fcee5df79dda7da8e3473e6ecc7a5d994c14a44d3343711c7f05012e4c1",
 "owner-rules/RDR-002.md": "da69f46615bb4cdb91cdda202fa4075a96d54fe27551fe40d80244704a58564c",
 "governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md": "3f88cc66ebd1cbd77a38f924b484236dcb29898cb4a8e0b3028095a8918e9a40"
};
for(const [p,sha] of Object.entries(pinned))check(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex')===sha,'unchanged '+p);
function register(p){const names=[];const test=(name,fn)=>{check(typeof fn==='function','real test body');names.push(name);};test.use=()=>{};vm.runInNewContext(read(p),{require:m=>{assert.equal(m,'@playwright/test');return {test,expect:()=>{}};}},{timeout:1000});check(names.length===new Set(names).size,'unique test names '+p);return names;}
const a=register('tests/hf96-meaning.spec.js'),b=register('tests/hf99-misunderstanding-repair.spec.js');
check(a.length===9,'HF96 six cases and three unchanged tests');check(b.length===8,'HF99 six cases, privacy and transition');
for(const track of ['legal','business'])for(let i=1;i<=3;i++){check(a.some(x=>x.endsWith(`${track} case ${i}`)),'HF96 '+track+i);check(b.some(x=>x.endsWith(`${track} case ${i}`)),'HF99 '+track+i);}
const fixture=JSON.parse(read('tests/hf96-meaning.spec.js').match(/const expectedMeaning = ([\s\S]+?);\nconst allMeanings/)[1]);
const actual=vm.runInNewContext(read('assets/hf96-meaning-guide.js').match(/const EXEMPLARS=(new Map\(\[[\s\S]*?\]\));/)[1],{},{timeout:1000});
const values=Object.values(fixture).flat(2);check(values.length===12&&new Set(values).size===12,'all 12 pinned meanings unique');check(JSON.stringify(values)===JSON.stringify(Array.from(actual.values(),v=>'One possible meaning: '+v)),'pinned meanings exactly match unchanged source');
for(const p of ['tests/hf96-meaning.spec.js','tests/hf99-misunderstanding-repair.spec.js'])check(!/test\.(skip|only|fixme|setTimeout)|force\s*:\s*true|retries\s*:/.test(read(p)),'no waivers '+p);
console.log('HF107 bounded scenario integrity: '+n+' PASS');
