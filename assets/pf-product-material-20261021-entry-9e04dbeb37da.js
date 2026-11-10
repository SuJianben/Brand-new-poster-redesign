import { mountMaterialOptions } from './pf-product-material-20261021-controller-8e0624c6bdb2.js';
const key = Symbol.for('pf.product-material-options.20261021');
if (!window[key]) {
  const mounted = new WeakMap();
  const find = scope => [...(scope.matches?.('[data-pf-material-options]') ? [scope] : []), ...scope.querySelectorAll('[data-pf-material-options]')];
  const start = scope => find(scope).forEach(host => {
    if (mounted.has(host)) return;
    try { mounted.set(host, mountMaterialOptions(host)); }
    catch { host.hidden = true; /* Preserve the server's paper guard and real canvas fallback. */ }
  });
  window[key] = true;
  document.addEventListener('shopify:section:load', event => start(event.target));
  document.addEventListener('shopify:section:unload', event => find(event.target).forEach(host => {
    mounted.get(host)?.dispose(); mounted.delete(host);
  }));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => start(document), { once: true });
  else start(document);
}
