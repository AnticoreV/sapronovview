/**
 * Homepage copy that is easier to edit as data than as markup.
 * Approved with the D4 · Pre-flight design (2026-10-22).
 */

/** "Systems online" — capabilities shown as switched-on aircraft systems. */
export const capabilities = [
  {
    code: "SYS 1 · BUILD",
    title: "Backend & fullstack products",
    text: "Java, Kotlin, Spring, Angular, React, OpenAPI, PostgreSQL, Kafka, Redis.",
    spotlight: false,
  },
  {
    // Ivan, 2026-10-22: technical direction only — no team-size or people-management claims.
    code: "SYS 2 · TECHNICAL DIRECTION",
    title: "Architecture & technical direction",
    text: "Service boundaries, API contracts, code review, engagements led end to end.",
    spotlight: false,
  },
  {
    code: "SYS 3 · AUTOMATE",
    title: "AI agents & automation",
    text: "LLM and MCP tooling at NCR Voyix; my own multi-agent pipeline from research to a deployed site.",
    spotlight: true,
  },
  {
    code: "SYS 4 · SHIP & RUN",
    title: "Deploy and operate services",
    text: "Kubernetes, Argo CD, Terraform, Helm, GCP, AWS, CI/CD, Grafana, Prometheus.",
    spotlight: false,
  },
] as const;

/** Pre-flight checklist = the homepage table of contents. */
export const checklist = [
  { label: "Products I build", href: "#build" },
  { label: "Systems I run", href: "#capabilities" },
  { label: "Proof in production", href: "#work" },
  { label: "Track record", href: "#experience" },
] as const;

/** Case studies on the homepage, in order (slugs in src/content/projects/). */
export const homeCases = [
  {
    slug: "self-service-menu-platform",
    title: "Self-service menu platform",
    summary: "US restaurant clients update their own menus; one BFF API for every client app.",
    meta: ["NCR Voyix · 2025–26", "Java · Spring · Angular · GCP"],
  },
  {
    slug: "dynamic-form-engine",
    title: "Dynamic form engine",
    summary: "New form types in hours instead of days.",
    meta: ["CCA Group · 2024", "Angular · Kotlin · Coroutines"],
  },
  {
    slug: "creativedock-greenfield-services",
    title: "Three services in three months",
    summary: "Ticketing, booking and subscription from zero; CI queues from hours to minutes.",
    meta: ["CreativeDock · 2026", "Kotlin · K8s · Argo CD · AWS"],
  },
] as const;
