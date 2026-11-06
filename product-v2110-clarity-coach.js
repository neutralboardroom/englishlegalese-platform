'use strict';
/* HF49 original topic-specific clarity/prosody coaching.
   Uses fixed fictional text and optional device speech; no recording, learner text, analytics or scores. */
(()=>{
 const records=[
  [
    "Client intake: verified facts",
    "We must verify the signed delivery schedule before advising.",
    "We must VERIFY / the signed delivery schedule / before advising.",
    "verify",
    "Which schedule is confirmed?",
    "We still need to check the signed delivery schedule."
  ],
  [
    "Contract notices and deadlines",
    "Please confirm the notice deadline and delivery method.",
    "Please CONFIRM / the notice deadline / and delivery method.",
    "confirm",
    "May we send the notice by email?",
    "We must check the agreed notice clause before deciding."
  ],
  [
    "Redlining: modal verbs and cost scope",
    "The word may changes the obligation into a possibility.",
    "The word MAY / changes the obligation / into a possibility.",
    "may",
    "Does the new wording require payment?",
    "It appears discretionary, but the full clause must be reviewed."
  ],
  [
    "Witness interviews: open questions",
    "Please describe what happened after the meeting began.",
    "Please DESCRIBE / what happened / after the meeting began.",
    "describe",
    "Do you know the exact time?",
    "I remember the sequence, but I cannot confirm the time."
  ],
  [
    "Negotiation: conditions and tentative terms",
    "We could consider the proposal subject to final approval.",
    "We could CONSIDER / the proposal / subject to final approval.",
    "consider",
    "Have you formally accepted our proposal?",
    "Not yet. We still need internal approval and final wording."
  ],
  [
    "Cross-border drafting: clarify meaning",
    "Could you clarify whether the deadline means business days?",
    "Could you CLARIFY / whether the deadline / means business days?",
    "clarify",
    "Are weekends included in the deadline?",
    "We need to confirm how the agreement counts the days."
  ],
  [
    "Quarterly reporting: balanced trends",
    "Revenue improved this quarter but the trend remains uncertain.",
    "Revenue IMPROVED / this quarter / but the trend remains uncertain.",
    "improved",
    "Is this improvement expected to continue?",
    "We need more periods of data before asserting a lasting trend."
  ],
  [
    "Project handovers: clear ownership",
    "The project manager will deliver the revised plan on Wednesday.",
    "The project MANAGER / will deliver the revised plan / on Wednesday.",
    "manager",
    "Who will check the final draft?",
    "I will review it on Thursday and flag open questions."
  ],
  [
    "Supplier negotiation: constructive trade-offs",
    "We can discuss a lower price if volumes are confirmed.",
    "We can DISCUSS / a lower price / if volumes are confirmed.",
    "discuss",
    "Is the lower price already agreed?",
    "No. The price depends on confirmed quantities and delivery terms."
  ],
  [
    "Investor relations: guidance and assumptions",
    "The forecast depends on assumptions about future demand.",
    "The FORECAST / depends on assumptions / about future demand.",
    "forecast",
    "Does the outlook guarantee returns?",
    "No. Actual results may differ from the forecast."
  ],
  [
    "Performance reviews: observable feedback",
    "The weekly reports arrived after the agreed deadline.",
    "The weekly REPORTS / arrived after / the agreed deadline.",
    "reports",
    "What would help next month?",
    "An earlier checkpoint would make delays easier to flag."
  ],
  [
    "Board presentations: uncertainty and mitigation",
    "The supplier interruption could delay our proposed launch.",
    "The supplier INTERRUPTION / could delay / our proposed launch.",
    "interruption",
    "What action should the board consider?",
    "We suggest reviewing an alternative supplier before deciding."
  ],
  [
    "Research summary: sources versus conclusions",
    "We must check whether the authority applies in this jurisdiction.",
    "We must CHECK / whether the authority applies / in this jurisdiction.",
    "check",
    "Can we rely on this decision already?",
    "Not until we verify its status and jurisdictional relevance."
  ],
  [
    "Disclosure request: precise scope and privacy",
    "Please limit the request to relevant project correspondence.",
    "Please LIMIT / the request / to relevant project correspondence.",
    "limit",
    "Are private messages automatically included?",
    "No. Scope, relevance and privilege need careful review."
  ],
  [
    "Mediation statement: interests without admissions",
    "We can discuss a timetable without admitting responsibility.",
    "We can DISCUSS / a timetable / without admitting responsibility.",
    "discuss",
    "Does this mean your side accepts fault?",
    "No. We are exploring practical options without conceding facts."
  ],
  [
    "Matter management: deadline and dependency updates",
    "The filing date depends on receiving the missing documents.",
    "The filing DATE / depends on receiving / the missing documents.",
    "date",
    "Can we guarantee filing this Friday?",
    "We must review the remaining documents before confirming."
  ],
  [
    "Regulatory update: distinguish proposal from rule",
    "The proposed regulation has not yet entered into force.",
    "The proposed REGULATION / has not yet / entered into force.",
    "regulation",
    "Is compliance mandatory today?",
    "We should check the current rule and the final effective date."
  ],
  [
    "Client update: options, risks and decision owner",
    "Each option involves a different timing and risk trade-off.",
    "Each OPTION / involves a different timing / and risk trade-off.",
    "option",
    "Which option must the client choose?",
    "The client decides after we explain the verified considerations."
  ],
  [
    "Investor briefing: cash flow and uncertainty",
    "Higher revenue does not necessarily mean greater liquidity.",
    "Higher REVENUE / does not necessarily mean / greater liquidity.",
    "revenue",
    "Can we make the investment immediately?",
    "We should verify cash balances and upcoming obligations first."
  ],
  [
    "Incident communications: facts before blame",
    "We can confirm the outage but not its cause.",
    "We can CONFIRM / the outage / but not its cause.",
    "confirm",
    "Do you know who caused the interruption?",
    "The investigation is continuing; the cause is not confirmed."
  ],
  [
    "Service negotiations: measurable promises",
    "Please specify measurable response and resolution times.",
    "Please SPECIFY / measurable response / and resolution times.",
    "specify",
    "Does excellent service mean 24-hour coverage?",
    "Only if coverage and response targets are expressly agreed."
  ],
  [
    "Feedback after a project: evidence and improvement",
    "The handover succeeded but document reviews started late.",
    "The HANDOVER / succeeded / but document reviews started late.",
    "handover",
    "What would you change on the next project?",
    "We would add an earlier review milestone and a named owner."
  ],
  [
    "Executive decision memo: compare trade-offs",
    "The lower initial cost may carry greater operational risk.",
    "The lower initial COST / may carry / greater operational risk.",
    "cost",
    "Is the cheapest option always the strongest?",
    "No. We should compare total costs and uncertainties."
  ],
  [
    "Cross-cultural meetings: confirm decisions clearly",
    "The proposal was discussed but has not been approved.",
    "The proposal was DISCUSSED / but has not / been approved.",
    "discussed",
    "Can I tell the team the decision is final?",
    "Not yet. Please confirm the recorded decision and next owner."
  ]
];
 const byTitle=new Map(records.map(row=>[row[0],row]));
 const make=(tag,content,cls)=>{
  const node=document.createElement(tag);
  if(cls)node.className=cls;
  if(content!==undefined)node.textContent=content;
  return node;
 };
 const synth=typeof window.speechSynthesis==='object'?window.speechSynthesis:null;
 const canSpeak=!!(synth&&typeof window.SpeechSynthesisUtterance==='function');
 let active=null;
 function stopSpeech(message){
  if(!active)return;
  const prior=active;active=null;
  try{synth?.cancel();}catch{}
  prior.play.disabled=false;
  prior.stop.disabled=true;
  prior.status.textContent=message||'Playback stopped. Read the written phrase aloud instead.';
 }
 for(const card of document.querySelectorAll('article.v1971-lesson')){
  const title=card.querySelector('h3')?.textContent?.trim(),row=byTitle.get(title);
  const host=card.querySelector('details.v2100-more-tools');
  if(!row||!host)continue;
  const panel=make('details',undefined,'v2110-prosody');
  panel.append(make('summary','Clear speaking lab · phrase stress, rhythm and listener checks'));
  panel.append(make('p','Practice intelligibility, not accent imitation. Start with short thought groups, then speak a natural complete sentence. Speak with a partner using only fictional information. No microphone or automated pronunciation grade.','v2110-intro'));
  panel.append(make('h4','1. Say the message in short thought groups'));
  panel.append(make('p',row[2],'v2110-chunk-script'));
  const chunks=row[2].split(' / ');
  const chunkProgress=make('p','','v2110-chunk-progress');
  chunkProgress.setAttribute('aria-live','polite');
  const next=make('button','Next thought group');next.type='button';
  const restart=make('button','Start groups again');restart.type='button';
  const phraseControls=make('div',undefined,'v2110-controls');
  phraseControls.append(next,restart);panel.append(chunkProgress,phraseControls);
  let position=0;
  function showChunk(){
   chunkProgress.textContent='Thought group '+(position+1)+' of '+chunks.length+': '+chunks[position];
   next.disabled=position>=chunks.length-1;
  }
  next.addEventListener('click',()=>{if(position<chunks.length-1){position++;showChunk();}});
  restart.addEventListener('click',()=>{position=0;showChunk();});
  showChunk();
  panel.append(make('h4','2. Stress the word that makes your meaning clear'));
  const stress=make('p','Emphasize: '+row[3]+'. Then say the complete sentence without losing the other words.','v2110-stress');
  panel.append(stress,make('p',row[1],'v2110-phrase'));
  const controls=make('div',undefined,'v2110-controls');
  const play=make('button','Hear the full phrase');play.type='button';
  const stop=make('button','Stop phrase playback');stop.type='button';stop.disabled=true;
  const label=make('label','Pace: ');
  const pace=make('select');pace.setAttribute('aria-label','Clarity-lab speaking pace for '+title);
  for(const [value,name]of [['0.8','Slow'],['1','Natural']]){
   const option=make('option',name);option.value=value;
   if(value==='1')option.selected=true;pace.append(option);
  }
  label.append(pace);controls.append(play,stop,label);panel.append(controls);
  const status=make('p','','v2110-audio-status');status.setAttribute('aria-live','polite');
  if(!canSpeak){play.disabled=true;status.textContent='Browser audio unavailable. Read the complete sentence aloud.';}
  panel.append(status);
  const task={play,stop,status};
  play.addEventListener('click',()=>{
   if(!canSpeak){status.textContent='Use the written phrase instead.';return;}
   stopSpeech();
   try{
    const voice=new window.SpeechSynthesisUtterance(row[1]);
    voice.lang='en-US';voice.rate=Number(pace.value);voice.pitch=1;
    voice.onend=()=>{if(active===task){active=null;play.disabled=false;stop.disabled=true;status.textContent='Model finished. Now speak the sentence in your own voice.';}};
    voice.onerror=()=>{if(active===task){active=null;play.disabled=false;stop.disabled=true;status.textContent='Device speech unavailable. Read the phrase aloud instead.';}};
    active=task;play.disabled=true;stop.disabled=false;
    status.textContent='Browser speech requested. Check your selected output speaker if you are teaching a class.';
    synth.cancel();synth.speak(voice);
   }catch{
    if(active===task)active=null;
    play.disabled=false;stop.disabled=true;
    status.textContent='Device voice unavailable. Read the phrase aloud instead.';
   }
  });
  stop.addEventListener('click',()=>stopSpeech());
  panel.append(make('h4','3. Check that your partner understood'));
  panel.append(make('p','Partner question: '+row[4],'v2110-listener-question'));
  const model=make('details',undefined,'v2110-listener-model');
  model.append(make('summary','Reveal an example response after speaking'),make('p',row[5]));
  panel.append(model);
  panel.append(make('p','Teacher cue: after the learner answers, ask the partner to paraphrase. Give one specific observation about clear stress or phrasing, then repeat. Accent similarity is not the goal.','v2110-teacher-cue'));
  const self=make('fieldset',undefined,'v2110-selfcheck');
  self.append(make('legend','Private practice checklist · not a test'));
  for(const text of ['I used short thought groups.','I stressed the important word.','My listener could explain the main idea.']){
   const label=make('label');
   const box=make('input');box.type='checkbox';
   label.append(box,document.createTextNode(' '+text));self.append(label);
  }
  const reset=make('button','Reset my private checklist');reset.type='button';
  reset.addEventListener('click',()=>self.querySelectorAll('input[type=checkbox]').forEach(el=>{el.checked=false;}));
  self.append(reset);panel.append(self);
  panel.addEventListener('toggle',()=>{if(!panel.open&&active===task)stopSpeech();});
  host.append(panel);
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSpeech();});
 window.addEventListener('pagehide',()=>stopSpeech());
})();