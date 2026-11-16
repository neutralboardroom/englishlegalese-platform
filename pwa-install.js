/* EnglishLegalese HF71 (cumulative, opt-in safety unchanged): opt-in app installation and opt-in PWA updates.
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
 if(!button||!status)return;
 let deferredPrompt=null,registration=null,requestedReload=false;
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
   deviceCheck.disabled=true;
   deviceCheckStatus.textContent='Checking the public app files on this device…';
   deviceCheckResults.replaceChildren();
   const results=[];
   const record=(name,message)=>results.push(name+': '+message);
   record('Secure connection',window.isSecureContext?'Available':'Not available; HTTPS is required for most browser app installation');
   record('Installed window',installed()?'EnglishLegalese appears to be open as an installed web app':'This page is not currently running in standalone mode');
   record('Browser support','serviceWorker' in navigator?'Service workers are supported':'Service workers are unavailable in this browser');
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
       (length!==null&&(!/^\d{1,7}$/.test(length)||Number(length)>1024*1024)))
      return {ok:false,reason:'Could not validate this public app file'};
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
       if(chunk.byteLength)chunks.push(chunk);
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
    if(response.body&&typeof response.body.getReader==='function'){
     const bytes=await publicBytes(response,result.controller);
     if(typeof TextDecoder!=='function')throw new Error('UTF-8 decoding unavailable');
     return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
    }
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
     return ihdr&&idat&&iend&&(color!==3||plte);
    }catch{return false;}
   }
   const manifestResult=await publicFile('/manifest.webmanifest','application/manifest+json');
   if(!manifestResult.ok)record('App manifest',manifestResult.reason);
   else{
    try{
     const data=await publicManifest(manifestResult);
     const valid=data.id==='/'&&data.scope==='/'&&data.start_url==='/'&&
      data.display==='standalone'&&Array.isArray(data.icons)&&
      [192,512].every(size=>data.icons.some(icon=>
       icon.src==='/assets/englishlegalese-app-icon-'+size+'.png'&&
       icon.sizes===size+'x'+size&&icon.type==='image/png'));
     record('App manifest',valid?'Present and configured':'Present but missing required app settings');
    }catch{record('App manifest','Could not read the public manifest');}
   }
   for(const size of [192,512]){
    const icon=await publicFile('/assets/englishlegalese-app-icon-'+size+'.png','image/png');
    const valid=icon.ok&&await validPng(icon.response,size,icon.controller);
    record('App icon '+size+'px',valid?'Valid '+size+'×'+size+' PNG':icon.ok?
     'Public file did not match the expected PNG dimensions':icon.reason);
   }
   if('serviceWorker' in navigator){
    try{
     const reg=await navigator.serviceWorker.getRegistration('/');
     record('App setup',reg?'A service worker is registered in this browser':'No service worker registration found yet; visit this page over HTTPS');
    }catch{record('App setup','Registration status unavailable');}
   }else record('App setup','This browser cannot register a service worker');
   for(const item of results){const li=document.createElement('li');li.textContent=item;deviceCheckResults.append(li);}
   deviceCheckStatus.textContent='Device and public-file check finished. Results describe this browser only; they do not guarantee that an installation prompt will appear.';
   deviceCheck.disabled=false;
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
 navigator.serviceWorker.addEventListener('controllerchange',()=>{
  if(requestedReload){
   requestedReload=false;
   // This page alone is reloaded, and only after the user explicitly
   // chose "Apply update". Never reload a live classroom in the background.
   window.location.reload();
  }
 });
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
