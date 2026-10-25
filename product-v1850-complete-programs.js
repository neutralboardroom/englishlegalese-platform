/* HF6: comprehensive pathways display real topic-specific curricula, no sending, no payments. */
(()=>{'use strict';
 const legal=(window.ELCURRICULUM_V1800?.records||[]).filter(c=>c.group!=='Professional & Business English');
 const business=window.ELBUSINESS_V1850_CATALOG||[];
 const E=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
 function section(id,items,track){
  const root=document.getElementById(id);if(!root)return;
  if(items.length!==24){root.append(E('p','The full course inventory is not available. Do not request a confirmed booking.'));return;}
  items.forEach((c,i)=>{
   const card=E('article');card.className='v1850-session-card';
   const details=E('details'),summary=E('summary','Session '+(i+1)+' — '+c.title),body=E('div');body.className='v1850-session-body';
   const line=(label,value)=>{const p=E('p'),strong=E('strong',label+': ');p.append(strong,document.createTextNode(value));body.append(p);};
   line('Subject',track);line('Learning objective',c.outcome);line('Four independent practice stages',c.units.join(' → '));
   line('Vocabulary and meaning',c.vocab.map(v=>v[0]+' — '+v[1]).join('; '));
   line('Fictional subject-specific situation',c.scenario);line('Preferred professional wording',c.good);
   line('Classroom practice plan','5 minutes aims/recall; 10 minutes language models and terms; 15 minutes fictional scenario discussion; 15 minutes tailored speaking and writing exercise; 5 minutes personal feedback and homework.');
   line('Homework',c.homework);line('Teacher preparation and assessment',c.teacher);
   details.append(summary,body);card.append(details);root.append(card);
  });
 }
 section('v1850-complete-legal-list',legal,'Legal English');
 section('v1850-complete-business-list',business,'Business & Investor English');
})();