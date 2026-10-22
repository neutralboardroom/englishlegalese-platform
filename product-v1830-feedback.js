/* EnglishLegalese v1.83.0 — private fictional 28-topic writing and teacher feedback workshop. */
(()=>{'use strict';
const data=window.ELCURRICULUM_V1800;
if(!data||!Array.isArray(data.records)||data.records.length!==28)return;
const lessons=data.records, save=new Map(),$=(q,r=document)=>r.querySelector(q);
const N=(tag,text,cls)=>{let n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n};
const audiences=['Client or prospective client','Law-firm colleague','Business or legal-team stakeholder'];
const purposes=['Clarify an uncertain fact','Summarize known and unknown information','Propose a conditional next step'];
const criteria=[
['Source fidelity','My text does not invent facts, approvals or deadlines.'],
['Qualified claims','I distinguish uncertainty from confirmed facts.'],
['Professional tone','The tone and clarity suit the intended reader.'],
['Practical follow-up','The next step or question is clearly stated.']];
const pattern=/\b(?:guarantee(?:d|s)?|definitely|proved?|always|never|automatically approved)\b|\b100%/gi;
function state(id){if(!save.has(id))save.set(id,{draft:'',rewrite:'',checked:[false,false,false,false],aud:'0',purpose:'0'});return save.get(id)}
function local(name,lines){let u=URL.createObjectURL(new Blob([lines.join('\r\n')],{type:'text/plain;charset=utf-8'})),a=N('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function mount(){
 const host=$('#live-classes');if(!host||$('#v1830-writing-lab'))return;
 const outer=N('div',undefined,'container v1830-wrap'),panel=N('section',undefined,'v1830-panel');panel.id='v1830-writing-lab';panel.setAttribute('aria-labelledby','v1830-title');
 const title=N('h2','Legal English Drafting & Feedback Workshop');title.id='v1830-title';
 panel.append(N('p','28 ORIGINAL FICTIONAL CASES · PRIVATE WRITING','v1830-kicker'),title,
 N('p','Read a fictional professional situation, write your first response, review limited wording cues, and revise. Then use a topic-specific teacher briefing and practical self-review rubric.'),
 N('p','This is not automated legal review, AI grading, a teacher submission, or a course certificate. Only use fictional examples—never upload or paste privileged, identifiable or real-client information. This page sends or stores nothing.','v1830-safety'));
 function field(label,child){let l=N('label',undefined,'v1830-field');l.append(N('span',label),child);return l}
 function options(el,values){values.forEach(([text,val])=>{let o=N('option',text);o.value=val;el.append(o)})}
 const category=N('select'),topic=N('select'),aud=N('select'),intent=N('select');
 category.id='v1830-track';topic.id='v1830-topic';aud.id='v1830-audience';intent.id='v1830-intent';
 options(category,[['All tracks','all'],['Core professional','Core professional'],['Legal specialties','Legal specialties'],['International & academic','International & academic'],['Professional & Business English','Professional & Business English']]);
 options(aud,audiences.map((x,i)=>[x,String(i)]));options(intent,purposes.map((x,i)=>[x,String(i)]));
 let selectors=N('div',undefined,'v1830-controls');
 selectors.append(field('Topic track',category),field('Class topic',topic),field('Intended reader',aud),field('Communication purpose',intent));
 const source=N('section',undefined,'v1830-case'),brief=N('section',undefined,'v1830-brief');
 const first=N('textarea');first.id='v1830-first';first.rows=5;first.maxLength=2500;first.placeholder='Write a fictional professional response. Do not use real client details.';
 const count1=N('p','2500 characters remaining','v1830-counter');
 const actions=N('div',undefined,'v1830-actions');
 const inspect=N('button','Review wording cues','btn teal'),show=N('button','Show source-faithful example','btn light');
 [inspect,show].forEach(b=>{b.type='button';actions.append(b)});
 const results=N('section',undefined,'v1830-feedback');results.setAttribute('role','status');
 const examples=N('details',undefined,'v1830-examples');
 const rewrite=N('textarea');rewrite.id='v1830-revision';rewrite.rows=5;rewrite.maxLength=2500;rewrite.placeholder='Rewrite more carefully using the fictional source.';
 const count2=N('p','2500 characters remaining','v1830-counter');
 const rubric=N('fieldset',undefined,'v1830-rubric');rubric.append(N('legend','My language self-review'));
 const checks=criteria.map(([title,detail],i)=>{const l=N('label',undefined,'v1830-check'),input=N('input');input.type='checkbox';input.value=String(i);l.append(input,N('span',title+': '+detail));rubric.append(l);return input});
 const score=N('p','0 of 4 personal self-checks marked; not a teacher grade.','v1830-score');score.setAttribute('role','status');
 const teacher=N('details',undefined,'v1830-teacher');
 const bottom=N('div',undefined,'v1830-actions');
 const exportBtn=N('button','Download writing & teacher workbook','btn teal'),reset=N('button','Clear this topic','btn light'),clearAll=N('button','Clear all 28 topics','btn light');
 [exportBtn,reset,clearAll].forEach(b=>{b.type='button';bottom.append(b)});
 const status=N('p','Personal practice only. No data sent to EnglishLegalese.','v1830-status');status.setAttribute('role','status');
 panel.append(selectors,source,brief,field('First draft (2,500 characters maximum)',first),count1,actions,results,examples,field('Revised draft (2,500 characters maximum)',rewrite),count2,rubric,score,teacher,bottom,status);
 outer.append(panel);const previous=$('#v1820-learning-studio');if(previous)previous.after(outer);else host.append(outer);
 const chosen=()=>lessons.find(c=>c.id===topic.value)||lessons[0];
 function updateList(){const old=topic.value;topic.replaceChildren();
 lessons.filter(c=>category.value==='all'||category.value===c.group).forEach(c=>{let o=N('option',c.title);o.value=c.id;topic.append(o)});
 if(Array.from(topic.options).some(o=>o.value===old))topic.value=old;refresh()}
 function refresh(){
 const c=chosen(),s=state(c.id);
 aud.value=s.aud;intent.value=s.purpose;first.value=s.draft;rewrite.value=s.rewrite;
 count1.textContent=(2500-s.draft.length)+' characters remaining';count2.textContent=(2500-s.rewrite.length)+' characters remaining';
 source.replaceChildren(N('h3',c.title+' · fictional case'),N('p',c.scenario));
 brief.replaceChildren(N('h3','Evidence-based writing brief'),
 N('p','Reader: '+audiences[Number(s.aud)]+' · Task: '+purposes[Number(s.purpose)]),
 N('p','Use the facts in this invented situation only. Do not infer a judicial ruling, completed agreement, legal entitlement or guaranteed outcome. Ask for verification if uncertain.'),
 N('p','Topic-specific vocabulary: '+c.vocab.map(v=>v[0]+' — '+v[1]).join('; ')));
 examples.replaceChildren(N('summary','Model response and risky alternatives'),N('p','Careful example: '+c.good),N('p','Potential overstatements: '+c.distractors.join(' / ')),N('p','Examples illustrate language only and are not legal advice.'));
 examples.open=false;
 teacher.replaceChildren(N('summary','Teacher briefing, timing and feedback'),N('p','Learning objective: '+c.outcome),N('p','Fictional case: '+c.scenario),N('p','Facilitation: '+c.teacher));
 let agenda=N('ol');
 ['5 min — identify verified versus unverified points','10 min — explain five glossary terms','10 min — first draft and paired discussion','10 min — compare accurate and risky phrasing','10 min — improve the response and discuss the criteria','5 min — set original topic-specific homework'].forEach(x=>agenda.append(N('li',x)));
 teacher.append(agenda,N('p','Homework: '+c.homework));
 checks.forEach((x,i)=>x.checked=s.checked[i]);score.textContent=s.checked.filter(Boolean).length+' of 4 personal self-checks marked; not a teacher grade.';
 results.replaceChildren(N('p','Enter a fictional first draft and select Review wording cues. This mechanical tool cannot verify legal facts, quality or accuracy.'));
 }
 function inspectText(){
 const c=chosen(),s=state(c.id),text=s.draft,words=text.trim()?text.trim().split(/\s+/).length:0;
 const risky=[...new Set(Array.from(text.matchAll(pattern),m=>m[0].toLowerCase()))];
 const vocab=c.vocab.filter(v=>text.toLowerCase().includes(v[0].toLowerCase())).map(v=>v[0]);
 let list=N('ul');
 if(!text.trim())list.append(N('li','Write a first draft before using these limited text cues.'));
 else{
 list.append(N('li','Draft length: about '+words+' words. This is descriptive, not a quality score.'));
 list.append(N('li',risky.length?'Double-check high-certainty wording: '+risky.join(', ')+'. Such words sometimes fit, but should have factual support.':'No listed high-certainty expressions were detected. This does not prove source accuracy.'));
 list.append(N('li',vocab.length?'Glossary words detected: '+vocab.join(', ')+'. Verify meaning and use in context.':'No glossary terms detected. Consider whether a relevant term would improve precision.'));
 list.append(N('li','Manually compare each sentence to the fictional source. This tool cannot detect fabricated legal conclusions or unsupported details.'));
 list.append(N('li','Confirm the intended reader and purpose: '+audiences[Number(s.aud)]+'; '+purposes[Number(s.purpose)]+'.'));}
 results.replaceChildren(N('h3','Limited local wording review — not an AI grade'),list);
 status.textContent='Mechanical text cues generated locally. No account, teacher or AI reviewed your draft.';
 }
 category.addEventListener('change',updateList);
 topic.addEventListener('change',refresh);
 aud.addEventListener('change',()=>{state(chosen().id).aud=aud.value;refresh()});
 intent.addEventListener('change',()=>{state(chosen().id).purpose=intent.value;refresh()});
 first.addEventListener('input',()=>{let s=state(chosen().id);s.draft=first.value;count1.textContent=(2500-s.draft.length)+' characters remaining'});
 rewrite.addEventListener('input',()=>{let s=state(chosen().id);s.rewrite=rewrite.value;count2.textContent=(2500-s.rewrite.length)+' characters remaining'});
 checks.forEach((c,i)=>c.addEventListener('change',()=>{let s=state(chosen().id);s.checked[i]=c.checked;score.textContent=s.checked.filter(Boolean).length+' of 4 personal self-checks marked; not a teacher grade.'}));
 inspect.addEventListener('click',inspectText);
 show.addEventListener('click',()=>{examples.open=!examples.open});
 reset.addEventListener('click',()=>{save.delete(chosen().id);refresh();status.textContent='Current topic cleared from temporary page memory.'});
 clearAll.addEventListener('click',()=>{save.clear();refresh();status.textContent='All 28 local drafts and checks cleared.'});
 exportBtn.addEventListener('click',()=>{
 const c=chosen(),s=state(c.id);
 local('EnglishLegalese-'+c.id+'-writing-workbook.txt',[
 'ENGLISHLEGALESE · PRIVATE WRITING & TEACHER WORKBOOK',
 'FICTIONAL EDUCATIONAL CONTENT · NOT AI GRADING OR LEGAL ADVICE','',
 'TOPIC: '+c.title,'GOAL: '+c.outcome,
 'READER: '+audiences[Number(s.aud)],'PURPOSE: '+purposes[Number(s.purpose)],'',
 'FICTIONAL SOURCE:',c.scenario,'','FIVE GLOSSARY TERMS:',...c.vocab.map(v=>v[0]+': '+v[1]),'',
 'FIRST DRAFT:',s.draft||'(none)','', 'REVISED DRAFT:',s.rewrite||'(none)','',
 'MODEL LANGUAGE:',c.good,'','RISKY ALTERNATIVES:',...c.distractors,'',
 'MY SELF-REVIEW (NOT A TEACHER GRADE):',...criteria.map((r,i)=>(s.checked[i]?'[x] ':'[ ] ')+r.join(': ')),'',
 'HOMEWORK:',c.homework,'','TEACHER BRIEF:',c.teacher,
 '50-minute outline: 5 source check, 10 vocabulary, 10 draft, 10 compare, 10 revise, 5 homework.','',
 'Personal local export only; no records transmitted.']);
 status.textContent='Private writing and teacher workbook downloaded locally. No information was transmitted.';
 });
 updateList();
}
function releaseMarker(){document.documentElement.dataset.englishlegaleseMaterialRelease='1.83.0';}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',()=>{mount();releaseMarker();setTimeout(releaseMarker,430);},{once:true});}else{mount();releaseMarker();setTimeout(releaseMarker,430);}
window.addEventListener('hashchange',()=>{setTimeout(mount,0);setTimeout(releaseMarker,430);});
})();