'use strict';
// Preserve the existing Chromium observation evidence through the separate
// WebKit invocation, whose Playwright output directory is independently cleaned.
// No production data or application behavior is touched.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),cp=require('node:child_process'),assert=require('node:assert/strict');
const projects=['desktop-chromium','tablet-chromium','mobile-chromium'];
const routes=['/','/learn/courses/','/learn/legal-english/','/learn/business-english/','/learn/legal-vocabulary/','/learn/conversation-rehearsal/','/learn/reading-precision/','/learn/app/'];
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
function token(s){assert.ok(typeof s==='string'&&/^[A-Za-z0-9_-]{1,100}$/.test(s),'invalid CI scope token');return s;}
function scopedRoot(env,head,tmp=os.tmpdir()){
 assert.match(head,/^[0-9a-f]{40}$/,'exact Git HEAD required');
 return path.join(tmp,'englishlegalese-hf109',token(env.GITHUB_RUN_ID),token(env.GITHUB_RUN_ATTEMPT),token(env.GITHUB_JOB),head);
}
function pairDir(root,project,route){
 assert.ok(projects.includes(project),'unexpected Chromium project');
 const i=routes.indexOf(route);assert.ok(i>=0,'unexpected route');
 return path.join(root,project,String(i));
}
function validate(json,png,project,route){
 const o=JSON.parse(json.toString('utf8'));
 assert.equal(o.schema,'rdr003.rendered-observation.v1');
 assert.equal(o.status,'OBSERVATION_ONLY_NOT_APPROVED');
 assert.equal(o.route,route);assert.equal(o.project,project);
 assert.ok(o.viewport.width>0&&o.viewport.height>0);
 assert.ok(png.length>8&&png.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'PNG signature');
 assert.equal(o.screenshotSha256,digest(png),'screenshot digest mismatch');
 return {json,png};
}
function save(root,project,route,json,png){
 validate(json,png,project,route);
 const dir=pairDir(root,project,route);fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,'observation.json'),json,{flag:'wx'});
 fs.writeFileSync(path.join(dir,'viewport.png'),png,{flag:'wx'});
}
function carry(root,route,destination){
 for(const project of projects){
  const src=pairDir(root,project,route);
  const json=fs.readFileSync(path.join(src,'observation.json')),png=fs.readFileSync(path.join(src,'viewport.png'));
  validate(json,png,project,route);
  const dir=path.join(destination,project);fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'observation.json'),json,{flag:'wx'});
  fs.writeFileSync(path.join(dir,'viewport.png'),png,{flag:'wx'});
 }
 return projects.length;
}
function retainAcrossPhases(info,route,jsonFile,pngFile){
 // Local single-project runs do not pretend that all CI phases have run.
 if(process.env.GITHUB_ACTIONS!=='true')return 0;
 const head=cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),root=scopedRoot(process.env,head);
 if(projects.includes(info.project.name)){
  save(root,info.project.name,route,fs.readFileSync(jsonFile),fs.readFileSync(pngFile));return 0;
 }
 if(info.project.name==='tablet-webkit')return carry(root,route,info.outputPath('hf109-retained-chromium'));
 throw new Error('Unexpected browser project '+info.project.name);
}
module.exports={projects,routes,digest,scopedRoot,validate,save,carry,retainAcrossPhases};
