/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example block name exactly
  const headerRow = ['Columns (columns29)'];

  // The top-level element has two immediate child divs: left and right column
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length !== 2) return; // fail safe for unexpected input

  // --------- FIRST COLUMN (left content) ---------
  const left = columns[0];
  // The left column contains a series of nested containers, last of which contains content
  // Find the most deeply nested container (with actual widgets/text)
  let leftContentContainer = left;
  while (true) {
    const children = Array.from(leftContentContainer.children).filter(
      el => el.matches('.elementor-element') && el.querySelector('.elementor-widget-container')
    );
    if (children.length === 1) {
      leftContentContainer = children[0];
    } else {
      break;
    }
  }

  // Now gather all widgets in this left content container
  const leftWidgets = Array.from(leftContentContainer.querySelectorAll(':scope > .elementor-element'));
  const leftContent = [];
  for (const widget of leftWidgets) {
    const widgetContainer = widget.querySelector('.elementor-widget-container');
    if (widgetContainer) {
      // For button, grab the button itself
      const btn = widgetContainer.querySelector('a.elementor-button');
      if (btn) {
        leftContent.push(btn);
      } else {
        // For text, headings, paragraphs, etc. Push each child node
        Array.from(widgetContainer.childNodes).forEach(node => {
          if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
            leftContent.push(node);
          }
        });
      }
    }
  }

  // --------- SECOND COLUMN (right image/logo) ---------
  const right = columns[1];
  // The right column will also have a nested container, then the .elementor-widget-image -> .elementor-widget-container -> img
  let rightImg = null;
  // Find the first <img> in right column
  rightImg = right.querySelector('img');
  // If no image, cell is left empty

  // Now build final table structure
  const tableRows = [
    headerRow,
    [leftContent, rightImg ? [rightImg] : []]
  ];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
