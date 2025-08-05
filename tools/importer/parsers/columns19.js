/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner container holding columns
  const inner = element.querySelector('.e-con-inner');
  if (!inner) return;
  // Find direct column containers
  const columnDivs = Array.from(inner.children).filter(e => e.classList.contains('e-con'));
  // Defensive: expect 2 columns for the layout
  let leftCol = columnDivs[0];
  let rightCol = columnDivs[1];

  // LEFT COLUMN: title + desktop share buttons
  const leftContent = [];
  if (leftCol) {
    // Title
    const headingWidget = leftCol.querySelector('.elementor-widget-theme-post-title, .elementor-widget-heading');
    if (headingWidget) {
      const headingContainer = headingWidget.querySelector('.elementor-widget-container');
      if (headingContainer) leftContent.push(headingContainer);
    }
    // Desktop share buttons (not mobile)
    const desktopShareWidget = leftCol.querySelector('.elementor-widget-text-editor.elementor-hidden-mobile');
    if (desktopShareWidget) {
      leftContent.push(desktopShareWidget);
    }
  }

  // RIGHT COLUMN: image
  let rightContent = null;
  if (rightCol) {
    const imageWidget = rightCol.querySelector('.elementor-widget-image');
    if (imageWidget) {
      const imageContainer = imageWidget.querySelector('.elementor-widget-container');
      if (imageContainer) rightContent = imageContainer;
    }
  }

  // Ensure the header row is a single cell, the data row has two cells
  const cells = [
    ['Columns (columns19)'], // header row: one cell only
    [leftContent, rightContent] // content row: two columns
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
