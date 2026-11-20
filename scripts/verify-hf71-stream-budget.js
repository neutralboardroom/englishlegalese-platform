"use strict";
/* HF71: enforce stream-memory budgets and length checks in the real opt-in
 * installer; test both icons and manifest with no live network or private data. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const script=fs.readFileSync(path.join(root,'pwa-install.js'),'utf8');
const html=fs.readFileSync(path.join(root,'learn/install/index.html'),'utf8');
assert.ok(html.includes('pwa-install.js?v=hf68&integrity=hf69&strict=hf70&bounded=hf71'));
const manifest=fs.readFileSync(path.join(root,'manifest.webmanifest'));
const icon=new Map([192,512].map(n=>[n,fs.readFileSync(path.join(root,`assets/englishlegalese-app-icon-${n}.png`))]));
const publicPaths=['/manifest.webmanifest','/assets/englishlegalese-app-icon-192.png','/assets/englishlegalese-app-icon-512.png'];
const modes=['clean','short_length','oversize','stall','reader_error','many_empty_chunks'];
async function verify(mode,target){
 class E{constructor(){this.children=[];this.disabled=false;this.hidden=true;this.textContent='';this.events={};}
  addEventListener(t,f){this.events[t]=f;}replaceChildren(){this.children=[];}append(x){this.children.push(x);}}
 const ids=['el-install-button','el-install-status','el-update-check','el-update-apply','el-update-status','el-app-network-status','el-device-check','el-device-check-status','el-device-check-results'];
 const elements=Object.fromEntries(ids.map(id=>[id,new E()]));
 const requests=[];let aborts=0,readerCalls=0;
 class Controller{constructor(){this.signal={};}abort(){aborts++;}}
 const fetch=async(url,opts)=>{
  assert.ok(publicPaths.includes(url));
  assert.equal(opts.method,'GET');assert.equal(opts.credentials,'omit');assert.equal(opts.cache,'no-store');assert.equal(opts.redirect,'error');
  requests.push(url);
  const size=Number((url.match(/icon-(192|512)\.png/)||[])[1]);
  const contents=size?icon.get(size):manifest;
  const active=url===target;
  const data=active&&mode==='oversize'?Buffer.alloc(1024*1024+9):contents;
  let index=0;
  const chunks=active&&mode==='oversize'?[data.subarray(0,600000),data.subarray(600000)]:
    [data.subarray(0,Math.floor(data.length/3)),data.subarray(Math.floor(data.length/3))];
  const reader={
   async read(){readerCalls++;
    if(active&&mode==='stall')return new Promise(()=>{});
    if(active&&mode==='reader_error')throw Error('stream interrupted');
    if(active&&mode==='many_empty_chunks')return {done:false,value:new Uint8Array(0)};
    if(index>=chunks.length)return {done:true};
    return {done:false,value:chunks[index++]};
   },cancel(){},releaseLock(){}
  };
  const length=active&&mode==='short_length'?'1':null;
  return {ok:true,redirected:false,headers:{get:k=>k==='content-type'?size?'image/png':'application/manifest+json':k==='content-length'?length:null},body:{getReader:()=>reader},arrayBuffer(){throw Error('Streaming reader must be used');},json(){throw Error('Streaming manifest must be used');}};
 };
 const document={getElementById:k=>elements[k]||null,createElement:()=>new E()};
 const window={isSecureContext:true,matchMedia:()=>({matches:false}),addEventListener(){},location:{reload(){throw Error('Unexpected reload');}}};
 const navigator={onLine:true,serviceWorker:{controller:null,addEventListener(){},getRegistration:async()=>null,register:async()=>({addEventListener(){}})}};
 const clock=(callback,ms)=>setTimeout(callback,ms===7000?2:ms);
 vm.runInNewContext(script,{document,window,navigator,fetch,Promise,Uint8Array,DataView,String,AbortController:Controller,TextDecoder,setTimeout:clock,clearTimeout},{filename:'pwa-install.js',timeout:5000});
 assert.equal(requests.length,0,'Never fetch until the visitor clicks');
 await elements['el-device-check'].events.click();
 assert.deepEqual(requests,publicPaths,'No auth, account, booking, email or private URL calls');
 assert.equal(elements['el-device-check'].disabled,false,'Button must recover after incomplete public file');
 assert.ok(readerCalls>0,'Streaming API must be used');
 const rows=elements['el-device-check-results'].children.map(e=>e.textContent);
 assert.equal(rows.length,7,'Expected all public check rows');
 const row=target==='/manifest.webmanifest'?rows.find(s=>s.startsWith('App manifest:')):
  rows.find(s=>s.startsWith('App icon '+(target.includes('192')?'192':'512')+'px:'));
 assert.ok(row, 'Missing targeted diagnostic row');
 const valid=target==='/manifest.webmanifest'?row.includes('Present and configured'):row.includes('Valid '+(target.includes('192')?'192':'512')+'×');
 assert.equal(valid,mode==='clean','Public file should '+(mode==='clean'?'pass':'FAIL')+': '+mode+' '+target+' '+row);
 if(mode==='stall'||mode==='oversize'||mode==='reader_error'||mode==='many_empty_chunks')assert.ok(aborts>=1,'Bad reader must abort best-effort');
}
(async()=>{
 for(const target of publicPaths){for(const mode of modes)await verify(mode,target);}
 console.log('PASS HF71: real 192/512 icons and manifest; streaming budget, declared length, stalled/error/fragmented readers, no credential/private fetch or unsolicited reload');
})().catch(e=>{console.error(e);process.exitCode=1});
