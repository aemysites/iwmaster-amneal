/* global WebImporter */
export default function parse(element, { document }) {
  // Helper function to assemble the text cell
  function getTextCell(h2, p) {
    const cell = document.createElement('div');
    if (h2) {
      // Create a heading element with the h2 content
      const heading = document.createElement('h2');
      heading.innerHTML = h2.innerHTML;
      cell.appendChild(heading);
    }
    if (p) {
      cell.appendChild(p);
    }
    return cell;
  }

  // Find all article.post elements: either the element itself, or its children
  let posts;
  if (element.matches && element.matches('article.post')) {
    posts = [element];
  } else {
    posts = Array.from(element.querySelectorAll(':scope > article.post'));
    // Fallback: if not a parent, try just article.post anywhere
    if (posts.length === 0) {
      posts = Array.from(element.querySelectorAll('article.post'));
    }
  }

  const rows = [['Carousel']]; // Header row as in the example

  posts.forEach(post => {
    // Find the first <img> inside a link (first column)
    let img = null;
    const aWithImg = post.querySelector('a[href] > img');
    if (aWithImg) {
      img = aWithImg;
    } else {
      // fallback: just take any img in the post
      img = post.querySelector('img');
    }

    // Find the h2 (title) and paragraph (desc) for the second column
    const h2 = post.querySelector('h2');
    const p = post.querySelector('p');
    let textCell = null;
    if (h2 || p) {
      textCell = getTextCell(h2, p);
    } else {
      textCell = document.createElement('div');
    }
    rows.push([
      img,
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
