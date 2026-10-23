# sapronovview — ivansapronov.com

The personal site of **Ivan Sapronov**, backend & fullstack engineer and founder in Prague:
what he builds (Ownira, client systems), what he can do, his track record, writing and — as
an addition — the hobbies.

Built with [Astro 7](https://astro.build) (static), TypeScript, Tailwind CSS v4 and content
collections. Design: **v2 · R2-C Runtime** with the hero **V6 · Blueprint** — a calm, light
Swiss grid around one live isometric drawing of how software gets made (idea → validate →
architecture → frontend · backend · services → tests → review → CI/CD → deploy → observe →
agent loop). _Every number on this page is real._

## Contents

- [Design source](#design-source)
- [Quick start](#quick-start)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Design system in code](#design-system-in-code)
- [Proof numbers](#proof-numbers)
- [3D: hero blueprint and globe](#3d-hero-blueprint-and-globe)
- [Content](#content)
- [Placeholders](#placeholders)
- [Still to fill](#still-to-fill)
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
  config.ts                 ← name, title, hero copy, email, availability, socials, nav, stack
  content.config.ts         ← collection schemas (zod)
  content/                  ← projects, writing, experience, milestones, hobbies, now
  data/
    readouts.ts             ← the proof numbers (homepage, case studies, chips, OG card)
    home.ts                 ← capabilities, contents list, homepage case rows, "worked with" line
    contact.ts              ← contact routes (hiring / investing / partnering) + topics
    about.ts                ← philosophy, values, "what I enjoy", facts
    adventures.ts           ← visited / wishlist places + home base (globe and map)
  scripts/
    hero3d.ts               ← hero "V6 · Blueprint" (three.js + fat lines, lazy)
    globe3d.ts              ← adventures paper globe (three.js, lazy)
  components/
    layout/                 ← SiteHeader, Footer, ContactPanel (accent "Ready to ship your project.")
    home/                   ← Hero, HeroStage, Proof, WhoIAm, Products, Capabilities, CapabilityCard,
                              Cases, TrackRecord, OffDuty
    profile/                ← ProfileCard (portrait switch on /about), ContentsList
    projects/               ← ProductModule, ProjectRow, CodeRow, ProjectFilters
    experience/             ← RecordRow, ExperienceItem, MilestoneList
    contact/                ← ContactRoute, ContactForm
    adventures/             ← GlobeStage, AdventureMap (SVG fallback), AdventureDetails, MapLegend
    ui/                     ← StatusPill, StatusBadge, ThemeToggle, ProofNumber, SectionHeader,
                              ThemePicture, LogoMark, CopyEmail, …
  layouts/                  ← BaseLayout, ProjectLayout + ArticleLayout (Sheets)
  assets/                   ← portraits, hero + globe posters (optimised by <Picture>)
  lib/                      ← content queries, CV check, placeholder helpers, schema, OG image
  styles/global.css         ← design tokens + Tailwind theme + component classes
scripts/                    ← render-posters.mjs, serve-dist.mjs (tests)
tests/e2e/                  ← Playwright smoke tests
```

Component names follow `components.md`: SiteHeader (was HeaderStrip), StatusPill
(Annunciator), ProfileCard (CrewCard), ContentsList (Checklist), ProductModule
(InstrumentModule), CapabilityCard (SystemToggle), ProofNumber (Readout), RecordRow
(LogbookRow), Sheet (Kneeboard: `.sheet` + `.prose-sheet`), ContactPanel (the v1 night
contact block). The v1 instrument panel (`panel3d.ts`, `PanelStage.astro`), callsign / base
config, annunciator, checklist ticking and every aviation label are gone.

## Design system in code

- **Tokens** live in `src/styles/global.css`, ported 1:1 from `tokens.css` / `tokens.json`:
  `:root` = light, `.dark` = dark, `@theme inline` maps them to utilities (`bg-surface`,
  `text-ink-muted`, `border-line`, `bg-accent`, `text-on-accent`, `shadow-pop`, …) and the
  type scale (`text-display-xl`, `text-display-l`, `text-display-m`, `text-numeral`,
  `text-heading`, `text-title`, `text-body-l`, …).
- **Colour means something:** `accent` (deploy blue) = what you can act on (primary buttons,
  links, focus, the contact panel); `ok-ink` / `ok-soft` = healthy, open, in pilot;
  `caution` = a butter status fill; `error-ink` = errors only. `clay-*` colours live only in
  the 3D, the capability icons and the hero legend.
- **Theme:** light by default; the header toggle (sun / moon, `aria-pressed`) stores the
  choice in `localStorage` (try/catch); without a stored choice the OS preference wins. The
  inline script in `BaseLayout` applies it before paint (no flash).
- **Fonts:** Schibsted Grotesk (variable, wght 400–900) and IBM Plex Mono (400 / 500 / 600),
  self-hosted from `@fontsource-variable/schibsted-grotesk` and `@fontsource/ibm-plex-mono`
  through Astro's `fonts` config. Each is split into a **latin** family (preloaded — for the
  mono only the 500 labels) and a **latin-ext** family (Czech diacritics, loaded on demand,
  carries the metric-matched fallback); `--font-sans` / `--font-mono` chain them.
- **Surfaces:** `.card` (surface + 1px line, radius 12), `.lift` (hover: −2px + shadow-pop),
  `.sheet` + `.prose-sheet` (long reading, 68ch), `.section-head` (1px ink rule, mono index,
  display-l title, tag), `.btn-primary` / `.btn-secondary` / `.btn-ink`, `.icon-btn`,
  `.link-more` ("ALL PROJECTS →"), `.chip`, `.status-pill`, `.label`, `.meta`.
- **Motion:** CSS + small vanilla scripts. Sections marked `data-reveal` rise 12px and fade
  in once (600ms, IntersectionObserver), proof numbers count up once, cards lift on hover.
  Reveals only run when the head script sets `html.motion` (JS on, no reduced motion), so
  without JS or under `prefers-reduced-motion` everything is simply there.
- **Scoped styles and utilities:** Astro's scoped `<style>` is unlayered and beats Tailwind's
  layered utilities, so components never set `display` in scoped CSS for elements that take
  a `class` from outside (e.g. `StatusPill` gets `inline-flex` as a utility so
  `max-[520px]:hidden` works). Don't put `@layer` in component styles: the layer order would
  then be decided by whichever stylesheet comes first.

## Proof numbers

`src/data/readouts.ts` is the single source for every number: the four ProofNumbers under
the hero, the ProofNumbers on case studies, the metric chips on the homepage case rows
(`chip`) and the OG card. Each readout has a `value`, a `label`, a `source` (the employer /
client from the track record) and a `detail` sentence. Rules:

- Only numbers that are in `src/content/experience/` — never a new one.
- `count` (optional) makes the number count up (`prefix` + 0→`to` + `suffix`).
- `project` links the number to a case study (`/projects/<slug>`).

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
  drawing), holds it 1.6 s, then loops.
- **Globe** (`src/scripts/globe3d.ts`, port of `3d/d2.html`) — paper globe re-skinned to v2:
  clay-white plate, visited countries in ink, home (Czechia) in accent blue, wishlist
  countries with a dashed accent outline, accent arcs from Prague. Drag to rotate with
  inertia; hover shows the country name; clicking a country with places opens its card; the
  country list is the keyboard / screen-reader equivalent.
- **Loading rules** (`HeroStage.astro`, `GlobeStage.astro`): the poster is the LCP image and
  the fallback. `three@0.184.0` is imported dynamically, only on `/` and `/adventures`, only
  when the stage is visible — on idle on desktop with a mouse, on the first scroll / touch /
  key on phones. WebGL is probed only at that moment. DPR ≤ 2 (≤ 1.5 on phones); the hero
  pauses offscreen and in hidden tabs, the globe renders on demand; both dispose on
  `astro:before-swap`.
- **No WebGL or reduced motion:** the hero stays on its poster; `/adventures` shows the flat
  d3-geo map instead of the globe. three.js is never downloaded in either case.
- **Posters** (`src/assets/hero/blueprint-{light,dark}.png`,
  `src/assets/globe/globe-{light,dark}.png`) are rendered from the same scene code at the
  real stage size (1440 viewport) and 2× density:

  ```bash
  npm run build && npm run preview -- --host 127.0.0.1 --port 4321   # in another terminal
  npm run posters                                                   # BASE_URL=… to override
  npm run build
  ```

  `ThemePicture` serves the matching light / dark poster as AVIF / WebP and downloads only
  the one on screen.

## Content

- **Personal details, hero eyebrow and lede, availability:** `src/config.ts`.
  `availability.status` (`open` / `limited` / `closed`) drives the header StatusPill and the
  profile card. The production URL is `site` in `astro.config.mjs` (`https://ivansapronov.com`).
- **Projects:** `src/content/projects/*.md` (copy `_template.md`; filename = URL). Products set
  `tagline` + `summary` (+ optional `facts`, e.g. FOR · MY ROLE) and appear under "What I'm
  building"; statuses include `pilot` and `validating`. `featured: true` client work appears as
  ProductModules on `/projects`. Entries still marked `placeholder: true` that have a `github`
  URL are listed under "Code on GitHub" as compact rows (no case-study page).
- **Removed pages:** Apexline was taken off the site (2026-10-23). `/projects/apexline` and the
  older `/projects/apex-line-market-research` forward to `/projects` (Astro `redirects` in
  `astro.config.mjs` + a 301 in `public/_redirects` for Cloudflare Pages).
- **Homepage case rows:** `homeCases` in `src/data/home.ts` (slugs must exist; chips are
  readout ids).
- **Experience:** `src/content/experience/*.md`. `shipped` is the track record's SHIPPED cell — a
  shortened form of a real achievement, never a new claim. Milestones (education,
  certifications, talks…) go in `src/content/milestones/*.yaml`.
- **CV download:** drop the PDF at `public/cv/ivan-sapronov-cv.pdf`; the homepage and
  `/experience` then show "Download CV" instead of "CV on request" (`src/lib/cv.ts`).
- **Writing:** `src/content/writing/*.md|mdx`, tags → `/writing/tags/<tag>`, RSS at `/rss.xml`.
  While no post is published (all are drafts / placeholders), the site hides writing
  automatically: Writing stays out of the menu sheet and the footer, the RSS links
  disappear, the homepage shows only the Off-duty strip, and `/writing` is `noindex` and out
  of the sitemap. Publish one post and it all comes back (the homepage then shows the posts
  as rows above Off duty).
- **Hobbies / Now / About:** `src/content/hobbies/*.md`, `src/content/now/now.md`,
  `src/pages/about.astro` + `src/data/about.ts`. Aviation appears only as hobby content
  (`/hobbies`, `/adventures`, the off-duty line and the personal paragraph on `/about`).
- **Adventures:** `src/data/adventures.ts` (+ ISO numeric ids in `src/data/country-ids.ts`).
- **Portraits:** `src/assets/portraits/` — `studio-*` (grey studio background, light theme)
  and `cutout-*` (background removed, dark theme, on a sunken well); alt text in
  `src/lib/portraits.ts`. The homepage card uses the green sweater, `/about` starts on the
  turtleneck.

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

| Where                                        | Hidden                                                                                                                                                                                                                                                                                                              |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content/writing/*` (all 3 posts)            | Whole posts — they are template samples (`placeholder: true`): "Building this site with Astro", "What ultralight flying taught me about checklists", "Notes on integrating Keycloak with Spring Security". Rewrite or approve, then set `placeholder: false`. Until then `/writing` shows "No posts published yet". |
| `content/projects/correct-context-wallet.md` | Case-study page (organization, year, most body sections are placeholders). Listed under "Code on GitHub" with its real description, stack and repository link.                                                                                                                                                      |
| `content/projects/faradey-android.md`        | Case-study page (organization, year, approach / results sections). Listed under "Code on GitHub".                                                                                                                                                                                                                   |
| `content/projects/land-routing-service.md`   | Case-study page (year, problem / approach sections). Listed under "Code on GitHub".                                                                                                                                                                                                                                 |
| `content/projects/paymont-wallet.md`         | Case-study page (year, most body sections). Listed under "Code on GitHub" with both repositories.                                                                                                                                                                                                                   |
| `content/projects/ownira.md`                 | `timeframe` (start year not confirmed). `website` not set — ownira.cz currently shows a parking page; add `website: https://ownira.cz` when it is live (WEB stays text until then).                                                                                                                                 |
| `content/hobbies/*` (all 4)                  | Photos, stats (hours, licence, home field, bike, longest trip, riding since, countries / continents, next country, discipline, sessions), favourites, the flying-club link, and the "[Write about …]" paragraphs. Titles, taglines and the written paragraphs do show.                                              |
| `content/now/now.md`                         | Current Ownira milestone line, "Learning" (2), "Reading" (2 books)                                                                                                                                                                                                                                                  |
| `data/about.ts` → `facts`                    | All 6 facts (flying hours / licence, bike, country count + next, sport, first program, surprising fact) — the Facts section is hidden                                                                                                                                                                               |
| `data/about.ts` → philosophy 03              | Copy to approve: "Checklists over heroics" lost its flying sentence in v2 (no aviation metaphors) and now reads "Good people make bad mistakes when routine is skipped. Runbooks, reviews and tests are how I keep the routine."                                                                                    |
| `src/pages/about.astro`                      | The personal part of the career story (where you grew up, first computer, first flight / ride) — add real text there                                                                                                                                                                                                |
| `data/adventures.ts`                         | Trip notes for 14 visited places, and the Cyprus town (`[Which town?]` — Cyprus shows by country only)                                                                                                                                                                                                              |
| `content/milestones/`                        | No milestones yet (template only) — the section is hidden                                                                                                                                                                                                                                                           |
| CV                                           | `public/cv/ivan-sapronov-cv.pdf` missing → "CV on request" links to `/contact?topic=hiring`                                                                                                                                                                                                                         |
| Contact form                                 | `PUBLIC_FORM_ACTION` (Formspree endpoint) not set → honest "not connected yet" state                                                                                                                                                                                                                                |

## Contact form

`src/components/contact/ContactForm.astro` (on `/contact`): name, email, topic
(Hiring / Investing / Partnering / Something else — preselected from `?topic=`), message and
a `_gotcha` honeypot. States: field errors (`aria-invalid` + message), submitting (busy,
disabled), success (`role="status"`, only after the endpoint answers OK), failure
(`role="alert"`, says it failed, gives the email, keeps the text).

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
stable `image` at `/images/ivan-sapronov.jpg`) and `WebSite` on the home page,
`ProfilePage` on `/about` with that Person as `mainEntity`, `BlogPosting`, `CreativeWork`,
`BreadcrumbList`.

The 1200×630 share image (`/images/og-default.png`) is generated at build time
(`src/lib/brand-images.ts`) in the v2 look: cube mark + "OPEN TO PROJECTS" pill, the
eyebrow, the name in Schibsted Grotesk 800, the lede, three proof numbers with their mono
captions and the cut-out portrait. Text is converted to vector paths with opentype.js from
`@fontsource/schibsted-grotesk` and `@fontsource/ibm-plex-mono` (so the card is the same on
any build machine). The favicon and touch icon are the isometric cube mark.

## Accessibility and performance

- WCAG 2.2 AA: token contrast pairs from the design system, visible focus rings (2px
  `focus`, 2px offset; `on-accent` on the contact panel), 44px targets in the header,
  breadcrumbs, footer, forms and chips, skip link, labelled fields, status always in words
  (never colour alone), the globe's list as its keyboard equivalent, reduced motion respected
  everywhere. axe-core 4.10 (WCAG 2.2 AA + best practice): **0 violations** on every route,
  light and dark, 1440 and 375 (also with motion on, and with the menu sheet open).
- Lighthouse 12.8 (local preview, mobile preset, 2026-10-23): `/` Performance 99, LCP 2.1 s
  (the poster image), TBT 0 ms, CLS 0; `/adventures` 99, LCP 2.1 s (the globe poster), TBT
  0 ms, CLS 0; Accessibility, Best practices and SEO 100 on both.
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

`public/_headers` (Cloudflare Pages) sets, for every path: `X-Content-Type-Options:
nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` and
`Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`, plus
long-lived caching for `/_astro/*`. `public/_redirects` holds permanent redirects.

**No Content-Security-Policy yet.** Astro's `security.csp` was tried (2026-10-23): the theme
bootstrap and the 3D scenes work on a direct page load, but the per-page hash policy breaks
client-side navigation — after a `ClientRouter` transition the next page's inline styles are
refused, the router injects a `data:` module script, and Shiki's inline styles are not
covered. Options for later: drop `ClientRouter` (full page loads) and keep `security.csp`, or
switch to external stylesheets and scripts with a `'self'` policy set in `_headers`. The
markup does not use inline `style` attributes, so either path is open.

## Tech stack

- Astro 7 — static output, content collections, Sätteri Markdown + a placeholder plugin,
  view transitions (`ClientRouter`), Fonts API, `<Picture>` (AVIF / WebP via `sharp`)
- Tailwind CSS 4 (`@tailwindcss/vite`), tokens from the design system
- three.js 0.184.0 (lazy; `Line2` fat lines for the hero), world-atlas + topojson-client
  (globe), d3-geo (build-time SVG map)
- TypeScript (strict), ESLint, Prettier, Playwright smoke tests; opentype.js (build-time OG text)
- Fonts: Schibsted Grotesk and IBM Plex Mono (latin + latin-ext, self-hosted, SIL OFL)
