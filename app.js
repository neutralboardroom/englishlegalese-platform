/* EnglishLegalese.com v1.61.1 — canonical public homepage + durable in-page routing.
   Critical public correctness lives here; enhancement layers may enrich but must not be required to remove internal copy. */
(() => {
  'use strict';
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const app = $('#app');
  const preferredLanguageKey = 'elPreferredExplanationLanguage';
  const languages = ['English','Spanish','Chinese','Arabic','French','Portuguese','Russian','Turkish','Hindi','Urdu','Korean','Japanese','Vietnamese','Indonesian','German','Italian','Polish','Ukrainian','Persian / Farsi','Bengali','Thai','Dutch','Greek','Hebrew','Swedish','Norwegian','Danish','Finnish','Romanian','Czech','Hungarian','Malay','Tagalog','Swahili'];
  const courses = [
    ['Free Legal English starting diagnostic','Placement','A short, practice-based starting point that recommends what to work on next. It is not an accredited proficiency test or certification.'],
    ['SmartTeacher AI Practice','All levels','Guided Legal English practice for writing, reading, vocabulary, roleplay, professional communication, and careful AI-output review.'],
    ['Legal English Foundations','Foundation','Core vocabulary, simple legal concepts, professional tone, and plain-English explanations.'],
    ['Legal Writing and Professional Email','Professional','Client updates, internal memos, follow-ups, concise status writing, and tone.'],
    ['Speaking, Meetings, and Client Calls','Professional / Advanced','Confidence, clarification, professional wording, negotiation language, and meeting summaries.'],
    ['Contract and Document Reading','Professional / Advanced','Clauses, definitions, obligations, deadlines, risk language, and clear summaries.'],
    ['AI Translation & Output Review Lab','All levels','Confidentiality awareness, over-literal translation risk, false confidence, tone, and human-review triggers.'],
    ['LL.M. / Law School Readiness','Professional / Advanced','Case reading, discussion, professor emails, presentations, exams, and study-group language.'],
    ['Employer Team Training','Teams','Privacy-conscious team learning, attendance, completion, and appropriate aggregate progress signals.']
  ];
  const QUESTIONS = [
    ['Professional tone','Which client-update sentence is clearest and most professional?',['We need your answer ASAP or this could become a problem.','Please send the requested information by Thursday so we can prepare the next step.','You failed to send what we asked for.'],1],
    ['Clarity','A colleague says, “Please handle this soon.” What is the strongest communication response?',['Say nothing and decide what “soon” means yourself.','Ask: “Could you confirm the deadline and the specific deliverable you need?”','Reply: “Okay.”'],1],
    ['Legal reading','In professional documents, which word usually signals an obligation more strongly?',['may','shall','might'],1],
    ['Plain English','Which version is the clearest plain-English rewrite?',['Pursuant to the aforementioned correspondence, we hereby request your response.','Please respond to the earlier email.','We would be desirous of receiving your responsive communication.'],1],
    ['Meetings','Which phrase politely interrupts to clarify an important point?',['Stop. That makes no sense.','Sorry to interrupt — could I clarify one point before we move on?','Whatever. Continue.'],1],
    ['Legal-business writing','Which email subject line is most useful for a time-sensitive professional update?',['Important!!!','Update','Contract review — comments requested by 18 October'],2],
    ['AI-output review','An AI draft sounds fluent but states a legal conclusion you have not verified. What should you do?',['Treat fluent wording as proof that the conclusion is correct.','Verify the legal meaning with an appropriate qualified source/person before relying on it.','Send it immediately because AI generated it.'],1],
    ['Confidentiality awareness','What is the safest practice when using an AI language exercise?',['Use synthetic or de-identified facts unless confidential information is specifically authorized and protected.','Paste full client names and confidential facts so the exercise feels realistic.','Assume every AI tool is automatically approved for confidential material.'],0]
  ];
  const legacyAnchorMap = {
    'v154-public-launch-readiness':'trust','v153-role-clarity-continuity':'start','v150-language-learning-bridge':'language-bridge',
    'v146-live-skills-feedback':'skills','v143-course-placement':'courses','v131-teacher-classroom-tools':'teachers',
    'v129-employer-roi-math':'employers','v141-major-language-bridge':'language-bridge','trust-center':'trust',
    'v149-intuitive-ux-continuity':'start','v148-usability-continuity':'start','v147-simplicity-command':'start',
    'v145-integrated-skills-studio':'skills','v144-four-skills-academy':'skills','v142-continuity-command':'trust',
    'v140-workflow-proof-layer':'trust','v139-seamless-learning-operations':'start','v139-universal-language-bridge':'language-bridge',
    'v139-teacher-live-cockpit':'teachers','v139-data-preservation':'trust','v138-ai-era-action-layer':'start',
    'v138-student-proof-loop':'student-dashboard','v137-guided-help-navigator':'start','v137-one-tap-help':'start',
    'v136-native-language-support':'language-bridge','v136-smartteacher-language-modes':'smartteacher','v134-calendar-interop':'trust',
    'v133-global-access':'language-bridge','v133-provider-routing':'language-bridge','v132-chatgpt-only-policy':'smartteacher',
    'v130-smartteacher-brand':'smartteacher','v129-benchmark-integration':'courses','v129-buyer-faq':'trust',
    'v129-course-catalog':'courses','v134-calendar-provider-board':'trust','student-intake':'student-dashboard',
    'firm-intake':'employer-dashboard','teacher-apply':'teacher-dashboard','ai-translation-safety':'smartteacher',
    'scheduling':'teachers','resources':'trust','global-access-classrooms':'language-bridge','calendar-reminders':'teachers',
    'skills-studio':'skills','speaking-listening-reading-writing':'skills','reading-lab':'courses','writing-workshop':'courses',
    '100-language-learning-bridge':'language-bridge', 'adaptive-learning':'practice-studio'
  };
  const protectedHashes = new Set(['student-dashboard','teacher-dashboard','employer-dashboard','admin-dashboard','dashboards']);

  function escapeHtml(value=''){
    return String(value).replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  }
  function toast(message){
    const t = $('#toast'); if(!t) return;
    t.textContent = message; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
  }
  function preferredLanguage(){ return localStorage.getItem(preferredLanguageKey) || 'English'; }
  function setPreferredLanguage(lang){ localStorage.setItem(preferredLanguageKey, lang || 'English'); }
  function languageSelect(){
    const value = preferredLanguage();
    return `<label class="language-select-label">Preferred explanation language<select class="input js-language-select">${languages.map(l => `<option ${l===value?'selected':''}>${escapeHtml(l)}</option>`).join('')}</select></label>`;
  }
  function card(title, body, cta='', href='#start'){
    return `<article class="card flat"><h3>${escapeHtml(title)}</h3><p>${body}</p>${cta ? `<a class="btn light block" href="${href}">${escapeHtml(cta)}</a>` : ''}</article>`;
  }
  function pageShell(content){ app.innerHTML = content; bindActions(); app.focus({preventScroll:true}); }

  function hero(){
    return `<section class="hero" id="home"><div class="container hero-grid">
    <div class="hero-copy"><div class="eyebrow">Legal English made practical</div><h1>Clear English for legal work.</h1><p class="lead">Build confidence in legal writing, reading and professional conversations through realistic scenarios, SmartTeacher AI practice and teacher-guided learning.</p>
    <div class="hero-actions"><a class="btn teal" href="#diagnostic">Start your free diagnostic</a><a class="btn light" href="#courses">Explore courses</a></div>
    <div class="hero-secondary"><a href="#smartteacher">Try SmartTeacher AI <span aria-hidden="true">→</span></a><a href="#practice-studio">Practice a legal scenario <span aria-hidden="true">→</span></a></div>
    <div class="trust-row"><span class="trust-item">Practical language skills</span><span class="trust-item">Teacher guidance where available</span><span class="trust-item">Education, not legal advice</span></div></div>
    <aside class="hero-card" aria-label="Legal English example and language support">
      <div class="hero-example-kicker">See the difference</div><h2 class="hero-example-title">Professional English, made clearer.</h2>
      <div class="hero-example"><div class="hero-example-label">Instead of</div><p>Pursuant to the aforementioned correspondence, we hereby request your response.</p></div>
      <div class="hero-example improved"><div class="hero-example-label">Try</div><p>Please respond to the earlier email.</p></div>
      <div class="hero-language">LANGUAGE_WIDGET<p>Choose an explanation language for learning support. Legal English remains the goal.</p></div>
    </aside></div></section>`.replace('LANGUAGE_WIDGET',languageSelect());
  }
  function startSection(){
    return `<section class="section compact" id="start"><div class="container section-head"><div><div class="eyebrow">Start here</div><h2>One clear path for every learner.</h2></div><p>Choose the next step that fits your goal. Operational staff tools stay behind account access.</p></div><div class="container grid cols-3">${card('Student','Take the starting diagnostic, choose your preferred explanation language, practice with SmartTeacher AI, explore scenarios, and build a learning path.','Take the starting diagnostic','#diagnostic')}${card('Teacher','Explore teacher-guided learning support, lesson review, roleplay, homework, and feedback. Operational teacher tools require the appropriate signed-in role.','Explore teacher support','#teachers')}${card('Employer','Explore privacy-conscious team training and appropriate aggregate learning-progress signals while private learner work stays private by default.','Explore employer training','#employers')}</div></section>`;
  }
  function diagnosticSection(){
    const q = QUESTIONS.map((item,i)=>`<fieldset class="v1580-question" data-question="${i}"><legend><span>${i+1}</span>${escapeHtml(item[1])}</legend><div class="v1580-options">${item[2].map((opt,j)=>`<label><input type="radio" name="v1580-q${i}" value="${j}"><span>${escapeHtml(opt)}</span></label>`).join('')}</div></fieldset>`).join('');
    return `<section class="section v1580-diagnostic" id="diagnostic"><div class="container section-head"><div><div class="eyebrow">Free starting diagnostic</div><h2>Find your best Legal English practice starting point.</h2></div><p>Eight short communication questions give you an immediate practice recommendation. No account is required and your answers are not saved.</p></div><div class="container v1580-diagnostic-shell"><p class="notice"><strong>Practice guidance only:</strong> This is an original EnglishLegalese learning diagnostic, not an accredited proficiency test, CEFR score, TOLES result, legal qualification, or certification.</p><form class="v1580-diagnostic-form" novalidate>${q}<div class="v1580-actions"><button class="btn gold" type="submit">Get my practice recommendation</button><button class="btn light js-v1580-reset" type="button">Clear answers</button></div><p class="v1580-form-status" role="status" aria-live="polite"></p></form><div class="v1580-result" hidden tabindex="-1" aria-live="polite"></div></div></section>`;
  }
  function languageBridge(){
    return `<section class="section accent" id="language-bridge"><div class="container section-head"><div><div class="eyebrow">Language support</div><h2>Get help in your language. Build confidence in Legal English.</h2></div><p>Preferred-language explanations can support understanding while bringing you back to Legal English practice.</p></div><div class="container grid cols-3"><article class="panel"><h3>Understand the platform</h3><p>Get help with instructions, onboarding, course selection, SmartTeacher AI practice, and support.</p></article><article class="panel"><h3>Practice with confidence</h3><p>Use explanations when needed, then return to Legal English practice and teacher guidance where available.</p></article><article class="panel"><h3>Professional communication</h3><p>Build English skills for legal and business situations around the world.</p></article></div><div class="container panel"><div class="panel-head"><div><h3>Preferred explanation language</h3><p class="muted">Choose a preferred language for learning explanations. Legal English remains the practice target.</p></div>${languageSelect()}</div><div class="v151-mode-strip"><span>Show Legal English</span><span>Show Simple English</span><span>Explain in my language</span><span>Practice in Legal English</span><span>Ask a teacher to review</span></div><p class="notice"><strong>Important:</strong> Preferred-language support is a learning bridge. It is not certified translation, court interpretation, legal advice, or final legal meaning.</p></div></section>`;
  }
  function skillsStudio(){
    return `<section class="section" id="skills"><div class="container section-head"><div><div class="eyebrow">Four-skills academy</div><h2>Speaking, listening, reading, and writing belong in one learning loop.</h2></div><p>Practice core communication skills with AI or teacher guidance and build a privacy-conscious learning record.</p></div><div class="container grid cols-4">${card('Speaking','Client calls, meetings, confidence, clarification, and professional disagreement.','Practice a conversation','#smartteacher')}${card('Listening','Note-taking, deadlines, action items, instructions, and meeting summaries.','Explore scenarios','#practice-studio')}${card('Reading','Contracts, clauses, cases, policies, vocabulary, and risk language.','Explore courses','#courses')}${card('Writing','Professional emails, memos, status updates, summaries, and AI-draft review.','Practice writing','#smartteacher')}</div></section>`;
  }
  function coursesSection(){
    return `<section class="section alt" id="courses"><div class="container section-head"><div><div class="eyebrow">Legal English courses</div><h2>Practical courses for real professional communication.</h2></div><p>Start with a focused path, then explore the full course set when you need it.</p></div><div class="container grid cols-3 v1580-course-grid">${courses.map((c,i)=>`<article class="panel v1580-course-card ${i>=3?'v1580-course-more':''}"><div class="kicker">${escapeHtml(c[1])}</div><h3>${escapeHtml(c[0])}</h3><p>${escapeHtml(c[2])}</p></article>`).join('')}</div><div class="container v1580-section-controls"><button class="btn light js-v1580-courses" type="button" aria-expanded="false">View all ${courses.length} courses</button></div></section>`;
  }
  function smartTeacher(){
    const starters = ['Client update','Contract clause','Meeting clarification','AI draft review'];
    return `<section class="section" id="smartteacher"><div class="container section-head"><div><div class="eyebrow">SmartTeacher AI</div><h2>Practice with AI. Improve with teacher guidance. Track progress clearly.</h2></div><p>SmartTeacher AI is ChatGPT/OpenAI-powered language practice and learning support. It is not legal advice, certified translation, court interpretation, or an accredited assessment.</p></div><div class="container panel"><div class="v1580-prompt-starters"><span>Try a guided starter:</span>${starters.map((s,i)=>`<button class="v1580-starter" type="button" data-starter="${i}">${s}</button>`).join('')}</div><textarea class="input big-input js-ai-input" placeholder="What would you like to practice today? Use synthetic or de-identified facts."></textarea><div class="tag-row"><button class="btn gold js-ai-demo">Practice a conversation</button><button class="btn light js-save-lesson">Improve writing</button><button class="btn light js-teacher-review">Ask for teacher review</button></div><div class="ai-demo-output clean-note js-ai-output">Choose a guided starter or describe a Legal English communication task. Speaking practice here is text-guided unless a live voice feature is explicitly available.</div><p class="v1580-micro-note">Teacher review requires an appropriate teacher/account workflow when enabled. AI feedback, learner self-checks, and teacher-confirmed feedback remain distinct.</p></div></section>`;
  }
  function teachersEmployers(){
    return `<section class="section alt" id="teachers"><div class="container grid cols-2"><article class="panel"><div class="eyebrow">Teachers</div><h2>Teacher-guided learning support.</h2><p>Teachers can review learner practice, prepare lessons, guide roleplays, assign homework, and give feedback while private teacher notes remain appropriately separated.</p><a class="btn teal" href="#teacher-dashboard">Teacher account access</a><p class="v1580-micro-note">Operational teacher tools require the appropriate signed-in role.</p></article><article class="panel" id="employers"><div class="eyebrow">Employers</div><h2>Privacy-conscious team learning.</h2><p>Organizations can use consent-based, aggregate attendance and learning-progress signals. Private drafts, raw AI practice, uploads, recordings, native-language explanations, test answers, and teacher-private notes remain excluded by default.</p><a class="btn teal" href="#employer-dashboard">Employer account access</a><p class="v1580-micro-note">Nothing from a learner's private work is shared automatically.</p></article></div></section>`;
  }
  function learningExperience(){
    return `<section class="section" id="learning-experience"><div class="container section-head"><div><div class="eyebrow">Learning experience</div><h2>Professional learning designed for clarity and continuity.</h2></div><p>Practice, teacher feedback, course progress, and language support stay connected so learners can focus on improving Legal English.</p></div><div class="container grid cols-2"><article class="panel"><h3>What learners can expect</h3><ul class="feature-list compact"><li>Clear role-based learning paths.</li><li>SmartTeacher AI practice with education-only boundaries.</li><li>Preferred-language explanations that lead back to Legal English.</li><li>Teacher review where professional judgment or nuance matters.</li></ul></article><article class="panel"><h3>Privacy-conscious by design</h3><p>Employer-facing reporting focuses on appropriate progress signals rather than private learner content.</p><p class="notice"><strong>Important:</strong> EnglishLegalese provides education and professional communication practice. It is not a law firm, certified translation service, or court interpretation service.</p></article></div></section>`;
  }
  function trust(){
    return `<section class="section alt" id="trust"><div class="container section-head"><div><div class="eyebrow">Trust center</div><h2>Clear boundaries. Professional learning. Responsible AI use.</h2></div><p>EnglishLegalese.com provides education, Legal English training, and professional communication practice only.</p></div><div class="container grid cols-3">${card('Not a law firm','The platform does not provide legal advice or decide legal rights, obligations, deadlines, filings, or strategy.')}${card('Not certified translation','Native-language explanations help learning. They are not certified translation, court interpretation, or final legal meaning.')}${card('Private by default','Private learner drafts, uploads, raw AI practice, and teacher-private notes are not shared by default.')}</div></section>`;
  }
  function dashboardPanel(role){
    const title = {student:'Student dashboard',teacher:'Teacher dashboard',employer:'Employer dashboard',admin:'Owner / staff dashboard'}[role] || 'Dashboard';
    return `<section class="section" id="${role}-dashboard"><div class="container"><article class="panel"><div class="eyebrow">${escapeHtml(title)}</div><h2>Account access required.</h2><p>Operational dashboards require production authentication and the appropriate role. Public learning tools remain available from the homepage.</p><a class="btn gold" href="#start">Return to learning options</a></article></div></section>`;
  }
  function home(){ pageShell(`${hero()}${startSection()}${diagnosticSection()}${languageBridge()}${skillsStudio()}${coursesSection()}${smartTeacher()}${teachersEmployers()}${learningExperience()}${trust()}`); }

  function bindDiagnostic(){
    const form = $('.v1580-diagnostic-form'); if(!form || form.dataset.bound==='1') return;
    form.dataset.bound='1';
    const result=$('.v1580-result'), status=$('.v1580-form-status');
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const answers=QUESTIONS.map((q,i)=>{const x=$(`input[name="v1580-q${i}"]:checked`,form);return x?Number(x.value):null;});
      const missing=answers.filter(v=>v===null).length;
      if(missing){ status.textContent=`Please answer all ${QUESTIONS.length} questions. ${missing} ${missing===1?'question remains':'questions remain'}.`; return; }
      let score=0; const missed=[]; QUESTIONS.forEach((q,i)=>{ if(answers[i]===q[3]) score+=1; else missed.push(q[0]); });
      const path=score<=3?'Foundation':score<=6?'Professional':'Advanced';
      const focus=missed.length?missed.slice(0,3):['Nuance and concise drafting','Complex scenario practice','AI-output verification'];
      status.textContent=''; result.hidden=false;
      result.innerHTML=`<div class="eyebrow">Your practice recommendation</div><h3>${path} practice path</h3><p><strong>${score} of ${QUESTIONS.length}</strong> communication-practice items matched the strongest option.</p><p>This is only a learning-start signal. It is not a validated proficiency score and has no CEFR, TOLES, academic, licensing, certification, or employment equivalence.</p><strong>Focus first</strong><ul>${focus.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul><div class="v1580-actions"><a class="btn teal" href="#practice-studio">Practice a scenario</a><a class="btn light" href="#smartteacher">Practice with SmartTeacher AI</a></div>`;
      result.focus({preventScroll:true}); result.scrollIntoView({behavior:'smooth',block:'center'});
    });
    $('.js-v1580-reset',form)?.addEventListener('click',()=>{ form.reset(); status.textContent=''; result.hidden=true; result.innerHTML=''; });
  }
  function bindActions(){
    $$('.js-language-select').forEach(sel=>{ if(sel.dataset.bound) return; sel.dataset.bound='1'; sel.addEventListener('change',()=>{setPreferredLanguage(sel.value);toast(`Preferred explanation language saved: ${sel.value}`);}); });
    const prompts=[
      'Help me practice giving a concise client update with clear next steps. Use a synthetic situation and focus on tone and clarity.',
      'Give me a synthetic contract clause to explain in plain English without giving legal advice.',
      'Roleplay a professional meeting where I need to interrupt politely, clarify a term, and confirm an action item.',
      'Give me a synthetic AI-generated legal-business email with a few communication problems to identify and improve.'
    ];
    $$('.v1580-starter').forEach(btn=>{ if(btn.dataset.bound) return; btn.dataset.bound='1'; btn.addEventListener('click',()=>{const input=$('.js-ai-input'); if(input){input.value=prompts[Number(btn.dataset.starter)]||''; input.focus();}}); });
    $$('.js-ai-demo').forEach(btn=>{ if(btn.dataset.bound) return; btn.dataset.bound='1'; btn.addEventListener('click',()=>{const input=$('.js-ai-input'),out=$('.js-ai-output'); const topic=input?.value.trim()||'Legal English practice'; if(out) out.textContent=`Practice prompt ready for: ${topic} Keep facts synthetic or de-identified, focus on communication quality, and verify high-stakes legal meaning with an appropriate qualified source or person.`;}); });
    $$('.js-save-lesson').forEach(btn=>{ if(btn.dataset.bound) return; btn.dataset.bound='1'; btn.addEventListener('click',()=>toast('Learning note saved locally in demo mode.')); });
    $$('.js-teacher-review').forEach(btn=>{ if(btn.dataset.bound) return; btn.dataset.bound='1'; btn.addEventListener('click',()=>toast('Teacher review requires the appropriate account and teacher workflow when enabled.')); });
    const courseBtn=$('.js-v1580-courses'); if(courseBtn&&!courseBtn.dataset.bound){courseBtn.dataset.bound='1';courseBtn.addEventListener('click',()=>{const expanded=courseBtn.getAttribute('aria-expanded')==='true';courseBtn.setAttribute('aria-expanded',String(!expanded));document.body.classList.toggle('v1580-courses-expanded',!expanded);courseBtn.textContent=expanded?`View all ${courses.length} courses`:'Show featured courses only';});}
    const navToggle=$('#navToggle'),nav=$('#mainNav');
    if(navToggle&&nav&&!navToggle.dataset.bound){navToggle.dataset.bound='1';navToggle.addEventListener('click',()=>{nav.classList.toggle('open');navToggle.setAttribute('aria-expanded',nav.classList.contains('open')?'true':'false');});}
    bindDiagnostic();
  }
  function scrollToTarget(id, attempt=0){
    const target=document.getElementById(id);
    if(target){ requestAnimationFrame(()=>target.scrollIntoView({behavior:'smooth',block:'start'})); return; }
    if(attempt<20) setTimeout(()=>scrollToTarget(id,attempt+1),50);
  }
  const homepageSectionIds = new Set(['home','start','courses','smartteacher','teachers','trust']);
  const focusBar = document.getElementById('elFocusToolbar');
  const focusBarName = document.getElementById('elFocusName');
  function applyRouteView(){
    if(!$('#home',app)){if(focusBar)focusBar.hidden=true;return;}
    const hash=(location.hash||'#home').slice(1);
    const canonical=legacyAnchorMap[hash]||hash;
    const target=document.getElementById(canonical);
    const section=target?.closest('section');
    const focusSection=section && section.parentElement===app ? section : null;
    const isHome=!canonical||canonical==='home'||!focusSection;
    app.querySelectorAll(':scope > section').forEach(el=>{
      el.hidden=isHome?!homepageSectionIds.has(el.id):el!==focusSection;
    });
    document.body.dataset.elHomepageView=isHome?'home':'focus';
    if(focusBar)focusBar.hidden=isHome;
    if(focusBarName&&!isHome){
      focusBarName.textContent=focusSection.querySelector('.section-head h2, h2, h1')?.textContent?.trim()||'Explore Legal English';
    }
  }
  // Called once by the learning engine after it injects the protected scenario, plan,
  // and progress sections. No competing mutation observers or DOM replacement.
  window.englishLegaleseApplyView=applyRouteView;
  function route(){
    const raw=(window.location.hash||'#home').replace('#','');
    const canonical=legacyAnchorMap[raw]||raw;
    if(protectedHashes.has(canonical)){pageShell(dashboardPanel(canonical==='dashboards'?'admin':canonical.replace('-dashboard',''))); applyRouteView(); return;}
    if(canonical==='classrooms'){pageShell(`${skillsStudio()}${dashboardPanel('teacher')}`);applyRouteView();return;}
    if(!$('#home',app)) home(); else bindActions();
    applyRouteView();
    scrollToTarget(canonical||'home');
  }
  window.addEventListener('hashchange',route);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',route,{once:true}); else route();
})();