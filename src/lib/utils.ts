/** Shared helpers used across pages and components. */
import { localeTags, type Locale } from "@/i18n/locales";

/**
 * A date in the page's language: "Nov 2, 2026" in English, "2. 11. 2026" in Czech
 * (a day-month-year date in Czech always uses numeric months).
 */
export function formatDate(
  date: Date | string | undefined,
  options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" },
  locale: Locale = "en",
): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const opts =
    locale === "cs" && options.day && options.month === "short"
      ? { ...options, month: "numeric" as const }
      : options;
  return new Intl.DateTimeFormat(localeTags[locale], { ...opts, timeZone: "UTC" }).format(d);
}

/** "Jan 2025" / "leden 2025". */
export function formatMonthYear(date: Date | string | undefined, locale: Locale = "en"): string {
  return formatDate(date, { year: "numeric", month: locale === "cs" ? "long" : "short" }, locale);
}

const csUnits = {
  year: { one: "rok", few: "roky", other: "let" },
  month: { one: "měsíc", few: "měsíce", other: "měsíců" },
} as const;
const csPlural = new Intl.PluralRules("cs");

/** "2 yrs 3 mos" / "2 roky 3 měsíce" between two dates (end defaults to now). */
export function formatDuration(start: Date, end?: Date, locale: Locale = "en"): string {
  const e = end ?? new Date();
  let months =
    (e.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    (e.getUTCMonth() - start.getUTCMonth()) +
    1;
  if (months < 1) months = 1;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (locale === "cs") {
    const unit = (n: number, u: keyof typeof csUnits) => {
      const rule = csPlural.select(n) as "one" | "few" | "other";
      return `${n}\u00a0${csUnits[u][rule] ?? csUnits[u].other}`;
    };
    if (years) parts.push(unit(years, "year"));
    if (rest) parts.push(unit(rest, "month"));
    return parts.join(" ");
  }
  if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (rest) parts.push(`${rest} mo${rest > 1 ? "s" : ""}`);
  return parts.join(" ");
}

/** Estimated reading time based on ~220 words per minute. */
export function readingTime(text: string): { minutes: number; words: number } {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return { minutes, words };
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Normalise a pathname to its canonical, extension-less form:
 * "/index.html" → "/", "/about.html" → "/about", "/about/" → "/about".
 */
export function cleanPath(pathname: string): string {
  let p = pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  if (p.length > 1) p = p.replace(/\/+$/, "");
  return p || "/";
}

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path: string, site: URL | string | undefined): string {
  if (!site) return path;
  return new URL(path, site).toString();
}

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
