/* EnglishLegalese v1.54.2 — Navigation + custom-domain readiness hardening.
   The original additive v1.54.0 prototype remains preserved in app-legacy-v1.54.0.js.
   This production-facing bootstrap keeps v1.54.1 stable and restores legacy anchor compatibility
   so header/footer/mobile links from earlier builds keep routing to the correct launch-safe sections. */
(() => {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const app = $('#app');
  const version = 'Legal English training for the AI era';
  const preferredLanguageKey = 'elPreferredExplanationLanguage';
  const languages = ['English','Spanish','Chinese','Arabic','French','Portuguese','Russian','Turkish','Hindi','Urdu','Korean','Japanese','Vietnamese','Indonesian','German','Italian','Polish','Ukrainian','Persian / Farsi','Bengali','Thai','Italian','Dutch','Greek','Hebrew','Swedish','Norwegian','Danish','Finnish','Romanian','Czech','Hungarian','Malay','Tagalog','Swahili'];
  const topLanguages = ['Spanish','Chinese','Arabic','French','Portuguese','Russian','Turkish','Hindi','Urdu','Korean','Japanese','Vietnamese','Indonesian','German','Italian','Polish','Ukrainian','Persian / Farsi','Bengali','Thai'];
  const protectedRecords = ['student work','lesson folders','homework','spoken practice','listening notes','reading scores','writing drafts','SmartTeacher AI practice','Translation Bridge records','preferred-language settings','calendars','class links','payments','credits','reports','certificates','test scores','teacher notes','employer records','uploads','support history','audit logs','payouts'];
  const courses = [
    ['Free Legal English Diagnostic','Placement','Needs intake, four-skills baseline, AI translator safety scenario, teacher confirmation.'],
    ['SmartTeacher AI Practice','All levels','Text, speaking, listening, reading, writing, vocabulary, roleplay, and safe AI-output review.'],
    ['Legal English Foundations','Beginner / Novice','Core vocabulary, simple legal concepts, professional tone, and plain-English explanations.'],
    ['Legal Writing and Professional Email','Intermediate','Client updates, internal memos, follow-ups, concise status writing, and tone.'],
    ['Speaking, Meetings, and Client Calls','Intermediate / Advanced','Confidence, clarification, client-safe wording, negotiation basics, and meeting summaries.'],
    ['Contract and Document Reading','Intermediate / Advanced','Clauses, definitions, obligations, deadlines, rights, risk language, and summaries.'],
    ['AI Translator Safety Lab','All levels','Confidentiality, over-literal translation risk, false confidence, tone, and human review triggers.'],
    ['LL.M. / Law School Readiness','Intermediate / Advanced','Case reading, discussion, professor emails, presentations, exams, and study-group language.'],
    ['Employer Team Training','Teams','Privacy-safe reporting, attendance, completion, skill readiness, and next-training recommendations.']
  ];
  const launchGates = ['PostgreSQL DATABASE_URL and migrations','Owner/admin account and role access','Stripe checkout, prices, and webhooks','OpenAI server-side key and usage controls','SMTP email notifications','Object storage for uploads/reports/certificates','Manual classroom link fallback plus optional video/calendar vendors','Legal/trust pages reviewed','Device/browser QA','Backup and restore test'];

  const legacyAnchorMap = {
    'v154-public-launch-readiness': 'launch',
    'v153-role-clarity-continuity': 'start',
    'v150-language-learning-bridge': 'language-bridge',
    'v146-live-skills-feedback': 'skills',
    'v143-course-placement': 'courses',
    'v131-teacher-classroom-tools': 'teachers',
    'v129-employer-roi-math': 'employers',
    'v141-major-language-bridge': 'language-bridge',
    'trust-center': 'trust',
    'v149-intuitive-ux-continuity': 'start',
    'v148-usability-continuity': 'start',
    'v147-simplicity-command': 'start',
    'v145-integrated-skills-studio': 'skills',
    'v144-four-skills-academy': 'skills',
    'v142-continuity-command': 'launch',
    'v140-workflow-proof-layer': 'launch',
    'v139-seamless-learning-operations': 'start',
    'v139-universal-language-bridge': 'language-bridge',
    'v139-teacher-live-cockpit': 'teachers',
    'v139-data-preservation': 'launch',
    'v138-ai-era-action-layer': 'start',
    'v138-student-proof-loop': 'student-dashboard',
    'v137-guided-help-navigator': 'start',
    'v137-one-tap-help': 'start',
    'v136-native-language-support': 'language-bridge',
    'v136-smartteacher-language-modes': 'smartteacher',
    'v134-calendar-interop': 'launch',
    'v133-global-access': 'language-bridge',
    'v133-provider-routing': 'language-bridge',
    'v132-chatgpt-only-policy': 'smartteacher',
    'v130-smartteacher-brand': 'smartteacher',
    'v129-benchmark-integration': 'courses',
    'v129-buyer-faq': 'trust',
    'v129-course-catalog': 'courses',
    'v134-calendar-provider-board': 'launch',
    'student-intake': 'student-dashboard',
    'firm-intake': 'employer-dashboard',
    'teacher-apply': 'teacher-dashboard',
    'ai-translation-safety': 'smartteacher',
    'scheduling': 'launch',
    'resources': 'trust',
    'global-access-classrooms': 'language-bridge',
    'calendar-reminders': 'launch',
    'skills-studio': 'skills',
    'speaking-listening-reading-writing': 'skills',
    'reading-lab': 'courses',
    'writing-workshop': 'courses',
    '100-language-learning-bridge': 'language-bridge'
  };

  function escapeHtml(value=''){
    return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }
  function toast(message){
    const t = $('#toast');
    if(!t) return;
    t.textContent = message;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }
  function preferredLanguage(){ return localStorage.getItem(preferredLanguageKey) || 'English'; }
  function setPreferredLanguage(lang){ localStorage.setItem(preferredLanguageKey, lang || 'English'); }
  function languageSelect(){
    const value = preferredLanguage();
    return `<label class="language-select-label">Preferred explanation language<select class="input js-language-select">${languages.map(l => `<option ${l===value?'selected':''}>${escapeHtml(l)}</option>`).join('')}</select></label>`;
  }
  function pageShell(content){
    app.innerHTML = content;
    bindActions();
    app.focus({preventScroll:true});
  }
  function card(title, body, cta='', href='#start'){
    return `<article class="card flat"><h3>${escapeHtml(title)}</h3><p>${body}</p>${cta ? `<a class="btn light block" href="${href}">${escapeHtml(cta)}</a>` : ''}</article>`;
  }
  function hero(){
    return `<section class="hero" id="home"><div class="container hero-grid"><div><div class="eyebrow">${version}</div><h1>Legal English training for the AI era.</h1><p class="lead">AI can translate words. EnglishLegalese trains professionals to understand, explain, write, negotiate, read, speak, listen, and review AI output safely in real legal and business English.</p><div class="hero-actions"><a class="btn gold" href="#start">Start diagnostic</a><a class="btn teal" href="#language-bridge">Use my language</a><a class="btn" href="#courses">View courses</a><a class="btn light" href="#dashboards">Open dashboards</a></div><div class="trust-row"><div class="trust-item">Live teachers</div><div class="trust-item">ChatGPT-powered SmartTeacher AI</div><div class="trust-item">100+ major-language learning bridge</div><div class="trust-item">Learning support, not legal advice</div></div></div><div class="hero-card"><img class="hero-logo" src="assets/englishlegalese-logo.png" alt="EnglishLegalese"><h3>Use EnglishLegalese in your preferred language when you need help — while you build real Legal English skills.</h3><p class="muted">Native-language support helps students understand instructions, homework, AI practice, teacher feedback, scheduling, class links, billing, reports, and support steps. Then the platform brings the student back to Legal English practice.</p>${languageSelect()}</div></div></section>`;
  }
  function startSection(){
    return `<section class="section compact" id="start"><div class="container section-head"><div><div class="eyebrow">Start here</div><h2>One clear path for every user.</h2></div><p>Choose a role, get one next step first, and keep deeper tools available only when needed.</p></div><div class="container grid cols-4">${card('Student','Take the diagnostic, choose your preferred explanation language, get a course recommendation, practice with SmartTeacher AI, save work, and ask a teacher to review.','Start as student','#student-dashboard')}${card('Teacher','Prepare class, review saved AI/Translation Bridge practice, teach online, assign homework, close out class, and track payout status.','Open teacher tools','#teacher-dashboard')}${card('Employer','Train teams, see attendance and skill progress, receive privacy-safe reports, and renew/top up when progress is clear.','Open employer view','#employer-dashboard')}${card('EnglishLegalese Team','Check launch gates, protect data, assign teachers, manage reports, clear support issues, and preserve payments/calendars/scores.','Open staff view','#admin-dashboard')}</div></section>`;
  }
  function languageBridge(){
    return `<section class="section accent" id="language-bridge"><div class="container section-head"><div><div class="eyebrow">100+ Language Learning Bridge</div><h2>Get unstuck in 100+ major languages — then return to Legal English.</h2></div><p>EnglishLegalese should not promise perfect static translation of every page. It provides preferred-language explanations as a learning bridge.</p></div><div class="container grid cols-3"><article class="panel"><h3>Layer 1: Core UI help</h3><p>Major-language support for homepage, onboarding, dashboard labels, course placement, SmartTeacher instructions, Translation Bridge, scheduling, billing, support, and trust notices.</p></article><article class="panel"><h3>Layer 2: Page explanations</h3><p>Show Legal English, Simple English, preferred-language explanation, side-by-side view, Back to Legal English, and Ask my teacher to review.</p></article><article class="panel"><h3>Layer 3: Reviewed marketing pages</h3><p>Human-reviewed top-market pages should be planned for ${topLanguages.slice(0,8).join(', ')} and other priority markets.</p></article></div><div class="container panel"><div class="panel-head"><div><h3>Preferred explanation language</h3><p class="muted">Choose once. The platform can use it across onboarding, SmartTeacher AI, homework, feedback, dashboards, scheduling, billing, certificates, and support.</p></div>${languageSelect()}</div><div class="v151-mode-strip"><span>Show Legal English</span><span>Show Simple English</span><span>Explain in my language</span><span>Practice in Legal English</span><span>Ask my teacher to review</span></div><p class="notice"><strong>Safety line:</strong> Native-language support is a learning bridge, not certified translation, court interpretation, legal advice, or final legal meaning.</p></div></section>`;
  }
  function skillsStudio(){
    return `<section class="section" id="skills"><div class="container section-head"><div><div class="eyebrow">Four-skills academy</div><h2>Speaking, listening, reading, and writing belong in one learning loop.</h2></div><p>Practice starts with AI or teacher guidance, gets saved to a lesson folder, routes to teacher review when needed, becomes homework, and then appears as privacy-safe progress proof.</p></div><div class="container grid cols-4">${card('Speaking','Client calls, meetings, pronunciation, confidence, clarification, and professional disagreement.','Practice speaking','#student-dashboard')}${card('Listening','Note-taking, deadlines, action items, client/supervisor instructions, and meeting summaries.','Practice listening','#student-dashboard')}${card('Reading','Contracts, clauses, cases, policies, legal-system vocabulary, and risk language.','Open reading lab','#courses')}${card('Writing','Professional legal emails, memos, status updates, summaries, and AI-draft review.','Open writing workshop','#courses')}</div></section>`;
  }
  function coursesSection(){
    return `<section class="section alt" id="courses"><div class="container section-head"><div><div class="eyebrow">Launch course set</div><h2>Practical Legal English courses designed for real professional situations.</h2></div><p>The full catalog can grow later. Public launch should start with a small set of clear paths.</p></div><div class="container grid cols-3">${courses.map(c => `<article class="panel"><div class="kicker">${escapeHtml(c[1])}</div><h3>${escapeHtml(c[0])}</h3><p>${escapeHtml(c[2])}</p></article>`).join('')}</div></section>`;
  }
  function smartTeacher(){
    return `<section class="section" id="smartteacher"><div class="container section-head"><div><div class="eyebrow">SmartTeacher AI</div><h2>Practice with AI. Improve with live teachers. Prove progress safely.</h2></div><p>SmartTeacher AI is ChatGPT/OpenAI-powered practice and learning support. It is not legal advice, certified translation, court interpretation, or final legal meaning.</p></div><div class="container panel"><textarea class="input big-input js-ai-input" placeholder="Ask SmartTeacher AI for Legal English practice, a speaking roleplay, writing exercise, reading support, or AI translator safety drill."></textarea><div class="tag-row"><button class="btn gold js-ai-demo">Get practice guidance</button><button class="btn light js-save-lesson">Save to lesson folder</button><button class="btn light js-teacher-review">Ask teacher to review</button></div><div class="ai-demo-output clean-note js-ai-output">SmartTeacher AI practice is ready. Start practicing Legal English conversations, writing, reading, listening, and professional scenarios.</div></div></section>`;
  }
  function teachersEmployers(){
    return `<section class="section alt" id="teachers"><div class="container grid cols-2"><article class="panel"><div class="eyebrow">Teachers</div><h2>Built-in online classroom tools.</h2><p>Teachers can see learner language cards, saved AI practice, Translation Bridge flags, lesson goals, live correction pads, roleplay launchers, homework handoffs, closeout notes, and employer-safe summary drafts.</p><a class="btn teal" href="#teacher-dashboard">Open teacher dashboard</a></article><article class="panel" id="employers"><div class="eyebrow">Employers</div><h2>Privacy-safe progress reports.</h2><p>Employers see attendance, completion, skill movement, certificates, and next-training recommendations. Private drafts, raw AI text, native-language explanations, recordings, uploads, test answers, and teacher-private notes stay excluded by default.</p><a class="btn teal" href="#employer-dashboard">Open employer dashboard</a></article></div></section>`;
  }
  function launchReady(){
    return `<section class="section" id="launch"><div class="container section-head"><div><div class="eyebrow">Learning experience</div><h2>A trusted learning environment built for professionals.</h2></div><p>EnglishLegalese.com is designed to provide a clear, professional learning experience with AI practice, live teachers, and structured progress support.</p></div><div class="container grid cols-2"><article class="panel"><h3>Learning standards</h3><ul class="feature-list compact">${launchGates.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul></article><article class="panel warning-card"><h3>Progress protection</h3><p>Your learning experience is designed to protect ${protectedRecords.length} record types including ${protectedRecords.slice(0,10).join(', ')} and more.</p><p class="notice">Your learning history, practice activities, progress records, and learning materials are organized to support continuity.</p></article></div></section>`;
  }
  function trust(){
    return `<section class="section alt" id="trust"><div class="container section-head"><div><div class="eyebrow">Trust center</div><h2>Clear boundaries protect students, teachers, employers, and the brand.</h2></div><p>EnglishLegalese.com provides education, language training, and professional communication practice only.</p></div><div class="container grid cols-3">${card('Not a law firm','The platform does not provide legal advice or decide legal rights, obligations, deadlines, filings, or strategy.')}${card('Not certified translation','Native-language explanations help learning. They are not certified translation, court interpretation, or final legal meaning.')}${card('Private by default','Employer reports are privacy-safe. Private learner drafts, uploads, raw AI practice, and teacher-private notes are not shared by default.')}</div></section>`;
  }
  function dashboardPanel(role){
    const title = {student:'Student dashboard',teacher:'Teacher dashboard',employer:'Employer dashboard',admin:'Owner / staff dashboard'}[role] || 'Dashboard';
    const steps = {
      student:['Take diagnostic','Choose preferred explanation language','Practice with SmartTeacher AI','Save work to lesson folder','Ask teacher to review','Attend class','View progress'],
      teacher:['Review learner goals','Check language/support flags','Prepare lesson','Teach live','Assign homework','Close out class','Track payout status'],
      employer:['Review team readiness','See attendance/completion','Review privacy-safe skill progress','Request workshop','Renew/top up credits'],
      admin:['Check launch gates','Protect data before deploy','Assign teachers','Clear schedule/payment/support blockers','Review reports/certificates','Approve payouts']
    }[role] || [];
    return `<section class="section" id="${role}-dashboard"><div class="container section-head"><div><div class="eyebrow">${escapeHtml(title)}</div><h2>One next step first.</h2></div><p>Dashboards should be clear enough that each user knows what to do without understanding every system underneath.</p></div><div class="container grid cols-2"><article class="panel"><h3>Next path</h3><ol class="feature-list compact">${steps.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ol></article><article class="panel"><h3>What stays protected</h3><p>Work, calendars, payment status, credits, progress, reports, certificates, scores, teacher notes, employer records, support history, and payouts must be preserved across every version update.</p><button class="btn gold js-toast" data-toast="Continuity check saved in demo mode.">Run continuity check</button></article></div></section>`;
  }
  function home(){ pageShell(`${hero()}${startSection()}${languageBridge()}${skillsStudio()}${coursesSection()}${smartTeacher()}${teachersEmployers()}${launchReady()}${trust()}`); }
  function route(){
    const hash = (window.location.hash || '#home').replace('#','');
    const canonicalHash = legacyAnchorMap[hash] || hash;
    if(canonicalHash === 'student-dashboard') return pageShell(dashboardPanel('student'));
    if(canonicalHash === 'teacher-dashboard') return pageShell(dashboardPanel('teacher'));
    if(canonicalHash === 'employer-dashboard') return pageShell(dashboardPanel('employer'));
    if(canonicalHash === 'admin-dashboard' || canonicalHash === 'dashboards') return pageShell(`${dashboardPanel('admin')}${dashboardPanel('student')}${dashboardPanel('teacher')}${dashboardPanel('employer')}`);
    if(canonicalHash === 'classrooms') return pageShell(`${skillsStudio()}${dashboardPanel('teacher')}`);
    home();
    const target = document.getElementById(canonicalHash) || document.getElementById(hash);
    if(target) setTimeout(() => target.scrollIntoView({behavior:'smooth', block:'start'}), 0);
  }
  function bindActions(){
    $$('.js-language-select').forEach(sel => sel.addEventListener('change', () => { setPreferredLanguage(sel.value); toast(`Preferred explanation language saved: ${sel.value}`); route(); }));
    $$('.js-ai-demo').forEach(btn => btn.addEventListener('click', () => { const input = $('.js-ai-input'); const out = $('.js-ai-output'); const topic = input && input.value.trim() ? input.value.trim() : 'Legal English practice'; if(out) out.textContent = `Demo guidance for ${topic}: practice first in Legal English, ask for Simple English or ${preferredLanguage()} only when stuck, save useful work to the lesson folder, and ask a teacher to review high-stakes language.`; }));
    $$('.js-save-lesson').forEach(btn => btn.addEventListener('click', () => toast('Saved to lesson folder in demo mode.')));
    $$('.js-teacher-review').forEach(btn => btn.addEventListener('click', () => toast('Teacher review handoff created in demo mode.')));
    $$('.js-toast').forEach(btn => btn.addEventListener('click', () => toast(btn.dataset.toast || 'Saved.')));
    const navToggle = $('#navToggle');
    const nav = $('#mainNav');
    if(navToggle && nav && !navToggle.dataset.bound){
      navToggle.dataset.bound = '1';
      navToggle.addEventListener('click', () => { nav.classList.toggle('open'); navToggle.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false'); });
    }
  }
  window.addEventListener('hashchange', route);
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', route); else route();
})();
