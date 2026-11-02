/**
 * Typed queries over the content collections. Pages import from here so
 * sorting / filtering rules live in one place.
 */
import { getCollection, type CollectionEntry } from "astro:content";

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

const visible = (data: { placeholder?: boolean; draft?: boolean }) =>
  !(isProd && (data.draft || (hidePlaceholders && data.placeholder)));

/* Projects ---------------------------------------------------------------- */

export async function getProjects(): Promise<Project[]> {
  const all = await getCollection("projects", ({ data }) => visible(data));
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
export async function getCodeProjects(): Promise<Project[]> {
  const all = await getCollection(
    "projects",
    ({ data }) => data.placeholder && !data.draft && Boolean(data.github),
  );
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getFeaturedProjects(limit = 4): Promise<Project[]> {
  const all = await getProjects();
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

export async function getPositions(): Promise<Position[]> {
  const all = await getCollection("experience", ({ data }) => visible(data));
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

export async function getHobbies(): Promise<Hobby[]> {
  const all = await getCollection("hobbies");
  return all.sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );
}

/* Labels ------------------------------------------------------------------ */

export const categoryLabels: Record<Project["data"]["category"], string> = {
  professional: "Professional",
  "open-source": "Open source",
  personal: "Personal",
  experiment: "Experiment",
  hobby: "Hobby project",
};

export type StatusTone = "ok" | "caution" | "off";

/** Project status as a pill: word + tone (ok = mint, caution = butter, off = neutral). */
export const statusLabels: Record<Project["data"]["status"], { label: string; tone: StatusTone }> =
  {
    active: { label: "Live", tone: "ok" },
    pilot: { label: "Pilot", tone: "ok" },
    "in-progress": { label: "In progress", tone: "caution" },
    validating: { label: "Validating", tone: "caution" },
    research: { label: "Research", tone: "caution" },
    completed: { label: "Completed", tone: "off" },
    paused: { label: "Paused", tone: "off" },
    archived: { label: "Archived", tone: "off" },
  };

export const employmentLabels: Record<Position["data"]["employmentType"], string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  freelance: "Freelance",
  internship: "Internship",
  founder: "Founder",
};

export const milestoneLabels: Record<Milestone["data"]["type"], { title: string; plural: string }> =
  {
    education: { title: "Education", plural: "Education" },
    certification: { title: "Certification", plural: "Certifications" },
    speaking: { title: "Talk", plural: "Speaking" },
    award: { title: "Award", plural: "Awards" },
    community: { title: "Community", plural: "Community involvement" },
  };

export const hobbyCategoryLabels: Record<Hobby["data"]["category"], string> = {
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
