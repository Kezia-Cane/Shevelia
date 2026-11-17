(() => {
  const scriptUrl = document.currentScript?.src || window.location.href;
  const campaignImage = new URL("black-friday-campaign.png", scriptUrl).href;
  const storageKey = "shevelia-black-friday-dismissed";
  let lastFocused = null;

  const markup = `
    <div class="bf-modal" data-bf-modal hidden>
      <button class="bf-modal__scrim" type="button" aria-label="Close Black Friday event" data-bf-close></button>
      <section class="bf-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="bf-modal-title" aria-describedby="bf-modal-description">
        <button class="bf-modal__close" type="button" aria-label="Close Black Friday event" data-bf-close>×</button>
        <div class="bf-modal__media">
          <img src="${campaignImage}" alt="Shevelia Menopause Balance and Daily Slim on a lavender campaign set">
        </div>
        <div class="bf-modal__content">
          <p class="bf-modal__eyebrow">Black Friday · Find your formula</p>
          <h2 id="bf-modal-title">Support for<br><span>the way you feel.</span></h2>
          <p class="bf-modal__body" id="bf-modal-description">Choose Daily Slim for digestive comfort, appetite, and metabolic support, or Menopause Balance for sleep, mood, and daily balance.</p>
          <div class="bf-modal__actions"><a class="bf-modal__cta" href="https://shevelia.co/products/daily-slim">Explore Daily Slim <span aria-hidden="true">→</span></a><a class="bf-modal__cta" href="https://shevelia.co/products/shevelia-menopause-balance">Explore Menopause Balance <span aria-hidden="true">→</span></a></div>
          <p class="bf-modal__note">Choose the support that fits your routine.</p>
        </div>
      </section>
    </div>`;

  const initialize = () => {
    document.body.insertAdjacentHTML("beforeend", markup);
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
