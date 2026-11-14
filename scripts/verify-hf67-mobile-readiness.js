'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const js=read('pwa-install.js'),html=read('learn/install/index.html'),server=read('server.js');
for(const id of ['el-device-check','el-device-check-status','el-device-check-results'])
 assert.ok(html.includes('id="'+id+'"'));
for(const route of ['account','my-work','private-energy-contracts','teacher-submissions','owner-dashboard','employer-dashboard'])
 assert.ok(server.includes("'/learn/"+route+"'"),'Private cache exclusion: '+route);
for(const token of ["HF67_PRIVATE_SHELLS","pathname.startsWith('/api/')","private, no-store, max-age=0","Vary','Cookie, Authorization","setHeaders(res)"])
 assert.ok(server.includes(token),token);
assert.ok(js.includes("credentials:'omit'"));
assert.ok(js.includes("cache:'no-store'"));
assert.ok(js.includes("redirect:'error'"));
assert.ok(js.includes("deviceCheck.addEventListener('click'"));
assert.ok(js.includes("li.textContent=item"));
assert.ok(!js.includes('localStorage.setItem')&&!js.includes('sessionStorage.setItem'));
class Element{
 constructor(){this.handlers={};this.children=[];this.textContent='';this.disabled=false;this.hidden=true;}
 addEventListener(type,fn){this.handlers[type]=fn;}
 replaceChildren(){this.children=[];}
 append(el){this.children.push(el);}
}
const ids=['el-install-button','el-install-status','el-update-check','el-update-apply',
 'el-update-status','el-app-network-status','el-device-check','el-device-check-status','el-device-check-results'];
const els=Object.fromEntries(ids.map(id=>[id,new Element()]));
const calls=[];
const navigator={onLine:true,serviceWorker:{addEventListener(){},getRegistration:async()=>null,register:async()=>({addEventListener(){}})}};
const window={isSecureContext:true,matchMedia:()=>({matches:false}),addEventListener(){},location:{reload(){throw Error('no automatic reload')}}};
const manifest={scope:'/',start_url:'/',display:'standalone',icons:[{sizes:'192x192',type:'image/png'},{sizes:'512x512',type:'image/png'}]};
const fetch=async(url,opts)=>{
 calls.push({url,opts});
 assert.deepEqual({method:opts.method,cache:opts.cache,credentials:opts.credentials,redirect:opts.redirect},
  {method:'GET',cache:'no-store',credentials:'omit',redirect:'error'});
 if(!['/manifest.webmanifest','/assets/englishlegalese-app-icon-192.png','/assets/englishlegalese-app-icon-512.png'].includes(url))
  throw Error('Forbidden diagnostic request: '+url);
 return {ok:true,headers:{get:()=>url.endsWith('.webmanifest')?'application/manifest+json':'image/png'},json:async()=>manifest};
};
const document={getElementById:id=>els[id]||null,createElement:()=>new Element()};
vm.runInNewContext(js,{window,document,navigator,fetch,Promise},{filename:'pwa-install.js',timeout:1500});
assert.equal(calls.length,0,'No diagnostic requests without an explicit click');
(async()=>{
 await els['el-device-check'].handlers.click();
 assert.deepEqual(calls.map(x=>x.url),[
  '/manifest.webmanifest','/assets/englishlegalese-app-icon-192.png','/assets/englishlegalese-app-icon-512.png']);
 const results=els['el-device-check-results'].children.map(x=>x.textContent);
 for(const label of ['Secure connection','Installed window','Browser support','App manifest','App icon 192px','App icon 512px','App setup'])
  assert.ok(results.some(x=>x.startsWith(label+':')),label);
 assert.equal(els['el-device-check'].disabled,false);
 assert.ok(els['el-device-check-status'].textContent.includes('finished'));
 console.log('PASS HF67: seven consent-driven mobile-readiness checks; only public same-origin no-cookie GETs; no private API, automatic install, storage or reload; private HTTP no-store boundaries.');
})().catch(err=>{console.error(err);process.exitCode=1;});
