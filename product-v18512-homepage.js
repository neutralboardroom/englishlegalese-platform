/* HF26: homepage overview and progressive disclosure without deleting tools.
 * All text links stay real DOM nodes. Native details keep nested content accessible.
 * Website copy and CTAs are editable here; teacher photo is a separate locked asset.
 */
(()=>{'use strict';
if(window.__el18512HomepageInstalled)return;
window.__el18512HomepageInstalled=true;
const E=(tag,txt,cls)=>{const el=document.createElement(tag);if(txt!==undefined)el.textContent=txt;if(cls)el.className=cls;return el};
const PATHS=Object.freeze([
 {name:'Legal English',description:'Build precise communication for legal work, contracts and international practice.',href:'/learn/legal-english/',cls:'legal'},
 {name:'Business English',description:'Practise meetings, negotiation, correspondence and investor communication.',href:'/learn/business-english/',cls:'business'},
 {name:'Certifications',description:'Explore separate Legal and Business English assessment pathways and levels.',href:'/learn/certifications/',cls:'certifications'},
 {name:'For employers',description:'Explore team language programs, planning and consent-based progress reporting.',href:'/learn/employers/',cls:'employers'},
 {name:'Teachers & classes',description:'See human-teacher classes and available learning formats.',href:'/learn/live-classes/',cls:'teachers'}
]);
const FOLDS=Object.freeze([
 {label:'Courses, topics and starting assessments',hint:'Preview structured lessons, starter exercises and diagnostics.',ids:['start','learning-pathways','diagnostic','courses']},
 {label:'Free practice tools and learning resources',hint:'Explore writing, speaking, reading and AI-supported practice.',ids:['skills','quick-practice','smartteacher','ai-review-lab','clause-reading-lab','meeting-followup-lab','email-clarity-lab','guided-practice-path','case-brief-lab','legal-vocabulary-guide','revision-studio','smartteacher-free-trial']},
 {label:'Teachers, employers and class details',hint:'Read complete classroom and employer-program information.',ids:['teachers','employers']},
 {label:'How learning works, safety and FAQ',hint:'Read detailed guidance about methodology and learning limits.',ids:['learning-experience','trust']}
]);
function apply(){
 const root=document.getElementById('app'),hero=root?.querySelector('#home'),room=root?.querySelector('#live-classes');
 if(!root||!hero||!room||root.querySelector('#v18512-home-preview'))return;
 // Move the existing, functioning teacher-led classroom planner without cloning it.
 // Existing event listeners, values and provider options remain on the same nodes.
 hero.after(room);
 const main=E('section',undefined,'v18512-home-preview');main.id='v18512-home-preview';main.setAttribute('aria-labelledby','v18512-home-title');
 const wrap=E('div',undefined,'container'),h=E('h2','Choose your EnglishLegalese pathway');h.id='v18512-home-title';
 wrap.append(h,E('p','Start with your goal. Continue into full learning and course details only when you need them.'));
 const cards=E('div',undefined,'v18512-pathway-cards');
 for(const card of PATHS){const item=E('article',undefined,'v18512-pathway-card v18512-'+card.cls),title=E('h3',card.name),descr=E('p',card.description),link=E('a','Explore '+card.name+' →');link.href=card.href;item.append(title,descr,link);cards.append(item)}wrap.append(cards);
 const steps=E('section',undefined,'v18512-steps');steps.append(E('h2','How EnglishLegalese works'));
 const list=E('ol');for(const line of ['Choose Legal English, Business English or free resources.','Practise independent skills and prepare for human-led sessions.','Build communication confidence through realistic learning activities.','Explore supervised certification assessment requirements, if relevant.'])list.append(E('li',line));steps.append(list);wrap.append(steps);
 const heading=E('h2','More to explore');heading.id='v18512-more-heading';wrap.append(heading);
 const foldRoot=E('div',undefined,'v18512-more');foldRoot.setAttribute('aria-labelledby','v18512-more-heading');
 const ancestors=[];
 for(const fold of FOLDS){
  const sections=fold.ids.map(id=>root.querySelector('#'+id)).filter(Boolean);
  if(!sections.length)continue;
  const details=E('details',undefined,'v18512-disclosure'),summary=E('summary'),title=E('strong',fold.label),hint=E('span',fold.hint),body=E('div',undefined,'v18512-disclosure-body');
  summary.append(title,hint);details.append(summary,body);
  for(const section of sections){body.append(section);ancestors.push([section,details])}
  foldRoot.append(details);
 }
 wrap.append(foldRoot);
 const end=E('p',undefined,'v18512-end-actions');
 for(const [text,href] of [['Start learning','/learn/start/'],['View pricing','/pricing/'],['Create an account','/learn/account/']]){
  const a=E('a',text);a.href=href;end.append(a);
 }
 wrap.append(end);main.append(wrap);room.after(main);
 function reveal(){
  const id=decodeURIComponent(location.hash.slice(1));if(!id)return;
  const target=document.getElementById(id);if(!target)return;
  const wrapper=target.closest('details.v18512-disclosure');
  if(wrapper&&!wrapper.open)wrapper.open=true;
 }
 window.addEventListener('hashchange',reveal);
 document.addEventListener('click',ev=>{
  const a=ev.target?.closest?.('a[href^="#"]');if(!a)return;
  let target;try{target=document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)))}catch{return}
  const details=target?.closest?.('details.v18512-disclosure');if(details)details.open=true;
 },true);
 reveal();
 document.documentElement.dataset.v18512Homepage='summary-first';
}
function setup(){if(!document.querySelector('#v18512-home-preview'))apply()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(setup,200),{once:true});else setTimeout(setup,200);
window.addEventListener('hashchange',()=>setTimeout(setup,240));
})();
