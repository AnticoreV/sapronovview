/**
 * Central site configuration.
 *
 * Every page, component and SEO tag reads from this file, so updating your
 * personal details here updates them everywhere.
 *
 * Values wrapped in square brackets, e.g. "[YOUR LOCATION]", are placeholders
 * that still need to be replaced with real information.
 */

export const siteConfig = {
  /** Full name, used in the header, hero, footer and structured data. */
  name: "Ivan Sapronov",
  /** Short professional title shown next to the name. */
  title: "Fullstack Software Engineer",
  /** One-sentence description used for <meta name="description"> and the hero. */
  description:
    "Fullstack software engineer with 4+ years building backend and web systems — distributed services, identity, and the occasional Android app. Pilot in training, motorcyclist, and collector of countries.",
  /** Where you are based. Replace the placeholder. */
  location: "[YOUR LOCATION]",
  /** Public contact email. */
  email: "sapronovivancore@gmail.com",
  /** Current availability shown as a status pill in the hero. */
  availability: {
    /** "open" | "limited" | "closed" */
    status: "open" as "open" | "limited" | "closed",
    label: "Open to interesting projects",
  },
  /** What you are working on right now (one line, shown on the homepage). */
  currentFocus: "Building Ownira and researching the Apex line market opportunity",
  /** Language for <html lang> and Open Graph locale. */
  locale: "en",
  ogLocale: "en_US",
  /** Default Open Graph image (1200×630). Replace the placeholder file in /public/images. */
  ogImage: "/images/og-default.png",
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
} as const;

export type SocialKey = keyof typeof siteConfig.social;

/** Top-level navigation. Order here is the order in the header and footer. */
export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Writing", href: "/writing" },
  { label: "Hobbies", href: "/hobbies" },
  { label: "Now", href: "/now" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Technologies you use most often. Shown on the homepage.
 * Grouped so the list reads as a system rather than a keyword dump.
 */
export const techStack = [
  {
    group: "Backend",
    items: ["Java", "Kotlin", "Spring Boot", "Spring Security", "Hibernate / JPA", "Node.js"],
  },
  {
    group: "Web",
    items: ["TypeScript", "Angular", "Astro", "HTML & CSS", "Tailwind CSS"],
  },
  {
    group: "Data & messaging",
    items: ["PostgreSQL", "Redis", "Kafka", "RabbitMQ"],
  },
  {
    group: "Identity & infra",
    items: ["Keycloak", "OAuth 2.0 / OIDC", "Docker", "CI/CD", "SonarQube"],
  },
] as const;
