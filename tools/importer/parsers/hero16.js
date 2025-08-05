/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match exactly
  const headerRow = ['Hero (hero16)'];

  // The second row is for the background image, which this block does NOT have (it's a CSS gradient/image)
  // so the cell is left empty (as per the requirements and screenshot example)

  // The third row is for all the text content (subheading, heading, description)
  // We want to preserve the semantic structure from the HTML.

  // The structure is:
  // .e-con-inner > .e-con.e-child > several .elementor-widget-container divs (containing p, h3, etc)
  const inner = element.querySelector('.e-con-inner');
  if (!inner) return;
  const contentContainer = inner.querySelector('.e-con.e-child');
  if (!contentContainer) return;

  // Get all .elementor-widget-container children (direct only)
  const widgetContainers = contentContainer.querySelectorAll(':scope > .elementor-element > .elementor-widget-container');
  // Collect them in order, skipping empty containers
  const contentBlocks = [];
  widgetContainers.forEach((container) => {
    if (container.textContent.trim() || container.querySelector('img')) {
      contentBlocks.push(container);
    }
  });

  // Create the table with the required format: 1 column, 3 rows
  const cells = [
    headerRow,
    [''], // Background image row is empty
    [contentBlocks]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
