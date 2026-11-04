/**
 * Homepage copy that is easier to edit as data than as markup, in English and Czech.
 * Restructured 2026-11-04 (hero, what I do, tech stack, experience, selected projects,
 * own product, about, contact). Every claim comes from the CV (June 2026) or the case
 * studies in src/content/projects/; numbers live in src/data/readouts.ts.
 */
import type { Locale } from "@/i18n/locales";
import type { ReadoutId } from "@data/readouts";
import { typo, typoDeep } from "@/i18n/typo";

/** The compact facts under the hero buttons. */
type HeroFact = { label: string; value: string };

const heroFactText: Record<Locale, HeroFact[]> = {
  en: [
    { label: "Experience", value: "~5 years" },
    { label: "Specialisation", value: "Backend & microservices" },
    { label: "Location", value: "Prague, Czech Republic" },
    { label: "Collaboration", value: "Contract or freelance, remote" },
  ],
  cs: typoDeep([
    { label: "Praxe", value: "~5 let" },
    { label: "Specializace", value: "Backend a mikroslužby" },
    { label: "Lokalita", value: "Praha, Česko" },
    { label: "Spolupráce", value: "Na IČO, i na dálku" },
  ]),
};
export const heroFacts = (locale: Locale) => heroFactText[locale];

export type ExpertiseId = "backend" | "architecture" | "cloud" | "fullstack";

type Expertise = {
  id: ExpertiseId;
  title: string;
  text: string;
  /** Technologies (or, for architecture, patterns) shown under the text. */
  stack: string[];
  /** The primary specialisation: one card on accent-soft. */
  spotlight: boolean;
};

/** "What I do": four expertise cards (icons live in CapabilityCard.astro). */
const expertiseText: Record<Locale, Expertise[]> = {
  en: [
    {
      id: "backend",
      title: "Backend development",
      text: "Services and APIs on the JVM that hold up under load and stay easy to change.",
      stack: ["Kotlin", "Java", "Spring Boot", "REST", "GraphQL", "PostgreSQL", "Redis"],
      spotlight: true,
    },
    {
      // Ivan, 2026-10-22: technical direction only — no team-size or people-management claims.
      id: "architecture",
      title: "Software architecture",
      text: "Service boundaries, API contracts and the decisions behind them, for new services and large existing systems.",
      stack: ["Microservices", "Event-driven (Kafka, SQS)", "Backend-for-frontend", "OpenAPI"],
      spotlight: false,
    },
    {
      id: "cloud",
      title: "Cloud & infrastructure",
      text: "Getting services into production and keeping them observable: pipelines, clusters, metrics and alerts.",
      stack: ["GCP", "AWS", "Docker", "Kubernetes", "Argo CD", "Terraform", "GitLab CI"],
      spotlight: false,
    },
    {
      id: "fullstack",
      title: "Full-stack development",
      text: "The web app on top of the services: typed component libraries, dynamic forms and self-service tools.",
      stack: ["Angular", "React", "TypeScript", "RxJS", "NgRx"],
      spotlight: false,
    },
  ],
  cs: typoDeep([
    {
      id: "backend",
      title: "Vývoj backendu",
      text: "Služby a API na JVM, které vydrží zátěž a dají se snadno měnit.",
      stack: ["Kotlin", "Java", "Spring Boot", "REST", "GraphQL", "PostgreSQL", "Redis"],
      spotlight: true,
    },
    {
      id: "architecture",
      title: "Softwarová architektura",
      text: "Hranice služeb, API kontrakty a rozhodnutí za nimi, pro nové služby i velké stávající systémy.",
      stack: ["Mikroslužby", "Event-driven (Kafka, SQS)", "Backend-for-frontend", "OpenAPI"],
      spotlight: false,
    },
    {
      id: "cloud",
      title: "Cloud a infrastruktura",
      text: "Dostat služby do produkce a mít je pod dohledem: pipeline, clustery, metriky a alerty.",
      stack: ["GCP", "AWS", "Docker", "Kubernetes", "Argo CD", "Terraform", "GitLab CI"],
      spotlight: false,
    },
    {
      id: "fullstack",
      title: "Fullstack vývoj",
      text: "Webová aplikace nad službami: typované knihovny komponent, dynamické formuláře a samoobslužné nástroje.",
      stack: ["Angular", "React", "TypeScript", "RxJS", "NgRx"],
      spotlight: false,
    },
  ]),
};
export const expertise = (locale: Locale) => expertiseText[locale];

type HomeCase = {
  slug: string;
  title: string;
  /** Company · years, as in the experience timeline. */
  meta: string;
  /** What kind of work it was (mono line under the title). */
  disciplines: string[];
  overview: string;
  /** "My contribution": three bullets, each a shortened CV achievement. */
  contribution: string[];
  stack: string[];
  chips: readonly ReadoutId[];
};

