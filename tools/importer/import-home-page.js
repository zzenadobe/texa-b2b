/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import columnsProductParser from './parsers/columns-product.js';
import accordionFaqParser from './parsers/accordion-faq.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/texa-b2b-cleanup.js';
import sectionsTransformer from './transformers/texa-b2b-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'cards-feature': cardsFeatureParser,
  'columns-product': columnsProductParser,
  'accordion-faq': accordionFaqParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home-page',
  description: 'Bodea B2B home page with header/nav, carousel hero, cards section, columns/product highlights, FAQ accordion, and footer',
  urls: [
    'https://main--accs-b2b--demo-system-stores.aem.live/',
  ],
  blocks: [
    {
      name: 'carousel-hero',
      instances: [
        'body > main > div.section.carousel-container div.carousel.block',
        '.carousel-container .carousel.block',
      ],
    },
    {
      name: 'cards-feature',
      instances: [
        'body > main > div.section.highlight.cards-container div.cards.block',
        '.cards-container .cards.block',
      ],
    },
    {
      name: 'columns-product',
      instances: [
        'body > main > div.section.highlight.columns-container div.columns.block',
        '.columns-container .columns.block',
      ],
    },
    {
      name: 'accordion-faq',
      instances: [
        'body > main > div.section.accordion-container div.accordion.block',
        '.accordion-container .accordion.block',
      ],
    },
  ],
  sections: [
    {
      id: 'rc2',
      name: 'carousel-section',
      selector: [
        'body > main > div.section.carousel-container',
        '.section.carousel-container',
      ],
      style: null,
      blocks: ['carousel-hero'],
      defaultContent: [
        'body > main > div.section.carousel-container > div.default-content-wrapper',
      ],
    },
    {
      id: 'rc3',
      name: 'cards-section',
      selector: [
        'body > main > div.section.highlight.cards-container',
        '.section.highlight.cards-container',
      ],
      style: 'highlight',
      blocks: ['cards-feature'],
      defaultContent: [
        'body > main > div.section.highlight.cards-container > div.default-content-wrapper',
      ],
    },
    {
      id: 'rc4',
      name: 'columns-section',
      selector: [
        'body > main > div.section.highlight.columns-container',
        '.section.highlight.columns-container',
      ],
      style: 'highlight',
      blocks: ['columns-product'],
      defaultContent: [],
    },
    {
      id: 'rc5',
      name: 'accordion-section',
      selector: [
        'body > main > div.section.accordion-container',
        '.section.accordion-container',
      ],
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: [
        'body > main > div.section.accordion-container > div.default-content-wrapper',
      ],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (seen.has(element)) return; // Same element matched by multiple selectors
        seen.add(element);
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by an earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath || '/index');

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
