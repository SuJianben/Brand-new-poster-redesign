export function mountMedia(root, host, config, signal) {
  const paper = root.querySelector('.ps-media-stage');
  const gallery = root.querySelector('[data-pf-canvas-gallery]');
  const image = gallery?.querySelector('[data-pf-canvas-image]');
  const description = gallery?.querySelector('[data-pf-canvas-media-caption]');
  const caption = root.querySelector('.pf-black-frame-caption');
  if (!paper || !gallery || !image) throw new Error('Material gallery is unavailable');
  const serverCanvas = paper.hasAttribute('data-pf-paper-media-guard');
  const original = { hidden: paper.hidden, style: paper.getAttribute('style'), captionHidden: caption?.hidden,
    captionStyle: caption?.getAttribute('style'), galleryHidden: gallery.hidden, galleryStyle: gallery.getAttribute('style') };
  const style = (node, value) => value == null ? node.removeAttribute('style') : node.setAttribute('style', value);
  const show = mediaId => {
    const item = config.media.find(row => row.id === mediaId);
    if (!item) return;
    image.src = item.src; image.alt = item.alt;
    image.width = item.width; image.height = item.height;
    if (description) description.textContent = item.alt;
    gallery.querySelectorAll('[data-pf-canvas-thumbnail]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.pfCanvasThumbnail === mediaId));
    });
  };
  gallery.querySelectorAll('[data-pf-canvas-thumbnail]').forEach(button => {
    button.addEventListener('click', () => show(button.dataset.pfCanvasThumbnail), { signal });
  });
  return {
    sync(selection) {
      const canvas = selection.material === 'canvas';
      paper.hidden = canvas || (!serverCanvas && original.hidden); gallery.hidden = !canvas;
      style(paper, canvas ? 'display:none!important' : serverCanvas ? null : original.style);
      style(gallery, canvas ? null : 'display:none!important');
      if (caption) {
        caption.hidden = canvas || (!serverCanvas && Boolean(original.captionHidden));
        style(caption, canvas ? 'display:none!important' : serverCanvas ? null : original.captionStyle);
      }
      if (canvas) show(selection.variant.mediaId);
    },
    dispose() {
      paper.hidden = original.hidden; style(paper, original.style);
      if (caption) { caption.hidden = original.captionHidden; style(caption, original.captionStyle); }
      show(gallery.dataset.pfCanvasInitialMedia);
      gallery.hidden = original.galleryHidden; style(gallery, original.galleryStyle);
    },
  };
}
