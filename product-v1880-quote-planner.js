/* EnglishLegalese HF7: informational estimate only. Strictly browser-only: never transmit, store or send. */
(()=>{'use strict';
 const containers=document.querySelectorAll('[data-v1880-quote-planner]');if(!containers.length)return;
 const prices=Object.freeze({8:149,16:249,24:349,48:649});
 const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
 const E=(tag,text)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;return el};
 for(const root of containers){
  root.classList.add('v1880-planner');
  root.append(E('h3','Estimate your multi-employee group package'));
  root.append(E('p','Published introductory group prices per learner. Minimum three employees; 8 or more 50-minute lessons. This estimate is not a booking, payment, or confirmed offer.'));
  const f=E('div');f.className='v1880-planner-fields';
  const chooser=(title,options)=>{const l=E('label',title),sel=E('select');for(const [v,t] of options){const o=E('option',t);o.value=v;sel.append(o);}l.append(sel);f.append(l);return sel};
  const track=chooser('Teaching pathway',[['legal','Legal English'],['business','Business + Investor English'],['complete','Complete 48-topic Professional English']]);
  const size=chooser('Lessons per employee',[['8','8-lesson foundation'],['16','16-lesson structured program'],['24','24-topic complete subject program'],['48','48-topic complete program']]);
  const countLabel=E('label','Number of participating employees (3–999)'),count=E('input');count.type='number';count.min='3';count.max='999';count.step='1';count.value='3';count.inputMode='numeric';countLabel.append(count);f.append(countLabel);root.append(f);
  const result=E('div');result.className='v1880-estimate';result.setAttribute('role','status');result.setAttribute('aria-live','polite');root.append(result);
  const note=E('p','Discount tiers for eligible group seats: 3–5 employees: 5%; 6–10: 10%; 11+: 15%. A teacher, cohort size, separate groups where necessary, timetable, and written quote must be confirmed. Discounts cannot be combined with other offers. Bespoke corporate courses from $499 are quoted separately.');
  note.className='v1880-fine';root.append(note);
  const link=E('a','Request an employer quote with these selections');link.className='v1880-quote-link';root.append(link);
  function update(){
   const program=track.value;
   if(program==='complete'){size.value='48';size.disabled=true;}
   else {size.disabled=false;if(size.value==='48')size.value='24';}
   const lessons=Number(size.value),seats=Number(count.value),valid=Number.isInteger(seats)&&seats>=3&&seats<=999;
   if(!valid){result.textContent='Enter a whole number of employees between 3 and 999 to see an estimate.';link.hidden=true;return}
   const rate=seats>=11?15:seats>=6?10:5;
   const subtotal=seats*prices[lessons],saving=Math.round(subtotal*rate)/100,total=subtotal-saving;
   result.replaceChildren(E('p','Package: '+lessons+' lessons × '+seats+' employees'),E('p','Before discount: '+money(subtotal)),E('p','Employee-seat discount: '+rate+'% (estimated saving '+money(saving)+')'),E('p','Estimated group total: '+money(total)));
   result.lastElementChild.className='v1880-grand-total';
   const params=new URLSearchParams({program,package:lessons===8?'eight':lessons===16?'extended':lessons===24?'full24':'full48',seats:String(seats)});
   link.href='/learn/enroll/?'+params.toString();link.hidden=false;
  }
  track.addEventListener('change',update);size.addEventListener('change',update);count.addEventListener('input',update);update();
 }
})();