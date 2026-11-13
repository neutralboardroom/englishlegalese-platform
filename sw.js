/* EnglishLegalese HF65: opt-in installed-app worker.
 * A fresh generic offline message is the ONLY response stored by this worker.
 * NEVER cache real lessons, user data, class schedules, account screens,
 * navigation pages, API/auth responses, credentials, uploads or AI replies. */
'use strict';
const PUBLIC_OFFLINE_CACHE='englishlegalese-public-offline-hf65-v1';
const PUBLIC_OFFLINE_PAGE='/learn/install/offline.html';
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(PUBLIC_OFFLINE_CACHE).then(cache=>cache.add(new Request(PUBLIC_OFFLINE_PAGE,{cache:'reload'}))));
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k.startsWith('englishlegalese-public-offline-')&&k!==PUBLIC_OFFLINE_CACHE)
   .map(k=>caches.delete(k)));
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 if(event.request.mode!=='navigate'||event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 // Fail closed for private or potentially privileged routes; no offline
 // representation of student schedules, content, account or provider data.
 if(url.pathname.startsWith('/api/')||
    /^\/learn\/(?:account|my-work|private-energy-contracts|owner-dashboard|teacher-submissions|employer-dashboard)(?:\/|$)/.test(url.pathname))return;
 event.respondWith(fetch(event.request,{cache:'no-store'}).catch(async()=>{
  return (await caches.match(PUBLIC_OFFLINE_PAGE))||Response.error();
 }));
});
