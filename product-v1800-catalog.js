/* EnglishLegalese 28-topic unified catalog (v1.84 integration), no legacy/new labels.
 * Educational previews, not real bookings. All interactions remain in page memory. */
(()=>{'use strict';
const $=(q,r=document)=>r.querySelector(q),$$=(q,r=document)=>Array.from(r.querySelectorAll(q));
const E=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const C=window.ELCURRICULUM_V1800;
if(!C || !Array.isArray(C.records) || C.records.length!==28)return;
const records=C.records;
function mount(){
 const dedicated=$('#v1840-course-mount');
 const host=dedicated||$('#courses');if(!host||$('#v1800-class-catalog'))return;
 const container=E('div',undefined,'container v1800-catalog');
 const section=E('section',undefined,'v1800-class-section');section.id='v1800-class-catalog';section.setAttribute('aria-labelledby','v1800-class-heading');
 const head=E('div',undefined,'v1800-catalog-intro');
 const title=E('h2','Explore all 28 class topics');title.id='v1800-class-heading';
 head.append(E('p','28 CLASS TOPICS · EDUCATIONAL PREVIEWS','eyebrow'),title,
 E('p','Explore all 28 class topics together. Every topic includes four lesson outlines, defined vocabulary, a practical exercise, homework and teacher materials. These previews are not bookable teacher sessions, graded credits or certification.'));
 const controls=E('div',undefined,'v1800-catalog-controls');
 const searchLabel=E('label',undefined,'v1800-field'),searchText=E('span','Search class topics'),search=E('input');
 search.type='search';search.placeholder='Example: immigration, contract, mediation';search.maxLength=80;search.id='v1800-class-search';
 searchLabel.append(searchText,search);
 const groupLabel=E('label',undefined,'v1800-field'),groupText=E('span','Class track'),group=E('select');group.id='v1800-class-track';
 [['All tracks','all'],['Core professional','Core professional'],['Legal specialties','Legal specialties'],['International & academic','International & academic'],['Professional & Business English','Professional & Business English']].forEach(([name,value])=>{const o=E('option',name);o.value=value;group.append(o)});
 groupLabel.append(groupText,group);controls.append(searchLabel,groupLabel);
 const count=E('p',undefined,'v1800-class-count');count.setAttribute('role','status');
 const grid=E('div',undefined,'v1800-class-grid');
 const more=E('button','Show all 28 class topics','btn light v1800-more');more.type='button';
 const viewer=E('section',undefined,'panel v1800-class-viewer');viewer.id='v1800-class-viewer';viewer.hidden=true;viewer.setAttribute('aria-label','Curriculum preview and learning materials');
 section.append(head,controls,count,grid,more,viewer);container.append(section);
 if(dedicated)host.append(container);
 else{
  const sectionHead=$('.section-head',host);
  if(sectionHead)sectionHead.after(container);else host.prepend(container);
  const heading=$('.section-head h2',host),intro=$('.section-head >p',host);
  if(heading)heading.textContent='28 class topics for practical Legal English communication.';
  if(intro)intro.textContent='Explore one catalog of 28 class topics with real practice, four-lesson plans, vocabulary, homework and instructor materials.';
  const sampleToggle=$('.js-v1580-courses',host);
  if(sampleToggle){
   const relabel=()=>sampleToggle.textContent=sampleToggle.getAttribute('aria-expanded')==='true'?'Show fewer sample lessons':'See all sample lessons';
   sampleToggle.addEventListener('click',()=>setTimeout(relabel,0));relabel();
   if(typeof MutationObserver!=='undefined'){
    const obs=new MutationObserver(()=>{const desired=sampleToggle.getAttribute('aria-expanded')==='true'?'Show fewer sample lessons':'See all sample lessons';if(sampleToggle.textContent!==desired)sampleToggle.textContent=desired;});
    obs.observe(sampleToggle,{childList:true,characterData:true,subtree:true});
   }
  }
  const legacyGrid=$('.v1580-course-grid',host),legacyControls=sampleToggle?.closest('.v1580-section-controls');
  if(legacyGrid&&!$('#v1840-sample-lessons',host)){
   const examples=E('details',undefined,'v1840-sample-lessons');examples.id='v1840-sample-lessons';
   const summary=E('summary','Try guided sample lessons');
   const explainer=E('p','These additional exercises support the class topics above. They are practice activities, not separate class topics.','v1840-sample-note');
   examples.append(summary,explainer);
   legacyGrid.before(examples);examples.append(legacyGrid);
   if(legacyControls)examples.append(legacyControls);
  }
 }
 let showAll=Boolean(dedicated),current=null;
 function renderList(){
  grid.replaceChildren();
  const query=search.value.trim().toLocaleLowerCase(),track=group.value;
  const matched=records.filter(c=>(track==='all'||c.group===track)&&(!query||[c.title,c.outcome,c.group,...c.vocab.map(v=>v[0])].join(' ').toLocaleLowerCase().includes(query)));
  const visible=(showAll||query||track!=='all')?matched:matched.slice(0,12);
  visible.forEach(c=>{
   const article=E('div',undefined,'v1800-class-card');article.setAttribute('role','group');article.setAttribute('aria-label',c.title+' class topic');
   article.append(E('p',c.group+' · '+c.level,'v1800-card-kicker'),E('h3',c.title),E('p',c.outcome));
   const button=E('button','View lesson & teacher materials','btn teal');button.type='button';
   button.setAttribute('aria-controls','v1800-class-viewer');button.setAttribute('aria-expanded',String(current===c.id&&!viewer.hidden));
   button.addEventListener('click',()=>openClass(c));
   article.append(button);grid.append(article);
  });
  count.textContent=matched.length===28?'28 class topics — explore the complete catalog.':matched.length+' class topics match your selection.';
  if(visible.length<matched.length)count.textContent+=' Showing '+visible.length+'; choose “Show all 28 class topics” to view every topic.';
  more.hidden=(!!query||track!=='all'||showAll||matched.length<=12);
  if(!matched.length)grid.append(E('p','No class topic matches. Try a shorter search or select all tracks.','v1800-empty'));
 }
 function qData(c){
  // Shuffle each individual set deterministically by class ID and question index.
  const [one,two]=c.vocab;
  const parts=[
   {ask:'Which response accurately handles this fictional situation?',opts:[c.good,...c.distractors],correct:0,why:'Best response: '+c.good+' It respects what is known and what still needs confirmation.'},
   {ask:'In this topic, what does “'+one[0]+'” mean?',opts:[one[1],c.vocab[2][1],c.vocab[3][1]],correct:0,why:'“'+one[0]+'” means '+one[1]+'.'},
   {ask:'Which vocabulary term means “'+two[1]+'”?',opts:[c.vocab[4][0],two[0],c.vocab[3][0]],correct:1,why:'The term is “'+two[0]+'”: '+two[1]+'.'}
  ];
  const off=Number(c.id.slice(-2))%3;
  return parts.map((q,i)=>{const shift=(off+i)%3;const rotated=q.opts.map((_,j)=>q.opts[(j+shift)%3]);return {...q,opts:rotated,correct:(q.correct-shift+3)%3};});
 }
 function openClass(c){
  current=c.id;viewer.replaceChildren();viewer.hidden=false;
  const h=E('h3',c.title);h.tabIndex=-1;viewer.append(E('p','CURRICULUM PREVIEW · NOT BOOKABLE','v1800-view-label'),h,E('p','Target learning outcome: '+c.outcome));
  const lesson=E('div',undefined,'v1800-material-block'),outline=E('ol');
  c.units.forEach((s,i)=>outline.append(E('li','Lesson '+(i+1)+': '+s)));
  lesson.append(E('h4','1. Four-lesson teaching outline'),outline);
  const glossary=E('div',undefined,'v1800-material-block'),dl=E('dl',undefined,'v1800-glossary');
  c.vocab.forEach(([term,meaning])=>{dl.append(E('dt',term),E('dd',meaning));});
  glossary.append(E('h4','2. Topic vocabulary and meanings'),dl);
  const lab=E('div',undefined,'v1800-material-block'),scenario=E('blockquote','Fictional situation: '+c.scenario);
  const questions=qData(c),form=E('form'),fields=E('div'),feedback=E('div','Complete all three questions to see your explanations.','v1800-quiz-feedback');feedback.setAttribute('role','status');
  questions.forEach((q,i)=>{
   const fs=E('fieldset',undefined,'v1800-quiz-question');fs.append(E('legend',(i+1)+'. '+q.ask));
   q.opts.forEach((o,j)=>{const label=E('label',undefined,'v1800-quiz-choice'),input=E('input');input.type='radio';input.value=String(j);input.name='v1800-q-'+i;label.append(input,document.createTextNode(o));fs.append(label);});
   fields.append(fs);
  });
  const buttons=E('div',undefined,'v1800-mini-actions'),grade=E('button','Check my answers','btn teal'),reset=E('button','Clear quiz answers','btn light');grade.type='submit';reset.type='button';buttons.append(grade,reset);form.append(fields,buttons);
  form.addEventListener('change',()=>feedback.textContent='Answers changed. Select Check my answers to refresh explanations.');
  form.addEventListener('submit',e=>{
   e.preventDefault();
   const answers=questions.map((_,i)=>$('input[name="v1800-q-'+i+'"]:checked',form));
   if(answers.some(a=>!a)){feedback.textContent='Choose an answer to each of the three questions first.';return;}
   let count=0;const list=E('ol');questions.forEach((q,i)=>{const ok=Number(answers[i].value)===q.correct;count+=Number(ok);list.append(E('li',(ok?'Correct. ':'Review. ')+q.why));});
   feedback.replaceChildren(E('strong',count+' of 3 practice answers match the educational example.'),list);
  });
  reset.addEventListener('click',()=>{form.reset();feedback.textContent='Answers cleared; try the practice again.';});
  lab.append(E('h4','3. Interactive source-reading and vocabulary exercises'),scenario,form,feedback,E('p','This is an ungraded educational self-check, not legal advice or certification.','v1800-small'));
  const homework=E('div',undefined,'v1800-material-block');
  homework.append(E('h4','4. At-home practice and self-check'),E('p',c.homework),E('p','Before finishing, check: Are the facts faithful to the fictional source? Is uncertainty expressed accurately? Is the tone suitable for the reader? Is the next step clear?','v1800-small'));
  const teacher=E('details',undefined,'v1800-material-block v1800-teacher');const summary=E('summary','5. Instructor teaching brief and materials');
  teacher.append(summary,E('p','Class aim: '+c.outcome),E('p','Instructor scenario: '+c.scenario),E('p','Facilitation notes: '+c.teacher));
  const timing=E('ol');[
   '5 min — warm-up and prior-knowledge question about this situation',
   '10 min — teach all five vocabulary terms using invented examples',
   '15 min — guided partner roleplay or draft analysis using the scenario',
   '10 min — compare alternative phrasing and discuss what remains uncertain',
   '10 min — individual feedback, reflection and explanation of the homework'
  ].forEach(s=>timing.append(E('li',s)));
  teacher.append(E('h5','Suggested 50-minute teacher-led lesson'),timing,E('p','Feedback criteria: linguistic accuracy; professional clarity and tone; faithful distinction between facts, assumptions and conditional statements. Adapt pace, reading support and participation format to learners. No real client details or sensitive files.','v1800-small'));
  const actions=E('div',undefined,'v1800-mini-actions'),download=E('button','Download curriculum and teacher brief','btn light'),close=E('button','Close class materials','btn light');download.type=close.type='button';
  download.addEventListener('click',()=>{
   const lines=['EnglishLegalese — '+c.title,'EDUCATIONAL CURRICULUM PREVIEW · NOT A LIVE BOOKING','',c.outcome,'','LESSON OUTLINES',...c.units.map((x,i)=>(i+1)+'. '+x),'','VOCABULARY',...c.vocab.map(([w,d])=>w+': '+d),'','FICTIONAL SCENARIO',c.scenario,'','LANGUAGE MODEL',c.good,'','HOMEWORK',c.homework,'','TEACHER BRIEF',c.teacher,'50-minute plan: 5 warm-up; 10 vocabulary; 15 roleplay; 10 compare; 10 feedback.','Assess accuracy, tone, and transparency of uncertainty.'];
   const url=URL.createObjectURL(new Blob([lines.join('\r\n')],{type:'text/plain;charset=utf-8'}));const a=E('a');a.href=url;a.download='EnglishLegalese-'+c.id+'-curriculum.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  close.addEventListener('click',()=>{current=null;viewer.hidden=true;renderList();const anchor=$('#v1800-class-heading');anchor?.scrollIntoView({block:'start',behavior:'instant'});anchor?.focus({preventScroll:true});});
  actions.append(download,close);viewer.append(lesson,glossary,lab,homework,teacher,actions);
  renderList();viewer.scrollIntoView({block:'start',behavior:'instant'});h.focus({preventScroll:true});
 }
 search.addEventListener('input',()=>{current=null;viewer.hidden=true;renderList();});
 group.addEventListener('change',()=>{current=null;viewer.hidden=true;renderList();});
 more.addEventListener('click',()=>{showAll=true;renderList();more.hidden=true;});
 title.tabIndex=-1;renderList();
}
function init(){mount();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.addEventListener('hashchange',()=>setTimeout(init,0));
})();
