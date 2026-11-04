'use strict';
/* HF40: 24 original, optional paired workplace dialogues; no mic, AI, data storage or booking. */
(()=>{
 const dialogues=[
  [
    "Client intake: verified facts",
    "A: What has your client told you about the delivery?",
    "B: The client reports a delay, but we have not verified the delivery schedule.",
    "A: What document will you check before advising?",
    "I will check the signed schedule before stating a conclusion."
  ],
  [
    "Contract notices and deadlines",
    "A: Can we send our notice next week?",
    "B: We first need to check the trigger date and the notice clause.",
    "A: Which address and delivery method should we use?",
    "I will verify the agreed requirements before confirming the deadline."
  ],
  [
    "Redlining: modal verbs and cost scope",
    "A: What is the difference between must and may here?",
    "B: Must expresses an obligation; may generally expresses discretion.",
    "A: Does the phrase reasonable costs also change the proposal?",
    "Yes. It qualifies the type or scope of costs."
  ],
  [
    "Witness interviews: open questions",
    "A: Please tell me what you remember seeing.",
    "B: I saw two people enter the meeting room around noon.",
    "A: What happened next, as you remember it?",
    "I cannot confirm the exact time without checking my notes."
  ],
  [
    "Negotiation: conditions and tentative terms",
    "A: Could your team accept the proposed delivery date?",
    "B: We could consider it, subject to final management approval.",
    "A: Which condition should we resolve first?",
    "We should confirm the delivery milestones and final wording."
  ],
  [
    "Cross-border drafting: clarify meaning",
    "A: Does the clause mean business days or calendar days?",
    "B: I cannot tell from this draft. We should ask for clarification.",
    "A: How would you put that question to the other party?",
    "Could you clarify whether the period excludes weekends and holidays?"
  ],
  [
    "Quarterly reporting: balanced trends",
    "A: Did revenue improve this quarter?",
    "B: Revenue increased, but one quarter does not prove a lasting trend.",
    "A: What uncertainty should we mention?",
    "We should explain the comparison period and the main risks."
  ],
  [
    "Project handovers: clear ownership",
    "A: Who is preparing the revised document?",
    "B: The project team will prepare the draft by Wednesday.",
    "A: Who will review it and when?",
    "I will review it on Thursday and report outstanding issues."
  ],
  [
    "Supplier negotiation: constructive trade-offs",
    "A: Could we agree on a lower unit price?",
    "B: Possibly, if we can confirm higher order volumes.",
    "A: What other terms could help both sides?",
    "We could discuss delivery timing and payment milestones."
  ],
  [
    "Investor relations: guidance and assumptions",
    "A: Does this outlook guarantee next year's return?",
    "B: No. It is guidance that depends on several assumptions.",
    "A: What is one risk that investors should understand?",
    "Market demand may change, so actual results could differ."
  ],
  [
    "Performance reviews: observable feedback",
    "A: What did the team member do effectively?",
    "B: They completed the weekly reports on time.",
    "A: What practical improvement would help next month?",
    "They could confirm handover responsibilities in writing."
  ],
  [
    "Board presentations: uncertainty and mitigation",
    "A: What is the principal risk for the board?",
    "B: A supplier interruption could delay the launch.",
    "A: What mitigation and decision are proposed?",
    "We can qualify an alternative supplier and review the plan next week."
  ],
  [
    "Research summary: sources versus conclusions",
    "A: Do the two cases settle the legal issue?",
    "B: Not yet. We need to check their status and jurisdictional relevance.",
    "A: What research task comes next?",
    "We should verify the authorities and governing law before concluding."
  ],
  [
    "Disclosure request: precise scope and privacy",
    "A: Could you send all company messages?",
    "B: That is too broad. We should narrow the subject and dates.",
    "A: What should the revised request specify?",
    "A defined period, relevant teams and the type of correspondence."
  ],
  [
    "Mediation statement: interests without admissions",
    "A: What does your side hope to achieve today?",
    "B: We want a workable timetable without conceding disputed facts.",
    "A: Is there an area of common practical interest?",
    "Both sides may benefit from a clearer delivery process."
  ],
  [
    "Matter management: deadline and dependency updates",
    "A: Is the draft complete and ready to file?",
    "B: The first draft is complete, but we still need supporting documents.",
    "A: Can you confirm the filing date?",
    "Only after we receive and review the missing information."
  ],
  [
    "Regulatory update: distinguish proposal from rule",
    "A: Has the proposed rule already taken effect?",
    "B: No. It is still a proposal, not a current requirement.",
    "A: What should clients watch next?",
    "The publication of a final rule and its effective date."
  ],
  [
    "Client update: options, risks and decision owner",
    "A: Which of these options should we take?",
    "B: Each option involves different timing and risk considerations.",
    "A: Who must make the final choice?",
    "The client should decide after we clarify the remaining facts."
  ],
  [
    "Investor briefing: cash flow and uncertainty",
    "A: Does strong revenue mean we have ample cash?",
    "B: Not necessarily. Revenue and cash flow measure different things.",
    "A: What liquidity information should we check?",
    "Cash balances, upcoming liabilities and collection timing."
  ],
  [
    "Incident communications: facts before blame",
    "A: What caused the service interruption?",
    "B: The cause is still being investigated.",
    "A: What can we confirm to customers now?",
    "We can report the known impact and the next update time."
  ],
  [
    "Service negotiations: measurable promises",
    "A: What does excellent service mean in this proposal?",
    "B: We should specify measurable response and resolution times.",
    "A: Can the supplier realistically meet those targets?",
    "Let's confirm staffing and the reporting method before agreeing."
  ],
  [
    "Feedback after a project: evidence and improvement",
    "A: What went well in the last project?",
    "B: The team finished the initial handover by the agreed date.",
    "A: What should change next time?",
    "We should clarify document ownership and schedule earlier reviews."
  ],
  [
    "Executive decision memo: compare trade-offs",
    "A: Which option has the lower upfront cost?",
    "B: Option one, but it may involve higher operational risk.",
    "A: What evidence is needed for a recommendation?",
    "We need comparable total costs and the principal uncertainties."
  ],
  [
    "Cross-cultural meetings: confirm decisions clearly",
    "A: Did the meeting approve the revised proposal?",
    "B: We discussed it, but no final approval was recorded.",
    "A: Who is responsible for the next step?",
    "The account manager will circulate the draft by Friday."
  ]
];
 const byTitle=new Map(dialogues.map(row=>[row[0],row]));
 const make=(tag,text,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
 for(const lesson of document.querySelectorAll('article.v1971-lesson')){
  const title=lesson.querySelector('h3')?.textContent?.trim();
  const row=byTitle.get(title);
  if(!row)continue;
  const panel=make('details',undefined,'v2020-dialogue');
  panel.append(make('summary','Partner conversation · four guided turns'));
  const intro=make('p','Teacher-led or independent practice: read the roles silently first, then speak without reading. Use invented facts. Work in pairs or bring one learner to the front; no microphone is required.');
  panel.append(intro);
  const ordered=make('ol',undefined,'v2020-lines');
  for(const sentence of row.slice(1,4)){const li=make('li',sentence);ordered.append(li);}
  panel.append(ordered);
  const hint=make('details',undefined,'v2020-model');
  hint.append(make('summary','Reveal a possible final learner answer after practicing'),make('p',row[4]));
  panel.append(hint);
  panel.append(make('p','Teacher cue: ask a new pair to swap A/B roles, then repeat the final answer more clearly. Do not award a score from this exercise.','v2020-cue'));
  const anchor=lesson.querySelector('.v2010-review')||lesson.querySelector('.v2000-draft-tools');
  if(anchor)anchor.after(panel);else lesson.append(panel);
 }
})();