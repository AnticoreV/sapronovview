/**
 * Build-time generated brand images (Open Graph card and touch icon) in the
 * D4 · Pre-flight look: day panel, dark instrument faces, cyan = selectable.
 *
 * Text is set in the site's own typefaces — Saira for the name, JetBrains Mono
 * for labels and readouts — converted to vector paths with opentype.js, so the
 * card looks the same on every build machine. Glyphs outside the latin subset
 * (≈, →) fall back to a system monospace in their fixed-width cell. The cut-out
 * portrait is composited on the right.
 *
 * To use your own artwork instead, delete the matching endpoint in src/pages/
 * and drop a static file into public/ with the same path.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import opentype, { type Font } from "opentype.js";
import sharp, { type OverlayOptions } from "sharp";
import { availabilityText, siteConfig } from "@config";
import { heroReadouts } from "@data/readouts";

const root = process.cwd();
const loadFont = (file: string): Font => {
  const buf = readFileSync(join(root, "node_modules", file));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};

let fonts: { display: Font; body: Font; mono: Font; monoBold: Font } | undefined;
const getFonts = () =>
  (fonts ??= {
    display: loadFont("@fontsource/saira/files/saira-latin-800-normal.woff"),
    body: loadFont("@fontsource/saira/files/saira-latin-500-normal.woff"),
    mono: loadFont("@fontsource/jetbrains-mono/files/jetbrains-mono-latin-600-normal.woff"),
    monoBold: loadFont("@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff"),
  });

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * One glyph outline drawn at the origin and cached. opentype.js 2.0 emits NaN
 * coordinates for some glyphs at some fractional positions, so glyphs are always
 * generated at (0, 0) and placed with an SVG translate.
 */
const glyphCache = new WeakMap<Font, Map<string, string>>();
function glyphPath(font: Font, ch: string, size: number): string {
  let cache = glyphCache.get(font);
  if (!cache) glyphCache.set(font, (cache = new Map()));
  const key = `${ch}@${size}`;
  const cached = cache.get(key);
  if (cached !== undefined) return cached;
  const d = font.getPath(ch, 0, 0, size, { kerning: false }).toPathData(2);
  if (/NaN|Infinity/.test(d)) throw new Error(`Invalid glyph path for "${ch}"`);
  cache.set(key, d);
  return d;
}

/**
 * Text as SVG paths in `font`, tracked by `letterSpacing` (em), placed glyph by glyph
 * (opentype.js's own letterSpacing / kerning options also emit NaN with these fonts).
 * Glyphs missing from the latin subset are drawn as system-font <text>.
 */
function text(
  font: Font,
  value: string,
  x: number,
  y: number,
  size: number,
  fill: string,
  letterSpacing = 0,
): string {
  const glyphs: string[] = [];
  const fallbacks: string[] = [];
  const track = letterSpacing * size;
  const cell = font.getAdvanceWidth("M", size, { kerning: false });
  let cursor = x;
  for (const ch of value) {
    if (ch === " " || font.charToGlyphIndex(ch) > 0) {
      if (ch !== " ") {
        glyphs.push(
          `<path transform="translate(${cursor.toFixed(2)} ${y})" d="${glyphPath(font, ch, size)}"/>`,
        );
      }
      cursor += font.getAdvanceWidth(ch, size, { kerning: false }) + track;
    } else {
      fallbacks.push(
        `<text x="${(cursor + cell / 2).toFixed(1)}" y="${y}" font-family="Menlo, DejaVu Sans Mono, monospace" font-size="${size}" font-weight="700" fill="${fill}" text-anchor="middle">${escape(ch)}</text>`,
      );
      cursor += cell + track;
    }
  }
  return `<g fill="${fill}">${glyphs.join("")}</g>${fallbacks.join("")}`;
}

/** Attitude-indicator mark: dark face, cyan horizon + aircraft symbol. */
export const iconSvg = (size: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <rect width="64" height="64" rx="12" fill="#101211"/>
  <circle cx="32" cy="32" r="22" fill="none" stroke="#1c201f" stroke-width="6"/>
  <path d="M10 34h44" stroke="#f1f1eb" stroke-width="3"/>
  <path d="M17 31h10v6M47 31H37v6" fill="none" stroke="#3fcfdf" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="32" cy="32" r="3.5" fill="#3fcfdf"/>
</svg>`;

const ogSvg = () => {
  const f = getFonts();
  const [first, ...rest] = siteConfig.name.toUpperCase().split(" ");
  const annunciator = availabilityText[siteConfig.availability.status].long;
  const readouts = heroReadouts
    .slice(0, 3)
    .map((r, i) => {
      const x = 64 + i * 196;
      return `<g>
    <rect x="${x}" y="456" width="184" height="120" rx="8" fill="#101211"/>
    <rect x="${x + 3}" y="459" width="178" height="114" rx="6" fill="none" stroke="#1c201f" stroke-width="4"/>
    ${text(f.monoBold, r.label.toUpperCase(), x + 16, 484, 12, "#f1f1eb", 0.04)}
    ${text(f.mono, r.source.toUpperCase(), x + 16, 503, 12, "#a2a8a4", 0.04)}
    ${text(f.monoBold, r.value, x + 16, 552, 28, "#3fcfdf")}
  </g>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#d5d8d5"/>
  <rect width="1200" height="56" fill="#101211"/>
  ${text(f.monoBold, `${siteConfig.callsign} / ${siteConfig.base}`, 64, 36, 18, "#f1f1eb", 0.1)}
  <rect x="900" y="13" width="236" height="30" rx="4" fill="#0c2a18"/>
  ${text(f.monoBold, annunciator, 916, 34, 14, "#3cc46e", 0.02)}
  ${text(f.mono, "BACKEND & FULLSTACK ENGINEER · FOUNDER", 64, 116, 16, "#464c49", 0.04)}
  ${text(f.display, first ?? "", 58, 226, 112, "#111312", -0.02)}
  ${text(f.display, rest.join(" "), 58, 326, 112, "#111312", -0.02)}
  ${text(f.body, "Backend systems and products, AI agents and", 64, 380, 25, "#111312")}
  ${text(f.body, "automation, services shipped to production.", 64, 413, 25, "#111312")}
  ${readouts}
</svg>`;
};

/** Copy a Node Buffer into a standalone ArrayBuffer-backed Uint8Array (a valid Response body). */
function toBody(buf: Buffer): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(new ArrayBuffer(buf.byteLength));
  bytes.set(buf);
  return bytes;
}

export async function renderOgImage(): Promise<Uint8Array<ArrayBuffer>> {
  const layers: OverlayOptions[] = [];
  try {
    const portrait = await sharp(join(root, "src/assets/portraits/cutout-turtleneck.webp"))
      .resize({ height: 574 })
      .png()
      .toBuffer({ resolveWithObject: true });
    layers.push({ input: portrait.data, left: 1200 - portrait.info.width - 8, top: 56 });
  } catch {
    /* portrait missing — text-only card */
  }
  return toBody(await sharp(Buffer.from(ogSvg())).composite(layers).png().toBuffer());
}

export async function renderTouchIcon(size = 180): Promise<Uint8Array<ArrayBuffer>> {
  return toBody(
    await sharp(Buffer.from(iconSvg(size)))
      .png()
      .toBuffer(),
  );
}
