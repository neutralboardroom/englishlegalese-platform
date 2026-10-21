/* EnglishLegalese v1.79.0 — human-class preparation, real third lessons, worldwide timezone help.
  Educational examples only. No network, booking, payment, identity, storage or email. */
(()=>{'use strict';
const $=(q,r=document)=>r.querySelector(q), $$=(q,r=document)=>Array.from(r.querySelectorAll(q));
const E=(tag,txt,cls)=>{const o=document.createElement(tag);if(txt!==undefined)o.textContent=txt;if(cls)o.className=cls;return o;};
const LESSONS={
2:['Must versus may','The coordinator must return the checklist before Friday. The reviewer may suggest edits. The filing date remains unconfirmed.',
[['What is required?','Returning the checklist','Suggesting edits','Filing today',0,'“Must” describes the required checklist action.'],['What is optional?','Confirming filing','Suggesting edits','Returning the checklist',1,'“May” permits edits but does not require them.'],['What remains unknown?','Who coordinates','When Friday occurs','The filing date',2,'The filing date has not been confirmed.']]],
3:['Write a truthful client update','We received the annotated letter on Tuesday. Two questions remain open. The reviewer is available on Wednesday.',
[['What has occurred?','The annotated letter was received','Every issue is closed','The letter was approved',0,'Receipt is confirmed but approval is not.'],['What remains open?','The file name','Two questions','The company address',1,'Two unresolved questions are stated.'],['Which update is best?','Everything is approved','The letter is filed','We received the letter; two questions remain for review',2,'Avoid implying completion.']]],
4:['Clarify a conditional video-meeting promise','If the client confirms by 3 p.m., I can send the agenda this evening. Otherwise, we should plan for tomorrow.',
[['What is required for tonight?','Client confirmation by 3 p.m.','The agenda was already sent','Court approval',0,'The evening delivery is conditional.'],['Without confirmation, when?','Tonight is guaranteed','Tomorrow','Never',1,'Tomorrow is the proposed fallback.'],['Best clarification?','We will receive it tonight regardless','You sent it earlier','Tonight depends on confirmation, otherwise tomorrow?',2,'Repeat the condition accurately.']]],
5:['Check a defined term in a document','A Designated Reader may request access after two working days’ notice. Designated Reader is defined in Schedule B.',
[['Where is the definition?','Schedule B','A separate invoice','A public news page',0,'The agreement locates the definition in Schedule B.'],['What notice is required?','No notice','Two working days','Thirty days',1,'Retain the written notice timing.'],['What is supported?','Everyone can enter immediately','The archive is now public','A defined reader may request access after notice',2,'Permission, identity and notice all matter.']]],
6:['Check invented certainty in an AI summary','Source: We plan to discuss the proposal next week. AI rewrite: The parties have unanimously agreed to sign next week.',
[['What was invented?','Unanimous agreement to sign','The word next week','A proposal exists',0,'A discussion is not agreement to sign.'],['Which rewrite is accurate?','The agreement is final','We plan to discuss the proposal next week','Signing has occurred',1,'Preserve the original plan.'],['Best quality check?','Trust polished wording','Send it immediately','Verify each assertion against the source',2,'Fluency cannot substitute for evidence.']]],
7:['Evaluate evidence in a seminar','An early survey suggests glossaries may help confidence. There were 12 volunteers and no long-term outcomes were measured.',
[['What is the proposed effect?','Glossaries may help confidence','Long-term gains were proved','Every learner benefits',0,'“May” reflects uncertainty.'],['Which limitation matters?','No vocabulary examples','A small sample and no long-term outcomes','A multi-year trial',1,'Sample size and outcomes limit inference.'],['What would you ask?','Why must everyone accept the conclusion?','Is the finding a guarantee?','How could long-term outcomes be tested?',2,'A good question addresses missing evidence.']]]};
const CITIES=[['Your device',null],['New York','America/New_York'],['London','Europe/London'],['Tbilisi','Asia/Tbilisi'],['Bangkok','Asia/Bangkok'],['Hanoi','Asia/Ho_Chi_Minh'],['Tokyo','Asia/Tokyo'],['Seoul','Asia/Seoul']];
function addLessons(){
 const courses=$('#courses');if(!courses||$('#v1790-third-unit'))return;
 const cards=$$('.v1580-course-card',courses);if(cards.length!==9)return;
 const box=E('div',undefined,'container'),panel=E('section',undefined,'panel v1790-lesson');panel.id='v1790-third-unit';panel.hidden=true;
 const heading=E('h3'),passage=E('blockquote'),form=E('form'),fields=E('div'),feedback=E('div','Select three answers.','v1790-feedback');feedback.setAttribute('role','status');heading.tabIndex=-1;
 const submit=E('button','Check lesson 3 answers','btn teal');submit.type='submit';const close=E('button','Close lesson 3','btn light');close.type='button';close.addEventListener('click',()=>{panel.hidden=true;form.reset();feedback.textContent='';});
 const buttons=E('div',undefined,'v1790-actions');buttons.append(submit,close);form.append(fields,buttons);
 panel.append(E('p','COURSE LESSON 3 · PRACTICAL READING AND DECISIONS','eyebrow'),heading,passage,form,feedback,E('p','Fictional learning examples only, not a legal interpretation or certified grade. Answers are private to this page.','v1790-small'));box.append(panel);courses.append(box);
 let active=null;
 function open(i){const lesson=LESSONS[i];if(!lesson)return;active=i;heading.textContent=lesson[0];passage.textContent=lesson[1];fields.replaceChildren();lesson[2].forEach((q,k)=>{const fs=E('fieldset',undefined,'v1790-question');fs.append(E('legend',(k+1)+'. '+q[0]));for(let j=1;j<4;j++){const label=E('label',undefined,'v1790-option'),radio=E('input');radio.type='radio';radio.name='v1790-q-'+k;radio.value=String(j-1);label.append(radio,document.createTextNode(q[j]));fs.append(label);}fields.append(fs);});feedback.textContent='Select three answers.';panel.hidden=false;panel.scrollIntoView({block:'start',behavior:'instant'});heading.focus({preventScroll:true});}
 form.addEventListener('change',()=>feedback.textContent='Your answers changed. Check again for updated feedback.');
 form.addEventListener('submit',e=>{e.preventDefault();if(active===null)return;const qs=LESSONS[active][2],ans=qs.map((_,i)=>$('input[name="v1790-q-'+i+'"]:checked',form));if(ans.some(x=>!x)){feedback.textContent='Choose answers to all three questions first.';return;}let correct=0;const ol=E('ol');qs.forEach((q,k)=>{const ok=Number(ans[k].value)===q[4];if(ok)correct++;ol.append(E('li',(ok?'Correct. ':'Review. ')+q[5]));});feedback.replaceChildren(E('strong',correct+' of 3 answers matched the source.'),ol);});
 cards.forEach((card,i)=>{if(!LESSONS[i])return;const b=E('button','Continue: practical lesson 3','btn light v1790-third-action');b.type='button';b.addEventListener('click',()=>open(i));card.append(b);});
}
function addClassPrep(){
 const area=$('#live-classes');if(!area||$('#v1790-class-prep'))return;const container=$('.container',area);if(!container)return;
 const details=E('details',undefined,'panel v1790-prep');details.id='v1790-class-prep';details.append(E('summary','Prepare for a human-led online video class'));
 const body=E('div',undefined,'v1790-prep-body');
 body.append(E('h3','Get more from live teacher time'),E('p','Select the questions and skills you want to discuss. Compare international times and download a personal preparation brief. This does not request, book or pay for a class.'));
 const grid=E('div',undefined,'v1790-prep-grid'),left=E('div'),right=E('div');
 left.append(E('h4','Your discussion checklist'));
 const topics=['Clarify a difficult Legal English phrase','Practise a speaking or meeting scenario','Review factual accuracy in a fictional writing example','Agree what to practise independently after class'],checks=E('div',undefined,'v1790-checks');
 topics.forEach((t,i)=>{const label=E('label',undefined,'v1790-check'),input=E('input');input.type='checkbox';input.value=String(i);label.append(input,document.createTextNode(t));checks.append(label);});
 const progress=E('p','0 of 4 topics selected','v1790-progress'),question=E('textarea');question.rows=4;question.maxLength=600;question.placeholder='Example: How do I ask a colleague to clarify an uncertain deadline politely?';
 const qlabel=E('label','My question for the teacher','v1790-label');qlabel.append(question);
 const counter=E('p','600 characters remaining','v1790-small'),action=E('div',undefined,'v1790-actions'),save=E('button','Download class preparation brief','btn teal'),reset=E('button','Clear private notes','btn light');save.type=reset.type='button';action.append(save,reset);
 const status=E('p','No information is transmitted to EnglishLegalese.','v1790-status');status.setAttribute('role','status');left.append(checks,progress,qlabel,counter,action,status);
 right.append(E('h4','International class time comparison'),E('p','Select a preferred date and time in the class planner above. This table follows current time-zone and daylight-saving rules.'));
 const table=E('table',undefined,'v1790-times'),thead=E('thead'),tr=E('tr');tr.append(E('th','Location'),E('th','Same instant'));thead.append(tr);table.append(thead);const tbody=E('tbody');table.append(tbody);right.append(table,E('p','Class times must be confirmed by an actual teacher before any meeting is booked.','v1790-small'));
 grid.append(left,right);body.append(grid);details.append(body);container.append(details);
 const dateField=$('#v1780-when',area),focus=$('#v1780-focus',area);
 function refresh(){progress.textContent=$$('input:checked',checks).length+' of 4 topics selected';counter.textContent=(600-question.value.length)+' characters remaining';}
 function renderTimes(){tbody.replaceChildren();const d=dateField?.value?new Date(dateField.value):null;if(!d||Number.isNaN(d.getTime())){const r=E('tr'),cell=E('td','Choose a valid date and time in the planner above.');cell.colSpan=2;r.append(cell);tbody.append(r);return;}CITIES.forEach(([name,zone])=>{const fmt=Intl.DateTimeFormat(undefined,{timeZone:zone||Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC',weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}),r=E('tr');r.append(E('th',name),E('td',fmt.format(d)));tbody.append(r);});}
 checks.addEventListener('change',refresh);question.addEventListener('input',refresh);dateField?.addEventListener('change',renderTimes);dateField?.addEventListener('input',renderTimes);details.addEventListener('toggle',()=>{if(details.open)renderTimes();});
 reset.addEventListener('click',()=>{question.value='';$$('input',checks).forEach(x=>x.checked=false);refresh();status.textContent='Private notes cleared.';});
 save.addEventListener('click',()=>{const chosen=$$('input:checked',checks).map(x=>topics[Number(x.value)]),parts=['EnglishLegalese — PRIVATE CLASS PREPARATION','UNCONFIRMED: not a booking or invitation','','Learning focus: '+(focus?.selectedOptions?.[0]?.textContent||'Legal English'),'Preferred device-local time: '+(dateField?.value||'not selected'),'Device timezone: '+(Intl.DateTimeFormat().resolvedOptions().timeZone||'not known'),'','Selected discussion goals:',...chosen.map((x,i)=>(i+1)+'. '+x),'','My question:',question.value||'(none)','','A real instructor and meeting link must be confirmed before class.'];const url=URL.createObjectURL(new Blob([parts.join('\r\n')],{type:'text/plain;charset=utf-8'})),a=E('a');a.href=url;a.download='EnglishLegalese-private-class-preparation.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Your personal brief was downloaded. No booking or message was sent.';});
 refresh();
}
function bindResourceMenu(){
 const menu=$('#v1790-resource-menu');
 if(!menu||menu.dataset.v1790Bound)return;
 menu.dataset.v1790Bound='1';
 menu.addEventListener('click',e=>{
  if(e.target.closest('a[href^="#"]'))menu.open=false;
 });
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&menu.open){
   e.preventDefault();menu.open=false;
   $('summary',menu)?.focus();
  }
 });
 document.addEventListener('pointerdown',e=>{
  if(menu.open&&!menu.contains(e.target))menu.open=false;
 });
 window.addEventListener('hashchange',()=>{menu.open=false;});
}
function mount(){if(!$('#app'))return;addLessons();addClassPrep();bindResourceMenu();document.documentElement.dataset.englishlegaleseMaterialRelease='1.79.0';}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
window.addEventListener('hashchange',()=>setTimeout(mount,0));
})();