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

  const updateBlackFridayPopup = () => {
    const modalContent = qs('.bf-modal__content');
    const existingCta = qs('.bf-modal__cta', modalContent || document);
    if (!modalContent || !existingCta || qs('.bf-modal__actions', modalContent)) return false;
    const eyebrow = qs('.bf-modal__eyebrow', modalContent);
    const heading = qs('#bf-modal-title', modalContent);
    const description = qs('#bf-modal-description', modalContent);
    const note = qs('.bf-modal__note', modalContent);
    if (eyebrow) eyebrow.textContent = 'Black Friday support for your next step';
    if (heading) heading.innerHTML = 'Questions?<br>We can help.<br><span>Start here.</span>';
    if (description) description.textContent = 'Explore Daily Slim for lighter, steadier days or Menopause Balance for calmer nights and clearer mornings. Choose the support that fits you.';
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
})();
