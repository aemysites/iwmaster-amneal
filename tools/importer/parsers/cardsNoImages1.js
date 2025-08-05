/* global WebImporter */
export default function parse(element, { document }) {
  // Find the container with the cards
  const postsContainer = element.querySelector('.elementor-posts-container');
  if (!postsContainer) return;
  
  // Find all article elements representing cards
  const articles = postsContainer.querySelectorAll('article.elementor-post');
  if (!articles.length) return;

  // Prepare the table's rows
  const cells = [];
  // Header row as in the example
  cells.push(['Cards']);

  // For each card/article, extract its content block and reference that in the table
  articles.forEach((article) => {
    // Collect the card content in an array
    const contentFragments = [];

    // Reference the image (with its link wrapper) if present
    const imgLink = article.querySelector('.elementor-post__thumbnail__link');
    if (imgLink) {
      contentFragments.push(imgLink);
    }
    // Reference the card text area (includes title/description/CTA)
    const textArea = article.querySelector('.elementor-post__text');
    if (textArea) {
      contentFragments.push(textArea);
    } else {
      // Fallback: Add any elementor-post__title or cta if present
      const title = article.querySelector('.elementor-post__title');
      if (title) contentFragments.push(title);
      const cta = article.querySelector('.elementor-post__read-more');
      if (cta) contentFragments.push(cta);
    }
    // Only add row if we have content
    if (contentFragments.length) {
      cells.push([contentFragments]);
    }
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
