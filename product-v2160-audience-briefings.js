'use strict';
/* HF55: original, fictional adult Legal/Business English audience-adaptation exercises.
   Static practice only: no storage, capture, AI scoring, network or cross-project identity. */
(()=>{
 const protocol=window.EnglishLegaleseTeacherProtocolV1;
 if(!protocol||protocol.project!=='EnglishLegalese'||
    protocol.protocol!=='tr-clone/teacher-response-ladder/v1'||
    protocol.runtimeConnected||protocol.aiInference)return;
 const briefings=[
  {title:'Client intake: verified facts',
   external:'We have recorded your delivery concern, but the signed timetable has not yet been verified.',
   internal:'Attribute the delay to the client report; do not describe a contractual breach without the signed schedule.',
   action:'Request the signed schedule and delivery record before reaching a contractual conclusion.'},
  {title:'Contract notices and deadlines',
   external:'We are checking the agreed notice method and triggering date before confirming any deadline.',
   internal:'Separate the draft notice requirement from the unverified event date and delivery instructions.',
   action:'Confirm the signed clause, notice address, triggering date and applicable business-day definition.'},
  {title:'Redlining: modal verbs and cost scope',
   external:'The proposed wording changes both the obligation and the scope of reimbursable costs.',
   internal:'Compare shall versus may and all costs versus reasonable costs before reporting the effect.',
   action:'Review both full clauses and obtain instructions about the intended commercial allocation.'},
  {title:'Witness interviews: open questions',
   external:'We want to understand what you personally remember without assuming which document was signed.',
   internal:'Record recollection separately from later notes and avoid leading the witness.',
   action:'Ask open follow-up questions and mark uncertain details as unverified.'},
  {title:'Negotiation: conditions and tentative terms',
   external:'The terms remain under discussion and any proposal is subject to the required approvals.',
   internal:'Do not treat negotiation correspondence as acceptance of a final settlement.',
   action:'Identify outstanding terms and the individuals authorized to approve them.'},
  {title:'Cross-border drafting: clarify meaning',
   external:'Could we confirm the intended meaning of this term in the contract and governing-law context?',
   internal:'Flag terminology with different possible jurisdictional meanings; avoid universal definitions.',
   action:'Check the governing-law provision and the parties intended obligation.'},
  {title:'Quarterly reporting: balanced trends',
   external:'Revenue increased while margin declined, and we are still reviewing the reasons.',
   internal:'Report both metrics without inventing a causal explanation for the margin movement.',
   action:'Review the cost, mix and period-comparison data before attributing the trend.'},
  {title:'Project handovers: clear ownership',
   external:'The next schedule depends on receiving the remaining approved specifications.',
   internal:'Record the handover owner and the outstanding dependency separately from completed work.',
   action:'Confirm who supplies the specifications and when operations can validate them.'},
  {title:'Supplier negotiation: constructive trade-offs',
   external:'A lower price may be possible if the agreed volume and delivery conditions are met.',
   internal:'Do not communicate a conditional supplier concession as a universal price reduction.',
   action:'Confirm minimum volume, delivery requirements and documented supplier approval.'},
  {title:'Investor relations: guidance and assumptions',
   external:'The forecast reflects assumptions about future demand, not a guaranteed investment return.',
   internal:'Label projections as conditional and keep historical figures separate from forward estimates.',
   action:'Confirm the material assumptions and communicate the possibility of different results.'},
  {title:'Performance reviews: observable feedback',
   external:'Several weekly reports missed their deadlines; I would like to understand what affected delivery.',
   internal:'Focus on observed dates rather than guessing an employee motive or willingness.',
   action:'Discuss workload factors and agree on an observable, supported improvement step.'},
  {title:'Board presentations: uncertainty and mitigation',
   external:'A possible supplier interruption could affect launch timing, but its impact is not yet confirmed.',
   internal:'Separate the identified supplier risk from an unsupported prediction of inevitable delay.',
   action:'Verify contingency lead times, available suppliers and decision deadlines.'},
  {title:'Research summary: sources versus conclusions',
   external:'We located a potentially relevant decision, but must verify its jurisdiction and current status.',
   internal:'Do not describe a cited appellate decision as universally controlling authority.',
   action:'Check court, jurisdiction, later treatment and applicability to the fictional question.'},
  {title:'Disclosure request: precise scope and privacy',
   external:'We are reviewing which project records fall within the request, subject to appropriate safeguards.',
   internal:'Do not presume that all personal messages are disclosable or that privilege is resolved.',
   action:'Confirm relevant document scope, preservation duties and a qualified privacy or privilege review.'},
  {title:'Mediation statement: interests without admissions',
   external:'We can explore a practical timetable without treating this discussion as an admission of liability.',
   internal:'Present negotiation options neutrally and distinguish the proposal from any admission.',
   action:'Confirm the discussion purpose and seek approval before communicating terms.'},
  {title:'Matter management: deadline and dependency updates',
   external:'The proposed filing timetable depends on obtaining and reviewing the remaining documents.',
   internal:'Track missing documents separately from work that is ready for filing.',
   action:'Verify document owners and receipt dates before promising a submission date.'},
  {title:'Regulatory update: distinguish proposal from rule',
   external:'The authority has published a proposal; we are verifying whether a final rule has taken effect.',
   internal:'Mark the text as proposed until adoption and commencement have been confirmed.',
   action:'Check the official final text, effective date, jurisdiction and transitional provisions.'},
  {title:'Client update: options, risks and decision owner',
   external:'There are alternatives with different timing and risk implications; the authorized decision remains yours.',
   internal:'Clarify available options without silently assuming authority to decide for the client.',
   action:'Verify each option risks and confirm who has decision-making authority.'},
  {title:'Investor briefing: cash flow and uncertainty',
   external:'Higher reported revenue does not alone establish how much unrestricted cash is available.',
   internal:'Keep income-statement trends distinct from cash commitments and liquidity.',
   action:'Confirm cash balances, restrictions and near-term payment obligations.'},
  {title:'Incident communications: facts before blame',
   external:'A service outage occurred; the investigation has not yet established its cause.',
   internal:'Do not name a responsible vendor until documented findings support that conclusion.',
   action:'Review the investigation findings and provide the next verified status update.'},
  {title:'Service negotiations: measurable promises',
   external:'We should specify what response time and coverage hours the service commitment actually includes.',
   internal:'Flag prompt response as too vague for a measurable service-level commitment.',
   action:'Agree the response window, coverage period and method of measuring compliance.'},
  {title:'Feedback after a project: evidence and improvement',
   external:'The handover was completed, although the document-review phase began later than planned.',
   internal:'Use the retrospective dates rather than assigning blame to the team.',
   action:'Identify an earlier review milestone and a named owner for the next project.'},
  {title:'Executive decision memo: compare trade-offs',
   external:'The option with the lowest initial price may have different long-term cost and operating risks.',
   internal:'Do not confuse minimum upfront price with minimum overall cost or risk.',
   action:'Compare operating impacts, assumptions and longer-term costs before recommending an option.'},
  {title:'Cross-cultural meetings: confirm decisions clearly',
   external:'The proposal was discussed, but we have not yet confirmed that it received final approval.',
   internal:'Distinguish agreement to discuss from an authorized recorded decision.',
   action:'Ask the meeting decision owner to confirm approval status and the written next step.'}
 ];
 if(briefings.length!==24||new Set(briefings.map(x=>x.title)).size!==24)throw Error('HF55 needs exactly 24 original topics');
 const examples=new Map(briefings.map(item=>[item.title,Object.freeze(item)]));
 const create=(tag,text,cls)=>{
  const el=document.createElement(tag);
  if(cls)el.className=cls;
  if(text!==undefined)el.textContent=text;
  return el;
 };
 for(const lesson of document.querySelectorAll('article.v1971-lesson')){
  const title=lesson.querySelector('h3')?.textContent?.trim();
  const caseData=protocol.find(title),example=examples.get(title);
  const host=lesson.querySelector('details.v2100-more-tools');
  if(!caseData||!example||!host||host.querySelector('.v2160-audience-briefing'))continue;
  const exercise=create('details',undefined,'v2160-audience-briefing');
  exercise.append(create('summary','Audience-aware briefing · tailor a verified update'));
  exercise.append(create('p',
    'An optional speaking exercise for adult professionals using fictional facts. Select your audience, speak three short sentences, then compare a sample. No recording, submission, automated score, legal advice, or certificate.',
    'v2160-disclosure'));
  const switcher=create('div',undefined,'v2160-audience-choice');
  switcher.setAttribute('role','group');
  switcher.setAttribute('aria-label','Choose the audience for this practice briefing');
  const external=create('button','External stakeholder');
  const internal=create('button','Internal colleague');
  for(const button of [external,internal]){button.type='button';switcher.append(button);}
  exercise.append(switcher);
  const instructions=create('section',undefined,'v2160-steps');
  instructions.setAttribute('aria-live','polite');
  instructions.setAttribute('aria-atomic','true');
  exercise.append(instructions);
  const reveal=create('details',undefined,'v2160-example');
  const exampleText=create('p',undefined,'v2160-model-text');
  reveal.append(create('summary','Compare with an audience-appropriate example'),exampleText);
  exercise.append(reveal);
  const checklist=create('fieldset',undefined,'v2160-checklist');
  checklist.append(create('legend','Self-check your spoken update (not a grade)'));
  for(const item of [
    'I clearly identified a fact from the fictional record.',
    'I distinguished what remains uncertain.',
    'I gave an appropriate, verifiable next step.'
  ]){
    const label=create('label');
    const checkbox=create('input');
    checkbox.type='checkbox';
    label.append(checkbox,document.createTextNode(' '+item));
    checklist.append(label);
  }
  const retry=create('button','Clear self-check and rehearse again');
  retry.type='button';
  retry.addEventListener('click',()=>{
    for(const input of checklist.querySelectorAll('input'))input.checked=false;
    reveal.open=false;
    instructions.focus();
  });
  checklist.append(retry);
  exercise.append(checklist);
  instructions.tabIndex=-1;
  let audience='external';
  function paint(){
    external.setAttribute('aria-pressed',String(audience==='external'));
    internal.setAttribute('aria-pressed',String(audience==='internal'));
    instructions.replaceChildren(
      create('h4',audience==='external'?'Speaking to an external stakeholder':'Speaking to a colleague'),
      create('p','Sentence 1 — Fact: '+caseData.evidence),
      create('p','Sentence 2 — Uncertainty: Explain what this record does not establish.'),
      create('p','Sentence 3 — Next step: '+example.action)
    );
    exampleText.textContent=audience==='external'?example.external:example.internal;
    reveal.open=false;
    for(const input of checklist.querySelectorAll('input'))input.checked=false;
  }
  external.addEventListener('click',()=>{audience='external';paint();});
  internal.addEventListener('click',()=>{audience='internal';paint();});
  paint();
  host.append(exercise);
 }
})();
