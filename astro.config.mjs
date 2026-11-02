// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { satteri } from "@astrojs/markdown-satteri";
import { hidePlaceholders } from "./src/lib/markdown-hide-placeholders.mjs";
import { czechTypography } from "./src/lib/markdown-czech.mjs";
import { hasPublishedWriting } from "./src/lib/writing-status.mjs";

// Production URL — used for canonical URLs, the sitemap, the RSS feed and Open Graph metadata.
const SITE_URL = "https://ivansapronov.com";

// While no post is published, /writing (and its tag pages) stay out of the sitemap.
const WRITING_PUBLISHED = hasPublishedWriting(
  fileURLToPath(new URL("./src/content/writing", import.meta.url)),
);

/** Unicode ranges as published by Fontsource for the two subsets we ship. */
const LATIN = [
  "U+0000-00FF",
  "U+0131",
  "U+0152-0153",
  "U+02BB-02BC",
  "U+02C6",
  "U+02DA",
  "U+02DC",
  "U+0304",
  "U+0308",
  "U+0329",
  "U+2000-206F",
  "U+20AC",
  "U+2122",
  "U+2191",
  "U+2193",
  "U+2212",
  "U+2215",
  "U+FEFF",
  "U+FFFD",
];
const LATIN_EXT = [
  "U+0100-02BA",
  "U+02BD-02C5",
  "U+02C7-02CC",
  "U+02CE-02D7",
  "U+02DD-02FF",
  "U+0304",
  "U+0308",
  "U+0329",
  "U+1D00-1DBF",
  "U+1E00-1E9F",
  "U+1EF2-1EFF",
  "U+2020",
  "U+20A0-20AB",
  "U+20AD-20C0",
  "U+2113",
  "U+2C60-2C7F",
  "U+A720-A7FF",
];

/** @param {string} subset */
const plexSans = (subset) =>
  `./node_modules/@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-${subset}-wght-normal.woff2`;
/** @param {string} subset @param {number} weight */
const plexMono = (subset, weight) =>
  `./node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-${subset}-${weight}-normal.woff2`;
/**
 * IBM Plex Mono is static: 400 (code), 500 (labels, meta), 600 (chips, 3D labels).
 * @param {string} subset
 * @param {[string, ...string[]]} unicodeRange
 */
const plexVariants = (subset, unicodeRange) => {
  /** @param {number} weight */
  const variant = (weight) => ({
    src: /** @type {[string]} */ ([plexMono(subset, weight)]),
    weight,
    style: /** @type {"normal"} */ ("normal"),
    unicodeRange,
  });
  return /** @type {[ReturnType<typeof variant>, ...ReturnType<typeof variant>[]]} */ ([
    variant(400),
    variant(500),
    variant(600),
  ]);
};

export default defineConfig({
  site: SITE_URL,
  output: "static",
  trailingSlash: "never",
  // Removed pages forward to the project list (static meta-refresh page; public/_redirects
  // adds a real 301 on Cloudflare Pages). Apexline was taken off the site on 2026-10-23.
  redirects: {
    "/projects/apex-line-market-research": "/projects",
    "/projects/apexline": "/projects",
    "/cs/projects/apex-line-market-research": "/cs/projects",
    "/cs/projects/apexline": "/cs/projects",
  },
  // English keeps today's URLs; Czech lives under /cs/ (pages in src/pages/[...lang]/,
  // strings in src/i18n/). The browser-language redirect is a small inline script in
  // BaseLayout, not Astro's server-side routing (this is a static site).
  i18n: {
    defaultLocale: "en",
    locales: ["en", "cs"],
    routing: { prefixDefaultLocale: false },
  },
  build: {
    format: "file",
    inlineStylesheets: "always",
  },
  // No `security.csp`: Astro's per-page hash CSP blocks the next page's inline styles and
  // scripts after a ClientRouter navigation (tested 2026-10-23). See README "Security headers".
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
  image: {
    // Every <Image /> gets width/height + srcset so there is no layout shift.
    layout: "constrained",
    responsiveStyles: true,
  },
  // Fonts are self-hosted from the Fontsource npm packages (latin + latin-ext) so builds
  // never depend on a third-party request: IBM Plex Sans (variable, wght 100–700) for
  // display and text, IBM Plex Mono (static 400 / 500 / 600) for labels, numbers and code.
  //
  // Each typeface is split into two families: latin (preloaded, no fallback of its
  // own) and latin-ext (Czech diacritics, loaded on demand, carries the metric-matched
  // fallback). global.css chains them: var(--font-plex-sans), var(--font-plex-sans-ext).
  fonts: [
    {
      provider: fontProviders.local(),
      name: "IBM Plex Sans Variable",
      cssVariable: "--font-plex-sans",
      fallbacks: [],
      options: {
        variants: [
          {
            src: [plexSans("latin")],
            weight: "100 700",
            style: "normal",
            unicodeRange: /** @type {[string, ...string[]]} */ (LATIN),
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "IBM Plex Sans Variable",
      cssVariable: "--font-plex-sans-ext",
      fallbacks: ["system-ui", "sans-serif"],
      options: {
        variants: [
          {
            src: [plexSans("latin-ext")],
            weight: "100 700",
            style: "normal",
            unicodeRange: /** @type {[string, ...string[]]} */ (LATIN_EXT),
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "IBM Plex Mono",
      cssVariable: "--font-plex-mono",
      fallbacks: [],
      options: {
        variants: plexVariants("latin", /** @type {[string, ...string[]]} */ (LATIN)),
      },
    },
    {
      provider: fontProviders.local(),
      name: "IBM Plex Mono",
      cssVariable: "--font-plex-mono-ext",
      fallbacks: ["ui-monospace", "Menlo", "monospace"],
      options: {
        variants: plexVariants("latin-ext", /** @type {[string, ...string[]]} */ (LATIN_EXT)),
      },
    },
  ],
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes("/drafts/") &&
        !/^(\/cs)?\/404$/.test(new URL(page).pathname) &&
        (WRITING_PUBLISHED || !/^(\/cs)?\/writing(\/|$)/.test(new URL(page).pathname)),
      // hreflang alternates for every page (en ↔ cs).
      i18n: {
        defaultLocale: "en",
        locales: { en: "en-US", cs: "cs-CZ" },
      },
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    processor: satteri({ mdastPlugins: [...hidePlaceholders, ...czechTypography] }),
    shikiConfig: {
      // Code sits on #10141A with github-dark-dimmed in both themes (components.md, Sheet).
      theme: "github-dark-dimmed",
      wrap: false,
    },
  },
});
