/** Only explicit paired material slots change; delivery rates/artist/security keep their existing owners. */
export function mountInformation(root, config, signal) {
  const doc = root.ownerDocument, states = new Map();
  let material = 'paper';
  const apply = () => {
    for (const [container] of states) {
      container.querySelector('[data-pf-copy-paper]').hidden = material !== 'paper';
      container.querySelector('[data-pf-copy-canvas]').hidden = material !== 'canvas';
    }
  };
  const discover = () => {
    doc.querySelectorAll('[data-pf-material-copy]').forEach(container => {
      if (container.dataset.pfMaterialPaperId !== config.paperId || states.has(container)) return;
      const paper = container.querySelector('[data-pf-copy-paper]'), canvas = container.querySelector('[data-pf-copy-canvas]');
      if (paper && canvas) states.set(container, { paper: paper.hidden, canvas: canvas.hidden });
    });
    apply();
  };
  doc.addEventListener('shopify:section:load', discover, { signal });
  discover();
  return { sync(selection) { material = selection.material; apply(); }, dispose() {
    for (const [container, before] of states) {
      container.querySelector('[data-pf-copy-paper]').hidden = before.paper;
      container.querySelector('[data-pf-copy-canvas]').hidden = before.canvas;
    }
    states.clear();
  } };
}
