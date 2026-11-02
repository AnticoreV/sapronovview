/**
 * Build-config helper: is there at least one published post?
 *
 * Mirrors the production rule in src/lib/content.ts (drafts and entries with
 * `placeholder: true` are not published) without the content layer, so
 * astro.config.mjs can keep /writing out of the sitemap while it is empty.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** @param {string} dir absolute path of src/content/writing */
export function hasPublishedWriting(dir) {
  let files = [];
  try {
    files = readdirSync(dir);
  } catch {
    return false;
  }
  for (const file of files) {
    if (file.startsWith("_") || !/\.(md|mdx)$/.test(file)) continue;
    const source = readFileSync(join(dir, file), "utf8");
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
    if (/^draft:\s*true\b/m.test(frontmatter) || /^placeholder:\s*true\b/m.test(frontmatter)) {
      continue;
    }
    return true;
  }
  return false;
}
