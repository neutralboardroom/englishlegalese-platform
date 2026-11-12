'use strict';
/*
 * EnglishLegalese HF57 — private session speaking-lab conductor.
 * Human teacher-led, 60 minutes, one student's assigned classroom only.
 * NO speech capture, personal notes, scores, analytics, storage, or network.
 * A rehearsal/clock is never attendance proof, a booking, or legal advice.
 */
(()=>{
 const MINUTES=60;
 const stages=[
  {title:'Connect and recall',tip:'Explain the topic you already recognize in one clear sentence.'},
  {title:'Pronunciation and key vocabulary',tip:'Speak each target term, then put it into a complete commercial-English sentence.'},
  {title:'Contract language explanation',tip:'Explain the fictional clause to a client without guessing an uncertain legal effect.'},
  {title:'Two-way negotiation',tip:'Ask one open question; make a qualified response and clarify the next step.'},
  {title:'Clearer second attempt',tip:'Repeat naturally, with one pronunciation correction or one concise phrasing improvement.'},
  {title:'Accurate recap',tip:'State what was discussed, what remains uncertain, and who will verify it.'}
 ];
 const create=(tag,txt,className)=>{
  const el=document.createElement(tag);
  if(txt!==undefined)el.textContent=txt;
  if(className)el.className=className;
  return el;
 };
 const minutesDisplay=seconds=>String(Math.max(0,Math.floor(seconds/60))).padStart(2,'0')+':'+String(Math.max(0,seconds%60)).padStart(2,'0');
 function mount(card,{lesson,role,agenda}={}){
  if(!card||!lesson||card.querySelector('.energy-live-conductor'))return;
  if(!Array.isArray(agenda)||agenda.length!==stages.length||agenda[0]?.start!==0||agenda.at(-1)?.end!==MINUTES)return;
  const block=create('details',undefined,'energy-live-conductor');
  block.append(create('summary','Guided 60-minute speaking lesson · manual rehearsal controls'));
  block.append(create('p','For a human teacher and an adult student. Fictional contract examples only. No recording, automatic scoring, session booking, transmission or client document entry. The optional timer stays in this browser tab.','muted'));
  const preflight=create('fieldset',undefined,'energy-live-preflight');
  preflight.append(create('legend','Optional before-class checks'));
  for(const item of [
   'My microphone and speakers have been tested in the video provider preview.',
   'I have a private place and will not show confidential client documents.',
   'I know the class time and have a connection fallback if video fails.'
  ]){
   const label=create('label',undefined,'energy-live-check');
   const input=create('input');input.type='checkbox';input.value='self_check_only';
   label.append(input,document.createTextNode(' '+item));
   preflight.append(label);
  }
  block.append(preflight);
  const current=create('p',undefined,'energy-live-current');
  current.setAttribute('role','status');
  current.setAttribute('aria-live','polite');
  current.setAttribute('aria-atomic','true');
  const stageText=create('div',undefined,'energy-live-stage');
  const sample=create('details',undefined,'energy-live-example');
  sample.append(create('summary','Compare with a sample sentence'));
  const sampleText=create('p',undefined,'energy-live-model');sample.append(sampleText);
  const controls=create('div',undefined,'actions');
  const back=create('button','Previous stage');back.type='button';
  const next=create('button','Next stage');next.type='button';
  const restart=create('button','Restart stages');restart.type='button';
  controls.append(back,next,restart);
  block.append(current,stageText,sample,controls);
  const timer=create('div',undefined,'energy-live-timer');
  timer.append(create('h4','Optional 60-minute local timer'));
  const clock=create('p','60:00','energy-live-clock');
  clock.setAttribute('role','timer');
  clock.setAttribute('aria-label','Time remaining in optional speaking rehearsal');
  const timerMessage=create('p','Not started. A timer is not a class record.','muted');
  timerMessage.setAttribute('role','status');
  timerMessage.setAttribute('aria-live','polite');
  const timerControls=create('div',undefined,'actions');
  const start=create('button','Start or resume timer');start.type='button';
  const pause=create('button','Pause timer');pause.type='button';
  const resetTime=create('button','Reset timer');resetTime.type='button';
  timerControls.append(start,pause,resetTime);
  timer.append(clock,timerMessage,timerControls);
  block.append(timer);
  let stage=0;
  let remaining=MINUTES*60;
  let deadline=0;
  let tickHandle=null;
  const stopTick=()=>{if(tickHandle!==null){clearInterval(tickHandle);tickHandle=null;}};
  function paintStage(){
   const a=agenda[stage],s=stages[stage];
   current.textContent='Stage '+(stage+1)+' of '+stages.length+' · '+a.start+'–'+a.end+' minutes · '+s.title;
   stageText.replaceChildren(create('p',s.tip),create('p','Fictional scenario: '+lesson.scenario));
   if(stage===1&&lesson.pronunciation)stageText.append(create('p','Speaking practice: '+lesson.pronunciation));
   if(stage===3&&role!=='student'&&lesson.teacherPrompt)stageText.append(create('p','Teacher-only buyer/counsel prompts: '+lesson.teacherPrompt));
   if(stage===1&&role!=='student'&&lesson.teacherPronunciationPrompt)stageText.append(create('p','Teacher-only pronunciation direction: '+lesson.teacherPronunciationPrompt));
   if(stage===5)stageText.append(create('p','Practice after class: '+lesson.homework));
   sampleText.textContent=lesson.model;
   sample.open=false;
   back.disabled=stage===0;
   next.disabled=stage===stages.length-1;
   // The group is manually advanced, not automatically graded.
  }
  const paintTime=()=>{clock.textContent=minutesDisplay(remaining);};
  function tick(){
   remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));
   paintTime();
   if(remaining<=0){
    stopTick();
    timerMessage.textContent='60 minutes elapsed. Confirm completion with your teacher; no attendance or grade was saved.';
   }
  }
  back.addEventListener('click',()=>{if(stage>0){stage--;paintStage();}});
  next.addEventListener('click',()=>{if(stage<stages.length-1){stage++;paintStage();}});
  restart.addEventListener('click',()=>{stage=0;paintStage();for(const x of preflight.querySelectorAll('input'))x.checked=false;});
  start.addEventListener('click',()=>{
   if(tickHandle!==null||remaining===0)return;
   deadline=Date.now()+remaining*1000;
   tickHandle=setInterval(tick,1000);
   timerMessage.textContent='Running locally in this tab. Keep the page open if you want a continuous timer.';
  });
  pause.addEventListener('click',()=>{
   if(tickHandle===null)return;
   tick();stopTick();timerMessage.textContent='Paused. Nothing was saved or transmitted.';
  });
  resetTime.addEventListener('click',()=>{
   stopTick();remaining=MINUTES*60;paintTime();timerMessage.textContent='Reset to 60 minutes. No class record was changed.';
  });
  paintStage();paintTime();pause.disabled=false;
  card.append(block);
 }
 Object.defineProperty(window,'EnglishLegaleseEnergyLiveConductorV1',{
  value:Object.freeze({mount}),configurable:false,writable:false
 });
})();
