/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be a single cell (not multiple columns)
  const headerRow = ['Columns (columns38)'];

  // Gather immediate inner container (usually the next div inside)
  let contentColumns = [];
  const inner = element.querySelector(':scope > div');
  if (inner) {
    // Each direct child div of the inner container is a column
    const widgets = Array.from(inner.children);
    if (widgets.length) {
      contentColumns = widgets.map(widget => {
        const container = widget.querySelector('.elementor-widget-container');
        if (container) {
          // Collect all child nodes, preserving structure (text, headings, etc.)
          return Array.from(container.childNodes).filter(node => {
            return !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
          });
        } else {
          return Array.from(widget.childNodes).filter(node => {
            return !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
          });
        }
      });
    }
  }
  if (!contentColumns.length) {
    contentColumns = [[element.innerText]];
  }

  // The cells structure must have one array for the header row (single cell),
  // and one array for the content row (N columns as needed)
  const cells = [
    headerRow, // single cell
    contentColumns // N cells for N columns in the content row
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
