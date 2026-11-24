/* HF101: accessible six-step route display for the existing fictional professional English lesson.
 * Read-only, entirely in page memory; does not grade, track input, store, send, persist or bypass lessons.
 */
(()=>{
 'use strict';
 const byId=id=>document.getElementById(id);
 const route=byId('hf101-route'),status=byId('hf101-route-status'),go=byId('hf101-route-focus');
 const lab=byId('hf93-conversation-lab'),casePanel=byId('hf93-case'),caseTitle=byId('hf93-case-title');
 const speak=byId('hf93-speak'),transfer=byId('hf93-transfer'),transferAnswer=byId('hf93-transfer-answer');
 const followup=byId('hf98-challenge'),followupModel=byId('hf98-model');
 const repair=byId('hf99-repair'),repairSample=byId('hf99-sample');
 const note=byId('hf100-note'),noteModel=byId('hf100-model');
 const steps=route&&Array.from(route.querySelectorAll('[data-hf101-stage]'));
 if(!route||!status||!go||!lab||!casePanel||!caseTitle||!speak||!transfer||!transferAnswer||
    !followup||!followupModel||!repair||!repairSample||!note||!noteModel||!steps||steps.length!==6)return;
 const labels=['Understand the conversation','Speak a complete reply','Use it in a new situation',
   'Answer another question','Correct a misunderstanding','Write a confirmation note'];
 const descriptions=[
  'Read or listen to the fictional dialogue and choose what the speaker means.',
  'Say a full professional reply aloud, then continue to a different situation.',
  'Try the new context before revealing the possible model reply.',
  'Answer the added question yourself before opening an authored example.',
  'Choose a precise correction and make the next action clear.',
  'Identify the misleading note, then compose or speak a careful follow-up.'
 ];
 let current=-1;
 const stage=()=>{
  if(casePanel.hidden)return -1;
  // Original speaking section intentionally hides once the learner moves forward.
  // Prefer the latest actually visible nested exercise; never infer progress from a hidden past section.
  if(!note.hidden)return 5;
  if(!repair.hidden)return 4;
  if(!followup.hidden)return 3;
  if(!transfer.hidden)return transferAnswer.hidden?2:3;
  if(!speak.hidden)return 1;
  return 0;
 };
 function render(){
  const value=stage();
  for(let i=0;i<steps.length;i++){
   const el=steps[i];
   el.removeAttribute('aria-current');
   el.dataset.passed=String(value>=0&&i<value);
   if(i===value)el.setAttribute('aria-current','step');
  }
  go.disabled=value<0;
  if(value<0){status.textContent='Choose Legal English or Business English, then press Start. Nothing here records or grades you.';}
  else if(value===5&&!note.hidden&&!noteModel.hidden){
   status.textContent='Stage 6 of 6 — an authored confirmation-note example is open. Compare it with your own words. This is not a grade.';
  } else {
   status.textContent='Stage '+(value+1)+' of 6 — '+labels[value]+'. '+descriptions[value]+' Earlier stages shown as opened are not proof of mastery.';
  }
  current=value;
 }
 const selectedTarget=()=>{
  if(current<0)return null;
  const ids=['#hf93-answers button:not(:disabled)','#hf93-to-transfer','#hf93-reveal',
    '#hf98-show-model','#hf99-choices button:not(:disabled)',
    '#hf100-choices button:not(:disabled)'];
  if(current===5){
   for(const selector of ['#hf100-subject:not(:disabled)','#hf100-body:not(:disabled)',
      '#hf100-model-button:not(:disabled)','#hf100-choices button:not(:disabled)']){
    const node=lab.querySelector(selector);if(node&&!node.closest('[hidden]'))return node;
   }
  }
  const node=lab.querySelector(ids[current]);
  return node&&!node.closest('[hidden]')?node:
    [caseTitle,speak,transfer,followup,repair,note][current];
 };
 go.addEventListener('click',()=>{
  render();if(current<0)return;
  const node=selectedTarget();
  if(!node||node.closest('[hidden]'))return;
  node.scrollIntoView({block:'start',behavior:'auto'});
  // DOM focus only: never trigger the exercise button or request microphone permission.
  if(!node.matches('button,input,textarea,a,[tabindex]'))node.setAttribute('tabindex','-1');
  node.focus({preventScroll:true});
 });
 const observer=new MutationObserver(render);
 for(const node of [casePanel,speak,transfer,transferAnswer,followup,followupModel,
    repair,repairSample,note,noteModel])observer.observe(node,{attributes:true,attributeFilter:['hidden']});
 observer.observe(caseTitle,{childList:true,subtree:true});
 const resets=new Set(['hf93-stop','hf93-restart','hf93-next','hf93-start']);
 lab.addEventListener('click',event=>{
  if(event.target.closest('button')&&resets.has(event.target.closest('button').id))queueMicrotask(render);
 },true);
 lab.addEventListener('change',event=>{
  if(event.target.matches('input[name="hf93-subject"]'))queueMicrotask(render);
 });
 window.addEventListener('pagehide',()=>{observer.disconnect();current=-1;go.disabled=true;status.textContent='Page left. This guide kept no record.';});
 render();
})();
