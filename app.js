/* EnglishLegalese.com v1.64.0 — canonical public homepage + durable in-page routing.
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
  const quickPracticeItems = [
    {
      "title": "Clear client update",
      "focus": "Write a polite, concise update without inventing a deadline.",
      "situation": "Fictional situation: You reviewed a draft, but a supporting attachment is missing. You cannot proceed until it arrives.",
      "task": "Write one or two sentences telling the recipient what you need and why.",
      "example": "Thank you for sending the draft. Could you please send the missing attachment so we can continue our review?",
      "why": [
        "Use a courteous request rather than blaming the recipient.",
        "Name the missing attachment rather than saying “it.”",
        "Explain the next step without creating an unconfirmed deadline."
      ]
    },
    {
      "title": "Clarify a meeting request",
      "focus": "Ask a useful follow-up question when instructions are unclear.",
      "situation": "Fictional situation: A colleague asks you to “send the summary soon.” No deadline or audience has been specified.",
      "task": "Write a short response confirming exactly what you need to know.",
      "example": "Of course. Who should receive the summary, and what deadline would work for you?",
      "why": [
        "Do not assume what “soon” means.",
        "Ask for the audience and deadline directly.",
        "Use a professional, collaborative tone."
      ]
    },
    {
      "title": "Explain a fictional clause",
      "focus": "Make contractual wording easier to read while preserving its important details.",
      "situation": "Fictional training sentence: “The supplier must notify the customer within five business days after discovering a service interruption.”",
      "task": "Rewrite the sentence in plain English. Keep the actor, obligation, recipient, and five-business-day timing unchanged.",
      "example": "If the supplier discovers a service interruption, it must notify the customer within five business days.",
      "why": [
        "Identify who must act and who receives the notice.",
        "Keep “must” and the exact five-business-day time period.",
        "Do not change the clause’s legal meaning; qualified review is necessary before using real legal text."
      ]
    }
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
  const QUIZ_FEEDBACK = [
    'A polite, specific request with a clear next step is more useful than blame or pressure.',
    'When “soon” is unclear, ask which deliverable is needed and when.',
    '“Shall” has often been used to express an obligation in legal drafting; always check the actual clause and applicable context. Plain-English drafts may use “must” for obligations.',
    'Short, direct wording tells the reader what action to take without unnecessary formal language.',
    'A courteous interruption helps you clarify meaning without disrupting a professional conversation.',
    'A helpful subject line identifies the document or task and gives a specific requested date.',
    'Fluent AI-generated text is not evidence that its legal conclusion is correct. Check the meaning with an appropriately qualified source or person.',
    'Fictional or properly de-identified facts reduce unnecessary confidentiality risks. Real sensitive material requires specific authorization and safeguards.'
  ];
  function nextDiagnosticPractice(missed){
    if(missed.includes('Confidentiality awareness'))
      return {href:'#trust',label:'Review safe practice boundaries',why:'Start by reviewing confidentiality and responsible learning-tool use.'};
    if(missed.includes('AI-output review'))
      return {href:'#smartteacher',label:'Explore careful AI-draft practice',why:'Practise identifying language concerns without trusting unverified AI legal conclusions.'};
    if(missed.some(x=>x==='Legal reading'||x==='Plain English'))
      return {href:'#quick-practice',step:2,label:'Try the fictional clause rewrite',why:'Focus on expressing obligations and time limits in clear English without changing meaning.'};
    if(missed.some(x=>x==='Clarity'||x==='Meetings'))
      return {href:'#quick-practice',step:1,label:'Try the meeting clarification',why:'Focus on polite, specific questions when a request is unclear.'};
    if(missed.some(x=>x==='Professional tone'||x==='Legal-business writing'))
      return {href:'#quick-practice',step:0,label:'Try the client update exercise',why:'Focus on writing a short, courteous professional request.'};
    return {href:'#quick-practice',step:2,label:'Try a more nuanced clause rewrite',why:'You matched all eight practice prompts; try the fictional clause task and compare your wording with the example.'};
  }
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
      <div class="hero-example improved"><div class="hero-example-label">Try</div><p>Please respond to the earlier email.</p></div><a class="v1630-hero-link" href="#quick-practice">Try a free three-step writing exercise →</a>
      <div class="hero-language">LANGUAGE_WIDGET<p>Choose an explanation language for learning support. Legal English remains the goal.</p></div>
    </aside></div></section>`.replace('LANGUAGE_WIDGET',languageSelect());
  }
  function startSection(){
    return `<section class="section compact" id="start"><div class="container section-head"><div><div class="eyebrow">Choose your path</div><h2>Start with what you need.</h2></div><p>Whether you are learning, teaching, or training a team, choose the path that fits your goal.</p></div><div class="container grid cols-3 v1620-paths">${card('Student','Build confidence with a free starting diagnostic, realistic legal conversations, writing practice, and courses.','Take the starting diagnostic','#diagnostic')}${card('Teacher','Explore lesson support, realistic legal scenarios, and opportunities for teacher-guided feedback.','Explore teacher support','#teachers')}${card('Employer','Explore practical Legal English training with privacy-conscious learning progress for teams.','Explore employer training','#employers')}</div></section>`;
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
  function quickPractice(){
    return `<section class="section v1630-practice-section" id="quick-practice" aria-labelledby="v1630-title">
      <div class="container section-head"><div><div class="eyebrow">Free writing workout</div><h2 id="v1630-title">Practise clearer Legal English in three steps.</h2></div><p>Rewrite three fictional professional messages. Then compare your draft with a model example and a short review checklist. No account, clock, score, or submission.</p></div>
      <div class="container v1630-workout-shell">
        <div class="v1630-progress" role="status" aria-live="polite" aria-atomic="true">Exercise 1 of ${quickPracticeItems.length}</div>
        ${quickPracticeItems.map((item,i)=>`<article class="v1630-step panel" data-practice-step="${i}" ${i?'hidden':''}>
          <div class="v1630-step-kicker">${escapeHtml(item.focus)}</div>
          <h3 id="v1630-step-title-${i}" tabindex="-1">${escapeHtml(item.title)}</h3>
          <p class="v1630-situation">${escapeHtml(item.situation)}</p>
          <label for="v1630-answer-${i}" class="v1630-writing-label">${escapeHtml(item.task)}</label>
          <textarea id="v1630-answer-${i}" class="v1630-answer" maxlength="800" rows="4" autocomplete="off" spellcheck="true" placeholder="Write your own English here (fictional facts only)."></textarea>
          <button class="btn light v1630-reveal" type="button" data-practice-action="example" aria-expanded="false" aria-controls="v1630-model-${i}">Show model example and checklist</button>
          <div class="v1630-model" id="v1630-model-${i}" hidden><h4>One possible version</h4><p class="v1630-model-copy">${escapeHtml(item.example)}</p><h4>Review your own writing</h4><ul>${item.why.map(point=>`<li>${escapeHtml(point)}</li>`).join('')}</ul><p class="v1630-review-note">This is a learning example, not an automatic assessment or verified legal drafting advice. There may be other suitable rewrites.</p></div>
        </article>`).join('')}
        <div class="v1630-step-controls"><button class="btn light" type="button" data-practice-action="prev" disabled>Previous</button><button class="btn teal" type="button" data-practice-action="next">Next exercise</button><button class="v1630-clear" type="button" data-practice-action="reset">Clear drafts and restart</button></div>
        <p class="v1630-privacy">Your drafts stay in this page only. They are not submitted, scored, stored, or shared. Refreshing or restarting clears them. Never enter real client information.</p>
        <p class="v1630-end-note" role="status" aria-live="polite"></p>
        <a class="v1630-next-link" href="#practice-studio">Explore all 21 Legal English scenarios →</a>
      </div>
    </section>`;
  }

  function smartTeacher(){
    const starters = ['Client update','Contract clause','Meeting clarification','AI draft review'];
    return `<section class="section" id="smartteacher"><div class="container section-head"><div><div class="eyebrow">SmartTeacher AI practice</div><h2>Practice with AI. Improve with teacher guidance. Track progress clearly.</h2></div><p>Prepare a realistic Legal English practice or writing-review prompt. This on-page prompt builder does not send text to an AI service or generate live AI feedback. Use synthetic or de-identified details.</p></div><div class="container panel v1620-practice-panel"><div class="v1580-prompt-starters"><span>Try a guided starter:</span>${starters.map((s,i)=>`<button class="v1580-starter" type="button" data-starter="${i}">${s}</button>`).join('')}</div><label class="v1620-input-label" for="el-practice-topic">Your practice topic or draft</label><textarea id="el-practice-topic" class="input big-input js-ai-input" maxlength="1500" placeholder="e.g., Practise a concise client update, using invented facts only."></textarea><div class="tag-row v1620-practice-actions"><button class="btn gold js-ai-demo" type="button">Prepare conversation practice</button><button class="btn light js-save-lesson" type="button">Prepare writing review</button><button class="btn light js-teacher-review" type="button">Teacher review options</button></div><div class="ai-demo-output clean-note js-ai-output v1620-practice-result" role="status" aria-live="polite" tabindex="-1">Choose a starter or describe your task. The prepared prompt stays in this browser until you copy it. No AI response is generated here.</div><button class="btn light js-copy-practice" type="button" hidden>Copy prepared prompt</button><p class="v1580-micro-note">Use this prompt with a connected AI tool or qualified teacher. Always verify legal meaning; this is language practice, not legal advice or an accredited assessment.</p></div></section>`;
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
  function home(){ pageShell(`${hero()}${startSection()}${diagnosticSection()}${languageBridge()}${skillsStudio()}${coursesSection()}${quickPractice()}${smartTeacher()}${teachersEmployers()}${learningExperience()}${trust()}`); }

  let openQuickPracticeStep=null;
  function bindDiagnostic(){
    const form = $('.v1580-diagnostic-form'); if(!form || form.dataset.bound==='1') return;
    form.dataset.bound='1';
    const result=$('.v1580-result'), status=$('.v1580-form-status');
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const answers=QUESTIONS.map((q,i)=>{const x=$('input[name="v1580-q'+i+'"]:checked',form);return x?Number(x.value):null;});
      const missing=answers.map((value,i)=>value===null?i:-1).filter(i=>i>=0);
      if(missing.length){
        status.textContent='Please answer all '+QUESTIONS.length+' questions. '+missing.length+(missing.length===1?' question remains':' questions remain')+'. Start with question '+(missing[0]+1)+'.';
        result.hidden=true;
        result.textContent='';
        form.querySelector('input[name="v1580-q'+missing[0]+'"]')?.focus();
        return;
      }
      let score=0;const missed=[];
      QUESTIONS.forEach((q,i)=>{if(answers[i]===q[3])score+=1;else missed.push(q[0]);});
      const path=score<=3?'Foundation':score<=6?'Professional':'Advanced';
      const focus=missed.length?missed.slice(0,3):['Nuance and concise drafting','Complex scenario practice','AI-output verification'];
      const action=nextDiagnosticPractice(missed);
      const deepLink=Number.isInteger(action.step)?' data-practice-step="'+action.step+'"':'';
      const review=QUESTIONS.map((q,i)=>{
        const matched=answers[i]===q[3];
        return '<li class="v1640-review-item"><strong>Question '+(i+1)+': '+escapeHtml(q[0])+'</strong><p>'+ (matched?'Your choice matches the practice answer.':'A different answer is stronger for this practice question.')+'</p><p><strong>Your answer:</strong> '+escapeHtml(q[2][answers[i]])+'</p><p><strong>Stronger option:</strong> '+escapeHtml(q[2][q[3]])+'</p><p>'+escapeHtml(QUIZ_FEEDBACK[i])+'</p></li>';
      }).join('');
      status.textContent='';
      result.hidden=false;
      result.innerHTML='<div class="eyebrow">Your practice recommendation</div>'+
        '<h3>'+path+' practice path</h3>'+
        '<p><strong>'+score+' of '+QUESTIONS.length+'</strong> communication-practice items matched the strongest option.</p>'+
        '<p>This is only a learning-start signal. It is not a validated proficiency score and has no CEFR, TOLES, academic, licensing, certification, or employment equivalence.</p>'+
        '<strong>Focus first</strong><ul>'+focus.map(x=>'<li>'+escapeHtml(x)+'</li>').join('')+'</ul>'+
        '<div class="v1640-action-plan"><h4>A useful next step</h4><p>'+escapeHtml(action.why)+'</p>'+
          '<a href="'+action.href+'"'+deepLink+' class="btn teal v1640-next-action'+(Number.isInteger(action.step)?' js-v1640-recommended-practice':'')+'">'+escapeHtml(action.label)+'</a>'+
          '<p class="v1640-small-note">A suggested learning activity based on a few practice questions, not a validated skill diagnosis.</p></div>'+
        '<details class="v1640-review"><summary>Review all 8 questions and explanations</summary>'+
          '<p>Review your selected answer against a stronger communication option. These are educational examples, not authoritative legal interpretations.</p>'+
          '<ol>'+review+'</ol></details>'+
        '<div class="v1580-actions"><a class="btn light" href="#practice-studio">Explore 21 scenarios</a>'+
          '<a class="btn light" href="#smartteacher">Prepare a practice prompt</a></div>';
      result.focus({preventScroll:true});result.scrollIntoView({behavior:'instant',block:'center'});
    });
    result.addEventListener('click',event=>{
      const link=event.target.closest('.js-v1640-recommended-practice');
      if(!link||!result.contains(link)||!openQuickPracticeStep)return;
      const index=Number(link.dataset.practiceStep);
      if(Number.isInteger(index)&&index>=0&&index<quickPracticeItems.length)openQuickPracticeStep(index);
    });
    $('.js-v1580-reset',form)?.addEventListener('click',()=>{
      form.reset();status.textContent='';result.hidden=true;result.textContent='';
    });
  }
  function bindQuickPractice(){
    const section=$('#quick-practice');
    if(!section||section.dataset.bound==='1')return;
    section.dataset.bound='1';
    const steps=Array.from(section.querySelectorAll('.v1630-step'));
    const progress=$('.v1630-progress',section);
    const prev=$('[data-practice-action="prev"]',section);
    const next=$('[data-practice-action="next"]',section);
    const endNote=$('.v1630-end-note',section);
    let index=0;
    function showStep(nextIndex,moveFocus=true){
      index=Math.max(0,Math.min(steps.length-1,nextIndex));
      steps.forEach((step,i)=>{step.hidden=i!==index;});
      progress.textContent=`Exercise ${index+1} of ${steps.length}`;
      prev.disabled=index===0;
      next.disabled=index===steps.length-1;
      next.textContent=index===steps.length-1?'Last exercise':'Next exercise';
      endNote.textContent=index===steps.length-1?'You have reached the final exercise. Compare your work with the model examples, or revisit any earlier step.':'';
      if(moveFocus)steps[index].querySelector('h3')?.focus({preventScroll:true});
    }
    section.addEventListener('click',event=>{
      const btn=event.target.closest('button[data-practice-action]');
      if(!btn||!section.contains(btn))return;
      const action=btn.dataset.practiceAction;
      if(action==='prev')showStep(index-1);
      else if(action==='next')showStep(index+1);
      else if(action==='example'){
        const model=steps[index].querySelector('.v1630-model');
        if(!model)return;
        const expanded=btn.getAttribute('aria-expanded')==='true';
        model.hidden=expanded;
        btn.setAttribute('aria-expanded',String(!expanded));
        btn.textContent=expanded?'Show model example and checklist':'Hide model example and checklist';
      }else if(action==='reset'){
        section.querySelectorAll('.v1630-answer').forEach(field=>{field.value='';});
        section.querySelectorAll('.v1630-model').forEach(model=>{model.hidden=true;});
        section.querySelectorAll('.v1630-reveal').forEach(button=>{button.setAttribute('aria-expanded','false');button.textContent='Show model example and checklist';});
        showStep(0);
        endNote.textContent='All three drafts were cleared from this page.';
      }
    });
    showStep(0,false);
    openQuickPracticeStep=(exercise)=>showStep(exercise,false);
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
    const practiceInput=$('.js-ai-input'), practiceOutput=$('.js-ai-output'), copyPractice=$('.js-copy-practice');
    let preparedPrompt='';
    function preparePractice(mode){
      const topic=(practiceInput?.value||'').trim().slice(0,1500);
      const task=topic||'a professional Legal English communication situation with fictional names and facts';
      const instructions=mode==='writing'
        ? 'Review and improve the following writing for plain English, structure, professional tone, and clarity. Preserve the intended legal meaning, identify phrases needing qualified human verification, and explain your suggested edits.'
        : 'Act as a patient Legal English conversation partner. Present one short fictional situation, ask one question at a time, wait for my response, then explain clarity and tone improvements. Do not invent legal advice.';
      preparedPrompt='LEGAL ENGLISH '+(mode==='writing'?'WRITING REVIEW':'CONVERSATION PRACTICE')+'\n\n'+instructions+'\n\nMy topic or sample text:\n'+task+'\n\nUse synthetic or de-identified facts. This is learning practice only, not legal advice, translation certification, or a proficiency score.';
      if(practiceOutput){practiceOutput.textContent=preparedPrompt;practiceOutput.focus({preventScroll:true});}
      if(copyPractice)copyPractice.hidden=false;
    }
    $$('.js-ai-demo').forEach(btn=>{if(btn.dataset.bound)return;btn.dataset.bound='1';btn.addEventListener('click',()=>preparePractice('conversation'));});
    $$('.js-save-lesson').forEach(btn=>{if(btn.dataset.bound)return;btn.dataset.bound='1';btn.addEventListener('click',()=>preparePractice('writing'));});
    if(copyPractice&&!copyPractice.dataset.bound){copyPractice.dataset.bound='1';copyPractice.addEventListener('click',async()=>{
      if(!preparedPrompt){toast('Prepare a practice prompt first.');return;}
      try{await navigator.clipboard.writeText(preparedPrompt);toast('Prompt copied. Paste it into a connected learning tool or share it with your teacher.');}
      catch{practiceOutput?.focus();toast('Select and copy the prepared prompt from the text area above.');}
    });}
    $$('.js-teacher-review').forEach(btn=>{ if(btn.dataset.bound) return; btn.dataset.bound='1'; btn.addEventListener('click',()=>toast('Teacher review requires the appropriate account and teacher workflow when enabled.')); });
    const courseBtn=$('.js-v1580-courses'); if(courseBtn&&!courseBtn.dataset.bound){courseBtn.dataset.bound='1';courseBtn.addEventListener('click',()=>{const expanded=courseBtn.getAttribute('aria-expanded')==='true';courseBtn.setAttribute('aria-expanded',String(!expanded));document.body.classList.toggle('v1580-courses-expanded',!expanded);courseBtn.textContent=expanded?`View all ${courses.length} courses`:'Show featured courses only';const showAll=!expanded;$$('#courses article').filter(card=>$('h3',card)).forEach((card,i)=>{card.hidden=i>=3&&!showAll;});});}
    const navToggle=$('#navToggle'),nav=$('#mainNav');
    if(navToggle&&nav&&!navToggle.dataset.bound){
      navToggle.dataset.bound='1';
      const closeMenu=(restoreFocus=false)=>{
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded','false');
        navToggle.setAttribute('aria-label','Open primary navigation');
        if(restoreFocus)navToggle.focus();
      };
      navToggle.addEventListener('click',()=>{
        const open=navToggle.getAttribute('aria-expanded')!=='true';
        nav.classList.toggle('open',open);
        navToggle.setAttribute('aria-expanded',String(open));
        navToggle.setAttribute('aria-label',open?'Close primary navigation':'Open primary navigation');
      });
      nav.addEventListener('click',e=>{if(e.target.closest('a[href^="#"]'))closeMenu();});
      document.addEventListener('keydown',e=>{
        if(e.key==='Escape'&&navToggle.getAttribute('aria-expanded')==='true'){e.preventDefault();closeMenu(true);}
      });
      document.addEventListener('pointerdown',e=>{
        if(navToggle.getAttribute('aria-expanded')==='true'&&!nav.contains(e.target)&&!navToggle.contains(e.target))closeMenu();
      });
      window.addEventListener('hashchange',()=>closeMenu());
    }

    bindDiagnostic();
    bindQuickPractice();
  }
  function scrollToTarget(id, attempt=0){
    const target=document.getElementById(id);
    if(target){ requestAnimationFrame(()=>target.scrollIntoView({behavior:'instant',block:'start'})); return; }
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
    document.querySelectorAll('#mainNav a[href^="#"]').forEach(link=>{
      const target=link.getAttribute('href')?.slice(1);
      if(target===canonical){link.setAttribute('aria-current','location');}
      else link.removeAttribute('aria-current');
    });
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