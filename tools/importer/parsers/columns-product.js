/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-product (base: columns, 2 columns).
 * Source: https://main--accs-b2b--demo-system-stores.aem.live/
 * Generated for da (Document Authoring) project. Cells contain default content only.
 * Cell order (image vs text) is preserved from the source DOM so the alternating
 * layout per row is retained.
 *
 * Structure: first row = block name (createBlock); each subsequent row has the same
 * number of columns (2 here). Each source row is a top-level <div> whose direct-child
 * <div>s are the columns.
 */
export default function parse(element, { document }) {
  // Top-level rows of the columns block
  const rows = element.querySelectorAll(':scope > div');

  const cells = [];

  rows.forEach((row) => {
    // Each column is a direct-child div; keep DOM order to preserve image/text alternation
    const cols = row.querySelectorAll(':scope > div');
    if (cols.length === 0) return;

    const rowCells = [];
    cols.forEach((col) => {
      // Move the column's children into a fragment (no field hints for columns blocks)
      const cell = document.createDocumentFragment();
      Array.from(col.childNodes).forEach((n) => cell.appendChild(n));
      rowCells.push(cell);
    });

    cells.push(rowCells);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-product', cells });
  element.replaceWith(block);
}
