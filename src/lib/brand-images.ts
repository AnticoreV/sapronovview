/**
 * Build-time generated brand images (Open Graph card and touch icon) in the design
 * system v2 look (R2-C Runtime): cool light ground, ink type, deploy-blue accent,
 * the isometric cube mark.
 *
 * Text is set in the site's own typefaces — Schibsted Grotesk for the name, lede and
 * numbers, IBM Plex Mono for labels — converted to vector paths with opentype.js, so
 * the card looks the same on every build machine. Czech diacritics come from the
 * latin-ext files; glyphs outside both subsets (≈, →) fall back to a system font in
 * their cell. The cut-out portrait is composited on the right. One card per language
 * (/images/og-default.png, /images/og-default-cs.png).
 *
 * To use your own artwork instead, delete the matching endpoint in src/pages/
 * and drop a static file into public/ with the same path.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import opentype, { type Font } from "opentype.js";
import sharp, { type OverlayOptions } from "sharp";
import { availabilityText, siteConfig, siteCopy } from "@config";
import { heroReadouts } from "@data/readouts";
import type { Locale } from "@/i18n/locales";
import { useT } from "@/i18n/ui";

const root = process.cwd();
const loadFont = (file: string): Font => {
  const buf = readFileSync(join(root, "node_modules", file));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};

/** A face as [latin, latin-ext]: the first file that has a glyph draws it. */
type Face = Font[];
const face = (pkg: string, name: string, weight: number): Face =>
  ["latin", "latin-ext"].map((subset) =>
    loadFont(`${pkg}/files/${name}-${subset}-${weight}-normal.woff`),
  );

let fonts: { display: Face; body: Face; mono: Face; monoBold: Face } | undefined;
const getFonts = () =>
  (fonts ??= {
    display: face("@fontsource/schibsted-grotesk", "schibsted-grotesk", 800),
    body: face("@fontsource/schibsted-grotesk", "schibsted-grotesk", 500),
    mono: face("@fontsource/ibm-plex-mono", "ibm-plex-mono", 500),
    monoBold: face("@fontsource/ibm-plex-mono", "ibm-plex-mono", 600),
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
  fontFace: Face,
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
  const [base] = fontFace as [Font, ...Font[]];
  const cell = base.getAdvanceWidth("M", size, { kerning: false });
  let cursor = x;
  for (const ch of value) {
    const font = ch === " " ? base : fontFace.find((f) => f.charToGlyphIndex(ch) > 0);
    if (font) {
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

/** The 3-face isometric cube mark from the approved artboard, `scale` × its 26px box. */
const cube = (x: number, y: number, scale: number) =>
  `<g transform="translate(${x} ${y}) scale(${scale})">
    <path d="M13 2 23 7.5 13 13 3 7.5Z" fill="#3D63FF"/>
    <path d="M3 7.5 13 13v11L3 18.5Z" fill="#2F51E0"/>
    <path d="M23 7.5 13 13v11l10-5.5Z" fill="#2443B8"/>
  </g>`;

/** Touch icon: the cube on the light ground. */
export const iconSvg = (size: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <rect width="64" height="64" fill="#EEF1F4"/>
  ${cube(9, 8, 1.8)}
</svg>`;

/** The card's lede, in two lines (the hero lede, shortened to fit). */
export const ogLede: Record<Locale, [string, string]> = {
  en: [
    "Backend systems and products, AI agents and",
    "automation, services shipped to production.",
  ],
  cs: ["Backendové systémy a produkty, AI agenti", "a automatizace, služby nasazené do produkce."],
};

const ogSvg = (locale: Locale) => {
  const f = getFonts();
  const t = useT(locale);
  const [first, ...rest] = siteConfig.name.split(" ");
  const status = t(availabilityText[siteConfig.availability.status].key);
  const statusWidth = 44 + f.mono[0]!.getAdvanceWidth(status, 13) + status.length * 0.02 * 13;
  const [lede1, lede2] = ogLede[locale];
  const numbers = heroReadouts(locale)
    .slice(0, 3)
    .map((r, i) => {
      const x = 64 + i * 236;
      const label = `${r.label} · ${r.source}`.toUpperCase();
      const [l1, l2] = label.length > 28 ? splitLabel(label) : [label, ""];
      return `<g>
    ${text(f.display, r.value, x, 532, 50, "#10141A", -0.04)}
    ${text(f.mono, l1, x, 560, 12, "#4D5662", 0.04)}
    ${l2 ? text(f.mono, l2, x, 577, 12, "#4D5662", 0.04) : ""}
  </g>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#EEF1F4"/>
  ${cube(64, 42, 1.6)}
  <rect x="122" y="44" width="${statusWidth.toFixed(0)}" height="36" rx="18" fill="#FFFFFF" stroke="#D4DAE1"/>
  <circle cx="142" cy="62" r="4" fill="#59C990"/>
  ${text(f.mono, status, 156, 67, 13, "#1C7A4A", 0.02)}
  ${text(f.mono, siteCopy[locale].eyebrow, 64, 132, 15, "#4D5662", 0.06)}
  ${text(f.display, first ?? "", 58, 238, 112, "#10141A", -0.045)}
  ${text(f.display, rest.join(" "), 58, 336, 112, "#10141A", -0.045)}
  ${text(f.body, lede1, 64, 390, 25, "#10141A")}
  ${text(f.body, lede2, 64, 423, 25, "#10141A")}
  <rect x="64" y="466" width="690" height="1" fill="#10141A"/>
  ${numbers}
</svg>`;
};

/** Break a long mono label after the "·" nearest the middle. */
function splitLabel(label: string): [string, string] {
  const i = label.lastIndexOf(" · ");
  return i > 0 ? [label.slice(0, i), label.slice(i + 3).trim()] : [label, ""];
}

/** Copy a Node Buffer into a standalone ArrayBuffer-backed Uint8Array (a valid Response body). */
function toBody(buf: Buffer): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(new ArrayBuffer(buf.byteLength));
  bytes.set(buf);
  return bytes;
}

export async function renderOgImage(locale: Locale = "en"): Promise<Uint8Array<ArrayBuffer>> {
  const layers: OverlayOptions[] = [];
  try {
    // Brand book: the green-sweater portrait is the one for social cards.
    const portrait = await sharp(join(root, "src/assets/portraits/cutout-green.webp"))
      .resize({ height: 574 })
      .png()
      .toBuffer({ resolveWithObject: true });
    layers.push({ input: portrait.data, left: 1200 - portrait.info.width - 8, top: 56 });
  } catch {
    /* portrait missing — text-only card */
  }
  return toBody(
    await sharp(Buffer.from(ogSvg(locale)))
      .composite(layers)
      .png()
      .toBuffer(),
  );
}

export async function renderTouchIcon(size = 180): Promise<Uint8Array<ArrayBuffer>> {
  return toBody(
    await sharp(Buffer.from(iconSvg(size)))
      .png()
      .toBuffer(),
  );
}
