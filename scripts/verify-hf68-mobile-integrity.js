'use strict';
/* HF68: independent offline VM proof of optional app file integrity.
   No live network, student record, login, browser permission or install. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const base=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(base,p),'utf8');
const source=read('pwa-install.js'),html=read('learn/install/index.html'),server=read('server.js');
const manifest=JSON.parse(read('manifest.webmanifest'));
const iconBytes=new Map([[192,fs.readFileSync(path.join(base,'assets/englishlegalese-app-icon-192.png'))],
 [512,fs.readFileSync(path.join(base,'assets/englishlegalese-app-icon-512.png'))]]);
assert.ok(source.includes('validPng'),'must validate real icon signatures/dimensions, not MIME alone');
assert.ok(source.includes("credentials:'omit'"));
assert.ok(source.includes("redirect:'error'"));
assert.ok(source.includes("cache:'no-store'"));
assert.ok(source.includes('controller.abort()'),'stalled public fetches must be abortable');
assert.ok(html.includes('pwa-install.js?v=hf68'),'mobile script cache key updated');
assert.ok(server.includes('function hf68IsPrivateWorkspace(pathname)'));
assert.ok(server.includes("p.startsWith(base+'/')"),'protect nested private workspace URLs');
assert.ok(server.includes("pathname.startsWith('/api/')"));
assert.ok(server.includes("private, no-store, max-age=0"));
assert.ok(server.includes("setHeaders(res)"),'static private response policy remains');
assert.ok(manifest.icons.some(i=>i.src==='/assets/englishlegalese-app-icon-192.png'));
assert.ok(manifest.icons.some(i=>i.src==='/assets/englishlegalese-app-icon-512.png'));
const cloneBuffer=b=>b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength);
async function scenario(mode){
 class E{
  constructor(){this.handlers={};this.children=[];this.disabled=false;this.hidden=true;this.textContent='';}
  addEventListener(k,cb){this.handlers[k]=cb;}
  replaceChildren(){this.children=[];}
  append(x){this.children.push(x);}
 }
 const ids=['el-install-button','el-install-status','el-update-check','el-update-apply','el-update-status',
 'el-app-network-status','el-device-check','el-device-check-status','el-device-check-results'];
 const els=Object.fromEntries(ids.map(id=>[id,new E()])),requests=[];
 const window={isSecureContext:true,matchMedia:()=>({matches:false}),addEventListener(){},location:{reload(){throw Error('No automatic reload allowed');}}};
 const navigator={onLine:true,serviceWorker:{addEventListener(){},getRegistration:async()=>null,register:async()=>({addEventListener(){}})}};
 const fetch=async(url,opts)=>{
  requests.push({url,opts});
  assert.equal(opts.credentials,'omit');assert.equal(opts.cache,'no-store');assert.equal(opts.redirect,'error');
  assert.equal(opts.method,'GET');
  if(!['/manifest.webmanifest','/assets/englishlegalese-app-icon-192.png','/assets/englishlegalese-app-icon-512.png'].includes(url))
   throw Error('Private or cross-origin URL requested: '+url);
  const size=Number((url.match(/icon-(192|512)\.png/)||[])[1]);
  const redirect=mode==='redirect'&&url==='/manifest.webmanifest';
  const missing=mode==='missing'&&size===512;
  const ctype=url.endsWith('.webmanifest')?'application/manifest+json':'image/png';
  return {
   ok:!missing,redirected:redirect,
   headers:{get:key=>key==='content-type'?ctype:key==='content-length'?'0':null},
   json:async()=>mode==='badmanifest'?{...manifest,icons:manifest.icons.map(x=>({...x,src:'/wrong.png'}))}:manifest,
   arrayBuffer:async()=>cloneBuffer(mode==='corrupt'&&size===192?Buffer.from('not a png'):iconBytes.get(size))
  };
 };
 const document={getElementById:id=>els[id]||null,createElement:()=>new E()};
 vm.runInNewContext(source,{window,document,navigator,fetch,Promise,Uint8Array,DataView,String},
  {filename:'pwa-install.js',timeout:1500});
 assert.equal(requests.length,0,'No public file requests before deliberate click');
 await els['el-device-check'].handlers.click();
 assert.deepEqual(requests.map(x=>x.url),[
  '/manifest.webmanifest','/assets/englishlegalese-app-icon-192.png','/assets/englishlegalese-app-icon-512.png'
 ]);
 const result=els['el-device-check-results'].children.map(x=>x.textContent);
 assert.equal(result.length,7);
 assert.equal(els['el-device-check'].disabled,false);
 assert.ok(els['el-device-check-status'].textContent.includes('check finished'));
 return result;
}
(async()=>{
 const good=await scenario('good');
 for(const size of [192,512])assert.ok(good.some(x=>x.includes('App icon '+size+'px: Valid '+size+'×'+size+' PNG')),size);
 assert.ok(good.some(x=>x.includes('App manifest: Present and configured')));
 const corrupt=await scenario('corrupt');
 assert.ok(corrupt.some(x=>x.includes('App icon 192px: Public file did not match the expected PNG dimensions')));
 const missing=await scenario('missing');
 assert.ok(missing.some(x=>x.includes('App icon 512px: Could not validate')));
 const bad=await scenario('badmanifest');
 assert.ok(bad.some(x=>x.includes('App manifest: Present but missing required app settings')));
 const redirect=await scenario('redirect');
 assert.ok(redirect.some(x=>x.includes('App manifest: Could not validate')));
 console.log('PASS HF68: complete installed-app source icon signatures/dimensions, no-cookie click-only bounded fetch, corrupted/redirect/missing manifest detection, private route no-store invariants.');
})().catch(e=>{console.error(e);process.exitCode=1;});
