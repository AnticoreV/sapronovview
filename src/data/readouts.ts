/**
 * Proof numbers — the only numbers on the site, in English and Czech.
 *
 * One source of truth for the homepage proof row, the case-study ProofNumbers, the metric
 * chips on the case rows and the Open Graph cards. Every value must be real and carry its
 * source; every source is a position in src/content/experience/. Never add a number that
 * isn't in the CV. The Czech texts say the same facts ("~2M" → "~2 mil.", "up to 8" → "až 8").
 */
import type { Locale } from "@/i18n/locales";
import { typoDeep } from "@/i18n/typo";

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
  /** One-line context in words, used for screen readers and case studies. */
  detail: string;
  /** Case study the number belongs to (src/content/projects/<slug>.md). */
  project?: string;
  /** Metric chip on the homepage case rows (mono), e.g. "~2M users". */
  chip?: string;
  /** The chip in words for screen readers, when it differs from the plain reading. */
  chipSpoken?: string;
};

type Text = Pick<Readout, "label" | "value" | "spoken" | "detail" | "chip" | "chipSpoken">;
type Base = Pick<Readout, "id" | "source" | "project">;

const facts = {
  users: { id: "users", source: "NCR Voyix", project: "self-service-menu-platform" },
  downstream: { id: "downstream", source: "NCR Voyix", project: "self-service-menu-platform" },
  p95: { id: "p95", source: "CCA Group", project: "dynamic-form-engine" },
  ciQueue: { id: "ci-queue", source: "CreativeDock", project: "creativedock-greenfield-services" },
  formTypes: { id: "form-types", source: "CCA Group", project: "dynamic-form-engine" },
  services: { id: "services", source: "CreativeDock", project: "creativedock-greenfield-services" },
} satisfies Record<string, Base>;

export type ReadoutId = keyof typeof facts;

const texts: Record<Locale, Record<ReadoutId, Text>> = {
  en: {
    users: {
      label: "Users served",
      value: "~2M",
      spoken: "about 2 million",
      detail:
        "Enterprise system serving around two million users, run on GCP with full observability.",
      chip: "~2M users",
      chipSpoken: "about 2 million users",
    },
    downstream: {
      label: "Services behind one BFF",
      value: "up to 8",
      detail: "One backend-for-frontend and aggregator over up to eight downstream services.",
      chip: "up to 8 services",
    },
    p95: {
      label: "p95 latency, roughly halved",
      value: "≈ ½",
      spoken: "approximately half",
      detail:
        "Kotlin coroutines ran independent downstream calls concurrently, which roughly halved p95 latency under peak load.",
      chip: "p95 ≈ halved",
    },
    ciQueue: {
      label: "CI queue time",
      value: "h → min",
      spoken: "hours to minutes",
      detail: "GitLab CI build queue times cut from hours to minutes.",
      chip: "CI h → min",
      chipSpoken: "CI queue: hours to minutes",
    },
    formTypes: {
      label: "New form type",
      value: "days → h",
      spoken: "days to hours",
      detail: "Effort to create a new form type went from days to hours.",
      chip: "days → hours",
    },
    services: {
      label: "Greenfield services",
      value: "3",
      detail:
        "Ticketing, booking and subscription services built from scratch in a three-month engagement.",
      chip: "3 services",
    },
  },
  cs: {
    users: {
      label: "Obsloužených uživatelů",
      value: "~2\u00a0mil.",
      spoken: "přibližně 2 miliony",
      detail:
        "Podnikový systém pro zhruba dva miliony uživatelů, provozovaný na GCP s plnou observabilitou.",
      chip: "~2 mil. uživatelů",
      chipSpoken: "přibližně 2 miliony uživatelů",
    },
    downstream: {
      label: "Služeb za jedním BFF",
      value: "až\u00a08",
      detail: "Jeden backend-for-frontend a agregátor nad až osmi navazujícími službami.",
      chip: "až 8 služeb",
    },
    p95: {
      label: "Latence p95 zhruba na polovinu",
      value: "≈ ½",
      spoken: "přibližně polovina",
      detail:
        "Korutiny v Kotlinu spouštěly nezávislá volání navazujících služeb souběžně, takže latence p95 při špičkové zátěži klesla zhruba na polovinu.",
      chip: "p95 ≈ poloviční",
      chipSpoken: "p95 přibližně poloviční",
    },
    ciQueue: {
      label: "Čekání ve frontě CI",
      value: "h → min",
      spoken: "z hodin na minuty",
      detail: "Doba čekání buildů ve frontě GitLab CI zkrácená z hodin na minuty.",
      chip: "CI h → min",
      chipSpoken: "fronta CI: z hodin na minuty",
    },
    formTypes: {
      label: "Nový typ formuláře",
      value: "dny → h",
      spoken: "ze dnů na hodiny",
      detail: "Práce na novém typu formuláře se zkrátila ze dnů na hodiny.",
      chip: "dny → hodiny",
      chipSpoken: "ze dnů na hodiny",
    },
    services: {
      label: "Nové služby od nuly",
      value: "3",
      detail:
        "Služby pro ticketing, rezervace a předplatné postavené od nuly během tříměsíční spolupráce.",
      chip: "3 služby",
    },
  },
};

texts.cs = typoDeep(texts.cs);

/** Every readout in one locale. */
export function getReadouts(locale: Locale): Record<ReadoutId, Readout> {
  return Object.fromEntries(
    (Object.keys(facts) as ReadoutId[]).map((k) => [k, { ...facts[k], ...texts[locale][k] }]),
  ) as Record<ReadoutId, Readout>;
}

/** The four proof numbers under the homepage hero, in order. */
export const heroReadoutIds: ReadoutId[] = ["users", "p95", "ciQueue", "downstream"];
export const heroReadouts = (locale: Locale): Readout[] => {
  const all = getReadouts(locale);
  return heroReadoutIds.map((id) => all[id]);
};

/** Readouts that belong to a case study. */
export function readoutsFor(projectSlug: string, locale: Locale): Readout[] {
  return Object.values(getReadouts(locale)).filter((r) => r.project === projectSlug);
}
