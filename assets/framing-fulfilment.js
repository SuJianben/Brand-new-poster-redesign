(() => {
  const connections = new WeakMap();
  const packagingCopy = /\b(?:rolled|rolls?|tubes?|tube-packed)\b/i;

  // These are presentation fields published by the actual framing selection.
  // A positive add-on price can also be a mount, so it is never a frame signal.
  const isFittedBlackFrame = (frame) => Boolean(frame
    && /^[1-9]\d*$/.test(String(frame.id))
    && frame.available === true
    && frame.styleSlug === 'black-wood');

  const capture = (node) => ({
    node,
    hidden: node.hidden,
    display: node.style.getPropertyValue('display'),
    priority: node.style.getPropertyPriority('display'),
  });
  const restore = ({ node, hidden, display, priority }) => {
    node.hidden = hidden;
    if (display) node.style.setProperty('display', display, priority);
    else node.style.removeProperty('display');
  };
  const conceal = ({ node }) => {
    node.hidden = true;
    // Existing theme classes can have display:flex, which overrides [hidden].
    node.style.setProperty('display', 'none', 'important');
  };

  const connect = (root) => {
    if (!root || (root.dataset.psProductContext !== 'default'
        && !root.hasAttribute('data-pf-photo-customizer')
        && !root.hasAttribute('data-pf-framing-assembled-scope'))) return null;
    if (connections.has(root)) return connections.get(root);
    const form = root.querySelector('.ps-form');
    const assembled = form?.querySelector('[data-pf-framing-assembled]');
    if (!form || !assembled) return null;
    const unframed = [...form.querySelectorAll('[data-pf-framing-unframed]'),
      ...[...form.querySelectorAll('[data-pf-framing-packaging]')]
        .filter((node) => packagingCopy.test(node.textContent || ''))];
    const original = [...new Set(unframed)].map(capture);
    const assembledOriginal = capture(assembled);
    let disposed = false;
    const update = (frame) => {
      const fitted = isFittedBlackFrame(frame);
      original.forEach(fitted ? conceal : restore);
      if (fitted) {
        assembled.hidden = false;
        assembled.style.removeProperty('display');
      } else conceal(assembledOriginal);
    };
    const onPricing = (event) => {
      if (Object.prototype.hasOwnProperty.call(event.detail || {}, 'frame')) {
        update(event.detail.frame);
      }
    };
    const dispose = () => {
      if (disposed) return;
      disposed = true;
      root.removeEventListener('product:framing-price-change', onPricing);
      root.removeEventListener('shopify:section:unload', dispose);
      original.forEach(restore);
      restore(assembledOriginal);
      connections.delete(root);
    };
    const connection = Object.freeze({ dispose });
    connections.set(root, connection);
    root.addEventListener('product:framing-price-change', onPricing);
    root.addEventListener('shopify:section:unload', dispose);
    update(null);
    return connection;
  };

  globalThis.PosterFramingFulfilment = Object.freeze({ connect });
})();
