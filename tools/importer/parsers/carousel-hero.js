/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero (base: carousel).
 * Source: https://main--accs-b2b--demo-system-stores.aem.live/
 * Generated for da (Document Authoring) project.
 *
 * Structure: container block.
 *  - Row 1: block name (handled by createBlock)
 *  - Each subsequent row = one slide with 2 cells:
 *      cell 1: image
 *      cell 2: text (H1 heading + H3 subheading, rich text)
 */
export default function parse(element, { document }) {
  // Each slide is a <li class="carousel-slide">
  const slides = element.querySelectorAll('.carousel-slide, li[class*="slide"]');

  const cells = [];

  slides.forEach((slide) => {
    // Image cell — prefer the picture, fall back to a bare img
    const picture = slide.querySelector('.carousel-slide-image picture, picture');
    const img = slide.querySelector('.carousel-slide-image img, img');
    const imageContent = picture || img;

    // Text cell — headings/subheadings inside the slide content
    const contentContainer = slide.querySelector('.carousel-slide-content');
    const textNodes = [];
    if (contentContainer) {
      textNodes.push(...contentContainer.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > p, :scope > a'));
    } else {
      // fallback: any heading/paragraph in the slide that isn't inside the image cell
      slide.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a').forEach((n) => {
        if (!n.closest('.carousel-slide-image')) textNodes.push(n);
      });
    }

    // Skip a slide that has neither image nor text
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
