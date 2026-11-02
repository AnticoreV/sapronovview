/**
 * Locales and URL helpers. English is the default and keeps today's URLs (no prefix);
 * Czech lives under /cs/ (astro.config.mjs → i18n, prefixDefaultLocale: false).
 */
export const locales = ["en", "cs"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** BCP 47 tags for Intl, hreflang and the sitemap. */
export const localeTags: Record<Locale, string> = { en: "en-US", cs: "cs-CZ" };
/** Open Graph locales. */
export const ogLocales: Record<Locale, string> = { en: "en_US", cs: "cs_CZ" };
/** Names in their own language (language switch). */
export const localeNames: Record<Locale, string> = { en: "English", cs: "Čeština" };

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (locales as readonly string[]).includes(value);

/** The page's locale from `Astro.currentLocale` (anything unknown → English). */
export const getLocale = (current: string | undefined): Locale =>
  isLocale(current) ? current : defaultLocale;

/** "/cs/about" → "/about", "/cs" → "/", "/about" → "/about". */
export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/cs(?=\/|$)/, "");
  return stripped === "" ? "/" : stripped;
}

/**
 * A site path in the given locale: localizePath("/about", "cs") → "/cs/about",
 * localizePath("/", "cs") → "/cs", localizePath("/cs/about", "en") → "/about".
 * Keeps ?query and #hash; leaves external URLs, mailto: and files (/rss.xml) alone.
 */
export function localizePath(path: string, locale: Locale): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const match = path.match(/^([^?#]*)(.*)$/);
  const base = stripLocale(match?.[1] ?? path);
  const rest = match?.[2] ?? "";
  if (/\.[a-z0-9]+$/i.test(base)) return base + rest; // files: /rss.xml, /cv/….pdf
  if (locale === defaultLocale) return base + rest;
  return (base === "/" ? "/cs" : `/cs${base}`) + rest;
}

/** getStaticPaths entries for a page that exists in every locale ([...lang] routes). */
export const localeParams = () =>
  locales.map((l) => ({ params: { lang: l === defaultLocale ? undefined : l } }));
