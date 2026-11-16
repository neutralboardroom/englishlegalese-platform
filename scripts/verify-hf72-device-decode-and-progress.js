'use strict';
/* HF72: test the actual, consent-only diagnostic with a browser bitmap-decoder
 * mock, duplicate manifest data, failed headers, progressive updates, and
 * guaranteed button recovery. No external network or student records. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const script=fs.readFileSync(path.join(root,'pwa-install.js'),'utf8');
const html=fs.readFileSync(path.join(root,'learn/install/index.html'),'utf8');
assert.ok(html.includes('bounded=hf71&decode=hf72'),'Installer must use the HF72 source');
assert.ok(script.includes('createImageBitmap(new Blob([bytes]'),'Browser image decoder must be invoked');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
const icon=new Map([192,512].map(n=>[n,fs.readFileSync(path.join(root,`assets/englishlegalese-app-icon-${n}.png`))]));
const publicPaths=['/manifest.webmanifest',...Array.from(icon.keys()).map(n=>`/assets/englishlegalese-app-icon-${n}.png`)];
const buffer=b=>b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength);
async function scenario(mode){
 class E{constructor(){this.events={};this.children=[];this.disabled=false;this.hidden=true;this.textContent='';}
  addEventListener(name,fn){this.events[name]=fn;}replaceChildren(){this.children=[];}append(x){this.children.push(x);}}
 const ids=['el-install-button','el-install-status','el-update-check','el-update-apply','el-update-status','el-app-network-status','el-device-check','el-device-check-status','el-device-check-results'];
 const elements=Object.fromEntries(ids.map(id=>[id,new E()]));
 const results=elements['el-device-check-results'];
 let closeCount=0,decodeCount=0,abortCount=0;
 const calls=[];
 const duplicated={...manifest,icons:[...manifest.icons,{...manifest.icons.find(i=>i.sizes==='192x192')} ]};
 const fetch=async(url,opts)=>{
  assert.ok(publicPaths.includes(url),'No private/cross-origin URL');
  assert.equal(opts.credentials,'omit');assert.equal(opts.cache,'no-store');assert.equal(opts.redirect,'error');assert.equal(opts.method,'GET');
  // The first three environment rows must be visible BEFORE the first fetch.
  assert.ok(results.children.length>=3,'Checks should report progress immediately');
  calls.push(url);
  const size=Number((url.match(/icon-(192|512)\.png/)||[])[1]);
  const body=size?icon.get(size):Buffer.from(JSON.stringify(mode==='manifest_duplicate'?duplicated:manifest));
  const type=mode==='bad_header'&&size===192?'text/html':size?'image/png':'application/manifest+json';
  return {ok:true,redirected:false,
   headers:{get:key=>key==='content-type'?type:key==='content-length'?String(body.length):null},
   arrayBuffer:async()=>buffer(body),
   json:async()=>mode==='manifest_duplicate'?duplicated:manifest};
 };
 class Controller{constructor(){this.signal={};}abort(){abortCount++;}}
 const createImageBitmap=async blob=>{
  decodeCount++;
  const size=blob.size===icon.get(192).length?192:512;
  if(mode==='decode_error'&&size===192)throw Error('Cannot decode compressed PNG pixels');
  return {width:mode==='decode_wrong_size'&&size===512?17:size,height:size,
   close(){closeCount++;}};
 };
 const window={isSecureContext:true,matchMedia:()=>({matches:false}),addEventListener(){},location:{reload(){throw Error('No unsolicited reload');}}};
 const document={getElementById:id=>elements[id]||null,createElement:()=>new E()};
 const navigator={onLine:true,serviceWorker:{controller:null,addEventListener(){},getRegistration:async()=>null,register:async()=>({addEventListener(){}})}};
 vm.runInNewContext(script,{window,document,navigator,fetch,Promise,Uint8Array,DataView,String,AbortController:Controller,Blob,createImageBitmap,TextDecoder,setTimeout,clearTimeout},{filename:'pwa-install.js',timeout:5000});
 assert.deepEqual(calls,[],'No network before explicit consent');
 await elements['el-device-check'].events.click();
 assert.deepEqual(calls,publicPaths,'Exactly three approved public URLs');
 assert.equal(results.children.length,7,'Seven incremental results; no duplicates');
 assert.equal(elements['el-device-check'].disabled,false,'Button must recover');
 assert.match(elements['el-device-check-status'].textContent,/check finished/);
 const rows=results.children.map(row=>row.textContent);
 assert.equal(rows[0].startsWith('Secure connection:'),true);
 const a=rows.find(row=>row.startsWith('App icon 192px:'));
 const b=rows.find(row=>row.startsWith('App icon 512px:'));
 const m=rows.find(row=>row.startsWith('App manifest:'));
 assert.ok(a&&b&&m);
 if(mode==='decode_error')assert.ok(!a.includes('Valid 192×192'),'Decoder failure must not claim icon valid');
 else if(mode==='bad_header')assert.ok(!a.includes('Valid 192×192'),'Wrong MIME must fail closed');
 else assert.ok(a.includes('Valid 192×192'),mode+': valid 192 icon');
 if(mode==='decode_wrong_size')assert.ok(!b.includes('Valid 512×512'),'Wrong decoded dimensions must fail');
 else assert.ok(b.includes('Valid 512×512'),mode+': valid 512 icon');
 if(mode==='manifest_duplicate')assert.ok(!m.includes('Present and configured'),'Ambiguous duplicate icon must fail');
 else assert.ok(m.includes('Present and configured'),mode+': manifest should pass');
 assert.equal(closeCount,decodeCount-(mode==='decode_error'?1:0),'Every decoded bitmap must be closed');
 if(mode==='bad_header')assert.ok(abortCount>=1,'Invalid headers must abort the in-flight response');
 return {mode,decodeCount,closeCount,abortCount};
}
(async()=>{
 const outcomes=[];
 for(const mode of ['valid','decode_error','decode_wrong_size','manifest_duplicate','bad_header'])outcomes.push(await scenario(mode));
 assert.ok(outcomes[0].decodeCount===2,'Both valid icons should receive pixel decoding');
 console.log('PASS HF72: browser bitmap decode and release, duplicate-manifest guard, rejected-header abort, incremental UI, no-cookie click-only public requests, no unsolicited reload');
})().catch(error=>{console.error(error);process.exitCode=1;});
