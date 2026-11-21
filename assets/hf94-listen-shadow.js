/* HF94 progressive device speech for original HF93 fictional adult dialogues.
 * Read-only, no microphones, no learner input, no recording, no analytics, no network requests.
 * Device speech engines can use platform-managed services; the app never receives voice data.
 * The complete HF93 written lesson remains functional when speech is unsupported.
 */
(()=>{
 'use strict';
 const byId=id=>document.getElementById(id);
 const lab=byId('hf93-conversation-lab');
 const controls={panel:byId('hf94-audio'),dialogue:byId('hf94-audio-dialogue'),model:byId('hf94-audio-model'),transfer:byId('hf94-audio-transfer'),stop:byId('hf94-audio-stop'),rate:byId('hf94-audio-rate'),status:byId('hf94-audio-status'),case:byId('hf93-case'),title:byId('hf93-case-title'),turns:byId('hf93-turns'),speak:byId('hf93-speak'),modelText:byId('hf93-speak-model'),transferBox:byId('hf93-transfer'),transferText:byId('hf93-transfer-answer')};
 if(!lab||Object.values(controls).some(node=>!node))return;
 const synth=window.speechSynthesis;
 const supported=!!(synth&&typeof synth.speak==='function'&&typeof synth.cancel==='function'&&typeof window.SpeechSynthesisUtterance==='function');
 let current=null,token=0;
 const available=kind=>{
  if(!supported||controls.case.hidden||!controls.title.textContent.trim())return false;
  if(kind==='dialogue')return !!controls.turns.textContent.trim();
  if(kind==='model')return !controls.speak.hidden&&!!controls.modelText.textContent.trim();
  if(kind==='transfer')return !controls.transferBox.hidden&&!controls.transferText.hidden&&!!controls.transferText.textContent.trim();
  return false;
 };
 function sync(){
  controls.dialogue.disabled=!available('dialogue');
  controls.model.disabled=!available('model');
  controls.transfer.disabled=!available('transfer');
  controls.stop.disabled=!current;
  if(current&&(!available(current.kind)||current.title!==controls.title.textContent))stopPlayback('The lesson changed; audio stopped.');
 }
 function stopPlayback(message){
  const wasActive=!!current;
  token+=1;current=null;
  if(supported){try{synth.cancel();}catch(_error){/* optional native voice must never interrupt text practice */}}
  if(wasActive&&message)controls.status.textContent=message;
  syncButtons();
 }
 function syncButtons(){controls.stop.disabled=!current;}
 function phrase(kind){
  if(kind==='dialogue')return Array.from(controls.turns.querySelectorAll('p')).map(p=>p.textContent.trim()).filter(Boolean).join('. ');
  if(kind==='model')return controls.modelText.textContent.trim();
  if(kind==='transfer')return controls.transferText.textContent.replace(/^One possible full reply:\s*/,'').trim();
  return '';
 }
 function play(kind){
  if(!available(kind))return;
  const text=phrase(kind);
  if(!text||text.length>2200)return;
  stopPlayback();
  const id=++token;
  try{
   const utterance=new window.SpeechSynthesisUtterance(text);
   utterance.lang='en-US';
   utterance.rate=controls.rate.value==='normal'?1:0.82;
   utterance.pitch=1;
   current={kind,title:controls.title.textContent};
   controls.status.textContent=kind==='dialogue'?'Listening to the fictional exchange. Read along and replay as needed.':kind==='model'?'Listen, pause, then say the complete reply yourself.':'Listen to the possible new-context reply, then say your own sentence.';
   syncButtons();
   utterance.onend=()=>{if(id!==token)return;current=null;syncButtons();controls.status.textContent='Playback finished. Say the complete sentence aloud yourself.';};
   utterance.onerror=()=>{if(id!==token)return;current=null;syncButtons();controls.status.textContent='Device speech was unavailable. Read the visible text aloud instead.';};
   synth.speak(utterance);
  }catch(_error){current=null;syncButtons();controls.status.textContent='Device speech is unavailable here. The complete written lesson still works.';}
 }
 if(supported){
  controls.status.textContent='Optional device voice is available. Playback starts only when you select Listen.';
 }else{
  controls.status.textContent='This browser has no available device voice. Read the written dialogue and model replies aloud instead.';
 }
 controls.dialogue.addEventListener('click',()=>play('dialogue'));
 controls.model.addEventListener('click',()=>play('model'));
 controls.transfer.addEventListener('click',()=>play('transfer'));
 controls.stop.addEventListener('click',()=>stopPlayback('You stopped device audio. The written lesson remains available.'));
 controls.rate.addEventListener('change',()=>{if(current)stopPlayback('Playback stopped. Select Listen again to use the new speed.');});
 lab.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(button&&['hf93-stop','hf93-restart','hf93-next','hf93-to-transfer','hf93-start'].includes(button.id))stopPlayback('Lesson control selected; device audio stopped.');
  queueMicrotask(sync);
 },true);
 lab.addEventListener('change',event=>{if(event.target.matches('input[name="hf93-subject"]'))stopPlayback('Subject changed; device audio stopped.');queueMicrotask(sync);});
 const observer=new MutationObserver(sync);
 observer.observe(controls.case,{attributes:true,attributeFilter:['hidden']});
 observer.observe(controls.speak,{attributes:true,attributeFilter:['hidden']});
 observer.observe(controls.transferBox,{attributes:true,attributeFilter:['hidden']});
 observer.observe(controls.transferText,{attributes:true,attributeFilter:['hidden']});
 observer.observe(controls.title,{childList:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPlayback('Page hidden; device audio stopped.');});
 window.addEventListener('pagehide',()=>stopPlayback());
 sync();
})();
