/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Each card is a direct child container (div.e-con.e-child)
  const cardContainers = element.querySelectorAll(':scope > div.e-con.e-child');
  cardContainers.forEach(cardEl => {
    // 1. Find the first <img> inside the card (icon/image required)
    const imgWidget = cardEl.querySelector('.elementor-widget-image img');
    const img = imgWidget || '';
    
    // 2. Gather all .elementor-widget-text-editor widgets (which may contain title, desc)
    const textWidgets = Array.from(cardEl.querySelectorAll('.elementor-widget-text-editor'));
    let title = null;
    let desc = null;

    // Look for heading (h4, h3, etc) for title; rest is description
    textWidgets.forEach(w => {
      if (!title) {
        const h = w.querySelector('h1,h2,h3,h4,h5,h6');
        if (h) title = h;
      } else if (!desc) {
        // Prefer <p>, but fall back to all text content (excluding heading)
        const p = w.querySelector('p');
        if (p) {
          desc = p;
        } else {
          // If text is in the widget not in a paragraph, use the widget
          // but avoid picking up a widget that's just the heading
          if (!w.querySelector('h1,h2,h3,h4,h5,h6')) {
            desc = w;
          } else {
            // If the widget has both heading and other text nodes, use only non-heading text nodes
            const nodes = Array.from(w.childNodes).filter(n => !(n.tagName && n.tagName.match(/^H[1-6]$/)) && (n.textContent && n.textContent.trim()));
            if (nodes.length > 0) {
              const frag = document.createDocumentFragment();
              nodes.forEach(n => frag.appendChild(n.cloneNode(true)));
              desc = frag;
            }
          }
        }
      }
    });

    // Compose the text cell (title + description)
    const cellContent = [];
    if (title) cellContent.push(title);
    if (desc) cellContent.push(desc);
    rows.push([
      img,
      cellContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
