# sapronovview — ivansapronov.com

The personal site of **Ivan Sapronov**, backend & fullstack engineer in Prague: what he
builds (client systems, AI automation), what he can do, his track record, writing and, as
an addition, the hobbies.

Built with [Astro 7](https://astro.build) (static), TypeScript, Tailwind CSS v4 and content
collections. Design: **v2 · R2-C Runtime** with the hero **V6 · Blueprint** — a calm, light
Swiss grid around one live isometric drawing of how software gets made (idea → validate →
architecture → frontend · backend · services → tests → review → CI/CD → deploy → observe →
agent loop). Every number on the site comes from a position in the CV (`src/data/readouts.ts`).
Colours: the **Terracotta sunset** palette (chosen 2026-11-05 from four local variants):
warm paper, terracotta, saffron and raspberry, a sunset sky and contour lines behind the
hero; dark mode is a deep aubergine with stars instead of black.

## Contents

- [Design source](#design-source)
- [Quick start](#quick-start)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Design system in code](#design-system-in-code)
- [Proof numbers](#proof-numbers)
- [3D: hero blueprint and globe](#3d-hero-blueprint-and-globe)
- [Content](#content)
- [Languages (English + Czech)](#languages-english--czech)
- [Placeholders](#placeholders)
- [Still to fill](#still-to-fill)
- [Operator](#operator)
- [Contact form](#contact-form)
- [SEO](#seo)
- [Accessibility and performance](#accessibility-and-performance)
- [Deployment](#deployment)
- [Tech stack](#tech-stack)

## Design source

| What                                   | Where                                                                                                                                                                                                                     |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Design system (brand book, components) | [Ivan Sapronov Design System v2](https://claude.ai/artifact/4JaRi2cConboCJrfRywX2j) — Runtime, approved with the site 2026-10-23                                                                                          |
| Approved homepage (R2-C · Runtime)     | [Website canvas](https://claude.ai/artifact/4Vkjua4E3sE3gDtAZohcuk), pages "R2-C · Runtime" (whole homepage) and "V6 · Blueprint" (header + hero)                                                                         |
| Build spec, tokens, 3D references      | `../claude-design-system/` — `website.md` (spec + approved copy), `components.md`, `tokens.css` / `tokens.json`, `screens/RuntimeDesktop.dc.html` + `screens/HeroV6.dc.html`, `3d/r4v6.html` (hero), `3d/d2.html` (globe) |
| v1 (D4 · Pre-flight, cockpit panel)    | branch `redesign/20261022` (PR #1) — replaced by v2; nothing of its aviation language is left                                                                                                                             |
| Old look (signal orange)               | git history before branch `redesign/20261022`                                                                                                                                                                             |

The canvas wins over the design system where they differ. Known differences:

- **Secondary buttons and header pills** use the 1px `line` border from the artboard; the
  design system lists `line-strong` for secondary buttons. Text buttons are identified by
  their label (WCAG 1.4.11 does not require the boundary), so the approved look is kept.
  **Form fields** do use `line-strong` (their boundary is required).
- **Spotlight capability card** (Automate) is `accent-soft` + 2px `accent` border as
  `website.md` says (the artboard shows it on white).
- **Code blocks** sit on `#10141A` with `github-dark-dimmed` in both themes
  (`components.md`); `website.md` also mentions a github-light pair, which would be
  unreadable on that background.
- The artboard's variant chip ("V6 · Blueprint") above the hero is a canvas label and is not
  rendered on the site.

## Quick start

Requires **Node.js 22.12+** (see `.nvmrc`). The repo uses **npm**.

```bash
npm ci
npm run dev        # http://localhost:4321
```

## Scripts

| Command            | What it does                                                                           |
| ------------------ | -------------------------------------------------------------------------------------- |
| `npm run dev`      | Dev server (placeholders stay visible, marked `[PLACEHOLDER]`)                         |
| `npm run build`    | Production build to `dist/` (placeholders hidden)                                      |
| `npm run preview`  | Serve the production build                                                             |
| `npm run check`    | Type-check `.astro` and `.ts` (`astro check`)                                          |
| `npm run lint`     | ESLint                                                                                 |
| `npm run format`   | Prettier (Astro + Tailwind class sorting); `format:check` verifies                     |
| `npm run test:e2e` | Build, then Playwright smoke tests (desktop 1440 + phone 375)                          |
| `npm run posters`  | Re-render the 3D posters from the live scenes (see [3D](#3d-hero-blueprint-and-globe)) |
| `npm run clean`    | Delete `dist/` and Astro's content cache                                               |

Before pushing: `npm run check && npm run lint && npm run format:check && npm run build`.

## Project structure

```text
src/
  config.ts                 ← name, email, availability, socials, nav, stack; `siteCopy` = hero /
                              meta copy per language
  content.config.ts         ← collection schemas (zod), incl. the Czech `*Cs` collections
  content/                  ← projects, writing, experience, milestones, hobbies, now
                              (+ <collection>/cs/ = Czech versions)
  i18n/
    locales.ts              ← locales, localizePath(), stripLocale(), getStaticPaths helper
    ui.ts                   ← every interface string in EN + CS (typed keys, t())
    typo.ts                 ← Czech typography (nbsp after one-letter words)
    index.ts                ← i18n(Astro) → { locale, t, l } for .astro files
  data/                     ← each file holds { en, cs } texts
    readouts.ts             ← the proof numbers (case studies, project chips, OG card)
    home.ts                 ← hero facts, "What I do" cards, selected projects, own-product line, about
    stack.ts                ← tech stack by category, core vs worked with (homepage, /about)
    contact.ts              ← contact routes (hiring / AI automation / contract work) + topics
    about.ts                ← career story, philosophy, values, "what I enjoy", facts
    adventures.ts           ← visited / wishlist places + home base (globe and map)
  pages/
    [...lang]/              ← every page, built twice: / … (English) and /cs/… (Czech)
    404.astro, cs/404.astro ← English / Czech 404 (Cloudflare serves the nearest 404.html)
  scripts/
    hero3d.ts               ← hero "V6 · Blueprint" (three.js + fat lines, lazy)
    globe3d.ts              ← adventures paper globe (three.js, lazy)
  components/
    layout/                 ← SiteHeader, Footer, ContactPanel (accent "Ready to ship your project.")
    home/                   ← Hero, HeroStage, Expertise, ExpertiseCard, TechStack, ExperienceTimeline,
                              ExperienceDetail, SelectedProjects, Venture, AboutMe, Writing
    profile/                ← ProfileCard (portrait switch on /about)
    projects/               ← ProductModule, ProjectRow, CodeRow, ProjectFilters
    experience/             ← RecordRow, ExperienceItem, MilestoneList
    contact/                ← ContactRoute, ContactForm
    adventures/             ← GlobeStage, AdventureMap (SVG fallback), AdventureDetails, MapLegend
    ui/                     ← StatusPill, StatusBadge, ThemeToggle, ProofNumber, SectionHeader,
                              ThemePicture, LogoMark, CopyEmail, CvLink, …
  layouts/                  ← BaseLayout, ProjectLayout + ArticleLayout (Sheets)
  assets/                   ← portraits, hero + globe posters (optimised by <Picture>)
  lib/                      ← content queries, CV check, placeholder helpers, schema, OG image
  styles/global.css         ← design tokens + Tailwind theme + component classes
scripts/                    ← render-posters.mjs, serve-dist.mjs (tests)
tests/e2e/                  ← Playwright: smoke.spec.ts (English site), i18n.spec.ts (Czech, switch,
                              browser-language redirect, hreflang)
```

Component names follow `components.md`: SiteHeader (was HeaderStrip), StatusPill
(Annunciator), ProfileCard (CrewCard), ProductModule (InstrumentModule), ExpertiseCard
(CapabilityCard until the 2026-11-04 restructure, SystemToggle before that), ProofNumber
(Readout), RecordRow (LogbookRow), Sheet (Kneeboard: `.sheet` + `.prose-sheet`),
ContactPanel (the v1 night contact block). The homepage contents list (ContentsList, was
Checklist) was removed in the restructure; the header nav covers it. The v1 instrument panel (`panel3d.ts`, `PanelStage.astro`), callsign / base
config, annunciator, checklist ticking and every aviation label are gone.

## Design system in code

- **Tokens** live in `src/styles/global.css`, ported 1:1 from `tokens.css` / `tokens.json`:
  `:root` = light, `.dark` = dark, `@theme inline` maps them to utilities (`bg-surface`,
  `text-ink-muted`, `border-line`, `bg-accent`, `text-on-accent`, `shadow-pop`, …) and the
  type scale (`text-display-xl`, `text-display-l`, `text-display-m`, `text-numeral`,
  `text-heading`, `text-title`, `text-body-l`, …) plus the headline roles added on top
  (`text-display-panel`, `text-display-page`, `text-display-s`, `text-numeral-md`,
  `text-card-title`, `text-route-title`, `text-wordmark`, `text-tagline`). Each token
  carries size, line height, tracking and weight, and components use no inline headline
  sizes, so a type change is an edit to `global.css` (plus the font config for a new face).
- **Colour means something:** `accent` (terracotta) = what you can act on (primary buttons,
  links, focus, the contact panel); `ok-ink` / `ok-soft` = healthy, open, in pilot;
  `caution` = a butter status fill; `error-ink` = errors only. `clay-*` colours live only in
  the 3D, the capability icons (faces shaded with oklch relative colours) and the hero
  legend. `accent-2` / `accent-3` (saffron, raspberry) only paint gradients and figures.
- **Backgrounds and decoration** are tokens too, per theme: `--page-bg` and `--panel-bg` are
  gradient layers over `--bg` and `--accent`, `--hero-bg` paints the hero band (sky, contour
  lines, stars), `--page-fixed` is a layer fixed to the viewport (paper grain),
  `--rule-image` colours the section rules, `--btn-primary-bg` the primary button, and
  `--header-bg` / `--header-filter` make the sticky header translucent. Figures are inline
  SVG data URIs (the CSP allows `data:` images); text over every gradient stop passes AA.
- **Theme:** light by default; the header toggle (sun / moon, `aria-pressed`) stores the
  choice in `localStorage` (try/catch); without a stored choice the OS preference wins. The
  inline script in `BaseLayout` applies it before paint (no flash).
- **Type direction (`type/serif-display`):** headlines, proof numbers, card and row titles
  and the header name are set in Newsreader at w430 to w500; running text stays in
  Schibsted Grotesk and labels in IBM Plex Mono. The site loads Newsreader's weight-only
  files (58 KB latin); the optical-size files look finer at 100px but are 132 KB and cost
  about 6 Lighthouse points on mobile. Sizes are in the `@theme` type tokens.
- **Fonts:** Newsreader (variable, wght 200–800), Schibsted Grotesk (variable,
  wght 400–900) and IBM Plex Mono (400 / 500 / 600), self-hosted from
  `@fontsource-variable/newsreader`, `@fontsource-variable/schibsted-grotesk` and
  `@fontsource/ibm-plex-mono` through Astro's `fonts` config. Each is split into a **latin**
  family (preloaded — for the mono only the 500 labels) and a **latin-ext** family (Czech
  diacritics, loaded on demand, carries the metric-matched fallback); `--font-display` /
  `--font-sans` / `--font-mono` chain them.
- **Surfaces:** `.card` (surface + 1px line, radius 12), `.lift` (hover: −2px + shadow-pop),
  `.sheet` + `.prose-sheet` (long reading, 68ch), `.section-head` (1px ink rule, display-l
  title, an optional link or action), `.btn-primary` / `.btn-secondary` / `.btn-ink`,
  `.icon-btn`, `.link-more` ("All projects"), `.chip`, `.status-pill`, `.label`, `.meta`.
- **Motion:** content is static (no scroll reveals, no count-ups). The hero 3D scene is the
  one animated element; link cards lift on hover.
- **Glyphs:** neither font ships → ← ↗ ≈ in its Latin subsets, so `Arrow` / `Approx`
  (`src/components/ui/`) draw them as em-sized `currentColor` SVGs with a stroke per text
  weight, and `Glyphs` renders data strings ("h → min", "≈ ½", chips, the hero legend) with
  them. Screen readers get words: a readout's `spoken` / `chipSpoken` ("hours to minutes",
  "approximately half") or "to" / "approximately" per glyph; link arrows are `aria-hidden`.
  Use `<Arrow />` instead of typing "→" in markup.
- **Scoped styles and utilities:** Astro's scoped `<style>` is unlayered and beats Tailwind's
  layered utilities, so components never set `display` in scoped CSS for elements that take
  a `class` from outside (e.g. `StatusPill` gets `inline-flex` as a utility so
  `max-[520px]:hidden` works). Don't put `@layer` in component styles: the layer order would
  then be decided by whichever stylesheet comes first.

## Proof numbers

`src/data/readouts.ts` is the single source for every number: the ProofNumbers on case
studies, the metric chips on the homepage project cards (`chip`) and the three numbers on
the OG card (`heroReadoutIds`). Each readout has a `value`, a `label`, a `source` (the employer /
client from the track record) and a `detail` sentence. Rules:

- Only numbers that are in `src/content/experience/` — never a new one.
- `count` (optional) makes the number count up (`prefix` + 0→`to` + `suffix`).
- `project` links the number to a case study (`/projects/<slug>`).
- `spoken` / `chipSpoken` say the value in words for screen readers when the symbols don't
  read well (`h → min` → "hours to minutes").

## 3D: hero blueprint and globe

- **Hero** (`src/scripts/hero3d.ts`, port of `3d/r4v6.html`, three r184 + `Line2` /
  `LineGeometry` / `LineMaterial`) — an isometric technical drawing that builds itself in a
  deterministic 14 s loop: idea sketches (two struck out at the validation gate), the
  architecture drawn stroke by stroke and filled, test stamps, a rose review mark that erases
  one link and redraws it through a queue, marching CI/CD dashes, deployed blocks that
  extrude, a sparkline, and the rose agent orb flying back to sketch the next idea. Cursor →
  ±10° turn / ±3° tilt (lerped, device tilt ignored). Light / dark palettes from the scene,
  rebuilt when the theme changes; callout labels are drawn after the self-hosted IBM Plex
  Mono is ready (no Google Fonts request); `LineMaterial` resolution and width follow the
  stage size. The live scene starts on the poster's frame (t = 12.85 s, the finished
  drawing), holds it 1.6 s, then loops. On stages narrower than 600px (phones) the callout
  labels are drawn 1.8× larger (≈ 9px text at 375 instead of 5) and only IDEA, ARCHITECTURE,
  TESTS, DEPLOY and the AGENT LOOP tag are shown, so nothing collides.
  The canvas is transparent (`alpha: true`, cleared at alpha 0) and the stage has no fill,
  so the hero band's sky shows through the drawing; the posters keep that transparency.
- **Globe** (`src/scripts/globe3d.ts`, port of `3d/d2.html`) in the terracotta palette:
  clay-white plate, visited countries in ink, home (Czechia) in accent with a ring on
  Prague, wishlist countries with a dashed accent outline. No routes: every place is a
  point (a saffron dot for visited, an accent ring for wishlist, each on a paper halo).
  Points are hit-tested in screen space (14 px mouse, 22 px touch, front side only):
  hover enlarges the point and names it ("Munich · Germany", in the page language), click
  opens its card; elsewhere hover names the country and a click on a country with places
  opens the country. Drag to rotate with inertia; the country list is the keyboard /
  screen-reader equivalent.
- **Loading rules** (`HeroStage.astro`, `GlobeStage.astro`): the poster is the LCP image and
  the fallback. `three@0.184.0` is imported dynamically, only on `/` and `/adventures`, only
  when the stage is visible — on idle on desktop with a mouse, on the first scroll / touch /
  key on phones. WebGL is probed only at that moment. DPR ≤ 2 (≤ 1.5 on phones); the hero
  pauses offscreen and in hidden tabs, the globe renders on demand; both dispose on
  `astro:before-swap`.
- **No WebGL or reduced motion:** the hero stays on its poster; `/adventures` shows the flat
  d3-geo map instead of the globe. three.js is never downloaded in either case.
- **Posters** (`src/assets/hero/blueprint-{light,dark}.png`,
  `src/assets/hero/blueprint-small-{light,dark}.png`, the Czech `…-{light,dark}-cs.png` of
  both, and `src/assets/globe/globe-{light,dark}.png`) are rendered from the same scene code
  at the real stage size — 1440 viewport at 2×, and the phone hero at a 375px stage at 3×
  (with the phone labels). The hero callouts come from the UI dictionary (`hero3d.*` keys),
  so each language has its own hero posters; `ONLY=cs npm run posters` re-renders just the
  Czech ones. The globe has no text and one poster pair serves both languages:

  ```bash
  npm run build && npm run preview -- --host 127.0.0.1 --port 4321   # in another terminal
  npm run posters                                                   # BASE_URL=… to override
  npm run build
  ```

  `ThemePicture` serves the matching light / dark poster (and the phone render below 600px)
  as AVIF / WebP. Its inline script right after `</picture>` points the dark sources at the
  stored theme before first paint, so a returning visitor whose stored theme differs from
  the OS never sees the other poster (the browser's speculative fetch of the OS-theme file
  may still happen in that case).

## Content

- **Personal details, hero eyebrow and lede, availability:** `src/config.ts`.
  `availability.status` (`open` / `limited` / `closed`) drives the header StatusPill and the
  profile card. The production URL is `site` in `astro.config.mjs` (`https://ivansapronov.com`).
- **Projects:** `src/content/projects/*.md` (copy `_template.md`; filename = URL). Products set
  `tagline` + `summary` (+ optional `facts`, e.g. FOR · MY ROLE) and appear under "My own
  product"; statuses include `pilot` and `validating`. `featured: true` client work appears as
  ProductModules on `/projects`. Entries still marked `placeholder: true` that have a `github`
  URL are listed under "Code on GitHub" as compact rows (no case-study page).
- **Removed pages:** Apexline was taken off the site (2026-10-23). `/projects/apexline` and the
  older `/projects/apex-line-market-research` forward to `/projects` (Astro `redirects` in
  `astro.config.mjs` + a 301 in `public/_redirects` for Cloudflare Pages).
- **Homepage:** hero → What I do → Tech stack → Experience → Shipped work → (My own
  product) → About me → (Writing) → contact panel. My own product shows only when
  `siteConfig.homeSections.ownProduct` is `true`; it is `false` by default. Copy lives in `src/data/home.ts`
  (`heroFacts`, `expertise`, `homeCases` with slugs that must exist and chips that are
  readout ids, `ventureIntro`, `homeAbout`), the stack in `src/data/stack.ts`, the role line
  and lede in `siteCopy` (`src/config.ts`). Source of truth is the CV (June 2026): no claim,
  technology or number that the CV doesn't have; the AI & automation tools in the stack
  were added on request. A stack item is a name or `{ en, cs }` when it needs translating.
- **Experience timeline (scroll rail):** every position, newest first, with its first three
  `achievements` (keep the strongest first) and its `shipped` line. From 1024px a sticky panel
  follows the position in view (years, company, shipped, "02 / 05") above a rail that fills as
  you scroll; the other positions dim. Data in `src/lib/timeline.ts`, one position in
  `ExperienceDetail.astro`; the other prototypes (time axis, career layers, tech metro) live on
  the local `exp/*` branches.
- **Experience:** `src/content/experience/*.md`. `shipped` is the track record's SHIPPED cell — a
  shortened form of a real achievement, never a new claim. Milestones (education,
  certifications, talks…) go in `src/content/milestones/*.yaml`.
- **CV download:** drop the PDF at `public/cv/ivan-sapronov-cv.pdf`; the hero, the homepage
  Experience section, the contact panel and `/experience` then show "Download CV" instead of
  "CV on request" (`src/lib/cv.ts`, `CvLink.astro`).
- **Writing:** `src/content/writing/*.md|mdx`, tags → `/writing/tags/<tag>`, RSS at `/rss.xml`.
  While no post is published (all are drafts / placeholders), the site hides writing
  automatically: Writing stays out of the menu sheet and the footer, the RSS links
  disappear, the homepage shows no Writing section, and `/writing` is `noindex` and out of
  the sitemap. Publish one post and it all comes back (the homepage then shows the latest
  posts as rows after About me).
- **Hobbies / Now / About:** `src/content/hobbies/*.md`, `src/content/now/now.md`,
  `src/pages/[...lang]/about.astro` + `src/data/about.ts`. Aviation appears only as hobby content
  (`/hobbies`, `/adventures`, the off-duty line and the personal paragraph on `/about`).
- **Adventures:** `src/data/adventures.ts` (+ ISO numeric ids in `src/data/country-ids.ts`).
- **Public images:** put files in `public/images/` only when they need a stable public URL
  (e.g. `ivan-sapronov.jpg` for structured data, or an image referenced from Markdown body
  text). The share image and the static map are generated (`src/lib/brand-images.ts`,
  `src/pages/images/`); a static file with the same path would override them. Everything
  else belongs in `src/assets/` so `<Picture>` can resize it and serve AVIF / WebP.
- **Portraits:** `src/assets/portraits/{turtleneck,green,black,white}.jpg` are masters
  (JPEG q95, 4:4:4, sRGB) made from the original PNGs in `Docs/Avatars`; the same studio
  photo shows in both themes. `ProfileCard` crops each to the 216×270 frame at build (from
  the top) and serves AVIF q70 / WebP q82 at 1x, 2x and 3x with `layout: "none"`, so the
  site-wide responsive widths don't apply; a 432×540 JPEG is the `<img>` fallback. To
  replace a photo, overwrite its master from a lossless original and keep the 4:5-ish
  framing with the face in the top third. Alt text and switch labels live in
  `src/lib/portraits.ts`. The homepage card and `/about` open on the turtleneck;
  `public/images/ivan-sapronov.jpg` (800 px, the structured-data photo) is the same shot.
  `cutout-green.webp` stays only for the share card.

## Languages (English + Czech)

English is the default and keeps its URLs (`/about`); Czech lives under `/cs/` for every
page (`/cs`, `/cs/about`, `/cs/projects/dynamic-form-engine`, …). Astro i18n is configured in
`astro.config.mjs` (`defaultLocale: "en"`, `prefixDefaultLocale: false`); every page sits in
`src/pages/[...lang]/` and is generated once per language (`localeParams()`).

- **Which language a visitor sees:** a small inline script in `<head>` of the English pages
  (BaseLayout) sends a first-time visitor whose browser prefers Czech — the first `cs*` / `en*`
  entry of `navigator.languages` is Czech — to the same page under `/cs` before paint
  (`location.replace`, keeping `?query` and `#hash`). Everyone else stays on English. Czech
  pages never redirect; bots, crawlers, Lighthouse and automated browsers
  (`navigator.webdriver`) are never redirected.
- **Switch:** "EN | CS" in the header next to the theme toggle (≥ 521px) and in the menu
  sheet. It links to the same page in the other language and stores the choice in
  `localStorage` (`lang`), which from then on wins over the browser language.
- **Header:** with the switch (and the Czech labels) the full header needs about 1000px, so
  the nav collapses into the menu below 1024px (was 860px), and the availability pill shows
  in the header from 1240px (the profile card always shows it).
- **SEO:** `<html lang>`, canonical per language, `hreflang` en / cs / x-default (English) on
  every page, `og:locale` + `og:locale:alternate`, sitemap alternates (`@astrojs/sitemap`
  `i18n`), JSON-LD `inLanguage`, and a Czech share card (`/images/og-default-cs.png`). RSS stays
  English.

**Where the Czech text lives — edit it there:**

| What                                                                                       | File                                                               |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Interface strings (nav, buttons, labels, headings, form, errors, 404, legend, 3D callouts) | `src/i18n/ui.ts` (`cs` object; keys must match `en`, type-checked) |
| Hero role line / lede, title, meta description, profile fields, languages                  | `siteCopy.cs` in `src/config.ts`                                   |
| Proof numbers (labels, values, spoken forms, chips)                                        | `texts.cs` in `src/data/readouts.ts`                               |
| Hero facts, "What I do", selected projects, own-product line, about                        | `src/data/home.ts`                                                 |
| Tech stack category names                                                                  | `label.cs` in `src/data/stack.ts`                                  |
| Career story, philosophy, values, "what I enjoy", facts                                    | `src/data/about.ts`                                                |
| Contact routes, topics, mailto subjects                                                    | `src/data/contact.ts`                                              |
| City names, trip notes, wishlist reasons (country names come from `Intl.DisplayNames`)     | `czech` in `src/data/adventures.ts`                                |
| Portrait alt text and switch labels                                                        | `src/lib/portraits.ts`                                             |
| Projects, experience, hobbies, now                                                         | `src/content/<collection>/cs/<same file name>.md`                  |

A Czech content file holds only the translatable frontmatter (title, description, tagline,
role, achievements, …) plus the Czech Markdown body; everything else (dates, status, stack,
links, `placeholder`) comes from the English file, and a missing file or field falls back
to English (`src/lib/content.ts`). Placeholder hiding, the writing gate and the hidden hobby
write-ups work the same in Czech. Writing posts stay English: `/cs/writing/…` shows them
with a "Článek je v angličtině." note and `lang="en"`.

**Czech typography is automatic:** write normal spaces — a non-breaking space after the
one-letter words k, s, v, z, o, u, a, i is added to UI strings, data, frontmatter and Markdown
(`src/i18n/typo.ts`, `src/lib/markdown-czech.mjs`). Use „uvozovky“ and an en dash with spaces
( – ). Dates and numbers follow the language (`Intl`, "2. 11. 2026", "leden 2025 – dosud").

**Status: the Czech copy was translated on 2026-11-02 and awaits Ivan's review** — the
side-by-side table is in the PR / hand-off notes; the least certain lines are listed there.
Proper nouns, product names and the usual English dev terms (backend, BFF, CI/CD, review,
pipeline…) stay English on purpose.

## Placeholders

Any value containing `[…]` and any entry with `placeholder: true` **never renders in
production**:

- Entries with `placeholder: true` are dropped from every list and get no page
  (`src/lib/content.ts`).
- Field values containing `[…]` are hidden one by one (`shown()` / `shownAll()`).
- Markdown paragraphs / list items still containing `[…]`, and headings left empty by
  that, are removed from the body at build time (`src/lib/markdown-hide-placeholders.mjs`).

`npm run dev` keeps everything visible (dev-only `[PLACEHOLDER]` badges) so gaps are easy
to find: `grep -rn "placeholder: true\|\[[A-Z]" src/content src/data`.

## Still to fill

Hidden in production until real content replaces the placeholder (nothing here may be
invented):

| Where                                        | Hidden                                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `content/writing/*` (all 3 posts)            | Whole posts — they are template samples (`placeholder: true`): "Building this site with Astro", "What ultralight flying taught me about checklists", "Notes on integrating Keycloak with Spring Security". Rewrite or approve, then set `placeholder: false`. Until then `/writing` shows "No posts published yet".                                    |
| `content/projects/correct-context-wallet.md` | Case-study page (organization, year, most body sections are placeholders). Listed under "Code on GitHub" with its real description, stack and repository link.                                                                                                                                                                                         |
| `content/projects/faradey-android.md`        | Case-study page (organization, year, approach / results sections). Listed under "Code on GitHub".                                                                                                                                                                                                                                                      |
| `content/projects/land-routing-service.md`   | Case-study page (year, problem / approach sections). Listed under "Code on GitHub".                                                                                                                                                                                                                                                                    |
| `content/projects/paymont-wallet.md`         | Case-study page (year, most body sections). Listed under "Code on GitHub" with both repositories.                                                                                                                                                                                                                                                      |
| `content/projects/ownira.md`                 | Hidden (`hidden: true`, 301s from `/projects/ownira`). `timeframe` (start year not confirmed). `website` not set — ownira.cz currently shows a parking page; add `website: https://ownira.cz` when it is live (WEB stays text until then).                                                                                                             |
| `content/now/now.md`                         | Current client / project line, "Learning" (2), "Reading" (2 books)                                                                                                                                                                                                                                                                                     |
| `content/milestones/`                        | No milestones yet (template only) — the section is hidden                                                                                                                                                                                                                                                                                              |
| CV                                           | `public/cv/ivan-sapronov-cv.pdf` missing → "CV on request" links to `/contact?topic=hiring`                                                                                                                                                                                                                                                            |
| Contact form                                 | `PUBLIC_FORM_ACTION` (Formspree endpoint) not set → honest "not connected yet" state. **Connect it only after** the `/contact` privacy note is a full GDPR Art. 13 text: controller and contact, purpose, legal basis, retention period, Formspree as processor in the US (EU–US DPF / SCCs), the visitor's rights, and the right to complain to ÚOOÚ. |

### Content to add (not hidden — nothing renders until written)

- `src/data/about.ts` (`story`, both languages): the personal part of the career story (where
  you grew up, first computer, first flight / ride) — there is no placeholder, add real text
  when ready.
- Czech copy (2026-11-02) awaits Ivan's review. Anything filled
  in later in English (trip notes, hobby write-ups, now, facts) needs its Czech version too —
  until then Czech pages fall back to the English text.

### Copy decisions (Ivan, 2026-10-23)

Answered:

1. **Philosophy 03** (`src/data/about.ts`), "Checklists over heroics": the v2 wording without
   the flying sentence is approved (tightened in the deslop pass, see below): "Good people make
   bad mistakes when they skip the routine; runbooks, reviews and tests keep me on it."
2. **/about personal paragraph** ("…Flying rewards preparation and checklists, riding rewards
   attention, travel rewards curiosity…"): keep as it is. The deslop pass only replaced its
   em dash with a semicolon.
3. **/hobbies write-ups:** hidden in production until Ivan writes or confirms them — while an
   entry is `placeholder: true`, `/hobbies` shows only its title and tagline
   (`src/components/hobbies/HobbyModule.astro`). Set `placeholder: false` to publish one.

Not asked separately (informational, de-aviation of labels): /about "About · crew" → "About",
"Installed systems" → "Stack I ship with", "SOP 01…04" → "01…04"; /writing meta lost "— plus
the occasional lesson from the cockpit", empty state "No posts published yet"; `/projects`
"Products and featured work"; `/experience` meta "Track record of …"; case-study label
"Proof numbers".

### Deslop pass (2026-11-02)

The whole site was reviewed with the `deslop-ui` and `deslop-writing` skills, which list the
habits that make a page read as AI-generated. Rules the copy now follows, in both languages:

- No em dashes in visible copy. Use a colon, semicolon, comma, parentheses or a new sentence;
  date ranges use an unspaced en dash (2025–2026). Czech keeps its typographic quotes „…“.
- No bold-label bullets (`**Label.** text`) in case studies; write each bullet as a sentence.
- No announcing honesty ("Every number on this page is real", "only the numbers that are
  real"): the numbers carry their source instead.
- No "From X to Y" taglines, triplet slogans or filler words (actually, scalable,
  well-structured, robust); say what the thing does.
- Mono labels are sentence case; only the hero drawing legend stays uppercase, because it
  is the key to the uppercase labels inside the drawing.

Changed copy Ivan may want to check: the hero lede (now names
all four capabilities), the hobby taglines, the /hobbies heading ("What I do off duty") and
the About values.

## Operator

The footer of every page carries the business operator line required by §435 of the Civil
Code (name, IČO, registered seat), in English or Czech (`footer.operator` in
`src/i18n/ui.ts`; the data itself is `siteConfig.operator` in `src/config.ts`, verified in ARES
on 2026-11-02: sole trader in the Trade Register, not a VAT payer — so no DIČ). The same seat
and IČO are in the `Person` JSON-LD.

## Contact form

`src/components/contact/ContactForm.astro` (on `/contact`): name, email, topic
(Hiring / AI automation / Contract work / Something else; in Czech Nábor / AI automatizace /
Zakázka / Něco jiného — preselected from `?topic=`, the same ids in both languages), message and
a `_gotcha` honeypot. States: field errors (`aria-invalid` + message), submitting (busy,
disabled), success (`role="status"`, only after the endpoint answers OK), failure
(`role="alert"`, says it failed, gives the email, keeps the text).

- **Not connected (now):** the form says "Form not connected yet — email me at …", email
  stays the primary action, and "Write it as an email" opens the same message (subject from
  the topic) in the visitor's email app. Nothing is sent from the page.
- **Connect Formspree:** first extend the privacy note on `/contact` to a full GDPR Art. 13
  text (see "Still to fill"), then create a form at formspree.io and build with
  `PUBLIC_FORM_ACTION=https://formspree.io/f/<id>` (e.g. a Cloudflare Pages environment
  variable). The CSP already allows `https://formspree.io` for `connect-src` and
  `form-action`.
- The site sets no cookies and runs no analytics, so there is no consent banner; the theme
  choice lives in `localStorage` only.

## SEO

`src/components/seo/SEO.astro`: per-page title / description / canonical (none on `noindex`
pages such as the 404 and the empty `/writing`), Open Graph + Twitter cards (plus
`profile:first_name` / `profile:last_name` on the home page), `sitemap-index.xml`,
`robots.txt`, `rss.xml` (linked only once a post exists).

Structured data (`src/lib/schema.ts`): `Person` (`#person`: jobTitle, sameAs, url, and a
stable `image` at `/images/ivan-sapronov.jpg`) and `WebSite` on the home page,
`ProfilePage` on `/about` with that Person as `mainEntity`, `BlogPosting`, `CreativeWork`,
`BreadcrumbList`.

Every page has `hreflang` alternates (en, cs, x-default = English) and a canonical URL in
its own language; see [Languages](#languages-english--czech).

The 1200×630 share image (`/images/og-default.png`, Czech: `/images/og-default-cs.png`) is
generated at build time (`src/lib/brand-images.ts`) in the v2 look: cube mark + "Open to
projects" pill, the eyebrow, the name in Newsreader, the lede in Schibsted Grotesk, three
proof numbers in Newsreader with their mono caption and source, and the cut-out portrait.
Text is converted to vector paths with opentype.js from `@fontsource/newsreader`,
`@fontsource/schibsted-grotesk` and `@fontsource/ibm-plex-mono`, so the card is the same on
any build machine. Captions wrap at 27 characters so long Czech ones stay in their column.
The favicon and touch icon are the isometric cube mark.

## Accessibility and performance

- WCAG 2.2 AA: token contrast pairs from the design system, visible focus rings (2px
  `focus`, 2px offset; `on-accent` on the contact panel), 44px targets in the header,
  breadcrumbs, footer, forms and chips, skip link, labelled fields, status always in words
  (never colour alone), the globe's list as its keyboard equivalent, reduced motion respected
  everywhere. axe-core 4.10 (WCAG 2.2 AA + best practice), 2026-11-02: **0 violations** in
  124 runs — 14 routes in English and the same 14 in Czech (incl. the four case studies,
  `/writing` and the 404), light and dark, 1440 and 375, plus the menu sheet open in both
  languages and runs with motion on (`/`, `/cs`, `/adventures`, `/cs/adventures`).
- Lighthouse 12.8 (local build, mobile preset, 2026-11-02, light and dark): `/` Performance
  96 (LCP 2.6 s, the phone poster), `/cs` 94 (LCP 2.9 s), `/adventures` 94 (LCP 2.7 s),
  `/cs/adventures` 93 (LCP 3.0 s); TBT 0 ms, CLS 0, Accessibility, Best practices and SEO
  100 on all four. (The same machine measured `origin/main` at 97 / 96 for `/` and
  `/adventures` that day — the 2026-10-23 run gave 99 / 99.) Czech pages preload the
  latin-ext fonts they need above the fold.
- three.js (~133 KB gzip, plus 14 KB for the hero scene) loads only on `/` and `/adventures`,
  lazily (see above).

## Deployment

Domain: **https://ivansapronov.com** (set as `site` in `astro.config.mjs` and in
`public/robots.txt`). Hosting: **Cloudflare Pages**:

| Setting                | Value                                              |
| ---------------------- | -------------------------------------------------- |
| Build command          | `npm run build`                                    |
| Build output directory | `dist`                                             |
| Environment variable   | `NODE_VERSION=22` (and later `PUBLIC_FORM_ACTION`) |
| Production branch      | `main`                                             |

`netlify.toml` and `vercel.json` are kept untouched in case another host is ever needed.

### Security headers

`public/_headers` (Cloudflare Pages) sets, for every path:

- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `X-Frame-Options: DENY`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  (no `interest-cohort`, which Chrome reports as unknown);
- `Strict-Transport-Security: max-age=31536000` (no `includeSubDomains`, no `preload`);
- a header-level **Content-Security-Policy**:

  ```text
  default-src 'self'; script-src 'self' 'unsafe-inline' data:; style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://formspree.io;
  form-action 'self' https://formspree.io mailto:; frame-ancestors 'none'; base-uri 'self';
  object-src 'none'
  ```

  The site loads nothing from other origins. Inline scripts and styles are allowed because
  Astro inlines small module scripts and component styles, and the theme bootstrap runs
  inline before paint. `data:` in `script-src` is for `ClientRouter`: after a swap it inserts
  an empty `data:` module whose load event makes `astro:page-load` wait until the new page's
  inline modules have run; blocking it makes initialisation after navigation racy (with
  inline scripts already allowed it adds no real exposure). `mailto:` in `form-action` is the
  not-connected form's no-JS fallback. Astro's per-page hash CSP (`security.csp`) was tried
  earlier and breaks `ClientRouter` navigation, so it stays off.

plus long-lived caching for `/_astro/*`. `public/_redirects` holds the permanent redirects
(with trailing-slash variants).

`astro preview` ignores `_headers`; `scripts/serve-dist.mjs` applies it the way Cloudflare
Pages does, so the whole Playwright suite runs under these headers, and one test navigates
with `ClientRouter` through five pages, starts both 3D scenes and submits the form with zero
CSP violations. After changing the policy, run `npm run test:e2e` and check the Pages
preview deploy (console) before merging.

## Tech stack

- Astro 7 — static output, content collections, Sätteri Markdown + a placeholder plugin,
  view transitions (`ClientRouter`), Fonts API, `<Picture>` (AVIF / WebP via `sharp`)
- Tailwind CSS 4 (`@tailwindcss/vite`), tokens from the design system
- three.js 0.184.0 (lazy; `Line2` fat lines for the hero), world-atlas + topojson-client
  (globe), d3-geo (build-time SVG map)
- TypeScript (strict), ESLint, Prettier, Playwright smoke tests; opentype.js (build-time OG text)
- Fonts: Newsreader, Schibsted Grotesk and IBM Plex Mono (latin + latin-ext, self-hosted, SIL OFL)
