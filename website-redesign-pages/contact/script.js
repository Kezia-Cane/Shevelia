(() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  const menuButton = qs('[data-menu-toggle]');
  const menu = qs('[data-menu]');
  const closeMenu = () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menu?.classList.remove('is-open');
  };
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  });
  qsa('a', menu).forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 820) closeMenu(); });

  qsa('[data-route]').forEach(button => {
    button.addEventListener('click', () => {
      const topic = qs('[data-topic]');
      topic.value = button.dataset.route;
      topic.dispatchEvent(new Event('change', { bubbles: true }));
      qs('#contact-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => topic.focus(), 500);
    });
  });

  qsa('[data-accordion] .faq-item button').forEach(button => {
    button.addEventListener('click', () => {
      const answer = qs('.faq-answer', button.closest('.faq-item'));
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      answer.hidden = open;
    });
  });

  const form = qs('[data-contact-form]');
  const messages = {
    topic: 'Please choose the topic closest to your question.',
    'first-name': 'Please add your first name.',
    email: 'Please enter a valid email address.',
    message: 'Please tell us how we can help.'
  };
  const validate = field => {
    const valid = field.checkValidity();
    field.setAttribute('aria-invalid', String(!valid));
    const error = qs(`[data-error-for="${field.id}"]`);
    if (error) error.textContent = valid ? '' : messages[field.id];
    return valid;
  };
  qsa('[required]', form).forEach(field => {
    field.addEventListener('blur', () => validate(field));
    field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validate(field); });
    field.addEventListener('change', () => { if (field.getAttribute('aria-invalid') === 'true') validate(field); });
  });
  form?.addEventListener('submit', event => {
    const fields = qsa('[required]', form);
    const valid = fields.map(validate).every(Boolean);
    if (!valid) {
      event.preventDefault();
      fields.find(field => !field.checkValidity())?.focus();
      return;
    }
    const submitButton = qs('button[type="submit"]', form);
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
    }
  });

  const reveals = qsa('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: .08 });
    reveals.forEach(item => observer.observe(item));
  } else {
    reveals.forEach(item => item.classList.add('is-visible'));
  }

  const year = qs('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

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
    qsa('.bf-product-cta-stack').forEach(stack => {
      const cta = qs('a[href*="/products/"]', stack);
      const list = qs('.bf-product-benefits--cta ul', stack);
      if (!cta || !list) return;
      const product = cta.href.includes('/daily-slim') ? 'daily' : 'menopause';
      const hooks = benefitHooks[product];
      const start = rotation[product] % hooks.length;
      const chosen = [0, 1, 2].map(offset => hooks[(start + offset) % hooks.length]);
      list.innerHTML = chosen.map(([label, icon]) => `<li><svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg><span>${label}</span></li>`).join('');
      rotation[product] += 1;
    });
  };

  document.addEventListener('DOMContentLoaded', () => window.setTimeout(refreshProductBenefits, 0), { once: true });
})();
