/* HF96: original sentence-meaning paraphrase for the twelve existing fictional
 * adult Legal/Business English speaker turns. No input, no data storage, no
 * recording, no scoring, no remote requests, no legal or investment advice.
 * The authored example is optional and appears only after an explicit click.
 */
(()=>{
 'use strict';
 const find=id=>document.getElementById(id);
 const lab=find('hf93-conversation-lab'),caseBox=find('hf93-case'),title=find('hf93-case-title');
 const turnText=find('hf95-turn-text'),panel=find('hf96-meaning'),reveal=find('hf96-meaning-reveal');
 const sample=find('hf96-meaning-example'),status=find('hf96-meaning-status');
 if([lab,caseBox,title,turnText,panel,reveal,sample,status].some(node=>!node))return;
 // Exact visible speaker-turn keys; failing closed avoids a misleading
 // explanation if the underlying conversation changes in a future build.
 const EXEMPLARS=new Map([
  ['Client: Do we have to sign this agreement today?','The client wants to know whether they must sign the agreement today.'],
  ['Lawyer: Not today. The draft asks for comments by Friday; signing would happen after both sides agree to the terms.','The lawyer explains that comments on the draft are due Friday, but signing would take place later if both sides agree.'],
  ['Colleague: Does this agreement cover every conversation we have?','The colleague asks whether the draft makes every conversation confidential.'],
  ['Reviewer: The draft covers specified confidential project information. Ordinary public information is not automatically confidential under that wording.','The reviewer explains that the draft focuses on specified project information and does not automatically cover ordinary public information.'],
  ['Client: Please prepare a summary of the main risks before our meeting.','The client wants a summary of the most important risks before the meeting.'],
  ['Team member: Of course. Would you like a brief summary by email, with the detailed analysis available at the meeting?','The team member is checking whether the client wants a short email before the meeting and detailed analysis during it.'],
  ['Manager: Can the team finish the complete report by Wednesday?','The manager asks whether the team can complete the entire report by Wednesday.'],
  ['Analyst: We can deliver the first draft on Wednesday, but the final report needs another two days for review.','The analyst can deliver a draft by Wednesday, but the reviewed final report will take two more days.'],
  ['Chair: Lina will contact the supplier, and Arun will update the budget by Thursday.','The chair assigns the supplier follow-up to Lina and the budget update to Arun, with Thursday as the budget deadline.'],
  ['Colleague: Just to confirm, Lina owns the supplier follow-up, while Arun owns the budget update?','The colleague repeats who is responsible for each task to check that the assignments are understood correctly.'],
  ['Director: Does the increase in orders mean revenue will definitely rise next quarter?','The director asks whether higher order numbers guarantee increased revenue next quarter.'],
  ['Analyst: Higher orders are encouraging, but future revenue also depends on deliveries, cancellations, and payment timing.','The analyst says higher orders are promising, but revenue is not guaranteed because deliveries, cancellations, and payment dates also matter.']
 ]);
 let activeKey='',activeTitle='';
 function reset(){sample.hidden=true;sample.textContent='';reveal.disabled=true;}
 function refresh(){
  const key=(!caseBox.hidden&&!turnText.hidden)?turnText.textContent.trim():'';
  const heading=(!caseBox.hidden)?title.textContent.trim():'';
  if(key===activeKey&&heading===activeTitle)return;
  activeKey=key;activeTitle=heading;reset();
  if(!key){status.textContent='Focus on a speaker turn to practise explaining its meaning.';return;}
  if(!EXEMPLARS.has(key)){
   status.textContent='The meaning guide is not available for this turn. Read the exchange and explain it yourself.';
   return;
  }
  reveal.disabled=false;
  status.textContent='Say what this speaker means in your own complete English sentence, then choose Show sample meaning to compare.';
 }
 reveal.addEventListener('click',()=>{
  if(reveal.disabled||!activeKey||!EXEMPLARS.has(activeKey)||caseBox.hidden||turnText.hidden||activeTitle!==title.textContent.trim()||turnText.textContent.trim()!==activeKey)return;
  sample.textContent='One possible meaning: '+EXEMPLARS.get(activeKey);
  sample.hidden=false;
  reveal.disabled=true;
  status.textContent='Compare the sample with your own full-sentence explanation. This is not a speech or writing grade.';
 });
 const observer=new MutationObserver(refresh);
 observer.observe(turnText,{attributes:true,attributeFilter:['hidden'],childList:true,subtree:true});
 observer.observe(caseBox,{attributes:true,attributeFilter:['hidden']});
 observer.observe(title,{childList:true});
 // STOP/restart/new-case resets do not retain any personal answer or score.
 window.addEventListener('pagehide',()=>{activeKey='';activeTitle='';reset();status.textContent='This practice has ended; no answers were saved.';});
 refresh();
})();
