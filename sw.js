/* EnglishLegalese HF66: network-first installable browser app.
 * Cache ONLY the static generic offline explanation, never student/course
 * work, account pages, payments, Google Meet, uploaded contracts or API calls.
 * New workers wait until the visitor explicitly chooses an update on the
 * install page; no surprise reload during a private lesson. */
'use strict';
const PUBLIC_OFFLINE_CACHE='englishlegalese-public-offline-hf66-v1';
const PUBLIC_OFFLINE_PAGE='/learn/install/offline.html';
// Fail closed. Only these known public landing routes may display the
// generic offline fallback. Private paths including owner-dashboard and
// private-energy-contracts, plus all other routes, stay network-only.
const PUBLIC_FALLBACK_PATHS=new Set([
 '/','/index.html','/learn/install/','/learn/start/','/learn/courses/',
 '/learn/legal-english/','/learn/business-english/','/learn/legal-resources/',
 '/learn/business-resources/','/pricing/'
]);
self.addEventListener('install',event=>{
 // No automatic skipWaiting: the prior working app stays active until the
 // person chooses "Apply update" from the install page.
 event.waitUntil(caches.open(PUBLIC_OFFLINE_CACHE)
  .then(cache=>cache.add(new Request(PUBLIC_OFFLINE_PAGE,{cache:'reload'}))));
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith('englishlegalese-public-offline-')&&key!==PUBLIC_OFFLINE_CACHE)
   .map(key=>caches.delete(key)));
  await self.clients.claim();
 })());
});
self.addEventListener('message',event=>{
 // A ServiceWorker client has the same origin; honor only the exact manual
 // update command. No client can request cache writes or private responses.
 if(event.data?.type==='ENGLISHLEGALESE_APPLY_UPDATE'&&event.source){
  event.waitUntil(self.skipWaiting());
 }
});
self.addEventListener('fetch',event=>{
 if(event.request.mode!=='navigate'||event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 if(url.pathname.startsWith('/api/')||!PUBLIC_FALLBACK_PATHS.has(url.pathname))return;
 event.respondWith(fetch(event.request,{cache:'no-store'}).catch(async()=>
  (await caches.match(PUBLIC_OFFLINE_PAGE))||Response.error()
 ));
});
