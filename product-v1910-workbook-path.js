/* EnglishLegalese HF10: accessible, privacy-preserving path through all 48 complete workbooks.
 * EL-RGR-023 / EL-DUR-011: no email, egress, persistence or teacher grade. */
(function guided(){
 'use strict';
 const records=window.ELCURRICULUM_V1800?.records||[];
 const business=window.ELBUSINESS_V1850_CATALOG||[];
 const legal=records.filter(x=>x.group!=='Professional & Business English');
 const businessPage=Boolean(document.getElementById('v1850-business-cards'));
 const subjects=businessPage?business:legal;
 const books=Array.from(document.querySelectorAll('.v1870-workbook'));
 if(records.length!==28||legal.length!==24||subjects.length!==24||books.length!==24)return;
 const mk=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
 for(const subject of subjects){
  const book=books.find(x=>x.getAttribute('aria-label')==='Detailed independent practice for '+subject.title);
  if(!book||book.querySelector('.v1910-path'))continue;
  const panel=book.querySelector('.v1870-lab');
  const outline=book.querySelector('.v1870-module-list');
  const evidence=book.querySelector('.v1900-evidence-lab');
  const modules=Array.from(book.querySelectorAll('.v1870-module'));
  const worked=book.querySelector('.v1870-worked'),quiz=book.querySelector('.v1870-checks'),assignment=book.querySelector('.v1870-assignment');
  if(!panel||!outline||!evidence||modules.length!==4||!worked||!quiz||!assignment)continue;
  const segments=[
   ['Evidence and reasoning',evidence],
   ...modules.map((node,i)=>['Lesson '+(i+1)+' · '+subject.units[i],node]),
   ['Worked example',worked],
   ['Three knowledge checks',quiz],
   ['Assignment and self-assessment',assignment]
  ];
  const nav=mk('nav',undefined,'v1910-path');
  nav.dataset.courseId=subject.id;
  nav.setAttribute('aria-label','Workbook learning path for '+subject.title);
  nav.append(mk('h5','Your learning path for '+subject.title));
  nav.append(mk('p','Choose any section below. All original teaching materials remain accessible; these are navigation shortcuts, not new lessons or an AI tutor.','v1910-hint'));
  const list=mk('ol',undefined,'v1910-path-links'),liBySection=[];
  segments.forEach(([label,target],index)=>{
   const id='v1910-'+subject.id+'-'+index;
   target.id=id;target.tabIndex=-1;
   const li=mk('li'),link=mk('a',label);
   link.href='#'+id;
   link.addEventListener('click',event=>{
    event.preventDefault();
    target.focus({preventScroll:true});
    target.scrollIntoView({block:'start',behavior:'auto'});
   });
   li.append(link);list.append(li);liBySection.push(li);
  });
  nav.append(list);
  const status=mk('p','Activities attempted: 0 of 7 · Not a mastery score.','v1910-status');
  status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  nav.append(status,mk('p','This activity count is recalculated from saved answers after resuming; without saving, it disappears on reload. Selecting an answer or checking writing structure does not establish professional correctness.','v1910-hint'));
  panel.insertBefore(nav,outline);
  const stageAttempted=module=>Boolean(module.querySelector('.v1890-stage-feedback')?.textContent.startsWith('Structure cues found:'));
  const progress=()=>{
   const counts=[
    Boolean(evidence.querySelector('input[type="radio"]:checked')),
    ...modules.map(stageAttempted),
    /Knowledge checks answered: 3 of 3/.test(quiz.querySelector('.v1880-progress')?.textContent||''),
    Boolean((assignment.querySelector('.v1870-draft-label textarea')?.value||'').trim().length>=15&&assignment.querySelectorAll('.v1870-rubric-item input:checked').length>=2)
   ];
   let attempted=0;counts.forEach((yes,i)=>{if(yes)attempted++;const navIndex=i<=4?i:i+1;liBySection[navIndex].dataset.attempted=String(yes)});
   status.textContent='Activities attempted: '+attempted+' of 7 · Not a grade or course-completion certificate.';
  };
  panel.addEventListener('input',progress);
  panel.addEventListener('change',progress);
  panel.addEventListener('click',progress);
  progress();
 }
})();
