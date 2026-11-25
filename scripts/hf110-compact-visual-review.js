'use strict';
// Local, bounded evidence exporter, not an educational approval engine.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const h=require('./hf109-visual-evidence-retention');
const projects=[...h.projects,'tablet-webkit'];
const MAX_FILE=6*1024*1024,MAX_PROJECT=24*1024*1024;
function read(p){const s=fs.lstatSync(p);assert.ok(s.isFile()&&!s.isSymbolicLink()&&s.size>0&&s.size<=MAX_FILE,'invalid/oversize evidence '+p);return fs.readFileSync(p);}
function collect(input,output,head){
 assert.match(head,/^[0-9a-f]{40}$/,'exact head');
 assert.ok(!fs.existsSync(output),'refuse to overwrite output');
 const source=fs.lstatSync(input);assert.ok(source.isDirectory()&&!source.isSymbolicLink(),'input directory required');
 const pairs=new Map(),sizes=new Map(projects.map(p=>[p,0]));
 function add(project,route,j,p){
  assert.ok(projects.includes(project)&&h.routes.includes(route),'unexpected mapping');
  const key=project+'|'+route;assert.ok(!pairs.has(key),'duplicate evidence '+key);
  const json=read(j),png=read(p);h.validate(json,png,project,route);
  assert.ok(png.length>=33&&png.readUInt32BE(8)===13&&png.toString('ascii',12,16)==='IHDR','PNG IHDR missing');
  const width=png.readUInt32BE(16),height=png.readUInt32BE(20);
  assert.ok(width>0&&height>0&&width<=16384&&height<=16384,'invalid PNG dimensions');
  const bytes=sizes.get(project)+json.length+png.length;assert.ok(bytes<=MAX_PROJECT,'project evidence exceeds budget');sizes.set(project,bytes);
  pairs.set(key,{project,route,json,png,width,height});
 }
 // The original WebKit invocation cleans test-results, so the eight final
 // observation folders must contain its own pair and three retained Chromium pairs.
 for(const e of fs.readdirSync(input,{withFileTypes:true})){
  if(!e.isDirectory())continue;
  const d=path.join(input,e.name),j=path.join(d,'hf108-visual-evidence.json');
  if(!fs.existsSync(j))continue;
  const r=JSON.parse(read(j).toString('utf8'));assert.equal(r.project,'tablet-webkit','expected final phase only');
  add(r.project,r.route,j,path.join(d,'hf108-viewport.png'));
  const retained=path.join(d,'hf109-retained-chromium');
  assert.ok(fs.lstatSync(retained).isDirectory()&&!fs.lstatSync(retained).isSymbolicLink(),'retained evidence directory');
  for(const project of h.projects){
   const sub=path.join(retained,project);assert.ok(fs.lstatSync(sub).isDirectory()&&!fs.lstatSync(sub).isSymbolicLink(),'project directory');
   add(project,r.route,path.join(sub,'observation.json'),path.join(sub,'viewport.png'));
  }
 }
 assert.equal(pairs.size,projects.length*h.routes.length,'missing observations');
 for(const project of projects)for(const route of h.routes)assert.ok(pairs.has(project+'|'+route),'missing '+project+' '+route);
 // Validate everything before creating any review output.
 fs.mkdirSync(output);
 for(const project of projects){
  const dir=path.join(output,project);fs.mkdirSync(dir);
  const manifest={schema:'englishlegalese.rdr003.compact-review.v1',head,project,status:'OBSERVATION_ONLY_NOT_APPROVED',scope:'Eight public initial viewport observations, no human review, off-screen/interactive/physical/offline acceptance not established',entries:[]};
  for(const [i,route] of h.routes.entries()){
   const p=pairs.get(project+'|'+route),name=String(i+1).padStart(2,'0');
   const jf=name+'.json',pf=name+'.png';
   fs.writeFileSync(path.join(dir,jf),p.json,{flag:'wx'});fs.writeFileSync(path.join(dir,pf),p.png,{flag:'wx'});
   manifest.entries.push({route,json:jf,png:pf,jsonSha256:h.digest(p.json),pngSha256:h.digest(p.png),width:p.width,height:p.height});
  }
  const bytes=JSON.stringify(manifest,null,2)+'\n';assert.ok(Buffer.byteLength(bytes)+sizes.get(project)<=MAX_PROJECT,'manifest exceeds project budget');
  fs.writeFileSync(path.join(dir,'manifest.json'),bytes,{flag:'wx'});
 }
 return pairs.size;
}
if(require.main===module){const [input,output,head]=process.argv.slice(2);assert.ok(input&&output&&head,'usage: input output head');console.log('HF110 compact evidence: '+collect(input,output,head)+' observations, not visual approval');}
module.exports={collect,projects,MAX_FILE,MAX_PROJECT};
