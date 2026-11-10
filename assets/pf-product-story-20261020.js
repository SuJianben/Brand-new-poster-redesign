/* In-page viewing only. Never selects variants, writes a cart or sends network events. */
(() => {
  'use strict';
  const event = (root, name, detail = {}) => root.dispatchEvent(new CustomEvent(name, {
    bubbles: true, detail: { productId: root.dataset.productId, source: 'product-artwork-story', ...detail }
  }));
  function mount(root) {
    if (root.dataset.storyMounted) return;
    const dialog = root.querySelector('[data-story-dialog]');
    const image = root.querySelector('[data-story-dialog-image]');
    if (!dialog || !image) return;
    root.dataset.storyMounted = 'true';
    let opener = null;
    function close() { if (dialog.open) dialog.close(); }
    root.addEventListener('click', e => {
      const zoom = e.target.closest('[data-story-zoom]');
      if (zoom && root.contains(zoom)) {
        if (typeof dialog.showModal !== 'function') return;
        const source = zoom.querySelector('img');
        if (!source || !zoom.dataset.storyFullSrc) return;
        opener = zoom;
        image.src = zoom.dataset.storyFullSrc;
        image.alt = zoom.dataset.storyFullAlt || source.alt;
        image.width = Number(zoom.dataset.storyFullWidth) || source.naturalWidth;
        image.height = Number(zoom.dataset.storyFullHeight) || source.naturalHeight;
        root.querySelector('[data-story-dialog-caption]').textContent = zoom.dataset.storyCaption;
        if (!dialog.open) dialog.showModal();
        event(root, 'pdp_story_image_opened', { mediaRole: zoom.dataset.storyZoom });
      }
      if (e.target.closest('[data-story-close]')) close();
      if (e.target.closest('[data-story-return]')) {
        const owner = root.closest('[data-ps-product]') || document.querySelector('[data-ps-product]');
        if (owner && !owner.dispatchEvent(new CustomEvent('product:focus-current-purchase', { cancelable: true }))) {
          event(root, 'pdp_story_return_to_purchase', { material: owner.dataset.pfMaterialActive || null });
          return;
        }
        if (owner?.dataset.pfMaterialActive === 'canvas') return;
        const purchase = owner?.querySelector('.ps-purchase > .ps-form') ||
          document.querySelector('[data-ps-product] .ps-purchase, [data-canvas-product] form, .ps-purchase');
        const visible = node => {
          if (!node || node.matches(':disabled') || node.closest('[hidden],[inert],[aria-hidden="true"]')) return false;
          const style = window.getComputedStyle(node);
          return style.visibility !== 'hidden' && style.visibility !== 'collapse' && style.opacity !== '0' &&
            Array.from(node.getClientRects()).some(rect => rect.width > 0 && rect.height > 0);
        };
        if (!visible(purchase)) return;
        const focus = Array.from(purchase.querySelectorAll('input:not([type="hidden"]):not([disabled]),select:not([disabled]),button:not([disabled])')).find(visible);
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        purchase.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
        if (focus) focus.focus({ preventScroll: true });
        event(root, 'pdp_story_return_to_purchase');
      }
    });
    dialog.addEventListener('click', e => { if (e.target === dialog) close(); });
    dialog.addEventListener('close', () => { if (opener?.isConnected) opener.focus({ preventScroll: true }); });
  }
  function scan(scope) {
    if (scope.matches?.('[data-pf-product-story]')) mount(scope);
    scope.querySelectorAll('[data-pf-product-story]').forEach(mount);
  }
  scan(document);
  document.addEventListener('shopify:section:load', e => scan(e.target));
})();
