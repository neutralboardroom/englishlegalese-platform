/* EnglishLegalese v1.77.0 — owner-reviewed comprehensive learning usability.
   Additive only: existing lessons/routes, approved logo and account/AI/payment gates stay intact. */
(()=>{
'use strict';
const VERSION='1.77.0';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const node=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;};
const COURSE={
2:{name:'Legal English Foundations',objective:'Recognize clear professional requests, obligations and factual updates.',explain:'Legal English is precise when it distinguishes facts, future actions and requests. Prefer clear words while keeping the original meaning.',case:'Fictional note: “Please confirm whether you received the revised form. Our team has not submitted anything yet.”',qs:[
['Which action has already happened?',['The form was submitted.','The team requested confirmation.','The form was approved.'],1,'The note requests confirmation; it does not claim submission or approval.'],
['What remains unclear?',['Whether the recipient received the form.','Who drafted the contract.','When the court ruled.'],0,'The message explicitly asks for confirmation of receipt.'],
['Choose the accurate status.',['Submission completed.','Approval guaranteed.','Receipt unconfirmed; submission not yet made.'],2,'Do not confuse receipt or confirmation with submission.']]},
3:{name:'Legal Writing and Professional Email',objective:'Write a courteous message with a purpose, a factual update and one clear next step.',explain:'A professional email is easier to follow when it tells the reader what happened, what remains uncertain, and what response you need.',case:'Fictional email: “In accordance with prior correspondence, we are writing in reference to the aforementioned documents.” The sender needs the reviewer to confirm receipt.',qs:[
['What is missing from the long sentence?',['A clear request.','A company slogan.','More legal jargon.'],0,'The email has context but no answerable next step.'],
['Choose a clearer version.',['Please confirm that you received the documents.','The documents must have been approved.','The court has accepted everything.'],0,'A direct request is both clear and accurate.'],
['How should a deadline be stated if unverified?',['Guarantee it.','Say it is subject to confirmation.','Ignore it entirely.'],1,'Avoid inventing a fixed deadline.']]},
4:{name:'Speaking, Meetings, and Client Calls',objective:'Clarify instructions and repeat action items accurately in professional conversation.',explain:'Effective speaking means politely checking the intended meaning, noting conditions and confirming who will do what next.',case:'Fictional meeting: “We aim to circulate the summary Friday, assuming reviewer comments arrive Wednesday.”',qs:[
['Is Friday a guaranteed deadline?',['Yes.','No, it is a conditional target.','The note confirms circulation happened.'],1,'“Assuming” signals a condition.'],
['Which reply best clarifies?',['So Friday depends on Wednesday comments?','Friday is certainly the filing date.','No one needs to reply.'],0,'Repeat the condition as a question.'],
['A useful next step would be…',['Confirm who checks for comments.','Claim the comments arrived.','Promise the filing was made.'],0,'Clarification should lead to a verifiable action.']]},
5:{name:'Contract and Document Reading',objective:'Notice conditional language and separate wording from legal conclusions.',explain:'Read the complete sentence before summarizing. Words such as may, must, if and subject to change how an ordinary-language statement is understood. Seek legal review for real contract meaning.',case:'Fictional training clause: “The supplier may deliver early if the customer provides prior written approval.”',qs:[
['What is conditional?',['Early delivery.','The existence of the customer.','All future payments.'],0,'Early delivery depends on prior written approval.'],
['Does this clause say the supplier MUST deliver early?',['Yes.','No.','It confirms delivery.'],1,'It says “may” in this example.'],
['Before using this in a real agreement…',['Ask a qualified reviewer to examine context.','Assume it applies to every country.','Treat practice as legal advice.'],0,'This is language education, not contractual advice.']]},
6:{name:'AI Translation and Output Review',objective:'Check whether fluent automated wording preserves verified facts and uncertainty.',explain:'AI-assisted rewriting can sound polished while inserting unsupported certainty. Verify source facts and the intended meaning before relying on a rewrite.',case:'Fictional source: “The client says the form was submitted.” AI rewrite: “The court accepted the filing.”',qs:[
['What went wrong?',['Unverified court acceptance was added.','The sentence is too short.','The client name is missing.'],0,'Reported submission does not prove court acceptance.'],
['Choose a safer version.',['The client reports submitting the form; acceptance has not been confirmed.','The filing has been accepted.','The deadline was extended automatically.'],0,'Separate reported actions from confirmation.'],
['What review is needed for real legal effects?',['Qualified human verification.','Only grammar checking.','No review at all.'],0,'Accuracy and professional judgment matter.']]},
7:{name:'LL.M. and Law School Readiness',objective:'Summarize a hypothetical argument and raise a respectful academic question.',explain:'Strong classroom contributions distinguish a proposition, its supporting reason, and a point that needs further evidence.',case:'Fictional seminar note: “The writer argues that short reminders help teams respond faster, but cites no controlled comparison.”',qs:[
['What is the main proposition?',['Short reminders may help response times.','All reminders are legally binding.','A controlled study proved the claim.'],0,'The writer argues for a potential benefit.'],
['What evidence is missing?',['A controlled comparison.','A legal signature.','A court translation.'],0,'The note explicitly states no controlled comparison is cited.'],
['Which is a good seminar question?',['What evidence supports the faster-response claim?','Why is the claim always true?','Can we skip the evidence?'],0,'A respectful question tests the basis for a proposition.']]}
};
const PHRASE='Please confirm the meeting time.';
const NATIVE={
'Arabic':'يرجى تأكيد موعد الاجتماع.','Chinese':'请确认会议时间。','French':'Veuillez confirmer l’heure de la réunion.','Georgian (ქართული)':'გთხოვთ, დაადასტუროთ შეხვედრის დრო.','German':'Bitte bestätigen Sie die Besprechungszeit.','Japanese':'会議の時間をご確認ください。','Korean':'회의 시간을 확인해 주세요.','Portuguese':'Por favor, confirme o horário da reunião.','Russian':'Пожалуйста, подтвердите время встречи.','Spanish':'Por favor, confirme la hora de la reunión.','Thai':'กรุณายืนยันเวลาการประชุม','Ukrainian':'Будь ласка, підтвердьте час зустрічі.','Vietnamese':'Vui lòng xác nhận thời gian cuộc họp.'
};
function mountCourses(){
 const s=$('#courses');if(!s||s.dataset.v1770Courses)return;s.dataset.v1770Courses='true';
 const cards=$$('.v1580-course-card',s);if(cards.length!==9)return;
 const box=node('div',undefined,'container v1770-lesson-wrap');
 const panel=node('section',undefined,'panel v1770-lesson');panel.id='v1770-course-lesson';panel.hidden=true;panel.setAttribute('aria-label','Course sample lesson');const h=node('h3');h.tabIndex=-1;const objective=node('p');const theory=node('p');const scenario=node('blockquote');const form=node('form');const questions=node('div');const check=node('button','Check my learning','btn teal');check.type='submit';const reset=node('button','Close lesson','btn light');reset.type='button';const actions=node('div',undefined,'v1770-lesson-actions');actions.append(check,reset);const result=node('p','Read and select the best answer for each question.','v1770-lesson-status');result.setAttribute('role','status');result.setAttribute('aria-live','polite');
 form.append(questions,actions);panel.append(h,objective,theory,scenario,form,result,node('p','These are fictional educational exercises—not a legal assessment or qualification. Your answers stay in this page.','v1770-small'));box.append(panel);s.append(box);let selected=null;
 function open(idx){const lesson=COURSE[idx];if(!lesson)return;selected=idx;h.textContent=lesson.name+' — lesson 1: precise professional communication';objective.textContent='Learning objective: '+lesson.objective;theory.textContent=lesson.explain;scenario.textContent=lesson.case;questions.replaceChildren();
  lesson.qs.forEach((q,i)=>{const fs=node('fieldset',undefined,'v1770-question'),leg=node('legend',(i+1)+'. '+q[0]);fs.append(leg);q[1].forEach((t,j)=>{const label=node('label',undefined,'v1770-option'),input=node('input');input.type='radio';input.name='v1770-q-'+i;input.value=String(j);label.append(input,document.createTextNode(t));fs.append(label);});questions.append(fs);});result.textContent='Answer all three questions to review the explanation.';panel.hidden=false;panel.scrollIntoView({block:'start',behavior:'instant'});h.focus({preventScroll:true});}
 form.addEventListener('submit',e=>{e.preventDefault();const l=COURSE[selected],chosen=l.qs.map((_,i)=>$('input[name="v1770-q-'+i+'"]:checked',form));if(chosen.some(x=>!x)){result.textContent='Please answer all three questions before checking.';return;}let score=0;const explanations=l.qs.map((q,i)=>{const correct=Number(chosen[i].value)===q[2];if(correct)score++;return (correct?'Correct. ':'Review. ')+q[3]});result.replaceChildren(node('strong',score+' of 3 matched the passage.'));const list=node('ol');explanations.forEach(t=>list.append(node('li',t)));result.append(list);});
 form.addEventListener('change',()=>{result.textContent='Your answers changed. Check again for updated explanations.';});
 reset.addEventListener('click',()=>{panel.hidden=true;selected=null;});
 cards.forEach((card,i)=>{const go=node('button',i===0?'Take starting diagnostic':i===1?'Explore SmartTeacher practice':i===8?'Explore employer training':'Start a sample lesson','btn light v1770-course-action');go.type='button';go.addEventListener('click',()=>{if(COURSE[i])open(i);else location.hash=i===0?'diagnostic':i===1?'smartteacher':'employers';});card.append(go);});
}
function mountSmartTeacher(){
 const s=$('#smartteacher');if(!s||s.dataset.v1770Ai)return;s.dataset.v1770Ai='true';const input=$('#el-practice-topic',s);if(!input)return;
 input.maxLength=2500;input.setAttribute('aria-describedby','v1770-main-counter');const count=node('p','','v1770-main-counter');count.id='v1770-main-counter';count.setAttribute('role','status');count.setAttribute('aria-live','polite');input.after(count);
 const group=node('div',undefined,'v1770-files'),heading=node('h3','Documents and images — local selection only'),intro=node('p','You can choose a practice document or screenshot here to check the file type and size. No upload, extraction or AI image/document review is currently active. Never select confidential client files.','v1770-small');group.append(heading,intro);
 const actions=node('div',undefined,'v1770-file-actions'),info=node('p','No file selected. Nothing has been uploaded.','v1770-file-status');info.setAttribute('role','status');info.setAttribute('aria-live','polite');
 [['Document','pdf,doc,docx,txt,rtf,odt,ppt,pptx,xls,xlsx','.pdf,.doc,.docx,.txt,.rtf,.odt,.ppt,.pptx,.xls,.xlsx'],['Image / screenshot','png,jpg,jpeg,webp,heic,tif,tiff','.png,.jpg,.jpeg,.webp,.heic,.tif,.tiff']].forEach((t,i)=>{const lab=node('label','Choose '+t[0]+' (local)','v1770-file-label'),file=node('input');file.type='file';file.id='v1770-file-'+i;file.accept=t[2];lab.htmlFor=file.id;lab.append(file);actions.append(lab);file.addEventListener('change',()=>{const f=file.files?.[0];if(!f){info.textContent='No file selected. Nothing has been uploaded.';return;}const ext=f.name.split('.').pop().toLowerCase(),allow=t[1].split(',');info.textContent=!allow.includes(ext)?'Unsupported file format; nothing uploaded.':f.size>10485760?'File exceeds the local 10 MB selection limit; nothing uploaded.':'Selected '+f.name+' ('+(f.size/1048576).toFixed(2)+' MB). Local selection only: no upload or AI processing.';});});
 group.append(actions,info);const practice=$('.v1620-practice-panel',s);if(practice)practice.append(group);
 function update(){count.textContent=Math.max(0,2500-input.value.length).toLocaleString('en-US')+' characters remaining of 2,500. Prompt preparation only; no live AI response in this box.';}input.addEventListener('input',update);$$('.v1580-starter',s).forEach(b=>b.addEventListener('click',()=>setTimeout(update,0)));update();
 const desc=$('.section-head p',s);if(desc)desc.textContent='This on-page prompt builder does not send text to an AI service or generate live AI feedback. Practise with fictional facts. The verified-account AI trial and genuine file review have separate readiness requirements.';
}
function mountLanguage(){
 const s=$('#language-bridge');if(!s||s.dataset.v1770Lang)return;s.dataset.v1770Lang='true';
 const strip=$('.v151-mode-strip',s),sel=$('.js-language-select',s);if(!strip||!sel)return;
 const labels=['Show Legal English','Show Simple English','Explain in my language','Practice in Legal English','Explore human teacher guidance'];const buttons=[];
 Array.from(strip.children).forEach((old,i)=>{const b=node(i===4?'a':'button',labels[i], 'v1770-lang-action');if(i===4)b.href='#teachers';else b.type='button';old.replaceWith(b);buttons.push(b);});
 const area=node('div',undefined,'v1770-language-example');area.setAttribute('aria-label','Interactive multilingual Legal English learning example');const title=node('h3','Try a short language-learning example'),out=node('p',PHRASE,'v1770-language-output');out.setAttribute('role','status');out.setAttribute('aria-live','polite');const note=node('p','Educational example only; no certified translation, legal advice or real-document interpretation.','v1770-small');const quiz=node('fieldset',undefined,'v1770-language-quiz');quiz.hidden=true;quiz.append(node('legend','What does “Please confirm the meeting time” request?'));[['Verify when the meeting is scheduled',true],['Cancel the meeting',false],['State that the meeting has already finished',false]].forEach(([t,ok],i)=>{const l=node('label',undefined,'v1770-option'),r=node('input');r.type='radio';r.name='v1770-language-answer';r.value=String(i);l.append(r,document.createTextNode(t));quiz.append(l);});const score=node('p','','v1770-language-score');score.setAttribute('role','status');const check=node('button','Check my answer','btn teal');check.type='button';check.addEventListener('click',()=>{let v=$('input[name="v1770-language-answer"]:checked',quiz);score.textContent=v===null?'Choose one response first.':v.value==='0'?'Correct. This is a polite request to confirm a meeting time.':'Try again. The sentence asks for confirmation, not cancellation or a finished meeting.';});
 quiz.append(check,score);area.append(title,out,note,quiz);strip.after(area);let mode=0;
 function show(n){mode=n;buttons.forEach((b,i)=>{if(i!==4)b.setAttribute('aria-pressed',String(i===n));});quiz.hidden=n!==3;score.textContent='';if(n===0){title.textContent='Original Legal English';out.textContent=PHRASE;note.textContent='This is a polite professional request.';}if(n===1){title.textContent='Simple English';out.textContent='Please check and tell me the time of the meeting.';note.textContent='A simple explanation of the request, not a legal conclusion.';}if(n===2){title.textContent='Explanation in '+sel.value;out.textContent=NATIVE[sel.value]||'A reviewed translation example is not yet available in this selected language.';note.textContent=NATIVE[sel.value]?'Short curated educational example; not certified translation or legal advice.':'Your preference is saved. We will not invent an unverified translation; English practice remains available.';}if(n===3){title.textContent='Practise in Legal English';out.textContent=PHRASE;note.textContent='Read the original example and select the most accurate interpretation.';}}
 buttons.slice(0,4).forEach((b,i)=>b.addEventListener('click',()=>show(i)));sel.addEventListener('change',()=>{if(mode===2)show(2);});show(0);
}
function mountRoleViews(){
 const s=$('#teachers');if(!s)return;
 const active=location.hash.slice(1);
 if(s.dataset.v1770Role){
   if(s.dataset.v1770Role===active)return;
   const prior=$('.v1770-role-details',s);if(prior)prior.remove();
   const oldGrid=$('.grid',s);if(oldGrid){oldGrid.classList.remove('v1770-role-focus');Array.from(oldGrid.children).forEach(card=>card.hidden=false);}
 }
 s.dataset.v1770Role=active;const grid=$('.grid',s);if(!grid)return;const teacher=grid.children[0],employer=grid.children[1];if(!teacher||!employer)return;
 const hash=location.hash.slice(1),isTeacher=hash==='teachers',isEmployer=hash==='employers';
 if(isTeacher||isEmployer){grid.classList.add('v1770-role-focus');if(isTeacher)employer.hidden=true;else teacher.hidden=true;}
 const extra=node('div',undefined,'container v1770-role-details');const content=isEmployer?[
 ['Training for professional teams','Explore practical, role-based Legal English exercises for legal and business communications.'],
 ['Progress without exposing private drafts','Employer reporting should use appropriate consent-based learning measures. Private work is not automatically shared.'],
 ['Employer account access','Authorized roles can use the existing account entry point. Pricing, bookings, and production training activation require separate confirmation.']
 ]:[
 ['Learn with a human teacher','Professional instructors can help you understand difficult passages, practise conversations, develop clear writing, and review your progress.'],
 ['Combine independent practice and human feedback','Use structured exercises or AI-supported preparation between lessons, then discuss questions and language choices with a real teacher.'],
 ['Teach with EnglishLegalese','Qualified teachers can explore course material, lesson preparation and role-based account access; onboarding and scheduling must be confirmed.']
 ];
 if(!isTeacher&&!isEmployer)return;
 const h=node('h2',isEmployer?'Employer learning and team training':'Human teaching and learning pathways');extra.append(h);const rows=node('div',undefined,'v1770-role-cards');content.forEach(([title,desc])=>{const a=node('article',undefined,'panel');a.append(node('h3',title),node('p',desc));rows.append(a);});extra.append(rows,node('p','Current account and availability requirements remain in effect. This page does not promise immediate bookings or invented teaching profiles.','v1770-small'));s.append(extra);
}
function mountTrust(){const s=$('#trust');if(!s||s.dataset.v1770Trust)return;s.dataset.v1770Trust='true';const container=node('div',undefined,'container v1770-trust-extra');const h=node('h3','How this learning platform protects clarity and trust'),p=node('p','Our free browser-only exercises use fictional examples and do not send your typed practice responses to live AI. The SmartTeacher prompt builder prepares prompts locally; actual account-based AI replies and document processing have separate launch requirements.');const links=node('p',undefined,'v1770-trust-links');for(const [label,href] of [['Review language support','#language-bridge'],['Explore teacher support','#teachers'],['Explore free exercises','#courses']]){const a=node('a',label+' →');a.href=href;links.append(a);}container.append(h,p,links);s.append(container);}
function mount(){
 const root=$('#app');if(!root)return;
 mountCourses();mountSmartTeacher();mountLanguage();mountRoleViews();mountTrust();
 document.documentElement.dataset.englishlegaleseMaterialRelease=document.querySelector('meta[name="englishlegalese-release"]')?.content || VERSION;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,0),{once:true});else setTimeout(mount,0);
window.addEventListener('hashchange',()=>{setTimeout(mount,0);setTimeout(mount,75);});
})();