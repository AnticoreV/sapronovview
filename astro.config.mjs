// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { satteri } from "@astrojs/markdown-satteri";
import { hidePlaceholders } from "./src/lib/markdown-hide-placeholders.mjs";

// Production URL — used for canonical URLs, the sitemap, the RSS feed and Open Graph metadata.
const SITE_URL = "https://ivansapronov.com";

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
const saira = (subset) =>
  `./node_modules/@fontsource-variable/saira/files/saira-${subset}-standard-normal.woff2`;
/** @param {string} subset */
const mono = (subset) =>
  `./node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-${subset}-wght-normal.woff2`;

export default defineConfig({
  site: SITE_URL,
  output: "static",
  trailingSlash: "never",
  build: {
    format: "file",
    inlineStylesheets: "always",
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
  image: {
    // Every <Image /> gets width/height + srcset so there is no layout shift.
    layout: "constrained",
    responsiveStyles: true,
  },
  // Fonts are self-hosted from the Fontsource npm packages (variable, latin + latin-ext)
  // so builds never depend on a third-party request. Saira ships the "standard" file
  // (wght 100–900 + wdth 50–125) because the display type is set at width 112.
  //
  // Each typeface is split into two families: latin (preloaded, no fallback of its
  // own) and latin-ext (Czech diacritics, loaded on demand, carries the metric-matched
  // fallback). global.css chains them: var(--font-saira), var(--font-saira-ext).
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Saira Variable",
      cssVariable: "--font-saira",
      fallbacks: [],
      options: {
        variants: [
          {
            src: [saira("latin")],
            weight: "100 900",
            stretch: "50% 125%",
            style: "normal",
            unicodeRange: /** @type {[string, ...string[]]} */ (LATIN),
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Saira Variable",
      cssVariable: "--font-saira-ext",
      fallbacks: ["Arial Narrow", "system-ui", "sans-serif"],
      options: {
        variants: [
          {
            src: [saira("latin-ext")],
            weight: "100 900",
            stretch: "50% 125%",
            style: "normal",
            unicodeRange: /** @type {[string, ...string[]]} */ (LATIN_EXT),
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "JetBrains Mono Variable",
      cssVariable: "--font-jetbrains-mono",
      fallbacks: [],
      options: {
        variants: [
          {
            src: [mono("latin")],
            weight: "100 800",
            style: "normal",
            unicodeRange: /** @type {[string, ...string[]]} */ (LATIN),
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "JetBrains Mono Variable",
      cssVariable: "--font-jetbrains-mono-ext",
      fallbacks: ["ui-monospace", "Menlo", "monospace"],
      options: {
        variants: [
          {
            src: [mono("latin-ext")],
            weight: "100 800",
            style: "normal",
            unicodeRange: /** @type {[string, ...string[]]} */ (LATIN_EXT),
          },
        ],
      },
    },
  ],
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes("/drafts/"),
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    processor: satteri({ mdastPlugins: hidePlaceholders }),
    shikiConfig: {
      // Code always sits on an instrument face (dark) in both themes.
      theme: "github-dark-dimmed",
      wrap: false,
    },
  },
});
