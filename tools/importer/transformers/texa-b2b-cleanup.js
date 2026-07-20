/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: texa-b2b site-wide cleanup.
 *
 * Removes non-authorable site chrome so the imported main content contains
 * only page-level authorable content (carousel, cards, columns, accordion).
 *
 * All selectors are taken from the captured DOM in migration-work/cleaned.html:
 *   - <header class="header-wrapper"> ... </header>   (site header/nav block, line 2)
 *   - <footer class="footer-wrapper"> ... </footer>   (site footer block, line 444)
 *   - trailing empty <div class="section"></div>       (line 441, no authorable content)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome rendered by the site's own header/footer blocks.
    // Found in captured DOM: header.header-wrapper (line 2), footer.footer-wrapper (line 444).
    WebImporter.DOMUtils.remove(element, [
      'header',
      'header.header-wrapper',
      'footer',
      'footer.footer-wrapper',
    ]);

    // Remove trailing empty section wrappers left after block parsing.
    // Found in captured DOM: <div class="section"></div> (line 441) with no content.
    element.querySelectorAll('div.section').forEach((section) => {
      if (section.textContent.trim() === '' && section.children.length === 0) {
        section.remove();
      }
    });

    // Safe non-authorable element cleanup.
    WebImporter.DOMUtils.remove(element, [
      'source',
      'iframe',
      'link',
      'noscript',
    ]);
  }
}
