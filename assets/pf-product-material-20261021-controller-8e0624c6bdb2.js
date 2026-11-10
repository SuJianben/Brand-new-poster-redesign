import { FINISHES, readConfig, selectedVariant } from './pf-product-material-20261021-policy-b8ae9ba90037.js';
import { readSelection, selectionUrl } from './pf-product-material-20261021-state-26b7027e3636.js';
import { track } from './pf-product-material-20261021-analytics-67b3b34bcd00.js';
import { addCanvas } from './pf-product-material-20261021-cart-51eadaa4abf3.js';
import { mountMedia } from './pf-product-material-20261021-media-cd9d63d4458c.js';
import { mountMobile } from './pf-product-material-20261021-mobile-718095481b4b.js';
import { mountInformation } from './pf-product-material-20261021-information-5acb3daaf7fe.js';
import { mountPurchaseGuard } from './pf-product-material-20261021-purchase-guard-5a63f6fe5682.js';

export function mountMaterialOptions(host) {
  const root = host.closest('[data-ps-product]');
  const doc = host.ownerDocument, view = doc.defaultView;
  const config = readConfig(JSON.parse(host.querySelector('[data-pf-material-config]').textContent), view.location.origin);
  if (view.PFMarket?.country !== config.country || view.PFMarket?.currency !== config.currency) throw new Error('Material market context differs');
  const paper = root?.querySelector('.ps-purchase > .ps-form');
  const panel = host.querySelector('[data-pf-canvas-panel]');
  const form = host.querySelector('.pf-material__canvas-form');
  const input = form?.querySelector('[data-pf-canvas-id]');
  const size = form?.querySelector('[data-pf-canvas-size]');
  const amount = form?.querySelector('[data-pf-canvas-price]');
  const note = form?.querySelector('[data-pf-canvas-note]');
  const status = form?.querySelector('[data-pf-canvas-status]');
  const add = form?.querySelector('[data-pf-canvas-add]');
  const quantity = form?.querySelector('[name="quantity"]');
  const finishes = [...(form?.querySelectorAll('[data-pf-canvas-finish]') || [])];
  const materials = [...host.querySelectorAll('[data-pf-material-select]')];
  if (!root || !paper || !panel || !form || !input || !size || !amount || !note || !status || !add || !quantity || finishes.length !== 3 || materials.length !== 2) {
    throw new Error('Material purchase contract is incomplete');
  }
  const abort = new AbortController(), options = { signal: abort.signal };
  const priorPaperHidden = paper.hidden, priorPaperInert = paper.inert;
  let media, mobile, information, guard;
  try {
    guard = mountPurchaseGuard(root, paper, config);
    mobile = mountMobile(root, host, form, add, abort.signal);
    media = mountMedia(root, host, config, abort.signal);
    information = mountInformation(root, config, abort.signal);
  } catch (error) { abort.abort(); mobile?.dispose(); media?.dispose(); information?.dispose(); guard?.dispose(); throw error; }
  let selection = readSelection(config, view.location.href), busy = false, uncertain = false, pendingRestore = false;
  const drawer = (method, value) => { try { view.CartDrawer?.[method]?.(value); } catch { /* Cart UI must not misreport a successful add. */ } };
  const emit = type => root.dispatchEvent(new view.CustomEvent(type, { bubbles: true, detail: {
    material: selection.material, productId: selection.material === 'canvas' ? config.canvasId : config.paperId,
    paperProductId: config.paperId, sourceProductId: config.paperId,
    variantId: selection.material === 'canvas' ? selection.variant.id : root.querySelector('[data-ps-variant-input]')?.value,
  } }));
  const sync = () => {
    const canvas = selection.material === 'canvas', variant = selection.variant;
    root.dataset.pfMaterialActive = selection.material;
    paper.hidden = canvas || priorPaperHidden; paper.inert = canvas || Boolean(priorPaperInert); panel.hidden = !canvas;
    materials.forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.pfMaterialSelect === selection.material)); button.disabled = busy; });
    input.value = variant.id; size.value = variant.size; size.disabled = busy;
    finishes.forEach(radio => { radio.checked = radio.value === variant.finish; radio.disabled = busy; });
    quantity.disabled = busy;
    amount.textContent = variant.money;
    note.textContent = FINISHES[variant.finish].note;
    add.disabled = busy || uncertain || !variant.available;
    add.setAttribute('aria-busy', String(busy));
    add.textContent = busy ? 'Adding…' : variant.available ? 'Add to bag' : 'Sold out';
    media.sync(selection); mobile.sync(selection, busy || uncertain); information.sync(selection); guard.sync(selection);
  };
  const save = replace => {
    const state = { ...(view.history.state || {}), pfMaterialOptions: true };
    view.history[replace ? 'replaceState' : 'pushState'](state, '', selectionUrl(view.location.href, selection));
  };
  materials.forEach(button => button.addEventListener('click', () => {
    if (busy || selection.material === button.dataset.pfMaterialSelect) return;
    selection = { ...selection, material: button.dataset.pfMaterialSelect };
    sync(); save(false); emit('product:material-change'); track(view, 'pf_product_material_select', config, selection);
  }, options));
  const chooseVariant = () => {
    if (busy) return;
    const finish = finishes.find(radio => radio.checked)?.value;
    const variant = selectedVariant(config, size.value, finish);
    if (!variant) return;
    selection = { ...selection, variant }; if (!uncertain) status.textContent = ''; sync(); save(true);
    emit('product:canvas-variant-change'); track(view, 'pf_canvas_variant_select', config, selection);
  };
  size.addEventListener('change', chooseVariant, options);
  finishes.forEach(radio => radio.addEventListener('change', chooseVariant, options));
  const restore = () => {
    if (busy) { pendingRestore = true; return; }
    selection = readSelection(config, view.location.href); if (!uncertain) status.textContent = ''; sync(); emit('product:material-change');
  };
  view.addEventListener('popstate', restore, options);
  view.addEventListener('pageshow', restore, options);
  root.addEventListener('product:focus-current-purchase', event => {
    if (selection.material !== 'canvas') return;
    event.preventDefault();
    size.scrollIntoView({ block: 'center', behavior: 'auto' }); size.focus({ preventScroll: true });
  }, options);
  paper.addEventListener('submit', event => {
    if (selection.material !== 'canvas') return;
    event.preventDefault(); event.stopImmediatePropagation();
  }, { ...options, capture: true });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || uncertain || selection.material !== 'canvas' || !selection.variant.available || !form.reportValidity()) return;
    busy = true; status.textContent = ''; sync();
    const submitted = { ...selection };
    try {
      drawer('openLoading');
      const result = await addCanvas(config, submitted.variant, quantity.value, view.fetch.bind(view));
      status.textContent = result.cart ? 'Added to your bag.' : 'Added to your bag. Open your bag to review it.';
      track(view, 'pf_canvas_added_to_cart', config, submitted, result.quantity);
      if (result.cart) {
        doc.dispatchEvent(new view.CustomEvent('cart:updated', { detail: { cart: result.cart } }));
        drawer('open', result.cart);
      } else drawer('close');
    } catch (error) {
      uncertain = Boolean(error.uncertain);
      status.textContent = uncertain ? 'We couldn’t confirm this update. Please check your bag before adding again.' : error.message;
      drawer('close');
    } finally {
      busy = false;
      if (pendingRestore) { pendingRestore = false; restore(); } else sync();
    }
  }, options);
  try { sync(); guard.ready(); host.hidden = false; emit('product:material-change'); }
  catch (error) { abort.abort(); mobile.dispose(); media.dispose(); information.dispose(); guard.dispose();
    paper.hidden = priorPaperHidden; paper.inert = priorPaperInert; delete root.dataset.pfMaterialActive; host.hidden = true; throw error; }
  return { dispose() { abort.abort(); mobile.dispose(); media.dispose(); information.dispose(); paper.hidden = priorPaperHidden; paper.inert = priorPaperInert;
    guard.dispose(); delete root.dataset.pfMaterialActive; host.hidden = true; } };
}
