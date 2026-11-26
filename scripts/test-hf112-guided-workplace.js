'use strict';
const assert=require('node:assert/strict'),m=require('../assets/hf112-guided-workplace');
let n=0;const check=f=>{f();n++;};
for(const s of Object.keys(m.checks))for(const a of Object.keys(m.audienceGuide))for(const t of Object.keys(m.targets)){const g=m.guidance(s,a,t);check(()=>assert.ok(g.checks.length===3&&g.transfer&&g.audience&&g.focus));}
for(const [i,s] of m.stages.entries())check(()=>assert.equal(m.next(s),m.stages[i+1]||null));
for(const x of ['__proto__','constructor','bad',null])check(()=>assert.throws(()=>m.guidance(x,'client','clarity')));
check(()=>assert.throws(()=>m.guidance('energy','bad','clarity')));check(()=>assert.throws(()=>m.guidance('energy','client','bad')));check(()=>assert.throws(()=>m.next('bad')));
check(()=>assert.deepEqual(m.reflection([false,true,null],[true,false,true]),['Newly reported as completed','Reported as needing more practice','Not compared']));
check(()=>assert.deepEqual(m.reflection([true,false,null],[true,false,null]),['Reported as completed both times','Reported as needing practice both times','Not compared']));
check(()=>assert.throws(()=>m.reflection([1,true,null],[true,false,true])));check(()=>assert.throws(()=>m.reflection([],[])));
console.log('HF112 guided workplace speaking: '+n+' PASS (synthetic checks, not measured learner outcomes)');
