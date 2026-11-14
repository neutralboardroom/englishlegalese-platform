'use strict';
// HF66: synthetic privacy and update contract for the optional browser app.
// Runs without browsers, network requests, credentials, student data or writes.
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const read=p=>fs.readFileSync(require('node:path').join(__dirname,'..',p),'utf8');
const worker=read('sw.js');
const install=read('learn/install/index.html');
const ui=read('pwa-install.js');
const manifest=JSON.parse(read('manifest.webmanifest'));
const source=read('server.js');
assert.equal(manifest.id,'/');
assert.deepEqual(manifest.shortcuts.map(x=>x.url),[
 '/learn/legal-english/','/learn/business-english/','/learn/account/'
]);
assert.ok(install.includes('id="el-update-check"'));
assert.ok(install.includes('id="el-update-apply"'));
assert.ok(install.includes('id="el-update-status"'));
assert.ok(install.includes('id="el-app-network-status"'));
for(const locale of ['th','vi','zh-Hans'])assert.ok(install.includes('lang="'+locale+'"'),'mobile instructions '+locale);
for(const slug of ['courses','legal-english','business-english'])assert.ok(install.includes('href="/learn/'+slug+'/"'));
assert.ok(install.includes('<nav class="v1840-topnav"'),'retain the established Legal + Business page chrome');
assert.ok(!ui.includes('localStorage')&&!ui.includes('sessionStorage'));
assert.ok(ui.includes("updateCheck.addEventListener('click'"),'update checks must require a click');
assert.ok(ui.includes("updateApply.addEventListener('click'"),'app update activation must require a click');
assert.ok(ui.includes("registration.waiting.postMessage({type:'ENGLISHLEGALESE_APPLY_UPDATE'})"));
assert.ok(ui.includes('if(requestedReload)'),'no unsolicited reload');
assert.ok(ui.includes("window.addEventListener('online'"));
assert.ok(ui.includes("window.addEventListener('offline'"));
assert.ok(ui.includes("await request.prompt()"),'retain explicit opt-in installation');
assert.ok(source.includes("app.get('/sw.js'"),'service worker served from controlled root');
assert.ok(worker.includes("PUBLIC_OFFLINE_CACHE='englishlegalese-public-offline-hf66-v1'"));
assert.ok(worker.includes("cache.add(new Request(PUBLIC_OFFLINE_PAGE"));
assert.ok(!worker.includes('cache.put(')&&!worker.includes('cache.addAll('));
assert.ok(!/\b(localStorage|sessionStorage|indexedDB)\b/.test(worker));

const events={},offline={status:200,offline:true,generic_only:true},writes=[];
let cacheAdds=[],networkCalls=[],networkOffline=true,skips=0,deleted=[],claims=0;
const caches={
 open:async name=>({add:async request=>{cacheAdds.push({name,url:request.url});}}),
 keys:async()=>['englishlegalese-public-offline-hf65-v1','other-site-cache'],
 delete:async name=>{deleted.push(name);return true;},
 match:async name=>name==='/learn/install/offline.html'?offline:undefined
};
const self={
 location:{origin:'https://englishlegalese.com'},
 clients:{claim:async()=>{claims++;}},
 skipWaiting:async()=>{skips++;},
 addEventListener:(kind,handler)=>{events[kind]=handler;}
};
const fetchFn=async request=>{
 networkCalls.push(request.url);
 if(networkOffline)throw Error('Synthetic offline');
 return {status:200,network:true};
};
vm.runInNewContext(worker,{
 self,caches,Request:class{constructor(url){this.url=url;}},
 Response:{error:()=>({status:0,offline_error:true})},
 fetch:fetchFn,URL,Set,Promise
},{filename:'sw.js',timeout:1500});
const awaitEvent=async(kind,props)=>{
 const jobs=[];events[kind]({...props,waitUntil:p=>jobs.push(p)});
 await Promise.all(jobs);
};
const navigate=async(url,mode='navigate',method='GET')=>{
 let response=null,intercepted=false;
 events.fetch({request:{url,mode,method},respondWith:p=>{intercepted=true;response=p;}});
 return {intercepted,response:intercepted?await response:null};
};
(async()=>{
 await awaitEvent('install',{});
 assert.deepEqual(cacheAdds,[{name:'englishlegalese-public-offline-hf66-v1',url:'/learn/install/offline.html'}],'only generic offline HTML may enter cache');
 assert.equal(skips,0,'install cannot force an update');
 await awaitEvent('activate',{});
 assert.deepEqual(deleted,['englishlegalese-public-offline-hf65-v1'],'only the old EnglishLegalese offline cache is deleted');
 assert.equal(claims,1);
 // No PWA interception or caching of ANY authenticated/private/unknown route.
 for(const path of ['/api/v119/auth/me','/api/v2150/private-energy/sessions',
 '/learn/account/','/learn/my-work/','/learn/private-energy-contracts/',
 '/learn/owner-dashboard/','/learn/employer-dashboard/',
 '/learn/teacher-submissions/','/learn/progress/','/learn/some-unknown-future-private-route/']){
  const result=await navigate('https://englishlegalese.com'+path);
  assert.equal(result.intercepted,false,'must be network-only: '+path);
 }
 assert.equal((await navigate('https://another-origin.example/')).intercepted,false);
 assert.equal((await navigate('https://englishlegalese.com/','no-cors')).intercepted,false);
 assert.equal((await navigate('https://englishlegalese.com/','navigate','POST')).intercepted,false);
 const home=await navigate('https://englishlegalese.com/');
 assert.equal(home.intercepted,true);assert.equal(home.response,offline,'only generic offline fallback');
 const legal=await navigate('https://englishlegalese.com/learn/legal-english/');
 assert.equal(legal.intercepted,true);assert.equal(legal.response,offline);
 const other=await navigate('https://englishlegalese.com/pricing/');
 assert.equal(other.intercepted,true);assert.equal(other.response,offline);
 const snapshot=cacheAdds.length;
 networkOffline=false;
 const online=await navigate('https://englishlegalese.com/learn/business-english/');
 assert.equal(online.intercepted,true);assert.equal(online.response.network,true,'online public page must be fetched fresh');
 assert.equal(cacheAdds.length,snapshot,'do not cache fetched public, private or API pages');
 await awaitEvent('message',{data:{type:'UNRELATED_MESSAGE'},source:{id:'good'}});
 await awaitEvent('message',{data:{type:'ENGLISHLEGALESE_APPLY_UPDATE'},source:null});
 assert.equal(skips,0,'worker cannot auto-activate from unrelated messages');
 await awaitEvent('message',{data:{type:'ENGLISHLEGALESE_APPLY_UPDATE'},source:{id:'same-origin-browser-client'}});
 assert.equal(skips,1,'only deliberate client update activates');
 assert.deepEqual(writes,[]);
 console.log('PASS HF66: 3 app shortcuts, Thai/Vietnamese/Chinese guidance, explicit install/update, strict public fallback, no private interception/cache, fresh network, no auto skipWaiting or reload.');
})().catch(error=>{console.error(error);process.exitCode=1;});
