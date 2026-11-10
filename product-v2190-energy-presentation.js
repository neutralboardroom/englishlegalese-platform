/* HF58: teacher-only student-facing presentation for live human Google Meet screen sharing.
 * All text comes from existing fictional lesson data, not students, credentials,
 * documents or Google. No audio, camera, network call or local storage. */
(()=>{'use strict';
 function mount(card,{lesson,role}){
  if(!card||!lesson||!['teacher','owner','admin'].includes(role))return;
  const button=document.createElement('button');button.type='button';
  button.className='energy-presentation-open';
  button.textContent='Open student presentation for Google Meet';
  button.addEventListener('click',()=>{
   const popup=window.open('about:blank','_blank');
   if(!popup){window.alert('Allow a new tab to show the student presentation.');return;}
   popup.opener=null;
   const d=popup.document;
   d.title='EnglishLegalese · Live class presentation';
   const style=d.createElement('style');style.textContent=`
    :root{font-family:system-ui,Arial,sans-serif;background:#092b3d;color:#fff}
    body{margin:0;min-height:100vh;display:flex;flex-direction:column}
    header,footer{padding:1rem clamp(1rem,4vw,3rem);display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:space-between}
    main{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:clamp(1rem,4vw,4rem);text-align:center}
    h1{font-size:clamp(2rem,5vw,4.6rem);line-height:1.15;max-width:1100px}
    p{font-size:clamp(1.2rem,2.8vw,2.3rem);line-height:1.45;max-width:1000px;white-space:pre-wrap}
    button{min-height:48px;font:inherit;border-radius:6px;border:1px solid #cce8ef;padding:.5rem 1rem;background:#fff;color:#092b3d;cursor:pointer}
    button:disabled{opacity:.45}button:focus-visible{outline:4px solid #f3b659}
    .brand{font-weight:800;letter-spacing:.06em}
   `;d.head.append(style);
   const elem=(tag,value,cls)=>{const x=d.createElement(tag);if(value!=null)x.textContent=String(value);if(cls)x.className=cls;return x;};
   const allowed=[
    ['Welcome','Live English speaking practice: '+lesson.title],
    ['Today’s speaking goal',lesson.goal],
    ['Key words',Array.isArray(lesson.vocabulary)?lesson.vocabulary.join(' · '):''],
    ['Fictional contract scenario',lesson.scenario],
    ['Model professional English',lesson.model],
    ['Your turn','Explain the situation in your own words. Then ask one clarification question.'],
    ['Next-class practice',lesson.homework]
   ].filter(x=>x[1]);
   const top=elem('header');top.append(elem('span','ENGLISHLEGALESE · HUMAN-LED CLASS','brand'),elem('span','Share only this tab in Google Meet'));
   const main=elem('main'),bottom=elem('footer'),prev=elem('button','Previous'),next=elem('button','Next'),counter=elem('span');
   prev.type='button';next.type='button';bottom.append(prev,counter,next);d.body.replaceChildren(top,main,bottom);
   let index=0;
   function render(){
    main.replaceChildren(elem('h1',allowed[index][0]),elem('p',allowed[index][1]));
    counter.textContent='Slide '+(index+1)+' of '+allowed.length;
    prev.disabled=index===0;next.disabled=index===allowed.length-1;
   }
   prev.addEventListener('click',()=>{if(index>0){index--;render();}});
   next.addEventListener('click',()=>{if(index<allowed.length-1){index++;render();}});
   d.addEventListener('keydown',event=>{
    if(event.key==='ArrowRight'&&index<allowed.length-1){index++;render();}
    if(event.key==='ArrowLeft'&&index>0){index--;render();}
   });
   render();
  });
  card.append(button);
 }
 window.EnglishLegaleseEnergyPresentationV1=Object.freeze({mount});
})();
