/* Mobile purchase presentation only. The original form owns variants and cart writes. */
(() => {
  'use strict';
  const root = document.querySelector('[data-ps-product-context="default"]');
  const bar = root?.querySelector('[data-ps-sticky-atc]');
  const form = root?.querySelector('.ps-form');
  const primary = form?.querySelector('[data-ps-add-button]');
  if (!bar || !form || !primary || bar.dataset.mobilePurchaseReady) return;
  bar.dataset.mobilePurchaseReady = 'true';

  const mobile = window.matchMedia('(max-width: 767px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const price = form.querySelector('[data-ps-price]');
  const heading = form.querySelector('h1');
  const priceAnchor = document.createComment('Mobile price original position');
  price?.before(priceAnchor);
  const action = bar.querySelector('[data-ps-sticky-button]');
  const actionLabel = bar.querySelector('[data-ps-sticky-label]');
  const amount = bar.querySelector('[data-ps-sticky-price]');
  const size = bar.querySelector('[data-ps-sticky-size]');
  const groups = [...form.querySelectorAll('[data-ps-option-group]')];
  const sizeGroup = groups.find((group) => /size/i.test(group.getAttribute('aria-label') || ''));
  let primaryVisible = false;
  let frame = 0;
  let observer;
  let observedHeight = 0;
  let submitting = false;

  const setText = (node, value) => { if (node && node.textContent !== value) node.textContent = value; };
  const missingGroup = () => groups.find((group) => !group.querySelector('input:checked'));
  const overlayOpen = () => document.documentElement.classList.contains('is-cart-drawer-open')
    || document.documentElement.classList.contains('is-mobile-menu-open')
    || document.body.classList.contains('ps-size-guide-is-open');
  const show = (visible) => {
    if (bar.hidden === !visible) return;
    bar.hidden = !visible;
    bar.setAttribute('aria-hidden', String(!visible));
  };

  const sync = () => {
    frame = 0;
    const missing = missingGroup();
    setText(amount, price?.querySelector('.ps-price__current')?.textContent || '');
    const selectedSize = sizeGroup?.querySelector('input:checked')?.value;
    setText(size, selectedSize ? `${selectedSize} · Edit` : groups.length ? 'Choose options' : 'One size');
    size.disabled = !groups.length;
    size.setAttribute('aria-label', selectedSize ? `Change size, currently ${selectedSize}` : 'Choose options');
    setText(actionLabel, missing ? 'Choose options' : primary.querySelector('[data-ps-add-label]')?.textContent || 'Add to cart');
    action.disabled = submitting || (!missing && primary.disabled);
    action.setAttribute('aria-busy', String(submitting));
    // PAF-MOBILE-PDP-001: geometric check every frame (IO alone misses fast flings that jump past the button).
    const pr = primary.getBoundingClientRect();
    const passed = pr.height > 0 ? pr.bottom < 120 : !primaryVisible;
    const foot = document.querySelector('[data-pf-site-footer]');
    const footerIn = foot ? foot.getBoundingClientRect().top < window.innerHeight : false;
    const on = mobile.matches && passed && !footerIn && !overlayOpen();
    show(on);
    document.body.classList.toggle('ps-sticky-atc-on', on);
  };
  const schedule = () => { if (!frame) frame = window.requestAnimationFrame(sync); };

  const observePrimary = () => {
    observer?.disconnect();
    const height = Math.ceil(bar.getBoundingClientRect().height) || observedHeight || 86;
    observedHeight = height;
    document.body.style.setProperty('--ps-mobile-purchase-height', `${height}px`);
    if (!('IntersectionObserver' in window)) { show(false); return; }
    observer = new IntersectionObserver(([entry]) => {
      primaryVisible = entry.isIntersecting || entry.boundingClientRect.top > 0;
      schedule();
    }, { rootMargin: `-120px 0px -${height}px 0px`, threshold: 0 });
    observer.observe(primary);
  };

  const placePrice = () => {
    // Move the existing node, never clone it: all price/variant subscribers stay attached.
    // Keep natural order
    document.body.classList.toggle('ps-mobile-purchase-ready', mobile.matches);
    primaryVisible = true;
    sync();
    observePrimary();
  };

  const chooseOptions = () => {
    const group = missingGroup() || sizeGroup || groups[0];
    if (!group) return;
    group.scrollIntoView({ block: 'center', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    const input = group.querySelector('input:checked') || group.querySelector('input:not(:disabled)');
    input?.focus({ preventScroll: true });
    root.dispatchEvent(new CustomEvent('product:mobile-purchase-action', { detail: { action: 'choose_options' } }));
  };
  size.addEventListener('click', chooseOptions);
  action.addEventListener('click', () => {
    if (!mobile.matches || action.disabled || overlayOpen()) return;
    if (missingGroup()) { chooseOptions(); return; }
    if (primary.disabled || !form.reportValidity()) return;
    // No timeout or second cart implementation: normal submit validation and listeners run once.
    submitting = true;
    sync();
    root.dispatchEvent(new CustomEvent('product:mobile-purchase-action', { detail: { action: 'add_to_cart' } }));
    primary.click();
    queueMicrotask(() => { submitting = false; schedule(); });
  });

  const stateObserver = new MutationObserver(schedule);
  if (price) stateObserver.observe(price, { childList: true, subtree: true, characterData: true });
  stateObserver.observe(primary, { attributes: true, attributeFilter: ['disabled'], childList: true, subtree: true, characterData: true });
  const overlayObserver = new MutationObserver(schedule);
  overlayObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  overlayObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  const guide = root.querySelector('[data-ps-size-guide-modal]');
  if (guide) overlayObserver.observe(guide, { attributes: true, attributeFilter: ['hidden'] });
  form.addEventListener('change', schedule);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  root.addEventListener('product:variant-change', schedule);
  root.addEventListener('product:framing-price-change', schedule);
  mobile.addEventListener('change', placePrice);
  window.addEventListener('pageshow', placePrice);
  const resize = 'ResizeObserver' in window ? new ResizeObserver(() => {
    const height = Math.ceil(bar.getBoundingClientRect().height);
    if (height && height !== observedHeight) observePrimary();
  }) : null;
  resize?.observe(bar);
  placePrice();
  const cleanup = (event) => {
    if (!event.target.contains(root)) return;
    observer?.disconnect();
    resize?.disconnect();
    stateObserver.disconnect();
    overlayObserver.disconnect();
    mobile.removeEventListener('change', placePrice);
    window.removeEventListener('pageshow', placePrice);
    window.cancelAnimationFrame(frame);
    document.body.classList.remove('ps-mobile-purchase-ready');
    document.body.style.removeProperty('--ps-mobile-purchase-height');
    document.removeEventListener('shopify:section:unload', cleanup);
  };
  document.addEventListener('shopify:section:unload', cleanup);
})();


/* ==========================================================================
   1:1 POSTERY PDP CONTROLLER FOR POSTERANDFORM (Poster | Canvas + Room Scenes + Live Size Scaling)
   ========================================================================== */
(() => {
  const root = document.querySelector('[data-ps-product]');
  const form = root?.querySelector('.ps-form');
  const preview = root?.querySelector('[data-ps-art-preview]');
  const mainMedia = root?.querySelector('.ps-main-media');
  const thumbRail = root?.querySelector('[data-ps-thumbnail-rail]');
  if (!root || !form || !preview || !mainMedia) return;

  const isMobile = () => window.matchMedia('(max-width: 960px)').matches;

  // 1. Set Room Scene background CSS variables from existing assets
  const sampleAssetEl = document.querySelector('link[href*="pf-postery-1to1.css"]');
  const assetHref = sampleAssetEl?.getAttribute('href') || '';
  const cdnBase = assetHref.split('pf-postery-1to1.css')[0] || '';
  if (cdnBase) {
    const bgSuffix = isMobile() ? '_1000x' : '';
    mainMedia.style.setProperty('--pf-bg-sofa', `url("${cdnBase}dw-room-bg-sofa${bgSuffix}.jpg")`);
    mainMedia.style.setProperty('--pf-bg-dining', `url("${cdnBase}dw-room-bg-dining${bgSuffix}.jpg")`);
    mainMedia.style.setProperty('--pf-bg-sideboard', `url("${cdnBase}dw-room-bg-sideboard${bgSuffix}.jpg")`);
  }
  mainMedia.setAttribute('data-pf-room-scene', 'none');
  mainMedia.setAttribute('data-pf-mode', 'poster');
  // Expose the artwork URL so CSS can draw the canvas sides with the image wrapping around the edge
  const pfArtImg = root.querySelector('.ps-css-artwork img, [data-ps-main-image]');
  const syncPfArtUrl = () => {
    const u = pfArtImg && (pfArtImg.currentSrc || pfArtImg.src);
    if (u) {
      mainMedia.style.setProperty('--pf-art-url', `url("${u}")`);
      const slotEl = root.querySelector('[data-pf-split-slot]');
      if (slotEl) slotEl.style.setProperty('--pf-art-url', `url("${u}")`);
    }
  };
  if (pfArtImg) pfArtImg.addEventListener('load', syncPfArtUrl);
  syncPfArtUrl();

  // 2. Inject 3 Interactive Room Scene Thumbnails (`sofa`, `dining`, `sideboard`) into thumbRail
  const mainImg = root.querySelector('[data-ps-main-image]');
  const artThumbBtn = thumbRail?.querySelector('[data-media-role="artwork"]') || thumbRail?.querySelectorAll('[data-ps-media]')?.[1] || thumbRail?.querySelector('[data-ps-media]');
  const artSrc = artThumbBtn?.dataset?.mediaSrc || mainImg?.src || '';

  if (thumbRail && cdnBase && artSrc) {
    const existingThumbs = [...thumbRail.querySelectorAll('[data-ps-media]')];
    if (existingThumbs.length > 1) {
      if (artThumbBtn) artThumbBtn.click();
      existingThumbs.forEach((t) => {
        if (t !== artThumbBtn) t.style.display = 'none';
      });
    }
    const scenes = [
      { key: 'sofa', title: 'Room view: Living room', bg: `${cdnBase}dw-room-bg-sofa_200x.jpg` },
      { key: 'dining', title: 'Room view: Dining space', bg: `${cdnBase}dw-room-bg-dining_200x.jpg` },
      { key: 'sideboard', title: 'Room view: Sideboard', bg: `${cdnBase}dw-room-bg-sideboard_200x.jpg` },
    ];
    scenes.forEach((sc) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ps-thumbnail pf-room-thumb';
      btn.dataset.pfRoomTrigger = sc.key;
      btn.title = sc.title;
      btn.innerHTML = `<span class="pf-room-thumb__bg" style="background-image:url('${sc.bg}')"><span class="pf-room-thumb__art"><img src="${artSrc}" alt="${sc.title}" loading="lazy"></span></span>`;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        thumbRail.querySelectorAll('.ps-thumbnail').forEach((t) => t.classList.remove('is-active'));
        btn.classList.add('is-active');
        mainMedia.setAttribute('data-pf-room-scene', sc.key);
        root.dispatchEvent(new CustomEvent('product:show-custom-preview'));
        window.requestAnimationFrame(() => root.productFramePreview?.fit?.());
      });
      thumbRail.appendChild(btn);
    });

    existingThumbs.forEach((t) => {
      t.addEventListener('click', () => {
        thumbRail.querySelectorAll('.pf-room-thumb').forEach((rt) => rt.classList.remove('is-active'));
        mainMedia.setAttribute('data-pf-room-scene', 'none');
        window.requestAnimationFrame(() => root.productFramePreview?.fit?.());
      });
    });

    // Stage arrows: cycle only the visible slides (flat artwork + 3 room scenes), never the hidden media.
    const visibleSlides = () => [artThumbBtn, ...thumbRail.querySelectorAll('.pf-room-thumb')].filter(Boolean);
    root.querySelectorAll('[data-ps-media-direction]').forEach((arrow) => {
      arrow.addEventListener('click', (e) => {
        const list = visibleSlides();
        if (!list.length) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        const cur = list.findIndex((t) => t.classList.contains('is-active'));
        const dir = Number(arrow.dataset.psMediaDirection) || 1;
        const next = list[((cur < 0 ? 0 : cur) + dir + list.length) % list.length];
        next.click();
      }, true);
    });
  }

  // 3. Inject Postery Header (`PosterAndForm Studio` + `200g` icon) & Title Suffix (`Poster` / `Canvas`)
  const h1 = form.querySelector('h1');
  if (h1 && !form.querySelector('.pf-postery-head')) {
    const baseTitle = h1.textContent.trim().replace(/\s+(Art Print|Canvas Print|Poster|Canvas)$/i, '');
    h1.innerHTML = `${baseTitle} <span data-pf-title-suffix>Art Print</span>`;
    const headWrap = document.createElement('div');
    headWrap.className = 'pf-postery-head';
    headWrap.innerHTML = `
      <div class="pf-postery-head__top">
        <span class="pf-postery-head__fsc" title="200gsm matte fine art paper">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#2d6a4f" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 6 11h4l-2 6h8l-2-6h4L12 3z"/><path d="M12 17v4"/></svg>
          <small>200g</small>
        </span>
      </div>
    `;
    h1.before(headWrap);
    // PAF v3: vendor line removed; title and 200g badge share one row.
    const headTop = headWrap.querySelector('.pf-postery-head__top');
    headTop.prepend(h1);
  }

  // 4. Inject Poster | Canvas Segmented Tabs + 3 Postery Rounded Selector Pills right above `.ps-buy-buttons`
  const buyButtons = form.querySelector('.ps-buy-buttons');
  const pillsWrap = document.createElement('div');
  pillsWrap.className = 'pf-postery-pills';
  pillsWrap.innerHTML = `
    <div class="pf-postery-tabs" role="tablist" aria-label="Select format">
      <button type="button" role="tab" class="pf-postery-tab is-active" aria-selected="true" data-pf-mode-tab="poster">Poster</button>
      <button type="button" role="tab" class="pf-postery-tab" aria-selected="false" data-pf-mode-tab="canvas">Canvas</button>
    </div>
    <button type="button" class="pf-postery-pill" data-pf-open-tab="size">
      <span class="pf-postery-pill__label">Size</span>
      <span class="pf-postery-pill__val">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#333" stroke-width="1.8"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/></svg>
        <strong data-pf-pill-size-val>${(root.querySelector('.ps-config-options--size input:checked')?.value || '').replace(/</g, '&lt;')}</strong>
      </span>
      <span class="pf-postery-pill__right">
        <span data-pf-pill-size-price></span>
        <svg class="pf-postery-pill__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </span>
    </button>
    <button type="button" class="pf-postery-pill" data-pf-open-tab="passepartout" data-pf-poster-only>
      <span class="pf-postery-pill__label">Passepartout</span>
      <span class="pf-postery-pill__val">
        <span class="pf-postery-pill__swatch pf-postery-pill__swatch--none" data-pf-pill-pp-swatch></span>
        <strong data-pf-pill-pp-val>No passepartout</strong>
      </span>
      <span class="pf-postery-pill__right">
        <span data-pf-pill-pp-price></span>
        <svg class="pf-postery-pill__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </span>
    </button>
    <button type="button" class="pf-postery-pill" data-pf-open-tab="frame" data-pf-poster-only>
      <span class="pf-postery-pill__label">Frame</span>
      <span class="pf-postery-pill__val">
        <span class="pf-postery-pill__swatch pf-postery-pill__swatch--none" data-pf-pill-fr-swatch></span>
        <strong data-pf-pill-fr-val>No frame</strong>
      </span>
      <span class="pf-postery-pill__right">
        <span data-pf-pill-fr-price></span>
        <svg class="pf-postery-pill__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </span>
    </button>
    <div class="pf-postery-pill pf-postery-pill--static" data-pf-canvas-only hidden>
      <span class="pf-postery-pill__label">Format</span>
      <span class="pf-postery-pill__val">
        <strong>Frameless canvas</strong>
      </span>
      <span class="pf-postery-pill__right">
        <strong data-pf-pill-canvas-price></strong>
      </span>
    </div>
  `;
  if (buyButtons) buyButtons.before(pillsWrap);

  // 6. Sync Pills, Mode Tabs & Size Scaling with current selection
  const variantsNode = document.querySelector('[data-ps-variants]');
  const variants = variantsNode ? JSON.parse(variantsNode.textContent) : [];
  const moneyFmt = (cents) => new Intl.NumberFormat(document.documentElement.lang || 'en-GB', { style: 'currency', currency: window.Shopify?.currency?.active || 'GBP' }).format(Number(cents || 0) / 100);

  const getScaleStep = (sz = '') => {
    const s = sz.toLowerCase();
    if (s.includes('100x140') || s.includes('100×140')) return 's5';
    if (s.includes('70x100') || s.includes('70×100') || s.includes('60x80') || s.includes('a1')) return 's4';
    if (s.includes('50x70') || s.includes('50×70') || s.includes('a2')) return 's3';
    if (s.includes('30x40') || s.includes('30×40') || s.includes('40x50') || s.includes('a3')) return 's2';
    return 's1';
  };

  const syncPillsAndStage = () => {
    const st = root.productFraming?.getState?.();
    const mode = st?.mode || 'poster';
    const checkedSizeInput = root.querySelector('.ps-config-options--size input:checked');
    const curSize = st?.currentSize || checkedSizeInput?.value || 'A4 (21×29,7 cm)';
    const curVar = variants.find((v) => v.options && v.options.includes(curSize)) || variants[0];

    // Update Title Suffix (`Poster` vs `Canvas`)
    const suffixEl = form.querySelector('[data-pf-title-suffix]');
    if (suffixEl) suffixEl.textContent = mode === 'canvas' ? 'Canvas' : 'Art Print';

    // Update Mode Tabs & Visibility of Poster vs Canvas pills
    pillsWrap.querySelectorAll('[data-pf-mode-tab]').forEach((tab) => {
      const active = tab.dataset.pfModeTab === mode;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    pillsWrap.querySelectorAll('[data-pf-poster-only]').forEach((el) => { el.hidden = mode === 'canvas'; });
    pillsWrap.querySelectorAll('[data-pf-canvas-only]').forEach((el) => { el.hidden = mode !== 'canvas'; });
    mainMedia.setAttribute('data-pf-mode', mode);
    const splitSlot = root.querySelector('[data-pf-split-slot]');
    if (splitSlot) {
      splitSlot.setAttribute('data-pf-mode', mode);
      const artUrl = mainMedia.style.getPropertyValue('--pf-art-url');
      if (artUrl) splitSlot.style.setProperty('--pf-art-url', artUrl);
    }

    // Update Size Pill
    const sizeValEl = pillsWrap.querySelector('[data-pf-pill-size-val]');
    const sizePriceEl = pillsWrap.querySelector('[data-pf-pill-size-price]');
    if (sizeValEl) sizeValEl.textContent = curSize;
    if (sizePriceEl && curVar) sizePriceEl.textContent = moneyFmt(curVar.price);

    // Update Canvas Pill (price only from the market-aware catalog; never a hardcoded placeholder)
    const canvasPriceEl = pillsWrap.querySelector('[data-pf-pill-canvas-price]');
    if (canvasPriceEl) {
      canvasPriceEl.textContent = (mode === 'canvas' && st?.canvasRow?.formattedPrice) ? `+${st.canvasRow.formattedPrice}` : '';
    }

    // Update Passepartout Pill
    const ppValEl = pillsWrap.querySelector('[data-pf-pill-pp-val]');
    const ppPriceEl = pillsWrap.querySelector('[data-pf-pill-pp-price]');
    const ppSwatchEl = pillsWrap.querySelector('[data-pf-pill-pp-swatch]');
    const selPp = st?.selected?.passepartout;
    if (ppValEl) ppValEl.textContent = selPp ? `${selPp.style} passepartout` : 'No passepartout';
    // 1:1 with DaylightWalls: nothing selected => no surcharge shown at all
    if (ppPriceEl) ppPriceEl.textContent = (selPp && selPp.formattedPrice) ? `+${selPp.formattedPrice}` : '';
    if (ppSwatchEl) {
      if (selPp) {
        ppSwatchEl.className = 'pf-postery-pill__swatch';
        ppSwatchEl.style.setProperty('--pf-pill-swatch', st.swatchFor(selPp.styleSlug));
      } else {
        ppSwatchEl.className = 'pf-postery-pill__swatch pf-postery-pill__swatch--none';
      }
    }

    // Update Frame Pill (filter out Frameless Canvas from Frame rows!)
    const frValEl = pillsWrap.querySelector('[data-pf-pill-fr-val]');
    const frPriceEl = pillsWrap.querySelector('[data-pf-pill-fr-price]');
    const frSwatchEl = pillsWrap.querySelector('[data-pf-pill-fr-swatch]');
    const selFr = st?.selected?.frame;
    if (frValEl) frValEl.textContent = selFr ? `${selFr.style} frame` : 'No frame';
    // 1:1 with DaylightWalls: nothing selected => no surcharge shown at all
    if (frPriceEl) frPriceEl.textContent = (selFr && selFr.formattedPrice) ? `+${selFr.formattedPrice}` : '';
    if (frSwatchEl) {
      if (selFr) {
        frSwatchEl.className = 'pf-postery-pill__swatch';
        frSwatchEl.style.setProperty('--pf-pill-swatch', '#181818');
      } else {
        frSwatchEl.className = 'pf-postery-pill__swatch pf-postery-pill__swatch--none';
      }
    }

    // Update Stage Size Scale & Label
    mainMedia.setAttribute('data-pf-size-scale', getScaleStep(curSize));
    mainMedia.setAttribute('data-pf-size-label', curSize);
  };

  // Bind Poster | Canvas Mode Tabs
  pillsWrap.querySelectorAll('[data-pf-mode-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      const nextMode = tab.dataset.pfModeTab || 'poster';
      root.productFraming?.setMode?.(nextMode);
      syncPillsAndStage();
    });
  });

  // 7. Drawer / Split-Screen Bottom Sheet Modal
  const previewHome = document.createComment('pf-preview-home');
  preview.before(previewHome);

  const modal = document.createElement('div');
  modal.className = 'pf-split-modal';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="pf-split-modal__stage">
      <div class="pf-split-modal__preview-slot" data-pf-split-slot></div>
      <div class="pf-split-modal__caption" data-pf-split-caption>Live preview · Tap options below</div>
    </div>
    <div class="pf-split-modal__sheet">
      <div class="pf-split-modal__header">
        <div class="pf-split-modal__tabs">
          <button type="button" class="pf-split-modal__tab" data-pf-tab="size">Size</button>
          <button type="button" class="pf-split-modal__tab" data-pf-tab="passepartout">Passepartout</button>
          <button type="button" class="pf-split-modal__tab" data-pf-tab="frame">Frame</button>
        </div>
        <button type="button" class="pf-split-modal__done" data-pf-split-close>Done ✕</button>
      </div>
      <div class="pf-split-modal__body" data-pf-split-body></div>
    </div>
  `;
  root.appendChild(modal);

  const slot = modal.querySelector('[data-pf-split-slot]');
  const caption = modal.querySelector('[data-pf-split-caption]');
  const body = modal.querySelector('[data-pf-split-body]');
  const tabs = [...modal.querySelectorAll('[data-pf-tab]')];

  const updateCaption = () => {
    const st = root.productFraming?.getState?.();
    const priceText = root.querySelector('.ps-price__current')?.textContent?.trim() || '';
    if (!st) { caption.textContent = priceText; return; }
    if (st.mode === 'canvas') {
      caption.textContent = `${st.currentSize} · Frameless stretched canvas — ${priceText}`;
      return;
    }
    const pp = st.selected.passepartout ? `${st.selected.passepartout.style} passepartout` : 'No passepartout';
    const fr = st.selected.frame ? `${st.selected.frame.style} frame` : 'No frame';
    caption.textContent = `${st.currentSize} · ${pp} · ${fr} — ${priceText}`;
  };

  const renderTab = (tabName) => {
    const st = root.productFraming?.getState?.();
    const isCanvas = st?.mode === 'canvas';
    tabs.forEach((t) => {
      if (t.dataset.pfTab !== 'size') t.hidden = isCanvas;
      t.classList.toggle('is-active', t.dataset.pfTab === tabName);
    });
    body.replaceChildren();

    if (tabName === 'size') {
      const sizeInputs = [...root.querySelectorAll('.ps-config-options--size input[type="radio"]')];
      sizeInputs.forEach((inp) => {
        const vObj = variants.find((v) => v.options && v.options.includes(inp.value));
        const canvasAdd = isCanvas && typeof st?.canvasPriceForSize === 'function' ? Number(st.canvasPriceForSize(inp.value) || 0) : 0;
        const card = document.createElement('button');
        card.type = 'button';
        card.className = `pf-split-card${inp.checked ? ' is-selected' : ''}`;
        card.innerHTML = `
          <span class="pf-split-card__meta">
            <span class="pf-split-card__title">${inp.value}</span>
            <span class="pf-split-card__price">${vObj ? moneyFmt(Number(vObj.price) + canvasAdd) : ''}</span>
          </span>
        `;
        card.addEventListener('click', () => {
          inp.checked = true;
          inp.dispatchEvent(new Event('change', { bubbles: true }));
          syncPillsAndStage();
          renderTab('size');
          updateCaption();
          window.setTimeout(() => root.productFramePreview?.fit?.(), 50);
        });
        body.appendChild(card);
      });
      if (isCanvas) {
        const note = document.createElement('p');
        note.className = 'pf-split-note';
        note.textContent = 'Frameless stretched canvas on a wooden stretcher bar, ready to hang. Prices include the canvas.';
        body.appendChild(note);
      }
      return;
    }

    if (!st) return;
    const rows = tabName === 'passepartout' ? st.passepartoutRows : (st.frameRows || []).filter((r) => r.styleSlug === 'black-wood');
    const currentSel = st.selected[tabName];

    const noneCard = document.createElement('button');
    noneCard.type = 'button';
    noneCard.className = `pf-split-card${!currentSel ? ' is-selected' : ''}`;
    noneCard.innerHTML = `
      <span class="pf-split-card__swatch pf-split-card__swatch--none"></span>
      <span class="pf-split-card__meta">
        <span class="pf-split-card__title">${tabName === 'passepartout' ? 'No passepartout' : 'No frame'}</span>
        <span class="pf-split-card__sub">${tabName === 'passepartout' ? 'Full-bleed artwork' : 'Unframed print'}</span>
      </span>
    `;
    noneCard.addEventListener('click', () => {
      root.productFraming.selectOption(tabName, null);
      syncPillsAndStage();
      renderTab(tabName);
      updateCaption();
      window.setTimeout(() => root.productFramePreview?.fit?.(), 50);
    });
    body.appendChild(noneCard);

    rows.forEach((row) => {
      const isSel = String(currentSel?.id) === String(row.id);
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `pf-split-card${isSel ? ' is-selected' : ''}`;
      const swatchColor = st.swatchFor(row.styleSlug);
      card.innerHTML = `
        <span class="pf-split-card__swatch" style="--pf-swatch:${swatchColor}"></span>
        <span class="pf-split-card__meta">
          <span class="pf-split-card__title">${row.style}</span>
          <span class="pf-split-card__sub">${tabName === 'passepartout' ? 'Printed border' : st.currentSize}</span>
          <span class="pf-split-card__price">+${row.formattedPrice}</span>
        </span>
      `;
      card.addEventListener('click', () => {
        root.productFraming.selectOption(tabName, row.id);
        syncPillsAndStage();
        renderTab(tabName);
        updateCaption();
        window.setTimeout(() => root.productFramePreview?.fit?.(), 50);
      });
      body.appendChild(card);
    });
  };

  const openModal = (initialTab = 'size') => {
    if (isMobile()) {
      slot.appendChild(preview);
    }
    modal.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    window.requestAnimationFrame(() => {
      root.productFramePreview?.fit?.();
      renderTab(initialTab);
      updateCaption();
    });
  };

  const closeModal = () => {
    if (modal.hidden) return;
    if (slot.contains(preview)) {
      previewHome.after(preview);
    }
    modal.hidden = true;
    document.documentElement.style.overflow = '';
    window.requestAnimationFrame(() => {
      root.productFramePreview?.fit?.();
      if (isMobile()) {
        const top = mainMedia.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    });
  };

  tabs.forEach((t) => t.addEventListener('click', () => renderTab(t.dataset.pfTab)));
  modal.querySelector('[data-pf-split-close]')?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  pillsWrap.querySelectorAll('[data-pf-open-tab]').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.dataset.pfOpenTab || 'size'));
  });

  const stickySizeBtn = root.querySelector('[data-ps-sticky-size]');
  stickySizeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    openModal('size');
  }, true);

  const safeSyncPills = () => {
    try { syncPillsAndStage(); } catch (error) { console.error('PF pill sync failed.', error); }
  };
  root.addEventListener('product:variant-change', safeSyncPills);
  root.addEventListener('product:framing-price-change', safeSyncPills);
  // Keep re-syncing until the framing catalog (market-aware prices) is actually available, so slow
  // connections never get stuck on the initial empty/placeholder pill state.
  let pillSyncTries = 0;
  const syncPillsUntilReady = () => {
    safeSyncPills();
    const st = root.productFraming?.getState?.();
    const ready = Boolean(st && ((st.passepartoutRows || []).length || (st.frameRows || []).length));
    if (!ready && pillSyncTries++ < 60) window.setTimeout(syncPillsUntilReady, 250);
  };
  syncPillsUntilReady();
})();


/* PAF-ROOM-SCENE-002: keep the room-scene print (art + mat + frame) inside each scene's clear wall area.
   SKY = top of the furniture per 5%-wide column band, as a fraction of the 1024x1536 scene photo (measured from the photos).
   Wall box = from 6% below the top of the stage down to the furniture under the print minus a 3% gap.
   Size i is drawn at min(theme size, F[i] x wall box), so sizes still step up visibly and the largest is capped by the wall. */
(function () {
  var SKY = {
    sofa:      [.513,.550,.583,.792,.710,.711,.711,.711,.712,.712,.712,.712,.712,.711,.710,.711,.712,.712,.711,.711],
    dining:    [.684,.684,.684,.688,.694,.704,.702,.683,.675,.660,.657,.625,.621,.621,.641,.704,.692,.686,.683,.683],
    sideboard: [.663,.662,.567,.547,.547,.592,.668,.667,.665,.664,.664,.664,.664,.550,.502,.487,.501,.489,.500,.518]
  };
  var F = { s1: .46, s2: .56, s3: .68, s4: .82, s5: .96 };
  var IW = 1024, IH = 1536, TOP = .06, GAP = .03, SIDE = 12;
  function pct(v, d) { var m = /(-?[\d.]+)%/.exec(v || ''); return m ? parseFloat(m[1]) / 100 : d; }
  function apply(media) {
    var frame = media.querySelector('.ps-css-frame'), preview = media.querySelector('.ps-print-preview');
    if (!frame || !preview) return;
    var sky = SKY[media.getAttribute('data-pf-room-scene')];
    frame.style.removeProperty('translate'); frame.style.removeProperty('scale');
    if (!sky) { media.removeAttribute('data-pf-wall-cap'); thinFrame(media, frame); return; }
    var els = [preview, media.querySelector('.print-preview__inner'), frame].filter(Boolean);
    var trs = els.map(function (e) { var v = e.style.transition; e.style.setProperty('transition', 'none', 'important'); return v; });
    function restore() { els.forEach(function (e, i) { e.style.removeProperty('transition'); if (trs[i]) e.style.transition = trs[i]; }); }
    var box = media.getBoundingClientRect(), r0 = frame.getBoundingClientRect();
    if (!r0.width || !r0.height || !frame.offsetWidth) { restore(); return; }
    var sp = r0.width / frame.offsetWidth;
    var W = box.width, H = box.height, cs = getComputedStyle(media);
    var c = Math.max(W / IW, H / IH), dw = IW * c, dh = IH * c;
    var ox = (W - dw) * pct(cs.backgroundPositionX, .5), oy = (H - dh) * pct(cs.backgroundPositionY, 1);
    function furniture(w) {
      var L = H, x0 = W / 2 - w / 2, x1 = W / 2 + w / 2;
      for (var b = 0; b < 20; b++) {
        var bx0 = ox + dw * b / 20, bx1 = ox + dw * (b + 1) / 20;
        if (bx1 >= x0 && bx0 <= x1) L = Math.min(L, oy + dh * sky[b]);
      }
      return L;
    }
    var a = r0.width / r0.height, top = H * TOP, f = F[media.getAttribute('data-pf-size-scale')] || F.s1;
    var ht = Math.min(r0.height, f * (H - top));
    for (var i = 0; i < 6; i++) {
      var maxH = Math.min(furniture(Math.max(ht * a, 1)) - H * GAP - top, (W - 2 * SIDE) / a);
      ht = Math.min(ht, f * maxH); // only shrink: a narrower print can only see the same or lower furniture
    }
    ht = Math.max(ht, 8);
    var k = ht / r0.height;
    // scale first, then measure and translate (translate is the outermost of the frame's own transforms, so 1 local px = sp screen px)
    frame.style.setProperty('scale', k.toFixed(4));
    var r1 = frame.getBoundingClientRect();
    var tx = (box.left + W / 2 - r1.width / 2) - r1.left, ty = (box.top + top) - r1.top;
    frame.style.setProperty('translate', (tx / sp).toFixed(2) + 'px ' + (ty / sp).toFixed(2) + 'px');
    restore();
    media.setAttribute('data-pf-wall-cap', k.toFixed(3));
    thinFrame(media, frame);
  }
  /* PAF-FRAME-004: realistic moulding width. ~2cm moulding relative to the print's short side (A4 = 21cm ... 100x140 = 100cm),
     measured on the rendered artwork, clamped per viewport: <768px 3-5px, <1000px 3-5px, else 4-6px, and never above 4.5% of the print's short side. Same for all frame colours. */
  function thinFrame(media, frame) {
    if (frame.dataset.hasFrame !== 'true') { media.removeAttribute('data-pf-frame-px'); return; }
    var art = frame.querySelector('.ps-css-artwork'); if (!art) return;
    var label = media.getAttribute('data-pf-size-label') || '';
    var nums = (label.match(/\d+(?:[.,]\d+)?/g) || []).map(function (n) { return parseFloat(n.replace(',', '.')); }).filter(function (n) { return n >= 10; });
    var shortCm = /A4/i.test(label) ? 21 : /A3/i.test(label) ? 29.7 : (nums.length ? Math.min.apply(null, nums) : 30);
    var ar = art.getBoundingClientRect(), fr = frame.getBoundingClientRect();
    if (!ar.width || !frame.offsetWidth) return;
    var vw = window.innerWidth, lo = vw < 768 ? 3 : vw < 1000 ? 3 : 4, hi = vw < 768 ? 5 : vw < 1000 ? 5 : 6;
    var shortPx = Math.min(ar.width, ar.height);
    var px = Math.max(lo, Math.min(hi, shortPx * 2 / shortCm));
    px = Math.min(px, Math.max(1.5, shortPx * .045)); // never more than ~4.5% of the print's short side (keeps small room-scene prints light)
    var sc = fr.width / frame.offsetWidth; // total transform scale on the frame (size tier x wall cap)
    var local = (px / sc).toFixed(2) + 'px';
    var curLocal = parseFloat(frame.style.getPropertyValue('--ps-css-frame-width')) || 0;
    if (Math.abs(curLocal - parseFloat(local)) > 0.05 || frame.style.getPropertyPriority('--ps-css-frame-width') !== 'important')
      frame.style.setProperty('--ps-css-frame-width', local, 'important');
    media.setAttribute('data-pf-frame-px', px.toFixed(1));
  }
  function init() {
    document.querySelectorAll('.ps-main-media').forEach(function (media) {
      var t, obs; function frame() { return media.querySelector('.ps-css-frame'); }
      function run() { apply(media); obs.takeRecords(); }
      function q() { clearTimeout(t); t = setTimeout(run, 40); }
      obs = new MutationObserver(q);
      obs.observe(media, { attributes: true, subtree: true, attributeFilter: ['data-pf-room-scene', 'data-pf-size-scale', 'data-has-frame', 'style', 'class', 'src'] });
      window.addEventListener('resize', q);
      media.addEventListener('transitionend', function (e) { if (e.target !== frame() || e.propertyName === 'padding-top') q(); });
      document.addEventListener('product:css-frame-rendered', q, true);
      q();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();


/* PAF-THUMB-003: mirror the main preview's frame/mat state onto the room-scene thumbnails. */
(function () {
  function sync() {
    var f = document.querySelector('.ps-main-media .ps-css-frame'); if (!f) return;
    var m = f.querySelector('.ps-css-mat');
    var hasFrame = f.dataset.hasFrame === 'true', hasMat = !!(m && m.dataset.hasMat === 'true');
    var fc = getComputedStyle(f).getPropertyValue('--ps-css-frame-color').trim() || '#181818';
    var mc = (m ? getComputedStyle(m).backgroundColor : '#fff').replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/, 'rgb($1, $2, $3)'); // mat colour may be read mid-fade
    document.querySelectorAll('.pf-room-thumb__art').forEach(function (a) {
      if (a.dataset.pfThumbFrame !== String(hasFrame)) a.dataset.pfThumbFrame = String(hasFrame);
      if (a.dataset.pfThumbMat !== String(hasMat)) a.dataset.pfThumbMat = String(hasMat);
      if (a.style.getPropertyValue('--pf-thumb-frame') !== fc) a.style.setProperty('--pf-thumb-frame', fc);
      if (a.style.getPropertyValue('--pf-thumb-mat') !== mc) a.style.setProperty('--pf-thumb-mat', mc);
    });
  }
  function init() {
    var t; function q() { clearTimeout(t); t = setTimeout(sync, 30); }
    var root = document.querySelector('.ps-main-media');
    if (root) new MutationObserver(q).observe(root, { attributes: true, subtree: true, attributeFilter: ['data-has-frame', 'data-has-mat', 'data-mat-style', 'data-frame-style'] });
    var rail = document.querySelector('[data-ps-thumbnail-rail]');
    if (rail) new MutationObserver(q).observe(rail, { childList: true, subtree: true });
    q(); setTimeout(sync, 1500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
