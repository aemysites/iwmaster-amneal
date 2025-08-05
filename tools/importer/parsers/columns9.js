/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main block container (class .panel.tabbed-slide)
  const main = element.querySelector('.panel.tabbed-slide');
  if (!main) return;

  // The content is divided into two primary columns: left and right.
  // The left column is the first e-con-full inside .bg-section
  // The right column is a text widget, visible on desktop (elementor-hidden-tablet or elementor-hidden-mobile)

  const bgSection = main.querySelector('.bg-section.e-flex.e-con.e-child');
  if (!bgSection) return;

  // Left column: grab the first .e-con-full.e-flex.e-con.e-child inside bgSection
  const leftCol = bgSection.querySelector('.e-con-full.e-flex.e-con.e-child');

  // We'll aggregate all left column direct children in a wrapper div
  const leftWrapper = document.createElement('div');
  if (leftCol) {
    Array.from(leftCol.children).forEach(child => {
      leftWrapper.appendChild(child);
    });
  }

  // Right column: prefer the one for desktop (elementor-hidden-tablet or elementor-hidden-mobile)
  let rightCol = bgSection.querySelector('.elementor-hidden-tablet, .elementor-hidden-mobile');
  // If not present, try the mobile version (elementor-hidden-desktop inside leftCol)
  if (!rightCol && leftCol) {
    rightCol = leftCol.querySelector('.elementor-hidden-desktop');
  }

  // If rightCol is not present just use an empty div for structural consistency
  const rightWrapper = document.createElement('div');
  if (rightCol) {
    rightWrapper.appendChild(rightCol);
  }

  // Compose the header and content rows
  const headerRow = ['Columns (columns9)'];
  const contentRow = [leftWrapper, rightCol ? rightCol : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
