'use strict';
/* HF51: evidence discipline in EnglishLegalese adult professional communication.
   Fixed fictional data, no AI grading or private data ingestion. */
(()=>{
 const data=window.EnglishLegaleseTeacherProtocolV1;
 if(!data||data.project!=='EnglishLegalese'||data.protocol!=='tr-clone/teacher-response-ladder/v1'||data.runtimeConnected) return;
 const make=(tag,text,cls)=>{
  const el=document.createElement(tag);if(cls)el.className=cls;
  if(text!==undefined)el.textContent=text;return el;
 };

 for(const card of document.querySelectorAll('article.v1971-lesson')){
  const c=data.find(card.querySelector('h3')?.textContent?.trim());
  const host=card.querySelector('details.v2100-more-tools');if(!c||!host)continue;
  const wrap=make('details',undefined,'v2130-evidence-check');
  wrap.append(make('summary','Evidence or assumption? · professional judgment practice'));
  wrap.append(make('p','Fictional practice only. Identify the statement that claims more than the information supports. This is not legal advice, a test, or an automatic proficiency score.','v2130-intro'));
  wrap.append(make('h4','Which statement makes an unsupported leap?'));
  const choices=make('div',undefined,'v2130-choices');
  const feedback=make('p','','v2130-feedback');feedback.setAttribute('aria-live','polite');
  const options=[
   ['A',c.evidence,false],
   ['B',c.overclaim,true],
   ['C',c.question,false]
  ];
  for(const [letter,phrase,isLeap]of options){
   const btn=make('button',letter+'. '+phrase);btn.type='button';
   btn.addEventListener('click',()=>{
    for(const other of choices.querySelectorAll('button'))other.setAttribute('aria-pressed',other===btn?'true':'false');
    feedback.textContent=isLeap
     ?'Yes. This statement goes beyond the fictional evidence. Replace it with a qualified statement or a verification question.'
     :'This is '+(letter==='A'?'the fact actually supplied in the fictional record.':'a reasonable request for more information.')+' Look for the claim that assumes something not yet verified.';
   });
   btn.setAttribute('aria-pressed','false');choices.append(btn);
  }
  wrap.append(choices,feedback);
  const model=make('details',undefined,'v2130-repair');
  model.append(make('summary','Show an evidence-bound professional response'),make('p',c.qualified),make('p','Verification question: '+c.question));
  wrap.append(model);
  const reset=make('button','Try the three statements again');reset.type='button';
  reset.addEventListener('click',()=>{feedback.textContent='';for(const btn of choices.querySelectorAll('button'))btn.setAttribute('aria-pressed','false');});
  wrap.append(reset);host.append(wrap);
 }
})();