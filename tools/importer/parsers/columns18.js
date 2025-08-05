/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matching the exact block name
  const headerRow = ['Columns (columns18)'];

  // Find the main nav menu (the visible one)
  let nav = element.querySelector('nav:not([aria-hidden="true"])');
  if (!nav) {
    nav = element.querySelector('nav');
  }

  // Fallback: if there is no nav, use the first child
  let content;
  if (nav) {
    // Use the <ul> directly (preserves all text and links)
    const ul = nav.querySelector('ul.elementor-nav-menu');
    if (ul) {
      content = ul;
    } else {
      content = nav;
    }
  } else {
    // Use all children if for some reason there is no nav
    const children = Array.from(element.children);
    if (children.length) {
      content = children;
    } else {
      // Fallback to text if element is empty
      content = [document.createTextNode(element.textContent || '')];
    }
  }

  // Always wrap cell content in an array (per table cell requirements)
  const row = [Array.isArray(content) ? content : [content]];

  // Create the block table
  const cells = [headerRow, row];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
