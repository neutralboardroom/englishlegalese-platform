'use strict';
/* HF41: optional device/browser speech playback of fixed original fictional sample phrases.
   No learner text, microphone capture, cloud AI request, analytics or recording. */
(()=>{
 const synth=typeof window.speechSynthesis==='object'?window.speechSynthesis:null;
 const canSpeak=!!(synth&&typeof window.SpeechSynthesisUtterance==='function');
 const el=(tag,content,cls)=>{
  const node=document.createElement(tag);
  if(cls)node.className=cls;
  if(content!==undefined)node.textContent=content;
  return node;
 };
 let active=null;
 function stop(){
  if(!active)return;
  const task=active;active=null;
  try{synth?.cancel();}catch{}
  task.stop.disabled=true;
  task.play.disabled=false;
  task.status.textContent='Playback stopped. You can read the example aloud instead.';
 }
 for(const lesson of document.querySelectorAll('article.v1971-lesson')){
  const sample=lesson.querySelector('.v2020-model p')?.textContent?.trim();
  const title=lesson.querySelector('h3')?.textContent?.trim();
  if(!sample||!title)continue;
  const box=el('section',undefined,'v2030-audio');
  box.setAttribute('aria-label','Listen and repeat: '+title);
  box.append(el('h4','Hear a sample professional sentence (optional)'));
  box.append(el('p','Uses your browser or device voice when available. Check speaker routing before playing for a class. It is not a live AI teacher or an assessment; read aloud if no voice is available.','v2030-description'));
  const controls=el('div',undefined,'v2030-controls');
  const play=el('button','Play sample sentence');play.type='button';
  const stopButton=el('button','Stop playback');stopButton.type='button';stopButton.disabled=true;
  const label=el('label','Speaking pace: ');
  const pace=el('select');
  pace.setAttribute('aria-label','Example playback pace for '+title);
  for(const [value,labelText] of [['0.8','Slow'],['1','Normal'],['1.2','Quick']]){
   const opt=el('option',labelText);opt.value=value;
   if(value==='1')opt.selected=true;
   pace.append(opt);
  }
  label.append(pace);
  controls.append(play,stopButton,label);
  const status=el('p','','v2030-status');status.setAttribute('role','status');
  const transcript=el('details',undefined,'v2030-transcript');
  transcript.append(el('summary','Read the sample sentence instead'),el('p',sample));
  box.append(controls,status,transcript);
  const task={play,stop:stopButton,status};
  if(!canSpeak){play.disabled=true;status.textContent='Speech playback is unavailable in this browser. Use the written sample.';}
  play.addEventListener('click',()=>{
   if(!canSpeak){status.textContent='Speech playback unavailable; read the transcript aloud.';return;}
   stop();
   try{
    const utterance=new window.SpeechSynthesisUtterance(sample);
    utterance.lang='en-US';
    utterance.rate=Number(pace.value);
    utterance.pitch=1;
    utterance.onend=()=>{if(active===task){active=null;play.disabled=false;stopButton.disabled=true;status.textContent='Playback finished. Try repeating the sentence in your own words.';}};
    utterance.onerror=()=>{if(active===task){active=null;play.disabled=false;stopButton.disabled=true;status.textContent='Device speech was unavailable. Read the transcript aloud.';}};
    active=task;
    play.disabled=true;stopButton.disabled=false;
    status.textContent='Sample playback requested. Listening depends on available device voices and the selected audio output.';
    synth.cancel();
    synth.speak(utterance);
   }catch{
    if(active===task)active=null;
    play.disabled=false;stopButton.disabled=true;
    status.textContent='Speech is not available on this device. Read the transcript aloud.';
   }
  });
  stopButton.addEventListener('click',stop);
  const anchor=lesson.querySelector('.v2020-dialogue');
  if(anchor)anchor.after(box);else lesson.append(box);
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 window.addEventListener('pagehide',stop);
})();
