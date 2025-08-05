/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main inner containers: left for text, right for button
  const containers = Array.from(element.querySelectorAll(':scope > .elementor-element'));

  // Left column: headline + description
  let leftContent = [];
  const leftCol = containers[0];
  if (leftCol) {
    // Get headline, should be an <h4>, but could be any heading
    const heading = leftCol.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) leftContent.push(heading);
    // Get paragraphs/text
    // Grab all .elementor-widget-text-editor .elementor-widget-container that are NOT headings
    const textEditors = leftCol.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container');
    for (const te of textEditors) {
      // Skip if it only contains the heading already added
      if (!heading || !heading.contains(te)) {
        leftContent.push(te);
      }
    }
  }

  // Right column: Button
  let rightContent = [];
  // Try all containers except the first (to avoid picking up the left content again)
  for (let i = 1; i < containers.length; i++) {
    const btn = containers[i].querySelector('a.elementor-button');
    if (btn) {
      rightContent.push(btn);
      break;
    }
  }

  // Table header and content
  const headerRow = ['Columns (columns32)'];
  const contentRow = [leftContent, rightContent];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
