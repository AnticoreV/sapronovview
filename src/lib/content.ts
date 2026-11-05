/**
 * Typed queries over the content collections. Pages import from here so
 * sorting / filtering rules live in one place.
 *
 * Every getter takes a locale. Czech entries live in `src/content/<collection>/cs/` with the
 * same file name and only the translatable fields; they are merged over the English entry
 * (anything missing falls back to English). Render bodies with `renderEntry()`, which picks
 * the Czech Markdown body when there is one — `bodyLang()` tells which language it is in.
 */
import { getCollection, render, type CollectionEntry } from "astro:content";
import type { Locale } from "@/i18n/locales";
import { typoDeep } from "@/i18n/typo";

export type Project = CollectionEntry<"projects">;
export type Post = CollectionEntry<"writing">;
export type Position = CollectionEntry<"experience">;
export type Milestone = CollectionEntry<"milestones">;
export type Hobby = CollectionEntry<"hobbies">;

const isProd = import.meta.env.PROD;

/**
 * Placeholders never render in production: entries flagged `placeholder: true`
 * are dropped from every list, and any value containing `[…]` is hidden field by
 * field (see `shown()`). `npm run dev` keeps them visible so gaps can be filled.
 */
export const hidePlaceholders = isProd;

const PLACEHOLDER = /\[[^\]\n]+\]/;

/** True when a value still contains a `[placeholder]`. */
export function isPlaceholder(value: string | undefined | null): boolean {
  return typeof value === "string" && PLACEHOLDER.test(value);
}

/** The value, or undefined when it is a placeholder in a production build. */
export function shown<T extends string | undefined | null>(value: T): T | undefined {
  if (value == null || value === "") return undefined;
  return hidePlaceholders && isPlaceholder(value) ? undefined : value;
}

/** Only the real values of a list (placeholders dropped in production). */
export function shownAll<T>(items: readonly T[], text: (item: T) => string = String): T[] {
  return hidePlaceholders ? items.filter((i) => !isPlaceholder(text(i))) : [...items];
}

const visible = (data: { placeholder?: boolean; draft?: boolean; hidden?: boolean }) =>
  !data.hidden && !(isProd && (data.draft || (hidePlaceholders && data.placeholder)));

/* Czech versions ------------------------------------------------------------ */

type Translatable = "projects" | "experience" | "hobbies" | "now";
type CsOf = {
  projects: "projectsCs";
  experience: "experienceCs";
  hobbies: "hobbiesCs";
  now: "nowCs";
};
const csCollection: CsOf = {
  projects: "projectsCs",
  experience: "experienceCs",
  hobbies: "hobbiesCs",
  now: "nowCs",
};

/** Merged entry → the entry whose Markdown body should be rendered (the Czech one). */
const bodySource = new WeakMap<object, CollectionEntry<CsOf[Translatable]>>();

/** English entries with their Czech fields (and body) merged in for `locale === "cs"`. */
async function localized<C extends Translatable>(
  collection: C,
  entries: CollectionEntry<C>[],
  locale: Locale,
): Promise<CollectionEntry<C>[]> {
  if (locale === "en") return entries;
  const czech = new Map(
    (await getCollection(csCollection[collection])).map((e) => [e.id, e] as const),
  );
  return entries.map((entry) => {
    const cs = czech.get(entry.id);
    if (!cs) return entry;
    const data: Record<string, unknown> = { ...entry.data };
    for (const [key, value] of Object.entries(typoDeep(cs.data)))
      if (value !== undefined) data[key] = value;
    const merged = { ...entry, data } as CollectionEntry<C>;
    if (cs.body?.trim()) bodySource.set(merged, cs);
    return merged;
  });
}

/** Render an entry's body — the Czech body when the entry was localized and has one. */
export function renderEntry(entry: CollectionEntry<Translatable | "writing">) {
  const source = bodySource.get(entry);
  return source ? render(source) : render(entry);
}

/** Language the rendered body is written in ("en" when a Czech page falls back). */
export function bodyLang(entry: object, locale: Locale): Locale {
  return locale === "cs" && bodySource.has(entry) ? "cs" : "en";
}

