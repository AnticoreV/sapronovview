/**
 * Homepage copy that is easier to edit as data than as markup, in English and Czech.
 * English approved with design v2 (R2-C Runtime, 2026-10-23); texts unchanged from v1.
 * Czech added 2026-11-02 (awaiting Ivan's review — see README "Languages").
 */
import type { Locale } from "@/i18n/locales";
import type { ReadoutId } from "@data/readouts";
import { typoDeep } from "@/i18n/typo";

export type CapabilityId = "build" | "direct" | "automate" | "ship";

type Capability = {
  id: CapabilityId;
  code: string;
  title: string;
  text: string;
  spotlight: boolean;
};

/** "What I can do" — four capability cards (icons live in CapabilityCard.astro). */
const capabilityText: Record<Locale, Capability[]> = {
  en: [
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
  ],
  cs: typoDeep([
    {
      id: "build",
      code: "01 · STAVBA",
      title: "Backendové a fullstack produkty",
      text: "Java, Kotlin, Spring, Angular, React, OpenAPI, PostgreSQL, Kafka, Redis.",
      spotlight: false,
    },
    {
      id: "direct",
      code: "02 · TECHNICKÉ SMĚŘOVÁNÍ",
      title: "Architektura a technické směřování",
      text: "Hranice služeb, API kontrakty, code review, zakázky vedené od začátku do konce.",
      spotlight: false,
    },
    {
      id: "automate",
      code: "03 · AUTOMATIZACE",
      title: "AI agenti a automatizace",
      text: "Nástroje s LLM a MCP v NCR Voyix; vlastní multiagentní pipeline od průzkumu po nasazený web.",
      spotlight: true,
    },
    {
      id: "ship",
      code: "04 · NASAZENÍ A PROVOZ",
      title: "Nasazení a provoz služeb",
      text: "Kubernetes, Argo CD, Terraform, Helm, GCP, AWS, CI/CD, Grafana, Prometheus.",
      spotlight: false,
    },
  ]),
};
export const capabilities = (locale: Locale) => capabilityText[locale];

/** "Before you hire, invest or partner" — the homepage contents list. */
const contentsText: Record<Locale, Array<{ label: string; href: string }>> = {
  en: [
    { label: "Products I build", href: "#build" },
    { label: "What I can do", href: "#capabilities" },
    { label: "Proof in production", href: "#work" },
    { label: "Track record", href: "#experience" },
    { label: "Get in touch", href: "#contact" },
  ],
  cs: typoDeep([
    { label: "Produkty, které stavím", href: "#build" },
    { label: "Co umím", href: "#capabilities" },
    { label: "Důkazy z produkce", href: "#work" },
    { label: "Praxe", href: "#experience" },
    { label: "Ozvěte se", href: "#contact" },
  ]),
};
export const contents = (locale: Locale) => contentsText[locale];

type HomeCase = {
  slug: string;
  title: string;
  summary: string;
  meta: readonly [string, string];
  chips: readonly ReadoutId[];
};

/** Case studies on the homepage, in order (slugs in src/content/projects/). */
const caseText: Record<Locale, HomeCase[]> = {
  en: [
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
  ],
  cs: typoDeep([
    {
      slug: "self-service-menu-platform",
      title: "Samoobslužná platforma pro správu menu",
      summary:
        "Restaurace v USA si samy upravují menu; jedno BFF API pro všechny klientské aplikace.",
      meta: ["NCR Voyix · 2025–26", "Java · Spring · Angular · GCP"],
      chips: ["users", "downstream"],
    },
    {
      slug: "dynamic-form-engine",
      title: "Dynamický formulářový engine",
      summary: "Nové typy formulářů za hodiny místo dnů.",
      meta: ["CCA Group · 2024", "Angular · Kotlin · Coroutines"],
      chips: ["formTypes", "p95"],
    },
    {
      slug: "creativedock-greenfield-services",
      title: "Tři služby za tři měsíce",
      summary: "Ticketing, rezervace a předplatné od nuly; fronty CI z hodin na minuty.",
      meta: ["CreativeDock · 2026", "Kotlin · K8s · Argo CD · AWS"],
      chips: ["services", "ciQueue"],
    },
  ]),
};
export const homeCases = (locale: Locale) => caseText[locale];
