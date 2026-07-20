/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home-page.js
  var import_home_page_exports = {};
  __export(import_home_page_exports, {
    default: () => import_home_page_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll('.carousel-slide, li[class*="slide"]');
    const cells = [];
    slides.forEach((slide) => {
      const picture = slide.querySelector(".carousel-slide-image picture, picture");
      const img = slide.querySelector(".carousel-slide-image img, img");
      const imageContent = picture || img;
      const contentContainer = slide.querySelector(".carousel-slide-content");
      const textNodes = [];
      if (contentContainer) {
        textNodes.push(...contentContainer.querySelectorAll(":scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > p, :scope > a"));
      } else {
        slide.querySelectorAll("h1, h2, h3, h4, h5, h6, p, a").forEach((n) => {
          if (!n.closest(".carousel-slide-image")) textNodes.push(n);
        });
      }
      if (!imageContent && textNodes.length === 0) return;
      const imageCell = document.createDocumentFragment();
      if (imageContent) {
        imageCell.appendChild(imageContent);
      }
      const textCell = document.createDocumentFragment();
      if (textNodes.length > 0) {
        textNodes.forEach((n) => textCell.appendChild(n));
      }
      cells.push([imageCell, textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse2(element, { document }) {
    const cards = element.querySelectorAll(":scope > ul > li, :scope li");
    const cells = [];
    cards.forEach((card) => {
      const picture = card.querySelector(".cards-card-image picture, picture");
      const img = card.querySelector(".cards-card-image img, img");
      const imageContent = picture || img;
      const body = card.querySelector(".cards-card-body");
      const textNodes = [];
      if (body) {
        textNodes.push(...body.querySelectorAll(":scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > p, :scope > ul, :scope > ol"));
      } else {
        card.querySelectorAll("h1, h2, h3, h4, h5, h6, p, ul, ol").forEach((n) => {
          if (!n.closest(".cards-card-image")) textNodes.push(n);
        });
      }
      if (!imageContent && textNodes.length === 0) return;
      const imageCell = document.createDocumentFragment();
      if (imageContent) {
        imageCell.appendChild(imageContent);
      }
      const textCell = document.createDocumentFragment();
      if (textNodes.length > 0) {
        textNodes.forEach((n) => textCell.appendChild(n));
      }
      cells.push([imageCell, textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-product.js
  function parse3(element, { document }) {
    const rows = element.querySelectorAll(":scope > div");
    const cells = [];
    rows.forEach((row) => {
      const cols = row.querySelectorAll(":scope > div");
      if (cols.length === 0) return;
      const rowCells = [];
      cols.forEach((col) => {
        const cell = document.createDocumentFragment();
        Array.from(col.childNodes).forEach((n) => cell.appendChild(n));
        rowCells.push(cell);
      });
      cells.push(rowCells);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse4(element, { document }) {
    const items = element.querySelectorAll(":scope > details, details.accordion-item, details");
    const cells = [];
    items.forEach((item) => {
      const label = item.querySelector("summary.accordion-item-label, summary");
      const labelNodes = [];
      if (label) {
        const inner = label.querySelectorAll(":scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > p");
        if (inner.length > 0) {
          labelNodes.push(...inner);
        } else {
          Array.from(label.childNodes).forEach((n) => labelNodes.push(n));
        }
      }
      const body = item.querySelector(".accordion-item-body");
      const bodyNodes = [];
      if (body) {
        const inner = body.querySelectorAll(":scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > p, :scope > ul, :scope > ol");
        if (inner.length > 0) {
          bodyNodes.push(...inner);
        } else {
          Array.from(body.childNodes).forEach((n) => bodyNodes.push(n));
        }
      } else {
        Array.from(item.children).forEach((child) => {
          if (child.tagName && child.tagName.toLowerCase() !== "summary") bodyNodes.push(child);
        });
      }
      if (labelNodes.length === 0 && bodyNodes.length === 0) return;
      const summaryCell = document.createDocumentFragment();
      if (labelNodes.length > 0) {
        labelNodes.forEach((n) => summaryCell.appendChild(n));
      }
      const textCell = document.createDocumentFragment();
      if (bodyNodes.length > 0) {
        bodyNodes.forEach((n) => textCell.appendChild(n));
      }
      cells.push([summaryCell, textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/texa-b2b-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "header.header-wrapper",
        "footer",
        "footer.footer-wrapper"
      ]);
      element.querySelectorAll("div.section").forEach((section) => {
        if (section.textContent.trim() === "" && section.children.length === 0) {
          section.remove();
        }
      });
      WebImporter.DOMUtils.remove(element, [
        "source",
        "iframe",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/texa-b2b-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const template = payload && payload.template;
      const sections = template && Array.isArray(template.sections) ? template.sections : [];
      if (sections.length < 2) {
        return;
      }
      const doc = element.ownerDocument;
      const resolved = sections.map((section) => {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let el = null;
        for (const sel of selectors) {
          if (!sel) continue;
          const scoped = sel.replace(/^body\s*>\s*main\s*>?\s*/, "").trim();
          el = element.querySelector(scoped || sel) || element.querySelector(sel);
          if (el) break;
        }
        return { section, el };
      });
      for (let i = resolved.length - 1; i >= 0; i -= 1) {
        const { section, el } = resolved[i];
        if (!el) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          el.after(metaBlock);
        }
        if (i > 0) {
          el.before(doc.createElement("hr"));
        }
      }
    }
  }

  // tools/importer/import-home-page.js
  var parsers = {
    "carousel-hero": parse,
    "cards-feature": parse2,
    "columns-product": parse3,
    "accordion-faq": parse4
  };
  var PAGE_TEMPLATE = {
    name: "home-page",
    description: "Bodea B2B home page with header/nav, carousel hero, cards section, columns/product highlights, FAQ accordion, and footer",
    urls: [
      "https://main--accs-b2b--demo-system-stores.aem.live/"
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: [
          "body > main > div.section.carousel-container div.carousel.block",
          ".carousel-container .carousel.block"
        ]
      },
      {
        name: "cards-feature",
        instances: [
          "body > main > div.section.highlight.cards-container div.cards.block",
          ".cards-container .cards.block"
        ]
      },
      {
        name: "columns-product",
        instances: [
          "body > main > div.section.highlight.columns-container div.columns.block",
          ".columns-container .columns.block"
        ]
      },
      {
        name: "accordion-faq",
        instances: [
          "body > main > div.section.accordion-container div.accordion.block",
          ".accordion-container .accordion.block"
        ]
      }
    ],
    sections: [
      {
        id: "rc2",
        name: "carousel-section",
        selector: [
          "body > main > div.section.carousel-container",
          ".section.carousel-container"
        ],
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: [
          "body > main > div.section.carousel-container > div.default-content-wrapper"
        ]
      },
      {
        id: "rc3",
        name: "cards-section",
        selector: [
          "body > main > div.section.highlight.cards-container",
          ".section.highlight.cards-container"
        ],
        style: "highlight",
        blocks: ["cards-feature"],
        defaultContent: [
          "body > main > div.section.highlight.cards-container > div.default-content-wrapper"
        ]
      },
      {
        id: "rc4",
        name: "columns-section",
        selector: [
          "body > main > div.section.highlight.columns-container",
          ".section.highlight.columns-container"
        ],
        style: "highlight",
        blocks: ["columns-product"],
        defaultContent: []
      },
      {
        id: "rc5",
        name: "accordion-section",
        selector: [
          "body > main > div.section.accordion-container",
          ".section.accordion-container"
        ],
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: [
          "body > main > div.section.accordion-container > div.default-content-wrapper"
        ]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_page_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath || "/index");
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_page_exports);
})();
