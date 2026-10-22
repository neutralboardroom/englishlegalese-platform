/* EnglishLegalese v1.82.0 — 28 topic-specific four-session guided learning plans.
   Original fictional course data; browser-memory only. No account, analytics, payment,
   external calendar, teacher booking, file upload or transmitted personal data. */
(()=>{'use strict';
const C=window.ELCURRICULUM_V1800;
if(!C||!Array.isArray(C.records)||C.records.length!==28)return;
const $=(q,r=document)=>r.querySelector(q), E=(tag,t,cls)=>{const n=document.createElement(tag);if(t!==undefined)n.textContent=t;if(cls)n.className=cls;return n;};
const lessons=C.records;
const memory=new Map(); // temporary in-page memory, not persistent.
function plan(id){if(!memory.has(id))memory.set(id,{complete:[false,false,false,false],goal:'',note:''});return memory.get(id);}
function plain(value){return String(value||'').replace(/[\x00-\x1f\x7f]/g,' ').trim();}
function escapeCalendar(s){return plain(s).replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n').slice(0,300);}
function saveLocal(name,body,type){const url=URL.createObjectURL(new Blob([body],{type})),a=E('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);}
const steps=[
 {mode:'Read and identify',work:'Read the fictional scenario; underline the essential fact, the uncertain point and the next action.'},
 {mode:'Discuss and clarify',work:'Use two topic-specific glossary terms in a careful client or colleague explanation. Ask one neutral clarification question.'},
 {mode:'Draft and revise',work:'Create a six-sentence professional message. Check conditions, actors, timing and any unsupported conclusion.'},
 {mode:'Simulate and review',work:'Perform a short roleplay and compare the facts in your answer with the source. State what still needs verification.'}
];
const rubric=[
 'Source fidelity: no invented legal facts, outcomes or promises',
 'Vocabulary: at least two relevant terms used accurately',
 'Clarity: purpose, audience and next action are understandable',
 'Professional care: uncertainty and sensitive matters handled respectfully'
];
function dateString(date){return date.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric',year:'numeric'});}
function sessionDates(){
 const start=$('#v1820-start-date')?.value||'', frequency=Number($('#v1820-frequency')?.value)||1,valid=/^\d{4}-\d\d-\d\d$/.test(start);
 if(!valid)return [];
 const [y,m,d]=start.split('-').map(Number),local=new Date(y,m-1,d,12,0,0);
 if(local.getFullYear()!==y||local.getMonth()!==m-1||local.getDate()!==d)return [];
 return [0,1,2,3].map(i=>{const copy=new Date(local);copy.setDate(local.getDate()+Math.floor(i/frequency)*7+(i%frequency)*3);return copy;});
}
function mount(){
 const host=$('#live-classes');if(!host||$('#v1820-learning-studio'))return;
 const wrap=E('div',undefined,'container v1820-studio-wrap'),section=E('section',undefined,'v1820-studio');
 section.id='v1820-learning-studio';section.setAttribute('aria-labelledby','v1820-title');
 const p=E('p','28 classes · 4 sessions per class · personal study support','v1820-kicker');
 const title=E('h2','Build your Legal English learning plan');title.id='v1820-title';
 const desc=E('p','Choose one of our 28 Legal English or Business English topics to create a four-session self-study and teacher-preparation roadmap, with topic vocabulary, practical tasks, homework and a feedback checklist. All dates are personal study reminders, not confirmed lessons.','v1820-intro');
 const disclaimer=E('p','This studio works on this page only. No account is created, no personal learning data is transmitted or saved, and no teacher or class is booked. Your progress disappears when the page is reloaded or closed.','v1820-note');
 const form=E('form',undefined,'v1820-form');form.noValidate=true;
 function field(id,caption,node){node.id=id;const label=E('label',undefined,'v1820-field');label.append(E('span',caption),node);return label;}
 const track=E('select');track.id='v1820-track';
 [['All tracks','all'],['Core professional','Core professional'],['Legal specialties','Legal specialties'],['International & academic','International & academic'],['Professional & Business English','Professional & Business English']].forEach(([n,v])=>{const o=E('option',n);o.value=v;track.append(o);});
 // Names intentionally use the actual track values as displayed labels.
 const classSelect=E('select');classSelect.id='v1820-course';
 const pace=E('select');pace.id='v1820-frequency';
 [['One session per week','1'],['Two sessions per week','2']].forEach(([t,v])=>{const o=E('option',t);o.value=v;pace.append(o);});
 const start=E('input');start.type='date';start.id='v1820-start-date';
 const today=new Date();const iso=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');start.value=iso;
 const fields=E('div',undefined,'v1820-fields');
 fields.append(field('v1820-track','Subject track',track),field('v1820-course','Your class topic',classSelect),field('v1820-frequency','Suggested pace',pace),field('v1820-start-date','First personal study day (optional to change)',start));
 const goal=E('input');goal.type='text';goal.maxLength=120;goal.placeholder='Example: describe a proposed deadline clearly';goal.id='v1820-goal';
 const goalLabel=field('v1820-goal','My language goal (optional, up to 120 characters)',goal);
 const progress=E('p',undefined,'v1820-progress');progress.setAttribute('role','status');
 const list=E('div',undefined,'v1820-lessons'),homework=E('div',undefined,'v1820-homework'),teacher=E('details',undefined,'v1820-teacher');
 const note=E('textarea');note.rows=3;note.maxLength=500;note.placeholder='Write only practice reflections; do not enter real client information.';note.id='v1820-note';
 const noteLabel=field('v1820-note','Private learning reflection (optional, up to 500 characters)',note);
 const chars=E('p',undefined,'v1820-characters');
 const actions=E('div',undefined,'v1820-actions'),
 exportPlan=E('button','Download study & teacher packet','btn teal'),
 exportIcs=E('button','Download unconfirmed personal study reminders','btn light'),
 reset=E('button','Clear this topic’s plan','btn light');
 for(const b of [exportPlan,exportIcs,reset]){b.type='button';actions.append(b);}
 const status=E('p','Personal planning only. Nothing is sent to EnglishLegalese.','v1820-status');status.setAttribute('role','status');
 form.append(fields,goalLabel,progress,list,homework,teacher,noteLabel,chars,actions,status);
 section.append(p,title,desc,disclaimer,form);wrap.append(section);
 const catalog=$('#v1800-class-catalog');if(catalog)catalog.after(wrap);else host.append(wrap);
 function current(){return lessons.find(c=>c.id===classSelect.value)||lessons[0];}
 function updateOptions(){
  const available=lessons.filter(x=>track.value==='all'||x.group===track.value),prior=classSelect.value;
  classSelect.replaceChildren();for(const c of available){const o=E('option',c.title+' · '+c.level);o.value=c.id;classSelect.append(o);}
  if(available.some(c=>c.id===prior))classSelect.value=prior;
  refresh();
 }
 function refresh(){
  const c=current(),m=plan(c.id),dates=sessionDates();
  goal.value=m.goal;note.value=m.note;
  progress.textContent=m.complete.filter(Boolean).length+' of 4 personal study sessions self-marked complete for '+c.title+'. This is not a credential or a verified teacher attendance record.';
  chars.textContent=(500-m.note.length)+' characters remaining';
  list.replaceChildren(E('h3','Your four-session guided roadmap'));
  c.units.forEach((u,i)=>{
    const card=E('article',undefined,'v1820-session');
    const hd=E('div',undefined,'v1820-session-head'),sub=E('h4','Session '+(i+1)+' — '+u.split(':')[0]);
    const check=E('label',undefined,'v1820-check'),input=E('input');input.type='checkbox';input.checked=m.complete[i];
    check.append(input,document.createTextNode(' I practised this session'));
    input.addEventListener('change',()=>{m.complete[i]=input.checked;progress.textContent=m.complete.filter(Boolean).length+' of 4 personal study sessions self-marked complete for '+c.title+'. This is not a credential or a verified teacher attendance record.';status.textContent='Your personal self-check was updated in this page only.';});
    hd.append(sub,check);
    const date=E('p',dates[i]?'Suggested personal study day: '+dateString(dates[i]):'Study day not selected.','v1820-date');
    const details=E('p',u.includes(':')?u.split(':').slice(1).join(':').trim():u,'v1820-task');
    const instruction=E('p',steps[i].mode+': '+steps[i].work,'v1820-task');
    const terms=E('p','Suggested vocabulary: '+c.vocab.slice(i,i+2).map(v=>v[0]+' — '+v[1]).join('; '),'v1820-vocab');
    card.append(hd,date,details,instruction,terms);list.append(card);
  });
  homework.replaceChildren(E('h3','Homework and quality self-check'),E('p',c.homework));
  const box=E('ul');rubric.forEach(x=>box.append(E('li',x)));homework.append(box);
  const sum=E('summary','Teacher facilitation brief · 50-minute example lesson');teacher.replaceChildren(sum);
  teacher.append(E('p','Outcome: '+c.outcome),E('p','Fictional classroom case: '+c.scenario),E('p','Instructor instructions: '+c.teacher));
  const ol=E('ol');[
    '5 minutes: short, low-pressure warm-up on the topic',
    '10 minutes: teach and apply five defined vocabulary terms',
    '15 minutes: partner roleplay with the fictional scenario',
    '10 minutes: compare learner phrasing, correct overclaims and ambiguity',
    '10 minutes: individual language feedback and homework briefing'
  ].forEach(s=>ol.append(E('li',s)));
  teacher.append(ol,E('p','Use the four quality criteria above to provide formative language feedback. Avoid real client matters. Class times and teaching roles must be independently confirmed before any sale or booking.','v1820-small'));
 }
 track.addEventListener('change',()=>{updateOptions();status.textContent='Track changed; your earlier entries remain only in this page session.';});
 classSelect.addEventListener('change',()=>{refresh();status.textContent='Topic changed. Nothing has been submitted or booked.';});
 [pace,start].forEach(x=>x.addEventListener('change',()=>{refresh();status.textContent='Personal study reminder dates updated, not teacher sessions.';}));
 goal.addEventListener('input',()=>{plan(current().id).goal=goal.value;});
 note.addEventListener('input',()=>{plan(current().id).note=note.value;chars.textContent=(500-note.value.length)+' characters remaining';});
 reset.addEventListener('click',()=>{memory.delete(current().id);refresh();status.textContent='This topic’s temporary study progress and notes were cleared.';});
 exportPlan.addEventListener('click',()=>{
   const c=current(),m=plan(c.id),dates=sessionDates();
   const lines=[
    'ENGLISHLEGALESE · PRIVATE FOUR-SESSION STUDY & TEACHER PLAN',
    'EDUCATIONAL PREVIEW · NO BOOKED CLASSES OR ASSESSMENT CREDENTIALS',
    'No payment, sending, account or teacher assignment is created.','',
    'Class: '+c.title,'Track: '+c.group,'Level descriptor: '+c.level,
    'Learning objective: '+c.outcome,'My goal: '+(plain(m.goal)||'(not entered)'),'',
    'FOUR LESSONS'
   ];
   c.units.forEach((u,i)=>lines.push((m.complete[i]?'[x] ':'[ ] ')+(i+1)+'. '+u,
    'Study day: '+(dates[i]?dateString(dates[i]):'not chosen'),
    'Guided practice: '+steps[i].work,
    'Vocabulary: '+c.vocab.slice(i,i+2).map(x=>x.join(': ')).join('; '),''));
   lines.push('HOMEWORK',c.homework,'','SELF-CHECK',...rubric.map(x=>'[ ] '+x),'',
      'TEACHER MATERIAL','Scenario: '+c.scenario,'Model response: '+c.good,'Facilitation: '+c.teacher,
      'Suggested 50-minute timing: 5 warm-up + 10 vocabulary + 15 roleplay + 10 compare + 10 feedback.','',
      'Personal reflection: '+(plain(m.note)||'(none)'),
      'No real client or sensitive matters. Browser-session notes are not saved by EnglishLegalese.');
   saveLocal('EnglishLegalese-'+c.id+'-four-session-plan.txt',lines.join('\r\n'),'text/plain;charset=utf-8');
   status.textContent='Your individual study and teacher packet was downloaded locally. No data was sent.';
 });
 exportIcs.addEventListener('click',()=>{
  const dates=sessionDates(),c=current();
  if(dates.length!==4){status.textContent='Select a valid first study day before exporting calendar reminders.';start.focus();return;}
  const fmt=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('')+'T'+[String(d.getHours()).padStart(2,'0'),String(d.getMinutes()).padStart(2,'0'),'00'].join('');
  const rows=['BEGIN:VCALENDAR','VERSION:2.0','CALSCALE:GREGORIAN','PRODID:-//EnglishLegalese//Private Study Reminders//EN'];
  dates.forEach((d,i)=>{const start=new Date(d);start.setHours(12,0,0,0);const end=new Date(start);end.setMinutes(50);
   rows.push('BEGIN:VEVENT','UID:el-selfstudy-'+c.id+'-'+(i+1)+'-'+fmt(start)+'@englishlegalese.com',
     'DTSTAMP:'+new Date().toISOString().replace(/[-:]|\.\d{3}/g,''),
     'DTSTART:'+fmt(start),'DTEND:'+fmt(end),
     'SUMMARY:'+escapeCalendar('UNCONFIRMED PERSONAL STUDY: '+c.title+' #'+(i+1)),
     'DESCRIPTION:'+escapeCalendar('Personal reminder only. NOT a booked class, teacher appointment or provider invitation. '+c.units[i]),
     'STATUS:TENTATIVE','END:VEVENT');
  });rows.push('END:VCALENDAR');
  saveLocal('EnglishLegalese-'+c.id+'-personal-study-holds.ics',rows.join('\r\n')+'\r\n','text/calendar;charset=utf-8');
  status.textContent='Downloaded four TENTATIVE (UNCONFIRMED) personal study reminders. No teacher, calendar account or video provider was contacted.';
 });
 updateOptions();
}
function init(){mount();document.documentElement.dataset.englishlegaleseMaterialRelease='1.82.0';}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{init();setTimeout(init,320);},{once:true});else{init();setTimeout(init,320);}
window.addEventListener('hashchange',()=>setTimeout(init,320));
})();