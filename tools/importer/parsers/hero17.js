/* global WebImporter */
export default function parse(element, { document }) {
  // --- HEADER ROW ---
  const headerRow = ['Hero (hero17)'];

  // --- BACKGROUND ROW ---
  // This example HTML does not contain a background image.
  const backgroundRow = [''];

  // --- CONTENT ROW ---
  // For flexibility and resilience, collect all elements that contain visible text and are not empty wrappers.
  // We'll try to preserve heading levels and main content, and include all text visible inside the block.

  // Strategy:
  // - Find all headings (h1-h6), paragraphs, and other elements with visible text (excluding script/style/etc)
  // - If there's a single parent container holding the main content (like a .elementor-widget-container), use it
  // - Reference existing elements directly (no cloning or creation unless absolutely needed)

  // Try to find the main content container
  let mainContent = null;
  // Find the first content widget that has a text heading or similar (typically the hero text container)
  const widgetContainers = element.querySelectorAll('.elementor-widget-container');
  for (const container of widgetContainers) {
    if (container.textContent && container.textContent.trim()) {
      mainContent = container;
      break;
    }
  }

  // If not found, fallback to the element's children (divs, etc) that contain text
  if (!mainContent) {
    // Gather all direct child elements with text
    const candidates = Array.from(element.children).filter(child => child.textContent && child.textContent.trim());
    if (candidates.length > 0) {
      mainContent = candidates;
    }
  }

  // If still not found, fallback to all text-containing descendants (flexibility for other variations)
  let contentCell;
  if (mainContent) {
    contentCell = Array.isArray(mainContent) ? mainContent : [mainContent];
  } else {
    // fallback: all unique elements with text
    const textEls = [];
    element.querySelectorAll('*').forEach(el => {
      if (
        el.childElementCount === 0 &&
        el.textContent &&
        el.textContent.trim() &&
        !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)
      ) {
        textEls.push(el);
      }
    });
    contentCell = textEls;
  }
  if (!contentCell.length) contentCell = [''];

  // --- BUILD TABLE ---
  const rows = [
    headerRow,
    backgroundRow,
    [contentCell],
  ];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
