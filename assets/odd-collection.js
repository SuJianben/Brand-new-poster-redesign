(() => {
  function init(root) {
    if (root.dataset.collectionReady) return;
    root.dataset.collectionReady = 'true';
    const mobileFilters = root.querySelector('.odd-collection__mobile-filters');
    if (mobileFilters && window.matchMedia('(max-width: 800px)').matches) mobileFilters.open = false;
    const sort = root.querySelector('[data-collection-sort]');
    sort?.addEventListener('change', () => sort.form?.requestSubmit());
    const filterForm = root.querySelector('.odd-filters');
    filterForm?.addEventListener('change', (event) => {
      if (event.target.matches('input[type="checkbox"], input[type="number"]')) {
        filterForm.requestSubmit();
      }
    });
    root.addEventListener('click', async (event) => {
      const link = event.target.closest('[data-collection-more]');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.dataset.loading) return;
      event.preventDefault();
      link.dataset.loading = 'true';
      link.setAttribute('aria-busy', 'true');
      try {
        const response = await fetch(link.href, { credentials: 'same-origin' });
        if (!response.ok) throw new Error('Unable to load products');
        const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
        const grid = root.querySelector('[data-collection-grid]');
        const nextGrid = doc.querySelector('[data-collection-grid]');
        const pagination = root.querySelector('[data-collection-pagination]');
        const nextPagination = doc.querySelector('[data-collection-pagination]');
        if (!grid || !nextGrid || !pagination || !nextPagination) throw new Error('Missing collection content');
        grid.append(...nextGrid.children);
        pagination.replaceWith(nextPagination);
      } catch {
        window.location.assign(link.href);
      }
    });
  }
  function initAll() { document.querySelectorAll('[data-odd-collection]').forEach(init); }
  initAll();
  document.addEventListener('shopify:section:load', initAll);
})();
