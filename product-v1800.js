/* EnglishLegalese v1.80.0 — optional device-memory study planner.
   Self-reported study only: no network, accounts, cookies, uploads, payment, bookings or storage. */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const el=(tag,txt,cls)=>{const n=document.createElement(tag);if(txt!==undefined)n.textContent=txt;if(cls)n.className=cls;return n;};
const TOPICS=['Core language and meaning','Applied reading and accurate decisions','Fictional professional situation and self-review'];
function mount(){
 const section=$('#courses');if(!section||$('#v1800-study-planner'))return;
 const cards=$$('.v1580-course-card',section);if(cards.length!==9)return;
 const classes=cards.slice(2,8).map((card,i)=>({
   title:($('h3',card)||$('h4',card)||$('strong',card))?.textContent?.trim()||'Legal English course '+(i+1),
   card
 }));
 const plans=classes.map(()=>({done:[false,false,false],goal:'',notes:''}));
 const outer=el('div',undefined,'container');
 const details=el('details',undefined,'panel v1800-study');details.id='v1800-study-planner';
 details.append(el('summary','My private Legal English study planner'));
 const body=el('div',undefined,'v1800-study-body');
 body.append(el('h3','Plan and review your next learning steps'),el('p','Track what you personally worked through across the three existing sample lessons in each course. This is a private self-check, not a verified completion record or an enrolled course. Everything clears when you reload or leave this page.'));
 const label=el('label','Choose a course','v1800-label'),select=el('select');select.id='v1800-course-select';
 classes.forEach((entry,i)=>{const opt=el('option',entry.title);opt.value=String(i);select.append(opt);});
 label.append(select);
 const progress=el('p',undefined,'v1800-progress');progress.setAttribute('role','status');
 const checklist=el('fieldset',undefined,'v1800-checklist');checklist.append(el('legend','My three sample lessons'));
 const items=TOPICS.map((topic,i)=>{const row=el('label',undefined,'v1800-check'),input=el('input');input.type='checkbox';input.value=String(i);row.append(input,document.createTextNode(' I worked through lesson '+(i+1)+' — '+topic));checklist.append(row);return input;});
 const goalLabel=el('label','My next small practice goal (optional)','v1800-label'),goal=el('input');goal.type='text';goal.maxLength=120;goal.placeholder='Example: explain a deadline without overstating certainty';goalLabel.append(goal);
 const notesLabel=el('label','What I want to review again (optional)','v1800-label'),notes=el('textarea');notes.rows=3;notes.maxLength=500;notes.placeholder='Keep personal notes here only while this page stays open.';notesLabel.append(notes);
 const counter=el('p','500 characters remaining','v1800-small');
 const next=el('p',undefined,'v1800-next');
 const actions=el('div',undefined,'v1800-actions'),download=el('button','Download my private study plan','btn teal'),clear=el('button','Clear this course','btn light'),clearAll=el('button','Clear all six plans','btn light');
 [download,clear,clearAll].forEach(b=>{b.type='button';actions.append(b);});
 const status=el('p','Nothing in this planner is sent or saved by EnglishLegalese.','v1800-small');status.setAttribute('role','status');
 body.append(label,progress,checklist,goalLabel,notesLabel,counter,next,actions,status);
 details.append(body);outer.append(details);section.append(outer);
 function selected(){return Number(select.value)||0;}
 function refresh(){
   const p=plans[selected()];items.forEach((x,i)=>x.checked=p.done[i]);goal.value=p.goal;notes.value=p.notes;
   const count=p.done.filter(Boolean).length;progress.textContent=count+' of 3 sample lessons self-marked as worked through for '+classes[selected()].title+'.';
   counter.textContent=(500-p.notes.length)+' characters remaining';
   const index=p.done.findIndex(x=>!x);
   next.textContent=index===-1?'All three sample lessons are self-marked. Revisit a difficult example or practise explaining it aloud.':'Suggested next step: work through sample lesson '+(index+1)+' in the course card above, then mark it here if you completed it.';
 }
 select.addEventListener('change',()=>{refresh();status.textContent='Course changed. Your other choices remain only in this page session.';});
 items.forEach((input,i)=>input.addEventListener('change',()=>{plans[selected()].done[i]=input.checked;refresh();status.textContent='Personal self-check updated in page memory only.';}));
 goal.addEventListener('input',()=>{plans[selected()].goal=goal.value;});
 notes.addEventListener('input',()=>{plans[selected()].notes=notes.value;counter.textContent=(500-notes.value.length)+' characters remaining';});
 clear.addEventListener('click',()=>{plans[selected()]={done:[false,false,false],goal:'',notes:''};refresh();status.textContent='This course plan was cleared.';});
 clearAll.addEventListener('click',()=>{plans.forEach((_,i)=>plans[i]={done:[false,false,false],goal:'',notes:''});refresh();status.textContent='All six private plans were cleared.';});
 download.addEventListener('click',()=>{
   const lines=['EnglishLegalese — PRIVATE LEARNING STUDY PLAN','SELF-REPORTED ONLY · NOT A COURSE CERTIFICATE','No enrollment, teacher appointment or payment is created.',''];
   classes.forEach((course,i)=>{const p=plans[i];lines.push(course.title, ...TOPICS.map((s,k)=>(p.done[k]?'[x] ':'[ ] ')+'Sample lesson '+(k+1)+': '+s),'My next goal: '+(p.goal||'(not entered)'),'Review notes: '+(p.notes||'(none)'),'');});
   const url=URL.createObjectURL(new Blob([lines.join('\r\n')],{type:'text/plain;charset=utf-8'}));
   const a=el('a');a.href=url;a.download='EnglishLegalese-private-study-plan.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
   status.textContent='Your private six-course plan was downloaded locally. No information was transmitted.';
 });
 refresh();
}
function init(){mount();document.documentElement.dataset.englishlegaleseMaterialRelease='1.80.0';}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.addEventListener('hashchange',()=>setTimeout(init,0));
})();