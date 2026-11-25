'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const h=require('./hf109-visual-evidence-retention'),c=require('./hf110-compact-visual-review');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'hf110-test-')),head='a'.repeat(40);
const input=path.join(tmp,'input'),out=path.join(tmp,'out');let checks=0;
const ok=fn=>{fn();checks++;};
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/h1sAAAAASUVORK5CYII=','base64');
function observation(project,route){return Buffer.from(JSON.stringify({schema:'rdr003.rendered-observation.v1',status:'OBSERVATION_ONLY_NOT_APPROVED',project,route,viewport:{width:1,height:1},screenshotSha256:h.digest(png)}));}
function write(dir,j,p,project,route){fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,j),observation(project,route));fs.writeFileSync(path.join(dir,p),png);}
try{
 fs.mkdirSync(input);
 for(const [i,route] of h.routes.entries()){
  const d=path.join(input,'case-'+i);
  write(d,'hf108-visual-evidence.json','hf108-viewport.png','tablet-webkit',route);
  for(const project of h.projects)write(path.join(d,'hf109-retained-chromium',project),'observation.json','viewport.png',project,route);
 }
 ok(()=>assert.equal(c.collect(input,out,head),32));
 for(const project of c.projects){
  const d=path.join(out,project),m=JSON.parse(fs.readFileSync(path.join(d,'manifest.json')));
  ok(()=>assert.equal(m.status,'OBSERVATION_ONLY_NOT_APPROVED'));ok(()=>assert.equal(m.head,head));ok(()=>assert.equal(m.entries.length,8));
  for(const e of m.entries){ok(()=>assert.equal(h.digest(fs.readFileSync(path.join(d,e.json))),e.jsonSha256));ok(()=>assert.equal(h.digest(fs.readFileSync(path.join(d,e.png))),e.pngSha256));}
 }
 ok(()=>assert.throws(()=>c.collect(input,out,head)));
 ok(()=>assert.throws(()=>c.collect(input,path.join(tmp,'bad-head'),'bad')));
 const target=path.join(input,'case-0','hf109-retained-chromium',h.projects[0],'viewport.png');
 fs.unlinkSync(target);ok(()=>assert.throws(()=>c.collect(input,path.join(tmp,'missing'),head)));ok(()=>assert.ok(!fs.existsSync(path.join(tmp,'missing'))));
 fs.writeFileSync(target,Buffer.concat([png,Buffer.from([1])]));ok(()=>assert.throws(()=>c.collect(input,path.join(tmp,'corrupt'),head)));
 fs.writeFileSync(target,png);
 const d=path.join(input,'duplicate');fs.cpSync(path.join(input,'case-0'),d,{recursive:true});
 ok(()=>assert.throws(()=>c.collect(input,path.join(tmp,'duplicate-output'),head)));
 fs.rmSync(d,{recursive:true,force:true});
 const j=path.join(input,'case-0','hf108-visual-evidence.json');fs.writeFileSync(j,observation('desktop-chromium','/'));
 ok(()=>assert.throws(()=>c.collect(input,path.join(tmp,'wrong-phase'),head)));
 fs.writeFileSync(j,observation('tablet-webkit','/'));
 fs.unlinkSync(target);fs.symlinkSync(path.join(input,'case-0','hf108-viewport.png'),target);
 ok(()=>assert.throws(()=>c.collect(input,path.join(tmp,'symlink'),head)));
 console.log('HF110 compact visual evidence: '+checks+' PASS (synthetic fixtures; not visual approval)');
}finally{fs.rmSync(tmp,{recursive:true,force:true});}
