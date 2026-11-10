/* Market presentation only. Shopify remains authoritative for prices and tax. */
(() => {
  'use strict';
  const root = () => {
    const marketRoot = window.PFMarket?.root;
    if (typeof marketRoot === 'string' && /^\/(?:[a-z0-9-]+\/)*$/i.test(marketRoot)) return marketRoot;
    return window.Shopify?.routes?.root || '/';
  };
  const path = (relative) => {
    if (!/^(cart(?:\/(?:add|change|update|clear))?(?:\.js)?|checkout|collections\/all)$/.test(relative)) {
      throw new Error('Unsupported commerce route');
    }
    return root() + relative;
  };
  const summary = (cart) => {
    if (window.PFMarket?.country !== 'US') {
      const validGbp = cart?.currency === 'GBP' && Number.isSafeInteger(cart.total_price) && cart.total_price >= 0;
      return { label: 'UK delivery', charge: validGbp ? 'Free' : 'Calculated at checkout', note: 'Prices include VAT. Free UK delivery on every order. Made to order · Dispatched within 2 business days · Delivered in 5–7 days · No duties to pay on delivery.' };
    }
    const validUsd = cart?.currency === 'USD' && Number.isSafeInteger(cart.total_price) && cart.total_price >= 0;
    return {
      label: 'Contiguous US shipping',
      charge: validUsd ? (cart.total_price >= 4900 ? 'Free' : '$5.95') : 'Calculated at checkout',
      note: '48 contiguous states and Washington DC only. Free standard shipping on orders of $49 or more after discounts, before tax. Dispatched within 2 business days. Transit: 5–7 business days. No additional import duties or customs fees on delivery. Any applicable sales tax is calculated at checkout.'
    };
  };
  window.PFMarketCommerce = Object.freeze({ path, summary });
  document.addEventListener('submit', (event) => {
    const form = event.target.closest?.('.pf-market-selector__form');
    if (!form) return;
    const destination = form.querySelector('[name="country_code"]')?.value;
    if (!['GB', 'US'].includes(destination)) return;
    window.dataLayer?.push({ event: 'market_selection_submitted', country_from: window.PFMarket?.country, country_to: destination });
  });
})();
