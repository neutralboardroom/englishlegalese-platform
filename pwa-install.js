/* EnglishLegalese HF66: opt-in app installation and opt-in PWA updates.
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
 function showPendingUpdate(){
  if(updateApply)updateApply.hidden=false;
  showUpdate('An updated EnglishLegalese app is ready. Apply it only when you have finished any class or unsaved work.');
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
   async function publicFile(url,expected){
    try{
     const response=await fetch(url,{method:'GET',cache:'no-store',credentials:'omit',redirect:'error'});
     const type=response.headers.get('content-type')||'';
     if(!response.ok||!type.includes(expected))return {ok:false,reason:'Could not validate this public app file'};
     return {ok:true,response};
    }catch{return {ok:false,reason:'Public file unavailable or network check blocked'};}
   }
   const manifestResult=await publicFile('/manifest.webmanifest','application/manifest+json');
   if(!manifestResult.ok)record('App manifest',manifestResult.reason);
   else{
    try{
     const data=await manifestResult.response.json();
     const valid=data.scope==='/'&&data.start_url==='/'&&data.display==='standalone'&&
      Array.isArray(data.icons)&&['192x192','512x512'].every(size=>
       data.icons.some(icon=>icon.sizes===size&&icon.type==='image/png'));
     record('App manifest',valid?'Present and configured':'Present but missing required app settings');
    }catch{record('App manifest','Could not read the public manifest');}
   }
   for(const size of [192,512]){
    const icon=await publicFile('/assets/englishlegalese-app-icon-'+size+'.png','image/png');
    record('App icon '+size+'px',icon.ok?'Public PNG available':icon.reason);
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
   else if(worker.state==='redundant')showUpdate('The update did not finish installing. You may check again.');
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
   else showUpdate('No waiting update was found. Your next visit still checks live website content.');
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
  registration.waiting.postMessage({type:'ENGLISHLEGALESE_APPLY_UPDATE'});
 });
 // A service worker is registered only on the visitor-opened install page.
 // Its cache holds only a public generic offline notice, never account data.
 window.addEventListener('load',()=>{
  navigator.serviceWorker.register('/sw.js',{scope:'/'})
   .then(reg=>{
    registration=reg;
    if(updateCheck){updateCheck.disabled=false;updateCheck.hidden=false;}
    if(reg.waiting&&navigator.serviceWorker.controller)showPendingUpdate();
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
