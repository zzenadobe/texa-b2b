/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq (base: accordion).
 * Source: https://main--accs-b2b--demo-system-stores.aem.live/
 * Generated for da (Document Authoring) project.
 *
 * Structure: 2-column container block.
 *  - Row 1: block name (handled by createBlock)
 *  - Each subsequent row = one accordion item with 2 cells:
 *      cell 1: title/question (H4 label from <summary>)
 *      cell 2: body/answer (rich text from the item body)
 */
export default function parse(element, { document }) {
  // Each accordion item is a <details> element
  const items = element.querySelectorAll(':scope > details, details.accordion-item, details');

  const cells = [];

  items.forEach((item) => {
    // Title/question cell — the clickable label
    const label = item.querySelector('summary.accordion-item-label, summary');
    const labelNodes = [];
    if (label) {
      const inner = label.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > p');
      if (inner.length > 0) {
        labelNodes.push(...inner);
      } else {
        // fall back to the summary's own children (e.g. plain text)
        Array.from(label.childNodes).forEach((n) => labelNodes.push(n));
      }
    }

    // Body/answer cell — everything in the item body
    const body = item.querySelector('.accordion-item-body');
    const bodyNodes = [];
    if (body) {
      const inner = body.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > p, :scope > ul, :scope > ol');
      if (inner.length > 0) {
        bodyNodes.push(...inner);
      } else {
        Array.from(body.childNodes).forEach((n) => bodyNodes.push(n));
      }
    } else {
      // fallback: content inside the details that is not the summary
      Array.from(item.children).forEach((child) => {
        if (child.tagName && child.tagName.toLowerCase() !== 'summary') bodyNodes.push(child);
      });
    }

    // Skip item with neither question nor answer
    if (labelNodes.length === 0 && bodyNodes.length === 0) return;

    // Cell 1: summary (title)
    const summaryCell = document.createDocumentFragment();
    if (labelNodes.length > 0) {
      labelNodes.forEach((n) => summaryCell.appendChild(n));
    }

    // Cell 2: text (body)
    const textCell = document.createDocumentFragment();
    if (bodyNodes.length > 0) {
      bodyNodes.forEach((n) => textCell.appendChild(n));
    }

    cells.push([summaryCell, textCell]);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
