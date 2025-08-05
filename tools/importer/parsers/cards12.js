/* global WebImporter */
export default function parse(element, { document }) {
  // Create table header, exactly matching the example
  const headerRow = ['Cards (cards12)'];
  const cells = [headerRow];

  // Find all article/card elements
  const articles = element.querySelectorAll('.elementor-post');
  articles.forEach((article) => {
    // FIRST CELL: image/icon (mandatory)
    let imgCell = '';
    const thumbImg = article.querySelector('.elementor-post__thumbnail img');
    if (thumbImg) {
      imgCell = thumbImg;
    }

    // SECOND CELL: text content (mandatory)
    const textCellContent = [];
    // Title: keep heading level (h3) and anchor
    const heading = article.querySelector('.elementor-post__title');
    if (heading) {
      textCellContent.push(heading);
    }
    // Excerpt/Description
    const excerpt = article.querySelector('.elementor-post__excerpt');
    if (excerpt && excerpt.textContent.trim()) {
      // Use the <p> from excerpt
      const para = excerpt.querySelector('p');
      if (para) textCellContent.push(para);
    }
    // CTA (Read story) (optional)
    const cta = article.querySelector('.elementor-post__read-more');
    if (cta) {
      textCellContent.push(cta);
    }
    cells.push([imgCell, textCellContent]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
