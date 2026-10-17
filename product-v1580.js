/* EnglishLegalese.com v1.58.0 — persistent production homepage recovery.
   Root-cause fix: app.js can replace #app on route changes; this layer remains attached and reapplies idempotent presentation rules after every replacement. */
(() => {
  'use strict';
  const VERSION='1.58.0';
  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  let scenarioExpanded=false;
  let plannerExpanded=false;
  let progressExpanded=false;
  let applying=false;
  let scheduled=false;

  const replacements=[
    ['New in v1.55','Guided practice'],
    ['Practice → review → personalize → prove progress.','Practice → review → personalize → track progress.'],
    ['Prove progress safely.','Track progress clearly.'],
    ['privacy-safe progress proof','privacy-conscious progress tracking'],
    ['Launch course set','Legal English courses'],
    ['The full catalog can grow later. Public launch should start with a small set of clear paths.','Start with a focused path, then explore more courses when you need them.'],
    ['EnglishLegalese should not promise perfect static translation of every page. It provides preferred-language explanations as a learning bridge.','Preferred-language explanations can support understanding while bringing you back to Legal English practice.'],
    ['Safety line:','Important:'],
    ['Legal Skills Passport','Legal Skills Progress'],
    ['Practice completion and learner self-checks are shown separately from any future teacher-confirmed assessment.','Practice completion and learner self-checks remain separate from teacher-confirmed feedback.'],
    ['Employer-safe progress snapshot','Shareable progress snapshot'],
    ['Copy safe snapshot','Prepare shareable snapshot']
  ];

  function replacePublicText(root){
    if(!root) return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){return n.parentElement&&!['SCRIPT','STYLE','TEXTAREA','OPTION'].includes(n.parentElement.tagName)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node=>{let next=node.nodeValue;replacements.forEach(([a,b])=>{next=next.split(a).join(b);});if(next!==node.nodeValue)node.nodeValue=next;});
  }

  function removeInternalPublicUI(){
    qsa('#start article,#start .card').forEach(card=>{if(qs('h3',card)?.textContent.trim()==='EnglishLegalese Team')card.remove();});
    qs('#adaptive-learning')?.remove();
    qsa('.v1560-course-controls,.v1560-scenario-controls,.v1560-planner-controls,.v1560-progress-controls').forEach(el=>el.remove());
    if(qs('.v1580-prompt-starters')) qsa('.v1560-prompt-starters').forEach(el=>el.remove());
  }

  function compactScenarios(){
    const section=qs('#practice-studio'); if(!section) return;
    const cards=qsa('.v1550-scenario-card',section);
    cards.forEach((card,i)=>{card.classList.toggle('v1580-scenario-more',i>=6);const title=qs('h3',card)?.textContent.trim();const btn=qs('.js-v1550-start',card);if(btn&&title)btn.setAttribute('aria-label',`Open practice: ${title}`);});
    const custom=qs('.v1550-custom-roleplay',section); if(custom&&!scenarioExpanded) custom.hidden=true;
    let controls=qs('.v1580-scenario-controls',section);
    if(!controls&&cards.length){controls=document.createElement('div');controls.className='v1580-section-controls v1580-scenario-controls';controls.innerHTML=`<button class="btn teal js-v1580-scenarios" type="button" aria-expanded="false">Explore all ${cards.length} scenarios</button><button class="btn light js-v1580-custom" type="button">Create your own roleplay</button>`;qs('.v1550-scenario-grid',section)?.after(controls);}
    section.classList.toggle('v1580-expanded',scenarioExpanded);
    const btn=qs('.js-v1580-scenarios',section);if(btn&&!btn.dataset.bound){btn.dataset.bound='1';btn.addEventListener('click',()=>{scenarioExpanded=!scenarioExpanded;compactScenarios();});}
    if(btn){btn.setAttribute('aria-expanded',String(scenarioExpanded));btn.textContent=scenarioExpanded?'Show featured scenarios only':`Explore all ${cards.length} scenarios`;}
    const customBtn=qs('.js-v1580-custom',section);if(customBtn&&!customBtn.dataset.bound){customBtn.dataset.bound='1';customBtn.addEventListener('click',()=>{scenarioExpanded=true;compactScenarios();const form=qs('.v1550-custom-roleplay',section);if(form){form.hidden=false;form.scrollIntoView({behavior:'smooth',block:'start'});}});}
  }

  function compactPlanner(){
    const section=qs('#learning-plan'); if(!section) return;
    const builder=qs('.v1550-plan-builder',section); if(!builder) return;
    section.classList.toggle('v1580-expanded',plannerExpanded);
    let controls=qs('.v1580-planner-controls',section);
    if(!controls){controls=document.createElement('div');controls.className='container v1580-section-controls v1580-planner-controls';controls.innerHTML='<button class="btn gold js-v1580-planner" type="button" aria-expanded="false">Build my four-week plan</button>';qs('.section-head',section)?.after(controls);}
    const btn=qs('.js-v1580-planner',section);if(btn&&!btn.dataset.bound){btn.dataset.bound='1';btn.addEventListener('click',()=>{plannerExpanded=!plannerExpanded;compactPlanner();});}
    if(btn){btn.setAttribute('aria-expanded',String(plannerExpanded));btn.textContent=plannerExpanded?'Hide plan builder':'Build my four-week plan';}
  }

  function compactProgress(){
    const section=qs('#skills-passport'); if(!section) return;
    const head=qs('.section-head',section); const eyebrow=qs('.eyebrow',head); const title=qs('h2',head); const text=qs('p',head);
    if(eyebrow) eyebrow.textContent='Legal Skills Progress';
    if(title) title.textContent='See what you practiced—and what to work on next.';
    if(text) text.textContent='Your learning record tracks practice activity and learner self-checks. It is not an accredited credential or proficiency certification.';
    const completed=Number(qs('.v1550-stat-row strong',section)?.textContent||0);
    qsa('.v1550-stat-row,.v1550-passport-grid,.v1550-review-loop',section).forEach(el=>el.classList.add('v1580-progress-detail'));
    section.classList.toggle('v1580-expanded',progressExpanded);
    let controls=qs('.v1580-progress-controls',section);
    if(!controls){controls=document.createElement('div');controls.className='container v1580-progress-controls';controls.innerHTML=completed?'<p class="v1580-micro-note">Your practice record is learner-controlled and is not an accredited credential.</p><button class="btn light js-v1580-progress" type="button" aria-expanded="false">View detailed progress</button>':'<div class="v1580-empty-progress"><h3>Your progress starts with your first practice.</h3><p>Complete a starting diagnostic or scenario to begin a private learning record. No sample achievements are added for you.</p><a class="btn gold" href="#diagnostic">Take the starting diagnostic</a><a class="btn light" href="#practice-studio">Practice a scenario</a></div><button class="btn light js-v1580-progress" type="button" aria-expanded="false">View empty progress details</button>';qs('.section-head',section)?.after(controls);}
    const btn=qs('.js-v1580-progress',section);if(btn&&!btn.dataset.bound){btn.dataset.bound='1';btn.addEventListener('click',()=>{progressExpanded=!progressExpanded;compactProgress();});}
    if(btn){btn.setAttribute('aria-expanded',String(progressExpanded));btn.textContent=progressExpanded?'Hide detailed progress':'View detailed progress';}
    const share=qs('.js-v1550-employer',section);if(share){share.textContent='Prepare shareable progress snapshot';share.setAttribute('aria-label','Prepare a learner-controlled aggregate progress snapshot');const parent=share.parentElement;if(parent&&!qs('.v1580-share-note',parent)){const p=document.createElement('p');p.className='v1580-micro-note v1580-share-note';p.textContent='Nothing is shared automatically. Preparing a snapshot is a learner-controlled action.';parent.appendChild(p);}}
  }

  function normalizeInjectedCopy(){
    const teacher=qs('#teachers article.panel');if(teacher){const h=qs('h2',teacher),p=qs('p',teacher),a=qs('a',teacher);if(h)h.textContent='Teacher-guided learning support.';if(p)p.textContent='Teachers can review learner practice, prepare lessons, guide roleplays, assign homework, and give feedback while private teacher notes remain appropriately separated.';if(a){a.textContent='Teacher account access';a.title='Sign-in is required for operational teacher tools';}}
    const employer=qs('#employers');if(employer){const h=qs('h2',employer),p=qs('p',employer),a=qs('a',employer);if(h)h.textContent='Privacy-conscious team learning.';if(p)p.textContent='Organizations can use consent-based aggregate attendance and learning-progress signals while private learner work stays private by default.';if(a){a.textContent='Employer account access';a.title='Sign-in is required for operational employer tools';}}
    qsa('.trust-item').forEach(el=>{if(/100\+ major-language/i.test(el.textContent))el.textContent='Major-language learning support';});
  }

  function fixActiveNavigation(){
    const links=qsa('#mainNav a[href^="#"]');
    const sections=links.map(a=>[a,qs(a.getAttribute('href'))]).filter(([,s])=>s);
    const update=()=>{let best=null,bestDistance=Infinity;const offset=(qs('.site-header')?.getBoundingClientRect().height||0)+20;sections.forEach(([a,s])=>{const r=s.getBoundingClientRect();const distance=Math.abs(r.top-offset);if(r.bottom>offset&&distance<bestDistance){best=[a,s];bestDistance=distance;}});links.forEach(a=>a.removeAttribute('aria-current'));if(best)best[0].setAttribute('aria-current','location');};
    if(!document.documentElement.dataset.v1580ScrollBound){document.documentElement.dataset.v1580ScrollBound='1';window.addEventListener('scroll',()=>requestAnimationFrame(update),{passive:true});window.addEventListener('resize',()=>requestAnimationFrame(update));}
    update();
  }

  function apply(){
    if(applying) return;
    const app=qs('#app'); if(!app||!qs('#home',app)) return;
    applying=true;
    try{
      document.documentElement.dataset.englishlegaleseVersion=VERSION;
      replacePublicText(app);
      removeInternalPublicUI();
      normalizeInjectedCopy();
      compactScenarios();
      compactPlanner();
      compactProgress();
      fixActiveNavigation();
      document.body.classList.add('v1580-ready');
    }finally{applying=false;}
  }
  function schedule(){if(scheduled)return;scheduled=true;setTimeout(()=>{scheduled=false;apply();},0);}
  function start(){const app=qs('#app');if(app)new MutationObserver(schedule).observe(app,{childList:true,subtree:true});window.addEventListener('hashchange',()=>setTimeout(schedule,20));window.addEventListener('pageshow',schedule);schedule();setTimeout(schedule,150);setTimeout(schedule,750);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();