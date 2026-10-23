/**
 * Central site configuration.
 *
 * Every page, component and SEO tag reads from this file, so updating your
 * personal details here updates them everywhere.
 *
 * Values wrapped in square brackets, e.g. "[YOUR LOCATION]", are placeholders:
 * they never render in production (see README "Still to fill").
 */

export type Availability = "open" | "limited" | "closed";

export const siteConfig = {
  /** Full name, used in the header, hero, footer and structured data. */
  name: "Ivan Sapronov",
  /** Short professional title, used in <title>, Open Graph and JSON-LD. */
  title: "Backend & Fullstack Engineer · Founder",
  /** Meta description (from the approved hero lede). */
  description:
    "Backend & fullstack engineer and founder in Prague. I build backend systems and products, set up AI agents and automation, and ship services to production.",
  /** Hero copy, approved with design v2 (R2-C Runtime + V6 Blueprint hero, 2026-10-23). */
  hero: {
    eyebrow: "BACKEND & FULLSTACK ENGINEER · FOUNDER · PRAGUE",
    lede: "I build backend systems and products, set up AI agents and automation, and ship services to production. Every number on this page is real.",
  },
  /** Where you are based. */
  location: "Prague, Czech Republic",
  city: "Prague",
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
  { long: string; tone: "ok" | "caution" | "off" }
> = {
  open: { long: "OPEN TO PROJECTS", tone: "ok" },
  limited: { long: "LIMITED AVAILABILITY", tone: "caution" },
  closed: { long: "NOT AVAILABLE", tone: "off" },
};

export type NavItem = { label: string; href: string; match?: string };

/**
 * Header navigation (approved artboard): Products · Capabilities · Cases · Experience ·
 * About. `match` marks the active page. Writing is not in the header; it joins the
 * mobile sheet once a post is published (see SiteHeader.astro).
 */
export const primaryNav: NavItem[] = [
  { label: "Products", href: "/#build" },
  { label: "Capabilities", href: "/#capabilities" },
  { label: "Cases", href: "/projects", match: "/projects" },
  { label: "Experience", href: "/experience", match: "/experience" },
  { label: "About", href: "/about", match: "/about" },
];

/** Footer links (approved artboard): Projects · About · Experience · Hobbies · RSS · Sitemap. */
export const footerNav: NavItem[] = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Hobbies", href: "/hobbies" },
  { label: "RSS", href: "/rss.xml" },
  { label: "Sitemap", href: "/sitemap-index.xml" },
];

/** Every page — used by the mobile menu sheet. */
export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Writing", href: "/writing" },
  { label: "Hobbies", href: "/hobbies" },
  { label: "Adventures", href: "/adventures" },
  { label: "Now", href: "/now" },
  { label: "Contact", href: "/contact" },
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
    group: "Languages & backend",
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
    group: "Frontend",
    items: ["Angular", "RxJS", "NgRx", "React", "Astro", "Tailwind CSS"],
  },
  {
    group: "Cloud & infrastructure",
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
    group: "Data, auth & observability",
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
