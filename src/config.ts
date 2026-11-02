/**
 * Central site configuration.
 *
 * Every page, component and SEO tag reads from this file, so updating your
 * personal details here updates them everywhere.
 *
 * Values wrapped in square brackets, e.g. "[YOUR LOCATION]", are placeholders:
 * they never render in production (see README "Still to fill").
 */

import type { Locale } from "@/i18n/locales";
import type { UiKey } from "@/i18n/ui";
import { typoDeep } from "@/i18n/typo";

export type Availability = "open" | "limited" | "closed";

export const siteConfig = {
  /** Full name, used in the header, hero, footer and structured data. */
  name: "Ivan Sapronov",
  /** Short professional title, used in <title>, Open Graph and JSON-LD. */
  title: "Backend & Fullstack Engineer · Founder",
  /** Meta description (from the approved hero lede). */
  description:
    "Backend & fullstack engineer and founder in Prague. I build backend systems and products, design their architecture, set up AI agents and automation, and ship services to production.",
  /** Hero copy, approved with design v2 (R2-C Runtime + V6 Blueprint hero, 2026-10-23). */
  hero: {
    eyebrow: "Backend & fullstack engineer, founder, Prague",
    lede: "I build backend systems and products, design their architecture, set up AI agents and automation, and ship services to production.",
  },
  /** Where you are based. */
  location: "Prague, Czech Republic",
  city: "Prague",
  /**
   * Business operator (§435 OZ: name, IČO and registered seat on the website), verified in
   * ARES on 2026-11-02: sole trader (legal form 101) in the Trade Register, not a VAT payer
   * (so no DIČ is shown). Rendered in the footer of every page.
   */
  operator: {
    ico: "23157852",
    street: "Argentinská 1624/32",
    postalCode: "170 00",
    city: "Praha 7",
    cityEn: "Prague 7",
  },
  /** "Based in" line on the profile card (approved artboard wording). */
  basedIn: "Prague, Czechia",
  /** Public contact email (the professional address from the CV). */
  email: "sapronovivanprace@gmail.com",
  /** Availability: drives the status pill in the header and the profile card. */
  availability: {
    status: "open" as Availability,
    label: "Open to projects",
  },
  /** What you are working on right now (one line). */
  currentFocus: "Building Ownira (in pilot)",
  /** Experience on the JVM, as stated in the CV (~5 years). */
  experienceSummary: "~5 yrs on the JVM",
  /** Language for <html lang> and Open Graph locale. */
  locale: "en",
  ogLocale: "en_US",
  /** Default Open Graph image (1200×630), generated at build time — see src/lib/brand-images.ts. */
  ogImage: "/images/og-default.png",
  /** The same card in Czech (Czech pages). */
  ogImageCs: "/images/og-default-cs.png",
  /** Stable portrait URL for structured data (public/images/ivan-sapronov.jpg, 800px). */
  personImage: "/images/ivan-sapronov.jpg",
  /** Public profile links. Leave a value empty ("") to hide it. */
  social: {
    github: "https://github.com/AnticoreV",
    linkedin: "https://www.linkedin.com/in/ivan-sapronov-25b41a231/",
    twitter: "",
    instagram: "",
    telegram: "",
    youtube: "",
  },
  /** Handle used in <meta name="twitter:creator"> if you have an X/Twitter account. */
  twitterHandle: "",
  /** Spoken languages, shown on the About page and the profile card. */
  languages: [
    { name: "English", code: "EN", level: "Professional" },
    { name: "Czech", code: "CS", level: "Professional" },
    { name: "Russian", code: "RU", level: "Native" },
  ],
  /**
   * Contact form endpoint (Formspree: "https://formspree.io/f/<id>").
   * Set PUBLIC_FORM_ACTION at build time. While it is empty the form says so
   * and email stays the primary channel.
   */
  formAction: (import.meta.env.PUBLIC_FORM_ACTION as string | undefined) ?? "",
} as const;

export type SocialKey = keyof typeof siteConfig.social;

/** Status-pill wording and tone for each availability state. */
export const availabilityText: Record<
  Availability,
  { key: UiKey; tone: "ok" | "caution" | "off" }
> = {
  open: { key: "status.open", tone: "ok" },
  limited: { key: "status.limited", tone: "caution" },
  closed: { key: "status.closed", tone: "off" },
};

/**
 * Copy that differs per language (src/i18n/ui.ts holds the interface strings).
 * `siteConfig` above keeps the English values for structured data and the RSS feed.
 */
export const siteCopy: Record<
  Locale,
  {
    title: string;
    description: string;
    eyebrow: string;
    lede: string;
    currentFocus: string;
    experienceSummary: string;
    basedIn: string;
    languages: Array<{ code: string; name: string; level: string }>;
  }
