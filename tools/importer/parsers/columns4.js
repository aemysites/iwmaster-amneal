/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as required
  const headerRow = ['Columns (columns4)'];

  // Find the immediate child container (should only be one)
  const subContainer = element.querySelector(':scope > div');
  if (!subContainer) {
    // fallback: if the structure is not as expected, just use the element as single cell
    const table = WebImporter.DOMUtils.createTable([headerRow, [[element]]], document);
    element.replaceWith(table);
    return;
  }
  // For this block, gather all direct descendant widgets (e.g., text, heading, text-editor)
  const widgetBlocks = Array.from(subContainer.querySelectorAll(':scope > div'));
  const cellContent = [];
  widgetBlocks.forEach((block) => {
    // Each block has a .elementor-widget-container, and that's where the real content is
    const widgetContainer = block.querySelector('.elementor-widget-container');
    if (widgetContainer) {
      // If it has children, push all (to avoid wrapping <div> if not needed)
      if (widgetContainer.children.length > 1) {
        cellContent.push(...Array.from(widgetContainer.children));
      } else if (widgetContainer.children.length === 1) {
        cellContent.push(widgetContainer.firstElementChild);
      } else {
        // fallback: push the widgetContainer itself if no children (in case of empty div)
        cellContent.push(widgetContainer);
      }
    }
  });
  // If nothing was pushed (all blocks are empty), fallback to element
  const finalCellContent = cellContent.length > 0 ? cellContent : [element];

  const rows = [
    headerRow,
    [finalCellContent]
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
