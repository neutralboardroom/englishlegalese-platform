/* HF99: source-bound, fictional adult misunderstanding repair lab.
 * Not a live teacher, AI teacher, translation, legal/investment advice, or automatic writing grade.
 * No storage, speech recording, network calls, personalization, hidden progress, or learner data collection.
 * All prior HF93-HF98 lesson stages and consent/STOP controls remain authoritative.
 */
(()=>{
 'use strict';
 const get=id=>document.getElementById(id);
 const c={lab:get('hf93-conversation-lab'),case:get('hf93-case'),title:get('hf93-case-title'),
  transfer:get('hf93-transfer'),transferAnswer:get('hf93-transfer-answer'),transferPrompt:get('hf93-transfer-prompt'),
  earlier:get('hf98-challenge'),earlierModel:get('hf98-model'),earlierQuestion:get('hf98-question'),earlierModelText:get('hf98-model-text'),
  panel:get('hf99-repair'),scenario:get('hf99-misunderstanding'),question:get('hf99-decision-question'),choices:get('hf99-choices'),
  feedback:get('hf99-feedback'),nextPrompt:get('hf99-next-prompt'),draft:get('hf99-draft'),status:get('hf99-status'),
  check:get('hf99-self-check'),checkGuide:get('hf99-check-guide'),sample:get('hf99-show-sample'),sampleBox:get('hf99-sample'),
  sampleText:get('hf99-sample-text'),coach:get('hf99-coaching'),clear:get('hf99-clear')};
 if(Object.values(c).some(x=>!x))return;
 // Fictional situations. Titles, transfer prompts and previous question/model must match HF93/HF98 exactly.
 const lessons=[
  {title:'Clarifying a contract deadline',
   source:'New context: your colleague thinks a proposal must be approved tomorrow, but only initial feedback is due. What could you say?',
   earlierQuestion:'Client: We cannot review the contract draft by Friday. Could we ask the other side for an extension until Monday?',
   earlierModel:'We can ask the other side whether they would agree to extend the comment deadline until Monday, but we should not assume the extension has been granted.',
   misunderstanding:'Colleague: Excellent. So the other side has already agreed to Monday?',
   prompt:'Which reply corrects the misunderstanding without inventing agreement?',
   choices:[
    'Yes. Monday is now the confirmed deadline.',
    'Not yet. We can request Monday, but the extension is not agreed unless the other side accepts it.',
    'We will probably hear back soon, so there is nothing further to check.'
   ],right:1,
   reasons:['That incorrectly treats a request as acceptance.','Correct. It separates the proposed extension from confirmed consent.','That leaves the deadline ambiguous and omits a concrete confirmation step.'],
   next:'Close the loop: ask a colleague to obtain and record the other side’s confirmation. Say or write one complete English sentence.',
   sample:'Please request written confirmation of the Monday extension before we update the agreed timetable.',
   coaching:'Use “proposed” before acceptance, and “confirmed” only after receiving it.'},
  {title:'Explaining confidentiality scope',
   source:'New context: a supplier believes an attached schedule covers every product, but it lists only two products. What could you say?',
   earlierQuestion:'Colleague: What if the same information is already publicly available on our website?',
   earlierModel:'Under the wording we are reviewing, information already public is not automatically confidential, but we should still check the specific definition and exceptions.',
   misunderstanding:'Supplier: If the information is online, that means we can share every document freely, correct?',
   prompt:'Which reply keeps the explanation limited to the draft being reviewed?',
   choices:[
    'Yes. Public information is always outside every confidentiality obligation.',
    'No information can ever be shared, even if it is public.',
    'Not necessarily. We should review this agreement’s definition and exceptions before deciding what may be shared.'
   ],right:2,
   reasons:['That invents a universal legal rule from a specific draft.','That is equally overbroad and ignores the particular wording.','Correct. It respects the scope of the draft and avoids giving a universal conclusion.'],
   next:'Close the loop: request a review of the relevant clause before circulating the document. Use one complete English sentence.',
   sample:'Please check the confidentiality definition and applicable exceptions in this draft before sharing the documents.',
   coaching:'Use “under this agreement” and “subject to the exceptions” to avoid sweeping claims.'},
  {title:'Confirming a client instruction',
   source:'New context: a client asks for an update but does not specify the format. What could you ask?',
   earlierQuestion:'Client: Please send me the three main risks and one proposed next step before the meeting.',
   earlierModel:'I will email you the three main risks and one proposed next step before our meeting, and I can explain the details during our discussion.',
   misunderstanding:'Client: Thank you. You will email the entire detailed analysis before the meeting, then?',
   prompt:'Which reply politely confirms the actual requested deliverable?',
   choices:[
    'I will email three main risks and one proposed next step before the meeting; we can discuss the detailed analysis together.',
    'Yes. I will email the entire analysis, all supporting documents, and every possible risk.',
    'I will send something useful when I have time.'
   ],right:0,
   reasons:['Correct. It preserves the requested number, channel, and timing.','That silently expands the client’s requested work and risks overpromising.','That is vague about the deliverable and misses the timing.'],
   next:'Close the loop: ask the client to confirm if the requested format should change. Speak or write a complete English sentence.',
   sample:'Please let me know if you would prefer a different format; otherwise, I will email the three risks and next step before our meeting.',
   coaching:'Repeat quantities and delivery timing, then invite clarification rather than inventing new instructions.'},
  {title:'Checking a project deadline',
   source:'New context: your team can demonstrate a prototype next week, but the finished product will take longer. What would you say?',
   earlierQuestion:'Manager: If the final report needs two more days, what should I tell stakeholders today?',
   earlierModel:'We expect to deliver the first draft on Wednesday and aim to provide the reviewed report on Friday, subject to the final review.',
   misunderstanding:'Manager: I can announce that the final reviewed report is definitely ready on Wednesday, right?',
   prompt:'Which answer protects the distinction between a draft and reviewed delivery?',
   choices:[
    'Yes. We can guarantee Wednesday for the final reviewed report.',
    'No one knows when any document might be ready.',
    'Wednesday is our first-draft target. We aim for a reviewed report on Friday, subject to the final review.'
   ],right:2,
   reasons:['That changes the draft date into an unsupported final commitment.','That ignores the useful schedule information already available.','Correct. It states both milestones and preserves the review condition.'],
   next:'Close the loop: ask the manager to update stakeholders using the two different milestones. Use one complete English sentence.',
   sample:'Please tell stakeholders that Wednesday is the first-draft target and Friday is the provisional reviewed-report target.',
   coaching:'“First draft,” “reviewed report,” “aim,” and “subject to review” carry different meanings.'},
  {title:'Clarifying meeting responsibilities',
   source:'New context: two colleagues are sharing customer and billing follow-ups. How could you confirm who owns each?',
   earlierQuestion:'Chair: What should we do if Arun cannot complete the budget update by Thursday?',
   earlierModel:'We should ask Arun for a revised completion estimate and tell the team promptly if the Thursday deadline needs to change.',
   misunderstanding:'Colleague: If Arun runs late, Lina automatically takes over the budget update, correct?',
   prompt:'Which response prevents an unapproved change of responsibility?',
   choices:[
    'Not automatically. Arun remains responsible unless the team reassigns the task; ask for his revised estimate first.',
    'Yes. Lina now owns both the supplier and budget tasks.',
    'Responsibility is not important as long as someone finishes.'
   ],right:0,
   reasons:['Correct. It keeps task ownership separate from a potential change in deadline.','That invents a reassignment not made in the meeting.','That loses accountability and prevents useful follow-up.'],
   next:'Close the loop: confirm the task owner and ask for a revised delivery estimate if needed. Use one complete sentence.',
   sample:'Arun remains responsible for the budget update; please ask him for a revised estimate if Thursday is no longer realistic.',
   coaching:'A missed deadline does not, by itself, reassign responsibility.'},
  {title:'Reporting results without overclaiming',
   source:'New context: customer interest in a new course is increasing, but paid enrollments are unconfirmed. What could you say?',
   earlierQuestion:'Director: Can we describe higher orders as encouraging without promising higher revenue?',
   earlierModel:'Yes, we can describe higher orders as an encouraging signal while explaining that revenue still depends on deliveries, cancellations and payment timing.',
   misunderstanding:'Director: Since orders are rising, we can promise investors that revenue will definitely rise, yes?',
   prompt:'Which answer avoids turning an encouraging signal into a guarantee?',
   choices:[
    'Yes. Higher orders always produce higher recognized revenue.',
    'No. The order increase is encouraging, but actual revenue still depends on deliveries, cancellations and payment timing.',
    'We should not mention orders at all, because no information is useful.'
   ],right:1,
   reasons:['That makes a guarantee unsupported by the available facts.','Correct. It separates a leading indicator from a confirmed outcome.','That discards a useful observation rather than reporting it accurately.'],
   next:'Close the loop: suggest a careful stakeholder statement that explains the limits of the figures. Use one complete English sentence.',
   sample:'We can report that orders increased while making clear that future revenue remains uncertain until delivery and payment outcomes are known.',
   coaching:'Say “encouraging” or “suggests,” not “guarantees,” unless the evidence truly supports it.'}
 ];
 const byTitle=new Map(lessons.map(item=>[item.title,item]));
 let context='',selected=false;
 const erase=message=>{
  c.draft.value='';c.draft.disabled=true;c.check.disabled=true;c.clear.disabled=true;c.sample.disabled=true;
  c.checkGuide.hidden=true;c.sampleBox.hidden=true;c.feedback.textContent='';c.choices.replaceChildren();
  c.nextPrompt.hidden=true;c.draft.setAttribute('aria-describedby','hf99-status');selected=false;
  if(message)c.status.textContent=message;
 };
 function eligible(){
  if(c.case.hidden||c.transfer.hidden||c.transferAnswer.hidden||c.earlier.hidden||c.earlierModel.hidden)return null;
  const m=c.title.textContent.trim().match(/^Conversation \d+ of \d+: (.+)$/);
  const item=m&&byTitle.get(m[1]);
  if(!item||c.transferPrompt.textContent.trim()!==item.source||
     c.earlierQuestion.textContent.trim()!==item.earlierQuestion||
     c.earlierModelText.textContent.trim()!==item.earlierModel)return null;
  return item;
 }
 function renderOptions(item){
  item.choices.forEach((answer,index)=>{
   const button=document.createElement('button');button.type='button';button.className='hf99-option';
   button.textContent=(index+1)+'. '+answer;button.setAttribute('aria-pressed','false');
   button.addEventListener('click',()=>{
    if(!eligible()||context!==item.title+'\n'+item.source||selected)return;
    c.choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    c.feedback.textContent=item.reasons[index];
    if(index===item.right){
     selected=true;c.choices.querySelectorAll('button').forEach(b=>{b.disabled=true;});
     c.nextPrompt.hidden=false;c.draft.disabled=false;c.sample.disabled=false;
     c.status.textContent='Suitable correction selected. Now make the next action explicit in your own sentence. You can speak without typing; this is not an AI grade.';
    }else{
     c.status.textContent='Read the original wording and try another correction. This checks only your selected example, not your speaking or writing.';
    }
   });
   c.choices.append(button);
  });
 }
 function refresh(){
  const item=eligible(),key=item?item.title+'\n'+item.source:'';
  if(key!==context){
   context=key;erase(item?'A new misunderstanding is ready. Choose the most accurate, polite correction.':'Finish the earlier follow-up and reveal its model to unlock the repair exercise.');
   if(item){
    c.scenario.textContent=item.misunderstanding;c.question.textContent=item.prompt;
    c.nextPrompt.textContent=item.next;c.sampleText.textContent=item.sample;c.coach.textContent=item.coaching;
    renderOptions(item);
   }else{c.scenario.textContent='';c.question.textContent='';c.sampleText.textContent='';c.coach.textContent='';}
  }
  c.panel.hidden=!item;
 }
 c.draft.addEventListener('input',()=>{
  if(!eligible()||!selected){erase('Lesson context changed; any optional writing was cleared.');refresh();return;}
  c.checkGuide.hidden=true;c.sampleBox.hidden=true;
  const count=c.draft.value.trim().length;
  c.check.disabled=!count;c.clear.disabled=!count;
  c.status.textContent=count?('Your private draft has '+count+' characters (limit 500). Review your sentence yourself; there is no automated grade.'):'Draft empty. Speak a sentence aloud or type one. No response is saved.';
 });
 c.check.addEventListener('click',()=>{
  if(!eligible()||!selected||!c.draft.value.trim())return;
  c.checkGuide.hidden=false;c.status.textContent='Check your own meaning, responsibility and next action. This is not an AI evaluation.';
 });
 c.sample.addEventListener('click',()=>{
  if(!eligible()||!selected)return;
  c.sampleBox.hidden=false;c.status.textContent='Compare your spoken or written answer with one authored example. Revise your own sentence if useful; nothing is saved.';
 });
 c.clear.addEventListener('click',()=>{
  if(!eligible()||!selected)return;
  c.draft.value='';c.clear.disabled=true;c.check.disabled=true;c.checkGuide.hidden=true;c.sampleBox.hidden=true;
  c.status.textContent='Your optional writing was erased. You can try again; nothing was sent.';
  c.draft.focus();
 });
 const resetIds=new Set(['hf93-stop','hf93-restart','hf93-next','hf93-start','hf98-clear',
  'hf95-turn-first','hf95-turn-back','hf95-turn-next']);
 c.lab.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(button&&resetIds.has(button.id)){context='';erase('Earlier learning context changed. This exercise and private draft were cleared.');c.panel.hidden=true;}
  queueMicrotask(refresh);
 },true);
 c.lab.addEventListener('change',event=>{
  if(event.target.matches('input[name="hf93-subject"]')){context='';erase('Subject changed. This practice was cleared.');c.panel.hidden=true;}
  queueMicrotask(refresh);
 });
 const watcher=new MutationObserver(refresh);
 for(const element of [c.case,c.transfer,c.transferAnswer,c.earlier,c.earlierModel])watcher.observe(element,{attributes:true,attributeFilter:['hidden']});
 for(const element of [c.title,c.transferPrompt,c.earlierQuestion,c.earlierModelText])watcher.observe(element,{childList:true,subtree:true});
 window.addEventListener('pagehide',()=>{context='';erase('Page left. No draft or answer was kept.');c.panel.hidden=true;});
 refresh();
})();
