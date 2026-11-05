/**
 * Build-time generated brand images (Open Graph card and touch icon) in the site's
 * Terracotta sunset palette: warm paper ground with the hero's sunset glow, ink type,
 * a terracotta-saffron-raspberry rule, the terracotta cube mark.
 *
 * Text is set in the site's own typefaces — Newsreader for the name and numbers,
 * Schibsted Grotesk for the lede, IBM Plex Mono for labels — converted to vector paths
 * with opentype.js, so the card looks the same on every build machine. Czech diacritics
 * come from the latin-ext files; glyphs outside both subsets (≈, →) fall back to a
 * system font in their cell. The turtleneck studio portrait (the homepage photo) sits on
 * the right in a rounded frame with a soft shadow; no background-removed cut-out, so no
 * fringe along the hair. One card per language (/images/og-default.png,
 * /images/og-default-cs.png).
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
    display: face("@fontsource/newsreader", "newsreader", 400),
    body: face("@fontsource/schibsted-grotesk", "schibsted-grotesk", 500),
    mono: face("@fontsource/ibm-plex-mono", "ibm-plex-mono", 500),
    monoBold: face("@fontsource/ibm-plex-mono", "ibm-plex-mono", 600),
  });

/** Light-theme tokens from src/styles/global.css (the cards are always light). */
const C = {
  bg: "#fbf3ea",
  glow: "#ffd8b6",
  glowSoft: "#ffe8cc",
  surface: "#fffaf5",
  line: "#e6d5c4",
  ink: "#23140f",
  muted: "#634a40",
  accent: "#ad3c1c",
  accent2: "#d9771f",
  accent3: "#b8365f",
  okInk: "#2a7144",
  okDot: "#5fa893",
  cube: ["#E06B3F", "#C15C36", "#9D4B2C"] as const,
};

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
 * Glyphs missing from the latin subset are drawn as system-font <text> at
 * `fallbackWeight` (400 next to the w400 serif numbers, 700 next to bold faces).
 */
function text(
  fontFace: Face,
  value: string,
  x: number,
  y: number,
  size: number,
  fill: string,
  letterSpacing = 0,
  fallbackWeight = 700,
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
        `<text x="${(cursor + cell / 2).toFixed(1)}" y="${y}" font-family="Menlo, DejaVu Sans Mono, monospace" font-size="${size}" font-weight="${fallbackWeight}" fill="${fill}" text-anchor="middle">${escape(ch)}</text>`,
      );
      cursor += cell + track;
    }
  }
  return `<g fill="${fill}">${glyphs.join("")}</g>${fallbacks.join("")}`;
}

/** The 3-face isometric cube mark from the approved artboard, `scale` × its 26px box. */
const cube = (x: number, y: number, scale: number) =>
  `<g transform="translate(${x} ${y}) scale(${scale})">
    <path d="M13 2 23 7.5 13 13 3 7.5Z" fill="${C.cube[0]}"/>
    <path d="M3 7.5 13 13v11L3 18.5Z" fill="${C.cube[1]}"/>
    <path d="M23 7.5 13 13v11l10-5.5Z" fill="${C.cube[2]}"/>
  </g>`;

/** Touch icon: the cube on the warm paper ground. */
export const iconSvg = (size: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <rect width="64" height="64" fill="${C.bg}"/>
  ${cube(9, 8, 1.8)}
</svg>`;

/** The card's lede, in two lines (the hero lede, shortened to fit). */
export const ogLede: Record<Locale, [string, string]> = {
  en: [
    "Kotlin and Java services, Angular and React apps,",
    "built end to end and run on GCP, AWS and K8s.",
  ],
  cs: [
    "Služby v Kotlinu a Javě, aplikace v Angularu a Reactu:",
    "od návrhu po provoz na GCP, AWS a K8s.",
  ],
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
      // Caption, then the source on its own line, in sentence case like the site.
      const lines = [...wrapWords(r.label, LABEL_CHARS), r.source];
      return `<g>
    ${text(f.display, r.value, x, 532, 54, C.ink, -0.02, 400)}
    ${lines.map((line, j) => text(f.mono, line, x, 560 + j * 17, 12, j === lines.length - 1 ? C.muted : C.ink, 0.02)).join("")}
  </g>`;
    })
    .join("");
  const { x, y, w, h, r } = PHOTO;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="glow" cx="0.9" cy="0" r="0.75">
      <stop offset="0" stop-color="${C.glow}"/>
      <stop offset="1" stop-color="${C.glow}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowSoft" cx="0" cy="0" r="0.6">
      <stop offset="0" stop-color="${C.glowSoft}"/>
      <stop offset="1" stop-color="${C.glowSoft}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="${C.accent}"/>
      <stop offset="0.55" stop-color="${C.accent2}"/>
      <stop offset="1" stop-color="${C.accent3}"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14"/>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="${C.bg}"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#glowSoft)"/>
  ${cube(64, 42, 1.6)}
  <rect x="122" y="44" width="${statusWidth.toFixed(0)}" height="36" rx="18" fill="${C.surface}" stroke="${C.line}"/>
  <circle cx="142" cy="62" r="4" fill="${C.okDot}"/>
  ${text(f.mono, status, 156, 67, 13, C.okInk, 0.02)}
  ${text(f.mono, siteCopy[locale].role, 64, 132, 15, C.muted, 0.06)}
  ${text(f.display, first ?? "", 58, 238, 112, C.ink, -0.032)}
  ${text(f.display, rest.join(" "), 58, 336, 112, C.ink, -0.032)}
  ${text(f.body, lede1, 64, 390, 25, C.ink)}
  ${text(f.body, lede2, 64, 423, 25, C.ink)}
  <rect x="64" y="465" width="690" height="2" fill="url(#rule)"/>
  ${numbers}
  <rect x="${x}" y="${y + 14}" width="${w}" height="${h}" rx="${r}" fill="${C.accent}" opacity="0.22" filter="url(#shadow)"/>
  <rect x="${x - 1}" y="${y - 1}" width="${w + 2}" height="${h + 2}" rx="${r + 1}" fill="${C.line}"/>
</svg>`;
};

/** The portrait frame on the right (4:5, rounded like the site's cards). */
const PHOTO = { x: 776, y: 90, w: 360, h: 450, r: 16 };

/** Mono characters that fit a 236px proof column at 12px (the rest wraps). */
const LABEL_CHARS = 27;

/** Wrap a caption at spaces into lines of at most `max` characters. */
function wrapWords(label: string, max: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of label.split(" ")) {
    if (line && line.length + 1 + word.length > max) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  return line ? [...lines, line] : lines;
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
    // The homepage portrait, cropped to the frame from the top and given round corners.
    const { x, y, w, h, r } = PHOTO;
    const corners = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" fill="#fff"/></svg>`,
    );
    const portrait = await sharp(join(root, "src/assets/portraits/turtleneck.jpg"))
      .resize({ width: w, height: h, fit: "cover", position: "top" })
      .composite([{ input: corners, blend: "dest-in" }])
      .png()
      .toBuffer();
    layers.push({ input: portrait, left: x, top: y });
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
