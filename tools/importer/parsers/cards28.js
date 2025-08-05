/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Finds the first descendant img in a container
  function findImage(el) {
    return el.querySelector('img');
  }

  // Helper: Extract text blocks for the right cell of each card
  function extractTextContent(cardEl) {
    const blocks = [];
    // There may be two text-editor widgets at the top level: title and description
    cardEl.querySelectorAll(':scope > .elementor-widget-text-editor').forEach(widget => {
      const container = widget.querySelector('.elementor-widget-container');
      if (container) blocks.push(container);
    });
    // There is a nested container with icon and label below: grab the label text
    const nested = cardEl.querySelector('.e-con-full.e-flex.e-con.e-child:not([data-id="' + cardEl.dataset.id + '"])');
    if (nested) {
      nested.querySelectorAll('.elementor-widget-text-editor').forEach(widget => {
        const container = widget.querySelector('.elementor-widget-container');
        if (container) blocks.push(container);
      });
    }
    // Any pill-img at this level (hidden-desktop): add it as well (mobile image)
    const pillImg = cardEl.querySelector('.pill-img img');
    if (pillImg) blocks.push(pillImg);
    return blocks;
  }

  // Build the cards array
  const cards = Array.from(element.querySelectorAll(':scope > .card-capsule'));
  const cells = [['Cards (cards28)']];

  cards.forEach(cardEl => {
    // Get the icon for the card (from nested .e-con or fallback first img)
    let iconImg = null;
    const nested = cardEl.querySelector('.e-con-full.e-flex.e-con.e.child:not([data-id="' + cardEl.dataset.id + '"])');
    if (nested) {
      iconImg = findImage(nested);
    }
    if (!iconImg) {
      iconImg = cardEl.querySelector('img');
    }
    // The right cell: all text content and any mobile image at the end
    const rightCellContent = extractTextContent(cardEl);
    cells.push([
      iconImg,
      rightCellContent
    ]);
  });

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
