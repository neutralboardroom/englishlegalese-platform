'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const h=require('./hf109-visual-evidence-retention');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'hf109-evidence-test-'));
let n=0;const ok=(f)=>{f();n++;};
try{
 const env={GITHUB_RUN_ID:'10',GITHUB_RUN_ATTEMPT:'1',GITHUB_JOB:'verify'},head='a'.repeat(40);
 const root=h.scopedRoot(env,head,dir),other=h.scopedRoot({...env,GITHUB_RUN_ATTEMPT:'2'},head,dir),independent=h.scopedRoot({...env,GITHUB_JOB:'verify-independent'},head,dir);
 ok(()=>assert.notEqual(root,other));ok(()=>assert.notEqual(root,independent));
 ok(()=>assert.notEqual(root,h.scopedRoot(env,'b'.repeat(40),dir)));
 ok(()=>assert.throws(()=>h.scopedRoot({...env,GITHUB_JOB:'../bad'},head,dir)));
 ok(()=>assert.throws(()=>h.scopedRoot(env,'not-a-commit',dir)));
 const png=Buffer.from([137,80,78,71,13,10,26,10,1,2,3]); // deliberately synthetic fixture, not a real screenshot
 const route='/learn/legal-vocabulary/';
 const json=(project,over={})=>Buffer.from(JSON.stringify({schema:'rdr003.rendered-observation.v1',status:'OBSERVATION_ONLY_NOT_APPROVED',route,project,viewport:{width:390,height:844},screenshotSha256:h.digest(png),...over}));
 for(const p of h.projects)ok(()=>h.save(root,p,route,json(p),png));
 ok(()=>assert.throws(()=>h.save(root,h.projects[0],route,json(h.projects[0]),png)));
 ok(()=>assert.throws(()=>h.validate(json(h.projects[0],{status:'APPROVED'}),png,h.projects[0],route)));
 ok(()=>assert.throws(()=>h.validate(json(h.projects[0],{route:'/'}),png,h.projects[0],route)));
 ok(()=>assert.throws(()=>h.validate(json(h.projects[0]),png,h.projects[1],route)));
 ok(()=>assert.throws(()=>h.validate(json(h.projects[0]),Buffer.concat([png,Buffer.from([4])]),h.projects[0],route)));
 ok(()=>assert.throws(()=>h.save(root,'../bad',route,json(h.projects[0]),png)));
 ok(()=>assert.throws(()=>h.save(root,h.projects[0],'/bad',json(h.projects[0]),png)));
 const out=path.join(dir,'final-test-results');
 ok(()=>assert.equal(h.carry(root,route,out),3));
 for(const p of h.projects){ok(()=>assert.deepEqual(fs.readFileSync(path.join(out,p,'observation.json')),json(p)));ok(()=>assert.deepEqual(fs.readFileSync(path.join(out,p,'viewport.png')),png));}
 ok(()=>assert.throws(()=>h.carry(other,route,path.join(dir,'missing'))));
 ok(()=>assert.throws(()=>h.carry(root,route,out)));
 console.log('HF109 cross-phase evidence retention: '+n+' PASS (synthetic fixtures, not visual approval)');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
