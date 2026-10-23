/* EnglishLegalese.com v1.55.0 — no-drift navigation preservation */
(() => {
  const desiredDesktop = [
    ['/learn/start/','Start'],
    ['/learn/courses/','Legal English'],
    ['/learn/smartteacher/','SmartTeacher AI'],
    ['/learn/teachers/','Teachers'],
    ['/learn/employers/','Employers'],
    ['/learn/language-support/','Language Support'],
    ['/learn/trust/','Trust'],
    ['/learn/account/','Login / Dashboard','nav-cta']
  ];
  const desiredMobile = [
    ['/learn/start/','Start'],
    ['/learn/courses/','Courses'],
    ['/learn/smartteacher/','AI Practice'],
    ['/learn/language-support/','Languages'],
    ['/learn/account/','Dashboard']
  ];

  function link([href,label,cls]) {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    if (cls) a.className = cls;
    return a;
  }

  function ensure() {
    const nav = document.querySelector('#mainNav');
    if (nav) {
      const current = Array.from(nav.querySelectorAll(':scope > a, details a')).map(a => a.getAttribute('href'));
      const required = desiredDesktop.map(([href]) => href);
      // Preserve valid additive top-level navigation and nested learning-resource menus.
      // Keep owner-approved v1.84 dedicated routes without clobbering additional menu items.\n      // Restore the minimal protected navigation only if a required destination disappears.
      if (required.some(href => !current.includes(href)) || !current.includes('/learn/business-english/') || !current.includes('/learn/enroll/')) {
        nav.replaceChildren(...desiredDesktop.map(link));
      }
      nav.dataset.v1550 = '1';
    }

    const mobile = document.querySelector('.mobile-sticky-start');
    if (mobile) {
      const current = Array.from(mobile.querySelectorAll('a')).map(a => a.getAttribute('href'));
      const required = desiredMobile.map(([href]) => href);
      if (required.some(href => !current.includes(href)) || current.length !== required.length) {
        mobile.replaceChildren(...desiredMobile.map(link));
      }
      mobile.dataset.v1550 = '1';
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensure, {once:true});
  else ensure();
  window.addEventListener('hashchange', ensure);
})();
