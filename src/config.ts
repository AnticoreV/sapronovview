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
  title: "Backend & Fullstack Software Engineer",
  /** Meta description (the CV summary, shortened). */
  description:
    "Backend & fullstack software engineer in Prague: Kotlin and Java services on Spring Boot, microservices on GCP, AWS and Kubernetes, and the Angular or React apps on top. Open to contracts.",
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
  currentFocus: "Open to backend, fullstack and AI automation contracts",
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
  /** Optional homepage sections. "My own product" is hidden by default. */
  homeSections: {
    ownProduct: false,
  },
  /** Public profile links. Leave a value empty ("") to hide it. */
  social: {
    github: "https://github.com/AnticoreV",
    linkedin: "https://www.linkedin.com/in/sapronov-ivan",
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
    /** Role line under the name in the hero (and the share card's top line). */
    role: string;
    lede: string;
    currentFocus: string;
    experienceSummary: string;
    basedIn: string;
    languages: Array<{ code: string; name: string; level: string }>;
  }
> = {
  en: {
    title: "Backend & Fullstack Software Engineer",
    description:
      "Backend & fullstack software engineer in Prague: Kotlin and Java services on Spring Boot, microservices on GCP, AWS and Kubernetes, and the Angular or React apps on top. Open to contracts.",
    role: "Backend & fullstack software engineer",
    lede: "I build backend services in Kotlin and Java on Spring Boot, design how they fit together, and run them on GCP, AWS and Kubernetes. Recent work includes a platform serving about two million users.",
    currentFocus: "open to backend, fullstack and AI automation contracts",
    experienceSummary: "~5 yrs on the JVM",
    basedIn: "Prague, Czechia",
    languages: [
      { code: "EN", name: "English", level: "Professional" },
      { code: "CS", name: "Czech", level: "Professional" },
      { code: "RU", name: "Russian", level: "Native" },
    ],
  },
  cs: {
    title: "Backend & Fullstack Software Engineer",
    description:
      "Backend & fullstack software engineer v Praze: služby v Kotlinu a Javě na Spring Bootu, mikroslužby na GCP, AWS a Kubernetes a aplikace v Angularu nebo Reactu nad nimi. Beru zakázky.",
    role: "Backend & fullstack software engineer",
    lede: "Stavím backendové služby v Kotlinu a Javě na Spring Bootu, navrhuji, jak do sebe zapadají, a provozuji je na GCP, AWS a Kubernetes. Mezi poslední práce patří platforma pro zhruba dva miliony uživatelů.",
    currentFocus: "beru zakázky na backend, fullstack i AI automatizaci",
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
 * Header navigation: Expertise · Experience · Projects · About, each a homepage section
 * (the Contact button sits beside them). `match` marks the active page on the matching
 * subpage. Writing is not in the header; it joins the mobile sheet once a post is
 * published (see SiteHeader.astro).
 */
export const primaryNav: NavItem[] = [
  { key: "nav.expertise", href: "/#expertise" },
  { key: "nav.experience", href: "/#experience", match: "/experience" },
  { key: "nav.projects", href: "/#projects", match: "/projects" },
  { key: "nav.about", href: "/#about", match: "/about" },
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
