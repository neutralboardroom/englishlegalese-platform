/* HF97 ephemeral written paraphrase of fictional adult Legal/Business English.
 * Learner controls the draft and self-assessment. No network, saved answers,
 * cookies, storage, recording, AI, hidden grade, or automatic feedback claims.
 * Do not touch original HF93-HF96 teaching engines or controls.
 */
(()=>{
 'use strict';
 const byId=id=>document.getElementById(id);
 const lab=byId('hf93-conversation-lab'),caseBox=byId('hf93-case'),heading=byId('hf93-case-title');
 const turn=byId('hf95-turn-text'),draft=byId('hf97-draft'),review=byId('hf97-review');
 const clearButton=byId('hf97-clear'),guide=byId('hf97-review-guide'),status=byId('hf97-draft-status');
 if([lab,caseBox,heading,turn,draft,review,clearButton,guide,status].some(x=>!x))return;
 let activeKey='',activeCase='';
 const visibleTurn=()=>!caseBox.hidden&&!turn.hidden&&!!turn.textContent.trim();
 function erase(message){
  draft.value='';guide.hidden=true;review.disabled=true;clearButton.disabled=true;
  if(message)status.textContent=message;
 }
 function refresh(){
  const key=visibleTurn()?turn.textContent.trim():'';
  const title=!caseBox.hidden?heading.textContent.trim():'';
  if(key!==activeKey||title!==activeCase){
   activeKey=key;activeCase=title;
   erase(key?'New speaker turn selected. Write your own complete sentence; nothing is saved.':'Choose a speaker turn to begin writing. No draft is stored.');
  }
  draft.disabled=!key;
 }
 draft.addEventListener('input',()=>{
  if(!visibleTurn()||turn.textContent.trim()!==activeKey||heading.textContent.trim()!==activeCase){erase('The speaker turn changed. No draft was saved.');refresh();return;}
  guide.hidden=true;
  const count=draft.value.trim().length;
  review.disabled=!count;clearButton.disabled=!count;
  status.textContent=count?('Draft contains '+count+' of 600 possible characters. This is not a grade; review is your choice.'):'No draft yet. Write a full sentence before self-review.';
 });
 review.addEventListener('click',()=>{
  if(review.disabled||!visibleTurn()||turn.textContent.trim()!==activeKey||heading.textContent.trim()!==activeCase||!draft.value.trim())return;
  guide.hidden=false;
  status.textContent='Self-review questions are shown. Revise your own sentence, then compare with the authored sample above.';
 });
 clearButton.addEventListener('click',()=>{
  erase('Your sentence was cleared from this page. Nothing was saved.');
  if(!draft.disabled)draft.focus();
 });
 const resetIds=new Set(['hf93-stop','hf93-restart','hf93-start','hf93-next']);
 lab.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(button&&resetIds.has(button.id))erase('The session changed; your private draft was cleared.');
  queueMicrotask(refresh);
 },true);
 lab.addEventListener('change',event=>{
  if(event.target.matches('input[name="hf93-subject"]'))erase('The subject changed; your private draft was cleared.');
  queueMicrotask(refresh);
 });
 const observer=new MutationObserver(refresh);
 observer.observe(turn,{attributes:true,attributeFilter:['hidden'],childList:true,subtree:true});
 observer.observe(heading,{childList:true,subtree:true});
 observer.observe(caseBox,{attributes:true,attributeFilter:['hidden']});
 window.addEventListener('pagehide',()=>{activeKey='';activeCase='';erase('You left the page; no draft was saved.');});
 refresh();
})();
