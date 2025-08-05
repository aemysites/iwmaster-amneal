/* global WebImporter */
export default function parse(element, { document }) {
  // Get all top-level direct child containers (columns)
  const columns = Array.from(element.querySelectorAll(':scope > .elementor-element'));

  // We'll extract the two main columns: content and image
  let leftCol = null;
  let rightCol = null;

  // Heuristic: the column with the image is right, the other is left
  columns.forEach(col => {
    if (!rightCol && col.querySelector('img')) {
      rightCol = col;
    } else if (!leftCol) {
      leftCol = col;
    }
  });
  if (!leftCol) leftCol = columns[0];
  if (!rightCol) rightCol = columns[1];

  // LEFT COLUMN: gather all the content sections, preserving structure
  let leftContent = [];
  if (leftCol) {
    leftContent = Array.from(leftCol.querySelectorAll('.elementor-widget-container'))
      .filter(el => el.textContent.trim() || el.querySelector('a'));
  }

  // RIGHT COLUMN: get the image (should be the only real content)
  let rightContent = [];
  if (rightCol) {
    const img = rightCol.querySelector('img');
    if (img) rightContent.push(img);
  }

  // Header row: a single cell, to be rendered as colspan=2 by the importer
  const tableRows = [
    ['Columns (columns2)'],
    [leftContent, rightContent]
  ];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
