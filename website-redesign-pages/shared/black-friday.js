(() => {
  const scriptUrl = document.currentScript?.src || window.location.href;
  const campaignImage = new URL("black-friday-campaign.optimized.jpg", scriptUrl).href;
  const reviewVideo = (filename) => new URL(`../homepage/content-files/${filename}`, scriptUrl).href;
  const reviewPoster = (filename) => new URL(`../homepage/assets/${filename}`, scriptUrl).href;
  const storageKey = "shevelia-black-friday-dismissed";
  let lastFocused = null;

  const markup = `
    <div class="bf-modal" data-bf-modal hidden>
      <button class="bf-modal__scrim" type="button" aria-label="Close Black Friday promotion" data-bf-close></button>
      <section class="bf-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="bf-modal-title">
        <button class="bf-modal__close" type="button" aria-label="Close Black Friday promotion" data-bf-close>×</button>
        <div class="bf-modal__media">
          <img src="${campaignImage}" alt="Shevelia Menopause Balance and Daily Slim on a lavender campaign set">
        </div>
        <div class="bf-modal__content">
          <p class="bf-modal__eyebrow">BLACK FRIDAY · UP TO 75% OFF</p>
          <h2 id="bf-modal-title">Feel<br><span>like yourself again.</span></h2>
          <div class="bf-modal__benefits" aria-label="Product benefits">
            <section class="bf-product-benefits" aria-labelledby="daily-slim-benefits">
              <a class="bf-product-benefits__title" id="daily-slim-benefits" href="https://shevelia.co/products/daily-slim">Daily Slim <span aria-hidden="true">↗</span></a>
              <ul>
                <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4c0 2 1 3 4 3s4-1 4-3M8 7c-2 2-3 4-3 7 0 4 3 7 7 7s7-3 7-7c0-3-1-5-3-7M9 11c1 1 2 1 3 1s2 0 3-1"/></svg><span>A flatter belly, less bloat</span></li>
                <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c-2.8 3.4-5 5.8-5 8.5a5 5 0 0 0 10 0C17 8.8 14.8 6.4 12 3Z"/><path d="M10 13c.4 1.2 1.1 1.8 2.3 2"/></svg><span>Fewer sugar cravings</span></li>
                <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-8 12h6l-1 8 9-13h-6l1-7Z"/></svg><span>Lighter, less puffy, more energy</span></li>
                <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h8l2 18-6-4-6 4L8 3Z"/><path d="M8.5 8H12m3.5 0H12m0 0v9"/></svg><span>Clothes that fit like before</span></li>
              </ul>
            </section>
            <section class="bf-product-benefits" aria-labelledby="menopause-balance-benefits">
              <a class="bf-product-benefits__title" id="menopause-balance-benefits" href="https://shevelia.co/products/shevelia-menopause-balance">Menopause Balance <span aria-hidden="true">↗</span></a>
              <ul>
                <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 15.5A8 8 0 0 1 8.5 5 8 8 0 1 0 19 15.5Z"/><path d="m16 4 .6 1.4L18 6l-1.4.6L16 8l-.6-1.4L14 6l1.4-.6L16 4Z"/></svg><span>Calmer, more restful nights</span></li>
                <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/><path d="M9 12h6"/></svg><span>Feel like yourself again</span></li>
                <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a7 7 0 0 0-4 12.7c.7.5 1 1 1 1.8h6c0-.8.3-1.3 1-1.8A7 7 0 0 0 12 3Z"/><path d="M9 21h6m-5-3v3m4-3v3"/></svg><span>A clearer head</span></li>
                <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-8 12h6l-1 8 9-13h-6l1-7Z"/></svg><span>Energy that lasts the afternoon</span></li>
              </ul>
            </section>
          </div>
        </div>
      </section>
    </div>`;

  const reviewMarkup = `
    <section class="films site-reviews" id="films">
      <header class="films-head site-reviews__head"><div><p class="eyebrow">REAL CUSTOMER, REAL PHOTOS</p><h2>Forget the scale. Look at the jeans.</h2></div><p>Less evening bloat. Calmer nights. A clearer head. More energy left for the life you want.</p></header>
      <div class="film-grid site-reviews__grid">
        <figure class="film"><div class="film-frame"><video preload="none" loading="lazy" poster="${reviewPoster("brand-story-4.jpg")}" playsinline muted aria-label="A daily ritual"><source data-src="${reviewVideo("ritual-story.mp4")}" type="video/mp4"></video><button type="button" data-review-play><span aria-hidden="true">▶</span><b>Play</b></button></div><figcaption><span>01 / A daily ritual</span></figcaption></figure>
        <figure class="film"><div class="film-frame"><video preload="none" loading="lazy" poster="${reviewPoster("brand-story-3.jpg")}" playsinline muted aria-label="An evening reset"><source data-src="${reviewVideo("night-story-01.mp4")}" type="video/mp4"></video><button type="button" data-review-play><span aria-hidden="true">▶</span><b>Play</b></button></div><figcaption><span>02 / An evening reset</span></figcaption></figure>
        <figure class="film"><div class="film-frame"><video preload="none" loading="lazy" poster="${reviewPoster("ds-story-3.jpg")}" playsinline muted aria-label="Inside the formula"><source data-src="${reviewVideo("formula-story.mp4")}" type="video/mp4"></video><button type="button" data-review-play><span aria-hidden="true">▶</span><b>Play</b></button></div><figcaption><span>03 / Inside the formula</span></figcaption></figure>
      </div>
      <div class="film-actions site-reviews__actions"><a class="button button-midnight" href="https://shevelia.co/products/daily-slim">Explore Daily Slim</a><a class="button button-midnight-outline" href="https://shevelia.co/products/shevelia-menopause-balance">Explore Menopause Balance</a></div>
    </section>`;

  const initialize = () => {
    document.body.insertAdjacentHTML("beforeend", markup);
    if (!document.querySelector(".site-reviews")) {
      const footer = document.querySelector("footer.site-footer");
      if (footer) footer.insertAdjacentHTML("beforebegin", reviewMarkup);
    }
    const reviewVideos = [...document.querySelectorAll(".site-reviews .film-frame video")];
    document.querySelectorAll(".site-reviews [data-review-play]").forEach((button) => {
      const frame = button.closest(".film-frame");
      const video = frame?.querySelector("video");
      if (!video) return;
      button.addEventListener("click", async () => {
        reviewVideos.forEach((other) => { if (other !== video) other.pause(); });
        const source = video.querySelector("source[data-src]");
        if (source) {
          source.src = source.dataset.src;
          source.removeAttribute("data-src");
          video.preload = "auto";
          video.load();
        }
        video.controls = true;
        video.muted = false;
        try { await video.play(); frame.classList.add("is-playing"); }
        catch (_) { frame.classList.remove("is-playing"); }
      });
      video.addEventListener("ended", () => { video.controls = false; frame.classList.remove("is-playing"); });
    });
    document.querySelectorAll(".policy-page .footer-legal").forEach((legal) => {
      if (legal.querySelector(".payment-methods")) return;
      legal.insertAdjacentHTML("beforeend", '<div class="payment-methods" aria-label="Accepted payment methods"><span class="payment-badge payment-badge-visa" aria-label="Visa">VISA</span><span class="payment-badge payment-badge-mastercard" aria-label="Mastercard"><i></i><i></i></span><span class="payment-badge payment-badge-amex" aria-label="American Express">AMEX</span><span class="payment-badge payment-badge-apple" aria-label="Apple Pay">●Pay</span><span class="payment-badge payment-badge-google" aria-label="Google Pay">G Pay</span><span class="payment-badge payment-badge-shop" aria-label="Shop Pay">shop</span><span class="payment-badge payment-badge-discover" aria-label="Discover">DISCOVER</span></div>');
    });
    const modal = document.querySelector("[data-bf-modal]");
    const closeButton = modal.querySelector(".bf-modal__close");
    const openers = document.querySelectorAll("[data-bf-open]");

    const showModal = () => {
      lastFocused = document.activeElement;
      modal.hidden = false;
      document.body.classList.add("bf-modal-open");
      closeButton.focus();
    };

    const hideModal = () => {
      modal.hidden = true;
      document.body.classList.remove("bf-modal-open");
      try { sessionStorage.setItem(storageKey, "true"); } catch (_) {}
      if (lastFocused instanceof HTMLElement) lastFocused.focus();
    };

    openers.forEach((opener) => opener.addEventListener("click", showModal));
    modal.querySelectorAll("[data-bf-close]").forEach((closer) => closer.addEventListener("click", hideModal));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) hideModal();
      if (event.key !== "Tab" || modal.hidden) return;
      const focusable = [...modal.querySelectorAll("button, a[href]")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    let dismissed = false;
    try { dismissed = sessionStorage.getItem(storageKey) === "true"; } catch (_) {}
    if (!dismissed) {
      const scheduleModal = () => window.setTimeout(showModal, 650);
      if (document.documentElement.classList.contains("brand-intro-pending")) {
        window.addEventListener("shevelia:intro-complete", scheduleModal, { once: true });
      } else {
        scheduleModal();
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
