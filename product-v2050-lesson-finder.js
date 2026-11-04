'use strict';
/* HF43: searchable no-account course map for 24 existing professional lessons.
   No filtering/hiding original lesson cards, analytics, network or persistent status claims. */
(()=>{
 const records=[
  [
    "Client intake: verified facts",
    "Legal English",
    "/learn/continuing-practice/#practice-lesson-1"
  ],
  [
    "Contract notices and deadlines",
    "Legal English",
    "/learn/continuing-practice/#practice-lesson-2"
  ],
  [
    "Redlining: modal verbs and cost scope",
    "Legal English",
    "/learn/continuing-practice/#practice-lesson-3"
  ],
  [
    "Witness interviews: open questions",
    "Legal English",
    "/learn/continuing-practice/#practice-lesson-4"
  ],
  [
    "Negotiation: conditions and tentative terms",
    "Legal English",
    "/learn/continuing-practice/#practice-lesson-5"
  ],
  [
    "Cross-border drafting: clarify meaning",
    "Legal English",
    "/learn/continuing-practice/#practice-lesson-6"
  ],
  [
    "Quarterly reporting: balanced trends",
    "Business and Investor English",
    "/learn/continuing-practice/#practice-lesson-7"
  ],
  [
    "Project handovers: clear ownership",
    "Business and Investor English",
    "/learn/continuing-practice/#practice-lesson-8"
  ],
  [
    "Supplier negotiation: constructive trade-offs",
    "Business and Investor English",
    "/learn/continuing-practice/#practice-lesson-9"
  ],
  [
    "Investor relations: guidance and assumptions",
    "Business and Investor English",
    "/learn/continuing-practice/#practice-lesson-10"
  ],
  [
    "Performance reviews: observable feedback",
    "Business and Investor English",
    "/learn/continuing-practice/#practice-lesson-11"
  ],
  [
    "Board presentations: uncertainty and mitigation",
    "Business and Investor English",
    "/learn/continuing-practice/#practice-lesson-12"
  ],
  [
    "Research summary: sources versus conclusions",
    "Legal English",
    "/learn/continuing-practice/advanced/#legal-module-1"
  ],
  [
    "Disclosure request: precise scope and privacy",
    "Legal English",
    "/learn/continuing-practice/advanced/#legal-module-2"
  ],
  [
    "Mediation statement: interests without admissions",
    "Legal English",
    "/learn/continuing-practice/advanced/#legal-module-3"
  ],
  [
    "Matter management: deadline and dependency updates",
    "Legal English",
    "/learn/continuing-practice/advanced/#legal-module-4"
  ],
  [
    "Regulatory update: distinguish proposal from rule",
    "Legal English",
    "/learn/continuing-practice/advanced/#legal-module-5"
  ],
  [
    "Client update: options, risks and decision owner",
    "Legal English",
    "/learn/continuing-practice/advanced/#legal-module-6"
  ],
  [
    "Investor briefing: cash flow and uncertainty",
    "Business and Investor English",
    "/learn/continuing-practice/advanced/#business-module-7"
  ],
  [
    "Incident communications: facts before blame",
    "Business and Investor English",
    "/learn/continuing-practice/advanced/#business-module-8"
  ],
  [
    "Service negotiations: measurable promises",
    "Business and Investor English",
    "/learn/continuing-practice/advanced/#business-module-9"
  ],
  [
    "Feedback after a project: evidence and improvement",
    "Business and Investor English",
    "/learn/continuing-practice/advanced/#business-module-10"
  ],
  [
    "Executive decision memo: compare trade-offs",
    "Business and Investor English",
    "/learn/continuing-practice/advanced/#business-module-11"
  ],
  [
    "Cross-cultural meetings: confirm decisions clearly",
    "Business and Investor English",
    "/learn/continuing-practice/advanced/#business-module-12"
  ]
];
 const make=(tag,content,cls)=>{
  const node=document.createElement(tag);
  if(cls)node.className=cls;
  if(content!==undefined)node.textContent=content;
  return node;
 };
 const wrap=document.querySelector('.v1971-wrap, .v1981-wrap');
 if(!wrap)return;
 const local=[...document.querySelectorAll('article.v1971-lesson')];
 if(location.pathname==='/learn/continuing-practice/'){
  local.forEach((card,i)=>{if(!card.id)card.id='practice-lesson-'+(i+1);});
 }
 const panel=make('details',undefined,'v2050-finder');
 panel.append(make('summary','Find a practice lesson · search all 24 topics'));
 const intro=make('p','Find a fictional Legal English or Business/Investor English scenario across both lesson collections. This directory does not store searches, track completion, or alter your practice drafts.');
 panel.append(intro);
 const controls=make('div',undefined,'v2050-controls');
 const searchGroup=make('label','Search by skill or topic');
 const search=make('input');
 search.type='search';search.id='v2050-search';search.maxLength=80;
 search.placeholder='Try contract, reporting, client or negotiation';
 searchGroup.append(search);
 const trackGroup=make('label','Subject');
 const select=make('select');
 select.id='v2050-subject';
 for(const [value,label] of [['all','All subjects'],['Legal English','Legal English'],['Business and Investor English','Business and Investor English']]){
  const option=make('option',label);option.value=value;select.append(option);
 }
 trackGroup.append(select);
 const clear=make('button','Clear search and subject');clear.type='button';clear.className='v2050-clear';
 controls.append(searchGroup,trackGroup,clear);
 panel.append(controls);
 const count=make('p','', 'v2050-results-count');count.setAttribute('role','status');
 const list=make('ul',undefined,'v2050-results');
 panel.append(count,list);
 wrap.before(panel);
 const normalize=s=>String(s).toLowerCase().normalize('NFKC').trim();
 function render(){
  const term=normalize(search.value);
  const track=select.value;
  const matching=records.filter(row=>(track==='all'||row[1]===track)&&(!term||normalize(row[0]+' '+row[1]).includes(term)));
  count.textContent=matching.length+' of 24 lessons found. '+(matching.length===0?'Try another topic or clear the filters.':'Select a lesson to open it.');
  list.replaceChildren();
  for(const row of matching){
   const li=make('li');
   const link=make('a',row[0]);link.href=row[2];
   li.append(link,make('span',row[1],'v2050-track'));
   list.append(li);
  }
 }
 search.addEventListener('input',render);
 select.addEventListener('change',render);
 clear.addEventListener('click',()=>{search.value='';select.value='all';render();search.focus();});
 render();
 if(location.hash&&location.pathname==='/learn/continuing-practice/'){
  const id=location.hash.slice(1);
  if(/^practice-lesson-(?:[1-9]|1[0-2])$/.test(id)){
   const target=document.getElementById(id);
   if(target)window.addEventListener('DOMContentLoaded',()=>target.scrollIntoView(),{once:true});
  }
 }
})();
