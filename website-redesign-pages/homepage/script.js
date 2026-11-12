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
  qs('[data-demo-form]')?.addEventListener('submit', event => {
    event.preventDefault();
    const button = qs('button', event.currentTarget);
    button.textContent = '✓';
    window.setTimeout(() => { button.textContent = '→'; }, 1600);
  });

  const panel = qs('[data-review-panel]');
  const scrim = qs('[data-review-scrim]');
  const select = qs('[data-review-select]');
  const noteField = qs('#review-note');
  const list = qs('[data-review-list]');
  const status = qs('[data-review-status]');
  const storageKey = 'shevelia-homepage-review-v3';
  let notes = [];

  try { notes = JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch (_) { notes = []; }

  qsa('[data-review-section]').forEach(section => {
    if (!select) return;
    const option = document.createElement('option');
    option.value = section.dataset.reviewSection;
    option.textContent = section.dataset.reviewSection;
    select.appendChild(option);
  });

  const openPanel = () => {
    if (!panel || !scrim || !select) return;
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    scrim.classList.add('is-open');
    document.body.classList.add('panel-open');
    window.setTimeout(() => select.focus(), 100);
  };
  const closePanel = () => {
    if (!panel || !scrim) return;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    scrim.classList.remove('is-open');
    document.body.classList.remove('panel-open');
  };

  const save = () => localStorage.setItem(storageKey, JSON.stringify(notes));
  const renderNotes = () => {
    if (!list) return;
    list.innerHTML = '';
    if (!notes.length) {
      list.innerHTML = '<p class="empty-notes">No notes added yet.</p>';
      return;
    }
    notes.forEach((note, index) => {
      const item = document.createElement('article');
      item.className = 'review-note';
      const heading = document.createElement('strong');
      heading.textContent = note.section;
      const copy = document.createElement('p');
      copy.textContent = note.text;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.setAttribute('aria-label', `Remove note for ${note.section}`);
      remove.textContent = '×';
      remove.addEventListener('click', () => {
        notes.splice(index, 1); save(); renderNotes();
      });
      item.append(heading, copy, remove);
      list.appendChild(item);
    });
  };

  qs('[data-review-open]')?.addEventListener('click', openPanel);
  qs('[data-review-close]')?.addEventListener('click', closePanel);
  scrim?.addEventListener('click', closePanel);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closePanel(); });

  qs('[data-review-add]')?.addEventListener('click', () => {
    const text = noteField.value.trim();
    if (!text) { status.textContent = 'Please write a requested change first.'; noteField.focus(); return; }
    notes.push({ section: select.value, text });
    save(); renderNotes(); noteField.value = '';
    status.textContent = 'Note added and saved in this browser.';
  });

  qs('[data-review-copy]')?.addEventListener('click', async () => {
    if (!notes.length) { status.textContent = 'Add at least one note before copying.'; return; }
    const text = ['SHEVELIA HOMEPAGE — DESIGN NOTES', '', ...notes.map((note, i) => `${i + 1}. ${note.section}\n${note.text}`)].join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = 'All review notes copied.';
    } catch (_) {
      status.textContent = 'Copy was blocked by the browser. Select each note manually.';
    }
  });

  qs('[data-review-clear]')?.addEventListener('click', () => {
    if (!notes.length || window.confirm('Clear all saved review notes?')) {
      notes = []; save(); renderNotes(); status.textContent = 'Review notes cleared.';
    }
  });

  renderNotes();
})();