/** Selected projects on the homepage, newest first (slugs in src/content/projects/). */
const caseText: Record<Locale, HomeCase[]> = {
  en: [
    {
      slug: "creativedock-greenfield-services",
      title: "Three services in three months",
      meta: "CreativeDock · 2026",
      disciplines: ["Backend", "Microservices", "AWS"],
      overview:
        "Ticketing, booking and subscription services in Kotlin, built from scratch in a three-month freelance engagement.",
      contribution: [
        "Built the three Spring Boot services with GraphQL APIs and led the architecture decisions",
        "Fixed stalled GitLab CI builds and scaled the runners",
        "Ran the workloads on Kubernetes through Argo CD, with S3, SQS and CloudWatch on AWS",
      ],
      stack: ["Kotlin", "Spring Boot", "GraphQL", "Kubernetes", "AWS"],
      chips: ["services", "ciQueue"],
    },
    {
      slug: "self-service-menu-platform",
      title: "Self-service menu platform",
      meta: "NCR Voyix · 2025–26",
      disciplines: ["Backend", "Fullstack", "GCP"],
      overview:
        "An Angular platform that lets US restaurant clients update their own menus, on Java/Spring services in a system serving about two million users.",
      contribution: [
        "Designed the backend-for-frontend and an aggregator over up to 8 downstream services",
        "Built the Angular self-service platform that replaced manual menu updates",
        "Ran the services on GCP with metrics, logging and alerting",
      ],
      stack: ["Java", "Spring", "Angular", "GCP"],
      chips: ["users", "downstream"],
    },
    {
      slug: "dynamic-form-engine",
      title: "Dynamic form engine",
      meta: "CCA Group · 2024",
      disciplines: ["Fullstack", "Performance"],
      overview:
        "Operators compose forms from templates instead of waiting for a development task; the engine renders, validates and submits them.",
      contribution: [
        "Built the Angular engine with conditional validation and real-time updates",
        "Moved latency-sensitive services from Java to Kotlin coroutines",
        "Owned the versioned REST contract between Angular and Spring, documented with OpenAPI",
      ],
      stack: ["Angular", "TypeScript", "Kotlin", "Spring", "OpenAPI"],
      chips: ["formTypes", "p95"],
    },
  ],
  cs: typoDeep([
    {
      slug: "creativedock-greenfield-services",
      title: "Tři služby za tři měsíce",
      meta: "CreativeDock · 2026",
      disciplines: ["Backend", "Mikroslužby", "AWS"],
      overview:
        "Služby pro ticketing, rezervace a předplatné v Kotlinu, postavené od nuly během tříměsíční zakázky na volné noze.",
      contribution: [
        "Postavil jsem tři služby ve Spring Bootu s GraphQL API a vedl architektonická rozhodnutí",
        "Opravil jsem zaseknuté buildy v GitLab CI a navýšil kapacitu runnerů",
        "Provozoval jsem workloady na Kubernetes přes Argo CD, s S3, SQS a CloudWatch na AWS",
      ],
      stack: ["Kotlin", "Spring Boot", "GraphQL", "Kubernetes", "AWS"],
      chips: ["services", "ciQueue"],
    },
    {
      slug: "self-service-menu-platform",
      title: "Samoobslužná platforma pro správu menu",
      meta: "NCR Voyix · 2025–26",
      disciplines: ["Backend", "Fullstack", "GCP"],
      overview:
        "Platforma v Angularu, ve které si restaurace v USA samy upravují menu, nad službami v Javě a Springu v systému pro zhruba dva miliony uživatelů.",
      contribution: [
        "Navrhl jsem backend-for-frontend a agregátor nad až osmi navazujícími službami",
        "Postavil jsem samoobslužnou platformu v Angularu, která nahradila ruční úpravy menu",
        "Provozoval jsem služby na GCP s metrikami, logováním a alerty",
      ],
      stack: ["Java", "Spring", "Angular", "GCP"],
      chips: ["users", "downstream"],
    },
    {
      slug: "dynamic-form-engine",
      title: "Dynamický formulářový engine",
      meta: "CCA Group · 2024",
      disciplines: ["Fullstack", "Výkon"],
      overview:
        "Operátoři skládají formuláře ze šablon a nečekají na vývojáře; engine je vykreslí, zvaliduje a odešle.",
      contribution: [
        "Postavil jsem engine v Angularu s podmíněnou validací a aktualizacemi v reálném čase",
        "Převedl jsem služby citlivé na latenci z Javy na korutiny v Kotlinu",
        "Odpovídal jsem za verzovaný REST kontrakt mezi Angularem a Springem, zdokumentovaný v OpenAPI",
      ],
      stack: ["Angular", "TypeScript", "Kotlin", "Spring", "OpenAPI"],
      chips: ["formTypes", "p95"],
    },
  ]),
};
export const homeCases = (locale: Locale) => caseText[locale];

/** "My own product": the line under the heading (Ownira as a side venture, not the main job). */
const ventureIntroText: Record<Locale, string> = {
  en: "A side venture alongside client work, now in pilot. I run the product, the architecture, the code and the talks with early customers.",
  cs: "Vedlejší projekt vedle klientské práce, teď v pilotním provozu. Mám na starosti produkt, architekturu, kód i rozhovory s prvními zákazníky.",
};
export const ventureIntro = (locale: Locale) => typo(locale, ventureIntroText[locale]);

/** "About me" on the homepage: two short paragraphs (the long story is on /about). */
const aboutText: Record<Locale, string[]> = {
  en: [
    "I'm a backend and fullstack engineer in Prague. For about five years I've built enterprise web applications and the services behind them, mostly Kotlin and Java on Spring, with Angular or React on the front.",
    "I like owning a service end to end: the API contract, the code and tests, the pipeline, and the dashboards that show it's healthy. Lately I also use LLM and MCP tooling for routine work such as test scaffolding.",
  ],
  cs: typoDeep([
    "Jsem backend a fullstack engineer v Praze. Zhruba pět let stavím podnikové webové aplikace a služby za nimi, hlavně v Kotlinu a Javě na Springu, s Angularem nebo Reactem na frontendu.",
    "Rád mám službu na starosti celou: API kontrakt, kód a testy, pipeline i dashboardy, které ukážou, že běží zdravě. Poslední dobou používám na rutinní práci i nástroje s LLM a MCP, třeba na přípravu testů.",
  ]),
};
export const homeAbout = (locale: Locale) => aboutText[locale];
