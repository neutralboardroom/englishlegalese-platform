'use strict';
/* HF50: TR-Clone-compatible fixed response ladder, written independently for 24 adult
   EnglishLegalese lessons. No real-time AI/teacher impersonation or child use. */
(()=>{
 const data=window.EnglishLegaleseTeacherProtocolV1;
 if(!data||data.project!=='EnglishLegalese'||data.protocol!=='tr-clone/teacher-response-ladder/v1'||data.runtimeConnected) return;
 const make=(tag,text,cls)=>{
  const el=document.createElement(tag);if(cls)el.className=cls;
  if(text!==undefined)el.textContent=text;return el;
 };

 for(const card of document.querySelectorAll('article.v1971-lesson')){
  const title=card.querySelector('h3')?.textContent?.trim();
  const c=data.find(title),host=card.querySelector('details.v2100-more-tools');if(!c||!host)continue;
  const area=make('details',undefined,'v2120-response-ladder');
  area.append(make('summary','Facilitator response ladder · adapt when an adult learner hesitates'));
  area.append(make('p','Three original, prewritten coaching paths for a teacher or practice partner. Not live AI, voice analysis, learner scoring or a secure teacher account. No learner information is read or saved.','v2120-note'));
  const controls=make('div',undefined,'v2120-controls');
  const label=make('label','Choose the response support:');
  const select=make('select');select.setAttribute('aria-label','Learner response support for '+title);
  for(const [value,text]of [['quiet','Quiet or unsure'],['developing','Short or partial answer'],['confident','Ready for more challenge']]){
   const option=make('option',text);option.value=value;select.append(option);
  }
  label.append(select);controls.append(label);area.append(controls);
  const stage=make('section',undefined,'v2120-instructions');
  stage.setAttribute('aria-live','polite');area.append(stage);
  const render=()=>{
   const state=select.value;stage.replaceChildren();
   stage.append(make('h4',state==='quiet'?'Supported model and one success':state==='developing'?'Extend the short answer':'Challenge the assumption and check a listener'));
   if(state==='quiet'){
    stage.append(make('p','Say slowly: '+c.model));
    stage.append(make('p','Then ask: What do we actually know from the provided materials? Invite one complete sentence with no pressure to guess.'));
   }else if(state==='developing'){
    stage.append(make('p','Accept the useful part of the answer. Ask for its source: '+c.evidence));
    stage.append(make('p','Then ask the learner to qualify what is not yet verified, using: '+c.qualified));
   }else{
    stage.append(make('p','Invite the learner to challenge this unsupported claim: '+c.overclaim));
    stage.append(make('p','Have the partner paraphrase a constructive question: '+c.question));
   }
  };
  select.addEventListener('change',render);render();host.append(area);
 }
})();