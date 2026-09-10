/** Shared helpers used across pages and components. */

export function formatDate(
  date: Date | string | undefined,
  options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" },
): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(d);
}

export function formatMonthYear(date: Date | string | undefined): string {
  return formatDate(date, { year: "numeric", month: "short" });
}

/** "2y 3m" style duration between two dates (end defaults to now). */
export function formatDuration(start: Date, end?: Date): string {
  const e = end ?? new Date();
  let months =
    (e.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    (e.getUTCMonth() - start.getUTCMonth()) +
    1;
  if (months < 1) months = 1;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
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

export function isPlaceholder(value: string | undefined | null): boolean {
  return typeof value === "string" && /^\[.*\]$/.test(value.trim());
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
