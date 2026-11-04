'use strict';
/* HF44 differentiated speaking: original topic-specific, voluntary practice, not CEFR testing. */
(()=>{
 const records=[
  [
    "Client intake: verified facts",
    "The client reports ___. We still need to check ___.",
    "Your client insists the delay proves breach. Respond without accepting that conclusion.",
    "I understand the concern. We will verify the agreed delivery schedule before drawing any conclusion."
  ],
  [
    "Contract notices and deadlines",
    "Before we confirm the date, we need to check ___.",
    "A colleague asks whether email notice is sufficient. Explain the uncertainty.",
    "We need to verify the contract's permitted delivery method and notice address before confirming."
  ],
  [
    "Redlining: modal verbs and cost scope",
    "The edit changes ___ into ___.",
    "Explain why two changes in one redline should be discussed separately.",
    "The change from must to may affects discretion, while reasonable also narrows cost wording."
  ],
  [
    "Witness interviews: open questions",
    "Please describe what you ___ next.",
    "Ask an open follow-up after a witness offers an uncertain time.",
    "What happened immediately afterward, and how do you remember the sequence?"
  ],
  [
    "Negotiation: conditions and tentative terms",
    "We could consider ___, subject to ___.",
    "A counterparty treats your draft as accepted. Politely correct the record.",
    "We can discuss that proposal, but any agreement remains subject to approval and final wording."
  ],
  [
    "Cross-border drafting: clarify meaning",
    "Could you clarify whether ___ means ___?",
    "Ask about two competing meanings without suggesting universal enforceability.",
    "Could you clarify whether the term refers to calendar days or business days under this agreement?"
  ],
  [
    "Quarterly reporting: balanced trends",
    "The number increased, but ___ is not yet confirmed.",
    "Respond to an executive who wants to call one strong period permanent growth.",
    "This quarter improved, but we need more periods and supporting evidence before asserting a durable trend."
  ],
  [
    "Project handovers: clear ownership",
    "___ will send ___ by ___.",
    "A task has two teams but no single owner. Clarify accountability and review.",
    "The operations lead will prepare the draft by Wednesday; I will review it on Thursday."
  ],
  [
    "Supplier negotiation: constructive trade-offs",
    "We may adjust ___ if you can ___.",
    "Suggest an exchange that protects delivery and avoids premature commitment.",
    "We could discuss a unit-price adjustment if volume and delivery commitments are confirmed."
  ],
  [
    "Investor relations: guidance and assumptions",
    "The outlook assumes ___ and may change if ___.",
    "An investor asks if the forecast guarantees returns. Qualify the statement.",
    "The outlook is conditional on market demand and costs; actual results could differ."
  ],
  [
    "Performance reviews: observable feedback",
    "I noticed ___; next time please ___.",
    "Replace a personal criticism with observable evidence and a practical improvement.",
    "The weekly reports arrived late twice; please flag any delays before the agreed deadline."
  ],
  [
    "Board presentations: uncertainty and mitigation",
    "The risk is ___. Our next action is ___.",
    "Give the board a decision request while acknowledging unknowns.",
    "A supply delay threatens launch timing. We propose a backup supplier review before Friday's decision."
  ],
  [
    "Research summary: sources versus conclusions",
    "Our preliminary search suggests ___, but we must verify ___.",
    "Differentiate potentially relevant cases from binding authority in an executive summary.",
    "The decisions may be relevant, but their status and jurisdictional application require verification."
  ],
  [
    "Disclosure request: precise scope and privacy",
    "Please send ___ from ___ to ___ only.",
    "Rewrite an overbroad record request with clear exclusions and review safeguards.",
    "Please locate project correspondence from April through June, subject to relevance and privilege review."
  ],
  [
    "Mediation statement: interests without admissions",
    "We hope to agree on ___ without deciding ___.",
    "State a shared commercial interest without admitting a disputed fact.",
    "Both sides may benefit from clearer delivery milestones, without conceding responsibility for the delay."
  ],
  [
    "Matter management: deadline and dependency updates",
    "We completed ___; the next step depends on ___.",
    "Explain why a proposed filing date remains conditional on an outstanding record.",
    "The draft is ready for review, but the timeline depends on receipt of the missing documents."
  ],
  [
    "Regulatory update: distinguish proposal from rule",
    "The change is proposed; the current rule is ___.",
    "Brief a client on the difference between a consultation and a binding requirement.",
    "The proposal has not taken effect; we will monitor publication of a final rule."
  ],
  [
    "Client update: options, risks and decision owner",
    "Option A offers ___; Option B offers ___.",
    "Ask the client to decide after presenting balanced timing and risk trade-offs.",
    "We can compare both options once the costs and implementation constraints are verified."
  ],
  [
    "Investor briefing: cash flow and uncertainty",
    "Sales rose, but cash flow depends on ___.",
    "Respond to a claim that strong revenue alone proves liquidity.",
    "Revenue growth does not guarantee cash availability; collections and liabilities need review."
  ],
  [
    "Incident communications: facts before blame",
    "We can confirm ___; we are still checking ___.",
    "Write an update when the cause and restoration time are not verified.",
    "We are investigating the interruption and will provide another update once facts are confirmed."
  ],
  [
    "Service negotiations: measurable promises",
    "We propose a response time of ___ during ___.",
    "Turn an unrealistic support promise into measurable terms subject to capacity.",
    "We can discuss two-hour responses during agreed coverage hours, after verifying staffing capacity."
  ],
  [
    "Feedback after a project: evidence and improvement",
    "We achieved ___; next time we should ___.",
    "Explain a late milestone without blaming the team and propose two corrections.",
    "The handover succeeded, but late reviews reduced testing time; let's set an earlier checkpoint."
  ],
  [
    "Executive decision memo: compare trade-offs",
    "Option A costs ___ but has ___ risk.",
    "Recommend a process when two options have incomplete but comparable evidence.",
    "Option one is cheaper upfront, while option two may offer more flexibility; both need risk review."
  ],
  [
    "Cross-cultural meetings: confirm decisions clearly",
    "We discussed ___; the confirmed decision was ___.",
    "Write an international meeting recap that separates ideas from approved actions.",
    "We discussed the revision but did not approve it; the account manager will circulate a draft Friday."
  ]
];
 const map=new Map(records.map(r=>[r[0],r]));
 const make=(tag,text,cls)=>{
  const el=document.createElement(tag);
  if(cls)el.className=cls;
  if(text!==undefined)el.textContent=text;
  return el;
 };
 for(const article of document.querySelectorAll('article.v1971-lesson')){
  const title=article.querySelector('h3')?.textContent?.trim(),data=map.get(title);
  if(!data)continue;
  const panel=make('details',undefined,'v2060-differentiation');
  panel.append(make('summary','Choose your speaking challenge · supported or advanced'));
  panel.append(make('p','Choose the amount of support you need today. These are practice options, not assigned CEFR levels, test results, or official progress. Speak with a partner using fictional facts.','v2060-context'));
  const choices=make('div',undefined,'v2060-options');
  const easy=make('section',undefined,'v2060-option');
  easy.append(make('h4','Supported: complete a sentence'),make('p',data[1]));
  const easyGuide=make('p','Say the completed sentence aloud twice, then ask your partner to repeat the key point.','v2060-guide');
  easy.append(easyGuide);
  const deep=make('section',undefined,'v2060-option');
  deep.append(make('h4','Challenge: explain and qualify'),make('p',data[2]));
  const answer=make('details',undefined,'v2060-answer');
  answer.append(make('summary','Reveal a possible response after speaking'),make('p',data[3]));
  deep.append(answer);
  choices.append(easy,deep);panel.append(choices);
  const anchor=article.querySelector('.v2040-teacher')||article.querySelector('.v2020-dialogue');
  if(anchor)anchor.after(panel);else article.append(panel);
 }
})();
