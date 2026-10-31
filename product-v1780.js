/* EnglishLegalese 1.78.0: live-teacher classroom journey, timezone-safe scheduling preview,
   meaningful second course lessons, and goal-to-lesson handoffs. No external submission. */
(()=>{'use strict';
const VERSION='1.78.0';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const n=(tag,text,cls)=>{const x=document.createElement(tag);if(text!==undefined)x.textContent=text;if(cls)x.className=cls;return x;};
const UNIT2={
2:{title:'Ask, confirm and follow up',objective:'Distinguish a request from a confirmation or promise.',sample:'Fictional message: “Could you send the signed draft? We will check it once it arrives. No review has been completed.”',questions:[
['What is being requested?',['A signed draft','A completed court filing','A legal guarantee'],0,'A request for the signed draft appears before any review.'],
['What has already been reviewed?',['Everything','Nothing yet','The entire case'],1,'The message clearly says no review has been completed.'],
['What is a faithful summary?',['Review is complete','The draft is already approved','Send the signed draft; review follows receipt'],2,'Preserve the order and do not invent approval.']]},
3:{title:'Write a precise follow-up email',objective:'Use a clear subject, factual statement and answerable next step.',sample:'Fictional email: “We received your draft on Tuesday. The reviewer has not approved the changes. Could you confirm which version should be examined?”',questions:[
['What fact can be stated confidently?',['Draft received Tuesday','Changes approved','Filing submitted'],0,'The receipt date is stated.'],
['What is still unresolved?',['Whether the email exists','Which version should be reviewed','Which office printed it'],1,'The next step is to confirm the version.'],
['Which summary is best?',['All changes are approved','The filing is complete','We received the draft; please identify the review version'],2,'A good follow-up distinguishes receipt from approval.']]},
4:{title:'Clarify a video meeting action',objective:'Restate the action, responsible person, and conditional timing.',sample:'Fictional call: “Alex will send the revised summary on Monday if the project lead approves it on Friday.”',questions:[
['What is conditional?',['The name Alex','The Monday delivery target','The existence of Friday'],1,'Monday depends on Friday approval.'],
['Who is responsible for sending it?',['Alex','The client','An unnamed court'],0,'Alex is named.'],
['Which response is strongest?',['Delivery is guaranteed','It has already been sent','So Monday is our target if Friday approval arrives?'],2,'Restating the condition is professionally precise.']]},
5:{title:'Separate definitions and assumptions',objective:'Notice meaning changes caused by defined terms and approval requirements.',sample:'Fictional clause: “An Authorized Reviewer may inspect the sample after written notice. ‘Authorized Reviewer’ has the meaning stated in Appendix A.”',questions:[
['Where is the defined role explained?',['Appendix A','A video call','The invoice'],0,'The definition is in Appendix A.'],
['What must happen before inspection?',['The reviewer must sign the invoice','Written notice','The sample is publicly released'],1,'The passage expressly requires written notice.'],
['Which conclusion is supported?',['Anyone may inspect','Appendix A is unnecessary','The permitted inspector is defined elsewhere'],2,'Use the full agreement context for real interpretation.']]},
6:{title:'Audit a polished AI rewrite',objective:'Find changes to dates, certainty and reported actions.',sample:'Fictional source: “We expect a reply by Thursday.” AI rewrite: “The client will definitely approve our request Thursday.”',questions:[
['Which unsupported claim was inserted?',['Definite approval','Thursday','A request for a reply'],0,'The original only expects a reply, not approval.'],
['Which revision stays faithful?',['Thursday is legally binding','We expect a response by Thursday','Approval has been guaranteed'],1,'Keep the original uncertainty.'],
['What is the best next step?',['Trust fluency alone','Automatically send it','Verify facts and ask a human when meaning matters'],2,'Fluent writing is not proof of source accuracy.']]},
7:{title:'Explain a claim and its limitation',objective:'Separate a hypothetical academic argument from supporting evidence.',sample:'Fictional article abstract: “The author proposes that short reminders improve teamwork, but provides only two interviews and no comparative outcomes.”',questions:[
['What does the author propose?',['Reminders improve teamwork','The claim is legally binding','A randomized trial confirms everything'],0,'The proposal is not a proven universal result.'],
['Which limitation is named?',['There are no interviews','No comparative outcomes','The author is unknown'],1,'No comparative outcomes are presented.'],
['Which academic response is strongest?',['This proves all reminders work','No question is needed','What comparison could test the proposed effect?'],2,'Ask an evidence-focused question.']]}
};
const GOALS=[
 {title:'Start with legal terminology',desc:'Understand precise requests, obligations and workplace language.',idx:2,lab:'#legal-vocabulary-guide'},
 {title:'Write clearer professional emails',desc:'Practice tone, concise wording and factual updates.',idx:3,lab:'#professional-message-builder'},
 {title:'Speak confidently with colleagues and clients',desc:'Prepare for video lessons, meetings and follow-up questions.',idx:4,lab:'#conversation-rehearsal-lab'},
 {title:'Read contracts and documents carefully',desc:'Identify conditions and differences in meaning.',idx:5,lab:'#reading-precision-lab'},
 {title:'Check AI and translation output',desc:'Review fluent wording for invented claims and missing context.',idx:6,lab:'#ai-review-lab'},
 {title:'Prepare for law school and LL.M. study',desc:'Read arguments, ask questions and use evidence responsibly.',idx:7,lab:'#case-brief-lab'}
];
function makePathways(){
 const root=$('#app'),anchor=$('#start');if(!root||!anchor||$('#learning-pathways'))return;
 const s=n('section',undefined,'section v1780-pathways');s.id='learning-pathways';s.setAttribute('aria-labelledby','v1780-path-title');
 const wrap=n('div',undefined,'container');const top=n('div',undefined,'section-head');
 const heading=n('div');heading.append(n('div','Find your learning route','eyebrow'),n('h2','A clear path from independent practice to human instruction.'));heading.querySelector('h2').id='v1780-path-title';
 top.append(heading,n('p','Choose a goal, begin with a real learning exercise, and explore human-taught online classes when you need live feedback.'));
 const grid=n('div',undefined,'v1780-goal-grid');
 GOALS.forEach((g,i)=>{const card=n('article',undefined,'panel v1780-goal-card');card.append(n('span','PATH '+(i+1),'v1780-overline'),n('h3',g.title),n('p',g.desc));const row=n('div',undefined,'v1780-goal-actions');
 const course=n('button','Open course lesson','btn teal');course.type='button';course.addEventListener('click',()=>{location.hash='#courses';const choose=()=>{const section=$('#courses');const cards=$$('.v1580-course-card',section);const c=cards[g.idx];if(c?.hidden){const exp=$('.js-v1580-courses',section);if(exp&&exp.getAttribute('aria-expanded')!=='true')exp.click();}c?.querySelector('.v1770-course-action')?.click();};setTimeout(choose,60);});
 const lab=n('a','Practice related skill →','v1780-text-link');lab.href=g.lab;row.append(course,lab);card.append(row);grid.append(card)});
 const footer=n('p','For speaking, writing and higher-stakes professional communication, human teachers can provide personalized feedback in online video classrooms.','v1780-fine');wrap.append(top,grid,footer);s.append(wrap);anchor.after(s);
}
function makeUnit2(){
 const courses=$('#courses');if(!courses||$('#v1780-second-unit'))return;
 const cards=$$('.v1580-course-card',courses);if(cards.length!==9)return;
 const box=n('div',undefined,'container v1780-unit-wrap');const section=n('section',undefined,'panel v1780-unit');section.id='v1780-second-unit';section.hidden=true;section.setAttribute('aria-label','Course second sample lesson');
 const h=n('h3');h.tabIndex=-1;const obj=n('p'),ex=n('p'),scenario=n('blockquote'),form=n('form'),questions=n('div'),status=n('div','Answer three questions to see explanations.','v1780-unit-status');
 status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const button=n('button','Check my answers','btn teal'),close=n('button','Close lesson','btn light');button.type='submit';close.type='button';close.addEventListener('click',()=>{section.hidden=true;status.textContent='';});const actions=n('div',undefined,'v1780-unit-actions');actions.append(button,close);form.append(questions,actions);section.append(n('div','COURSE UNIT 2 · MORE PRACTICE','eyebrow'),h,obj,ex,scenario,form,status,n('p','Your choices are never uploaded or saved. These fictional examples are education only, not legal advice or certified progress.','v1780-fine'));box.append(section);courses.append(box);
 let current=null;
 function open(idx){const item=UNIT2[idx];if(!item)return;current=idx;h.textContent=item.title;obj.textContent='Learning objective: '+item.objective;ex.textContent='Read carefully and retain the facts, uncertainty and necessary review boundaries.';scenario.textContent=item.sample;questions.replaceChildren();item.questions.forEach((q,i)=>{const field=n('fieldset',undefined,'v1780-question');field.append(n('legend',(i+1)+'. '+q[0]));q[1].forEach((answer,j)=>{const label=n('label',undefined,'v1780-answer'),input=n('input');input.type='radio';input.name='v1780-q-'+i;input.value=String(j);label.append(input,document.createTextNode(answer));field.append(label)});questions.append(field)});status.textContent='Answer three questions to see explanations.';section.hidden=false;section.scrollIntoView({block:'start',behavior:'instant'});h.focus({preventScroll:true});}
 form.addEventListener('change',()=>status.textContent='Your selection changed. Check again to update the explanations.');
 form.addEventListener('submit',e=>{e.preventDefault();const item=UNIT2[current];if(!item)return;const chosen=item.questions.map((_,i)=>$('input[name="v1780-q-'+i+'"]:checked',form));if(chosen.some(x=>!x)){status.textContent='Please choose an answer for each of the three questions.';return;}let correct=0;const list=n('ol');item.questions.forEach((q,i)=>{const match=Number(chosen[i].value)===q[2];correct+=Number(match);list.append(n('li',(match?'Correct. ':'Review this answer. ')+q[3]));});status.replaceChildren(n('strong',correct+' of 3 answers matched the source text.'),list);});
 cards.forEach((card,i)=>{if(!UNIT2[i])return;const b=n('button','Continue: sample lesson 2','btn light v1780-next-action');b.type='button';b.addEventListener('click',()=>open(i));card.append(b);});
}
function addClassrooms(){
 const root=$('#app'),teachers=$('#teachers');if(!root||!teachers||$('#live-classes'))return;
 const s=n('section',undefined,'section v1780-classrooms');s.id='live-classes';s.setAttribute('aria-labelledby','v1780-class-title');
 const c=n('div',undefined,'container'),top=n('div',undefined,'section-head'),heading=n('div');heading.append(n('div','Human-taught Legal English and Business English','eyebrow'),n('h2','Learn live with a human teacher in an online video classroom.'));heading.querySelector('h2').id='v1780-class-title';
 top.append(heading,n('p','Structured Legal English, Business English, investor communication and professional team learning through interactive discussion, guided roleplay and direct teacher feedback. Class plans are previews until a real teacher confirms the session.'));
 const benefits=n('div',undefined,'v1780-benefits');
 [['video','Live interaction','Ask questions, practise spoken Legal English, and receive personalized explanations during a teacher-led video session.'],['book','Class scheduling','Choose a learning focus and preview a lesson time. Actual classes are confirmed only after teacher assignment and an official meeting link.'],['calendar','Calendar-friendly','A schedule can be shared using standard calendar invitations and an approved Zoom, Google Meet, Teams or regional meeting link.']].forEach(([kind,title,body])=>{const card=n('article',undefined,'panel v1780-benefit');card.append(n('span',kind==='video'?'◉':kind==='book'?'◷':'▦','v1780-benefit-symbol'),n('h3',title),n('p',body));benefits.append(card)});
 const studio=n('div',undefined,'v1780-studio'),preview=n('div',undefined,'panel v1780-room-preview');
 const bar=n('div',undefined,'v1780-room-bar');bar.append(n('span','● ● ●','v1780-dots'),n('strong','EnglishLegalese · live video classroom'));preview.append(bar);
 // Copy and CTAs are deliberately separate from the locked photo in assets.
 // Future wording and destination edits belong HERE; do not modify the photo asset.
 const CLASSROOM_OVERLAY_COPY=Object.freeze({
  heading:'Teacher-led learning, together.',
  supporting:'Video discussion • roleplay • vocabulary review • shared learning goals',
  actions:Object.freeze([
   {label:'Explore live classes',href:'/learn/live-classes/'},
   {label:'View courses',href:'/learn/courses/'}
  ])
 });
 const display=n('div',undefined,'v1780-room-stage'),demo=n('div',undefined,'v18512-room-overlay');
 demo.append(n('h3',CLASSROOM_OVERLAY_COPY.heading),n('p',CLASSROOM_OVERLAY_COPY.supporting));
 const links=n('div',undefined,'v18512-room-actions');
 for(const action of CLASSROOM_OVERLAY_COPY.actions){
  const link=n('a',action.label,'v18512-room-action');link.href=action.href;links.append(link);
 }
 demo.append(links);display.append(demo);
 const chips=n('div',undefined,'v1780-provider-pills');['Zoom','Google Meet','Microsoft Teams','Tencent / VooV','Manual approved link'].forEach(x=>chips.append(n('span',x,'v1780-provider-pill')));
 preview.append(display,chips,n('p','Classroom illustration. No live session, meeting room or teacher is assigned in this preview.','v1780-fine'));
 const scheduler=n('div',undefined,'panel v1780-scheduler');scheduler.append(n('div','YOUR CLASS PLANNING WORKSPACE','eyebrow'),n('h3','Build your online class plan'),n('p','Choose a study goal and an online classroom platform, then preview a time in your local timezone. No booking or payment is made.','v1780-fine'));
 const form=n('form');form.noValidate=true;
 const labels=(id,txt,ctl)=>{ctl.id=id;const lab=n('label',txt,'v1780-field');lab.htmlFor=id;lab.append(ctl);return lab;};
 const focus=n('select'),choices=['Live one-to-one Legal English','Small-group speaking and roleplay','Legal writing feedback class','Contract vocabulary and document reading','LL.M. / academic Legal English','Live one-to-one Business English','Business meetings, negotiation and presentations','Investor and Wall Street communication','Professional business writing and email','Business English certification assessment preparation','Legal English certification assessment preparation','Employer team communication training','Legal contracts, agreements and negotiation intensive','Business contracts, agreements and negotiation intensive'];choices.forEach((x,i)=>{const o=n('option',x);o.value=String(i);focus.append(o)});
 const provider=n('select');[['zoom','Zoom'],['meet','Google Meet'],['teams','Microsoft Teams'],['voov','Tencent / VooV (regional option)'],['manual','Another approved video provider']].forEach(([val,txt])=>{const o=n('option',txt);o.value=val;provider.append(o)});
 const when=n('input');when.type='datetime-local';when.required=true;const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);tomorrow.setHours(10,0,0,0);const toLocal=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')+'T'+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');when.value=toLocal(tomorrow);
 const duration=n('select');[['30','30 minutes'],['45','45 minutes'],['60','60 minutes'],['90','90 minutes']].forEach(([val,txt])=>{const o=n('option',txt);o.value=val;duration.append(o)});duration.value='60';
 const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'Your local timezone';
 const grid=n('div',undefined,'v1780-form-grid');grid.append(labels('v1780-focus','Learning focus',focus),labels('v1780-provider','Preferred video classroom',provider),labels('v1780-when','Preferred lesson time (your device timezone)',when),labels('v1780-length','Class length',duration));
 const zone=n('p','Times shown in your device timezone: '+tz+'. You can change your device timezone if planning from another region.','v1780-fine');
 const controls=n('div',undefined,'v1780-class-controls'),prepare=n('button','Preview class plan','btn teal'),calendar=n('button','Add an unconfirmed calendar hold','btn light');prepare.type='submit';calendar.type='button';calendar.disabled=true;controls.append(prepare,calendar);
 const status=n('p','Choose a class focus and time to preview a planning hold.','v1780-class-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const result=n('div',undefined,'v1780-class-result');result.hidden=true;
 const resultTitle=n('h4','Your class plan preview'),data=n('dl',undefined,'v1780-plan-data');
 result.append(resultTitle,data,n('p','Not booked. A real human teacher, confirmed class record and an approved meeting link are required before joining or sending invitations.','v1780-fine'));
 const disclaimer=n('p','Online classroom scheduling is prepared, but a booking is never confirmed from this preview. Calendar exports are optional personal holds, not invitations from an instructor.','v1780-fine');
 form.append(grid,zone,controls,status,result,disclaimer);scheduler.append(form);studio.append(preview,scheduler);c.append(top,benefits,studio);s.append(c);teachers.after(s);
 let last=null;
 function reset(){last=null;calendar.disabled=true;result.hidden=true;status.textContent='Your choices changed. Preview again to review the updated plan.';}
 [focus,provider,when,duration].forEach(x=>x.addEventListener('change',reset));
 form.addEventListener('submit',e=>{e.preventDefault();if(!when.value){status.textContent='Choose a date and time first.';when.focus();return;}const dt=new Date(when.value);if(Number.isNaN(dt.getTime())||dt.getTime()<=Date.now()+60000){status.textContent='Choose a future date and time, at least two minutes from now.';when.focus();return;}const minutes=Number(duration.value),end=new Date(dt.getTime()+minutes*60000);last={start:dt,end,focus:focus.selectedOptions[0].textContent,provider:provider.selectedOptions[0].textContent,tz};
 data.replaceChildren();[['Focus',last.focus],['Preferred provider',last.provider],['Local date and start',dt.toLocaleString(undefined,{dateStyle:'full',timeStyle:'short'})],['Duration',minutes+' minutes'],['Timezone',tz],['Booking state','Planning preview—teacher and room not assigned']].forEach(([label,value])=>{data.append(n('dt',label),n('dd',value))});result.hidden=false;calendar.disabled=false;status.textContent='Class plan prepared on this device. No booking was created and no provider was contacted.';});
 calendar.addEventListener('click',()=>{if(!last)return;const escape=v=>String(v).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');const fmt=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const ics=['BEGIN:VCALENDAR','VERSION:2.0','CALSCALE:GREGORIAN','PRODID:-//EnglishLegalese//Unconfirmed Class Hold//EN','BEGIN:VEVENT','UID:el-class-hold-'+last.start.getTime()+'@englishlegalese.com','DTSTAMP:'+fmt(new Date()),'DTSTART:'+fmt(last.start),'DTEND:'+fmt(last.end),'SUMMARY:'+escape('UNCONFIRMED: EnglishLegalese class planning hold'),'DESCRIPTION:'+escape('Personal planning hold only. No teacher or video classroom is booked. Focus: '+last.focus+'. Provider preference: '+last.provider+'. Check EnglishLegalese for confirmed instructions.'),'STATUS:TENTATIVE','END:VEVENT','END:VCALENDAR'].join('\r\n');
 const url=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'})),a=n('a');a.href=url;a.download='EnglishLegalese-unconfirmed-class-hold.ics';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Downloaded your personal UNCONFIRMED calendar hold. This is not a class booking or invitation.';});
}
function enrichTeachers(){
 const s=$('#teachers');if(!s||$('#v1780-teacher-handoff',s))return;
 const wrap=n('div',undefined,'container v1780-teacher-handoff');wrap.id='v1780-teacher-handoff';
 wrap.append(n('h3','Real teaching, online and face to face by video.'),n('p','EnglishLegalese is designed for human-led Legal English classes through online video classrooms. Teachers explain context, facilitate discussion, assign practice, and review progress; students continue with independent exercises between meetings.'));
 const links=n('div',undefined,'v1780-teacher-links'),learn=n('a','Explore live online classrooms','btn teal');learn.href='#live-classes';
 const practice=n('a','Prepare for a class with speaking practice','btn light');practice.href='#conversation-rehearsal-lab';links.append(learn,practice);wrap.append(links,n('p','Classes require a confirmed instructor and a verified meeting link. Do not treat an unconfirmed planning hold as a reservation.','v1780-fine'));s.append(wrap);
}
function mount(){
 const root=$('#app');if(!root||!$('#home',root))return;
 makePathways();makeUnit2();addClassrooms();enrichTeachers();
 const teacherHandoff=$('#v1780-teacher-handoff');if(teacherHandoff)teacherHandoff.hidden=location.hash==='#employers';
 document.documentElement.dataset.englishlegaleseMaterialRelease=document.querySelector('meta[name="englishlegalese-release"]')?.content || VERSION;
 if(typeof window.englishLegaleseApplyView==='function')window.englishLegaleseApplyView();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{mount();setTimeout(mount,140);},{once:true});else{mount();setTimeout(mount,140);}
// The preserved v1.77 owner overlay refreshes state at 0/75ms; apply the latest marker afterward.
window.addEventListener('hashchange',()=>setTimeout(mount,150));
})();