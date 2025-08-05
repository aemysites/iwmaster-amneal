/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero23)'];

  // 2. Background image row - intentionally left empty as per instructions
  const backgroundRow = [''];

  // 3. Content row: collect all main content widgets in source order
  const mainContent = element.querySelector('.e-con-inner') || element;
  // Get all direct children of mainContent that are widgets or containers of widgets
  const children = Array.from(mainContent.children);
  const contentElements = [];
  children.forEach(child => {
    // If the child is a widget, add directly
    if (child.classList.contains('elementor-widget')) {
      contentElements.push(child);
    } else if (child.classList.contains('e-con')) {
      // If the child is a container, add all widgets within it (direct children only)
      Array.from(child.children).forEach(subchild => {
        if (subchild.classList.contains('elementor-widget')) {
          contentElements.push(subchild);
        }
      });
    }
  });
  // If no content found, cell should be blank
  const contentRow = [contentElements.length > 0 ? contentElements : ['']];

  // Compose the table with exactly 3 rows and 1 column
  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];
  
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
