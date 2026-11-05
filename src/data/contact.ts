/**
 * Contact routes — recruiters, AI automation and contract clients, in English and Czech. Used by the
 * accent contact panel on every page, the menu sheet and the topic select on /contact
 * (preselected from `?topic=`; the topic ids are the same in both languages).
 */
import type { Locale } from "@/i18n/locales";
import { typoDeep } from "@/i18n/typo";

export type TopicId = "hiring" | "automation" | "partnering" | "other";

export type ContactRoute = {
  id: Exclude<TopicId, "other">;
  label: string;
  title: string;
  text: string;
  /** Email subject line (mailto links and the form). */
  subject: string;
};

const routes: Record<Locale, ContactRoute[]> = {
  en: [
    {
      id: "hiring",
      label: "Hiring",
      title: "Senior backend, fullstack or tech lead role",
      text: "CV and availability on request.",
      subject: "Hiring",
    },
    {
      id: "automation",
      label: "AI automation",
      title: "AI in your team's processes",
      text: "Agents and automation wired into the tools you use, plus the guidelines that make them stick.",
      subject: "AI automation",
    },
    {
      id: "partnering",
      label: "Contract work",
      title: "Backend or fullstack contract",
      text: "Services, APIs, architecture and deployment, remote or in Prague.",
      subject: "Contract",
    },
  ],
  cs: [
    {
      id: "hiring",
      label: "Nábor",
      title: "Pozice senior backend, fullstack nebo tech lead",
      text: "Životopis a dostupnost na vyžádání.",
      subject: "Nábor",
    },
    {
      id: "automation",
      label: "AI automatizace",
      title: "AI v procesech vašeho týmu",
      text: "Agenti a automatizace napojení na nástroje, které používáte, a pravidla, díky kterým se ujmou.",
      subject: "AI automatizace",
    },
    {
      id: "partnering",
      label: "Zakázka",
      title: "Zakázka na backend nebo fullstack",
      text: "Služby, API, architektura i nasazení, na dálku nebo v Praze.",
      subject: "Zakázka",
    },
  ],
};

// Czech typography for display; the mailto subjects have no one-letter words to protect.
routes.cs = typoDeep(routes.cs);
export const contactRoutes = (locale: Locale): ContactRoute[] => routes[locale];

const otherLabel: Record<Locale, string> = { en: "Something else", cs: "Něco jiného" };

/** Options for the topic select, in order. */
export const contactTopics = (locale: Locale): ReadonlyArray<{ id: TopicId; label: string }> => [
  ...routes[locale].map((r) => ({ id: r.id, label: r.label })),
  { id: "other", label: otherLabel[locale] },
];

export function mailtoFor(email: string, subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString().replace(/\+/g, "%20");
  return `mailto:${email}${query ? `?${query}` : ""}`;
}
