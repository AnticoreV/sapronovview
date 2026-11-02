/**
 * Sätteri mdast plugins: in production builds, drop Markdown blocks that still
 * contain a `[placeholder]` (square-bracketed text that is not a link). The
 * content files keep the placeholder so it can be filled in later; the public
 * site never shows it. `npm run dev` keeps everything so gaps stay visible.
 *
 * Pass 1 removes top-level paragraphs, list items and blockquotes whose text
 * contains `[…]`, and raw HTML pointing at placeholder images.
 * Pass 2 removes lists left empty and headings whose section ended up empty.
 */
const PLACEHOLDER = /\[[^\]\n]+\]/;

const isProduction = () => process.env.NODE_ENV === "production";

const topLevel = (node, ctx) => ctx.parent(node)?.type === "root";

/** @type {import("satteri").MdastPluginDefinition} */
const dropPlaceholderBlocks = {
  name: "hide-placeholders:blocks",
  paragraph(node, ctx) {
    if (topLevel(node, ctx) && PLACEHOLDER.test(ctx.textContent(node))) ctx.removeNode(node);
  },
  blockquote(node, ctx) {
    if (topLevel(node, ctx) && PLACEHOLDER.test(ctx.textContent(node))) ctx.removeNode(node);
  },
  listItem(node, ctx) {
    if (PLACEHOLDER.test(ctx.textContent(node))) ctx.removeNode(node);
  },
  html(node, ctx) {
    if (/placeholder/i.test(node.value ?? "")) ctx.removeNode(node);
  },
};

/** @type {import("satteri").MdastPluginDefinition} */
const dropEmptySections = {
  name: "hide-placeholders:sections",
  list(node, ctx) {
    if (node.children.length === 0) ctx.removeNode(node);
  },
  heading(node, ctx) {
    const parent = ctx.parent(node);
    const index = ctx.indexOf(node);
    if (!parent || parent.type !== "root" || index === undefined) return;
    const rest = parent.children.slice(index + 1);
    const next = rest.find((n) => !(n.type === "list" && n.children.length === 0));
    if (!next || (next.type === "heading" && next.depth <= node.depth)) ctx.removeNode(node);
  },
};

/** Plugin entries for `satteri({ mdastPlugins })` — no-ops outside production. */
export const hidePlaceholders = [
  () => (isProduction() ? dropPlaceholderBlocks : null),
  () => (isProduction() ? dropEmptySections : null),
];
