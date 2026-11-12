(() => {
  if (window.posterShopTabsReady) return;
  window.posterShopTabsReady = true;
  function activate(root, tab, focus = false) {
    const tabs = Array.from(root.querySelectorAll('[data-shop-tab]'));
    if (!tabs.includes(tab)) return;
    for (const item of tabs) {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(item.getAttribute('aria-controls'));
      if (panel) panel.hidden = !active;
    }
    if (focus) tab.focus();
  }

  document.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-shop-tab]');
    if (tab) activate(tab.closest('[data-poster-shop]'), tab);
  });
  document.addEventListener('keydown', (event) => {
    const tab = event.target.closest('[data-shop-tab]');
    if (!tab || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const root = tab.closest('[data-poster-shop]');
    const tabs = Array.from(root.querySelectorAll('[data-shop-tab]'));
    let index = tabs.indexOf(tab);
    if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = tabs.length - 1;
    else index = (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    event.preventDefault();
    activate(root, tabs[index], true);
  });
  document.addEventListener('shopify:block:select', (event) => {
    const tab = event.target.closest('[data-shop-tab]');
    if (tab) activate(tab.closest('[data-poster-shop]'), tab);
  });
  document.addEventListener('poster:category-select', (event) => {
    const category = String(event.detail || '').trim().toLowerCase();
    for (const root of document.querySelectorAll('[data-poster-shop]')) {
      const tab = Array.from(root.querySelectorAll('[data-shop-tab]')).find((item) => item.textContent.trim().toLowerCase() === category);
      if (tab) activate(root, tab);
    }
  });
})();
