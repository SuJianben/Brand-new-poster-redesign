(() => {
  function initGroup(group) {
    if (group.dataset.accordionReady) return;
    group.dataset.accordionReady = 'true';
    const summary = group.querySelector(':scope > summary');
    const body = group.querySelector(':scope > .odd-filters__body');
    if (!summary || !body) return;
    let animation;
    let expanded = group.open;
    summary.addEventListener('click', (event) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      event.preventDefault();
      expanded = !expanded;
      const start = group.getBoundingClientRect().height;
      animation?.cancel();
      group.open = true;
      group.style.overflow = 'hidden';
      const end = expanded ? summary.offsetHeight + body.offsetHeight : summary.offsetHeight;
      animation = group.animate([{ height: `${start}px` }, { height: `${end}px` }], {
        duration: 280,
        easing: 'cubic-bezier(.2,.7,.2,1)',
      });
      animation.onfinish = () => {
        group.open = expanded;
        group.style.overflow = '';
        animation = undefined;
      };
    });
  }
  function init() { document.querySelectorAll('.odd-filters__group').forEach(initGroup); }
  init();
  document.addEventListener('shopify:section:load', init);
})();
