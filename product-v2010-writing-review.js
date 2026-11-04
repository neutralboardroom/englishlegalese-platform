'use strict';
/* HF39 — lesson-specific, voluntary self-review. Browser memory only.
   No draft upload, grade, AI service, certification, persistence or form submission. */
(()=>{
 const guidance=[
  [
    "Client intake: verified facts",
    "Attribute the client's claim rather than presenting it as verified.",
    "Name the document or evidence still missing.",
    "End with a precise and neutral next action.",
    "Could a reader tell exactly which facts remain unconfirmed?"
  ],
  [
    "Contract notices and deadlines",
    "Separate the possible deadline from the confirmed contract terms.",
    "Identify the notice address, method and trigger date to check.",
    "Avoid promising a compliant notice until those details are verified.",
    "How would your wording change if the triggering date were disputed?"
  ],
  [
    "Redlining: modal verbs and cost scope",
    "Explain how mandatory and discretionary language differ.",
    "Identify how the cost qualifier changes scope.",
    "Ask for confirmation or approval before accepting the redline.",
    "Can you explain both revisions in one clear sentence?"
  ],
  [
    "Witness interviews: open questions",
    "Start with a genuinely open question, without suggesting an answer.",
    "Ask for the witness's sequence or direct observation.",
    "Avoid treating a recollection as independently established fact.",
    "How could your follow-up clarify timing without leading the witness?"
  ],
  [
    "Negotiation: conditions and tentative terms",
    "Frame the proposal as conditional, not an agreement already made.",
    "Identify the open term requiring discussion.",
    "Propose a concrete next step or approval point.",
    "Could the other party mistake this proposal for a final commitment?"
  ],
  [
    "Cross-border drafting: clarify meaning",
    "Quote or identify the term that creates ambiguity.",
    "Ask a neutral question offering relevant alternatives.",
    "Avoid claiming one interpretation is legally universal.",
    "What single answer from the recipient would resolve the ambiguity?"
  ],
  [
    "Quarterly reporting: balanced trends",
    "State the reported metric or trend with its comparison period.",
    "Distinguish current evidence from projected results.",
    "Identify one uncertainty or assumption to monitor.",
    "What evidence would challenge the positive interpretation?"
  ],
  [
    "Project handovers: clear ownership",
    "Name the concrete deliverable rather than a vague task.",
    "Assign an accountable person or team and a date.",
    "Include the next communication or escalation checkpoint.",
    "Could a colleague act on this note without asking who does what?"
  ],
  [
    "Supplier negotiation: constructive trade-offs",
    "Describe the proposed exchange without claiming agreement.",
    "Connect pricing, timing or quantity to the other party's priorities.",
    "Leave an explicit question or conditional next step.",
    "Which condition must be accepted before the proposal is final?"
  ],
  [
    "Investor relations: guidance and assumptions",
    "Separate past reported performance from future guidance.",
    "Name an assumption or material risk.",
    "Use qualified language rather than a guarantee of return.",
    "Would an investor mistake your forecast for a confirmed outcome?"
  ],
  [
    "Performance reviews: observable feedback",
    "Cite a specific observed action or result.",
    "Describe the concern respectfully without labeling the person.",
    "Offer a practical next step or shared improvement plan.",
    "How could the recipient measure whether improvement occurred?"
  ],
  [
    "Board presentations: uncertainty and mitigation",
    "State the risk and its potential business impact.",
    "Name a mitigation action and the owner where possible.",
    "Identify a decision or review checkpoint.",
    "What should the board decide or request at the end?"
  ],
  [
    "Research summary: sources versus conclusions",
    "Attribute what each source actually says.",
    "Distinguish preliminary findings from binding verified authority.",
    "Identify a jurisdiction, current-status or governing-law check.",
    "What would you need to verify before giving a definitive conclusion?"
  ],
  [
    "Disclosure request: precise scope and privacy",
    "Specify a relevant time period and subject matter.",
    "Describe requested record types without sweeping up unrelated files.",
    "Recognize privacy, privilege or legal-review considerations.",
    "Could someone carry out this request without collecting irrelevant personal data?"
  ],
  [
    "Mediation statement: interests without admissions",
    "State each side's interest without treating disputed facts as conceded.",
    "Use neutral and constructive language.",
    "Propose a possible area of practical discussion.",
    "Could your statement accidentally concede liability or a contested fact?"
  ],
  [
    "Matter management: deadline and dependency updates",
    "Identify what has actually been completed.",
    "Name the missing input and its effect on timing.",
    "Offer a conditional next date and escalation step.",
    "What needs to happen before the revised deadline can be confirmed?"
  ],
  [
    "Regulatory update: distinguish proposal from rule",
    "Label the proposed change and the current binding rule separately.",
    "Describe the practical effect only to the extent established.",
    "Specify what event or date your team will monitor.",
    "Would a reader wrongly assume the proposal is already law?"
  ],
  [
    "Client update: options, risks and decision owner",
    "Describe both options without overstating their certainty.",
    "Flag a material unresolved issue or trade-off.",
    "Identify who must choose and the next required action.",
    "What key fact would change the recommendation?"
  ],
  [
    "Investor briefing: cash flow and uncertainty",
    "Distinguish revenue or growth claims from cash flow and liquidity.",
    "Explain one risk or assumption in plain language.",
    "Qualify forward-looking statements appropriately.",
    "What information would a careful investor ask for next?"
  ],
  [
    "Incident communications: facts before blame",
    "State only the confirmed impact and current response.",
    "Avoid unsupported causes, blame or restoration promises.",
    "Give the next update time or trigger.",
    "Could a reader confuse your working hypothesis with a confirmed cause?"
  ],
  [
    "Service negotiations: measurable promises",
    "Replace vague service adjectives with measurable parameters.",
    "Ask about operational capacity or practical constraints.",
    "State the proposed service level as subject to agreement.",
    "How would both sides verify performance objectively?"
  ],
  [
    "Feedback after a project: evidence and improvement",
    "Describe an actual achievement with context.",
    "Identify an observed gap without personal blame.",
    "Set out two feasible actions for the next project.",
    "Who owns the next improvement and how will it be checked?"
  ],
  [
    "Executive decision memo: compare trade-offs",
    "Set out both options and meaningful differences.",
    "Name at least two uncertainties or risks.",
    "Identify the decision process and your qualified recommendation.",
    "What decision-relevant evidence is still missing?"
  ],
  [
    "Cross-cultural meetings: confirm decisions clearly",
    "Separate ideas discussed from decisions actually made.",
    "Name each agreed action, owner and date.",
    "Use respectful clear wording and request corrections.",
    "Could a remote colleague follow the plan without another meeting?"
  ]
];
 const map=new Map(guidance.map(row=>[row[0],row]));
 if(map.size!==24)throw Error('Expected 24 distinct lesson review guides');
 const make=(tag,cls,content)=>{
  const node=document.createElement(tag);
  if(cls)node.className=cls;
  if(content!==undefined)node.textContent=content;
  return node;
 };
 const lessons=[...document.querySelectorAll('article.v1971-lesson')];
 for(const [index,lesson] of lessons.entries()){
  const title=lesson.querySelector('h3')?.textContent?.trim();
  const draft=lesson.querySelector('textarea');
  const data=map.get(title);
  if(!data||!draft)continue;
  const container=make('section','v2010-review');
  container.setAttribute('aria-label','Writing review for '+title);
  const progress=make('p','v2010-word-counter');
  progress.setAttribute('aria-live','off');
  const panel=make('details','v2010-panel');
  const summary=make('summary',null,'Improve your draft · three specific review points');
  const info=make('p','v2010-help','These are your own revision prompts, not an automatic score, teacher grade or certification assessment. Nothing is submitted or saved here.');
  const fieldset=make('fieldset','v2010-checklist');
  const legend=make('legend',null,'Before your next draft, check:');
  fieldset.append(legend);
  const checks=[];
  for(let i=0;i<3;i++){
   const label=make('label','v2010-check-label');
   const checkbox=make('input');
   checkbox.type='checkbox';
   checkbox.name='v2010-review-'+index+'-'+i;
   checkbox.setAttribute('aria-label',data[i+1]);
   label.append(checkbox,make('span',null,data[i+1]));
   fieldset.append(label);
   checks.push(checkbox);
  }
  const challenge=make('p','v2010-challenge','One more question: '+data[4]);
  const status=make('p','v2010-review-status');
  status.setAttribute('role','status');
  status.textContent='0 of 3 review points considered. These are not test results.';
  const updateStatus=()=>{
   const checked=checks.filter(x=>x.checked).length;
   status.textContent=checked+' of 3 review points considered. '+(checked===3?'Re-read and revise your writing using these prompts.':'Use the prompts to identify the next improvement.');
  };
  checks.forEach(check=>check.addEventListener('change',updateStatus));
  const count=()=>{
   const used=draft.value.length;
   const words=draft.value.trim()?draft.value.trim().split(/\s+/u).length:0;
   const limit=draft.maxLength;
   progress.textContent=words+' words · '+used+' of '+limit+' characters used. Review points are private to this page.';
  };
  const onEdit=()=>{
   count();
   if(checks.some(x=>x.checked)){
    checks.forEach(x=>{x.checked=false;});
    status.textContent='Your draft changed. Recheck the three points after revising.';
   }
  };
  draft.addEventListener('input',onEdit);
  count();
  panel.append(summary,info,fieldset,challenge,status);
  container.append(progress,panel);
  const draftTools=lesson.querySelector('.v2000-draft-tools');
  if(draftTools)draftTools.after(container);
  else draft.closest('label')?.after(container);
 }
})();