/* EnglishLegalese.com v1.55.0 — research-backed custom roleplay adaptation */
(() => {
  const qs = (s, r = document) => r.querySelector(s);
  const esc = (v = '') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function toast(message) {
    const el = qs('#toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2800);
  }

  function form() {
    return `<section class="v1550-workspace v1550-custom-roleplay" aria-labelledby="custom-roleplay-title">
      <div class="v1550-workspace-head">
        <div>
          <div class="v1550-kicker">Create your own practice</div>
          <h3 id="custom-roleplay-title">Rehearse a real professional situation without using confidential facts.</h3>
        </div>
      </div>
      <p>Describe the communication situation in generic or synthetic terms. EnglishLegalese will turn it into a SmartTeacher language-practice prompt. Do not include client names, privileged facts, account numbers, unpublished deal terms, or other confidential information.</p>
      <div class="v1550-grid-2">
        <label>Your role
          <input class="input js-v1550-custom-role" maxlength="80" placeholder="e.g., associate, LL.M. student, legal operations manager" />
        </label>
        <label>Other person's role
          <input class="input js-v1550-custom-counterpart" maxlength="80" placeholder="e.g., client, partner, counterparty counsel" />
        </label>
      </div>
      <label>Situation
        <textarea class="input js-v1550-custom-situation" rows="4" maxlength="600" placeholder="Describe the communication challenge without confidential details."></textarea>
      </label>
      <label>What do you want to practice?
        <textarea class="input js-v1550-custom-goal" rows="3" maxlength="300" placeholder="e.g., explain a delay clearly, negotiate wording, ask better clarification questions"></textarea>
      </label>
      <div class="v1550-workspace-actions">
        <button class="btn gold js-v1550-custom-start">Open with SmartTeacher AI</button>
        <button class="btn light js-v1550-custom-clear">Clear</button>
      </div>
      <p class="v1550-privacy-note">Language education only. SmartTeacher should challenge communication quality, not decide legal meaning or give legal advice. Finish with one prioritized takeaway for the next practice session.</p>
    </section>`;
  }

  function inject() {
    const studio = qs('#practice-studio .container');
    if (!studio || qs('.v1550-custom-roleplay')) return;
    const grid = qs('.v1550-scenario-grid', studio);
    if (!grid) return;
    grid.insertAdjacentHTML('beforebegin', form());
    bind();
  }

  function promptFromForm() {
    const role = qs('.js-v1550-custom-role')?.value.trim() || 'Legal professional or learner';
    const counterpart = qs('.js-v1550-custom-counterpart')?.value.trim() || 'Professional counterpart';
    const situation = qs('.js-v1550-custom-situation')?.value.trim();
    const goal = qs('.js-v1550-custom-goal')?.value.trim();
    if (!situation || !goal) {
      toast('Add a generic situation and your practice goal first.');
      return null;
    }
    return `CUSTOM LEGAL ENGLISH LANGUAGE PRACTICE — no confidential client facts. My role: ${role}. Counterpart: ${counterpart}. Generic/synthetic situation: ${situation}. Communication goal: ${goal}. Act as the counterpart or language coach. Keep this strictly to Legal English and professional communication practice, not legal advice. Do not invent legal facts or decide legal meaning. Correct only the highest-value issues so the practice remains natural. At the end, give me one prioritized takeaway to improve in my next session.`;
  }

  function start() {
    const prompt = promptFromForm();
    if (!prompt) return;
    location.hash = '#smartteacher';
    setTimeout(() => {
      const input = qs('.js-ai-input');
      if (input) {
        input.value = prompt;
        input.focus();
        toast('Custom roleplay loaded into SmartTeacher AI.');
      } else if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(prompt)
          .then(() => toast('Custom roleplay prompt copied.'))
          .catch(() => toast('Custom roleplay prompt prepared.'));
      }
    }, 120);
  }

  function clear() {
    ['.js-v1550-custom-role','.js-v1550-custom-counterpart','.js-v1550-custom-situation','.js-v1550-custom-goal']
      .forEach(s => { const el = qs(s); if (el) el.value = ''; });
    qs('.js-v1550-custom-role')?.focus();
  }

  function bind() {
    const startBtn = qs('.js-v1550-custom-start');
    if (startBtn && !startBtn.dataset.bound) {
      startBtn.dataset.bound = '1';
      startBtn.addEventListener('click', start);
    }
    const clearBtn = qs('.js-v1550-custom-clear');
    if (clearBtn && !clearBtn.dataset.bound) {
      clearBtn.dataset.bound = '1';
      clearBtn.addEventListener('click', clear);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(inject, 0), {once:true});
  else setTimeout(inject, 0);
  window.addEventListener('hashchange', inject);
})();