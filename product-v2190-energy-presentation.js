/* HF60: responsive, fictional-only human-teacher presentation.
 * Desktop shares a separate tab; narrow/mobile screens use a full-screen,
 * accessible presentation view when popups are unreliable or blocked.
 * No student identity, teacher prompts, network, storage or recording.
 */
(()=>{'use strict';
 const create=(d,tag,value,cls)=>{
  const n=d.createElement(tag);
  if(value!==undefined&&value!==null)n.textContent=String(value);
  if(cls)n.className=cls;
  return n;
 };
 const STYLE=`
 .energy-slide-frame{box-sizing:border-box;display:flex;flex-direction:column;min-height:100vh;
  width:100%;background:#092b3d;color:#fff;font-family:system-ui,Arial,sans-serif;line-height:1.4}
 .energy-slide-frame *{box-sizing:border-box}
 .energy-slide-frame header,.energy-slide-frame footer{padding:1rem clamp(1rem,4vw,3rem);
  display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:space-between}
 .energy-slide-frame main{flex:1;min-height:40vh;display:flex;flex-direction:column;
  align-items:center;justify-content:center;padding:clamp(1rem,4vw,3rem);text-align:center}
 .energy-slide-frame h1{font-size:clamp(1.7rem,5vw,4.6rem);line-height:1.15;max-width:1100px;color:#fff}
 .energy-slide-frame p{font-size:clamp(1.05rem,2.8vw,2.3rem);line-height:1.45;
  max-width:1000px;white-space:pre-wrap;color:#fff}
 .energy-slide-frame button{min-height:48px;font:inherit;font-size:1rem;border-radius:6px;
  border:1px solid #cce8ef;padding:.5rem 1rem;background:#fff;color:#092b3d;cursor:pointer}
 .energy-slide-frame button:disabled{opacity:.45;cursor:default}
 .energy-slide-frame button:focus-visible{outline:4px solid #f3b659;outline-offset:2px}
 .energy-slide-frame .brand{font-weight:800;letter-spacing:.04em}
 .energy-slide-frame.energy-slide-inline{position:fixed;inset:0;z-index:2147483647;
  overflow:auto;height:100dvh;min-height:100vh}
 @media(max-width:700px){.energy-slide-frame header,.energy-slide-frame footer{padding:.75rem}
  .energy-slide-frame h1{font-size:clamp(1.55rem,7vw,2.5rem)}
  .energy-slide-frame p{font-size:clamp(1rem,4.5vw,1.5rem)}
  .energy-slide-frame main{padding:1rem}}
 `;
 function slides(lesson){
  // Strict allowlist: never forward the complete teacher lesson object.
  return [
   ['Welcome','Live English speaking practice: '+lesson.title],
   ['Today’s speaking goal',lesson.goal],
   ['Key words',Array.isArray(lesson.vocabulary)?lesson.vocabulary.join(' · '):''],
   ['Fictional contract scenario',lesson.scenario],
   ['Model professional English',lesson.model],
   ['Your turn','Explain the situation in your own words. Then ask one clarification question.'],
   ['Next-class practice',lesson.homework]
  ].filter(x=>typeof x[1]==='string'&&x[1].trim());
 }
 function show(d,target,lesson,{inline,close}){
  const style=create(d,'style');style.textContent=STYLE;d.head.append(style);
  const frame=create(d,'section',undefined,'energy-slide-frame'+(inline?' energy-slide-inline':''));
  if(inline){
   frame.setAttribute('role','dialog');frame.setAttribute('aria-modal','true');
   frame.setAttribute('aria-label','Student-only classroom presentation');
   frame.tabIndex=-1;
  }
  const top=create(d,'header'),main=create(d,'main'),foot=create(d,'footer');
  const back=create(d,'button','Previous'),next=create(d,'button','Next');
  const counter=create(d,'span');
  const quit=create(d,'button','Close presentation');
  for(const b of [back,next,quit])b.type='button';
  top.append(create(d,'span','ENGLISHLEGALESE · HUMAN-LED CLASS','brand'),
    create(d,'span',inline?'Presentation-only view. Check your screen-sharing options.':'Share only this tab in Google Meet'));
  foot.append(back,counter,next,quit);
  frame.append(top,main,foot);
  target.append(frame);
  const pages=slides(lesson);
  if(!pages.length){frame.remove();style.remove();return;}
  let index=0;
  function paint(){
   main.replaceChildren(create(d,'h1',pages[index][0]),create(d,'p',pages[index][1]));
   counter.textContent='Slide '+(index+1)+' of '+pages.length;
   back.disabled=index===0;next.disabled=index===pages.length-1;
  }
  back.addEventListener('click',()=>{if(index>0){index--;paint();}});
  next.addEventListener('click',()=>{if(index<pages.length-1){index++;paint();}});
  quit.addEventListener('click',close);
  const keys=e=>{
   if(e.key==='ArrowRight'&&index<pages.length-1){index++;paint();e.preventDefault();}
   if(e.key==='ArrowLeft'&&index>0){index--;paint();e.preventDefault();}
   if(e.key==='Escape'&&inline){close();e.preventDefault();}
   if(e.key==='Tab'&&inline){
    const focusable=[back,next,quit].filter(x=>!x.disabled);
    const first=focusable[0],last=focusable.at(-1);
    if(e.shiftKey&&d.activeElement===first){last.focus();e.preventDefault();}
    else if(!e.shiftKey&&d.activeElement===last){first.focus();e.preventDefault();}
   }
  };
  (inline?frame:d).addEventListener('keydown',keys);
  paint();
  if(inline)quit.focus();
 }
 function mount(card,{lesson,role}={}){
  if(!card||!lesson||!['teacher','owner','admin'].includes(role))return;
  const button=create(document,'button','Open student presentation for Google Meet','energy-presentation-open');
  button.type='button';
  button.addEventListener('click',()=>{
   const narrow=Boolean(window.matchMedia?.('(max-width: 700px)').matches);
   const pop=narrow?null:window.open('about:blank','_blank');
   if(pop){
    pop.opener=null;
    const d=pop.document;d.title='EnglishLegalese · Live class presentation';
    d.body.style.margin='0';
    show(d,d.body,lesson,{inline:false,close:()=>pop.close()});
    return;
   }
   // Mobile and popup-blocked browsers: a real, fullscreen fictional-only
   // presentation without any exposed teacher notes inside its view.
   const originalOverflow=document.body.style.overflow;
   let frame;
   const close=()=>{
    if(frame)frame.remove();
    document.querySelector('#energy-hf60-slide-style')?.remove();
    document.body.style.overflow=originalOverflow;
    button.focus();
   };
   show(document,document.body,lesson,{inline:true,close});
   frame=document.querySelector('.energy-slide-inline');
   const css=Array.from(document.head.querySelectorAll('style')).at(-1);
   if(css)css.id='energy-hf60-slide-style';
   document.body.style.overflow='hidden';
  });
  card.append(button);
 }
 window.EnglishLegaleseEnergyPresentationV1=Object.freeze({mount});
})();
