/* HF35 — privacy-preserving local practice feedback; not a grade, test or certification. */
(()=>{'use strict';
 const items=document.querySelectorAll('fieldset[data-v1980-check]');
 items.forEach(fieldset=>{
  const action=fieldset.querySelector('button[data-check]');
  const status=fieldset.querySelector('[role="status"]');
  if(!action||!status)return;
  fieldset.addEventListener('change',event=>{
   if(event.target.matches('input[type="radio"]')){
    status.textContent='';
    status.removeAttribute('data-outcome');
   }
  });
  action.addEventListener('click',()=>{
   const selected=fieldset.querySelector('input[type="radio"]:checked');
   if(!selected){
    status.textContent='Select one answer before checking.';
    status.dataset.outcome='incomplete';
    return;
   }
   const right=selected.value===fieldset.dataset.correct;
   const reason=fieldset.dataset.explanation||'Compare the response carefully to the fictional scenario.';
   status.textContent=(right?'Correct. ':'Review this choice. ')+reason+(right?'':' You can change your answer and try again.');
   status.dataset.outcome=right?'correct':'review';
  });
 });
})();
