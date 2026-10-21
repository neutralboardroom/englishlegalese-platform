/* EnglishLegalese.com v1.55.0 — no-drift navigation preservation */
(() => {
  const desiredDesktop = [
    ['#start','Start'],
    ['#courses','Courses'],
    ['#smartteacher','SmartTeacher AI'],
    ['#teachers','Teachers'],
    ['#employers','Employers'],
    ['#language-bridge','Language Support'],
    ['#trust','Trust'],
    ['#dashboards','Login / Dashboard','nav-cta']
  ];
  const desiredMobile = [
    ['#start','Start'],
    ['#courses','Courses'],
    ['#smartteacher','AI Practice'],
    ['#language-bridge','Languages'],
    ['#dashboards','Dashboard']
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
      const current = Array.from(nav.querySelectorAll(':scope > a')).map(a => a.getAttribute('href'));
      const required = desiredDesktop.map(([href]) => href);
      // Preserve valid additive top-level navigation and nested learning-resource menus.
      // Restore the legacy navigation only if a required original direct link disappears.
      if (required.some(href => !current.includes(href))) {
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
