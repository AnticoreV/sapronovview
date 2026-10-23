/**
 * Contact routes — the three audiences the site is for. Used by the night-panel
 * contact block on every page, the footer and the topic select on /contact
 * (preselected from `?topic=`).
 */

export type TopicId = "hiring" | "investing" | "partnering" | "other";

export const contactRoutes = [
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
    text: "Stage, progress and plans — let's talk.",
    subject: "Investing",
  },
  {
    id: "partnering",
    label: "Partnering",
    title: "Build, automate or ship together",
    text: "Contracts, AI automation, platform work.",
    subject: "Partnership",
  },
] as const satisfies ReadonlyArray<{
  id: TopicId;
  label: string;
  title: string;
  text: string;
  subject: string;
}>;

/** Options for the topic select, in order. */
export const contactTopics: ReadonlyArray<{ id: TopicId; label: string }> = [
  ...contactRoutes.map((r) => ({ id: r.id, label: r.label })),
  { id: "other", label: "Something else" },
];

export function mailtoFor(email: string, subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString().replace(/\+/g, "%20");
  return `mailto:${email}${query ? `?${query}` : ""}`;
}
