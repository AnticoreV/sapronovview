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
  title: "Fullstack / Backend Software Engineer",
  /** One-sentence description used for <meta name="description"> and the hero. */
  description:
    "Fullstack / backend engineer with ~5 years shipping Java, Kotlin, Spring and Angular systems — microservices, SSO/CIAM and cloud-native deployments on GCP, AWS and Kubernetes. Pilot in training, motorcyclist, collector of countries.",
  /** Where you are based. */
  location: "Prague, Czech Republic",
  /** Public contact email (the professional address from your CV). */
  email: "sapronovivanprace@gmail.com",
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
  /** Spoken languages, shown on the About page. */
  languages: [
    { name: "English", level: "Professional" },
    { name: "Czech", level: "Professional" },
    { name: "Russian", level: "Native" },
  ],
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
  { label: "Adventures", href: "/adventures" },
  { label: "Now", href: "/now" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Technologies you use most often. Shown on the homepage.
 * Grouped so the list reads as a system rather than a keyword dump.
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
