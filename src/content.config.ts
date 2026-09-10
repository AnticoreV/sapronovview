/**
 * Content collections.
 *
 * Every piece of structured content on the site lives under `src/content/`
 * and is validated against the schemas below at build time. Files whose name
 * starts with an underscore (e.g. `_template.md`) are ignored, so each folder
 * ships with a template you can copy.
 */
import { defineCollection, reference, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/** Shared helpers ---------------------------------------------------------- */

const linkSchema = z.object({
  label: z.string(),
  href: z.url().or(z.string().startsWith("/")),
});

const screenshotSchema = ({ image }: SchemaContext) =>
  z.object({
    /** Path to an image under src/ (optimised) — omit to render a placeholder frame. */
    src: image().optional(),
    alt: z.string(),
    caption: z.string().optional(),
  });

/** Projects ---------------------------------------------------------------- */

export const projectCategories = [
  "professional",
  "open-source",
  "personal",
  "experiment",
  "hobby",
] as const;

export const projectStatuses = [
  "active",
  "in-progress",
  "research",
  "completed",
  "paused",
  "archived",
] as const;

const projects = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(220),
      /** Used for ordering and the "year" label. */
      date: z.coerce.date(),
      featured: z.boolean().default(false),
      status: z.enum(projectStatuses).default("completed"),
      category: z.enum(projectCategories),
      technologies: z.array(z.string()).default([]),
      /** Optimised cover image (place under src/assets/images/projects). */
      cover: image().optional(),
      coverAlt: z.string().optional(),
      github: z.url().optional(),
      website: z.url().optional(),
      links: z.array(linkSchema).default([]),
      /** Your role on the project, e.g. "Backend engineer" / "Founder". */
      role: z.string().optional(),
      /** Company, client or team the work was for. */
      organization: z.string().optional(),
      /** Timeframe label shown in the hero, e.g. "2024 — present". */
      timeframe: z.string().optional(),
      screenshots: z.array(screenshotSchema({ image })).default([]),
      /** Lower numbers appear first among featured projects. */
      order: z.number().default(100),
      /** Marks entries that still contain placeholder text. */
      placeholder: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

/** Writing ----------------------------------------------------------------- */

const writing = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/writing" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(300),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      /** Marks sample articles shipped with the template. */
      placeholder: z.boolean().default(false),
    }),
});

/** Experience -------------------------------------------------------------- */

export const employmentTypes = [
  "full-time",
  "part-time",
  "contract",
  "freelance",
  "internship",
  "founder",
] as const;

const experience = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/experience" }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    location: z.string().optional(),
    /** e.g. "Remote", "Hybrid", "On-site" */
    workplace: z.string().optional(),
    employmentType: z.enum(employmentTypes).default("full-time"),
    startDate: z.coerce.date(),
    /** Omit for your current position. */
    endDate: z.coerce.date().optional(),
    companyUrl: z.url().optional(),
    achievements: z.array(z.string()).default([]),
    technologies: z.array(z.string()).default([]),
    /** Show on the homepage "career highlights" strip. */
    highlight: z.boolean().default(false),
    placeholder: z.boolean().default(false),
  }),
});

/** Milestones: education, certifications, speaking, awards, community ------- */

export const milestoneTypes = [
  "education",
  "certification",
  "speaking",
  "award",
  "community",
] as const;

const milestones = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{yml,yaml,json}", base: "./src/content/milestones" }),
  schema: z.object({
    type: z.enum(milestoneTypes),
    title: z.string(),
    organization: z.string().optional(),
    location: z.string().optional(),
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    description: z.string().optional(),
    url: z.url().optional(),
    placeholder: z.boolean().default(false),
  }),
});

/** Hobbies ----------------------------------------------------------------- */

export const hobbyCategories = [
  "sport",
  "aviation",
  "motorcycles",
  "travel",
  "photography",
  "gaming",
  "books",
  "music",
  "hardware",
  "art",
  "experiments",
] as const;

const hobbies = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/hobbies" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tagline: z.string(),
      category: z.enum(hobbyCategories),
      /** Name of a lucide icon, e.g. "Plane". See src/lib/icons.ts */
      icon: z.string().default("Sparkles"),
      images: z.array(screenshotSchema({ image })).default([]),
      /** "Favourite things": bikes, routes, gear, books… */
      favorites: z.array(z.string()).default([]),
      /** Optional key/value stats, e.g. { label: "Countries", value: "12" } */
      stats: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      relatedProjects: z.array(reference("projects")).default([]),
      links: z.array(linkSchema).default([]),
      featured: z.boolean().default(false),
      order: z.number().default(100),
      placeholder: z.boolean().default(false),
    }),
});

/** Now --------------------------------------------------------------------- */

const now = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/now" }),
  schema: z.object({
    updated: z.coerce.date(),
    working: z.array(z.string()).default([]),
    learning: z.array(z.string()).default([]),
    reading: z
      .array(
        z.object({ title: z.string(), author: z.string().optional(), note: z.string().optional() }),
      )
      .default([]),
    sideProjects: z.array(reference("projects")).default([]),
    interests: z.array(z.string()).default([]),
    location: z.string().optional(),
  }),
});

export const collections = { projects, writing, experience, milestones, hobbies, now };
