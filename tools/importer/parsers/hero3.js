/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Block header row
  const headerRow = ['Hero (hero3)'];

  // 2. Background row (no image/background found in this snippet)
  const backgroundRow = [''];

  // 3. Title/CTA row: gather content
  // Find first heading (any level) in subtree
  let headingEl = null;
  let ctaEls = [];

  // Look for first heading (h1-h6)
  headingEl = element.querySelector('h1, h2, h3, h4, h5, h6');

  // Find button CTA (link with .elementor-button)
  const buttonLink = element.querySelector('a.elementor-button');

  // Find arrow image in CTA if present (img inside a.elementor-widget-image)
  // We'll reference the <img> only, not the <a> wrapper, per requirements
  let arrowImg = null;
  const imgWidget = element.querySelector('.elementor-widget-image img');
  if (imgWidget) {
    arrowImg = imgWidget;
  }

  // Compose CTA cell content
  const ctaContent = [];
  if (headingEl) ctaContent.push(headingEl);
  if (buttonLink) ctaContent.push(document.createElement('br'), buttonLink);
  if (arrowImg) ctaContent.push(document.createElement('br'), arrowImg);

  // If nothing, put empty string
  const titleCtaRow = [ctaContent.length > 0 ? ctaContent : ''];

  // Compose table
  const cells = [
    headerRow,
    backgroundRow,
    titleCtaRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
