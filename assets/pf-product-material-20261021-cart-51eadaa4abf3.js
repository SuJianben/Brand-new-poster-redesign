import { quantityValue } from './pf-product-material-20261021-policy-b8ae9ba90037.js';

/** Exactly one canvas variant. Never pass paper framing configuration to cart. */
export async function addCanvas(config, variant, quantityInput, fetcher) {
  const quantity = quantityValue(quantityInput);
  if (!config.variants.includes(variant) || !variant.available) throw new Error('This option is currently unavailable.');
  let response;
  try {
    response = await fetcher(config.root + 'cart/add.js', {
      method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: variant.id, quantity }] }),
    });
  } catch {
    const error = new Error('Cart update outcome is unknown.'); error.uncertain = true; throw error;
  }
  if (!response.ok) {
    // Only an explicit Shopify business rejection is safe to retry. Gateways,
    // rate limits and timeouts can lose the receipt after the write succeeded.
    if (response.status === 422) {
      let rejected;
      try { rejected = await response.json(); } catch { /* Unknown receipt. */ }
      if (rejected?.status === 422 && typeof rejected.description === 'string' && rejected.description) {
        throw new Error('This item could not be added. Please check availability and try again.');
      }
    }
    const error = new Error('Cart update outcome is unknown.'); error.uncertain = true; throw error;
  }
  // A successful add must never be retried just because the secondary cart read fails.
  let cart = null;
  try {
    const refreshed = await fetcher(config.root + 'cart.js', { headers: { Accept: 'application/json' } });
    if (refreshed.ok) cart = await refreshed.json();
  } catch { /* The view-cart link is the recovery path after a successful add. */ }
  return { added: true, quantity, cart };
}
