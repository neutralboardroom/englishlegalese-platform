'use strict';
/* EnglishLegalese HF50–HF53: original adult professional casework, independent branding.
   TR-Clone V1.0 response-mode compatibility only: no shared runtime, accounts or network. */
(()=>{
 const cases=[
  {
    "title": "Client intake: verified facts",
    "model": "We must verify the signed delivery schedule before advising.",
    "evidence": "The intake packet includes only an unsigned delivery timetable.",
    "overclaim": "The customer accepted the final delivery date.",
    "question": "Could you provide the signed timetable or written confirmation?",
    "qualified": "The delivery timetable in the packet is unsigned; we need confirmation before advising."
  },
  {
    "title": "Contract notices and deadlines",
    "model": "Please confirm the notice deadline and delivery method.",
    "evidence": "The agreement draft requests written notice.",
    "overclaim": "Email always satisfies the signed notice requirement.",
    "question": "Can we confirm the delivery method and notice period in the signed agreement?",
    "qualified": "The draft calls for written notice, but the permitted delivery method remains to be checked."
  },
  {
    "title": "Redlining: modal verbs and cost scope",
    "model": "The word may changes the obligation into a possibility.",
    "evidence": "One redline replaces 'shall' with 'may'.",
    "overclaim": "The parties' payment obligations are unchanged.",
    "question": "Can we compare both complete versions of the affected clause?",
    "qualified": "The modal verb changed, so the legal and commercial effect needs review."
  },
  {
    "title": "Witness interviews: open questions",
    "model": "Please describe what happened after the meeting began.",
    "evidence": "The interview summary records the order of events.",
    "overclaim": "The witness remembers every exact time.",
    "question": "Could you estimate the time and distinguish memory from later notes?",
    "qualified": "The sequence is recorded, but the precise timing is not confirmed."
  },
  {
    "title": "Negotiation: conditions and tentative terms",
    "model": "We could consider the proposal subject to final approval.",
    "evidence": "The commercial proposal is marked subject to approval.",
    "overclaim": "Both parties have accepted all the proposed terms.",
    "question": "Who must approve the terms before they become final?",
    "qualified": "The terms are under discussion and still require final approval."
  },
  {
    "title": "Cross-border drafting: clarify meaning",
    "model": "Could you clarify whether the deadline means business days?",
    "evidence": "The draft uses the words 'business days'.",
    "overclaim": "Weekends and public holidays are definitely counted.",
    "question": "Which definition of 'business day' governs this agreement?",
    "qualified": "The draft refers to business days; the applicable definition needs confirmation."
  },
  {
    "title": "Quarterly reporting: balanced trends",
    "model": "Revenue improved this quarter but the trend remains uncertain.",
    "evidence": "This quarter's report shows increased revenue.",
    "overclaim": "The business will continue to grow at the same rate.",
    "question": "What additional data would support a trend rather than a one-quarter change?",
    "qualified": "Revenue increased this quarter, but future performance remains uncertain."
  },
  {
    "title": "Project handovers: clear ownership",
    "model": "The project manager will deliver the revised plan on Wednesday.",
    "evidence": "The revised project plan has a named delivery owner.",
    "overclaim": "All downstream teams have signed off the dependencies.",
    "question": "Can each dependent team confirm the planned handover date?",
    "qualified": "The plan identifies an owner, but the dependent sign-offs remain to be verified."
  },
  {
    "title": "Supplier negotiation: constructive trade-offs",
    "model": "We can discuss a lower price if volumes are confirmed.",
    "evidence": "The supplier offered a price reduction linked to volume.",
    "overclaim": "The lower price applies to any order size.",
    "question": "What minimum volume and delivery conditions qualify for that price?",
    "qualified": "The proposed price reduction depends on confirmed ordering conditions."
  },
  {
    "title": "Investor relations: guidance and assumptions",
    "model": "The forecast depends on assumptions about future demand.",
    "evidence": "The investor briefing states assumptions behind a forecast.",
    "overclaim": "Forecast returns are guaranteed.",
    "question": "Which assumptions could materially change the forecast?",
    "qualified": "The forecast is conditional and actual results may differ."
  },
  {
    "title": "Performance reviews: observable feedback",
    "model": "The weekly reports arrived after the agreed deadline.",
    "evidence": "The performance log shows several late weekly reports.",
    "overclaim": "The employee is unwilling to improve.",
    "question": "What process or workload factors affected the report deadlines?",
    "qualified": "Some reports were late; the cause and potential support should be discussed."
  },
  {
    "title": "Board presentations: uncertainty and mitigation",
    "model": "The supplier interruption could delay our proposed launch.",
    "evidence": "The board paper flags a possible supplier interruption.",
    "overclaim": "The launch will definitely be delayed.",
    "question": "What contingency options and lead times have been verified?",
    "qualified": "There is a supplier risk, but its effect on launch timing is not yet confirmed."
  },
  {
    "title": "Research summary: sources versus conclusions",
    "model": "We must check whether the authority applies in this jurisdiction.",
    "evidence": "The case research cites an appellate decision.",
    "overclaim": "The decision governs every jurisdiction.",
    "question": "Which court, jurisdiction and current status apply?",
    "qualified": "We located a relevant decision; its applicability and current status require checking."
  },
  {
    "title": "Disclosure request: precise scope and privacy",
    "model": "Please limit the request to relevant project correspondence.",
    "evidence": "The requested documents cover project correspondence.",
    "overclaim": "Every personal message is automatically disclosable.",
    "question": "Which documents are relevant, in scope and not privileged?",
    "qualified": "The request concerns project correspondence; precise scope and privilege need review."
  },
  {
    "title": "Mediation statement: interests without admissions",
    "model": "We can discuss a timetable without admitting responsibility.",
    "evidence": "The parties are exploring settlement timing.",
    "overclaim": "Discussing a timetable admits legal liability.",
    "question": "Can we clarify the purpose of the discussion without making admissions?",
    "qualified": "The timetable discussion is exploratory and does not establish an admission."
  },
  {
    "title": "Matter management: deadline and dependency updates",
    "model": "The filing date depends on receiving the missing documents.",
    "evidence": "The filing checklist lists two outstanding documents.",
    "overclaim": "The filing can be completed by Friday regardless.",
    "question": "When can the missing documents be verified and delivered?",
    "qualified": "The filing date depends on receiving and reviewing the remaining documents."
  },
  {
    "title": "Regulatory update: distinguish proposal from rule",
    "model": "The proposed regulation has not yet entered into force.",
    "evidence": "The authority published a proposed rule.",
    "overclaim": "The proposal is already legally effective.",
    "question": "Has the final rule been adopted, and what is its effective date?",
    "qualified": "The proposal should not be treated as an operative rule without verification."
  },
  {
    "title": "Client update: options, risks and decision owner",
    "model": "Each option involves a different timing and risk trade-off.",
    "evidence": "The client has received two alternative recommendations.",
    "overclaim": "The adviser may choose on the client's behalf.",
    "question": "What are the verified risks and who has decision authority?",
    "qualified": "We can explain the alternatives, but the client must make the authorized decision."
  },
  {
    "title": "Investor briefing: cash flow and uncertainty",
    "model": "Higher revenue does not necessarily mean greater liquidity.",
    "evidence": "The company reported higher revenue and substantial upcoming payments.",
    "overclaim": "Higher revenue means unrestricted cash is available.",
    "question": "What cash balance and payment obligations are due this month?",
    "qualified": "Revenue alone does not establish available liquidity."
  },
  {
    "title": "Incident communications: facts before blame",
    "model": "We can confirm the outage but not its cause.",
    "evidence": "The incident report confirms a system outage.",
    "overclaim": "A named vendor caused the outage.",
    "question": "Which findings are supported by the completed investigation?",
    "qualified": "We can confirm the outage, but the cause remains unverified."
  },
  {
    "title": "Service negotiations: measurable promises",
    "model": "Please specify measurable response and resolution times.",
    "evidence": "The draft service agreement says 'prompt response'.",
    "overclaim": "The supplier promises a 24-hour response time.",
    "question": "What measurable response time and coverage hours will the parties agree?",
    "qualified": "The expression 'prompt response' requires a measurable definition."
  },
  {
    "title": "Feedback after a project: evidence and improvement",
    "model": "The handover succeeded but document reviews started late.",
    "evidence": "The retrospective records a late document-review start.",
    "overclaim": "The project team cannot manage deadlines.",
    "question": "Which review milestone could be scheduled earlier next time?",
    "qualified": "Reviews began late; an earlier milestone could reduce future delays."
  },
  {
    "title": "Executive decision memo: compare trade-offs",
    "model": "The lower initial cost may carry greater operational risk.",
    "evidence": "One project option has the lowest upfront price.",
    "overclaim": "That option also has the lowest total risk and cost.",
    "question": "Can we compare ongoing costs, operational impacts and assumptions?",
    "qualified": "The lower upfront price must be weighed against longer-term risks."
  },
  {
    "title": "Cross-cultural meetings: confirm decisions clearly",
    "model": "The proposal was discussed but has not been approved.",
    "evidence": "Meeting minutes record discussion of a proposal.",
    "overclaim": "All participants formally approved the proposal.",
    "question": "Can the decision owner confirm whether a final approval was recorded?",
    "qualified": "The proposal was discussed, but approval has not been confirmed."
  }
];
 if(cases.length!==24||new Set(cases.map(c=>c.title)).size!==24)throw Error('EnglishLegalese lesson bridge must preserve 24 unique original topics');
 const frozen=cases.map(c=>Object.freeze(c));
 Object.defineProperty(window,'EnglishLegaleseTeacherProtocolV1',{value:Object.freeze({
   project:'EnglishLegalese',
   protocol:'tr-clone/teacher-response-ladder/v1',
   sourceVersion:'TR-Clone V1.0 (verified offline source)',
   states:Object.freeze(['quiet','developing','confident']),
   runtimeConnected:false,
   aiInference:false,
   cases:Object.freeze(frozen),
   find(title){return frozen.find(c=>c.title===title)||null;}
 }),configurable:false,writable:false});
})();