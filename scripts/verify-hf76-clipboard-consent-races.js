'use strict';
/* HF76 independent, deterministic real-install-script VM regression.
 * Checks no early clipboard writes, consent text, a stale delayed clipboard
 * promise, a second diagnostic, and explicit user-initiated report only.
 * No live browser APIs, user data, private URLs or network actions. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'pwa-install.js'),'utf8');
const html=fs.readFileSync(path.join(root,'learn/install/index.html'),'utf8');
const manifest=fs.readFileSync(path.join(root,'manifest.webmanifest'));
const icons=new Map([192,512].map(n=>[n,fs.readFileSync(path.join(root,`assets/englishlegalese-app-icon-${n}.png`))]));
const urls=['/manifest.webmanifest','/assets/englishlegalese-app-icon-192.png','/assets/englishlegalese-app-icon-512.png'];
assert.ok(html.includes('&continuity=hf75&consent=hf76'),'New script URL must bust cache while retaining earlier-version tokens');
for(const lang of ['th','vi','zh-Hans'])assert.equal((html.match(new RegExp(`<details lang="${lang}">`,'g'))||[]).length,1,'Preserve exactly one language panel');
function arrayBuffer(b){return b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength);}
class El{
 constructor(){this.textContent='';this.disabled=false;this.hidden=true;this.children=[];this.events={};}
 addEventListener(t,f){this.events[t]=f;}
 replaceChildren(){this.children=[];}
 append(e){this.children.push(e);}
}
async function exercise(variant){
 const ids=['el-install-button','el-install-status','el-update-check','el-update-apply','el-update-status',
  'el-app-network-status','el-device-check','el-device-check-status','el-device-check-results','el-device-check-help','el-device-check-copy','el-device-check-copy-status'];
 const els=Object.fromEntries(ids.map(id=>[id,new El()]));
 const requests=[],writes=[];
 let pendingWrite=null,settle=null;
 const navigator={onLine:true,serviceWorker:{controller:null,addEventListener(){},getRegistration:async()=>null,register:async()=>({addEventListener(){}})},
  clipboard:{writeText(text){writes.push(text);
   if(variant==='deferred')return new Promise(resolve=>{settle=resolve;});
   if(variant==='rejected')return Promise.reject(new Error('NotAllowedError'));
   return Promise.resolve();}}};
 if(variant==='unavailable')delete navigator.clipboard;
 const window={Response:function Response(){},isSecureContext:true,matchMedia:()=>({matches:false}),addEventListener(){},location:{reload(){throw Error('Never auto-reload');}}};
 const document={getElementById:id=>els[id]??null,createElement:()=>new El()};
 const fetch=async(url,opts)=>{
  assert.ok(urls.includes(url),'No private or cross-origin network');requests.push(url);
  assert.equal(opts.method,'GET');assert.equal(opts.credentials,'omit');assert.equal(opts.cache,'no-store');
  const body=url===urls[0]?manifest:icons.get(Number(url.match(/icon-(\d+)/)[1]));
  return {ok:true,redirected:false,headers:{get(name){return name==='content-type'?
   (url===urls[0]?'application/manifest+json':'image/png'):name==='content-length'?String(body.length):null;}},arrayBuffer:async()=>arrayBuffer(body)};
 };
 const scope={window,navigator,document,fetch,TextDecoder,Blob,Uint8Array,DataView,Promise,setTimeout,clearTimeout,
  AbortController:class{constructor(){this.signal={};}abort(){}},
  createImageBitmap:async b=>({width:b.size===icons.get(192).length?192:512,height:b.size===icons.get(192).length?192:512,close(){}})};
 vm.runInNewContext(source,scope,{timeout:3500,filename:'pwa-install.js'});
 const check=els['el-device-check'],copy=els['el-device-check-copy'],status=els['el-device-check-copy-status'];
 assert.deepEqual(requests,[]);assert.deepEqual(writes,[]);
 await copy.events.click();assert.deepEqual(writes,[],'No copy before a complete check');
 await check.events.click();assert.equal(els['el-device-check-results'].children.length,7);
 assert.equal(copy.hidden,false);assert.match(status.textContent,/requires another click/);
 assert.match(status.textContent,/Nothing has been copied or shared/);
 assert.deepEqual(writes,[],'No automatic clipboard access on diagnostic completion');
 const firstCopy=copy.events.click();
 if(variant==='deferred'){
  assert.equal(writes.length,1);assert.equal(copy.disabled,true);
  // A browser-generated synthetic click must not bypass the in-flight latch.
  await copy.events.click();assert.equal(writes.length,1);
  await check.events.click();assert.match(status.textContent,/requires another click/);
  const expected=status.textContent;
  settle();await firstCopy;
  assert.equal(status.textContent,expected,'An old clipboard completion must not overwrite newer check status');
  assert.equal(copy.disabled,false);
  const nextCopy=copy.events.click();assert.equal(writes.length,2,'Current check can be copied only with another click');
  settle();await nextCopy;
 }else{
  await firstCopy;
  if(variant==='unavailable')assert.match(status.textContent,/unavailable/);
  else if(variant==='rejected')assert.match(status.textContent,/not allowed/);
  else assert.match(status.textContent,/were copied/);
 }
 assert.equal(requests.length,variant==='deferred'?6:3,'Exactly three public GETs per explicit check');
 for(const report of writes){
  assert.match(report,/^EnglishLegalese public app readiness \(no private data\)/);
  assert.equal(report.split('\n').length,8);
  assert.ok(!/password|email@|api\/|user-agent|cookie=/i.test(report));
 }
 return variant;
}
(async()=>{for(const v of ['normal','rejected','unavailable','deferred'])await exercise(v);
 console.log('PASS HF76: 4 actual-script consent/clipboard race scenarios + 2-run stale completion isolation; no pre-click network, no automatic clipboard, 7 public rows.');
})().catch(e=>{console.error(e);process.exitCode=1;});
