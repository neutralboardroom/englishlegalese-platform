'use strict';
/* HF46: original clarification and paraphrase rehearsals. No voice capture or automatic scoring. */
(()=>{
 const records=[
  [
    "Client intake: verified facts",
    "The delivery was late, so you already know what went wrong.",
    "The delivery date and cause have not been independently verified.",
    "Could you confirm the agreed delivery date and show us the relevant documents?",
    "Thank you. We will verify the documents before characterizing the delay."
  ],
  [
    "Contract notices and deadlines",
    "Please send the notice next week; the address is the usual one.",
    "The trigger date, required method and contract address are missing.",
    "Could you confirm which notice clause, address and deadline you mean?",
    "We will check those contractual requirements before confirming the timing."
  ],
  [
    "Redlining: modal verbs and cost scope",
    "The word change is just a small drafting adjustment.",
    "The change affects obligation and possibly cost limitations.",
    "Do you intend to make reimbursement discretionary and limit it to reasonable costs?",
    "We should confirm both intended changes before accepting the redline."
  ],
  [
    "Witness interviews: open questions",
    "I'm sure it happened around lunch, I think.",
    "The witness's time reference and confidence are unclear.",
    "What makes you think it was lunchtime, and what happened immediately before?",
    "Thank you. We will mark the time as an estimate until corroborated."
  ],
  [
    "Negotiation: conditions and tentative terms",
    "Great, we have a deal on the delivery schedule.",
    "The proposal may still require internal approval and final words.",
    "Could we confirm whether the proposed milestones have received final approval?",
    "We can record the discussion as tentative until approvals are confirmed."
  ],
  [
    "Cross-border drafting: clarify meaning",
    "The payment must be made within five days.",
    "The count may use business or calendar days, and start date is unclear.",
    "Does the five-day period mean calendar days or business days, and from which event?",
    "We can clarify the drafting once the intended calculation is agreed."
  ],
  [
    "Quarterly reporting: balanced trends",
    "Sales were much better last time.",
    "The measurement, base period and cause are missing.",
    "Which metric and comparison period support that statement?",
    "We can report the actual comparison after checking the figures."
  ],
  [
    "Project handovers: clear ownership",
    "The team will send the next version soon.",
    "No person, deliverable or deadline is identified.",
    "Who owns the next draft, and on which date will it be delivered?",
    "I will circulate a note with the owner and agreed delivery date."
  ],
  [
    "Supplier negotiation: constructive trade-offs",
    "We can give you a better price if things work out.",
    "Order volume, timing and price conditions are missing.",
    "What confirmed volume and delivery terms would support that price?",
    "We can discuss a conditional proposal after defining those terms."
  ],
  [
    "Investor relations: guidance and assumptions",
    "We expect the same growth next year.",
    "The assumptions and material uncertainties are missing.",
    "Which assumptions support the forecast and what could change it?",
    "We will explain the assumptions without promising a particular result."
  ],
  [
    "Performance reviews: observable feedback",
    "Your communication is not good enough.",
    "The statement lacks observable examples and clear expectations.",
    "Could you identify the specific communication issue and desired next step?",
    "We can review concrete examples and agree on a measurable improvement."
  ],
  [
    "Board presentations: uncertainty and mitigation",
    "We should do something about supplier risk.",
    "The impact, proposed mitigation and decision owner are missing.",
    "What is the possible impact and which mitigation decision is needed?",
    "We will present the risk, mitigation options and review date."
  ],
  [
    "Research summary: sources versus conclusions",
    "This court decision settles the issue.",
    "The case's current validity and controlling jurisdiction are unverified.",
    "Have we checked whether the decision is current and applicable here?",
    "It remains a preliminary source until those checks are completed."
  ],
  [
    "Disclosure request: precise scope and privacy",
    "Please send every email about the company.",
    "The request lacks dates, relevance limits and privacy safeguards.",
    "Could you specify the topic, time period and relevant custodians?",
    "We will apply appropriate relevance, privilege and privacy review."
  ],
  [
    "Mediation statement: interests without admissions",
    "They agreed that it was their fault.",
    "It may reflect discussion rather than an admission of liability.",
    "Could you clarify exactly what was agreed and whether any admission was made?",
    "We will record the shared interests without treating disputed facts as settled."
  ],
  [
    "Matter management: deadline and dependency updates",
    "We will file everything on Friday.",
    "Outstanding documents or approvals may make the date conditional.",
    "Which documents and approvals must be completed before Friday?",
    "We can confirm the date after checking all outstanding dependencies."
  ],
  [
    "Regulatory update: distinguish proposal from rule",
    "The government changed the requirement yesterday.",
    "The speaker may be referring to a proposal rather than final rule.",
    "Was a final rule published, and what is its effective date?",
    "We will verify the official publication before describing current obligations."
  ],
  [
    "Client update: options, risks and decision owner",
    "Option A is obviously best for you.",
    "The comparison and client's priorities are unknown.",
    "Which facts and priorities support choosing Option A over Option B?",
    "We can present both options and their uncertainties for the client's decision."
  ],
  [
    "Investor briefing: cash flow and uncertainty",
    "Our revenue grew, so we have enough money to invest.",
    "Revenue alone does not establish liquid cash availability.",
    "What do our cash balances and upcoming obligations show?",
    "We should confirm liquidity before making any funding claim."
  ],
  [
    "Incident communications: facts before blame",
    "The vendor caused the outage and it will end today.",
    "The cause and restoration deadline may both be unverified.",
    "What cause and restoration information has actually been confirmed?",
    "We can publish known impact and a time for the next update."
  ],
  [
    "Service negotiations: measurable promises",
    "We guarantee excellent support around the clock.",
    "Coverage hours, response metrics and supplier capacity are not defined.",
    "What measurable service levels can the team actually support?",
    "We will propose targets only after checking resources and coverage."
  ],
  [
    "Feedback after a project: evidence and improvement",
    "Everyone should work faster next time.",
    "The retrospective needs an observed gap and practical plan.",
    "Which step delayed delivery, and what change would prevent a repeat?",
    "We can set earlier reviews and a named escalation checkpoint."
  ],
  [
    "Executive decision memo: compare trade-offs",
    "The cheaper option is always the right choice.",
    "Total cost, risk and long-term implications are unknown.",
    "What risks and full-life costs differ between the two options?",
    "We will compare the trade-offs before recommending the next step."
  ],
  [
    "Cross-cultural meetings: confirm decisions clearly",
    "We will consider it, so the project is approved.",
    "Considering an idea is not the same as approving an action.",
    "Could you confirm whether approval was given or only further discussion agreed?",
    "We will record the actual decision, action owner and deadline."
  ]
];
 const map=new Map(records.map(r=>[r[0],r]));
 const make=(tag,text,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
 for(const card of document.querySelectorAll('article.v1971-lesson')){
  const title=card.querySelector('h3')?.textContent?.trim(),r=map.get(title);
  if(!r)continue;
  const panel=make('details',undefined,'v2080-clarification');
  panel.append(make('summary','Listening and clarification · a realistic misunderstanding'));
  panel.append(make('p','Ask a teacher or partner to read the fictional message once, or read it yourself. Paraphrase what is known, identify what remains unknown, then ask one polite question. No microphone or recording is used.','v2080-intro'));
  panel.append(make('blockquote',r[1],'v2080-message'));
  const tasks=make('ol',undefined,'v2080-tasks');
  for(const s of ['Retell the message in your own words, without adding facts.','Say which information you still need.','Ask a precise clarification question and confirm the next step.'])tasks.append(make('li',s));
  panel.append(tasks);
  const hints=make('details',undefined,'v2080-model');
  hints.append(make('summary','Compare with a careful model after you answer'));
  hints.append(make('p','Missing information: '+r[2]));
  hints.append(make('p','Clarifying question: '+r[3]));
  hints.append(make('p','Possible confirmation: '+r[4]));
  panel.append(hints);
  panel.append(make('p','Teacher variation: partner B answers the follow-up using a fictional detail; partner A checks the meaning back in one complete sentence.','v2080-teacher-note'));
  const anchor=card.querySelector('.v2070-questions')||card.querySelector('.v2060-differentiation');
  if(anchor)anchor.after(panel);else card.append(panel);
 }
})();
