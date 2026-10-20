/* EnglishLegalese v1.75.0 — free fictional listening and clarification lab.
   Fully self-contained. No microphone, site network calls, AI, account, or storage. */
(()=>{
 'use strict';
 const VERSION='1.75.0';
 const CASES=[
  {id:'intake',name:'Client intake clarification',setting:'A fictional first conversation about a missing attachment.',turns:[
    ['Colleague','The client says the supporting letter was submitted yesterday.'],
    ['Learner','Do we have confirmation that the letter actually arrived?'],
    ['Colleague','Not yet. We only have the client’s message, not a receipt.'],
    ['Learner','I will request the receipt and describe the submission as unconfirmed until we check it.']
   ],questions:[
    {ask:'What is confirmed?',options:['A receipt proves delivery.','The client reported sending the letter.','The reviewing office rejected the letter.'],answer:1,why:'The client’s report is known, but delivery has not been verified.'},
    {ask:'Which question best clarifies the uncertainty?',options:['Has the document been received, and can we see a receipt?','Should we announce that delivery is complete?','Can we disregard the letter entirely?'],answer:0,why:'Requesting independent confirmation avoids treating a report as proof.'},
    {ask:'Which status wording is most accurate?',options:['The letter is definitely filed.','The letter is rejected.','Submission is reported but receipt is not yet confirmed.'],answer:2,why:'State what was reported and what remains unknown separately.'}
   ]},
  {id:'meeting',name:'Meeting and deadline language',setting:'A fictional project-team meeting about a draft deadline.',turns:[
    ['Manager','The draft should be ready by Friday if the reviewers return their comments by Wednesday.'],
    ['Learner','Is Friday a fixed deadline or a target depending on the comments?'],
    ['Manager','It is a target, not a final commitment. We need to confirm the reviewers’ timing.'],
    ['Learner','I will circulate Friday as the conditional target and request the review schedule.']
   ],questions:[
    {ask:'What kind of date is Friday?',options:['An unconditional legal deadline.','A target dependent on earlier comments.','A confirmed meeting date.'],answer:1,why:'The manager explicitly makes Friday contingent on Wednesday feedback.'},
    {ask:'Which follow-up avoids exaggeration?',options:['The completed draft is guaranteed Friday.','No work is scheduled until next month.','We aim for Friday if Wednesday comments arrive; please confirm.'],answer:2,why:'Keep the condition visible rather than silently turning a target into a commitment.'},
    {ask:'What should the learner ask for next?',options:['Confirmation of reviewer timing.','A statement that comments are unnecessary.','An approval that no one has given.'],answer:0,why:'The missing review timing governs whether the proposed draft target is realistic.'}
   ]},
  {id:'contract',name:'Contract wording and approval',setting:'A fictional internal discussion about wording that has not been approved.',turns:[
    ['Reviewer','The new draft says the supplier may deliver early with written approval.'],
    ['Learner','Does may mean the supplier has permission, rather than an obligation?'],
    ['Reviewer','In the exercise, that is the intended distinction, but legal meaning still needs qualified review.'],
    ['Learner','I will flag may versus must and avoid describing the draft as approved.']
   ],questions:[
    {ask:'What wording distinction needs review?',options:['May versus must.','Supplier versus customer names only.','The font family.'],answer:0,why:'May suggests permission; must typically expresses an obligation, subject to context and qualified review.'},
    {ask:'What is the document’s approval status?',options:['Approved by both parties.','Still a draft awaiting appropriate review.','Already filed in court.'],answer:1,why:'The discussion concerns draft wording, not an actual approval.'},
    {ask:'Which update is appropriately careful?',options:['The supplier is legally required to deliver early.','We can treat the draft as binding.','The draft uses may; approval and legal effect need review.'],answer:2,why:'Distinguish the observed text from unconfirmed approval and legal effect.'}
   ]}
 ];
 const q=(sel,root=document)=>root.querySelector(sel);
 function labMarkup(){
  return [
   '<section class="section v1750-listening" id="listening-clarification-lab" aria-labelledby="v1750-title">',
   '<div class="container"><div class="section-head"><div><div class="eyebrow">Free listening and clarification practice</div>',
   '<h2 id="v1750-title">Hear the distinction. Ask the right follow-up.</h2></div>',
   '<p>Three invented Legal English conversations. Listen with an optional browser voice or read the transcript, then practise noticing uncertainty, timing and approval language.</p></div>',
   '<div class="v1750-grid"><div class="panel v1750-work">',
   '<label class="v1750-label" for="v1750-case">Choose a conversation</label>',
   '<select id="v1750-case" class="input"><option value="intake">Client intake clarification</option><option value="meeting">Meeting and deadline language</option><option value="contract">Contract wording and approval</option></select>',
   '<p class="v1750-setting"></p>',
   '<div class="v1750-listen-actions"><button type="button" class="btn teal v1750-play">Play conversation</button>',
   '<button type="button" class="btn light v1750-slow">Play more slowly</button>',
   '<button type="button" class="btn light v1750-stop">Stop playback</button></div>',
   '<p class="v1750-audio-status" role="status" aria-live="polite">Audio is optional. You can always reveal the written transcript.</p>',
   '<button type="button" class="v1750-transcript-toggle btn light" aria-expanded="false" aria-controls="v1750-transcript">Show transcript</button>',
   '<div id="v1750-transcript" class="v1750-transcript" hidden><h3>Fictional conversation transcript</h3><ol class="v1750-lines"></ol></div>',
   '<p class="v1750-private">Browser speech depends on your device and its installed voice; it is not a human recording or an evaluated speaking test. This site does not record your microphone, send answers to AI, or save your results. Browser voice processing may depend on your device settings.</p>',
   '</div><div class="panel v1750-work">',
   '<h3>Listen, reason and clarify</h3>',
   '<p class="v1750-quiz-intro">Answer three questions about what the fictional speakers actually said. Results are for your private practice only.</p>',
   '<form class="v1750-quiz" novalidate><div class="v1750-questions"></div>',
   '<div class="v1750-controls"><button type="submit" class="btn gold v1750-check">Check my answers</button>',
   '<button type="reset" class="btn light v1750-reset">Start this conversation again</button></div></form>',
   '<p class="v1750-feedback" role="status" aria-live="polite">Choose a response for each question before checking.</p>',
   '<div class="v1750-reasons" hidden><h3>Why these answers matter</h3><ol class="v1750-explanations"></ol></div>',
   '<p class="v1750-private">This activity teaches careful professional wording, not legal advice, certification, legal interpretation or teacher-assessed ability.</p>',
   '<p class="v1750-links"><a href="#meeting-followup-lab">Meeting follow-up practice →</a> <a href="#professional-message-builder">Write a clear message →</a></p>',
   '</div></div></div></section>'
  ].join('');
 }
 function wire(section){
  const chooser=q('#v1750-case',section),setting=q('.v1750-setting',section);
  const transcript=q('#v1750-transcript',section),lines=q('.v1750-lines',section),toggle=q('.v1750-transcript-toggle',section);
  const questions=q('.v1750-questions',section),form=q('.v1750-quiz',section);
  const status=q('.v1750-audio-status',section),feedback=q('.v1750-feedback',section),reasons=q('.v1750-reasons',section),explanations=q('.v1750-explanations',section);
  let speech=null;
  function selected(){return CASES.find(c=>c.id===chooser.value)||CASES[0];}
  function stop(silent=false){
   if(speech){try{speech.cancel();}catch(_){}}
   if(!silent)status.textContent='Playback stopped. You may listen again or read the transcript.';
  }
  function play(slow){
   stop(true);
   if(!('speechSynthesis' in window)||typeof window.SpeechSynthesisUtterance!=='function'||!window.speechSynthesis){
    status.textContent='Browser speech is unavailable here. Use Show transcript to read the conversation.';
    return;
   }
   try{
    speech=window.speechSynthesis;
    const spoken=selected().turns.map(turn=>turn[0]+' says: '+turn[1]).join(' ');
    const u=new window.SpeechSynthesisUtterance(spoken);
    u.lang='en-US';u.rate=slow?0.72:0.93;u.pitch=1;
    u.onend=()=>{status.textContent='Playback finished. You can replay it or check the transcript.';};
    u.onerror=()=>{status.textContent='Playback was interrupted. Show transcript remains available.';};
    speech.speak(u);
    status.textContent=slow?'Playing more slowly using your browser voice.':'Playing with your browser voice.';
   }catch(_){status.textContent='Browser speech could not start. Show transcript remains available.';}
  }
  function render(){
   stop(true);speech=null;
   const c=selected();setting.textContent=c.setting;
   lines.replaceChildren();
   c.turns.forEach(([speaker,words])=>{
    const li=document.createElement('li');
    const strong=document.createElement('strong');strong.textContent=speaker+': ';
    li.append(strong,document.createTextNode(words));lines.append(li);
   });
   transcript.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.textContent='Show transcript';
   questions.replaceChildren();
   c.questions.forEach((question,i)=>{
    const fieldset=document.createElement('fieldset');fieldset.className='v1750-question';
    const legend=document.createElement('legend');legend.textContent=(i+1)+'. '+question.ask;fieldset.append(legend);
    question.options.forEach((option,j)=>{
     const label=document.createElement('label');label.className='v1750-option';
     const input=document.createElement('input');input.type='radio';input.name='answer-'+i;input.value=String(j);
     label.append(input,document.createTextNode(option));fieldset.append(label);
    });questions.append(fieldset);
   });
   feedback.textContent='Choose a response for each question before checking.';
   reasons.hidden=true;explanations.replaceChildren();
   status.textContent='Audio is optional. You can always reveal the written transcript.';
  }
  chooser.addEventListener('change',render);
  q('.v1750-play',section).addEventListener('click',()=>play(false));
  q('.v1750-slow',section).addEventListener('click',()=>play(true));
  q('.v1750-stop',section).addEventListener('click',()=>stop());
  toggle.addEventListener('click',()=>{
   transcript.hidden=!transcript.hidden;
   toggle.setAttribute('aria-expanded',String(!transcript.hidden));
   toggle.textContent=transcript.hidden?'Show transcript':'Hide transcript';
  });
  questions.addEventListener('change',()=>{feedback.textContent='Answers changed. Check again to see feedback for your latest choices.';reasons.hidden=true;explanations.replaceChildren();});
  form.addEventListener('submit',event=>{
   event.preventDefault();
   const c=selected();const picks=c.questions.map((_,i)=>form.querySelector('input[name="answer-'+i+'"]:checked'));
   if(picks.some(v=>!v)){
    feedback.textContent='Answer all three questions before checking; you can use the transcript at any time.';
    const missing=picks.findIndex(v=>!v);const first=form.querySelector('input[name="answer-'+missing+'"]');first?.focus();return;
   }
   const correct=picks.reduce((n,el,i)=>n+(Number(el.value)===c.questions[i].answer?1:0),0);
   feedback.textContent=correct+' of '+c.questions.length+' responses match the exercise explanations. This is a practice self-check, not an assessed grade.';
   explanations.replaceChildren();
   c.questions.forEach((item,i)=>{
    const li=document.createElement('li');
    const chosen=Number(picks[i].value),label=chosen===item.answer?'Matches the example: ':'Review this: ';
    const lead=document.createElement('strong');lead.textContent=label;li.append(lead,document.createTextNode(item.why));
    explanations.append(li);
   });reasons.hidden=false;
  });
  form.addEventListener('reset',()=>{stop(true);setTimeout(()=>{feedback.textContent='Answers cleared. Replay, read or answer again.';reasons.hidden=true;explanations.replaceChildren();status.textContent='Audio is optional. You can always reveal the written transcript.';},0);});
  window.addEventListener('hashchange',()=>{
   if(window.location.hash!=='#listening-clarification-lab'&&window.location.hash!=='#listening-clarification-lab/')stop(true);
  });
  window.addEventListener('pagehide',()=>stop(true));
  render();
 }
 function mount(){
  const app=q('#app');if(!app||!q('#home',app))return;
  let section=q('#listening-clarification-lab',app);
  if(!section){
   const template=document.createElement('template');template.innerHTML=labMarkup();
   section=template.content.firstElementChild;
   const existing=q('#professional-message-builder',app);
   if(existing)existing.after(section);else app.append(section);
   wire(section);
  }
  document.documentElement.dataset.englishlegaleseMaterialRelease=VERSION;
  if(typeof window.englishLegaleseApplyView==='function')window.englishLegaleseApplyView();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
 window.addEventListener('hashchange',mount);
})();
