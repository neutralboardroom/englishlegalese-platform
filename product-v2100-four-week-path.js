'use strict';
/* HF48: complete original eight-week cross-site curriculum map, four optional weeks per subject.
   Weekly plans are illustrative independent/teacher-facilitated exercises, not bookings or progress claims. */
(()=>{
 const titles=[
  "Client intake: verified facts",
  "Contract notices and deadlines",
  "Redlining: modal verbs and cost scope",
  "Witness interviews: open questions",
  "Negotiation: conditions and tentative terms",
  "Cross-border drafting: clarify meaning",
  "Quarterly reporting: balanced trends",
  "Project handovers: clear ownership",
  "Supplier negotiation: constructive trade-offs",
  "Investor relations: guidance and assumptions",
  "Performance reviews: observable feedback",
  "Board presentations: uncertainty and mitigation",
  "Research summary: sources versus conclusions",
  "Disclosure request: precise scope and privacy",
  "Mediation statement: interests without admissions",
  "Matter management: deadline and dependency updates",
  "Regulatory update: distinguish proposal from rule",
  "Client update: options, risks and decision owner",
  "Investor briefing: cash flow and uncertainty",
  "Incident communications: facts before blame",
  "Service negotiations: measurable promises",
  "Feedback after a project: evidence and improvement",
  "Executive decision memo: compare trade-offs",
  "Cross-cultural meetings: confirm decisions clearly"
];
 const weeks=[
  [
    "Legal English",
    1,
    "Verify facts before conclusions",
    [
      0,
      3,
      12
    ],
    "Give a 60-second factual update identifying a reported statement, a missing source and a safe next step.",
    "One learner states the facts; the partner asks what remains unverified."
  ],
  [
    "Legal English",
    2,
    "Contract meaning and precise obligations",
    [
      1,
      2,
      5
    ],
    "Explain one drafting ambiguity and request clarification of the intended obligation.",
    "Divide the group into counsel and client roles; review precise modal verbs."
  ],
  [
    "Legal English",
    3,
    "Collaborate without premature agreement",
    [
      4,
      13,
      14
    ],
    "Propose a conditional next step while protecting disputed positions and sensitive information.",
    "Ask partners to pause and identify unsupported concessions before responding."
  ],
  [
    "Legal English",
    4,
    "Client updates, deadlines and new rules",
    [
      15,
      16,
      17
    ],
    "Deliver a concise client briefing that separates confirmed duties from proposals and unknowns.",
    "Have the class use the same fictional facts to prepare alternative client emails."
  ],
  [
    "Business and Investor English",
    1,
    "Report results without guarantees",
    [
      6,
      9,
      18
    ],
    "Explain a commercial result, its comparison period, liquidity implications and one uncertainty.",
    "Ask a partner to challenge an overly confident investor statement politely."
  ],
  [
    "Business and Investor English",
    2,
    "Handover, feedback and responsibility",
    [
      7,
      10,
      21
    ],
    "Give a project update with named owners, an observed performance gap and next actions.",
    "Run paired manager and employee feedback using observable examples."
  ],
  [
    "Business and Investor English",
    3,
    "Negotiate service and incident response",
    [
      8,
      19,
      20
    ],
    "Offer a conditional supplier trade-off while stating realistic support and incident-update commitments.",
    "Use a two-team supplier meeting: one side proposes terms, the other asks for metrics."
  ],
  [
    "Business and Investor English",
    4,
    "Present executive and global decisions",
    [
      11,
      22,
      23
    ],
    "Give a short executive recommendation with risk, mitigation and confirmed decision ownership.",
    "Invite two-minute board-style presentations followed by neutral follow-up questions."
  ]
];
 const make=(tag,text,cls)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
 function route(index){
  if(index<12)return'/learn/continuing-practice/#practice-lesson-'+(index+1);
  return'/learn/continuing-practice/advanced/#'+(index<18?'legal-module-':'business-module-')+(index-11);
 }
 const wrap=document.querySelector('.v1971-wrap, .v1981-wrap');
 if(!wrap)return;
 const panel=make('details',undefined,'v2100-path');
 panel.append(make('summary','Follow a guided four-week professional English practice path'));
 panel.append(make('p','Choose a subject and a learning approach. Each suggested week combines three existing free lessons and a real speaking goal. This is not a booked class, official progress record, exam or certificate. You can start any week.','v2100-intro'));
 const controls=make('div',undefined,'v2100-controls');
 const trackLabel=make('label','Study subject');
 const track=make('select');track.setAttribute('aria-label','Practice-path subject');
 for(const subject of ['Legal English','Business and Investor English']){const option=make('option',subject);option.value=subject;track.append(option);}
 trackLabel.append(track);
 const modeLabel=make('label','Learning approach');
 const mode=make('select');mode.setAttribute('aria-label','Practice-path approach');
 for(const [value,name]of [['self','Independent speaking practice'],['teacher','Teacher-facilitated practice']]){const option=make('option',name);option.value=value;mode.append(option);}
 modeLabel.append(mode);
 controls.append(trackLabel,modeLabel);panel.append(controls);
 const results=make('div',undefined,'v2100-weeks');panel.append(results);
 const foot=make('p','After each weekly set, speak or write one fictional, evidence-aware professional response. Your private drafts remain in their original lesson pages and are not stored by this plan.','v2100-footnote');
 panel.append(foot);
 const render=()=>{
  results.replaceChildren();
  const plan=weeks.filter(row=>row[0]===track.value);
  for(const row of plan){
   const week=make('section',undefined,'v2100-week');
   week.append(make('h3','Week '+row[1]+' · '+row[2]));
   const names=make('ol',undefined,'v2100-links');
   for(const i of row[3]){
    const li=make('li');
    const link=make('a',titles[i]);link.href=route(i);
    li.append(link);names.append(li);
   }
   week.append(names);
   week.append(make('p','Speaking outcome: '+row[4],'v2100-goal'));
   week.append(make('p',mode.value==='teacher'?'Teacher approach: '+row[5]:'Independent approach: practise the three lessons, rehearse your own response aloud, then revisit an example answer.','v2100-mode'));
   results.append(week);
  }
 };
 track.addEventListener('change',render);
 mode.addEventListener('change',render);
 render();
 const finder=document.querySelector('.v2050-finder');
 if(finder)finder.after(panel);else wrap.before(panel);
 // Keep long professional practice pages approachable on tablets and phones.
 // Group the four new optional tools while preserving all controls and content.
 for(const article of document.querySelectorAll('article.v1971-lesson')){
  const selectors=['.v2060-differentiation','.v2070-questions','.v2080-clarification','.v2090-actions'];
  const tools=selectors.map(s=>article.querySelector(s));
  if(tools.some(node=>!node))continue;
  const details=make('details',undefined,'v2100-more-tools');
  details.append(make('summary','More speaking practice, teacher questions and printable worksheets'));
  details.append(make('p','Choose a supported challenge, ask more professional questions, practise clarification or preview a printable worksheet. These optional resources do not record your answers.','v2100-more-intro'));
  for(const tool of tools)details.append(tool);
  // Keep the long-page footprint no larger than HF43: the existing speaking
  // rehearsal is already a visible opt-in disclosure on every lesson.
  const rehearsal=article.querySelector('details.v1990-speaking');
  if(rehearsal)rehearsal.append(details);
  else article.append(details);
 }
})();
