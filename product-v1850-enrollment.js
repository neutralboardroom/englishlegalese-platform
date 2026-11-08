/* EnglishLegalese HF6 — educational enrollment inquiries only; no payment or outbound emails.
 * EL-RGR-023 + EL-DUR-011 strictly prohibit builder-initiated email. */
(()=>{'use strict';
const mount=document.querySelector('#v1850-enrollment-app');if(!mount)return;
const form=document.createElement('form');form.id='v1850-enroll-form';
const el=(tag,s)=>{const x=document.createElement(tag);if(s!==undefined)x.textContent=s;return x;};
function field(name,label,type='text'){const w=el('label',label);w.className='v1850-field';const x=el('input');x.name=name;x.type=type;x.required=true;x.maxLength=name==='email'?254:120;w.append(x);form.append(w);return x;}
const fullName=field('full_name','Your full name');fullName.autocomplete='name';
const email=field('email','Email address','email');email.autocomplete='email';
function select(name,label,values){const w=el('label',label);w.className='v1850-field';const x=el('select');x.name=name;for(const [key,txt] of values){const o=el('option',txt);o.value=key;x.append(o);}w.append(x);form.append(w);return x;}
const program=select('program','Study program',[['legal','Legal English'],['business','Business English including Investor English'],['investor','Wall Street & Investor English focus'],['complete','Complete Professional English — all 48 topics']]);
const interest=select('interest','Learning package',[['one','1 lesson · topic-specific inquiry'],['four','4 lessons · topic-specific inquiry'],['eight','8-session structured foundation'],['extended','16-session extended program'],['full24','Complete 24-topic Legal or Business/Investor pathway'],['full48','All 48 topics — comprehensive professional pathway']]);
interest.value='extended';
const topic=select('topic','Preferred topic for 1 or 4 lessons',[['','Choose a subject']]);
const format=select('format','Classroom format',[['group','Small-group class'],['private','Private lesson']]);
const schedule=select('schedule_id','Schedule',[]);
// HF56 worldwide enrollment; first three market/readiness pilots are NOT a geographic restriction.
const learnerMarket=select('learner_market','Country / market for class arrangements',[
 ['other','Another country — worldwide EnglishLegalese enrollment'],
 ['th','Thailand'],
 ['vn','Vietnam'],
 ['cn','China']
]);
const contactLanguage=select('preferred_contact_language','Preferred contact language (request only; availability to be confirmed)',[
 ['en','English'],['th','ไทย · Thai'],['vi','Tiếng Việt · Vietnamese'],['zh-Hans','简体中文 · Simplified Chinese']
]);
const localeHelp=el('p');localeHelp.className='v1850-boundary';localeHelp.setAttribute('role','status');localeHelp.setAttribute('aria-live','polite');form.append(localeHelp);
function localeGuidance(){
 const text={
  th:'ภาษาอังกฤษสำหรับนักกฎหมายและผู้เชี่ยวชาญด้านธุรกิจ: เลือกหลักสูตร ใส่อีเมลและส่งคำขอ การลงทะเบียนยังไม่ถือเป็นการจองหรือชำระเงิน',
  vi:'Tiếng Anh pháp lý và thương mại: chọn khóa học, nhập email và gửi yêu cầu. Chưa đặt lịch hoặc thanh toán cho đến khi được xác nhận.',
  'zh-Hans':'法律英语与商务英语：选择课程，填写电子邮箱并提交咨询。提交不代表课程已预约或费用已支付。',
  en:'EnglishLegalese welcomes adult professionals worldwide. Choose a program and request an available time; confirmation is not automatic.'
 };
 const lang=contactLanguage.value;
 localeHelp.textContent=(text[lang]||text.en)+' Contact-language assistance and any live-class video platform require individual confirmation. '+(learnerMarket.value==='cn'?'Mainland China video access must be checked before confirming a class.':learnerMarket.value==='other'?'Learners from every country may submit an inquiry.':'Time zone and teacher availability are confirmed before scheduling.');
 localeHelp.lang=lang;
}
learnerMarket.addEventListener('change',()=>{
 contactLanguage.value=({th:'th',vn:'vi',cn:'zh-Hans'}[learnerMarket.value]||'en');
 localeGuidance();
});
contactLanguage.addEventListener('change',localeGuidance);
const base=window.ELCURRICULUM_V1800?.records||[],business=window.ELBUSINESS_V1850_CATALOG||[];
const legal=base.filter(c=>c.group!=='Professional & Business English');
const prices={one:{group:24,private:45},four:{group:79,private:169},eight:{group:149,private:319},extended:{group:249,private:599},full24:{group:349,private:849},full48:{group:649,private:1599}};
const sessions={one:1,four:4,eight:8,extended:16,full24:24,full48:48};
const companyToggle=el('label');companyToggle.className='v1850-field';const employer=el('input');employer.type='checkbox';employer.name='employer_interest';employer.value='yes';companyToggle.append(employer,el('span',' Request multi-employee training / an employer group quote'));form.append(companyToggle);
const companyField=el('label','Employer / organization name (no employee names)');companyField.className='v1850-field';const organization=el('input');organization.name='organization';organization.maxLength=80;companyField.append(organization);form.append(companyField);
const countField=el('label','Number of employee seats (1–999)');countField.className='v1850-field';const seats=el('input');seats.name='employee_seats';seats.type='number';seats.min='1';seats.max='999';seats.step='1';countField.append(seats);form.append(countField);
const businessNotice=el('p','','v1850-boundary');businessNotice.className='v1850-boundary';form.append(businessNotice);
function availableTopics(){
 const list=program.value==='legal'?legal:business.filter(c=>program.value==='investor'?c.id.startsWith('ws-'):!c.id.startsWith('ws-'));
 const previous=topic.value;topic.replaceChildren();let placeholder=el('option','Choose a topic');placeholder.value='';topic.append(placeholder);
 for(const c of list){const o=el('option',c.title);o.value=c.id;topic.append(o);}
 if([...topic.options].some(o=>o.value===previous))topic.value=previous;
}
function update(){
 const isComplete=program.value==='complete';
 if(isComplete)interest.value='full48';
 if(!isComplete&&interest.value==='full48')interest.value='full24';
 if(program.value==='investor'&&interest.value==='full24')interest.value='eight';
 const eight=interest.value==='eight',long=interest.value==='full24'||interest.value==='full48';
 const topicWanted=interest.value==='one'||interest.value==='four';
 topic.parentElement.hidden=!topicWanted;topic.required=topicWanted;topic.disabled=!topicWanted;
 const group=format.querySelector('option[value=group]'),priv=format.querySelector('option[value=private]');
 const n=sessions[interest.value];group.textContent='Small-group, '+n+' lessons · $'+prices[interest.value].group;
 priv.textContent='Private, '+n+' lessons · $'+prices[interest.value].private;
 const fixed=interest.value==='extended'&&format.value==='group'&&!isComplete;
 const id=fixed?(program.value==='legal'?'legal-group-mon':'business-group-wed'):(format.value==='private'?'private-time-request':'topic-time-request');
 const label=fixed?(program.value==='legal'?'Existing Legal English Monday 7:00 p.m. Vietnam group · subject to confirmation':'Existing Business English Wednesday 7:00 p.m. Vietnam group · subject to confirmation'):(format.value==='private'?'Request individually arranged private dates':'Request group dates and cohort availability');
 const o=el('option',label);o.value=id;schedule.replaceChildren(o);
 companyField.hidden=countField.hidden=!employer.checked;organization.required=seats.required=employer.checked;organization.disabled=seats.disabled=!employer.checked;
 const seatsCount=Number(seats.value);const discount=seatsCount>=11?15:seatsCount>=6?10:seatsCount>=3?5:0;
 businessNotice.textContent=employer.checked?('Employer quote requested. '+(n>=8&&format.value==='group'&&discount?'Indicative multi-seat discount: '+discount+'% off eligible group packages; subject to separate cohort, staffing and quote confirmation.':'Multi-seat reductions apply only to group packages of 8+ lessons with at least three employees.')+' Do not enter employee personal details. No payment or booking is made.'):(eight?'Eight-session curriculum uses eight distinct foundation sessions; it does not cover all 24 topics.':long?'A comprehensive pathway covers one instructor-guided meeting per subject topic, with optional independent workbooks. Scheduling is individually confirmed.':'A teacher and schedule must be confirmed before any class is booked.');
}
program.addEventListener('change',()=>{availableTopics();update();});

interest.addEventListener('change',update);format.addEventListener('change',update);employer.addEventListener('change',update);seats.addEventListener('input',update);
// Only accept nonpersonal, preapproved plan choices from the informational estimator.
const qs=new URLSearchParams(window.location.search);
const preProgram=qs.get('program'),prePackage=qs.get('package'),preSeats=qs.get('seats');
const preMarket=qs.get('market'),preLanguage=qs.get('lang');
if(['th','vn','cn','other'].includes(preMarket))learnerMarket.value=preMarket;
const marketLanguage={th:'th',vn:'vi',cn:'zh-Hans',other:'en'};
contactLanguage.value=['en','th','vi','zh-Hans'].includes(preLanguage)?preLanguage:(marketLanguage[learnerMarket.value]||'en');
localeGuidance();
if(['legal','business','complete'].includes(preProgram)&&['eight','extended','full24','full48'].includes(prePackage)&&
  ((preProgram==='complete'&&prePackage==='full48')||(preProgram!=='complete'&&prePackage!=='full48'))){
 program.value=preProgram;interest.value=prePackage;
 const seatCount=Number(preSeats);
 if(preSeats!==null&&/^\d{1,3}$/.test(preSeats)&&Number.isInteger(seatCount)&&seatCount>=3&&seatCount<=999){
  employer.checked=true;seats.value=String(seatCount);
  // Organization is deliberately never prefilled or transmitted by a quote estimate.
 }
}
availableTopics();update();
const noteLabel=el('label','Learning goals, preferred dates, team needs (optional; no client/employee confidential details)');noteLabel.className='v1850-field';
const note=el('textarea');note.name='note';note.maxLength=180;note.rows=3;noteLabel.append(note);form.append(noteLabel);
const honeypot=field('website','Website (leave blank)');honeypot.parentElement.classList.add('v1850-hp');honeypot.required=false;honeypot.tabIndex=-1;
const disclaimer=el('p','Inquiry only. Teacher, class timetable and group size require individual confirmation. No payment is taken, no automatic email is sent, and employer discounts are estimates pending a written quote.');disclaimer.className='v1850-boundary';form.append(disclaimer);
const submit=el('button','Submit enrollment inquiry');submit.type='submit';submit.className='v1840-button';const status=el('p');status.className='v1850-feedback';status.setAttribute('role','status');form.append(submit,status);mount.append(form);
form.addEventListener('submit',async event=>{
 event.preventDefault();if(!form.reportValidity())return;
 if(interest.value==='full48'&&program.value!=='complete'){status.textContent='Select the Complete Professional English program for 48 subjects.';return;}
 const info=Object.fromEntries(new FormData(form));
 const prefix=interest.value==='one'||interest.value==='four'
 ?'[Topic-specific inquiry: '+topic.value+' | '+(topic.selectedOptions[0]?.textContent||'')+'; sessions='+sessions[interest.value]+'; format='+format.value+']'
 :'[Program package inquiry: program='+program.value+'; sessions='+sessions[interest.value]+'; format='+format.value+(employer.checked?'; employer_seats='+seats.value+'; organization='+organization.value.trim().replace(/[;\]<>]/g,' '):'')+']';
 const localeNote=' [Learner market='+learnerMarket.value+'; preferred contact language='+contactLanguage.value+'; language/video support not yet confirmed]';
 info.note=(prefix+localeNote+(employer.checked&&(interest.value==='one'||interest.value==='four')?' [Employer seats='+seats.value+'; organization='+organization.value.trim().replace(/[;\\]<>]/g,' ')+']':'')+' '+note.value).slice(0,500);
 delete info.topic;delete info.interest;delete info.employer_interest;delete info.organization;delete info.employee_seats;
 info.client_request_id=crypto.randomUUID();
 submit.disabled=true;status.textContent='Saving enrollment inquiry…';
 try{
  const res=await fetch('/api/v1850/enroll',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(info)});
  const result=await res.json();if(!res.ok||!result.ok)throw Error(result.error||'Could not submit');
  const success=el('p','Inquiry received. Reference: '+result.reference+'. Teaching, cohort size, schedule, and any employer discount require manual confirmation. No payment was taken and no automatic email was sent.');
  success.className='v1850-success';form.replaceWith(success);
 }catch(err){status.textContent=err.message;submit.disabled=false}
});
})();