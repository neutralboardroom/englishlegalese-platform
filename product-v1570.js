/* EnglishLegalese.com v1.57.0 — original non-accredited starting diagnostic */
(() => {
  'use strict';

  const VERSION = '1.57.0';
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));

  const QUESTIONS = [
    {
      id: 'tone', skill: 'Professional tone',
      prompt: 'Which client-update sentence is clearest and most professional?',
      options: [
        'We need your answer ASAP or this could become a problem.',
        'Please send the requested information by Thursday so we can prepare the next step.',
        'You failed to send what we asked for.'
      ], answer: 1
    },
    {
      id: 'clarity', skill: 'Clarity',
      prompt: 'A colleague says, “Please handle this soon.” What is the strongest communication response?',
      options: [
        'Say nothing and decide what “soon” means yourself.',
        'Ask: “Could you confirm the deadline and the specific deliverable you need?”',
        'Reply: “Okay.”'
      ], answer: 1
    },
    {
      id: 'reading', skill: 'Legal reading',
      prompt: 'In professional documents, which word usually signals an obligation more strongly?',
      options: ['may', 'shall', 'might'], answer: 1
    },
    {
      id: 'plain', skill: 'Plain English',
      prompt: 'Which version is the clearest plain-English rewrite?',
      options: [
        'Pursuant to the aforementioned correspondence, we hereby request your response.',
        'Please respond to the earlier email.',
        'We would be desirous of receiving your responsive communication.'
      ], answer: 1
    },
    {
      id: 'meeting', skill: 'Meetings',
      prompt: 'Which phrase politely interrupts to clarify an important point?',
      options: [
        'Stop. That makes no sense.',
        'Sorry to interrupt — could I clarify one point before we move on?',
        'Whatever. Continue.'
      ], answer: 1
    },
    {
      id: 'writing', skill: 'Legal-business writing',
      prompt: 'Which email subject line is most useful for a time-sensitive professional update?',
      options: [
        'Important!!!',
        'Update',
        'Contract review — comments requested by 18 October'
      ], answer: 2
    },
    {
      id: 'ai', skill: 'AI-output review',
      prompt: 'An AI draft sounds fluent but states a legal conclusion you have not verified. What should you do?',
      options: [
        'Treat fluent wording as proof that the conclusion is correct.',
        'Verify the legal meaning with an appropriate qualified source/person before relying on it.',
        'Send it immediately because AI generated it.'
      ], answer: 1
    },
    {
      id: 'privacy', skill: 'Confidentiality awareness',
      prompt: 'What is the safest practice when using an AI language exercise?',
      options: [
        'Use synthetic or de-identified facts unless confidential information is specifically authorized and protected.',
        'Paste full client names and confidential facts so the exercise feels realistic.',
        'Assume every AI tool is automatically approved for confidential material.'
      ], answer: 0
    }
  ];

  const PATHS = {
    foundation: {
      title: 'Foundation practice path',
      text: 'Start with clear professional tone, core Legal English vocabulary, plain-English explanations, reading basics, and short guided scenarios.',
      href: '#courses', cta: 'See Foundation-friendly courses'
    },
    professional: {
      title: 'Professional practice path',
      text: 'Build precision through client updates, meetings, contract/document reading, professional email, and AI-output review.',
      href: '#practice-studio', cta: 'Practice a professional scenario'
    },
    advanced: {
      title: 'Advanced practice path',
      text: 'Use complex scenarios to sharpen nuance, concise drafting, negotiation language, risk communication, and careful AI review.',
      href: '#practice-studio', cta: 'Open advanced scenario practice'
    }
  };

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  function diagnosticMarkup() {
    const questions = QUESTIONS.map((q, index) => `
      <fieldset class="v1570-question" data-question="${escapeHtml(q.id)}">
        <legend><span>${index + 1}</span>${escapeHtml(q.prompt)}</legend>
        <div class="v1570-options">
          ${q.options.map((opt, i) => `<label><input type="radio" name="v1570-${escapeHtml(q.id)}" value="${i}"><span>${escapeHtml(opt)}</span></label>`).join('')}
        </div>
      </fieldset>`).join('');

    return `<section class="section v1570-diagnostic" id="diagnostic" aria-labelledby="v1570-diagnostic-title">
      <div class="container section-head">
        <div><div class="eyebrow">Free starting diagnostic</div><h2 id="v1570-diagnostic-title">Find your best Legal English practice starting point.</h2></div>
        <p>Eight short communication questions give you an immediate practice recommendation. No account is required and your answers are not saved.</p>
      </div>
      <div class="container v1570-diagnostic-shell">
        <div class="v1570-boundary" role="note"><strong>Practice guidance only.</strong> This is an original EnglishLegalese learning diagnostic, not an accredited proficiency test, CEFR score, TOLES result, legal qualification, or certification.</div>
        <form class="v1570-diagnostic-form" novalidate>${questions}
          <div class="v1570-actions"><button class="btn gold" type="submit">Get my practice recommendation</button><button class="btn light js-v1570-reset" type="button">Clear answers</button></div>
          <p class="v1570-form-status" role="status" aria-live="polite"></p>
        </form>
        <div class="v1570-result" hidden tabindex="-1" aria-live="polite"></div>
      </div>
    </section>`;
  }

  function choosePath(score) {
    if (score <= 3) return PATHS.foundation;
    if (score <= 6) return PATHS.professional;
    return PATHS.advanced;
  }

  function recommendedFocus(missed) {
    const counts = new Map();
    missed.forEach(skill => counts.set(skill, (counts.get(skill) || 0) + 1));
    const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([skill]) => skill);
    if (!ranked.length) return ['Nuance and concise drafting', 'Complex scenario practice', 'AI-output verification'];
    return ranked.slice(0, 3);
  }

  function bindDiagnostic(section) {
    const form = qs('.v1570-diagnostic-form', section);
    const result = qs('.v1570-result', section);
    const status = qs('.v1570-form-status', section);
    if (!form || !result || form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';

    form.addEventListener('submit', event => {
      event.preventDefault();
      const answers = QUESTIONS.map(q => {
        const checked = qs(`input[name="v1570-${q.id}"]:checked`, form);
        return checked ? Number(checked.value) : null;
      });
      const unanswered = answers.filter(v => v === null).length;
      if (unanswered) {
        status.textContent = `Please answer all ${QUESTIONS.length} questions. ${unanswered} ${unanswered === 1 ? 'question remains' : 'questions remain'}.`;
        const firstMissingIndex = answers.findIndex(v => v === null);
        qs(`[data-question="${QUESTIONS[firstMissingIndex].id}"]`, form)?.scrollIntoView({behavior:'smooth', block:'center'});
        return;
      }

      let score = 0;
      const missed = [];
      QUESTIONS.forEach((q, index) => {
        if (answers[index] === q.answer) score += 1;
        else missed.push(q.skill);
      });
      const path = choosePath(score);
      const focus = recommendedFocus(missed);
      status.textContent = '';
      result.hidden = false;
      result.innerHTML = `<div class="eyebrow">Your practice recommendation</div>
        <h3>${escapeHtml(path.title)}</h3>
        <p>${escapeHtml(path.text)}</p>
        <div class="v1570-score"><strong>${score} of ${QUESTIONS.length}</strong> communication-practice items matched the strongest option.</div>
        <p class="v1570-score-note">This score is only a learning-start signal. It is not a validated language-proficiency score and has no CEFR, TOLES, academic, licensing, or employment equivalence.</p>
        <div class="v1570-focus"><strong>Focus first</strong><ul>${focus.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul></div>
        <div class="v1570-result-actions"><a class="btn teal" href="${path.href}">${escapeHtml(path.cta)}</a><a class="btn light" href="#smartteacher">Practice with SmartTeacher AI</a></div>`;
      result.focus({preventScroll:true});
      result.scrollIntoView({behavior:'smooth', block:'center'});
    });

    qs('.js-v1570-reset', form)?.addEventListener('click', () => {
      form.reset();
      status.textContent = '';
      result.hidden = true;
      result.innerHTML = '';
      qs('input', form)?.focus();
    });
  }

  function connectEntryPoints() {
    const heroCta = qs('.hero-actions a:first-child');
    if (heroCta) heroCta.href = '#diagnostic';
    qsa('#start article, #start .card').forEach(card => {
      if (qs('h3', card)?.textContent.trim() !== 'Student') return;
      const link = qs('a', card);
      if (link) { link.href = '#diagnostic'; link.textContent = 'Take the starting diagnostic'; }
    });
  }

  function apply() {
    const start = qs('#start');
    if (!start || !document.body.classList.contains('v1560-ready')) return false;
    let section = qs('#diagnostic');
    if (!section) {
      start.insertAdjacentHTML('afterend', diagnosticMarkup());
      section = qs('#diagnostic');
    }
    bindDiagnostic(section);
    connectEntryPoints();
    document.documentElement.dataset.englishlegaleseVersion = VERSION;
    document.body.classList.add('v1570-ready');
    return true;
  }

  function start() {
    if (apply()) return;
    const observer = new MutationObserver(() => { if (apply()) observer.disconnect(); });
    observer.observe(document.documentElement, {childList:true, subtree:true, attributes:true, attributeFilter:['class']});
    setTimeout(() => { apply(); observer.disconnect(); }, 3000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
