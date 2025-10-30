// Utility to enhance Vuetify v-data-table on mobile by setting data-label on each cell
// so CSS can render header labels inside card-styled rows.

export function applyMobileTableLabels(root = document) {
  try {
    const tables = root.querySelectorAll('.v-data-table');
    tables.forEach((table) => {
      const headerCells = table.querySelectorAll('thead th');
      const headers = Array.from(headerCells).map((th) => th.textContent?.trim() || '');
      if (!headers.length) return;

      const setLabels = () => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((tr) => {
          const cells = tr.querySelectorAll('td');
          cells.forEach((td, idx) => {
            const label = headers[idx] || '';
            if (label) td.setAttribute('data-label', label);
          });
        });
      };

      // Run now and also observe changes (pagination/sorting/data load)
      setLabels();

      if (!table.__mobileTableObserver) {
        const observer = new MutationObserver(() => setLabels());
        observer.observe(table, { childList: true, subtree: true });
        table.__mobileTableObserver = observer;
      }
    });
  } catch (e) {
    console.warn('[mobileTable] Failed to apply labels:', e);
  }
}
