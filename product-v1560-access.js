/* EnglishLegalese.com v1.56.0 — public dashboard access safety */
(() => {
  'use strict';
  const qs = (s, r=document) => r.querySelector(s);
  const protectedHashes = new Set(['#dashboards','#student-dashboard','#teacher-dashboard','#employer-dashboard','#admin-dashboard']);
  let checking = false;

  function shell(title, body, extra='') {
    const app = qs('#app');
    if (!app) return;
    app.innerHTML = `<section class="section" id="account-access"><div class="container"><article class="panel v1560-access-panel"><div class="eyebrow">Account access</div><h1>${title}</h1><p>${body}</p>${extra}<div class="v1560-section-controls"><a class="btn gold" href="#start">Return to learning options</a></div></article></div></section>`;
    app.focus({preventScroll:true});
  }

  async function readiness() {
    try {
      const r = await fetch('/api/v119/production-readiness', {headers:{'Accept':'application/json'}});
      if (!r.ok) return null;
      return await r.json();
    } catch { return null; }
  }

  async function guard() {
    if (!protectedHashes.has(location.hash) || checking) return;
    checking = true;
    const state = await readiness();
    checking = false;
    const authReady = Boolean(state?.integrations?.auth_secret) && state?.persistence_mode === 'postgres';
    if (!authReady) {
      shell('Account dashboards are not publicly enabled yet.', 'EnglishLegalese keeps operational dashboards closed until production authentication and persistent account storage are confirmed. You can continue using the public learning and practice tools now.');
      return;
    }
    shell('Sign-in is required for dashboards.', 'Operational student, teacher, employer, staff and owner dashboards require an authenticated account with the appropriate role. The public homepage does not expose those operational views.', '<p class="v1560-micro-note">Use the approved account sign-in flow when it is enabled for your role. Role-protected API operations remain server-enforced.</p>');
  }

  function labelPublicLinks() {
    qsaSafe('#mainNav a[href="#dashboards"], .mobile-sticky-start a[href="#dashboards"]').forEach(a => {
      a.textContent = 'Account';
      a.setAttribute('aria-label','Account access');
    });
  }

  function qsaSafe(sel){ return Array.from(document.querySelectorAll(sel)); }

  window.addEventListener('hashchange', () => setTimeout(guard, 0));
  document.addEventListener('DOMContentLoaded', () => { labelPublicLinks(); setTimeout(guard, 0); });
  if (document.readyState !== 'loading') { labelPublicLinks(); setTimeout(guard, 0); }
})();
