(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reducedMotion) root.classList.add('brand-intro-pending');

  const announceComplete = () => {
    window.dispatchEvent(new CustomEvent('shevelia:intro-complete'));
  };

  const initialize = () => {
    const intro = document.querySelector('[data-brand-intro]');

    if (!intro || reducedMotion) {
      root.classList.remove('brand-intro-pending', 'brand-intro-ready', 'brand-intro-exiting');
      root.classList.add('brand-intro-complete');
      intro?.remove();
      announceComplete();
      return;
    }

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      root.classList.remove('brand-intro-pending', 'brand-intro-ready', 'brand-intro-exiting');
      root.classList.add('brand-intro-complete');
      intro.remove();
      announceComplete();
    };

    const exit = () => {
      root.classList.add('brand-intro-exiting');
      intro.addEventListener('animationend', event => {
        if (event.target === intro && event.animationName === 'brand-curtain-up') finish();
      });
    };

    window.requestAnimationFrame(() => {
      root.classList.add('brand-intro-ready');
      window.setTimeout(exit, 760);
    });

    window.setTimeout(finish, 2600);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
