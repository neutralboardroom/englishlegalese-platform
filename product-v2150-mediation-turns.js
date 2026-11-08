'use strict';
/* HF54: adult professional meaning-repair practice. Fixed fictional lesson text only.
   No AI session, audio capture, personal data, scores, analytics or cross-project calls.
   Loaded only on two existing lesson pages, inside an already closed tools disclosure. */
(()=>{
 const data=window.EnglishLegaleseTeacherProtocolV1;
 if(!data || data.project!=='EnglishLegalese' ||
    data.protocol!=='tr-clone/teacher-response-ladder/v1' ||
    data.runtimeConnected || data.aiInference) return;

 const make=(tag,text,className)=>{
  const node=document.createElement(tag);
  if(className)node.className=className;
  if(text!==undefined)node.textContent=text;
  return node;
 };

 for(const card of document.querySelectorAll('article.v1971-lesson')){
  const title=card.querySelector('h3')?.textContent?.trim();
  const topic=data.find(title);
  const tools=card.querySelector('details.v2100-more-tools');
  if(!topic||!tools||tools.querySelector('.v2150-mediation-turns'))continue;

  const activity=make('details',undefined,'v2150-mediation-turns');
  activity.append(make('summary','Meaning-repair dialogue · partner speaking and clarification'));
  activity.append(make('p',
   'Practice conveying a fictional record accurately, checking what a partner understood, and repairing an unsupported conclusion. Speak with a partner or rehearse both roles yourself. No microphone, submission, AI grading, teacher assessment or certificate.',
   'v2150-disclosure'));
  const rounds=[
   {heading:'Turn 1 of 4 · Speaker A: relay the facts',
    speak:'Describe the information to your colleague in one complete sentence: '+topic.evidence,
    respond:'Speaker B: Paraphrase what is actually verified. Do not add a fact that is not in the record.'},
   {heading:'Turn 2 of 4 · Speaker B: clarify the uncertainty',
    speak:'Ask an open professional clarification question: '+topic.question,
    respond:'Speaker A: Explain what remains unknown. It is acceptable to say that the record does not establish the answer.'},
   {heading:'Turn 3 of 4 · Speaker A: repair a misunderstanding',
    speak:'Your colleague concluded: '+topic.overclaim,
    respond:'Explain politely why that is an unsupported leap; distinguish observed facts from assumptions.'},
   {heading:'Turn 4 of 4 · Both partners: confirm shared understanding',
    speak:'Offer an accurately qualified summary without claiming a conclusion you cannot verify.',
    respond:'Compare your answer with the original model below, then ask the partner what would need checking next.'}
  ];
  let index=0;
  const stage=make('section',undefined,'v2150-current-turn');
  stage.setAttribute('aria-live','polite');
  stage.setAttribute('aria-atomic','true');
  const controls=make('div',undefined,'v2150-turn-controls');
  const previous=make('button','Previous turn');
  const next=make('button','Next turn');
  for(const button of [previous,next]){button.type='button';controls.append(button);}
  const model=make('details',undefined,'v2150-model');
  model.append(make('summary','Show a carefully qualified model after speaking'),
   make('p',topic.qualified),
   make('p','Follow-up verification question: '+topic.question));
  function render(){
   const turn=rounds[index];
   stage.replaceChildren(make('h4',turn.heading),
    make('p',turn.speak),
    make('p',turn.respond));
   previous.disabled=index===0;
   next.disabled=index===rounds.length-1;
   next.textContent=index===rounds.length-1?'Last turn':'Next turn';
  }
  previous.addEventListener('click',()=>{if(index>0){index--;render();}});
  next.addEventListener('click',()=>{if(index<rounds.length-1){index++;render();}});
  activity.append(stage,controls,model);
  render();
  tools.append(activity);
 }
})();
