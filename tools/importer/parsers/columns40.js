/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly one cell, as per requirements and example
  const headerRow = ['Columns (columns40)'];

  // Find the e-con-inner container
  const inner = element.querySelector('.e-con-inner');
  if (!inner) return;

  // Get top-level column containers
  const columns = Array.from(inner.children);
  if (columns.length < 2) return;

  // LEFT COLUMN: Collect all content into a single wrapper div to ensure it is a single element/cell
  const leftCol = columns[0];
  const leftWrapper = document.createElement('div');
  leftWrapper.className = 'columns40-left';
  // Get all direct .elementor-widget descendants in leftCol
  leftCol.querySelectorAll(':scope > .elementor-element').forEach(widget => {
    const widgetContainer = widget.querySelector(':scope > .elementor-widget-container');
    if (widgetContainer) leftWrapper.appendChild(widgetContainer);
  });

  // RIGHT COLUMN: Find the image (if present)
  const rightCol = columns[1];
  let rightCell = '';
  const img = rightCol.querySelector('img');
  if (img) rightCell = img;

  // The cells: header is single cell, content row has two cells
  const cells = [
    headerRow,
    [leftWrapper, rightCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
