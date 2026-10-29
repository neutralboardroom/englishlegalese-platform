/* HF26 summary-first homepage. Never move or remove legacy learning sections:
 * original app.js hash navigation requires each section to remain a direct #app child.
 * Teacher photo remains immutable and independent of all HTML text and buttons.
 */
(()=>{'use strict';
if(window.__el18512HomepageInstalled)return;
window.__el18512HomepageInstalled=true;
const E=(tag,text,cls)=>{const x=document.createElement(tag);if(text!==undefined)x.textContent=text;if(cls)x.className=cls;return x};
const PATHS=Object.freeze([
 ['Legal English','Professional language for legal practice and international work.','/learn/legal-english/','legal'],
 ['Business English','Workplace communication, meetings, negotiation and investors.','/learn/business-english/','business'],
 ['Legal English Certifications','Explore teacher-supervised Legal English assessments and CEFR-informed levels.','/learn/certifications/','certifications-legal'],
 ['Business English Certifications','Explore an independent Business English assessment pathway and CEFR-informed levels.','/learn/certifications/','certifications-business'],
 ['For employers','Explore group classes, employee enrollment requests and consent-based progress reporting.','/learn/employers/','employers'],
 ['Teachers & classes','Explore human-teacher classes and learning formats.','/learn/live-classes/','teachers']
]);
const GROUPS=Object.freeze([
 ['Featured courses and topics','See Legal English, Business English and introductory practice.',[['Start and learning guide','#start'],['Find your learning route','#learning-pathways'],['Learning diagnostic','#diagnostic'],['Course topics and exercises','#courses']]],
 ['Free learning resources','Access all original speaking, writing, reading and practice labs.',[['Learning skills studio','#skills'],['Short practice','#quick-practice'],['SmartTeacher','#smartteacher'],['AI Draft Review Lab','#ai-review-lab'],['Contract Clause Reading Lab','#clause-reading-lab'],['Meeting Follow-up Lab','#meeting-followup-lab'],['Email Clarity Lab','#email-clarity-lab'],['Guided Practice','#guided-practice-path'],['Case Brief Lab','#case-brief-lab'],['Legal Vocabulary','#legal-vocabulary-guide'],['Revision Studio','#revision-studio'],['Free Trial Information','#smartteacher-free-trial']]],
 ['For employers and teaching','Read our programs, teaching opportunities and course options.',[['Teacher-led programs','#teachers'],['Team learning and employers','#employers'],['Employer training page','/learn/employers/']]],
 ['How it works, privacy and FAQ','Find practical guidance and limits before enrolling.',[['Learning experience','#learning-experience'],['Trust and privacy','#trust'],['Pricing and packages','/pricing/'],['Account and saved work','/learn/account/']]]
]);
function link(text,destination,cls){const a=E('a',text,cls);a.href=destination;return a}
function mount(){
 const root=document.getElementById('app'),hero=root?.querySelector('#home'),room=root?.querySelector('#live-classes');
 if(!root||!hero||!room||root.querySelector('#v18512-home-preview'))return;
 // Preserve actual planner, its controls, events and provider choices; move it without cloning.
 hero.after(room);
 const preview=E('section',undefined,'v18512-home-preview');preview.id='v18512-home-preview';preview.setAttribute('aria-labelledby','v18512-home-title');
 const wrap=E('div',undefined,'container'),title=E('h2','Choose your EnglishLegalese pathway');title.id='v18512-home-title';
 wrap.append(title,E('p','Explore the essentials first. Open a topic below whenever you want the complete tools and details.'));
 const cards=E('div',undefined,'v18512-pathway-cards');
 for(const [name,description,href,cls] of PATHS){const item=E('article',undefined,'v18512-pathway-card v18512-'+cls);item.append(E('h3',name),E('p',description),link('Explore '+name+' →',href));cards.append(item)}wrap.append(cards);
 const steps=E('section',undefined,'v18512-steps');steps.append(E('h2','How EnglishLegalese works'));const ol=E('ol');
 for(const line of ['Choose a legal or business language learning goal.','Build skills through structured exercises and human guidance.','Use real-world professional communication scenarios to practise.','Explore supervised certificate assessment requirements when relevant.'])ol.append(E('li',line));
 steps.append(ol);wrap.append(steps);
 const heading=E('h2','More to explore');heading.id='v18512-more-heading';wrap.append(heading);
 const groupArea=E('div',undefined,'v18512-more');groupArea.setAttribute('aria-labelledby','v18512-more-heading');
 for(const [name,info,destinations] of GROUPS){const details=E('details',undefined,'v18512-disclosure'),summary=E('summary'),content=E('div',undefined,'v18512-disclosure-body'),list=E('ul');
  summary.append(E('strong',name),E('span',info));details.append(summary);
  for(const [label,href]of destinations){const li=E('li');li.append(link(label+' →',href));list.append(li)}
  content.append(list,E('p','Full material remains available on its original page or focused learning section.'));details.append(content);groupArea.append(details);
 }wrap.append(groupArea);
 const footer=E('p',undefined,'v18512-end-actions');
 for(const [label,href]of [['Start learning','/learn/start/'],['View pricing','/pricing/'],['Create an account','/learn/account/']])footer.append(link(label,href));
 wrap.append(footer);preview.append(wrap);room.after(preview);
 document.documentElement.dataset.v18512Homepage='summary-first';
 // Existing routing remains authoritative for focus views and deep links.
 if(typeof window.englishLegaleseApplyView==='function')window.englishLegaleseApplyView();
}
function mountSoon(){setTimeout(mount,210)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountSoon,{once:true});else mountSoon();
window.addEventListener('hashchange',mountSoon);
})();
