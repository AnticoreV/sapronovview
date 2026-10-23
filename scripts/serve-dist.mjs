/**
 * Minimal static server for dist/ used by the Playwright smoke tests.
 * Resolves URLs the way the static host does with `build.format: "file"`:
 * "/about" → about.html, "/" → index.html, unknown → 404.html (status 404).
 * (`astro preview` is not used here: in some environments it detaches into the
 * background, which Playwright's webServer cannot manage.)
 *
 *   node scripts/serve-dist.mjs [port]
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
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

const isFile = async (p) => (await stat(p).catch(() => null))?.isFile() ?? false;

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
  const safe = normalize(path).replace(/^(\.\.[/\\])+/, "");
  const candidates = safe.endsWith("/")
    ? [join(root, safe, "index.html")]
    : [join(root, safe), join(root, `${safe}.html`)];
  for (const file of candidates) {
    if (file.startsWith(root) && (await isFile(file))) {
      res.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
      res.end(await readFile(file));
      return;
    }
  }
  res.writeHead(404, { "Content-Type": types[".html"] });
  res.end(await readFile(join(root, "404.html")).catch(() => "Not found"));
}).listen(port, "127.0.0.1", () => console.log(`dist/ on http://127.0.0.1:${port}`));
