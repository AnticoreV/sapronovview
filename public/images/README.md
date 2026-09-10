# Images

- The default social share image (`/images/og-default.png`) is generated at build time
  (see `src/lib/brand-images.ts`). Drop a static `og-default.png` here to override it.
- `projects/`, `hobbies/`, `writing/`, `about/` — drop **unoptimised** images here only when
  you need a stable public URL (e.g. referenced from Markdown body text).

For images that should be optimised and resized automatically, put them under
`src/assets/images/...` and reference them from frontmatter (`cover:`, `images[].src`)
— Astro's `<Image />` handles formats, sizes and lazy loading.
