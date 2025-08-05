/* global WebImporter */
export default function parse(element, { document }) {
  // Header row (matches example exactly)
  const headerRow = ['Hero (hero36)'];

  // --- Row 2: (background image/decorative image)
  // In this example, there is an <img> icon at the top. Place it in the 2nd row if present.
  let imageEl = null;
  const imgCandidate = element.querySelector(
    '.elementor-widget-image .elementor-widget-container img'
  );
  if (imgCandidate) {
    imageEl = imgCandidate;
  }
  const secondRow = [imageEl ? imageEl : ''];

  // --- Row 3: All content (headings, paragraphs, CTAs) in a single cell
  const cellContent = [];

  // Heading
  const heading = element.querySelector('.elementor-widget-heading .elementor-heading-title');
  if (heading) cellContent.push(heading);

  // Paragraph under heading (subheading/description)
  // There may be multiple text-editor widgets for different paragraphs
  const textEditors = element.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container > *');
  textEditors.forEach((el) => {
    cellContent.push(el);
  });

  // Button (call-to-action)
  const button = element.querySelector('.elementor-widget-button a');
  if (button && !cellContent.includes(button)) {
    cellContent.push(button);
  }

  // Extra links (e.g., resubmit form). Only add if not already in the cellContent
  const extraLinks = Array.from(element.querySelectorAll('.elementor-widget-text-editor a'));
  extraLinks.forEach((link) => {
    if (!cellContent.includes(link)) {
      cellContent.push(link);
    }
  });

  // Table rows: header, image, content cell
  const cells = [headerRow, secondRow, [cellContent]];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
