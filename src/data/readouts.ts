/**
 * Proof readouts — the only numbers on the instrument panel.
 *
 * One source of truth for the HTML (hero readout strip, case studies, the
 * panel's accessible description) and the live 3D panel (src/scripts/panel3d.ts).
 * Every value must be real and carry its source; every source is a position in
 * src/content/experience/. Never add a number that isn't in the CV.
 *
 * `count` lets the HTML readout count up once (prefix + 0→to + suffix); values
 * without it are shown as they are.
 */

export type Readout = {
  id: string;
  /** What is measured (mono label). */
  label: string;
  /** Where it comes from — employer or client, as in the logbook. */
  source: string;
  /** Display value, exactly as on the panel. */
  value: string;
  /** Optional count-up for the HTML readout. */
  count?: { prefix?: string; to: number; suffix?: string };
  /** One-line context in words, used for screen readers and case studies. */
  detail: string;
  /** Case study the number belongs to (src/content/projects/<slug>.md). */
  project?: string;
  /** Shorter label for the 3D panel's LCD, where space is tight. */
  panel?: string;
  /** Shorter value for the 3D panel's LCD (e.g. "≈ ½" for "≈ halved"). */
  panelValue?: string;
};

export const readouts = {
  users: {
    id: "users",
    label: "Users served",
    source: "NCR Voyix",
    value: "~2M",
    count: { prefix: "~", to: 2, suffix: "M" },
    detail:
      "Enterprise system serving around two million users, run on GCP with full observability.",
    project: "self-service-menu-platform",
    panel: "NCR VOYIX",
  },
  downstream: {
    id: "downstream",
    label: "Downstream · BFF",
    source: "NCR Voyix",
    value: "up to 8",
    count: { prefix: "up to ", to: 8 },
    detail: "One backend-for-frontend and aggregator over up to eight downstream services.",
    project: "self-service-menu-platform",
    panel: "DOWNSTREAM · BFF",
  },
  p95: {
    id: "p95",
    label: "p95 latency",
    source: "CCA Group",
    value: "≈ halved",
    panelValue: "≈ ½",
    detail:
      "Kotlin coroutines ran independent downstream calls concurrently — p95 latency roughly halved under peak load.",
    project: "dynamic-form-engine",
    panel: "p95 · CCA GROUP",
  },
  ciQueue: {
    id: "ci-queue",
    label: "CI queue",
    source: "CreativeDock",
    value: "h → min",
    detail: "GitLab CI build queue times cut from hours to minutes.",
    project: "creativedock-greenfield-services",
    panel: "CI QUEUE · CREATIVEDOCK",
  },
  formTypes: {
    id: "form-types",
    label: "New form type",
    source: "CCA Group",
    value: "days → h",
    detail: "Effort to create a new form type went from days to hours.",
    project: "dynamic-form-engine",
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
  },
} satisfies Record<string, Readout>;

/** The four readouts on the homepage panel, in panel order. */
export const heroReadouts: Readout[] = [
  readouts.users,
  readouts.p95,
  readouts.ciQueue,
  readouts.downstream,
];

/** Career span on the altimeter-style "career · yrs" instrument (first and latest logbook year). */
export const careerSpan = { from: 2021, to: 2026, source: "Logbook" } as const;

/** Readouts that belong to a case study. */
export function readoutsFor(projectSlug: string): Readout[] {
  return Object.values(readouts).filter((r: Readout) => r.project === projectSlug);
}

/** Plain-language description of the hero panel (alt text for the poster). */
export const panelDescription =
  "Instrument panel: " +
  [
    `${readouts.users.value} users served at ${readouts.users.source}`,
    "an attitude indicator",
    `career years ${careerSpan.from} to ${careerSpan.to}`,
    `p95 latency roughly halved at ${readouts.p95.source}`,
    `CI queue from hours to minutes at ${readouts.ciQueue.source}`,
    `up to 8 downstream services behind one BFF`,
  ].join(", ") +
  ".";
