(() => {
  'use strict';
  const start = () => {
    const root = document.querySelector('[data-odd-cart]');
    const groups = window.PFCartLineGroups;
    const market = window.PFMarketCommerce;
    if (!root || !groups || !market) return;
    const content = root.querySelector('[data-odd-cart-content]');
    const notice = root.querySelector('[data-odd-cart-notice]');
    const escape = (value = '') => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    let current = null;
    let busy = false;
    const money = cents => new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: current?.currency || window.Shopify?.currency?.active || 'USD' }).format(cents / 100);
    const getCart = async () => { const response = await fetch(market.path('cart.js'), { headers: { Accept: 'application/json' } }); if (!response.ok) throw new Error('Could not load cart'); return response.json(); };
    const components = children => children.map(item => {
      const kind = item.properties?._framing_component === 'passepartout' ? 'Passepartout' : item.properties?._framing_component === 'canvas' ? 'Canvas' : 'Frame';
      return `<p class="odd-cart__component"><span>${escape(kind)} · ${escape(item.properties?._framing_style || item.product_title)} · ${escape(item.properties?._framing_size || item.variant_title)}</span><strong>${money(item.final_line_price)}</strong></p>`;
    }).join('');
    const render = cart => {
      current = cart;
      const items = groups.visibleItems(cart);
      const count = items.reduce((sum, item) => sum + item.quantity, 0);
      document.querySelectorAll('.cart-count').forEach(badge => { badge.textContent = count; badge.hidden = count === 0; });
      if (!items.length) {
        content.innerHTML = `<div class="odd-cart__empty"><h2>Your bag is empty.</h2><a href="${market.path('collections/all')}">EXPLORE PRINTS <span aria-hidden="true">→</span></a></div>`;
        return;
      }
      const lines = items.map(item => {
        const children = groups.allocatedChildren(cart, item);
        const price = children.reduce((sum, child) => sum + child.final_line_price, item.final_line_price);
        const variant = item.variant_title && item.variant_title !== 'Default Title' ? `<p class="odd-cart__variant">${escape(item.variant_title)}</p>` : '';
        const properties = Object.entries(item.properties || {}).filter(([key, value]) => value && !key.startsWith('_') && !['Custom artwork', 'Passepartout', 'Frame', 'Format'].includes(key)).map(([key, value]) => `<p class="odd-cart__variant">${escape(key)}: ${escape(value)}</p>`).join('');
        return `<article class="odd-cart__item" data-cart-line="${escape(item.key)}">${window.PFCartMedia?.initial(item) || ''}<div class="odd-cart__item-copy"><a class="odd-cart__title" href="${escape(item.url)}">${escape(item.product_title)}</a>${variant}${properties}${components(children)}<div class="odd-cart__item-actions"><div class="odd-cart__quantity"><button type="button" data-odd-quantity="-1" aria-label="Decrease quantity of ${escape(item.product_title)}">−</button><output>${item.quantity}</output><button type="button" data-odd-quantity="1" aria-label="Increase quantity of ${escape(item.product_title)}">+</button></div><button class="odd-cart__remove" type="button" data-odd-remove>Remove</button></div></div><strong class="odd-cart__price">${money(price)}</strong></article>`;
      }).join('');
      content.innerHTML = `<div class="odd-cart__items"><div class="odd-cart__items-heading"><span>YOUR PRINTS</span><span>${count} ${count === 1 ? 'ITEM' : 'ITEMS'}</span></div>${lines}</div><aside class="odd-cart__summary"><h2>Order summary<span>.</span></h2><div class="odd-cart__total"><span>Subtotal</span><strong>${money(cart.total_price)}</strong></div>${cart.total_discount > 0 ? `<p class="odd-cart__saving">You save ${money(cart.total_discount)}</p>` : ''}<p class="odd-cart__note">${escape(market.summary(cart).note)}</p><form action="${market.path('cart')}" method="post"><button type="submit" name="checkout">CHECKOUT <span aria-hidden="true">→</span></button></form><a class="odd-cart__continue" href="${market.path('collections/all')}">← &nbsp;CONTINUE SHOPPING</a></aside>`;
      window.PFCartMedia?.hydrate(content, cart);
    };
    const update = async (key, quantity) => {
      if (busy) return;
      busy = true; root.classList.add('is-busy'); notice.textContent = '';
      try {
        const cart = await getCart();
        const updateGroup = groups.groupUpdate(cart, key, quantity);
        const response = await fetch(market.path('cart/update.js'), { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ updates: updateGroup.updates }) });
        if (!response.ok) throw new Error('Could not update cart');
        const updated = await response.json();
        render(updated);
        window.dataLayer?.push({ event: 'cart_framing_quantity_changed', ...updateGroup.metadata });
        document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart: updated, source: 'cart-page' } }));
      } catch (error) {
        console.error(error);
        try { render(await getCart()); notice.textContent = 'We couldn’t update this item. Your latest cart is shown; please try again.'; }
        catch { notice.textContent = 'We couldn’t confirm your cart. Please refresh the page before changing quantities.'; }
      } finally { busy = false; root.classList.remove('is-busy'); }
    };
    root.addEventListener('click', event => {
      const line = event.target.closest('[data-cart-line]');
      if (!line) return;
      if (event.target.closest('[data-odd-remove]')) { update(line.dataset.cartLine, 0); return; }
      const control = event.target.closest('[data-odd-quantity]');
      if (control) update(line.dataset.cartLine, Math.max(0, Number(line.querySelector('output').textContent) + Number(control.dataset.oddQuantity)));
    });
    document.addEventListener('cart:updated', event => { if (event.detail?.cart && event.detail.source !== 'cart-page') render(event.detail.cart); });
    getCart().then(render).catch(() => { notice.textContent = 'We couldn’t load your bag. Please refresh the page.'; });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
