/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const rows = [['Cards (cards21)']];

  // Helper: get all top-level grid containers
  // In this block, there are two card rows, each card is a .e-con-full[data-settings] inside an .e-grid (the outermost .e-grid in each half)
  const gridContainers = Array.from(element.querySelectorAll(':scope > .elementor-element.e-grid.e-con'));

  let cardsFound = false;

  gridContainers.forEach((grid) => {
    const cardContainers = Array.from(grid.querySelectorAll(':scope > .e-con-full[data-settings]'));
    cardContainers.forEach((card) => {
      // Image/Icon: first img in card
      const img = card.querySelector('img');
      // Text: collect all .elementor-widget-container descendants that are not an image container and have non-empty text
      const textBlocks = [];
      card.querySelectorAll('.elementor-widget-container').forEach((wcont) => {
        if (!wcont.querySelector('img') && wcont.textContent.trim()) {
          textBlocks.push(wcont);
        }
      });
      let textCell = '';
      if (textBlocks.length === 1) {
        textCell = textBlocks[0];
      } else if (textBlocks.length > 1) {
        textCell = textBlocks;
      }
      rows.push([
        img || '',
        textCell
      ]);
      cardsFound = true;
    });
  });

  // Fallback for direct .e-con-full[data-settings] if not found in grid containers
  if (!cardsFound) {
    const cardContainers = Array.from(element.querySelectorAll(':scope > .e-con-full[data-settings]'));
    cardContainers.forEach((card) => {
      const img = card.querySelector('img');
      const textBlocks = [];
      card.querySelectorAll('.elementor-widget-container').forEach((wcont) => {
        if (!wcont.querySelector('img') && wcont.textContent.trim()) {
          textBlocks.push(wcont);
        }
      });
      let textCell = '';
      if (textBlocks.length === 1) {
        textCell = textBlocks[0];
      } else if (textBlocks.length > 1) {
        textCell = textBlocks;
      }
      rows.push([
        img || '',
        textCell
      ]);
    });
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
