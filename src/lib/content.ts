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

/* Projects ---------------------------------------------------------------- */

export async function getProjects(): Promise<Project[]> {
  const all = await getCollection("projects", ({ data }) => !(isProd && data.draft));
  return all.sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    if (a.data.order !== b.data.order) return a.data.order - b.data.order;
    return b.data.date.valueOf() - a.data.date.valueOf();
  });
}

export async function getFeaturedProjects(limit = 4): Promise<Project[]> {
  const all = await getProjects();
  return all.filter((p) => p.data.featured).slice(0, limit);
}

/* Writing ----------------------------------------------------------------- */

export async function getPosts(): Promise<Post[]> {
  const all = await getCollection("writing", ({ data }) => !(isProd && data.draft));
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
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
  const all = await getCollection("experience");
  return all.sort((a, b) => {
    const aEnd = a.data.endDate?.valueOf() ?? Infinity;
    const bEnd = b.data.endDate?.valueOf() ?? Infinity;
    if (aEnd !== bEnd) return bEnd - aEnd;
    return b.data.startDate.valueOf() - a.data.startDate.valueOf();
  });
}

export async function getMilestones(): Promise<Milestone[]> {
  const all = await getCollection("milestones");
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

export const statusLabels: Record<
  Project["data"]["status"],
  { label: string; tone: "green" | "amber" | "gray" | "accent" }
> = {
  active: { label: "Active", tone: "green" },
  "in-progress": { label: "In progress", tone: "green" },
  research: { label: "Research", tone: "accent" },
  completed: { label: "Completed", tone: "gray" },
  paused: { label: "Paused", tone: "amber" },
  archived: { label: "Archived", tone: "gray" },
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
