/* EnglishLegalese.com v1.56.0 — screenshot-audited homepage architecture */
(() => {
  'use strict';
  const VERSION = '1.56.0';
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));
  const stateKey = 'elV1550LearningState';
  let scenarioExpanded = false;
  let coursesExpanded = false;
  let plannerExpanded = false;
  let passportExpanded = false;

  function replaceText(root, pairs) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.parentElement && !['SCRIPT','STYLE','TEXTAREA','OPTION'].includes(node.parentElement.tagName)
          ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      let next = node.nodeValue;
      pairs.forEach(([from, to]) => { next = next.split(from).join(to); });
      if (next !== node.nodeValue) node.nodeValue = next;
    });
  }

  function cleanPublicCopy() {
    const app = qs('#app');
    replaceText(app, [
      ['New in v1.55', 'Guided practice'],
      ['Practice → review → personalize → prove progress.', 'Practice → review → personalize → track progress.'],
      ['Prove progress safely.', 'Track progress clearly.'],
      ['privacy-safe progress proof', 'privacy-conscious progress tracking'],
      ['Launch course set', 'Legal English courses'],
      ['The full catalog can grow later. Public launch should start with a small set of clear paths.', 'Choose a practical path based on your goals, level, and professional communication needs.'],
      ['EnglishLegalese should not promise perfect static translation of every page. It provides preferred-language explanations as a learning bridge.', 'Preferred-language explanations can support understanding while bringing you back to Legal English practice.'],
      ['Safety line:', 'Important:'],
      ['Practice completion and learner self-checks are shown separately from any future teacher-confirmed assessment.', 'Practice completion and learner self-checks remain separate from teacher-confirmed feedback.'],
      ['Legal Skills Passport', 'Legal Skills Progress'],
      ['Employer-safe progress snapshot', 'Shareable progress snapshot'],
      ['Copy safe snapshot', 'Prepare shareable snapshot']
    ]);

    qsa('.trust-item').forEach(el => {
      if (/100\+ major-language/i.test(el.textContent)) el.textContent = 'Major-language learning bridge';
    });

    const startCards = qsa('#start article, #start .card');
    startCards.forEach(card => {
      const title = qs('h3', card)?.textContent.trim();
      if (title === 'EnglishLegalese Team') card.remove();
      if (title === 'Teacher') {
        const p = qs('p', card);
        if (p) p.textContent = 'Prepare lessons, review learner practice, teach online, assign homework, and give feedback. Account and payout tools are available after sign-in.';
        const a = qs('a', card); if (a) { a.textContent = 'Explore teacher support'; a.href = '#teachers'; }
      }
      if (title === 'Employer') {
        const p = qs('p', card);
        if (p) p.textContent = 'Train teams and review consent-based, aggregate attendance and learning progress while private learner work stays private by default.';
        const a = qs('a', card); if (a) { a.textContent = 'Explore employer training'; a.href = '#employers'; }
      }
    });

    const languageSection = qs('#language-bridge');
    if (languageSection) {
      const notice = qs('.notice', languageSection);
      if (notice) notice.innerHTML = '<strong>Important:</strong> Preferred-language support is a learning bridge. It is not certified translation, court interpretation, legal advice, or final legal meaning.';
    }

    const skills = qs('#skills .section-head p');
    if (skills) skills.textContent = 'Practice speaking, listening, reading, and writing with AI or teacher guidance, save useful learning notes, and build a privacy-conscious record of progress.';

    const smartHead = qs('#smartteacher .section-head h2');
    if (smartHead) smartHead.textContent = 'Practice with AI. Improve with live teachers. Track progress clearly.';

    const teacherPanel = qs('#teachers article.panel');
    if (teacherPanel) {
      const h2 = qs('h2', teacherPanel); if (h2) h2.textContent = 'Teacher-guided learning tools.';
      const p = qs('p', teacherPanel); if (p) p.textContent = 'Teachers can review learner practice, prepare lessons, guide roleplays, assign homework, and give feedback while keeping private teacher notes appropriately separated.';
      const a = qs('a', teacherPanel); if (a) { a.textContent = 'Teacher sign-in / dashboard'; a.title = 'Sign-in is required for operational teacher tools'; }
      ensureNote(teacherPanel, 'Operational teacher tools require the appropriate signed-in role.');
    }
    const employerPanel = qs('#employers');
    if (employerPanel) {
      const h2 = qs('h2', employerPanel); if (h2) h2.textContent = 'Privacy-conscious team progress.';
      const p = qs('p', employerPanel); if (p) p.textContent = 'Organizations can use consent-based aggregate attendance and learning-progress signals. Private drafts, raw AI practice, uploads, recordings, native-language explanations, test answers, and teacher-private notes remain excluded by default.';
      const a = qs('a', employerPanel); if (a) { a.textContent = 'Employer sign-in / dashboard'; a.title = 'Sign-in is required for operational employer tools'; }
      ensureNote(employerPanel, 'No private learner content is shared automatically.');
    }

    const diagnostic = qsa('#courses article').find(a => /Free Legal English Diagnostic/i.test(a.textContent));
    if (diagnostic) {
      const h3 = qs('h3', diagnostic); if (h3) h3.textContent = 'Free Legal English starting diagnostic';
      const p = qs('p', diagnostic); if (p) p.textContent = 'A practice-based starting point across core Legal English skills that can guide your next learning path.';
      ensureNote(diagnostic, 'Starting-point guidance only — not an accredited proficiency test or certification.');
    }

    normalizeCourseLevels();
  }

  function ensureNote(container, text) {
    if (!container || qsa('.v1560-micro-note', container).some(n => n.textContent === text)) return;
    const p = document.createElement('p');
    p.className = 'v1560-micro-note';
    p.textContent = text;
    container.appendChild(p);
  }

  function normalizeCourseLevels() {
    const map = new Map([
      ['Beginner / Novice', 'Foundation'],
      ['Intermediate', 'Professional'],
      ['Intermediate / Advanced', 'Professional / Advanced'],
      ['All levels', 'All levels']
    ]);
    qsa('#courses .kicker').forEach(el => {
      const raw = el.textContent.trim();
      if (map.has(raw)) el.textContent = map.get(raw);
    });
    const head = qs('#courses .section-head');
    if (head && !qs('.v1560-level-note', head)) {
      const p = document.createElement('p');
      p.className = 'v1560-level-note';
      p.textContent = 'Learning levels use Foundation, Professional, and Advanced language where applicable.';
      head.appendChild(p);
    }
  }

  function compactCourses() {
    const section = qs('#courses');
    if (!section) return;
    const cards = qsa('.grid article, .grid .panel', section).filter((x, i, arr) => arr.indexOf(x) === i);
    if (cards.length < 7) return;
    cards.forEach((card, i) => card.classList.toggle('v1560-collapsible', i >= 6));
    let controls = qs('.v1560-course-controls', section);
    if (!controls) {
      controls = document.createElement('div');
      controls.className = 'container v1560-section-controls v1560-course-controls';
      controls.innerHTML = `<button class="btn light js-v1560-courses" aria-expanded="false">View all ${cards.length} courses</button>`;
      qs('.container.grid', section)?.after(controls);
      qs('.js-v1560-courses', controls)?.addEventListener('click', () => {
        coursesExpanded = !coursesExpanded;
        renderCourseState();
      });
    }
    if (location.hash === '#courses') coursesExpanded = true;
    renderCourseState();
  }

  function renderCourseState() {
    const section = qs('#courses'); if (!section) return;
    section.classList.toggle('v1560-expanded', coursesExpanded);
    const btn = qs('.js-v1560-courses', section);
    if (btn) {
      btn.setAttribute('aria-expanded', String(coursesExpanded));
      btn.textContent = coursesExpanded ? 'Show featured courses only' : `View all ${qsa('.grid article, .grid .panel', section).length} courses`;
    }
  }

  function compactScenarios() {
    const section = qs('#practice-studio');
    if (!section) return;
    const cards = qsa('.v1550-scenario-card', section);
    cards.forEach((card, i) => {
      card.classList.toggle('v1560-collapsible', i >= 6);
      const title = qs('h3', card)?.textContent.trim();
      const button = qs('.js-v1550-start', card);
      if (button && title) button.setAttribute('aria-label', `Open practice: ${title}`);
    });
    if (!qs('.v1560-scenario-controls', section)) {
      const controls = document.createElement('div');
      controls.className = 'v1560-section-controls v1560-scenario-controls';
      controls.innerHTML = `<button class="btn teal js-v1560-scenarios" aria-expanded="false">Explore all ${cards.length} scenarios</button><button class="btn light js-v1560-custom">Create your own roleplay</button>`;
      qs('.v1550-scenario-grid', section)?.after(controls);
      qs('.js-v1560-scenarios', controls)?.addEventListener('click', () => { scenarioExpanded = !scenarioExpanded; renderScenarioState(); });
      qs('.js-v1560-custom', controls)?.addEventListener('click', () => {
        scenarioExpanded = true; renderScenarioState();
        const custom = qs('.v1550-custom-roleplay', section);
        if (custom) { custom.hidden = false; custom.scrollIntoView({behavior:'smooth', block:'start'}); }
      });
    }
    const custom = qs('.v1550-custom-roleplay', section);
    if (custom && location.hash !== '#practice-studio') custom.hidden = true;
    if (location.hash === '#practice-studio') scenarioExpanded = true;
    renderScenarioState();
  }

  function renderScenarioState() {
    const section = qs('#practice-studio'); if (!section) return;
    section.classList.toggle('v1560-expanded', scenarioExpanded);
    const btn = qs('.js-v1560-scenarios', section);
    const total = qsa('.v1550-scenario-card', section).length;
    if (btn) {
      btn.setAttribute('aria-expanded', String(scenarioExpanded));
      btn.textContent = scenarioExpanded ? 'Show featured scenarios only' : `Explore all ${total} scenarios`;
    }
    const custom = qs('.v1550-custom-roleplay', section);
    if (custom && scenarioExpanded && location.hash === '#practice-studio') custom.hidden = false;
  }

  function compactPlanner() {
    const section = qs('#learning-plan'); if (!section) return;
    const builder = qs('.v1550-plan-builder', section); if (!builder) return;
    if (!qs('.v1560-planner-controls', section)) {
      const controls = document.createElement('div');
      controls.className = 'container v1560-section-controls v1560-planner-controls';
      controls.innerHTML = '<button class="btn gold js-v1560-planner" aria-expanded="false">Build my four-week plan</button>';
      qs('.section-head', section)?.after(controls);
      qs('.js-v1560-planner', controls)?.addEventListener('click', () => { plannerExpanded = !plannerExpanded; renderPlannerState(); });
    }
    if (location.hash === '#learning-plan') plannerExpanded = true;
    renderPlannerState();
  }

  function renderPlannerState() {
    const section = qs('#learning-plan'); if (!section) return;
    section.classList.toggle('v1560-expanded', plannerExpanded);
    const btn = qs('.js-v1560-planner', section);
    if (btn) { btn.setAttribute('aria-expanded', String(plannerExpanded)); btn.textContent = plannerExpanded ? 'Hide plan builder' : 'Build my four-week plan'; }
  }

  function compactPassport() {
    const section = qs('#skills-passport'); if (!section) return;
    const state = (() => { try { return JSON.parse(localStorage.getItem(stateKey) || '{}'); } catch { return {}; } })();
    const completed = Array.isArray(state.completed) ? state.completed.length : 0;
    const detailTargets = qsa('.v1550-stat-row, .v1550-passport-grid, .v1550-review-loop', section);
    detailTargets.forEach(el => el.classList.add('v1560-progress-detail'));
    if (!qs('.v1560-progress-controls', section)) {
      const controls = document.createElement('div');
      controls.className = 'container v1560-section-controls v1560-progress-controls';
      controls.innerHTML = completed
        ? '<p class="v1560-progress-intro">Your practice record is a learner progress record, not an accredited credential.</p><button class="btn light js-v1560-passport" aria-expanded="false">View detailed progress</button>'
        : '<div class="v1560-empty-progress"><h3>Your progress starts with your first practice.</h3><p>Complete a scenario or starting diagnostic to begin building a private learning record. This is not a certification or accredited test score.</p><a class="btn gold" href="#practice-studio">Start a scenario</a></div><button class="btn light js-v1560-passport" aria-expanded="false">View empty progress details</button>';
      qs('.section-head', section)?.after(controls);
      qs('.js-v1560-passport', controls)?.addEventListener('click', () => { passportExpanded = !passportExpanded; renderPassportState(); });
    }
    if (location.hash === '#skills-passport') passportExpanded = true;
    renderPassportState();
    const share = qs('.js-v1550-employer', section);
    if (share) {
      share.textContent = 'Prepare shareable snapshot';
      share.setAttribute('aria-label', 'Prepare a consent-based aggregate progress snapshot');
      ensureNote(share.parentElement, 'Nothing is shared automatically. Preparing or copying a snapshot is a learner-controlled action.');
    }
  }

  function renderPassportState() {
    const section = qs('#skills-passport'); if (!section) return;
    section.classList.toggle('v1560-expanded', passportExpanded);
    const btn = qs('.js-v1560-passport', section);
    if (btn) { btn.setAttribute('aria-expanded', String(passportExpanded)); btn.textContent = passportExpanded ? 'Hide detailed progress' : 'View detailed progress'; }
  }

  function smartTeacherGuidance() {
    const section = qs('#smartteacher'); if (!section || qs('.v1560-prompt-starters', section)) return;
    const input = qs('.js-ai-input', section); if (!input) return;
    const wrap = document.createElement('div');
    wrap.className = 'v1560-prompt-starters';
    const starters = [
      ['Client update', 'Help me practice giving a concise client update with clear next steps. Use a synthetic situation and focus on tone and clarity.'],
      ['Contract clause', 'Give me a synthetic contract clause to explain in plain English without giving legal advice.'],
      ['Meeting clarification', 'Roleplay a professional meeting where I need to interrupt politely, clarify a term, and confirm an action item.'],
      ['AI draft review', 'Give me a synthetic AI-generated legal-business email with a few communication problems to identify and improve.']
    ];
    wrap.innerHTML = '<span>Try a guided starter:</span>' + starters.map(([label, prompt], i) => `<button type="button" class="v1560-starter" data-v1560-starter="${i}">${label}</button>`).join('');
    input.before(wrap);
    qsa('[data-v1560-starter]', wrap).forEach(btn => btn.addEventListener('click', () => { input.value = starters[Number(btn.dataset.v1560Starter)][1]; input.focus(); }));
    const speak = qs('.js-ai-demo', section);
    if (speak) { speak.textContent = 'Practice a conversation'; speak.setAttribute('aria-label', 'Start text-guided conversation practice'); }
    ensureNote(qs('.panel', section), 'SmartTeacher supports language practice. It does not provide accredited assessment or legal advice.');
  }

  function fixActiveNavigation() {
    const links = qsa('#mainNav a[href^="#"]');
    const pairs = links.map(link => [link, qs(link.getAttribute('href'))]).filter(([, section]) => section);
    let scheduled = false;
    const update = () => {
      scheduled = false;
      const marker = Math.max(120, (qs('.site-header')?.offsetHeight || 80) + 50);
      let best = null;
      pairs.forEach(([link, section]) => {
        const r = section.getBoundingClientRect();
        if (r.top <= marker && r.bottom > marker) best = link;
      });
      links.forEach(link => link.removeAttribute('aria-current'));
      if (best) best.setAttribute('aria-current', 'location');
    };
    const schedule = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', schedule, {passive:true});
    window.addEventListener('resize', schedule, {passive:true});
    window.addEventListener('hashchange', () => { expandForHash(); setTimeout(update, 60); });
    update();
  }

  function expandForHash() {
    if (location.hash === '#courses') { coursesExpanded = true; renderCourseState(); }
    if (location.hash === '#practice-studio') { scenarioExpanded = true; renderScenarioState(); const c = qs('.v1550-custom-roleplay'); if (c) c.hidden = false; }
    if (location.hash === '#learning-plan') { plannerExpanded = true; renderPlannerState(); }
    if (location.hash === '#skills-passport') { passportExpanded = true; renderPassportState(); }
  }

  function markVersion() {
    document.documentElement.dataset.englishlegaleseVersion = VERSION;
  }

  function apply() {
    if (!qs('#start') || !qs('#practice-studio')) return false;
    markVersion();
    cleanPublicCopy();
    compactCourses();
    compactScenarios();
    compactPlanner();
    compactPassport();
    smartTeacherGuidance();
    fixActiveNavigation();
    document.body.classList.add('v1560-ready');
    return true;
  }

  function start() {
    if (apply()) return;
    const observer = new MutationObserver(() => { if (apply()) observer.disconnect(); });
    observer.observe(document.documentElement, {childList:true, subtree:true});
    setTimeout(() => { apply(); observer.disconnect(); }, 2500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
