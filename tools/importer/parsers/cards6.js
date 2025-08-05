/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards6) block: 2 columns, each row is a card: [image/icon, text content]

  // Find the card grid container (which holds the columns for cards)
  const grid = element.querySelector('.e-grid');
  if (!grid) return;

  // Helper: Find all direct '.e-con-full.e-flex.e-con.e-child' children of the grid as cards
  const cardCols = Array.from(grid.children).filter(child =>
    child.classList.contains('e-con-full') &&
    child.classList.contains('e-flex') &&
    child.classList.contains('e-con') &&
    child.classList.contains('e-child')
  );

  // Helper: For each card column, find the first following sibling '.elementor-widget-text-editor' (footnote block)
  function findFootnoteBlock(cardCol) {
    let next = cardCol.nextElementSibling;
    while (next) {
      if (next.classList.contains('elementor-widget-text-editor')) {
        const foot = next.querySelector('.elementor-widget-container');
        if (foot && foot.textContent.trim()) {
          return foot;
        }
      }
      next = next.nextElementSibling;
    }
    return null;
  }

  // For each card, build a [image/icon, text content] row
  const cardRows = cardCols.map(cardCol => {
    // Find the card image/icon (first <img> in the col)
    const img = cardCol.querySelector('img');

    // Gather all text content in the card in DOM order
    // Only .elementor-widget-container descendants (covers all content, including titles, descriptions, etc)
    let textBlocks = [];
    cardCol.querySelectorAll('.elementor-widget-container').forEach(block => {
      // Exclude those that only wrap an image
      if (!block.querySelector('img')) {
        textBlocks.push(block);
      }
    });

    // Attach relevant footnote block (from the next siblings of the cardCol, if any)
    const footnote = findFootnoteBlock(cardCol);
    if (footnote) {
      textBlocks.push(footnote);
    }

    // Build the text cell
    let textCell;
    if (textBlocks.length === 1) {
      textCell = textBlocks[0];
    } else {
      textCell = document.createElement('div');
      textBlocks.forEach(tb => textCell.append(tb));
    }

    return [img, textCell];
  });

  // Table header row
  const headerRow = ['Cards (cards6)'];
  const cells = [headerRow, ...cardRows];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
