/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two primary columns: left (text/button), right (image)
  // We expect this structure: top-level container with two children
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Fallback: if not exactly two columns, try to identify by content
  let leftCol = null;
  let rightCol = null;
  if (children.length === 2) {
    leftCol = children[0];
    rightCol = children[1];
  } else {
    // Try to find by content: one with h4/p/a, another with img
    children.forEach((col) => {
      if (!leftCol && col.querySelector('h1,h2,h3,h4,h5,h6,p,a')) leftCol = col;
      if (!rightCol && col.querySelector('img')) rightCol = col;
    });
  }

  // Left Column: Gather all elements except images
  let leftContent = [];
  if (leftCol) {
    // Only direct children of leftCol that are not images or containers holding only images
    Array.from(leftCol.children).forEach((child) => {
      if (child.querySelector && child.querySelector('img')) return;
      leftContent.push(child);
    });
    // If leftContent is empty, fallback: use all children that are not img
    if (leftContent.length === 0) {
      leftContent = Array.from(leftCol.querySelectorAll(':scope > *:not(:has(img))'));
    }
    // If still empty, fallback to whole leftCol
    if (leftContent.length === 0) leftContent = [leftCol];
  }

  // Right Column: Should be the image (only the image, not the wrapper)
  let rightContent = [];
  if (rightCol) {
    const img = rightCol.querySelector('img');
    if (img) rightContent.push(img);
    // If no image found, fallback to rightCol
    if (rightContent.length === 0) rightContent = [rightCol];
  }

  // Construct the rows for the block table
  const rows = [
    ['Columns (columns7)'], // The header, per requirements
    [leftContent, rightContent]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the element with the new table
  element.replaceWith(table);
}
