/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row matches exactly the block name
  const headerRow = ['Hero (hero39)'];

  // 2. Get the image (if any) - should be in its own row
  let imageEl = null;
  // Traverse children to find the first <img>
  const img = element.querySelector('img');
  if (img) {
    imageEl = img;
  }
  const imageRow = [imageEl ? imageEl : ''];

  // 3. Get title, subheading, cta, etc in a single cell
  // We'll gather all h1-h6, p, and button/a in correct order as they appear visually
  // The source is nested, so we'll scan with a breadth-first traversal
  const contentEls = [];
  const queue = Array.from(element.children);
  while(queue.length) {
    const node = queue.shift();
    // If this node contains any of our target elements directly, add them in DOM order
    const found = Array.from(node.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > p, :scope > a.elementor-button'));
    if (found.length > 0) {
      contentEls.push(...found);
    }
    // If node is a container, scan its children
    const isContainer = node !== img && node.children && node.children.length && !found.length;
    if (isContainer) {
      queue.push(...node.children);
    }
  }

  // De-duplication (if any elements were added more than once)
  const seen = new Set();
  const contentUnique = contentEls.filter(el => {
    if (seen.has(el)) return false;
    seen.add(el);
    return true;
  });

  const contentRow = [contentUnique];

  // 4. Assemble table: 1 column, 3 rows
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
