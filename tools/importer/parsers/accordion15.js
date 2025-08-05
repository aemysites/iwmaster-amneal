/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate child divs of the element
  const childDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Find each main section by class/absence of class
  const desktopDiv = childDivs.find(div => div.classList.contains('desktop'));
  const safetyDiv = childDivs.find(div => !div.classList.length);
  const infoDiv = childDivs.find(div => div.classList.contains('info'));

  // Build the rows for the accordion block
  const accordionRows = [];

  // 1. Indication row
  if (desktopDiv) {
    const h6 = desktopDiv.querySelector('h6');
    let indicationTitle = '';
    if (h6) indicationTitle = h6.textContent.trim();
    // Everything after h6 is content
    const contentNodes = [];
    let foundH6 = false;
    for (const node of desktopDiv.childNodes) {
      if (!foundH6 && node.nodeType === 1 && node.tagName.toLowerCase() === 'h6') {
        foundH6 = true;
        continue;
      }
      if (foundH6) {
        contentNodes.push(node);
      }
    }
    let indicationContent = '';
    if (contentNodes.length === 1) {
      indicationContent = contentNodes[0];
    } else if (contentNodes.length > 1) {
      const wrap = document.createElement('div');
      for (const n of contentNodes) wrap.appendChild(n);
      indicationContent = wrap;
    }
    if (indicationTitle && indicationContent) {
      accordionRows.push([indicationTitle, indicationContent]);
    }
  }

  // 2. Important Safety Information row
  if (safetyDiv) {
    const h6 = safetyDiv.querySelector('h6');
    let safetyTitle = '';
    if (h6) safetyTitle = h6.textContent.trim();
    // Everything except h6 is content
    const contentNodes = [];
    for (const node of safetyDiv.childNodes) {
      if (node.nodeType === 1 && node.tagName.toLowerCase() === 'h6') continue;
      contentNodes.push(node);
    }
    let safetyContent = '';
    if (contentNodes.length === 1) {
      safetyContent = contentNodes[0];
    } else if (contentNodes.length > 1) {
      const wrap = document.createElement('div');
      for (const n of contentNodes) wrap.appendChild(n);
      safetyContent = wrap;
    }
    if (safetyTitle && safetyContent) {
      accordionRows.push([safetyTitle, safetyContent]);
    }
  }

  // 3. Info row (Reporting and contact info)
  if (infoDiv) {
    // Use first <strong> as the title, otherwise first <p> text
    let infoTitle = '';
    const strong = infoDiv.querySelector('strong');
    if (strong) infoTitle = strong.textContent.trim();
    else {
      const p = infoDiv.querySelector('p');
      if (p) infoTitle = p.textContent.trim();
    }
    // Content is the whole infoDiv
    const infoContent = infoDiv;
    if (infoTitle && infoContent) {
      accordionRows.push([infoTitle, infoContent]);
    }
  }

  // Build the table cells array: 
  // First row is the header, single column: ['Accordion']
  // Each following row is two columns: [title, content]
  const tableRows = [ ['Accordion'], ...accordionRows ];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
