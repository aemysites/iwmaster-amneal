/* global WebImporter */
export default function parse(element, { document }) {
  // Build the header row
  const headerRow = ['Cards (cards33)'];
  const rows = [headerRow];

  // Select all direct card containers (each card is a child div)
  const cardContainers = Array.from(element.querySelectorAll(':scope > div'));

  cardContainers.forEach(cardEl => {
    // Try to find the image for the card (first image in the card)
    const imgEl = cardEl.querySelector('img');

    // The text content is in two .elementor-widget-text-editor .elementor-widget-container
    const textWidgets = cardEl.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container');

    // If no text widgets or image, skip this card
    if (!imgEl || textWidgets.length === 0) return;

    // Create a wrapper to hold all text content for this card
    const textContent = document.createElement('div');
    textWidgets.forEach(widget => {
      // Append the actual existing element, not a clone
      textContent.appendChild(widget);
    });

    // Add this card as a row: [image, text content]
    rows.push([
      imgEl,
      textContent
    ]);
  });

  // Only replace if there is at least one card
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
