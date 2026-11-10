export function readSelection(config, href) {
  const url = new URL(href);
  const material = ['paper', 'canvas'].includes(url.searchParams.get('material')) ? url.searchParams.get('material') : config.routeMaterial;
  const wanted = url.searchParams.get('canvas_variant') || (config.routeMaterial === 'canvas' ? url.searchParams.get('variant') : '');
  const variant = config.variants.find(item => item.id === wanted) || config.variants.find(item => item.available);
  return { material, variant };
}

export function selectionUrl(href, selection) {
  const url = new URL(href);
  url.searchParams.set('material', selection.material);
  url.searchParams.set('canvas_variant', selection.variant.id);
  return url.pathname + url.search + url.hash;
}
