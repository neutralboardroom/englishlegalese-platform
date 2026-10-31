/* HF26 summary-first homepage. Never move or remove legacy learning sections:
 * original app.js hash navigation requires each section to remain a direct #app child.
 * Teacher photo remains immutable and independent of all HTML text and buttons.
 */
(()=>{'use strict';
if(window.__el18512HomepageInstalled)return;
window.__el18512HomepageInstalled=true;
const E=(tag,text,cls)=>{const x=document.createElement(tag);if(text!==undefined)x.textContent=text;if(cls)x.className=cls;return x};
const PATHS=Object.freeze([
 ['Legal English','Build the English skills you need for legal work and international practice.','/learn/legal-english/','legal','graduation-cap'],
 ['Business English','Communicate confidently in global business and professional settings.','/learn/business-english/','business','chart-no-axes-combined'],
 ['Certifications','Explore our separate Legal English and Business English certification pathways.','/learn/certifications/','certifications','award'],
 ['For employers','Train your team with practical, results-focused English programs.','/learn/employers/','employers','users-round'],
 ['Teachers & classes','Learn with human teachers in live online lessons.','/learn/live-classes/','teachers','presentation']
]);
const GROUPS=Object.freeze([
 ['Featured Courses','Popular topics for Legal and Business English','book-open', [['Start and learning guide','#start'],['Find your learning route','#learning-pathways'],['Learning diagnostic','#diagnostic'],['Course topics and exercises','#courses']]],
 ['Certifications','Levels, assessments, and employer value','award',[['Legal English certification','/learn/legal-english-certification/'],['Business English certification','/learn/business-english-certification/'],['Certification overview','/learn/certifications/']]],
 ['Free Learning Resources','14 tools, practice materials, and more','book-open-check',[['Learning skills studio','#skills'],['Short practice','#quick-practice'],['SmartTeacher','#smartteacher'],['AI Draft Review Lab','#ai-review-lab'],['Contract Clause Reading Lab','#clause-reading-lab'],['Meeting Follow-up Lab','#meeting-followup-lab'],['Email Clarity Lab','#email-clarity-lab'],['Guided Practice','#guided-practice-path'],['Case Brief Lab','#case-brief-lab'],['Legal Vocabulary','#legal-vocabulary-guide'],['Revision Studio','#revision-studio'],['Free Trial Information','#smartteacher-free-trial']]],
 ['For Employers','Programs, enrollment, and benefits','users-round',[['Team learning and employers','#employers'],['Employer training page','/learn/employers/'],['Employer dashboard','/learn/employer-dashboard/']]],
 ['FAQs','Quick answers to common questions','circle-help',[['Learning experience','#learning-experience'],['Trust and privacy','#trust'],['Pricing and packages','/pricing/'],['Account and saved work','/learn/account/']]]
]);
const ICON_PATHS=Object.freeze({
 'graduation-cap':['m2 10 10-5 10 5-10 5-10-5','M6 12v5c0 2 12 2 12 0v-5','M22 10v6'],
 'chart-no-axes-combined':['M3 3v18h18','M7 17v-5','M12 17V9','M17 17V6','m6 10 5-3 6-3'],
 'award':['M8 4h8l3 4-3 5H8L5 8l3-4Z','M9 13v8l3-2 3 2v-8','M10 8h4'],
 'users-round':['M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2','M8.5 3a4 4 0 1 1 0 8a4 4 0 0 1 0-8','M22 20v-2a4 4 0 0 0-3-3.87','M16 3.13a4 4 0 0 1 0 7.75'],
 'presentation':['M2 4h20v13H2z','M12 17v4','M8 21h8','M6 13l4-4 3 2 4-4'],
 'book-open':['M12 6a8 8 0 0 0-9-1v14a8 8 0 0 1 9 1z','M12 6a8 8 0 0 1 9-1v14a8 8 0 0 0-9 1z'],
 'book-open-check':['M12 6a8 8 0 0 0-9-1v14a8 8 0 0 1 9 1z','M12 6a8 8 0 0 1 9-1v14a8 8 0 0 0-9 1z','m15 11 2 2 3-4'],
 'circle-help':['M12 22a10 10 0 1 0 0-20a10 10 0 0 0 0 20','M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5','M12 18h.01']
});
function iconSymbol(name,cls){
 const span=E('span',undefined,cls),svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','2');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.setAttribute('focusable','false');
 for(const d of ICON_PATHS[name]||[]){const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',d);svg.append(path)}
 span.append(svg);span.setAttribute('aria-hidden','true');return span;
}
function link(text,destination,cls){const a=E('a',text,cls);a.href=destination;return a}
/* HF31 real visual homepage: one image-led first screen plus a genuine,
 * local-only lesson planning form. The protected teacher photograph is a CSS
 * image asset; every word and button remains independent editable DOM.
 * Existing full classroom planner remains intact on its focused route. */
function buildIntegratedHero(){
 const section=E('section',undefined,'v18531-integrated-hero');section.id='v18531-integrated-hero';section.setAttribute('aria-label','Teacher-led English learning and class planning');
 const copy=E('div',undefined,'v18531-teacher-copy');
 const title=E('h2','Teacher-led learning, together.');title.className='v18531-image-heading';
 const description=E('p','Learn practical Legal English and Business English for real-world professional communication with experienced human teachers and guided independent practice.','v18531-image-lead');
 const actions=E('div',undefined,'v18531-hero-actions');
 actions.append(link('Start learning','/learn/start/','v18531-blue-action'),link('View courses','/learn/courses/','v18531-white-action'),link('Learn more','#v18512-home-preview','v18531-white-action'));
 const caveat=E('p','Explore classes and create an unconfirmed plan. Times are preferences, not live availability or bookings.','v18531-image-caveat');
 copy.append(title,description,actions,caveat);
 const form=E('form',undefined,'v18531-hero-planner');form.noValidate=true;form.setAttribute('aria-label','Preview a teacher-led class plan');form.setAttribute('autocomplete','off');
 form.append(E('p','YOUR CLASS PLANNING WORKSPACE','v18531-planner-eyebrow'),E('h3','Build your online class plan'),E('p','Choose your study focus and preview a lesson time in your local timezone. No booking or payment is made.','v18531-planner-intro'));
 const fields=E('div',undefined,'v18531-form-fields');
 const control=(id,name,element)=>{element.id=id;const label=E('label',undefined,'v18531-field');label.htmlFor=id;label.append(E('span',name),element);return label};
 const focus=E('select');focus.required=true;
 ['Live one-to-one Legal English','Live one-to-one Business English','Business meetings, presentations and negotiation','Investor and Wall Street communication','Legal writing and contract vocabulary','Teacher-supervised certification preparation','Employer team communication'].forEach((value,i)=>{const o=E('option',value);o.value=String(i);focus.append(o)});
 const provider=E('select');
 [['zoom','Zoom'],['meet','Google Meet'],['teams','Microsoft Teams'],['voov','Tencent / VooV'],['other','Another approved video classroom']].forEach(([id,value])=>{const o=E('option',value);o.value=id;provider.append(o)});
 const when=E('input');when.type='datetime-local';when.required=true;
 const suggested=new Date(Date.now()+24*60*60*1000);suggested.setHours(10,0,0,0);
 const isoLocal=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')+'T'+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');when.value=isoLocal(suggested);
 const duration=E('select');[['30','30 minutes'],['45','45 minutes'],['60','60 minutes'],['90','90 minutes']].forEach(([id,value])=>{const o=E('option',value);o.value=id;duration.append(o)});duration.value='60';
 fields.append(control('v18531-focus','Learning focus',focus),control('v18531-provider','Preferred video classroom',provider),control('v18531-when','Preferred lesson time (your device timezone)',when),control('v18531-duration','Class length',duration));
 const timezone=Intl.DateTimeFormat().resolvedOptions().timeZone||'your device timezone';
 const note=E('p','Times shown in your device timezone: '+timezone+'. This is a personal planning preview.','v18531-plan-note');
 const buttons=E('div',undefined,'v18531-form-actions');
 const submit=E('button','Preview a class plan','v18531-plan-button');submit.type='submit';
 buttons.append(submit,link('View all class topics','/learn/live-classes/','v18531-topic-button'));
 const status=E('p','Select a focus and preferred time to preview your plan.','v18531-form-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const result=E('div',undefined,'v18531-plan-result');result.hidden=true;
 form.append(fields,note,buttons,status,result);
 const reset=()=>{result.hidden=true;status.textContent='Choices changed. Preview the revised plan before using it.'};
 for(const c of [focus,provider,when,duration])c.addEventListener('change',reset);
 form.addEventListener('submit',event=>{
  event.preventDefault();const date=new Date(when.value);
  if(!when.value||Number.isNaN(date.getTime())||date.getTime()<=Date.now()+120000){result.hidden=true;status.textContent='Choose a valid future date and time at least two minutes from now.';when.focus();return}
  result.replaceChildren(E('strong','Your unconfirmed class plan'),E('p',focus.selectedOptions[0].textContent+' · '+provider.selectedOptions[0].textContent+' · '+date.toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'})+' · '+duration.selectedOptions[0].textContent),E('p','Not booked: a real teacher and an approved meeting link must be confirmed separately.'));
  result.hidden=false;status.textContent='Planning preview prepared locally. No appointment, payment or network request was made.';
 });
 section.append(copy,form);return section;
}
function mount(){
 // Scope condensed display to the actual default home hash only, NEVER to focused
 // legacy tools whose nested section routing reports a generic home view.
 document.documentElement.dataset.v18529CompactHome=(!location.hash||location.hash==='#home')?'yes':'no';
 const root=document.getElementById('app'),hero=root?.querySelector('#home'),room=root?.querySelector('#live-classes');
 if(!root||!hero||!room||root.querySelector('#v18512-home-preview'))return;
 // Keep the full original teaching explanation available, but make the homepage
 // scannable as approved; its words remain normal editable DOM, not image pixels.
 const heroCopy=hero.querySelector('.hero-copy');
 if(heroCopy&&!heroCopy.querySelector('.v18529-about-method')){
  const full=E('details',undefined,'v18529-about-method');
  full.append(E('summary','Read how human teaching and AI-supported practice work together'));
  for(const selector of ['.lead','.v1760-method-note','.v18510-cert-hero']){
   const node=heroCopy.querySelector(selector);if(node)full.append(node);
  }
  const controls=heroCopy.querySelector('.hero-actions');
  const intro=E('p','Practical Legal and Business English for work, combining human teachers, independent courses, and carefully guided AI practice.','v18529-short-intro');
  const cert=E('p','EnglishLegalese offers separate Legal English and Business English certification pathways using CEFR-informed, teacher-supervised assessments. ','v18529-short-cert');
  cert.append(link('Explore certifications →','/learn/certifications/'));
  if(controls){heroCopy.insertBefore(intro,controls);heroCopy.insertBefore(cert,controls);heroCopy.insertBefore(full,controls)}else heroCopy.append(intro,cert,full);
 }
 // Preserve actual planner, its controls, events and provider choices; move it without cloning.
 hero.after(room);
 // The approved first screen must be IMAGE-LED, not the legacy writing example.
 // Keep that original example and all its links later in the same #home section.
 if(!hero.querySelector('#v18531-integrated-hero'))hero.prepend(buildIntegratedHero());
 const preview=E('section',undefined,'v18512-home-preview');preview.id='v18512-home-preview';preview.setAttribute('aria-labelledby','v18512-home-title');
 const wrap=E('div',undefined,'container'),title=E('h2','Explore EnglishLegalese');title.id='v18512-home-title';
 title.className='v18528-visually-hidden';wrap.append(title);
 const cards=E('div',undefined,'v18512-pathway-cards');
 for(const [name,description,href,cls,icon] of PATHS){const item=E('article',undefined,'v18512-pathway-card v18512-'+cls);const symbol=iconSymbol(icon,'v18528-card-icon');const body=E('div');body.append(E('h3',name),E('p',description),link(name==='Certifications'?'Learn about certifications →':'Explore '+name+' →',href));item.append(symbol,body);cards.append(item)}wrap.append(cards);
 const steps=E('section',undefined,'v18512-steps');steps.append(E('h2','How EnglishLegalese works'),E('p','Flexible, practical, and designed for real results.'));const ol=E('ol');
 const stepCopy=['Choose your focus — Legal English, Business English, certifications, or free resources.','Learn with expert teachers through live online classes.','Build real skills in speaking, reading, writing, and professional communication.','Earn a certification (optional) after a qualifying teacher-supervised assessment.'];
 const stepIcons=['book-open','presentation','chart-no-axes-combined','award'];
 stepCopy.forEach((line,i)=>{const item=E('li',undefined,'v18531-step');item.dataset.step=String(i+1);item.append(iconSymbol(stepIcons[i],'v18531-step-icon'),E('span',line,'v18531-step-copy'));ol.append(item)});

 steps.append(ol);wrap.append(steps);
 const heading=E('h2','More to explore');heading.id='v18512-more-heading';heading.className='v18528-visually-hidden';wrap.append(heading);
 const groupArea=E('div',undefined,'v18512-more');groupArea.setAttribute('aria-labelledby','v18512-more-heading');
 for(const [name,info,icon,destinations] of GROUPS){const details=E('details',undefined,'v18512-disclosure'),summary=E('summary'),content=E('div',undefined,'v18512-disclosure-body'),list=E('ul');
  const symbol=iconSymbol(icon,'v18528-disclosure-icon');const copy=E('span');copy.append(E('strong',name),E('span',info));summary.append(symbol,copy);details.append(summary);
  for(const [label,href]of destinations){const li=E('li');li.append(link(label+' →',href));list.append(li)}
  content.append(list,E('p','Full material remains available on its original page or focused learning section.'));details.append(content);groupArea.append(details);
 }wrap.append(groupArea);
 const footer=E('p',undefined,'v18512-end-actions');
 for(const [label,href]of [['Start learning','/learn/start/'],['View pricing','/pricing/'],['Create an account','/learn/account/']])footer.append(link(label,href));
 wrap.append(footer);preview.append(wrap);
 // Position the actual approved pathways immediately below the image-led hero;
 // the historic education/copy block follows as an accessible supplement.
 const original=hero.querySelector(':scope > .hero-grid');
 if(original){hero.insertBefore(preview,original)}else hero.append(preview);
 document.documentElement.dataset.v18512Homepage='summary-first';
 // Existing routing remains authoritative for focus views and deep links.
 if(typeof window.englishLegaleseApplyView==='function')window.englishLegaleseApplyView();
}
function mountSoon(){setTimeout(mount,210)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountSoon,{once:true});else mountSoon();
window.addEventListener('hashchange',mountSoon);
})();
