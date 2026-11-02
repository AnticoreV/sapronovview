/**
 * Contact routes — the three audiences the site is for, in English and Czech. Used by the
 * accent contact panel on every page, the menu sheet and the topic select on /contact
 * (preselected from `?topic=`; the topic ids are the same in both languages).
 */
import type { Locale } from "@/i18n/locales";
import { typoDeep } from "@/i18n/typo";

export type TopicId = "hiring" | "investing" | "partnering" | "other";

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
      id: "investing",
      label: "Investing",
      title: "Ownira",
      text: "Write to me for the current stage and plans.",
      subject: "Investing",
    },
    {
      id: "partnering",
      label: "Partnering",
      title: "Build or automate something together",
      text: "I take contracts for backend services and AI automation.",
      subject: "Partnership",
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
      id: "investing",
      label: "Investice",
      title: "Ownira",
      text: "Aktuální fázi a plány vám pošlu e-mailem.",
      subject: "Investice",
    },
    {
      id: "partnering",
      label: "Spolupráce",
      title: "Postavit nebo zautomatizovat něco společně",
      text: "Beru zakázky na backendové služby a AI automatizaci.",
      subject: "Spolupráce",
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
