/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabsRoot = element.querySelector('.elementor-tabs');
  if (!tabsRoot) return;

  // Get desktop tab titles (labels & intro text)
  const tabTitleEls = Array.from(
    tabsRoot.querySelectorAll('.elementor-tabs-wrapper > .elementor-tab-title')
  );
  // Get tab content elements (images/media)
  const tabContentEls = Array.from(
    tabsRoot.querySelectorAll('.elementor-tabs-content-wrapper > .elementor-tab-content')
  );

  // Compose cells array
  const cells = [];
  // Header row - match the required header exactly
  cells.push(['Tabs (tabs20)']);

  // For each tab
  for (let i = 0; i < tabTitleEls.length; i++) {
    const labelEl = tabTitleEls[i];
    // Extract label from <h6> if present, else fallback
    let label = '';
    const h6 = labelEl.querySelector('h6');
    if (h6) {
      label = h6.textContent.trim();
    } else {
      label = labelEl.textContent.trim();
    }

    // Gather all non-label content from tabTitleEl: all <p> and any direct text (excluding h6)
    const contentParts = [];
    Array.from(labelEl.childNodes).forEach((node) => {
      // Skip the <h6> (label) node
      if (node === h6) return;
      if (node.nodeType === 1) {
        // Element node
        if (node.tagName.toLowerCase() === 'p') {
          contentParts.push(node);
        } else {
          contentParts.push(node);
        }
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        // Text node
        contentParts.push(document.createTextNode(node.textContent));
      }
    });

    // Gather all content from the corresponding tabContentEl
    const contentEl = tabContentEls[i];
    if (contentEl) {
      Array.from(contentEl.childNodes).forEach((node) => {
        // Only include if non-empty
        if (
          node.nodeType === 1 ||
          (node.nodeType === 3 && node.textContent.trim())
        ) {
          contentParts.push(node);
        }
      });
    }

    // If nothing was found for content, fallback to all labelEl text except h6
    if (contentParts.length === 0) {
      // Remove the label from labelEl.textContent
      const copy = h6
        ? labelEl.textContent.replace(h6.textContent, '').trim()
        : labelEl.textContent.trim();
      if (copy) contentParts.push(document.createTextNode(copy));
    }

    // Add this tab row
    cells.push([label, contentParts]);
  }

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
