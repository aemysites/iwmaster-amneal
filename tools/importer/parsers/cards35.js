/* global WebImporter */
export default function parse(element, { document }) {
  // Header row per example
  const headerRow = ['Cards (cards35)'];
  const tableRows = [];
  // Find the article cards
  const postsContainer = element.querySelector('.elementor-posts-container');
  if (!postsContainer) return;
  const cardArticles = postsContainer.querySelectorAll(':scope > article.elementor-post');
  cardArticles.forEach((article) => {
    // Image cell (left): use <img> if present
    let imageCell = '';
    const imgEl = article.querySelector('.elementor-post__thumbnail img');
    if (imgEl) {
      imageCell = imgEl;
    }
    // Text content cell (right): collect title, excerpt, CTA
    const cellContent = [];
    // Heading (title): use heading wrapper if present, but reference existing DOM
    const h3 = article.querySelector('.elementor-post__title h3, .elementor-post__title');
    if (h3) {
      // If h3 wraps link, use as is; else, create h3 and move the a inside
      if (h3.tagName.toLowerCase() === 'h3') {
        cellContent.push(h3);
      } else {
        // wrap in h3 if not already
        const titleLink = h3.querySelector('a');
        if (titleLink) {
          const h3el = document.createElement('h3');
          h3el.appendChild(titleLink);
          cellContent.push(h3el);
        }
      }
    }
    // Excerpt (description)
    const excerpt = article.querySelector('.elementor-post__excerpt');
    if (excerpt) {
      // Can contain <p> or text
      Array.from(excerpt.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          cellContent.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = node.textContent;
          cellContent.push(p);
        }
      });
    }
    // CTA
    const cta = article.querySelector('.elementor-post__read-more');
    if (cta) {
      cellContent.push(cta);
    }
    tableRows.push([imageCell, cellContent]);
  });
  const table = WebImporter.DOMUtils.createTable([headerRow, ...tableRows], document);
  element.replaceWith(table);
}
