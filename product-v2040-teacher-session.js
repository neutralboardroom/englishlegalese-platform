'use strict';
/* HF42: 50-minute, teacher-controlled classroom activity with true learner-only projection.
   No student roster, private content, audio capture, AI assessment, booking or data submission. */
(()=>{
 const phases=[
  {start:0,end:4,name:'Hook and one-sentence answer',instruction:'Ask the class to answer one simple question in a complete sentence.'},
  {start:4,end:10,name:'Key words and pronunciation',instruction:'Model three useful words from the lesson. Ask students to repeat naturally, then form a sentence.'},
  {start:10,end:18,name:'Teacher demonstration',instruction:'Model the A and B exchange with a partner. Repeat more slowly; ask students what remains unknown.'},
  {start:18,end:28,name:'Partner speaking round one',instruction:'Students practise the dialogue in pairs. They should use full sentences rather than one-word replies.'},
  {start:28,end:36,name:'Switch roles and clarify',instruction:'Partners exchange roles. Add the follow-up question and ask for a reason or evidence.'},
  {start:36,end:43,name:'Two-person front-of-room demonstration',instruction:'Invite one or two volunteers to the front near the teacher microphone. Do not pass a mic around the class.'},
  {start:43,end:48,name:'Feedback, improve and repeat',instruction:'Give specific supportive feedback on one clear expression and one correction. Students repeat their improved sentence.'},
  {start:48,end:50,name:'Short exit response',instruction:'Ask every learner to give one useful sentence or write it privately. No scores, grades or implied certification.'}
 ];
 const make=(tag,content,cls)=>{
  const node=document.createElement(tag);
  if(cls)node.className=cls;
  if(content!==undefined)node.textContent=content;
  return node;
 };
 const schedule=phases.map(p=>p.end-p.start).reduce((a,b)=>a+b,0);
 if(schedule!==50)throw Error('Teacher session must total fifty minutes');
 for(const lesson of document.querySelectorAll('article.v1971-lesson')){
  const title=lesson.querySelector('h3')?.textContent?.trim();
  const lines=[...lesson.querySelectorAll('.v2020-lines li')].map(el=>el.textContent.trim());
  const finish=lesson.querySelector('.v2020-model p')?.textContent?.trim();
  if(!title||lines.length!==3||!finish)continue;
  const guide=make('details',undefined,'v2040-teacher');
  guide.append(make('summary','Teacher guide · complete 50-minute classroom plan'));
  guide.append(make('p','Facilitator notes below are for the teacher. Projector mode shows only student-facing prompts, never this answer key. Preview text and any translations before presenting. Use fictional examples; live class availability is not implied.','v2040-teacher-note'));
  const timeline=make('ol',undefined,'v2040-timeline');
  for(const [i,phase] of phases.entries()){
   const item=make('li');
   item.append(make('strong',phase.start+'–'+phase.end+' min · '+phase.name));
   item.append(make('p',phase.instruction));
   if(i===0)item.append(make('p','Ask: '+lines[0]));
   if(i===1)item.append(make('p','Say: “Listen, repeat, and tell your partner what this professional word means.”'));
   if(i===2)item.append(make('p','Teacher model: '+lines[1]));
   if(i===3)item.append(make('p','Partner prompt: '+lines[0]+' Model reply: '+lines[1]));
   if(i===4)item.append(make('p','Follow-up prompt: '+lines[2]));
   if(i===5)item.append(make('p','Volunteer prompt: '+lines[0]+' Ask the partner to respond naturally.'));
   if(i===6)item.append(make('p','Improved sample sentence: '+finish));
   if(i===7)item.append(make('p','Exit question: '+lines[2]));
   timeline.append(item);
  }
  guide.append(timeline);
  const actions=make('div',undefined,'v2040-teacher-actions');
  const start=make('button','Preview student-only projector slides');
  start.type='button';
  actions.append(start);
  guide.append(actions);
  const dialogue=lesson.querySelector('.v2020-dialogue');
  if(dialogue)dialogue.after(guide);else lesson.append(guide);
  const studentPrompts=[
   ['1 · Start','Speak in one complete sentence: '+lines[0]],
   ['2 · Vocabulary','Choose three useful professional words from this lesson. Say each word and make your own sentence.'],
   ['3 · Listen','Listen to a model professional exchange. What information is still missing?'],
   ['4 · Pair round 1','Partner A: '+lines[0]+' Partner B: answer with one or two full sentences.'],
   ['5 · Swap roles','Now switch roles. Ask: '+lines[2]],
   ['6 · Share','Two volunteers can demonstrate the conversation near the teacher desk. Everyone else listens for a clear main idea.'],
   ['7 · Improve','Choose one expression to improve. Say your revised sentence clearly and at a comfortable pace.'],
   ['8 · Exit','Answer briefly: '+lines[2]]
  ];
  start.addEventListener('click',()=>{
   const dialog=make('dialog',undefined,'v2040-stage');
   dialog.setAttribute('aria-label','Student projector view: '+title);
   const head=make('div',undefined,'v2040-stage-head');
   const heading=make('h2',title);
   const progress=make('p','', 'v2040-progress');
   head.append(heading,progress);
   const content=make('p','','v2040-stage-prompt');
   const nav=make('div',undefined,'v2040-stage-actions');
   const previous=make('button','Previous');previous.type='button';
   const next=make('button','Next');next.type='button';
   const close=make('button','Close projector view');close.type='button';
   nav.append(previous,next,close);
   dialog.append(head,content,nav);
   document.body.append(dialog);
   let current=0;
   function show(){
    const [label,prompt]=studentPrompts[current];
    progress.textContent=label+' · '+(current+1)+' of '+studentPrompts.length;
    content.textContent=prompt;
    previous.disabled=current===0;
    next.disabled=current===studentPrompts.length-1;
   }
   previous.addEventListener('click',()=>{if(current>0){current--;show();}});
   next.addEventListener('click',()=>{if(current<studentPrompts.length-1){current++;show();}});
   close.addEventListener('click',()=>dialog.close());
   dialog.addEventListener('close',()=>dialog.remove(),{once:true});
   show();
   if(typeof dialog.showModal==='function')dialog.showModal();
   else {dialog.setAttribute('open','');close.focus();}
  });
 }
})();
