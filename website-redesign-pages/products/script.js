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

  const intro = document.querySelector('.products-intro');
  if (intro) {
    intro.querySelector('.eyebrow').textContent = 'Choose what you need today';
    intro.querySelector('h1').textContent = 'How do you want to feel?';
    intro.querySelector('p:last-child').textContent = 'Choose lighter, steadier days or calmer nights and more balance through change.';
  }

  const daily = document.querySelector('.product-choice--daily .product-copy');
  const dailyImage = document.querySelector('.product-choice--daily .product-image img');
  if (dailyImage) dailyImage.src = 'assets/daily-slim.png';
  if (daily) {
    daily.querySelector('h2').textContent = 'Feel lighter and more in control of your day.';
    daily.querySelector('p:not(.eyebrow)').textContent = 'Support your digestion, metabolism, and daily rhythm so you can move through your day with more ease.';
    const items = daily.querySelectorAll('li');
    ['Feel supported through your day', 'See exactly what is in every dose', 'Build a simple routine that fits your life'].forEach((text, index) => { if (items[index]) items[index].textContent = text; });
    const cta = daily.querySelector('.button');
    if (cta) cta.innerHTML = 'Choose Daily Slim <span aria-hidden="true">↗</span>';
  }

  const balance = document.querySelector('.product-choice--balance .product-copy');
  if (balance) {
    balance.querySelector('h2').textContent = 'Find calmer nights and steadier days.';
    balance.querySelector('p:not(.eyebrow)').textContent = 'Support the changes you are feeling now, with a clear daily routine for sleep, mood, and balance.';
    const items = balance.querySelectorAll('li');
    ['Settle into calmer nights', 'Understand exactly what you are taking', 'Feel more like yourself again'].forEach((text, index) => { if (items[index]) items[index].textContent = text; });
    const cta = balance.querySelector('.button');
    if (cta) cta.innerHTML = 'Choose Menopause Balance <span aria-hidden="true">↗</span>';
  }
})();
