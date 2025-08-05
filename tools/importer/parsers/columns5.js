/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single column with the block name
  const header = ['Columns (columns5)'];

  // The content row should have one cell per immediate child of the element
  const columns = Array.from(element.children);

  const table = WebImporter.DOMUtils.createTable([
    header,
    columns
  ], document);

  element.replaceWith(table);
}
