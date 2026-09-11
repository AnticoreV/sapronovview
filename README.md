# sapronovview — personal website

The personal site of **Ivan Sapronov**: part portfolio, part résumé, part technical journal,
part logbook for flying, riding and travelling.

Built with [Astro](https://astro.build), TypeScript and Tailwind CSS v4. Fully static,
almost no client-side JavaScript, self-hosted fonts, content collections for everything
structured.

## Contents

- [Quick start](#quick-start)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Updating personal details](#updating-personal-details)
- [Adding a project](#adding-a-project)
- [Adding an article](#adding-an-article)
- [Updating experience](#updating-experience)
- [Hobbies, Now and About](#hobbies-now-and-about)
- [Adding images](#adding-images)
- [Placeholders](#placeholders)
- [Changing theme colours and fonts](#changing-theme-colours-and-fonts)
- [Contact form](#contact-form)
- [SEO](#seo)
- [Deployment](#deployment)
- [Tech stack](#tech-stack)

## Quick start

Requires **Node.js 22.12+** (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:4321
```

## Scripts

| Command                | What it does                                              |
| ---------------------- | --------------------------------------------------------- |
| `npm run dev`          | Start the dev server with hot reload                      |
| `npm run build`        | Production build to `dist/`                               |
| `npm run preview`      | Serve the production build locally                        |
| `npm run clean`        | Delete `dist/` and Astro's content cache (see note below) |
| `npm run check`        | Type-check `.astro` and `.ts` files (`astro check`)       |
| `npm run lint`         | ESLint (TypeScript + Astro rules)                         |
| `npm run format`       | Prettier (with Astro and Tailwind class-sorting plugins)  |
| `npm run format:check` | Verify formatting without writing                         |

Before pushing, run `npm run check && npm run lint && npm run build`.

> **Deleted a content file but it still shows up?** Astro caches the content collections in
> `node_modules/.astro`. Run `npm run clean` and rebuild.

## Project structure

```text
src/
  config.ts               ← name, role, email, socials, navigation, tech stack
  content.config.ts       ← content collection schemas (zod)
  content/
    projects/             ← one .md per project (case studies)
    writing/              ← one .md/.mdx per article
    experience/           ← one .md per position
    milestones/           ← education / certifications / talks / awards / community (.yaml)
    hobbies/              ← one .md per hobby
    now/now.md            ← the /now page
  data/about.ts           ← philosophy, values, facts for /about
  components/
    layout/               ← Header, Footer
    seo/                  ← SEO (meta tags), JsonLd
    ui/                   ← Button, Container, SectionHeading, TechBadge, StatusPill,
                            SocialLinks, ThemeToggle, Breadcrumbs, CTASection,
                            PlaceholderImage, PlaceholderBadge, FormattedDate
    home/                 ← homepage sections
    projects/             ← ProjectCard, ProjectFilters
    experience/           ← ExperienceItem, MilestoneList
    writing/              ← ArticleCard, TagList
    hobbies/              ← HobbyCard
  layouts/
    BaseLayout.astro      ← <head>, header, footer, theme bootstrap, view transitions
    ProjectLayout.astro   ← case-study page
    ArticleLayout.astro   ← article page with prev/next + related
  lib/
    content.ts            ← typed queries + label maps for collections
    icons.ts              ← icon registry (lucide names usable from frontmatter)
    utils.ts              ← dates, reading time, helpers
  pages/                  ← routes (file-based)
  styles/global.css       ← design tokens + Tailwind theme
  lib/brand-images.ts     ← build-time OG image + touch icon generation
public/
  images/                 ← static images (unoptimised assets)
  robots.txt, favicon.svg, site.webmanifest
```

Every folder under `src/content/` contains a `_template.*` file. Files starting with an
underscore are ignored by the build — copy one, rename it, fill it in.

## Updating personal details

Edit **`src/config.ts`**. It holds:

- `name`, `title`, `description`, `location`, `email`
- `availability` — the status pill in the hero (`open` / `limited` / `closed`)
- `currentFocus` — one line shown on the homepage
- `social` — GitHub, LinkedIn, X, Instagram, Telegram, YouTube (empty string hides a link)
- `navigation` — header/footer links
- `techStack` — the "Technologies I reach for" section

Then:

1. Set `site` in **`astro.config.mjs`** to your production URL (used for canonical URLs,
   sitemap, RSS and Open Graph).
2. Update the `Sitemap:` line in `public/robots.txt` to match.
3. The share image (`/images/og-default.png`) and touch icon (`/apple-touch-icon.png`) are
   generated at build time from `siteConfig` by `src/lib/brand-images.ts`. To use your own
   artwork, delete `src/pages/images/og-default.png.ts` / `src/pages/apple-touch-icon.png.ts`
   and put static files with the same paths in `public/`.
4. Replace `public/favicon.svg`.
5. Rewrite the hero paragraph in `src/components/home/Hero.astro` and the intro copy in
   `src/components/home/Intro.astro` and `src/pages/about.astro` in your own words.

## Adding a project

1. Copy `src/content/projects/_template.md` → `src/content/projects/my-project.md`
   (the filename becomes the URL: `/projects/my-project`).
2. Fill in the frontmatter:

   ```yaml
   title: "My project"
   description: "One sentence, max 220 characters."
   date: 2026-03-01 # used for the year label and ordering
   featured: true # show on the homepage (max 4, ordered by `order`)
   status: in-progress # active | in-progress | research | completed | paused | archived
   category: professional # professional | open-source | personal | experiment | hobby
   technologies: ["Java", "Spring Boot", "PostgreSQL"]
   cover: ../../assets/images/projects/my-project.jpg # optional, optimised automatically
   coverAlt: "Dashboard screenshot"
   github: https://github.com/you/my-project # optional
   website: https://my-project.com # optional
   role: "Backend engineer"
   organization: "Acme"
   timeframe: "2025 — 2026"
   screenshots: # optional
     - src: ../../assets/images/projects/my-project-1.jpg
       alt: "Settings screen"
       caption: "The settings screen"
   order: 10
   placeholder: false
   draft: false # drafts are hidden in production builds
   ```

3. Write the case study in the body using `##` headings — Overview, Problem, Context,
   My role, Goals, Technical approach, Architecture, Challenges, Decisions & trade-offs,
   Results, Lessons learned. The headings become the "On this page" table of contents.

Schema: `src/content.config.ts` → `projects`.

## Adding an article

1. Copy `src/content/writing/_template.md` → `src/content/writing/my-post.md`
   (URL: `/writing/my-post`). `.mdx` works too if you want components inside prose.
2. Frontmatter:

   ```yaml
   title: "Post title"
   description: "Used in listings, meta tags and RSS."
   pubDate: 2026-03-01
   updatedDate: 2026-03-10 # optional
   tags: ["java", "spring"] # tag pages are generated automatically
   cover: ../../assets/images/writing/my-post.jpg # optional
   coverAlt: "…"
   featured: false # featured posts appear at the top of /writing
   draft: false
   placeholder: false
   ```

3. Reading time, previous/next navigation, related posts (by shared tags), the RSS feed and
   BlogPosting JSON-LD are all generated for you.

## Updating experience

- **Positions:** one file per role in `src/content/experience/`. Copy `_template.md`.
  Omit `endDate` for your current role. `achievements` render as bullet points — favour
  measurable impact. Set `highlight: true` to show the role on the homepage.
- **Education, certifications, speaking, awards, community:** one YAML file per item in
  `src/content/milestones/`. Set `type:` to `education`, `certification`, `speaking`,
  `award` or `community`.

## Hobbies, Now and About

- **Hobbies:** `src/content/hobbies/*.md`. Each has a category, an icon name (see
  `src/lib/icons.ts` to add more lucide icons), images, favourites, stats, related projects
  and links. The body is free-form Markdown.
- **Now:** `src/content/now/now.md`. Update `updated:` every time you edit it.
- **About:** copy lives in `src/pages/about.astro`; the philosophy, values, facts and
  interests lists live in `src/data/about.ts`.

## Adventures map

`/adventures` (`src/pages/adventures.astro` + `src/components/adventures/`) is an interactive
world map of places visited and places on the wish list. Country outlines are generated at
build time from the `world-atlas` dataset (simplified with `topojson-simplify`, projected with
`d3-geo`), so no map library, tiles or API keys are shipped to the browser; the only client
code is a ~2 KB script for selection and zoom. The homepage shows a lightweight teaser that
lazy-loads a static SVG snapshot (`/images/adventures-map.svg`, generated by
`src/pages/images/adventures-map.svg.ts`) and links to the page.

**Add a location:** append an object to `adventures` in `src/data/adventures.ts`:

```ts
{
  id: "lisbon",                 // unique, URL-safe; deep link is /#adventure-lisbon
  country: "Portugal",
  countryCode: "PT",            // ISO alpha-2; must exist in src/data/country-ids.ts
  city: "Lisbon",
  coordinates: { lat: 38.7223, lng: -9.1393 },
  status: "visited",            // or "wishlist"
  visitedAt: "2025",            // visited only
  description: "…",             // visited only
  // reason: "…", priority: "bucket-list" | "someday"   // wishlist only
  image: "/images/adventures/lisbon.jpg",  // optional, 16:10 works best
  href: "/writing/lisbon-trip",             // optional
}
```

If the country is not yet in `src/data/country-ids.ts`, add its ISO numeric id there so the
outline is highlighted and clickable (the build prints a warning otherwise). Extra zoom
presets live in `mapViews` in the same data file.

**Use it on another page:** `import AdventuresSection from "@components/adventures/AdventuresSection.astro"`
and render `<AdventuresSection />` (props: `id`, `eyebrow`, `title`, `description`, `level`).
`<AdventuresTeaser />` is the small homepage card.

**Theme it:** override the custom properties on `.adventures` in `AdventuresSection.astro`
(`--adventure-visited`, `--adventure-wishlist`, `--adventure-marker-size`, `--adventure-land`, …).

## Adding images

Two options:

1. **Optimised (recommended).** Put files under `src/assets/images/<section>/` and reference
   them from frontmatter (`cover:`, `images[].src`, `screenshots[].src`) using a relative
   path such as `../../assets/images/projects/foo.jpg`. Astro resizes them, generates
   `srcset`, sets width/height (no layout shift) and lazy-loads below the fold.
2. **Static.** Put files under `public/images/...` and reference them by URL
   (`/images/...`). Use this for images referenced inside Markdown body text or when you need a
   stable URL.

Placeholder frames (`<PlaceholderImage />`) are used wherever a photo hasn't been added yet:
the hero portrait, the About gallery, hobby galleries and any project without a `cover`.
To replace one in a page, swap the component for `<Image src={...} alt="…" />` from
`astro:assets`.

## Placeholders

Anything in `[SQUARE BRACKETS]` is placeholder text. Content entries also carry a
`placeholder: true` flag, which renders a small dashed **Placeholder** badge on the site so
sample data can never be mistaken for real data. Once you've replaced the text, set it to
`false` (or delete the line).

Quick way to find what's left:

```bash
grep -rn "\[YOUR\|\[PROJECT\|\[COMPANY\|placeholder: true" src/
```

## Changing theme colours and fonts

All design tokens are in **`src/styles/global.css`**:

- `:root { … }` — light palette, `.dark { … }` — dark palette. Both use `oklch()`.
- The accent colour is `--accent`, `--accent-strong` (for text, higher contrast),
  `--accent-soft` (tinted backgrounds) and `--accent-glow`. Change these four in both blocks.
- The `@theme inline { … }` block maps tokens to Tailwind utilities (`bg-surface`,
  `text-accent-strong`, `rounded-card`, …), so components never hard-code colours.
- Dark mode is class-based (`.dark` on `<html>`); the toggle stores the choice in
  `localStorage` and an inline script applies it before first paint.

Fonts are configured in `astro.config.mjs` under `fonts` using Astro's Fonts API with the
**local** provider, pointing at the `@fontsource-variable/*` npm packages (SIL OFL licensed),
so the build is deterministic and makes no third-party requests. To switch to Google Fonts
instead, replace a family with:

```js
{
  provider: fontProviders.google(),
  name: "Inter",
  cssVariable: "--font-family-sans",
  weights: ["400 600"],
  subsets: ["latin"],
}
```

Astro downloads and self-hosts the files at build time.

## Contact form

The form in `src/pages/contact.astro` is standard HTML that POSTs to `FORM_ACTION`. Set it to
your provider endpoint:

- **Formspree:** `https://formspree.io/f/<form-id>`
- **Netlify Forms:** set `action="/contact"` and add `data-netlify="true"` to the `<form>`
- **Anything else:** any endpoint accepting `name`, `email`, `reason`, `message`

A honeypot field (`_gotcha`) is included for basic spam protection. Until configured, a
notice is shown and the email address is the primary contact path.

## SEO

Handled by `src/components/seo/SEO.astro` (used by `BaseLayout`):

- Unique `<title>`, meta description and canonical URL per page
- Open Graph and Twitter card tags (with a default 1200×630 image)
- `sitemap-index.xml` (`@astrojs/sitemap`), `robots.txt`, `rss.xml`
- JSON-LD: `Person` and `WebSite` (homepage), `BlogPosting` (articles),
  `CreativeWork` (projects), `BreadcrumbList` (all pages with breadcrumbs)

## Deployment

The site is fully static — `npm run build` produces `dist/`.

| Platform             | Settings                                                                                                    |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Vercel**           | Import the repo; framework is auto-detected (`vercel.json` included). Build `npm run build`, output `dist`. |
| **Netlify**          | `netlify.toml` included. Build `npm run build`, publish `dist`.                                             |
| **Cloudflare Pages** | Build command `npm run build`, output directory `dist`, Node version `22`. `public/_headers` sets caching.  |
| **GitHub Pages**     | Use the official `withastro/action`; set `site` (and `base` if not at the domain root).                     |

Remember to set `site` in `astro.config.mjs` before the first deploy.

## Tech stack

- [Astro 7](https://astro.build) — static output, content collections, view transitions,
  Fonts API, image optimisation (`sharp`)
- [Tailwind CSS 4](https://tailwindcss.com) via `@tailwindcss/vite`, plus
  `@tailwindcss/typography` for article prose
- [lucide-astro](https://github.com/dzeiocom/lucide-astro) icons (tree-shaken SVGs)
- TypeScript (strict), ESLint (`typescript-eslint` + `eslint-plugin-astro`), Prettier
- Fonts: Bricolage Grotesque (display) and Inter (body), variable, latin subset, self-hosted

Client-side JavaScript is limited to: the theme toggle, the mobile navigation `<dialog>`,
the project category filter, the copy-email button and Astro's view-transition router.
Section reveal animations use CSS scroll-driven animations and respect
`prefers-reduced-motion`.
