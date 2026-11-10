(() => {
  const VERSION = 'editorial-black-frame-2026-10-15-v1';
  const create = (root) => {
    if (root?.dataset.psOriginalArtwork !== VERSION) return null;
    const thumbnails = [...root.querySelectorAll('[data-ps-media]')];
    const artwork = thumbnails.filter((item) => item.dataset.mediaRole === 'artwork');
    const preview = thumbnails.filter((item) => item.dataset.mediaRole === 'frame-preview');
    if (artwork.length !== 1 || preview.length !== 1
      || artwork[0].dataset.mediaId !== root.dataset.psOriginalArtworkId
      || preview[0].dataset.mediaId !== `black-frame-preview-${root.dataset.psProductId}`
      || thumbnails.some((item) => ['hanger', 'comparison'].includes(item.dataset.mediaRole))) return null;
    const artworkId = artwork[0].dataset.mediaId;
    const previewId = preview[0].dataset.mediaId;
    const lookup = new Map(thumbnails.map((item) => [item.dataset.mediaId, item]));
    if (lookup.size !== thumbnails.length) return null;
    let committedId = thumbnails.find((item) => item.classList.contains('is-active'))?.dataset.mediaId || previewId;
    let requestedId = committedId;
    const roleFor = (id) => String(id) === artworkId ? 'artwork'
      : String(id) === previewId ? 'frame-preview' : 'gallery';
    const committed = (id, { track = true } = {}) => {
      if (!lookup.has(String(id))) return;
      committedId = String(id);
      const role = roleFor(committedId);
      root.dataset.psActiveMediaRole = role;
      if (!track || role === 'gallery') return;
      window.dataLayer?.push({
        event: role === 'artwork' ? 'product_artwork_preview_viewed' : 'product_black_frame_preview_viewed',
        product_id: root.dataset.psProductId || null,
        media_id: committedId,
        media_role: role,
        rollout_version: VERSION,
        preview_only: role === 'frame-preview',
      });
    };
    // Capture before the real choice handler rebuilds its list and detaches the
    // clicked button. This is a user gesture, never catalogue initialization.
    root.addEventListener('click', (event) => {
      const button = event.target?.closest?.('.ps-frame-option--natural');
      if (!button || button.disabled || !root.contains(button)
        || !button.closest('[data-ps-framing-select="frame"]')) return;
      root.dispatchEvent(new CustomEvent('product:show-custom-preview'));
    }, { capture: true });
    committed(committedId, { track: false });
    return Object.freeze({
      artworkMediaId: artworkId,
      isCustomPreview: (id) => String(id) === artworkId,
      requested(id) { if (lookup.has(String(id))) requestedId = String(id); },
      committed,
      // Keep a customer's chosen display view across size-only changes; real
      // Black/Mat selection already requests the actual artwork via showcase.
      variantMediaId() { return requestedId === previewId ? previewId : artworkId; },
      framingChanged() {
        // Never create a fake selected.frame or alter a cart/price. The real
        // renderer is active only on the committed canonical artwork view.
        root.dispatchEvent(new CustomEvent('product:media-change', { detail: {
          mediaId: committedId,
          isCustomPreview: committedId === artworkId,
        } }));
      },
    });
  };
  globalThis.PosterOriginalArtworkMedia = Object.freeze({ create });
})();
