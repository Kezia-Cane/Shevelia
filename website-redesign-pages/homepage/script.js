(() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  const header = qs('[data-header]');
  if (header) {
    let ticking = false;
    const updateHeader = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 28);
      ticking = false;
    };
    updateHeader();
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  const menuButton = qs('[data-menu-toggle]');
  const menu = qs('[data-menu]');
  if (menuButton && menu) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    };
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
    });
    qsa('a', menu).forEach(link => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => { if (window.innerWidth > 820) closeMenu(); });
  }

  qsa('[data-accordion] .faq-item button').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const answer = qs('.faq-answer', item);
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      answer.hidden = open;
    });
  });

  const productPath = qs('#product-path');
  qsa('[data-scroll-to-products]').forEach(button => {
    button.addEventListener('click', () => productPath?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  });

  qsa('[data-link-pending]').forEach(button => {
    const destination = /menopause/i.test(button.textContent)
      ? 'https://shevelia.co/products/shevelia-menopause-balance'
      : 'https://shevelia.co/products/daily-slim';
    button.removeAttribute('aria-describedby');
    button.addEventListener('click', () => { window.location.href = destination; });
  });

  const ingredientDialog = qs('[data-ingredient-dialog]');
  if (ingredientDialog) {
    qsa('[data-ingredient-open]').forEach(button => {
      button.addEventListener('click', () => {
        if (typeof ingredientDialog.showModal === 'function') ingredientDialog.showModal();
        else ingredientDialog.setAttribute('open', '');
      });
    });
    qsa('[data-ingredient-close]', ingredientDialog).forEach(button => {
      button.addEventListener('click', () => ingredientDialog.close());
    });
    ingredientDialog.addEventListener('click', event => {
      if (event.target === ingredientDialog) ingredientDialog.close();
    });
  }

  qsa('[data-carousel-controls]').forEach(controls => {
    const rail = document.getElementById(controls.dataset.carouselTarget);
    if (!rail) return;

    const items = [...rail.children];
    const dots = qsa('[data-carousel-dot]', controls);
    const previous = qs('[data-carousel-prev]', controls);
    const next = qs('[data-carousel-next]', controls);
    let activeIndex = 0;
    let scrollFrame;

    const itemLeft = item => item.offsetLeft - rail.offsetLeft;
    const setActive = index => {
      activeIndex = Math.max(0, Math.min(index, items.length - 1));
      dots.forEach((dot, dotIndex) => {
        if (dotIndex === activeIndex) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      if (previous) previous.disabled = activeIndex === 0;
      if (next) next.disabled = activeIndex === items.length - 1;
    };
    const goTo = index => {
      const targetIndex = Math.max(0, Math.min(index, items.length - 1));
      rail.scrollTo({ left: itemLeft(items[targetIndex]), behavior: 'smooth' });
      setActive(targetIndex);
    };

    previous?.addEventListener('click', () => goTo(activeIndex - 1));
    next?.addEventListener('click', () => goTo(activeIndex + 1));
    dots.forEach((dot, index) => dot.addEventListener('click', () => goTo(index)));
    rail.addEventListener('scroll', () => {
      window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(() => {
        const nearest = items.reduce((best, item, index) => {
          const distance = Math.abs(itemLeft(item) - rail.scrollLeft);
          return distance < best.distance ? { index, distance } : best;
        }, { index: 0, distance: Infinity });
        setActive(nearest.index);
      });
    }, { passive: true });

    setActive(0);
  });

  const homepageBenefits = {
    daily: [
      { label: 'A flatter belly, less bloat', icon: '<path d="M8 4c0 2 1 3 4 3s4-1 4-3M8 7c-2 2-3 4-3 7 0 4 3 7 7 7s7-3 7-7c0-3-1-5-3-7M9 11c1 1 2 1 3 1s2 0 3-1"/>' },
      { label: 'Fewer sugar cravings', icon: '<path d="M12 3c-2.8 3.4-5 5.8-5 8.5a5 5 0 0 0 10 0C17 8.8 14.8 6.4 12 3Z"/><path d="M10 13c.4 1.2 1.1 1.8 2.3 2"/>' },
      { label: 'Lighter, less puffy, more energy', icon: '<path d="m13 2-8 12h6l-1 8 9-13h-6l1-7Z"/>' },
      { label: 'Clothes that fit like before', icon: '<path d="m8 4-5 3 2 4 3-1v10h8V10l3 1 2-4-5-3c-.7 1.3-2 2-4 2S8.7 5.3 8 4Z"/>' }
    ],
    menopause: [
      { label: 'Calmer, more restful nights', icon: '<path d="M19 15.5A8 8 0 0 1 8.5 5 8 8 0 1 0 19 15.5Z"/><path d="m16 4 .6 1.4L18 6l-1.4.6L16 8l-.6-1.4L14 6l1.4-.6L16 4Z"/>' },
      { label: 'Feel like yourself again', icon: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/><path d="M9 12h6"/>' },
      { label: 'A clearer head', icon: '<path d="M12 3a7 7 0 0 0-4 12.7c.7.5 1 1 1 1.8h6c0-.8.3-1.3 1-1.8A7 7 0 0 0 12 3Z"/><path d="M9 21h6m-5-3v3m4-3v3"/>' },
      { label: 'Energy that lasts the afternoon', icon: '<path d="m13 2-8 12h6l-1 8 9-13h-6l1-7Z"/>' }
    ]
  };
  const benefitRotation = { daily: 0, menopause: 0 };
  const applyHomepageBenefits = () => {
    qsa('.bf-product-cta-stack:not([data-home-benefits])').forEach(stack => {
      const cta = qs('a[href*="/products/"]', stack);
      const list = qs('.bf-product-benefits--cta ul', stack);
      if (!cta || !list) return;
      const product = cta.href.includes('daily-slim') ? 'daily' : 'menopause';
      const benefits = homepageBenefits[product];
      const start = benefitRotation[product] % benefits.length;
      const selection = [0, 1, 2].map(offset => benefits[(start + offset) % benefits.length]);
      list.innerHTML = selection.map(benefit => `<li><svg viewBox="0 0 24 24" aria-hidden="true">${benefit.icon}</svg><span>${benefit.label}</span></li>`).join('');
      stack.dataset.homeBenefits = String(start + 1);
      benefitRotation[product] += 1;
    });
  };
  const benefitObserver = new MutationObserver(applyHomepageBenefits);
  benefitObserver.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('DOMContentLoaded', applyHomepageBenefits, { once: true });
  applyHomepageBenefits();

  const revealItems = qsa('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  const year = qs('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();


