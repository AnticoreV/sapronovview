# sapronovview — ivansapronov.com

The personal site of **Ivan Sapronov**, backend & fullstack engineer and founder in Prague:
what he builds (Ownira, client systems), what he can do, the logbook, writing and —
as an addition — the hobbies.

Built with [Astro 7](https://astro.build) (static), TypeScript, Tailwind CSS v4 and content
collections. Design: **D4 · Pre-flight** — the site is an aircraft instrument panel whose
instruments read real engineering facts. _Instruments, not adjectives._

## Contents

- [Design source](#design-source)
- [Quick start](#quick-start)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Design system in code](#design-system-in-code)
- [Readouts — the numbers on the panel](#readouts--the-numbers-on-the-panel)
- [3D: instrument panel and globe](#3d-instrument-panel-and-globe)
- [Content](#content)
- [Placeholders](#placeholders)
- [Still to fill](#still-to-fill)
- [Contact form](#contact-form)
- [SEO](#seo)
- [Accessibility and performance](#accessibility-and-performance)
- [Deployment](#deployment)
- [Tech stack](#tech-stack)

## Design source

| What                                   | Where                                                                                                                                                             |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Design system (brand book, components) | [Ivan Sapronov Design System v1](https://claude.ai/artifact/4JaRi2cConboCJrfRywX2j) — approved 2026-10-22                                                         |
| Approved homepage (D4 · Pre-flight)    | [Website directions canvas](https://claude.ai/artifact/4Vkjua4E3sE3gDtAZohcuk), artboards `PreflightDesktop` (1440) + `PreflightMobile` (375)                     |
| Build spec, tokens, 3D references      | `../claude-design-system/` — `website.md` (spec + approved copy), `tokens.css` / `tokens.json`, `screens/`, `3d/d4.html` (panel), `3d/d2.html` (globe), `assets/` |
| Old look (signal orange)               | git history before branch `redesign/20261022`                                                                                                                     |

The canvas wins over the design system where they differ; deviations are listed in the
build report and below where relevant.

## Quick start

Requires **Node.js 22.12+** (see `.nvmrc`).

```bash
npm ci
npm run dev        # http://localhost:4321
```

## Scripts

| Command            | What it does                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------- |
| `npm run dev`      | Dev server (placeholders stay visible, marked `[PLACEHOLDER]`)                           |
| `npm run build`    | Production build to `dist/` (placeholders hidden)                                        |
| `npm run preview`  | Serve the production build                                                               |
| `npm run check`    | Type-check `.astro` and `.ts` (`astro check`)                                            |
| `npm run lint`     | ESLint                                                                                   |
| `npm run format`   | Prettier (Astro + Tailwind class sorting); `format:check` verifies                       |
| `npm run test:e2e` | Build, then Playwright smoke tests (desktop 1440 + phone 375)                            |
| `npm run posters`  | Re-render the 3D posters from the live scenes (see [3D](#3d-instrument-panel-and-globe)) |
| `npm run clean`    | Delete `dist/` and Astro's content cache                                                 |

Before pushing: `npm run check && npm run lint && npm run format:check && npm run build`.

## Project structure

```text
src/
  config.ts                 ← name, title, lede, email, availability, socials, nav, stack
  content.config.ts         ← collection schemas (zod)
  content/                  ← projects, writing, experience, milestones, hobbies, now
  data/
    readouts.ts             ← the proof numbers (HTML + 3D panel read the same file)
    home.ts                 ← capabilities (SYS 1–4), checklist, homepage case studies
    contact.ts              ← contact routes (hiring / investing / partnering) + topics
    about.ts                ← philosophy, values, "what I enjoy", facts
    adventures.ts           ← visited / wishlist places + home base (globe and map)
  scripts/
    panel3d.ts              ← hero instrument panel (three.js, lazy)
    globe3d.ts              ← adventures paper globe (three.js, lazy)
  components/
    layout/                 ← Header (HeaderStrip), Footer, ContactBlock (night panel)
    home/                   ← Hero, PanelStage, CrewRow, Products, Systems, Cases, Logbook, WritingOffDuty
    crew/                   ← CrewCard (rotary portrait switch on /about), Checklist
    projects/               ← InstrumentModule, ProjectRow, CodeRow, ProjectFilters
    experience/             ← LogbookRow, ExperienceItem, MilestoneList
    contact/                ← ContactRoute, ContactForm
    adventures/             ← GlobeStage, AdventureMap (SVG fallback), AdventureDetails, MapLegend
    ui/                     ← Annunciator, ThemeKnob, Readout, StatusLamp, SectionHeader, ThemePicture, CopyEmail, …
  layouts/                  ← BaseLayout, ProjectLayout + ArticleLayout (kneeboard sheets)
  assets/                   ← portraits, hero + globe posters (optimised by <Picture>)
  lib/                      ← content queries, placeholder helpers, schema, OG image, Markdown plugin
  styles/global.css         ← design tokens + Tailwind theme + component classes
scripts/                    ← render-posters.mjs, serve-dist.mjs (tests)
tests/e2e/                  ← Playwright smoke tests
```

## Design system in code

- **Tokens** live in `src/styles/global.css`, ported 1:1 from `tokens.css` / `tokens.json`:
  `:root` = day panel, `.dark` = night panel, `@theme inline` maps them to utilities
  (`bg-panel`, `bg-face`, `text-ink-muted`, `text-select`, `shadow-module`, …). `.night`
  forces the night panel on one section (contact block, footer, /contact) whatever the
  page theme is.
- **Colour code (avionics):** `select` cyan = what you can press (fill only on the day
  panel — never cyan text there, 1.30:1), `route` magenta = routes and globe arcs, `ok`
  green = normal / open, `caution` amber = in progress. Nothing else is coloured.
- **Theme:** day by default; the header knob toggles and stores the choice in
  `localStorage` (try/catch); without a stored choice the OS preference wins. The inline
  script in `BaseLayout` applies it before paint (no flash).
- **Fonts:** Saira (variable, wght + wdth — display is set at width 112) and JetBrains Mono,
  self-hosted from `@fontsource-variable/*` through Astro's `fonts` config. Each is split
  into a **latin** family (preloaded) and a **latin-ext** family (Czech diacritics, loaded
  on demand, carries the metric-matched fallback); `--font-sans` chains them.
- **Surfaces:** `.module` (raised), `.face` + `.face-bezel` (instrument faces), `.sheet`
  (kneeboard for long reading), `.btn-primary` / `.btn-secondary`, `.link-ghost`, `.chip`,
  `.label`, `.display`.
- **Motion:** CSS + small vanilla scripts only. Annunciator blinks twice on load, readouts
  count up once, checklist ticks as sections are reached, needles settle on a damped spring.
  `prefers-reduced-motion` → final states, no 3D.

## Readouts — the numbers on the panel

`src/data/readouts.ts` is the single source for every proof number: the 3D panel, the
readout row under the hero (2×2 on phones, one row of four from `md`), the case-study
readouts, the OG card and the panel's alt text. Each
readout has a `value`, a `label`, a `source` (the employer / client from the logbook) and a
`detail` sentence. Rules:

- Only numbers that are in `src/content/experience/` — never a new one.
- `count` (optional) makes the HTML readout count up (`prefix` + 0→`to` + `suffix`).
- `project` links the readout to a case study (`/projects/<slug>`).
- `panel` / `panelValue` are the short LCD label and value used in 3D when the full ones do
  not fit (e.g. "p95 latency ≈ halved" on the page, `≈ ½` on the panel's LCD).

After changing a value shown on the panel, re-render the posters (below) so the static
image matches the live scene.

## 3D: instrument panel and globe

- **Panel** (`src/scripts/panel3d.ts`, port of `3d/d4.html`, three r184) — procedural
  aluminium panel, CanvasTexture dials, env-mapped glass. Cursor → attitude indicator
  (lerped, ±8° pitch / ±12° roll, device tilt ignored); needles settle on a damped spring
  when the scene goes live; day / night palettes follow the theme; dial textures are drawn
  after the web fonts are ready.
- **Globe** (`src/scripts/globe3d.ts`, port of `3d/d2.html`, travel mode) — paper globe from
  `world-atlas` countries-110m + `topojson-client`: visited countries in ink, home (Czechia)
  in magenta, wishlist countries with a dashed magenta outline, magenta arcs from Prague.
  Drag to rotate with inertia; hover shows the country name; clicking a country with places
  opens its card; picking a place or country in the list turns the globe to it (the list is
  the keyboard / screen-reader equivalent).
- **Loading rules** (`PanelStage.astro`, `GlobeStage.astro`): the poster is the LCP image
  and the fallback. `three@0.184.0` is imported dynamically, only on `/` and `/adventures`,
  only when the stage is visible — the panel on the visitor's first pointer move / scroll /
  key / touch, the globe on idle (on first interaction on phones). WebGL is probed only at
  that moment. DPR is capped at 2 (1.5 on phones); rendering is on demand and pauses
  offscreen and in hidden tabs; both scenes dispose on `astro:before-swap`.
- **No WebGL or reduced motion:** the panel stays on its poster; `/adventures` shows the
  flat d3-geo map instead of the globe, with its own copy ("Pick a country or a place in the
  list…"). The map is a build-time SVG (`/images/adventures-map-base.svg`) fetched and inlined
  only when it is shown; its markers are a picture, not controls — the country list is the
  control and the map mirrors the selection. three.js is never downloaded in either case.
- **Posters** (`src/assets/hero/panel-{day,night}.png`, `src/assets/globe/globe-{day,night}.png`)
  are rendered from the same scene code at the real stage size and 2× density:

  ```bash
  npm run build && npm run preview -- --host 127.0.0.1 --port 4321   # in another terminal
  npm run posters                                                   # BASE_URL=… to override
  npm run build
  ```

  `ThemePicture` serves the matching day / night poster as AVIF / WebP and downloads only
  the one on screen.

## Content

- **Personal details, hero lede, availability:** `src/config.ts`. `availability.status`
  (`open` / `limited` / `closed`) drives the header annunciator, the panel and the crew card.
  The production URL is `site` in `astro.config.mjs` (`https://ivansapronov.com`).
- **Projects:** `src/content/projects/*.md` (copy `_template.md`; filename = URL). Products
  set `tagline` + `summary` and appear under "What I'm building"; statuses include `pilot`
  and `validating`. `featured: true` projects are instrument modules on `/projects`.
  Entries still marked `placeholder: true` that have a `github` URL are listed under "Code on
  GitHub" as compact rows (title, description, stack, repository links — no case-study page).
- **Removed pages:** Apexline was taken off the site (2026-10-23). `/projects/apexline` and the
  older `/projects/apex-line-market-research` forward to `/projects` (Astro `redirects` in
  `astro.config.mjs` + a 301 in `public/_redirects` for Cloudflare Pages).
- **Homepage case studies:** `homeCases` in `src/data/home.ts` (slugs must exist).
- **Experience:** `src/content/experience/*.md`. `logged` is the logbook's LOGGED cell — a
  shortened form of a real achievement, never a new claim. Milestones (education,
  certifications, talks…) go in `src/content/milestones/*.yaml`.
- **CV download:** drop the PDF at `public/cv/ivan-sapronov-cv.pdf`; `/experience` then
  shows "Download CV" instead of "CV on request".
- **Writing:** `src/content/writing/*.md|mdx`, tags → `/writing/tags/<tag>`, RSS at `/rss.xml`.
  While no post is published (all are drafts / placeholders), the site hides writing
  automatically: CONTACT takes WRITING's slot in the header, Writing leaves the mobile
  sheet and footer, the RSS links disappear, the homepage shows only the Off-duty module,
  and `/writing` is `noindex` and out of the sitemap. Publish one post and it all comes back.
- **Hobbies / Now / About:** `src/content/hobbies/*.md`, `src/content/now/now.md`,
  `src/pages/about.astro` + `src/data/about.ts`.
- **Adventures:** `src/data/adventures.ts` (+ ISO numeric ids in `src/data/country-ids.ts`).
  Visited places get an arc from Prague; wishlist countries a dashed outline.
- **Portraits:** `src/assets/portraits/` — `studio-*` (grey studio background, day panel)
  and `cutout-*` (background removed, night panel); alt text in `src/lib/portraits.ts`.

## Placeholders

Any value containing `[…]` and any entry with `placeholder: true` **never renders in
production**:

- Entries with `placeholder: true` are dropped from every list and get no page
  (`src/lib/content.ts`).
- Field values containing `[…]` are hidden one by one (`shown()` / `shownAll()`).
- Markdown paragraphs / list items still containing `[…]`, and headings left empty by
  that, are removed from the body at build time (`src/lib/markdown-hide-placeholders.mjs`,
  a Sätteri plugin).

`npm run dev` keeps everything visible (dev-only `[PLACEHOLDER]` badges) so gaps are easy
to find: `grep -rn "placeholder: true\|\[[A-Z]" src/content src/data`.

## Still to fill

Hidden in production until real content replaces the placeholder (nothing here may be
invented):

| Where                                        | Hidden                                                                                                                                                                                                                                                                                                             |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `content/writing/*` (all 3 posts)            | Whole posts — they are template samples (`placeholder: true`): "Building this site with Astro", "What ultralight flying taught me about checklists", "Notes on integrating Keycloak with Spring Security". Rewrite or approve, then set `placeholder: false`. Until then `/writing` shows "No entries logged yet". |
| `content/projects/correct-context-wallet.md` | Case-study page (organization, year, most body sections are placeholders). Listed under "Code on GitHub" with its real description, stack and repository link.                                                                                                                                                     |
| `content/projects/faradey-android.md`        | Case-study page (organization, year, approach / results sections). Listed under "Code on GitHub".                                                                                                                                                                                                                  |
| `content/projects/land-routing-service.md`   | Case-study page (year, problem / approach sections). Listed under "Code on GitHub".                                                                                                                                                                                                                                |
| `content/projects/paymont-wallet.md`         | Case-study page (year, most body sections). Listed under "Code on GitHub" with both repositories.                                                                                                                                                                                                                  |
| `content/projects/ownira.md`                 | `timeframe` (start year not confirmed). `website` not set — ownira.cz currently shows a parking page; add `website: https://ownira.cz` when it is live.                                                                                                                                                            |
| `content/hobbies/*` (all 4)                  | Photos, stats (hours, licence, home field, bike, longest trip, riding since, countries / continents, next country, discipline, sessions), favourites, the flying-club link, and the "[Write about …]" paragraphs. Titles, taglines and the written paragraphs do show.                                             |
| `content/now/now.md`                         | Current Ownira milestone line, "Learning" (2), "Reading" (2 books)                                                                                                                                                                                                                                                 |
| `data/about.ts` → `facts`                    | All 6 facts (flying hours / licence, bike, country count + next, sport, first program, surprising fact) — the Facts section is hidden                                                                                                                                                                              |
| `src/pages/about.astro`                      | The personal part of the career story (where you grew up, first computer, first flight / ride) — the old placeholder paragraph was removed; add real text there                                                                                                                                                    |
| `data/adventures.ts`                         | Trip notes for 14 visited places, and the Cyprus town (`[Which town?]` — Cyprus shows by country only)                                                                                                                                                                                                             |
| `content/milestones/`                        | No milestones yet (template only) — the section is hidden                                                                                                                                                                                                                                                          |
| CV                                           | `public/cv/ivan-sapronov-cv.pdf` missing → "CV on request" links to `/contact?topic=hiring`                                                                                                                                                                                                                        |
| Contact form                                 | `PUBLIC_FORM_ACTION` (Formspree endpoint) not set → honest "not connected yet" state                                                                                                                                                                                                                               |

## Contact form

`src/components/contact/ContactForm.astro` (on `/contact`): name, email, topic
(Hiring / Investing / Partnering / Something else — preselected from `?topic=`), message and
a `_gotcha` honeypot. States: field errors (`aria-invalid` + message), submitting (busy,
disabled), success (only after the endpoint answers OK), failure (says it failed, gives the
email, keeps the text).

- **Not connected (now):** the form says "Form not connected yet — email me at …", email
  stays the primary action, and "Write it as an email" opens the same message (subject from
  the topic) in the visitor's email app. Nothing is sent from the page.
- **Connect Formspree:** create a form at formspree.io and build with
  `PUBLIC_FORM_ACTION=https://formspree.io/f/<id>` (e.g. a Cloudflare Pages environment
  variable). The privacy note on `/contact` then names Formspree as the processor.
- The site sets no cookies and runs no analytics, so there is no consent banner; the theme
  choice lives in `localStorage` only.

## SEO

`src/components/seo/SEO.astro`: per-page title / description / canonical (none on `noindex`
pages such as the 404 and the empty `/writing`), Open Graph + Twitter cards (plus
`profile:first_name` / `profile:last_name` on the home page), `sitemap-index.xml`,
`robots.txt`, `rss.xml` (linked only once a post exists).

Structured data (`src/lib/schema.ts`): `Person` (`#person`: jobTitle, sameAs, url, and a
stable `image` at `/images/ivan-sapronov.jpg` — an 800px copy of the turtleneck portrait in
`public/images/`) and `WebSite` on the home page, `ProfilePage` on `/about` with that Person
as `mainEntity`, `BlogPosting`, `CreativeWork`, `BreadcrumbList`.

The 1200×630 share image (`/images/og-default.png`) is generated at build time
(`src/lib/brand-images.ts`): the name in Saira and labels / readouts in JetBrains Mono, both
converted to vector paths with opentype.js from `@fontsource/*` files (so the card is the
same on any build machine), three labelled readouts and the cut-out portrait. The favicon
and touch icon are an attitude-indicator mark.

## Accessibility and performance

- WCAG 2.2 AA: token contrast pairs from the design system, visible focus rings (ink on the
  day panel, cyan on faces and the night panel), 44px targets in the header and forms,
  skip link, labelled fields, status always in words (never colour alone), the globe's
  list as its keyboard equivalent, reduced motion respected everywhere. axe-core
  (WCAG 2.2 AA + best practice) is clean on every route, day and night, 1440 and 375.
- Lighthouse (local preview, Lighthouse 12, mobile preset): `/` Performance 98, LCP 2.3 s,
  TBT 0 ms, CLS 0; `/adventures` 98, LCP 2.4 s, CLS 0; `/about` and `/projects` 99;
  Accessibility, Best practices and SEO 100. Desktop preset: `/` and `/adventures` 100.
- `/adventures` keeps its LCP low by not shipping the flat map until needed, setting place
  names in mono (the small JetBrains latin-ext file instead of Saira's) and rendering the
  country list with `content-visibility: auto`.
- three.js (~130 KB gzip) loads only on `/` and `/adventures`, lazily (see above).

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

`public/_headers` (Cloudflare Pages) sets, for every path: `X-Content-Type-Options:
nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` and
`Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`, plus
long-lived caching for `/_astro/*`. `public/_redirects` holds permanent redirects.

**No Content-Security-Policy yet.** Astro's `security.csp` was tried (2026-10-23): the theme
bootstrap, the 3D panel and the globe work on a direct page load, but the per-page hash
policy breaks client-side navigation — after a `ClientRouter` transition the next page's
inline styles are refused (17 violations on /about → /projects, page unstyled), the router
injects a `data:` module script, and Shiki's inline styles are not covered. Options for later:
drop `ClientRouter` (full page loads) and keep `security.csp`, or switch to external
stylesheets and scripts with a `'self'` policy set in `_headers`. The markup no longer uses
inline `style` attributes, so either path is open.

## Tech stack

- Astro 7 — static output, content collections, Sätteri Markdown + a placeholder plugin,
  view transitions (`ClientRouter`), Fonts API, `<Picture>` (AVIF / WebP via `sharp`)
- Tailwind CSS 4 (`@tailwindcss/vite`), tokens from the design system
- three.js 0.184.0 (lazy), world-atlas + topojson-client (globe), d3-geo (build-time SVG map)
- TypeScript (strict), ESLint, Prettier, Playwright smoke tests; opentype.js (build-time OG text)
- Fonts: Saira and JetBrains Mono (variable, latin + latin-ext, self-hosted, SIL OFL)
