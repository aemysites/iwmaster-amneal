/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the columns block (must match exactly)
  const headerRow = ['Columns (columns34)'];

  // Find the main layout wrapper
  const inner = element.querySelector('.e-con-inner');
  if (!inner) return;
  const columnParents = inner.querySelectorAll(':scope > .e-con');
  if (columnParents.length < 2) return;

  // LEFT COLUMN: Video overlay image and link to the iframe src
  let leftCellContent = [];
  const leftCol = columnParents[0];
  const videoWidget = leftCol.querySelector('.elementor-widget-video');
  if (videoWidget) {
    // Try to find overlay image by .elementor-custom-embed-image-overlay
    const overlay = videoWidget.querySelector('.elementor-custom-embed-image-overlay');
    if (overlay && overlay.style.backgroundImage) {
      // Extract the image URL from background-image style
      const bg = overlay.style.backgroundImage;
      const match = /url\(["']?(.*?)["']?\)/.exec(bg);
      if (match && match[1]) {
        const img = document.createElement('img');
        img.src = match[1];
        img.alt = '';
        img.loading = 'lazy';
        leftCellContent.push(img);
      }
    }
    // Find the iframe and convert to a link
    const iframe = videoWidget.querySelector('iframe[src]');
    if (iframe) {
      const link = document.createElement('a');
      link.href = iframe.src;
      link.textContent = iframe.src;
      leftCellContent.push(link);
    }
  }
  // If nothing found (should not occur), fallback to leftCol
  if (leftCellContent.length === 0) {
    leftCellContent.push(leftCol);
  }

  // RIGHT COLUMN: Text, heading, button, footnotes, etc.
  const rightCol = columnParents[1];
  const actualCol = rightCol.querySelector('.e-con');
  let rightCellContent = [];
  if (actualCol) {
    const widgets = actualCol.querySelectorAll(':scope > .elementor-widget');
    widgets.forEach(widget => {
      const cont = widget.querySelector('.elementor-widget-container');
      if (cont) rightCellContent.push(cont);
    });
  } else {
    // fallback: all .elementor-widget-container under rightCol
    const widgets = rightCol.querySelectorAll('.elementor-widget-container');
    rightCellContent = Array.from(widgets);
  }

  // Compose table
  const cells = [
    headerRow,
    [leftCellContent, rightCellContent],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
