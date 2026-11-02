/**
 * Sätteri mdast plugin: Czech typography for Czech content files
 * (src/content/<collection>/cs/*.md) — a non-breaking space after one-letter
 * prepositions and conjunctions (k, s, v, z, o, u, a, i). Same rule as src/i18n/typo.ts.
 */
const ONE_LETTER = /(?<=^|[\s(„"])([ksvzouaiKSVZOUAI])[ \t\n]+(?=\S)/g;
/** A one-letter word right before an inline element ("až z **8 služeb**"). */
const TRAILING = /(?<=^|[\s(„"])([ksvzouaiKSVZOUAI]) $/;
const czTypo = (text) => text.replace(ONE_LETTER, "$1\u00a0").replace(TRAILING, "$1\u00a0");

/** @type {import("satteri").MdastPluginDefinition} */
const czechText = {
  name: "czech-typography",
  text(node, ctx) {
    const next = czTypo(node.value ?? "");
    if (next !== node.value) ctx.setProperty(node, "value", next);
  },
};

/** Plugin entry for `satteri({ mdastPlugins })`: only for files in a `/cs/` content folder. */
export const czechTypography = [
  ({ fileURL }) => (fileURL && /\/content\/[^/]+\/cs\//.test(fileURL.pathname) ? czechText : null),
];
