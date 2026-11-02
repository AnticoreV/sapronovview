/**
 * Czech typography: a non-breaking space after one-letter prepositions and conjunctions
 * (k, s, v, z, o, u, a, i) so they never end a line. Applied to every Czech UI string,
 * data string and (via src/lib/markdown-czech.mjs) Czech Markdown text.
 */
const ONE_LETTER = /(?<=^|[\s(„"])([ksvzouaiKSVZOUAI])[ \t\n]+(?=\S)/g;

export function czTypo(text: string): string {
  return text.replace(ONE_LETTER, "$1\u00a0");
}

/** Typography for a string in the given locale (only Czech needs it). */
export const typo = (locale: string, text: string) => (locale === "cs" ? czTypo(text) : text);

/** Czech typography for every string inside a value (data records, frontmatter). */
export function typoDeep<T>(value: T): T {
  if (typeof value === "string") return czTypo(value) as T;
  if (Array.isArray(value)) return value.map((v) => typoDeep(v)) as T;
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, typoDeep(v)]),
    ) as T;
  }
  return value;
}
