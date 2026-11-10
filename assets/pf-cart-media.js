/* Read-only cart media. Purchase state stays in the existing cart controllers. */
(() => {
  'use strict';
  const requests = new WeakMap();
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const safeUrl = value => {
    if (typeof value !== 'string' || !/^(https:\/\/|\/\/)/.test(value.trim())) return '';
    try { return new URL(value, location.origin).protocol === 'https:' ? value.trim() : ''; } catch { return ''; }
  };
  const signature = items => {
    if (!Array.isArray(items)) return null;
    const keys = new Set();
    const rows = [];
    for (const item of items) {
      if (typeof item?.key !== 'string' || !item.key || keys.has(item.key) || !Number.isSafeInteger(item.quantity) || item.quantity < 1) return null;
      keys.add(item.key); rows.push([item.key, item.quantity]);
    }
    return JSON.stringify(rows.sort((a, b) => a[0].localeCompare(b[0])));
  };
  const initial = item => {
    const custom = safeUrl(item.properties?.['Custom artwork']);
    const original = safeUrl(typeof item.image === 'string' ? item.image : item.featured_image?.url);
    const oldHanger = /round-rods|hanging[ -]?rods|hanger|display-options/i.test(original + ' ' + (item.featured_image?.alt || ''));
    const source = custom || (!oldHanger ? original : '');
    return `<span class="cd-drawer__image" data-pf-cart-media-slot="${escape(item.key)}" data-pf-cart-media-quantity="${escape(item.quantity)}"><span class="pf-cart-media" data-pf-cart-media data-pf-cart-media-kind="${custom ? 'custom' : 'original'}" data-pf-cart-frame="none">${source ? `<img class="pf-cart-media__image" src="${escape(source)}" alt="${escape(item.product_title)}" loading="lazy" decoding="async">` : ''}</span></span>`;
  };
  const parse = (html, cart) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const roots = doc.querySelectorAll('[data-pf-cart-media-response]');
    if (roots.length !== 1 || roots[0].dataset.pfCartCurrency !== cart.currency) return null;
    const root = roots[0], state = root.querySelectorAll('[data-pf-cart-media-state]');
    if (state.length !== 1 || signature(JSON.parse(state[0].textContent)) !== signature(cart.items)) return null;
    const visible = cart.items.filter(item => !item.properties?._framing_component);
    const templates = root.querySelectorAll('template[data-pf-cart-media-line]');
    if (templates.length !== visible.length) return null;
    const media = new Map();
    for (const template of templates) {
      const item = visible.find(row => row.key === template.dataset.pfCartMediaLine);
      if (!item || media.has(item.key) || Number(template.dataset.pfCartMediaQuantity) !== item.quantity) return null;
      const fragment = template.content;
      if (fragment.children.length !== 1) return null;
      const node = fragment.firstElementChild;
      if (!node.matches('span.pf-cart-media[data-pf-cart-media]')) return null;
      if (!['none', 'black'].includes(node.dataset.pfCartFrame) || !['original', 'custom', 'verified-artwork'].includes(node.dataset.pfCartMediaKind)) return null;
      if (node.children.length > 1 || [...node.querySelectorAll('*')].some(child => child.tagName !== 'IMG')) return null;
      for (const child of [node, ...node.querySelectorAll('*')]) {
        if ([...child.attributes].some(attribute => !['class','src','alt','loading','decoding','data-pf-cart-media','data-pf-cart-media-kind','data-pf-cart-frame'].includes(attribute.name))) return null;
      }
      const img = node.querySelector('img');
      if (img && !safeUrl(img.getAttribute('src'))) return null;
      // A saved customer preview must never be replaced by the catalogue demo.
      const custom = safeUrl(item.properties?.['Custom artwork']);
      if (custom && (!img || img.getAttribute('src') !== custom || node.dataset.pfCartMediaKind !== 'custom')) return null;
      media.set(item.key, node);
    }
    return media;
  };
  const hydrate = async (host, cart) => {
    const previous = requests.get(host);
    previous?.controller.abort();
    const request = { controller: new AbortController() };
    requests.set(host, request);
    const expected = signature(cart?.items);
    if (expected === null || !cart.items.length) return false;
    try {
      const url = new URL(window.PFMarketCommerce.path('cart'), location.origin);
      if (url.origin !== location.origin) return false;
      url.searchParams.set('section_id', 'pf-cart-media');
      const response = await fetch(url.href, { method:'GET', credentials:'same-origin', cache:'no-store', headers:{ Accept:'text/html' }, signal:request.controller.signal });
      if (!response.ok || (response.url && new URL(response.url).origin !== location.origin)) return false;
      const media = parse(await response.text(), cart);
      if (!media || requests.get(host) !== request || !host.isConnected) return false;
      const slots = [...host.querySelectorAll('[data-pf-cart-media-slot]')];
      const slotKeys = new Set(slots.map(slot => slot.dataset.pfCartMediaSlot));
      if (slots.length !== media.size || slotKeys.size !== media.size || [...media.keys()].some(key => !slotKeys.has(key))
        || slots.some(slot => !media.has(slot.dataset.pfCartMediaSlot)
        || Number(slot.dataset.pfCartMediaQuantity) !== cart.items.find(item => item.key === slot.dataset.pfCartMediaSlot)?.quantity)) return false;
      for (const slot of slots) slot.replaceChildren(document.importNode(media.get(slot.dataset.pfCartMediaSlot), true));
      return true;
    } catch { return false; }
  };
  window.PFCartMedia = Object.freeze({ initial, hydrate });
})();
