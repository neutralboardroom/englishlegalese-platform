/* EnglishLegalese HF8: in-tab, rule-based practice-writing feedback for all 48 subject workbooks.
 * Learner writing is never transmitted, persisted, emailed or evaluated by AI.
 * EL-RGR-023 / EL-DUR-011: absolutely no outbound email.
 */
(()=>{'use strict';
 const base=window.ELCURRICULUM_V1800?.records||[];
 const business=window.ELBUSINESS_V1850_CATALOG||[];
 if(base.length!==28)return;
 const legal=base.filter(c=>c.group!=='Professional & Business English');
 if(legal.length!==24)return;
 const isBusinessPage=Boolean(document.getElementById('v1850-business-cards'));
 if(isBusinessPage&&business.length!==24)return;
 const courses=isBusinessPage?business:legal;
 const books=Array.from(document.querySelectorAll('.v1870-workbook'));
 if(books.length!==24)return;
 const E=(tag,content,cls)=>{const a=document.createElement(tag);if(content!==undefined)a.textContent=content;if(cls)a.className=cls;return a;};
 const countWords=t=>(t.trim().match(/\S+/g)||[]).length;
 function stageRules(text,c,stage){
  const v=c.vocab[stage][0];
  const containsTerm=text.toLocaleLowerCase('en').includes(v.toLocaleLowerCase('en'));
  const rules=[
   [['two facts labeled Fact 1 and Fact 2',/\bfact\s*1\s*[:\-]/i.test(text)&&/\bfact\s*2\s*[:\-]/i.test(text)],
    ['an assumption labeled Assumption',/\bassumption\s*[:\-]/i.test(text)],
    ['the relevant term "'+v+'"',containsTerm],
    ['at least 25 words',countWords(text)>=25]],
   [['at least two questions',(text.match(/\?/g)||[]).length>=2],
    ['the relevant term "'+v+'"',containsTerm],
    ['an evidence or verification step',/\b(evidence|record|records|data|document|documents|source|verify|verification|confirm|proof|check)\b/i.test(text)],
    ['at least 25 words',countWords(text)>=25]],
   [['at least two complete sentences',(text.match(/[.!?](?=\s|$)/g)||[]).length>=2],
    ['the relevant term "'+v+'"',containsTerm],
    ['careful qualified wording',/\b(may|might|could|appears|subject to|if|depending|based on|verify|confirm|pending|uncertain|provided that)\b/i.test(text)],
    ['at least 30 words',countWords(text)>=30]],
   [['at least 45 words',countWords(text)>=45],
    ['the relevant term "'+v+'"',containsTerm],
    ['a stated follow-up action',/\b(next|follow\s*up|confirm|verify|request|review|recommend|check|schedule|clarify)\b/i.test(text)],
    ['a qualified statement',/\b(may|might|could|subject to|if|depending|based on|confirm|verify|pending)\b/i.test(text)]]
  ];
  return rules[stage];
 }
 function build(wb,c){
  if(wb.querySelector('.v1890-writing-summary'))return;
  const modules=wb.querySelectorAll('.v1870-module');
  if(modules.length!==4||c.units.length!==4||c.vocab.length!==5)return;
  const state=[false,false,false,false],feedbackNodes=[];
  const panel=wb.querySelector('.v1870-lab'),title=E('h5','Four-step writing practice · in this tab only');
  const intro=E('p','Write answers to the case-specific prompts below. The local self-check looks only for writing structure and selected course vocabulary; it cannot judge legal, business or language accuracy. Use fictional information only. Nothing is stored, submitted or sent.','v1890-boundary');
  const snapshot=E('p','Writing drafts reviewed: 0 of 4 · Knowledge checks answered: 0 of 3 · Correct: 0 of 3','v1890-writing-summary');
  snapshot.setAttribute('role','status');snapshot.setAttribute('aria-live','polite');
  const outline=wb.querySelector('.v1870-module-list');
  if(outline){outline.insertBefore(intro,outline.children[1]||null);outline.insertBefore(snapshot,intro.nextSibling);}
  function refresh(){
   const q=wb.querySelector('.v1880-progress')?.textContent||'';
   const answered=Number(q.match(/Knowledge checks answered: (\d) of 3/)?.[1]||0);
   const right=Number(q.match(/Correct: (\d) of 3/)?.[1]||0);
   snapshot.textContent='Writing drafts reviewed: '+state.filter(Boolean).length+' of 4 · Knowledge checks answered: '+answered+' of 3 · Correct: '+right+' of 3';
  }
  modules.forEach((module,i)=>{
   const wrap=E('div',undefined,'v1890-stage');
   const label=E('label',undefined,'v1890-stage-label');
   label.append(E('span','Your practice response for Lesson '+(i+1)+' — '+c.units[i]));
   const area=E('textarea');area.rows=4;area.maxLength=3000;area.autocomplete='off';
   area.setAttribute('aria-label','Writing practice Lesson '+(i+1)+' for '+c.title);
   area.placeholder=i===0?'Fact 1: …\nFact 2: …\nAssumption: …':i===1?'Question 1?\nQuestion 2?\nEvidence to request: …':i===2?'First carefully qualified sentence.\nSecond carefully qualified sentence.':'Use the fictional case, key terminology and a clearly stated next step.';
   label.append(area);wrap.append(label);
   const helper=E('p','0 words · Course terminology cue: '+c.vocab[i][0]+' ('+c.vocab[i][1]+')','v1890-word-counter');wrap.append(helper);
   const check=E('button','Check writing structure');check.type='button';check.className='v1890-check';
   check.setAttribute('aria-label','Check writing structure for Lesson '+(i+1)+' of '+c.title);
   const result=E('p','Write your own fictional answer, then run a local structure check.','v1890-stage-feedback');
   result.setAttribute('role','status');result.setAttribute('aria-live','polite');
   area.addEventListener('input',()=>{
    helper.textContent=countWords(area.value)+' words · Course terminology cue: '+c.vocab[i][0]+' ('+c.vocab[i][1]+')';
    if(state[i]){state[i]=false;result.textContent='Edited since review — run the structure check again.';refresh();}
   });
   check.addEventListener('click',()=>{
    const t=area.value;
    if(!t.trim()){state[i]=false;result.textContent='Write a practice response first. Empty answers cannot be reviewed.';refresh();return;}
    const criteria=stageRules(t,c,i),met=criteria.filter(x=>x[1]),missing=criteria.filter(x=>!x[1]).map(x=>x[0]);
    state[i]=true;refresh();
    result.textContent='Structure cues found: '+met.length+' of '+criteria.length+'. '+(missing.length?'Consider adding: '+missing.join('; ')+'. ':'All listed structural cues are present. ')+'This does not verify that the professional answer is correct.';
   });
   feedbackNodes.push(result);wrap.append(check,result);module.append(wrap);
  });
  wb.addEventListener('change',event=>{if(event.target.matches('.v1870-question input[type="radio"]'))refresh();});
  const rubric=wb.querySelector('.v1870-assignment');
  if(rubric)rubric.append(E('p','How to use the writing checks: revisit any unmet cues, compare with the subject-specific worked example, and use the original four-item self-assessment rubric. A confirmed human teacher—not this structural checker—can review meaning, professional nuance and correctness.','v1890-boundary'));
  refresh();
 }
 for(const c of courses){const book=books.find(b=>b.getAttribute('aria-label')==='Detailed independent practice for '+c.title);if(book)build(book,c);}
})();