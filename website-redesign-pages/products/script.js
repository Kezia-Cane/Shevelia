(() => {
  const button = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  button?.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    menu?.classList.toggle('is-open', open);
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    button?.setAttribute('aria-expanded', 'false');
    menu?.classList.remove('is-open');
  }));

  const benefitHooks = {
    daily: [
      ['A flatter belly, less bloat', '<path d="M4 12h16M8 8l-4 4 4 4m8-8 4 4-4 4"/>'],
      ['Fewer sugar cravings', '<path d="M6 12c2-4 10-4 12 0-2 4-10 4-12 0Zm3-5 6 10"/>'],
      ['Lighter, less puffy, more energy', '<path d="M13 2 5 14h6l-1 8 9-13h-6l1-7Z"/>'],
      ['Clothes that fit like before', '<path d="m8 4 4 2 4-2 4 4-3 2v10H7V10L4 8l4-4Z"/>']
    ],
    menopause: [
      ['Calmer, more restful nights', '<path d="M19 15.5A8 8 0 0 1 8.5 5 8 8 0 1 0 19 15.5Z"/>'],
      ['Feel like yourself again', '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>'],
      ['A clearer head', '<path d="M12 3a7 7 0 0 0-4 12.7c.7.5 1 1 1 1.8h6c0-.8.3-1.3 1-1.8A7 7 0 0 0 12 3Zm-3 18h6"/>'],
      ['Energy that lasts the afternoon', '<path d="m13 2-8 12h6l-1 8 9-13h-6l1-7Z"/>']
    ]
  };

  const refreshProductBenefits = () => {
    const rotation = { daily: 0, menopause: 0 };
    document.querySelectorAll('.bf-product-cta-stack').forEach((stack) => {
      const cta = stack.querySelector('a[href*="/products/"]');
      const list = stack.querySelector('.bf-product-benefits--cta ul');
      if (!cta || !list) return;
      const product = cta.href.includes('/daily-slim') ? 'daily' : 'menopause';
      const hooks = benefitHooks[product];
      const start = rotation[product] % hooks.length;
      const chosen = [0, 1, 2].map((offset) => hooks[(start + offset) % hooks.length]);
      list.innerHTML = chosen.map(([label, icon]) => `<li><svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg><span>${label}</span></li>`).join('');
      rotation[product] += 1;
    });
  };

  document.addEventListener('DOMContentLoaded', () => window.setTimeout(refreshProductBenefits, 0), { once: true });

})();
