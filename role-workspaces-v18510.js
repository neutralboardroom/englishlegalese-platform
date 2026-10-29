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
 const next=E('p','Next actions: review pending teacher submissions and class readiness; reconcile separately collected enrollment inquiries. This is not an invoice, employee-report editor, payout tool or permission manager.');
 output.append(next);
 const links=E('p');
 for(const [label,url]of [['View teacher workspace','/learn/teacher-submissions/'],['Review employer tools','/learn/employers/'],['Review student tools','/learn/my-work/']]){
  const a=E('a',label);a.href=url;a.style.marginRight='1rem';links.append(a);
 }output.append(links);
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
 const people=data.employees||[];
 const published=people.filter(x=>x.has_published_report).length;
 output.append(E('p',people.length+' consented employees shown · '+published+' with published progress reports. Missing metrics are not zero and do not imply a failed assessment.'));
 if(data.truncated)output.append(E('p','Results are limited to the first 100 consented members; this is not a complete roster.'));
 if(!people.length)return;
 const wrap=E('div');wrap.style.overflowX='auto';
 const table=E('table');table.className='v1940-employer-report';
 const header=E('tr');
 for(const item of ['Employee','Reported','Completion','Attendance','Result','Milestones','Level'])header.append(E('th',item));
 const thead=E('thead');thead.append(header);table.append(thead);
 const tbody=E('tbody');
 for(const p of people){
  const tr=E('tr');const date=Date.parse(p.reported_at);
  for(const v of [p.name,p.has_published_report?(Number.isFinite(date)?new Date(date).toLocaleDateString():'Published; date unavailable'):'Not published',
   percent(p.completion_percent),percent(p.attendance_percent),percent(p.score_percent),
   p.milestones_completed??'Not reported',p.level||'Not reported'])tr.append(cell(v));
  tbody.append(tr);
 }table.append(tbody);wrap.append(table);output.append(wrap);
 const exportBtn=E('button','Download these consented, published results (CSV)');
 exportBtn.type='button';exportBtn.className='v1940-export';
 exportBtn.addEventListener('click',()=>{
  if(!token||!confirm('Download a PRIVATE report of the currently displayed consented employee progress? Keep it confidential. This file includes employee names and approved results; no private answers or teacher comments.'))return;
  const q=v=>'"'+String(v==null?'':v).replaceAll('"','""').replace(/^[=+@-]/,'\u0027')+'"';
  const lines=[['Employee','Published','Reported at','Completion percent','Attendance percent','Score percent','Milestones completed','Level'].map(q).join(',')];
  for(const p of people)lines.push([p.name,p.has_published_report,p.reported_at||'',p.completion_percent??'',p.attendance_percent??'',p.score_percent??'',p.milestones_completed??'',p.level||''].map(q).join(','));
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
