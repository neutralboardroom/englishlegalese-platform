'use strict';
/* HF52: flexible 15/30-minute adult EnglishLegalese micro-clinic facilitation,
   with an actual learner-only preview containing no facilitator cues or private drafts. */
(()=>{
 const data=window.EnglishLegaleseTeacherProtocolV1;
 if(!data||data.project!=='EnglishLegalese'||data.protocol!=='tr-clone/teacher-response-ladder/v1'||data.runtimeConnected) return;
 const make=(tag,text,cls)=>{
  const el=document.createElement(tag);if(cls)el.className=cls;
  if(text!==undefined)el.textContent=text;return el;
 };

 const plans={
  15:[[0,2,'Quick factual opening'],[2,5,'Model one complete sentence'],[5,10,'Partner question and response'],[10,13,'Check uncertainty and clarify'],[13,15,'Repeat and summarize']],
  30:[[0,4,'Accessible opening'],[4,9,'Listen, rehearse, and stress key information'],[9,17,'First partner exchange'],[17,23,'Swap roles and challenge assumptions'],[23,27,'Clarify and repair a premature conclusion'],[27,30,'Speak one improved summary']]
 };
 for(const card of document.querySelectorAll('article.v1971-lesson')){
  const c=data.find(card.querySelector('h3')?.textContent?.trim());
  const host=card.querySelector('details.v2100-more-tools');if(!c||!host)continue;
  const wrap=make('details',undefined,'v2140-mini-clinic');
  wrap.append(make('summary','15- or 30-minute speaking clinic · flexible facilitator plan'));
  wrap.append(make('p','An optional instructor-led plan for adult professionals. Manual pacing only, without enrollment, attendance or learner tracking. Full 50-minute sessions remain available in the original teacher guide.','v2140-intro'));
  const modes=make('div',undefined,'v2140-controls');
  for(const minutes of [15,30]){
   const button=make('button',minutes+'-minute plan');button.type='button';
   button.addEventListener('click',()=>render(minutes));
   modes.append(button);
  }
  wrap.append(modes);
  const result=make('section',undefined,'v2140-plan');result.setAttribute('aria-live','polite');wrap.append(result);
  const showPreview=make('button','Open learner-only clinic preview');showPreview.type='button';wrap.append(showPreview);
  let selected=15;
  function render(minutes){
   selected=minutes;result.replaceChildren();
   result.append(make('h4',minutes+'-minute guided practice: '+c.title));
   const list=make('ol',undefined,'v2140-phases');
   for(const [from,to,name]of plans[minutes]){
    const li=make('li',from+'–'+to+' min · '+name);list.append(li);
   }
   result.append(list);
   result.append(make('p','Sample sentence: '+c.model));
   result.append(make('p','Partner check: '+c.question));
   for(const button of modes.querySelectorAll('button'))button.setAttribute('aria-pressed',button.textContent.startsWith(String(minutes)+'-')?'true':'false');
  }
  render(15);
  showPreview.addEventListener('click',()=>{
   const dialog=make('dialog',undefined,'v2140-learner-dialog');
   dialog.setAttribute('aria-label','EnglishLegalese learner-only speaking prompts');
   const heading=make('h2','EnglishLegalese · '+selected+'-minute speaking clinic');
   const cards=[
    ['1. Speak clearly','Use one complete sentence to communicate the available fact: '+c.evidence],
    ['2. Explain what is not verified','This claim may be premature: '+c.overclaim],
    ['3. Ask an accurate question','Ask your partner: '+c.question]
   ];
   let index=0;
   const step=make('p','','v2140-slide-count'),content=make('p','','v2140-slide-content');
   const nav=make('div',undefined,'v2140-dialog-controls');
   const back=make('button','Previous prompt'),next=make('button','Next prompt'),close=make('button','Close learner preview');
   for(const b of [back,next,close])b.type='button';
   nav.append(back,next,close);dialog.append(heading,step,content,nav);
   const paint=()=>{
    step.textContent='Prompt '+(index+1)+' of 3 · '+cards[index][0];
    content.textContent=cards[index][1];back.disabled=index===0;next.disabled=index===2;
   };
   back.addEventListener('click',()=>{if(index>0){index--;paint();}});
   next.addEventListener('click',()=>{if(index<2){index++;paint();}});
   close.addEventListener('click',()=>dialog.close());
   dialog.addEventListener('close',()=>dialog.remove(),{once:true});
   document.body.append(dialog);paint();
   if(typeof dialog.showModal==='function')dialog.showModal();else{dialog.setAttribute('open','');close.focus();}
  });
  host.append(wrap);
 }
})();