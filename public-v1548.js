/* EnglishLegalese.com v1.54.8 — public experience hardening.
   This file is intentionally additive and does not alter backend/data behavior. */
(() => {
  const VERSION = '1.54.8';
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  document.documentElement.dataset.englishlegaleseVersion = VERSION;

  function safeHash() {
    try { return decodeURIComponent(location.hash || '#home'); }
    catch { return location.hash || '#home'; }
  }

  function markCurrentNavigation() {
    const hash = safeHash();
    qsa('.main-nav a, .mobile-sticky-start a').forEach(link => {
      const isCurrent = link.getAttribute('href') === hash;
      if (isCurrent) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function hardenLanguageControls() {
    qsa('.js-language-select').forEach((select, index) => {
      if (!select.getAttribute('aria-label')) {
        select.setAttribute('aria-label', index === 0 ? 'Preferred explanation language' : `Preferred explanation language ${index + 1}`);
      }
    });
  }

  function rewriteLearningExperience() {
    const section = qs('#launch');
    if (!section || section.dataset.publicV1548 === 'true') return;

    const heading = qs('h2', section);
    const intro = qs('.section-head > p', section);
    const panels = qsa('.panel', section);

    if (heading) heading.textContent = 'A professional learning experience designed for clarity and continuity.';
    if (intro) intro.textContent = 'Practice, teacher feedback, course progress, and language support stay connected so learners can focus on improving Legal English.';

    if (panels[0]) {
      panels[0].innerHTML = `
        <h3>What learners can expect</h3>
        <ul class="public-proof-list">
          <li>Clear role-based paths for students, teachers, and organizations.</li>
          <li>SmartTeacher AI practice with visible education-only boundaries.</li>
          <li>Preferred-language explanations that lead back to Legal English practice.</li>
          <li>Teacher review when professional judgment or nuance matters.</li>
          <li>Progress, course, and learning records organized for continuity.</li>
        </ul>`;
    }

    if (panels[1]) {
      panels[1].classList.remove('warning-card');
      panels[1].innerHTML = `
        <h3>Privacy-conscious by design</h3>
        <p>EnglishLegalese separates learning support from legal advice and keeps employer-facing reporting focused on appropriate progress signals rather than private learner content.</p>
        <p class="notice public-confidence-note"><strong>Important:</strong> EnglishLegalese provides education and professional communication practice. It is not a law firm, certified translation service, or court interpretation service.</p>`;
    }

    section.dataset.publicV1548 = 'true';
  }

  function simplifyMobileQuickStart() {
    const rail = qs('.mobile-sticky-start');
    if (!rail || rail.dataset.publicV1548 === 'true') return;

    rail.innerHTML = [
      ['#start', 'Start'],
      ['#courses', 'Courses'],
      ['#smartteacher', 'AI Practice'],
      ['#language-bridge', 'Languages'],
      ['#dashboards', 'Dashboard']
    ].map(([href, label]) => `<a href="${href}">${label}</a>`).join('');
    rail.dataset.publicV1548 = 'true';
  }

  function improveNavBehavior() {
    const toggle = qs('#navToggle');
    const nav = qs('#mainNav');
    if (!toggle || !nav || toggle.dataset.publicV1548 === 'true') return;

    const closeNav = () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    };

    nav.addEventListener('click', event => {
      if (event.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeNav();
        toggle.focus();
      }
    });

    toggle.dataset.publicV1548 = 'true';
  }

  function hardenExternalLinks() {
    qsa('a[target="_blank"]').forEach(link => {
      const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('noopener');
      rel.add('noreferrer');
      link.setAttribute('rel', Array.from(rel).join(' '));
    });
  }

  function applyPublicHardening() {
    simplifyMobileQuickStart();
    rewriteLearningExperience();
    hardenLanguageControls();
    improveNavBehavior();
    hardenExternalLinks();
    markCurrentNavigation();
  }

  const app = qs('#app');
  if (app) {
    const observer = new MutationObserver(() => applyPublicHardening());
    observer.observe(app, { childList: true, subtree: true });
  }

  window.addEventListener('hashchange', () => {
    applyPublicHardening();
    markCurrentNavigation();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyPublicHardening, { once: true });
  } else {
    applyPublicHardening();
  }
})();
