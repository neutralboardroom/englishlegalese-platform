/* HF100: fictional Legal/Business English confirmation note lab.
 * Authored, source-bound, text-only, and strictly ephemeral. No actual correspondence,
 * AI assessment, browser storage, network request, microphone, or privileged action.
 */
(()=>{
 'use strict';
 const get=id=>document.getElementById(id);
 const c={lab:get('hf93-conversation-lab'),case:get('hf93-case'),title:get('hf93-case-title'),
  transfer:get('hf93-transfer'),transferAnswer:get('hf93-transfer-answer'),
  hf98:get('hf98-challenge'),hf98Model:get('hf98-model'),
  repair:get('hf99-repair'),misread:get('hf99-misunderstanding'),next:get('hf99-next-prompt'),
  hf99Sample:get('hf99-sample'),hf99SampleText:get('hf99-sample-text'),hf99Draft:get('hf99-draft'),
  hf99Choices:get('hf99-choices'),
  panel:get('hf100-note'),flawed:get('hf100-flawed'),question:get('hf100-question'),choices:get('hf100-choices'),
  feedback:get('hf100-feedback'),compose:get('hf100-compose'),task:get('hf100-task'),
  subject:get('hf100-subject'),body:get('hf100-body'),status:get('hf100-status'),
  review:get('hf100-review'),checklist:get('hf100-checklist'),
  modelButton:get('hf100-model-button'),model:get('hf100-model'),
  modelSubject:get('hf100-model-subject'),modelBody:get('hf100-model-body'),
  coaching:get('hf100-coaching'),clear:get('hf100-clear')};
 if(Object.values(c).some(x=>!x))return;
 // The exact HF99 misunderstanding and next-action models are immutable source anchors.
 const lessons=[
  {title:'Clarifying a contract deadline',
   misread:'Colleague: Excellent. So the other side has already agreed to Monday?',
   prior:'Please request written confirmation of the Monday extension before we update the agreed timetable.',
   flawed:'Subject: Monday deadline confirmed\nWe have agreed the extension to Monday. Please update the contract timetable.',
   question:'What is the main problem with this follow-up note?',
   risks:['It treats an unaccepted extension request as an agreed deadline.','It has too many specific next actions.','It incorrectly asks for a written response when no question exists.'],right:0,
   task:'Write a subject and two or three sentences that distinguish the proposed Monday extension from agreement and request confirmation before changing the timetable.',
   subject:'Proposed comment deadline extension — confirmation pending',
   body:'We have proposed extending the comment deadline from Friday to Monday, but the other side has not yet agreed. Please request written confirmation before we amend the timetable. Until confirmation, we should not treat Monday as the agreed deadline.',
   coaching:'Do not replace an agreed date with a proposed date before acceptance.'},
  {title:'Explaining confidentiality scope',
   misread:'Supplier: If the information is online, that means we can share every document freely, correct?',
   prior:'Please check the confidentiality definition and applicable exceptions in this draft before sharing the documents.',
   flawed:'Subject: All public information is free to share\nAny document already on the internet can be distributed without restriction.',
   question:'What makes this message unsafe as professional English?',
   risks:['It leaves out a greeting, which determines the legal result.','It makes a universal claim without examining the specific draft and exceptions.','It is too cautious because it uses the word public.'],right:1,
   task:'Write a cautious note requesting review of the agreement wording before documents are circulated.',
   subject:'Document sharing — check confidentiality wording first',
   body:'We should not assume that online availability permits distribution of every document. Please review the confidentiality definition and exceptions in this draft before any materials are shared. We can then confirm the permitted scope.',
   coaching:'Avoid universal legal conclusions; refer to the actual terms under review.'},
  {title:'Confirming a client instruction',
   misread:'Client: Thank you. You will email the entire detailed analysis before the meeting, then?',
   prior:'Please let me know if you would prefer a different format; otherwise, I will email the three risks and next step before our meeting.',
   flawed:'Subject: Full analysis attached soon\nWe will send every document and the complete analysis before the meeting.',
   question:'Which detail does the draft incorrectly change?',
   risks:['It puts the subject line before the body.','It fails to name a particular time zone.','It expands three risks and one proposed next step into a complete analysis.'],right:2,
   task:'Write a client note restating the agreed deliverable and timing and inviting format changes without overpromising.',
   subject:'Pre-meeting update — three risks and one proposed next step',
   body:'I will email you the three main risks and one proposed next step before our meeting. We can discuss the detailed analysis during our conversation. Please let me know if you would prefer a different format.',
   coaching:'Keep the client’s requested scope, quantity, communication channel, and timing.'},
  {title:'Checking a project deadline',
   misread:'Manager: I can announce that the final reviewed report is definitely ready on Wednesday, right?',
   prior:'Please tell stakeholders that Wednesday is the first-draft target and Friday is the provisional reviewed-report target.',
   flawed:'Subject: Final report Wednesday\nThe fully reviewed report will definitely be ready Wednesday.',
   question:'What should be corrected before this note reaches stakeholders?',
   risks:['It confuses the Wednesday first-draft target with the Friday reviewed-report target.','It includes a specific weekday, which is always unprofessional.','It omits the financial value of the project.'],right:0,
   task:'Write a short status note that separates both milestones and preserves the review condition.',
   subject:'Report milestones — draft Wednesday, review target Friday',
   body:'We are targeting Wednesday for the first draft. We aim to provide the reviewed report on Friday, subject to completion of the final review. Please communicate these as separate milestones rather than guaranteed delivery dates.',
   coaching:'Targets are not unconditional promises; first drafts and reviewed outputs differ.'},
  {title:'Clarifying meeting responsibilities',
   misread:'Colleague: If Arun runs late, Lina automatically takes over the budget update, correct?',
   prior:'Arun remains responsible for the budget update; please ask him for a revised estimate if Thursday is no longer realistic.',
   flawed:'Subject: Lina owns budget update\nArun may be late, so Lina automatically takes responsibility and will finish Thursday.',
   question:'Which assumption is not supported by the original conversation?',
   risks:['That the team may request a revised estimate.','That a potential delay automatically transfers ownership to Lina.','That the update concerns a budget.'],right:1,
   task:'Write a note that confirms responsibility and the next check-in without inventing a reassignment.',
   subject:'Budget update — ownership and revised estimate',
   body:'Arun remains responsible for the budget update unless the team agrees to reassign it. Please ask him whether Thursday is still realistic and request a revised estimate if needed. We can update the team after his response.',
   coaching:'A delayed task needs explicit ownership and an agreed update, not a silent reassignment.'},
  {title:'Reporting results without overclaiming',
   misread:'Director: Since orders are rising, we can promise investors that revenue will definitely rise, yes?',
   prior:'We can report that orders increased while making clear that future revenue remains uncertain until delivery and payment outcomes are known.',
   flawed:'Subject: Revenue guaranteed to increase\nHigher orders mean revenue will certainly rise in the next period.',
   question:'What is the primary accuracy problem in this note?',
   risks:['It mentions a recent positive indicator.','It uses a subject line about results.','It presents an encouraging order trend as guaranteed revenue.'],right:2,
   task:'Write an objective stakeholder update distinguishing observed orders from future revenue outcomes.',
   subject:'Order trend update — revenue outcome still uncertain',
   body:'Recent orders have increased, which is an encouraging indicator. We cannot conclude that recognized revenue will necessarily increase because deliveries, cancellations and payment timing still matter. Please present the trend with those qualifications.',
   coaching:'Separate actual observations from projections and avoid guarantees.'}
 ];
 const cases=new Map(lessons.map(item=>[item.title,item]));
 let key='',solved=false;
 function reset(message){
  c.subject.value='';c.body.value='';c.subject.disabled=true;c.body.disabled=true;
  c.review.disabled=true;c.modelButton.disabled=true;c.clear.disabled=true;
  c.compose.hidden=true;c.checklist.hidden=true;c.model.hidden=true;c.feedback.textContent='';
  c.choices.replaceChildren();solved=false;
  if(message)c.status.textContent=message;
 }
 function eligible(){
  if(c.case.hidden||c.transfer.hidden||c.transferAnswer.hidden||c.hf98.hidden||c.hf98Model.hidden||
    c.repair.hidden||c.next.hidden||c.hf99Sample.hidden||c.hf99Draft.disabled)return null;
  const found=/^Conversation \d+ of \d+: (.+)$/.exec(c.title.textContent.trim());
  const item=found&&cases.get(found[1]);
  if(!item||c.misread.textContent.trim()!==item.misread||
    c.hf99SampleText.textContent.trim()!==item.prior)return null;
  const chosen=[...c.hf99Choices.querySelectorAll('button')].filter(b=>b.getAttribute('aria-pressed')==='true');
  if(chosen.length!==1||!chosen[0].disabled)return null;
  return item;
 }
 function options(item){
  item.risks.forEach((s,i)=>{
   const button=document.createElement('button');button.type='button';button.className='hf100-choice';
   button.textContent=(i+1)+'. '+s;button.setAttribute('aria-pressed','false');
   button.addEventListener('click',()=>{
    const current=eligible();if(!current||current!==item||solved||key!==item.title+'\n'+item.misread)return;
    for(const b of c.choices.querySelectorAll('button'))b.setAttribute('aria-pressed',String(b===button));
    if(i===item.right){
     solved=true;for(const b of c.choices.querySelectorAll('button'))b.disabled=true;
     c.feedback.textContent='Correct: '+s+' Now try a clear professional subject and complete sentences. This is not an automated writing grade.';
     c.compose.hidden=false;c.subject.disabled=false;c.body.disabled=false;c.modelButton.disabled=false;
     c.status.textContent='The note composer is ready. You may speak your note aloud without typing or write privately in this tab.';
    }else{
     c.feedback.textContent='Not the main risk in this example. Recheck what was actually agreed and try another choice.';
     c.status.textContent='Try another interpretation; no writing or performance has been graded.';
    }
   });c.choices.append(button);
  });
 }
 function refresh(){
  const item=eligible(),current=item?item.title+'\n'+item.misread:'';
  if(current!==key){
   key=current;reset(item?'First identify the main risk in the flawed follow-up note.':'Finish the earlier clarification and reveal its next-action sample to unlock the note.');
   if(item){
    c.flawed.textContent=item.flawed.replace(/\\n/g,'\n');
    c.question.textContent=item.question;c.task.textContent=item.task;
    c.modelSubject.textContent=item.subject;c.modelBody.textContent=item.body;c.coaching.textContent=item.coaching;
    options(item);
   }else{c.flawed.textContent='';c.question.textContent='';c.task.textContent='';c.modelSubject.textContent='';c.modelBody.textContent='';c.coaching.textContent='';}
  }
  c.panel.hidden=!item;
 }
 function input(){
  if(!eligible()||!solved){key='';reset('Lesson changed; private writing was cleared.');refresh();return;}
  c.checklist.hidden=true;c.model.hidden=true;
  const count=c.subject.value.trim().length+c.body.value.trim().length;
  c.review.disabled=!count;c.clear.disabled=!count;
  c.status.textContent=count?'Your private note contains '+count+' characters. Review your English and meaning yourself; no message is sent or graded.':'Both fields are empty. Speak aloud or type; nothing is saved.';
 }
 c.subject.addEventListener('input',input);c.body.addEventListener('input',input);
 c.review.addEventListener('click',()=>{
  if(!eligible()||!solved||!(c.subject.value.trim()||c.body.value.trim()))return;
  c.checklist.hidden=false;c.status.textContent='Use the five review questions to improve your own note. Nothing has been scored.';
 });
 c.modelButton.addEventListener('click',()=>{
  if(!eligible()||!solved)return;
  c.model.hidden=false;c.status.textContent='Compare your own note with the authored model. No message was sent.';
 });
 c.clear.addEventListener('click',()=>{
  if(!eligible()||!solved)return;
  c.subject.value='';c.body.value='';c.review.disabled=true;c.clear.disabled=true;c.checklist.hidden=true;c.model.hidden=true;
  c.status.textContent='Your optional note was erased. You can practise again.';c.subject.focus();
 });
 const resetIds=new Set(['hf93-stop','hf93-restart','hf93-next','hf93-start','hf98-clear',
  'hf99-clear','hf95-turn-first','hf95-turn-back','hf95-turn-next']);
 c.lab.addEventListener('click',event=>{
  const b=event.target.closest('button');
  if(b&&resetIds.has(b.id)){key='';reset('Earlier lesson changed; no private note was kept.');c.panel.hidden=true;}
  queueMicrotask(refresh);
 },true);
 c.lab.addEventListener('change',event=>{
  if(event.target.matches('input[name="hf93-subject"]')){key='';reset('Subject changed; private note was cleared.');c.panel.hidden=true;}
  queueMicrotask(refresh);
 });
 const watcher=new MutationObserver(refresh);
 for(const el of [c.case,c.transfer,c.transferAnswer,c.hf98,c.hf98Model,c.repair,c.next,c.hf99Sample,c.hf99Draft])
  watcher.observe(el,{attributes:true,attributeFilter:['hidden','disabled']});
 for(const el of [c.title,c.misread,c.hf99SampleText,c.hf99Choices])watcher.observe(el,{childList:true,subtree:true,attributes:el===c.hf99Choices,attributeFilter:el===c.hf99Choices?['aria-pressed','disabled']:undefined});
 window.addEventListener('pagehide',()=>{key='';reset('Page left. No note was retained.');c.panel.hidden=true;});
 refresh();
})();
