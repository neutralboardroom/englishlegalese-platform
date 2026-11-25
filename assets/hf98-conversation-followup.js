/* HF98 adult-fictional follow-up speaking/writing practice; authored by the host.
 * Self-study only, NOT Human Teacher Roger or AI Teacher Roger.
 * No network, storage, microphone, AI inference, submissions or automatic grading.
 * Entire original HF93-HF97 teaching flow and STOP controls remain authoritative.
 */
(()=>{
 'use strict';
 const get=id=>document.getElementById(id);
 const c={lab:get('hf93-conversation-lab'),box:get('hf93-case'),title:get('hf93-case-title'),
  transfer:get('hf93-transfer'),transferPrompt:get('hf93-transfer-prompt'),transferAnswer:get('hf93-transfer-answer'),
  panel:get('hf98-challenge'),question:get('hf98-question'),draft:get('hf98-draft'),status:get('hf98-status'),
  reviewButton:get('hf98-self-review'),reviewGuide:get('hf98-review-guide'),reveal:get('hf98-show-model'),
  model:get('hf98-model'),modelText:get('hf98-model-text'),note:get('hf98-coaching-note'),clear:get('hf98-clear')};
 if(Object.values(c).some(node=>!node))return;
 const cases=[
  {title:'Clarifying a contract deadline',source:'New context: your colleague thinks a proposal must be approved tomorrow, but only initial feedback is due. What could you say?',
   question:'Client: We cannot review the contract draft by Friday. Could we ask the other side for an extension until Monday?',
   model:'We can ask the other side whether they would agree to extend the comment deadline until Monday, but we should not assume the extension has been granted.',
   note:'Distinguish requesting an extension from actually receiving approval.'},
  {title:'Explaining confidentiality scope',source:'New context: a supplier believes an attached schedule covers every product, but it lists only two products. What could you say?',
   question:'Colleague: What if the same information is already publicly available on our website?',
   model:'Under the wording we are reviewing, information already public is not automatically confidential, but we should still check the specific definition and exceptions.',
   note:'Refer to the particular draft, not a universal legal conclusion.'},
  {title:'Confirming a client instruction',source:'New context: a client asks for an update but does not specify the format. What could you ask?',
   question:'Client: Please send me the three main risks and one proposed next step before the meeting.',
   model:'I will email you the three main risks and one proposed next step before our meeting, and I can explain the details during our discussion.',
   note:'Confirm the number of points, format and timing without changing the instructions.'},
  {title:'Checking a project deadline',source:'New context: your team can demonstrate a prototype next week, but the finished product will take longer. What would you say?',
   question:'Manager: If the final report needs two more days, what should I tell stakeholders today?',
   model:'We expect to deliver the first draft on Wednesday and aim to provide the reviewed report on Friday, subject to the final review.',
   note:'Keep the draft-versus-final distinction and avoid guaranteeing a result.'},
  {title:'Clarifying meeting responsibilities',source:'New context: two colleagues are sharing customer and billing follow-ups. How could you confirm who owns each?',
   question:'Chair: What should we do if Arun cannot complete the budget update by Thursday?',
   model:'We should ask Arun for a revised completion estimate and tell the team promptly if the Thursday deadline needs to change.',
   note:'Identify the person responsible and a useful next action.'},
  {title:'Reporting results without overclaiming',source:'New context: customer interest in a new course is increasing, but paid enrollments are unconfirmed. What could you say?',
   question:'Director: Can we describe higher orders as encouraging without promising higher revenue?',
   model:'Yes, we can describe higher orders as an encouraging signal while explaining that revenue still depends on deliveries, cancellations and payment timing.',
   note:'Acknowledge a positive signal without turning it into a guarantee.'}
 ];
 const byTitle=new Map(cases.map(item=>[item.title,item]));
 let activeKey='',activeData=null;
 const stageReady=()=>!c.box.hidden&&!c.transfer.hidden&&!c.transferAnswer.hidden;
 function wipe(message){
  c.draft.value='';c.reviewGuide.hidden=true;c.model.hidden=true;
  c.reviewButton.disabled=true;c.clear.disabled=true;
  if(message)c.status.textContent=message;
 }
 function current(){
  if(!stageReady())return null;
  const match=c.title.textContent.trim().match(/^Conversation \d+ of \d+: (.+)$/);
  const entry=match&&byTitle.get(match[1]);
  if(!entry||c.transferPrompt.textContent.trim()!==entry.source)return null;
  return entry;
 }
 function refresh(){
  const item=current();
  const key=item?(c.title.textContent.trim()+'\n'+item.source):'';
  if(key!==activeKey){
   activeKey=key;activeData=item;
   wipe(item?'A new professional follow-up is ready. Try a complete sentence; nothing is saved.':'Complete the earlier transfer exercise to unlock the follow-up. Nothing is saved.');
  }
  c.panel.hidden=!item;
  c.draft.disabled=!item;
  c.reveal.disabled=!item;
  if(item){c.question.textContent=item.question;c.modelText.textContent=item.model;c.note.textContent=item.note;}
  else{c.question.textContent='';c.modelText.textContent='';c.note.textContent='';c.reviewButton.disabled=true;c.clear.disabled=true;}
 }
 c.draft.addEventListener('input',()=>{
  if(!current()||!activeKey){wipe('The original lesson changed. No reply was saved.');refresh();return;}
  c.reviewGuide.hidden=true;c.model.hidden=true;
  const length=c.draft.value.trim().length;
  c.reviewButton.disabled=!length;c.clear.disabled=!length;
  c.status.textContent=length?('You have written '+length+' of 550 possible characters. Review your own complete sentence; this is not a grade.'):'Draft empty. Try a full English sentence first, or reveal an example after speaking it aloud.';
 });
 c.reviewButton.addEventListener('click',()=>{
  if(!current()||c.reviewButton.disabled||!c.draft.value.trim())return;
  c.reviewGuide.hidden=false;
  c.status.textContent='Use the three self-review questions; no automated teacher or AI has evaluated your reply.';
 });
 c.reveal.addEventListener('click',()=>{
  if(!current()||c.reveal.disabled||!activeData)return;
  c.model.hidden=false;
  c.status.textContent='This is one authored example, not a score or an AI Teacher Roger response. Compare meaning and revise your own sentence.';
 });
 c.clear.addEventListener('click',()=>{wipe('Your draft was erased from the page. Nothing was saved or sent.');if(!c.draft.disabled)c.draft.focus();});
 const resetIds=new Set(['hf93-stop','hf93-restart','hf93-next','hf93-start','hf95-turn-first','hf95-turn-back','hf95-turn-next']);
 c.lab.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(button&&resetIds.has(button.id))wipe('The lesson context changed; your optional follow-up draft was cleared.');
  queueMicrotask(refresh);
 },true);
 c.lab.addEventListener('change',event=>{if(event.target.matches('input[name="hf93-subject"]'))wipe('The subject changed; your draft was cleared.');queueMicrotask(refresh);});
 const observer=new MutationObserver(refresh);
 for(const el of [c.box,c.transfer,c.transferAnswer])observer.observe(el,{attributes:true,attributeFilter:['hidden']});
 for(const el of [c.title,c.transferPrompt])observer.observe(el,{childList:true,subtree:true});
 window.addEventListener('pagehide',()=>{activeKey='';activeData=null;wipe('You left this page. No reply was saved.');});
 refresh();
})();
