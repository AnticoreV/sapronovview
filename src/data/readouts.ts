/**
 * Proof numbers — the only numbers on the site.
 *
 * One source of truth for the homepage proof row, the case-study ProofNumbers,
 * the metric chips on the case rows and the Open Graph card. Every value must be
 * real and carry its source; every source is a position in src/content/experience/.
 * Never add a number that isn't in the CV.
 *
 * `count` lets the HTML number count up once (prefix + 0→to + suffix); values
 * without it are shown as they are.
 */

export type Readout = {
  id: string;
  /** What is measured (mono label under the number). */
  label: string;
  /** Where it comes from — employer or client, as in the track record. */
  source: string;
  /** Display value, exactly as shown (→ and ≈ are drawn as inline SVG, see Glyphs). */
  value: string;
  /** The value in words for screen readers when the symbols don't read well ("hours to minutes"). */
  spoken?: string;
  /** Optional count-up for the HTML number. */
  count?: { prefix?: string; to: number; suffix?: string };
  /** One-line context in words, used for screen readers and case studies. */
  detail: string;
  /** Case study the number belongs to (src/content/projects/<slug>.md). */
  project?: string;
  /** Metric chip on the homepage case rows (mono, uppercase), e.g. "~2M users". */
  chip?: string;
  /** The chip in words for screen readers, when it differs from the plain reading. */
  chipSpoken?: string;
};

export const readouts = {
  users: {
    id: "users",
    label: "Users served",
    source: "NCR Voyix",
    value: "~2M",
    spoken: "about 2 million",
    count: { prefix: "~", to: 2, suffix: "M" },
    detail:
      "Enterprise system serving around two million users, run on GCP with full observability.",
    project: "self-service-menu-platform",
    chip: "~2M users",
    chipSpoken: "about 2 million users",
  },
  downstream: {
    id: "downstream",
    label: "Services behind one BFF",
    source: "NCR Voyix",
    value: "up to 8",
    count: { prefix: "up to ", to: 8 },
    detail: "One backend-for-frontend and aggregator over up to eight downstream services.",
    project: "self-service-menu-platform",
    chip: "up to 8 services",
  },
  p95: {
    id: "p95",
    label: "p95 latency, roughly halved",
    source: "CCA Group",
    value: "≈ ½",
    spoken: "approximately half",
    detail:
      "Kotlin coroutines ran independent downstream calls concurrently — p95 latency roughly halved under peak load.",
    project: "dynamic-form-engine",
    chip: "p95 ≈ halved",
  },
  ciQueue: {
    id: "ci-queue",
    label: "CI queue time",
    source: "CreativeDock",
    value: "h → min",
    spoken: "hours to minutes",
    detail: "GitLab CI build queue times cut from hours to minutes.",
    project: "creativedock-greenfield-services",
    chip: "CI h → min",
    chipSpoken: "CI queue: hours to minutes",
  },
  formTypes: {
    id: "form-types",
    label: "New form type",
    source: "CCA Group",
    value: "days → h",
    spoken: "days to hours",
    detail: "Effort to create a new form type went from days to hours.",
    project: "dynamic-form-engine",
    chip: "days → hours",
  },
  services: {
    id: "services",
    label: "Greenfield services",
    source: "CreativeDock",
    value: "3",
    count: { to: 3 },
    detail:
      "Ticketing, booking and subscription services built from scratch in a three-month engagement.",
    project: "creativedock-greenfield-services",
    chip: "3 services",
  },
} satisfies Record<string, Readout>;

export type ReadoutId = keyof typeof readouts;

/** The four proof numbers under the homepage hero, in order. */
export const heroReadouts: Readout[] = [
  readouts.users,
  readouts.p95,
  readouts.ciQueue,
  readouts.downstream,
];

/** Readouts that belong to a case study. */
export function readoutsFor(projectSlug: string): Readout[] {
  return Object.values(readouts).filter((r: Readout) => r.project === projectSlug);
}
