/* HF24 private owner and employer role dashboards. No client persistence except session token. */
(()=>{'use strict';
const root=document.querySelector('[data-el18510-workspace]');if(!root)return;
const role=root.dataset.el18510Workspace;
if(!['owner','employer'].includes(role))return;
const key=role==='owner'?'el18510.owner.session':'el18510.employer.session';
const E=(tag,text)=>{const x=document.createElement(tag);if(text!==undefined)x.textContent=text;return x};
const form=document.getElementById('el18510-login'),status=document.getElementById('el18510-status');
const output=document.getElementById('el18510-output'),actions=document.getElementById('el18510-actions');
const logout=document.getElementById('el18510-logout'),refresh=document.getElementById('el18510-refresh');
let token=null,epoch=0,selection=null;
try{token=sessionStorage.getItem(key)}catch{}
const auth=t=>({Authorization:'Bearer '+t});
const parse=async response=>{try{return await response.json()}catch{return{ok:false,error:'Unreadable server response.'}}};
function notice(text){status.textContent=text}
function clear(){
 ++epoch;token=null;selection=null;
 try{sessionStorage.removeItem(key)}catch{}
 output.replaceChildren();actions.hidden=true;logout.hidden=true;form.hidden=false;
}
function cell(text){return E('td',text==null?'Not reported':String(text))}
function percent(n){return typeof n==='number'?n+'%':'Not reported'}
async function loadOwnerTriage(ownerToken,requestEpoch,section){
 const state=document.createElement('p');state.setAttribute('role','status');state.textContent='Checking verified operational queues…';
 section.append(state);
 try{
  const response=await fetch('/api/v18511/owner/triage',{headers:auth(ownerToken),cache:'no-store'});
  const data=await parse(response);
  if(token!==ownerToken||epoch!==requestEpoch||!section.isConnected)return;
  if(!response.ok||data.ok!==true)throw Error(data.error||'Operational queues unavailable');
  section.replaceChildren(E('h3','Operational action queues (read-only)'),E('p','Verified '+new Date(data.verified_at).toLocaleString()+'. '+data.notice));
  const groups=[['Teacher application approval states',data.teacher_applications],['Class scheduling readiness',data.class_readiness],['Class request and session states',data.class_statuses],['Progress report publication states',data.progress_report_states]];
  for(const [name,states] of groups){
   const field=E('section');field.append(E('h4',name));
   const entries=Object.entries(states||{});const ul=E('ul');
   if(!entries.length)ul.append(E('li','No records in this verified category.'));
   for(const [state,count]of entries)ul.append(E('li',state+': '+count));
   field.append(ul);section.append(field);
  }
  const employer=E('section');employer.append(E('h4','Employer enrollment requests'));
  if(data.employer_enrollment?.schema_installed===false){
   employer.append(E('p','Request database migration not installed — cannot report counts or accept stored employer requests yet.'));
  }else{
   const entries=Object.entries(data.employer_enrollment?.counts||{});const ul=E('ul');
   if(!entries.length)ul.append(E('li','No recorded employer requests.'));
   for(const [state,count]of entries)ul.append(E('li',state+': '+count));
   employer.append(ul);
  }
  section.append(employer,E('p','Certification issuance: not active · Employer card checkout: not active. No approval or payment actions are enabled in this read-only view.'));
 }catch(e){if(token===ownerToken&&epoch===requestEpoch&&section.isConnected)state.textContent='Operational queue unavailable: '+e.message+' No unverified totals are shown.'}
}
async function loadIntakeSummary(ownerToken,requestEpoch,section){
 const state=E('p','Checking private enrollment and teacher application queue availability…');
 state.setAttribute('role','status');section.append(state);
 try{
  const r=await fetch('/api/v18512/owner/intake-summary',{headers:auth(ownerToken),cache:'no-store'}),data=await parse(r);
  if(token!==ownerToken||epoch!==requestEpoch||!section.isConnected)return;
  if(!r.ok||data.ok!==true||!data.queues||typeof data.queues!=='object')throw Error(data.error||'Private intake queue unavailable');
  section.replaceChildren(E('h3','Private intake review — verified totals only'),E('p',data.notes||'No personal applicant information is shown.'));
  let due=0;
  for(const [kind,label] of [['enrollment','Class enrollment requests'],['teacher','Teacher applications']]){
   const area=E('section');area.append(E('h4',label));const list=E('ul'),rows=data.queues[kind];
   if(!Array.isArray(rows))throw Error('Incomplete verified intake records');
   if(!rows.length)list.append(E('li','No recorded entries in this category.'));
   for(const row of rows){
    if(!Number.isSafeInteger(row.total)||!Number.isSafeInteger(row.due)||row.total<0||row.due<0||row.due>row.total)throw Error('Invalid aggregate');
    due+=row.due;list.append(E('li',row.status+': '+row.total+' recorded; '+row.due+' due for follow-up'));
   }
   area.append(list);section.append(area);
  }
  section.append(E('p','Total due follow-ups across verified intake queues: '+due+'. No automatic emails, decisions or payment actions were made.'));
 }catch(e){
  if(token===ownerToken&&epoch===requestEpoch&&section.isConnected){
   section.replaceChildren(E('h3','Private intake review'),E('p','Private intake queue unavailable: '+e.message+'. No applicant details or unverified totals are displayed.'));
  }
 }
}
function renderOwner(data){
 const heading=E('h2','Operational snapshot');output.append(heading);
 output.append(E('p',data.notice||'Read-only production indicators.'));
 const sections=[['Active account roles',data.counts?.active_user_roles],['Class sessions by recorded status',data.counts?.class_sessions],['Teacher submission review states',data.counts?.teacher_submission_review_states],['Progress report publication states',data.counts?.progress_report_states]];
 output.append(E('p','Active organizations: '+String(data.counts?.active_organizations??'Unavailable')));
 for(const [label,values]of sections){
  const area=E('section');area.append(E('h3',label));
  const list=E('ul');const rows=Object.entries(values||{});
  if(!rows.length)list.append(E('li','No recorded entries in this category.'));
  for(const [name,count]of rows)list.append(E('li',name+': '+count));
  area.append(list);output.append(area);
 }
 const triage=E('section');triage.className='v18511-owner-triage';triage.setAttribute('aria-label','Verified operational action queues');output.append(triage);loadOwnerTriage(token,epoch,triage);
 const intake=E('section');intake.className='v18512-owner-intake';intake.setAttribute('aria-label','Private owner intake review');output.append(intake);loadIntakeSummary(token,epoch,intake);
 const next=E('p','Next actions: review pending teacher submissions and class readiness; reconcile separately collected enrollment inquiries. This is not an invoice, employee-report editor, payout tool or permission manager.');
 output.append(next);
 const links=E('p');
 for(const [label,url]of [['View teacher workspace','/learn/teacher-submissions/'],['Review employer tools','/learn/employers/'],['Review student tools','/learn/my-work/']]){
  const a=E('a',label);a.href=url;a.style.marginRight='1rem';links.append(a);
 }output.append(links);
}

async function mountEmployerBooking(org){
 // Employees may be selected only from the currently verified company roster.
 // This submits a staff-review request, never creates users or charges cards.
 const currentToken=token,sequence=epoch;
 const section=E('section');section.className='v1940-employer-booking';
 section.append(E('h3','Enroll employees in a training package'));
 section.append(E('p','Select existing, verified company learners and request Legal English, Business English or an appropriate professional training package. Teacher, class time and seats require confirmation. No payment is taken by this form.'));
 const message=E('p','Checking your authorized employee roster…');message.setAttribute('role','status');message.setAttribute('aria-live','polite');
 section.append(message);output.append(section);
 try{
  const r=await fetch('/api/v18510/employer/roster?organization_id='+encodeURIComponent(org.id),{headers:auth(currentToken),cache:'no-store'});
  const j=await parse(r);
  if(token!==currentToken||epoch!==sequence||!section.isConnected)return;
  if(!r.ok||j.ok!==true||!Array.isArray(j.employees))throw Error(j.error||'No verified employee roster is available.');
  const roster=j.employees;
  section.append(E('p','Verified company learners returned: '+roster.length+(j.truncated?' (showing first 100; ask staff about additional employees)':'')+'. Company staff must arrange new learner accounts and consent before adding anyone who is not already linked.'));
  if(!roster.length){message.textContent='No active company learners available for enrollment. Request verified student account setup before selecting seats.';return}
  const form=E('form');form.className='v1940-enrollment-form';
  const heading=E('h4','Choose employees');form.append(heading);
  const choices=E('div');choices.className='v1940-employee-options';
  const selected=new Map();
  for(const person of roster){
   const label=E('label'),check=E('input');check.type='checkbox';check.value=person.id;check.name='employee';
   selected.set(person.id,check);label.append(check,E('span',person.name));choices.append(label);
  }
  form.append(choices);
  const makeSelect=(name,options)=>{
   const label=E('label',name),select=E('select');
   for(const [value,title]of options){const opt=E('option',title);opt.value=value;select.append(opt)}
   label.append(select);form.append(label);return select;
  };
  const program=makeSelect('Choose training track',[['legal','Legal English'],['business','Business English'],['investor','Investor & Business English'],['complete','Combined 48-topic Professional English']]);
  const sessions=makeSelect('Choose lessons per employee',[['8','8 lessons'],['16','16 lessons'],['24','24-topic subject pathway'],['48','Combined 48-topic complete pathway']]);
  const whenLabel=E('label','Preferred timetable or time zone (optional, no employee personal information)');
  const when=E('input');when.type='text';when.maxLength=150;when.placeholder='e.g., weekday evenings, Singapore time';whenLabel.append(when);form.append(whenLabel);
  const estimate=E('p');estimate.className='v1940-enrollment-estimate';form.append(estimate);
  const button=E('button','Submit employee class enrollment request');button.type='submit';
  form.append(button);
  const feedback=E('p');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');form.append(feedback);
  function revise(){
   if(program.value==='complete'){sessions.value='48';sessions.disabled=true}
   else{sessions.disabled=false;if(sessions.value==='48')sessions.value='24';if(program.value==='investor'&&sessions.value==='24')sessions.value='16'}
   const n=[...selected.values()].filter(c=>c.checked).length,price={8:149,16:249,24:349,48:649}[Number(sessions.value)];
   const discount=n>=11?15:n>=6?10:n>=3?5:0;
   const total=n*price*(100-discount)/100;
   estimate.textContent=n+' selected learners · '+sessions.value+' lessons each · '+(discount?discount+'% volume discount · ':'no volume discount · ')+'indicative total $'+total.toFixed(2)+' USD. This is not an invoice, booking confirmation or charge.';

   button.disabled=n===0;
  }
  choices.addEventListener('change',revise);program.addEventListener('change',revise);sessions.addEventListener('change',revise);revise();
  let pendingId=null;
  form.addEventListener('submit',async ev=>{
   ev.preventDefault();
   if(token!==currentToken||epoch!==sequence){feedback.textContent='Your employer session has changed. Reload before requesting enrollment.';return}
   const ids=[...selected].filter(([,c])=>c.checked).map(([id])=>id);
   if(!ids.length){feedback.textContent='Select at least one current company learner.';return}
   if(!pendingId)pendingId=crypto.randomUUID();
   button.disabled=true;feedback.textContent='Saving the enrollment request for staff review…';
   try{
    const rr=await fetch('/api/v18510/employer/enrollment-requests',{method:'POST',headers:{...auth(currentToken),'Content-Type':'application/json'},body:JSON.stringify({
     organization_id:org.id,program:program.value,package_sessions:Number(sessions.value),employee_user_ids:ids,
     preferred_time_window:when.value.trim(),client_request_id:pendingId
    }),cache:'no-store'});
    const result=await parse(rr);
    if(token!==currentToken||epoch!==sequence)return;
    if(!rr.ok||result.ok!==true)throw Error(result.error||'Enrollment could not be recorded.');
    feedback.textContent='Request recorded: '+result.reference+'. '+result.notice+' You can review it with staff. This is not a paid enrollment.';
    pendingId=null;
    loadEnrollmentRequests(org,section,currentToken,sequence);
   }catch(e){if(token===currentToken&&epoch===sequence)feedback.textContent='Request NOT confirmed: '+e.message+' Do not assume seats were booked or paid.'}
   finally{if(token===currentToken&&epoch===sequence)revise()}
  });
  message.textContent='Select eligible employees and request course seats. No payment or unapproved account access is possible here.';
  section.append(form);
  const checkout=E('p','Secure card checkout is not yet activated. Payment may be arranged only after verified class availability, an approved invoice/quote, and tested payment processing. No charges are made by these requests.');
  checkout.className='v1940-enrollment-payment';section.append(checkout);
  loadEnrollmentRequests(org,section,currentToken,sequence);
 }catch(e){if(token===currentToken&&epoch===sequence&&section.isConnected)message.textContent='Employer roster unavailable: '+e.message+' No private employee records were shown.'}
}
async function loadEnrollmentRequests(org,section,currentToken,sequence){
 if(token!==currentToken||epoch!==sequence||!section.isConnected)return;
 let history=section.querySelector('.v1940-employer-history');
 if(!history){history=E('div');history.className='v1940-employer-history';section.append(history)}
 history.replaceChildren(E('p','Checking existing team enrollment requests…'));
 try{
  const r=await fetch('/api/v18510/employer/enrollment-requests?organization_id='+encodeURIComponent(org.id),{headers:auth(currentToken),cache:'no-store'});
  const j=await parse(r);
  if(token!==currentToken||epoch!==sequence||!history.isConnected)return;
  if(!r.ok||j.ok!==true||!Array.isArray(j.requests))throw Error(j.error||'Request history not available.');
  history.replaceChildren(E('h4','Recent submitted enrollment requests'));
  if(!j.requests.length){history.append(E('p','No confirmed request records yet.'));return}
  const ul=E('ul');
  for(const q of j.requests){
   const cost=typeof q.estimated_total_cents==='number'?(q.estimated_total_cents/100).toFixed(2):'unavailable';
   const li=E('li',q.program+' · '+q.package_sessions+' lessons · '+q.employee_count+' learners · estimated $'+cost+' USD · staff review: '+q.staff_status+' · payment: '+q.payment_status);
   ul.append(li);
  }history.append(ul);
 }catch(e){if(token===currentToken&&epoch===sequence&&history.isConnected)history.replaceChildren(E('p','Enrollment request history unavailable: '+e.message))}
}

function renderEmployer(data){
 output.append(E('h2','Employee progress and results'),E('p',data.notice||'Only published privacy-safe progress reports are displayed.'));
 const orgs=data.organizations||[];
 if(!orgs.length){output.append(E('p','No verified employer organization is assigned to this account. Contact the platform owner for manual verification.'));return}
 const label=E('label','Choose a verified company');
 const choose=E('select');choose.setAttribute('aria-label','Choose your verified organization');
 for(const org of orgs){const o=E('option',org.name);o.value=org.id;choose.append(o)}
 choose.value=data.organization?.id||orgs[0].id;
 choose.addEventListener('change',()=>{selection=choose.value;load()});
 label.append(choose);output.append(label);
 mountEmployerBooking(data.organization||orgs[0]);
 const people=data.employees||[];
 const published=people.filter(x=>x.has_published_report).length;
 output.append(E('p',people.length+' consented employees shown · '+published+' with published progress reports. Missing metrics are not zero and do not imply a failed assessment.'));
 if(data.truncated)output.append(E('p','Results are limited to the first 100 consented members; this is not a complete roster.'));
 if(!people.length)return;
 const filters=E('div');filters.className='v18512-employer-filters';
 const searchLabel=E('label','Find a consented employee'),search=E('input');search.type='search';search.maxLength=80;search.placeholder='Search the verified company';search.setAttribute('aria-label','Find a consented employee');searchLabel.append(search);
 const statusLabel=E('label','Report availability'),statusFilter=E('select');statusFilter.setAttribute('aria-label','Filter by published report');
 for(const [value,text]of [['all','All consented employees'],['published','Published progress only'],['missing','Without published progress']]){
  const o=E('option',text);o.value=value;statusFilter.append(o);
 }statusLabel.append(statusFilter);
 const orderLabel=E('label','Sort employee names'),sort=E('select');sort.setAttribute('aria-label','Sort consented employee names');
 for(const [value,text]of [['original','Original order'],['ascending','Name A to Z'],['descending','Name Z to A']]){
  const o=E('option',text);o.value=value;sort.append(o);
 }orderLabel.append(sort);
 const filteredCount=E('p');filteredCount.className='v18512-employer-count';filteredCount.setAttribute('role','status');
 filters.append(searchLabel,statusLabel,orderLabel,filteredCount);output.append(filters);
 let visiblePeople=people;
 const wrap=E('div');wrap.style.overflowX='auto';
 const table=E('table');table.className='v1940-employer-report';
 const header=E('tr');
 for(const item of ['Employee','Reported','Completion','Attendance','Result','Milestones','Level'])header.append(E('th',item));
 const thead=E('thead');thead.append(header);table.append(thead);
 const tbody=E('tbody'),rows=[];
 for(const p of people){
  const tr=E('tr');const date=Date.parse(p.reported_at);
  for(const v of [p.name,p.has_published_report?(Number.isFinite(date)?new Date(date).toLocaleDateString():'Published; date unavailable'):'Not published',
   percent(p.completion_percent),percent(p.attendance_percent),percent(p.score_percent),
   p.milestones_completed??'Not reported',p.level||'Not reported'])tr.append(cell(v));
  tbody.append(tr);rows.push({person:p,tr});
 }table.append(tbody);wrap.append(table);output.append(wrap);
 function applyEmployerFilters(){
  const searchText=search.value.trim().toLocaleLowerCase(),kind=statusFilter.value;
  const matched=rows.filter(({person})=>String(person.name||'').toLocaleLowerCase().includes(searchText)&&
   (kind==='all'||(kind==='published'&&person.has_published_report)||(kind==='missing'&&!person.has_published_report)));
  if(sort.value!=='original')matched.sort((a,b)=>(sort.value==='ascending'?1:-1)*String(a.person.name||'').localeCompare(String(b.person.name||'')));
  const selected=new Set(matched);
  for(const row of rows)row.tr.hidden=!selected.has(row);
  for(const row of matched)tbody.append(row.tr);
  visiblePeople=matched.map(row=>row.person);
  filteredCount.textContent='Showing '+matched.length+' of '+people.length+' consented company employees. No results are inferred.';
 }
 search.addEventListener('input',applyEmployerFilters);
 statusFilter.addEventListener('change',applyEmployerFilters);
 sort.addEventListener('change',applyEmployerFilters);
 applyEmployerFilters();
 const exportBtn=E('button','Download selected consented progress results (CSV)');
 exportBtn.type='button';exportBtn.className='v1940-export';
 exportBtn.addEventListener('click',()=>{
  if(!token||!confirm('Download a PRIVATE report of the currently filtered consented employee progress? Keep it confidential. This file includes employee names and approved results; no private answers or teacher comments.'))return;
  const q=v=>'"'+String(v==null?'':v).replaceAll('"','""').replace(/^[=+@-]/,'\u0027')+'"';
  const lines=[['Employee','Published','Reported at','Completion percent','Attendance percent','Score percent','Milestones completed','Level'].map(q).join(',')];
  for(const p of visiblePeople)lines.push([p.name,p.has_published_report,p.reported_at||'',p.completion_percent??'',p.attendance_percent??'',p.score_percent??'',p.milestones_completed??'',p.level||''].map(q).join(','));
  const url=URL.createObjectURL(new Blob([lines.join('\r\n')+'\r\n'],{type:'text/csv;charset=utf-8'}));
  const a=E('a');a.href=url;a.download='englishlegalese-private-employer-progress-'+new Date().toISOString().slice(0,10)+'.csv';
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
 });output.append(exportBtn);
}
async function load(){
 if(!token){clear();return}
 const t=token,seq=++epoch;
 output.replaceChildren(E('p','Checking verified, private dashboard data…'));
 refresh.disabled=true;
 try{
  const endpoint=role==='owner'?'/api/v18510/owner/overview':'/api/v18510/employer/progress'+(selection?'?organization_id='+encodeURIComponent(selection):'');
  const r=await fetch(endpoint,{headers:auth(t),cache:'no-store'}),j=await parse(r);
  if(token!==t||seq!==epoch)return;
  if(!r.ok||j.ok!==true)throw Error(j.error||'Dashboard data unavailable.');
  output.replaceChildren();if(role==='owner')renderOwner(j);else renderEmployer(j);
  notice('Private '+(role==='owner'?'owner/admin operations':'employer progress')+' data loaded. Refresh for current records.');
 }catch(e){
  if(token!==t||seq!==epoch)return;
  output.replaceChildren(E('p','Dashboard data could not be verified: '+e.message+' No information has been invented.'));
  notice('Dashboard unavailable. Account or reporting setup may require attention.');
 }finally{if(token===t&&seq===epoch)refresh.disabled=false}
}
form.addEventListener('submit',async ev=>{
 ev.preventDefault();const values=new FormData(form);const pass=form.querySelector('input[type=password]'),seq=++epoch;
 notice('Checking account credentials…');
 try{
  const r=await fetch('/api/v119/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:values.get('email'),password:values.get('password'),expected_role:role==='owner'?(values.get('account_role')==='admin'?'admin':'owner'):'employer'})});
  const j=await parse(r);
  if(seq!==epoch)return;
  if(!r.ok||!j.token||!(role==='owner'?['owner','admin'].includes(j.user?.role):j.user?.role==='employer'))throw Error('An authorized '+role+' account is required.');
  token=j.token;try{sessionStorage.setItem(key,token)}catch{}
  form.hidden=true;logout.hidden=false;actions.hidden=false;notice('Signed in.');await load();
 }catch(e){if(seq===epoch)notice('Login unavailable: '+e.message)}
 finally{pass.value=''}
});
logout.addEventListener('click',async()=>{
 const t=token;clear();
 if(!t){notice('Signed out locally.');return}
 try{const r=await fetch('/api/v18510/workspace/logout',{method:'POST',headers:auth(t),cache:'no-store'}),j=await parse(r);
  notice(r.ok&&j.session_revoked?'Signed out and server session revoked.':'Signed out locally. Server session revocation was not confirmed; avoid shared devices.');
 }catch{notice('Signed out locally. Server session revocation was not confirmed; avoid shared devices.')}
});
refresh.addEventListener('click',load);
if(token){
 fetch('/api/v119/auth/me',{headers:auth(token),cache:'no-store'}).then(async r=>{
  const j=await parse(r);if(!token)return;
  if(!r.ok||!(role==='owner'?['owner','admin'].includes(j.user?.role):j.user?.role==='employer')){clear();notice('Session expired or account role changed. Sign in again.');return}
  form.hidden=true;logout.hidden=false;actions.hidden=false;load();
 }).catch(()=>{clear();notice('Session could not be verified. Sign in again.')});
}else clear();
})();
