/** The canvas bar delegates to its own native form; it owns no cart request. */
export function mountMobile(root, host, form, primary, signal) {
  const view = root.ownerDocument.defaultView;
  const bar = host.querySelector('[data-pf-canvas-sticky]');
  const action = bar?.querySelector('[data-pf-canvas-sticky-add]');
  const amount = bar?.querySelector('[data-pf-canvas-sticky-price]');
  const edit = bar?.querySelector('[data-pf-canvas-sticky-edit]');
  if (!bar || !action || !amount || !edit) throw new Error('Canvas mobile purchase is unavailable');
  const media = view.matchMedia('(max-width: 767px)');
  let active = false, inView = true, variant, busy = false;
  const sync = () => {
    const overlay = root.ownerDocument.documentElement.classList.contains('is-cart-drawer-open') ||
      root.ownerDocument.documentElement.classList.contains('is-mobile-menu-open');
    bar.hidden = !active || !media.matches || inView || overlay || !observer;
    action.disabled = busy || !variant?.available;
    if (variant) { amount.textContent = variant.money; edit.textContent = variant.size + ' · Edit'; }
  };
  let observer = null;
  observer = typeof view.IntersectionObserver === 'function' ? new view.IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting; sync();
  }, { rootMargin: '-100px 0px -90px 0px', threshold: 0 }) : null;
  observer?.observe(primary);
  const overlays = typeof view.MutationObserver === 'function' ? new view.MutationObserver(sync) : null;
  overlays?.observe(root.ownerDocument.documentElement, { attributes: true, attributeFilter: ['class'] });
  media.addEventListener('change', sync, { signal });
  action.addEventListener('click', () => {
    if (!active || action.disabled || !form.reportValidity()) return;
    primary.click();
  }, { signal });
  edit.addEventListener('click', () => {
    const select = form.querySelector('[data-pf-canvas-size]');
    select?.scrollIntoView({ block: 'center', behavior: 'auto' }); select?.focus({ preventScroll: true });
  }, { signal });
  return { sync(selection, pending) { active = selection.material === 'canvas'; variant = selection.variant; busy = pending; sync(); },
    dispose() { observer?.disconnect(); overlays?.disconnect(); bar.hidden = true; } };
}
