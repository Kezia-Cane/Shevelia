(() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const menuButton = qs('[data-menu-toggle]');
  const menu = qs('[data-menu]');
  const closeMenu = () => { menuButton?.setAttribute('aria-expanded','false'); menu?.classList.remove('is-open'); };
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  });
  qsa('a', menu).forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 820) closeMenu(); });

  const reveals = qsa('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { rootMargin:'0px 0px -7% 0px', threshold:.08 });
    reveals.forEach(item => observer.observe(item));
  } else reveals.forEach(item => item.classList.add('is-visible'));

  const updateBlackFridayPopup = () => {
    const modalContent = qs('.bf-modal__content');
    const existingCta = qs('.bf-modal__cta', modalContent || document);
    if (!modalContent || !existingCta || qs('.bf-modal__actions', modalContent)) return false;
    const eyebrow = qs('.bf-modal__eyebrow', modalContent);
    const heading = qs('#bf-modal-title', modalContent);
    const description = qs('#bf-modal-description', modalContent);
    const note = qs('.bf-modal__note', modalContent);
    if (eyebrow) eyebrow.textContent = 'Black Friday support for the way you want to feel';
    if (heading) heading.innerHTML = 'Feel<br>supported.<br><span>Day and night.</span>';
    if (description) description.textContent = 'Choose Daily Slim for lighter, steadier days or Menopause Balance for calmer nights and clearer mornings. Start with the support you need most today.';
    if (note) note.textContent = 'Black Friday availability is limited.';
    const actions = document.createElement('div');
    actions.className = 'bf-modal__actions';
    actions.innerHTML = '<a class="bf-modal__cta" href="https://shevelia.co/pages/daily-slim">Explore Daily Slim <span aria-hidden="true">→</span></a><a class="bf-modal__cta" href="https://shevelia.co/pages/menopause-balance">Explore Menopause Balance <span aria-hidden="true">→</span></a>';
    existingCta.replaceWith(actions);
    return true;
  };

  const popupObserver = new MutationObserver(() => {
    if (updateBlackFridayPopup()) popupObserver.disconnect();
  });
  popupObserver.observe(document.body, { childList: true });
  updateBlackFridayPopup();

  const year = qs('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
