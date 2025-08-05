/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards block container for the sidebar cards
  const postsBlock = element.querySelector('.elementor-element-980c81c');
  if (!postsBlock) return;
  const postsContainer = postsBlock.querySelector('.elementor-posts-container');
  if (!postsContainer) return;
  const cards = postsContainer.querySelectorAll('.elementor-post');

  const rows = [];
  // Header row
  rows.push(['Cards (cards37)']);

  // For each card, extract the image and ALL associated text content
  cards.forEach(card => {
    // First cell: image (first <img> found in the card)
    const img = card.querySelector('img');
    // Second cell: collect all text content (title, description, CTA)
    const textEls = [];
    // Get the main text container
    const textContainer = card.querySelector('.elementor-post__text');
    if (textContainer) {
      // Include all direct children for richest content (title, description, CTA)
      Array.from(textContainer.children).forEach(child => {
        textEls.push(child);
      });
    }
    // Fallback: if no text container, try all <h3> and <a> in the card
    if (!textEls.length) {
      card.querySelectorAll('h3, a').forEach(el => textEls.push(el));
    }
    // Only add row if we have either an image or text
    if (img || textEls.length) {
      rows.push([
        img || '',
        textEls.length === 1 ? textEls[0] : textEls
      ]);
    }
  });

  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
