/* HF37 — Free, private, original scenario-specific speaking rehearsal.
   Nothing here records, recognizes, scores, stores or transmits speech or draft text. */
(()=>{'use strict';
const practices=[
['Client intake: verified facts','Your client says delivery was late. What can you confirm today?','The client reports a delay, but we have not yet checked the signed delivery schedule.','What document will you request first?','The client reports a delay | but we have not yet checked the schedule.','reported /rɪ-PORT-id/ · verified /VAIR-uh-fyd/'],
['Contract notices and deadlines','An overseas client asks: Can we send a notice next week?','We need to confirm the triggering date, the agreed notice address and the delivery method before confirming the deadline.','What happens if the address is incorrect?','Before confirming the deadline | we need to check the notice requirements.','notice /NOH-tis/ · deadline /DED-lyn/'],
['Redlining: modal verbs and cost scope','A commercial client wants to replace must with may. What changes?','Must creates a requirement, while may generally gives discretion. We should confirm the intended obligation.','How would you request a precise revision?','Must creates a requirement | while may generally gives discretion.','obligation /ob-li-GAY-shun/ · discretion /di-SKRESH-un/'],
['Witness interviews: open questions','A colleague asks how you would question a witness neutrally.','I would start with an open question about what the witness saw, then confirm the time and sequence.','How would you avoid suggesting the answer?','First | tell me what happened. Then | we can confirm the timeline.','witness /WIT-nis/ · sequence /SEE-kwens/'],
['Negotiation: conditions and tentative terms','An American counterparty asks if you can agree today.','We can discuss the commercial proposal today, subject to reviewing the final wording and obtaining approval.','How would you propose the next step?','We can discuss the proposal today | subject to final review.','tentative /TEN-tuh-tiv/ · approval /uh-PROO-vul/'],
['Cross-border drafting: clarify meaning','An international client says a clause is unclear. What do you ask?','Could you clarify whether the deadline refers to calendar days or business days? That distinction affects the timeline.','How would you confirm the agreed interpretation?','Could you clarify | whether you mean calendar days | or business days?','clarify /KLAIR-uh-fy/ · interpretation /in-tur-pri-TAY-shun/'],
['Quarterly reporting: balanced trends','An investor asks whether one strong quarter proves growth.','The quarter improved compared with the previous period, but we should confirm whether the trend is sustainable.','Which assumption would you qualify?','The results improved this quarter | but we should confirm the wider trend.','quarterly /KWOR-tur-lee/ · sustainable /suh-STAY-nuh-bul/'],
['Project handovers: clear ownership','A colleague asks who is responsible for an unfinished deliverable.','The operations team owns the next draft, and I will review it after the updated figures are provided.','When should both teams meet again?','The operations team owns the next draft | and I will review it.','handover /HAND-oh-vur/ · responsible /ri-SPON-suh-bul/'],
['Supplier negotiation: constructive trade-offs','A supplier requests a higher price for a shorter deadline.','We could consider the revised price if the supplier confirms the earlier delivery date and quality requirements.','What evidence would you request?','We could consider the revised price | if delivery is confirmed.','supplier /suh-PLY-ur/ · delivery /di-LIV-uh-ree/'],
['Investor relations: guidance and assumptions','An investor asks whether projected revenue is guaranteed.','The forecast is based on stated assumptions, so the outcome could differ if market conditions change.','How would you explain the largest uncertainty?','The forecast reflects assumptions | not a guaranteed outcome.','forecast /FOR-kast/ · assumptions /uh-SUMP-shuns/'],
['Performance reviews: observable feedback','A manager asks you to give constructive feedback.','The last report was clear and timely. The next improvement would be to identify the remaining risks sooner.','What practical action would you propose?','The report was clear and timely | and one improvement would be earlier risk updates.','observable /ub-ZUR-vuh-bul/ · feedback /FEED-bak/'],
['Board presentations: uncertainty and mitigation','A board member asks whether the project is on schedule.','The current milestones remain achievable, but one approval is pending and the team has a mitigation plan.','What would make you escalate the risk?','The milestones remain achievable | although one approval is pending.','milestone /MYL-stohn/ · mitigation /mit-uh-GAY-shun/'],
['Research summary: sources versus conclusions','A client asks if two cases settle the legal issue.','The cases may be relevant, but we still need to verify their status and applicability to the jurisdiction.','What should happen before final advice?','The cases may be relevant | but their applicability still needs checking.','jurisdiction /joor-is-DIK-shun/ · relevant /REL-uh-vunt/'],
['Disclosure request: precise scope and privacy','A foreign client asks you to send every company email.','We should narrow the request to the relevant period and subject and review any confidentiality or privilege concerns.','What period and team would you specify?','We should narrow the request | and review confidentiality concerns.','disclosure /dis-KLOH-zhur/ · privilege /PRIV-uh-lij/'],
['Mediation statement: interests without admissions','A mediator asks what your company wants to achieve.','Our priority is a workable commercial resolution. We can discuss solutions without making admissions about liability.','How would you respond to a proposed compromise?','Our priority is a practical resolution | without an admission of liability.','mediation /mee-dee-AY-shun/ · liability /ly-uh-BIL-uh-tee/'],
['Matter management: deadline and dependency updates','A colleague asks if the filing is ready.','The draft is ready for legal review, but submission depends on receiving the final supporting document.','What is the next checkpoint?','The draft is ready | but submission depends on one document.','dependency /di-PEN-dun-see/ · submission /sub-MISH-un/'],
['Regulatory update: distinguish proposal from rule','A client asks whether a proposed regulation is already binding.','The proposal has been published, but we should not treat it as binding until its final status and effective date are verified.','Where would you check for a final update?','The proposal is published | but we must verify whether it is in force.','regulatory /REG-yuh-luh-tor-ee/ · effective /i-FEK-tiv/'],
['Client update: options, risks and decision owner','An American client asks which option to choose.','Option A is faster but carries greater implementation risk. Option B takes longer and needs management approval.','Who must make the final decision?','Option A is faster | but carries greater risk.','implementation /im-pluh-men-TAY-shun/ · decision /di-SIZH-un/'],
['Investor briefing: cash flow and uncertainty','An investor asks when project cash flow will start.','The expected timing depends on commissioning and collection assumptions. We will update the schedule when those conditions are confirmed.','Which assumption needs checking first?','The timing depends on commissioning | and payment collection.','commissioning /kuh-MISH-uh-ning/ · revenue /REV-uh-nyoo/'],
['Incident communications: facts before blame','A customer asks who caused an outage before the investigation ends.','We are confirming the timeline and available evidence. It would be premature to attribute responsibility before the review is complete.','What safe next update can you promise?','We are confirming the facts | before assigning responsibility.','incident /IN-suh-dunt/ · responsibility /ri-spon-suh-BIL-uh-tee/'],
['Service negotiations: measurable promises','A buyer wants a guarantee of excellent service.','We should define measurable response times, service levels and an agreed remedy instead of relying on a vague promise.','How would you describe the remedy?','We should agree measurable service levels | and a clear remedy.','measurable /MEZH-ur-uh-bul/ · remedy /REM-uh-dee/'],
['Feedback after a project: evidence and improvement','Your team asks what worked and what should change.','The handover was timely, but the approval process caused delays. Next time, we should assign decision owners earlier.','How would you measure improvement?','The handover was timely | but approvals caused delays.','improvement /im-PROOV-munt/ · approval /uh-PROO-vul/'],
['Executive decision memo: compare trade-offs','An executive wants a one-sentence recommendation.','I recommend the phased option because it reduces initial exposure while preserving a later expansion decision.','What is the principal drawback?','I recommend the phased option | because it reduces initial exposure.','executive /ig-ZEK-yuh-tiv/ · exposure /ik-SPOH-zhur/'],
['Cross-cultural meetings: confirm decisions clearly','A client meeting ends without an explicit agreement. What do you say?','Before we finish, could we confirm the decisions, responsible owners and deadlines to avoid misunderstandings?','How would you invite a correction politely?','Before we finish | could we confirm the decisions and next steps?','confirm /kun-FURM/ · misunderstandings /mis-un-dur-STAN-dingz/']
];
const byTitle=new Map(practices.map(row=>[row[0],row]));
const h=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e};
let active=null;
function stop(task,finished=false){
 if(!task)return;
 window.clearInterval(task.interval);
 if(active===task)active=null;
 task.start.disabled=false;task.pause.disabled=true;
 if(finished){task.time.textContent='0:00';task.notice.textContent='Speaking turn complete. Try again without reading the model.';}
 else{task.notice.textContent='Speaking timer paused. You may continue at your own pace.';}
}
function build(lesson,row){
 const panel=h('details',undefined,'v1990-speaking');
 panel.dataset.v1990Speaking=row[0];
 panel.append(h('summary','Speaking rehearsal · three guided turns (about 4 minutes)'));
 const inner=h('div',undefined,'v1990-inner');
 inner.append(h('p','Use only invented examples. Speak aloud to yourself or to a class partner. No microphone access, recording, speech recognition, grading, storage or submission occurs here.','v1990-privacy'));
 const tasks=[
  ['1. Listen to the client question (read it yourself or ask a partner)',row[1]],
  ['2. Answer in full sentences without reading a script','Explain your response in your own words. Pause after each important idea.'],
  ['3. Handle one follow-up question',row[3]]
 ];
 for(const [heading,prompt]of tasks){const s=h('section',undefined,'v1990-turn');s.append(h('h4',heading),h('p',prompt));inner.append(s);}
 const hint=h('details',undefined,'v1990-hint');
 hint.append(h('summary','Show a possible professional answer (after speaking)'),h('p',row[2]));
 inner.append(hint);
 inner.append(h('p','Chunking practice: '+row[4]+' (pause briefly at each vertical line).','v1990-chunk'));
 inner.append(h('p','Pronunciation guide (approximate English sound cues, not a scored assessment): '+row[5],'v1990-pronounce'));
 const timer=h('div',undefined,'v1990-timer');
 const start=h('button','Start a 45-second speaking turn');start.type='button';
 const pause=h('button','Pause timer');pause.type='button';pause.disabled=true;
 const time=h('output','0:45','v1990-time');time.setAttribute('role','timer');time.setAttribute('aria-live','off');time.setAttribute('aria-label','Speaking turn remaining');
 const notice=h('p','Optional timer only. You can practice without it.','v1990-notice');notice.setAttribute('role','status');
 timer.append(start,pause,time);inner.append(timer,notice);
 let task=null;
 start.addEventListener('click',()=>{
  if(active)stop(active);
  let remaining=45,deadline=Date.now()+45000;
  start.disabled=true;pause.disabled=false;time.textContent='0:45';
  notice.textContent='Speak at a comfortable pace. Focus on clarity, not speed.';
  task={start,pause,time,notice,interval:null};active=task;
  task.interval=window.setInterval(()=>{
   remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));
   time.textContent='0:'+String(remaining).padStart(2,'0');
   if(remaining===0)stop(task,true);
  },250);
 });
 pause.addEventListener('click',()=>stop(task));
 panel.addEventListener('toggle',()=>{if(!panel.open&&active===task)stop(task)});
 panel.append(inner);
 const check=lesson.querySelector('fieldset[data-v1980-check]');
 if(check)check.before(panel);else lesson.append(panel);
}
const lessons=[...document.querySelectorAll('article.v1971-lesson')];
for(const lesson of lessons){
 const title=lesson.querySelector('h3')?.textContent?.trim();
 if(byTitle.has(title))build(lesson,byTitle.get(title));
}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&active)stop(active)});
})();