/* Projects ---------------------------------------------------------------- */

export async function getProjects(locale: Locale = "en"): Promise<Project[]> {
  const all = await localized(
    "projects",
    await getCollection("projects", ({ data }) => visible(data)),
    locale,
  );
  return all.sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    if (a.data.order !== b.data.order) return a.data.order - b.data.order;
    return b.data.date.valueOf() - a.data.date.valueOf();
  });
}

/**
 * Projects still being written up (placeholder: true) that have a public GitHub
 * repository. /projects lists them as compact rows built only from their real
 * fields (title, description, stack, repository links) — never as case studies.
 */
export async function getCodeProjects(locale: Locale = "en"): Promise<Project[]> {
  const all = await localized(
    "projects",
    await getCollection(
      "projects",
      ({ data }) => data.placeholder && !data.draft && Boolean(data.github),
    ),
    locale,
  );
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getFeaturedProjects(locale: Locale = "en", limit = 4): Promise<Project[]> {
  const all = await getProjects(locale);
  return all.filter((p) => p.data.featured).slice(0, limit);
}

/* Writing ----------------------------------------------------------------- */

export async function getPosts(): Promise<Post[]> {
  const all = await getCollection("writing", ({ data }) => visible(data));
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** True once at least one post is published (drives nav, RSS link, sitemap, noindex). */
export async function hasWriting(): Promise<boolean> {
  return (await getPosts()).length > 0;
}

export async function getAllTags(posts?: Post[]): Promise<Array<{ tag: string; count: number }>> {
  const list = posts ?? (await getPosts());
  const counts = new Map<string, number>();
  for (const post of list)
    for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Posts sharing the most tags with `post`, excluding itself. */
export function getRelatedPosts(post: Post, all: Post[], limit = 3): Post[] {
  const tags = new Set(post.data.tags);
  return all
    .filter((p) => p.id !== post.id)
    .map((p) => ({ post: p, score: p.data.tags.filter((t) => tags.has(t)).length }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) => b.score - a.score || b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf(),
    )
    .slice(0, limit)
    .map(({ post }) => post);
}

/** Previous (older) and next (newer) posts relative to `post` in a date-sorted list. */
export function getAdjacentPosts(post: Post, all: Post[]): { prev?: Post; next?: Post } {
  const index = all.findIndex((p) => p.id === post.id);
  return {
    next: index > 0 ? all[index - 1] : undefined,
    prev: index >= 0 && index < all.length - 1 ? all[index + 1] : undefined,
  };
}

/* Experience -------------------------------------------------------------- */

export async function getPositions(locale: Locale = "en"): Promise<Position[]> {
  const all = await localized(
    "experience",
    await getCollection("experience", ({ data }) => visible(data)),
    locale,
  );
  return all.sort((a, b) => {
    const aEnd = a.data.endDate?.valueOf() ?? Infinity;
    const bEnd = b.data.endDate?.valueOf() ?? Infinity;
    if (aEnd !== bEnd) return bEnd - aEnd;
    return b.data.startDate.valueOf() - a.data.startDate.valueOf();
  });
}

export async function getMilestones(): Promise<Milestone[]> {
  const all = await getCollection("milestones", ({ data }) => visible(data));
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/* Hobbies ----------------------------------------------------------------- */

export async function getHobbies(locale: Locale = "en"): Promise<Hobby[]> {
  const all = await localized("hobbies", await getCollection("hobbies"), locale);
  return all.sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );
}

/* Now --------------------------------------------------------------------- */

export type NowEntry = CollectionEntry<"now">;

export async function getNow(locale: Locale = "en"): Promise<NowEntry> {
  const [entry] = await localized("now", await getCollection("now"), locale);
  if (!entry) throw new Error("Add a file to src/content/now/ to populate the Now page.");
  return entry;
}

/* Labels ------------------------------------------------------------------ */

export const categoryLabels: Record<Locale, Record<Project["data"]["category"], string>> = {
  en: {
    professional: "Professional",
    "open-source": "Open source",
    personal: "Personal",
    experiment: "Experiment",
    hobby: "Hobby project",
  },
  cs: {
    professional: "Profesní",
    "open-source": "Open source",
    personal: "Osobní",
    experiment: "Experiment",
    hobby: "Projekt z koníčku",
  },
};

export type StatusTone = "ok" | "caution" | "off";

const statusTones: Record<Project["data"]["status"], StatusTone> = {
  active: "ok",
  pilot: "ok",
  "in-progress": "caution",
  validating: "caution",
  research: "caution",
  completed: "off",
  paused: "off",
  archived: "off",
};

const statusWords: Record<Locale, Record<Project["data"]["status"], string>> = {
  en: {
    active: "Live",
    pilot: "Pilot",
    "in-progress": "In progress",
    validating: "Validating",
    research: "Research",
    completed: "Completed",
    paused: "Paused",
    archived: "Archived",
  },
  cs: {
    active: "V provozu",
    pilot: "Pilot",
    "in-progress": "Rozpracováno",
    validating: "Validace",
    research: "Výzkum",
    completed: "Dokončeno",
    paused: "Pozastaveno",
    archived: "Archivováno",
  },
};

/** Project status as a pill: word + tone (ok = mint, caution = butter, off = neutral). */
export const statusLabel = (status: Project["data"]["status"], locale: Locale) => ({
  label: statusWords[locale][status],
  tone: statusTones[status],
});

export const employmentLabels: Record<
  Locale,
  Record<Position["data"]["employmentType"], string>
> = {
  en: {
    "full-time": "Full-time",
    "part-time": "Part-time",
    contract: "Contract",
    freelance: "Freelance",
    internship: "Internship",
    founder: "Founder",
  },
  cs: {
    "full-time": "Plný úvazek",
    "part-time": "Částečný úvazek",
    contract: "Kontrakt",
    freelance: "Na volné noze",
    internship: "Stáž",
    founder: "Zakladatel",
  },
};

export const milestoneLabels: Record<
  Locale,
  Record<Milestone["data"]["type"], { title: string; plural: string }>
> = {
  en: {
    education: { title: "Education", plural: "Education" },
    certification: { title: "Certification", plural: "Certifications" },
    speaking: { title: "Talk", plural: "Speaking" },
    award: { title: "Award", plural: "Awards" },
    community: { title: "Community", plural: "Community involvement" },
  },
  cs: {
    education: { title: "Vzdělání", plural: "Vzdělání" },
    certification: { title: "Certifikace", plural: "Certifikace" },
    speaking: { title: "Přednáška", plural: "Přednášky" },
    award: { title: "Ocenění", plural: "Ocenění" },
    community: { title: "Komunita", plural: "Zapojení v komunitě" },
  },
};

export const hobbyCategoryLabels: Record<Locale, Record<Hobby["data"]["category"], string>> = {
  en: {
    sport: "Sport",
    aviation: "Aviation",
    motorcycles: "Motorcycles",
    travel: "Travel",
    photography: "Photography",
    gaming: "Gaming",
    books: "Books",
    music: "Music",
    hardware: "Hardware",
    art: "Art",
    experiments: "Side experiments",
  },
  cs: {
    sport: "Sport",
    aviation: "Létání",
    motorcycles: "Motorky",
    travel: "Cestování",
    photography: "Fotografie",
    gaming: "Hry",
    books: "Knihy",
    music: "Hudba",
    hardware: "Hardware",
    art: "Umění",
    experiments: "Vedlejší experimenty",
  },
};

/* Track record helpers ------------------------------------------------------ */

/** "CCA Group a.s." → "CCA Group" (legal suffixes are noise in a track record). */
export function shortCompany(company: string): string {
  return company.replace(/,?\s+(s\.\s?r\.\s?o\.|a\.\s?s\.|GmbH|Ltd\.?|Inc\.?)$/i, "").trim();
}

/** "2022–24", "2026" — the YEARS cell of a track-record row. */
export function yearsLabel(start: Date, end?: Date): string {
  const a = start.getUTCFullYear();
  const b = (end ?? new Date()).getUTCFullYear();
  if (a === b) return String(a);
  return `${a}–${String(b).slice(-2)}`;
}
