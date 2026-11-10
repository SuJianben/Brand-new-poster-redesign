const ALLOWED = new Set(['pf_product_material_select', 'pf_canvas_variant_select', 'pf_canvas_added_to_cart']);
export function track(view, name, config, selection, quantity) {
  try {
    const shopify = view.Shopify;
    if (!ALLOWED.has(name) || view.pfInternal || shopify?.customerPrivacy?.analyticsProcessingAllowed?.() !== true ||
        typeof shopify?.analytics?.publish !== 'function') return;
    const data = { material: selection.material, product_id: selection.material === 'canvas' ? config.canvasId : config.paperId,
      source_paper_id: config.paperId, country: config.country, currency: config.currency, source: 'product_material_options' };
    if (selection.material === 'canvas') Object.assign(data, { variant_id: selection.variant.id, finish: selection.variant.finish, size: selection.variant.size });
    if (Number.isInteger(quantity)) data.quantity = quantity;
    Promise.resolve(shopify.analytics.publish(name, data)).catch(() => {});
  } catch { /* Measurement must not block selection or cart. */ }
}
