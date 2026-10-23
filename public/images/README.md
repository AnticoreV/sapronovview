# Images

- The social share image (`/images/og-default.png`) and the static adventures map
  (`/images/adventures-map.svg`) are generated at build time — see
  `src/lib/brand-images.ts` and `src/pages/images/`. Drop a static file with the same
  path here to override one.
- Put files here only when you need a stable public URL (e.g. an image referenced from
  Markdown body text). Everything else belongs in `src/assets/` so `<Image />` /
  `<Picture />` can resize it and serve AVIF/WebP.
