/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required by the spec/example
  const headerRow = ['Tabs (tabs13)'];

  // 1. Extract main nav menu for tab labels (desktop preferred)
  let tabLinks = [];
  const navMenus = element.querySelectorAll('.elementor-nav-menu--main');
  for (const navMenu of navMenus) {
    if (!navMenu.closest('.elementor-hidden-desktop')) {
      const ul = navMenu.querySelector('ul.elementor-nav-menu');
      if (ul) {
        tabLinks = Array.from(ul.querySelectorAll('li > a'));
        break;
      }
    }
  }
  if (tabLinks.length === 0 && navMenus.length > 0) {
    const ul = navMenus[0].querySelector('ul.elementor-nav-menu');
    if (ul) {
      tabLinks = Array.from(ul.querySelectorAll('li > a'));
    }
  }

  // 2. Try to extract any content blocks that are siblings to the nav and not part of the menu itself
  // We'll collect all possible content after the menu (for robustness)
  // Get the direct container for both heading and menu
  let tabContentCandidates = [];
  // Seek a visible content container inside the element, but not a menu or anchor
  // We only want to include blocks that aren't the nav menus or wrappers
  const allContainers = Array.from(element.querySelectorAll(':scope > div'));
  // Find the first content wrapper containing the heading/title (for robustness)
  allContainers.forEach(div => {
    if (div.querySelector('h1, h2, h3, h4, h5, h6')) {
      tabContentCandidates.push(div);
    }
  });
  // If no container, try to get all the content before/after nav menu that is not nav
  if (tabContentCandidates.length === 0) {
    let children = Array.from(element.children);
    tabContentCandidates = children.filter(child =>
      !child.querySelector('nav')
    );
  }
  // Fallback: if still nothing, just try all content not nav
  if (tabContentCandidates.length === 0) {
    tabContentCandidates = Array.from(element.querySelectorAll('*:not(nav):not(.elementor-nav-menu--main):not(.elementor-nav-menu__container)'));
  }

  // Compose tab rows
  const rows = tabLinks.map((link, idx) => {
    const tabLabel = link.textContent.trim();
    // For the first tab, put all heading/title content if found, else empty
    if (idx === 0 && tabContentCandidates.length > 0) {
      return [tabLabel, tabContentCandidates[0]];
    }
    return [tabLabel, ''];
  });

  // Compose the table block
  const tableData = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
