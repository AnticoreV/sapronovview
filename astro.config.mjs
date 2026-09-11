// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// Production URL. Used for canonical URLs, the sitemap, the RSS feed and
// Open Graph metadata.
const SITE_URL = "https://ivansapronov.com";

export default defineConfig({
  site: SITE_URL,
  output: "static",
  trailingSlash: "never",
  build: {
    format: "file",
    inlineStylesheets: "auto",
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
  image: {
    // Sensible defaults for responsive images; every <Image /> gets
    // width/height + srcset so there is no layout shift.
    layout: "constrained",
    responsiveStyles: true,
  },
  // Fonts are self-hosted from the Fontsource npm packages (variable, latin
  // subset) so builds never depend on a third-party request. Astro copies the
  // files, generates @font-face rules, preload links and metric-matched
  // fallbacks. See README "Changing theme colours and fonts".
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Bricolage Grotesque",
      cssVariable: "--font-family-display",
      fallbacks: ["Inter", "system-ui", "sans-serif"],
      options: {
        variants: [
          {
            src: [
              "./node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2",
            ],
            weight: "200 800",
            style: "normal",
            unicodeRange: [
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
            ],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Inter",
      cssVariable: "--font-family-sans",
      fallbacks: ["system-ui", "Segoe UI", "Roboto", "sans-serif"],
      options: {
        variants: [
          {
            src: ["./node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2"],
            weight: "100 900",
            style: "normal",
            unicodeRange: [
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
            ],
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
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark-dimmed" },
      wrap: false,
    },
  },
});
