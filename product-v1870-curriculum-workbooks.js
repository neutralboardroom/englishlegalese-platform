/* v1.85 HF4: substantial topic-specific, browser-only practice workbooks for all 48 curricula.
   EL-RGR-023 / EL-DUR-011: never send, queue, schedule or activate emails.
   Educational materials; classroom delivery only with confirmed, qualified human staff. */
(()=>{'use strict';
const base=window.ELCURRICULUM_V1800?.records||[];
const business=window.ELBUSINESS_V1850_CATALOG||[];
if(base.length!==28)return;
const legal=base.filter(c=>c.group!=='Professional & Business English');
if(legal.length!==24)return;
/* Legal English pages do not load the separate Business English catalog. */
if(document.getElementById('v1850-business-cards')&&business.length!==24)return;
const E=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
function para(title,value){const p=E('p');p.append(E('strong',title+' '),document.createTextNode(value));return p}
function appendWorkbook(card,c,kind){
 const old=card.querySelector('.v1870-workbook');if(old)return;
 const tag=E('p','Human-taught topic: request instructor availability · Independently usable workbook: available now','v1870-classification');
 const title=card.querySelector('h3,h4');if(title)title.before(tag);
 const wb=E('section',undefined,'v1870-workbook');
 wb.setAttribute('aria-label','Detailed independent practice for '+c.title);
 const label=E('label',undefined,'v1870-toggle');
 const toggle=E('input');toggle.type='checkbox';toggle.setAttribute('aria-label','Open detailed workbook for '+c.title);
 label.append(toggle,E('span','Open four guided lessons, worked example, three knowledge checks and assignment'));
 const panel=E('div',undefined,'v1870-lab');panel.append(E('p','Self-guided workbook · Not an AI chat or a booked teacher session. Work stays on this page and is not submitted.','v1870-disclaimer'));
 const outline=E('div',undefined,'v1870-module-list');outline.append(E('h5','Four guided lesson activities'));
 const acts=[
  ['Identify and define','Read the fictional situation, “'+c.scenario+'” Identify which statements are established, which require checking, and how the word “'+c.vocab[0][0]+'” ('+c.vocab[0][1]+') helps describe the situation.'],
  ['Question and clarify','Using the same scenario, compose two neutral clarifying questions before making any conclusion. Use “'+c.vocab[1][0]+'” accurately ('+c.vocab[1][1]+') and refer to the lesson focus.'],
  ['Revise a professional response','Compare the worked response below with the overconfident alternative. Draft a two-sentence revision that preserves facts, mentions the missing evidence, and uses “'+c.vocab[2][0]+'” ('+c.vocab[2][1]+') in context.'],
  ['Apply the skill','Produce the real course homework using invented names and data only. Check your work against the rubric and be ready to explain it aloud.']
 ];
 c.units.forEach((unit,i)=>{
  const part=E('article',undefined,'v1870-module');
  part.append(E('h6','Lesson '+(i+1)+' — '+unit),E('p',acts[i][0]+': '+acts[i][1]));
  outline.append(part);
 });
 panel.append(outline);
 const wrong=(c.wrong||c.distractors||[]);
 const comparison=E('div',undefined,'v1870-worked');
 comparison.append(E('h5','Worked professional-language example'),
   para('Situation:',c.scenario),
   para('Better wording:',c.good),
   para('Avoid:',wrong[0]),
   E('p','Why it works: the model uses cautious professional language and does not invent proof or promise outcomes. Identify which missing fact must be verified before using the language in a real setting.'));
 panel.append(comparison);
 const quiz=E('div',undefined,'v1870-checks');quiz.append(E('h5','Three knowledge checks: answer and review'));
 const vocab=c.vocab;
 const tasks=[
  {question:'Which professional response best fits the fictional scenario?',options:[c.good,wrong[0],wrong[1]],answer:0,reason:'Preferred model: '+c.good},
  {question:'What does “'+vocab[0][0]+'” mean here?',options:[vocab[0][1],vocab[1][1],vocab[2][1]],answer:0,reason:vocab[0][0]+' = '+vocab[0][1]},
  {question:'Which term means “'+vocab[3][1]+'”?',options:[vocab[2][0],vocab[3][0],vocab[4][0]],answer:1,reason:vocab[3][0]+' = '+vocab[3][1]}
 ];
 const results=[];
 tasks.forEach((task,i)=>{
  const item=E('div',undefined,'v1870-question');item.setAttribute('role','group');item.setAttribute('aria-label',(i+1)+'. '+task.question);item.append(E('p',(i+1)+'. '+task.question,'v1870-question-title'));
  const rot=(c.id.length+i+c.title.length)%3;
  const options=task.options.map((_,j)=>task.options[(j+rot)%3]);
  const right=(task.answer-rot+3)%3;
  const feedback=E('p','Choose one answer.','v1870-check-feedback');feedback.setAttribute('role','status');
  options.forEach((option,j)=>{
   const answerLabel=E('label',undefined,'v1870-answer');
   const radio=E('input');radio.type='radio';radio.name='v1870-'+c.id+'-q'+i;radio.value=String(j);
   radio.addEventListener('change',()=>{
    const correct=j===right;feedback.textContent=(correct?'Correct. ':'Review. ')+task.reason;
    feedback.dataset.correct=String(correct);
    results[i]=correct;
   });
   answerLabel.append(radio,E('span',option));item.append(answerLabel);
  });
  item.append(feedback);quiz.append(item);
 });
 panel.append(quiz);
 const assignment=E('div',undefined,'v1870-assignment');
 assignment.append(E('h5','Practical assignment and feedback rubric'),para('Assignment:',c.homework));
 const draftLabel=E('label',undefined,'v1870-draft-label');
 draftLabel.append(E('span','Draft a short fictional practice response (optional; stays only in this browser tab).'));
 const draft=E('textarea');draft.rows=4;draft.maxLength=1800;draft.placeholder='Write your practice answer using fictional details only. Do not enter client or employer confidential information.';draftLabel.append(draft);
 assignment.append(draftLabel);
 const rubric=E('div',undefined,'v1870-rubric');rubric.append(E('h6','Check your own work before a teacher reviews it'));
 const checks=[
  'Accuracy: distinguish verified facts from assumptions in the fictional case.',
  'Language: apply at least two defined topic terms correctly.',
  'Audience: maintain a respectful, clear professional tone.',
  'Action: explain what still needs to be checked or done next.'
 ];
 checks.forEach((check,i)=>{const row=E('label',undefined,'v1870-rubric-item'),input=E('input');input.type='checkbox';input.name='v1870-rubric-'+c.id+'-'+i;row.append(input,E('span',check));rubric.append(row)});
 assignment.append(rubric,para('Instructor assessment plan:',c.teacher),
 E('p','Teachers can use the four checks, oral roleplay and the submitted fictional homework to give individualized feedback once a class and teacher have actually been confirmed.','v1870-disclaimer'));
 panel.append(assignment);
 wb.append(label,panel);card.append(wb);
}
legal.forEach(c=>{const card=document.getElementById('v1860-topic-'+c.id);if(card)appendWorkbook(card,c,'legal')});
for(const c of business){const cards=document.querySelectorAll('#v1850-business-cards .v1850-course-card, #v1850-investor-cards .v1850-course-card');const card=Array.from(cards).find(x=>x.querySelector('h3')?.textContent===c.title);if(card)appendWorkbook(card,c,'business');}
})();