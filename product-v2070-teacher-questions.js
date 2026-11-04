'use strict';
/* HF45: 72 original follow-up teacher questions with specific model responses across 24 lessons.
   Not an examination, teacher assignment, recorded classroom or legal opinion service. */
(()=>{
 const records=[
  [
    "Client intake: verified facts",
    "Which fact did the client report but not prove?",
    "The client reported a delay; the signed timetable is still unverified.",
    "What is a respectful request for evidence?",
    "Could you send the signed schedule and relevant delivery notices?",
    "How would you respond if the dates disagree?",
    "I would record the discrepancy and ask for clarification before concluding."
  ],
  [
    "Contract notices and deadlines",
    "What event could start a notice period?",
    "It may start with a specified contractual trigger, which must be checked.",
    "Which delivery details matter?",
    "The agreed address, method and recipient should be verified.",
    "What if a colleague wants to send immediately?",
    "I would flag the uncertainty and verify compliance before advising on timing."
  ],
  [
    "Redlining: modal verbs and cost scope",
    "Which change affects whether payment is required?",
    "Changing must to may generally makes reimbursement discretionary.",
    "What does reasonable do to cost language?",
    "It adds a qualification to the potential expenses.",
    "How can you propose a clean revision?",
    "I would discuss the modal verb and cost definition as separate edits."
  ],
  [
    "Witness interviews: open questions",
    "How do you ask about a sequence without suggesting an answer?",
    "What happened after you arrived at the meeting room?",
    "What can you ask when a witness cannot remember a time?",
    "What helps you estimate the time, and are any records available?",
    "How should the interviewer summarize uncertainty?",
    "I would attribute the recollection to the witness and note what needs checking."
  ],
  [
    "Negotiation: conditions and tentative terms",
    "What would make a proposal conditional?",
    "Approval and confirmation of final wording may be required.",
    "How should you respond to presumed acceptance?",
    "I would politely explain that the terms have not yet been approved.",
    "What is one useful next negotiating step?",
    "I would propose a review of outstanding delivery milestones."
  ],
  [
    "Cross-border drafting: clarify meaning",
    "What is ambiguous about a short deadline?",
    "It may not say whether the period uses calendar or business days.",
    "How would you ask a neutral clarification question?",
    "Could you confirm which days are included in the count?",
    "What should you do if two versions differ?",
    "I would compare both language versions and request an agreed interpretation."
  ],
  [
    "Quarterly reporting: balanced trends",
    "What comparison period supports the increase?",
    "A quarter-over-quarter or year-over-year period must be stated.",
    "Why is one strong result not a guarantee?",
    "A single period may reflect exceptional or temporary conditions.",
    "What question tests the trend?",
    "Are margins and cash flow moving in the same direction?"
  ],
  [
    "Project handovers: clear ownership",
    "What makes a handover instruction actionable?",
    "A named deliverable, responsible owner and specific deadline.",
    "How would you raise a missing dependency?",
    "We need the approved specifications before the review can finish.",
    "What should a follow-up note contain?",
    "It should list outstanding work, owners, dates and escalation points."
  ],
  [
    "Supplier negotiation: constructive trade-offs",
    "How might volume affect price discussions?",
    "Larger confirmed volumes may support a conditional price proposal.",
    "What should you avoid promising prematurely?",
    "I would not guarantee the price before approvals and delivery terms.",
    "How could you close constructively?",
    "Let us compare volume, delivery dates and payment conditions in writing."
  ],
  [
    "Investor relations: guidance and assumptions",
    "What is guidance rather than a guarantee?",
    "It is a forward-looking estimate subject to assumptions.",
    "Which risk could change the outcome?",
    "Unexpected market demand or costs could alter results.",
    "How would you respond to a certainty claim?",
    "I would explain the forecast's assumptions and material uncertainties."
  ],
  [
    "Performance reviews: observable feedback",
    "What distinguishes an observation from a personal label?",
    "An observation names a specific result or action.",
    "How can you describe a missed deadline fairly?",
    "Two reports arrived after the agreed dates, affecting review time.",
    "What improvement could be checked?",
    "We can set an earlier checkpoint and review punctuality next month."
  ],
  [
    "Board presentations: uncertainty and mitigation",
    "What decision does the board need to make?",
    "It may need to approve or request a supplier contingency plan.",
    "How would you express an unverified risk?",
    "The interruption could delay launch, but the timing is still uncertain.",
    "What checkpoint should conclude the update?",
    "We will assess the alternative supplier and report by Friday."
  ],
  [
    "Research summary: sources versus conclusions",
    "What is missing from an unverified case reference?",
    "Its current status and jurisdictional applicability remain unchecked.",
    "How would you distinguish a source from your conclusion?",
    "The case discusses similar language but may not govern this matter.",
    "What is the next research task?",
    "Check later treatment, governing law and jurisdiction before advising."
  ],
  [
    "Disclosure request: precise scope and privacy",
    "What makes a request overbroad?",
    "It demands unrelated information without subject or time limits.",
    "How can you narrow the subject?",
    "Specify the supply interruption, relevant teams and three-month period.",
    "What safeguard should you add?",
    "Responsive materials need appropriate privacy and privilege review."
  ],
  [
    "Mediation statement: interests without admissions",
    "How do you acknowledge a concern without conceding blame?",
    "We understand the disruption matters while the facts remain disputed.",
    "What shared interest could both parties accept?",
    "Both may benefit from predictable delivery and clear communication.",
    "How might you invite a practical proposal?",
    "Could we compare alternative schedules without resolving liability today?"
  ],
  [
    "Matter management: deadline and dependency updates",
    "Which work has actually been completed?",
    "The draft has been prepared, but supporting documents are outstanding.",
    "Why might a proposed date change?",
    "The review depends on receipt and verification of missing records.",
    "What would you tell a client seeking certainty?",
    "We can confirm the timeline when the remaining inputs are checked."
  ],
  [
    "Regulatory update: distinguish proposal from rule",
    "What evidence would show a rule is effective?",
    "A final authoritative publication and applicable effective date.",
    "How should you describe an open consultation?",
    "It is a proposed change, not yet a binding new requirement.",
    "What should the legal team monitor?",
    "The consultation closing date and any final rule or transitional period."
  ],
  [
    "Client update: options, risks and decision owner",
    "How should you compare options neutrally?",
    "State each option's timing, cost and main uncertainty.",
    "What information is still needed to advise?",
    "We should verify the commercial assumptions and operational effects.",
    "Who makes the commercial choice?",
    "The client makes the decision after receiving balanced information."
  ],
  [
    "Investor briefing: cash flow and uncertainty",
    "Why is sales growth not the same as cash?",
    "Revenue may be recognized before a customer pays.",
    "Which short-term item affects liquidity?",
    "Upcoming debt payments and customer collection timing matter.",
    "How would you qualify the outlook?",
    "Liquidity depends on collections, obligations and financing conditions."
  ],
  [
    "Incident communications: facts before blame",
    "What can be reported immediately?",
    "The confirmed service impact and current response actions.",
    "Why should you avoid naming a cause early?",
    "The investigation may not yet support that explanation.",
    "What is an appropriate closing update?",
    "We will update customers at the agreed time with verified information."
  ],
  [
    "Service negotiations: measurable promises",
    "Which elements define a support commitment?",
    "Coverage hours, response targets and escalation thresholds.",
    "Why should a target be checked with operations?",
    "A supplier needs sufficient capacity to fulfill it.",
    "What wording makes a proposal conditional?",
    "We propose the target subject to staffing confirmation and agreement."
  ],
  [
    "Feedback after a project: evidence and improvement",
    "What achievement can you evidence?",
    "The team completed the handover by its agreed milestone.",
    "How can you explain a gap without blame?",
    "Late document reviews reduced the available testing window.",
    "What two actions would help next time?",
    "Set an earlier review date and name one escalation owner."
  ],
  [
    "Executive decision memo: compare trade-offs",
    "What should a memo say about each option?",
    "The relative benefits, costs, constraints and unresolved assumptions.",
    "What makes a recommendation too certain?",
    "Claiming one option is best without comparing its risks.",
    "What decision should the reader make?",
    "Choose the next evaluation step once the missing evidence is available."
  ],
  [
    "Cross-cultural meetings: confirm decisions clearly",
    "How do you separate discussion from approval?",
    "List ideas discussed separately from actual recorded decisions.",
    "What does a complete action item need?",
    "A clear owner, deliverable and deadline.",
    "How should you invite corrections across cultures?",
    "Please let me know if I have misunderstood any agreed next step."
  ]
];
 const byTitle=new Map(records.map(row=>[row[0],row]));
 const el=(tag,text,cls)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
 for(const lesson of document.querySelectorAll('article.v1971-lesson')){
  const title=lesson.querySelector('h3')?.textContent?.trim(),row=byTitle.get(title);
  if(!row)continue;
  const panel=el('details',undefined,'v2070-questions');
  panel.append(el('summary','Teacher question bank · three additional follow-ups'));
  panel.append(el('p','Invite complete answers. Ask one learner to answer and another to paraphrase. Show example answers only after the learner speaks. Use invented facts; these are instructional suggestions, not legal opinions or grades.','v2070-intro'));
  const list=el('ol',undefined,'v2070-list');
  for(let i=1;i<7;i+=2){
   const item=el('li');
   item.append(el('p',row[i],'v2070-question'));
   const answer=el('details',undefined,'v2070-answer');
   answer.append(el('summary','Possible model answer'),el('p',row[i+1]));
   item.append(answer);list.append(item);
  }
  panel.append(list);
  const anchor=lesson.querySelector('.v2060-differentiation')||lesson.querySelector('.v2040-teacher');
  if(anchor)anchor.after(panel);else lesson.append(panel);
 }
})();
