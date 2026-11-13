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
    button.setAttribute('aria-describedby', 'pending-link-note');
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
    actions.innerHTML = '<button class="bf-modal__cta" type="button" data-link-pending aria-describedby="pending-link-note">Explore Daily Slim <span aria-hidden="true">→</span></button><button class="bf-modal__cta" type="button" data-link-pending aria-describedby="pending-link-note">Explore Menopause Balance <span aria-hidden="true">→</span></button>';
    existingCta.replaceWith(actions);
    return true;
  };

  const popupObserver = new MutationObserver(() => {
    if (updateBlackFridayPopup()) popupObserver.disconnect();
  });
  popupObserver.observe(document.body, { childList: true });
  updateBlackFridayPopup();

  const filmVideos = qsa('.film-frame video');
  filmVideos.forEach(video => {
    const setVideoPreview = () => {
      if (video.dataset.previewReady || !Number.isFinite(video.duration)) return;
      window.setTimeout(() => {
        video.currentTime = Math.min(.5, video.duration * .08);
        video.pause();
        video.dataset.previewReady = 'true';
      }, 120);
    };
    if (video.readyState >= 2) setVideoPreview();
    else video.addEventListener('loadeddata', setVideoPreview, { once: true });
  });
  qsa('[data-play]').forEach(button => {
    const frame = button.closest('.film-frame');
    const video = qs('video', frame);
    if (!video) return;
    button.addEventListener('click', async () => {
      filmVideos.forEach(other => {
        if (other !== video) other.pause();
      });
      video.controls = true;
      video.muted = false;
      try {
        await video.play();
        frame.classList.add('is-playing');
      } catch (_) {
        frame.classList.remove('is-playing');
      }
    });
    video.addEventListener('ended', () => {
      video.controls = false;
      frame.classList.remove('is-playing');
    });
  });

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
