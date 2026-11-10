(() => {
  const ROLLOUT_VERSION = 'round-rods-2026-09-28';

  const create = (root, navigate) => {
    if (root?.dataset.psHangerRollout !== ROLLOUT_VERSION) return null;
    const thumbnails = [...root.querySelectorAll('[data-ps-media]')];
    const artwork = thumbnails.find((item) => item.dataset.mediaRole === 'artwork');
    const hanger = thumbnails.find((item) => item.dataset.mediaRole === 'hanger');
    const comparison = thumbnails.find((item) => item.dataset.mediaRole === 'comparison');
    if (!artwork || !hanger || !comparison) return null;

    const lookup = new Map(thumbnails.map((item) => [item.dataset.mediaId, item]));
    let hasFramingSelection = false;
    let activeId = hanger.dataset.mediaId;
    const roleFor = (id) => lookup.get(String(id))?.dataset.mediaRole || 'gallery';
    const trackView = (role, id) => {
      const event = {
        comparison: 'product_display_options_viewed',
        artwork: 'product_artwork_preview_viewed',
        hanger: 'product_hanger_main_viewed',
      }[role];
      if (!event) return;
      window.dataLayer?.push({
        event,
        product_id: root.dataset.psProductId || null,
        media_id: String(id),
        media_role: role,
        rollout_version: ROLLOUT_VERSION,
      });
    };
    const committed = (id, { track = true } = {}) => {
      activeId = String(id);
      const role = roleFor(activeId);
      root.dataset.psActiveMediaRole = role;
      if (track) trackView(role, activeId);
    };

    committed(activeId, { track: false });
    return {
      artworkMediaId: artwork.dataset.mediaId,
      hangerMediaId: hanger.dataset.mediaId,
      isCustomPreview: (id) => roleFor(id) === 'artwork',
      requested(id) { activeId = String(id); },
      committed,
      variantMediaId(id) {
        // Shopify variants can retain their pre-rollout artwork association.
        // On size changes, keep a selected frame preview on the clean artwork;
        // otherwise return to the real, included-hanger product image.
        if (!id || !lookup.has(String(id))) return null;
        return hasFramingSelection ? artwork.dataset.mediaId : hanger.dataset.mediaId;
      },
      framingChanged(hasSelection) {
        const removedLastSelection = hasFramingSelection && !hasSelection;
        hasFramingSelection = Boolean(hasSelection);
        if (removedLastSelection && roleFor(activeId) === 'artwork') {
          navigate(hanger.dataset.mediaId);
        }
      },
    };
  };

  globalThis.PosterProductMediaRoles = Object.freeze({ create });
})();
