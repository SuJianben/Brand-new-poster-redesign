/* Keep the description control in sync after Shopify re-renders a section. */
(() => {
  'use strict';
  const observed = new WeakSet();
  const updateVisibility = (text) => {
    const button = text.closest('.dw-postery-inline-desc')?.querySelector('.dw-postery-inline-desc__more');
    if (!button || button.getAttribute('aria-expanded') === 'true') return;
    button.hidden = text.scrollHeight <= text.clientHeight + 1;
  };
  const observer = 'ResizeObserver' in window ? new ResizeObserver((entries) => {
    entries.forEach((entry) => updateVisibility(entry.target));
  }) : null;
  const init = (root = document) => {
    root.querySelectorAll('.dw-postery-inline-desc__text').forEach((text) => {
      if (observer && !observed.has(text)) { observer.observe(text); observed.add(text); }
      requestAnimationFrame(() => updateVisibility(text));
    });
  };
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.dw-postery-inline-desc__more');
    if (!button) return;
    const text = button.closest('.dw-postery-inline-desc')?.querySelector('.dw-postery-inline-desc__text');
    if (!text) return;
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    text.classList.toggle('is-clamped', !expanded);
    button.setAttribute('aria-expanded', String(expanded));
    button.textContent = expanded ? button.dataset.lessLabel : button.dataset.moreLabel;
    if (!expanded) updateVisibility(text);
  });
  document.addEventListener('shopify:section:load', (event) => init(event.target));
  document.addEventListener('shopify:block:select', (event) => {
    const details = event.target.querySelector?.('.dw-postery-meta-item');
    if (details) details.open = true;
    init(event.target);
  });
  if (!observer) window.addEventListener('resize', () => init(), { passive: true });
  document.fonts?.ready.then(() => init());
  init();
})();
