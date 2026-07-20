/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: texa-b2b section breaks and section metadata.
 *
 * Runs in afterTransform only. Uses payload.template.sections from
 * tools/importer/page-templates.json (home-page: 4 sections).
 *
 * For each section (processed in reverse document order):
 *   - If the section has a `style`, append a "Section Metadata" block after it.
 *   - If the section is not the first section, insert an <hr> before it.
 *
 * Section selectors are taken from the captured DOM in migration-work/cleaned.html:
 *   - div.section.carousel-container            (line 204)
 *   - div.section.highlight.cards-container     (line 257, style: highlight)
 *   - div.section.highlight.columns-container   (line 336, style: highlight)
 *   - div.section.accordion-container           (line 382)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) {
      return;
    }

    const doc = element.ownerDocument;

    // Resolve each template section to a live element under `element` using
    // its selector list (from captured DOM). Preserve template order.
    const resolved = sections.map((section) => {
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let el = null;
      for (const sel of selectors) {
        if (!sel) continue;
        // Prefer a class-based match scoped to the current main element,
        // since page-templates selectors may be rooted at body > main.
        const scoped = sel.replace(/^body\s*>\s*main\s*>?\s*/, '').trim();
        el = element.querySelector(scoped || sel) || element.querySelector(sel);
        if (el) break;
      }
      return { section, el };
    });

    // Process in reverse order so DOM insertions do not disturb earlier lookups.
    for (let i = resolved.length - 1; i >= 0; i -= 1) {
      const { section, el } = resolved[i];
      if (!el) continue;

      // Section Metadata block for sections that declare a style.
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        el.after(metaBlock);
      }

      // Section break before every non-first section.
      if (i > 0) {
        el.before(doc.createElement('hr'));
      }
    }
  }
}
