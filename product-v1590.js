/* EnglishLegalese.com v1.59.0 — hard production recovery layer.
   Critical public correctness is enforced directly in the DOM, independent of predecessor presentation classes. */
(() => {
  'use strict';
  const VERSION='1.64.0';
  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  // Only modify the DOM when values actually change. Unconditional textContent/innerHTML
  // writes under a childList MutationObserver recreate text nodes and can steal tablet taps.
  const setText=(el,value)=>{if(el&&el.textContent!==value)el.textContent=value;};
  const setHTML=(el,markup)=>{if(el&&el.innerHTML!==markup)el.innerHTML=markup;};
  let applying=false, scheduled=false;
  let scenariosExpanded=false, diagnosticExpanded=false, plannerExpanded=false, progressExpanded=false;

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
    ['Copy safe snapshot','Prepare shareable progress snapshot'],
    ['100+ major-language learning bridge','Major-language learning support']
  ];

  function replacePublicText(root){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){return node.parentElement&&!['SCRIPT','STYLE','TEXTAREA','OPTION'].includes(node.parentElement.tagName)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
    const nodes=[]; while(walker.nextNode())nodes.push(walker.currentNode);
    for(const node of nodes){let next=node.nodeValue;for(const [from,to] of replacements)next=next.split(from).join(to);if(next!==node.nodeValue)node.nodeValue=next;}
  }

  function removeInternalUI(){
    qsa('#start article,#start .card').forEach(card=>{
      const title=qs('h3',card)?.textContent.trim();
      if(title==='EnglishLegalese Team')card.remove();
      if(title==='Teacher'){
        const p=qs('p',card);if(p)setText(p,'Explore lesson support, realistic legal scenarios, and opportunities for teacher-guided feedback.');
        const a=qs('a',card);if(a){setText(a,'Explore teacher support');a.href='#teachers';}
      }
      if(title==='Employer'){
        const p=qs('p',card);if(p)setText(p,'Explore practical Legal English training with privacy-conscious learning progress for teams.');
        const a=qs('a',card);if(a){setText(a,'Explore employer training');a.href='#employers';}
      }
    });
    qs('#adaptive-learning')?.remove();
    qsa('.v1560-course-controls,.v1560-scenario-controls,.v1560-planner-controls,.v1560-progress-controls,.v1580-scenario-controls,.v1580-planner-controls,.v1580-progress-controls').forEach(el=>el.remove());
  }

  function correctLanguageAndSmartTeacher(){
    const language=qs('#language-bridge');
    if(language){
      const side=qs('.section-head > p',language);if(side)setText(side,'Preferred-language explanations can support understanding while bringing you back to Legal English practice.');
      const notice=qs('.notice',language);if(notice)setHTML(notice,'<strong>Important:</strong> Preferred-language support is a learning bridge. It is not certified translation, court interpretation, legal advice, or final legal meaning.');
    }
    qsa('.trust-item').forEach(el=>{if(/100\+ major-language/i.test(el.textContent))setText(el,'Major-language learning support');});
    const smart=qs('#smartteacher');
    if(smart){
      const h2=qs('.section-head h2',smart);if(h2)setText(h2,'Practice with AI. Improve with teacher guidance. Track progress clearly.');
      const out=qs('.js-ai-output',smart);if(out&&/practice is ready/i.test(out.textContent))setText(out,'Choose a guided starter or describe a Legal English communication task. Speaking practice here is text-guided unless a live voice feature is explicitly available.');
    }
  }

  function ensureDiagnosticControls(section){
    let controls=qs('.v1590-diagnostic-controls',section);
    if(!controls){
      controls=document.createElement('div');
      controls.className='container v1590-section-controls v1590-diagnostic-controls';
      controls.innerHTML='<button class="btn gold js-v1590-diagnostic" type="button" aria-expanded="false">Start the 8-question diagnostic</button>';
      qs('.section-head',section)?.after(controls);
    }
    const btn=qs('.js-v1590-diagnostic',controls);
    // Stable delegated capture-phase handler owns diagnostic activation, including WebKit repaint cases.
    if(btn){btn.setAttribute('aria-expanded',String(diagnosticExpanded));setText(btn,diagnosticExpanded?'Hide diagnostic questions':'Start the 8-question diagnostic');}
  }

  function enforceDiagnostic(){
    const section=qs('#diagnostic');if(!section)return;
    if(location.hash==='#diagnostic')diagnosticExpanded=true;
    const shell=qs('.v1580-diagnostic-shell',section);
    if(shell)shell.hidden=!diagnosticExpanded;
    ensureDiagnosticControls(section);
  }

  function enforceCourses(){
    const section=qs('#courses');if(!section)return;
    const cards=qsa('article',section).filter(card=>qs('h3',card));if(!cards.length)return;
    let expanded=document.body.classList.contains('v1580-courses-expanded');
    const btn=qs('.js-v1580-courses',section);if(btn)expanded=btn.getAttribute('aria-expanded')==='true';
    cards.forEach((card,i)=>{card.classList.remove('v1560-collapsible','v1580-course-more');card.hidden=i>=3&&!expanded;});
    // app.js owns course click and immediately updates article visibility; this controller honors its aria-expanded state.
  }

  function ensureScenarioControls(section,total){
    let controls=qs('.v1590-scenario-controls',section);
    if(!controls){controls=document.createElement('div');controls.className='v1590-section-controls v1590-scenario-controls';controls.innerHTML=`<button class="btn teal js-v1590-scenarios" type="button" aria-expanded="false">Explore all ${total} scenarios</button><button class="btn light js-v1590-custom" type="button">Create your own roleplay</button>`;qs('.v1550-scenario-grid',section)?.after(controls);}
    const more=qs('.js-v1590-scenarios',controls);
    // The scenario switch is bound once on document (capture) below.
    // Stable delegation handles Safari/WebKit where a DOM observer can replace this button mid-click.
    const customBtn=qs('.js-v1590-custom',controls);
    // Custom roleplay uses the same stable delegated click pathway.
    if(more){more.setAttribute('aria-expanded',String(scenariosExpanded));setText(more,scenariosExpanded?'Show featured scenarios only':`Explore all ${total} scenarios`);}
  }

  function enforceScenarios(){
    const section=qs('#practice-studio');if(!section)return;
    const cards=qsa('.v1550-scenario-card',section);
    cards.forEach((card,i)=>{card.classList.remove('v1560-collapsible','v1580-scenario-more');card.hidden=i>=6&&!scenariosExpanded;const title=qs('h3',card)?.textContent.trim();const btn=qs('.js-v1550-start',card);if(btn&&title)btn.setAttribute('aria-label',`Open practice: ${title}`);});
    const filters=qs('.v1550-filters',section);if(filters)filters.hidden=!scenariosExpanded;
    const custom=qs('.v1550-custom-roleplay',section);if(custom&&!scenariosExpanded)custom.hidden=true;
    ensureScenarioControls(section,cards.length);
  }

  function ensurePlannerControls(section){
    let controls=qs('.v1590-planner-controls',section);
    if(!controls){controls=document.createElement('div');controls.className='container v1590-section-controls v1590-planner-controls';controls.innerHTML='<button class="btn gold js-v1590-planner" type="button" aria-expanded="false">Build my four-week plan</button>';qs('.section-head',section)?.after(controls);}
    const btn=qs('.js-v1590-planner',controls);// Stable delegated capture-phase handler owns planner activation, including WebKit repaint cases.
    if(btn){btn.setAttribute('aria-expanded',String(plannerExpanded));setText(btn,plannerExpanded?'Hide plan builder':'Build my four-week plan');}
  }

  function enforcePlanner(){
    const section=qs('#learning-plan');if(!section)return;
    const builder=qs('.v1550-plan-builder',section);if(builder){builder.classList.remove('v1560-progress-detail');builder.hidden=!plannerExpanded;}
    ensurePlannerControls(section);
  }

  function ensureProgressControls(section,completed){
    let controls=qs('.v1590-progress-controls',section);
    if(!controls){controls=document.createElement('div');controls.className='container v1590-progress-controls';controls.innerHTML=completed?'<p class="v1590-note">Your practice record is learner-controlled and is not an accredited credential.</p><button class="btn light js-v1590-progress" type="button" aria-expanded="false">View detailed progress</button>':'<div class="v1590-empty-progress"><h3>Your progress starts with your first practice.</h3><p>Complete the starting diagnostic or a scenario to begin a private learning record. No sample achievements are added for you.</p><a class="btn gold" href="#diagnostic">Take the starting diagnostic</a> <a class="btn light" href="#practice-studio">Practice a scenario</a></div><button class="btn light js-v1590-progress" type="button" aria-expanded="false">View empty progress details</button>';qs('.section-head',section)?.after(controls);}
    const btn=qs('.js-v1590-progress',controls);// Stable delegated capture-phase handler owns progress activation, including WebKit repaint cases.
    if(btn){btn.setAttribute('aria-expanded',String(progressExpanded));setText(btn,progressExpanded?'Hide detailed progress':'View detailed progress');}
  }

  function enforceProgress(){
    const section=qs('#skills-passport');if(!section)return;
    const eyebrow=qs('.section-head .eyebrow',section);if(eyebrow)setText(eyebrow,'Legal Skills Progress');
    const h2=qs('.section-head h2',section);if(h2)setText(h2,'See what you practiced—and what to work on next.');
    const p=qs('.section-head > p',section);if(p)setText(p,'Your learning record tracks practice activity and learner self-checks. It is not an accredited credential or proficiency certification.');
    const completed=Number(qs('.v1550-stat-row strong',section)?.textContent||0);
    qsa('.v1550-stat-row,.v1550-passport-grid,.v1550-review-loop',section).forEach(el=>{el.classList.remove('v1560-progress-detail','v1580-progress-detail');el.hidden=!progressExpanded;});
    ensureProgressControls(section,completed);
    const share=qs('.js-v1550-employer',section);if(share){setText(share,'Prepare shareable progress snapshot');share.setAttribute('aria-label','Prepare a learner-controlled aggregate progress snapshot');}
  }

  function correctTeacherEmployer(){
    const teacher=qs('#teachers article.panel');if(teacher){const h=qs('h2',teacher);if(h)setText(h,'Teacher-guided learning support.');const p=qs('p',teacher);if(p)setText(p,'Teachers can review learner practice, prepare lessons, guide roleplays, assign homework, and give feedback while private teacher notes remain appropriately separated.');const a=qs('a',teacher);if(a){setText(a,'Teacher account access');a.title='Sign-in is required for operational teacher tools';}}
    const employer=qs('#employers');if(employer){const h=qs('h2',employer);if(h)setText(h,'Privacy-conscious team learning.');const p=qs('p',employer);if(p)setText(p,'Organizations can use consent-based aggregate attendance and learning-progress signals while private learner work stays private by default.');const a=qs('a',employer);if(a){setText(a,'Employer account access');a.title='Sign-in is required for operational employer tools';}}
  }

  function markRelease(){
    document.documentElement.dataset.englishlegaleseLiveRelease=VERSION;
    document.body.classList.add('v1590-ready');
    let marker=qs('#v1590-live-marker');if(!marker){marker=document.createElement('span');marker.id='v1590-live-marker';marker.hidden=true;marker.textContent=VERSION;document.body.appendChild(marker);}
  }

  function apply(){
    if(applying)return;const app=qs('#app');if(!app||!qs('#home',app))return;applying=true;
    try{replacePublicText(app);removeInternalUI();correctLanguageAndSmartTeacher();correctTeacherEmployer();enforceDiagnostic();enforceCourses();enforceScenarios();enforcePlanner();enforceProgress();markRelease();}finally{applying=false;}
  }
  function schedule(){if(scheduled)return;scheduled=true;setTimeout(()=>{scheduled=false;apply();},0);}
  function start(){
    // Capture the activation before any legacy repaint/observer can detach the clicked node.
    // Attach once per page, never per regenerated button.
    document.addEventListener('click',event=>{
      const target=event.target instanceof Element ? event.target : event.target?.parentElement;
      const more=target?.closest('.js-v1590-scenarios');
      if(more){
        event.preventDefault();
        scenariosExpanded=more.getAttribute('aria-expanded')!=='true';
        enforceScenarios();
        return;
      }
      const own=target?.closest('.js-v1590-custom');
      if(own){
        event.preventDefault();
        scenariosExpanded=true;enforceScenarios();
        const section=qs('#practice-studio'),custom=section&&qs('.v1550-custom-roleplay',section);
        if(custom){custom.hidden=false;custom.scrollIntoView({behavior:'instant',block:'start'});}
        return;
      }
      const diagnostic=target?.closest('.js-v1590-diagnostic');
      if(diagnostic){
        event.preventDefault();
        diagnosticExpanded=diagnostic.getAttribute('aria-expanded')!=='true';
        enforceDiagnostic();
        if(diagnosticExpanded)qs('#diagnostic .v1580-diagnostic-form')?.scrollIntoView({behavior:'instant',block:'start'});
        return;
      }
      const planner=target?.closest('.js-v1590-planner');
      if(planner){
        event.preventDefault();
        plannerExpanded=planner.getAttribute('aria-expanded')!=='true';
        enforcePlanner();
        return;
      }
      const progress=target?.closest('.js-v1590-progress');
      if(progress){
        event.preventDefault();
        progressExpanded=progress.getAttribute('aria-expanded')!=='true';
        enforceProgress();
      }
    },true);
    const app=qs('#app');if(app)new MutationObserver(schedule).observe(app,{childList:true,subtree:true});window.addEventListener('hashchange',()=>{if(location.hash==='#diagnostic')diagnosticExpanded=true;setTimeout(schedule,10);});window.addEventListener('pageshow',schedule);schedule();setTimeout(schedule,100);setTimeout(schedule,500);setTimeout(schedule,1500);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();