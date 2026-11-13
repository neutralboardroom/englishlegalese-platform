/* HF65: installation is explicitly user-initiated; never call prompt at load. */
(()=>{'use strict';
 const button=document.getElementById('el-install-button');
 const status=document.getElementById('el-install-status');
 if(!button||!status)return;
 let deferredPrompt=null;
 const installed=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 function show(message){status.textContent=message;}
 if(installed()){show('EnglishLegalese is already open as an installed app.');button.hidden=true;return;}
 window.addEventListener('beforeinstallprompt',event=>{
  event.preventDefault();
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
  show('Installation support depends on your browser and HTTPS. Use the browser menu or continue on the website.');
  return;
 }
 // Register only on this user-opened installation page. No private data caching.
 window.addEventListener('load',()=>{
  navigator.serviceWorker.register('/sw.js',{scope:'/'})
   .then(()=>{if(!deferredPrompt&&!installed())show('App setup is available. Use the browser menu to Install app/Add to Home Screen if a button does not appear.');})
   .catch(()=>show('This browser did not enable app setup. You can still use the regular website and try its Add to Home Screen menu.'));
 },{once:true});
})();
