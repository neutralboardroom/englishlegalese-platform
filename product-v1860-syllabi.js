/* v1.86: 32 independent classroom teaching sessions. No student data, network calls or purchases. */
(()=>{'use strict';
const E=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const source=window.ELCURRICULUM_V1800?.records;if(!Array.isArray(source)||source.length!==28)return;
const legal=source.filter(t=>t.group!=='Professional & Business English');
const business=window.ELBUSINESS_V1850?.business||[];
function exercise(t,id){
 const f=E('fieldset',undefined,'v1860-exercise');f.append(E('legend','Which professional response is the most accurate?'),E('p',t.scenario));
 const answers=[t.good,...(t.wrong||t.distractors||[])];
 answers.forEach((answer,i)=>{const l=E('label'),input=E('input');input.type='radio';input.name='v1860-answer-'+id;input.value=String(i);l.append(input,E('span',answer));f.append(l)});
 const button=E('button','Check your response'),feedback=E('p','Choose an answer and check it.','v1860-feedback');button.type='button';feedback.setAttribute('role','status');
 button.addEventListener('click',()=>{const x=f.querySelector('input:checked');feedback.textContent=!x?'Select a response first.':x.value==='0'?'Correct. Notice how this response explains what is known and avoids unsupported claims.':'Try again: look for a factual, precise answer that acknowledges any missing information.'});
 f.append(button,feedback);return f;
}
function glossary(t){const dl=E('dl');t.vocab.forEach(([term,definition])=>dl.append(E('dt',term),E('dd',definition)));return dl}
function objectives(t){const ol=E('ol');t.units.forEach(unit=>ol.append(E('li',unit)));return ol}
const host=document.getElementById('v1860-legal-topics');
if(host && legal.length===24){legal.forEach((t,i)=>{const art=E('article',undefined,'v1850-course-card'),d=E('details');
 const body=E('div',undefined,'v1860-topic-detail');
 body.append(E('h4','Four ordered lesson steps'),objectives(t),E('h4','Five vocabulary terms'),glossary(t),exercise(t,'topic-'+i),E('h4','Homework'),E('p',t.homework),E('h4','Teacher materials'),E('p',t.teacher));
 d.append(E('summary','View lessons, vocabulary, exercise, homework and teacher notes'),body);art.append(E('p',t.group+' · '+t.level,'v1850-track'),E('h3',t.title),E('p',t.outcome),d);host.append(art)})}
const timeline=[['0–5 minutes','Warm-up: activate prior knowledge; state today’s speaking/writing objective'],['5–15 minutes','Vocabulary: model the five key terms in realistic sentences'],['15–27 minutes','Guided practice: analyze the fictional scenario and compare alternative responses'],['27–42 minutes','Role-play: learner performs and revises a professional explanation'],['42–50 minutes','Exit check: learner explains the key correction and records homework']];
document.querySelectorAll('.v1860-session-list[data-v1860-program]').forEach(list=>{
 const name=list.dataset.v1860Program;
 const lessons=(name==='legal'?legal:business).slice(0,16);
 if(lessons.length!==16){list.append(E('p','Classroom sequence is temporarily unavailable.'));return}
 lessons.forEach((t,i)=>{const d=E('details',undefined,'v1860-session'),detail=E('div',undefined,'v1860-session-detail');
 const stages=E('ol');timeline.forEach(([time,activity])=>stages.append(E('li',time+': '+activity)));
 detail.append(E('h3','Learning outcome'),E('p',t.outcome),
  E('h4','50-minute instructor timeline'),stages,E('h4','Four ordered language-learning steps'),objectives(t),
  E('h4','Target vocabulary'),glossary(t),E('h4','Fictional scenario and interactive explanation'),exercise(t,name+'-'+i),
  E('h4','Actionable homework'),E('p',t.homework),
  E('p','Self-check: distinguish verified information from assumptions and use at least three target terms correctly.'),
  E('h4','Topic-specific teacher facilitation'),E('p',t.teacher),
  E('h4','Teacher feedback rubric'),E('p','Score factual accuracy, spoken/written clarity, professional tone and appropriate uncertainty from 0–2 each. Identify one strength, one correction and one next practice step.'));
 d.append(E('summary','Session '+String(i+1).padStart(2,'0')+' — '+t.title),detail);list.append(d)});
});
})();
