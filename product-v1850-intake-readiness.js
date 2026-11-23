/* EnglishLegalese HF91: read-only same-origin intake availability preflight.
 * No PII, no automatic network request, no payment, no email, no data persistence. */
(()=>{'use strict';
 const supported=Object.freeze({enroll:'enroll',teacher:'teacher'});
 function install(form,kind){
  if(!form||!Object.prototype.hasOwnProperty.call(supported,kind))throw Error('Unsupported public intake form');
  const title=kind==='enroll'?'enrollment inquiries':'teacher applications';
  const wrap=document.createElement('section');wrap.className='v1850-boundary';wrap.setAttribute('aria-label', 'Service readiness for '+title);
  const label=document.createElement('strong');label.textContent='Before you send your request';
  const description=document.createElement('p');description.textContent='Check whether our secure request service can receive '+title+'. The check sends no form details. An inquiry is not a booking or a payment.';
  const checkButton=document.createElement('button');checkButton.type='button';checkButton.className='v1840-button';checkButton.textContent='Check request availability';
  const report=document.createElement('p');report.className='v1850-feedback';report.setAttribute('role','status');report.setAttribute('aria-live','polite');report.textContent='Availability has not been checked. Your information stays on this page until you submit.';
  wrap.append(label,description,checkButton,report);form.prepend(wrap);
  let lastReady=false,inFlight=null;
  async function check(){
   if(inFlight)return inFlight;
   checkButton.disabled=true;report.textContent='Checking request availability (no personal details sent)…';
   const ctrl=typeof AbortController==='function'?new AbortController():null;
   const timer=ctrl?setTimeout(()=>ctrl.abort(),6000):null;
   inFlight=(async()=>{
    try{
     const response=await fetch('/api/v1850/intake-status?channel='+supported[kind],{
      method:'GET',credentials:'omit',cache:'no-store',redirect:'error',headers:{'Accept':'application/json'},...(ctrl?{signal:ctrl.signal}:{})
     });
     const data=await response.json();
     lastReady=response.ok===true&&data&&data.ok===true&&data.ready===true&&data.stripe_enabled===false;
     report.textContent=lastReady
      ?'The request service is available. You may submit your completed form. No payment or class booking occurs.'
      :'The request service is not accepting '+title+' right now. No form details were sent or saved. Your entries remain here until you leave or refresh this page.';
    }catch{
     lastReady=false;
     report.textContent='Unable to confirm request availability. No form details were sent or saved. Your entries remain here; try again later.';
    }finally{
     if(timer)clearTimeout(timer);checkButton.disabled=false;inFlight=null;
    }
    return lastReady;
   })();
   return inFlight;
  }
  checkButton.addEventListener('click',()=>{void check()});
  return Object.freeze({check,getReady:()=>lastReady,report});
 }
 Object.defineProperty(window,'ELPublicIntakeReadiness',{value:Object.freeze({install}),configurable:false,writable:false});
})();
