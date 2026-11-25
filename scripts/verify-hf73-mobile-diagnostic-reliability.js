'use strict';
/* HF73: run real opt-in installer JS in a fully isolated VM. No network,
 * account data, production service, browser installation or automatic reload. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'pwa-install.js'),'utf8');
const html=fs.readFileSync(path.join(root,'learn/install/index.html'),'utf8');
const manifest=fs.readFileSync(path.join(root,'manifest.webmanifest'));
const pngs=new Map([192,512].map(n=>[n,fs.readFileSync(path.join(root,`assets/englishlegalese-app-icon-${n}.png`))]));
const urls=['/manifest.webmanifest','/assets/englishlegalese-app-icon-192.png','/assets/englishlegalese-app-icon-512.png'];
assert.ok(html.includes('fallback=hf73&guidance=hf73'),'HF73 browser cache bust must load updated code');
assert.ok(html.includes('id="el-device-check-help"'),'Accessible next-step list must exist');
const toBuffer=b=>b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength);
async function scenario(mode){
 class Element{constructor(){this.children=[];this.events={};this.disabled=false;this.hidden=true;this.textContent='';}
  addEventListener(type,fn){this.events[type]=fn;}
  replaceChildren(){this.children=[];}
  append(child){this.children.push(child);}}
 const ids=['el-install-button','el-install-status','el-update-check','el-update-apply',
  'el-update-status','el-app-network-status','el-device-check','el-device-check-status',
  'el-device-check-results','el-device-check-help'];
 const elements=Object.fromEntries(ids.map(id=>[id,new Element()]));
 const calls=[];
 let bitmapCloses=0,bitmapDecodes=0,lateResolve=null,jsonCount=0,abortCount=0;
 let decoding=false;
 const useStream=mode==='reused_chunks';
 const brokenManifest=Buffer.from(manifest);
 if(mode==='invalid_utf8')brokenManifest.set([0xc3,0x28],20);
 const getData=url=>url.includes('.png')?pngs.get(Number(url.match(/icon-(\d+)/)[1])):
  mode==='huge_manifest'?Buffer.alloc(1024*1024+1,32):mode==='invalid_utf8'?brokenManifest:manifest;
 const fetch=async(url,options)=>{
  assert.ok(urls.includes(url),'No private/external fetch');
  assert.equal(options.method,'GET');assert.equal(options.credentials,'omit');
  assert.equal(options.cache,'no-store');assert.equal(options.redirect,'error');
  calls.push(url);
  const data=getData(url);const isManifest=url===urls[0];
  const response={ok:true,redirected:false,
   headers:{get:key=>key==='content-type'?(isManifest?'application/manifest+json':'image/png'):
     key==='content-length'?mode==='huge_manifest'&&isManifest?null:String(data.length):null},
   json(){jsonCount++;throw Error('Do not parse JSON without checking its bytes');},
   arrayBuffer:async()=>toBuffer(data)};
  if(useStream){
   let position=0;const reused=new Uint8Array(64);
   response.body={getReader:()=>({
    async read(){
     if(position>=data.length)return {done:true};
     const count=Math.min(reused.length,data.length-position);
     reused.fill(0);reused.set(data.subarray(position,position+count));position+=count;
     return {done:false,value:reused.subarray(0,count)};
    },releaseLock(){},cancel(){}})};
  }
  return response;
 };
 class Controller{constructor(){this.signal={};}abort(){abortCount++;}}
 const createImageBitmap=blob=>{
  bitmapDecodes++;
  const n=blob.size===pngs.get(192).length?192:512;
  const resource=()=>({width:n,height:n,close(){bitmapCloses++;}});
  if(mode==='late_decode'&&n===192){decoding=true;return new Promise(resolve=>{lateResolve=()=>resolve(resource());});}
  return Promise.resolve(resource());
 };
 const setTimeoutShim=(fn,delay)=>{
  if(mode==='late_decode'&&decoding&&delay===7000){Promise.resolve().then(fn);}
  return 1;
 };
 const window={isSecureContext:true,Response:function Response(){},
  matchMedia:()=>({matches:false}),addEventListener(){},
  location:{reload(){throw Error('Never reload without an explicit update click');}}};
 const document={getElementById:id=>elements[id]??null,createElement:()=>new Element()};
 const navigator={onLine:true,serviceWorker:{controller:null,addEventListener(){},getRegistration:async()=>null,register:async()=>({addEventListener(){}})}};
 const sandbox={window,document,navigator,fetch,Promise,Uint8Array,DataView,String,AbortController:Controller,
  Blob,TextDecoder,createImageBitmap:mode==='no_pixel_decoder'?undefined:createImageBitmap,
  setTimeout:mode==='late_decode'?setTimeoutShim:setTimeout,clearTimeout};
 vm.runInNewContext(source,sandbox,{filename:'pwa-install.js',timeout:4000});
 assert.deepEqual(calls,[],'Diagnostic must never fetch before click');
 await elements['el-device-check'].events.click();
 assert.deepEqual(calls,urls,'Exactly three public allowed URLs after consent');
 assert.equal(elements['el-device-check'].disabled,false,'Button must recover in all scenarios');
 assert.equal(elements['el-device-check-results'].children.length,7,'Seven results');
 assert.ok(elements['el-device-check-help'].children.length>0,'Useful next steps provided');
 const rows=elements['el-device-check-results'].children.map(x=>x.textContent);
 const manifestRow=rows.find(x=>x.startsWith('App manifest:'));
 const icon192=rows.find(x=>x.startsWith('App icon 192px:'));
 if(mode==='huge_manifest'||mode==='invalid_utf8'){
  assert.ok(!manifestRow.includes('Present and configured'),'Malformed/oversize manifest cannot pass');
  assert.equal(jsonCount,0,'Fallback must not bypass bounded strict decoding with response.json');
  assert.ok(elements['el-device-check-help'].children.some(x=>x.textContent.includes('manifest')),'Manifest failure gives actionable advice');
 }
 if(mode==='reused_chunks'){
  assert.ok(manifestRow.includes('Present and configured'),'Reused stream buffer must not corrupt manifest');
  assert.ok(icon192.includes('Valid 192×192 PNG'),'Reused stream buffer must not corrupt PNG');
 }
 if(mode==='no_pixel_decoder'){
  assert.ok(icon192.includes('structure and CRC (pixel decoding unavailable)'),'Do not claim image pixel decode on unsupported browsers');
  assert.equal(bitmapDecodes,0);
 }
 if(mode==='late_decode'){
  assert.ok(!icon192.includes('Valid'),'Timed-out bitmap must not be treated as valid');
  assert.equal(bitmapCloses,1,'Second bitmap completed normally and closed');
  assert.equal(typeof lateResolve,'function');
  lateResolve();await Promise.resolve();await Promise.resolve();
  assert.equal(bitmapCloses,2,'Late first bitmap must also be closed after timeout');
  assert.ok(abortCount>=1,'Timed-out bitmap should abort diagnostic work');
 }
 if(mode==='normal'){
  assert.ok(manifestRow.includes('Present and configured'));
  assert.ok(icon192.includes('pixels decoded'));
  assert.equal(bitmapCloses,2);
 }
 return {mode,rows:rows.length,help:elements['el-device-check-help'].children.length};
}
(async()=>{
 const all=[];
 for(const mode of ['normal','huge_manifest','invalid_utf8','reused_chunks','no_pixel_decoder','late_decode'])
  all.push(await scenario(mode));
 console.log('PASS HF73: strict byte-checked nonstream manifest, UTF-8 rejection, reused-buffer-safe stream, late bitmap cleanup, truthful structural-only results, actionable on-device guidance, click-only public GETs, and no automatic reload');
})().catch(e=>{console.error(e);process.exitCode=1;});
