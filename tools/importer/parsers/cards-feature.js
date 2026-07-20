/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature (base: cards).
 * Source: https://main--accs-b2b--demo-system-stores.aem.live/
 * Generated for da (Document Authoring) project.
 *
 * Structure: container block.
 *  - Row 1: block name (handled by createBlock)
 *  - Each subsequent row = one card with 2 cells:
 *      cell 1: image
 *      cell 2: text (H4 title + description paragraph + "Explore" CTA, rich text)
 */
export default function parse(element, { document }) {
  // Each card is a top-level <li>
  const cards = element.querySelectorAll(':scope > ul > li, :scope li');

  const cells = [];

  cards.forEach((card) => {
    // Image cell — prefer picture, fall back to bare img
    const picture = card.querySelector('.cards-card-image picture, picture');
    const img = card.querySelector('.cards-card-image img, img');
    const imageContent = picture || img;

    // Text cell — everything in the card body (title, description, CTA)
    const body = card.querySelector('.cards-card-body');
    const textNodes = [];
    if (body) {
      textNodes.push(...body.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > p, :scope > ul, :scope > ol'));
    } else {
      // fallback: content in the card that isn't part of the image cell
      card.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol').forEach((n) => {
        if (!n.closest('.cards-card-image')) textNodes.push(n);
      });
    }

    // Skip a card with neither image nor text
    if (!imageContent && textNodes.length === 0) return;

    // Cell 1: image
    const imageCell = document.createDocumentFragment();
    if (imageContent) {
      imageCell.appendChild(imageContent);
    }

    // Cell 2: rich text
    const textCell = document.createDocumentFragment();
    if (textNodes.length > 0) {
      textNodes.forEach((n) => textCell.appendChild(n));
    }

    cells.push([imageCell, textCell]);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
