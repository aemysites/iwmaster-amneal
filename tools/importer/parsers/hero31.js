/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as in the example
  const headerRow = ['Hero (hero31)'];

  // Helper: Get first image in the block (for hero asset)
  let imageElement = element.querySelector('img');
  // If no image, provide empty string for the image row

  // Helper: Get all possible heading and paragraph content for the hero text cell
  // We'll search in logical order, using the structure of the provided HTML
  let textContent = [];

  // Find heading(s): prefer h1-h6, else use any <h> element or <h4> as fallback
  // Keep only the first heading, as in the example markdown
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    textContent.push(heading);
  }

  // Find all paragraphs (as in the example, multiple <p> are shown below heading)
  const paragraphs = element.querySelectorAll('p');
  if (paragraphs.length > 0) {
    paragraphs.forEach(p => textContent.push(p));
  }

  // Fallback: If nothing, try text-editor widgets directly
  if (textContent.length === 0) {
    const textEditors = element.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container');
    textEditors.forEach(te => textContent.push(te));
  }

  // Edge case: If still no text, add empty string
  if (textContent.length === 0) {
    textContent = [''];
  }

  // Compose table as per example (header, image, text)
  const cells = [
    headerRow,
    [imageElement || ''],
    [textContent]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
