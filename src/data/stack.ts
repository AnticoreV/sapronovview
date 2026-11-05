/**
 * Tech stack, grouped by category, in English and Czech. Shown on the homepage ("Tech
 * stack") and on /about. Source: "Skills & Technologies" in the CV (Kotlin and Fullstack
 * variants, June 2026); the AI & automation tools (Claude Code, Codex, AI CLIs, agents,
 * automation) were added at Ivan's request on 2026-11-05.
 *
 * `core` is the everyday stack: named in the CV summary or used in production in more
 * than one position. `also` is what I've worked with. No percentages, no ratings.
 */
import type { Locale } from "@/i18n/locales";
import { czTypo } from "@/i18n/typo";

/** A technology name, or a word that needs translating ({ en, cs }). */
export type StackItem = string | Record<Locale, string>;

export type StackGroup = {
  id: string;
  label: Record<Locale, string>;
  core: readonly StackItem[];
  also: readonly StackItem[];
};

export const stackItem = (item: StackItem, locale: Locale) =>
  typeof item === "string" ? item : item[locale];

export const stack: readonly StackGroup[] = [
  {
    id: "languages",
    label: { en: "Languages", cs: "Jazyky" },
    core: ["Kotlin", "Java", "TypeScript", "SQL"],
    also: ["JavaScript"],
  },
  {
    id: "backend",
    label: { en: "Backend", cs: "Backend" },
    core: ["Spring Boot", "Spring Security", "JPA / Hibernate", "Kotlin Coroutines"],
    also: ["Spring WebFlux", "Maven", "Gradle"],
  },
  {
    id: "apis",
    label: { en: "APIs & auth", cs: czTypo("API a autentizace") },
    core: ["REST", "GraphQL", "OpenAPI", "OAuth2 / OIDC", "Keycloak"],
    also: ["SSO & CIAM"],
  },
  {
    id: "frontend",
    label: { en: "Frontend", cs: "Frontend" },
    core: ["Angular", "React", "RxJS"],
    also: ["NgRx"],
  },
  {
    id: "data",
    label: { en: "Databases", cs: "Databáze" },
    core: ["PostgreSQL", "Redis"],
    also: ["ElasticSearch", "Flyway"],
  },
  {
    id: "messaging",
    label: { en: "Messaging", cs: "Messaging" },
    core: ["Kafka", "AWS SQS"],
    also: [],
  },
  {
    id: "cloud",
    label: { en: "Cloud & DevOps", cs: czTypo("Cloud a DevOps") },
    core: ["GCP", "AWS", "Docker", "Kubernetes", "GitLab CI"],
    also: ["Argo CD", "Terraform", "Helm", "GitHub Actions"],
  },
  {
    id: "observability",
    label: { en: "Observability", cs: "Monitoring" },
    core: ["Grafana", "Prometheus"],
    also: ["InfluxDB", "CloudWatch"],
  },
  {
    id: "testing",
    label: { en: "Testing", cs: "Testování" },
    core: ["JUnit", "Mockito", "Testcontainers"],
    also: ["SpringMockK"],
  },
  {
    id: "ai",
    label: { en: "AI & automation", cs: czTypo("AI a automatizace") },
    core: [
      "Claude Code",
      "Codex",
      "AI CLIs",
      { en: "AI agents", cs: "AI agenti" },
      "Agentic workflows",
      "MCP",
      "LLMs",
      { en: "Automation", cs: "Automatizace" },
    ],
    also: [],
  },
];