> = {
  en: {
    title: "Backend & Fullstack Engineer · Founder",
    description:
      "Backend & fullstack engineer and founder in Prague. I build backend systems and products, design their architecture, set up AI agents and automation, and ship services to production.",
    eyebrow: "Backend & fullstack engineer, founder, Prague",
    lede: "I build backend systems and products, design their architecture, set up AI agents and automation, and ship services to production.",
    currentFocus: "building Ownira (in pilot)",
    experienceSummary: "~5 yrs on the JVM",
    basedIn: "Prague, Czechia",
    languages: [
      { code: "EN", name: "English", level: "Professional" },
      { code: "CS", name: "Czech", level: "Professional" },
      { code: "RU", name: "Russian", level: "Native" },
    ],
  },
  cs: {
    title: "Backend & Fullstack Engineer · zakladatel",
    description:
      "Backend & fullstack engineer a zakladatel v Praze. Stavím backendové systémy a produkty, navrhuji jejich architekturu, nastavuji AI agenty a automatizace a nasazuji služby do produkce.",
    eyebrow: "Backend & fullstack engineer, zakladatel, Praha",
    lede: "Stavím backendové systémy a produkty, navrhuji jejich architekturu, nastavuji AI agenty a automatizace a nasazuji služby do produkce.",
    currentFocus: "stavím produkt Ownira (v pilotním provozu)",
    experienceSummary: "~5 let na JVM",
    basedIn: "Praha, Česko",
    languages: [
      { code: "EN", name: "Angličtina", level: "Profesionální" },
      { code: "CS", name: "Čeština", level: "Profesionální" },
      { code: "RU", name: "Ruština", level: "Rodilý mluvčí" },
    ],
  },
};
siteCopy.cs = typoDeep(siteCopy.cs);

export type NavItem = { key: UiKey; href: string; match?: string };

/**
 * Header navigation (approved artboard): Products · Capabilities · Cases · Experience ·
 * About. `match` marks the active page. Writing is not in the header; it joins the
 * mobile sheet once a post is published (see SiteHeader.astro).
 */
export const primaryNav: NavItem[] = [
  { key: "nav.products", href: "/#build" },
  { key: "nav.capabilities", href: "/#capabilities" },
  { key: "nav.cases", href: "/projects", match: "/projects" },
  { key: "nav.experience", href: "/experience", match: "/experience" },
  { key: "nav.about", href: "/about", match: "/about" },
];

/** Footer links (approved artboard): Projects · About · Experience · Hobbies · RSS · Sitemap. */
export const footerNav: NavItem[] = [
  { key: "nav.projects", href: "/projects" },
  { key: "nav.about", href: "/about" },
  { key: "nav.experience", href: "/experience" },
  { key: "nav.hobbies", href: "/hobbies" },
  { key: "nav.rss", href: "/rss.xml" },
  { key: "nav.sitemap", href: "/sitemap-index.xml" },
];

/** Every page — used by the mobile menu sheet. */
export const navigation: NavItem[] = [
  { key: "nav.home", href: "/" },
  { key: "nav.about", href: "/about" },
  { key: "nav.projects", href: "/projects" },
  { key: "nav.experience", href: "/experience" },
  { key: "nav.writing", href: "/writing" },
  { key: "nav.hobbies", href: "/hobbies" },
  { key: "nav.adventures", href: "/adventures" },
  { key: "nav.now", href: "/now" },
  { key: "nav.contact", href: "/contact" },
];

/** Navigation with Writing (and the RSS feed) removed while there is nothing to read. */
export const withWriting = (items: NavItem[], hasPosts: boolean) =>
  hasPosts ? items : items.filter((i) => !i.href.startsWith("/writing") && i.href !== "/rss.xml");

/**
 * Technologies you use most often, grouped so the list reads as a system
 * rather than a keyword dump. Shown on the About page.
 */
export const techStack = [
  {
    group: { en: "Languages & backend", cs: "Jazyky a backend" },
    items: [
      "Java",
      "Kotlin",
      "TypeScript",
      "Spring Boot",
      "Spring WebFlux",
      "Spring Security",
      "JPA / Hibernate",
      "Kotlin Coroutines",
      "REST & GraphQL",
      "OpenAPI",
    ],
  },
  {
    group: { en: "Frontend", cs: "Frontend" },
    items: ["Angular", "RxJS", "NgRx", "React", "Astro", "Tailwind CSS"],
  },
  {
    group: { en: "Cloud & infrastructure", cs: "Cloud a infrastruktura" },
    items: [
      "GCP",
      "AWS (S3, SQS, CloudWatch)",
      "Docker",
      "Kubernetes",
      "Argo CD",
      "Terraform",
      "Helm",
      "GitHub Actions",
      "GitLab CI",
    ],
  },
  {
    group: { en: "Data, auth & observability", cs: "Data, autentizace a observabilita" },
    items: [
      "PostgreSQL",
      "Redis",
      "Kafka",
      "ElasticSearch",
      "Flyway",
      "Keycloak",
      "OAuth2 / OIDC",
      "Testcontainers",
      "Grafana & Prometheus",
      "LLMs & MCP",
    ],
  },
] as const;
