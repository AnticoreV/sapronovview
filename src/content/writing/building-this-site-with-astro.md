---
title: "Building this site with Astro"
description: "Why a backend engineer picked Astro for a personal site, and the handful of decisions that keep it fast, boring to maintain and free of client-side JavaScript."
pubDate: 2026-09-10
tags: ["astro", "web", "meta"]
featured: true
draft: false
placeholder: true
---

> **Sample article.** This post ships with the site as an example of the writing layout. Edit or delete it in `src/content/writing/`.

I spend most of my working hours on the backend — Spring services, message brokers, identity providers. For a personal site I wanted the opposite of that: something with no runtime, no database and nothing to patch at 2 a.m.

## Why Astro

Astro renders to static HTML by default and only ships JavaScript for the components that explicitly ask for it. On this site that is a theme toggle and a mobile menu — a few hundred bytes. Everything else, including the section-reveal animation, is CSS.

The other reason is **content collections**. Projects, positions, hobbies and articles are Markdown or YAML files validated against a schema at build time. Add a file, run the build, and the type checker tells you if you forgot a field.

```ts
const projects = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    status: z.enum(["active", "in-progress", "research", "completed", "paused", "archived"]),
    technologies: z.array(z.string()).default([]),
  }),
});
```

## Decisions worth writing down

- **Self-hosted fonts.** Two variable font files, latin subset, preloaded. Astro generates metric-matched fallbacks so text doesn't jump when they load.
- **Class-based dark mode.** A four-line inline script applies the stored theme before first paint. No flash, no hydration.
- **`<dialog>` for the mobile menu.** The browser handles focus trapping, `Escape` and making the rest of the page inert.
- **Scroll-driven animations.** `animation-timeline: view()` gives a reveal effect with zero JavaScript, and browsers that don't support it simply show the content.

## What I'd still change

The contact form posts to a placeholder endpoint until I wire up a provider. And the "placeholder" badges scattered across the site are a to-do list in disguise.
