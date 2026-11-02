/**
 * Per-page i18n helpers for .astro files:
 *   const { locale, t, l } = i18n(Astro);
 * `locale` comes from the URL (/cs/… → "cs", everything else → "en"), `t` translates UI
 * keys (src/i18n/ui.ts) and `l` turns a site path into the page's language ("/about" →
 * "/cs/about" on Czech pages).
 */
import { getLocale, localizePath, type Locale } from "@/i18n/locales";
import { useT } from "@/i18n/ui";

export function i18n(astro: { currentLocale?: string | undefined }) {
  const locale: Locale = getLocale(astro.currentLocale);
  return {
    locale,
    t: useT(locale),
    l: (path: string) => localizePath(path, locale),
  };
}

export { getLocale, localizePath, stripLocale, localeParams, locales } from "@/i18n/locales";
export type { Locale } from "@/i18n/locales";
export { useT, type UiKey } from "@/i18n/ui";
