'use strict';
/* HF47: privacy-safe local print pack. All content derives from published fixed exercises;
   never read learner textarea, credentials, teacher accounts or uploaded private work. */
(()=>{
 const make=(tag,text,cls)=>{
  const el=document.createElement(tag);
  if(cls)el.className=cls;
  if(text!==undefined)el.textContent=text;
  return el;
 };
 function fixedTexts(scope,selector){
  return [...scope.querySelectorAll(selector)].map(e=>e.textContent.trim()).filter(Boolean);
 }
 function section(sheet,title,items,ordered=false){
  const heading=make('h3',title);
  const list=make(ordered?'ol':'ul',undefined,'v2090-lines');
  for(const item of items)list.append(make('li',item));
  sheet.append(heading,list);
 }
 for(const article of document.querySelectorAll('article.v1971-lesson')){
  const title=article.querySelector('h3')?.textContent?.trim();
  const problem=article.querySelector('.v2080-message')?.textContent?.trim();
  const model=article.querySelector('.v2080-model');
  if(!title||!problem||!model)continue;
  const actions=make('section',undefined,'v2090-actions');
  actions.setAttribute('aria-label','Printable practice packet for '+title);
  actions.append(make('p','Print a student worksheet or a separate teacher guide. Private typed drafts are never included. Preview the pages before printing.','v2090-help'));
  const student=make('button','Preview student worksheet');student.type='button';
  const teacher=make('button','Preview teacher notes');teacher.type='button';
  actions.append(student,teacher);
  article.append(actions);
  function preview(isTeacher){
   const dialog=make('dialog',undefined,'v2090-preview');
   dialog.setAttribute('aria-label',(isTeacher?'Teacher notes':'Student worksheet')+' for '+title);
   const sheet=make('div',undefined,'v2090-paper');
   sheet.append(make('h2',(isTeacher?'Teacher preparation notes':'Student practice worksheet')+' · '+title));
   sheet.append(make('p','EnglishLegalese · Original fictional professional English speaking practice. No real client information or personal details.','v2090-disclaimer'));
   section(sheet,'Understand the message',[problem]);
   section(sheet,'Complete the speaking tasks',[
    'Explain the message without adding an unverified fact.',
    'Name one important piece of information that is still missing.',
    'Ask a polite clarification question and confirm your next action.'
   ],true);
   const scaffolds=fixedTexts(article,'.v2060-option>p').slice(0,2);
   section(sheet,'Choose your speaking challenge',scaffolds);
   const questions=fixedTexts(article,'.v2070-question').slice(0,3);
   section(sheet,'Questions to practise with a partner',questions,true);
   sheet.append(make('p','Write one useful follow-up sentence on the lines below:'));
   for(let i=0;i<3;i++)sheet.append(make('div','', 'v2090-writing-line'));
   if(isTeacher){
    sheet.append(make('h3','Instructor-only answer key and facilitation notes'));
    section(sheet,'Clarification models',fixedTexts(model,'p'));
    section(sheet,'Additional teacher model responses',fixedTexts(article,'.v2070-answer p').slice(0,3),true);
    section(sheet,'Fifty-minute lesson stages',fixedTexts(article,'.v2040-timeline>li>strong'));
    sheet.append(make('p','Keep teacher answers out of the student-facing projection. Preview translations before using them. This worksheet does not establish completion, attendance, assessment or certification.','v2090-teacher-caution'));
   }
   dialog.append(sheet);
   const nav=make('div',undefined,'v2090-preview-controls');
   const print=make('button','Print this '+(isTeacher?'teacher guide':'student worksheet'));print.type='button';
   const close=make('button','Close preview');close.type='button';
   nav.append(print,close);
   dialog.append(nav);
   document.body.append(dialog);
   print.addEventListener('click',()=>window.print());
   close.addEventListener('click',()=>dialog.close());
   dialog.addEventListener('close',()=>dialog.remove(),{once:true});
   if(typeof dialog.showModal==='function')dialog.showModal();
   else{dialog.setAttribute('open','');close.focus();}
  }
  student.addEventListener('click',()=>preview(false));
  teacher.addEventListener('click',()=>preview(true));
 }
})();
