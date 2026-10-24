/* v1.85 HF4: real topic-interest requests plus existing 16-session enrollment.
   No payments, outbound email, or automatic reservation; all requests await human review.
   EL-RGR-023 + EL-DUR-011: builder must never send emails. */
(()=>{'use strict';
const mount=document.querySelector('#v1850-enrollment-app');if(!mount)return;
const f=document.createElement('form');f.id='v1850-enroll-form';
const el=(t,s)=>{const n=document.createElement(t);if(s)n.textContent=s;return n;};
const field=(name,label,type='text')=>{const l=el('label',label);l.className='v1850-field';const x=el('input');x.name=name;x.type=type;x.required=true;x.maxLength=name==='email'?254:120;l.append(x);f.append(l);return x;};
const name=field('full_name','Your full name');name.autocomplete='name';
const email=field('email','Email address','email');email.autocomplete='email';
const select=(name,label,values)=>{const l=el('label',label);l.className='v1850-field';const s=el('select');s.name=name;for(const [v,t]of values){const o=el('option',t);o.value=v;s.append(o)}l.append(s);f.append(l);return s;};
const program=select('program','Study program',[['legal','Legal English'],['business','Business English'],['investor','Wall Street & Investor English (Business English)']]);
const interest=select('interest','Type of learning request',[['extended','16-session teacher-led program'],['one','One class on a selected topic (subject to availability)'],['four','Four classes on a selected topic (subject to availability)']]);
const topic=select('topic','Preferred teaching topic (choose for one/four lessons)',[['','Select a topic for a single or four-class request']]);
const format=select('format','Classroom format',[['group','Small-group, 16 lessons · $269'],['private','Private, 16 lessons · $699']]);
const schedule=select('schedule_id','Schedule',[]);
const base=window.ELCURRICULUM_V1800?.records||[],business=window.ELBUSINESS_V1850_CATALOG||[];
const legal=base.filter(x=>x.group!=='Professional & Business English');
const makeTopics=()=>{
 const all=program.value==='legal'?legal:business.filter(x=>program.value==='investor'?x.id.startsWith('ws-'):!x.id.startsWith('ws-'));
 const empty=el('option','Choose a topic');empty.value='';
 topic.replaceChildren(empty);
 for(const c of all){const option=el('option',c.title);option.value=c.id;topic.append(option)}
 topic.required=interest.value!=='extended';
};
const price={extended:{group:'$269',private:'$699'},one:{group:'$26',private:'$49'},four:{group:'$85',private:'$179'}};
const update=()=>{
 const n=interest.value==='extended'?'16 lessons':interest.value==='one'?'1 lesson':'4 lessons';
 const group=format.querySelector('option[value="group"]'),privateOption=format.querySelector('option[value="private"]');
 group.textContent='Small-group, '+n+' · '+price[interest.value].group;
 privateOption.textContent='Private, '+n+' · '+price[interest.value].private;
 const val=interest.value!=='extended'?(format.value==='private'?'private-time-request':'topic-time-request'):(format.value==='private'?'private-time-request':program.value==='legal'?'legal-group-mon':'business-group-wed');
 const label=val==='topic-time-request'?'Request a group session time for the selected topic':val==='private-time-request'?'Request private session times (subject to confirmation)':val==='legal-group-mon'?'Mondays 7:00 p.m. · Asia/Ho_Chi_Minh · from November 2, 2026':'Wednesdays 7:00 p.m. · Asia/Ho_Chi_Minh · from November 4, 2026';
 const o=el('option',label);o.value=val;schedule.replaceChildren(o);
 topic.required=interest.value!=='extended';
 topic.parentElement.hidden=interest.value==='extended';
};
program.addEventListener('change',()=>{makeTopics();update()});
interest.addEventListener('change',()=>{makeTopics();update()});
format.addEventListener('change',update);makeTopics();update();
const l=el('label','Preferred times or goals (optional)');l.className='v1850-field';
const note=el('textarea');note.name='note';note.rows=3;note.maxLength=380;l.append(note);f.append(l);
const hp=field('website','Website (leave blank)');hp.parentElement.classList.add('v1850-hp');hp.tabIndex=-1;hp.required=false;
const disclaimer=el('p','This submits an instructor-availability inquiry only, not a confirmed booking. We have not assigned a teacher to the selected topic. No payment is taken or automatic email is sent.');disclaimer.className='v1850-boundary';f.append(disclaimer);
const submit=el('button','Submit enrollment inquiry');submit.type='submit';submit.className='v1840-button';const status=el('p');status.className='v1850-feedback';status.setAttribute('role','status');f.append(submit,status);mount.append(f);
f.addEventListener('submit',async e=>{
 e.preventDefault();if(!f.reportValidity())return;
 submit.disabled=true;status.textContent='Saving enrollment inquiry…';
 const data=Object.fromEntries(new FormData(f));
 if(interest.value!=='extended'){
  const title=topic.selectedOptions[0]?.textContent||'';
  data.note='[Topic-specific inquiry: '+topic.value+' | '+title+'; sessions='+ (interest.value==='one'?'1':'4')+'; format='+format.value+'] '+(note.value||'');
  data.note=data.note.slice(0,500);
 }else if(topic.value){data.note='[16-session interest: '+topic.value+'] '+(note.value||'');data.note=data.note.slice(0,500)}
 delete data.topic;delete data.interest;
 data.client_request_id=crypto.randomUUID();
 try{
  const resp=await fetch('/api/v1850/enroll',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  const result=await resp.json();if(!resp.ok||!result.ok)throw Error(result.error||'Could not submit');
  const success=el('p','Inquiry received. Reference: '+result.reference+'. A class place, teacher and meeting access are not confirmed. No payment was taken, and no automatic email was sent.');
  success.className='v1850-success';f.replaceWith(success);
 }catch(err){status.textContent=err.message;submit.disabled=false}
});
})();