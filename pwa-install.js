/* EnglishLegalese HF74 (cumulative, opt-in safety unchanged): opt-in app installation and opt-in PWA updates.
 * Installation or update/reload never runs without a visitor click.
 * No cookies, tokens, storage, analytics or private work is read here. */
(()=>{'use strict';
 const button=document.getElementById('el-install-button');
 const status=document.getElementById('el-install-status');
 const updateCheck=document.getElementById('el-update-check');
 const updateApply=document.getElementById('el-update-apply');
 const updateStatus=document.getElementById('el-update-status');
 const networkStatus=document.getElementById('el-app-network-status');
 const deviceCheck=document.getElementById('el-device-check');
 const deviceCheckStatus=document.getElementById('el-device-check-status');
 const deviceCheckResults=document.getElementById('el-device-check-results');
 const deviceCheckHelp=document.getElementById('el-device-check-help');
 const deviceCheckCopy=document.getElementById('el-device-check-copy');
 const deviceCheckCopyStatus=document.getElementById('el-device-check-copy-status');
 if(!button||!status)return;
 let deferredPrompt=null,registration=null,requestedReload=false;
 let deviceCheckRunning=false;
 let completedPublicRows=[];
 // The clipboard is never touched automatically: an explicit second user
 // click copies only the seven public installation statuses (no device ID,
 // user-agent, account, URL query, cookie, class, or learning data).
 if(deviceCheckCopy&&deviceCheckCopyStatus){
  deviceCheckCopy.addEventListener('click',async()=>{
   if(!completedPublicRows.length||deviceCheckRunning)return;
   if(!navigator.clipboard||typeof navigator.clipboard.writeText!=='function'){
    deviceCheckCopyStatus.textContent='Copying is unavailable in this browser. You can read the public results above.';
    return;
   }
   deviceCheckCopy.disabled=true;
   try{
    await navigator.clipboard.writeText('EnglishLegalese public app readiness (no private data)\n'+completedPublicRows.join('\n'));
    deviceCheckCopyStatus.textContent='The seven public app-file results were copied. No private learning data was included.';
   }catch{deviceCheckCopyStatus.textContent='Copying was not allowed. The results remain visible above.';}
   finally{deviceCheckCopy.disabled=false;}
  });
 }
 const installed=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 function show(message){status.textContent=message;}
 function showUpdate(message){if(updateStatus)updateStatus.textContent=message;}
 // HF68 R3: an existing waiting worker on iPad/WebKit is legitimate, but
 // the opt-in control must never advertise a non-existent or uncontrolled
 // update. Do not automatically activate/reload merely because one waits.
 function showPendingUpdate(){
  if(!registration?.waiting||!navigator.serviceWorker?.controller){
   if(updateApply)updateApply.hidden=true;
   return false;
  }
  if(updateApply)updateApply.hidden=false;
  // Preserve a just-failed explicit postMessage diagnostic while syncing
  // WebKit's actual button visibility. A new Check or Apply click replaces it.
  if(!updateStatus?.textContent?.includes('The update request could not be sent.'))
   showUpdate('An updated EnglishLegalese app is ready. Apply it only when you have finished any class or unsaved work.');
  return true;
 }
 function updateConnection(){
  if(networkStatus)networkStatus.textContent=navigator.onLine
   ?'Your device reports a network connection. Classes and saved work still require a working internet connection.'
   :'Your device reports that it is offline. Private classes and saved work require an internet connection.';
 }
 updateConnection();
 window.addEventListener('online',updateConnection);
 window.addEventListener('offline',updateConnection);
 // HF67: manual checks of only public same-origin install assets. Do not
 // read authentication, call an API, log user identifiers, prompt or reload.
 if(deviceCheck&&deviceCheckStatus&&deviceCheckResults){
  deviceCheck.addEventListener('click',async()=>{
   // An automated/synthetic click may arrive even while disabled. Prevent
   // overlapping network requests and cross-run result mixing as well.
   if(deviceCheckRunning)return;
   deviceCheckRunning=true;
   completedPublicRows=[];
   if(deviceCheckCopy)deviceCheckCopy.hidden=true;
   if(deviceCheckCopyStatus)deviceCheckCopyStatus.textContent='';
   deviceCheck.disabled=true;
   deviceCheckStatus.textContent='Checking the public app files on this device…';
   deviceCheckResults.replaceChildren();
   if(deviceCheckHelp)deviceCheckHelp.replaceChildren();
   const results=[];
   const issues=[];
   // HF72: announce every completed check immediately instead of leaving the
   // visitor with an apparently frozen blank list on a slow mobile network.
   const record=(name,message)=>{
    const item=name+': '+message;
    results.push(item);
    const li=document.createElement('li');li.textContent=item;deviceCheckResults.append(li);
    deviceCheckStatus.textContent='Public-file check in progress: '+name+' completed…';
   };
   try{
   record('Secure connection',window.isSecureContext?'Available':'Not available; HTTPS is required for most browser app installation');
   if(!window.isSecureContext)issues.push('Open this page using HTTPS on a secure connection.');
   record('Installed window',installed()?'EnglishLegalese appears to be open as an installed web app':'This page is not currently running in standalone mode');
   record('Browser support','serviceWorker' in navigator?'Service workers are supported':'Service workers are unavailable in this browser');
   if(!('serviceWorker' in navigator))issues.push('Try an up-to-date browser that supports service workers; the website still works without installation.');
   // HF68: fail closed for stalled, redirected, mislabeled or oversized
   // public install assets. Requests never include authentication cookies.
   async function publicFile(url,expected){
    const controller=typeof AbortController==='function'?new AbortController():null;
    const opts={method:'GET',cache:'no-store',credentials:'omit',redirect:'error'};
    if(controller)opts.signal=controller.signal;
    const timer=controller&&typeof setTimeout==='function'
     ?setTimeout(()=>controller.abort(),7000):null;
    try{
     const response=await fetch(url,opts);
     const type=(response.headers.get('content-type')||'').split(';')[0].trim().toLowerCase();
     // HF70: reject malformed or unbounded advertised body lengths, not just
     // a numeric >1MiB value. Response bodies are checked separately too.
     const rawLength=response.headers.get('content-length');
     const length=rawLength===null?null:String(rawLength).trim();
     if(!response.ok||response.redirected||type!==expected||
       (length!==null&&(!/^\d{1,7}$/.test(length)||Number(length)>1024*1024))){
      // HF72: release the rejected response rather than allowing an invalid
      // streamed response to keep consuming mobile network resources.
      try{if(controller)controller.abort();}catch{}
      return {ok:false,reason:'Could not validate this public app file'};
     }
     return {ok:true,response,controller};
    }catch{return {ok:false,reason:'Public file unavailable, timed out or network check blocked'};}
    finally{if(timer!==null)clearTimeout(timer);}
   }
   // HF70: headers alone must not end the timeout. Abort slow body reads
   // after seven seconds too, so the opt-in check cannot hang indefinitely.
   async function boundedBody(promise,controller){
    if(typeof setTimeout!=='function')return promise;
    let timer=null;
    try{return await Promise.race([promise,new Promise((_,reject)=>{
     timer=setTimeout(()=>{
      try{if(controller)controller.abort();}catch{}
      reject(new Error('Public app file read timed out'));
     },7000);
    })]);}
    finally{if(timer!==null)clearTimeout(timer);}
   }
   // HF71: read public manifest and PNG bodies incrementally when the
   // browser supports response.body. Enforce the 1 MiB limit *before*
   // accumulating chunks, validate the actual Content-Length, cap unusually
   // fragmented streams, and retain HF70's body timeout + AbortController.
   // Older WebViews without a response reader retain a bounded fallback.
   async function publicBytes(response,controller){
    const maxBytes=1024*1024;
    const declaredValue=response.headers.get('content-length');
    const declared=declaredValue===null?null:Number(String(declaredValue).trim());
    if(response.body&&typeof response.body.getReader==='function'){
     const reader=response.body.getReader();
     const consume=async()=>{
      let received=0,chunkCount=0;
      const chunks=[];
      while(true){
       const next=await reader.read();
       if(next.done)break;
       const chunk=next.value;
       if(!chunk||typeof chunk.byteLength!=='number'||
          chunk.byteLength<0||++chunkCount>4096)
        throw new Error('Malformed public file stream');
       received+=chunk.byteLength;
       if(received>maxBytes)throw new Error('Oversized public app file');
       // A reader may reuse its backing buffer for later chunks. Snapshot each
       // bounded chunk before the next read so PNG CRC/UTF-8 checks examine the
       // exact wire bytes, not a subsequently mutated buffer.
       if(chunk.byteLength)chunks.push(Uint8Array.from(chunk));
      }
      if(declared!==null&&received!==declared)
       throw new Error('Public app file length mismatch');
      const bytes=new Uint8Array(received);
      let at=0;
      for(const chunk of chunks){bytes.set(chunk,at);at+=chunk.byteLength;}
      return bytes;
     };
     try{return await boundedBody(consume(),controller);}
     catch(error){
      try{if(controller)controller.abort();}catch{}
      try{if(typeof reader.cancel==='function')reader.cancel();}catch{}
      throw error;
     }finally{
      try{if(typeof reader.releaseLock==='function')reader.releaseLock();}catch{}
     }
    }
    // Fallback for older browsers / existing deterministic HF65-HF70 tests.
    const bytes=new Uint8Array(await boundedBody(response.arrayBuffer(),controller));
    if(bytes.length>maxBytes||declared!==null&&bytes.length!==declared)
     throw new Error('Public app file length mismatch or too large');
    return bytes;
   }
   async function publicManifest(result){
    const response=result.response;
    // HF73: real older browsers without ReadableStream still have arrayBuffer.
    // Never bypass the 1 MiB actual-byte and Content-Length checks by trusting
    // response.json(), and apply strict UTF-8 decoding on both supported paths.
    if(typeof response.arrayBuffer==='function'&&typeof TextDecoder==='function'){
     const bytes=await publicBytes(response,result.controller);
     return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
    }
    // Compatibility for historical fake fetch objects which expose json()
    // only. Real browsers lacking these APIs cannot prove byte boundedness;
    // reject rather than claim a validated manifest.
    if(typeof response.json!=='function'||typeof window.Response==='function')
     throw new Error('Verified manifest parsing unavailable');
    return boundedBody(response.json(),result.controller);
   }
   // HF70 strengthens HF69 structural/CRC checks with PNG chunk ordering,
   // palette validity, IHDR flags and contiguous IDAT. No user/secret APIs.
   async function validPng(response,size,controller){
    try{
     const bytes=await publicBytes(response,controller);
     if(bytes.length<45||bytes.length>1024*1024)return false;
     const signature=[137,80,78,71,13,10,26,10];
     if(!signature.every((part,i)=>bytes[i]===part))return false;
     const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
     let pos=8,ihdr=false,idat=false,iend=false,plte=false,afterIdat=false,color=-1;
     while(pos+12<=bytes.length){
      const len=view.getUint32(pos);
      if(len>bytes.length-pos-12)return false;
      const type=String.fromCharCode(bytes[pos+4],bytes[pos+5],bytes[pos+6],bytes[pos+7]);
      // PNG reserved third character is always uppercase; unknown critical
      // chunks are rejected. Ancillary chunks may surround but not split IDAT.
      if(!/^[A-Za-z]{2}[A-Z][A-Za-z]$/.test(type))return false;
      const stop=pos+12+len;
      let crc=0xFFFFFFFF;
      for(let i=pos+4;i<pos+8+len;i++){
       crc^=bytes[i];
       for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xEDB88320:0);
      }
      if(((crc^0xFFFFFFFF)>>>0)!==view.getUint32(pos+8+len))return false;
      if(!ihdr){
       if(type!=='IHDR'||len!==13||view.getUint32(pos+8)!==size||view.getUint32(pos+12)!==size)return false;
       const depth=bytes[pos+16];color=bytes[pos+17];
       if(depth!==8||![2,3,6].includes(color)||bytes[pos+18]!==0||bytes[pos+19]!==0||bytes[pos+20]>1)return false;
       ihdr=true;
      }else if(type==='IHDR')return false;
      if(type==='PLTE'){
       if(plte||idat||len<3||len>768||len%3!==0)return false;
       plte=true;
      }
      if(type==='IDAT'){
       if(afterIdat||iend||len===0||color===3&&!plte)return false;
       idat=true;
      }else if(idat)afterIdat=true;
      if(type==='IEND'){
       if(!idat||len!==0||stop!==bytes.length)return false;
       iend=true;break;
      }
      if(type==='tRNS'&&(idat||color===6))return false;
      if(type!=='IHDR'&&type!=='PLTE'&&type!=='IDAT'&&type!=='IEND'&&
        type.charCodeAt(0)>=65&&type.charCodeAt(0)<=90)return false;
      pos=stop;
     }
     const structurallyValid=ihdr&&idat&&iend&&(color!==3||plte);
     if(!structurallyValid)return false;
     // HF72: CRC-correct PNG bytes can still contain broken compressed image
     // pixels. Where available, let the real browser decode them and validate
     // dimensions; never trust a synthetic CRC alone. Close bitmap resources.
     if(typeof createImageBitmap==='function'&&typeof Blob==='function'){
      let bitmap=null,finished=false;
      const close=resource=>{try{if(resource&&typeof resource.close==='function')resource.close();}catch{}};
      try{
       // HF73: late bitmap completion after a timeout must also be released,
       // otherwise a rejected diagnostic can leak decoded image memory.
       const decode=Promise.resolve(createImageBitmap(new Blob([bytes],{type:'image/png'})))
        .then(resource=>{if(finished){close(resource);return null;}return resource;});
       bitmap=await boundedBody(decode,controller);
       return !!bitmap&&bitmap.width===size&&bitmap.height===size;
      }catch{return false;}
      finally{finished=true;close(bitmap);}
     }
     return 'structural'; // Truthful: browser cannot decode pixels here.
    }catch{return false;}
   }
   const manifestResult=await publicFile('/manifest.webmanifest','application/manifest+json');
   if(!manifestResult.ok)record('App manifest',manifestResult.reason);
   else{
    try{
     const data=await publicManifest(manifestResult);
     // HF74: a manifest with required local icons can still contain *extra*
     // third-party icon URLs or shortcut destinations. Do not mark it safe
     // when installation could later request/navigate off the approved site.
     const safeIconNames={
      '/assets/englishlegalese-app-icon-192.png':'image/png',
      '/assets/englishlegalese-app-icon-512.png':'image/png',
      '/assets/favicon.svg':'image/svg+xml'
     };
     const iconsLocal=Array.isArray(data?.icons)&&data.icons.every(icon=>
      icon&&typeof icon.src==='string'&&
      Object.prototype.hasOwnProperty.call(safeIconNames,icon.src)&&
      icon.type===safeIconNames[icon.src]);
     // HF75: shortcut icons, screenshots and extra web-app handlers can
     // reference destinations not verified by the three consent-only GETs.
     // This release does not ship those optional features. Reject them
     // rather than claiming that an uninspected manifest is fully safe.
     const unverifiedFeatures=['screenshots','share_target','protocol_handlers',
      'file_handlers','related_applications','serviceworker','launch_handler'];
     const noUnverifiedFeatures=unverifiedFeatures.every(key=>
      !Object.prototype.hasOwnProperty.call(data||{},key));
     const shortcutsLocal=typeof data?.shortcuts==='undefined'||
      (Array.isArray(data.shortcuts)&&data.shortcuts.every(shortcut=>
       shortcut&&typeof shortcut.url==='string'&&
       ['/learn/legal-english/','/learn/business-english/','/learn/account/'].includes(shortcut.url)&&
       !Object.prototype.hasOwnProperty.call(shortcut,'icons')));
     const valid=data&&data.id==='/'&&data.scope==='/'&&data.start_url==='/'&&
      data.display==='standalone'&&iconsLocal&&shortcutsLocal&&noUnverifiedFeatures&&
      [192,512].every(size=>{
       // HF72: an ambiguous duplicate icon-size record might mislead the
       // installer; require one exact, local PNG candidate for each size.
       const candidates=data.icons.filter(icon=>icon&&icon.sizes===size+'x'+size);
       return candidates.length===1&&
        candidates[0].src==='/assets/englishlegalese-app-icon-'+size+'.png'&&
        candidates[0].type==='image/png';
      });
     record('App manifest',valid?'Present and configured':'Present but missing required app settings');
     if(!valid)issues.push('The public app manifest is not configured correctly. Try again online or continue on the regular website.');
    }catch{
     record('App manifest','Could not read the public manifest');
     issues.push('The public app manifest could not be verified. Check your connection and try again.');
    }
   }
   for(const size of [192,512]){
    const icon=await publicFile('/assets/englishlegalese-app-icon-'+size+'.png','image/png');
    const valid=icon.ok&&await validPng(icon.response,size,icon.controller);
    record('App icon '+size+'px',valid===true?'Valid '+size+'×'+size+' PNG (pixels decoded)':
     valid==='structural'?'Valid '+size+'×'+size+' PNG structure and CRC (pixel decoding unavailable)':
     icon.ok?'Public file did not match the expected PNG dimensions or integrity requirements':icon.reason);
    if(!valid)issues.push('The '+size+'px app icon did not pass verification. Try again with a stable connection; the website remains available.');
   }
   if('serviceWorker' in navigator){
    try{
     const reg=await navigator.serviceWorker.getRegistration('/');
     record('App setup',reg?'A service worker is registered in this browser':'No service worker registration found yet; visit this page over HTTPS');
    }catch{record('App setup','Registration status unavailable');}
   }else record('App setup','This browser cannot register a service worker');
   if(deviceCheckHelp){
    const suggestions=issues.length?issues:[
     'Public app files passed the available checks. Your browser still decides whether to offer installation.',
     'You can keep studying on the website; installation and updates remain optional.'
    ];
    for(const item of suggestions){
     const li=document.createElement('li');li.textContent=item;deviceCheckHelp.append(li);
    }
   }
   // A complete check is seven public status rows. Reuse a frozen copy of
   // these text-only rows only if the visitor clicks the separate copy button.
   if(results.length===7){
    completedPublicRows=results.slice();
    if(deviceCheckCopy)deviceCheckCopy.hidden=false;
   }
   deviceCheckStatus.textContent='Device and public-file check finished. Results describe this browser only; they do not guarantee that an installation prompt will appear.';
   }catch{
    // A malformed browser shim, inaccessible response property, or unexpected
    // DOM exception must not leave the check button permanently disabled.
    deviceCheckStatus.textContent='The public-file check could not finish. No private work or account data was accessed.';
   }finally{deviceCheck.disabled=false;deviceCheckRunning=false;}
  });
 }

 if(installed()){
  show('EnglishLegalese is already open as an installed app. You can check for updates below.');
  button.hidden=true;
 }
 window.addEventListener('beforeinstallprompt',event=>{
  event.preventDefault();
  if(installed())return;
  deferredPrompt=event;
  button.hidden=false;button.disabled=false;
  show('Your browser offers installation. Press the button only if you want EnglishLegalese on this device.');
 });
 window.addEventListener('appinstalled',()=>{
  deferredPrompt=null;button.hidden=true;
  show('Your browser reported that EnglishLegalese was installed on this device.');
 });
 button.addEventListener('click',async()=>{
  if(!deferredPrompt)return;
  const request=deferredPrompt;
  deferredPrompt=null;button.disabled=true;button.hidden=true;
  try{
   await request.prompt();
   const outcome=await request.userChoice;
   if(outcome?.outcome==='accepted')show('Install request accepted. Your browser will finish the installation.');
   else show('Installation was not selected. You can continue using the website without it.');
  }catch{
   show('The browser could not complete the install prompt. You can use its Install app/Add to Home Screen menu instead.');
  }
 });
 if(!('serviceWorker' in navigator)||!window.isSecureContext){
  if(!installed())show('Installation support depends on your browser and HTTPS. Use the browser menu or continue on the website.');
  showUpdate('App update checking is unavailable in this browser. The regular website still works online.');
  return;
 }
 function watchInstalling(){
  const worker=registration?.installing;
  if(!worker)return;
  const watch=()=>{
   if(worker.state==='installed'&&navigator.serviceWorker.controller&&registration?.waiting)showPendingUpdate();
   else if(worker.state==='redundant'){
    if(!registration?.waiting&&updateApply)updateApply.hidden=true;
    showUpdate('The update did not finish installing. You may check again.');
   }
  };
  worker.addEventListener('statechange',watch);
  watch();
 }
 // HF74 R2: WebKit can obtain a controller *after* register() resolves
 // while a new worker is already waiting. Keep the button bound to actual
 // waiting+controlled state on controllerchange. Never activate or reload
 // unless the visitor explicitly requested an update first.
 navigator.serviceWorker.addEventListener('controllerchange',()=>{
  if(requestedReload){
   requestedReload=false;
   // This page alone is reloaded, and only after the user explicitly
   // chose "Apply update". Never reload a live classroom in the background.
   window.location.reload();
   return;
  }
  if(registration)showPendingUpdate();
 });
 // iPad may suspend/resume an install page while the registration changes.
 // Resynchronize on return without fetching, messaging a worker or reloading.
 window.addEventListener('focus',()=>{if(registration)showPendingUpdate();});
 if(typeof document.addEventListener==='function'){
  document.addEventListener('visibilitychange',()=>{
   if(registration&&document.visibilityState==='visible')showPendingUpdate();
  });
 }
 if(updateCheck)updateCheck.addEventListener('click',async()=>{
  if(!registration){showUpdate('App setup is not ready. Try again in a moment.');return;}
  updateCheck.disabled=true;showUpdate('Checking for an app update without changing classes or saved work…');
  try{
   await registration.update();
   if(registration.waiting&&navigator.serviceWorker.controller)showPendingUpdate();
   else if(registration.installing)showUpdate('The browser is preparing the update. You may continue studying.');
   else{
    if(updateApply)updateApply.hidden=true;
    showUpdate('No waiting update was found. Your next visit still checks live website content.');
   }
  }catch{showUpdate('The update check could not finish. Your existing app and learning records are unchanged.');}
  finally{updateCheck.disabled=false;}
 });
 if(updateApply)updateApply.addEventListener('click',()=>{
  if(!registration?.waiting||!navigator.serviceWorker.controller){
   updateApply.hidden=true;showUpdate('No app update is waiting. Use Check for app updates to try again.');return;
  }
  updateApply.hidden=true;
  requestedReload=true;
  showUpdate('You chose to apply the update. This installation page will reload when the browser activates it.');
  try{registration.waiting.postMessage({type:'ENGLISHLEGALESE_APPLY_UPDATE'});}
  catch{
   // The worker may disappear between checking and posting. Never authorize
   // a later controllerchange to reload a visitor's unsaved work.
   requestedReload=false;
   showUpdate('The update request could not be sent. No page was reloaded. Check for app updates and try again.');
  }
 });
 // A service worker is registered only on the visitor-opened install page.
 // Its cache holds only a public generic offline notice, never account data.
 window.addEventListener('load',()=>{
  navigator.serviceWorker.register('/sw.js',{scope:'/'})
   .then(reg=>{
    registration=reg;
    if(updateCheck){updateCheck.disabled=false;updateCheck.hidden=false;}
    if(reg.waiting&&navigator.serviceWorker.controller)showPendingUpdate();
    else if(updateApply)updateApply.hidden=true;
    reg.addEventListener('updatefound',watchInstalling);
    watchInstalling();
    if(!deferredPrompt&&!installed())show('App setup is available. Use the browser menu to Install app/Add to Home Screen if a button does not appear.');
    if(!reg.waiting)showUpdate('Updates are available through the website. Choose Check for app updates whenever you wish.');
   })
   .catch(()=>{
    if(!installed())show('This browser did not enable app setup. You can still use the regular website and try its Add to Home Screen menu.');
    showUpdate('App update checking is unavailable right now. No existing classes or files were changed.');
   });
 },{once:true});
})();
