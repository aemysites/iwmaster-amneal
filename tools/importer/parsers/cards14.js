/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as in the example
  const headerRow = ['Cards (cards14)'];

  // Get all card containers (direct children with class e-con-full and max-h-402)
  const cardContainers = Array.from(element.querySelectorAll(':scope > .e-con-full.max-h-402'));

  const rows = cardContainers.map(card => {
    // Image in first cell
    let imgEl = null;
    const imageWidget = card.querySelector('.elementor-widget-image');
    if (imageWidget) {
      imgEl = imageWidget.querySelector('img');
    }

    // Text content in second cell
    // Get the text-editor widget
    let textContent = null;
    const textWidget = card.querySelector('.elementor-widget-text-editor');
    if (textWidget) {
      // Use just the children of the widget-container to avoid container div
      const widgetContainer = textWidget.querySelector('.elementor-widget-container') || textWidget;
      // We'll use all children to preserve formatting
      textContent = Array.from(widgetContainer.childNodes);
    } else {
      textContent = [];
    }

    // Button (CTA), goes below text, if present
    let btnEl = null;
    const btnWidget = card.querySelector('.elementor-widget-button');
    if (btnWidget) {
      btnEl = btnWidget.querySelector('a');
    }

    // Compose text cell: textContent + <br> + btn (if present)
    let cellContent = [];
    if (textContent && textContent.length > 0) {
      cellContent = cellContent.concat(textContent);
    }
    if (btnEl) {
      if (cellContent.length > 0) {
        cellContent.push(document.createElement('br'));
      }
      cellContent.push(btnEl);
    }
    if (cellContent.length === 0) cellContent = [''];

    return [imgEl, cellContent];
  });

  // Assemble final cells array
  const cells = [headerRow, ...rows];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace
  element.replaceWith(block);
}
