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

  const year = qs('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
