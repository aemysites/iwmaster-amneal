/* global WebImporter */
export default function parse(element, { document }) {
  // Block header, exactly as required
  const headerRow = ['Cards (cards22)'];

  // Find all card containers (loop items)
  const cards = element.querySelectorAll('.elementor-loop-container > div[data-elementor-type="loop-item"]');

  // Build each card row
  const rows = Array.from(cards).map(card => {
    // First column: image (mandatory)
    const img = card.querySelector('img');
    // Second column: text content
    // Find the excerpt/quote widget
    const excerptWidget = card.querySelector('.elementor-widget-theme-post-excerpt .elementor-widget-container');
    // Find the author widget
    const authorWidget = card.querySelector('.elementor-widget-text-editor .elementor-widget-container');

    // Compose text cell:
    // excerpt followed by <br> and then author in <em>
    const textFragment = document.createDocumentFragment();
    if (excerptWidget) {
      textFragment.append(excerptWidget);
    }
    if (authorWidget) {
      textFragment.append(document.createElement('br'));
      // Instead of cloning, move the existing element and wrap in <em>
      const em = document.createElement('em');
      // Use the text content from the original, preserve innerHTML
      em.innerHTML = authorWidget.innerHTML;
      textFragment.append(em);
    }
    return [img, textFragment];
  });

  // Compose the final rows (header + card rows)
  const tableRows = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
