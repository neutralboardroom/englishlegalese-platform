/* HF34: client-only estimate display plus consented membership inquiry. No subscriptions, payments or automatic emails. */
(()=>{'use strict';
 const form=document.getElementById('v1970-form'),seats=document.getElementById('v1970-seats');
 if(!form||!seats)return;
 const kind=document.getElementById('v1970-kind'),plan=document.getElementById('v1970-plan');
 const orgField=document.getElementById('v1970-org-field'),seatField=document.getElementById('v1970-seat-field');
 const org=orgField.querySelector('input'),formSeats=seatField.querySelector('input');
 const result=document.getElementById('v1970-quote-result'),status=document.getElementById('v1970-form-status');
 const submit=document.getElementById('v1970-submit');
 const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
 const opts={
  individual:[['starter','Starter — $12/month'],['plus','Plus — $19/month'],
   ['pro','Pro — $29/month'],['guided','Guided — $79/month (subject to teacher availability)']],
  organization:[['team','Digital team membership (1–49 employees)'],['enterprise','Custom organization plan (50+ employees)']]
 };
 let available=false,lastQuote=0,pendingId=null,pendingSignature=null;
 function setKind(next,desired){
  kind.value=next;
  orgField.hidden=seatField.hidden=next!=='organization';
  org.disabled=formSeats.disabled=next!=='organization';org.required=next==='organization';
  formSeats.required=next==='organization';
  plan.replaceChildren();
  for(const [value,label]of opts[next]){const el=document.createElement('option');el.value=value;el.textContent=label;plan.append(el)}
  if(desired&&opts[next].some(p=>p[0]===desired))plan.value=desired;
  if(next==='organization'){plan.value=Number(formSeats.value)>=50?'enterprise':'team'}
 }
 async function updateQuote(){
  const count=Number(seats.value);const sequence=++lastQuote;
  if(!/^\d{1,5}$/.test(seats.value)||!Number.isSafeInteger(count)||count<1||count>10000){
   result.textContent='Choose a whole number of employees from 1 to 10,000.';return;
  }
  try{
   const r=await fetch('/api/v1970/memberships/quote?seats='+encodeURIComponent(String(count)),{cache:'no-store'});
   const data=await r.json();if(sequence!==lastQuote)return;
   if(!r.ok||!data.ok)throw Error(data.error||'Estimate is unavailable.');
   if(data.custom){result.textContent=count.toLocaleString()+' employees · Request an individually priced enterprise proposal.';}
   else{
    result.textContent=count.toLocaleString()+' '+(count===1?'employee':'employees')+' · Proposed digital membership: '+
      money(data.monthly_usd)+'/month, or '+money(data.annual_equivalent_usd)+' across 12 months (not a contract).';
   }
  }catch(e){if(sequence===lastQuote)result.textContent='Estimate temporarily unavailable: '+e.message}
 }
 seats.addEventListener('input',()=>{if(kind.value==='organization'){formSeats.value=seats.value;plan.value=Number(seats.value)>=50?'enterprise':'team'}updateQuote()});
 formSeats.addEventListener('input',()=>{seats.value=formSeats.value;plan.value=Number(formSeats.value)>=50?'enterprise':'team';updateQuote()});
 kind.addEventListener('change',()=>setKind(kind.value));
 form.addEventListener('change',()=>{if(kind.value==='organization')plan.value=Number(formSeats.value)>=50?'enterprise':'team'});
 for(const link of document.querySelectorAll('[data-plan]'))link.addEventListener('click',()=>{
  setKind('individual',link.dataset.plan);
 });
 document.getElementById('v1970-team-interest')?.addEventListener('click',()=>{
  formSeats.value=seats.value;setKind('organization');
 });
 async function readiness(){
  submit.disabled=true;status.textContent='Checking membership inquiry availability…';
  try{
   const r=await fetch('/api/v1970/memberships/readiness',{cache:'no-store'}),x=await r.json();
   available=Boolean(r.ok&&x.interest_form_available===true);
   submit.disabled=!available;
   status.textContent=available?'Information requests can be recorded for staff review. No payment will be taken.':
     'Membership information requests are not accepting submissions yet. Proposed pricing remains available for comparison.';
  }catch{available=false;submit.disabled=true;status.textContent='Inquiry service could not be verified. No request is being accepted or charged.'}
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!available){status.textContent='Information requests are currently unavailable. No inquiry has been recorded.';return}
  if(!form.reportValidity())return;
  const data=new FormData(form),individual=kind.value==='individual',count=Number(formSeats.value);
  const payload={
   request_kind:kind.value,plan_code:plan.value,preferred_term:data.get('preferred_term'),
   contact_name:String(data.get('contact_name')||'').trim(),
   contact_email:String(data.get('contact_email')||'').trim(),
   contact_consent:form.elements.contact_consent.checked,website:String(data.get('website')||'')
  };
  if(!individual){payload.organization_name=org.value.trim();payload.seat_count=count;
   if(!Number.isSafeInteger(count)||count<1||count>10000){status.textContent='Enter 1–10,000 whole employee seats.';return}
   payload.plan_code=count>=50?'enterprise':'team';
  }
  const signature=JSON.stringify(payload);
  if(!pendingId||signature!==pendingSignature){pendingId=crypto.randomUUID();pendingSignature=signature}
  payload.client_request_id=pendingId;submit.disabled=true;status.textContent='Recording your requested membership information…';
  try{
   const r=await fetch('/api/v1970/memberships/interest',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),cache:'no-store'});
   const x=await r.json();
   if(!r.ok||x.received!==true)throw Error(x.error||'Your request was not confirmed.');
   status.textContent='Membership information request recorded. Reference: '+x.reference+'. No payment or subscription was created. Staff will review the inquiry.';
   pendingId=null;pendingSignature=null;submit.disabled=true;form.querySelectorAll('input,select').forEach(el=>el.disabled=true);
  }catch(e){status.textContent='Request NOT confirmed: '+e.message+' No charge or subscription was created.';submit.disabled=!available}
 });
 setKind('individual');updateQuote();readiness();
})();
