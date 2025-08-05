/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with exact block name
  const headerRow = ['Hero (hero24)'];

  // Background image is optional, not present in this element
  const bgRow = [''];

  // The main content row: use the main content inside the widget
  // Look for the h3 inside the structure
  let contentCell;
  const widgetContainer = element.querySelector('.elementor-widget-container');
  if (widgetContainer) {
    // If the widget container only contains the h3, return it directly
    const nodes = Array.from(widgetContainer.childNodes).filter(n => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim() !== ''));
    if (nodes.length === 1 && nodes[0].tagName && nodes[0].tagName.match(/^H[1-6]$/i)) {
      contentCell = nodes[0];
    } else {
      // There are multiple nodes or a different structure; include all as a fragment
      const frag = document.createDocumentFragment();
      nodes.forEach(n => frag.appendChild(n));
      contentCell = frag;
    }
  } else {
    // fallback, use the first heading or the element itself
    const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      contentCell = heading;
    } else {
      contentCell = element;
    }
  }

  const contentRow = [contentCell];

  // Build the table according to block spec
  const cells = [headerRow, bgRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
