/* EnglishLegalese v1.86.0: Complete subject-page curricula. Client-side educational preview only.
   EL-RGR-023 + EL-DUR-011: NEVER send, queue, schedule, or activate emails. */
(()=>{'use strict';
const data=window.ELCURRICULUM_V1800;
if(!data||!Array.isArray(data.records)||data.records.length!==28)return;
const make=(tag,txt,cls)=>{const n=document.createElement(tag);if(txt!==undefined)n.textContent=txt;if(cls)n.className=cls;return n;};
const legalGroups=[
 ['Core professional','Core professional English'],
 ['Legal specialties','Legal specialties'],
 ['International & academic','International and academic Legal English']
];
function addSection(parent,heading,node){
 const section=make('section',undefined,'v1860-detail-section');
 section.append(make('h5',heading),node);parent.append(section);
}
function legalCourse(c){
 const article=make('article',undefined,'v1860-course-card');
 article.id='v1860-topic-'+c.id;
 const head=make('div',undefined,'v1860-course-head');
 head.append(make('p',c.group+' · '+c.level,'v1860-course-tag'),make('h4',c.title),make('p',c.outcome,'v1860-outcome'));
 article.append(head);
 const lesson=make('div',undefined,'v1860-always-outline');
 lesson.append(make('h5','Four-lesson course outline'));
 const ol=make('ol');
 c.units.forEach((u,i)=>ol.append(make('li','Lesson '+(i+1)+': '+u)));
 lesson.append(ol);article.append(lesson);
 const detail=make('details',undefined,'v1860-full-material');
 const summary=make('summary','Full vocabulary, exercises, homework and teacher materials');
 const panel=make('div',undefined,'v1860-full-panel');
 const glossary=make('dl',undefined,'v1860-glossary');
 c.vocab.forEach(pair=>glossary.append(make('dt',pair[0]),make('dd',pair[1])));
 addSection(panel,'Course vocabulary and definitions',glossary);
 const ex=make('div');
 ex.append(make('p','Fictional practice situation: '+c.scenario));
 const choices=[c.good,...c.distractors];
 const form=make('form',undefined,'v1860-selfcheck');
 const field=make('fieldset');
 field.append(make('legend','Which response communicates most accurately?'));
 choices.forEach((answer,i)=>{
  const label=make('label',undefined,'v1860-choice');
  const input=make('input');input.type='radio';input.name='practice-'+c.id;input.value=String(i);
  label.append(input,make('span',answer));field.append(label);
 });
 const feedback=make('p','Select an answer, then check your choice.','v1860-feedback');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
 const btn=make('button','Check my answer','v1860-check');btn.type='submit';
 form.append(field,btn,feedback);
 form.addEventListener('submit',event=>{
  event.preventDefault();
  const choice=Array.from(form.querySelectorAll('input')).find(input=>input.checked);
  feedback.textContent=!choice?'Select a response first.':choice.value==='0'?'Correct. '+c.good+' This language accurately distinguishes known facts and uncertainty.':'Review the wording. The stronger model response is: '+c.good;
 });
 ex.append(form);addSection(panel,'Interactive language practice with feedback',ex);
 const task=make('div');
 task.append(make('p',c.homework),make('p','Self-check: distinguish facts from assumptions, use suitable professional tone, and make the next action clear.','v1860-note'));
 addSection(panel,'Homework and self-check',task);
 const teacher=make('div');
 teacher.append(make('p','Learning objective: '+c.outcome),make('p','Fictional lesson scenario: '+c.scenario),make('p','Teacher guidance: '+c.teacher),make('p','50-minute class: 5 min warm-up; 10 min vocabulary; 15 min guided roleplay; 10 min writing/reading feedback; 10 min review and homework. Assess clarity, accuracy, tone and careful handling of uncertainty.','v1860-note'));
 addSection(panel,'Teacher lesson materials and assessment',teacher);
 detail.append(summary,panel);article.append(detail);
 return article;
}
const host=document.getElementById('v1860-legal-catalog');
if(host){
 let total=0;
 for(const [key,label] of legalGroups){
  const courses=data.records.filter(c=>c.group===key);
  total+=courses.length;
  const section=make('section',undefined,'v1860-course-track');section.id='v1860-track-'+key.toLowerCase().replace(/[^a-z0-9]+/g,'-');
  const h=make('h3',label+' ('+courses.length+' courses)');
  section.append(h,make('p','Select any course to study its vocabulary, fictional exercises, homework and teacher guide.'));
  const grid=make('div',undefined,'v1860-course-grid');
  courses.forEach(c=>grid.append(legalCourse(c)));
  section.append(grid);host.append(section);
 }
 if(total!==24){host.replaceChildren(make('p','Course catalog temporarily unavailable. See the full curriculum on our Courses page.'));return;}
}
const businessPage=document.getElementById('v1850-business-cards');
if(businessPage){
 for(const card of document.querySelectorAll('#v1850-business-cards .v1850-course-card,#v1850-investor-cards .v1850-course-card')){
  const details=card.querySelector('details');
  const list=details?.querySelector('.v1850-material ol');
  if(!details||!list||list.children.length!==4)continue;
  const preview=make('div',undefined,'v1860-always-outline');
  preview.append(make('h4','Four-lesson course outline'),list.cloneNode(true));
  details.before(preview);
  const summary=details.querySelector('summary');
  if(summary)summary.textContent='Full vocabulary, practice exercise, homework and teacher guide';
 }
}
})();