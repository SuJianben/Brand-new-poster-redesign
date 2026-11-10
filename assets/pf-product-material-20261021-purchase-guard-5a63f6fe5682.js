// Keep the server-rendered direct-canvas form safe without CSS or JavaScript.
export function mountPurchaseGuard(root, paper, config) {
  const fieldset = paper.querySelector('[data-pf-paper-purchase-guard]');
  const fallback = root.querySelector('[data-pf-canvas-fallback]');
  if (!fieldset || (config.routeMaterial === 'canvas' && !fallback)) throw new Error('Material purchase safety guard is incomplete');
  const original = { disabled: fieldset.disabled, hidden: fieldset.hidden, style: fieldset.getAttribute('style'),
    fallbackHidden: fallback?.hidden, fallbackStyle: fallback?.getAttribute('style') };
  const restoreStyle = (node, value) => value === null ? node.removeAttribute('style') : node.setAttribute('style', value);
  return {
    sync(selection) {
      const canvas = selection.material === 'canvas';
      fieldset.disabled = canvas; fieldset.hidden = canvas;
      fieldset.setAttribute('style', canvas ? 'display:none!important' : 'display:contents');
    },
    ready() { if (fallback) { fallback.hidden = true; fallback.setAttribute('style', 'display:none!important'); } },
    dispose() {
      fieldset.disabled = original.disabled; fieldset.hidden = original.hidden; restoreStyle(fieldset, original.style);
      if (fallback) { fallback.hidden = original.fallbackHidden; restoreStyle(fallback, original.fallbackStyle); }
    },
  };
}
