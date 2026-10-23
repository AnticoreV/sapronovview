/**
 * Minimal static server for dist/ used by the Playwright smoke tests.
 * Resolves URLs the way the static host does with `build.format: "file"`:
 * "/about" → about.html, "/" → index.html, unknown → 404.html (status 404).
 * Applies dist/_headers (Cloudflare Pages format: a path pattern line, then indented
 * "Name: value" lines; every matching block applies) so the tests run under the same
 * security headers (CSP, HSTS, …) as production.
 * (`astro preview` is not used here: it ignores _headers, and in some environments it
 * detaches into the background, which Playwright's webServer cannot manage.)
 *
 *   node scripts/serve-dist.mjs [port]
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const port = Number(process.argv[2] ?? process.env.PORT ?? 4322);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

/** Parse dist/_headers into [{ pattern: RegExp, headers: [[name, value]] }]. */
function loadHeaders() {
  let text = "";
  try {
    text = readFileSync(join(root, "_headers"), "utf8");
  } catch {
    return [];
  }
  const rules = [];
  for (const line of text.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (!/^\s/.test(line)) {
      const source = line
        .trim()
        .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
        .replace(/\*/g, ".*")
        .replace(/:[A-Za-z]\w*/g, "[^/]+");
      rules.push({ pattern: new RegExp(`^${source}$`), headers: [] });
    } else if (rules.length) {
      const i = line.indexOf(":");
      if (i > 0) rules.at(-1).headers.push([line.slice(0, i).trim(), line.slice(i + 1).trim()]);
    }
  }
  return rules;
}
const headerRules = loadHeaders();
const headersFor = (path) =>
  Object.fromEntries(headerRules.filter((r) => r.pattern.test(path)).flatMap((r) => r.headers));

const isFile = async (p) => (await stat(p).catch(() => null))?.isFile() ?? false;

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
  const extra = headersFor(path);
  const safe = normalize(path).replace(/^(\.\.[/\\])+/, "");
  const candidates = safe.endsWith("/")
    ? [join(root, safe, "index.html")]
    : [join(root, safe), join(root, `${safe}.html`)];
  for (const file of candidates) {
    if (file.startsWith(root) && (await isFile(file))) {
      res.writeHead(200, {
        ...extra,
        "Content-Type": types[extname(file)] ?? "application/octet-stream",
      });
      res.end(await readFile(file));
      return;
    }
  }
  res.writeHead(404, { ...extra, "Content-Type": types[".html"] });
  res.end(await readFile(join(root, "404.html")).catch(() => "Not found"));
}).listen(port, "127.0.0.1", () =>
  console.log(`dist/ on http://127.0.0.1:${port} (${headerRules.length} _headers rules)`),
);
