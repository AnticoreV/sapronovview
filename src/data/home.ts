/**
 * Homepage copy that is easier to edit as data than as markup.
 * Approved with design v2 (R2-C Runtime, 2026-10-23); texts unchanged from v1.
 */
import type { ReadoutId } from "@data/readouts";

/** "What I can do" — four capability cards (icons live in CapabilityCard.astro). */
export const capabilities = [
  {
    id: "build",
    code: "01 · BUILD",
    title: "Backend & fullstack products",
    text: "Java, Kotlin, Spring, Angular, React, OpenAPI, PostgreSQL, Kafka, Redis.",
    spotlight: false,
  },
  {
    // Ivan, 2026-10-22: technical direction only — no team-size or people-management claims.
    id: "direct",
    code: "02 · TECHNICAL DIRECTION",
    title: "Architecture & technical direction",
    text: "Service boundaries, API contracts, code review, engagements led end to end.",
    spotlight: false,
  },
  {
    id: "automate",
    code: "03 · AUTOMATE",
    title: "AI agents & automation",
    text: "LLM and MCP tooling at NCR Voyix; my own multi-agent pipeline from research to a deployed site.",
    spotlight: true,
  },
  {
    id: "ship",
    code: "04 · SHIP & RUN",
    title: "Deploy and operate services",
    text: "Kubernetes, Argo CD, Terraform, Helm, GCP, AWS, CI/CD, Grafana, Prometheus.",
    spotlight: false,
  },
] as const;

export type CapabilityId = (typeof capabilities)[number]["id"];

/** "Before you hire, invest or partner" — the homepage contents list. */
export const contents = [
  { label: "Products I build", href: "#build" },
  { label: "What I can do", href: "#capabilities" },
  { label: "Proof in production", href: "#work" },
  { label: "Track record", href: "#experience" },
  { label: "Get in touch", href: "#contact" },
] as const;

/** Case studies on the homepage, in order (slugs in src/content/projects/). */
export const homeCases: ReadonlyArray<{
  slug: string;
  title: string;
  summary: string;
  meta: readonly [string, string];
  chips: readonly ReadoutId[];
}> = [
  {
    slug: "self-service-menu-platform",
    title: "Self-service menu platform",
    summary: "US restaurant clients update their own menus; one BFF API for every client app.",
    meta: ["NCR Voyix · 2025–26", "Java · Spring · Angular · GCP"],
    chips: ["users", "downstream"],
  },
  {
    slug: "dynamic-form-engine",
    title: "Dynamic form engine",
    summary: "New form types in hours instead of days.",
    meta: ["CCA Group · 2024", "Angular · Kotlin · Coroutines"],
    chips: ["formTypes", "p95"],
  },
  {
    slug: "creativedock-greenfield-services",
    title: "Three services in three months",
    summary: "Ticketing, booking and subscription from zero; CI queues from hours to minutes.",
    meta: ["CreativeDock · 2026", "Kotlin · K8s · Argo CD · AWS"],
    chips: ["services", "ciQueue"],
  },
];

/** Proof row byline: every employer / client in the track record (approved artboard). */
export const workedWith = "WORKED WITH NCR VOYIX · CREATIVEDOCK · CCA GROUP · ABLENEO · VODA HORY";
