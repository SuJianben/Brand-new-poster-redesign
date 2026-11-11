/* The purchase presentation inserts the description before this deferred script runs. */
(() => {
  'use strict';
  const description = document.querySelector('[data-ps-product-context="default"] .dw-postery-inline-desc');
  const text = description?.querySelector('.dw-postery-inline-desc__text');
  const button = description?.querySelector('.dw-postery-inline-desc__more');
  if (!text || !button) return;

  const updateVisibility = () => {
    if (button.getAttribute('aria-expanded') === 'true') return;
    button.hidden = text.scrollHeight <= text.clientHeight + 1;
  };
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    text.classList.toggle('is-clamped', !expanded);
    button.setAttribute('aria-expanded', String(expanded));
    button.textContent = expanded ? 'Show less' : 'Read more';
    if (!expanded) updateVisibility();
  });
  if ('ResizeObserver' in window) new ResizeObserver(updateVisibility).observe(text);
  else window.addEventListener('resize', updateVisibility, { passive: true });
  document.fonts?.ready.then(updateVisibility);
  requestAnimationFrame(updateVisibility);
})();
