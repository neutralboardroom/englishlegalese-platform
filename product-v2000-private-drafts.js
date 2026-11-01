'use strict';
/* HF38: explicit browser-only save/restore of fictional learning drafts.
   No server upload, automatic storage, cross-lesson overwrite or credential access. */
(()=>{
 const lessons=Array.from(document.querySelectorAll('article.v1971-lesson'));
 function make(tag,cls,text){
  const node=document.createElement(tag);
  if(cls)node.className=cls;
  if(text!==undefined)node.textContent=text;
  return node;
 }
 for(const lesson of lessons){
  const textarea=lesson.querySelector('textarea');
  const title=lesson.querySelector('h3')?.textContent?.trim();
  const label=textarea?.closest('label');
  if(!textarea||!title||!label)continue;
  const header='EnglishLegalese private practice draft\nLesson: '+title+'\n\n';
  const tools=make('section','v2000-draft-tools');
  tools.setAttribute('aria-label','Private draft file controls for '+title);
  const heading=make('p','v2000-draft-heading','Keep a copy of your practice');
  const guidance=make('p','v2000-draft-guidance','Your writing is not sent to EnglishLegalese or automatically saved. Download a text file before leaving; you can restore that file into the same lesson later. Use invented facts only.');
  const actions=make('div','v2000-draft-actions');
  const download=make('button','','Download draft (.txt)');
  download.type='button';
  const restore=make('label','v2000-draft-restore','Restore saved .txt draft');
  const fileInput=make('input');
  fileInput.type='file';
  fileInput.accept='.txt,text/plain';
  fileInput.setAttribute('aria-label','Restore saved draft for '+title);
  restore.append(fileInput);
  actions.append(download,restore);
  const feedback=make('p','v2000-draft-feedback','');
  feedback.setAttribute('aria-live','polite');
  tools.append(heading,guidance,actions,feedback);
  label.after(tools);
  const update=()=>{download.disabled=!textarea.value.trim();};
  textarea.addEventListener('input',update);
  update();
  download.addEventListener('click',()=>{
   if(!textarea.value.trim()){feedback.textContent='Write a practice draft before downloading.';return;}
   const file=new Blob([header+textarea.value],{type:'text/plain;charset=utf-8'});
   const url=URL.createObjectURL(file);
   const link=make('a');
   const safe=title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,55);
   link.download='englishlegalese-'+safe+'-practice-draft.txt';
   link.href=url;
   document.body.append(link);
   link.click();
   link.remove();
   window.setTimeout(()=>URL.revokeObjectURL(url),2000);
   feedback.textContent='Download requested. Check your device Downloads to confirm the file is saved.';
  });
  fileInput.addEventListener('change',async()=>{
   const file=fileInput.files?.[0];
   fileInput.value='';
   if(!file)return;
   if(!file.name.toLowerCase().endsWith('.txt')||file.size>10240){
    feedback.textContent='Choose a plain .txt draft file of 10 KB or less.';
    return;
   }
   try{
    const content=(await file.text()).replace(/\r\n/g,'\n');
    if(!content.startsWith(header)){
     feedback.textContent='This file belongs to another lesson or is not an EnglishLegalese practice export. Your current draft was not changed.';
     return;
    }
    const restored=content.slice(header.length);
    if(!restored.trim()||restored.length>textarea.maxLength){
     feedback.textContent='This draft is empty or exceeds this lesson’s character limit. Your current draft was not changed.';
     return;
    }
    if(textarea.value.trim()&&!window.confirm('Replace the draft currently shown for this lesson with your saved text file?')){
     feedback.textContent='Restore cancelled. Your current draft was not changed.';
     return;
    }
    textarea.value=restored;
    textarea.dispatchEvent(new Event('input',{bubbles:true}));
    feedback.textContent='Draft restored from your file on this device. It is not saved online.';
   }catch{
    feedback.textContent='Could not read this text file. Your current draft was not changed.';
   }
  });
 }
})();
