'use strict';
const assert=require('node:assert/strict'),m=require('../assets/hf116-observation-sheet'),base=require('../assets/hf111-workplace-preview');
let n=0;function check(fn){fn();n++;}
for(const s of Object.keys(base.scenarios))for(const a of Object.keys(base.audiences))for(const l of Object.keys(base.levels)){const p=base.plan(s,a,l),html=m.sheet(p,l);check(()=>assert.ok(html.includes(p.base)&&html.includes(p.repeat)));check(()=>assert.equal((html.match(/scope="row"/g)||[]).length,6));check(()=>assert.ok(!/<(?:script|iframe|form|input)\b/i.test(html)&&html.includes("default-src 'none'")));check(()=>assert.ok(!html.includes(p.model)&&html.includes('not observed')));}
check(()=>assert.throws(()=>m.sheet(null,'foundation')));check(()=>assert.throws(()=>m.sheet(base.plan('energy','client','foundation'),'__proto__')));
const p=base.plan('energy','client','foundation');p.scenario='<script>alert(1)</script>';check(()=>assert.ok(m.sheet(p,'foundation').includes('&lt;script&gt;')&&!m.sheet(p,'foundation').includes('<script>')));
console.log('HF116 observation sheet: '+n+' PASS (fictional worksheet fixtures, not learner outcomes)');
