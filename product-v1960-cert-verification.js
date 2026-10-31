'use strict';
(() => {
 const form=document.getElementById('el-certificate-verify-form');
 const status=document.getElementById('el-certificate-result');
 if(!form||!status)return;
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  status.textContent='Checking credential status…';
  const serial=String(form.elements.serial.value||'').trim().toUpperCase();
  const verification_code=String(form.elements.code.value||'').trim().toLowerCase();
  if(!/^EL-(LEGAL|BUSINESS)-[0-9A-F]{24}$/.test(serial)||!/^[a-f0-9]{48}$/.test(verification_code)){
   status.textContent='Please use the complete serial number and verification code printed on the certificate.';
   return;
  }
  try{
   const r=await fetch('/api/v1960/certifications/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({serial,verification_code}),credentials:'omit',cache:'no-store'});
   if(!r.ok){status.textContent='Verification is not available at the moment. Please try again later.';return;}
   const data=await r.json();
   if(!data.verified){status.textContent=data.revoked?'This certificate has been revoked.':'No valid publicly verifiable certificate was found for these details.';return;}
   const date=new Date(data.issued_at);
   const stamp=Number.isNaN(date.getTime())?'Date unavailable':date.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'});
   const subject=data.credential_track==='legal'?'Legal English':'Business English';
   const level=['A1','A2','B1','B2','C1','C2'].includes(data.awarded_specialist_level)?data.awarded_specialist_level:'Level unavailable';
   status.textContent='Verified: EnglishLegalese '+subject+' specialist level '+level+' · Issued '+stamp+' · Currently valid. This is an EnglishLegalese-issued credential.';
  }catch{status.textContent='Verification is not available at the moment. Please try again later.';}
  finally{form.elements.code.value='';}
 });
})();