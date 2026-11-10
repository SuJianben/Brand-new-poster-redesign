export const FINISHES = Object.freeze({
  'Canvas only': { label: 'Canvas only', note: 'Unstretched canvas, rolled in a tube. No inner or outer frame.' },
  Stretched: { label: 'Stretched canvas', note: 'Stretched over an inner wooden frame, without an outer frame. Arrives assembled.' },
  Black: { label: 'Black floater frame', note: 'Stretched canvas fitted in a black floater frame. Arrives fully assembled.' },
});
const id = value => typeof value === 'string' && /^[1-9][0-9]{1,18}$/.test(value);
const hash = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const label = value => typeof value === 'string' && value.length > 0 && value.length <= 240;

export function imageUrl(value, origin) {
  try {
    const url = new URL(value, origin);
    if (url.protocol !== 'https:' || url.username || url.password ||
        !(url.origin === origin || url.hostname === 'cdn.shopify.com')) return null;
    return url.href;
  } catch { return null; }
}

export function readConfig(raw, origin) {
  if (!raw || raw.version !== 1 || !id(raw.paperId) || !id(raw.canvasId) || raw.paperId === raw.canvasId ||
      raw.paperToCanvas !== raw.canvasId || raw.canvasToPaper !== raw.paperId ||
      raw.sourcePaperId !== `gid://shopify/Product/${raw.paperId}` ||
      !hash(raw.paperSha) || raw.paperSha !== raw.canvasSha || !label(raw.operationKey) ||
      !hash(raw.cropContractSha) || raw.canvasType !== 'Canvas art print' || raw.canvasTemplate !== 'pf-paired-canvas' ||
      !raw.published || !raw.available || !label(raw.title) || !/^[A-Z]{2}$/.test(raw.country) ||
      !/^[A-Z]{3}$/.test(raw.currency) || typeof raw.root !== 'string' || !/^\/(?:[a-z0-9-]+\/)*$/i.test(raw.root) ||
      !['paper', 'canvas'].includes(raw.routeMaterial) || !Array.isArray(raw.variants) || raw.variants.length !== 9 ||
      !Array.isArray(raw.media) || raw.media.length < 2) throw new Error('Invalid material pairing');
  const media = raw.media.map(item => {
    const src = imageUrl(item.src, origin);
    if (!id(item.id) || !src || !label(item.alt) || !Number.isInteger(item.width) || !Number.isInteger(item.height) ||
        item.width <= 0 || item.height <= 0) throw new Error('Invalid canvas media');
    return Object.freeze({ id: item.id, src, alt: item.alt, width: item.width, height: item.height });
  });
  if (new Set(media.map(item => item.id)).size !== media.length) throw new Error('Repeated canvas media');
  const variants = raw.variants.map(item => {
    if (!id(item.id) || !label(item.size) || !Object.hasOwn(FINISHES, item.finish) || typeof item.available !== 'boolean' ||
        !Number.isSafeInteger(item.price) || item.price <= 0 || !label(item.money) ||
        !media.some(image => image.id === item.mediaId)) throw new Error('Invalid canvas variant');
    return Object.freeze({ id: item.id, size: item.size, finish: item.finish, available: item.available,
      price: item.price, money: item.money, mediaId: item.mediaId });
  });
  const sizes = [...new Set(variants.map(item => item.size))];
  if (new Set(variants.map(item => item.id)).size !== 9 || sizes.length !== 3 || !variants.some(item => item.available) ||
      sizes.some(size => Object.keys(FINISHES).some(finish => variants.filter(item => item.size === size && item.finish === finish).length !== 1))) {
    throw new Error('Incomplete canvas choices');
  }
  return Object.freeze({ ...raw, variants: Object.freeze(variants), media: Object.freeze(media), sizes: Object.freeze(sizes) });
}

export function selectedVariant(config, size, finish) {
  return config.variants.find(item => item.size === size && item.finish === finish) || null;
}

export function quantityValue(value) {
  const quantity = Number(value);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) throw new Error('Choose a quantity from 1 to 99.');
  return quantity;
}
