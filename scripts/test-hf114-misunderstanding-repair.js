'use strict';
const assert=require('node:assert/strict'),m=require('../assets/hf114-misunderstanding-repair'),base=require('../assets/hf111-workplace-preview');
let n=0;function check(f){f();n++;}
const positions=new Set();
for(const s of Object.keys(base.scenarios))for(const a of Object.keys(base.audiences)){const e=m.exercise(s,a);check(()=>assert.ok(e.heard&&e.fact&&e.audience&&e.retry&&e.model));check(()=>assert.equal(e.options.length,3));check(()=>assert.equal(e.options.filter(o=>o.clear).length,1));positions.add(e.options.findIndex(o=>o.clear));for(let i=0;i<3;i++)check(()=>assert.deepEqual(m.evaluate(s,a,i),e.options[i]));e.options[0].feedback='modified';check(()=>assert.notEqual(m.exercise(s,a).options[0].feedback,'modified'));}
check(()=>assert.equal(positions.size,3));
for(const bad of ['__proto__','constructor','bad',null,{},1]){check(()=>assert.throws(()=>m.exercise(bad,'client')));check(()=>assert.throws(()=>m.exercise('energy',bad)));}
for(const bad of [-1,3,0.5,'1',null,NaN])check(()=>assert.throws(()=>m.evaluate('energy','client',bad)));
console.log('HF114 misunderstanding repair: '+n+' PASS (fictional selected-response fixtures, not learner outcomes)');
