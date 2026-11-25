'use strict';
const assert=require('node:assert/strict'),m=require('../assets/hf111-workplace-preview');
let n=0;const check=f=>{f();n++;};
for(const s of Object.keys(m.scenarios))for(const a of Object.keys(m.audiences))for(const l of Object.keys(m.levels)){const p=m.plan(s,a,l);check(()=>assert.ok(p.base!==p.repeat&&p.terms.length===4&&p.audience&&p.level&&p.model&&p.focus));}
for(const bad of ['__proto__','constructor','',null,'unlisted'])check(()=>assert.throws(()=>m.plan(bad,'client','foundation')));
check(()=>assert.throws(()=>m.plan('energy','bad','foundation')));
check(()=>assert.throws(()=>m.plan('energy','client','bad')));
const a=[1,2,3,null,2,1],b=[2,2,1,3,null,3];check(()=>assert.deepEqual(m.compare(a,b).map(x=>x.change),['Higher self-rating','Same self-rating','Lower self-rating','Not compared','Not compared','Higher self-rating']));
for(const bad of [0,4,1.2,'2',NaN,undefined])check(()=>assert.throws(()=>m.compare([bad,1,1,1,1,1],b)));
check(()=>assert.throws(()=>m.compare([],b)));
console.log('HF111 workplace preview '+n+' PASS (pure-function fixtures, not verified learning outcomes)');
